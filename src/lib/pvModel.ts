// PV (Solar Egypt) Project Finance Model

export type Ccy = "EGP" | "USD";
export type VoltageLevel = "Extra High Voltage" | "High Voltage" | "Medium Voltage" | "Low Voltage";
export type Periodicity = "Monthly" | "Quarterly" | "Semi-Annual" | "Annual";
export type RepaymentMethod = "Equal" | "Customized" | "Annuity" | "Sculpted";
export type DepMethod = "UnitOfProduction" | "StraightLine";
export type YieldCase = "P50" | "P90";
export type TariffSource = "Government" | "Custom";

export interface PvCapexItem {
  key: string;
  label: string;
  currency: Ccy;
  units: number;
  costPerUnit: number;
  vatPct: number;
  customsPct?: number;
  usefulLife: number;
  depMethod: DepMethod;
}

export interface PvInputs {
  projectName: string;
  scenario: string;

  // Timing
  startYear: number;
  contractYears: number;
  constructionMonths: number;
  contractType: "BOO" | "BOT" | "PPA";

  // Capacity & yield
  capacityKwp: number;
  structureType: "Fixed" | "Tracker";
  yieldP50: number;
  yieldP90: number;
  yieldCase: YieldCase;
  lossYr1: number;
  lossThereafterPct: number;

  // Land
  landAreaSqm: number;
  rentEgpPerSqm: number;
  rentEnabled: boolean;

  // Tariff
  tariffSource: TariffSource;
  voltageLevel: VoltageLevel;
  voltageTariffs: Record<VoltageLevel, number>; // editable per voltage (EGP/kWh, Y1)
  govtBaseTariffEgp: number;
  govtEscalationPct: number;
  tariffEscalationPerYear: number[];
  tariffPerYear: number[];
  savingsPctPerYear: number[];

  // CAPEX
  capexItems: PvCapexItem[];
  contingencyPct: number;
  capexDrawScheduleMonthly: number[];

  // OPEX — restructured
  omPerMwUsd: number;             // Operations & Maintenance USD/MW/yr (was maintenancePerMwUsd)
  omEgpPct: number;
  omUsdPct: number;
  omVatPct: number;               // VAT applied on O&M (separately tracked)
  omInflationPerYear: number[];   // O&M inflation per year (overrides opexYoYPct when set)
  opexYoYPct: number;             // fallback escalation

  mmraPctOfRevenue: number;       // Major Maintenance Reserve Account (annual provision)
  mmraInflationPerYear: number[]; // MMRA escalation per year

  insurancePctOfCapex: number;
  insuranceInflationPerYear: number[];

  replacementDurationYears: number;
  replacementCostPctOfCapex: number;

  usufructPctOfRevenue: number;
  usufructYoYPct: number;

  // Working capital
  arDays: number;
  apDays: number;

  // Debt
  debtPct: number;
  spreadPct: number;
  loanTenorYears: number;
  paymentPeriodicity: Periodicity;
  repaymentMethod: RepaymentMethod;
  graceYears: number;
  customizedSchedule: number[];
  bankInterestPerYear: number[];
  targetDSCR: number;             // for Sculpted

  // Shareholder loan
  slEnabled: boolean;
  slPctOfEquity: number;          // share of equity raised as SL (rest is paid-in)
  slRatePct: number;
  slTenorYears: number;
  slGraceYears: number;

  // Refinancing
  refiEnabled: boolean;
  refiYear: number;               // year (1-indexed in ops) when refi happens
  refiNewRatePct: number;
  refiNewTenorYears: number;

  // Macro
  egpInflationPerYear: number[];
  usdInflationPerYear: number[];
  corridorPctPerYear: number[];
  fxEgpPerUsdPerYear: number[];

  // Tax
  taxRatePct: number;

  // Discount rates
  discountRateProject: number;
  discountRateEquity: number;
}

