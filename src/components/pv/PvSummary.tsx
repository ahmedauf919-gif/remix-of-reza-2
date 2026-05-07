import { PvOutputs, fmtNum, fmtPct, fmtEgp } from "@/lib/pvModel";

const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="rounded-xl border bg-card p-5 shadow-sm">
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="text-2xl font-bold mt-1 font-mono">{value}</div>
    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
  </div>
);

export const PvSummary = ({ m }: { m: PvOutputs }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total CAPEX" value={fmtEgp(m.totalCapexEgp)} sub={`${fmtNum(m.totalCapexEgp / m.inputs.capacityKwp, 0)} EGP/kWp`} />
        <Stat label="Debt" value={fmtEgp(m.debtAmount)} sub={`${fmtPct(m.inputs.debtPct)} of CAPEX`} />
        <Stat label="Project IRR" value={fmtPct(m.projectIRR)} />
        <Stat label="Equity IRR" value={fmtPct(m.equityIRR)} />
        <Stat label="NPV (Project)" value={fmtEgp(m.npvProject)} sub={`@ ${fmtPct(m.inputs.discountRateProject)}`} />
        <Stat label="NPV (Equity)" value={fmtEgp(m.npvEquity)} sub={`@ ${fmtPct(m.inputs.discountRateEquity)}`} />
        <Stat label="Min DSCR" value={fmtNum(m.minDSCR, 2)} sub={`Avg ${fmtNum(m.avgDSCR, 2)}`} />
        <Stat label="LCOE" value={`${fmtNum(m.lcoeEgpPerKwh, 3)} EGP/kWh`} sub={`Equity Payback ${isFinite(m.paybackYears) ? fmtNum(m.paybackYears, 1) + " yrs" : "—"}`} />
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm overflow-x-auto">
        <h3 className="font-semibold mb-3">CAPEX Breakdown</h3>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th className="py-1.5 text-left">Item</th>
              <th className="py-1.5 text-right">Base (EGP)</th>
              <th className="py-1.5 text-right">Customs</th>
              <th className="py-1.5 text-right">VAT</th>
              <th className="py-1.5 text-right">Total</th>
              <th className="py-1.5 text-right">Annual Dep.</th>
              <th className="py-1.5 text-left">Method</th>
            </tr>
          </thead>
          <tbody>
            {m.capexBreakdown.map((b, i) => (
              <tr key={i} className="border-t border-border/40">
                <td className="py-1.5">{b.label}</td>
                <td className="py-1.5 text-right font-mono">{fmtNum(b.egp)}</td>
                <td className="py-1.5 text-right font-mono">{fmtNum(b.customsEgp)}</td>
                <td className="py-1.5 text-right font-mono">{fmtNum(b.vatEgp)}</td>
                <td className="py-1.5 text-right font-mono">{fmtNum(b.totalEgp)}</td>
                <td className="py-1.5 text-right font-mono">{b.depMethod === "UnitOfProduction" ? `${fmtNum(b.annualDep, 4)} /kWh` : fmtNum(b.annualDep)}</td>
                <td className="py-1.5">{b.depMethod}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-border font-medium">
              <td className="py-1.5">Total</td>
              <td colSpan={3}/>
              <td className="py-1.5 text-right font-mono">{fmtNum(m.totalCapexEgp)}</td>
              <td colSpan={2}/>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
