// Per-model exporters — wire each model's solved output into the generic
// formula-driven exporter. Inputs land on the Inputs sheet, per-year vectors
// on Assumptions, and the Schedule sheet derives everything (revenue, opex
// breakdown, EBITDA, dep, interest, tax, NP, CFADS, FCFE/FCFF, debt balances,
// AR/AP/ΔWC, DSCR) via Excel formulas. Edit any blue cell → model reflows.
import {
  exportProjectFinanceExcel, buildStandardRows, buildStandardAssumptions,
  ExcelExportSpec, StandardRowSeed, OpexComponent, ScalarInput,
} from "./excelExport";
import type { PvOutputs } from "./pvModel";
import type { CngOutputs } from "./cngModel";
import type { WaterOutputs } from "./waterModel";
import type { ModelOutputs as WindOutputs } from "./windModel";

const FMT_NUM0 = "#,##0;(#,##0);-";
const FMT_PCT = "0.0%;(0.0%);-";

function inputsFromObject(obj: Record<string, any>, group: string): ScalarInput[] {
  const out: ScalarInput[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v == null) continue;
    if (typeof v === "object") continue;
    if (typeof v === "boolean") { out.push({ label: k, value: v ? "Yes" : "No", group }); continue; }
    out.push({ label: k, value: v as any, group });
  }
  return out;
}

function buildSpec(
  fileName: string, projectName: string, modelLabel: string,
  yearLabels: number[], discountRate: number,
  initialCapex: number, initialEquity: number, initialDebt: number,
  inputs: ScalarInput[], seed: StandardRowSeed,
): ExcelExportSpec {
  return {
    fileName, projectName, modelLabel,
    years: yearLabels.length, yearLabels, discountRate,
    initialCapex, initialEquity, initialDebt,
    inputs,
    assumptions: buildStandardAssumptions(seed),
    rows: buildStandardRows(seed),
  };
}

