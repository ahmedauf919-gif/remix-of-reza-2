import { Fragment } from "react";
import { LngOutputs, fmtNum, fmtPct } from "@/lib/lngModel";

type Row = { label: string; values: (number | null)[]; bold?: boolean; indent?: boolean; d?: number; xfmt?: (v: number) => string };
type Section = { title: string; rows: Row[] };

const ScheduleTable = ({ title, years, sections }: { title: string; years: number[]; sections: Section[] }) => (
  <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
    <div className="border-b border-border bg-secondary/40 px-5 py-3">
      <h3 className="font-semibold">{title}</h3>
    </div>
    <div className="max-h-[600px] overflow-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
          <tr>
            <th className="sticky left-0 z-20 bg-muted/80 px-3 py-2 text-left min-w-[260px]">Item</th>
            {years.map(y => <th key={y} className="px-2 py-2 text-right font-mono text-muted-foreground">{y}</th>)}
          </tr>
        </thead>
        <tbody>
          {sections.map((sec, si) => (
            <Fragment key={si}>
              <tr className="bg-secondary/20">
                <td colSpan={1 + years.length} className="px-3 py-1.5 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">{sec.title}</td>
              </tr>
              {sec.rows.map((r, ri) => (
                <tr key={ri} className={`border-t border-border/40 hover:bg-secondary/30 ${r.bold ? "font-semibold bg-muted/30" : ""}`}>
                  <td className={`sticky left-0 bg-card px-3 py-1.5 ${r.indent ? "pl-6 text-muted-foreground" : ""}`}>{r.label}</td>
                  {r.values.map((v, vi) => (
                    <td key={vi} className="px-2 py-1.5 text-right font-mono tabular-nums">
                      {v == null ? "—" : r.xfmt ? r.xfmt(v) : fmtNum(v, r.d ?? 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export function LngOutput({ m }: { m: LngOutputs }) {
  const years = m.rows.map(r => r.year);
  const v = (fn: (r: typeof m.rows[number]) => number | null) => m.rows.map(fn);
  const I = m.inputs;

  const incomeStmt: Section[] = [
    {
      title: "Revenue",
      rows: [
        { label: "Volume sold (MMBTU)",          values: v(r => r.yearIdx < 0 ? null : r.volumeMmbtu),  d: 0, indent: true },
        { label: "Volume sold (m³ LNG)",          values: v(r => r.yearIdx < 0 ? null : r.volumeM3Lng),  d: 0, indent: true },
        { label: "LNG Revenue (USD)",             values: v(r => r.revenue),  bold: true },
        { label: "(−) Feed Gas Cost",             values: v(r => -r.feedGasCost), indent: true },
        { label: "Gross Margin",                  values: v(r => r.grossMargin), bold: true },
      ],
    },
    {
      title: "Operating Expenses",
      rows: [
        { label: "Fixed OPEX",                   values: v(r => -r.fixedOpex),      indent: true },
        { label: "Transportation Cost",           values: v(r => -r.transportCost),  indent: true },
        { label: "Total OPEX",                   values: v(r => -r.totalOpex),      bold: true },
        { label: "EBITDA",                        values: v(r => r.ebitda),          bold: true },
        { label: "EBITDA margin",                 values: v(r => r.revenue > 0 ? r.ebitda / r.revenue : null), xfmt: (x) => fmtPct(x) },
      ],
    },
    {
      title: "Profit & Loss",
      rows: [
        { label: "Depreciation",                 values: v(r => -r.depreciation),   indent: true },
        { label: "EBIT",                         values: v(r => r.ebit),            bold: true },
        { label: "Senior Interest",              values: v(r => -r.seniorInterest), indent: true },
        { label: "SHL Interest",                 values: v(r => -r.shlInterest),    indent: true },
        { label: "EBT",                          values: v(r => r.ebt),             bold: true },
        { label: "Income Tax",                   values: v(r => -r.tax),            indent: true },
        { label: "Net Profit",                   values: v(r => r.netProfit),       bold: true },
      ],
    },
  ];

  const cashFlow: Section[] = [
    {
      title: "Operating Activities",
      rows: [
        { label: "Net Profit",                            values: v(r => r.netProfit) },
        { label: "(+) Depreciation",                      values: v(r => r.depreciation), indent: true },
        { label: "(+/−) Working Capital Change",          values: v(r => r.wcDelta),      indent: true },
        { label: "Cash from Operations",                  values: v(r => r.netProfit + r.depreciation + r.wcDelta), bold: true },
      ],
    },
    {
      title: "Investing Activities",
      rows: [
        { label: "(−) CAPEX",                            values: v(r => r.capex),        indent: true },
        { label: "Cash from Investing",                  values: v(r => r.capex),        bold: true },
      ],
    },
    {
      title: "Financing Activities",
      rows: [
        { label: "(+) Senior Debt Drawn",                values: v(r => r.seniorDraw),     indent: true },
        { label: "(−) Senior Repayment",                 values: v(r => -r.seniorRepay),   indent: true },
        { label: "(−) Senior Interest",                  values: v(r => -r.seniorInterest),indent: true },
        { label: "(+) SHL Drawn",                        values: v(r => r.shlDraw),        indent: true },
        { label: "(−) SHL Repayment",                    values: v(r => -r.shlRepay),      indent: true },
        { label: "(−) SHL Interest",                     values: v(r => -r.shlInterest),   indent: true },
        { label: "Cash from Financing",                  values: v(r => r.seniorDraw - r.seniorRepay - r.seniorInterest + r.shlDraw - r.shlRepay - r.shlInterest), bold: true },
      ],
    },
    {
      title: "Net Cash Flow",
      rows: [
        { label: "Cumulative Cash Balance",              values: v(r => r.cash), bold: true },
      ],
    },
  ];

  const debtSched: Section[] = [
    {
      title: "Senior Debt",
      rows: [
        { label: "Opening Balance",     values: v(r => r.seniorOpening) },
        { label: "Draw",                values: v(r => r.seniorDraw),    indent: true },
        { label: "Repayment",           values: v(r => -r.seniorRepay),  indent: true },
        { label: "Interest",            values: v(r => -r.seniorInterest), indent: true },
        { label: "Closing Balance",     values: v(r => r.seniorClosing), bold: true },
        { label: "Interest Rate",       values: v(_ => I.seniorInterestRatePct * 100), d: 2, indent: true, xfmt: x => `${x.toFixed(2)}%` },
        { label: "DSCR",               values: v(r => isFinite(r.dscr) && r.dscr < 50 ? r.dscr : null), d: 2, bold: true, xfmt: x => `${x.toFixed(2)}x` },
      ],
    },
    {
      title: "Shareholder Loan (SHL)",
      rows: [
        { label: "Opening Balance",     values: v(r => r.shlOpening) },
        { label: "Draw",                values: v(r => r.shlDraw),    indent: true },
        { label: "Repayment",           values: v(r => -r.shlRepay),  indent: true },
        { label: "Interest",            values: v(r => -r.shlInterest), indent: true },
        { label: "Closing Balance",     values: v(r => r.shlClosing), bold: true },
      ],
    },
  ];

  const irrBuild: Section[] = [
    {
      title: `Project IRR (${(m.projectIRR * 100).toFixed(1)}%) — Unlevered FCFF`,
      rows: [
        { label: "EBIT",                    values: v(r => r.ebit) },
        { label: "(−) Tax on EBIT",         values: v(r => -Math.max(0, r.ebit) * I.taxRatePct), indent: true },
        { label: "(+) Depreciation",        values: v(r => r.depreciation), indent: true },
        { label: "(+/−) WC Change",         values: v(r => r.wcDelta),      indent: true },
        { label: "(−) CAPEX",              values: v(r => r.capex),         indent: true },
        { label: "FCFF",                   values: v(r => r.fcff),          bold: true },
      ],
    },
    {
      title: `Equity IRR (${(m.equityIRR * 100).toFixed(1)}%) — Levered FCFE`,
      rows: [
        { label: "Net Profit",              values: v(r => r.netProfit) },
        { label: "(+) Depreciation",        values: v(r => r.depreciation), indent: true },
        { label: "(+/−) WC Change",         values: v(r => r.wcDelta),      indent: true },
        { label: "(−) Senior Repaid",       values: v(r => -r.seniorRepay), indent: true },
        { label: "(−) SHL Repaid",          values: v(r => -r.shlRepay),    indent: true },
        { label: "(−) Equity Contribution", values: v(r => r.yearIdx === -1 ? -m.equityAmount : 0), indent: true },
        { label: "FCFE",                   values: v(r => r.fcfe),          bold: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <ScheduleTable title="Income Statement (USD)" years={years} sections={incomeStmt} />
      <ScheduleTable title="Cash Flow Statement (USD)" years={years} sections={cashFlow} />
      <ScheduleTable title="Debt Schedule (USD)" years={years} sections={debtSched} />
      <ScheduleTable title="IRR Build" years={years} sections={irrBuild} />
    </div>
  );
}
