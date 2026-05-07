// Water (SWRO) Project Finance Model
// Mirrors the structure of the uploaded Water.xlsm: Assumptions → Calculations → Dashboard
// All monetary outputs are in EGP unless suffixed _usd.

export interface WaterInputs {
  projectName: string;
  scenario: string;

  // ── Timing ────────────────────────────────────────────────────────────
  startYear: number;            // operations start (e.g. 2028)
  developmentMonths: number;    // 1
  constructionMonths: number;   // 12
  contractYears: number;        // 25

  // ── FX & Inflation ────────────────────────────────────────────────────
  fxRateEgpPerUsd: number;      // 53
  egpInflation: number;         // 0
  revenueInflation: number;     // 0
  electricityInflation: number; // 0
  usdInflation: number;         // 0

  // ── Plant ─────────────────────────────────────────────────────────────
  capacityM3Day: number;        // 3500
  minTakePct: number;           // 0.95 (Year 1 utilisation)
  realizedPctOfMinTake: number; // 0.96

  // Monthly seasonality (12 weights — normalised)
  monthlySeasonality: number[]; // default flat

  // ── Pricing ───────────────────────────────────────────────────────────
  sellingPriceEgpPerM3: number; // 23
  pctPeggedToUsd: number;       // 0..1

  // ── CAPEX (USD per station, then × FX × (1+contingency)) ──────────────
  feedSysUsd: number;           // 45,954.1
  pretreatmentUsd: number;      // 74,464.8
  roUnitUsd: number;            // 779,112.58
  bwCipUsd: number;             // 17,763.48
  installationEgp: number;      // 5,000,000
  drillingUsd: number;          // 0 (wells)
  contingencyPct: number;       // 0.05

  // ── Financing ─────────────────────────────────────────────────────────
  debtToEquity: number;         // 0.8 (debt share of total capex+IDC)
  bankSpread: number;           // 0.02 (informational)
  loanTenorYears: number;       // 10
  // declining-rate path used in the Excel: yr1=20%, then -2pp, then floor 10%
  debtRateYr1: number;          // 0.20
  debtRateStepDown: number;     // 0.02
  debtRateFloor: number;        // 0.10

  // ── OPEX ──────────────────────────────────────────────────────────────
  electricityIncluded: boolean;
  electricityPriceEgpKwh: number; // 2.34
  electricityKwhPerM3: number;    // 3
  wellsIncluded: boolean;
  wellsCostEgpPerM3: number;      // 0
  otherVarEgpPerM3: number;       // 0
  // Variable USD/m3 components (chemicals + RO consumables)
  chemicalsUsdPerM3: number;      // 0.0363
  smbsUsdPerM3: number;           // 0
  hppUsdPerM3: number;            // 0.0030
  feedUsdPerM3: number;           // 0.000846
  mmfUsdPerM3: number;            // 0.001032
  dosingUsdPerM3: number;         // 0.001066
  boosterUsdPerM3: number;        // 0.0025
  vfdUsdPerM3: number;            // 0.001456
  pxUsdPerM3: number;             // 0.0035
  pressureVesselUsdPerM3: number; // 0.002643
  cfsUsdPerM3: number;            // 0.0016
  instrumentationUsdPerM3: number;// 0.001032
  cipPumpsUsdPerM3: number;       // 0.000705
  pvcUsdPerM3: number;            // 0.000791

  // Fixed monthly salaries (EGP/month)
  salariesEgpMonth: number;       // 17,000
  otherFixedEgpMonth: number;     // 0

  // ── SG&A ──────────────────────────────────────────────────────────────
  headOfficeEgpMonth: number;     // 500,000
  headOfficeAllocPct: number;     // 0 (share allocated to project)
  otherSgaEgpMonth: number;       // 0

  // ── Depreciation ──────────────────────────────────────────────────────
  depreciationYears: number;      // 25 (linear, on full CAPEX in EGP)

  // ── Working Capital ───────────────────────────────────────────────────
  receivablesDays: number;        // 30
  payablesDays: number;           // 0

  // ── Tax ───────────────────────────────────────────────────────────────
  taxRate: number;                // 0.225

