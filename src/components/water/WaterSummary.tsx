import { WaterOutputs, fmtNum, fmtPct, fmtEgp } from "@/lib/waterModel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Banknote, TrendingUp, Activity, Gauge, Zap, Droplets, Layers, Calendar } from "lucide-react";

export const WaterSummary = ({ m }: { m: WaterOutputs }) => {
  const I = m.inputs;
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total CAPEX" value={`EGP ${fmtNum(m.totalCapexWithIdc / 1e6, 1)}m`} hint={`${fmtNum(I.capacityM3Day)} m³/day`} icon={<Banknote className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Debt %" value={fmtPct(I.debtToEquity)} hint={`Tenor ${I.loanTenorYears}y`} icon={<Layers className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Min DSCR" value={fmtNum(m.minDSCR, 2)} hint={`Avg ${fmtNum(m.avgDSCR, 2)}`} icon={<Activity className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="Project IRR" value={fmtPct(m.projectIRR)} hint="Unlevered" icon={<TrendingUp className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Equity IRR" value={fmtPct(m.equityIRR)} hint={`Payback ${isFinite(m.equityPaybackYears) ? fmtNum(m.equityPaybackYears, 1) + " yrs" : "—"}`} icon={<TrendingUp className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="LCOM³" value={`${fmtNum(m.lcom3, 2)} EGP/m³`} hint="Levelized" icon={<Droplets className="h-5 w-5"/>} accent="accent"/>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Installed Cap." value={`${fmtNum(m.installedCapacityM3Year)} m³/y`} hint="365 days" icon={<Gauge className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Actual Cap." value={`${fmtNum(m.actualCapacityM3Year)} m³/y`} hint={`Util ${fmtPct(m.utilisationPct)}`} icon={<Gauge className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="Unutilised" value={`${fmtNum(m.unutilisedCapacityM3Year)} m³/y`} hint="Capacity loss" icon={<Activity className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Total Cost/m³" value={`${fmtNum(m.totalCostPerM3, 2)}`} hint="EGP/m³" icon={<Zap className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Electricity/m³" value={`${fmtNum(m.electricityCostPerM3, 2)}`} hint="EGP/m³" icon={<Zap className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Contract" value={`${I.contractYears} yrs`} hint={`From ${I.startYear}`} icon={<Calendar className="h-5 w-5"/>} accent="success"/>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-3">CAPEX Breakdown</h3>
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Feed System", m.feedSysEgp],
                ["Pretreatment", m.pretreatmentEgp],
                ["RO Unit", m.roUnitEgp],
                ["BW/CIP", m.bwCipEgp],
                ["Installation", m.installationEgpAll],
                ["Drilling/Wells", m.drillingEgp],
                ["IDC", m.idc],
              ].map(([l, v]) => (
                <tr key={l as string} className="border-t border-border/40">
                  <td className="py-1.5">{l}</td>
                  <td className="py-1.5 text-right font-mono">{fmtEgp(v as number)}</td>
                  <td className="py-1.5 text-right text-xs text-muted-foreground w-16">{fmtPct((v as number) / m.totalCapexWithIdc, 1)}</td>
                </tr>
              ))}
              <tr className="border-t-2 font-semibold">
                <td className="py-2">Total CAPEX</td>
                <td className="py-2 text-right font-mono">{fmtEgp(m.totalCapexWithIdc)}</td>
                <td className="py-2 text-right text-xs">100%</td>
              </tr>
              <tr><td className="pt-2 text-xs text-muted-foreground">CAPEX / m³</td><td className="text-right font-mono text-xs">{fmtNum(m.capexPerM3Egp)} EGP</td><td className="text-right font-mono text-xs">${fmtNum(m.capexPerM3Usd)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Funding & Tariff Allocation</h3>
          <table className="w-full text-sm mb-4">
            <tbody>
              <tr><td className="py-1.5">Debt</td><td className="py-1.5 text-right font-mono">{fmtEgp(m.debtAmount)}</td><td className="py-1.5 text-right text-xs text-muted-foreground">{fmtPct(m.debtAmount / m.totalCapexWithIdc)}</td></tr>
              <tr className="border-t border-border/40"><td className="py-1.5">Equity</td><td className="py-1.5 text-right font-mono">{fmtEgp(m.equityAmount)}</td><td className="py-1.5 text-right text-xs text-muted-foreground">{fmtPct(m.equityAmount / m.totalCapexWithIdc)}</td></tr>
            </tbody>
          </table>
          <h4 className="text-sm font-medium mb-2">Tariff @ {fmtNum(m.tariffEgpPerM3)} EGP/m³</h4>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="py-1">Inflation / fixed costs</td><td className="text-right font-mono">{fmtPct(m.tariffAllocCbeInflation)}</td></tr>
              <tr><td className="py-1">Electricity</td><td className="text-right font-mono">{fmtPct(m.tariffAllocElectricity)}</td></tr>
              <tr><td className="py-1">FX-linked variable</td><td className="text-right font-mono">{fmtPct(m.tariffAllocFx)}</td></tr>
              <tr><td className="py-1">Margin / fixed @ contracted USD</td><td className="text-right font-mono">{fmtPct(m.tariffAllocFixedUsd)}</td></tr>
            </tbody>
          </table>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded bg-secondary/40 p-2"><div className="text-muted-foreground">NPV (project @ {fmtPct(I.discountRateProject, 0)})</div><div className="font-mono font-semibold">{fmtEgp(m.npvProject)}</div></div>
            <div className="rounded bg-secondary/40 p-2"><div className="text-muted-foreground">NPV (equity @ {fmtPct(I.discountRateEquity, 0)})</div><div className="font-mono font-semibold">{fmtEgp(m.npvEquity)}</div></div>
          </div>
        </div>
      </section>
    </div>
  );
};
