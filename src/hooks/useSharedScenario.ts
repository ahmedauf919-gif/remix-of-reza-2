import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectInputs, DEFAULT_INPUTS } from "@/lib/windModel";

/**
 * Loads the singleton shared scenario row from Lovable Cloud and keeps it in sync.
 * - Initial load merges saved JSON over DEFAULT_INPUTS so new fields stay defined.
 * - Every state change is debounced and upserted to row id=1.
 * - Realtime updates from other clients are merged in unless they echo our own write.
 */
export function useSharedScenario() {
  const [inputs, setInputs] = useState<ProjectInputs>(DEFAULT_INPUTS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const writeTimer = useRef<number | null>(null);
  const lastWrittenJson = useRef<string>("");

  // Initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("shared_scenario")
        .select("inputs")
        .eq("id", 1)
        .maybeSingle();
      if (cancelled) return;
      if (!error && data?.inputs) {
        setInputs({ ...DEFAULT_INPUTS, ...(data.inputs as Partial<ProjectInputs>) });
        lastWrittenJson.current = JSON.stringify(data.inputs);
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  // Realtime sync from other browsers
  useEffect(() => {
    const ch = supabase
      .channel("shared_scenario_sync")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "shared_scenario", filter: "id=eq.1" },
        (payload: any) => {
          const next = payload.new?.inputs;
          if (!next) return;
          const j = JSON.stringify(next);
          if (j === lastWrittenJson.current) return; // own write echo
          setInputs({ ...DEFAULT_INPUTS, ...(next as Partial<ProjectInputs>) });
          lastWrittenJson.current = j;
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Debounced autosave
  useEffect(() => {
    if (!loaded) return;
    if (writeTimer.current) window.clearTimeout(writeTimer.current);
    writeTimer.current = window.setTimeout(async () => {
      setSaving(true);
      const j = JSON.stringify(inputs);
      lastWrittenJson.current = j;
      await supabase.from("shared_scenario")
        .upsert({ id: 1, inputs: inputs as any, updated_at: new Date().toISOString() });
      setSaving(false);
    }, 500);
    return () => { if (writeTimer.current) window.clearTimeout(writeTimer.current); };
  }, [inputs, loaded]);

  return { inputs, setInputs, loaded, saving };
}
