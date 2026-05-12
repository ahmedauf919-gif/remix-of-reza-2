import { useMemo, useDeferredValue, lazy, Suspense, useState } from "react";
import { FileText, RotateCcw, Save, FileSpreadsheet, Loader2, BookMarked } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_INPUTS, runModel } from "@/lib/windModel";
import { generateInvestmentMemo } from "@/lib/investmentMemo";
import { exportWindExcel } from "@/lib/excelExporters";
import { InputsForm } from "@/components/wind/InputsForm";
import { SummaryView } from "@/components/wind/SummaryView";
import { useSharedScenario } from "@/hooks/useSharedScenario";
import { ModelPageHeader, headerBtnGhost, headerBtnGold } from "@/components/ModelPageHeader";
import { SaveToDirectoryDialog } from "@/components/directory/SaveToDirectoryDialog";

const OutputsView     = lazy(() => import("@/components/wind/SchedulesView").then(m => ({ default: m.OutputsView })));
const StatementsView  = lazy(() => import("@/components/wind/SchedulesView").then(m => ({ default: m.StatementsView })));
const CashflowChart   = lazy(() => import("@/components/wind/Charts").then(m => ({ default: m.CashflowChart })));
const DSCRChart       = lazy(() => import("@/components/wind/Charts").then(m => ({ default: m.DSCRChart })));
const DebtBalanceChart = lazy(() => import("@/components/wind/Charts").then(m => ({ default: m.DebtBalanceChart })));
const LcoeWaterfallChart = lazy(() => import("@/components/wind/LcoeWaterfallChart").then(m => ({ default: m.LcoeWaterfallChart })));
const SensitivityView = lazy(() => import("@/components/wind/SensitivityView").then(m => ({ default: m.SensitivityView })));
const RecommendationsView = lazy(() => import("@/components/wind/RecommendationsView").then(m => ({ default: m.RecommendationsView })));

const TabFallback = () => (
  <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading…
  </div>
);

const Index = ({ scenarioId = 1 }: { scenarioId?: number }) => {
  const { inputs, setInputs, loaded, saving } = useSharedScenario(scenarioId);
  const [dirDialogOpen, setDirDialogOpen] = useState(false);
  const deferredInputs = useDeferredValue(inputs);
  const model = useMemo(() => runModel(deferredInputs), [deferredInputs]);
  const isStale = inputs !== deferredInputs;

  const exportMemo = async () => {
    try {
      toast.loading("Generating investment memo…", { id: "memo" });
      await generateInvestmentMemo(inputs, model);
      toast.success("Investment memo downloaded", { id: "memo" });
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate memo", { id: "memo" });
    }
  };

  const defaultKey = `reza_default_inputs_${scenarioId}`;
  const reset = () => {
    try {
      const stored = localStorage.getItem(defaultKey);
      const base = stored ? { ...DEFAULT_INPUTS, ...JSON.parse(stored) } : DEFAULT_INPUTS;
      setInputs(base);
      toast.info(stored ? "Reset to your saved defaults" : "Reset to factory defaults");
    } catch {
      setInputs(DEFAULT_INPUTS);
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

  return (
    <div className="min-h-screen bg-background">
      <ModelPageHeader
        title={scenarioId === 1 ? "REZA Wind Model — Scenario A" : "REZA Solar Model — Scenario B"}
        subtitle={scenarioId === 2 ? `Solar Energy · ${inputs.projectName} · ${inputs.country}` : `${inputs.projectName} · ${inputs.country}`}
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
            <button onClick={exportMemo} className={headerBtnGold}>
              <FileText className="h-3.5 w-3.5" /> Investment Memo
            </button>
            <button
              onClick={async () => {
                try {
                  toast.loading("Building Excel model…", { id: "xlsx" });
                  await exportWindExcel(model);
                  toast.success("Excel model downloaded", { id: "xlsx" });
                } catch (e) {
                  console.error(e);
                  toast.error("Failed to export Excel", { id: "xlsx" });
                }
              }}
              className={headerBtnGold}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel Model
            </button>
          </>
        }
      />

      <SaveToDirectoryDialog
        open={dirDialogOpen}
        onClose={() => setDirDialogOpen(false)}
        modelId={scenarioId === 1 ? "wind-a" : "wind-b"}
        inputs={inputs as unknown as Record<string, unknown>}
        defaultName={(inputs as any).projectName}
      />

      <main className="container space-y-6 py-8">
        <Tabs defaultValue="summary">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="outputs">Outputs</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="m-0 pt-6 space-y-6">
            <SummaryView m={model} />
            <Suspense fallback={<TabFallback />}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <DSCRChart m={model} />
                <DebtBalanceChart m={model} />
              </div>
            </Suspense>
          </TabsContent>

          <TabsContent value="inputs" className="m-0 pt-6">
            <InputsForm inputs={inputs} onChange={setInputs} />
          </TabsContent>

          <TabsContent value="outputs" className="m-0 pt-6">
            <Suspense fallback={<TabFallback />}><OutputsView m={model} /></Suspense>
          </TabsContent>

          <TabsContent value="statements" className="m-0 pt-6">
            <Suspense fallback={<TabFallback />}><StatementsView m={model} /></Suspense>
          </TabsContent>

          <TabsContent value="charts" className="m-0 pt-6 space-y-6">
            <Suspense fallback={<TabFallback />}>
              <CashflowChart m={model} />
              <LcoeWaterfallChart m={model} />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <DSCRChart m={model} />
                <DebtBalanceChart m={model} />
              </div>
            </Suspense>
          </TabsContent>

          <TabsContent value="sensitivity" className="m-0 pt-6">
            <Suspense fallback={<TabFallback />}><SensitivityView inputs={deferredInputs} /></Suspense>
          </TabsContent>

          <TabsContent value="recommendations" className="m-0 pt-6">
            <Suspense fallback={<TabFallback />}><RecommendationsView m={model} /></Suspense>
          </TabsContent>
        </Tabs>

        <footer className="pb-8 pt-4 text-center text-xs text-muted-foreground">
          {model.iterations} solver iterations · {model.converged ? "converged ✓" : "did not converge ⚠"}
        </footer>
      </main>
    </div>
  );
};

export default Index;
