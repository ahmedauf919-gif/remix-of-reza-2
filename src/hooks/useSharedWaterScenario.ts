import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WaterInputs, DEFAULT_WATER_INPUTS } from "@/lib/waterModel";
import { takePendingLoad } from "@/lib/directoryStore";

export function useSharedWaterScenario(scenarioId: number = 1) {
  const [inputs, setInputs] = useState<WaterInputs>(DEFAULT_WATER_INPUTS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const writeTimer = useRef<number | null>(null);
  const lastWrittenJson = useRef<string>("");

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    const pending = takePendingLoad("water");
    if (pending) {
      setInputs({ ...DEFAULT_WATER_INPUTS, ...(pending as Partial<WaterInputs>) });
      lastWrittenJson.current = JSON.stringify(pending);
      setLoaded(true);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("shared_water_scenario" as any)
        .select("inputs")
        .eq("id", scenarioId)
        .maybeSingle();
      if (cancelled) return;
      const saved = (data as any)?.inputs;
      if (saved && Object.keys(saved).length > 0) {
        setInputs({ ...DEFAULT_WATER_INPUTS, ...(saved as Partial<WaterInputs>) });
        lastWrittenJson.current = JSON.stringify(saved);
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [scenarioId]);

  useEffect(() => {
    if (!loaded) return;
    if (writeTimer.current) window.clearTimeout(writeTimer.current);
    writeTimer.current = window.setTimeout(async () => {
      setSaving(true);
      const j = JSON.stringify(inputs);
      lastWrittenJson.current = j;
      await (supabase.from("shared_water_scenario" as any) as any)
        .upsert({ id: scenarioId, inputs: inputs as any, updated_at: new Date().toISOString() });
      setSaving(false);
    }, 500);
    return () => { if (writeTimer.current) window.clearTimeout(writeTimer.current); };
  }, [inputs, loaded, scenarioId]);

  return { inputs, setInputs, loaded, saving };
}