export const DEFAULT_PV_CAPEX: PvCapexItem[] = [
  { key: "modules",     label: "PV Modules",            currency: "USD", units: 6370,  costPerUnit: 99,    vatPct: 0.05, customsPct: 0.07, usefulLife: 25, depMethod: "UnitOfProduction" },
  { key: "inverters",   label: "Inverters (kW)",        currency: "USD", units: 44.5,  costPerUnit: 3500,  vatPct: 0.05, customsPct: 0.07, usefulLife: 25, depMethod: "StraightLine" },
  { key: "weather",     label: "Weather Station",       currency: "USD", units: 1,     costPerUnit: 3000,  vatPct: 0.05, customsPct: 0.07, usefulLife: 25, depMethod: "StraightLine" },
  { key: "bos",         label: "BOS (Balance of System)", currency: "USD", units: 6370, costPerUnit: 273,  vatPct: 0.14, customsPct: 0,    usefulLife: 25, depMethod: "StraightLine" },
  { key: "tracker",     label: "Tracker",               currency: "USD", units: 0,     costPerUnit: 80,    vatPct: 0.05, customsPct: 0.07, usefulLife: 25, depMethod: "StraightLine" },
  { key: "datalogger",  label: "Data Logger",           currency: "EGP", units: 1,     costPerUnit: 45000, vatPct: 0,    customsPct: 0,    usefulLife: 25, depMethod: "StraightLine" },
  { key: "leveling",    label: "Land Leveling",         currency: "EGP", units: 0,     costPerUnit: 0,     vatPct: 0,    customsPct: 0,    usefulLife: 25, depMethod: "StraightLine" },
];

export const GOVT_TARIFF_BY_VOLTAGE: Record<VoltageLevel, number> = {
  "Extra High Voltage": 2.296,
  "High Voltage": 2.508,
  "Medium Voltage": 2.716,
  "Low Voltage": 2.928,
};

const M = (v: number, n: number) => Array.from({ length: n }, () => v);
const linearDrawdown = (months: number) => Array.from({ length: months }, () => 1 / Math.max(1, months));

export const DEFAULT_PV_INPUTS: PvInputs = {
  projectName: "PV Egypt — Medium Voltage",
  scenario: "Base",
  startYear: 2027,
  contractYears: 25,
  constructionMonths: 12,
  contractType: "BOO",

  capacityKwp: 6370,
  structureType: "Fixed",
  yieldP50: 1887,
  yieldP90: 1884,
  yieldCase: "P50",
  lossYr1: 0,
  lossThereafterPct: 0.004,

  landAreaSqm: 0,
  rentEgpPerSqm: 0,
  rentEnabled: false,

  tariffSource: "Government",
  voltageLevel: "Medium Voltage",
  voltageTariffs: { ...GOVT_TARIFF_BY_VOLTAGE },
  govtBaseTariffEgp: 2.716,
  govtEscalationPct: 0.10,
  tariffEscalationPerYear: M(0.10, 25),
  tariffPerYear: [],
  savingsPctPerYear: M(0.20, 25),

  capexItems: DEFAULT_PV_CAPEX,
  contingencyPct: 0,
  capexDrawScheduleMonthly: linearDrawdown(12),

  omPerMwUsd: 1000,
  omEgpPct: 0,
  omUsdPct: 1,
  omVatPct: 0.14,
  omInflationPerYear: M(0.05, 25),
  opexYoYPct: 0.02,

  mmraPctOfRevenue: 0.01,
  mmraInflationPerYear: M(0.05, 25),

  insurancePctOfCapex: 0.00025,
  insuranceInflationPerYear: M(0.05, 25),

  replacementDurationYears: 7,
  replacementCostPctOfCapex: 0.03,

  usufructPctOfRevenue: 0,
  usufructYoYPct: 0,

  arDays: 30,
  apDays: 30,

  debtPct: 0.70,
  spreadPct: 0.015,
  loanTenorYears: 10,
  paymentPeriodicity: "Quarterly",
  repaymentMethod: "Customized",
  graceYears: 1,
  customizedSchedule: [0.06, 0.06, 0.10, 0.10, 0.12, 0.12, 0.135, 0.145, 0.16, 0.00],
  bankInterestPerYear: [],
  targetDSCR: 1.30,

  slEnabled: false,
  slPctOfEquity: 0.50,
  slRatePct: 0.12,
  slTenorYears: 12,
  slGraceYears: 2,

  refiEnabled: false,
  refiYear: 5,
  refiNewRatePct: 0.10,
  refiNewTenorYears: 8,

  egpInflationPerYear: [...M(0.15, 13), ...M(0.07, 12)],
  usdInflationPerYear: M(0.03, 25),
  corridorPctPerYear: [0.1525, 0.1325, 0.1125, 0.0925, ...M(0.0925, 21)],
  fxEgpPerUsdPerYear: [
    64.48, 71.99, 80.38, 89.75, 100.21, 111.88, 124.91, 139.47, 155.72, 173.86,
    194.11, 216.73, 225.14, 233.89, 242.97, 252.41, 262.21, 272.39, 282.97, 293.96,
    305.38, 317.23, 329.55, 342.35, 355.65,
  ],

  taxRatePct: 0.225,
  discountRateProject: 0.12,
  discountRateEquity: 0.18,
};

