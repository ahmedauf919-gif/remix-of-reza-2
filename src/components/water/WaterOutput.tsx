import { WaterOutputs, fmtNum, fmtPct } from "@/lib/waterModel";

const numCell = (v: number, d = 0) => <td className="py-1 px-2 text-right font-mono text-xs">{fmtNum(v, d)}</td>;

export const WaterOutput = ({ m }: { m: WaterOutputs }) => {
  const op = m.rows.filter(r => r.yearIdx >= 0);

  return (
    <div className="space-y-6">
      {/* IRRs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Project IRR</div>
          <div className="text-xl font-bold">{fmtPct(m.projectIRR)}</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Equity IRR</div>
          <div className="text-xl font-bold">{fmtPct(m.equityIRR)}</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">NPV (project)</div>
          <div className="text-xl font-bold">EGP {fmtNum(m.npvProject / 1e6, 1)}m</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">NPV (equity)</div>
          <div className="text-xl font-bold">EGP {fmtNum(m.npvEquity / 1e6, 1)}m</div>
        </div>
      </div>

      {/* Income Statement */}
      <div className="rounded-xl border bg-card p-5 shadow-sm overflow-x-auto">
        <h3 className="font-semibold mb-3">Income Statement (EGP '000)</h3>
        <table className="text-xs min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1 px-2">Item</th>
              {op.map(r => <th key={r.year} className="text-right py-1 px-2 font-medium">{r.year}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              ["Revenue", op.map(r => r.revenue / 1000)],
              ["Operating Cost", op.map(r => -r.operatingCost / 1000)],
              ["SG&A", op.map(r => -r.sga / 1000)],
              ["EBITDA", op.map(r => r.ebitda / 1000)],
              ["Depreciation", op.map(r => -r.depreciation / 1000)],
              ["EBIT", op.map(r => r.ebit / 1000)],
              ["Interest", op.map(r => -r.interest / 1000)],
              ["EBT", op.map(r => r.ebt / 1000)],
              ["Tax", op.map(r => -r.tax / 1000)],
              ["Net Profit", op.map(r => r.netProfit / 1000)],
            ].map(([label, vals], i) => {
              const bold = ["EBITDA", "EBIT", "EBT", "Net Profit"].includes(label as string);
              return (
                <tr key={i} className={`border-b border-border/30 ${bold ? "font-semibold bg-secondary/20" : ""}`}>
                  <td className="py-1 px-2">{label as string}</td>
                  {(vals as number[]).map((v, j) => numCell(v, 0))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Balance Sheet */}
      <div className="rounded-xl border bg-card p-5 shadow-sm overflow-x-auto">
        <h3 className="font-semibold mb-3">Balance Sheet (EGP '000)</h3>
        <table className="text-xs min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1 px-2">Item</th>
              {op.map(r => <th key={r.year} className="text-right py-1 px-2 font-medium">{r.year}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              ["PP&E (Gross)", op.map(r => r.ppeGross / 1000)],
              ["Accumulated Depreciation", op.map(r => -r.accumDep / 1000)],
              ["PP&E (Net)", op.map(r => r.ppeNet / 1000), true],
              ["Accounts Receivable", op.map(r => r.accountsReceivable / 1000)],
              ["Cash", op.map(r => r.cash / 1000)],
              ["Total Assets", op.map(r => r.totalAssets / 1000), true],
              ["Debt Outstanding", op.map(r => r.debtClosing / 1000)],
              ["Paid-in Equity", op.map(r => r.paidInEquity / 1000)],
              ["Retained Earnings", op.map(r => r.retainedEarnings / 1000)],
              ["Total Equity", op.map(r => r.totalEquity / 1000), true],
              ["Total Liab. + Equity", op.map(r => r.totalLiabAndEquity / 1000), true],
            ].map(([label, vals, bold], i) => (
              <tr key={i} className={`border-b border-border/30 ${bold ? "font-semibold bg-secondary/20" : ""}`}>
                <td className="py-1 px-2">{label as string}</td>
                {(vals as number[]).map(v => numCell(v, 0))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cash Flow / IRR */}
      <div className="rounded-xl border bg-card p-5 shadow-sm overflow-x-auto">
        <h3 className="font-semibold mb-3">Cash Flow & IRR (EGP '000)</h3>
        <table className="text-xs min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1 px-2">Item</th>
              {m.rows.map(r => <th key={r.year} className="text-right py-1 px-2 font-medium">{r.year}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              ["CAPEX", m.rows.map(r => r.capex / 1000)],
              ["Debt Draw", m.rows.map(r => r.debtDraw / 1000)],
              ["Principal Repayment", m.rows.map(r => -r.principalRepay / 1000)],
              ["Working Capital Δ", m.rows.map(r => r.workingCapDelta / 1000)],
              ["FCFF (Project)", m.rows.map(r => r.fcff / 1000), true],
              ["FCFE (Equity)", m.rows.map(r => r.fcfe / 1000), true],
              ["DSCR", m.rows.map(r => r.dscr)],
            ].map(([label, vals, bold], i) => {
              const isDscr = label === "DSCR";
              return (
                <tr key={i} className={`border-b border-border/30 ${bold ? "font-semibold bg-secondary/20" : ""}`}>
                  <td className="py-1 px-2">{label as string}</td>
                  {(vals as number[]).map((v, j) => (
                    <td key={j} className="py-1 px-2 text-right font-mono text-xs">
                      {isDscr ? (isFinite(v) ? fmtNum(v, 2) : "—") : fmtNum(v, 0)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-3 text-xs text-muted-foreground">
          Project IRR (FCFF) = <span className="font-semibold text-foreground">{fmtPct(m.projectIRR)}</span> · Equity IRR (FCFE) = <span className="font-semibold text-foreground">{fmtPct(m.equityIRR)}</span>
        </div>
      </div>
    </div>
  );
};
