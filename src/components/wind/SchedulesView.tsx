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
            <th className="sticky left-0 z-20 bg-muted/80 px-3 py-2 text-left min-w-[220px]">Item</th>
            {years.map(y => <th key={y} className="px-2 py-2 text-right font-mono text-muted-foreground">{y}</th>)}
          </tr>
        </thead>
        <tbody>
          {sections.map((sec, si) => (
            <Fragment key={`sec-${si}`}>
              <tr className="bg-secondary/20">
                <td colSpan={1 + years.length} className="px-3 py-1.5 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">{sec.title}</td>
              </tr>
              {sec.rows.map((r, ri) => (
                <tr key={`r-${si}-${ri}`} className={`border-t border-border/40 hover:bg-secondary/30 ${r.bold ? "font-semibold bg-muted/30" : ""}`}>
                  <td className={`sticky left-0 bg-card px-3 py-1.5 ${r.indent ? "pl-6 text-muted-foreground" : ""}`}>{r.label}</td>
                  {r.values.map((v, vi) => (
                    <td key={vi} className="px-2 py-1.5 text-right font-mono tabular-nums">
                      {v == null ? "-" : r.pct ? (v > 0 ? fmt(v, 2) + "x" : "-") : fmt(v)}
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

export const OutputsView = ({ m }: { m: ModelOutputs }) => {
  // Combine construction years (from m.constructionYears) with operations rows.
  const opsYears = m.rows.map(r => r.year);
  const consYears = m.constructionYears.filter(y => !opsYears.includes(y));
  const years = [...consYears, ...opsYears];
  const padCons = (vals: number[]) => [...consYears.map(() => 0), ...vals];
  const blankCons = (vals: Array<number | null>) => [...consYears.map(() => null), ...vals];

  const sections: Section[] = [
    {
      title: "Construction draws",
      rows: [
        { label: "Capex draw (USD '000)", values: [
          ...m.constructionYears.map(y => m.constructionDraws[m.constructionYears.indexOf(y)] || 0),
          ...opsYears.map(() => 0),
        ] },
        { label: "Equity draw", values: [
          ...m.constructionYears.map(y => m.equityDraws[m.constructionYears.indexOf(y)] || 0),
          ...opsYears.map(() => 0),
        ], indent: true },
        { label: "Debt draw", values: [
          ...m.constructionYears.map(y => m.debtDraws[m.constructionYears.indexOf(y)] || 0),
          ...opsYears.map(() => 0),
        ], indent: true },
      ],
    },
    {
      title: "Revenue build-up",
      rows: [
        { label: "Energy generated (MWh)", values: padCons(m.rows.map(r => r.mwh)) },
        { label: "Effective tariff (USD/kWh)", values: padCons(m.rows.map(r => r.effectiveTariff * 1000)), indent: true },
        { label: "Energy revenue", values: padCons(m.rows.map(r => r.revenue)), indent: true },
        { label: "Carbon / CDM revenue", values: padCons(m.rows.map(r => r.carbonRevenue)), indent: true },
        { label: "Total revenue", values: padCons(m.rows.map(r => r.revenue + r.carbonRevenue)), bold: true },
      ],
    },
    {
      title: "Operating expenditure breakdown",
      rows: [
        { label: "Base O&M / Asset Mgmt / SPV / Insurance", values: padCons(m.rows.map(r => -r.opexBase)), indent: true },
        { label: "Real-estate tax", values: padCons(m.rows.map(r => -r.opexRealEstate)), indent: true },
        { label: "Other fixed (lease, aux, contingency, MIGA)", values: padCons(m.rows.map(r => -r.opexOtherFixed)), indent: true },
        { label: "Major maintenance", values: padCons(m.rows.map(r => -r.opexMajorMaintenance)), indent: true },
        { label: "% of revenue items", values: padCons(m.rows.map(r => -r.opexPctRevenue)), indent: true },
        { label: "Additional levy", values: padCons(m.rows.map(r => -r.opexLevy)), indent: true },
        { label: "Decommissioning", values: padCons(m.rows.map(r => -r.opexDecommissioning)), indent: true },
        { label: "Total operating expenditure", values: padCons(m.rows.map(r => -r.opex)), bold: true },
      ],
    },
    {
      title: "Operating cashflow",
      rows: [
        { label: "EBITDA", values: padCons(m.rows.map(r => r.ebitda)), bold: true },
        { label: "Tax", values: padCons(m.rows.map(r => -r.tax)) },
        { label: "Working capital adjustments", values: padCons(m.rows.map(r => r.workingCapitalChange)) },
        { label: "CFADS", values: padCons(m.rows.map(r => r.cfads)), bold: true },
      ],
    },
    {
      title: "Debt service",
      rows: [
        { label: "Opening debt", values: padCons(m.rows.map(r => r.openingDebt)) },
        { label: "Interest", values: padCons(m.rows.map(r => -r.interest)), indent: true },
        { label: "Principal", values: padCons(m.rows.map(r => -r.principal)), indent: true },
        { label: "Total debt service", values: padCons(m.rows.map(r => -r.debtService)), bold: true },
        { label: "Closing debt", values: padCons(m.rows.map(r => r.closingDebt)) },
        { label: "DSCR", values: blankCons(m.rows.map(r => (r.debtService > 1e-3 ? r.dscr : null))), pct: true },
      ],
    },
    {
      title: "Cashflow for investors",
      rows: [
        { label: "DSRA target balance", values: padCons(m.rows.map(r => r.dsraBalance)), indent: true },
        { label: "DSRA movement (funding)/release", values: padCons(m.rows.map(r => -r.dsraMovement)), indent: true },
        { label: "CFFI", values: padCons(m.rows.map(r => r.cffi)), bold: true },
      ],
    },
    {
      title: "Coverage ratios",
      rows: [
        { label: "DSCR (in period)", values: blankCons(m.rows.map(r => (r.debtService > 1e-3 ? r.dscr : null))), pct: true },
        { label: "LLCR (loan-life)", values: blankCons(m.rows.map(r => r.llcr || null)), pct: true },
        { label: "PLCR (project-life)", values: blankCons(m.rows.map(r => r.plcr || null)), pct: true },
      ],
    },
    {
      title: "Integrity",
      rows: [
        { label: "Balance check (Assets − L+E)", values: padCons(m.rows.map(r => r.balanceCheck)) },
      ],
    },
  ];
  return (
    <div className="space-y-6">
      <ScheduleTable title="Outputs — annual cashflow waterfall (incl. construction)" years={years} sections={sections} />
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
}) => (
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

// ────────────────────────────────────────────────────────────────────────────
// Combined Statements view: Income Statement + detailed Balance Sheet
// ────────────────────────────────────────────────────────────────────────────
export const StatementsView = ({ m }: { m: ModelOutputs }) => {
  const years = m.rows.map(r => r.year);
  const I = m.inputs;

  const isSections: Section[] = [
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

  // ── Detailed Balance Sheet ──
  // Recompute extra BS lines by tracking accumulated depreciation, paid-in capital
  // implied by the sources of funds, retained earnings, and DSRA explicitly.
  const grossPpeAtCOD = m.rows[0] ? m.rows[0].ppe + m.rows[0].depreciation : 0; // pre-Y1 depreciation
  // Accumulated depreciation each year = grossPPE - net PPE
  const accDep = m.rows.map(r => Math.max(0, grossPpeAtCOD - r.ppe));
  const netPpe = m.rows.map(r => r.ppe);
  const cashOps = m.rows.map(r => r.cash);
  const dsraBal = m.rows.map(r => r.dsraBalance);
  const recv = m.rows.map(r => r.receivables);
  const payables = m.rows.map(r => r.payables);
  const debt = m.rows.map(r => r.closingDebt);
  const totalEquityBook = m.rows.map(r => r.equity);
  const paidInCapital = m.equityAmount; // initial paid-in (common + pref + SH loan combined as equity book)
  const retainedEarnings = totalEquityBook.map(eq => eq - paidInCapital);

  const totalAssets = m.rows.map((_, i) => netPpe[i] + cashOps[i] + dsraBal[i] + recv[i]);
  const totalLE = m.rows.map((_, i) => debt[i] + payables[i] + totalEquityBook[i]);

  const bsSections: Section[] = [
    {
      title: "Non-current assets",
      rows: [
        { label: "Gross PP&E (incl. capitalised IDC & fees)", values: m.rows.map(() => grossPpeAtCOD), indent: true },
        { label: "Accumulated depreciation", values: accDep.map(v => -v), indent: true },
        { label: "Net PP&E", values: netPpe, bold: true },
      ],
    },
    {
      title: "Current assets",
      rows: [
        { label: "Cash & equivalents (operations)", values: cashOps, indent: true },
        { label: "Debt service reserve account (DSRA)", values: dsraBal, indent: true },
        { label: "Trade receivables", values: recv, indent: true },
        { label: "Total current assets", values: m.rows.map((_, i) => cashOps[i] + dsraBal[i] + recv[i]), bold: true },
      ],
    },
    {
      title: "TOTAL ASSETS",
      rows: [
        { label: "Total assets", values: totalAssets, bold: true },
      ],
    },
    {
      title: "Equity",
      rows: [
        { label: "Paid-in capital (common + pref + SH loan)", values: m.rows.map(() => paidInCapital), indent: true },
        { label: "  of which common equity", values: m.rows.map(() => m.commonEquityAmount), indent: true },
        { label: "  of which preferential equity", values: m.rows.map(() => m.prefEquityAmount), indent: true },
        { label: "  of which shareholder loan", values: m.rows.map(() => m.shLoanAmount), indent: true },
        { label: "Retained earnings (cumulative)", values: retainedEarnings, indent: true },
        { label: "Total equity (book)", values: totalEquityBook, bold: true },
      ],
    },
    {
      title: "Non-current liabilities",
      rows: [
        { label: "Senior debt (long-term portion)", values: debt.map((d, i) => {
            const principalNextY = i + 1 < m.rows.length ? m.rows[i + 1].principal : d;
            return Math.max(0, d - principalNextY);
          }), indent: true },
        { label: "Total non-current liabilities", values: debt.map((d, i) => {
            const principalNextY = i + 1 < m.rows.length ? m.rows[i + 1].principal : d;
            return Math.max(0, d - principalNextY);
          }), bold: true },
      ],
    },
    {
      title: "Current liabilities",
      rows: [
        { label: "Senior debt — current portion (next year principal)", values: m.rows.map((_, i) => i + 1 < m.rows.length ? m.rows[i + 1].principal : 0), indent: true },
        { label: "Trade payables", values: payables, indent: true },
        { label: "Tax payable (accrued)", values: m.rows.map(r => Math.max(0, r.tax * (I.taxBalanceMonths / 12))), indent: true },
        { label: "Total current liabilities", values: m.rows.map((r, i) =>
            (i + 1 < m.rows.length ? m.rows[i + 1].principal : 0) + r.payables + Math.max(0, r.tax * (I.taxBalanceMonths / 12))), bold: true },
      ],
    },
    {
      title: "TOTAL LIABILITIES & EQUITY",
      rows: [
        { label: "Total liabilities & equity", values: totalLE, bold: true },
        { label: "Balance check (A − L+E)", values: m.rows.map(r => r.balanceCheck) },
      ],
    },
    {
      title: "Memo — financial structure",
      rows: [
        { label: "Debt-to-equity ratio (closing)", values: m.rows.map((_, i) => totalEquityBook[i] > 0 ? debt[i] / totalEquityBook[i] : 0), pct: true },
        { label: "Net debt / EBITDA", values: m.rows.map((r, i) => r.ebitda > 0 ? (debt[i] - cashOps[i]) / r.ebitda : 0), pct: true },
        { label: "Working capital", values: m.rows.map((_, i) => recv[i] - payables[i]) },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <ScheduleTable title="IFS — Income statement" years={years} sections={isSections} />
      <ScheduleTable title="AFS — Balance sheet (year-end, detailed)" years={years} sections={bsSections} />
    </div>
  );
};

// Back-compat re-exports (in case anything still imports them)
export const IncomeStatementView = ({ m }: { m: ModelOutputs }) => <StatementsView m={m}/>;
export const BalanceSheetView = ({ m }: { m: ModelOutputs }) => <StatementsView m={m}/>;
