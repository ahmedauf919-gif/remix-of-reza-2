import { PvOutputs, fmtNum, fmtPct, fmtEgp } from "@/lib/pvModel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Banknote, TrendingUp, Activity, Calendar, Gauge, Zap, Shield, Layers, CheckCircle2, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

export const PvSummary = ({ m }: { m: PvOutputs }) => {
  const I = m.inputs;
  const capexPerKwp = m.totalCapexEgp / Math.max(1, I.capacityKwp);
  const tariffY1 = m.rows.find(r => r.yearIdx === 0)?.tariffEgp ?? 0;
  const energyY1 = m.rows.find(r => r.yearIdx === 0)?.energyKwh ?? 0;
  const dscrCushion = m.minDSCR - 1.3;
  const lcoeMargin = tariffY1 > 0 ? 1 - m.lcoeEgpPerKwh / tariffY1 : 0;
  const tenor = I.loanTenorYears;

  const uses = m.capexBreakdown.map(b => ({ label: b.label, v: b.totalEgp }));
  const totalUses = uses.reduce((s, u) => s + u.v, 0);
  const sources = [
    { label: "Senior debt", v: m.debtAmount },
    ...(m.shareholderLoan > 0 ? [{ label: "Shareholder loan", v: m.shareholderLoan }] : []),
    { label: "Sponsor paid-in equity", v: m.paidInEquity },
  ];
  const totalSources = sources.reduce((s, u) => s + u.v, 0);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total CAPEX" value={fmtEgp(m.totalCapexEgp)} hint={`${fmtNum(capexPerKwp, 0)} EGP/kWp`} icon={<Banknote className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Gearing" value={fmtPct(I.debtPct)} hint={`Tenor ${tenor}y · grace ${I.graceYears}y`} icon={<Gauge className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Min DSCR" value={`${fmtNum(m.minDSCR, 2)}x`} hint={`Avg ${fmtNum(m.avgDSCR, 2)}x`} icon={<Activity className="h-5 w-5"/>} accent={m.minDSCR >= 1.3 ? "success" : "accent"}/>
        <KpiCard label="Project IRR" value={fmtPct(m.projectIRR)} hint="Pre-financing" icon={<TrendingUp className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Equity IRR" value={fmtPct(m.equityIRR)} hint={`Payback ${isFinite(m.paybackYears) ? fmtNum(m.paybackYears, 1) + "y" : "—"}`} icon={<TrendingUp className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="LCOE" value={`${fmtNum(m.lcoeEgpPerKwh, 3)} EGP/kWh`} hint="Levelized" icon={<Zap className="h-5 w-5"/>} accent="accent"/>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="NPV (Project)" value={fmtEgp(m.npvProject)} hint={`@ ${fmtPct(I.discountRateProject)}`} icon={<Layers className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="NPV (Equity)" value={fmtEgp(m.npvEquity)} hint={`@ ${fmtPct(I.discountRateEquity)}`} icon={<Layers className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="DSCR cushion" value={`${dscrCushion >= 0 ? "+" : ""}${fmtNum(dscrCushion, 2)}x`} hint="vs 1.30x target" icon={<Shield className="h-5 w-5"/>} accent={dscrCushion >= 0 ? "success" : "accent"}/>
        <KpiCard label="LCOE / Tariff" value={fmtPct(tariffY1 > 0 ? m.lcoeEgpPerKwh / tariffY1 : 0)} hint={`${fmtPct(lcoeMargin)} margin`} icon={<Zap className="h-5 w-5"/>} accent={lcoeMargin > 0.15 ? "success" : "accent"}/>
        <KpiCard label="Capacity" value={`${fmtNum(I.capacityKwp, 0)} kWp`} hint={`${I.structureType} · ${I.yieldCase}`} icon={<Activity className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Y1 Energy" value={`${fmtNum(energyY1 / 1000, 0)} MWh`} hint={`Tariff ${fmtNum(tariffY1, 3)} EGP/kWh`} icon={<Calendar className="h-5 w-5"/>} accent="accent"/>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Uses of funds</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="py-1.5 text-left font-medium">Item</th>
                <th className="py-1.5 text-right font-medium">EGP</th>
                <th className="py-1.5 text-right font-medium">EGP/kWp</th>
                <th className="py-1.5 text-right font-medium w-16">% Total</th>
              </tr>
            </thead>
            <tbody>
              {uses.map(u => (
                <tr key={u.label} className="border-t border-border/40">
                  <td className="py-1.5">{u.label}</td>
                  <td className="py-1.5 text-right font-mono">{fmtNum(u.v)}</td>
                  <td className="py-1.5 text-right font-mono text-muted-foreground">{fmtNum(u.v / Math.max(1, I.capacityKwp))}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground w-16">{fmtPct(u.v / Math.max(1, totalUses), 1)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right font-mono">{fmtNum(totalUses)}</td>
                <td className="py-2 text-right font-mono">{fmtNum(totalUses / Math.max(1, I.capacityKwp))}</td>
                <td className="py-2 text-right text-xs">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Sources of funds</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="py-1.5 text-left font-medium">Item</th>
                <th className="py-1.5 text-right font-medium">EGP</th>
                <th className="py-1.5 text-right font-medium">EGP/kWp</th>
                <th className="py-1.5 text-right font-medium w-16">% Total</th>
              </tr>
            </thead>
            <tbody>
              {sources.map(u => (
                <tr key={u.label} className="border-t border-border/40">
                  <td className="py-1.5">{u.label}</td>
                  <td className="py-1.5 text-right font-mono">{fmtNum(u.v)}</td>
                  <td className="py-1.5 text-right font-mono text-muted-foreground">{fmtNum(u.v / Math.max(1, I.capacityKwp))}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground w-16">{fmtPct(u.v / Math.max(1, totalSources), 1)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right font-mono">{fmtNum(totalSources)}</td>
                <td className="py-2 text-right font-mono">{fmtNum(totalSources / Math.max(1, I.capacityKwp))}</td>
                <td className="py-2 text-right text-xs">100%</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded bg-secondary/40 p-2">
              <div className="text-muted-foreground">DSCR covenant</div>
              <div className="font-mono font-semibold flex items-center gap-1">
                {m.minDSCR >= 1.3 ? <CheckCircle2 className="h-3.5 w-3.5 text-success"/> : <AlertTriangle className="h-3.5 w-3.5 text-destructive"/>}
                {m.minDSCR >= 1.3 ? "Pass" : "Breach"}
              </div>
            </div>
            <div className="rounded bg-secondary/40 p-2">
              <div className="text-muted-foreground">Equity payback</div>
              <div className="font-mono font-semibold">{isFinite(m.paybackYears) ? `${fmtNum(m.paybackYears, 1)} yrs` : "—"}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-3">DSCR profile</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={m.rows.filter(r => r.yearIdx >= 0).map(r => ({ year: r.year, DSCR: (r.principalRepay > 0 || r.interest > 0) ? +r.dscr.toFixed(3) : null }))}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
              <XAxis dataKey="year" tick={{ fontSize: 11 }}/>
              <YAxis domain={[0, 'auto']} tick={{ fontSize: 11 }}/>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}/>
              <ReferenceLine y={1.3} stroke="hsl(var(--accent))" strokeDasharray="4 4" label={{ value: "Target 1.30x", fontSize: 10, fill: "hsl(var(--accent))" }}/>
              <ReferenceLine y={1} stroke="hsl(var(--destructive))" strokeDasharray="2 2"/>
              <Line type="monotone" dataKey="DSCR" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 2 }} connectNulls/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};