  // ── Discount rates for valuation ──────────────────────────────────────
  discountRateProject: number;    // 0.12 default
  discountRateEquity: number;     // 0.18
}

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
  capacityM3Day: 3500,
  minTakePct: 0.95,
  realizedPctOfMinTake: 0.96,
  monthlySeasonality: Array(12).fill(1),
  sellingPriceEgpPerM3: 23,
  pctPeggedToUsd: 0,
  feedSysUsd: 45954.1,
  pretreatmentUsd: 74464.8,
  roUnitUsd: 779112.58,
  bwCipUsd: 17763.48,
  installationEgp: 5_000_000,
  drillingUsd: 0,
  contingencyPct: 0.05,
  debtToEquity: 0.8,
  bankSpread: 0.02,
  loanTenorYears: 10,
  debtRateYr1: 0.20,
  debtRateStepDown: 0.02,
  debtRateFloor: 0.10,
  electricityIncluded: true,
  electricityPriceEgpKwh: 2.34,
  electricityKwhPerM3: 3,
  wellsIncluded: true,
  wellsCostEgpPerM3: 0,
  otherVarEgpPerM3: 0,
  chemicalsUsdPerM3: 0.036322580645161286,
  smbsUsdPerM3: 0,
  hppUsdPerM3: 0.00302941400304414,
  feedUsdPerM3: 0.0008458862465753423,
  mmfUsdPerM3: 0.0010319342465753424,
  dosingUsdPerM3: 0.001065505008219178,
  boosterUsdPerM3: 0.0025,
  vfdUsdPerM3: 0.001456,
  pxUsdPerM3: 0.0035,
  pressureVesselUsdPerM3: 0.0026426598173515986,
  cfsUsdPerM3: 0.0016,
  instrumentationUsdPerM3: 0.0010315872146118722,
  cipPumpsUsdPerM3: 0.000704905205479452,
  pvcUsdPerM3: 0.0007912328767123285,
  salariesEgpMonth: 17_000,
  otherFixedEgpMonth: 0,
  headOfficeEgpMonth: 500_000,
  headOfficeAllocPct: 0,
  otherSgaEgpMonth: 0,
  depreciationYears: 25,
  receivablesDays: 30,
  payablesDays: 0,
  taxRate: 0.225,
  discountRateProject: 0.12,
  discountRateEquity: 0.18,
};

// ─── Helpers ──────────────────────────────────────────────────────────────
export const fmtNum = (v: number, d = 0) =>
  isFinite(v)
    ? v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })
    : "—";
export const fmtPct = (v: number, d = 1) =>
  isFinite(v) ? `${(v * 100).toFixed(d)}%` : "—";
export const fmtEgp = (v: number, d = 0) => `EGP ${fmtNum(v, d)}`;

function npv(rate: number, cf: number[]): number {
  let r = 0;
  for (let i = 0; i < cf.length; i++) r += cf[i] / Math.pow(1 + rate, i);
  return r;
}
function irr(cf: number[], guess = 0.1): number {
  // Newton-Raphson then bisection fallback
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
  // bisection
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
  yearIdx: number; // 0 = first operations year
  volumeM3: number;
  pricePerM3: number;
  revenue: number;          // EGP
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
  // Cash flow
  capex: number;            // negative outflow
  debtDraw: number;         // +
  principalRepay: number;   // -
  workingCapDelta: number;
  fcff: number;
  fcfe: number;
  // Debt
  debtOpening: number;
  debtClosing: number;
  rate: number;
  dscr: number;
}

