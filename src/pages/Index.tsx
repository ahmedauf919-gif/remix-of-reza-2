import { useMemo } from "react";
import { FileText, RotateCcw, CloudCheck, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_INPUTS, runModel } from "@/lib/windModel";
import { generateInvestmentMemo } from "@/lib/investmentMemo";
import { InputsForm } from "@/components/wind/InputsForm";
import { SummaryView } from "@/components/wind/SummaryView";
import { OutputsView, StatementsView } from "@/components/wind/SchedulesView";
import { CashflowChart, DSCRChart, DebtBalanceChart } from "@/components/wind/Charts";
import { LcoeWaterfallChart } from "@/components/wind/LcoeWaterfallChart";
import { SensitivityView } from "@/components/wind/SensitivityView";
import { RecommendationsView } from "@/components/wind/RecommendationsView";
import { useSharedScenario } from "@/hooks/useSharedScenario";

const Index = () => {
  const { inputs, setInputs, loaded, saving } = useSharedScenario();
  const model = useMemo(() => runModel(inputs), [inputs]);

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
            <h1 className="text-xl font-bold tracking-tight">TAQA Project Finance Model</h1>
            <p className="text-xs opacity-80">{inputs.projectName} · {inputs.country}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs opacity-90">
              {saving ? <CloudUpload className="h-4 w-4 animate-pulse"/> : <CloudCheck className="h-4 w-4"/>}
              {!loaded ? "Loading…" : saving ? "Saving…" : "All changes saved"}
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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <DSCRChart m={model}/>
              <DebtBalanceChart m={model}/>
            </div>
          </TabsContent>

          <TabsContent value="inputs" className="m-0 pt-6">
            <InputsForm inputs={inputs} onChange={setInputs} />
          </TabsContent>

          <TabsContent value="outputs" className="m-0 pt-6">
            <OutputsView m={model}/>
          </TabsContent>

          <TabsContent value="statements" className="m-0 pt-6">
            <StatementsView m={model}/>
          </TabsContent>

          <TabsContent value="charts" className="m-0 pt-6 space-y-6">
            <CashflowChart m={model}/>
            <LcoeWaterfallChart m={model}/>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <DSCRChart m={model}/>
              <DebtBalanceChart m={model}/>
            </div>
          </TabsContent>

          <TabsContent value="sensitivity" className="m-0 pt-6">
            <SensitivityView inputs={inputs}/>
          </TabsContent>

          <TabsContent value="recommendations" className="m-0 pt-6">
            <RecommendationsView m={model}/>
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
