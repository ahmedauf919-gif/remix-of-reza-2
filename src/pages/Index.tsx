import { useMemo, useDeferredValue, lazy, Suspense } from "react";
import { FileText, RotateCcw, Check, UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_INPUTS, runModel } from "@/lib/windModel";
import { generateInvestmentMemo } from "@/lib/investmentMemo";
import { InputsForm } from "@/components/wind/InputsForm";
import { SummaryView } from "@/components/wind/SummaryView";
import { useSharedScenario } from "@/hooks/useSharedScenario";

// Lazy-load heavy tabs so first paint + Inputs typing stay snappy
const OutputsView = lazy(() => import("@/components/wind/SchedulesView").then(m => ({ default: m.OutputsView })));
const StatementsView = lazy(() => import("@/components/wind/SchedulesView").then(m => ({ default: m.StatementsView })));
const CashflowChart = lazy(() => import("@/components/wind/Charts").then(m => ({ default: m.CashflowChart })));
const DSCRChart = lazy(() => import("@/components/wind/Charts").then(m => ({ default: m.DSCRChart })));
const DebtBalanceChart = lazy(() => import("@/components/wind/Charts").then(m => ({ default: m.DebtBalanceChart })));
const LcoeWaterfallChart = lazy(() => import("@/components/wind/LcoeWaterfallChart").then(m => ({ default: m.LcoeWaterfallChart })));
const SensitivityView = lazy(() => import("@/components/wind/SensitivityView").then(m => ({ default: m.SensitivityView })));
const RecommendationsView = lazy(() => import("@/components/wind/RecommendationsView").then(m => ({ default: m.RecommendationsView })));

const TabFallback = () => (
  <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
    <Loader2 className="h-4 w-4 mr-2 animate-spin"/> Loading…
  </div>
);

const Index = () => {
  const { inputs, setInputs, loaded, saving } = useSharedScenario();
  // Defer the heavy model recompute so input typing stays smooth.
  // React will run the model on the latest inputs once the user pauses.
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

  const reset = () => { setInputs(DEFAULT_INPUTS); toast.info("Reset to defaults"); };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-[var(--gradient-hero)] text-primary-foreground">
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-black">REZA Project Finance Model</h1>
            <p className="text-xs opacity-80">{inputs.projectName} · {inputs.country}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs opacity-90">
              {isStale ? <Loader2 className="h-4 w-4 animate-spin"/> : saving ? <UploadCloud className="h-4 w-4 animate-pulse"/> : <Check className="h-4 w-4"/>}
              {!loaded ? "Loading…" : isStale ? "Recalculating…" : saving ? "Saving…" : "All changes saved"}
            </div>
            <Button variant="secondary" onClick={reset} className="gap-2"><RotateCcw className="h-4 w-4"/>Reset</Button>
            <Button onClick={exportMemo} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"><FileText className="h-4 w-4"/>Export Investment Memo</Button>
          </div>
        </div>
      </header>

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
            <Suspense fallback={<TabFallback/>}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <DSCRChart m={model}/>
                <DebtBalanceChart m={model}/>
              </div>
            </Suspense>
          </TabsContent>

          <TabsContent value="inputs" className="m-0 pt-6">
            <InputsForm inputs={inputs} onChange={setInputs} />
          </TabsContent>

          <TabsContent value="outputs" className="m-0 pt-6">
            <Suspense fallback={<TabFallback/>}><OutputsView m={model}/></Suspense>
          </TabsContent>

          <TabsContent value="statements" className="m-0 pt-6">
            <Suspense fallback={<TabFallback/>}><StatementsView m={model}/></Suspense>
          </TabsContent>

          <TabsContent value="charts" className="m-0 pt-6 space-y-6">
            <Suspense fallback={<TabFallback/>}>
              <CashflowChart m={model}/>
              <LcoeWaterfallChart m={model}/>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <DSCRChart m={model}/>
                <DebtBalanceChart m={model}/>
              </div>
            </Suspense>
          </TabsContent>

          <TabsContent value="sensitivity" className="m-0 pt-6">
            <Suspense fallback={<TabFallback/>}><SensitivityView inputs={deferredInputs}/></Suspense>
          </TabsContent>

          <TabsContent value="recommendations" className="m-0 pt-6">
            <Suspense fallback={<TabFallback/>}><RecommendationsView m={model}/></Suspense>
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