// ── Helpers ────────────────────────────────────────────────────────────────
export const fmtNum = (v: number, d = 0) =>
  isFinite(v) ? v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—";
export const fmtPct = (v: number, d = 1) => isFinite(v) ? `${(v * 100).toFixed(d)}%` : "—";
export const fmtEgp = (v: number, d = 0) => `EGP ${fmtNum(v, d)}`;

const at = (arr: number[] | undefined, y: number, fb: number): number => {
  if (!arr || arr.length === 0) return fb;
  const v = arr[Math.min(y, arr.length - 1)];
  return (v === undefined || v === null || !isFinite(v)) ? fb : v;
};
const periodsPerYear = (p: Periodicity): number =>
  p === "Monthly" ? 12 : p === "Quarterly" ? 4 : p === "Semi-Annual" ? 2 : 1;

function npv(rate: number, cf: number[]): number {
  let s = 0; for (let i = 0; i < cf.length; i++) s += cf[i] / Math.pow(1 + rate, i); return s;
}
function irr(cf: number[], guess = 0.1): number {
  let x = guess;
  for (let i = 0; i < 80; i++) {
    let f = 0, df = 0;
    for (let t = 0; t < cf.length; t++) {
      const v = Math.pow(1 + x, t); f += cf[t] / v; df -= (t * cf[t]) / (v * (1 + x));
    }
    if (Math.abs(f) < 1e-7) return x;
    if (Math.abs(df) < 1e-12) break;
    x -= f / df; if (x < -0.99) x = -0.5;
  }
  let lo = -0.99, hi = 5, flo = npv(lo, cf), fhi = npv(hi, cf);
  if (flo * fhi > 0) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2, fm = npv(mid, cf);
    if (Math.abs(fm) < 1e-7) return mid;
    if (flo * fm < 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  return (lo + hi) / 2;
}

// ── Outputs ────────────────────────────────────────────────────────────────
export interface PvYearRow {
  year: number; yearIdx: number;
  fx: number;
  capacityKwp: number;
  energyKwh: number;
  tariffEgp: number;
  revenue: number;

  // OPEX (segregated)
  om: number;
  omVat: number;
  mmra: number;
  insurance: number;
  replacement: number;
  rent: number;
  usufruct: number;
  opex: number;

  ebitda: number;
  depreciation: number;
  ebit: number;
  interest: number;
  slInterest: number;
  ebt: number;
  tax: number;
  netProfit: number;

  capex: number;
  debtDraw: number;
  principalRepay: number;
  slDraw: number;
  slPrincipalRepay: number;
  workingCapDelta: number;

  fcff: number;
  fcfe: number;
  cfads: number;

  debtOpening: number;
  debtClosing: number;
  rate: number;
  slOpening: number;
  slClosing: number;

  dscr: number;

  // Balance sheet
  ar: number;
  ap: number;
  netPPE: number;
  accumDep: number;
  cash: number;
  paidInEquity: number;
  retainedEarnings: number;
}

export interface PvOutputs {
  inputs: PvInputs;
  totalCapexEgp: number;
  hardCapexEgp: number;
  contingencyEgp: number;
  capitalisedInterestEgp: number;
  capexBreakdown: { label: string; egp: number; vatEgp: number; customsEgp: number; totalEgp: number; annualDep: number; depMethod: DepMethod }[];
  debtAmount: number;
  equityAmount: number;
  shareholderLoan: number;
  paidInEquity: number;
  rows: PvYearRow[];
  projectIRR: number;
  equityIRR: number;
  npvProject: number;
  npvEquity: number;
  minDSCR: number;
  avgDSCR: number;
  paybackYears: number;
  lcoeEgpPerKwh: number;
  tariffComposition: { name: string; group: string; value: number; pct: number }[];
}

function tariffScheduleEgp(I: PvInputs): { schedule: number[]; baseAtSigning: number } {
  const N = I.contractYears;
  const constructionYears = Math.ceil(Math.max(0, I.constructionMonths || 12) / 12);
  const escAt = (idx: number) => {
    if (!I.tariffEscalationPerYear || I.tariffEscalationPerYear.length === 0) return I.govtEscalationPct;
    return I.tariffEscalationPerYear[Math.min(idx, I.tariffEscalationPerYear.length - 1)] ?? I.govtEscalationPct;
  };
  const baseAtSigning = I.voltageTariffs?.[I.voltageLevel] ?? I.govtBaseTariffEgp;

  if (I.tariffSource === "Custom" && I.tariffPerYear && I.tariffPerYear.length > 0) {
    const schedule = Array.from({ length: N }, (_, i) => I.tariffPerYear![i] ?? I.tariffPerYear![I.tariffPerYear!.length - 1] ?? 0);
    return { schedule, baseAtSigning };
  }

  // Pre-escalate through construction period so Y1 ops tariff reflects construction inflation
  let cur = baseAtSigning;
  for (let c = 0; c < constructionYears; c++) cur *= (1 + escAt(c));

  // Build ops schedule: Y1 = post-construction price, then escalate further each ops year
  const schedule: number[] = [];
  for (let i = 0; i < N; i++) {
    schedule.push(cur);
    if (i < N - 1) cur *= (1 + escAt(constructionYears + i));
  }
  return { schedule, baseAtSigning };
}

export function runPvModel(I: PvInputs): PvOutputs {
  const N = I.contractYears;
  const fx0 = at(I.fxEgpPerUsdPerYear, 0, 50);

  // ── CAPEX ── (units for "modules" and "epc" are auto-linked to installed capacity)
  const effectiveCapexItems = I.capexItems.map(it =>
    (it.key === "modules" || it.key === "epc") ? { ...it, units: I.capacityKwp } : it
  );
  const breakdown = effectiveCapexItems.map(it => {
    const ownGross = it.units * it.costPerUnit;
    const customs = ownGross * (it.customsPct ?? 0);
    const baseAfterCustoms = ownGross + customs;
    const vat = baseAfterCustoms * (it.vatPct ?? 0);
    const total = baseAfterCustoms + vat;
    const egp = it.currency === "USD" ? total * fx0 : total;
    return {
      label: it.label,
      egp: (it.currency === "USD" ? ownGross * fx0 : ownGross),
      vatEgp: (it.currency === "USD" ? vat * fx0 : vat),
      customsEgp: (it.currency === "USD" ? customs * fx0 : customs),
      totalEgp: egp,
      annualDep: 0,
      depMethod: it.depMethod,
      _life: it.usefulLife,
    };
  });
  const hardCapexEgp = breakdown.reduce((s, b) => s + b.totalEgp, 0);
  const contingencyEgp = hardCapexEgp * I.contingencyPct;

  // ── IDC ──
  const months = Math.max(1, I.constructionMonths);
  const draw = I.capexDrawScheduleMonthly && I.capexDrawScheduleMonthly.length > 0
    ? Array.from({ length: months }, (_, i) => I.capexDrawScheduleMonthly[i] ?? 0)
    : linearDrawdown(months);
  const drawSum = draw.reduce((s, v) => s + v, 0) || 1;
  const drawNorm = draw.map(v => v / drawSum);
  // Effective rate = bank base rate + spread (corridor is removed from the model)
  const constructionAnnualRate = at(I.bankInterestPerYear, 0, 0.10) + I.spreadPct;
  const monthlyRate = Math.pow(1 + constructionAnnualRate, 1 / 12) - 1;
  const baseForDraw = hardCapexEgp + contingencyEgp;
  let cumDebt = 0;
  let idc = 0;
  for (let m = 0; m < months; m++) {
    const monthDebtDraw = baseForDraw * drawNorm[m] * I.debtPct;
    idc += cumDebt * monthlyRate + monthDebtDraw * monthlyRate * 0.5;
    cumDebt += monthDebtDraw;
  }
  const capitalisedInterestEgp = idc;
  const totalCapexEgp = hardCapexEgp + contingencyEgp + capitalisedInterestEgp;

  const capInterestRow = { label: "Capitalised Interest (IDC)", egp: capitalisedInterestEgp, vatEgp: 0, customsEgp: 0, totalEgp: capitalisedInterestEgp, annualDep: capitalisedInterestEgp / N, depMethod: "StraightLine" as DepMethod, _life: N };
  const contingencyRow = { label: "Contingency", egp: contingencyEgp, vatEgp: 0, customsEgp: 0, totalEgp: contingencyEgp, annualDep: contingencyEgp / N, depMethod: "StraightLine" as DepMethod, _life: N };
  const allCapex = [...breakdown, contingencyRow, capInterestRow];

  // ── Production ──
  const yieldBase = I.yieldCase === "P50" ? I.yieldP50 : I.yieldP90;
  const energyPerYear: number[] = [];
  for (let y = 0; y < N; y++) {
    const cumLoss = (1 - I.lossYr1) * Math.pow(1 - I.lossThereafterPct, Math.max(0, y));
    energyPerYear.push(I.capacityKwp * yieldBase * cumLoss);
  }
  const totalLifetimeEnergy = energyPerYear.reduce((s, e) => s + e, 0);

  for (const b of allCapex) {
    if (b.annualDep > 0) continue;
    if (b.depMethod === "UnitOfProduction") {
      b.annualDep = totalLifetimeEnergy > 0 ? b.totalEgp / totalLifetimeEnergy : 0;
    } else {
      b.annualDep = b._life > 0 ? b.totalEgp / b._life : 0;
    }
  }

  // ── Financing ──
  const debtAmount = totalCapexEgp * I.debtPct;
  const equityRaise = totalCapexEgp - debtAmount;
  const shareholderLoan = I.slEnabled ? equityRaise * Math.max(0, Math.min(1, I.slPctOfEquity)) : 0;
  const paidInEquity = equityRaise - shareholderLoan;

  // ── Senior debt amortisation schedule (with optional refinancing) ──
  // refiYear is 1-indexed in ops years (1 = first ops year), so it maps to ops index refiYear − 1
  const refiOpsIndex = Math.max(0, I.refiYear - 1);
  // If refi is executed, the repayment schedule can extend beyond the original tenor:
  // effective maturity = max(original tenor, refi index + new tenor)
  const effectiveDebtMaturity = I.refiEnabled
    ? Math.max(I.loanTenorYears, refiOpsIndex + Math.max(1, I.refiNewTenorYears))
    : I.loanTenorYears;
  // Effective rate = bank base rate per year + spread (corridor removed from model logic)
  const seniorRateAt = (y: number): number => {
    if (I.refiEnabled && y >= refiOpsIndex) return I.refiNewRatePct;
    return at(I.bankInterestPerYear, y, 0.10) + I.spreadPct;
  };

  // Pre-compute principal schedule (vector of length N) for non-sculpted methods.
  const { schedule: tariffSched, baseAtSigning } = tariffScheduleEgp(I);
  const capacityMw = I.capacityKwp / 1000;
  const omVatMul = 1; // VAT tracked separately

  // Cumulative inflation factor: ∏(1+rateᵢ) for i=0..y-1
  const cumulAt = (arr: number[] | undefined, y: number, fb: number): number => {
    let r = 1;
    for (let i = 0; i < y; i++) r *= (1 + at(arr, i, fb));
    return r;
  };

  // Pre-compute revenue & opex (without principal) so sculpting can see CFADS
  // prevNetPPE: opening net book value for the year — insurance is charged as % of this
  const opexFor = (y: number, prevNetPPE = totalCapexEgp) => {
    const inflEgp = cumulAt(I.egpInflationPerYear, y, 0.15);
    const inflUsd = cumulAt(I.usdInflationPerYear, y, 0.03);
    const fx = at(I.fxEgpPerUsdPerYear, y, fx0);
    const omEsc = (I.omInflationPerYear && I.omInflationPerYear.length > 0)
      ? cumulAt(I.omInflationPerYear, y, I.opexYoYPct)
      : Math.pow(1 + I.opexYoYPct, y);
    const baseUsd = I.omPerMwUsd * capacityMw;
    const om = (baseUsd * I.omEgpPct * inflEgp + baseUsd * I.omUsdPct * inflUsd) * fx * omEsc;
    const omVat = om * I.omVatPct;
    const insEsc = cumulAt(I.insuranceInflationPerYear, y, 0.05);
    const insurance = prevNetPPE * I.insurancePctOfCapex * insEsc;
    const replacement = (I.replacementDurationYears > 0 && (y + 1) % I.replacementDurationYears === 0)
      ? totalCapexEgp * I.replacementCostPctOfCapex * inflEgp : 0;
    const rentEsc = Math.pow(1 + I.usufructYoYPct, y);
    const rent = I.rentEnabled ? I.rentEgpPerSqm * I.landAreaSqm * rentEsc : 0;
    const energy = energyPerYear[y];
    const tariff = tariffSched[y];
    const savings = at(I.savingsPctPerYear, y, 0);
    const revenue = energy * tariff * (1 - savings);
    const usufruct = revenue * I.usufructPctOfRevenue * rentEsc;
    const mmraEsc = cumulAt(I.mmraInflationPerYear, y, 0.05);
    const mmra = revenue * I.mmraPctOfRevenue * mmraEsc;
    // replacement is a capex (investing) outflow — excluded from EBITDA, capitalised into PPE
    // and expensed via straight-line depreciation over the remaining project years
    const opex = om + omVat + insurance + rent + usufruct + mmra;
    return { revenue, om, omVat, insurance, replacement, rent, usufruct, mmra, opex, fx, energy, tariff };
  };

  // CFADS estimate per year for sculpting (approx tax = ebit*tax_rate)
  const principalSharePerYear: number[] = (() => {
    const tenor = I.loanTenorYears;
    const grace = Math.min(tenor - 1, Math.max(0, I.graceYears));
    const arr = new Array(N).fill(0);
    if (debtAmount <= 0) return arr;
    if (I.repaymentMethod === "Customized") {
      const sched = I.customizedSchedule.slice(0, tenor);
      const sum = sched.reduce((s, v) => s + v, 0);
      const norm = sum > 0 ? sched.map(v => v / sum) : sched;
      for (let y = 0; y < tenor; y++) arr[y] = (norm[y] ?? 0) * debtAmount;
    } else if (I.repaymentMethod === "Equal") {
      const amortYrs = tenor - grace;
      for (let y = grace; y < tenor; y++) arr[y] = debtAmount / amortYrs;
    } else if (I.repaymentMethod === "Annuity") {
      const r = seniorRateAt(grace);
      const amortYrs = tenor - grace;
      const pmt = r > 0 ? debtAmount * r / (1 - Math.pow(1 + r, -amortYrs)) : debtAmount / amortYrs;
      let bal = debtAmount;
      for (let y = grace; y < tenor; y++) {
        const interest = bal * seniorRateAt(y);
        const principal = Math.min(bal, pmt - interest);
        arr[y] = principal; bal -= principal;
      }
    } else {
      // Sculpted: principal = max(0, CFADS/target - interest), capped by balance, while tenor allows
      const totalDep = allCapex.reduce((s, b) => s + (b.depMethod === "UnitOfProduction" ? b.annualDep * energyPerYear[0] : b.annualDep), 0);
      let bal = debtAmount;
      for (let y = grace; y < tenor && bal > 0; y++) {
        const o = opexFor(y);
        const ebitda = o.revenue - o.opex;
        const dep = allCapex.reduce((s, b) => b.depMethod === "UnitOfProduction" ? s + b.annualDep * o.energy : s + (y < b._life ? b.annualDep : 0), 0);
        const ebit = ebitda - dep;
        const r = seniorRateAt(y);
        const intExp = bal * r;
        const ebt = ebit - intExp;
        const tax = Math.max(0, ebt) * I.taxRatePct;
        const cfads = ebitda - tax;
        const ds = Math.max(0, cfads / Math.max(0.01, I.targetDSCR));
        const principal = Math.max(0, Math.min(bal, ds - intExp));
        arr[y] = principal;
        bal -= principal;
      }
      // Sweep any residual into final tenor year
      if (bal > 0) arr[tenor - 1] += bal;
      void totalDep;
    }
    return arr;
  })();

  // Shareholder loan principal schedule (equal amortisation after grace)
  const slPrincipalSchedule: number[] = (() => {
    const arr = new Array(N).fill(0);
    if (shareholderLoan <= 0) return arr;
    const tenor = Math.min(N, Math.max(1, I.slTenorYears));
    const grace = Math.min(tenor - 1, Math.max(0, I.slGraceYears));
    const amortYrs = tenor - grace;
    for (let y = grace; y < tenor; y++) arr[y] = shareholderLoan / amortYrs;
    return arr;
  })();

  // ── Year-by-year ──
  const rows: PvYearRow[] = [];
  rows.push({
    year: I.startYear - 1, yearIdx: -1, fx: fx0,
    capacityKwp: I.capacityKwp, energyKwh: 0, tariffEgp: baseAtSigning, revenue: 0,
    om: 0, omVat: 0, mmra: 0, insurance: 0, replacement: 0, rent: 0, usufruct: 0, opex: 0,
    ebitda: 0, depreciation: 0, ebit: 0, interest: 0, slInterest: 0, ebt: 0, tax: 0, netProfit: 0,
    capex: -totalCapexEgp, debtDraw: debtAmount, principalRepay: 0, slDraw: shareholderLoan, slPrincipalRepay: 0,
    workingCapDelta: 0,
    fcff: -totalCapexEgp, fcfe: -paidInEquity, cfads: 0,
    debtOpening: 0, debtClosing: debtAmount, rate: constructionAnnualRate,
    slOpening: 0, slClosing: shareholderLoan,
    dscr: NaN,
    ar: 0, ap: 0, netPPE: totalCapexEgp, accumDep: 0,
    cash: 0, paidInEquity, retainedEarnings: 0,
  });

  let debtOutstanding = debtAmount;
  let slOutstanding = shareholderLoan;
  let prevAR = 0;
  let prevAP = 0;
  let cash = 0;
  let accumDep = 0;
  let retainedEarnings = 0;
  let prevNetPPEMain = totalCapexEgp; // tracks opening net PPE for insurance calculation
  let grossPPE = totalCapexEgp; // grows as replacement capex is capitalised
  const replacementDep = new Array(N).fill(0); // straight-line dep from capitalised replacements
  void periodsPerYear;

  for (let y = 0; y < N; y++) {
    const o = opexFor(y, prevNetPPEMain);
    const energy = o.energy;
    const ebitda = o.revenue - o.opex;

    // Capitalise replacement capex into gross PPE; depreciate straight-line over remaining project years
    if (o.replacement > 0) {
      grossPPE += o.replacement;
      const perYr = o.replacement / (N - y);
      for (let yy = y; yy < N; yy++) replacementDep[yy] += perYr;
    }

    const depreciation = allCapex.reduce((s, b) => {
      if (b.depMethod === "UnitOfProduction") return s + b.annualDep * energy;
      return s + (y < b._life ? b.annualDep : 0);
    }, 0) + replacementDep[y];
    const ebit = ebitda - depreciation;

    const annualRate = seniorRateAt(y);
    let principalRepay = y < effectiveDebtMaturity ? Math.min(debtOutstanding, principalSharePerYear[y] || 0) : 0;
    // Refi: at refi year (ops index refiYear − 1), refresh the schedule for remaining balance
    if (I.refiEnabled && y === refiOpsIndex) {
      const newTenor = Math.max(1, I.refiNewTenorYears);
      // distribute remaining balance over new tenor (equal)
      const perYear = debtOutstanding / newTenor;
      principalRepay = Math.min(debtOutstanding, perYear);
      // also update future schedule
      for (let yy = y + 1; yy < Math.min(N, y + newTenor); yy++) principalSharePerYear[yy] = perYear;
    }
    const avgBal = debtOutstanding - principalRepay / 2;
    const interest = Math.max(0, avgBal) * annualRate;

    // SL
    const slPrincipal = y < I.slTenorYears ? Math.min(slOutstanding, slPrincipalSchedule[y] || 0) : 0;
    const slAvgBal = slOutstanding - slPrincipal / 2;
    const slInterest = Math.max(0, slAvgBal) * I.slRatePct;

    const debtOpening = debtOutstanding;
    debtOutstanding = Math.max(0, debtOutstanding - principalRepay);
    const debtClosing = debtOutstanding;

    const slOpening = slOutstanding;
    slOutstanding = Math.max(0, slOutstanding - slPrincipal);
    const slClosing = slOutstanding;

    const ebt = ebit - interest - slInterest;
    const tax = Math.max(0, ebt) * I.taxRatePct;
    const netProfit = ebt - tax;

    const ar = o.revenue * (I.arDays / 365);
    const ap = o.opex * (I.apDays / 365);
    const wcDelta = -(ar - prevAR) + (ap - prevAP);
    prevAR = ar; prevAP = ap;

    const taxAdjUnlev = Math.max(0, ebit) * I.taxRatePct;
    // replacement is a capex cash outflow through investing activities (capitalised; P&L sees only its depreciation)
    const fcff = ebit - taxAdjUnlev + depreciation + wcDelta - o.replacement;
    const fcfe = netProfit + depreciation + wcDelta - principalRepay - slPrincipal - o.replacement;

    const cfads = ebitda - tax;
    const ds = interest + principalRepay;
    const dscr = ds > 0 ? cfads / ds : NaN;

    accumDep += depreciation;
    retainedEarnings += netProfit;
    cash = cash + fcfe; // residual to equity holders accumulates as cash
    const netPPE = Math.max(0, grossPPE - accumDep);
    prevNetPPEMain = netPPE; // closing becomes next year's opening for insurance

    rows.push({
      year: I.startYear + y, yearIdx: y, fx: o.fx,
      capacityKwp: I.capacityKwp, energyKwh: energy, tariffEgp: o.tariff, revenue: o.revenue,
      om: o.om, omVat: o.omVat, mmra: o.mmra, insurance: o.insurance, replacement: o.replacement,
      rent: o.rent, usufruct: o.usufruct, opex: o.opex,
      ebitda, depreciation, ebit, interest, slInterest, ebt, tax, netProfit,
      capex: 0, debtDraw: 0, principalRepay, slDraw: 0, slPrincipalRepay: slPrincipal,
      workingCapDelta: wcDelta, fcff, fcfe, cfads,
      debtOpening, debtClosing, rate: annualRate,
      slOpening, slClosing,
      dscr,
      ar, ap, netPPE, accumDep, cash, paidInEquity, retainedEarnings,
    });
  }

  const fcffArr = rows.map(r => r.fcff);
  const fcfeArr = rows.map(r => r.fcfe);
  const projectIRR = irr(fcffArr);
  const equityIRR = irr(fcfeArr);
  const npvProject = npv(I.discountRateProject, fcffArr);
  const npvEquity = npv(I.discountRateEquity, fcfeArr);
  const dscrs = rows.filter(r => r.yearIdx >= 0 && isFinite(r.dscr)).map(r => r.dscr);
  const minDSCR = dscrs.length ? Math.min(...dscrs) : NaN;
  const avgDSCR = dscrs.length ? dscrs.reduce((a, b) => a + b, 0) / dscrs.length : NaN;

  let cum = 0; let payback = NaN;
  for (let i = 0; i < fcfeArr.length; i++) {
    const next = cum + fcfeArr[i];
    if (cum < 0 && next >= 0) { payback = i + (-cum) / fcfeArr[i]; break; }
    cum = next;
  }

  const opRows = rows.filter(r => r.yearIdx >= 0);
  const r = I.discountRateProject;
  const pvCapex = totalCapexEgp;
  const pvCosts = opRows.reduce((s, row, i) => s + (row.opex + row.tax + row.interest) / Math.pow(1 + r, i + 1), 0);
  const pvEnergy = opRows.reduce((s, row, i) => s + row.energyKwh / Math.pow(1 + r, i + 1), 0);
  const lcoe = pvEnergy > 0 ? (pvCapex + pvCosts) / pvEnergy : NaN;

  const y1 = rows.find(rr => rr.yearIdx === 0)!;
  const tariff = y1.tariffEgp;
  const e1 = y1.energyKwh || 1;
  // Aggregate into 4 groups as % of PPA price
  const totalDep = allCapex.reduce((s, b) =>
    s + (b.depMethod === "UnitOfProduction" ? b.annualDep * y1.energyKwh : (0 < b._life ? b.annualDep : 0)), 0);
  const debtServiceY1 = y1.interest + y1.slInterest + y1.principalRepay + y1.slPrincipalRepay;
  const comp: { name: string; group: string; value: number; pct: number }[] = [
    { name: "CAPEX (Depreciation)", group: "CAPEX", value: totalDep / e1, pct: 0 },
    { name: "OPEX", group: "OPEX", value: y1.opex / e1, pct: 0 },
    { name: "Debt Service", group: "Debt Service", value: debtServiceY1 / e1, pct: 0 },
    { name: "Income Tax", group: "Tax", value: y1.tax / e1, pct: 0 },
  ].filter(c => c.value > 0);
  const sumCost = comp.reduce((s, c) => s + c.value, 0);
  comp.push({ name: "Equity Margin / Profit", group: "Margin", value: Math.max(0, tariff - sumCost), pct: 0 });
  comp.forEach(c => c.pct = tariff > 0 ? c.value / tariff : 0);

  return {
    inputs: I,
    totalCapexEgp,
    hardCapexEgp,
    contingencyEgp,
    capitalisedInterestEgp,
    capexBreakdown: allCapex.map(b => ({ label: b.label, egp: b.egp, vatEgp: b.vatEgp, customsEgp: b.customsEgp, totalEgp: b.totalEgp, annualDep: b.annualDep, depMethod: b.depMethod })),
    debtAmount, equityAmount: equityRaise, shareholderLoan, paidInEquity,
    rows,
    projectIRR, equityIRR, npvProject, npvEquity, minDSCR, avgDSCR, paybackYears: payback,
    lcoeEgpPerKwh: lcoe,
    tariffComposition: comp,
  };
}

export function pvSensitivity(base: PvInputs, field: keyof PvInputs, multipliers: number[]) {
  const baseVal = base[field] as number;
  return multipliers.map(m => {
    const inputs = { ...base, [field]: (typeof baseVal === "number" ? baseVal * m : baseVal) } as PvInputs;
    const r = runPvModel(inputs);
    return { mult: m, projectIRR: r.projectIRR, equityIRR: r.equityIRR, lcoe: r.lcoeEgpPerKwh, minDSCR: r.minDSCR };
  });
}
