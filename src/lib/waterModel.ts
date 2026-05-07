// Water (SWRO) Project Finance Model
// Mirrors the Excel "Water.xlsm": Assumptions → Calculations → Dashboard → Income Statement → Balance Sheet
// All monetary outputs are in EGP unless suffixed _usd.

export type Ccy = "EGP" | "USD";

export interface CapexItem {
  key: string;
  label: string;
  currency: Ccy;
  amount: number;            // in its own currency (pre-tax)
  taxPct?: number;           // e.g. 0.14 for 14% VAT/duty applied on top of amount
  depreciationYears: number; // straight line; 0 = no depreciation
}

export interface OpexVarItem {
  key: string;
  label: string;
  currency: Ccy;
  amountPerM3: number;       // per m³ of sold volume (pre-tax, in own currency)
  taxPct?: number;           // VAT/duty applied on top, e.g. 0.14
}

export interface OpexFixedItem {
  key: string;
  label: string;
  currency: Ccy;
  amountPerMonth: number;    // per-employee per-month if employees>1, else total per-month
  employees?: number;        // multiplier (defaults to 1)
  taxPct?: number;           // VAT/payroll tax applied on top
}

export interface WaterInputs {
  projectName: string;
  scenario: string;

  // Timing
  startYear: number;
  developmentMonths: number;
  constructionMonths: number;
  contractYears: number;

  // FX & inflation — scalar defaults (used as fallback for any year not overridden)
  fxRateEgpPerUsd: number;
  egpInflation: number;
  revenueInflation: number;
  electricityInflation: number;
  usdInflation: number;
  // Per-year overrides (length up to contractYears). Empty array → use scalar.
  fxRatePerYear?: number[];
  egpInflationPerYear?: number[];
  revenueInflationPerYear?: number[];
  electricityInflationPerYear?: number[];
  usdInflationPerYear?: number[];

  // Plant
  capacityM3Day: number;
  capacityM3DayPerYear?: number[]; // per-year override (length = contractYears)
  minTakePct: number;
  /** @deprecated kept for back-compat; use minTakePctPerYear */
  realizedPctOfMinTake?: number;
  minTakePctPerYear?: number[]; // per-year override (length = contractYears)

  // Pricing
  sellingPriceEgpPerM3: number;
  pctPeggedToUsd: number;

  // CAPEX — itemized (Reza style)
  capexItems: CapexItem[];
  contingencyPct: number;

  // Financing
  debtToEquity: number;
  bankSpread: number;
  loanTenorYears: number;
  debtRateYr1: number;
  debtRateStepDown: number;
  debtRateFloor: number;
  debtRatePerYear?: number[]; // override per loan year (length = loanTenor)
  debtRepaymentMode: "equal" | "annuity" | "sculpted";
  debtGraceYears: number;             // interest-only period at start
  targetDSCR: number;                 // for sculpted mode

  // Shareholder (subordinated) loan — funds part of the equity bucket
  shareholderLoanPct: number;         // % of equity replaced by SHL (0..1)
  shareholderLoanRate: number;        // annual interest
  shareholderLoanTenorYears: number;
  shareholderLoanGraceYears: number;

  // Maintenance reserve (major maintenance accrual, % of total CAPEX, applied each operating year)
  mmAnnualPctOfCapex: number;
  mmSchedulePctOfCapex?: number[];    // optional per-year override (length = contractYears)

  // Terminal value at end of contract
  terminalValueMode: "none" | "salvage" | "ebitda-multiple" | "perpetuity";
  salvageValuePct: number;            // % of total CAPEX (mode = salvage)
  exitEbitdaMultiple: number;         // mode = ebitda-multiple
  terminalGrowth: number;             // mode = perpetuity (Gordon)

  // OPEX
  electricityIncluded: boolean;
  electricityPriceEgpKwh: number;
  electricityKwhPerM3: number;
  electricityCurrency: Ccy;        // currency of electricity price (default EGP)
  wellsIncluded: boolean;
  wellsCostEgpPerM3: number;       // legacy fallback (EGP)
  otherVarEgpPerM3: number;        // legacy fallback (EGP)
  opexVariableItems: OpexVarItem[];
  opexFixedItems: OpexFixedItem[];

  // SG&A
  headOfficeEgpMonth: number;
  headOfficeAllocPct: number;
  otherSgaEgpMonth: number;
  sgaCurrency: Ccy;

  // Depreciation (legacy single-tenor — used only as default for items missing dep years)
  depreciationYears: number;

  // Working Capital
  receivablesDays: number;
  payablesDays: number;

  // Tax
  taxRate: number;

  // Discount rates
  discountRateProject: number;
  discountRateEquity: number;

  // Legacy scalar CAPEX fields (kept for back-compat with old scenarios in DB)
  feedSysUsd?: number; pretreatmentUsd?: number; roUnitUsd?: number; bwCipUsd?: number;
  installationEgp?: number; drillingUsd?: number;
  // Legacy scalar variable-OPEX USD/m3 fields
  chemicalsUsdPerM3?: number; smbsUsdPerM3?: number; hppUsdPerM3?: number; feedUsdPerM3?: number;
  mmfUsdPerM3?: number; dosingUsdPerM3?: number; boosterUsdPerM3?: number; vfdUsdPerM3?: number;
  pxUsdPerM3?: number; pressureVesselUsdPerM3?: number; cfsUsdPerM3?: number;
  instrumentationUsdPerM3?: number; cipPumpsUsdPerM3?: number; pvcUsdPerM3?: number;
  // Legacy fixed
  salariesEgpMonth?: number; otherFixedEgpMonth?: number;
  monthlySeasonality?: number[];
}

