import { ModelOutputs, fmt, fmtPct } from "@/lib/windModel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Banknote, TrendingUp, Activity, Calendar, Gauge, Zap, Shield, Layers, CheckCircle2, AlertTriangle } from "lucide-react";

export const SummaryView = ({ m }: { m: ModelOutputs }) => {
  const I = m.inputs;
  const development = I.preConstructionCosts + I.developmentPremiums + I.developmentExpenses
    + I.land + I.esMeasures + I.lendersTechAdvisors + I.legalExpenses
    + I.administrativeCosts + I.financialAudit + I.insuranceConstruction;
  const uses = [
    { label: "EPC costs", v: I.epcCost },
    { label: "Development & soft costs", v: development },
    { label: "Substation", v: I.substation },
    { label: "Contingency", v: I.contingency },
    { label: "Taxes (capex)", v: I.taxesCapex },
    { label: "Loan repayment (existing)", v: I.loanRepayment },
    { label: `DSRA (auto, ${I.dsraTargetMonths}-mo look-fwd)`, v: m.dsraInitialAuto },
    { label: "IDC", v: m.idc },
    { label: "Upfront fees", v: m.upfrontFee },
    { label: "Commitment fees", v: m.commitmentFee },
  ].filter(u => u.v > 0 || u.label === "EPC costs");
  const sources = [
    { label: "Senior debt", v: m.debtAmount },
    { label: "Common equity", v: m.commonEquityAmount },
    { label: "Preferential equity", v: m.prefEquityAmount },
    { label: "Shareholder loan", v: m.shLoanAmount },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total uses" value={`$${fmt(m.totalUses / 1000)}m`} hint={`${m.inputs.capacityMWp} MWp`} icon={<Banknote className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Effective gearing" value={fmtPct(m.effectiveGearing)} hint={m.inputs.sizingMode === "dscr-sculpted" ? "DSCR-sculpted" : "Fixed"} icon={<Gauge className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Min DSCR" value={fmt(m.minDSCR)} hint={`Avg ${fmt(m.avgDSCR)}`} icon={<Activity className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="Project IRR" value={fmtPct(m.projectIRR)} hint="Pre-financing" icon={<TrendingUp className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Common Equity IRR" value={fmtPct(m.commonEquityIRR)} hint={`Blended ${fmtPct(m.blendedEquityIRR)}`} icon={<TrendingUp className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="LCOE" value={`${fmt(m.lcoeUsdPerKWh * 100, 2)}¢/kWh`} hint="Levelized" icon={<Zap className="h-5 w-5"/>} accent="accent"/>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Min LLCR" value={fmt(m.minLLCR)} hint={`Avg ${fmt(m.avgLLCR)}`} icon={<Shield className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Min PLCR" value={fmt(m.minPLCR)} hint="Project life" icon={<Shield className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Loan life" value={`${m.loanLifeYears} yrs`} hint={`Tenor ${m.inputs.debtTenorYears}`} icon={<Calendar className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="Blended cost of debt" value={fmtPct(m.blendedRate)} hint={`${m.inputs.sizingMode}`} icon={<Layers className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="DSCR covenant" value={m.debtServiceCoverageOk ? "Pass" : "Breach"} hint={`Target ${fmt(m.inputs.targetDSCR)}`} icon={m.debtServiceCoverageOk ? <CheckCircle2 className="h-5 w-5"/> : <AlertTriangle className="h-5 w-5"/>} accent={m.debtServiceCoverageOk ? "success" : "accent"}/>
        <KpiCard label="BS check (max abs)" value={fmt(m.maxBalanceCheck)} hint="USD '000" icon={<Activity className="h-5 w-5"/>} accent={m.maxBalanceCheck < 1 ? "success" : "accent"}/>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Uses of funds</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="py-1.5 text-left font-medium">Item</th>
                <th className="py-1.5 text-right font-medium">Amount (USD '000)</th>
                <th className="py-1.5 text-right font-medium">$/MW ('000)</th>
                <th className="py-1.5 text-right font-medium w-16">% Total</th>
              </tr>
            </thead>
            <tbody>
              {uses.map(u => (
                <tr key={u.label} className="border-t border-border/40">
                  <td className="py-1.5">{u.label}</td>
                  <td className="py-1.5 text-right font-mono">{fmt(u.v)}</td>
                  <td className="py-1.5 text-right font-mono text-muted-foreground">{fmt(u.v / I.capacityMWp)}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground w-16">{fmtPct(u.v / m.totalUses, 1)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right font-mono">{fmt(m.totalUses)}</td>
                <td className="py-2 text-right font-mono">{fmt(m.totalUses / I.capacityMWp)}</td>
                <td className="py-2 text-right text-xs">100%</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 text-xs text-muted-foreground">Capacity: {fmt(I.capacityMWp)} MWp</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Sources of funds</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="py-1.5 text-left font-medium">Item</th>
                <th className="py-1.5 text-right font-medium">Amount (USD '000)</th>
                <th className="py-1.5 text-right font-medium">$/MW ('000)</th>
                <th className="py-1.5 text-right font-medium w-16">% Total</th>
              </tr>
            </thead>
            <tbody>
              {sources.map(u => (
                <tr key={u.label} className="border-t border-border/40">
                  <td className="py-1.5">{u.label}</td>
                  <td className="py-1.5 text-right font-mono">{fmt(u.v)}</td>
                  <td className="py-1.5 text-right font-mono text-muted-foreground">{fmt(u.v / I.capacityMWp)}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground w-16">{fmtPct(u.v / m.totalSources, 1)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right font-mono">{fmt(m.totalSources)}</td>
                <td className="py-2 text-right font-mono">{fmt(m.totalSources / I.capacityMWp)}</td>
                <td className="py-2 text-right text-xs">100%</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded bg-secondary/40 p-2">
              <div className="text-muted-foreground">NPV (project @ {fmtPct(m.inputs.discountRateProject, 1)})</div>
              <div className="font-mono font-semibold">${fmt(m.npvProject / 1000)}m</div>
            </div>
            <div className="rounded bg-secondary/40 p-2">
              <div className="text-muted-foreground">NPV (equity @ {fmtPct(m.inputs.discountRateEquity, 1)})</div>
              <div className="font-mono font-semibold">${fmt(m.npvEquity / 1000)}m</div>
            </div>
            <div className="rounded bg-secondary/40 p-2">
              <div className="text-muted-foreground">Equity payback</div>
              <div className="font-mono font-semibold">{isNaN(m.paybackYears) ? "—" : `${m.paybackYears} yrs`}</div>
            </div>
            <div className="rounded bg-secondary/40 p-2">
              <div className="text-muted-foreground">Solver iterations</div>
              <div className="font-mono font-semibold">{m.iterations} {m.converged ? "✓" : "⚠"}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
