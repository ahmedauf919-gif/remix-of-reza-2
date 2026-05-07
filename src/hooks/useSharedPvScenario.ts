import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PvInputs, DEFAULT_PV_INPUTS } from "@/lib/pvModel";

export function useSharedPvScenario(scenarioId: number = 1) {
  const [inputs, setInputs] = useState<PvInputs>(DEFAULT_PV_INPUTS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const writeTimer = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    (async () => {
      const { data } = await supabase
        .from("shared_pv_scenario" as any)
        .select("inputs")
        .eq("id", scenarioId)
        .maybeSingle();
      if (cancelled) return;
      const saved = (data as any)?.inputs;
      if (saved && Object.keys(saved).length > 0) {
        setInputs({ ...DEFAULT_PV_INPUTS, ...(saved as Partial<PvInputs>) });
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
      await (supabase.from("shared_pv_scenario" as any) as any)
        .upsert({ id: scenarioId, inputs: inputs as any, updated_at: new Date().toISOString() });
      setSaving(false);
    }, 500);
    return () => { if (writeTimer.current) window.clearTimeout(writeTimer.current); };
  }, [inputs, loaded, scenarioId]);

  return { inputs, setInputs, loaded, saving };
}