// ─── PV (Solar) ─────────────────────────────────────────────────────
export async function exportPvExcel(m: PvOutputs) {
  const I = m.inputs;
  // Operating rows only (skip the Year 0 capex row at index 0)
  const ops = m.rows.filter(r => r.yearIdx >= 0);
  const N = ops.length;
  const r = (y: number) => ops[y] ?? ({} as any);
  const opexBreakdown: OpexComponent[] = [
    { key: "om", label: "Operations & Maintenance", value: y => r(y).om ?? 0 },
    { key: "omVat", label: "VAT on O&M", value: y => r(y).omVat ?? 0 },
    { key: "mmra", label: "Major Maintenance Reserve (MMRA)", value: y => r(y).mmra ?? 0 },
    { key: "insurance", label: "Insurance", value: y => r(y).insurance ?? 0 },
    { key: "replacement", label: "Replacement Capex (P&L)", value: y => r(y).replacement ?? 0 },
    { key: "rent", label: "Land Rent", value: y => r(y).rent ?? 0 },
    { key: "usufruct", label: "Usufruct", value: y => r(y).usufruct ?? 0 },
  ];
  const seed: StandardRowSeed = {
    revenue: y => r(y).revenue ?? 0,
    opex: y => r(y).opex ?? 0,
    opexBreakdown,
    depreciation: y => r(y).depreciation ?? 0,
    capex: y => r(y).capex ?? 0,
    debtDraw: y => r(y).debtDraw ?? 0,
    principalRepay: y => r(y).principalRepay ?? 0,
    slDraw: y => r(y).slDraw ?? 0,
    slPrincipalRepay: y => r(y).slPrincipalRepay ?? 0,
    seniorRate: y => r(y).rate ?? 0,
    slRate: I.slRatePct,
    taxRate: I.taxRatePct,
    arDays: I.arDays,
    apDays: I.apDays,
    debtOpeningY1: r(0).debtOpening ?? m.debtAmount,
    slOpeningY1: r(0).slOpening ?? m.shareholderLoan,
    paidInEquity: y => r(y).paidInEquity ?? m.paidInEquity,
    retainedEarnings: y => r(y).retainedEarnings ?? 0,
    netPPE: y => r(y).netPPE ?? 0,
    cash: y => r(y).cash ?? 0,
    ar: y => r(y).ar ?? 0,
    ap: y => r(y).ap ?? 0,
    interest: y => r(y).interest ?? 0,
    slInterest: y => r(y).slInterest ?? 0,
    tax: y => r(y).tax ?? 0,
    workingCapDelta: y => r(y).workingCapDelta ?? 0,
  };
  const inputs: ScalarInput[] = [
    ...inputsFromObject({
      projectName: I.projectName, capacityKwp: I.capacityKwp,
      contractYears: I.contractYears, constructionMonths: I.constructionMonths,
      voltageLevel: I.voltageLevel,
      govtBaseTariffEgp: I.govtBaseTariffEgp, govtEscalationPct: I.govtEscalationPct,
      contingencyPct: I.contingencyPct, taxRatePct: I.taxRatePct,
      arDays: I.arDays, apDays: I.apDays,
      debtPct: I.debtPct, spreadPct: I.spreadPct,
      loanTenorYears: I.loanTenorYears, graceYears: I.graceYears,
      slEnabled: I.slEnabled, slRatePct: I.slRatePct, slPctOfEquity: I.slPctOfEquity,
      refiEnabled: I.refiEnabled, refiYear: I.refiYear, refiNewRatePct: I.refiNewRatePct,
    }, "Project & Financing"),
    { label: "── Computed ──", value: "", group: "Headline Results" },
    { label: "Total CAPEX (EGP)", value: m.totalCapexEgp, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Senior Debt (EGP)", value: m.debtAmount, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Equity (EGP)", value: m.equityAmount, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Project IRR (app)", value: m.projectIRR, group: "Headline Results", fmt: FMT_PCT },
    { label: "Equity IRR (app)", value: m.equityIRR, group: "Headline Results", fmt: FMT_PCT },
    { label: "Min DSCR (app)", value: m.minDSCR, group: "Headline Results", fmt: "0.00\"x\"" },
    { label: "LCOE (EGP/kWh)", value: m.lcoeEgpPerKwh, group: "Headline Results", fmt: "0.0000" },
  ];
  await exportProjectFinanceExcel(buildSpec(
    `PV_Solar_Model_${(I.projectName || "project").replace(/\s+/g, "_")}.xlsx`,
    I.projectName ?? "PV Project", "PV (Solar) Project Finance Model",
    ops.map(rr => rr.year), I.discountRateProject ?? 0.10,
    m.totalCapexEgp, m.equityAmount, m.debtAmount, inputs, seed,
  ));
}

// ─── CNG ───────────────────────────────────────────────────────────
export async function exportCngExcel(m: CngOutputs) {
  const I = m.inputs;
  const ops = m.rows.filter((r: any) => (r.yearIdx ?? 0) >= 0);
  const N = ops.length;
  const r = (y: number) => (ops[y] as any) ?? {};
  const opexBreakdown: OpexComponent[] = [
    { key: "om", label: "Operations & Maintenance", value: y => r(y).om ?? r(y).maintenance ?? 0 },
    { key: "insurance", label: "Insurance", value: y => r(y).insurance ?? 0 },
    { key: "rent", label: "Land / Site Rent", value: y => r(y).rent ?? 0 },
  ];
  const seed: StandardRowSeed = {
    revenue: y => r(y).revenue ?? 0,
    opex: y => r(y).opex ?? 0,
    opexBreakdown,
    depreciation: y => r(y).depreciation ?? 0,
    capex: y => r(y).capex ?? 0,
    debtDraw: y => r(y).debtDraw ?? 0,
    principalRepay: y => r(y).principalRepay ?? 0,
    slDraw: y => r(y).slDraw ?? 0,
    slPrincipalRepay: y => r(y).slPrincipalRepay ?? 0,
    seniorRate: y => r(y).rate ?? (I as any).debtRate ?? 0,
    slRate: (I as any).slRatePct ?? 0,
    taxRate: (I as any).taxRatePct ?? 0.225,
    arDays: (I as any).arDays ?? 30,
    apDays: (I as any).apDays ?? 30,
    debtOpeningY1: r(0).debtOpening ?? m.debtAmount,
    slOpeningY1: r(0).slOpening ?? m.shareholderLoan ?? 0,
    paidInEquity: y => r(y).paidInEquity ?? m.equityAmount,
    retainedEarnings: y => r(y).retainedEarnings ?? 0,
    netPPE: y => r(y).netPPE ?? 0,
    cash: y => r(y).cash ?? 0,
    ar: y => r(y).ar ?? 0,
    ap: y => r(y).ap ?? 0,
    interest: y => r(y).interest ?? 0,
    slInterest: y => r(y).slInterest ?? 0,
    tax: y => r(y).tax ?? 0,
    workingCapDelta: y => r(y).workingCapDelta ?? 0,
  };
  const inputs: ScalarInput[] = [
    ...inputsFromObject({
      projectName: I.projectName, contractYears: I.contractYears,
      constructionMonths: I.constructionMonths,
      loanTenorYears: I.loanTenorYears, graceYears: I.graceYears,
      spreadPct: I.spreadPct, contingencyPct: I.contingencyPct,
    }, "Project & Financing"),
    { label: "Total CAPEX", value: m.totalCapexEgp, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Senior Debt", value: m.debtAmount, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Equity", value: m.equityAmount, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Project IRR (app)", value: m.projectIRR, group: "Headline Results", fmt: FMT_PCT },
    { label: "Equity IRR (app)", value: m.equityIRR, group: "Headline Results", fmt: FMT_PCT },
    { label: "Min DSCR (app)", value: m.minDSCR, group: "Headline Results", fmt: "0.00\"x\"" },
    { label: "LCOM (EGP/m³)", value: m.lcomEgpPerM3, group: "Headline Results", fmt: "0.0000" },
  ];
  await exportProjectFinanceExcel(buildSpec(
    `CNG_Model_${(I.projectName || "project").replace(/\s+/g, "_")}.xlsx`,
    I.projectName ?? "CNG Project", "Mobile CNG Project Finance Model",
    ops.map((rr: any, i) => rr.year ?? i + 1), 0.10,
    m.totalCapexEgp, m.equityAmount, m.debtAmount, inputs, seed,
  ));
}

// ─── Water (SWRO) ──────────────────────────────────────────────────
export async function exportWaterExcel(m: WaterOutputs) {
  const I = m.inputs;
  const ops = m.rows.filter((r: any) => (r.yearIdx ?? 0) >= 0);
  const r = (y: number) => (ops[y] as any) ?? {};
  const opexBreakdown: OpexComponent[] = [
    { key: "om", label: "Operations & Maintenance (fixed + var)", value: y => (r(y).fixedOpex ?? 0) + (r(y).variableOpex ?? 0) },
    { key: "electricity", label: "Electricity", value: y => r(y).electricityCost ?? 0 },
    { key: "sga", label: "SG&A", value: y => r(y).sga ?? 0 },
    { key: "mmra", label: "MMRA", value: y => r(y).mmra ?? 0 },
    { key: "insurance", label: "Insurance", value: y => r(y).insurance ?? 0 },
  ];
  // Reuse aliases — map "om" to fixedOpex + variableOpex; the others kept as keys present in IS.
  const seed: StandardRowSeed = {
    revenue: y => r(y).revenue ?? 0,
    opex: y => opexBreakdown.reduce((s, c) => s + c.value(y), 0),
    opexBreakdown,
    depreciation: y => r(y).depreciation ?? 0,
    capex: y => r(y).capex ?? r(y).mmCapex ?? 0,
    debtDraw: y => r(y).debtDraw ?? 0,
    principalRepay: y => r(y).principalRepay ?? 0,
    slDraw: y => r(y).slDraw ?? 0,
    slPrincipalRepay: y => r(y).slPrincipalRepay ?? 0,
    seniorRate: y => r(y).rate ?? I.debtRateYr1 ?? 0,
    slRate: (I as any).slRatePct ?? 0,
    taxRate: (I as any).taxRatePct ?? 0.225,
    arDays: (I as any).arDays ?? 30,
    apDays: (I as any).apDays ?? 30,
    debtOpeningY1: r(0).debtOpening ?? m.debtAmount,
    slOpeningY1: r(0).slOpening ?? 0,
    paidInEquity: y => r(y).paidInEquity ?? m.equityAmount,
    retainedEarnings: y => r(y).retainedEarnings ?? 0,
    netPPE: y => r(y).netPPE ?? 0,
    cash: y => r(y).cash ?? 0,
    ar: y => r(y).ar ?? 0,
    ap: y => r(y).ap ?? 0,
    interest: y => r(y).interest ?? 0,
    slInterest: y => r(y).slInterest ?? 0,
    tax: y => r(y).tax ?? 0,
    workingCapDelta: y => r(y).workingCapDelta ?? 0,
  };
  const inputs: ScalarInput[] = [
    ...inputsFromObject({
      projectName: I.projectName, capacityM3Day: I.capacityM3Day, contractYears: I.contractYears,
      constructionMonths: I.constructionMonths, debtToEquity: I.debtToEquity,
      loanTenorYears: I.loanTenorYears, debtRateYr1: I.debtRateYr1,
      contingencyPct: I.contingencyPct,
    }, "Project & Financing"),
    { label: "Total CAPEX (with IDC)", value: m.totalCapexWithIdc, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Senior Debt", value: m.debtAmount, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Equity", value: m.equityAmount, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Project IRR (app)", value: m.projectIRR, group: "Headline Results", fmt: FMT_PCT },
    { label: "Equity IRR (app)", value: m.equityIRR, group: "Headline Results", fmt: FMT_PCT },
    { label: "Min DSCR (app)", value: m.minDSCR, group: "Headline Results", fmt: "0.00\"x\"" },
    { label: "LCOM³ (EGP/m³)", value: m.lcom3, group: "Headline Results", fmt: "0.0000" },
  ];
  await exportProjectFinanceExcel(buildSpec(
    `Water_SWRO_Model_${(I.projectName || "project").replace(/\s+/g, "_")}.xlsx`,
    I.projectName ?? "SWRO Project", "Water (SWRO) Project Finance Model",
    ops.map((rr: any, i) => rr.year ?? i + 1), 0.10,
    m.totalCapexWithIdc, m.equityAmount, m.debtAmount, inputs, seed,
  ));
}

// ─── Wind / REZA ────────────────────────────────────────────────────
export async function exportWindExcel(m: WindOutputs) {
  const I = m.inputs;
  const ops = m.rows.filter((r: any) => (r.yearIdx ?? 0) >= 0);
  const r = (y: number) => (ops[y] as any) ?? {};
  const opexBreakdown: OpexComponent[] = [
    { key: "om", label: "Operations & Maintenance", value: y => r(y).opex ?? 0 },
    { key: "insurance", label: "Insurance", value: y => r(y).insurance ?? 0 },
    { key: "rent", label: "Land Lease", value: y => r(y).landLease ?? 0 },
  ];
  const seed: StandardRowSeed = {
    revenue: y => r(y).revenue ?? 0,
    opex: y => opexBreakdown.reduce((s, c) => s + c.value(y), 0),
    opexBreakdown,
    depreciation: y => r(y).depreciation ?? 0,
    capex: y => r(y).majorMaintenance ?? 0,
    debtDraw: y => r(y).debtDraw ?? 0,
    principalRepay: y => r(y).debtRepayment ?? r(y).principalRepay ?? 0,
    slDraw: y => r(y).shLoanDraw ?? 0,
    slPrincipalRepay: y => r(y).shLoanRepay ?? 0,
    seniorRate: y => r(y).rate ?? r(y).debtRate ?? (I as any).debtRate ?? 0,
    slRate: (I as any).shLoanRate ?? 0,
    taxRate: (I as any).taxRate ?? 0.225,
    arDays: (I as any).arDays ?? 30,
    apDays: (I as any).apDays ?? 30,
    debtOpeningY1: r(0).debtOpening ?? m.debtAmount,
    slOpeningY1: r(0).shLoanOpening ?? m.shLoanAmount ?? 0,
    paidInEquity: y => r(y).paidInEquity ?? m.equityAmount,
    retainedEarnings: y => r(y).retainedEarnings ?? 0,
    netPPE: y => r(y).netPPE ?? 0,
    cash: y => r(y).cash ?? 0,
    ar: y => r(y).ar ?? 0,
    ap: y => r(y).ap ?? 0,
    interest: y => r(y).interestExpense ?? r(y).interest ?? 0,
    slInterest: y => r(y).shLoanInterest ?? 0,
    tax: y => r(y).tax ?? 0,
    workingCapDelta: y => r(y).workingCapitalDelta ?? 0,
  };
  const inputs: ScalarInput[] = [
    ...inputsFromObject({
      projectName: I.projectName, country: I.country, scenario: I.scenario,
      constructionMonths: I.constructionMonths, operationsYears: I.operationsYears,
      epcCost: I.epcCost, contingency: I.contingency,
      taxRate: (I as any).taxRate, riskFreeRate: (I as any).riskFreeRate, equityBeta: (I as any).equityBeta,
    }, "Project"),
    { label: "Total Uses", value: m.totalUses, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Senior Debt", value: m.debtAmount, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Equity", value: m.equityAmount, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "WACC", value: m.wacc, group: "Headline Results", fmt: FMT_PCT },
    { label: "Project IRR (app)", value: m.projectIRR, group: "Headline Results", fmt: FMT_PCT },
    { label: "Equity IRR (app)", value: m.blendedEquityIRR ?? m.equityIRR, group: "Headline Results", fmt: FMT_PCT },
    { label: "Min DSCR (app)", value: m.minDSCR, group: "Headline Results", fmt: "0.00\"x\"" },
    { label: "LCOE (USD/kWh)", value: m.lcoeUsdPerKWh, group: "Headline Results", fmt: "0.0000" },
  ];
  await exportProjectFinanceExcel(buildSpec(
    `REZA_Wind_Model_${(I.projectName || "project").replace(/\s+/g, "_")}.xlsx`,
    I.projectName ?? "Wind Project", "REZA — Wind Project Finance Model",
    ops.map((rr: any, i) => rr.year ?? rr.calendarYear ?? i + 1), m.wacc ?? 0.10,
    m.totalUses, m.equityAmount, m.debtAmount, inputs, seed,
  ));
}
