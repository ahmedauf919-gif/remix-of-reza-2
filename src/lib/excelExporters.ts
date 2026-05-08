// Per-model exporters — wire each model's solved output into the generic exporter.
import { exportProjectFinanceExcel, buildStandardRows, ExcelExportSpec, StandardRowSeed } from "./excelExport";
import type { PvOutputs, PvInputs } from "./pvModel";
import type { CngOutputs, CngInputs } from "./cngModel";
import type { WaterOutputs, WaterInputs } from "./waterModel";
import type { ModelOutputs as WindOutputs, ProjectInputs as WindInputs } from "./windModel";

const FMT_NUM0 = "#,##0;(#,##0);-";
const FMT_PCT = "0.0%;(0.0%);-";

function inputsFromObject(obj: Record<string, any>, group: string) {
  const out: { label: string; value: number | string; group: string }[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v == null) continue;
    if (typeof v === "object") continue; // skip nested arrays/objects
    if (typeof v === "boolean") { out.push({ label: k, value: v ? "Yes" : "No", group }); continue; }
    out.push({ label: k, value: v as any, group });
  }
  return out;
}

// ─── PV (Solar) ───────────────────────────────────────────────────
export async function exportPvExcel(m: PvOutputs) {
  const I = m.inputs;
  const N = m.rows.length;
  const seed: StandardRowSeed = {
    revenue: y => m.rows[y]?.revenue ?? 0,
    opex: y => m.rows[y]?.opex ?? 0,
    depreciation: y => m.rows[y]?.depreciation ?? 0,
    interest: y => m.rows[y]?.interest ?? 0,
    slInterest: y => m.rows[y]?.slInterest ?? 0,
    tax: y => m.rows[y]?.tax ?? 0,
    capex: y => m.rows[y]?.capex ?? 0,
    debtDraw: y => m.rows[y]?.debtDraw ?? 0,
    principalRepay: y => m.rows[y]?.principalRepay ?? 0,
    slDraw: y => m.rows[y]?.slDraw ?? 0,
    slPrincipalRepay: y => m.rows[y]?.slPrincipalRepay ?? 0,
    workingCapDelta: y => m.rows[y]?.workingCapDelta ?? 0,
    debtOpeningY1: m.rows[0]?.debtOpening ?? m.debtAmount,
    slOpeningY1: m.rows[0]?.slOpening ?? m.shareholderLoan,
    ar: y => m.rows[y]?.ar ?? 0,
    ap: y => m.rows[y]?.ap ?? 0,
    netPPE: y => m.rows[y]?.netPPE ?? 0,
    cash: y => m.rows[y]?.cash ?? 0,
    paidInEquity: y => m.rows[y]?.paidInEquity ?? 0,
    retainedEarnings: y => m.rows[y]?.retainedEarnings ?? 0,
  };

  const spec: ExcelExportSpec = {
    fileName: `PV_Solar_Model_${(I.projectName || "project").replace(/\s+/g, "_")}.xlsx`,
    projectName: I.projectName ?? "PV Project",
    modelLabel: "PV (Solar) Project Finance Model",
    years: N,
    yearLabels: m.rows.map(r => r.year),
    discountRate: 0.10,
    initialCapex: m.totalCapexEgp,
    initialEquity: m.equityAmount,
    initialDebt: m.debtAmount,
    inputs: [
      ...inputsFromObject({
        projectName: I.projectName, capacityKwp: I.capacityKwp, contractYears: I.contractYears,
        constructionMonths: I.constructionMonths, voltageLevel: I.voltageLevel,
        govtBaseTariffEgp: I.govtBaseTariffEgp, govtEscalationPct: I.govtEscalationPct,
        contingencyPct: I.contingencyPct, taxRate: I.taxRatePct,
        loanTenorYears: I.loanTenorYears, graceYears: I.graceYears,
        spreadPct: I.spreadPct,
      }, "Project & Financing"),
      { label: "── Outputs (computed) ──", value: "", group: "Headline Results" },
      { label: "Total CAPEX (EGP)", value: m.totalCapexEgp, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Senior Debt (EGP)", value: m.debtAmount, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Equity (EGP)", value: m.equityAmount, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Project IRR", value: m.projectIRR, group: "Headline Results", fmt: FMT_PCT },
      { label: "Equity IRR", value: m.equityIRR, group: "Headline Results", fmt: FMT_PCT },
      { label: "Min DSCR", value: m.minDSCR, group: "Headline Results", fmt: "0.00\"x\"" },
      { label: "LCOE (EGP/kWh)", value: m.lcoeEgpPerKwh, group: "Headline Results", fmt: "0.0000" },
    ],
    rows: buildStandardRows(seed),
  };
  await exportProjectFinanceExcel(spec);
}

// ─── CNG ──────────────────────────────────────────────────────────
export async function exportCngExcel(m: CngOutputs) {
  const I = m.inputs;
  const N = m.rows.length;
  const seed: StandardRowSeed = {
    revenue: y => m.rows[y]?.revenue ?? 0,
    opex: y => m.rows[y]?.opex ?? 0,
    depreciation: y => m.rows[y]?.depreciation ?? 0,
    interest: y => m.rows[y]?.interest ?? 0,
    slInterest: y => m.rows[y]?.slInterest ?? 0,
    tax: y => m.rows[y]?.tax ?? 0,
    capex: y => m.rows[y]?.capex ?? 0,
    debtDraw: y => m.rows[y]?.debtDraw ?? 0,
    principalRepay: y => m.rows[y]?.principalRepay ?? 0,
    slDraw: y => m.rows[y]?.slDraw ?? 0,
    slPrincipalRepay: y => m.rows[y]?.slPrincipalRepay ?? 0,
    workingCapDelta: y => m.rows[y]?.workingCapDelta ?? 0,
    debtOpeningY1: m.rows[0]?.debtOpening ?? m.debtAmount,
    slOpeningY1: m.rows[0]?.slOpening ?? m.shareholderLoan,
    ar: y => m.rows[y]?.ar ?? 0,
    ap: y => m.rows[y]?.ap ?? 0,
    netPPE: y => m.rows[y]?.netPPE ?? 0,
    cash: y => m.rows[y]?.cash ?? 0,
    paidInEquity: y => m.rows[y]?.paidInEquity ?? 0,
    retainedEarnings: y => m.rows[y]?.retainedEarnings ?? 0,
  };
  await exportProjectFinanceExcel({
    fileName: `CNG_Model_${(I.projectName || "project").replace(/\s+/g, "_")}.xlsx`,
    projectName: I.projectName ?? "CNG Project",
    modelLabel: "Mobile CNG Project Finance Model",
    years: N,
    yearLabels: m.rows.map(r => r.year),
    discountRate: 0.10,
    initialCapex: m.totalCapexEgp,
    initialEquity: m.equityAmount,
    initialDebt: m.debtAmount,
    inputs: [
      ...inputsFromObject({
        projectName: I.projectName, contractYears: I.contractYears,
        constructionMonths: I.constructionMonths,
        loanTenorYears: I.loanTenorYears,
        graceYears: I.graceYears, spreadPct: I.spreadPct,
        contingencyPct: I.contingencyPct,
      }, "Project & Financing"),
      { label: "Total CAPEX", value: m.totalCapexEgp, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Senior Debt", value: m.debtAmount, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Equity", value: m.equityAmount, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Project IRR", value: m.projectIRR, group: "Headline Results", fmt: FMT_PCT },
      { label: "Equity IRR", value: m.equityIRR, group: "Headline Results", fmt: FMT_PCT },
      { label: "Min DSCR", value: m.minDSCR, group: "Headline Results", fmt: "0.00\"x\"" },
      { label: "LCOM (EGP/m³)", value: m.lcomEgpPerM3, group: "Headline Results", fmt: "0.0000" },
    ],
    rows: buildStandardRows(seed),
  });
}

// ─── Water (SWRO) ─────────────────────────────────────────────────
export async function exportWaterExcel(m: WaterOutputs) {
  const I = m.inputs;
  const N = m.rows.length;
  // Water YearRow uses different field names — adapt.
  const r = (y: number) => (m.rows[y] as any) ?? {};
  const seed: StandardRowSeed = {
    revenue: y => r(y).revenue ?? 0,
    opex: y => (r(y).fixedOpex ?? 0) + (r(y).variableOpex ?? 0) + (r(y).electricityCost ?? 0) + (r(y).sga ?? 0) + (r(y).mmra ?? 0) + (r(y).insurance ?? 0),
    depreciation: y => r(y).depreciation ?? 0,
    interest: y => r(y).interest ?? 0,
    slInterest: y => r(y).slInterest ?? 0,
    tax: y => r(y).tax ?? 0,
    capex: y => r(y).capex ?? r(y).mmCapex ?? 0,
    debtDraw: y => r(y).debtDraw ?? 0,
    principalRepay: y => r(y).principalRepay ?? 0,
    slDraw: y => r(y).slDraw ?? 0,
    slPrincipalRepay: y => r(y).slPrincipalRepay ?? 0,
    workingCapDelta: y => r(y).workingCapDelta ?? 0,
    debtOpeningY1: r(0).debtOpening ?? m.debtAmount,
    slOpeningY1: r(0).slOpening ?? 0,
    ar: y => r(y).ar ?? 0,
    ap: y => r(y).ap ?? 0,
    netPPE: y => r(y).netPPE ?? 0,
    cash: y => r(y).cash ?? 0,
    paidInEquity: y => r(y).paidInEquity ?? m.equityAmount,
    retainedEarnings: y => r(y).retainedEarnings ?? 0,
  };
  await exportProjectFinanceExcel({
    fileName: `Water_SWRO_Model_${(I.projectName || "project").replace(/\s+/g, "_")}.xlsx`,
    projectName: I.projectName ?? "SWRO Project",
    modelLabel: "Water (SWRO) Project Finance Model",
    years: N,
    yearLabels: m.rows.map((rr: any, i) => rr.year ?? i + 1),
    discountRate: 0.10,
    initialCapex: m.totalCapexWithIdc,
    initialEquity: m.equityAmount,
    initialDebt: m.debtAmount,
    inputs: [
      ...inputsFromObject({
        projectName: I.projectName, capacityM3Day: I.capacityM3Day, contractYears: I.contractYears,
        constructionMonths: I.constructionMonths, debtToEquity: I.debtToEquity,
        loanTenorYears: I.loanTenorYears, debtRateYr1: I.debtRateYr1,
        contingencyPct: I.contingencyPct,
      }, "Project & Financing"),
      { label: "Total CAPEX (with IDC)", value: m.totalCapexWithIdc, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Senior Debt", value: m.debtAmount, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Equity", value: m.equityAmount, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Project IRR", value: m.projectIRR, group: "Headline Results", fmt: FMT_PCT },
      { label: "Equity IRR", value: m.equityIRR, group: "Headline Results", fmt: FMT_PCT },
      { label: "Min DSCR", value: m.minDSCR, group: "Headline Results", fmt: "0.00\"x\"" },
      { label: "LCOM³ (EGP/m³)", value: m.lcom3, group: "Headline Results", fmt: "0.0000" },
    ],
    rows: buildStandardRows(seed),
  });
}

// ─── Wind / REZA ──────────────────────────────────────────────────
export async function exportWindExcel(m: WindOutputs) {
  const I = m.inputs;
  const N = m.rows.length;
  const r = (y: number) => (m.rows[y] as any) ?? {};
  const seed: StandardRowSeed = {
    revenue: y => r(y).revenue ?? 0,
    opex: y => (r(y).opex ?? 0) + (r(y).insurance ?? 0) + (r(y).landLease ?? 0),
    depreciation: y => r(y).depreciation ?? 0,
    interest: y => r(y).interestExpense ?? r(y).interest ?? 0,
    slInterest: y => r(y).shLoanInterest ?? 0,
    tax: y => r(y).tax ?? 0,
    capex: y => r(y).majorMaintenance ?? 0,
    debtDraw: y => r(y).debtDraw ?? 0,
    principalRepay: y => r(y).debtRepayment ?? r(y).principalRepay ?? 0,
    slDraw: y => r(y).shLoanDraw ?? 0,
    slPrincipalRepay: y => r(y).shLoanRepay ?? 0,
    workingCapDelta: y => r(y).workingCapitalDelta ?? 0,
    debtOpeningY1: r(0).debtOpening ?? m.debtAmount,
    slOpeningY1: r(0).shLoanOpening ?? m.shLoanAmount ?? 0,
    ar: y => r(y).ar ?? 0,
    ap: y => r(y).ap ?? 0,
    netPPE: y => r(y).netPPE ?? 0,
    cash: y => r(y).cash ?? 0,
    paidInEquity: y => r(y).paidInEquity ?? m.equityAmount,
    retainedEarnings: y => r(y).retainedEarnings ?? 0,
  };
  await exportProjectFinanceExcel({
    fileName: `REZA_Wind_Model_${(I.projectName || "project").replace(/\s+/g, "_")}.xlsx`,
    projectName: I.projectName ?? "Wind Project",
    modelLabel: "REZA — Wind Project Finance Model",
    years: N,
    yearLabels: m.rows.map((rr: any, i) => rr.year ?? rr.calendarYear ?? i + 1),
    discountRate: m.wacc ?? 0.10,
    initialCapex: m.totalUses,
    initialEquity: m.equityAmount,
    initialDebt: m.debtAmount,
    inputs: [
      ...inputsFromObject({
        projectName: I.projectName, country: I.country, scenario: I.scenario,
        constructionMonths: I.constructionMonths, operationsYears: I.operationsYears,
        epcCost: I.epcCost, contingency: I.contingency, taxRate: (I as any).taxRate,
        riskFreeRate: (I as any).riskFreeRate, equityBeta: (I as any).equityBeta,
      }, "Project"),
      { label: "Total Uses", value: m.totalUses, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Senior Debt", value: m.debtAmount, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "Equity", value: m.equityAmount, group: "Headline Results", fmt: FMT_NUM0 },
      { label: "WACC", value: m.wacc, group: "Headline Results", fmt: FMT_PCT },
      { label: "Project IRR", value: m.projectIRR, group: "Headline Results", fmt: FMT_PCT },
      { label: "Equity IRR (blended)", value: m.blendedEquityIRR ?? m.equityIRR, group: "Headline Results", fmt: FMT_PCT },
      { label: "Min DSCR", value: m.minDSCR, group: "Headline Results", fmt: "0.00\"x\"" },
      { label: "LCOE (USD/kWh)", value: m.lcoeUsdPerKWh, group: "Headline Results", fmt: "0.0000" },
    ],
    rows: buildStandardRows(seed),
  });
}
