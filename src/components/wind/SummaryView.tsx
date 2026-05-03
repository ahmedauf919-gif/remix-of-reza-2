import { ModelOutputs, fmt, fmtPct } from "@/lib/windModel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Banknote, TrendingUp, Activity, Calendar, Gauge, Zap } from "lucide-react";

export const SummaryView = ({ m }: { m: ModelOutputs }) => {
  const uses = [
    { label: "EPC costs", v: m.inputs.epcCost },
    { label: "Development", v: m.inputs.developmentCost },
    { label: "Substation & contingency", v: m.inputs.substationContingency },
    { label: "DSRA", v: m.inputs.dsraInitial },
    { label: "IDC", v: m.idc },
    { label: "Upfront fees", v: m.upfrontFee },
    { label: "Commitment fees", v: m.commitmentFee },
  ];
  const sources = [
    { label: "Senior debt", v: m.debtAmount },
    { label: "Equity", v: m.equityAmount },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total uses" value={`$${fmt(m.totalUses / 1000)}m`} hint={`${m.inputs.capacityMWp} MWp`} icon={<Banknote className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Effective gearing" value={fmtPct(m.effectiveGearing)} hint={m.inputs.sizingMode === "dscr-sculpted" ? "DSCR-sculpted" : "Fixed"} icon={<Gauge className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Min DSCR" value={fmt(m.minDSCR)} hint={`Avg ${fmt(m.avgDSCR)}`} icon={<Activity className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="Project IRR" value={fmtPct(m.projectIRR)} hint="Pre-financing" icon={<TrendingUp className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Equity IRR" value={fmtPct(m.equityIRR)} hint="Post-tax" icon={<TrendingUp className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="LCOE" value={`${fmt(m.lcoeUsdPerKWh * 100, 2)}¢/kWh`} hint="Levelized" icon={<Zap className="h-5 w-5"/>} accent="accent"/>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Uses of funds</h3>
          <table className="w-full text-sm">
            <tbody>
              {uses.map(u => (
                <tr key={u.label} className="border-t border-border/40">
                  <td className="py-1.5">{u.label}</td>
                  <td className="py-1.5 text-right font-mono">{fmt(u.v)}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground w-16">{fmtPct(u.v / m.totalUses, 1)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right font-mono">{fmt(m.totalUses)}</td>
                <td className="py-2 text-right text-xs">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Sources of funds</h3>
          <table className="w-full text-sm">
            <tbody>
              {sources.map(u => (
                <tr key={u.label} className="border-t border-border/40">
                  <td className="py-1.5">{u.label}</td>
                  <td className="py-1.5 text-right font-mono">{fmt(u.v)}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground w-16">{fmtPct(u.v / m.totalSources, 1)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right font-mono">{fmt(m.totalSources)}</td>
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
