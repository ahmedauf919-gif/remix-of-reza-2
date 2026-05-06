// Wind 552 MWp project finance engine
// Closed-form IDC where possible; fixed-point iteration for DSCR-sculpted debt sizing.
// Inputs schema mirrors the Excel "Inputs" tab — all granular assumptions are exposed,
// then aggregated inside runModel to feed the simulation.
import damodaranERPData from "./damodaranERP.json";

type DamodaranRow = { country: string; rating: string; adjDefaultSpread: number | null; countryRiskPremium: number | null; erp: number | null; corpTax: number | null; sovCDS: number | null; cdsErp: number | null };
const DAMODARAN_ERP = damodaranERPData as DamodaranRow[];

/** Lookup country ERP (decimal) from Damodaran dataset. Returns 0 if not found. */
export function getCountryERP(country: string): number {
  if (!country) return 0;
  const row = DAMODARAN_ERP.find(r => r.country.toLowerCase() === country.toLowerCase());
  return row?.erp != null ? row.erp / 100 : 0;
}

/** Lookup Country Risk Premium (decimal) from Damodaran dataset. Returns 0 if not found. */
export function getCountryRiskPremium(country: string): number {
  if (!country) return 0;
  const row = DAMODARAN_ERP.find(r => r.country.toLowerCase() === country.toLowerCase());
  return row?.countryRiskPremium != null ? row.countryRiskPremium / 100 : 0;
}

/** Compute WACC (decimal) using Damodaran convention:
 *  Cost of Equity = Rf + β × Mature-Market ERP + Country Risk Premium (CRP)
 *  CRP can be overridden (e.g. set to 0) without losing the mature-market premium.
 */
export function computeWACC(opts: {
  country: string; riskFreeRate: number; equityBeta: number; gearing: number;
  costOfDebt: number; taxRate: number;
  matureMarketERP: number;             // e.g. 0.046 for US
  useCrpOverride?: 0 | 1; crpOverride?: number;
  // Backwards-compat (legacy field name still supported)
  useErpOverride?: 0 | 1; erpOverride?: number;
}): { wacc: number; costOfEquity: number; afterTaxKd: number; erp: number; crp: number } {
  const merp = opts.matureMarketERP ?? 0;
  // Resolve CRP: prefer new override, else legacy override (which used to mean total-ERP override → treat as CRP override now), else Damodaran lookup.
  const useOverride = (opts.useCrpOverride ?? opts.useErpOverride) ? 1 : 0;
  const overrideVal = opts.crpOverride ?? opts.erpOverride ?? 0;
  const crp = useOverride ? overrideVal : getCountryRiskPremium(opts.country);
  const costOfEquity = opts.riskFreeRate + opts.equityBeta * merp + crp;
  const afterTaxKd = opts.costOfDebt * (1 - opts.taxRate);
  const wacc = (1 - opts.gearing) * costOfEquity + opts.gearing * afterTaxKd;
  return { wacc, costOfEquity, afterTaxKd, erp: merp + crp, crp };
}

export type SizingMethod = "annuity" | "sculpted" | "llcr-sculpted" | "manual" | "bullet" | "mortgage";
export type BaseRateRef = "SOFR" | "LIBOR" | "CBE" | "Fixed";
export type YieldCase = "P50" | "P75" | "P90";

export interface DebtTranche {
  name: string;
  enabled: boolean;
  baseRate: number;        // e.g. SOFR
  baseRateRef?: BaseRateRef; // selector — which macro base rate this tranche references
  hedgedPct: number;       // % of notional hedged
  hedgedRate: number;      // hedged fixed rate
  underlyingRate: number;  // floating spread post-hedge
  riskMargin: number;
  upfrontFeePct: number;
  commitmentFeePct: number;
  agencyFee: number;       // USD '000 p.a.
  method: SizingMethod;
  targetDSCR: number;      // for sculpted
  sharePct: number;        // share of total debt (used for blending)
}

export interface ProjectInputs {
  // ── Identity ─────────────────────────────────────────────────────────
  projectName: string;
  scenario: string;
  companyName: string;
  country: string;
  modelType: string;

  // ── Timing ───────────────────────────────────────────────────────────
  constructionStart: number; // year
  constructionMonths: number;
  preOpsMonths: number;
  operationsYears: number;
  planningMonths: number;
  delayMonths: number;
  planningStartYear: number;

  // ── Capex breakdown (USD '000, fixed) ────────────────────────────────
  preConstructionCosts: number;
  epcCost: number;
  developmentPremiums: number;
  developmentExpenses: number;
  land: number;
  esMeasures: number;
  lendersTechAdvisors: number;
  legalExpenses: number;
  administrativeCosts: number;
  financialAudit: number;
  insuranceConstruction: number;
  contingency: number;
  substation: number;
  loanRepayment: number;          // capex line
  taxesCapex: number;
  capexSpare15: number;
  capexSpare16: number;
  capexSpare17: number;
  capexSpare18: number;
  capexSpare19: number;
  capexSpare20: number;
  delayCostsPerMonth: number;     // USD '000 p.m.
  // Compensation payments (during construction, USD '000)
  compEsmp: number;
  compCsr: number;
  // Major maintenance (real, USD '000 — annualised average)
  mmWindSpareParts: number;
  mmSubstationSpareParts: number;
  mmDecommissioning: number;
  mmPmCm: number;
  mmSpare: number;
  // Major maintenance schedule — % of hard capex per operations year (length = operationsYears)
  mmSchedulePctOfCapex?: number[];

  // ── Reserves ─────────────────────────────────────────────────────────
  dsraInitial: number;            // USD '000
  dsraTargetMonths: number;
  dsraSwitch: 0 | 1;
  performanceBond: number;        // USD '000
  contingentLoanOnDSRA: 0 | 1;
  feeOnDSRAPct: number;
  corpGuaranteeMonths: number;
  corpGuaranteeFeePct: number;
  manualDSRASwitch: 0 | 1;
  manualDSRAInput: number;
  // Performance bond stepdown
  pbStartExposure: number;
  pbStep1Exposure: number;
  pbStep2Exposure: number;
  pbStartYear: number;
  pbStep1Year: number;
  pbStep2Year: number;
  pbEndYear: number;
  // Statutory reserve
  statReserveMinNOPATPct: number;
  shareCapital: number;
  // Initial working capital
  initialWCAmount: number;
  cashShortageOpY1: number;

  // ── Production ───────────────────────────────────────────────────────
  capacityMWp: number;
  hoursPerDay: number;            // typically 24
  yieldKWhPerKWp: number;         // P50
  yieldCase: YieldCase;
  yieldP75Pct: number;            // 0.95
  yieldP90Pct: number;            // 0.90
  yieldSparePct: number;
  // Seasonal flow curve — 12 months (% of total year, per case). UI-only by default.
  seasonalP50: number[];
  seasonalP75: number[];
  seasonalP90: number[];
  // Availability cases
  availabilityBase: number;
  availabilityHigh: number;
  availabilityLow: number;
  availabilityCase: "Base" | "High" | "Low";

  // Loss factors (multiplicative, decimals)
  degradation: number;
  ownConsumption: number;
  transformerLosses: number;
  lineLosses: number;
  otherLosses: number;
  ownConsumptionLoss: number;     // legacy combined; kept for back-compat
  availability: number;

  // ── Tariff ───────────────────────────────────────────────────────────
  tariffCurrency: "USD" | "EGP" | "EUR";
  tariffUsdPerKWh: number;
  tariffEscalation: number;
  tariffPostYearGrowth: number;   // growth rate after fixed-price end
  tariffFixedYears: number;       // 25 in template
  tariffIndexUSDWeight: number;   // 0.75
  tariffIndexEGPWeight: number;   // 0.25
  tariffPriceEGP: number;
  tariffInflationChoice: "Zero-inflation" | "CPI" | "CPI US Dollar" | "CPI Blend US-EGP";
  tariffLinkedTo: "Operation" | "Calendar";
  tariffCase: "Base" | "Worst" | "Spare";
  tariffWorstUsdPerKWh: number;
  tariffSpareUsdPerKWh: number;

  // ── CDM / carbon ─────────────────────────────────────────────────────
  cdmSwitch: 0 | 1;
  cdmStartYear: number;
  cdmDurationYears: number;
  gridEmissionFactor: number;     // tCO2/MWh
  cdmPriceUSD: number;            // USD / tCO2

  // ── Opex (USD '000 p.a., real) ───────────────────────────────────────
  oAndM: number;
  assetMgmt: number;
  spvCost: number;
  insurance: number;
  csrContribution: number;
  eetcCost: number;
  cpi: number;                    // opex escalation
  bondExpenses: number;
  lease: number;
  auxiliaryPower: number;
  opexContingency: number;
  usufructEGP: number;
  // Variable per MWh
  varOpexSpare1: number;
  varOpexSpare2: number;
  varOpexSpare3: number;
  // % of revenue items
  pctRevConvLocalEUR: number;
  pctRevUsufructLease: number;
  pctRevInsuranceOps: number;
  migaPremium: number;
  opexVat: number;                // manual VAT applied on final opex (USD '000 p.a., escalated by CPI)

  // Working capital
  daysReceivable: number;
  daysPayable: number;
  debtorMonths: number;
  creditorMonths: number;

  // ── Debt sizing — overall ────────────────────────────────────────────
  sizingMode: "fixed-gearing" | "dscr-sculpted" | "llcr-sculpted" | "manual" | "bullet" | "mortgage";
  baseRateRef?: BaseRateRef; // overall base-rate reference
  gearing: number;                // fixed-gearing target
  targetDSCR: number;             // overall sculpting target
  debtTenorYears: number;
  graceYears: number;
  paymentPeriodicity: "Quarterly" | "Semi-annual" | "Annual";

  // Three tranches (Debt 1/2/3)
  debt1: DebtTranche;
  debt2: DebtTranche;
  debt3: DebtTranche;

  // Aggregate (auto-derived for engine; can be overridden)
  interestRate: number;
  upfrontFeePct: number;
  commitmentFeePct: number;

  // Refinancing (Debt 1)
  refinanceSwitch: 0 | 1;
  refinanceYear: number;
  refinanceFee: number;
  refinanceMargin: number;
  refinanceAmount: number;

