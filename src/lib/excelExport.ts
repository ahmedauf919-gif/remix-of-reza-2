// Generic live-formula Excel exporter for all 4 project finance models.
// Strategy:
//   - "Inputs" sheet: every assumption (label + editable value).
//   - "Schedule" sheet: years across columns. Operating drivers (revenue, opex
//     components, depreciation, interest, capex, debt/SL draws & repayments)
//     are seeded from the solved model as BLUE editable cells. Every derived
//     line (EBITDA, EBIT, EBT, Tax, NP, CFADS, FCFF, FCFE, debt closing,
//     SL closing, DSCR) is an Excel FORMULA referencing the cells above.
//   - "Income Statement", "Balance Sheet", "Cash Flow" sheets: pure formulas
//     linking back to Schedule.
//   - "Returns" sheet: =IRR / =NPV / DSCR stats from Schedule.
// This means editing any operating driver in Excel re-flows the entire model.
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

type AnyRow = Record<string, number>;

interface RowDef {
  /** Schedule row label (column A) */
  label: string;
  /** Group / section header above (rendered as bold band) */
  section?: string;
  /** Number format for the row */
  fmt?: string;
  /** How to populate each year cell */
  kind: "input" | "formula" | "header" | "blank";
  /** For input rows: function returning the seed numeric value for year y (0-indexed) */
  value?: (y: number) => number;
  /** For formula rows: function returning the Excel formula (without leading "=") for year y. `ref(rowKey)` returns the cell address (e.g. "D7") of another row in the same year column. */
  formula?: (y: number, ref: (key: string) => string) => string;
  /** Stable key used by other rows to reference this row */
  key: string;
  /** Bold styling */
  bold?: boolean;
  /** Indent (spaces) */
  indent?: number;
}

export interface ExcelExportSpec {
  fileName: string;
  projectName: string;
  modelLabel: string;
  inputs: { label: string; value: number | string; group?: string; fmt?: string }[];
  /** Number of operating years (columns) */
  years: number;
  /** Header values for each year (e.g. 1, 2, 3 ... or fiscal year) */
  yearLabels: number[];
  /** Schedule definition */
  rows: RowDef[];
  /** Discount rate for NPVs (decimal). */
  discountRate: number;
  /** Optional: include construction year cashflow for IRR (negative capex + equity). If provided, used as Year 0 for IRR series. */
  initialEquity?: number;
  initialDebt?: number;
  initialCapex?: number;
}

const FMT = {
  num0: "#,##0;(#,##0);-",
  num2: "#,##0.00;(#,##0.00);-",
  pct: "0.0%;(0.0%);-",
  ratio: "0.00\"x\"",
  money: "#,##0;(#,##0);-",
};

const BLUE = { argb: "FF0000FF" };
const BLACK = { argb: "FF000000" };
const GREEN = { argb: "FF008000" };
const HEADER_FILL = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FF1F4E78" } };
const SECTION_FILL = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFD9E1F2" } };

