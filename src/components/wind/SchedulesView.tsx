import { Fragment } from "react";
import { ModelOutputs, fmt, fmtPct } from "@/lib/windModel";

type Section = {
  title: string;
  rows: { label: string; values: Array<number | null>; total?: number; bold?: boolean; pct?: boolean; indent?: boolean }[];
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
            {years.map(y => <th key={y} className="px-2 py-2 text-right font-mono text-muted-foreground">{y}</th>)}
          </tr>
        </thead>
        <tbody>
          {sections.map((sec, si) => (
            <Fragment key={`sec-${si}`}>
              <tr className="bg-secondary/20">
                <td colSpan={1 + years.length} className="px-3 py-1.5 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">{sec.title}</td>
              </tr>
              {sec.rows.map((r, ri) => {
                return (
                  <tr key={`r-${si}-${ri}`} className={`border-t border-border/40 hover:bg-secondary/30 ${r.bold ? "font-semibold bg-muted/30" : ""}`}>
                    <td className={`sticky left-0 bg-card px-3 py-1.5 ${r.indent ? "pl-6 text-muted-foreground" : ""}`}>{r.label}</td>
                    {r.values.map((v, vi) => (
                      <td key={vi} className="px-2 py-1.5 text-right font-mono tabular-nums">
                        {v == null ? "-" : r.pct ? (v > 0 ? fmt(v, 2) + "x" : "-") : fmt(v)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </Fragment>
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
      title: "Revenue build-up",
      rows: [
        { label: "Energy generated (MWh)", values: m.rows.map(r => r.mwh) },
        { label: "Effective tariff (USD/kWh)", values: m.rows.map(r => r.effectiveTariff * 1000), indent: true },
        { label: "Energy revenue", values: m.rows.map(r => r.revenue), indent: true },
        { label: "Carbon / CDM revenue", values: m.rows.map(r => r.carbonRevenue), indent: true },
        { label: "Total revenue", values: m.rows.map(r => r.revenue + r.carbonRevenue), bold: true },
      ],
    },
    {
      title: "Operating expenditure breakdown",
      rows: [
        { label: "Base O&M / Asset Mgmt / SPV / Insurance", values: m.rows.map(r => -r.opexBase), indent: true },
        { label: "Real-estate tax", values: m.rows.map(r => -r.opexRealEstate), indent: true },
        { label: "Other fixed (lease, aux, contingency, MIGA)", values: m.rows.map(r => -r.opexOtherFixed), indent: true },
        { label: "Major maintenance", values: m.rows.map(r => -r.opexMajorMaintenance), indent: true },
        { label: "% of revenue items", values: m.rows.map(r => -r.opexPctRevenue), indent: true },
        { label: "Additional levy", values: m.rows.map(r => -r.opexLevy), indent: true },
        { label: "Decommissioning", values: m.rows.map(r => -r.opexDecommissioning), indent: true },
        { label: "Total operating expenditure", values: m.rows.map(r => -r.opex), bold: true },
      ],
    },
    {
      title: "Operating cashflow",
      rows: [
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
        { label: "DSCR", values: m.rows.map(r => (r.debtService > 1e-3 ? r.dscr : null)), pct: true },
      ],
    },
    {
      title: "Cashflow for investors",
      rows: [
        { label: "DSRA target balance", values: m.rows.map(r => r.dsraBalance), indent: true },
        { label: "DSRA movement (funding)/release", values: m.rows.map(r => -r.dsraMovement), indent: true },
        { label: "CFFI", values: m.rows.map(r => r.cffi), bold: true },
      ],
    },
    {
      title: "Coverage ratios",
      rows: [
        { label: "DSCR (in period)", values: m.rows.map(r => (r.debtService > 1e-3 ? r.dscr : null)), pct: true },
        { label: "LLCR (loan-life)", values: m.rows.map(r => r.llcr), pct: true },
        { label: "PLCR (project-life)", values: m.rows.map(r => r.plcr), pct: true },
      ],
    },
    {
      title: "Integrity",
      rows: [
        { label: "Balance check (Assets − L+E)", values: m.rows.map(r => r.balanceCheck) },
      ],
    },
  ];
  return (
    <div className="space-y-6">
      <ScheduleTable title="Outputs — annual cashflow waterfall" years={years} sections={sections} />
      <ProjectIRRTable m={m} />
      <EquityIRRTable m={m} />
    </div>
  );
};

const IRRRundownTable = ({ title, headers, rows, footerLabel, irr }: {
  title: string;
  headers: string[];
  rows: { year: number; values: number[] }[];
  footerLabel: string;
  irr: number;
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
        <h3 className="font-semibold">{title}</h3>
        <div className="text-sm">
          <span className="text-muted-foreground mr-2">{footerLabel}:</span>
          <span className="font-mono font-semibold">{fmtPct(irr)}</span>
        </div>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
            <tr>
              <th className="px-3 py-2 text-left">Year</th>
              {headers.map(h => <th key={h} className="px-2 py-2 text-right font-mono text-muted-foreground">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-t border-border/40 hover:bg-secondary/30">
                <td className="px-3 py-1.5 font-mono">{r.year}</td>
                {r.values.map((v, vi) => (
                  <td key={vi} className={`px-2 py-1.5 text-right font-mono tabular-nums ${vi === r.values.length - 1 ? "font-semibold" : ""}`}>{fmt(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProjectIRRTable = ({ m }: { m: ModelOutputs }) => (
  <IRRRundownTable
    title="Project IRR — rundown"
    headers={["Capex (draws)", "CFADS", "DSRA movement", "Net cashflow"]}
    rows={m.projectIRRSeries.map(r => ({ year: r.year, values: [r.capex, r.cfads, r.dsraMovement, r.net] }))}
    footerLabel="Project IRR"
    irr={m.projectIRR}
  />
);

const EquityIRRTable = ({ m }: { m: ModelOutputs }) => (
  <IRRRundownTable
    title="Equity IRR — rundown"
    headers={["Equity draws", "CFFI (distributions)", "Net cashflow"]}
    rows={m.equityIRRSeries.map(r => ({ year: r.year, values: [r.equityDraw, r.cffi, r.net] }))}
    footerLabel="Blended Equity IRR"
    irr={m.equityIRR}
  />
);

export const IncomeStatementView = ({ m }: { m: ModelOutputs }) => {
  const years = m.rows.map(r => r.year);
  const sections: Section[] = [
    {
      title: "Revenue",
      rows: [
        { label: "Energy generated (MWh)", values: m.rows.map(r => r.mwh), indent: true },
        { label: "Effective tariff (USD/kWh)", values: m.rows.map(r => r.effectiveTariff * 1000), indent: true },
        { label: "Energy revenue", values: m.rows.map(r => r.revenue), indent: true },
        { label: "Carbon / CDM revenue", values: m.rows.map(r => r.carbonRevenue), indent: true },
        { label: "Total revenue", values: m.rows.map(r => r.revenue + r.carbonRevenue), bold: true },
      ],
    },
    {
      title: "Operating expenditure",
      rows: [
        { label: "Base O&M / Asset Mgmt / SPV / Insurance", values: m.rows.map(r => -r.opexBase), indent: true },
        { label: "Real-estate tax", values: m.rows.map(r => -r.opexRealEstate), indent: true },
        { label: "Other fixed (lease, aux, contingency, MIGA)", values: m.rows.map(r => -r.opexOtherFixed), indent: true },
        { label: "Major maintenance", values: m.rows.map(r => -r.opexMajorMaintenance), indent: true },
        { label: "% of revenue items", values: m.rows.map(r => -r.opexPctRevenue), indent: true },
        { label: "Additional levy", values: m.rows.map(r => -r.opexLevy), indent: true },
        { label: "Decommissioning", values: m.rows.map(r => -r.opexDecommissioning), indent: true },
        { label: "Total operating expenditure", values: m.rows.map(r => -r.opex), bold: true },
      ],
    },
    {
      title: "EBITDA & Depreciation",
      rows: [
        { label: "EBITDA", values: m.rows.map(r => r.ebitda), bold: true },
        { label: "Depreciation (PP&E + IDC)", values: m.rows.map(r => -r.depreciation), indent: true },
        { label: "EBIT", values: m.rows.map(r => r.ebit), bold: true },
      ],
    },
    {
      title: "Interest expense",
      rows: [
        { label: "Opening senior debt balance", values: m.rows.map(r => r.openingDebt), indent: true },
        { label: "Interest on senior debt", values: m.rows.map(r => -r.interest), indent: true },
        { label: "Profit before tax", values: m.rows.map(r => r.ebt), bold: true },
      ],
    },
    {
      title: "Taxes & Net income",
      rows: [
        { label: "Corporate income tax", values: m.rows.map(r => -r.tax), indent: true },
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