  // Shareholder loan
  shLoanFunding: number;
  shLoanRate: number;
  shLoanFullyRepaid: 0 | 1;

  // Preferential equity
  prefEquityFunding: number;
  prefEquityCoupon: number;
  prefCashCollateralPct: number;
  prefPlacementFeePct: number;
  totalEquityExclPlanning: number;
  planningPhaseEquity: number;

  // Cost overrun facility
  cofStandbyLimit: number;
  cofGearing: number;
  cofLimit: number;
  cofTenorYears: number;
  cofGraceYears: number;
  cofHedgedPct: number;
  cofHedgedRate: number;
  cofMargin: number;
  cofUpfrontFee: number;
  cofCommitmentFeeOfMargin: number;
  cofCommitmentFee: number;
  cofTargetDSCR: number;

  // Subordinated debt
  subDebtLimit: number;
  subDebtTenorYears: number;
  subDebtGraceYears: number;
  subDebtMargin: number;
  subDebtUpfrontFee: number;
  subDebtCommitmentFeeOfMargin: number;
  subDebtCommitmentFee: number;
  subDebtAgencyFee: number;
  subDebtMethod: SizingMethod;
  subDebtTargetDSCR: number;
  subDebtManualRepayment: number;

  // ── Distributions ────────────────────────────────────────────────────
  payoutRatio: number;            // 0..1
  divRestrictedToRetainedEarnings: 0 | 1;
  minCashBalance: number;
  minCashBalanceMultiple: number;
  linkOpexLoanTenor: 0 | 1;
  linkOpexMonths: number;
  carriedInterestPct: number;
  carriedInterestOneTime: number;

  // ── Tax & depreciation ───────────────────────────────────────────────
  taxRate: number;
  taxStartYear: number;
  taxPeriods: number;
  taxEndYear: number;
  additionalLevy: number;
  realEstateTaxRate: number;
  realEstateTaxableAmount: number;
  exemptedProportion: number;
  rentalValuePct: number;
  taxHolidayYears: number;
  taxHolidayStartYear: number;
  taxHolidayEndYear: number;
  csrTaxDeductible: 0 | 1;
  // NOKUS (Norwegian)
  nokusRate: number;
  nokusStartYear: number;
  nokusEndYear: number;
  nokusThresholdRate: number;
  taxCalcMonths: number;
  taxAdvanceMonths: number;
  taxBalanceMonths: number;

  whtDividendsSwitch: 0 | 1;
  whtDividendsRate: number;
  whtSHLoanSwitch: 0 | 1;
  whtSHLoanRate: number;
  whtPrefShareSwitch: 0 | 1;
  whtPrefShareRate: number;

  relPartyDeductLimitSwitch: 0 | 1;
  relPartyDeductMultiple: number; // x outstanding equity

  depreciationYears: number;      // Long term (PPE)
  idcDepreciationYears: number;   // IDC & Fees

  // ── Discount rates ───────────────────────────────────────────────────
  discountRateProject: number;       // pre-tax
  discountRateProjectPostTax: number;
  discountRateInvestor: number;
  discountRateEquity: number;        // common equity
  discountRatePref: number;

  // ── Macro ────────────────────────────────────────────────────────────
  baseRateSelection: string;
  baseRate: number;               // SOFR
  baseRateLIBOR: number;
  baseRateCBE: number;
  cpiGeneral: number;
  cpiUSDollar: number;
  cpiBlend: number;
  oAndMInflRate: number;
  lcoeDiscountFactor: number;
  depositRate: number;
  modelInflationOn: 0 | 1;
  inflationSelection: "CPI" | "Zero-inflation" | "CPI US Dollar" | "CPI Blend US-EGP";

  // ── Cost of Capital (Damodaran-based WACC) ───────────────────────────
  riskFreeRate: number;            // decimal e.g. 0.045
  equityBeta: number;              // levered beta
  matureMarketERP: number;         // mature-market ERP (e.g. 0.046 for US/global mature)
  useErpOverride: 0 | 1;           // when 1, override Country Risk Premium (CRP)
  erpOverride: number;             // CRP override value (decimal); 0 disables CRP
  useWaccForLcoe: 0 | 1;           // when 1, LCOE uses computed WACC instead of lcoeDiscountFactor

  // FX
  fxEUR: number;
  fxEGP: number;
  fxSpare: number;

  // Covenants — targets
  covInPeriodP50: number;
  covInPeriodP90: number;
  cov12moBwP50: number;
  cov12moBwP90: number;
  cov12moFwP50: number;
  cov12moFwP90: number;
  llcrP50: number;
  llcrP90: number;
  plcrP50: number;
  plcrP90: number;

  // ── Construction drawdown schedule ───────────────────────────────────
  // Percent of total capex spent in each construction month (sum should = 100%).
  // Length must equal constructionMonths (1..36 supported, i.e. up to 3 years).
  capexSchedulePct: number[];
  // Optional per-capex-item monthly allocation (% per month, length up to constructionMonths).
  // If a key is missing or its array is empty, the global capexSchedulePct is used for that item.
  capexItemSchedulesPct?: Partial<Record<string, number[]>>;

  // ── Phase 2: per-item basis / tax engine ─────────────────────────────
  // Per-capex-item: basis = "perMW" → stored amount is USD/MW (×capacity to get USD '000); else "abs" (USD '000 as today).
  capexBasisPerMW?: Partial<Record<string, 0 | 1>>;
  // Per-capex-item: taxable flag (drives auto VAT + customs). Defaults true for EPC/BoP/civil/grid items, false for financing/reserves.
  capexTaxable?: Partial<Record<string, boolean>>;
  // Per-capex-item: % of supply that is onshore (subject to local VAT). Remainder is offshore (subject to customs duty).
  capexOnshorePct?: Partial<Record<string, number>>;
  // Auto-compute taxesCapex from the above (1 = auto, 0 = manual). When 1, the manual taxesCapex value is overridden.
  taxesCapexAuto?: 0 | 1;
  vatRate: number;            // local VAT, decimal (e.g. 0.14)
  customsDutyRate: number;    // customs duty on offshore supply, decimal (e.g. 0.05)

  // Per-OPEX-item: basis = "perMW" → stored amount is USD/MW p.a.; else absolute USD '000 p.a.
  opexBasisPerMW?: Partial<Record<string, 0 | 1>>;
}

// Phase 2 helpers ---------------------------------------------------------------
// Items that should NEVER be auto-taxed (financing/reserves/already-tax line itself).
export const CAPEX_TAX_EXCLUDED = new Set<string>([
  "loanRepayment", "taxesCapex",
]);
// Default taxable items (EPC + BoP/civil/grid + everything physical). Financing items default off.
export const CAPEX_TAXABLE_DEFAULT: Record<string, boolean> = {
  epcCost: true, substation: true, contingency: true,
  preConstructionCosts: true, developmentPremiums: true, developmentExpenses: true,
  land: true, esMeasures: true, lendersTechAdvisors: true, legalExpenses: true,
  administrativeCosts: true, financialAudit: true, insuranceConstruction: true,
  compEsmp: true, compCsr: true,
  capexSpare15: true, capexSpare16: true, capexSpare17: true,
  capexSpare18: true, capexSpare19: true, capexSpare20: true,
};

/** Resolve effective capex amount in USD '000, applying per-MW basis if set. */
export function effectiveCapexAmount(I: ProjectInputs, key: string, raw: number): number {
  const basis = I.capexBasisPerMW?.[key] ?? 0;
  if (basis === 1) return (raw || 0) * (I.capacityMWp || 0); // USD/MW × MW = USD '000 if user entered amount in $'000/MW
  return raw || 0;
}
/** Resolve effective opex amount in USD '000 p.a., applying per-MW basis if set. */
export function effectiveOpexAmount(I: ProjectInputs, key: string, raw: number): number {
  const basis = I.opexBasisPerMW?.[key] ?? 0;
  if (basis === 1) return (raw || 0) * (I.capacityMWp || 0);
  return raw || 0;
}
/** Compute auto taxesCapex (USD '000) from VAT + customs across taxable items. */
export function computeAutoTaxesCapex(I: ProjectInputs, items: Record<string, number>): number {
  const vat = I.vatRate || 0, duty = I.customsDutyRate || 0;
  let total = 0;
  for (const [k, amt] of Object.entries(items)) {
    if (CAPEX_TAX_EXCLUDED.has(k)) continue;
    const taxable = I.capexTaxable?.[k] ?? CAPEX_TAXABLE_DEFAULT[k] ?? false;
    if (!taxable) continue;
    const onshore = Math.max(0, Math.min(1, I.capexOnshorePct?.[k] ?? 1));
    total += amt * (onshore * vat + (1 - onshore) * duty);
  }
  return total;
}

export const DEFAULT_DEBT1: DebtTranche = {
  name: "Senior Debt 1", enabled: true,
  baseRate: 0.041, hedgedPct: 0.7, hedgedRate: 0.041, underlyingRate: 0.041,
  riskMargin: 0.035, upfrontFeePct: 0.0125, commitmentFeePct: 0.0125, agencyFee: 50,
  method: "annuity", targetDSCR: 1.20, sharePct: 1.0,
};
export const DEFAULT_DEBT2: DebtTranche = {
  name: "Senior Debt 2", enabled: false,
  baseRate: 0.041, hedgedPct: 0.7, hedgedRate: 0.0135, underlyingRate: 0.02175,
  riskMargin: 0, upfrontFeePct: 0, commitmentFeePct: 0, agencyFee: 0,
  method: "sculpted", targetDSCR: 1.20, sharePct: 0,
};
export const DEFAULT_DEBT3: DebtTranche = {
  name: "Senior Debt 3", enabled: false,
  baseRate: 0.041, hedgedPct: 0.7, hedgedRate: 0.0185, underlyingRate: 0.02525,
  riskMargin: 0.005, upfrontFeePct: 0, commitmentFeePct: 0, agencyFee: 0,
  method: "sculpted", targetDSCR: 1.20, sharePct: 0,
};

