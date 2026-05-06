// Wind 552 MWp project finance engine
// Closed-form IDC where possible; fixed-point iteration for DSCR-sculpted debt sizing.
// Inputs schema mirrors the Excel "Inputs" tab — all granular assumptions are exposed,
// then aggregated inside runModel to feed the simulation.

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
  const depreciableBase = totalCapex - dsraInitial;
  const annualDeprec = depreciableBase / I.depreciationYears;

  const rows: AnnualRow[] = [];
  let debt = debtAmount;
  let cash = 0, receivables = 0, payables = 0;
  let ppe = depreciableBase;
  let equity = equityAmount;

  const grace = I.graceYears;
  const amortYears = Math.max(1, I.debtTenorYears - grace);
  const r = agg.interestRate;
  const annuityPmt = r > 0
    ? debtAmount * (r * Math.pow(1 + r, amortYears)) / (Math.pow(1 + r, amortYears) - 1)
    : debtAmount / amortYears;

  const refiOn = I.refinanceSwitch === 1;
  const refiOpsYear = refiOn ? Math.max(1, I.refinanceYear - opsStartYear + 1) : -1;

  // ── PASS A: economics independent of debt service (revenue/opex/EBITDA/CFADS-pre-tax-shield)
  type Pre = {
    year: number; y: number; mwh: number; revenue: number; carbonRevenue: number; totalRev: number;
    opex: number; ebitda: number; depreciation: number; ebit: number; ebitdaTax: number;
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
    const mwh = I.capacityMWp * agg.yieldKWhPerKWp * I.availability * lossKept * degr;
    const revenue = mwh * I.tariffUsdPerKWh * tariffEsc;
    const carbonOn = I.cdmSwitch === 1 && year >= I.cdmStartYear && year < I.cdmStartYear + I.cdmDurationYears;
    const carbonRevenue = carbonOn ? mwh * I.gridEmissionFactor * I.cdmPriceUSD / 1000 : 0;
    const totalRev = revenue + carbonRevenue;
    const baseOpex = (I.oAndM + I.assetMgmt + I.spvCost + I.insurance + I.csrContribution + I.eetcCost) * escal;
    const rentalValue = I.epcCost * (I.rentalValuePct || 0.5);
    const realEstate = rentalValue * I.realEstateTaxableAmount * I.realEstateTaxRate * (1 - (I.exemptedProportion || 0));
    const otherFixedOpex = (I.bondExpenses + I.lease + I.auxiliaryPower + I.opexContingency
      + I.usufructEGP * I.fxEGP + I.migaPremium) * escal;
    const majorMaintenance = (I.mmWindSpareParts + I.mmSubstationSpareParts + I.mmPmCm + I.mmSpare) * escal;
    const revPctOpex = totalRev * (I.pctRevConvLocalEUR + I.pctRevUsufructLease + I.pctRevInsuranceOps);
    const decommissioning = (y === N) ? I.mmDecommissioning * escal : 0;
    const opex = baseOpex + realEstate + I.additionalLevy * totalRev + otherFixedOpex + majorMaintenance + revPctOpex + decommissioning;
    const ebitda = totalRev - opex;
    const depreciation = y <= I.depreciationYears ? annualDeprec : 0;
    const ebit = ebitda - depreciation;
    const ebitdaTax = (y <= I.taxHolidayYears || ebit <= 0) ? 0 : ebit * I.taxRate;
    const newReceivables = totalRev * (I.daysReceivable / 365);
    const newPayables = opex * (I.daysPayable / 365);
    const wcChange = -((newReceivables - recv) - (newPayables - pay));
    recv = newReceivables; pay = newPayables;
    const cfadsPreShield = ebitda - ebitdaTax + wcChange;
    pre.push({ year, y, mwh, revenue, carbonRevenue, totalRev, opex, ebitda, depreciation, ebit, ebitdaTax, cfadsPreShield, wcChange, newReceivables, newPayables });
  }

  // ── PASS B: size principal year-by-year per sizingMode
  const principalByY: number[] = Array(N + 1).fill(0);
  const interestByY: number[] = Array(N + 1).fill(0);
  const dsByY: number[] = Array(N + 1).fill(0);
  let dbt = debtAmount;
  for (let y = 1; y <= N; y++) {
    const opening = dbt;
    const interest = opening * r;
    interestByY[y] = interest;
    if (y <= grace || dbt <= 1e-6) { dsByY[y] = interest; continue; }
    let principal = 0;
    if (I.sizingMode === "dscr-sculpted" || I.sizingMode === "llcr-sculpted") {
      // Approx CFADS with interest tax shield (stable: shield doesn't depend on principal)
      const shield = (y <= I.taxHolidayYears) ? 0 : interest * I.taxRate;
      const cfadsApprox = pre[y - 1].cfadsPreShield + shield;
      const targetDS = cfadsApprox / Math.max(1.001, I.targetDSCR);
      principal = Math.max(0, Math.min(dbt, targetDS - interest));
    } else if (I.sizingMode === "manual") {
      principal = Math.min(dbt, debtAmount / amortYears);
    } else if (I.sizingMode === "bullet") {
      const yEnd = Math.min(N, grace + amortYears);
      principal = (y === yEnd) ? dbt : 0;
    } else { // annuity / mortgage / fixed-gearing
      principal = Math.max(0, Math.min(dbt, annuityPmt - interest));
    }
    if (refiOn && y === refiOpsYear && I.refinanceAmount > 0) {
      principal = Math.max(0, dbt - I.refinanceAmount);
    }
    principalByY[y] = principal;
    dsByY[y] = interest + principal;
    dbt = Math.max(0, dbt - principal);
  }
  // Force terminal repayment if balance remains at end of tenor
  if (dbt > 1e-3) {
    const yEnd = Math.min(N, grace + amortYears);
    principalByY[yEnd] += dbt;
    dsByY[yEnd] += dbt;
  }

  // ── PASS C: assemble draft rows (interest tax shield captured exactly)
  const draft: AnnualRow[] = [];
  debt = debtAmount;
  for (let y = 1; y <= N; y++) {
    const p = pre[y - 1];
    const openingDebt = debt;
    const interest = interestByY[y];
    const principal = principalByY[y];
    const debtService = dsByY[y];
    debt = Math.max(0, debt - principal);
    const ebt = p.ebit - interest;
    const taxOnEbt = (y <= I.taxHolidayYears || ebt <= 0) ? 0 : ebt * I.taxRate;
    const nokusOn = I.nokusRate > 0 && p.year >= I.nokusStartYear && p.year <= I.nokusEndYear;
    const effRate = ebt > 0 ? taxOnEbt / ebt : 0;
    const nokusTax = nokusOn && effRate < I.nokusThresholdRate && ebt > 0
      ? ebt * Math.max(0, I.nokusRate - effRate) : 0;
    const totalTax = taxOnEbt + nokusTax;
    const netIncome = ebt - totalTax;
    const cfads = p.ebitda - totalTax + p.wcChange;
    const dscr = debtService > 0 ? cfads / debtService : 0;
    ppe = Math.max(0, ppe - p.depreciation);
    equity += netIncome;
    draft.push({
      year: p.year, mwh: p.mwh, revenue: p.revenue, carbonRevenue: p.carbonRevenue,
      opex: p.opex, ebitda: p.ebitda, depreciation: p.depreciation, ebit: p.ebit,
      interest, ebt, tax: totalTax, netIncome,
      workingCapitalChange: p.wcChange, cfads, debtService, principal, cffi: 0,
      openingDebt, closingDebt: debt, dscr,
      ppe, cash: 0, receivables: p.newReceivables, payables: p.newPayables, equity,
      dsraTarget: 0, dsraMovement: 0, dsraBalance: 0,
      llcr: 0, plcr: 0, balanceCheck: 0,
    });
  }

  // ── PASS D: DSRA, LLCR, PLCR, cash & balance check
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
  const dr = Math.max(0.001, I.discountRateProjectPostTax || I.discountRateProject || 0.07);
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
  rows.length = 0;
  for (let y = 0; y < draft.length; y++) {
    const target = I.dsraSwitch === 1 ? lookForward(y + 1) : 0;
    const movement = target - dsraPrev;
    const row = draft[y];
    const cffi = row.cfads - row.debtService - movement;
    cashAcc += cffi;
    const llcr = row.openingDebt > 1e-3 ? (pvFromIdx(y, loanLifeEnd) + target) / row.openingDebt : 0;
    const plcr = row.openingDebt > 1e-3 ? (pvFromIdx(y, draft.length) + target) / row.openingDebt : 0;
    // Balance-sheet check: Assets - (Debt + Equity book + Payables - Receivables) ≈ 0
    // Simplified consistency proxy
    const assets = row.ppe + cashAcc + row.receivables + target;
    const liabEq = row.closingDebt + row.equity + row.payables;
    const balanceCheck = assets - liabEq;
    rows.push({ ...row, cffi, cash: cashAcc, dsraTarget: target, dsraMovement: movement, dsraBalance: target, llcr, plcr, balanceCheck });
    dsraPrev = target;
  }

  return { rows, totalCapex, equityAmount, dsraInitialUsed: dsraInitial };
}

