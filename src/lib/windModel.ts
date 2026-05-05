// Wind 552 MWp project finance engine
// Closed-form IDC where possible; fixed-point iteration for DSCR-sculpted debt sizing.
// Inputs schema mirrors the Excel "Inputs" tab — all granular assumptions are exposed,
// then aggregated inside runModel to feed the simulation.

export type SizingMethod = "annuity" | "sculpted";
export type YieldCase = "P50" | "P75" | "P90";

export interface DebtTranche {
  name: string;
  enabled: boolean;
  baseRate: number;        // e.g. SOFR
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

  // Working capital
  daysReceivable: number;
  daysPayable: number;
  debtorMonths: number;
  creditorMonths: number;

  // ── Debt sizing — overall ────────────────────────────────────────────
  sizingMode: "fixed-gearing" | "dscr-sculpted";
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
  nokusEndYear: 2017,
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
};

export interface AnnualRow {
  year: number;
  mwh: number;
  revenue: number;
  carbonRevenue: number;
  opex: number;
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
  openingDebt: number;
  closingDebt: number;
  dscr: number;
  ppe: number;
  cash: number;
  receivables: number;
  payables: number;
  equity: number;
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
}

function irr(cashflows: number[], guess = 0.1): number {
  let r = guess;
  for (let iter = 0; iter < 100; iter++) {
    let npv = 0, dnpv = 0;
    for (let t = 0; t < cashflows.length; t++) {
      const f = Math.pow(1 + r, t);
      npv += cashflows[t] / f;
      dnpv += -t * cashflows[t] / (f * (1 + r));
    }
    if (Math.abs(dnpv) < 1e-12) break;
    const next = r - npv / dnpv;
    if (!isFinite(next)) return NaN;
    if (Math.abs(next - r) < 1e-7) return next;
    r = Math.max(-0.99, next);
  }
  return r;
}
function npv(rate: number, cashflows: number[]): number {
  return cashflows.reduce((s, cf, t) => s + cf / Math.pow(1 + rate, t), 0);
}

