import { CngOutputs, fmtNum, fmtPct, fmtEgp } from "@/lib/cngModel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Banknote, TrendingUp, Activity, Gauge, Truck, Shield, Layers, Zap } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

export const CngSummary = ({ m }: { m: CngOutputs }) => {
  const I = m.inputs;
  const y1 = m.rows.find(r => r.yearIdx === 0);
  const y1Price = y1 && y1.volumeM3 > 0 ? y1.revenue / y1.volumeM3 : 0;

  const sources = [
    { label: "Senior debt", v: m.debtAmount },
    ...(m.shareholderLoan > 0 ? [{ label: "Shareholder loan", v: m.shareholderLoan }] : []),
    { label: "Sponsor paid-in equity", v: m.paidInEquity },
  ];
  const totalSources = sources.reduce((s, u) => s + u.v, 0);
  const totalUses = m.capexBreakdown.reduce((s, u) => s + u.totalEgp, 0);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total CAPEX" value={fmtEgp(m.totalCapexEgp)} hint={`${fmtNum(I.numCompressors, 0)} compressor(s) · ${fmtNum(I.numTrailers, 0)} trailer(s)`} icon={<Banknote className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Gearing" value={fmtPct(I.debtPct)} hint={`Tenor ${I.loanTenorYears}y · grace ${I.graceYears}y`} icon={<Gauge className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Min DSCR" value={`${fmtNum(m.minDSCR, 2)}x`} hint={`Avg ${fmtNum(m.avgDSCR, 2)}x`} icon={<Activity className="h-5 w-5"/>} accent={m.minDSCR >= 1.3 ? "success" : "accent"}/>
        <KpiCard label="Project IRR" value={fmtPct(m.projectIRR)} hint="Pre-financing" icon={<TrendingUp className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Equity IRR" value={fmtPct(m.equityIRR)} hint={`Payback ${isFinite(m.paybackYears) ? fmtNum(m.paybackYears, 1) + "y" : "—"}`} icon={<TrendingUp className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="LCOM³" value={`${fmtNum(m.lcomEgpPerM3, 3)} EGP/m³`} hint={`Y1 price ${fmtNum(y1Price, 2)}`} icon={<Zap className="h-5 w-5"/>} accent="accent"/>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="NPV (Project)" value={fmtEgp(m.npvProject)} hint={`@ ${fmtPct(I.discountRateProject)}`} icon={<Layers className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="NPV (Equity)" value={fmtEgp(m.npvEquity)} hint={`@ ${fmtPct(I.discountRateEquity)}`} icon={<Layers className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Daily volume" value={`${fmtNum(I.dailyConsumptionM3, 0)} m³`} hint={`${fmtNum(I.operatingHoursPerDay, 0)} hr/day`} icon={<Activity className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Trips / month" value={fmtNum(m.trailerTripsPerMonth, 0)} hint={`Capacity ${fmtNum(I.tripsPerMonth * I.numTrailers, 0)}`} icon={<Truck className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Trailer utilisation" value={fmtPct(m.utilizationPct)} hint={`${I.numTrailers} trailers · ${fmtNum(I.distancePerTripKm, 0)} km/trip`} icon={<Truck className="h-5 w-5"/>} accent={m.utilizationPct < 0.95 ? "success" : "accent"}/>
        <KpiCard label="DSCR cushion" value={`${(m.minDSCR - 1.3) >= 0 ? "+" : ""}${fmtNum(m.minDSCR - 1.3, 2)}x`} hint="vs 1.30x" icon={<Shield className="h-5 w-5"/>} accent={(m.minDSCR - 1.3) >= 0 ? "success" : "accent"}/>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Uses of funds</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground">
              <th className="py-1.5 text-left font-medium">Item</th>
              <th className="py-1.5 text-left font-medium">Group</th>
              <th className="py-1.5 text-right font-medium">EGP</th>
              <th className="py-1.5 text-right font-medium w-16">% Total</th>
            </tr></thead>
            <tbody>
              {m.capexBreakdown.map(u => (
                <tr key={u.label} className="border-t border-border/40">
                  <td className="py-1.5">{u.label}</td>
                  <td className="py-1.5 text-xs text-muted-foreground">{u.group}</td>
                  <td className="py-1.5 text-right font-mono">{fmtNum(u.totalEgp)}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground">{fmtPct(u.totalEgp / Math.max(1, totalUses), 1)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2">Total</td><td/>
                <td className="py-2 text-right font-mono">{fmtNum(totalUses)}</td>
                <td className="py-2 text-right text-xs">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold mb-3">Sources of funds</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground">
              <th className="py-1.5 text-left font-medium">Item</th>
              <th className="py-1.5 text-right font-medium">EGP</th>
              <th className="py-1.5 text-right font-medium w-16">% Total</th>
            </tr></thead>
            <tbody>
              {sources.map(u => (
                <tr key={u.label} className="border-t border-border/40">
                  <td className="py-1.5">{u.label}</td>
                  <td className="py-1.5 text-right font-mono">{fmtNum(u.v)}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground">{fmtPct(u.v / Math.max(1, totalSources), 1)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right font-mono">{fmtNum(totalSources)}</td>
                <td className="py-2 text-right text-xs">100%</td>
              </tr>
            </tbody>
          </table>
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
