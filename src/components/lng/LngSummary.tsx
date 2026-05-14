import { LngOutputs, fmtUsd, fmtNum, fmtPct } from "@/lib/lngModel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import {
  TrendingUp, Activity, Banknote, Gauge, Zap, Layers,
  Shield, CheckCircle2, AlertTriangle, Calendar, Target,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine,
} from "recharts";

export function LngSummary({ m }: { m: LngOutputs }) {
  const I = m.inputs;
  const dscrCushion = m.minDSCR - 1.30;
  const y1 = m.rows.find(r => r.yearIdx === 0);
  const revenueY1 = y1?.revenue ?? 0;
  const ebitdaMargin = revenueY1 > 0 && y1 ? y1.ebitda / revenueY1 : 0;

  const uses = [
    ...m.capexBreakdown,
    { label: "Initial Working Capital", amountUsd: (y1?.ar ?? 0) },
  ].filter(u => u.amountUsd > 0);
  const totalUses = uses.reduce((s, u) => s + u.amountUsd, 0);

  const sources = [
    { label: "Senior Debt",       v: m.seniorDebt },
    { label: "Shareholder Loan",  v: m.shlAmount },
    { label: "Sponsor Equity",    v: m.equityAmount },
  ].filter(s => s.v > 0);
  const totalSources = sources.reduce((s, u) => s + u.v, 0);

  const dscrData = m.rows
    .filter(r => r.yearIdx >= 0)
    .map(r => ({
      year: r.year,
      DSCR: isFinite(r.dscr) && r.dscr > 0 && r.dscr < 50 ? +r.dscr.toFixed(2) : null,
    }));

  return (
    <div className="space-y-6">
      {/* KPI row 1 */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total CAPEX"   value={fmtUsd(m.totalCapexUsd)}   hint={`${fmtNum(m.totalCapexUsd / 1e6, 2)}M USD`}     icon={<Banknote className="h-5 w-5"/>}   accent="primary"/>
        <KpiCard label="Gearing"       value={fmtPct(I.debtRatioPct)}    hint={`SHL ${fmtPct(I.shlPctOfDebt)} of debt`}        icon={<Gauge className="h-5 w-5"/>}      accent="accent"/>
        <KpiCard label="Min DSCR"      value={`${fmtNum(m.minDSCR, 2)}x`} hint={`Avg ${fmtNum(m.avgDSCR, 2)}x`}               icon={<Activity className="h-5 w-5"/>}   accent={m.minDSCR >= 1.3 ? "success" : "accent"}/>
        <KpiCard label="Project IRR"   value={fmtPct(m.projectIRR)}      hint="Unlevered FCFF"                                  icon={<TrendingUp className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Equity IRR"    value={fmtPct(m.equityIRR)}       hint={`Payback ${isFinite(m.paybackYears) ? fmtNum(m.paybackYears, 1) + "y" : "—"}`} icon={<TrendingUp className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="LCOE"          value={`$${fmtNum(m.lcoe, 2)}/MMBTU`} hint="Levelised cost"                             icon={<Zap className="h-5 w-5"/>}        accent="accent"/>
      </section>

      {/* KPI row 2 */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <KpiCard label="NPV (Project)"  value={fmtUsd(m.npvProject)}     hint={`@ ${fmtPct(I.discountRateProject)}`}           icon={<Layers className="h-5 w-5"/>}    accent="primary"/>
        <KpiCard label="NPV (Equity)"   value={fmtUsd(m.npvEquity)}      hint={`@ ${fmtPct(I.discountRateEquity)}`}            icon={<Layers className="h-5 w-5"/>}    accent="accent"/>
        <KpiCard label="DSCR Cushion"   value={`${dscrCushion >= 0 ? "+" : ""}${fmtNum(dscrCushion, 2)}x`} hint="vs 1.30x covenant" icon={<Shield className="h-5 w-5"/>} accent={dscrCushion >= 0 ? "success" : "accent"}/>
        <KpiCard label="Y1 Revenue"     value={fmtUsd(revenueY1)}        hint={`EBITDA margin ${fmtPct(ebitdaMargin)}`}        icon={<Banknote className="h-5 w-5"/>}   accent="primary"/>
        <KpiCard label="Capacity"       value={`${fmtNum(I.capacityM3LngPerDay, 0)} m³/day`} hint={`${I.numSemiTrailers} semi-trailers`} icon={<Activity className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Break-even Price" value={`$${fmtNum(m.breakEvenPriceUsd, 2)}/MMBTU`} hint={`vs $${fmtNum(I.sellingPriceUsdPerMmbtu, 2)} base`} icon={<Target className="h-5 w-5"/>} accent={I.sellingPriceUsdPerMmbtu > m.breakEvenPriceUsd ? "success" : "accent"}/>
        <KpiCard label="CAPEX/m³·day"  value={`$${fmtNum(m.capexPerM3Day, 0)}`} hint="USD per m³/day capacity" icon={<Layers className="h-5 w-5"/>} accent="accent"/>
      </section>

      {/* Uses & Sources */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Uses of Funds</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="py-1.5 text-left font-medium">Item</th>
                <th className="py-1.5 text-right font-medium">USD</th>
                <th className="py-1.5 text-right font-medium">$/m³/day</th>
                <th className="py-1.5 text-right font-medium">% Total</th>
              </tr>
            </thead>
            <tbody>
              {uses.map(u => (
                <tr key={u.label} className="border-t border-border/40">
                  <td className="py-1.5">{u.label}</td>
                  <td className="py-1.5 text-right font-mono">{fmtNum(u.amountUsd, 0)}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground">{fmtNum(u.amountUsd / Math.max(1, m.inputs.capacityM3LngPerDay), 0)}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground">{fmtPct(u.amountUsd / Math.max(1, totalUses))}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right font-mono">{fmtNum(totalUses, 0)}</td>
                <td className="py-2 text-right text-xs text-muted-foreground">{fmtNum(totalUses / Math.max(1, m.inputs.capacityM3LngPerDay), 0)}</td>
                <td className="py-2 text-right text-xs">100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Sources of Funds</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="py-1.5 text-left font-medium">Item</th>
                <th className="py-1.5 text-right font-medium">USD</th>
                <th className="py-1.5 text-right font-medium">% Total</th>
              </tr>
            </thead>
            <tbody>
              {sources.map(s => (
                <tr key={s.label} className="border-t border-border/40">
                  <td className="py-1.5">{s.label}</td>
                  <td className="py-1.5 text-right font-mono">{fmtNum(s.v, 0)}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground">{fmtPct(s.v / Math.max(1, totalSources))}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right font-mono">{fmtNum(totalSources, 0)}</td>
                <td className="py-2 text-right text-xs">100%</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded bg-secondary/40 p-2">
              <div className="text-muted-foreground">DSCR covenant</div>
              <div className="font-mono font-semibold flex items-center gap-1">
                {m.minDSCR >= 1.3
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-success"/>
                  : <AlertTriangle className="h-3.5 w-3.5 text-destructive"/>}
                {m.minDSCR >= 1.3 ? "Pass" : "Breach"}
              </div>
            </div>
            <div className="rounded bg-secondary/40 p-2">
              <div className="text-muted-foreground">Equity payback</div>
              <div className="font-mono font-semibold">
                {isFinite(m.paybackYears) ? `${fmtNum(m.paybackYears, 1)} yrs` : "—"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DSCR chart */}
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-3">DSCR Profile</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dscrData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
              <XAxis dataKey="year" tick={{ fontSize: 11 }}/>
              <YAxis domain={[0, "auto"]} tick={{ fontSize: 11 }}/>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}/>
              <ReferenceLine y={1.3} stroke="hsl(var(--accent))" strokeDasharray="4 4" label={{ value: "1.30x covenant", fontSize: 10, fill: "hsl(var(--accent))" }}/>
              <ReferenceLine y={1}   stroke="hsl(var(--destructive))" strokeDasharray="2 2"/>
              <Line type="monotone" dataKey="DSCR" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 2 }} connectNulls/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