const DEFAULT_CAPEX: CapexItem[] = [
  { key: "feedSys",       label: "Feed System",      currency: "USD", amount: 45954.1,    depreciationYears: 25 },
  { key: "pretreatment",  label: "Pretreatment",     currency: "USD", amount: 74464.8,    depreciationYears: 25 },
  { key: "roUnit",        label: "RO Unit",          currency: "USD", amount: 779112.58,  depreciationYears: 25 },
  { key: "bwCip",         label: "BW/CIP",           currency: "USD", amount: 17763.48,   depreciationYears: 25 },
  { key: "installation",  label: "Installation",     currency: "EGP", amount: 5_000_000,  depreciationYears: 0 },
  { key: "drilling",      label: "Drilling/Wells",   currency: "USD", amount: 0,          depreciationYears: 25 },
];

const DEFAULT_OPEX_VAR: OpexVarItem[] = [
  { key: "chemicals",       label: "Chemicals",       currency: "USD", amountPerM3: 0.036322580645161286 },
  { key: "smbs",            label: "SMBS",            currency: "USD", amountPerM3: 0 },
  { key: "hpp",             label: "HPP",             currency: "USD", amountPerM3: 0.00302941400304414 },
  { key: "feed",            label: "Feed",            currency: "USD", amountPerM3: 0.0008458862465753423 },
  { key: "mmf",             label: "MMF",             currency: "USD", amountPerM3: 0.0010319342465753424 },
  { key: "dosing",          label: "Dosing Pumps",    currency: "USD", amountPerM3: 0.001065505008219178 },
  { key: "booster",         label: "Booster/Turbo",   currency: "USD", amountPerM3: 0.0025 },
  { key: "vfd",             label: "VFD",             currency: "USD", amountPerM3: 0.001456 },
  { key: "px",              label: "PX",              currency: "USD", amountPerM3: 0.0035 },
  { key: "pressureVessel",  label: "Pressure Vessel", currency: "USD", amountPerM3: 0.0026426598173515986 },
  { key: "cfs",             label: "CF's",            currency: "USD", amountPerM3: 0.0016 },
  { key: "instrumentation", label: "Instrumentation", currency: "USD", amountPerM3: 0.0010315872146118722 },
  { key: "cipPumps",        label: "CIP Pumps",       currency: "USD", amountPerM3: 0.000704905205479452 },
  { key: "pvc",             label: "PVC",             currency: "USD", amountPerM3: 0.0007912328767123285 },
  { key: "wells",           label: "Wells Cost",      currency: "EGP", amountPerM3: 0 },
  { key: "otherVar",        label: "Other Variable",  currency: "EGP", amountPerM3: 0 },
];

const DEFAULT_OPEX_FIXED: OpexFixedItem[] = [
  { key: "salaries",   label: "Salaries",     currency: "EGP", amountPerMonth: 17_000 },
  { key: "otherFixed", label: "Other Fixed",  currency: "EGP", amountPerMonth: 0 },
];

export const DEFAULT_WATER_INPUTS: WaterInputs = {
  projectName: "SWRO Water Plant",
  scenario: "Base",
  startYear: 2028,
  developmentMonths: 1,
  constructionMonths: 12,
  contractYears: 25,
  fxRateEgpPerUsd: 53,
  egpInflation: 0,
  revenueInflation: 0,
  electricityInflation: 0,
  usdInflation: 0,
  fxRatePerYear: [],
  egpInflationPerYear: [],
  revenueInflationPerYear: [],
  electricityInflationPerYear: [],
  usdInflationPerYear: [],
  capacityM3Day: 3500,
  capacityM3DayPerYear: [],
  minTakePct: 0.95,
  realizedPctOfMinTake: 0.96,
  minTakePctPerYear: [],
  sellingPriceEgpPerM3: 23,
  pctPeggedToUsd: 0,
  capexItems: DEFAULT_CAPEX,
  contingencyPct: 0.05,
  debtToEquity: 0.8,
  bankSpread: 0.02,
  loanTenorYears: 10,
  debtRateYr1: 0.20,
  debtRateStepDown: 0.02,
  debtRateFloor: 0.10,
  debtRatePerYear: [],
  electricityIncluded: true,
  electricityPriceEgpKwh: 2.34,
  electricityKwhPerM3: 3,
  electricityCurrency: "EGP",
  wellsIncluded: true,
  wellsCostEgpPerM3: 0,
  otherVarEgpPerM3: 0,
  opexVariableItems: DEFAULT_OPEX_VAR,
  opexFixedItems: DEFAULT_OPEX_FIXED,
  headOfficeEgpMonth: 500_000,
  headOfficeAllocPct: 1,
  otherSgaEgpMonth: 0,
  sgaCurrency: "EGP",
  depreciationYears: 25,
  receivablesDays: 30,
  payablesDays: 0,
  taxRate: 0.225,
  discountRateProject: 0.12,
  discountRateEquity: 0.18,
  debtRepaymentMode: "equal",
  debtGraceYears: 0,
  targetDSCR: 1.30,
  shareholderLoanPct: 0,
  shareholderLoanRate: 0.12,
  shareholderLoanTenorYears: 10,
  shareholderLoanGraceYears: 2,
  mmAnnualPctOfCapex: 0,
  mmSchedulePctOfCapex: [],
  terminalValueMode: "none",
  salvageValuePct: 0.10,
  exitEbitdaMultiple: 5,
  terminalGrowth: 0.02,
};