export const DEFAULT_INPUTS: ProjectInputs = {
  projectName: "Wind 552 MWp",
  scenario: "Base Fixed",
  companyName: "Project SPV",
  country: "Egypt",
  modelType: "Wind / Solar Hybrid",

  constructionStart: 2027,
  constructionMonths: 24,
  preOpsMonths: 0,
  operationsYears: 25,
  planningMonths: 0,
  delayMonths: 0,
  planningStartYear: 2027,

  preConstructionCosts: 0,
  epcCost: 336168,
  developmentPremiums: 0,
  developmentExpenses: 9936,
  land: 0,
  esMeasures: 0,
  lendersTechAdvisors: 0,
  legalExpenses: 0,
  administrativeCosts: 0,
  financialAudit: 0,
  insuranceConstruction: 0,
  contingency: 13128.12,
  substation: 41500,
  loanRepayment: 50000,
  taxesCapex: 34706.37,
  capexSpare15: 0,
  capexSpare16: 0,
  capexSpare17: 0,
  capexSpare18: 0,
  capexSpare19: 0,
  capexSpare20: 0,
  delayCostsPerMonth: 0,
  compEsmp: 0,
  compCsr: 0,
  mmWindSpareParts: 0,
  mmSubstationSpareParts: 0,
  mmDecommissioning: 0,
  mmPmCm: 0,
  mmSpare: 0,
  mmSchedulePctOfCapex: [],

  dsraInitial: 44820,
  dsraTargetMonths: 12,
  dsraSwitch: 1,
  performanceBond: 0,
  contingentLoanOnDSRA: 0,
  feeOnDSRAPct: 0,
  corpGuaranteeMonths: 0,
  corpGuaranteeFeePct: 0,
  manualDSRASwitch: 0,
  manualDSRAInput: 0,
  pbStartExposure: 1,
  pbStep1Exposure: 0.25,
  pbStep2Exposure: 1,
  pbStartYear: 2027,
  pbStep1Year: 2029,
  pbStep2Year: 2039,
  pbEndYear: 2053,
  statReserveMinNOPATPct: 0,
  shareCapital: 0,
  initialWCAmount: 0,
  cashShortageOpY1: 0,

  capacityMWp: 552,
  hoursPerDay: 24,
  yieldKWhPerKWp: 3828.12,
  yieldCase: "P50",
  yieldP75Pct: 0.95,
  yieldP90Pct: 0.90,
  yieldSparePct: 0,
  seasonalP50: Array(12).fill(1/12),
  seasonalP75: Array(12).fill(1/12),
  seasonalP90: Array(12).fill(1/12),
  availabilityBase: 1,
  availabilityHigh: 1,
  availabilityLow: 1,
  availabilityCase: "Base",

  degradation: 0.005,
  ownConsumption: 0.01,
  transformerLosses: 0.005,
  lineLosses: 0.005,
  otherLosses: 0.0,
  ownConsumptionLoss: 0.02,
  availability: 0.97,

  tariffCurrency: "USD",
  tariffUsdPerKWh: 0.03,
  tariffEscalation: 0.0,
  tariffPostYearGrowth: 0.0,
  tariffFixedYears: 25,
  tariffIndexUSDWeight: 0.75,
  tariffIndexEGPWeight: 0.25,
  tariffPriceEGP: 1,
  tariffInflationChoice: "Zero-inflation",
  tariffLinkedTo: "Operation",
  tariffCase: "Base",
  tariffWorstUsdPerKWh: 0,
  tariffSpareUsdPerKWh: 0,

  cdmSwitch: 1,
  cdmStartYear: 2027,
  cdmDurationYears: 25,
  gridEmissionFactor: 0.225,
  cdmPriceUSD: 5,

  oAndM: 5034.24,
  assetMgmt: 496.8,
  spvCost: 46.368,
  insurance: 0,
  csrContribution: 0,
  eetcCost: 0,
  cpi: 0.022,
  bondExpenses: 0,
  lease: 0,
  auxiliaryPower: 0,
  opexContingency: 0,
  usufructEGP: 0,
  varOpexSpare1: 0,
  varOpexSpare2: 0,
  varOpexSpare3: 0,
  pctRevConvLocalEUR: 0,
  pctRevUsufructLease: 0,
  pctRevInsuranceOps: 0,
  migaPremium: 0,
  opexVat: 0,

  daysReceivable: 60,
  daysPayable: 30,
  debtorMonths: 1,
  creditorMonths: 1,

  sizingMode: "dscr-sculpted",
  gearing: 0.8,
  targetDSCR: 1.30,
  debtTenorYears: 20,
  graceYears: 2,
  paymentPeriodicity: "Semi-annual",

  debt1: { ...DEFAULT_DEBT1 },
  debt2: { ...DEFAULT_DEBT2 },
  debt3: { ...DEFAULT_DEBT3 },

  interestRate: 0.076,
  upfrontFeePct: 0.0125,
  commitmentFeePct: 0.0125,

  refinanceSwitch: 0,
  refinanceYear: 2035,
  refinanceFee: 0.008,
  refinanceMargin: 0.01,
  refinanceAmount: 0,

  shLoanFunding: 0,
  shLoanRate: 0.09,
  shLoanFullyRepaid: 0,

  prefEquityFunding: 0,
  prefEquityCoupon: 0.06,
  prefCashCollateralPct: 1,
  prefPlacementFeePct: 0,
  totalEquityExclPlanning: 114628.11,
  planningPhaseEquity: 0,

  cofStandbyLimit: 0,
  cofGearing: 0.8,
  cofLimit: 0,
  cofTenorYears: 0,
  cofGraceYears: 0,
  cofHedgedPct: 0,
  cofHedgedRate: 0,
  cofMargin: 0,
  cofUpfrontFee: 0,
  cofCommitmentFeeOfMargin: 0,
  cofCommitmentFee: 0,
  cofTargetDSCR: 1.30,

  subDebtLimit: 0,
  subDebtTenorYears: 22,
  subDebtGraceYears: 2,
  subDebtMargin: 0.06,
  subDebtUpfrontFee: 0.0125,
  subDebtCommitmentFeeOfMargin: 0.0125,
  subDebtCommitmentFee: 0.0008,
  subDebtAgencyFee: 0,
  subDebtMethod: "sculpted",
  subDebtTargetDSCR: 1.30,
  subDebtManualRepayment: 0,

  payoutRatio: 1.0,
  divRestrictedToRetainedEarnings: 1,
  minCashBalance: 0,
  minCashBalanceMultiple: 0,
  linkOpexLoanTenor: 0,
  linkOpexMonths: 6,
  carriedInterestPct: 0,
  carriedInterestOneTime: 0,

  taxRate: 0.225,
  taxStartYear: 2029,
  taxPeriods: 25,
  taxEndYear: 2054,
  additionalLevy: 0,
  realEstateTaxRate: 0.00136,
  realEstateTaxableAmount: 1.0,
  exemptedProportion: 0,
  rentalValuePct: 0,
  taxHolidayYears: 0,
  taxHolidayStartYear: 2029,
  taxHolidayEndYear: 2028,
  csrTaxDeductible: 0,
  nokusRate: 0,
  nokusStartYear: 2029,
  nokusEndYear: 2054,
  nokusThresholdRate: 0,
  taxCalcMonths: 12,
  taxAdvanceMonths: 3,
  taxBalanceMonths: 9,

  whtDividendsSwitch: 0,
  whtDividendsRate: 0.20,
  whtSHLoanSwitch: 0,
  whtSHLoanRate: 0.20,
  whtPrefShareSwitch: 0,
  whtPrefShareRate: 0,

  relPartyDeductLimitSwitch: 1,
  relPartyDeductMultiple: 4,

  depreciationYears: 25,
  idcDepreciationYears: 22,

  discountRateProject: 0.06,
  discountRateProjectPostTax: 0.06,
  discountRateInvestor: 0.06,
  discountRateEquity: 0.06,
  discountRatePref: 0.06,

  baseRateSelection: "US SOFR 6M",
  baseRate: 0.041,
  baseRateLIBOR: 0,
  baseRateCBE: 0.1525,
  cpiGeneral: 0.07,
  cpiUSDollar: 0.03,
  cpiBlend: 0.04,
  oAndMInflRate: 0.022,
  lcoeDiscountFactor: 0.06,
  depositRate: 0,
  modelInflationOn: 1,
  inflationSelection: "CPI",

  riskFreeRate: 0.045,
  equityBeta: 0.92,                 // Damodaran "Green & Renewable Energy" sector levered beta
  matureMarketERP: 0.046,           // Damodaran implied US/global mature ERP (latest)
  useErpOverride: 1,                // override Country Risk Premium (CRP)
  erpOverride: 0,                   // CRP set to 0 per user request (Ke = Rf + β × MERP)
  useWaccForLcoe: 1,

  fxEUR: 1.05,
  fxEGP: 0.0205339,
  fxSpare: 0,

  covInPeriodP50: 1.2,
  covInPeriodP90: 1.2,
  cov12moBwP50: 1.2,
  cov12moBwP90: 1.2,
  cov12moFwP50: 1.2,
  cov12moFwP90: 1.2,
  llcrP50: 1.2,
  llcrP90: 1.2,
  plcrP50: 1.2,
  plcrP90: 1.2,

  // 24 months — straight-line by default; user can edit per-month %.
  capexSchedulePct: Array.from({ length: 24 }, () => 100 / 24),

  // Phase 2 defaults
  taxesCapexAuto: 1,
  vatRate: 0.14,
  customsDutyRate: 0.05,
  capexBasisPerMW: {},
  capexTaxable: {},
  capexOnshorePct: {},
  opexBasisPerMW: {},
};

export interface AnnualRow {
  year: number;
  mwh: number;
  revenue: number;
  carbonRevenue: number;
  tariffEsc: number;
  effectiveTariff: number;
  opex: number;
  opexBase: number;
  opexRealEstate: number;
  opexOtherFixed: number;
  opexMajorMaintenance: number;
  opexPctRevenue: number;
  opexDecommissioning: number;
  opexLevy: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interest: number;
  ebt: number;
  tax: number;
  netIncome: number;
  workingCapitalChange: number;
  cfads: number;
  debtService: number;
  principal: number;
  cffi: number;
  dividends: number;
  openingDebt: number;
  closingDebt: number;
  dscr: number;
  ppe: number;
  cash: number;
  receivables: number;
  payables: number;
  equity: number;
  dsraTarget: number;
  dsraMovement: number;
  dsraBalance: number;
  decommReserve: number;        // restricted-cash sinking fund (asset)
  decommProvision: number;      // matching liability (provision)
  refiProceeds: number;         // cash drawn from re-financing surplus (>0) or zero
  prefAccrued: number;          // unpaid pref-equity coupon carried forward
  llcr: number;
  plcr: number;
  balanceCheck: number;
}

