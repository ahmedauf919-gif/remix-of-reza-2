import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectInputs, DEFAULT_INPUTS } from "@/lib/windModel";

/**
 * Loads the singleton shared scenario row from Lovable Cloud and keeps it in sync.
 * - Initial load merges saved JSON over DEFAULT_INPUTS so new fields stay defined.
 * - Every state change is debounced and upserted to row id=1.
 * - Realtime updates from other clients are merged in unless they echo our own write.
 */
export function useSharedScenario(scenarioId: number = 1) {
  const [inputs, setInputs] = useState<ProjectInputs>(DEFAULT_INPUTS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const writeTimer = useRef<number | null>(null);
  const lastWrittenJson = useRef<string>("");

  // Initial load
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    (async () => {
      const { data, error } = await supabase
        .from("shared_scenario")
        .select("inputs")
        .eq("id", scenarioId)
        .maybeSingle();
      if (cancelled) return;
      if (!error && data?.inputs) {
        setInputs({ ...DEFAULT_INPUTS, ...(data.inputs as Partial<ProjectInputs>) });
        lastWrittenJson.current = JSON.stringify(data.inputs);
      } else {
        setInputs(DEFAULT_INPUTS);
        lastWrittenJson.current = "";
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [scenarioId]);

  // Realtime sync from other browsers
  useEffect(() => {
    const ch = supabase
      .channel(`shared_scenario_sync_${scenarioId}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "shared_scenario", filter: `id=eq.${scenarioId}` },
        (payload: any) => {
          // Hard guard: ignore any payload not matching this scenario id
          const incomingId = payload.new?.id ?? payload.old?.id;
          if (incomingId !== scenarioId) return;
          const next = payload.new?.inputs;
          if (!next) return;
          const j = JSON.stringify(next);
          if (j === lastWrittenJson.current) return; // own write echo
          setInputs({ ...DEFAULT_INPUTS, ...(next as Partial<ProjectInputs>) });
          lastWrittenJson.current = j;
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [scenarioId]);

  // Debounced autosave
  useEffect(() => {
    if (!loaded) return;
    if (writeTimer.current) window.clearTimeout(writeTimer.current);
    writeTimer.current = window.setTimeout(async () => {
      setSaving(true);
      const j = JSON.stringify(inputs);
      lastWrittenJson.current = j;
      await supabase.from("shared_scenario")
        .upsert({ id: scenarioId, inputs: inputs as any, updated_at: new Date().toISOString() });
      setSaving(false);
    }, 500);
    return () => { if (writeTimer.current) window.clearTimeout(writeTimer.current); };
  }, [inputs, loaded, scenarioId]);

  return { inputs, setInputs, loaded, saving };
}
