import { Fragment } from "react";
import { CngOutputs, fmtNum, fmtPct } from "@/lib/cngModel";

type Section = { title: string; rows: { label: string; values: Array<number | null>; bold?: boolean; indent?: boolean; pct?: boolean; d?: number; xfmt?: (v: number) => string }[] };

const ScheduleTable = ({ title, years, sections }: { title: string; years: number[]; sections: Section[] }) => (
  <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
    <div className="border-b border-border bg-secondary/40 px-5 py-3"><h3 className="font-semibold">{title}</h3></div>
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
                      {v == null ? "-" : r.xfmt ? r.xfmt(v) : r.pct ? `${fmtNum(v, 2)}x` : fmtNum(v, r.d ?? 0)}
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

export const CngOutput = ({ m }: { m: CngOutputs }) => {
  const years = m.rows.map(r => r.year);
  const v = (fn: (r: typeof m.rows[number]) => number | null) => m.rows.map(fn);
  const I = m.inputs;

  const incomeStmt: Section[] = [
    {
      title: "Revenue",
      rows: [
        { label: "Volume delivered (m³)", values: v(r => r.volumeM3) },
        { label: "Transportation revenue", values: v(r => r.revenueTransport), indent: true },
        { label: "Gas commission revenue", values: v(r => r.revenueGasCommission), indent: true },
        { label: "Total revenue", values: v(r => r.revenue), bold: true },
      ],
    },
    {
      title: "Operating expenses",
      rows: [
        { label: "Salaries (Mother station)", values: v(r => -r.salaries), indent: true },
        { label: "Electricity (compression)", values: v(r => -r.electricity), indent: true },
        { label: "Site rent", values: v(r => -r.msRent), indent: true },
        { label: "Mother station OPEX", values: v(r => -r.msOpex), bold: true },
        { label: "Transport — fixed/trip", values: v(r => -r.transportFixed), indent: true },
        { label: "Transport — variable/km", values: v(r => -r.transportVariable), indent: true },
        { label: "Tires", values: v(r => -r.tires), indent: true },
        { label: "Trailer / transport OPEX", values: v(r => -r.trailerOpex), bold: true },
        { label: "Toll", values: v(r => -r.toll), indent: true },
        { label: "Insurance", values: v(r => -r.insurance), indent: true },
        { label: "Misc.", values: v(r => -r.misc), indent: true },
        { label: "Daughter / other OPEX", values: v(r => -r.daughterOpex), bold: true },
        { label: "Head office allocation", values: v(r => -r.headOffice), indent: true },
        { label: "Total OPEX", values: v(r => -r.opex), bold: true },
        { label: "EBITDA", values: v(r => r.ebitda), bold: true },
        { label: "EBITDA margin", values: v(r => r.revenue > 0 ? r.ebitda / r.revenue : null), xfmt: (x) => fmtPct(x) },
      ],
    },
    {
      title: "Profit & loss",
      rows: [
        { label: "Depreciation", values: v(r => -r.depreciation), indent: true },
        { label: "EBIT", values: v(r => r.ebit), bold: true },
        { label: "Senior interest", values: v(r => -r.interest), indent: true },
        { label: "Shareholder loan interest", values: v(r => -r.slInterest), indent: true },
        { label: "EBT", values: v(r => r.ebt), bold: true },
        { label: "Income tax", values: v(r => -r.tax), indent: true },
        { label: "Net profit", values: v(r => r.netProfit), bold: true },
      ],
    },
  ];

  const debtSched: Section[] = [
    {
      title: "Senior debt",
      rows: [
        { label: "Opening balance", values: v(r => r.debtOpening) },
        { label: "Draw", values: v(r => r.debtDraw), indent: true },
        { label: "Principal repayment", values: v(r => -r.principalRepay), indent: true },
        { label: "Interest", values: v(r => -r.interest), indent: true },
        { label: "Closing balance", values: v(r => r.debtClosing), bold: true },
        { label: "All-in rate", values: v(r => r.rate * 100), xfmt: (x) => `${x.toFixed(2)}%`, indent: true },
        { label: "DSCR (CFADS / DS)", values: v(r => isFinite(r.dscr) ? r.dscr : null), pct: true, bold: true },
      ],
    },
    ...(m.shareholderLoan > 0 ? [{
      title: "Shareholder loan",
      rows: [
        { label: "Opening balance", values: v(r => r.slOpening) },
        { label: "Draw", values: v(r => r.slDraw), indent: true },
        { label: "Principal repayment", values: v(r => -r.slPrincipalRepay), indent: true },
        { label: "Interest", values: v(r => -r.slInterest), indent: true },
        { label: "Closing balance", values: v(r => r.slClosing), bold: true },
      ],
    }] : []),
  ];

  const bs: Section[] = [
    { title: "Assets", rows: [
        { label: "Cash & equivalents", values: v(r => r.cash), indent: true },
        { label: "Accounts receivable", values: v(r => r.ar), indent: true },
        { label: "Net PP&E", values: v(r => r.netPPE), indent: true },
        { label: "(Accumulated depreciation)", values: v(r => -r.accumDep), indent: true },
        { label: "Total assets", values: v(r => r.cash + r.ar + r.netPPE), bold: true },
    ]},
    { title: "Liabilities", rows: [
        { label: "Accounts payable", values: v(r => r.ap), indent: true },
        { label: "Senior debt outstanding", values: v(r => r.debtClosing), indent: true },
        { label: "Shareholder loan outstanding", values: v(r => r.slClosing), indent: true },
        { label: "Total liabilities", values: v(r => r.ap + r.debtClosing + r.slClosing), bold: true },
    ]},
    { title: "Equity", rows: [
        { label: "Paid-in equity", values: v(r => r.paidInEquity), indent: true },
        { label: "Retained earnings", values: v(r => r.retainedEarnings), indent: true },
        { label: "Total equity", values: v(r => r.paidInEquity + r.retainedEarnings), bold: true },
        { label: "Liabilities + Equity", values: v(r => r.ap + r.debtClosing + r.slClosing + r.paidInEquity + r.retainedEarnings), bold: true },
        { label: "Balance check", values: v(r => (r.cash + r.ar + r.netPPE) - (r.ap + r.debtClosing + r.slClosing + r.paidInEquity + r.retainedEarnings)) },
    ]},
  ];

  const projectIrr: Section[] = [
    { title: `Project IRR (= ${fmtPct(m.projectIRR)}) — Unlevered FCFF`, rows: [
        { label: "EBIT", values: v(r => r.ebit) },
        { label: "(−) Tax on EBIT", values: v(r => -Math.max(0, r.ebit) * I.citTaxRatePct), indent: true },
        { label: "(+) Depreciation", values: v(r => r.depreciation), indent: true },
        { label: "(+/−) Working capital Δ", values: v(r => r.workingCapDelta), indent: true },
        { label: "(−) CAPEX", values: v(r => r.capex), indent: true },
        { label: "FCFF (project)", values: v(r => r.fcff), bold: true },
    ]},
  ];
  const equityIrr: Section[] = [
    { title: `Equity IRR (= ${fmtPct(m.equityIRR)}) — Levered FCFE`, rows: [
        { label: "Net profit", values: v(r => r.netProfit) },
        { label: "(+) Depreciation", values: v(r => r.depreciation), indent: true },
        { label: "(+/−) Working capital Δ", values: v(r => r.workingCapDelta), indent: true },
        { label: "(−) Senior principal repaid", values: v(r => -r.principalRepay), indent: true },
        { label: "(−) SL principal repaid", values: v(r => -r.slPrincipalRepay), indent: true },
        { label: "(−) Equity contribution", values: v(r => r.yearIdx === -1 ? -m.paidInEquity : 0), indent: true },
        { label: "FCFE (equity)", values: v(r => r.fcfe), bold: true },
    ]},
  ];

  return (
    <div className="space-y-6">
      <ScheduleTable title="Income statement (EGP)" years={years} sections={incomeStmt}/>
      <ScheduleTable title="Debt schedule" years={years} sections={debtSched}/>
      <ScheduleTable title="Balance sheet (EGP)" years={years} sections={bs}/>
      <ScheduleTable title="Project IRR build" years={years} sections={projectIrr}/>
      <ScheduleTable title="Equity IRR build" years={years} sections={equityIrr}/>
    </div>
  );
};