export interface ModelOutputs {
  inputs: ProjectInputs;
  totalUses: number;
  totalSources: number;
  idc: number;
  upfrontFee: number;
  commitmentFee: number;
  debtAmount: number;
  equityAmount: number;
  effectiveGearing: number;
  rows: AnnualRow[];
  constructionYears: number[];
  constructionDraws: number[];
  equityDraws: number[];
  debtDraws: number[];
  minDSCR: number;
  avgDSCR: number;
  projectIRR: number;
  equityIRR: number;
  npvProject: number;
  npvEquity: number;
  paybackYears: number;
  lcoeUsdPerKWh: number;
  wacc: number;
  costOfEquity: number;
  countryERP: number;
  lcoeDiscountRateUsed: number;
  totalRevenue: number;
  totalOpex: number;
  totalCFADS: number;
  iterations: number;
  converged: boolean;
  // Derived per-tranche all-in rates (display)
  allInRate1: number;
  allInRate2: number;
  allInRate3: number;
  blendedRate: number;
  dsraInitialAuto: number;
  dsraLookForwardMonths: number;
  // Equity tranche IRRs
  commonEquityIRR: number;
  prefEquityIRR: number;
  shLoanIRR: number;
  blendedEquityIRR: number;
  commonEquityAmount: number;
  prefEquityAmount: number;
  shLoanAmount: number;
  minLLCR: number;
  avgLLCR: number;
  minPLCR: number;
  maxBalanceCheck: number;
  loanLifeYears: number;
  debtServiceCoverageOk: boolean;
  // IRR rundowns (year-by-year cashflows)
  projectIRRSeries: { year: number; capex: number; cfads: number; dsraMovement: number; net: number }[];
  equityIRRSeries: { year: number; equityDraw: number; cffi: number; net: number }[];
  // LCOE contribution by item (% of LCOE) — for the waterfall chart
  lcoeContributions: { label: string; pv: number; pct: number; usdPerMWh: number }[];
}