function colLetter(idx: number): string {
  // 1-indexed
  let s = "";
  let n = idx;
  while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

export async function exportProjectFinanceExcel(spec: ExcelExportSpec) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Project Finance Models";
  wb.created = new Date();

  // ─────────────── Inputs sheet ───────────────
  const wsI = wb.addWorksheet("Inputs", { views: [{ state: "frozen", ySplit: 3 }] });
  wsI.columns = [
    { width: 56 }, { width: 22 }, { width: 18 },
  ];
  wsI.getCell("A1").value = `${spec.modelLabel} — ${spec.projectName}`;
  wsI.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  wsI.getCell("A1").fill = HEADER_FILL;
  wsI.mergeCells("A1:C1");
  wsI.getCell("A2").value = "Editable assumptions (blue = input, black = derived)";
  wsI.getCell("A2").font = { italic: true, color: { argb: "FF666666" } };
  wsI.mergeCells("A2:C2");
  wsI.getRow(3).values = ["Assumption", "Value", "Group"];
  wsI.getRow(3).font = { bold: true };
  wsI.getRow(3).fill = SECTION_FILL;

  const inputAddr: Record<string, string> = {};
  let r = 4;
  let curGroup = "";
  for (const inp of spec.inputs) {
    if (inp.group && inp.group !== curGroup) {
      curGroup = inp.group;
      wsI.getCell(`A${r}`).value = curGroup;
      wsI.getCell(`A${r}`).font = { bold: true };
      wsI.getCell(`A${r}`).fill = SECTION_FILL;
      wsI.mergeCells(`A${r}:C${r}`);
      r++;
    }
    wsI.getCell(`A${r}`).value = inp.label;
    wsI.getCell(`B${r}`).value = inp.value;
    wsI.getCell(`B${r}`).font = { color: BLUE };
    if (typeof inp.value === "number") wsI.getCell(`B${r}`).numFmt = inp.fmt ?? FMT.num2;
    wsI.getCell(`C${r}`).value = inp.group ?? "";
    wsI.getCell(`C${r}`).font = { color: { argb: "FF888888" }, italic: true };
    inputAddr[inp.label] = `Inputs!$B$${r}`;
    r++;
  }

  // ─────────────── Schedule sheet ───────────────
  const wsS = wb.addWorksheet("Schedule", { views: [{ state: "frozen", ySplit: 4, xSplit: 1 }] });
  // Column A label, then one col per year
  const cols: Partial<ExcelJS.Column>[] = [{ width: 38 }];
  for (let y = 0; y < spec.years; y++) cols.push({ width: 14 });
  wsS.columns = cols;

  wsS.getCell("A1").value = `${spec.modelLabel} — Operating Schedule`;
  wsS.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  wsS.getCell("A1").fill = HEADER_FILL;
  wsS.mergeCells(1, 1, 1, spec.years + 1);

  wsS.getCell("A3").value = "Year #";
  wsS.getCell("A4").value = "Calendar Year";
  for (let y = 0; y < spec.years; y++) {
    const c = colLetter(2 + y);
    wsS.getCell(`${c}3`).value = y + 1;
    wsS.getCell(`${c}4`).value = spec.yearLabels[y];
  }
  wsS.getRow(3).font = { bold: true };
  wsS.getRow(4).font = { bold: true };
  wsS.getRow(3).fill = SECTION_FILL;
  wsS.getRow(4).fill = SECTION_FILL;

  // Map row key → sheet row number
  const rowMap: Record<string, number> = {};
  let cur = 5;
  for (const rd of spec.rows) {
    if (rd.section) {
      wsS.getCell(`A${cur}`).value = rd.section;
      wsS.getCell(`A${cur}`).font = { bold: true, color: { argb: "FFFFFFFF" } };
      wsS.getCell(`A${cur}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF305496" } };
      wsS.mergeCells(cur, 1, cur, spec.years + 1);
      cur++;
    }
    rowMap[rd.key] = cur;
    const labelCell = wsS.getCell(`A${cur}`);
    labelCell.value = (rd.indent ? " ".repeat(rd.indent) : "") + rd.label;
    if (rd.bold) labelCell.font = { bold: true };
    if (rd.kind === "blank") { cur++; continue; }
    for (let y = 0; y < spec.years; y++) {
      const c = colLetter(2 + y);
      const cell = wsS.getCell(`${c}${cur}`);
      const fmt = rd.fmt ?? FMT.num0;
      cell.numFmt = fmt;
      if (rd.kind === "input" && rd.value) {
        cell.value = rd.value(y);
        cell.font = { color: BLUE, ...(rd.bold ? { bold: true } : {}) };
      } else if (rd.kind === "formula" && rd.formula) {
        const ref = (k: string) => `${c}${rowMap[k] ?? cur}`;
        cell.value = { formula: rd.formula(y, ref) } as ExcelJS.CellFormulaValue;
        cell.font = { color: BLACK, ...(rd.bold ? { bold: true } : {}) };
      }
    }
    cur++;
  }

  // ─────────────── Returns sheet ───────────────
  const wsR = wb.addWorksheet("Returns");
  wsR.columns = [{ width: 38 }, { width: 18 }];
  wsR.getCell("A1").value = "Returns & Coverage";
  wsR.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  wsR.getCell("A1").fill = HEADER_FILL;
  wsR.mergeCells("A1:B1");

  const fcffRow = rowMap["fcff"];
  const fcfeRow = rowMap["fcfe"];
  const cfadsRow = rowMap["cfads"];
  const dsRow = rowMap["debtService"];
  const dscrRow = rowMap["dscr"];
  const lastCol = colLetter(spec.years + 1);

  let rr = 3;
  const put = (label: string, formula: string, fmt = FMT.pct) => {
    wsR.getCell(`A${rr}`).value = label;
    wsR.getCell(`B${rr}`).value = { formula } as ExcelJS.CellFormulaValue;
    wsR.getCell(`B${rr}`).numFmt = fmt;
    wsR.getCell(`B${rr}`).font = { bold: true, color: GREEN };
    rr++;
  };

  // Build IRR series: include initial outflow as year 0 if provided.
  if (fcffRow) {
    if (spec.initialCapex && spec.initialCapex !== 0) {
      // Put -initialCapex in Returns!B and reference it
      wsR.getCell(`A${rr}`).value = "Year 0 net (capex outflow)";
      wsR.getCell(`B${rr}`).value = -Math.abs(spec.initialCapex);
      wsR.getCell(`B${rr}`).numFmt = FMT.num0;
      wsR.getCell(`B${rr}`).font = { color: BLUE };
      const t0 = `Returns!$B$${rr}`;
      rr++;
      put("Project IRR (FCFF)", `IRR(({${t0}};TRANSPOSE(Schedule!B${fcffRow}:${lastCol}${fcffRow})))`);
      // Fallback simpler formula (Excel desktop doesn't support {a;b}). Use a helper area instead:
      // We'll write the year-0 value into Schedule! at a hidden cell? Simpler: put the cashflow series on Returns sheet and IRR over it.
      rr--; // rewind, replace approach
      // Replace by laying out the CF series horizontally on Returns row N:
      const seriesRow = rr + 1;
      wsR.getCell(`A${rr}`).value = "FCFF series (incl. Yr 0)";
      const sCols: string[] = [];
      for (let y = 0; y <= spec.years; y++) {
        const c = colLetter(2 + y);
        if (y === 0) {
          wsR.getCell(`${c}${rr}`).value = -Math.abs(spec.initialCapex);
        } else {
          wsR.getCell(`${c}${rr}`).value = { formula: `Schedule!${colLetter(1 + y)}${fcffRow}` } as ExcelJS.CellFormulaValue;
        }
        wsR.getCell(`${c}${rr}`).numFmt = FMT.num0;
        sCols.push(`${c}${rr}`);
      }
      const range = `${sCols[0]}:${sCols[sCols.length - 1]}`;
      rr += 2;
      put("Project IRR (FCFF)", `IFERROR(IRR(${range}),"n/a")`);
      put("NPV @ WACC (FCFF)", `NPV(${spec.discountRate},${sCols.slice(1).join(",")})+${sCols[0]}`, FMT.num0);
    } else {
      put("Project IRR (FCFF, ops only)", `IFERROR(IRR(Schedule!B${fcffRow}:${lastCol}${fcffRow}),"n/a")`);
      put("NPV (ops only)", `NPV(${spec.discountRate},Schedule!B${fcffRow}:${lastCol}${fcffRow})`, FMT.num0);
    }
  }
  if (fcfeRow) {
    if (spec.initialEquity && spec.initialEquity !== 0) {
      const seriesRow = rr;
      wsR.getCell(`A${rr}`).value = "FCFE series (incl. Yr 0)";
      const sCols: string[] = [];
      for (let y = 0; y <= spec.years; y++) {
        const c = colLetter(2 + y);
        if (y === 0) wsR.getCell(`${c}${rr}`).value = -Math.abs(spec.initialEquity);
        else wsR.getCell(`${c}${rr}`).value = { formula: `Schedule!${colLetter(1 + y)}${fcfeRow}` } as ExcelJS.CellFormulaValue;
        wsR.getCell(`${c}${rr}`).numFmt = FMT.num0;
        sCols.push(`${c}${rr}`);
      }
      const range = `${sCols[0]}:${sCols[sCols.length - 1]}`;
      rr++;
      put("Equity IRR (FCFE)", `IFERROR(IRR(${range}),"n/a")`);
    }
  }
  if (dscrRow) {
    put("Min DSCR", `MIN(Schedule!B${dscrRow}:${lastCol}${dscrRow})`, FMT.ratio);
    put("Avg DSCR", `AVERAGE(Schedule!B${dscrRow}:${lastCol}${dscrRow})`, FMT.ratio);
  }

  // ─────────────── Income Statement sheet (formulas → Schedule) ───────────────
  buildLinkedStatement(wb, "Income Statement", spec, rowMap, [
    "revenue", "opex", "ebitda", "depreciation", "ebit", "interest", "slInterest", "ebt", "tax", "netProfit",
  ]);

  // ─────────────── Cash Flow sheet ───────────────
  buildLinkedStatement(wb, "Cash Flow", spec, rowMap, [
    "ebitda", "tax", "workingCapDelta", "cfads", "interest", "principalRepay", "fcfe", "capex", "fcff",
  ]);

  // ─────────────── Balance Sheet sheet ───────────────
  buildLinkedStatement(wb, "Balance Sheet", spec, rowMap, [
    "cash", "ar", "netPPE", "totalAssets", "ap", "debtClosing", "slClosing", "totalLiab", "paidInEquity", "retainedEarnings", "totalEquity",
  ]);

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), spec.fileName);
}

function buildLinkedStatement(
  wb: ExcelJS.Workbook,
  name: string,
  spec: ExcelExportSpec,
  rowMap: Record<string, number>,
  keys: string[],
) {
  const ws = wb.addWorksheet(name, { views: [{ state: "frozen", ySplit: 3, xSplit: 1 }] });
  const cols: Partial<ExcelJS.Column>[] = [{ width: 30 }];
  for (let y = 0; y < spec.years; y++) cols.push({ width: 14 });
  ws.columns = cols;
  ws.getCell("A1").value = name;
  ws.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  ws.getCell("A1").fill = HEADER_FILL;
  ws.mergeCells(1, 1, 1, spec.years + 1);
  ws.getCell("A3").value = "Year";
  for (let y = 0; y < spec.years; y++) {
    ws.getCell(`${colLetter(2 + y)}3`).value = y + 1;
  }
  ws.getRow(3).font = { bold: true };
  ws.getRow(3).fill = SECTION_FILL;

  let rr = 4;
  for (const k of keys) {
    const sourceRow = rowMap[k];
    if (!sourceRow) continue;
    // Read label from Schedule sheet row
    const schedSheet = wb.getWorksheet("Schedule")!;
    const lbl = schedSheet.getCell(`A${sourceRow}`).value as string;
    ws.getCell(`A${rr}`).value = lbl?.toString().trim() ?? k;
    for (let y = 0; y < spec.years; y++) {
      const c = colLetter(2 + y);
      ws.getCell(`${c}${rr}`).value = { formula: `Schedule!${c}${sourceRow}` } as ExcelJS.CellFormulaValue;
      ws.getCell(`${c}${rr}`).numFmt = FMT.num0;
      ws.getCell(`${c}${rr}`).font = { color: GREEN };
    }
    rr++;
  }
}

// ───────────────────────────────────────────────────────────────────
// Helpers to build a standard set of rows for any of the 4 models.
// ───────────────────────────────────────────────────────────────────

export interface StandardRowSeed {
  /** revenue per year */ revenue: (y: number) => number;
  /** total opex per year (positive) */ opex: (y: number) => number;
  /** depreciation per year */ depreciation: (y: number) => number;
  /** senior interest expense per year */ interest: (y: number) => number;
  /** SL interest per year (0 if none) */ slInterest: (y: number) => number;
  /** corporate tax per year */ tax: (y: number) => number;
  /** capex during ops (replacement) per year */ capex: (y: number) => number;
  /** senior debt drawdown per year (in ops, usually 0) */ debtDraw: (y: number) => number;
  /** senior principal repayment per year */ principalRepay: (y: number) => number;
  /** SL drawdown per year */ slDraw: (y: number) => number;
  /** SL principal repayment per year */ slPrincipalRepay: (y: number) => number;
  /** working capital delta (use of cash if positive) per year */ workingCapDelta: (y: number) => number;
  /** opening senior debt at year 1 (= debtAmount) */ debtOpeningY1: number;
  /** opening SL at year 1 */ slOpeningY1: number;
  /** balance sheet seeds */
  ar: (y: number) => number;
  ap: (y: number) => number;
  netPPE: (y: number) => number;
  cash: (y: number) => number;
  paidInEquity: (y: number) => number;
  retainedEarnings: (y: number) => number;
}

export function buildStandardRows(seed: StandardRowSeed): RowDef[] {
  return [
    { key: "revenue", label: "Revenue", section: "INCOME STATEMENT", kind: "input", value: seed.revenue, bold: true },
    { key: "opex", label: "Operating Expenses", kind: "input", value: y => -Math.abs(seed.opex(y)) },
    { key: "ebitda", label: "EBITDA", kind: "formula", formula: (y, ref) => `${ref("revenue")}+${ref("opex")}`, bold: true },
    { key: "depreciation", label: "Depreciation & Amortisation", kind: "input", value: y => -Math.abs(seed.depreciation(y)) },
    { key: "ebit", label: "EBIT", kind: "formula", formula: (y, ref) => `${ref("ebitda")}+${ref("depreciation")}`, bold: true },
    { key: "interest", label: "Senior Interest Expense", kind: "input", value: y => -Math.abs(seed.interest(y)) },
    { key: "slInterest", label: "Shareholder Loan Interest", kind: "input", value: y => -Math.abs(seed.slInterest(y)) },
    { key: "ebt", label: "EBT", kind: "formula", formula: (y, ref) => `${ref("ebit")}+${ref("interest")}+${ref("slInterest")}`, bold: true },
    { key: "tax", label: "Corporate Tax", kind: "input", value: y => -Math.abs(seed.tax(y)) },
    { key: "netProfit", label: "Net Profit", kind: "formula", formula: (y, ref) => `${ref("ebt")}+${ref("tax")}`, bold: true },

    { key: "capex", label: "CAPEX (replacement / MM)", section: "CASH FLOW", kind: "input", value: y => -Math.abs(seed.capex(y)) },
    { key: "workingCapDelta", label: "Δ Working Capital", kind: "input", value: y => -Math.abs(seed.workingCapDelta(y)) },
    { key: "cfads", label: "CFADS (EBITDA − Tax − ΔWC)", kind: "formula", formula: (y, ref) => `${ref("ebitda")}+${ref("tax")}+${ref("workingCapDelta")}`, bold: true },

    { key: "debtDraw", label: "Senior Debt Drawdown", section: "FINANCING", kind: "input", value: seed.debtDraw },
    { key: "principalRepay", label: "Senior Principal Repayment", kind: "input", value: y => -Math.abs(seed.principalRepay(y)) },
    { key: "slDraw", label: "Shareholder Loan Drawdown", kind: "input", value: seed.slDraw },
    { key: "slPrincipalRepay", label: "SL Principal Repayment", kind: "input", value: y => -Math.abs(seed.slPrincipalRepay(y)) },

    { key: "fcff", label: "FCFF (CFADS + CAPEX)", section: "FREE CASH FLOWS", kind: "formula", formula: (y, ref) => `${ref("cfads")}+${ref("capex")}`, bold: true },
    { key: "fcfe", label: "FCFE (FCFF + Net Debt + Net SL + Interest)", kind: "formula", formula: (y, ref) =>
      `${ref("fcff")}+${ref("debtDraw")}+${ref("principalRepay")}+${ref("slDraw")}+${ref("slPrincipalRepay")}+${ref("interest")}+${ref("slInterest")}`, bold: true },

    { key: "debtOpening", label: "Senior Debt — Opening", section: "DEBT BALANCES", kind: "formula", formula: (y, ref) => {
      if (y === 0) return `${seed.debtOpeningY1}`;
      // closing of prior year
      return `OFFSET(${ref("debtClosing")},0,-1)`;
    }},
    { key: "debtClosing", label: "Senior Debt — Closing", kind: "formula", formula: (y, ref) => `${ref("debtOpening")}+${ref("debtDraw")}+${ref("principalRepay")}` },
    { key: "slOpening", label: "SL — Opening", kind: "formula", formula: (y, ref) => {
      if (y === 0) return `${seed.slOpeningY1}`;
      return `OFFSET(${ref("slClosing")},0,-1)`;
    }},
    { key: "slClosing", label: "SL — Closing", kind: "formula", formula: (y, ref) => `${ref("slOpening")}+${ref("slDraw")}+${ref("slPrincipalRepay")}` },
    { key: "dscr", label: "DSCR (CFADS / Debt Service)", kind: "formula", fmt: FMT.ratio, formula: (y, ref) =>
      `IFERROR(${ref("cfads")}/((-${ref("interest")})+(-${ref("principalRepay")})),0)`, bold: true },

    { key: "ar", label: "Accounts Receivable", section: "BALANCE SHEET", kind: "input", value: seed.ar },
    { key: "ap", label: "Accounts Payable", kind: "input", value: seed.ap },
    { key: "netPPE", label: "Net PP&E", kind: "input", value: seed.netPPE },
    { key: "cash", label: "Cash", kind: "input", value: seed.cash },
    { key: "totalAssets", label: "Total Assets", kind: "formula", formula: (y, ref) => `${ref("cash")}+${ref("ar")}+${ref("netPPE")}`, bold: true },
    { key: "totalLiab", label: "Total Liabilities", kind: "formula", formula: (y, ref) => `${ref("ap")}+${ref("debtClosing")}+${ref("slClosing")}`, bold: true },
    { key: "paidInEquity", label: "Paid-in Equity", kind: "input", value: seed.paidInEquity },
    { key: "retainedEarnings", label: "Retained Earnings", kind: "input", value: seed.retainedEarnings },
    { key: "totalEquity", label: "Total Equity", kind: "formula", formula: (y, ref) => `${ref("paidInEquity")}+${ref("retainedEarnings")}`, bold: true },
    { key: "balanceCheck", label: "Balance Check (A − L − E)", kind: "formula", fmt: FMT.num0, formula: (y, ref) => `${ref("totalAssets")}-${ref("totalLiab")}-${ref("totalEquity")}` },
  ];
}
