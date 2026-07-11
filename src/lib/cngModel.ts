// Mobile CNG (Compressed Natural Gas) Project Finance Model
// Inspired by the user's "Mobile_CNG_Projects_Cairo3A" Excel workbook.

export type Periodicity = "Monthly" | "Quarterly" | "Semi-Annual" | "Annual";
export type RepaymentMethod = "Equal" | "Customized" | "Annuity" | "Sculpted";

export interface CngCapexItem {
  key: string;
  label: string;
  group: "Mother Station" | "Trailer" | "Daughter Station";
  units: number;
  costPerUnit: number;          // EGP per unit
  vatPct: number;
  customsPct?: number;
  usefulLife: number;
}

export interface CngInputs {
  projectName: string;
  scenario: string;

  // Timing
  startYear: number;
  contractYears: number;        // contract duration (yrs)
  developmentMonths: number;
  constructionMonths: number;

  // Volume / capacity
  dailyConsumptionM3: number;          // m3/day delivered (legacy, kept for backwards compat)
  meterM3PerHour: number;              // meter capacity in m³/hr
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  monthlyTrend: number[];              // 12 entries summing to 1
  minTakePerYear: number[];            // minimum take % per operating year (replaces rampUp)

  // Pricing
  transportSellingPriceEgp: number;    // EGP/m3 (transportation fee)
  gasCommissionEgp: number;            // EGP/m3 commission on gas
  revenueInflationPerYear: number[];   // % per year (cumulative on top of Y1)

  // Compression performance
  compressorCapacityM3hr: number;
  numCompressors: number;
  compressorPerformance: number;       // 0..1
  flowSharingFactor: number;           // 0..1
  pruCapacityM3hr?: number;            // PRU capacity in m³/hr (informational)

  // Trailers / transport
  numTrailers: number;
  trailerCapacityM3: number;
  unutilizedPctPerTruck: number;       // 0..1
  tripsPerMonth: number;
  distancePerTripKm: number;
  miscKm: number;
  averageSpeedKmh: number;
  trailerOverlapStationHr: number;
  trailerOverlapPruHr: number;

  // CAPEX (itemised)
  capexItems: CngCapexItem[];
  contingencyPct: number;
  capexDrawScheduleMonthly: number[];

  // OPEX — Mother Station
  msEngineerSalaryEgpMo: number;
  msEngineersCount: number;
  msTechnicianSalaryEgpMo: number;
  msTechniciansCount: number;
  msPruTechnicianSalaryEgpMo: number;
  msPruTechniciansCount: number;
  msPruRentEgpMo: number;
  msElectricityEgpKwh: number;
  msKwhPerM3: number;                  // electricity per m3 compressed

  // OPEX — Trailer / transport
  fixedTransportPerTripEgp: number;    // base transport cost / trip
  variableTransportPerKmEgp: number;   // EGP/km (fuel + maint)
  tireCostPerYearEgp: number;          // per trailer

  // OPEX — Daughter / other
  tollEgpMo: number;
  insuranceEgpMo: number;
  miscEgpMo: number;

  // SGA
  headOfficeEgpMo: number;
  headOfficeAllocPct: number;          // % allocation

  // Inflation
  costInflationPerYear: number[];

  // Working capital
  arDays: number;
  apDays: number;

  // Tax
  citTaxRatePct: number;
  vatTaxRatePct: number;

  // FX
  fxEgpPerUsdPerYear: number[];        // for any USD-linked items

  // Debt
  debtPct: number;
  spreadPct: number;
  loanTenorYears: number;
  paymentPeriodicity: Periodicity;
  repaymentMethod: RepaymentMethod;
  graceYears: number;
  customizedSchedule: number[];
  bankInterestPerYear: number[];       // overrides corridor + spread
  corridorPctPerYear: number[];
  targetDSCR: number;

  // Shareholder loan
  slEnabled: boolean;
  slPctOfEquity: number;
  slRatePct: number;
  slTenorYears: number;
  slGraceYears: number;

  // Refinancing
  refiEnabled: boolean;
  refiYear: number;
  refiNewRatePct: number;
  refiNewTenorYears: number;

  // Discount rates
  discountRateProject: number;
  discountRateEquity: number;
}

