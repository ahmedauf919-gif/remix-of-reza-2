import { useMemo, useDeferredValue, useState, useCallback } from "react";
import { RotateCcw, Save, Loader2, BookMarked } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_LNG_INPUTS, runLngModel, LngInputs } from "@/lib/lngModel";
import { LngInputsForm } from "@/components/lng/LngInputsForm";
import { LngSummary } from "@/components/lng/LngSummary";
import { LngOutput } from "@/components/lng/LngOutput";
import { LngCharts } from "@/components/lng/LngCharts";
import { LngRecommendations } from "@/components/lng/LngRecommendations";
import { ModelPageHeader, headerBtnGhost } from "@/components/ModelPageHeader";
import { takePendingLoad } from "@/lib/directoryStore";
import { SaveToDirectoryDialog } from "@/components/directory/SaveToDirectoryDialog";

const STORAGE_KEY = "lng_tz_inputs_v1";

function loadInputs(): LngInputs {
  // Check directory pending load first
  const pending = takePendingLoad("lng");
  if (pending) return { ...DEFAULT_LNG_INPUTS, ...(pending as Partial<LngInputs>) };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_LNG_INPUTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_LNG_INPUTS;
}

const Fallback = () => (
  <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading…
  </div>
);

export default function LngPage() {
  const [inputs, setInputsRaw] = useState<LngInputs>(loadInputs);
  const [saving, setSaving] = useState(false);
  const [dirDialogOpen, setDirDialogOpen] = useState(false);

  const setInputs = useCallback((next: LngInputs | ((prev: LngInputs) => LngInputs)) => {
    setInputsRaw(prev => {
      const value = typeof next === "function" ? next(prev) : next;
      setSaving(true);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch { /* ignore */ }
      setTimeout(() => setSaving(false), 600);
      return value;
    });
  }, []);

  const deferred = useDeferredValue(inputs);
  const model = useMemo(() => runLngModel(deferred), [deferred]);
  const isStale = inputs !== deferred;

  const reset = () => {
    const stored = localStorage.getItem("lng_tz_default_v1");
    const base = stored ? { ...DEFAULT_LNG_INPUTS, ...JSON.parse(stored) } : DEFAULT_LNG_INPUTS;
    setInputs(base);
    toast.info(stored ? "Reset to your saved defaults" : "Reset to factory defaults");
  };

  const saveAsDefault = () => {
    try {
      localStorage.setItem("lng_tz_default_v1", JSON.stringify(inputs));
      toast.success("Current assumptions saved as your default");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save defaults");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ModelPageHeader
        title="Tanzania Micro LNG — Project Finance Model"
        subtitle={inputs.projectName}
        isStale={isStale}
        saving={saving}
        loaded={true}
        actions={
          <>
            <button onClick={() => setDirDialogOpen(true)} className={headerBtnGhost}>
              <BookMarked className="h-3.5 w-3.5" /> Save to Directory
            </button>
            <button onClick={saveAsDefault} className={headerBtnGhost}>
              <Save className="h-3.5 w-3.5" /> Save default
            </button>
            <button onClick={reset} className={headerBtnGhost}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </>
        }
      />

      <SaveToDirectoryDialog
        open={dirDialogOpen}
        onClose={() => setDirDialogOpen(false)}
        modelId="lng"
        inputs={inputs as unknown as Record<string, unknown>}
        defaultName={inputs.projectName}
      />

      <main className="container space-y-6 py-8">
        <Tabs defaultValue="summary">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="m-0 pt-6">
            <LngSummary m={model} />
          </TabsContent>
          <TabsContent value="inputs" className="m-0 pt-6">
            <LngInputsForm inputs={inputs} onChange={setInputs} />
          </TabsContent>
          <TabsContent value="output" className="m-0 pt-6">
            <LngOutput m={model} />
          </TabsContent>
          <TabsContent value="charts" className="m-0 pt-6">
            <LngCharts m={model} />
          </TabsContent>
          <TabsContent value="recommendations" className="m-0 pt-6">
            <LngRecommendations m={model} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