export function runModel(inputs: ProjectInputs): ModelOutputs {
  const I = inputs;
  const agg = aggregate(I);
  const consYears = I.constructionMonths / 12;

  // Normalise monthly draw profile to length = constructionMonths and sum to 1.
  const M = Math.max(1, Math.round(Number(I.constructionMonths) || 0));
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

  // DSRA is auto-sized (look-forward). Iterate: debt depends on DSRA, DSRA depends on debt service.
  let dsraInit = I.manualDSRASwitch === 1 ? I.manualDSRAInput : I.dsraInitial;
  let debt = 0, iter = 0, converged = false;
  let fc = { idc: 0, upfront: 0, commitment: 0, fees: 0 };
  let sim: ReturnType<typeof simulate> = { rows: [], totalCapex: 0, equityAmount: 0, dsraInitialUsed: dsraInit } as any;

  for (let outer = 0; outer < 6; outer++) {
    const baseUses = agg.epcCost + agg.developmentCost + agg.substationContingency + dsraInit;
    if (I.sizingMode === "fixed-gearing") {
      debt = I.gearing < 1 ? baseUses * I.gearing / (1 - I.gearing) : baseUses;
      for (iter = 0; iter < 50; iter++) {
        const fcc = computeFC(debt);
        const tu = baseUses + fcc.idc + fcc.fees;
        const nd = tu * I.gearing;
        if (Math.abs(nd - debt) < 0.01) { converged = true; break; }
        debt = nd;
      }
    } else {
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

  const projCF: number[] = [];
  for (let i = 0; i < consYearCount; i++) projCF.push(-constructionDraws[i]);
  // Project CF = CFADS net of DSRA movements (so terminal release is captured
  // exactly once, and reserve build-up reduces project cash).
  sim.rows.forEach(r => projCF.push(r.cfads - r.dsraMovement));
  const projectIRR = irr(projCF, 0.08);
  const npvProject = npv(I.discountRateProject, projCF);

  const eqCF: number[] = [];
  for (let i = 0; i < consYearCount; i++) eqCF.push(-equityDraws[i]);
  sim.rows.forEach(r => eqCF.push(r.cffi));
  // DSRA release is already captured in the final-year cffi via the negative
  // movement (target falls to 0). Do not double-count it here.
  const equityIRR = irr(eqCF, 0.12);
  const npvEquity = npv(I.discountRateEquity, eqCF);

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
  let shBal = shLoanAmt;
  const prefAmortYears = Math.max(1, I.operationsYears);
  const shAmortYears = Math.max(1, I.operationsYears);
  sim.rows.forEach((r, idx) => {
    let avail = r.cffi;
    // (DSRA release already in r.cffi via dsraMovement)
    // Pref coupon + straight-line repayment
    const prefCoupon = prefBal * I.prefEquityCoupon;
    const prefPrincipal = Math.min(prefBal, prefAmt / prefAmortYears);
    const prefPay = Math.min(avail, prefCoupon + prefPrincipal);
    avail -= prefPay;
    prefBal = Math.max(0, prefBal - prefPrincipal);
    prefCF.push(prefPay);
    // SH loan interest + principal
    const shInt = shBal * I.shLoanRate;
    const shPrincipal = I.shLoanFullyRepaid === 1 && idx === sim.rows.length - 1
      ? shBal : Math.min(shBal, shLoanAmt / shAmortYears);
    const shPay = Math.min(Math.max(0, avail), shInt + shPrincipal);
    avail -= shPay;
    shBal = Math.max(0, shBal - shPrincipal);
    shCF.push(shPay);
    // Remainder to common
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

  let dCost = 0, dMWh = 0;
  const dr = I.lcoeDiscountFactor || I.discountRateProject;
  for (let i = 0; i < consYearCount; i++) dCost += constructionDraws[i] * 1000 / Math.pow(1 + dr, i);
  sim.rows.forEach((r, i) => {
    dCost += (r.opex + r.tax) * 1000 / Math.pow(1 + dr, consYearCount + i);
    dMWh += r.mwh / Math.pow(1 + dr, consYearCount + i);
  });
  const lcoeUsdPerKWh = dMWh > 0 ? dCost / (dMWh * 1000) : 0;

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
    dsraInitialAuto: dsraInit,
    dsraLookForwardMonths: I.dsraTargetMonths,
    commonEquityIRR, prefEquityIRR, shLoanIRR, blendedEquityIRR,
    commonEquityAmount: commonAmt,
    prefEquityAmount: prefAmt,
    shLoanAmount: shLoanAmt,
    minLLCR, avgLLCR, minPLCR, maxBalanceCheck, loanLifeYears, debtServiceCoverageOk,
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