// Migrate legacy scenarios that lack itemized arrays
export function migrateInputs(raw: Partial<WaterInputs>): WaterInputs {
  const m: WaterInputs = { ...DEFAULT_WATER_INPUTS, ...raw };
  // UI removed HQ Allocation & SG&A currency — always treat HO as 100% allocated and SG&A as EGP.
  m.headOfficeAllocPct = 1;
  m.sgaCurrency = "EGP";
  if (!m.capexItems || m.capexItems.length === 0) {
    m.capexItems = [
      { key: "feedSys",      label: "Feed System",     currency: "USD", amount: raw.feedSysUsd      ?? 45954.1,   depreciationYears: 25 },
      { key: "pretreatment", label: "Pretreatment",    currency: "USD", amount: raw.pretreatmentUsd ?? 74464.8,   depreciationYears: 25 },
      { key: "roUnit",       label: "RO Unit",         currency: "USD", amount: raw.roUnitUsd       ?? 779112.58, depreciationYears: 25 },
      { key: "bwCip",        label: "BW/CIP",          currency: "USD", amount: raw.bwCipUsd        ?? 17763.48,  depreciationYears: 25 },
      { key: "installation", label: "Installation",    currency: "EGP", amount: raw.installationEgp ?? 5_000_000, depreciationYears: 0 },
      { key: "drilling",     label: "Drilling/Wells",  currency: "USD", amount: raw.drillingUsd     ?? 0,         depreciationYears: 25 },
    ];
  }
  if (!m.opexVariableItems || m.opexVariableItems.length === 0) {
    const k = (key: keyof WaterInputs, label: string, def: number) =>
      ({ key, label, currency: "USD" as Ccy, amountPerM3: (raw[key] as number | undefined) ?? def });
    m.opexVariableItems = [
      k("chemicalsUsdPerM3","Chemicals",0.0363),
      k("smbsUsdPerM3","SMBS",0),
      k("hppUsdPerM3","HPP",0.003),
      k("feedUsdPerM3","Feed",0.000846),
      k("mmfUsdPerM3","MMF",0.001032),
      k("dosingUsdPerM3","Dosing Pumps",0.001066),
      k("boosterUsdPerM3","Booster/Turbo",0.0025),
      k("vfdUsdPerM3","VFD",0.001456),
      k("pxUsdPerM3","PX",0.0035),
      k("pressureVesselUsdPerM3","Pressure Vessel",0.002643),
      k("cfsUsdPerM3","CF's",0.0016),
      k("instrumentationUsdPerM3","Instrumentation",0.001032),
      k("cipPumpsUsdPerM3","CIP Pumps",0.000705),
      k("pvcUsdPerM3","PVC",0.000791),
    ];
  }
  if (!m.opexFixedItems || m.opexFixedItems.length === 0) {
    m.opexFixedItems = [
      { key: "salaries",   label: "Salaries",    currency: "EGP", amountPerMonth: raw.salariesEgpMonth   ?? 17_000 },
      { key: "otherFixed", label: "Other Fixed", currency: "EGP", amountPerMonth: raw.otherFixedEgpMonth ?? 0 },
    ];
  }
  return m;
}

// ─── Helpers ──────────────────────────────────────────────────────────────
export const fmtNum = (v: number, d = 0) =>
  isFinite(v)
    ? v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })
    : "—";
export const fmtPct = (v: number, d = 1) =>
  isFinite(v) ? `${(v * 100).toFixed(d)}%` : "—";
export const fmtEgp = (v: number, d = 0) => `EGP ${fmtNum(v, d)}`;

const at = (arr: number[] | undefined, y: number, fallback: number): number => {
  if (!arr || arr.length === 0) return fallback;
  const v = arr[y];
  return (v === undefined || v === null || !isFinite(v)) ? fallback : v;
};

export const fxAt = (I: WaterInputs, y: number) => at(I.fxRatePerYear, y, I.fxRateEgpPerUsd);
export const inflEgpAt = (I: WaterInputs, y: number) => at(I.egpInflationPerYear, y, I.egpInflation);
export const inflRevAt = (I: WaterInputs, y: number) => at(I.revenueInflationPerYear, y, I.revenueInflation);
export const inflElecAt = (I: WaterInputs, y: number) => at(I.electricityInflationPerYear, y, I.electricityInflation);
export const inflUsdAt = (I: WaterInputs, y: number) => at(I.usdInflationPerYear, y, I.usdInflation);
export const minTakeAt = (I: WaterInputs, y: number) => at(I.minTakePctPerYear, y, I.minTakePct);
export const capacityM3DayAt = (I: WaterInputs, y: number) => at(I.capacityM3DayPerYear, y, I.capacityM3Day);
export const debtRateAt = (I: WaterInputs, y: number) => {
  const fallback = Math.max(I.debtRateYr1 - I.debtRateStepDown * y, I.debtRateFloor);
  return at(I.debtRatePerYear, y, fallback);
};

