import { Fragment } from "react";
import { PvOutputs, fmtNum } from "@/lib/pvModel";

type Section = {
  title: string;
  rows: { label: string; values: Array<number | null>; bold?: boolean; indent?: boolean; pct?: boolean; d?: number }[];
};

const ScheduleTable = ({ title, years, sections }: { title: string; years: number[]; sections: Section[] }) => (
  <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
    <div className="border-b border-border bg-secondary/40 px-5 py-3">
      <h3 className="font-semibold">{title}</h3>
    </div>
    <div className="max-h-[560px] overflow-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
          <tr>
            <th className="sticky left-0 z-20 bg-muted/80 px-3 py-2 text-left min-w-[240px]">Item</th>
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
                      {v == null ? "-" : r.pct ? `${fmtNum(v, 2)}x` : fmtNum(v, r.d ?? 0)}
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

export const PvOutput = ({ m }: { m: PvOutputs }) => {
  const years = m.rows.map(r => r.year);
  const v = (fn: (r: typeof m.rows[number]) => number | null) => m.rows.map(fn);

  const opsSections: Section[] = [
    {
      title: "Production & Revenue",
      rows: [
        { label: "Energy generated (kWh)", values: v(r => r.energyKwh) },
        { label: "Effective tariff (EGP/kWh)", values: v(r => r.tariffEgp), d: 3, indent: true },
        { label: "Revenue", values: v(r => r.revenue), bold: true },
      ],
    },
    {
      title: "Operating costs",
      rows: [
        { label: "Maintenance / O&M", values: v(r => -r.maintenance), indent: true },
        { label: "Insurance", values: v(r => -r.insurance), indent: true },
        { label: "Replacement", values: v(r => -r.replacement), indent: true },
        { label: "Rent", values: v(r => -r.rent), indent: true },
        { label: "Usufruct / land fee", values: v(r => -r.usufruct), indent: true },
        { label: "Total OPEX", values: v(r => -r.opex), bold: true },
        { label: "EBITDA", values: v(r => r.ebitda), bold: true },
      ],
    },
    {
      title: "Profit & loss",
      rows: [
        { label: "Depreciation", values: v(r => -r.depreciation), indent: true },
        { label: "EBIT", values: v(r => r.ebit), bold: true },
        { label: "Interest expense", values: v(r => -r.interest), indent: true },
        { label: "Taxable income (EBT)", values: v(r => r.ebt) },
        { label: "Income tax", values: v(r => -r.tax), indent: true },
        { label: "Net profit", values: v(r => r.netProfit), bold: true },
      ],
    },
    {
      title: "Debt schedule",
      rows: [
        { label: "Opening balance", values: v(r => r.debtOpening) },
        { label: "Draw", values: v(r => r.debtDraw), indent: true },
        { label: "Principal repayment", values: v(r => -r.principalRepay), indent: true },
        { label: "Interest", values: v(r => -r.interest), indent: true },
        { label: "Closing balance", values: v(r => r.debtClosing), bold: true },
        { label: "All-in rate (annual)", values: v(r => r.rate * 100), d: 2, indent: true },
        { label: "DSCR (CFADS / Debt service)", values: v(r => isFinite(r.dscr) ? r.dscr : null), pct: true, bold: true },
      ],
    },
    {
      title: "Cashflows",
      rows: [
        { label: "CAPEX", values: v(r => r.capex) },
        { label: "Working capital Δ", values: v(r => r.workingCapDelta), indent: true },
        { label: "FCFF (project)", values: v(r => r.fcff), bold: true },
        { label: "FCFE (equity)", values: v(r => r.fcfe), bold: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <ScheduleTable title="Operating schedule (EGP)" years={years} sections={opsSections} />
    </div>
  );
};