export interface WaterOutputs {
  inputs: WaterInputs;
  // CAPEX
  feedSysEgp: number;
  pretreatmentEgp: number;
  roUnitEgp: number;
  bwCipEgp: number;
  installationEgpAll: number;
  drillingEgp: number;
  totalRoCapex: number;     // EGP, includes contingency
  idc: number;              // EGP
  totalCapexWithIdc: number;
  capexPerM3Egp: number;
  capexPerM3Usd: number;
  // Funding
  debtAmount: number;
  equityAmount: number;
  // Capacity
  installedCapacityM3Year: number;
  actualCapacityM3Year: number;
  unutilisedCapacityM3Year: number;
  utilisationPct: number;
  // OPEX per m3
  fixedCostPerM3: number;
  variableCostPerM3: number;
  electricityCostPerM3: number;
  depreciationPerM3: number;
  totalCostPerM3: number;
  lcom3: number;            // levelized cost (EGP/m3)
  // Returns
  rows: YearRow[];
  projectIRR: number;
  equityIRR: number;
  equityPaybackYears: number;
  npvProject: number;
  npvEquity: number;
  // DSCR
  minDSCR: number;
  avgDSCR: number;
  // Tariff allocation (Dashboard K-block)
  tariffEgpPerM3: number;
  tariffAllocCbeInflation: number;     // % of tariff
  tariffAllocElectricity: number;
  tariffAllocFx: number;
  tariffAllocFixedUsd: number;
}