function npv(rate: number, cf: number[]): number {
  let r = 0;
  for (let i = 0; i < cf.length; i++) r += cf[i] / Math.pow(1 + rate, i);
  return r;
}
function irr(cf: number[], guess = 0.1): number {
  let x = guess;
  for (let i = 0; i < 60; i++) {
    let f = 0, df = 0;
    for (let t = 0; t < cf.length; t++) {
      const v = Math.pow(1 + x, t);
      f += cf[t] / v;
      df -= (t * cf[t]) / (v * (1 + x));
    }
    if (Math.abs(f) < 1e-7) return x;
    if (Math.abs(df) < 1e-12) break;
    x = x - f / df;
    if (x < -0.99) x = -0.5;
  }
  let lo = -0.99, hi = 5;
  const fn = (r: number) => npv(r, cf);
  let flo = fn(lo), fhi = fn(hi);
  if (flo * fhi > 0) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = fn(mid);
    if (Math.abs(fm) < 1e-7) return mid;
    if (flo * fm < 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  return (lo + hi) / 2;
}

// ─── Outputs ──────────────────────────────────────────────────────────────
export interface YearRow {
  year: number;
  yearIdx: number;
  fx: number;
  volumeM3: number;
  pricePerM3: number;
  revenue: number;
  fixedCost: number;
  variableCost: number;
  electricityCost: number;
  operatingCost: number;
  sga: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interest: number;
  ebt: number;
  tax: number;
  netProfit: number;
  capex: number;
  debtDraw: number;
  principalRepay: number;
  workingCapDelta: number;
  fcff: number;
  fcfe: number;
  debtOpening: number;
  debtClosing: number;
  rate: number;
  dscr: number;
  // Balance sheet items
  ppeGross: number;
  accumDep: number;
  ppeNet: number;
  accountsReceivable: number;
  cash: number;
  totalAssets: number;
  paidInEquity: number;
  retainedEarnings: number;
  totalEquity: number;
  totalLiabAndEquity: number;
}

export interface CapexItemResolved extends CapexItem {
  amountEgp: number;          // (amount × fx if USD) × (1+contingency)
  annualDepreciation: number; // EGP
}

export interface WaterOutputs {
  inputs: WaterInputs;
  capexResolved: CapexItemResolved[];
  totalRoCapex: number;
  idc: number;
  totalCapexWithIdc: number;
  capexPerM3Egp: number;
  capexPerM3Usd: number;
  debtAmount: number;
  equityAmount: number;
  installedCapacityM3Year: number;
  actualCapacityM3Year: number;
  unutilisedCapacityM3Year: number;
  utilisationPct: number;
  fixedCostPerM3: number;
  variableCostPerM3: number;
  electricityCostPerM3: number;
  depreciationPerM3: number;
  totalCostPerM3: number;
  lcom3: number;
  rows: YearRow[];
  projectIRR: number;
  equityIRR: number;
  equityPaybackYears: number;
  npvProject: number;
  npvEquity: number;
  minDSCR: number;
  avgDSCR: number;
  tariffEgpPerM3: number;
  tariffAllocCbeInflation: number;
  tariffAllocElectricity: number;
  tariffAllocFx: number;
  tariffAllocFixedUsd: number;
  /** Per-line contribution to PPA tariff (EGP/m³, Year 1 view) */
  tariffComposition: { name: string; group: "CAPEX" | "OPEX-Var" | "OPEX-Fixed" | "Electricity" | "SG&A" | "Financing" | "Tax" | "Margin"; value: number; pct: number }[];
}

export function runWaterModel(rawI: WaterInputs): WaterOutputs {
  const I = migrateInputs(rawI);
  const fx0 = fxAt(I, 0);

  // ── CAPEX ──
  const c = 1 + I.contingencyPct;
  const capexResolved: CapexItemResolved[] = I.capexItems.map(it => {
    const grossOwnCcy = it.amount * (1 + (it.taxPct ?? 0));
    const egp = (it.currency === "USD" ? grossOwnCcy * fx0 : grossOwnCcy) * c;
    const dy = it.depreciationYears > 0 ? it.depreciationYears : 0;
    return { ...it, amountEgp: egp, annualDepreciation: dy > 0 ? egp / dy : 0 };
  });
  const totalRoCapex = capexResolved.reduce((s, x) => s + x.amountEgp, 0);

  // ── Capacity (Year 1 reference for OPEX/m³ display only) ──
  const installedCapacityM3Year = I.capacityM3Day * 365;
  const actualCapacityM3Year = installedCapacityM3Year * minTakeAt(I, 0);
  const soldVolumeY1 = actualCapacityM3Year * (I.realizedPctOfMinTake ?? 1);
  const unutilisedCapacityM3Year = installedCapacityM3Year - actualCapacityM3Year;
  const utilisationPct = actualCapacityM3Year / installedCapacityM3Year;

  // ── Financing — IDC capitalised onto debt ──
  const constYears = I.constructionMonths / 12;
  const principalDebt = totalRoCapex * I.debtToEquity;
  const equityBucket = totalRoCapex * (1 - I.debtToEquity);
  const shlAmount = equityBucket * Math.max(0, Math.min(1, I.shareholderLoanPct));
  const equityAmount = equityBucket - shlAmount;
  const idc = principalDebt * I.debtRateYr1 * constYears * 0.596;
  const debtAmount = principalDebt + idc;
  const totalCapexWithIdc = totalRoCapex + idc;
  const capexPerM3Egp = totalCapexWithIdc / I.capacityM3Day;
  const capexPerM3Usd = capexPerM3Egp / fx0;

  // ── OPEX per m³ (steady state, Year-1 FX) ──
  const variableEgpFromUsd_y1 = I.opexVariableItems
    .filter(it => it.currency === "USD")
    .reduce((s, it) => s + it.amountPerM3 * (1 + (it.taxPct ?? 0)), 0) * fx0;
  const variableEgp_y1 = I.opexVariableItems
    .filter(it => it.currency === "EGP")
    .reduce((s, it) => s + it.amountPerM3 * (1 + (it.taxPct ?? 0)), 0);
  const wellsCost = I.wellsIncluded ? I.wellsCostEgpPerM3 : 0;
  const variableCostPerM3 = variableEgpFromUsd_y1 + variableEgp_y1 + wellsCost + I.otherVarEgpPerM3;
  const elecPriceEgp_y1 = I.electricityCurrency === "USD" ? I.electricityPriceEgpKwh * fx0 : I.electricityPriceEgpKwh;
  const electricityCostPerM3 = I.electricityIncluded ? I.electricityKwhPerM3 * elecPriceEgp_y1 : 0;

  const annualFixedEgp_y1 = I.opexFixedItems.reduce((s, it) => {
    const v = it.amountPerMonth * (it.employees ?? 1) * (1 + (it.taxPct ?? 0)) * 12;
    return s + (it.currency === "USD" ? v * fx0 : v);
  }, 0);
  const fixedCostPerM3 = soldVolumeY1 > 0 ? annualFixedEgp_y1 / soldVolumeY1 : 0;

  const sgaMonthlyOwn = I.headOfficeEgpMonth * I.headOfficeAllocPct + I.otherSgaEgpMonth;
  const annualSgaEgp_y1 = sgaMonthlyOwn * 12 * (I.sgaCurrency === "USD" ? fx0 : 1);

  // Aggregate annual depreciation from itemized capex
  const annualDepreciation = capexResolved.reduce((s, it) => s + it.annualDepreciation, 0);
  const depreciationPerM3 = soldVolumeY1 > 0 ? annualDepreciation / soldVolumeY1 : 0;
  const totalCostPerM3 = fixedCostPerM3 + electricityCostPerM3 + variableCostPerM3 + depreciationPerM3;

  // ── Maintenance reserve schedule (EGP per operating year) ──
  const mmSchedule = Array.from({ length: I.contractYears }, (_, y) => {
    const pct = at(I.mmSchedulePctOfCapex, y, I.mmAnnualPctOfCapex);
    return totalCapexWithIdc * pct;
  });

  // ── Senior debt amortisation (per-year rate, with grace + repayment mode) ──
  const tenor = I.loanTenorYears;
  const grace = Math.max(0, Math.min(tenor - 1, I.debtGraceYears));
  const amortYears = tenor - grace;
  const buildSeniorSchedule = (cfadsForSculpt?: number[]) => {
    // Pre-compute principal pattern for sculpted mode and rescale to fully amortise
    let principalsPattern: number[] | null = null;
    if (I.debtRepaymentMode === "sculpted" && cfadsForSculpt && I.targetDSCR > 0) {
      // Approximate interest using straight-line balance to size relative shape
      const slPrincipal = debtAmount / amortYears;
      let bal = debtAmount;
      const raw: number[] = [];
      for (let y = 0; y < tenor; y++) {
        const rate = debtRateAt(I, y);
        const interest = bal * rate;
        let p = 0;
        if (y >= grace) {
          const cfads = cfadsForSculpt[y] ?? 0;
          p = Math.max(0, cfads / I.targetDSCR - interest);
        }
        raw.push(p);
        bal = Math.max(0, bal - (y >= grace ? slPrincipal : 0));
      }
      const sumRaw = raw.reduce((s, v) => s + v, 0);
      const scale = sumRaw > 1e-6 ? debtAmount / sumRaw : 0;
      principalsPattern = raw.map(v => v * scale);
    }

    let outstanding = debtAmount;
    const rows: { open: number; rate: number; principal: number; interest: number; close: number }[] = [];
    for (let y = 0; y < tenor; y++) {
      const open = outstanding;
      const rate = debtRateAt(I, y);
      const interest = open * rate;
      let principal = 0;
      if (y >= grace && open > 1e-6) {
        const remainingYears = tenor - y;
        if (I.debtRepaymentMode === "equal") {
          principal = debtAmount / amortYears;
        } else if (I.debtRepaymentMode === "annuity") {
          const r = rate;
          principal = r > 0
            ? open * r / (1 - Math.pow(1 + r, -remainingYears)) - interest
            : open / remainingYears;
        } else if (principalsPattern) {
          principal = principalsPattern[y];
        } else {
          principal = debtAmount / amortYears;
        }
        principal = Math.min(principal, open);
        if (y === tenor - 1) principal = open;
      }
      const close = open - principal;
      outstanding = close;
      rows.push({ open, rate, principal, interest, close });
    }
    return rows;
  };
  let debtSchedule = buildSeniorSchedule();

  // ── Shareholder loan amortisation (annuity-style, per-year rate flat) ──
  const shlTenor = Math.max(1, I.shareholderLoanTenorYears);
  const shlGrace = Math.max(0, Math.min(shlTenor - 1, I.shareholderLoanGraceYears));
  const shlAmort = shlTenor - shlGrace;
  const buildShlSchedule = () => {
    let out = shlAmount;
    return Array.from({ length: shlTenor }, (_, y) => {
      const open = out;
      const rate = I.shareholderLoanRate;
      const interest = open * rate;
      let principal = 0;
      if (y >= shlGrace && open > 1e-6) {
        principal = shlAmount / shlAmort;
        principal = Math.min(principal, open);
        if (y === shlTenor - 1) principal = open;
      }
      const close = open - principal;
      out = close;
      return { open, rate, principal, interest, close };
    });
  };
  const shlSchedule = buildShlSchedule();
  const N = I.contractYears;

  // ── Pre-pass: compute pre-debt EBITDA / tax / CFADS by year (for sculpting) ──
  const preCfads: number[] = [];
  const preEbit: number[] = [];
  const preEbitda: number[] = [];
  for (let y = 0; y < N; y++) {
    const fx = fxAt(I, y);
    const inflRev = Math.pow(1 + inflRevAt(I, y), y);
    const inflEgp = Math.pow(1 + inflEgpAt(I, y), y);
    const inflElec = Math.pow(1 + inflElecAt(I, y), y);
    const inflUsd = Math.pow(1 + inflUsdAt(I, y), y);
    const minTake = minTakeAt(I, y);
    const installedY = capacityM3DayAt(I, y) * 365;
    const volume = installedY * minTake;
    const revenue = volume * I.sellingPriceEgpPerM3 * inflRev;
    const varUsd = I.opexVariableItems.filter(it => it.currency === "USD").reduce((s, it) => s + it.amountPerM3 * (1 + (it.taxPct ?? 0)), 0);
    const varEgp = I.opexVariableItems.filter(it => it.currency === "EGP").reduce((s, it) => s + it.amountPerM3 * (1 + (it.taxPct ?? 0)), 0);
    const variableCost = volume * (varUsd * inflUsd * fx + (varEgp + wellsCost + I.otherVarEgpPerM3) * inflEgp);
    const elecPrice = (I.electricityCurrency === "USD" ? I.electricityPriceEgpKwh * fx : I.electricityPriceEgpKwh) * inflElec;
    const electricityCost = I.electricityIncluded ? volume * I.electricityKwhPerM3 * elecPrice : 0;
    const fixedCost = I.opexFixedItems.reduce((s, it) => {
      const annual = it.amountPerMonth * (it.employees ?? 1) * (1 + (it.taxPct ?? 0)) * 12;
      return s + (it.currency === "USD" ? annual * fx * inflUsd : annual * inflEgp);
    }, 0);
    const sgaBase = sgaMonthlyOwn * 12;
    const sga = I.sgaCurrency === "USD" ? sgaBase * fx * inflUsd : sgaBase * inflEgp;
    const ebitda = revenue - fixedCost - variableCost - electricityCost - sga - mmSchedule[y];
    const dep = capexResolved.reduce((s, it) => s + (it.depreciationYears > 0 && y < it.depreciationYears ? it.annualDepreciation : 0), 0);
    const ebit = ebitda - dep;
    const tax = Math.max(0, ebit) * I.taxRate;
    preEbitda.push(ebitda); preEbit.push(ebit); preCfads.push(ebitda - tax);
  }

  // Rebuild sculpted schedule using CFADS if needed
  if (I.debtRepaymentMode === "sculpted") {
    debtSchedule = buildSeniorSchedule(preCfads);
  }

  // ── Year-by-year rows ──
  const rows: YearRow[] = [];
  let prevAR = 0;
  let cumDep = 0;
  let cash = 0;
  let retained = 0;
  let shlOutstanding = shlAmount;
  const ppeGross = totalCapexWithIdc;
  const paidInEquity = equityAmount;

  // Construction (yearIdx = -1)
  rows.push({
    year: I.startYear - 1, yearIdx: -1, fx: fx0,
    volumeM3: 0, pricePerM3: 0,
    revenue: 0, fixedCost: 0, variableCost: 0, electricityCost: 0,
    operatingCost: 0, sga: 0, ebitda: 0, depreciation: 0, ebit: 0,
    interest: 0, ebt: 0, tax: 0, netProfit: 0,
    capex: -totalCapexWithIdc, debtDraw: debtAmount + shlAmount, principalRepay: 0,
    workingCapDelta: 0,
    fcff: -totalCapexWithIdc,
    fcfe: -totalCapexWithIdc + debtAmount + shlAmount,
    debtOpening: 0, debtClosing: debtAmount, rate: 0, dscr: NaN,
    ppeGross, accumDep: 0, ppeNet: ppeGross,
    accountsReceivable: 0, cash: 0,
    totalAssets: ppeGross,
    paidInEquity, retainedEarnings: 0, totalEquity: paidInEquity,
    totalLiabAndEquity: paidInEquity + debtAmount + shlAmount,
  });

  for (let y = 0; y < N; y++) {
    const fx = fxAt(I, y);
    const inflRev = Math.pow(1 + inflRevAt(I, y), y);
    const inflEgp = Math.pow(1 + inflEgpAt(I, y), y);
    const inflElec = Math.pow(1 + inflElecAt(I, y), y);
    const inflUsd = Math.pow(1 + inflUsdAt(I, y), y);

    const minTake = minTakeAt(I, y);
    const installedY = capacityM3DayAt(I, y) * 365;
    const volume = installedY * minTake;
    const price = I.sellingPriceEgpPerM3 * inflRev;
    const revenue = volume * price;

    const varUsd = I.opexVariableItems.filter(it => it.currency === "USD")
      .reduce((s, it) => s + it.amountPerM3 * (1 + (it.taxPct ?? 0)), 0);
    const varEgp = I.opexVariableItems.filter(it => it.currency === "EGP")
      .reduce((s, it) => s + it.amountPerM3 * (1 + (it.taxPct ?? 0)), 0);
    const variableCost = volume * (varUsd * inflUsd * fx + (varEgp + wellsCost + I.otherVarEgpPerM3) * inflEgp);

    const elecPrice = (I.electricityCurrency === "USD" ? I.electricityPriceEgpKwh * fx : I.electricityPriceEgpKwh) * inflElec;
    const electricityCost = I.electricityIncluded ? volume * I.electricityKwhPerM3 * elecPrice : 0;

    const fixedCost = I.opexFixedItems.reduce((s, it) => {
      const annual = it.amountPerMonth * (it.employees ?? 1) * (1 + (it.taxPct ?? 0)) * 12;
      return s + (it.currency === "USD" ? annual * fx * inflUsd : annual * inflEgp);
    }, 0);

    const mmCost = mmSchedule[y];
    const operatingCost = fixedCost + variableCost + electricityCost + mmCost;

    const sgaBase = sgaMonthlyOwn * 12;
    const sga = I.sgaCurrency === "USD" ? sgaBase * fx * inflUsd : sgaBase * inflEgp;

    const ebitda = revenue - operatingCost - sga;

    const depreciation = capexResolved.reduce((s, it) =>
      s + (it.depreciationYears > 0 && y < it.depreciationYears ? it.annualDepreciation : 0), 0);

    const ebit = ebitda - depreciation;
    const ds = y < tenor ? debtSchedule[y] : null;
    const seniorInterest = ds ? ds.interest : 0;
    const seniorPrincipal = ds ? ds.principal : 0;
    const debtOpen = ds ? ds.open : 0;
    const debtClose = ds ? ds.close : 0;
    const rate = ds ? ds.rate : 0;
    const shl = y < shlTenor ? shlSchedule[y] : null;
    const shlInterest = shl ? shl.interest : 0;
    const shlPrincipal = shl ? shl.principal : 0;
    if (shl) shlOutstanding = shl.close;
    const interest = seniorInterest + shlInterest;
    const principalRepay = seniorPrincipal + shlPrincipal;
    const ebt = ebit - interest;
    const tax = Math.max(0, ebt) * I.taxRate;
    const netProfit = ebt - tax;

    const ar = revenue * (I.receivablesDays / 365);
    const wcDelta = -(ar - prevAR);
    prevAR = ar;

    const taxAdjUnlev = Math.max(0, ebit) * I.taxRate;
    let fcff = ebit - taxAdjUnlev + depreciation + wcDelta;
    let fcfe = netProfit + depreciation + wcDelta - principalRepay;

    // Terminal value at last operating year
    if (y === N - 1) {
      let tv = 0;
      if (I.terminalValueMode === "salvage") tv = totalCapexWithIdc * I.salvageValuePct;
      else if (I.terminalValueMode === "ebitda-multiple") tv = ebitda * I.exitEbitdaMultiple;
      else if (I.terminalValueMode === "perpetuity") {
        const g = I.terminalGrowth;
        const r = I.discountRateProject;
        if (r > g) tv = (ebitda * (1 - I.taxRate)) * (1 + g) / (r - g);
      }
      fcff += tv;
      fcfe += tv - debtClose - shlOutstanding; // repay residual debt at exit
    }

    const cfads = ebitda - tax;
    const seniorDS = seniorInterest + seniorPrincipal;
    const dscr = seniorDS > 0 ? cfads / seniorDS : NaN;

    cumDep += depreciation;
    cash += fcfe;
    retained += netProfit;

    const ppeNet = Math.max(0, ppeGross - cumDep);
    const totalAssets = ppeNet + ar + cash;
    const totalEquity = paidInEquity + retained;

    rows.push({
      year: I.startYear + y, yearIdx: y, fx,
      volumeM3: volume, pricePerM3: price,
      revenue, fixedCost, variableCost, electricityCost,
      operatingCost, sga, ebitda, depreciation, ebit,
      interest, ebt, tax, netProfit,
      capex: 0, debtDraw: 0, principalRepay,
      workingCapDelta: wcDelta, fcff, fcfe,
      debtOpening: debtOpen, debtClosing: debtClose + shlOutstanding, rate, dscr,
      ppeGross, accumDep: cumDep, ppeNet,
      accountsReceivable: ar, cash,
      totalAssets,
      paidInEquity, retainedEarnings: retained, totalEquity,
      totalLiabAndEquity: totalEquity + debtClose + shlOutstanding,
    });
  }

  const fcffArr = rows.map(r => r.fcff);
  const fcfeArr = rows.map(r => r.fcfe);
  const projectIRR = irr(fcffArr);
  const equityIRR = irr(fcfeArr);
  const npvProject = npv(I.discountRateProject, fcffArr);
  const npvEquity = npv(I.discountRateEquity, fcfeArr);

  let cum = 0; let payback = NaN;
  for (let i = 0; i < fcfeArr.length; i++) {
    const next = cum + fcfeArr[i];
    if (cum < 0 && next >= 0) { payback = i + (-cum) / fcfeArr[i]; break; }
    cum = next;
  }

  const dscrs = rows.filter(r => r.yearIdx >= 0 && isFinite(r.dscr)).map(r => r.dscr);
  const minDSCR = dscrs.length ? Math.min(...dscrs) : NaN;
  const avgDSCR = dscrs.length ? dscrs.reduce((a, b) => a + b, 0) / dscrs.length : NaN;

  const opRows = rows.filter(r => r.yearIdx >= 0);
  const costsPv = opRows.reduce((a, r, i) => a + (r.operatingCost + r.sga + r.depreciation + r.interest + r.tax) / Math.pow(1 + I.discountRateProject, i + 1), 0);
  const volsPv = opRows.reduce((a, r, i) => a + r.volumeM3 / Math.pow(1 + I.discountRateProject, i + 1), 0);
  const lcom3 = volsPv > 0 ? costsPv / volsPv : NaN;

  const tariff = I.sellingPriceEgpPerM3;
  const tariffAllocCbeInflation = (fixedCostPerM3 + depreciationPerM3) / tariff;
  const tariffAllocElectricity = electricityCostPerM3 / tariff;
  const tariffAllocFx = variableEgpFromUsd_y1 / tariff;
  const tariffAllocFixedUsd = Math.max(0, 1 - tariffAllocCbeInflation - tariffAllocElectricity - tariffAllocFx);

  // ── Per-line composition of PPA tariff (EGP/m³, Year-1 view) ──
  const y1 = rows.find(r => r.yearIdx === 0);
  const vol1 = y1?.volumeM3 || soldVolumeY1 || 1;
  const composition: { name: string; group: any; value: number; pct: number }[] = [];
  // CAPEX → annual depreciation per m³
  for (const it of capexResolved) {
    if (it.annualDepreciation > 0) composition.push({ name: `Dep: ${it.label}`, group: "CAPEX", value: it.annualDepreciation / vol1, pct: 0 });
  }
  // Variable OPEX
  for (const it of I.opexVariableItems) {
    const ownGross = it.amountPerM3 * (1 + (it.taxPct ?? 0));
    const egp = it.currency === "USD" ? ownGross * fx0 : ownGross;
    if (egp > 0) composition.push({ name: it.label, group: "OPEX-Var", value: egp, pct: 0 });
  }
  if (I.wellsIncluded && I.wellsCostEgpPerM3 > 0) composition.push({ name: "Wells (legacy)", group: "OPEX-Var", value: I.wellsCostEgpPerM3, pct: 0 });
  if (I.otherVarEgpPerM3 > 0) composition.push({ name: "Other Var (legacy)", group: "OPEX-Var", value: I.otherVarEgpPerM3, pct: 0 });
  // Electricity
  if (I.electricityIncluded) composition.push({ name: "Electricity", group: "Electricity", value: electricityCostPerM3, pct: 0 });
  // Fixed OPEX
  for (const it of I.opexFixedItems) {
    const annual = it.amountPerMonth * (it.employees ?? 1) * (1 + (it.taxPct ?? 0)) * 12 * (it.currency === "USD" ? fx0 : 1);
    if (annual > 0) composition.push({ name: it.label, group: "OPEX-Fixed", value: annual / vol1, pct: 0 });
  }
  // SG&A
  if (annualSgaEgp_y1 > 0) composition.push({ name: "SG&A / Head Office", group: "SG&A", value: annualSgaEgp_y1 / vol1, pct: 0 });
  // Financing (interest Y1)
  if (y1 && y1.interest > 0) composition.push({ name: "Interest (debt)", group: "Financing", value: y1.interest / vol1, pct: 0 });
  // Tax
  if (y1 && y1.tax > 0) composition.push({ name: "Income Tax", group: "Tax", value: y1.tax / vol1, pct: 0 });
  const sumCost = composition.reduce((s, c) => s + c.value, 0);
  const margin = Math.max(0, tariff - sumCost);
  composition.push({ name: "Equity Margin / Profit", group: "Margin", value: margin, pct: 0 });
  composition.forEach(c => c.pct = tariff > 0 ? c.value / tariff : 0);

  return {
    inputs: I,
    capexResolved,
    totalRoCapex, idc, totalCapexWithIdc, capexPerM3Egp, capexPerM3Usd,
    debtAmount, equityAmount,
    installedCapacityM3Year, actualCapacityM3Year, unutilisedCapacityM3Year, utilisationPct,
    fixedCostPerM3, variableCostPerM3, electricityCostPerM3, depreciationPerM3, totalCostPerM3,
    lcom3, rows,
    projectIRR, equityIRR, equityPaybackYears: payback,
    npvProject, npvEquity, minDSCR, avgDSCR,
    tariffEgpPerM3: tariff,
    tariffAllocCbeInflation, tariffAllocElectricity, tariffAllocFx, tariffAllocFixedUsd,
    tariffComposition: composition,
  };
}

// Sensitivity helper — recompute IRR / LCOM3 across a 1D variable
export function sensitivityIRR(
  base: WaterInputs,
  field: keyof WaterInputs,
  multipliers: number[]
): { mult: number; projectIRR: number; equityIRR: number; lcom3: number; minDSCR: number }[] {
  const baseVal = base[field] as number;
  return multipliers.map(m => {
    const inputs = { ...base, [field]: baseVal * m } as WaterInputs;
    const r = runWaterModel(inputs);
    return { mult: m, projectIRR: r.projectIRR, equityIRR: r.equityIRR, lcom3: r.lcom3, minDSCR: r.minDSCR };
  });
}
