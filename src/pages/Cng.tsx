import { useMemo, useDeferredValue, lazy, Suspense, useState } from "react";
import { RotateCcw, Save, FileSpreadsheet, Loader2, BookMarked } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_CNG_INPUTS, runCngModel } from "@/lib/cngModel";
import { exportCngExcel } from "@/lib/excelExporters";
import { CngInputsForm } from "@/components/cng/CngInputsForm";
import { CngSummary } from "@/components/cng/CngSummary";
import { useSharedCngScenario } from "@/hooks/useSharedCngScenario";
import { ModelPageHeader, headerBtnGhost, headerBtnGold } from "@/components/ModelPageHeader";
import { SaveToDirectoryDialog } from "@/components/directory/SaveToDirectoryDialog";

const CngCharts          = lazy(() => import("@/components/cng/CngCharts").then(m => ({ default: m.CngCharts })));
const CngSensitivity     = lazy(() => import("@/components/cng/CngSensitivity").then(m => ({ default: m.CngSensitivity })));
const CngOutput          = lazy(() => import("@/components/cng/CngOutput").then(m => ({ default: m.CngOutput })));
const CngRecommendations = lazy(() => import("@/components/cng/CngRecommendations").then(m => ({ default: m.CngRecommendations })));

const Fallback = () => (
  <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading…
  </div>
);

export default function CngPage() {
  const { inputs, setInputs, loaded, saving } = useSharedCngScenario(1);
  const [dirDialogOpen, setDirDialogOpen] = useState(false);
  const deferred = useDeferredValue(inputs);
  const model = useMemo(() => runCngModel(deferred), [deferred]);
  const isStale = inputs !== deferred;

  const defaultKey = "cng_default_inputs_1";
  const reset = () => {
    try {
      const stored = localStorage.getItem(defaultKey);
      const base = stored ? { ...DEFAULT_CNG_INPUTS, ...JSON.parse(stored) } : DEFAULT_CNG_INPUTS;
      setInputs(base);
      toast.info(stored ? "Reset to your saved defaults" : "Reset to factory defaults");
    } catch {
      setInputs(DEFAULT_CNG_INPUTS);
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
      await exportCngExcel(model);
      toast.success("Excel model downloaded", { id: "xlsx" });
    } catch (e) {
      console.error(e);
      toast.error("Failed to export Excel", { id: "xlsx" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ModelPageHeader
        title="Mobile CNG Project Finance Model"
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
        modelId="cng"
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
          <TabsContent value="summary" className="m-0 pt-6"><CngSummary m={model} /></TabsContent>
          <TabsContent value="inputs" className="m-0 pt-6"><CngInputsForm inputs={inputs} onChange={setInputs} /></TabsContent>
          <TabsContent value="output" className="m-0 pt-6"><Suspense fallback={<Fallback />}><CngOutput m={model} /></Suspense></TabsContent>
          <TabsContent value="charts" className="m-0 pt-6"><Suspense fallback={<Fallback />}><CngCharts m={model} /></Suspense></TabsContent>
          <TabsContent value="sensitivity" className="m-0 pt-6"><Suspense fallback={<Fallback />}><CngSensitivity inputs={deferred} /></Suspense></TabsContent>
          <TabsContent value="recommendations" className="m-0 pt-6"><Suspense fallback={<Fallback />}><CngRecommendations m={model} /></Suspense></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