function trancheAllIn(t: DebtTranche): number {
  // hedged*hedgedRate + (1-hedged)*(base+underlyingMargin?) + risk margin
  // The Excel uses: All-in = hedged*hedgedRate + (1-hedged)*underlyingRate + riskMargin (approx)
  return t.hedgedPct * t.hedgedRate + (1 - t.hedgedPct) * (t.baseRate + (t.underlyingRate - t.baseRate)) + t.riskMargin;
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
  const r1 = trancheAllIn(t1), r2 = trancheAllIn(t2), r3 = trancheAllIn(t3);
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

function simulate(I: ProjectInputs, agg: ReturnType<typeof aggregate>, debtAmount: number, idc: number, fees: number) {
  const baseUses = agg.epcCost + agg.developmentCost + agg.substationContingency + I.dsraInitial;
  const totalCapex = baseUses + idc + fees;
  const equityAmount = totalCapex - debtAmount;

  const N = I.operationsYears;
  const opsStartYear = I.constructionStart + Math.ceil(I.constructionMonths / 12);
  const depreciableBase = totalCapex - I.dsraInitial;
  const annualDeprec = depreciableBase / I.depreciationYears;

  const rows: AnnualRow[] = [];
  let debt = debtAmount;
  let cash = 0, receivables = 0, payables = 0;
  let ppe = depreciableBase;
  let equity = equityAmount;

  const grace = I.graceYears;
  const amortYears = Math.max(1, I.debtTenorYears - grace);
  const r = agg.interestRate;
  const annuity = r > 0
    ? debtAmount * (r * Math.pow(1 + r, amortYears)) / (Math.pow(1 + r, amortYears) - 1)
    : debtAmount / amortYears;

  for (let y = 1; y <= N; y++) {
    const year = opsStartYear + y - 1;
    const escal = Math.pow(1 + I.cpi, y - 1);
    const tariffEsc = y <= I.tariffFixedYears
      ? Math.pow(1 + I.tariffEscalation, y - 1)
      : Math.pow(1 + I.tariffEscalation, I.tariffFixedYears - 1) * Math.pow(1 + I.tariffPostYearGrowth, y - I.tariffFixedYears);
    const degr = Math.pow(1 - I.degradation, y - 1);

    const lossKept = (1 - agg.lossFactor);
    const mwh = I.capacityMWp * agg.yieldKWhPerKWp * I.availability * lossKept * degr;
    const revenue = mwh * I.tariffUsdPerKWh * tariffEsc; // USD '000

    const carbonOn = I.cdmSwitch === 1 && (year >= I.cdmStartYear) && (year < I.cdmStartYear + I.cdmDurationYears);
    const carbonRevenue = carbonOn ? mwh * I.gridEmissionFactor * I.cdmPriceUSD / 1000 : 0; // USD '000

    const totalRev = revenue + carbonRevenue;

    const baseOpex = (I.oAndM + I.assetMgmt + I.spvCost + I.insurance + I.csrContribution + I.eetcCost) * escal;
    const realEstate = I.epcCost * 0.5 * I.realEstateTaxRate * I.realEstateTaxableAmount; // estimate per template note
    const opex = baseOpex + realEstate + I.additionalLevy * totalRev;
    const ebitda = totalRev - opex;

    const depreciation = y <= I.depreciationYears ? annualDeprec : 0;
    const openingDebt = debt;
    const interest = openingDebt * r;
    const ebit = ebitda - depreciation;
    const ebt = ebit - interest;
    const tax = (y <= I.taxHolidayYears || ebt <= 0) ? 0 : ebt * I.taxRate;
    const netIncome = ebt - tax;

    const newReceivables = totalRev * (I.daysReceivable / 365);
    const newPayables = opex * (I.daysPayable / 365);
    const wcChange = -((newReceivables - receivables) - (newPayables - payables));
    receivables = newReceivables; payables = newPayables;

    const cfads = ebitda - tax + wcChange;

    let principal = 0;
    let debtService = interest;
    if (y > grace && debt > 1e-6) {
      principal = Math.max(0, Math.min(debt, annuity - interest));
      debtService = interest + principal;
    }
    debt -= principal;
    if (debt < 1e-6) debt = 0;

    const cffi = cfads - debtService;
    const dscr = debtService > 0 ? cfads / debtService : 0;

    ppe = Math.max(0, ppe - depreciation);
    cash += cffi;
    equity += netIncome;

    rows.push({
      year, mwh, revenue, carbonRevenue, opex, ebitda, depreciation, ebit,
      interest, ebt, tax, netIncome,
      workingCapitalChange: wcChange, cfads, debtService, principal, cffi,
      openingDebt, closingDebt: debt, dscr,
      ppe, cash, receivables, payables, equity,
    });
  }

  return { rows, totalCapex, equityAmount };
}

export function runModel(inputs: ProjectInputs): ModelOutputs {
  const I = inputs;
  const agg = aggregate(I);
  const baseUses = agg.epcCost + agg.developmentCost + agg.substationContingency + I.dsraInitial;
  const consYears = I.constructionMonths / 12;

  // Normalise monthly draw profile to length = constructionMonths and sum to 1.
  const M = Math.max(1, Math.round(I.constructionMonths));
  const rawSched = (I.capexSchedulePct && I.capexSchedulePct.length > 0)
    ? I.capexSchedulePct.slice(0, M)
    : Array.from({ length: M }, () => 100 / M);
  while (rawSched.length < M) rawSched.push(0);
  const schedSum = rawSched.reduce((a, b) => a + b, 0) || 1;
  const monthFrac = rawSched.map(p => p / schedSum); // fractions per month, sum = 1

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

  let debt = I.gearing < 1 ? baseUses * I.gearing / (1 - I.gearing) : baseUses;
  let iter = 0;
  let converged = false;

  if (I.sizingMode === "fixed-gearing") {
    for (iter = 0; iter < 50; iter++) {
      const fc = computeFC(debt);
      const totalUses = baseUses + fc.idc + fc.fees;
      const newDebt = totalUses * I.gearing;
      if (Math.abs(newDebt - debt) < 0.01) { converged = true; break; }
      debt = newDebt;
    }
  } else {
    let lo = 0, hi = baseUses * 5;
    for (iter = 0; iter < 60; iter++) {
      const mid = (lo + hi) / 2;
      const fc = computeFC(mid);
      const sim = simulate(I, agg, mid, fc.idc, fc.fees);
      const dscrs = sim.rows
        .filter(r => r.debtService > 0 && r.year > I.constructionStart + Math.ceil(consYears) + I.graceYears - 1)
        .map(r => r.dscr);
      const minDSCR = dscrs.length ? Math.min(...dscrs) : 0;
      if (minDSCR >= I.targetDSCR) lo = mid; else hi = mid;
      if (hi - lo < 1) { converged = true; break; }
    }
    debt = lo;
  }

  const fc = computeFC(debt);
  const sim = simulate(I, agg, debt, fc.idc, fc.fees);
  const totalUses = sim.totalCapex;

  // Aggregate the monthly schedule into per-year construction draws.
  const consYearCount = Math.max(1, Math.ceil(consYears));
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

  const projCF: number[] = [];
  for (let i = 0; i < consYearCount; i++) projCF.push(-constructionDraws[i]);
  sim.rows.forEach(r => projCF.push(r.ebitda - r.tax + r.workingCapitalChange));
  const projectIRR = irr(projCF, 0.08);
  const npvProject = npv(I.discountRateProject, projCF);

  const eqCF: number[] = [];
  for (let i = 0; i < consYearCount; i++) eqCF.push(-equityDraws[i]);
  sim.rows.forEach(r => eqCF.push(r.cffi));
  if (eqCF.length > 0) eqCF[eqCF.length - 1] += I.dsraInitial;
  const equityIRR = irr(eqCF, 0.12);
  const npvEquity = npv(I.discountRateEquity, eqCF);

  let cum = 0, payback = NaN;
  for (let i = 0; i < eqCF.length; i++) {
    cum += eqCF[i];
    if (cum >= 0 && isNaN(payback)) { payback = i; break; }
  }

  const totalRevenue = sim.rows.reduce((s, r) => s + r.revenue + r.carbonRevenue, 0);
  const totalOpex = sim.rows.reduce((s, r) => s + r.opex, 0);
  const totalCFADS = sim.rows.reduce((s, r) => s + r.cfads, 0);

  let dCost = 0, dMWh = 0;
  const dr = I.lcoeDiscountFactor || I.discountRateProject;
  for (let i = 0; i < consYearCount; i++) dCost += constructionDraws[i] * 1000 / Math.pow(1 + dr, i);
  sim.rows.forEach((r, i) => {
    dCost += (r.opex + r.tax) * 1000 / Math.pow(1 + dr, consYearCount + i);
    dMWh += r.mwh / Math.pow(1 + dr, consYearCount + i);
  });
  const lcoeUsdPerKWh = dMWh > 0 ? dCost / (dMWh * 1000) : 0;

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
    totalRevenue, totalOpex, totalCFADS,
    iterations: iter, converged,
    allInRate1: agg.r1, allInRate2: agg.r2, allInRate3: agg.r3,
    blendedRate: agg.blendedRate,
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
