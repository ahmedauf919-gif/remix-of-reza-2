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
import type { LngOutputs } from "./lngModel";

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
  // Real CngYearRow leaf components — they sum exactly to r.opex
  // (opex = msOpex + msVat + trailerOpex + trailerVat + daughterOpex + headOffice).
  const opexBreakdown: OpexComponent[] = [
    { key: "salaries", label: "Salaries (Mother Station)", value: y => r(y).salaries ?? 0 },
    { key: "electricity", label: "Electricity (Mother Station)", value: y => r(y).electricity ?? 0 },
    { key: "msRent", label: "Mother Station Rent", value: y => r(y).msRent ?? 0 },
    { key: "msVat", label: "VAT on Mother Station OPEX", value: y => r(y).msVat ?? 0 },
    { key: "transportFixed", label: "Transport — Fixed", value: y => r(y).transportFixed ?? 0 },
    { key: "transportVariable", label: "Transport — Variable", value: y => r(y).transportVariable ?? 0 },
    { key: "tires", label: "Tires", value: y => r(y).tires ?? 0 },
    { key: "trailerVat", label: "VAT on Trailer OPEX", value: y => r(y).trailerVat ?? 0 },
    { key: "toll", label: "Tolls", value: y => r(y).toll ?? 0 },
    { key: "insurance", label: "Insurance", value: y => r(y).insurance ?? 0 },
    { key: "misc", label: "Miscellaneous", value: y => r(y).misc ?? 0 },
    { key: "headOffice", label: "Head Office Allocation", value: y => r(y).headOffice ?? 0 },
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
    slRate: I.slRatePct ?? 0,
    taxRate: I.citTaxRatePct ?? 0.225,
    arDays: I.arDays ?? 30,
    apDays: I.apDays ?? 30,
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
    ops.map((rr: any, i) => rr.year ?? i + 1), I.discountRateProject ?? 0.10,
    m.totalCapexEgp, m.equityAmount, m.debtAmount, inputs, seed,
  ));
}

