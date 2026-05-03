import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Sun, Banknote, TrendingDown, Calendar, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  DEFAULT_FX,
  DEFAULT_TRANCHES,
  FxRates,
  Tranche,
  YEARS,
  computeAll,
  fmt,
  sumByYear,
} from "@/lib/loanModel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { FxPanel } from "@/components/dashboard/FxPanel";
import { TranchesTable } from "@/components/dashboard/TranchesTable";
import { ScheduleTable } from "@/components/dashboard/ScheduleTable";
import { BalanceChart, DebtServiceChart, MixPie } from "@/components/dashboard/Charts";

const Index = () => {
  const [tranches, setTranches] = useState<Tranche[]>(DEFAULT_TRANCHES);
  const [fx, setFx] = useState<FxRates>(DEFAULT_FX);
  const [view, setView] = useState<"native" | "usd">("usd");

  const computed = useMemo(() => computeAll(tranches, fx), [tranches, fx]);

  const totalDebtUsd = useMemo(
    () => computed.reduce((s, c) => s + c.usd.principal.reduce((a, b) => a + b, 0), 0),
    [computed]
  );
  const totalInterestUsd = useMemo(
    () => computed.reduce((s, c) => s + c.usd.interest.reduce((a, b) => a + b, 0), 0),
    [computed]
  );
  const peakYearService = useMemo(() => {
    const totals = sumByYear(computed, "principal").map((p, i) => p + sumByYear(computed, "interest")[i]);
    const peak = Math.max(...totals);
    const peakIdx = totals.indexOf(peak);
    return { value: peak, year: YEARS[peakIdx] };
  }, [computed]);
  const finalYear = useMemo(() => {
    let last = 0;
    computed.forEach((c) => {
      for (let i = 0; i < c.usd.balance.length; i++) {
        if (c.usd.balance[i] > 0.001) last = Math.max(last, i + 1);
      }
    });
    return YEARS[Math.min(last, YEARS.length - 1)];
  }, [computed]);

  const exportXlsx = () => {
    const wb = XLSX.utils.book_new();
    const summary: (string | number)[][] = [
      ["Solar 200 MWp — Loan Analysis"],
      [],
      ["Total principal (USDm)", +totalDebtUsd.toFixed(2)],
      ["Total interest (USDm)", +totalInterestUsd.toFixed(2)],
      ["Peak debt service (USDm)", +peakYearService.value.toFixed(2), `Year ${peakYearService.year}`],
      ["Final repayment year", finalYear],
      [],
      ["FX rates"],
      ["EGP/USD", fx.EGP],
      ["EUR/USD", fx.EUR],
      ["JPY/USD", fx.JPY],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "Summary");

    const tHeader = ["#", "Lender", "Currency", "Principal", "Tenor (yrs)", "Rate"];
    const tRows = tranches.map((t) => [t.id, t.lender, t.currency, t.principal, t.tenorYears, t.rate]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([tHeader, ...tRows]), "Tranches");

    const buildSheet = (mode: "native" | "usd") => {
      const head = ["Tranche", "Lender", "Currency", "Series", ...YEARS.map(String)];
      const rows: (string | number)[][] = [head];
      computed.forEach(({ tranche, native, usd }) => {
        const d = mode === "usd" ? usd : native;
        (["interest", "principal", "balance"] as const).forEach((k) => {
          rows.push([tranche.id, tranche.lender, tranche.currency, k, ...d[k].map((v) => +v.toFixed(4))]);
        });
      });
      return XLSX.utils.aoa_to_sheet(rows);
    };
    XLSX.utils.book_append_sheet(wb, buildSheet("native"), "Schedule (Native)");
    XLSX.utils.book_append_sheet(wb, buildSheet("usd"), "Schedule (USD)");

    XLSX.writeFile(wb, "Solar_200MWp_LoanAnalysis.xlsx");
    toast.success("Exported to Excel");
  };

  const reset = () => {
    setTranches(DEFAULT_TRANCHES);
    setFx(DEFAULT_FX);
    toast.info("Reset to model defaults");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-[var(--gradient-hero)] text-primary-foreground">
        <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-[var(--shadow-glow)]">
              <Sun className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Solar 200 MWp — Loan Analysis</h1>
              <p className="text-sm text-white/70">Multi-currency project finance dashboard · 2026–2045</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button onClick={exportXlsx} className="gap-2 bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4" /> Export Excel
            </Button>
          </div>
        </div>
      </header>

      <main className="container space-y-6 py-8">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total principal"
            value={`$${fmt(totalDebtUsd)}m`}
            hint={`${tranches.length} tranches · ${new Set(tranches.map((t) => t.lender)).size} lenders`}
            icon={<Banknote className="h-5 w-5" />}
            accent="primary"
          />
          <KpiCard
            label="Total interest"
            value={`$${fmt(totalInterestUsd)}m`}
            hint="Lifetime interest in USD"
            icon={<TrendingDown className="h-5 w-5" />}
            accent="accent"
          />
          <KpiCard
            label="Peak debt service"
            value={`$${fmt(peakYearService.value)}m`}
            hint={`Highest in ${peakYearService.year}`}
            icon={<TrendingDown className="h-5 w-5" />}
            accent="success"
          />
          <KpiCard
            label="Final repayment"
            value={`${finalYear}`}
            hint="Last year with outstanding balance"
            icon={<Calendar className="h-5 w-5" />}
            accent="primary"
          />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DebtServiceChart computed={computed} />
          </div>
          <FxPanel fx={fx} onChange={setFx} />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <BalanceChart computed={computed} />
          </div>
          <MixPie computed={computed} by="currency" />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TranchesTable tranches={tranches} onChange={setTranches} />
          </div>
          <MixPie computed={computed} by="lender" />
        </section>

        <section>
          <Tabs value={view} onValueChange={(v) => setView(v as "native" | "usd")}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Detailed schedules</h2>
              <TabsList>
                <TabsTrigger value="usd">USD millions</TabsTrigger>
                <TabsTrigger value="native">Native currency</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="usd" className="m-0">
              <ScheduleTable computed={computed} view="usd" />
            </TabsContent>
            <TabsContent value="native" className="m-0">
              <ScheduleTable computed={computed} view="native" />
            </TabsContent>
          </Tabs>
        </section>

        <footer className="pb-8 pt-4 text-center text-xs text-muted-foreground">
          Built from Solar_200_Mwp_Easy.xlsx · all values are illustrative
        </footer>
      </main>
    </div>
  );
};

export default Index;
