import { ModelOutputs, fmt, fmtPct } from "@/lib/windModel";

type Section = {
  title: string;
  rows: { label: string; values: number[]; total?: number; bold?: boolean; pct?: boolean; indent?: boolean }[];
};

const ScheduleTable = ({ title, years, sections }: { title: string; years: number[]; sections: Section[] }) => (
  <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
    <div className="border-b border-border bg-secondary/40 px-5 py-3">
      <h3 className="font-semibold">{title}</h3>
    </div>
    <div className="max-h-[520px] overflow-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
          <tr>
            <th className="sticky left-0 z-20 bg-muted/80 px-3 py-2 text-left min-w-[200px]">Item</th>
            <th className="px-2 py-2 text-right font-mono">Total</th>
            {years.map(y => <th key={y} className="px-2 py-2 text-right font-mono text-muted-foreground">{y}</th>)}
          </tr>
        </thead>
        <tbody>
          {sections.map((sec, si) => (
            <>
              <tr key={`s-${si}`} className="bg-secondary/20">
                <td colSpan={2 + years.length} className="px-3 py-1.5 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">{sec.title}</td>
              </tr>
              {sec.rows.map((r, ri) => {
                const total = r.total ?? r.values.reduce((a, b) => a + b, 0);
                return (
                  <tr key={`r-${si}-${ri}`} className={`border-t border-border/40 hover:bg-secondary/30 ${r.bold ? "font-semibold bg-muted/30" : ""}`}>
                    <td className={`sticky left-0 bg-card px-3 py-1.5 ${r.indent ? "pl-6 text-muted-foreground" : ""}`}>{r.label}</td>
                    <td className="px-2 py-1.5 text-right font-mono tabular-nums">{r.pct ? fmtPct(total / r.values.length) : fmt(total)}</td>
                    {r.values.map((v, vi) => (
                      <td key={vi} className="px-2 py-1.5 text-right font-mono tabular-nums">
                        {r.pct ? (v > 0 ? fmt(v, 2) + "x" : "-") : fmt(v)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const OutputsView = ({ m }: { m: ModelOutputs }) => {
  const years = m.rows.map(r => r.year);
  const sections: Section[] = [
    {
      title: "Operating cashflow",
      rows: [
        { label: "Revenue", values: m.rows.map(r => r.revenue) },
        { label: "Operating expenditure", values: m.rows.map(r => -r.opex) },
        { label: "EBITDA", values: m.rows.map(r => r.ebitda), bold: true },
        { label: "Tax", values: m.rows.map(r => -r.tax) },
        { label: "Working capital adjustments", values: m.rows.map(r => r.workingCapitalChange) },
        { label: "CFADS", values: m.rows.map(r => r.cfads), bold: true },
      ],
    },
    {
      title: "Debt service",
      rows: [
        { label: "Opening debt", values: m.rows.map(r => r.openingDebt) },
        { label: "Interest", values: m.rows.map(r => -r.interest), indent: true },
        { label: "Principal", values: m.rows.map(r => -r.principal), indent: true },
        { label: "Total debt service", values: m.rows.map(r => -r.debtService), bold: true },
        { label: "Closing debt", values: m.rows.map(r => r.closingDebt) },
        { label: "DSCR", values: m.rows.map(r => r.dscr), pct: true },
      ],
    },
    {
      title: "Cashflow for investors",
      rows: [
        { label: "CFFI", values: m.rows.map(r => r.cffi), bold: true },
      ],
    },
  ];
  return <ScheduleTable title="Outputs — annual cashflow waterfall" years={years} sections={sections} />;
};

export const IncomeStatementView = ({ m }: { m: ModelOutputs }) => {
  const years = m.rows.map(r => r.year);
  const sections: Section[] = [
    {
      title: "Income statement",
      rows: [
        { label: "Revenue", values: m.rows.map(r => r.revenue) },
        { label: "Operating expenditure", values: m.rows.map(r => -r.opex) },
        { label: "EBITDA", values: m.rows.map(r => r.ebitda), bold: true },
        { label: "Depreciation", values: m.rows.map(r => -r.depreciation) },
        { label: "EBIT", values: m.rows.map(r => r.ebit), bold: true },
        { label: "Interest expense", values: m.rows.map(r => -r.interest) },
        { label: "Profit before tax", values: m.rows.map(r => r.ebt), bold: true },
        { label: "Tax", values: m.rows.map(r => -r.tax) },
        { label: "Net income", values: m.rows.map(r => r.netIncome), bold: true },
      ],
    },
  ];
  return <ScheduleTable title="IFS — Income statement" years={years} sections={sections} />;
};

export const BalanceSheetView = ({ m }: { m: ModelOutputs }) => {
  const years = m.rows.map(r => r.year);
  const sections: Section[] = [
    {
      title: "Assets",
      rows: [
        { label: "PP&E (net)", values: m.rows.map(r => r.ppe) },
        { label: "Receivables", values: m.rows.map(r => r.receivables), indent: true },
        { label: "Cash (cumulative distributable)", values: m.rows.map(r => r.cash), indent: true },
      ],
    },
    {
      title: "Liabilities & Equity",
      rows: [
        { label: "Senior debt outstanding", values: m.rows.map(r => r.closingDebt) },
        { label: "Payables", values: m.rows.map(r => r.payables), indent: true },
        { label: "Equity (book)", values: m.rows.map(r => r.equity) },
      ],
    },
  ];
  return <ScheduleTable title="AFS — Balance sheet (year-end)" years={years} sections={sections} />;
};
