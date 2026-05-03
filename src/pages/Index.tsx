import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Wind, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEFAULT_INPUTS, ProjectInputs, runModel, fmt } from "@/lib/windModel";
import { InputsForm } from "@/components/wind/InputsForm";
import { SummaryView } from "@/components/wind/SummaryView";
import { OutputsView, IncomeStatementView, BalanceSheetView } from "@/components/wind/SchedulesView";
import { CashflowChart, DSCRChart, DebtBalanceChart } from "@/components/wind/Charts";

const Index = () => {
  const [inputs, setInputs] = useState<ProjectInputs>(DEFAULT_INPUTS);
  const model = useMemo(() => runModel(inputs), [inputs]);

  const exportXlsx = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      [`${inputs.projectName} — ${inputs.scenario}`],
      [],
      ["Total uses (USD '000)", +model.totalUses.toFixed(2)],
      ["Senior debt", +model.debtAmount.toFixed(2)],
      ["Equity", +model.equityAmount.toFixed(2)],
      ["Effective gearing", +(model.effectiveGearing).toFixed(4)],
      ["IDC", +model.idc.toFixed(2)],
      ["Min DSCR", +model.minDSCR.toFixed(3)],
      ["Avg DSCR", +model.avgDSCR.toFixed(3)],
      ["Project IRR", +model.projectIRR.toFixed(5)],
      ["Equity IRR", +model.equityIRR.toFixed(5)],
      ["LCOE (USD/kWh)", +model.lcoeUsdPerKWh.toFixed(5)],
    ]), "Summary");

    const head = ["Year", "Revenue", "Opex", "EBITDA", "Depreciation", "Interest", "Tax", "NetIncome", "WC change", "CFADS", "Principal", "Debt service", "DSCR", "CFFI", "Closing debt"];
    const rows = model.rows.map(r => [r.year, r.revenue, -r.opex, r.ebitda, -r.depreciation, -r.interest, -r.tax, r.netIncome, r.workingCapitalChange, r.cfads, -r.principal, -r.debtService, r.dscr, r.cffi, r.closingDebt].map(v => typeof v === "number" ? +v.toFixed(2) : v));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([head, ...rows]), "Outputs");

    XLSX.writeFile(wb, `${inputs.projectName.replace(/\s+/g, "_")}_Model.xlsx`);
    toast.success("Exported to Excel");
  };

  const reset = () => { setInputs(DEFAULT_INPUTS); toast.info("Reset to defaults"); };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-[var(--gradient-hero)] text-primary-foreground">
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-[var(--shadow-glow)]">
              <Wind className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{inputs.projectName} — Project Finance</h1>
              <p className="text-sm text-white/70">{inputs.scenario} · Dynamic recalc · IDC closed-form · DSCR sculpting in JS</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={reset} className="gap-2"><RotateCcw className="h-4 w-4"/>Reset</Button>
            <Button onClick={exportXlsx} className="gap-2 bg-primary hover:bg-primary/90"><Download className="h-4 w-4"/>Export Excel</Button>
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
        </Tabs>

        <footer className="pb-8 pt-4 text-center text-xs text-muted-foreground">
          Built from Wind_552_Hard.xlsm · {model.iterations} solver iterations · {model.converged ? "converged ✓" : "did not converge ⚠"}
        </footer>
      </main>
    </div>
  );
};

export default Index;
