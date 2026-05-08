// Generic live-formula Excel exporter for all 4 project finance models.
// Design goals:
//   • Inputs sheet — every scalar assumption (editable, blue).
//   • Assumptions sheet — every per-year vector (energy, tariff, FX, inflation,
//     senior rate, principal share, …) editable across the timeline.
//   • Schedule sheet — Revenue, OPEX components, EBITDA, Depreciation, EBIT,
//     Interest, SL Interest, EBT, Tax, NP, CFADS, FCFF, FCFE, Debt schedule,
//     SL schedule, AR/AP/ΔWC, Net PP&E, Cash, Equity — almost every cell is
//     an Excel formula referencing Inputs / Assumptions / earlier rows.
//   • Income Statement / Cash Flow / Balance Sheet — pure formula links to
//     Schedule.
//   • Returns sheet — =IRR / =NPV over Schedule rows, plus DSCR stats.
// Editing any input or vector recalculates the entire model in Excel.
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface RowDef {
  label: string;
  section?: string;
  fmt?: string;
  kind: "input" | "formula" | "header" | "blank";
  value?: (y: number) => number;
  formula?: (y: number, ref: (key: string) => string, aref: (key: string) => string, iref: (key: string) => string) => string;
  key: string;
  bold?: boolean;
  indent?: number;
}

export interface AssumptionRow {
  key: string;
  label: string;
  fmt?: string;
  group?: string;
  value: (y: number) => number;
}

export interface ScalarInput {
  key: string;
  label: string;
  value: number | string;
  group?: string;
  fmt?: string;
}

export interface ExcelExportSpec {
  fileName: string;
  projectName: string;
  modelLabel: string;
  inputs: ScalarInput[];
  assumptions?: AssumptionRow[];
  years: number;
  yearLabels: number[];
  rows: RowDef[];
  discountRate: number;
  initialEquity?: number;
  initialDebt?: number;
  initialCapex?: number;
}

const FMT = {
  num0: "#,##0;(#,##0);-",
  num2: "#,##0.00;(#,##0.00);-",
  pct: "0.0%;(0.0%);-",
  ratio: "0.00\"x\"",
  num4: "0.0000",
};

const BLUE = { argb: "FF0000FF" };
const BLACK = { argb: "FF000000" };
const GREEN = { argb: "FF008000" };
const HEADER_FILL = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FF1F4E78" } };
const SECTION_FILL = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFD9E1F2" } };