export function runWaterModel(I: WaterInputs): WaterOutputs {
  // ── CAPEX ───────────────────────────────────────────────────────────
  const c = 1 + I.contingencyPct;
  const fx = I.fxRateEgpPerUsd;
  const feedSysEgp = I.feedSysUsd * fx * c;
  const pretreatmentEgp = I.pretreatmentUsd * fx * c;
  const roUnitEgp = I.roUnitUsd * fx * c;
  const bwCipEgp = I.bwCipUsd * fx * c;
  const installationEgpAll = I.installationEgp * c;
  const drillingEgp = I.drillingUsd * fx * c;
  const totalRoCapex =
    feedSysEgp + pretreatmentEgp + roUnitEgp + bwCipEgp + installationEgpAll + drillingEgp;

  // ── Capacity (Excel: actual = installed × minTake) ─────────────────
  const installedCapacityM3Year = I.capacityM3Day * 365;
  const actualCapacityM3Year = installedCapacityM3Year * I.minTakePct;
  const soldVolumeM3Year = actualCapacityM3Year * I.realizedPctOfMinTake;
  const unutilisedCapacityM3Year = installedCapacityM3Year - actualCapacityM3Year;
  const utilisationPct = actualCapacityM3Year / installedCapacityM3Year;

  // ── Financing (Excel: principal debt = ROCapex × gearing; IDC capitalised onto debt) ─
  const constYears = I.constructionMonths / 12;
  const principalDebt = totalRoCapex * I.debtToEquity;
  const equityAmount = totalRoCapex * (1 - I.debtToEquity);
  // IDC ≈ principal × yr1Rate × constructionYears × avg-drawdown factor (~0.596)
  const idc = principalDebt * I.debtRateYr1 * constYears * 0.596;
  const debtAmount = principalDebt + idc;
  const totalCapexWithIdc = totalRoCapex + idc;

  const capexPerM3Egp = totalCapexWithIdc / I.capacityM3Day;
  const capexPerM3Usd = capexPerM3Egp / fx;

  // ── OPEX per m3 (steady state) ──────────────────────────────────────
  const variableUsdPerM3 =
    I.chemicalsUsdPerM3 + I.smbsUsdPerM3 + I.hppUsdPerM3 + I.feedUsdPerM3 +
    I.mmfUsdPerM3 + I.dosingUsdPerM3 + I.boosterUsdPerM3 + I.vfdUsdPerM3 +
    I.pxUsdPerM3 + I.pressureVesselUsdPerM3 + I.cfsUsdPerM3 +
    I.instrumentationUsdPerM3 + I.cipPumpsUsdPerM3 + I.pvcUsdPerM3;
  const variableEgpFromUsd = variableUsdPerM3 * fx;
  const wellsCost = I.wellsIncluded ? I.wellsCostEgpPerM3 : 0;
  const variableCostPerM3 = variableEgpFromUsd + wellsCost + I.otherVarEgpPerM3;
  const electricityCostPerM3 = I.electricityIncluded
    ? I.electricityKwhPerM3 * I.electricityPriceEgpKwh
    : 0;

  const annualFixedEgp = (I.salariesEgpMonth + I.otherFixedEgpMonth) * 12;
  const fixedCostPerM3 = soldVolumeM3Year > 0 ? annualFixedEgp / soldVolumeM3Year : 0;

  const annualSgaEgp =
    (I.headOfficeEgpMonth * I.headOfficeAllocPct + I.otherSgaEgpMonth) * 12;

  // Depreciation: equipment only (Excel excludes EGP installation from dep base)
  const dpBase = feedSysEgp + pretreatmentEgp + roUnitEgp + bwCipEgp;
  const annualDepreciation = dpBase / I.depreciationYears;
  const depreciationPerM3 = soldVolumeM3Year > 0 ? annualDepreciation / soldVolumeM3Year : 0;
  const totalCostPerM3 =
    fixedCostPerM3 + electricityCostPerM3 + variableCostPerM3 + depreciationPerM3;

  // ── Debt amortisation (annuity with declining rate path) ─────────────
  const tenor = I.loanTenorYears;
  const ratePath: number[] = Array.from({ length: tenor }, (_, i) => {
    const r = I.debtRateYr1 - I.debtRateStepDown * i;
    return Math.max(r, I.debtRateFloor);
  });
  // Equal-principal payment for simplicity (matches typical sculpted profiles)
  const principalPerYear = debtAmount / tenor;
  let outstanding = debtAmount;
  const debtSchedule: { open: number; rate: number; principal: number; interest: number; close: number }[] = [];
  for (let y = 0; y < tenor; y++) {
    const open = outstanding;
    const rate = ratePath[y];
    const interest = open * rate;
    const principal = Math.min(principalPerYear, open);
    const close = open - principal;
    debtSchedule.push({ open, rate, principal, interest, close });
    outstanding = close;
  }

  // ── Annual rows ──────────────────────────────────────────────────────
  const rows: YearRow[] = [];
  const N = I.contractYears;
  let prevAR = 0;
  // Year 0 = construction year (CAPEX outflow, debt draw)
  const constructionRow: YearRow = {
    year: I.startYear - 1,
    yearIdx: -1,
    volumeM3: 0, pricePerM3: 0,
    revenue: 0, fixedCost: 0, variableCost: 0, electricityCost: 0,
    operatingCost: 0, sga: 0, ebitda: 0, depreciation: 0, ebit: 0,
    interest: 0, ebt: 0, tax: 0, netProfit: 0,
    capex: -totalCapexWithIdc, debtDraw: debtAmount, principalRepay: 0,
    workingCapDelta: 0,
    fcff: -totalCapexWithIdc,
    fcfe: -totalCapexWithIdc + debtAmount,
    debtOpening: 0, debtClosing: debtAmount, rate: 0, dscr: NaN,
  };
  rows.push(constructionRow);

  for (let y = 0; y < N; y++) {
    const inflRev = Math.pow(1 + I.revenueInflation, y);
    const inflCost = Math.pow(1 + I.egpInflation, y);
    const inflElec = Math.pow(1 + I.electricityInflation, y);
    const inflUsd = Math.pow(1 + I.usdInflation, y);

    const volume = soldVolumeM3Year;
    const price = I.sellingPriceEgpPerM3 * inflRev;
    const revenue = volume * price;

    const fixedCost = annualFixedEgp * inflCost;
    const variableCost = volume * (variableEgpFromUsd * inflUsd + (wellsCost + I.otherVarEgpPerM3) * inflCost);
    const electricityCost = volume * electricityCostPerM3 * inflElec;
    const operatingCost = fixedCost + variableCost + electricityCost;
    const sga = annualSgaEgp * inflCost;
    const ebitda = revenue - operatingCost - sga;
    const depreciation = y < I.depreciationYears ? annualDepreciation : 0;
    const ebit = ebitda - depreciation;

    const ds = y < tenor ? debtSchedule[y] : null;
    const interest = ds ? ds.interest : 0;
    const principalRepay = ds ? ds.principal : 0;
    const debtOpen = ds ? ds.open : 0;
    const debtClose = ds ? ds.close : 0;
    const rate = ds ? ds.rate : 0;

    const ebt = ebit - interest;
    const tax = Math.max(0, ebt) * I.taxRate;
    const netProfit = ebt - tax;

    // working capital
    const ar = revenue * (I.receivablesDays / 365);
    const wcDelta = -(ar - prevAR);
    prevAR = ar;

    // CAPEX = 0 in operations; FCFF/FCFE
    const taxAdjUnlev = Math.max(0, ebit) * I.taxRate;
    const fcff = ebit - taxAdjUnlev + depreciation + wcDelta;
    const fcfe = netProfit + depreciation + wcDelta - principalRepay;
    const cfads = ebitda - tax;
    const debtService = interest + principalRepay;
    const dscr = debtService > 0 ? cfads / debtService : NaN;

    rows.push({
      year: I.startYear + y,
      yearIdx: y,
      volumeM3: volume,
      pricePerM3: price,
      revenue, fixedCost, variableCost, electricityCost,
      operatingCost, sga, ebitda, depreciation, ebit,
      interest, ebt, tax, netProfit,
      capex: 0, debtDraw: 0, principalRepay,
      workingCapDelta: wcDelta,
      fcff, fcfe,
      debtOpening: debtOpen, debtClosing: debtClose, rate, dscr,
    });
  }

  // ── Returns ──────────────────────────────────────────────────────────
  const fcffArr = rows.map(r => r.fcff);
  const fcfeArr = rows.map(r => r.fcfe);
  const projectIRR = irr(fcffArr);
  const equityIRR = irr(fcfeArr);
  const npvProject = npv(I.discountRateProject, fcffArr);
  const npvEquity = npv(I.discountRateEquity, fcfeArr);

  // Equity payback (cumulative undiscounted FCFE crosses 0)
  let cum = 0; let payback = NaN;
  for (let i = 0; i < fcfeArr.length; i++) {
    const next = cum + fcfeArr[i];
    if (cum < 0 && next >= 0) {
      payback = i + (-cum) / fcfeArr[i];
      break;
    }
    cum = next;
  }

  // DSCR stats over operating years where debt service exists
  const dscrs = rows.filter(r => r.yearIdx >= 0 && isFinite(r.dscr)).map(r => r.dscr);
  const minDSCR = dscrs.length ? Math.min(...dscrs) : NaN;
  const avgDSCR = dscrs.length ? dscrs.reduce((a, b) => a + b, 0) / dscrs.length : NaN;

  // LCOM3 = NPV(total cost) / NPV(volume) at project discount
  const opRows = rows.filter(r => r.yearIdx >= 0);
  const costsPv = opRows.reduce((a, r, i) => a + (r.operatingCost + r.sga + r.depreciation + r.interest + r.tax) / Math.pow(1 + I.discountRateProject, i + 1), 0);
  const volsPv = opRows.reduce((a, r, i) => a + r.volumeM3 / Math.pow(1 + I.discountRateProject, i + 1), 0);
  const lcom3 = volsPv > 0 ? costsPv / volsPv : NaN;

  // Tariff allocation (Dashboard K block) — share of tariff covering each cost driver
  const tariff = I.sellingPriceEgpPerM3;
  const tariffAllocCbeInflation = (fixedCostPerM3 + depreciationPerM3) / tariff;
  const tariffAllocElectricity = electricityCostPerM3 / tariff;
  const tariffAllocFx = (variableEgpFromUsd) / tariff;
  const tariffAllocFixedUsd = Math.max(0, 1 - tariffAllocCbeInflation - tariffAllocElectricity - tariffAllocFx);

  return {
    inputs: I,
    feedSysEgp, pretreatmentEgp, roUnitEgp, bwCipEgp, installationEgpAll, drillingEgp,
    totalRoCapex, idc, totalCapexWithIdc, capexPerM3Egp, capexPerM3Usd,
    debtAmount, equityAmount,
    installedCapacityM3Year, actualCapacityM3Year, unutilisedCapacityM3Year, utilisationPct,
    fixedCostPerM3, variableCostPerM3, electricityCostPerM3, depreciationPerM3, totalCostPerM3,
    lcom3,
    rows,
    projectIRR, equityIRR, equityPaybackYears: payback,
    npvProject, npvEquity,
    minDSCR, avgDSCR,
    tariffEgpPerM3: tariff,
    tariffAllocCbeInflation, tariffAllocElectricity, tariffAllocFx, tariffAllocFixedUsd,
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
