// PV (Solar Egypt) Project Finance Model
// Drivers based on the Assumptions sheet of PV_Egypt.xlsx

export type Ccy = "EGP" | "USD";
export type VoltageLevel = "Extra High Voltage" | "High Voltage" | "Medium Voltage" | "Low Voltage";
export type Periodicity = "Monthly" | "Quarterly" | "Semi-Annual" | "Annual";
export type RepaymentMethod = "Equal" | "Customized" | "Annuity";
export type DepMethod = "UnitOfProduction" | "StraightLine";
export type YieldCase = "P50" | "P90";

export interface PvCapexItem {
  key: string;
  label: string;
  currency: Ccy;
  units: number;            // capacity-driven or count
  costPerUnit: number;      // pre-VAT, in own currency
  vatPct: number;           // e.g. 0.05 (general), 0.14 (BOS), 0 (capitalised interest)
  customsPct?: number;      // e.g. 0.07 for imported equipment
  usefulLife: number;       // years for SL; for UoP we use generator total life
  depMethod: DepMethod;
}

export interface PvInputs {
  projectName: string;
  scenario: string;

  // Timing
  startYear: number;            // first operating year
  contractYears: number;        // forecast horizon (Excel: 25)
  constructionMonths: number;
  contractType: "BOO" | "BOT" | "PPA";

  // Capacity & yield
  capacityKwp: number;          // kWp
  structureType: "Fixed" | "Tracker";
  yieldP50: number;             // kWh/kWp/yr
  yieldP90: number;
  yieldCase: YieldCase;
  lossYr1: number;              // % loss applied in year 1 (e.g. 0.00)
  lossThereafterPct: number;    // annual degradation thereafter (e.g. 0.004)

  // Tariff
  govtTariffEnabled: boolean;
  voltageLevel: VoltageLevel;
  govtTariffEgp: number;        // base EGP/kWh from voltage tariff (Y1)
  separateTariffEgp: number;    // alternate flat tariff
  govtEscalationPct: number;    // e.g. 0.10 (then 0.06 thereafter — simplified scalar)
  separateEscalationPct: number;
  savingsPctYr1: number;        // e.g. 0.20
  savingsPctThereafter: number; // e.g. 0.20

  // OPEX
  maintenanceUsd: number;       // annual O&M base (negative is cost — store positive cost)
  maintenanceEgpPct: number;    // share in EGP (0..1)
  maintenanceUsdPct: number;    // share in USD (0..1)
  opexYoYPct: number;           // additional yearly real escalation
  insurancePctOfCapex: number;  // e.g. 0.00025 → tiny? In Excel 0.00025
  replacementDurationYears: number; // every N years
  replacementCostPctOfCapex: number; // % of total capex per replacement event
  rentEnabled: boolean;
  rentEgpPerSqm: number;
  landAreaSqm: number;
  usufructPctOfRevenue: number; // % of revenue paid as usufruct
  usufructYoYPct: number;

  // Working capital
  arDays: number;
  apDays: number;

  // Debt
  debtPct: number;              // 0..1
  spreadPct: number;            // bank spread on top of corridor (annual)
  loanTenorYears: number;
  paymentPeriodicity: Periodicity;
  repaymentMethod: RepaymentMethod;
  graceYears: number;
  customizedSchedule: number[]; // length = loanTenorYears, sums to 1.0

  // Macro per year (length = contractYears, indexed Y1..Yn)
  egpInflationPerYear: number[];
  usdInflationPerYear: number[];
  corridorPctPerYear: number[];   // base rate (CBE corridor); debt rate = corridor + spread
  fxEgpPerUsdPerYear: number[];

  // Voltage tariff price per year per tier (Y1..Yn) — overrides for revenue
  tariffPricePerYearByVoltage?: Partial<Record<VoltageLevel, number[]>>;

  // CAPEX itemised
  capexItems: PvCapexItem[];
  contingencyPct: number;
  capitalisedInterestEgp: number; // separate, treated as capex line w/ zero VAT