const M = (v: number, n: number) => Array.from({ length: n }, () => v);
const linearDrawdown = (months: number) => Array.from({ length: months }, () => 1 / Math.max(1, months));
const monthlyEqual = M(1 / 12, 12);

export const DEFAULT_CNG_CAPEX: CngCapexItem[] = [
  // Mother Station
  { key: "ms-comp",       label: "Compressors",                group: "Mother Station",  units: 1, costPerUnit: 25_000_000, vatPct: 0.14, customsPct: 0.05, usefulLife: 20 },
  { key: "ms-gas-conn",   label: "Gas Connection",             group: "Mother Station",  units: 1, costPerUnit: 5_000_000,  vatPct: 0.14, customsPct: 0,    usefulLife: 20 },
  { key: "ms-heat-exch",  label: "Heat Exchangers",            group: "Mother Station",  units: 1, costPerUnit: 2_000_000,  vatPct: 0.14, customsPct: 0,    usefulLife: 20 },
  { key: "ms-equip",      label: "Equipment & Installation",   group: "Mother Station",  units: 1, costPerUnit: 5_000_000,  vatPct: 0.14, customsPct: 0,    usefulLife: 20 },
  { key: "ms-civil",      label: "Civil & Infrastructure",     group: "Mother Station",  units: 1, costPerUnit: 3_000_000,  vatPct: 0.14, customsPct: 0,    usefulLife: 20 },
  // Trailers (per truck)
  { key: "tr-trailer",    label: "Trailer (Type I)",           group: "Trailer",         units: 3, costPerUnit: 5_103_900,  vatPct: 0.14, customsPct: 0.05, usefulLife: 20 },
  { key: "tr-chassis",    label: "Chassis",                    group: "Trailer",         units: 3, costPerUnit: 1_000_000,  vatPct: 0.14, customsPct: 0.05, usefulLife: 20 },
  { key: "tr-truck",      label: "Truck (Tractor head)",       group: "Trailer",         units: 3, costPerUnit: 2_500_000,  vatPct: 0.14, customsPct: 0.05, usefulLife: 20 },
  // Daughter Station
  { key: "ds-pru",        label: "PRU (Pressure Reduction)",   group: "Daughter Station",units: 1, costPerUnit: 4_000_000,  vatPct: 0.14, customsPct: 0.05, usefulLife: 20 },
  { key: "ds-civil",      label: "Civil Works",                group: "Daughter Station",units: 1, costPerUnit: 1_000_000,  vatPct: 0.14, customsPct: 0,    usefulLife: 20 },
  { key: "ds-network",    label: "Gas Network & Design",       group: "Daughter Station",units: 1, costPerUnit: 800_000,    vatPct: 0.14, customsPct: 0,    usefulLife: 20 },
  { key: "ds-others",     label: "Others",                     group: "Daughter Station",units: 1, costPerUnit: 500_000,    vatPct: 0.14, customsPct: 0,    usefulLife: 20 },
];