function irr(cashflows: number[], guess = 0.1): number {
  // Newton-Raphson with bisection fallback for robustness on adversarial cashflows.
  const f = (r: number) => cashflows.reduce((s, cf, t) => s + cf / Math.pow(1 + r, t), 0);
  const df = (r: number) => cashflows.reduce((s, cf, t) => s - t * cf / Math.pow(1 + r, t + 1), 0);
  let r = guess;
  for (let iter = 0; iter < 60; iter++) {
    const v = f(r), d = df(r);
    if (Math.abs(d) < 1e-12) break;
    const next = r - v / d;
    if (!isFinite(next)) break;
    if (Math.abs(next - r) < 1e-7) return next;
    r = Math.max(-0.999, Math.min(10, next));
  }
  // Bisection fallback in [-0.99, 10]
  let lo = -0.99, hi = 10;
  let flo = f(lo), fhi = f(hi);
  if (flo * fhi > 0) return r; // no sign change → return last NR estimate
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (Math.abs(fm) < 1e-9 || (hi - lo) < 1e-8) return mid;
    if (flo * fm < 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  return (lo + hi) / 2;
}
function npv(rate: number, cashflows: number[]): number {
  return cashflows.reduce((s, cf, t) => s + cf / Math.pow(1 + rate, t), 0);
}

function trancheAllIn(t: DebtTranche, I?: ProjectInputs): number {
  // Resolve effective base rate from the selected reference (SOFR/LIBOR/CBE/Fixed).
  // "Fixed" means the tranche's hard-coded baseRate is used as-is.
  let base = t.baseRate;
  if (I && t.baseRateRef) {
    if (t.baseRateRef === "SOFR") base = I.baseRate;
    else if (t.baseRateRef === "LIBOR") base = I.baseRateLIBOR;
    else if (t.baseRateRef === "CBE") base = I.baseRateCBE;
    // Fixed → keep tranche-defined baseRate
  }
  // All-in = hedged% × hedgedRate + unhedged% × (base + underlying spread) + risk margin
  const unhedgedRate = base + Math.max(0, t.underlyingRate - t.baseRate); // spread over original base
  return t.hedgedPct * t.hedgedRate + (1 - t.hedgedPct) * unhedgedRate + t.riskMargin;
}

/** Aggregate breakdowns into the values used by the simulation. */
function aggregate(I: ProjectInputs) {
  const epcCost = I.epcCost;
  const developmentCost = I.preConstructionCosts + I.developmentPremiums + I.developmentExpenses
    + I.land + I.esMeasures + I.lendersTechAdvisors + I.legalExpenses
    + I.administrativeCosts + I.financialAudit + I.insuranceConstruction;
  const substationContingency = I.contingency + I.substation + I.loanRepayment + I.taxesCapex;

  // Loss factor combined (used as ownConsumptionLoss in legacy simulate)
  const lossFactor = 1
    - (1 - I.ownConsumption) * (1 - I.transformerLosses) * (1 - I.lineLosses) * (1 - I.otherLosses);

  // Yield case
  const yMult = I.yieldCase === "P75" ? I.yieldP75Pct : I.yieldCase === "P90" ? I.yieldP90Pct : 1;
  const yieldKWhPerKWp = I.yieldKWhPerKWp * yMult;

  // Tranches
  const t1 = I.debt1, t2 = I.debt2, t3 = I.debt3;
  const r1 = trancheAllIn(t1, I), r2 = trancheAllIn(t2, I), r3 = trancheAllIn(t3, I);
  // Weights from sharePct of enabled tranches
  const ws = [
    t1.enabled ? Math.max(0, t1.sharePct) : 0,
    t2.enabled ? Math.max(0, t2.sharePct) : 0,
    t3.enabled ? Math.max(0, t3.sharePct) : 0,
  ];
  const wsum = ws[0] + ws[1] + ws[2];
  const blendedRate = wsum > 0 ? (ws[0]*r1 + ws[1]*r2 + ws[2]*r3) / wsum : r1;
  const blendedUpfront = wsum > 0 ? (ws[0]*t1.upfrontFeePct + ws[1]*t2.upfrontFeePct + ws[2]*t3.upfrontFeePct) / wsum : t1.upfrontFeePct;
  const blendedCommit  = wsum > 0 ? (ws[0]*t1.commitmentFeePct + ws[1]*t2.commitmentFeePct + ws[2]*t3.commitmentFeePct) / wsum : t1.commitmentFeePct;

  return {
    epcCost, developmentCost, substationContingency,
    yieldKWhPerKWp, lossFactor,
    interestRate: blendedRate,
    upfrontFeePct: blendedUpfront,
    commitmentFeePct: blendedCommit,
    r1, r2, r3, blendedRate,
  };
}

function simulate(I: ProjectInputs, agg: ReturnType<typeof aggregate>, debtAmount: number, idc: number, fees: number, dsraInitial: number) {
  const baseUses = agg.epcCost + agg.developmentCost + agg.substationContingency + dsraInitial;
  const totalCapex = baseUses + idc + fees;
  const equityAmount = totalCapex - debtAmount;

  const N = Math.max(1, Math.floor(Number(I.operationsYears) || 0));
  const opsStartYear = I.constructionStart + Math.ceil((Number(I.constructionMonths) || 0) / 12);
  // Split depreciable base: hard capex (PPE life) vs IDC + upfront fees (financing life).
  const hardCapex = agg.epcCost + agg.developmentCost + agg.substationContingency;
  const financingCapex = idc + fees;
  const depYearsPPE = Math.max(1, I.depreciationYears);
  const depYearsIDC = Math.max(1, I.idcDepreciationYears || I.depreciationYears);
  const depAnnualPPE = hardCapex / depYearsPPE;
  const depAnnualIDC = financingCapex / depYearsIDC;

  const rows: AnnualRow[] = [];
  let debt = debtAmount;
  let cash = 0, receivables = 0, payables = 0;
  let ppe = hardCapex + financingCapex;
  let equity = equityAmount;

  const grace = I.graceYears;
  const amortYears = Math.max(1, I.debtTenorYears - grace);
  const rBase = agg.interestRate;
  const refiOn = I.refinanceSwitch === 1;
  const refiOpsYear = refiOn ? Math.max(1, I.refinanceYear - opsStartYear + 1) : -1;
  const rateForY = (y: number) => (refiOn && y >= refiOpsYear) ? rBase + (I.refinanceMargin || 0) : rBase;

  // Availability case selector
  const availabilityEff = I.availabilityCase === "High" ? I.availabilityHigh
    : I.availabilityCase === "Low" ? I.availabilityLow
    : (I.availabilityBase || I.availability);

  // Tax window helper (year-based, with holiday window override)
  const taxYearsActive = (yr: number) => {
    const inWindow = yr >= I.taxStartYear && yr <= I.taxEndYear;
    const inHoliday = I.taxHolidayYears > 0 || I.taxHolidayEndYear >= I.taxHolidayStartYear
      ? (yr >= I.taxHolidayStartYear && yr <= I.taxHolidayEndYear)
      : false;
    return inWindow && !inHoliday;
  };

  // Decommissioning as annual sinking-fund accrual (real, escalated)
  const decommissioningAnnual = (I.mmDecommissioning || 0) / Math.max(1, N);

  // ── PASS A: economics independent of debt service (revenue/opex/EBITDA/CFADS-pre-tax-shield)
  type Pre = {
    year: number; y: number; mwh: number; revenue: number; carbonRevenue: number; totalRev: number;
    opex: number; opexBase: number; opexRealEstate: number; opexOtherFixed: number;
    opexMajorMaintenance: number; opexPctRevenue: number; opexDecommissioning: number; opexLevy: number;
    tariffEsc: number; effectiveTariff: number;
    ebitda: number; depreciation: number; ebit: number; ebitdaTax: number;
    cfadsPreShield: number; wcChange: number; newReceivables: number; newPayables: number;
  };
  const pre: Pre[] = [];
  let recv = 0, pay = 0;
  for (let y = 1; y <= N; y++) {
    const year = opsStartYear + y - 1;
    const escal = Math.pow(1 + I.cpi, y - 1);
    const tariffEsc = y <= I.tariffFixedYears
      ? Math.pow(1 + I.tariffEscalation, y - 1)
      : Math.pow(1 + I.tariffEscalation, I.tariffFixedYears - 1) * Math.pow(1 + I.tariffPostYearGrowth, y - I.tariffFixedYears);
    const degr = Math.pow(1 - I.degradation, y - 1);
    const lossKept = (1 - agg.lossFactor);
    const mwh = I.capacityMWp * agg.yieldKWhPerKWp * availabilityEff * lossKept * degr;
    const revenue = mwh * I.tariffUsdPerKWh * tariffEsc;
    const carbonOn = I.cdmSwitch === 1 && year >= I.cdmStartYear && year < I.cdmStartYear + I.cdmDurationYears;
    const carbonRevenue = carbonOn ? mwh * I.gridEmissionFactor * I.cdmPriceUSD / 1000 : 0;
    const totalRev = revenue + carbonRevenue;
    const baseOpex = (I.oAndM + I.assetMgmt + I.spvCost + I.insurance + I.csrContribution + I.eetcCost) * escal;
    const rentalValue = I.epcCost * (I.rentalValuePct || 0.5);
    const realEstate = rentalValue * I.realEstateTaxableAmount * I.realEstateTaxRate * (1 - (I.exemptedProportion || 0)) * escal;
    const otherFixedOpex = (I.bondExpenses + I.lease + I.auxiliaryPower + I.opexContingency
      + I.usufructEGP * I.fxEGP + I.migaPremium) * escal;
    const mmFlat = (I.mmWindSpareParts + I.mmSubstationSpareParts + I.mmPmCm + I.mmSpare) * escal;
    const mmSchedPct = (I.mmSchedulePctOfCapex && I.mmSchedulePctOfCapex[y - 1]) || 0;
    const mmScheduled = hardCapex * mmSchedPct * escal;
    const majorMaintenance = mmFlat + mmScheduled;
    const revPctOpex = totalRev * (I.pctRevConvLocalEUR + I.pctRevUsufructLease + I.pctRevInsuranceOps);
    const decommissioning = decommissioningAnnual * escal;
    const levy = I.additionalLevy * totalRev;
    const opexVat = (I.opexVat || 0) * escal;
    const opex = baseOpex + realEstate + levy + otherFixedOpex + majorMaintenance + revPctOpex + decommissioning + opexVat;
    const ebitda = totalRev - opex;
    const depPPE = y <= depYearsPPE ? depAnnualPPE : 0;
    const depIDC = y <= depYearsIDC ? depAnnualIDC : 0;
    const depreciation = depPPE + depIDC;
    const ebit = ebitda - depreciation;
    const ebitdaTax = (!taxYearsActive(year) || ebit <= 0) ? 0 : ebit * I.taxRate;
    const newReceivables = totalRev * (I.daysReceivable / 365);
    // Payables on cash opex only (exclude real-estate tax & decommissioning sinking fund)
    const cashOpexForDPO = baseOpex + otherFixedOpex + majorMaintenance + revPctOpex + levy + opexVat;
    const newPayables = cashOpexForDPO * (I.daysPayable / 365);
    const wcChange = -((newReceivables - recv) - (newPayables - pay));
    recv = newReceivables; pay = newPayables;
    const cfadsPreShield = ebitda - ebitdaTax + wcChange;
    pre.push({ year, y, mwh, revenue, carbonRevenue, totalRev,
      opex, opexBase: baseOpex, opexRealEstate: realEstate, opexOtherFixed: otherFixedOpex,
      opexMajorMaintenance: majorMaintenance, opexPctRevenue: revPctOpex, opexDecommissioning: decommissioning, opexLevy: levy,
      tariffEsc, effectiveTariff: I.tariffUsdPerKWh * tariffEsc,
      ebitda, depreciation, ebit, ebitdaTax, cfadsPreShield, wcChange, newReceivables, newPayables });
  }

  // ── PASS B: size principal year-by-year per repayment shape
  // Two fixed-point passes so DSCR-sculpting accounts for realised tax.
  const principalByY: number[] = Array(N + 1).fill(0);
  const interestByY: number[] = Array(N + 1).fill(0);
  const dsByY: number[] = Array(N + 1).fill(0);
  const refiProceedsByY: number[] = Array(N + 1).fill(0);
  const sizePass = (taxByY: number[]) => {
    let dbt = debtAmount;
    const annuityPmtFor = (bal: number, rate: number, n: number) =>
      rate > 0 ? bal * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1) : bal / Math.max(1, n);
    let curAnnuity = annuityPmtFor(debtAmount, rBase, amortYears);
    for (let y = 1; y <= N; y++) {
      const rate = rateForY(y);
      // Refinance: industry-standard treatment.
      //  • If refinanceAmount > current balance → cash-out refi: balance steps UP to refinanceAmount,
      //    surplus (refinanceAmount − balance) is paid out as refi proceeds (cash to project).
      //  • If refinanceAmount < current balance → partial paydown from new tranche: difference is recorded
      //    as principal in that year (paid by the new tranche, modelled as a single instrument here).
      if (refiOn && y === refiOpsYear && I.refinanceAmount > 0) {
        if (I.refinanceAmount > dbt) {
          refiProceedsByY[y] += (I.refinanceAmount - dbt);
          dbt = I.refinanceAmount;
        } else if (dbt > I.refinanceAmount) {
          const refiPay = dbt - I.refinanceAmount;
          principalByY[y] = (principalByY[y] || 0) + refiPay;
          dbt = I.refinanceAmount;
        }
        const remTenor = Math.max(1, I.debtTenorYears - (y - 1));
        curAnnuity = annuityPmtFor(dbt, rate, remTenor);
      }
      const opening = dbt;
      const interest = opening * rate;
      interestByY[y] = interest;
      if (y <= grace || dbt <= 1e-6) { dsByY[y] = interest + (principalByY[y] || 0); continue; }
      let principal = 0;
      if (I.sizingMode === "dscr-sculpted" || I.sizingMode === "llcr-sculpted") {
        const realisedTax = taxByY[y] ?? ((y <= I.taxHolidayYears) ? 0 : interest * I.taxRate);
        const cfadsApprox = pre[y - 1].ebitda - realisedTax + pre[y - 1].wcChange;
        const targetDS = cfadsApprox / Math.max(1.001, I.targetDSCR);
        principal = Math.max(0, Math.min(dbt, targetDS - interest));
      } else if (I.sizingMode === "manual" || I.sizingMode === "mortgage") {
        principal = Math.min(dbt, debtAmount / amortYears);
      } else if (I.sizingMode === "bullet") {
        const yEnd = Math.min(N, grace + amortYears);
        principal = (y === yEnd) ? dbt : 0;
      } else { // annuity / fixed-gearing default
        principal = Math.max(0, Math.min(dbt, curAnnuity - interest));
      }
      principalByY[y] = (principalByY[y] || 0) + principal;
      dsByY[y] = interest + principalByY[y];
      dbt = Math.max(0, dbt - principal);
    }
    // Force terminal repayment if balance remains at end of tenor
    if (dbt > 1e-3) {
      const yEnd = Math.min(N, grace + amortYears);
      principalByY[yEnd] += dbt;
      dsByY[yEnd] += dbt;
    }
  };
  // Pass 1 with shield approximation
  sizePass([]);
  // Recompute tax with realised interest, then resize once more for sculpting accuracy
  if (I.sizingMode === "dscr-sculpted" || I.sizingMode === "llcr-sculpted") {
    const realisedTax: number[] = Array(N + 1).fill(0);
    for (let y = 1; y <= N; y++) {
      const ebt = pre[y - 1].ebit - interestByY[y];
      realisedTax[y] = (!taxYearsActive(pre[y - 1].year) || ebt <= 0) ? 0 : ebt * I.taxRate;
    }
    principalByY.fill(0); interestByY.fill(0); dsByY.fill(0); refiProceedsByY.fill(0);
    sizePass(realisedTax);
  }

  // ── PASS C: assemble draft rows (interest tax shield captured exactly)
  const draft: AnnualRow[] = [];
  debt = debtAmount;
  for (let y = 1; y <= N; y++) {
    const p = pre[y - 1];
    const openingDebt = debt;
    const interest = interestByY[y];
    const principal = principalByY[y];
    const refiProceeds = refiProceedsByY[y];
    const debtService = dsByY[y];
    // Apply refi step-up first (cash-out), then principal repayment.
    debt = Math.max(0, debt + refiProceeds - principal);
    const ebt = p.ebit - interest;
    const taxOnEbt = (!taxYearsActive(p.year) || ebt <= 0) ? 0 : ebt * I.taxRate;
    const nokusOn = I.nokusRate > 0 && p.year >= I.nokusStartYear && p.year <= I.nokusEndYear;
    const effRate = ebt > 0 ? taxOnEbt / ebt : 0;
    const nokusTax = nokusOn && effRate < I.nokusThresholdRate && ebt > 0
      ? ebt * Math.max(0, I.nokusRate - effRate) : 0;
    const totalTax = taxOnEbt + nokusTax;
    const netIncome = ebt - totalTax;
    const cfads = p.ebitda - totalTax + p.wcChange;
    const dscr = debtService > 0 ? cfads / debtService : 0;
    ppe = Math.max(0, ppe - p.depreciation);
    draft.push({
      year: p.year, mwh: p.mwh, revenue: p.revenue, carbonRevenue: p.carbonRevenue,
      opex: p.opex, opexBase: p.opexBase, opexRealEstate: p.opexRealEstate, opexOtherFixed: p.opexOtherFixed,
      opexMajorMaintenance: p.opexMajorMaintenance, opexPctRevenue: p.opexPctRevenue,
      opexDecommissioning: p.opexDecommissioning, opexLevy: p.opexLevy,
      tariffEsc: p.tariffEsc, effectiveTariff: p.effectiveTariff,
      ebitda: p.ebitda, depreciation: p.depreciation, ebit: p.ebit,
      interest, ebt, tax: totalTax, netIncome,
      workingCapitalChange: p.wcChange, cfads, debtService, principal, cffi: 0, dividends: 0,
      openingDebt, closingDebt: debt, dscr,
      ppe, cash: 0, receivables: p.newReceivables, payables: p.newPayables, equity,
      dsraTarget: 0, dsraMovement: 0, dsraBalance: 0,
      decommReserve: 0, decommProvision: 0, refiProceeds, prefAccrued: 0,
      llcr: 0, plcr: 0, balanceCheck: 0,
    });
  }

  // ── PASS D: DSRA, distributions, LLCR/PLCR, cash & balance check
  const Mdsra = Math.max(0, Math.round(I.dsraTargetMonths));
  const yrs = Mdsra / 12;
  const dsArr = draft.map(r => r.debtService);
  const lookForward = (idx: number): number => {
    if (yrs <= 0) return 0;
    let sum = 0, rem = yrs, i = idx;
    while (rem > 1e-9 && i < dsArr.length) {
      const take = Math.min(1, rem); sum += dsArr[i] * take; rem -= take; i += 1;
    }
    return sum;
  };
  // LLCR / PLCR: PV of future CFADS over remaining loan life (or project life) / outstanding debt
  // Industry standard: discount at the loan's pre-tax cost of debt (blended rate).
  const dr = Math.max(0.001, agg.blendedRate || I.discountRateProjectPostTax || I.discountRateProject || 0.07);
  const pvFromIdx = (idx: number, untilIdx: number) => {
    let pv = 0;
    for (let k = idx; k < Math.min(untilIdx, draft.length); k++) {
      pv += draft[k].cfads / Math.pow(1 + dr, k - idx + 1);
    }
    return pv;
  };
  // Find loan-life end (last year with debt service > epsilon)
  let loanLifeEnd = 0;
  for (let i = 0; i < draft.length; i++) if (draft[i].debtService > 1e-3) loanLifeEnd = i + 1;

  let dsraPrev = dsraInitial;
  let cashAcc = 0;
  let retainedEarnings = equityAmount; // equity book = paid-in + retained
  let decommReserve = 0;               // restricted-cash sinking fund (asset side)
  let decommProvision = 0;             // matching liability accrued through opex
  rows.length = 0;
  for (let y = 0; y < draft.length; y++) {
    const target = I.dsraSwitch === 1 ? lookForward(y + 1) : 0;
    const movement = target - dsraPrev;
    const row = draft[y];
    // Decommissioning: opex line is a non-cash accrual that builds a provision; cash equal to it is
    // segregated into a restricted reserve so the BS keeps balancing. Released at end of life.
    const decommContribution = row.opexDecommissioning;
    decommReserve += decommContribution;
    decommProvision += decommContribution;
    const isLastYear = y === draft.length - 1;
    if (isLastYear) {
      // Spend the reserve on actual decommissioning at end of project life.
      decommReserve = 0;
      decommProvision = 0;
    }
    // CFFI: cash from operations after debt service & DSRA, plus any refi cash-out, less the cash
    // we've ring-fenced for decommissioning (kept inside the project, not distributable).
    const cffi = row.cfads - row.debtService - movement + row.refiProceeds - decommContribution;
    // Distributions
    let distributable = Math.max(0, cffi) * (I.payoutRatio ?? 1);
    if (I.divRestrictedToRetainedEarnings === 1) {
      const re = retainedEarnings - equityAmount + row.netIncome;
      distributable = Math.min(distributable, Math.max(0, re));
    }
    const minCash = (I.minCashBalance || 0) + (I.minCashBalanceMultiple || 0) * row.debtService;
    distributable = Math.min(distributable, Math.max(0, cashAcc + cffi - minCash));
    distributable = Math.max(0, distributable);
    cashAcc += cffi - distributable;
    retainedEarnings += row.netIncome - distributable;
    const llcrDen = row.openingDebt;
    const llcr = llcrDen > 1e-3 ? (pvFromIdx(y, loanLifeEnd) + dsraPrev) / llcrDen : 0;
    const plcr = llcrDen > 1e-3 ? (pvFromIdx(y, draft.length) + dsraPrev) / llcrDen : 0;
    // Balance check (full): Assets = Liab + Equity
    //   Assets = PPE + Cash + DSRA + Decomm reserve + Receivables
    //   L+E    = Debt + Payables + Decomm provision + Retained equity
    const assets = row.ppe + cashAcc + row.receivables + target + decommReserve;
    const liabEq = row.closingDebt + row.payables + decommProvision + retainedEarnings;
    const balanceCheck = assets - liabEq;
    rows.push({ ...row, cffi, dividends: distributable, cash: cashAcc, equity: retainedEarnings,
      dsraTarget: target, dsraMovement: movement, dsraBalance: target,
      decommReserve, decommProvision,
      llcr, plcr, balanceCheck });
    dsraPrev = target;
  }

  return { rows, totalCapex, equityAmount, dsraInitialUsed: dsraInitial };
}