  // Tax
  taxRatePct: number;             // e.g. 0.225
  vatStandardPct: number;         // 0.05
  vatBosPct: number;              // 0.14
  customsPctDefault: number;      // 0.07

  // Discount rates
  discountRateProject: number;    // for NPV firm / LCOE
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

const M = (v: number, n: number) => Array.from({ length: n }, () => v);

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

  govtTariffEnabled: true,
  voltageLevel: "Medium Voltage",
  govtTariffEgp: 2.716,
  separateTariffEgp: 0,
  govtEscalationPct: 0.10,
  separateEscalationPct: 0,
  savingsPctYr1: 0.20,
  savingsPctThereafter: 0.20,

  maintenanceUsd: 6000,
  maintenanceEgpPct: 0,
  maintenanceUsdPct: 1,
  opexYoYPct: 0.02,
  insurancePctOfCapex: 0.00025,
  replacementDurationYears: 7,
  replacementCostPctOfCapex: 0.03,
  rentEnabled: false,
  rentEgpPerSqm: 0,
  landAreaSqm: 0,
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

  // 25-year arrays — simplified to match Excel scalars (15% Y1-15, 7% thereafter; USD 3% throughout)
  egpInflationPerYear: [...M(0.15, 13), ...M(0.07, 12)],
  usdInflationPerYear: M(0.03, 25),
  corridorPctPerYear:  [0.1525, 0.1325, 0.1125, 0.0925, ...M(0.0925, 21)],
  fxEgpPerUsdPerYear:  [
    64.48, 71.99, 80.38, 89.75, 100.21, 111.88, 124.91, 139.47, 155.72, 173.86,
    194.11, 216.73, 225.14, 233.89, 242.97, 252.41, 262.21, 272.39, 282.97, 293.96,
    305.38, 317.23, 329.55, 342.35, 355.65,
  ],

  capexItems: DEFAULT_PV_CAPEX,
  contingencyPct: 0,
  capitalisedInterestEgp: 13_963_792,

  taxRatePct: 0.225,
  vatStandardPct: 0.05,
  vatBosPct: 0.14,
  customsPctDefault: 0.07,

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
  maintenance: number;
  insurance: number;
  replacement: number;
  rent: number;
  usufruct: number;
  opex: number;
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
}

export interface PvOutputs {
  inputs: PvInputs;
  totalCapexEgp: number;
  capexBreakdown: { label: string; egp: number; vatEgp: number; customsEgp: number; totalEgp: number; annualDep: number; depMethod: DepMethod }[];
  debtAmount: number;
  equityAmount: number;
  rows: PvYearRow[];
  projectIRR: number;
  equityIRR: number;
  npvProject: number;
  npvEquity: number;
  minDSCR: number;
  avgDSCR: number;
  paybackYears: number;
  lcoeEgpPerKwh: number;
  // PPA / tariff composition (per kWh, Year 1)
  tariffComposition: { name: string; group: string; value: number; pct: number }[];
}

function getTariffEgp(I: PvInputs, y: number): number {
  if (!I.govtTariffEnabled) return I.separateTariffEgp * Math.pow(1 + I.separateEscalationPct, y);
  const overrides = I.tariffPricePerYearByVoltage?.[I.voltageLevel];
  if (overrides && overrides[y] !== undefined) return overrides[y];
  return I.govtTariffEgp * Math.pow(1 + I.govtEscalationPct, y);
}

