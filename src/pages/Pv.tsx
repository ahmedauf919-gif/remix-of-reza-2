import { useMemo, useDeferredValue, lazy, Suspense, useState } from "react";
import { RotateCcw, Save, FileSpreadsheet, Loader2, BookMarked } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_PV_INPUTS, runPvModel } from "@/lib/pvModel";
import { exportPvExcel } from "@/lib/excelExporters";
import { PvInputsForm } from "@/components/pv/PvInputsForm";
import { PvSummary } from "@/components/pv/PvSummary";
import { useSharedPvScenario } from "@/hooks/useSharedPvScenario";
import { ModelPageHeader, headerBtnGhost, headerBtnGold } from "@/components/ModelPageHeader";
import { SaveToDirectoryDialog } from "@/components/directory/SaveToDirectoryDialog";

const PvCharts          = lazy(() => import("@/components/pv/PvCharts").then(m => ({ default: m.PvCharts })));
const PvSensitivity     = lazy(() => import("@/components/pv/PvSensitivity").then(m => ({ default: m.PvSensitivity })));
const PvOutput          = lazy(() => import("@/components/pv/PvOutput").then(m => ({ default: m.PvOutput })));
const PvRecommendations = lazy(() => import("@/components/pv/PvRecommendations").then(m => ({ default: m.PvRecommendations })));

const Fallback = () => (
  <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading…
  </div>
);

export default function PvPage() {
  const { inputs, setInputs, loaded, saving } = useSharedPvScenario(1);
  const [dirDialogOpen, setDirDialogOpen] = useState(false);
  const deferred = useDeferredValue(inputs);
  const model = useMemo(() => runPvModel(deferred), [deferred]);
  const isStale = inputs !== deferred;

  const defaultKey = "pv_default_inputs_1";
  const reset = () => {
    try {
      const stored = localStorage.getItem(defaultKey);
      const base = stored ? { ...DEFAULT_PV_INPUTS, ...JSON.parse(stored) } : DEFAULT_PV_INPUTS;
      setInputs(base);
      toast.info(stored ? "Reset to your saved defaults" : "Reset to factory defaults");
    } catch {
      setInputs(DEFAULT_PV_INPUTS);
      toast.info("Reset to factory defaults");
    }
  };
  const saveAsDefault = () => {
    try {
      localStorage.setItem(defaultKey, JSON.stringify(inputs));
      toast.success("Current assumptions saved as your default");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save defaults");
    }
  };
  const exportExcel = async () => {
    try {
      toast.loading("Building Excel model…", { id: "xlsx" });
      await exportPvExcel(model);
      toast.success("Excel model downloaded", { id: "xlsx" });
    } catch (e) {
      console.error(e);
      toast.error("Failed to export Excel", { id: "xlsx" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ModelPageHeader
        title="PV (Solar) Project Finance Model"
        subtitle={inputs.projectName}
        isStale={isStale}
        saving={saving}
        loaded={loaded}
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
            <button onClick={exportExcel} className={headerBtnGold}>
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel Model
            </button>
          </>
        }
      />

      <SaveToDirectoryDialog
        open={dirDialogOpen}
        onClose={() => setDirDialogOpen(false)}
        modelId="pv"
        inputs={inputs as unknown as Record<string, unknown>}
        defaultName={(inputs as any).projectName}
      />

      <main className="container space-y-6 py-8">
        <Tabs defaultValue="summary">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="m-0 pt-6"><PvSummary m={model} /></TabsContent>
          <TabsContent value="inputs" className="m-0 pt-6"><PvInputsForm inputs={inputs} onChange={setInputs} /></TabsContent>
          <TabsContent value="output" className="m-0 pt-6"><Suspense fallback={<Fallback />}><PvOutput m={model} /></Suspense></TabsContent>
          <TabsContent value="charts" className="m-0 pt-6"><Suspense fallback={<Fallback />}><PvCharts m={model} /></Suspense></TabsContent>
          <TabsContent value="sensitivity" className="m-0 pt-6"><Suspense fallback={<Fallback />}><PvSensitivity inputs={deferred} /></Suspense></TabsContent>
          <TabsContent value="recommendations" className="m-0 pt-6"><Suspense fallback={<Fallback />}><PvRecommendations m={model} /></Suspense></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