export function runModel(inputs: ProjectInputs): ModelOutputs {
  // ── Phase 2: resolve per-MW basis and auto tax before anything else ──
  const CAPEX_KEYS = [
    "preConstructionCosts","epcCost","developmentPremiums","developmentExpenses","land",
    "esMeasures","lendersTechAdvisors","legalExpenses","administrativeCosts","financialAudit",
    "insuranceConstruction","contingency","substation","loanRepayment",
    "capexSpare15","capexSpare16","capexSpare17","capexSpare18","capexSpare19","capexSpare20",
    "compEsmp","compCsr",
  ] as const;
  const OPEX_KEYS = [
    "oAndM","assetMgmt","spvCost","insurance","csrContribution","eetcCost",
    "bondExpenses","lease","auxiliaryPower","opexContingency","usufructEGP","migaPremium",
  ] as const;
  const resolved: ProjectInputs = { ...inputs };
  for (const k of CAPEX_KEYS) {
    (resolved as any)[k] = effectiveCapexAmount(inputs, k as string, (inputs as any)[k]);
  }
  for (const k of OPEX_KEYS) {
    (resolved as any)[k] = effectiveOpexAmount(inputs, k as string, (inputs as any)[k]);
  }
  // Auto-compute taxesCapex (VAT + customs) from resolved taxable items.
  if ((inputs.taxesCapexAuto ?? 1) === 1) {
    const itemMap: Record<string, number> = {};
    for (const k of CAPEX_KEYS) itemMap[k] = (resolved as any)[k];
    resolved.taxesCapex = computeAutoTaxesCapex(inputs, itemMap);
  }
  const I = resolved;
  const agg = aggregate(I);
  const consYears = I.constructionMonths / 12;

  // Normalise monthly draw profile to length = constructionMonths and sum to 1.
  const M = Math.max(1, Math.round(Number(I.constructionMonths) || 0));
  const fitToM = (arr: number[] | undefined, fallback: number[]): number[] => {
    const a = (arr ?? []).slice(0, M);
    while (a.length < M) a.push(0);
    const s = a.reduce((x, y) => x + y, 0);
    return s > 0 ? a.map(v => v / s) : fallback.slice();
  };
  const globalRaw = (I.capexSchedulePct && I.capexSchedulePct.length > 0)
    ? I.capexSchedulePct.slice(0, M)
    : Array.from({ length: M }, () => 100 / M);
  while (globalRaw.length < M) globalRaw.push(0);
  const gSum = globalRaw.reduce((a, b) => a + b, 0) || 1;
  const globalFrac = globalRaw.map(p => p / gSum);

  // Per-item amounts (USD '000) for every capex line. These drive both totals and the weighted draw profile.
  const capexItems: Record<string, number> = {
    preConstructionCosts: I.preConstructionCosts,
    epcCost: I.epcCost,
    developmentPremiums: I.developmentPremiums,
    developmentExpenses: I.developmentExpenses,
    land: I.land,
    esMeasures: I.esMeasures,
    lendersTechAdvisors: I.lendersTechAdvisors,
    legalExpenses: I.legalExpenses,
    administrativeCosts: I.administrativeCosts,
    financialAudit: I.financialAudit,
    insuranceConstruction: I.insuranceConstruction,
    contingency: I.contingency,
    substation: I.substation,
    loanRepayment: I.loanRepayment,
    taxesCapex: I.taxesCapex,
    capexSpare15: I.capexSpare15,
    capexSpare16: I.capexSpare16,
    capexSpare17: I.capexSpare17,
    capexSpare18: I.capexSpare18,
    capexSpare19: I.capexSpare19,
    capexSpare20: I.capexSpare20,
    compEsmp: I.compEsmp,
    compCsr: I.compCsr,
  };
  const totalItems = Object.values(capexItems).reduce((a, b) => a + b, 0) || 1;
  // Weighted blended monthly fraction across all items (for IDC / commitment fee).
  const monthFrac: number[] = Array.from({ length: M }, () => 0);
  for (const [k, amt] of Object.entries(capexItems)) {
    if (amt <= 0) continue;
    const itemSched = fitToM(I.capexItemSchedulesPct?.[k], globalFrac);
    for (let m = 0; m < M; m++) monthFrac[m] += (amt / totalItems) * itemSched[m];
  }
  // Re-normalise (defensive against rounding).
  const mfSum = monthFrac.reduce((a, b) => a + b, 0) || 1;
  for (let m = 0; m < M; m++) monthFrac[m] = monthFrac[m] / mfSum;

  // Cumulative drawn at end of each month (fraction of total capex).
  const cumEnd: number[] = [];
  let acc = 0;
  for (const f of monthFrac) { acc += f; cumEnd.push(acc); }
  // Average outstanding fraction over the construction period — drives IDC.
  // For each month, average outstanding = (cumStart + cumEnd)/2.
  let avgOutstandingFrac = 0;
  let cumStart = 0;
  for (let m = 0; m < M; m++) {
    const ce = cumEnd[m];
    avgOutstandingFrac += (cumStart + ce) / 2;
    cumStart = ce;
  }
  avgOutstandingFrac = avgOutstandingFrac / M; // average fraction of total drawn during construction

  const computeFC = (debt: number) => {
    // IDC = debt × avg outstanding fraction × rate × construction years
    const idc = debt * avgOutstandingFrac * agg.interestRate * consYears;
    const upfront = debt * agg.upfrontFeePct;
    // Commitment fee is paid on undrawn balance — average undrawn = 1 - avgOutstandingFrac
    const commitment = debt * (1 - avgOutstandingFrac) * agg.commitmentFeePct * consYears;
    return { idc, upfront, commitment, fees: upfront + commitment };
  };

  // DSRA is auto-sized (look-forward). Iterate: debt depends on DSRA, DSRA depends on debt service.
  let dsraInit = I.manualDSRASwitch === 1 ? I.manualDSRAInput : I.dsraInitial;
  let debt = 0, iter = 0, converged = false;
  let fc = { idc: 0, upfront: 0, commitment: 0, fees: 0 };
  let sim: ReturnType<typeof simulate> = { rows: [], totalCapex: 0, equityAmount: 0, dsraInitialUsed: dsraInit } as any;

  for (let outer = 0; outer < 6; outer++) {
    const baseUses = agg.epcCost + agg.developmentCost + agg.substationContingency + dsraInit;
    const sizingByGearing = I.sizingMode === "fixed-gearing"
      || I.sizingMode === "manual"
      || I.sizingMode === "bullet"
      || I.sizingMode === "mortgage";
    if (sizingByGearing) {
      debt = I.gearing < 1 ? baseUses * I.gearing / (1 - I.gearing) : baseUses;
      for (iter = 0; iter < 50; iter++) {
        const fcc = computeFC(debt);
        const tu = baseUses + fcc.idc + fcc.fees;
        const nd = tu * I.gearing;
        if (Math.abs(nd - debt) < 0.01) { converged = true; break; }
        debt = nd;
      }
    } else { // dscr-sculpted | llcr-sculpted → bisect on debt to hit min DSCR
      let lo = 0, hi = baseUses * 5;
      for (iter = 0; iter < 60; iter++) {
        const mid = (lo + hi) / 2;
        const fcc = computeFC(mid);
        const s = simulate(I, agg, mid, fcc.idc, fcc.fees, dsraInit);
        const dscrs = s.rows
          .filter(r => r.debtService > 0 && r.year > I.constructionStart + Math.ceil(consYears) + I.graceYears - 1)
          .map(r => r.dscr);
        const minDSCR = dscrs.length ? Math.min(...dscrs) : 0;
        if (minDSCR >= I.targetDSCR) lo = mid; else hi = mid;
        if (hi - lo < 1) { converged = true; break; }
      }
      debt = lo;
    }
    fc = computeFC(debt);
    sim = simulate(I, agg, debt, fc.idc, fc.fees, dsraInit);
    // Auto DSRA initial funding = look-forward of debt service starting from
    // year 1 of operations (i.e. the reserve required at COD).
    if (I.manualDSRASwitch === 1 || I.dsraSwitch !== 1) break;
    const M = Math.max(0, Math.round(I.dsraTargetMonths));
    const yrs = M / 12;
    let newDsra = 0; let rem = yrs;
    for (let k = 0; k < sim.rows.length && rem > 1e-9; k++) {
      const take = Math.min(1, rem);
      newDsra += sim.rows[k].debtService * take;
      rem -= take;
    }
    if (Math.abs(newDsra - dsraInit) < 1) { dsraInit = newDsra; break; }
    dsraInit = newDsra;
  }

  const totalUses = sim.totalCapex;

  // Aggregate the monthly schedule into per-year construction draws.
  const consYearCount = Math.max(1, Math.ceil(Number.isFinite(consYears) ? consYears : 1));
  const yearFrac: number[] = Array(consYearCount).fill(0);
  for (let m = 0; m < M; m++) {
    const yIdx = Math.min(consYearCount - 1, Math.floor(m / 12));
    yearFrac[yIdx] += monthFrac[m];
  }
  const constructionYears: number[] = [];
  const constructionDraws: number[] = [];
  const equityDraws: number[] = [];
  const debtDraws: number[] = [];
  const gearing = totalUses > 0 ? debt / totalUses : 0;
  for (let i = 0; i < consYearCount; i++) {
    constructionYears.push(I.constructionStart + i);
    constructionDraws.push(totalUses * yearFrac[i]);
    debtDraws.push(debt * yearFrac[i]);
    equityDraws.push((totalUses - debt) * yearFrac[i]);
  }

  const dscrs = sim.rows.filter(r => r.debtService > 0).map(r => r.dscr);
  const minDSCR = dscrs.length ? Math.min(...dscrs) : 0;
  const avgDSCR = dscrs.length ? dscrs.reduce((a, b) => a + b, 0) / dscrs.length : 0;

  // ── WACC for project-level discounting and equity NPV ──
  const waccCalcEarly = computeWACC({
    country: I.country,
    riskFreeRate: I.riskFreeRate,
    equityBeta: I.equityBeta,
    matureMarketERP: I.matureMarketERP,
    gearing: totalUses > 0 ? debt / totalUses : 0,
    costOfDebt: agg.blendedRate,
    taxRate: I.taxRate,
    useCrpOverride: I.useErpOverride,
    crpOverride: I.erpOverride,
  });
  const projectDiscountRate = waccCalcEarly.wacc;
  const equityDiscountRate = waccCalcEarly.costOfEquity;

  const projCF: number[] = [];
  for (let i = 0; i < consYearCount; i++) projCF.push(-constructionDraws[i]);
  sim.rows.forEach(r => projCF.push(r.cfads - r.dsraMovement));
  const projectIRR = irr(projCF, 0.08);
  const npvProject = npv(projectDiscountRate, projCF);

  const eqCF: number[] = [];
  for (let i = 0; i < consYearCount; i++) eqCF.push(-equityDraws[i]);
  sim.rows.forEach(r => eqCF.push(r.cffi));
  const equityIRR = irr(eqCF, 0.12);
  const npvEquity = npv(equityDiscountRate, eqCF);

  // ── Equity tranche split (Common, Preferential, Shareholder Loan) ──
  const totalEquityFunded = sim.equityAmount;
  const prefAmt = Math.min(I.prefEquityFunding, totalEquityFunded);
  const shLoanAmt = Math.min(I.shLoanFunding, Math.max(0, totalEquityFunded - prefAmt));
  const commonAmt = Math.max(0, totalEquityFunded - prefAmt - shLoanAmt);

  // Build per-tranche cashflows. Pref coupon and SH loan interest are paid
  // before common equity distributions (waterfall).
  const prefCF: number[] = [];
  const shCF: number[] = [];
  const commonCF: number[] = [];
  for (let i = 0; i < consYearCount; i++) {
    const draw = equityDraws[i];
    const totalEq = totalEquityFunded || 1;
    prefCF.push(-(draw * prefAmt / totalEq));
    shCF.push(-(draw * shLoanAmt / totalEq));
    commonCF.push(-(draw * commonAmt / totalEq));
  }
  let prefBal = prefAmt;
  let prefArrears = 0;       // accrued-but-unpaid pref coupon (compounds at coupon rate)
  let shBal = shLoanAmt;
  let shArrears = 0;         // accrued-but-unpaid SH loan interest
  const prefAmortYears = Math.max(1, I.operationsYears);
  const shAmortYears = Math.max(1, I.operationsYears);
  sim.rows.forEach((r, idx) => {
    let avail = r.cffi;
    // Pref equity: cumulative coupon. Unpaid coupon accrues to arrears and is paid before any
    // common-equity distribution. Arrears compound at the coupon rate (industry standard).
    const prefCouponDue = prefBal * I.prefEquityCoupon + prefArrears * I.prefEquityCoupon;
    const prefPrincipalDue = Math.min(prefBal, prefAmt / prefAmortYears);
    const prefDue = prefArrears + prefCouponDue + prefPrincipalDue;
    const prefPay = Math.min(Math.max(0, avail), prefDue);
    avail -= prefPay;
    // Apply payment: arrears first, then current coupon, then principal.
    let pay = prefPay;
    const arrearsPay = Math.min(prefArrears, pay); pay -= arrearsPay; prefArrears -= arrearsPay;
    const currCouponPay = Math.min(prefCouponDue, pay); pay -= currCouponPay;
    const principalPay = Math.min(prefPrincipalDue, pay); pay -= principalPay;
    prefArrears += (prefCouponDue - currCouponPay);
    prefBal = Math.max(0, prefBal - principalPay);
    prefCF.push(prefPay);
    // SH loan: same arrears treatment.
    const shCouponDue = shBal * I.shLoanRate + shArrears * I.shLoanRate;
    const shPrincipalDue = I.shLoanFullyRepaid === 1 && idx === sim.rows.length - 1
      ? shBal : Math.min(shBal, shLoanAmt / shAmortYears);
    const shDue = shArrears + shCouponDue + shPrincipalDue;
    const shPay = Math.min(Math.max(0, avail), shDue);
    avail -= shPay;
    let spay = shPay;
    const shArrPay = Math.min(shArrears, spay); spay -= shArrPay; shArrears -= shArrPay;
    const shCurr = Math.min(shCouponDue, spay); spay -= shCurr;
    const shPrin = Math.min(shPrincipalDue, spay); spay -= shPrin;
    shArrears += (shCouponDue - shCurr);
    shBal = Math.max(0, shBal - shPrin);
    shCF.push(shPay);
    // Stash arrears on the row for BS/transparency
    sim.rows[idx].prefAccrued = prefArrears + shArrears;
    commonCF.push(Math.max(0, avail));
  });

  const commonEquityIRR = commonAmt > 0 ? irr(commonCF, 0.10) : NaN;
  const prefEquityIRR = prefAmt > 0 ? irr(prefCF, I.prefEquityCoupon) : NaN;
  const shLoanIRR = shLoanAmt > 0 ? irr(shCF, I.shLoanRate) : NaN;
  const blendedEquityIRR = equityIRR;

  let cum = 0, payback = NaN;
  for (let i = 0; i < eqCF.length; i++) {
    cum += eqCF[i];
    if (cum >= 0 && isNaN(payback)) { payback = i; break; }
  }

  const totalRevenue = sim.rows.reduce((s, r) => s + r.revenue + r.carbonRevenue, 0);
  const totalOpex = sim.rows.reduce((s, r) => s + r.opex, 0);
  const totalCFADS = sim.rows.reduce((s, r) => s + r.cfads, 0);

  // ── LCOE: discounted cost / discounted energy, all at WACC ──
  const waccCalc = waccCalcEarly;
  const dr = waccCalc.wacc;

  // Helper to PV a per-year operations stream (USD '000) starting at year consYearCount
  const pvOpsThousands = (vals: number[]) => vals.reduce((s, v, i) =>
    s + v * 1000 / Math.pow(1 + dr, consYearCount + i), 0);
  const pvConsThousands = (vals: number[]) => vals.reduce((s, v, i) =>
    s + v * 1000 / Math.pow(1 + dr, i), 0);

  let dMWh = 0;
  sim.rows.forEach((r, i) => { dMWh += r.mwh / Math.pow(1 + dr, consYearCount + i); });

  // Capex split (construction-period draws are already weighted by monthFrac)
  // Total capex draws by year include IDC + fees blended into totalUses.
  const pvCapex = pvConsThousands(constructionDraws);
  const pvBaseOpex = pvOpsThousands(sim.rows.map(r => r.opexBase));
  const pvRealEstate = pvOpsThousands(sim.rows.map(r => r.opexRealEstate));
  const pvOtherFixed = pvOpsThousands(sim.rows.map(r => r.opexOtherFixed));
  const pvMajorMaint = pvOpsThousands(sim.rows.map(r => r.opexMajorMaintenance));
  const pvPctRev = pvOpsThousands(sim.rows.map(r => r.opexPctRevenue));
  const pvLevy = pvOpsThousands(sim.rows.map(r => r.opexLevy));
  const pvDecomm = pvOpsThousands(sim.rows.map(r => r.opexDecommissioning));
  const pvTax = pvOpsThousands(sim.rows.map(r => r.tax));

  const dCost = pvCapex + pvBaseOpex + pvRealEstate + pvOtherFixed + pvMajorMaint + pvPctRev + pvLevy + pvDecomm + pvTax;
  const lcoeUsdPerKWh = dMWh > 0 ? dCost / (dMWh * 1000) : 0;

  // ── Item-level LCOE breakdown ──
  // CAPEX: split pvCapex by each line's share of resolved totals (IDC/fees included pro-rata).
  const capexLineLabels: Record<string, string> = {
    epcCost: "EPC", developmentExpenses: "Development expenses", developmentPremiums: "Development premiums",
    preConstructionCosts: "Pre-construction", land: "Land", esMeasures: "E&S measures",
    lendersTechAdvisors: "Lenders' tech advisors", legalExpenses: "Legal", administrativeCosts: "Admin",
    financialAudit: "Financial audit", insuranceConstruction: "Insurance (construction)",
    contingency: "Contingency", substation: "Substation", taxesCapex: "Taxes (capex)",
    loanRepayment: "Loan repayment (capex)",
    compEsmp: "Comp — ESMP", compCsr: "Comp — CSR",
    capexSpare15: "Capex spare 15", capexSpare16: "Capex spare 16", capexSpare17: "Capex spare 17",
    capexSpare18: "Capex spare 18", capexSpare19: "Capex spare 19", capexSpare20: "Capex spare 20",
  };
  const totalCapexItems = Object.values(capexItems).reduce((a, b) => a + b, 0);
  const capexBuckets = Object.entries(capexItems)
    .filter(([, amt]) => amt > 0)
    .map(([k, amt]) => ({
      label: `Capex · ${capexLineLabels[k] ?? k}`,
      pv: totalCapexItems > 0 ? pvCapex * (amt / totalCapexItems) : 0,
    }));
  const idcShare = pvCapex - capexBuckets.reduce((s, b) => s + b.pv, 0);
  if (Math.abs(idcShare) > 1) capexBuckets.push({ label: "Capex · IDC + financing fees", pv: idcShare });

  // OPEX (fixed Base & Other): split by each line's share of total opexBase + opexOtherFixed
  const baseOpexLines: Array<[string, number, string]> = [
    ["O&M", I.oAndM, "opexBase"], ["Asset management", I.assetMgmt, "opexBase"],
    ["SPV cost", I.spvCost, "opexBase"], ["Insurance (ops)", I.insurance, "opexBase"],
    ["CSR contribution", I.csrContribution, "opexBase"], ["EETC cost", I.eetcCost, "opexBase"],
  ];
  const otherOpexLines: Array<[string, number, string]> = [
    ["Bond expenses", I.bondExpenses, "opexOther"], ["Lease", I.lease, "opexOther"],
    ["Auxiliary power", I.auxiliaryPower, "opexOther"], ["Opex contingency", I.opexContingency, "opexOther"],
    ["Usufruct (EGP)", I.usufructEGP * I.fxEGP, "opexOther"], ["MIGA premium", I.migaPremium, "opexOther"],
  ];
  const sumBase = baseOpexLines.reduce((s, [, v]) => s + v, 0) || 1;
  const sumOther = otherOpexLines.reduce((s, [, v]) => s + v, 0) || 1;
  const opexItemBuckets = [
    ...baseOpexLines.filter(([, v]) => v > 0).map(([label, v]) => ({ label: `Opex · ${label}`, pv: pvBaseOpex * (v / sumBase) })),
    ...otherOpexLines.filter(([, v]) => v > 0).map(([label, v]) => ({ label: `Opex · ${label}`, pv: pvOtherFixed * (v / sumOther) })),
  ];

  const buckets: { label: string; pv: number }[] = [
    ...capexBuckets,
    ...opexItemBuckets,
    { label: "Major maintenance", pv: pvMajorMaint },
    { label: "Real-estate tax", pv: pvRealEstate },
    { label: "% of revenue items", pv: pvPctRev },
    { label: "Additional levy", pv: pvLevy },
    { label: "Decommissioning", pv: pvDecomm },
    { label: "Corporate income tax", pv: pvTax },
  ];
  const lcoeContributions = buckets.map(b => ({
    label: b.label,
    pv: b.pv,
    pct: dCost > 0 ? b.pv / dCost : 0,
    usdPerMWh: dMWh > 0 ? b.pv / dMWh : 0,
  })).filter(b => b.pct > 0.0001).sort((a, b) => b.pct - a.pct);

  // Coverage ratios + balance check rollup
  const llcrs = sim.rows.filter(r => r.llcr > 0).map(r => r.llcr);
  const plcrs = sim.rows.filter(r => r.plcr > 0).map(r => r.plcr);
  const minLLCR = llcrs.length ? Math.min(...llcrs) : 0;
  const avgLLCR = llcrs.length ? llcrs.reduce((a,b)=>a+b,0) / llcrs.length : 0;
  const minPLCR = plcrs.length ? Math.min(...plcrs) : 0;
  const maxBalanceCheck = sim.rows.reduce((m, r) => Math.max(m, Math.abs(r.balanceCheck)), 0);
  let loanLifeYears = 0;
  sim.rows.forEach((r, i) => { if (r.debtService > 1e-3) loanLifeYears = i + 1; });
  const debtServiceCoverageOk = minDSCR >= I.targetDSCR - 0.005;

  // Build IRR rundown series (year-aligned starting at first construction year)
  const projectIRRSeries: { year: number; capex: number; cfads: number; dsraMovement: number; net: number }[] = [];
  for (let i = 0; i < consYearCount; i++) {
    projectIRRSeries.push({ year: constructionYears[i], capex: -constructionDraws[i], cfads: 0, dsraMovement: 0, net: -constructionDraws[i] });
  }
  sim.rows.forEach(r => projectIRRSeries.push({
    year: r.year, capex: 0, cfads: r.cfads, dsraMovement: -r.dsraMovement, net: r.cfads - r.dsraMovement,
  }));
  const equityIRRSeries: { year: number; equityDraw: number; cffi: number; net: number }[] = [];
  for (let i = 0; i < consYearCount; i++) {
    equityIRRSeries.push({ year: constructionYears[i], equityDraw: -equityDraws[i], cffi: 0, net: -equityDraws[i] });
  }
  sim.rows.forEach(r => equityIRRSeries.push({ year: r.year, equityDraw: 0, cffi: r.cffi, net: r.cffi }));

  return {
    inputs: I,
    totalUses,
    totalSources: totalUses,
    idc: fc.idc,
    upfrontFee: fc.upfront,
    commitmentFee: fc.commitment,
    debtAmount: debt,
    equityAmount: sim.equityAmount,
    effectiveGearing: debt / totalUses,
    rows: sim.rows,
    constructionYears, constructionDraws, equityDraws, debtDraws,
    minDSCR, avgDSCR,
    projectIRR, equityIRR, npvProject, npvEquity,
    paybackYears: payback,
    lcoeUsdPerKWh,
    wacc: waccCalc.wacc,
    costOfEquity: waccCalc.costOfEquity,
    countryERP: waccCalc.erp,
    lcoeDiscountRateUsed: dr,
    totalRevenue, totalOpex, totalCFADS,
    iterations: iter, converged,
    allInRate1: agg.r1, allInRate2: agg.r2, allInRate3: agg.r3,
    blendedRate: agg.blendedRate,
    dsraInitialAuto: dsraInit,
    dsraLookForwardMonths: I.dsraTargetMonths,
    commonEquityIRR, prefEquityIRR, shLoanIRR, blendedEquityIRR,
    commonEquityAmount: commonAmt,
    prefEquityAmount: prefAmt,
    shLoanAmount: shLoanAmt,
    minLLCR, avgLLCR, minPLCR, maxBalanceCheck, loanLifeYears, debtServiceCoverageOk,
    projectIRRSeries, equityIRRSeries,
    lcoeContributions,
  };
}

export function fmt(n: number, digits = 2): string {
  if (!isFinite(n) || n === null || n === undefined) return "-";
  if (Math.abs(n) < 0.005 && digits <= 2) return "-";
  return n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
export function fmtPct(n: number, digits = 2): string {
  if (!isFinite(n)) return "-";
  return (n * 100).toFixed(digits) + "%";
}