export function runPvModel(I: PvInputs): PvOutputs {
  const N = I.contractYears;
  const fx0 = at(I.fxEgpPerUsdPerYear, 0, 50);

  // ── CAPEX ──
  const breakdown = I.capexItems.map(it => {
    const ownGross = it.units * it.costPerUnit;            // pre-VAT, pre-customs
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
      annualDep: 0,        // resolved below per dep method
      depMethod: it.depMethod,
      _life: it.usefulLife,
    };
  });
  const capCore = breakdown.reduce((s, b) => s + b.totalEgp, 0);
  const contingencyEgp = capCore * I.contingencyPct;
  const totalCapexEgp = capCore + contingencyEgp + I.capitalisedInterestEgp;

  // Capitalised interest is depreciated SL over forecast horizon, contingency allocated to SL.
  const capInterestRow = { label: "Capitalised Interest", egp: I.capitalisedInterestEgp, vatEgp: 0, customsEgp: 0, totalEgp: I.capitalisedInterestEgp, annualDep: I.capitalisedInterestEgp / N, depMethod: "StraightLine" as DepMethod, _life: N };
  const contingencyRow = { label: "Contingency", egp: contingencyEgp, vatEgp: 0, customsEgp: 0, totalEgp: contingencyEgp, annualDep: contingencyEgp / N, depMethod: "StraightLine" as DepMethod, _life: N };
  const allCapex = [...breakdown, contingencyRow, capInterestRow];

  // ── Production schedule (with degradation) ──
  const yieldBase = I.yieldCase === "P50" ? I.yieldP50 : I.yieldP90;
  const energyPerYear: number[] = [];
  for (let y = 0; y < N; y++) {
    const cumLoss = (1 - I.lossYr1) * Math.pow(1 - I.lossThereafterPct, Math.max(0, y));
    energyPerYear.push(I.capacityKwp * yieldBase * cumLoss);
  }
  const totalLifetimeEnergy = energyPerYear.reduce((s, e) => s + e, 0);

  // Resolve depreciation per item now that we know lifetime energy (for UoP)
  for (const b of allCapex) {
    if (b.annualDep > 0) continue; // already set (cont/capint)
    if (b.depMethod === "UnitOfProduction") {
      // depreciation per kWh = totalEgp / totalLifetimeEnergy; multiplied by year energy each year
      b.annualDep = totalLifetimeEnergy > 0 ? b.totalEgp / totalLifetimeEnergy : 0; // here this is per-kWh rate
    } else {
      b.annualDep = b._life > 0 ? b.totalEgp / b._life : 0;
    }
  }

  // ── Financing ──
  const debtAmount = totalCapexEgp * I.debtPct;
  const equityAmount = totalCapexEgp - debtAmount;

  // Customised vs equal schedule (annual % of original principal)
  const principalSharePerYear: number[] = (() => {
    const tenor = I.loanTenorYears;
    const grace = Math.min(tenor - 1, Math.max(0, I.graceYears));
    const arr = new Array(N).fill(0);
    if (debtAmount <= 0) return arr;
    if (I.repaymentMethod === "Customized") {
      // honour user array (length = tenor); first `grace` years should be 0 typically
      const sched = I.customizedSchedule.slice(0, tenor);
      const sum = sched.reduce((s, v) => s + v, 0);
      const norm = sum > 0 ? sched.map(v => v / sum) : sched;
      for (let y = 0; y < tenor; y++) arr[y] = (norm[y] ?? 0) * debtAmount;
    } else if (I.repaymentMethod === "Equal") {
      const amortYrs = tenor - grace;
      for (let y = grace; y < tenor; y++) arr[y] = debtAmount / amortYrs;
    } else {
      // Annuity using Y1 rate (approx — annualised)
      const r = at(I.corridorPctPerYear, 0, 0.10) + I.spreadPct;
      const amortYrs = tenor - grace;
      const pmt = r > 0 ? debtAmount * r / (1 - Math.pow(1 + r, -amortYrs)) : debtAmount / amortYrs;
      let bal = debtAmount;
      for (let y = grace; y < tenor; y++) {
        const interest = bal * r;
        const principal = Math.min(bal, pmt - interest);
        arr[y] = principal; bal -= principal;
      }
    }
    return arr;
  })();

  // ── Year-by-year ──
  const rows: PvYearRow[] = [];
  // Construction year (idx -1)
  rows.push({
    year: I.startYear - 1, yearIdx: -1, fx: fx0,
    capacityKwp: I.capacityKwp, energyKwh: 0, tariffEgp: 0, revenue: 0,
    maintenance: 0, insurance: 0, replacement: 0, rent: 0, usufruct: 0, opex: 0,
    ebitda: 0, depreciation: 0, ebit: 0, interest: 0, ebt: 0, tax: 0, netProfit: 0,
    capex: -totalCapexEgp, debtDraw: debtAmount, principalRepay: 0, workingCapDelta: 0,
    fcff: -totalCapexEgp, fcfe: -totalCapexEgp + debtAmount,
    debtOpening: 0, debtClosing: debtAmount, rate: 0, dscr: NaN,
  });

  let debtOutstanding = debtAmount;
  let prevAR = 0;
  const ppy = periodsPerYear(I.paymentPeriodicity);

  for (let y = 0; y < N; y++) {
    const fx = at(I.fxEgpPerUsdPerYear, y, fx0);
    const inflEgp = Math.pow(1 + at(I.egpInflationPerYear, y, 0.15), y);
    const inflUsd = Math.pow(1 + at(I.usdInflationPerYear, y, 0.03), y);

    const energy = energyPerYear[y];
    const tariff = getTariffEgp(I, y);
    const revenue = energy * tariff;

    // OPEX
    const escEsc = Math.pow(1 + I.opexYoYPct, y);
    const maintEgp = I.maintenanceUsd * I.maintenanceEgpPct * inflEgp * escEsc;
    const maintUsdEgp = I.maintenanceUsd * I.maintenanceUsdPct * inflUsd * escEsc * fx;
    const maintenance = maintEgp + maintUsdEgp;
    const insurance = totalCapexEgp * I.insurancePctOfCapex * inflEgp;
    const replacement = (I.replacementDurationYears > 0 && (y + 1) % I.replacementDurationYears === 0)
      ? totalCapexEgp * I.replacementCostPctOfCapex * inflEgp : 0;
    const rent = I.rentEnabled ? I.rentEgpPerSqm * I.landAreaSqm * Math.pow(1 + I.usufructYoYPct, y) : 0;
    const usufruct = revenue * I.usufructPctOfRevenue * Math.pow(1 + I.usufructYoYPct, y);
    const opex = maintenance + insurance + replacement + rent + usufruct;

    const ebitda = revenue - opex;

    // Depreciation: UoP items use per-kWh rate × energy, others use annual SL up to life
    const depreciation = allCapex.reduce((s, b) => {
      if (b.depMethod === "UnitOfProduction") return s + b.annualDep * energy;
      return s + (y < b._life ? b.annualDep : 0);
    }, 0);

    const ebit = ebitda - depreciation;

    // Debt service
    const corridorRate = at(I.corridorPctPerYear, y, 0.10);
    const annualRate = corridorRate + I.spreadPct;
    const periodicRate = Math.pow(1 + annualRate, 1 / ppy) - 1;
    // interest accrued through the year on opening balance (avg balance approx)
    const principalRepay = y < I.loanTenorYears ? Math.min(debtOutstanding, principalSharePerYear[y] || 0) : 0;
    const avgBal = debtOutstanding - principalRepay / 2;
    const interest = Math.max(0, avgBal) * annualRate;
    const debtOpening = debtOutstanding;
    debtOutstanding = Math.max(0, debtOutstanding - principalRepay);
    const debtClosing = debtOutstanding;

    const ebt = ebit - interest;
    const tax = Math.max(0, ebt) * I.taxRatePct;
    const netProfit = ebt - tax;

    const ar = revenue * (I.arDays / 365);
    const wcDelta = -(ar - prevAR);
    prevAR = ar;

    const taxAdjUnlev = Math.max(0, ebit) * I.taxRatePct;
    const fcff = ebit - taxAdjUnlev + depreciation + wcDelta;
    const fcfe = netProfit + depreciation + wcDelta - principalRepay;

    const cfads = ebitda - tax;
    const ds = interest + principalRepay;
    const dscr = ds > 0 ? cfads / ds : NaN;

    rows.push({
      year: I.startYear + y, yearIdx: y, fx,
      capacityKwp: I.capacityKwp, energyKwh: energy, tariffEgp: tariff, revenue,
      maintenance, insurance, replacement, rent, usufruct, opex,
      ebitda, depreciation, ebit, interest, ebt, tax, netProfit,
      capex: 0, debtDraw: 0, principalRepay,
      workingCapDelta: wcDelta, fcff, fcfe,
      debtOpening, debtClosing, rate: annualRate, dscr,
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

  // LCOE = PV(costs+capex) / PV(energy)
  const opRows = rows.filter(r => r.yearIdx >= 0);
  const r = I.discountRateProject;
  const pvCapex = totalCapexEgp; // at t=0
  const pvCosts = opRows.reduce((s, row, i) => s + (row.opex + row.tax + row.interest) / Math.pow(1 + r, i + 1), 0);
  const pvEnergy = opRows.reduce((s, row, i) => s + row.energyKwh / Math.pow(1 + r, i + 1), 0);
  const lcoe = pvEnergy > 0 ? (pvCapex + pvCosts) / pvEnergy : NaN;

  // Tariff composition (Y1 EGP/kWh)
  const y1 = rows.find(rr => rr.yearIdx === 0)!;
  const tariff = y1.tariffEgp;
  const e1 = y1.energyKwh || 1;
  const comp: { name: string; group: string; value: number; pct: number }[] = [];
  for (const b of allCapex) {
    const dep = b.depMethod === "UnitOfProduction" ? b.annualDep * y1.energyKwh : (y1.yearIdx < b._life ? b.annualDep : 0);
    if (dep > 0) comp.push({ name: `Dep: ${b.label}`, group: "CAPEX", value: dep / e1, pct: 0 });
  }
  if (y1.maintenance > 0) comp.push({ name: "Maintenance", group: "OPEX", value: y1.maintenance / e1, pct: 0 });
  if (y1.insurance > 0) comp.push({ name: "Insurance", group: "OPEX", value: y1.insurance / e1, pct: 0 });
  if (y1.rent > 0) comp.push({ name: "Rent", group: "OPEX", value: y1.rent / e1, pct: 0 });
  if (y1.usufruct > 0) comp.push({ name: "Usufruct", group: "OPEX", value: y1.usufruct / e1, pct: 0 });
  if (y1.replacement > 0) comp.push({ name: "Replacement", group: "OPEX", value: y1.replacement / e1, pct: 0 });
  if (y1.interest > 0) comp.push({ name: "Interest (debt)", group: "Financing", value: y1.interest / e1, pct: 0 });
  if (y1.tax > 0) comp.push({ name: "Income Tax", group: "Tax", value: y1.tax / e1, pct: 0 });
  const sumCost = comp.reduce((s, c) => s + c.value, 0);
  comp.push({ name: "Equity Margin / Profit", group: "Margin", value: Math.max(0, tariff - sumCost), pct: 0 });
  comp.forEach(c => c.pct = tariff > 0 ? c.value / tariff : 0);

  return {
    inputs: I,
    totalCapexEgp,
    capexBreakdown: allCapex.map(b => ({ label: b.label, egp: b.egp, vatEgp: b.vatEgp, customsEgp: b.customsEgp, totalEgp: b.totalEgp, annualDep: b.annualDep, depMethod: b.depMethod })),
    debtAmount, equityAmount,
    rows,
    projectIRR, equityIRR, npvProject, npvEquity, minDSCR, avgDSCR, paybackYears: payback,
    lcoeEgpPerKwh: lcoe,
    tariffComposition: comp,
  };
}

// 1-D sensitivity helper (mirrors waterModel signature)
export function pvSensitivity(base: PvInputs, field: keyof PvInputs, multipliers: number[]) {
  const baseVal = base[field] as number;
  return multipliers.map(m => {
    const inputs = { ...base, [field]: (typeof baseVal === "number" ? baseVal * m : baseVal) } as PvInputs;
    const r = runPvModel(inputs);
    return { mult: m, projectIRR: r.projectIRR, equityIRR: r.equityIRR, lcoe: r.lcoeEgpPerKwh, minDSCR: r.minDSCR };
  });
}