function colLetter(idx: number): string {
  let s = "", n = idx;
  while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

export async function exportProjectFinanceExcel(spec: ExcelExportSpec) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Project Finance Models";
  wb.created = new Date();

  // ─── Inputs sheet ───
  const wsI = wb.addWorksheet("Inputs", { views: [{ state: "frozen", ySplit: 3 }] });
  wsI.columns = [{ width: 56 }, { width: 22 }, { width: 22 }];
  wsI.getCell("A1").value = `${spec.modelLabel} — ${spec.projectName}`;
  wsI.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  wsI.getCell("A1").fill = HEADER_FILL;
  wsI.mergeCells("A1:C1");
  wsI.getCell("A2").value = "Editable scalars — blue = input, green = link, black = formula";
  wsI.getCell("A2").font = { italic: true, color: { argb: "FF666666" } };
  wsI.mergeCells("A2:C2");
  wsI.getRow(3).values = ["Assumption", "Value", "Group"];
  wsI.getRow(3).font = { bold: true };
  wsI.getRow(3).fill = SECTION_FILL;

  const inpAddr: Record<string, string> = {};
  let r = 4, curG = "";
  for (const inp of spec.inputs) {
    if (inp.group && inp.group !== curG) {
      curG = inp.group;
      wsI.getCell(`A${r}`).value = curG;
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
    if (inp.key) inpAddr[inp.key] = `Inputs!$B$${r}`;
    r++;
  }
  const iref = (key: string): string => inpAddr[key] ?? "0";

  // ─── Assumptions sheet (per-year vectors) ───
  const assumptionAddr: Record<string, number> = {}; // key → row
  let wsA: ExcelJS.Worksheet | null = null;
  if (spec.assumptions && spec.assumptions.length > 0) {
    wsA = wb.addWorksheet("Assumptions", { views: [{ state: "frozen", ySplit: 4, xSplit: 1 }] });
    const cols: Partial<ExcelJS.Column>[] = [{ width: 38 }];
    for (let y = 0; y < spec.years; y++) cols.push({ width: 14 });
    wsA.columns = cols;
    wsA.getCell("A1").value = "Per-year Assumptions (editable blue cells reflow Schedule)";
    wsA.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
    wsA.getCell("A1").fill = HEADER_FILL;
    wsA.mergeCells(1, 1, 1, spec.years + 1);
    wsA.getCell("A3").value = "Year #";
    wsA.getCell("A4").value = "Calendar Year";
    for (let y = 0; y < spec.years; y++) {
      const c = colLetter(2 + y);
      wsA.getCell(`${c}3`).value = y + 1;
      wsA.getCell(`${c}4`).value = spec.yearLabels[y];
    }
    wsA.getRow(3).font = { bold: true }; wsA.getRow(4).font = { bold: true };
    wsA.getRow(3).fill = SECTION_FILL; wsA.getRow(4).fill = SECTION_FILL;
    let rr = 5, curAG = "";
    for (const a of spec.assumptions) {
      if (a.group && a.group !== curAG) {
        curAG = a.group;
        wsA.getCell(`A${rr}`).value = curAG;
        wsA.getCell(`A${rr}`).font = { bold: true, color: { argb: "FFFFFFFF" } };
        wsA.getCell(`A${rr}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF305496" } };
        wsA.mergeCells(rr, 1, rr, spec.years + 1);
        rr++;
      }
      wsA.getCell(`A${rr}`).value = a.label;
      assumptionAddr[a.key] = rr;
      for (let y = 0; y < spec.years; y++) {
        const c = colLetter(2 + y);
        const cell = wsA.getCell(`${c}${rr}`);
        cell.value = a.value(y);
        cell.numFmt = a.fmt ?? FMT.num4;
        cell.font = { color: BLUE };
      }
      rr++;
    }
  }

  // ─── Schedule sheet ───
  const wsS = wb.addWorksheet("Schedule", { views: [{ state: "frozen", ySplit: 4, xSplit: 1 }] });
  const cols: Partial<ExcelJS.Column>[] = [{ width: 40 }];
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
  wsS.getRow(3).font = { bold: true }; wsS.getRow(4).font = { bold: true };
  wsS.getRow(3).fill = SECTION_FILL; wsS.getRow(4).fill = SECTION_FILL;

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
        const aref = (k: string) => assumptionAddr[k] ? `Assumptions!${c}${assumptionAddr[k]}` : "0";
        cell.value = { formula: rd.formula(y, ref, aref, iref) } as ExcelJS.CellFormulaValue;
        cell.font = { color: BLACK, ...(rd.bold ? { bold: true } : {}) };
      }
    }
    cur++;
  }

  // ─── Returns sheet ───
  const wsR = wb.addWorksheet("Returns");
  wsR.columns = [{ width: 38 }, { width: 18 }];
  wsR.getCell("A1").value = "Returns & Coverage";
  wsR.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  wsR.getCell("A1").fill = HEADER_FILL;
  wsR.mergeCells("A1:B1");

  const fcffRow = rowMap["fcff"], fcfeRow = rowMap["fcfe"], dscrRow = rowMap["dscr"];
  const lastCol = colLetter(spec.years + 1);
  let rr = 3;
  const put = (label: string, formula: string, fmt = FMT.pct) => {
    wsR.getCell(`A${rr}`).value = label;
    wsR.getCell(`B${rr}`).value = { formula } as ExcelJS.CellFormulaValue;
    wsR.getCell(`B${rr}`).numFmt = fmt;
    wsR.getCell(`B${rr}`).font = { bold: true, color: GREEN };
    rr++;
  };
  if (fcffRow && spec.initialCapex) {
    wsR.getCell(`A${rr}`).value = "FCFF series (incl. Yr 0)";
    const sCols: string[] = [];
    for (let y = 0; y <= spec.years; y++) {
      const c = colLetter(2 + y);
      const cell = wsR.getCell(`${c}${rr}`);
      if (y === 0) cell.value = -Math.abs(spec.initialCapex);
      else cell.value = { formula: `Schedule!${colLetter(1 + y)}${fcffRow}` } as ExcelJS.CellFormulaValue;
      cell.numFmt = FMT.num0;
      sCols.push(`${c}${rr}`);
    }
    const range = `${sCols[0]}:${sCols[sCols.length - 1]}`;
    rr += 2;
    put("Project IRR (FCFF)", `IFERROR(IRR(${range}),"n/a")`);
    put("NPV @ discount (FCFF)", `NPV(${spec.discountRate},${sCols.slice(1).join(",")})+${sCols[0]}`, FMT.num0);
  } else if (fcffRow) {
    put("Project IRR (FCFF, ops only)", `IFERROR(IRR(Schedule!B${fcffRow}:${lastCol}${fcffRow}),"n/a")`);
  }
  if (fcfeRow && spec.initialEquity) {
    wsR.getCell(`A${rr}`).value = "FCFE series (incl. Yr 0)";
    const sCols: string[] = [];
    for (let y = 0; y <= spec.years; y++) {
      const c = colLetter(2 + y);
      const cell = wsR.getCell(`${c}${rr}`);
      if (y === 0) cell.value = -Math.abs(spec.initialEquity);
      else cell.value = { formula: `Schedule!${colLetter(1 + y)}${fcfeRow}` } as ExcelJS.CellFormulaValue;
      cell.numFmt = FMT.num0;
      sCols.push(`${c}${rr}`);
    }
    const range = `${sCols[0]}:${sCols[sCols.length - 1]}`;
    rr++;
    put("Equity IRR (FCFE)", `IFERROR(IRR(${range}),"n/a")`);
  }
  if (dscrRow) {
    put("Min DSCR", `MIN(Schedule!B${dscrRow}:${lastCol}${dscrRow})`, FMT.ratio);
    put("Avg DSCR", `AVERAGE(Schedule!B${dscrRow}:${lastCol}${dscrRow})`, FMT.ratio);
  }

  // ─── Statements ───
  buildLinkedStatement(wb, "Income Statement", spec, rowMap, [
    "revenue", "om", "omVat", "mmra", "insurance", "replacement", "rent", "usufruct", "opex",
    "ebitda", "depreciation", "ebit", "interest", "slInterest", "ebt", "tax", "netProfit",
  ]);
  buildLinkedStatement(wb, "Cash Flow", spec, rowMap, [
    "ebitda", "tax", "workingCapDelta", "cfads", "interest", "principalRepay", "slInterest", "slPrincipalRepay",
    "fcfe", "capex", "debtDraw", "slDraw", "fcff",
  ]);
  buildLinkedStatement(wb, "Balance Sheet", spec, rowMap, [
    "cash", "ar", "netPPE", "totalAssets", "ap", "debtClosing", "slClosing", "totalLiab",
    "paidInEquity", "retainedEarnings", "totalEquity", "balanceCheck",
  ]);

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), spec.fileName);
}

function buildLinkedStatement(wb: ExcelJS.Workbook, name: string, spec: ExcelExportSpec, rowMap: Record<string, number>, keys: string[]) {
  const ws = wb.addWorksheet(name, { views: [{ state: "frozen", ySplit: 3, xSplit: 1 }] });
  const cols: Partial<ExcelJS.Column>[] = [{ width: 32 }];
  for (let y = 0; y < spec.years; y++) cols.push({ width: 14 });
  ws.columns = cols;
  ws.getCell("A1").value = name;
  ws.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  ws.getCell("A1").fill = HEADER_FILL;
  ws.mergeCells(1, 1, 1, spec.years + 1);
  ws.getCell("A3").value = "Year";
  for (let y = 0; y < spec.years; y++) ws.getCell(`${colLetter(2 + y)}3`).value = y + 1;
  ws.getRow(3).font = { bold: true };
  ws.getRow(3).fill = SECTION_FILL;
  let rr = 4;
  for (const k of keys) {
    const sourceRow = rowMap[k]; if (!sourceRow) continue;
    const sched = wb.getWorksheet("Schedule")!;
    const lbl = (sched.getCell(`A${sourceRow}`).value as string) ?? k;
    ws.getCell(`A${rr}`).value = (lbl ?? k).toString().trim();
    for (let y = 0; y < spec.years; y++) {
      const c = colLetter(2 + y);
      ws.getCell(`${c}${rr}`).value = { formula: `Schedule!${c}${sourceRow}` } as ExcelJS.CellFormulaValue;
      ws.getCell(`${c}${rr}`).numFmt = FMT.num0;
      ws.getCell(`${c}${rr}`).font = { color: GREEN };
    }
    rr++;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Standard formula-driven schedule rows for any of the 4 models.
// All seeded vectors live on the Assumptions sheet; the Schedule cells
// are formulas referencing them, so editing assumptions reflows the model.
// ─────────────────────────────────────────────────────────────────────

export interface OpexComponent { key: string; label: string; value: (y: number) => number; }

export interface StandardRowSeed {
  // Per-year vectors (already escalated/inflated by the app — placed on
  // Assumptions sheet as editable blue cells, then referenced by formulas)
  revenue: (y: number) => number;
  opex: (y: number) => number;             // total — used as fallback if no breakdown
  opexBreakdown?: OpexComponent[];         // segregated lines (O&M, MMRA, ...)
  depreciation: (y: number) => number;
  capex: (y: number) => number;            // replacement / MM capex during ops
  debtDraw: (y: number) => number;
  principalRepay: (y: number) => number;
  slDraw: (y: number) => number;
  slPrincipalRepay: (y: number) => number;
  // Optional (for fully formula-driven interest)
  seniorRate?: (y: number) => number;      // annual rate per year
  slRate?: number;                         // SL rate scalar
  // Scalars for tax & WC
  taxRate?: number;
  arDays?: number;
  apDays?: number;
  // Opening balances
  debtOpeningY1: number;
  slOpeningY1: number;
  // Equity
  paidInEquity: (y: number) => number;
  retainedEarnings: (y: number) => number;
  // Balance sheet (cash & netPPE may be derived elsewhere; we rebuild)
  netPPE: (y: number) => number;
  cash: (y: number) => number;
  ar: (y: number) => number;
  ap: (y: number) => number;
  // Fallback (used when the optional formula seeds are missing)
  interest: (y: number) => number;
  slInterest: (y: number) => number;
  tax: (y: number) => number;
  workingCapDelta: (y: number) => number;
}

/** Build an Assumptions vector list from the seed (one row per per-year driver). */
export function buildStandardAssumptions(seed: StandardRowSeed): AssumptionRow[] {
  const a: AssumptionRow[] = [
    { key: "a_revenue", label: "Revenue (per year)", group: "REVENUE & OPEX", value: seed.revenue, fmt: FMT.num0 },
  ];
  if (seed.opexBreakdown && seed.opexBreakdown.length) {
    for (const c of seed.opexBreakdown) a.push({ key: `a_${c.key}`, label: c.label, group: "REVENUE & OPEX", value: c.value, fmt: FMT.num0 });
  } else {
    a.push({ key: "a_opex", label: "Operating Expenses (total)", group: "REVENUE & OPEX", value: seed.opex, fmt: FMT.num0 });
  }
  a.push(
    { key: "a_dep", label: "Depreciation & Amortisation", group: "CAPEX & DEP", value: seed.depreciation, fmt: FMT.num0 },
    { key: "a_capex", label: "Replacement CAPEX", group: "CAPEX & DEP", value: seed.capex, fmt: FMT.num0 },
    { key: "a_debtDraw", label: "Senior Debt Drawdown", group: "DEBT", value: seed.debtDraw, fmt: FMT.num0 },
    { key: "a_principalRepay", label: "Senior Principal Repayment", group: "DEBT", value: seed.principalRepay, fmt: FMT.num0 },
    { key: "a_slDraw", label: "Shareholder Loan Drawdown", group: "SHAREHOLDER LOAN", value: seed.slDraw, fmt: FMT.num0 },
    { key: "a_slPrincipalRepay", label: "Shareholder Loan Repayment", group: "SHAREHOLDER LOAN", value: seed.slPrincipalRepay, fmt: FMT.num0 },
  );
  if (seed.seniorRate) a.push({ key: "a_seniorRate", label: "Senior Interest Rate", group: "RATES", value: seed.seniorRate, fmt: FMT.pct });
  return a;
}

export function buildStandardRows(seed: StandardRowSeed): RowDef[] {
  const hasBreakdown = !!(seed.opexBreakdown && seed.opexBreakdown.length);
  const taxRateRef = seed.taxRate != null ? seed.taxRate.toString() : null;
  const slRateRef = seed.slRate != null ? seed.slRate.toString() : null;
  const arDaysRef = seed.arDays != null ? seed.arDays.toString() : null;
  const apDaysRef = seed.apDays != null ? seed.apDays.toString() : null;

  const rows: RowDef[] = [
    // Revenue
    { key: "revenue", label: "Revenue", section: "INCOME STATEMENT", kind: "formula", bold: true,
      formula: (_y, _r, aref) => `${aref("a_revenue")}` },

    // Opex breakdown (segregated)
    ...(hasBreakdown
      ? seed.opexBreakdown!.map<RowDef>(c => ({
          key: c.key, label: c.label, kind: "formula", indent: 2,
          formula: (_y, _r, aref) => `-${aref(`a_${c.key}`)}`,
        }))
      : []),
    { key: "opex", label: hasBreakdown ? "Total Operating Expenses" : "Operating Expenses", kind: "formula", bold: true,
      formula: (_y, ref, aref) => hasBreakdown
        ? seed.opexBreakdown!.map(c => ref(c.key)).join("+")
        : `-${aref("a_opex")}` },

    { key: "ebitda", label: "EBITDA", kind: "formula", bold: true,
      formula: (_y, ref) => `${ref("revenue")}+${ref("opex")}` },

    { key: "depreciation", label: "Depreciation & Amortisation", kind: "formula",
      formula: (_y, _r, aref) => `-${aref("a_dep")}` },

    { key: "ebit", label: "EBIT", kind: "formula", bold: true,
      formula: (_y, ref) => `${ref("ebitda")}+${ref("depreciation")}` },

    // Senior interest = rate * (opening − principal/2)  [avoid circular]
    { key: "interest", label: "Senior Interest Expense", kind: "formula",
      formula: (y, ref, aref) => {
        if (seed.seniorRate) {
          return `-MAX(0,${ref("debtOpening")}-${ref("principalRepay")}/2)*${aref("a_seniorRate")}`;
        }
        // fallback: seeded value
        return `${-Math.abs(seed.interest(y))}`;
      } },

    { key: "slInterest", label: "Shareholder Loan Interest", kind: "formula",
      formula: (y, ref) => slRateRef
        ? `-MAX(0,${ref("slOpening")}-${ref("slPrincipalRepay")}/2)*${slRateRef}`
        : `${-Math.abs(seed.slInterest(y))}` },

    { key: "ebt", label: "EBT", kind: "formula", bold: true,
      formula: (_y, ref) => `${ref("ebit")}+${ref("interest")}+${ref("slInterest")}` },

    { key: "tax", label: "Corporate Tax", kind: "formula",
      formula: (y, ref) => taxRateRef
        ? `-MAX(0,${ref("ebt")})*${taxRateRef}`
        : `${-Math.abs(seed.tax(y))}` },

    { key: "netProfit", label: "Net Profit", kind: "formula", bold: true,
      formula: (_y, ref) => `${ref("ebt")}+${ref("tax")}` },

    // Working capital
    { key: "ar", label: "Accounts Receivable (BoP)", section: "WORKING CAPITAL", kind: "formula",
      formula: (y, ref) => arDaysRef ? `${ref("revenue")}*${arDaysRef}/365` : `${seed.ar(y)}` },
    { key: "ap", label: "Accounts Payable", kind: "formula",
      formula: (y, ref) => apDaysRef ? `(-${ref("opex")})*${apDaysRef}/365` : `${seed.ap(y)}` },
    { key: "workingCapDelta", label: "Δ Working Capital (use of cash)", kind: "formula",
      formula: (y, ref) => {
        if (y === 0) return `-${ref("ar")}+${ref("ap")}`;
        return `-(${ref("ar")}-OFFSET(${ref("ar")},0,-1))+(${ref("ap")}-OFFSET(${ref("ap")},0,-1))`;
      } },

    // CASH FLOW
    { key: "cfads", label: "CFADS (EBITDA + Tax + ΔWC)", section: "CASH FLOW", kind: "formula", bold: true,
      formula: (_y, ref) => `${ref("ebitda")}+${ref("tax")}+${ref("workingCapDelta")}` },
    { key: "capex", label: "Replacement CAPEX", kind: "formula",
      formula: (_y, _r, aref) => `-${aref("a_capex")}` },
    { key: "debtDraw", label: "Senior Debt Drawdown", section: "FINANCING", kind: "formula",
      formula: (_y, _r, aref) => `${aref("a_debtDraw")}` },
    { key: "principalRepay", label: "Senior Principal Repayment", kind: "formula",
      formula: (_y, _r, aref) => `-${aref("a_principalRepay")}` },
    { key: "slDraw", label: "Shareholder Loan Drawdown", kind: "formula",
      formula: (_y, _r, aref) => `${aref("a_slDraw")}` },
    { key: "slPrincipalRepay", label: "SL Principal Repayment", kind: "formula",
      formula: (_y, _r, aref) => `-${aref("a_slPrincipalRepay")}` },

    // FCFF / FCFE
    { key: "fcff", label: "FCFF (CFADS + CAPEX)", section: "FREE CASH FLOWS", kind: "formula", bold: true,
      formula: (_y, ref) => `${ref("cfads")}+${ref("capex")}` },
    { key: "fcfe", label: "FCFE (FCFF + Net Debt + Net SL + Interest)", kind: "formula", bold: true,
      formula: (_y, ref) =>
        `${ref("fcff")}+${ref("debtDraw")}+${ref("principalRepay")}+${ref("slDraw")}+${ref("slPrincipalRepay")}+${ref("interest")}+${ref("slInterest")}` },

    // Debt balances
    { key: "debtOpening", label: "Senior Debt — Opening", section: "DEBT BALANCES", kind: "formula",
      formula: (y, ref) => y === 0 ? `${seed.debtOpeningY1}` : `OFFSET(${ref("debtClosing")},0,-1)` },
    { key: "debtClosing", label: "Senior Debt — Closing", kind: "formula",
      formula: (_y, ref) => `${ref("debtOpening")}+${ref("debtDraw")}+${ref("principalRepay")}` },
    { key: "slOpening", label: "SL — Opening", kind: "formula",
      formula: (y, ref) => y === 0 ? `${seed.slOpeningY1}` : `OFFSET(${ref("slClosing")},0,-1)` },
    { key: "slClosing", label: "SL — Closing", kind: "formula",
      formula: (_y, ref) => `${ref("slOpening")}+${ref("slDraw")}+${ref("slPrincipalRepay")}` },

    // DSCR
    { key: "dscr", label: "DSCR (CFADS / Debt Service)", kind: "formula", fmt: FMT.ratio, bold: true,
      formula: (_y, ref) => `IFERROR(${ref("cfads")}/((-${ref("interest")})+(-${ref("principalRepay")})),0)` },

    // Balance sheet
    { key: "netPPE", label: "Net PP&E", section: "BALANCE SHEET", kind: "input", value: seed.netPPE },
    { key: "cash", label: "Cash", kind: "input", value: seed.cash },
    { key: "totalAssets", label: "Total Assets", kind: "formula", bold: true,
      formula: (_y, ref) => `${ref("cash")}+${ref("ar")}+${ref("netPPE")}` },
    { key: "totalLiab", label: "Total Liabilities", kind: "formula", bold: true,
      formula: (_y, ref) => `${ref("ap")}+${ref("debtClosing")}+${ref("slClosing")}` },
    { key: "paidInEquity", label: "Paid-in Equity", kind: "input", value: seed.paidInEquity },
    { key: "retainedEarnings", label: "Retained Earnings", kind: "input", value: seed.retainedEarnings },
    { key: "totalEquity", label: "Total Equity", kind: "formula", bold: true,
      formula: (_y, ref) => `${ref("paidInEquity")}+${ref("retainedEarnings")}` },
    { key: "balanceCheck", label: "Balance Check (A − L − E)", kind: "formula", fmt: FMT.num0,
      formula: (_y, ref) => `${ref("totalAssets")}-${ref("totalLiab")}-${ref("totalEquity")}` },
  ];

  // Add segregated opex IS keys (om/omVat/mmra/insurance/etc.) so statements can reference them.
  // These fall back to 0 when not provided; we expose them by aliasing the breakdown keys.
  const aliases: Array<[string, string]> = [
    ["om", "om"], ["omVat", "omVat"], ["mmra", "mmra"], ["insurance", "insurance"],
    ["replacement", "replacement"], ["rent", "rent"], ["usufruct", "usufruct"],
  ];
  for (const [stmtKey, breakKey] of aliases) {
    if (rows.find(rr => rr.key === breakKey)) {
      // already present from breakdown — IS sheet will pick it up via key alias by adding a hidden mirror row
      if (stmtKey !== breakKey) {
        rows.push({ key: stmtKey, label: `(IS link) ${stmtKey}`, kind: "formula",
          formula: (_y, ref) => ref(breakKey) });
      }
    }
  }
  return rows;
}