// ─── Water (SWRO) ──────────────────────────────────────────────────
export async function exportWaterExcel(m: WaterOutputs) {
  const I = m.inputs;
  const ops = m.rows.filter((r: any) => (r.yearIdx ?? 0) >= 0);
  const r = (y: number) => (ops[y] as any) ?? {};
  // Real YearRow fields: fixedCost/variableCost/electricityCost/sga.
  // operatingCost = fixed + variable + electricity + major maintenance, so the MM
  // line is derived as the remainder; total breakdown = operatingCost + sga (= true opex).
  const opexBreakdown: OpexComponent[] = [
    { key: "om", label: "Operations & Maintenance (fixed + var)", value: y => (r(y).fixedCost ?? 0) + (r(y).variableCost ?? 0) },
    { key: "electricity", label: "Electricity", value: y => r(y).electricityCost ?? 0 },
    { key: "mm", label: "Major Maintenance", value: y => Math.max(0, (r(y).operatingCost ?? 0) - (r(y).fixedCost ?? 0) - (r(y).variableCost ?? 0) - (r(y).electricityCost ?? 0)) },
    { key: "sga", label: "SG&A", value: y => r(y).sga ?? 0 },
  ];
  const seed: StandardRowSeed = {
    revenue: y => r(y).revenue ?? 0,
    opex: y => opexBreakdown.reduce((s, c) => s + c.value(y), 0),
    opexBreakdown,
    depreciation: y => r(y).depreciation ?? 0,
    capex: y => r(y).capex ?? 0,
    debtDraw: y => r(y).debtDraw ?? 0,
    principalRepay: y => r(y).principalRepay ?? 0,
    slDraw: _y => 0,
    slPrincipalRepay: _y => 0,
    seniorRate: y => r(y).rate ?? I.debtRateYr1 ?? 0,
    slRate: I.shareholderLoanRate ?? 0,
    taxRate: I.taxRate ?? 0.225,
    arDays: I.receivablesDays ?? 30,
    apDays: I.payablesDays ?? 30,
    debtOpeningY1: r(0).debtOpening ?? m.debtAmount,
    slOpeningY1: 0, // shareholder-loan balances are not tracked per-row in the water model
    paidInEquity: y => r(y).paidInEquity ?? m.equityAmount,
    retainedEarnings: y => r(y).retainedEarnings ?? 0,
    netPPE: y => r(y).ppeNet ?? 0,
    cash: y => r(y).cash ?? 0,
    ar: y => r(y).accountsReceivable ?? 0,
    ap: y => r(y).accountsPayable ?? 0,
    interest: y => r(y).interest ?? 0,
    slInterest: _y => 0,
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
  // Segregated opex lines — these are the real AnnualRow fields and sum exactly to r.opex.
  const opexBreakdown: OpexComponent[] = [
    { key: "om", label: "Base O&M & Fixed Opex", value: y => r(y).opexBase ?? 0 },
    { key: "realEstate", label: "Real-Estate Tax", value: y => r(y).opexRealEstate ?? 0 },
    { key: "otherFixed", label: "Other Fixed Opex", value: y => r(y).opexOtherFixed ?? 0 },
    { key: "majorMaint", label: "Major Maintenance", value: y => r(y).opexMajorMaintenance ?? 0 },
    { key: "pctRev", label: "% of Revenue Items", value: y => r(y).opexPctRevenue ?? 0 },
    { key: "decomm", label: "Decommissioning Accrual", value: y => r(y).opexDecommissioning ?? 0 },
    { key: "levy", label: "Additional Levy", value: y => r(y).opexLevy ?? 0 },
  ];
  const seed: StandardRowSeed = {
    revenue: y => (r(y).revenue ?? 0) + (r(y).carbonRevenue ?? 0),
    opex: y => r(y).opex ?? 0,
    opexBreakdown,
    depreciation: y => r(y).depreciation ?? 0,
    capex: _y => 0, // major maintenance is expensed within opex; no ops-period capex rows
    debtDraw: _y => 0,
    principalRepay: y => r(y).principal ?? 0,
    slDraw: _y => 0,
    slPrincipalRepay: _y => 0,
    seniorRate: _y => m.blendedRate ?? 0,
    slRate: I.shLoanRate ?? 0,
    taxRate: I.taxRate ?? 0.225,
    arDays: I.daysReceivable ?? 30,
    apDays: I.daysPayable ?? 30,
    debtOpeningY1: r(0).openingDebt ?? m.debtAmount,
    slOpeningY1: m.shLoanAmount ?? 0,
    paidInEquity: _y => m.equityAmount,
    // AnnualRow.equity is the TOTAL equity book (paid-in + retained), so back out paid-in.
    retainedEarnings: y => (r(y).equity ?? 0) - m.equityAmount,
    netPPE: y => r(y).ppe ?? 0,
    cash: y => r(y).cash ?? 0,
    ar: y => r(y).receivables ?? 0,
    ap: y => r(y).payables ?? 0,
    interest: y => r(y).interest ?? 0,
    slInterest: _y => 0, // shareholder-loan interest is not tracked per-row in the wind model
    tax: y => r(y).tax ?? 0,
    workingCapDelta: y => r(y).workingCapitalChange ?? 0,
  };
  const inputs: ScalarInput[] = [
    ...inputsFromObject({
      projectName: I.projectName, country: I.country, scenario: I.scenario,
      constructionMonths: I.constructionMonths, operationsYears: I.operationsYears,
      epcCost: I.epcCost, contingency: I.contingency,
      taxRate: I.taxRate, riskFreeRate: I.riskFreeRate, equityBeta: I.equityBeta,
      daysReceivable: I.daysReceivable, daysPayable: I.daysPayable,
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

// ─── LNG (Tanzania Micro LNG) ───────────────────────────────────────
export async function exportLngExcel(m: LngOutputs) {
  const I = m.inputs;
  const ops = m.rows.filter(r => r.yearIdx >= 0);
  const r = (y: number) => ops[y] ?? ({} as any);
  const opexBreakdown: OpexComponent[] = [
    { key: "feedGas",    label: "Feed Gas Cost",              value: y => r(y).feedGasCost    ?? 0 },
    { key: "transport",  label: "Transport Cost",             value: y => r(y).transportCost  ?? 0 },
    { key: "fixedOpex",  label: "Fixed OPEX (Salaries + O&M)", value: y => r(y).fixedOpex    ?? 0 },
  ];
  const seed: StandardRowSeed = {
    revenue:           y => r(y).revenue        ?? 0,
    opex:              y => (r(y).totalOpex ?? 0) + (r(y).feedGasCost ?? 0),
    opexBreakdown,
    depreciation:      y => r(y).depreciation   ?? 0,
    capex:             y => r(y).capex           ?? 0,
    debtDraw:          y => r(y).seniorDraw      ?? 0,
    principalRepay:    y => r(y).seniorRepay     ?? 0,
    slDraw:            y => r(y).shlDraw         ?? 0,
    slPrincipalRepay:  y => r(y).shlRepay        ?? 0,
    seniorRate:        _y => I.seniorInterestRatePct,
    slRate:            I.shlInterestRatePct,
    taxRate:           I.taxRatePct,
    arDays:            I.arMonths * 30,
    apDays:            I.apMonths * 30,
    debtOpeningY1:     m.seniorDebt,
    slOpeningY1:       m.shlAmount,
    paidInEquity:      y => r(y).paidInEquity    ?? m.equityAmount,
    retainedEarnings:  y => r(y).retainedEarnings ?? 0,
    netPPE:            y => r(y).netPPE          ?? 0,
    cash:              y => r(y).cash            ?? 0,
    ar:                y => r(y).ar              ?? 0,
    ap:                y => r(y).ap              ?? 0,
    interest:          y => r(y).seniorInterest  ?? 0,
    slInterest:        y => r(y).shlInterest     ?? 0,
    tax:               y => r(y).tax             ?? 0,
    workingCapDelta:   y => r(y).wcDelta         ?? 0,
  };
  const inputs: ScalarInput[] = [
    ...inputsFromObject({
      projectName:              I.projectName,
      startYear:                I.startYear,
      projectDurationYears:     I.projectDurationYears,
      constructionMonths:       I.constructionMonths,
      capacityM3LngPerDay:      I.capacityM3LngPerDay,
      facilityOperatingDays:    I.facilityOperatingDays,
      demandUtilizationPct:     I.demandUtilizationPct,
      sellingPriceUsdPerMmbtu:  I.sellingPriceUsdPerMmbtu,
      feedGasPriceUsdPerMmbtu:  I.feedGasPriceUsdPerMmbtu,
      numSemiTrailers:          I.numSemiTrailers,
      roundTripDistanceKm:      I.roundTripDistanceKm,
      transportCostUsdPerKm:    I.transportCostUsdPerKm,
      contingencyPct:           I.contingencyPct,
      debtRatioPct:             I.debtRatioPct,
      shlPctOfDebt:             I.shlPctOfDebt,
      seniorInterestRatePct:    I.seniorInterestRatePct,
      shlInterestRatePct:       I.shlInterestRatePct,
      debtTenorYears:           I.debtTenorYears,
      debtGraceYears:           I.debtGraceYears,
      taxRatePct:               I.taxRatePct,
      discountRateProject:      I.discountRateProject,
      discountRateEquity:       I.discountRateEquity,
    }, "Project & Financing"),
    { label: "── Computed ──",       value: "",              group: "Headline Results" },
    { label: "Total CAPEX (USD)",    value: m.totalCapexUsd, group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Senior Debt (USD)",    value: m.seniorDebt,    group: "Headline Results", fmt: FMT_NUM0 },
    { label: "SHL (USD)",            value: m.shlAmount,     group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Equity (USD)",         value: m.equityAmount,  group: "Headline Results", fmt: FMT_NUM0 },
    { label: "Project IRR (app)",    value: m.projectIRR,    group: "Headline Results", fmt: FMT_PCT },
    { label: "Equity IRR (app)",     value: m.equityIRR,     group: "Headline Results", fmt: FMT_PCT },
    { label: "Min DSCR (app)",       value: m.minDSCR,       group: "Headline Results", fmt: "0.00\"x\"" },
    { label: "Break-even Price (app)", value: m.breakEvenPriceUsd, group: "Headline Results", fmt: "0.00" },
    { label: "LCOE (USD/MMBTU)",     value: m.lcoe,          group: "Headline Results", fmt: "0.0000" },
  ];
  await exportProjectFinanceExcel(buildSpec(
    `LNG_Tanzania_Model_${(I.projectName || "project").replace(/\s+/g, "_")}.xlsx`,
    I.projectName ?? "Tanzania Micro LNG", "Tanzania Micro LNG — Project Finance Model",
    // NPV(FCFF) must discount at the project rate, not the equity rate.
    ops.map(rr => rr.year), I.discountRateProject,
    m.totalCapexUsd, m.equityAmount, m.seniorDebt + m.shlAmount, inputs, seed,
  ));
}
