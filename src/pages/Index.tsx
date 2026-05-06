import { useMemo, useState } from "react";
import { FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_INPUTS, ProjectInputs, runModel } from "@/lib/windModel";
import { generateInvestmentMemo } from "@/lib/investmentMemo";
import { InputsForm } from "@/components/wind/InputsForm";
import { SummaryView } from "@/components/wind/SummaryView";
import { OutputsView, IncomeStatementView, BalanceSheetView } from "@/components/wind/SchedulesView";
import { CashflowChart, DSCRChart, DebtBalanceChart } from "@/components/wind/Charts";
import { CostOfCapitalView } from "@/components/wind/CostOfCapitalView";
import { ReferenceRatesView } from "@/components/wind/ReferenceRatesView";

const Index = () => {
  const [inputs, setInputs] = useState<ProjectInputs>(DEFAULT_INPUTS);
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
          <div />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={reset} className="gap-2"><RotateCcw className="h-4 w-4"/>Reset</Button>
            <Button onClick={exportMemo} className="gap-2 bg-primary hover:bg-primary/90"><FileText className="h-4 w-4"/>Export Investment Memo</Button>
          </div>
        </div>
      </header>

      <main className="container space-y-6 py-8">
        <Tabs defaultValue="summary">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="outputs">Outputs</TabsTrigger>
            <TabsTrigger value="ifs">Income statement</TabsTrigger>
            <TabsTrigger value="afs">Balance sheet</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="wacc">Cost of Capital</TabsTrigger>
            <TabsTrigger value="rates">Reference Rates</TabsTrigger>
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

          <TabsContent value="ifs" className="m-0 pt-6">
            <IncomeStatementView m={model}/>
          </TabsContent>

          <TabsContent value="afs" className="m-0 pt-6">
            <BalanceSheetView m={model}/>
          </TabsContent>

          <TabsContent value="charts" className="m-0 pt-6 space-y-6">
            <CashflowChart m={model}/>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <DSCRChart m={model}/>
              <DebtBalanceChart m={model}/>
            </div>
          </TabsContent>

          <TabsContent value="wacc" className="m-0 pt-6">
            <CostOfCapitalView m={model} onChange={(patch) => setInputs({ ...inputs, ...patch })}/>
          </TabsContent>

          <TabsContent value="rates" className="m-0 pt-6">
            <ReferenceRatesView />
          </TabsContent>
        </Tabs>

        <footer className="pb-8 pt-4 text-center text-xs text-muted-foreground">
          Built from Wind_552_Hard.xlsm · {model.iterations} solver iterations · {model.converged ? "converged ✓" : "did not converge ⚠"}
        </footer>
      </main>
    </div>
  );
};

export default Index;