export const DEFAULT_CNG_INPUTS: CngInputs = {
  projectName: "Mobile CNG — BEBA / Cairo",
  scenario: "Base",
  startYear: 2025,
  contractYears: 10,
  developmentMonths: 0,
  constructionMonths: 12,

  dailyConsumptionM3: 11_000,
  meterM3PerHour: 458,
  operatingHoursPerDay: 24,
  operatingDaysPerYear: 365,
  monthlyTrend: monthlyEqual,
  minTakePerYear: [0.70, 0.85, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],

  transportSellingPriceEgp: 7.6,
  gasCommissionEgp: 0.5,
  revenueInflationPerYear: M(0.05, 25),

  compressorCapacityM3hr: 1200,
  numCompressors: 1,
  compressorPerformance: 1,
  flowSharingFactor: 1,
  pruCapacityM3hr: 800,

  numTrailers: 3,
  trailerCapacityM3: 6174,
  unutilizedPctPerTruck: 0.10,
  tripsPerMonth: 64,
  distancePerTripKm: 285,
  miscKm: 0,
  averageSpeedKmh: 40,
  trailerOverlapStationHr: 0.5,
  trailerOverlapPruHr: 0.5,

  capexItems: DEFAULT_CNG_CAPEX,
  contingencyPct: 0.05,
  capexDrawScheduleMonthly: linearDrawdown(12),

  msEngineerSalaryEgpMo: 25_000,
  msEngineersCount: 1,
  msTechnicianSalaryEgpMo: 12_000,
  msTechniciansCount: 3,
  msPruTechnicianSalaryEgpMo: 10_000,
  msPruTechniciansCount: 2,
  msPruRentEgpMo: 0,
  msElectricityEgpKwh: 1.5,
  msKwhPerM3: 0.30,

  fixedTransportPerTripEgp: 0,
  variableTransportPerKmEgp: 13.5,
  tireCostPerYearEgp: 50_000,

  tollEgpMo: 0,
  insuranceEgpMo: 50_000,
  miscEgpMo: 20_000,

  headOfficeEgpMo: 200_000,
  headOfficeAllocPct: 0.20,

  costInflationPerYear: M(0.10, 25),

  arDays: 30,
  apDays: 30,

  citTaxRatePct: 0.225,
  vatTaxRatePct: 0.14,

  fxEgpPerUsdPerYear: [
    49, 53, 58, 61.48, 65.17, 69.08, 73.22, 77.62, 82.27, 87.21,
    92.44, 97.99, 103.87, 110.10, 116.71, 123.71, 131.13, 139.00, 147.34, 156.18,
    165.55, 175.48, 186.01, 197.17, 209.00,
  ],

  debtPct: 0.70,
  spreadPct: 0.02,
  loanTenorYears: 6,
  paymentPeriodicity: "Quarterly",
  repaymentMethod: "Equal",
  graceYears: 1,
  customizedSchedule: [0.10, 0.15, 0.18, 0.20, 0.20, 0.17],
  bankInterestPerYear: [],
  corridorPctPerYear: [0.265, 0.245, 0.215, 0.195, 0.175, 0.175, 0.175, 0.175, 0.175, 0.175, ...M(0.150, 15)],
  targetDSCR: 1.30,

  slEnabled: false,
  slPctOfEquity: 0.5,
  slRatePct: 0.18,
  slTenorYears: 8,
  slGraceYears: 2,

  refiEnabled: false,
  refiYear: 4,
  refiNewRatePct: 0.18,
  refiNewTenorYears: 5,

  discountRateProject: 0.20,
  discountRateEquity: 0.25,
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

const cumulAt = (arr: number[] | undefined, y: number, fb: number): number => {
  let r = 1;
  for (let i = 0; i < y; i++) r *= (1 + at(arr, i, fb));
  return r;
};

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
export interface CngYearRow {
  year: number; yearIdx: number;
  fx: number;

  volumeM3: number;
  revenueTransport: number;
  revenueGasCommission: number;
  revenue: number;

  // OPEX (segregated)
  salaries: number;
  electricity: number;
  msRent: number;
  msOpex: number;
  msVat: number;        // VAT on Mother Station OPEX
  transportFixed: number;
  transportVariable: number;
  tires: number;
  trailerOpex: number;
  trailerVat: number;   // VAT on Trailer OPEX
  toll: number;
  insurance: number;
  misc: number;
  daughterOpex: number;
  headOffice: number;
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

  ar: number; ap: number; netPPE: number; accumDep: number;
  cash: number; paidInEquity: number; retainedEarnings: number;
}

export interface CngOutputs {
  inputs: CngInputs;
  totalCapexEgp: number;
  hardCapexEgp: number;
  contingencyEgp: number;
  capitalisedInterestEgp: number;
  capexBreakdown: { label: string; group: string; egp: number; vatEgp: number; customsEgp: number; totalEgp: number; annualDep: number }[];
  capexByGroup: { group: string; total: number }[];
  debtAmount: number;
  equityAmount: number;
  shareholderLoan: number;
  paidInEquity: number;
  rows: CngYearRow[];

  // Operational headlines
  designedMonthlyVolumeM3: number;
  trailerTripsPerMonth: number;
  utilizationPct: number;

  // Financial KPIs
  projectIRR: number;
  equityIRR: number;
  npvProject: number;
  npvEquity: number;
  minDSCR: number;
  avgDSCR: number;
  paybackYears: number;
  lcomEgpPerM3: number;        // levelised cost of (delivered) m3
  composition: { name: string; group: string; value: number; pct: number }[];
}

export function runCngModel(I: CngInputs): CngOutputs {
  const N = I.contractYears;
  const fx0 = at(I.fxEgpPerUsdPerYear, 0, 50);

  // ── CAPEX ──
  const breakdown = I.capexItems.map(it => {
    const ownGross = it.units * it.costPerUnit;
    const customs = ownGross * (it.customsPct ?? 0);
    const baseAfterCustoms = ownGross + customs;
    const vat = baseAfterCustoms * (it.vatPct ?? 0);
    const total = baseAfterCustoms + vat;
    return {
      label: it.label,
      group: it.group,
      egp: ownGross,
      vatEgp: vat,
      customsEgp: customs,
      totalEgp: total,
      annualDep: it.usefulLife > 0 ? total / it.usefulLife : 0,
      _life: it.usefulLife,
    };
  });
  const hardCapexEgp = breakdown.reduce((s, b) => s + b.totalEgp, 0);
  const contingencyEgp = hardCapexEgp * I.contingencyPct;

  // IDC
  const months = Math.max(1, I.constructionMonths);
  const draw = I.capexDrawScheduleMonthly && I.capexDrawScheduleMonthly.length > 0
    ? Array.from({ length: months }, (_, i) => I.capexDrawScheduleMonthly[i] ?? 0)
    : linearDrawdown(months);
  const drawSum = draw.reduce((s, v) => s + v, 0) || 1;
  const drawNorm = draw.map(v => v / drawSum);
  const constructionAnnualRate = (I.bankInterestPerYear && I.bankInterestPerYear.length > 0)
    ? I.bankInterestPerYear[0]
    : at(I.corridorPctPerYear, 0, 0.20) + I.spreadPct;
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

  const contingencyRow = { label: "Contingency", group: "Other", egp: contingencyEgp, vatEgp: 0, customsEgp: 0, totalEgp: contingencyEgp, annualDep: contingencyEgp / N, _life: N };
  const idcRow = { label: "Capitalised Interest (IDC)", group: "Other", egp: capitalisedInterestEgp, vatEgp: 0, customsEgp: 0, totalEgp: capitalisedInterestEgp, annualDep: capitalisedInterestEgp / N, _life: N };
  const allCapex = [...breakdown, contingencyRow, idcRow];

  // ── Capacities & operational ratios ──
  const dailyM3 = I.meterM3PerHour * I.operatingHoursPerDay;
  const compressorDailyM3 = (I.compressorCapacityM3hr || 0) * (I.numCompressors || 1) * (I.compressorPerformance || 1) * (I.flowSharingFactor || 1) * (I.operatingHoursPerDay || 24);
  const effectiveDailyM3 = compressorDailyM3 > 0 ? Math.min(dailyM3, compressorDailyM3) : dailyM3;
  const designedAnnualM3 = effectiveDailyM3 * I.operatingDaysPerYear;
  const designedMonthlyM3 = designedAnnualM3 / 12;
  // trips per month required
  const effectiveTrailerPayload = I.trailerCapacityM3 * (1 - I.unutilizedPctPerTruck);
  const tripsRequiredMonth = effectiveTrailerPayload > 0 ? designedMonthlyM3 / effectiveTrailerPayload : 0;
  const tripsAvailableMonth = I.tripsPerMonth * I.numTrailers;
  const utilizationPct = tripsAvailableMonth > 0 ? Math.min(1, tripsRequiredMonth / tripsAvailableMonth) : 0;

  // ── Financing ──
  const debtAmount = totalCapexEgp * I.debtPct;
  const equityRaise = totalCapexEgp - debtAmount;
  const shareholderLoan = I.slEnabled ? equityRaise * Math.max(0, Math.min(1, I.slPctOfEquity)) : 0;
  const paidInEquity = equityRaise - shareholderLoan;

  const seniorRateAt = (y: number): number => {
    if (I.refiEnabled && y >= Math.max(1, I.refiYear)) return I.refiNewRatePct;
    if (I.bankInterestPerYear && I.bankInterestPerYear.length > 0)
      return at(I.bankInterestPerYear, y, at(I.corridorPctPerYear, y, 0.20) + I.spreadPct);
    return at(I.corridorPctPerYear, y, 0.20) + I.spreadPct;
  };

  // Pre-compute revenue & opex per year (for sculpting)
  const revOpex = (y: number) => {
    const fx = at(I.fxEgpPerUsdPerYear, y, fx0);
    const inflRev = cumulAt(I.revenueInflationPerYear, y, 0.05);
    const inflCost = cumulAt(I.costInflationPerYear, y, 0.10);

    const minTake = (I.minTakePerYear && I.minTakePerYear.length > 0)
      ? (I.minTakePerYear[Math.min(y, I.minTakePerYear.length - 1)] ?? 1.0)
      : (y === 0 ? 0.70 : 1.0);
    const rampMul = minTake;
    const volume = designedAnnualM3 * rampMul;

    const revenueTransport = volume * I.transportSellingPriceEgp * inflRev;
    const revenueGasCommission = volume * I.gasCommissionEgp * inflRev;
    const revenue = revenueTransport + revenueGasCommission;

    // Salaries
    const salaries =
      (I.msEngineerSalaryEgpMo * I.msEngineersCount +
       I.msTechnicianSalaryEgpMo * I.msTechniciansCount +
       I.msPruTechnicianSalaryEgpMo * I.msPruTechniciansCount) * 12 * inflCost;

    const electricity = volume * I.msKwhPerM3 * I.msElectricityEgpKwh * inflCost;
    const msRent = I.msPruRentEgpMo * 12 * inflCost;
    const msOpex = salaries + electricity + msRent;
    const msVat = msOpex * I.vatTaxRatePct;

    // Trailer / transport — based on actual trips done
    const tripsThisYear = tripsRequiredMonth * 12 * rampMul;
    const kmPerTrip = I.distancePerTripKm * 2 + I.miscKm; // round trip
    const transportFixed = tripsThisYear * I.fixedTransportPerTripEgp * inflCost;
    const transportVariable = tripsThisYear * kmPerTrip * I.variableTransportPerKmEgp * inflCost;
    const tires = I.tireCostPerYearEgp * I.numTrailers * inflCost;
    const trailerOpex = transportFixed + transportVariable + tires;
    const trailerVat = trailerOpex * I.vatTaxRatePct;

    const toll = I.tollEgpMo * 12 * inflCost;
    const insurance = I.insuranceEgpMo * 12 * inflCost;
    const misc = I.miscEgpMo * 12 * inflCost;
    const daughterOpex = toll + insurance + misc;

    const headOffice = I.headOfficeEgpMo * 12 * I.headOfficeAllocPct * inflCost;
    const opex = msOpex + msVat + trailerOpex + trailerVat + daughterOpex + headOffice;

    return {
      fx, volume, revenueTransport, revenueGasCommission, revenue,
      salaries, electricity, msRent, msOpex, msVat,
      transportFixed, transportVariable, tires, trailerOpex, trailerVat,
      toll, insurance, misc, daughterOpex, headOffice, opex,
    };
  };

  // Pre-compute principal schedule
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
      if (bal > 0) arr[tenor - 1] += bal;
    } else {
      // Sculpted
      let bal = debtAmount;
      for (let y = grace; y < tenor && bal > 0; y++) {
        const o = revOpex(y);
        const ebitda = o.revenue - o.opex;
        const dep = allCapex.reduce((s, b) => s + (y < b._life ? b.annualDep : 0), 0);
        const ebit = ebitda - dep;
        const r = seniorRateAt(y);
        const intExp = bal * r;
        const ebt = ebit - intExp;
        const tax = Math.max(0, ebt) * I.citTaxRatePct;
        const cfads = ebitda - tax;
        const ds = Math.max(0, cfads / Math.max(0.01, I.targetDSCR));
        const principal = Math.max(0, Math.min(bal, ds - intExp));
        arr[y] = principal;
        bal -= principal;
      }
      if (bal > 0) arr[tenor - 1] += bal;
    }
    return arr;
  })();

  // SL principal (equal after grace)
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
  const rows: CngYearRow[] = [];
  rows.push({
    year: I.startYear - 1, yearIdx: -1, fx: fx0,
    volumeM3: 0, revenueTransport: 0, revenueGasCommission: 0, revenue: 0,
    salaries: 0, electricity: 0, msRent: 0, msOpex: 0, msVat: 0,
    transportFixed: 0, transportVariable: 0, tires: 0, trailerOpex: 0, trailerVat: 0,
    toll: 0, insurance: 0, misc: 0, daughterOpex: 0, headOffice: 0, opex: 0,
    ebitda: 0, depreciation: 0, ebit: 0, interest: 0, slInterest: 0,
    ebt: 0, tax: 0, netProfit: 0,
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
  let prevAR = 0, prevAP = 0;
  let cash = 0, accumDep = 0, retainedEarnings = 0;
  let taxLossPool = 0; // cumulative tax-loss carryforward (NOL)

  for (let y = 0; y < N; y++) {
    const o = revOpex(y);

    const ebitda = o.revenue - o.opex;
    const depreciation = allCapex.reduce((s, b) => s + (y < b._life ? b.annualDep : 0), 0);
    const ebit = ebitda - depreciation;

    const annualRate = seniorRateAt(y);
    const refiOpsYear = Math.max(1, I.refiYear);
    const repayHorizon = I.refiEnabled
      ? Math.max(I.loanTenorYears, refiOpsYear + Math.max(1, I.refiNewTenorYears))
      : I.loanTenorYears;
    let principalRepay = y < repayHorizon ? Math.min(debtOutstanding, principalSharePerYear[y] || 0) : 0;
    if (I.refiEnabled && y === refiOpsYear) {
      const newTenor = Math.max(1, I.refiNewTenorYears);
      const perYear = debtOutstanding / newTenor;
      principalRepay = Math.min(debtOutstanding, perYear);
      for (let yy = y + 1; yy < Math.min(N, y + newTenor); yy++) principalSharePerYear[yy] = perYear;
      if (y + newTenor > N) principalSharePerYear[N - 1] += perYear * (y + newTenor - N);
    }
    const avgBal = debtOutstanding - principalRepay / 2;
    const interest = Math.max(0, avgBal) * annualRate;

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
    // Tax-loss carryforward: losses accumulate in a pool and offset future taxable income
    const nolOffset = Math.min(taxLossPool, Math.max(0, ebt));
    const tax = (Math.max(0, ebt) - nolOffset) * I.citTaxRatePct;
    taxLossPool += Math.max(0, -ebt) - nolOffset;
    const netProfit = ebt - tax;

    const ar = o.revenue * (I.arDays / 365);
    const ap = o.opex * (I.apDays / 365);
    const wcDelta = -(ar - prevAR) + (ap - prevAP);
    prevAR = ar; prevAP = ap;

    const taxAdjUnlev = Math.max(0, ebit) * I.citTaxRatePct;
    const fcff = ebit - taxAdjUnlev + depreciation + wcDelta;
    const fcfe = netProfit + depreciation + wcDelta - principalRepay - slPrincipal;

    const cfads = ebitda - tax;
    const ds = interest + principalRepay;
    const dscr = ds > 0 ? cfads / ds : NaN;

    accumDep += depreciation;
    retainedEarnings += netProfit;
    cash = cash + fcfe;
    const netPPE = Math.max(0, totalCapexEgp - accumDep);

    rows.push({
      year: I.startYear + y, yearIdx: y, fx: o.fx,
      volumeM3: o.volume,
      revenueTransport: o.revenueTransport,
      revenueGasCommission: o.revenueGasCommission,
      revenue: o.revenue,
      salaries: o.salaries, electricity: o.electricity, msRent: o.msRent, msOpex: o.msOpex, msVat: o.msVat,
      transportFixed: o.transportFixed, transportVariable: o.transportVariable, tires: o.tires, trailerOpex: o.trailerOpex, trailerVat: o.trailerVat,
      toll: o.toll, insurance: o.insurance, misc: o.misc, daughterOpex: o.daughterOpex,
      headOffice: o.headOffice, opex: o.opex,
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

  // LCOM (EGP per m3)
  const opRows = rows.filter(r => r.yearIdx >= 0);
  const r = I.discountRateProject;
  const pvCapex = totalCapexEgp;
  const pvCosts = opRows.reduce((s, row, i) => s + (row.opex + row.tax + row.interest) / Math.pow(1 + r, i + 1), 0);
  const pvVol = opRows.reduce((s, row, i) => s + row.volumeM3 / Math.pow(1 + r, i + 1), 0);
  const lcom = pvVol > 0 ? (pvCapex + pvCosts) / pvVol : NaN;

  // Cost composition (Y1) per m3
  const y1 = rows.find(rr => rr.yearIdx === 0)!;
  const v1 = y1.volumeM3 || 1;
  const y1Price = y1.revenue / v1;
  const comp: { name: string; group: string; value: number; pct: number }[] = [];
  if (y1.salaries > 0) comp.push({ name: "Salaries (Mother station)", group: "OPEX", value: y1.salaries / v1, pct: 0 });
  if (y1.electricity > 0) comp.push({ name: "Electricity (compression)", group: "OPEX", value: y1.electricity / v1, pct: 0 });
  if (y1.msRent > 0) comp.push({ name: "Mother station rent", group: "OPEX", value: y1.msRent / v1, pct: 0 });
  if (y1.transportVariable > 0) comp.push({ name: "Transport (variable, fuel/maint)", group: "Transport", value: y1.transportVariable / v1, pct: 0 });
  if (y1.transportFixed > 0) comp.push({ name: "Transport (fixed per trip)", group: "Transport", value: y1.transportFixed / v1, pct: 0 });
  if (y1.tires > 0) comp.push({ name: "Tires", group: "Transport", value: y1.tires / v1, pct: 0 });
  if (y1.toll > 0) comp.push({ name: "Toll", group: "Daughter", value: y1.toll / v1, pct: 0 });
  if (y1.insurance > 0) comp.push({ name: "Insurance", group: "Daughter", value: y1.insurance / v1, pct: 0 });
  if (y1.misc > 0) comp.push({ name: "Misc.", group: "Daughter", value: y1.misc / v1, pct: 0 });
  if (y1.headOffice > 0) comp.push({ name: "Head office allocation", group: "SGA", value: y1.headOffice / v1, pct: 0 });
  if (y1.depreciation > 0) comp.push({ name: "Depreciation", group: "CAPEX", value: y1.depreciation / v1, pct: 0 });
  if (y1.interest > 0) comp.push({ name: "Senior interest", group: "Financing", value: y1.interest / v1, pct: 0 });
  if (y1.slInterest > 0) comp.push({ name: "SL interest", group: "Financing", value: y1.slInterest / v1, pct: 0 });
  if (y1.tax > 0) comp.push({ name: "Income tax", group: "Tax", value: y1.tax / v1, pct: 0 });
  const sumCost = comp.reduce((s, c) => s + c.value, 0);
  comp.push({ name: "Equity margin / profit", group: "Margin", value: Math.max(0, y1Price - sumCost), pct: 0 });
  comp.forEach(c => c.pct = y1Price > 0 ? c.value / y1Price : 0);

  // CAPEX by group
  const groups = ["Mother Station", "Trailer", "Daughter Station", "Other"];
  const capexByGroup = groups.map(g => ({ group: g, total: allCapex.filter(b => b.group === g).reduce((s, b) => s + b.totalEgp, 0) }))
    .filter(x => x.total > 0);

  return {
    inputs: I,
    totalCapexEgp,
    hardCapexEgp,
    contingencyEgp,
    capitalisedInterestEgp,
    capexBreakdown: allCapex.map(b => ({ label: b.label, group: b.group, egp: b.egp, vatEgp: b.vatEgp, customsEgp: b.customsEgp, totalEgp: b.totalEgp, annualDep: b.annualDep })),
    capexByGroup,
    debtAmount,
    equityAmount: equityRaise,
    shareholderLoan,
    paidInEquity,
    rows,

    designedMonthlyVolumeM3: designedMonthlyM3,
    trailerTripsPerMonth: tripsRequiredMonth,
    utilizationPct,

    projectIRR, equityIRR, npvProject, npvEquity, minDSCR, avgDSCR,
    paybackYears: payback,
    lcomEgpPerM3: lcom,
    composition: comp,
  };
}
