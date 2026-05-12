// Tanzania Micro LNG — Small-Scale LNG Distribution Project Finance Model
// Based on: Tanzania Very Small Scale Board Rev3_v03_Feb_2026_A50_SHL.xlsm

// ─── Helpers ────────────────────────────────────────────────────────────────

const at = (arr: number[] | undefined, y: number, fb: number): number => {
  if (!arr || arr.length === 0) return fb;
  const v = arr[Math.min(y, arr.length - 1)];
  return v == null || !isFinite(v) ? fb : v;
};

// Cumulative inflation factor: product of (1 + rate_i) for i = 0..y-1
// y=0 → 1 (base year, no escalation)
const cumulAt = (arr: number[] | undefined, y: number, fb: number): number => {
  let r = 1;
  for (let i = 0; i < y; i++) r *= (1 + at(arr, i, fb));
  return r;
};

function npv(rate: number, cf: number[]): number {
  let s = 0;
  for (let i = 0; i < cf.length; i++) s += cf[i] / Math.pow(1 + rate, i);
  return s;
}

function irr(cf: number[], guess = 0.1): number {
  let r = guess;
  for (let iter = 0; iter < 200; iter++) {
    let f = 0, df = 0;
    for (let i = 0; i < cf.length; i++) {
      f  += cf[i] / Math.pow(1 + r, i);
      df -= i * cf[i] / Math.pow(1 + r, i + 1);
    }
    if (Math.abs(df) < 1e-12) break;
    const r2 = r - f / df;
    if (Math.abs(r2 - r) < 1e-10) { r = r2; break; }
    r = r2;
  }
  return isFinite(r) ? r : NaN;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LngCustomer {
  name: string;
  volumeMmbtuPerDay: number;
  enabled: boolean;
}

export interface LngCapexItem {
  key: string;
  label: string;
  amountUsd: number;
  vatPct?: number;   // VAT rate (e.g. 0.18 for 18%)
  units?: number;    // number of units
}

export interface LngInputs {
  projectName: string;
  startYear: number;
  projectDurationYears: number;
  constructionMonths: number;

  // LNG capacity & volumes
  capacityM3LngPerDay: number;
  mmbtuPerM3Lng: number;            // conversion factor (default 21.5)
  facilityOperatingDays: number;    // days / year
  demandUtilizationPct: number;     // 0-1
  utilizationPerYear?: number[];    // optional per-year utilization overrides (0-1)
  customers: LngCustomer[];

  // Revenue
  sellingPriceUsdPerMmbtu: number;
  feedGasPriceUsdPerMmbtu: number;  // cost of feed gas

  // Per-year inflation arrays (replaces single scalar escalation rates)
  revenueInflationPerYear: number[];   // e.g. [0.03, 0.03, ...]
  opexInflationPerYear: number[];      // fixed OPEX inflation
  transportInflationPerYear: number[]; // transport cost inflation
  feedGasInflationPerYear: number[];   // feed gas price inflation

  // Legacy arrays kept for backward compat (used as fallback if new arrays absent)
  priceEscalationPctPerYear?: number[];
  feedGasEscalationPctPerYear?: number[];
  opexInflationPctPerYear?: number[];
  transportInflationPctPerYear?: number[];

  // Transportation
  numSemiTrailers: number;
  trailerCapacityM3: number;        // m3 LNG per trailer
  roundTripDistanceKm: number;
  transportCostUsdPerKm: number;

  // CAPEX (USD)
  capexItems: LngCapexItem[];
  contingencyPct: number;
  capexDrawScheduleMonthly?: number[]; // % per construction month (sum = 1)
  fxRateConstructionPerMonth?: number[]; // USD/local rate per construction month

  // OPEX (USD/year base)
  opexSalariesUsd: number;
  opexAccommodationUsd: number;
  opexEnergyUtilitiesUsd: number;
  opexLandLeaseUsd: number;
  opexMaintenanceInsuranceUsd: number;
  opexJvOverheadsUsd: number;

  // Financial structure
  debtRatioPct: number;             // % of total CAPEX financed by debt
  shlPctOfDebt: number;             // SHL as % of total debt
  seniorInterestRatePct: number;
  shlInterestRatePct: number;
  debtTenorYears: number;
  debtGraceYears: number;
  taxRatePct: number;
  withholdingTaxPct: number;

  // Senior debt refinancing
  refiEnabled?: boolean;
  refiYear?: number;            // operating year (0-indexed) to refinance
  refiNewRatePct?: number;
  refiNewTenorYears?: number;

  // Working capital
  arMonths: number;
  apMonths: number;

  // Depreciation
  depreciationYears: number;

  // Discount rates
  discountRateProject: number;
  discountRateEquity: number;

  // FX
  usdToEgp: number;
}

export interface LngYearRow {
  year: number;
  yearIdx: number;          // -1 = construction, 0..N-1 = operations

  // Volume
  volumeMmbtu: number;
  volumeM3Lng: number;

  // Revenue & costs
  revenue: number;          // USD
  feedGasCost: number;
  grossMargin: number;
  transportCost: number;
  fixedOpex: number;
  totalOpex: number;        // excl. feed gas
  ebitda: number;
  depreciation: number;
  ebit: number;

  // Financing
  seniorOpening: number;
  seniorDraw: number;
  seniorRepay: number;
  seniorInterest: number;
  seniorClosing: number;
  shlOpening: number;
  shlDraw: number;
  shlRepay: number;
  shlInterest: number;
  shlClosing: number;

  // P&L
  ebt: number;
  tax: number;
  netProfit: number;

  // Cash flows
  capex: number;
  wcDelta: number;
  dscr: number;
  cfads: number;
  fcff: number;
  fcfe: number;
  cash: number;

  // Balance sheet
  netPPE: number;
  accumDep: number;
  ar: number;
  ap: number;
  retainedEarnings: number;
  paidInEquity: number;
}

export interface LngOutputs {
  inputs: LngInputs;
  rows: LngYearRow[];

  totalCapexUsd: number;
  debtAmount: number;
  shlAmount: number;
  seniorDebt: number;
  equityAmount: number;

  projectIRR: number;
  equityIRR: number;
  npvProject: number;
  npvEquity: number;
  paybackYears: number;
  minDSCR: number;
  avgDSCR: number;
  lcoe: number;             // USD/MMBTU levelised cost
  capexPerM3Day: number;    // total CAPEX USD / capacity m³/day

  capexBreakdown: {
    label: string;
    amountUsd: number;      // base amount (no VAT, with contingency share)
    vatUsd: number;
    totalUsd: number;       // amountUsd + vatUsd
    units: number;
    annualDep: number;
  }[];
}

// ─── Defaults ───────────────────────────────────────────────────────────────

export const DEFAULT_LNG_INPUTS: LngInputs = {
  projectName: "Tanzania Micro LNG — Pilot Plant",
  startYear: 2027,
  projectDurationYears: 15,
  constructionMonths: 12,

  capacityM3LngPerDay: 40,
  mmbtuPerM3Lng: 21.5,
  facilityOperatingDays: 330,
  demandUtilizationPct: 0.80,
  utilizationPerYear: [],
  customers: [
    { name: "Customer 1", volumeMmbtuPerDay: 200, enabled: true },
    { name: "Customer 2", volumeMmbtuPerDay: 150, enabled: true },
    { name: "Customer 3", volumeMmbtuPerDay: 100, enabled: false },
    { name: "Customer 4", volumeMmbtuPerDay: 80,  enabled: false },
    { name: "Customer 5", volumeMmbtuPerDay: 60,  enabled: false },
    { name: "Customer 6", volumeMmbtuPerDay: 0,   enabled: false },
    { name: "Customer 7", volumeMmbtuPerDay: 0,   enabled: false },
    { name: "Customer 8", volumeMmbtuPerDay: 0,   enabled: false },
  ],

  sellingPriceUsdPerMmbtu: 18.0,
  feedGasPriceUsdPerMmbtu: 5.5,

  revenueInflationPerYear:   Array.from({ length: 15 }, () => 0.03),
  opexInflationPerYear:      Array.from({ length: 15 }, () => 0.05),
  transportInflationPerYear: Array.from({ length: 15 }, () => 0.05),
  feedGasInflationPerYear:   Array.from({ length: 15 }, () => 0.02),

  numSemiTrailers: 4,
  trailerCapacityM3: 40,
  roundTripDistanceKm: 400,
  transportCostUsdPerKm: 2.5,

  capexItems: [
    { key: "liquefaction", label: "Liquefaction Plant & Storage",    amountUsd: 4_500_000, vatPct: 0.18, units: 1 },
    { key: "semitrailers", label: "Semi-Trailers (ISO containers)",  amountUsd: 1_200_000, vatPct: 0.18, units: 4 },
    { key: "civil",        label: "Civil Works & Site Preparation",  amountUsd: 800_000,   vatPct: 0.18, units: 1 },
    { key: "owner",        label: "Owner's Costs & Engineering",     amountUsd: 400_000,   vatPct: 0.00, units: 1 },
    { key: "development",  label: "Development & Pre-FEED",          amountUsd: 300_000,   vatPct: 0.00, units: 1 },
  ],
  contingencyPct: 0.10,
  capexDrawScheduleMonthly: [],
  fxRateConstructionPerMonth: [],

  opexSalariesUsd: 480_000,
  opexAccommodationUsd: 60_000,
  opexEnergyUtilitiesUsd: 120_000,
  opexLandLeaseUsd: 24_000,
  opexMaintenanceInsuranceUsd: 90_000,
  opexJvOverheadsUsd: 80_000,

  debtRatioPct: 0.70,
  shlPctOfDebt: 0.30,
  seniorInterestRatePct: 0.085,
  shlInterestRatePct: 0.10,
  debtTenorYears: 10,
  debtGraceYears: 1,
  taxRatePct: 0.30,
  withholdingTaxPct: 0.10,

  refiEnabled: false,
  refiYear: 5,
  refiNewRatePct: 0.08,
  refiNewTenorYears: 5,

  arMonths: 1.5,
  apMonths: 1.0,
  depreciationYears: 15,

  discountRateProject: 0.12,
  discountRateEquity: 0.15,

  usdToEgp: 50,
};

// ─── Model Engine ───────────────────────────────────────────────────────────

export function runLngModel(I: LngInputs): LngOutputs {
  const N = I.projectDurationYears;

  // Resolve per-year inflation arrays (fall back to legacy single-value arrays)
  const revInflation   = I.revenueInflationPerYear?.length   ? I.revenueInflationPerYear   : (I.priceEscalationPctPerYear   ?? [0.03]);
  const opexInflation  = I.opexInflationPerYear?.length      ? I.opexInflationPerYear      : (I.opexInflationPctPerYear     ?? [0.05]);
  const transInflation = I.transportInflationPerYear?.length ? I.transportInflationPerYear : (I.transportInflationPctPerYear ?? [0.05]);
  const fgInflation    = I.feedGasInflationPerYear?.length   ? I.feedGasInflationPerYear   : (I.feedGasEscalationPctPerYear  ?? [0.02]);

  // Total CAPEX (base items + contingency)
  const baseCapex = I.capexItems.reduce((s, it) => s + it.amountUsd, 0);
  const totalCapexUsd = baseCapex * (1 + I.contingencyPct);

  // Financing splits
  const debtAmount   = totalCapexUsd * I.debtRatioPct;
  const shlAmount    = debtAmount * I.shlPctOfDebt;
  const seniorDebt   = debtAmount - shlAmount;
  const equityAmount = totalCapexUsd - debtAmount;

  // Annual base volume (MMBTU)
  const totalCustomerMmbtuPerDay = I.customers
    .filter(c => c.enabled)
    .reduce((s, c) => s + c.volumeMmbtuPerDay, 0);
  const capacityMmbtuPerDay = I.capacityM3LngPerDay * I.mmbtuPerM3Lng;
  const baseAnnualMmbtu = Math.min(
    totalCustomerMmbtuPerDay,
    capacityMmbtuPerDay * I.demandUtilizationPct
  ) * I.facilityOperatingDays;

  // Senior debt amortisation schedule (equal instalments after grace)
  const grace      = Math.min(I.debtGraceYears ?? 1, I.debtTenorYears - 1);
  const amortYears = I.debtTenorYears - grace;
  const seniorAnnualRepayBase = amortYears > 0 ? seniorDebt / amortYears : 0;

  // SHL: interest-only, bullet at end of tenor
  const shlTenor = I.debtTenorYears;

  // Straight-line depreciation
  const annualDep = totalCapexUsd / Math.max(1, I.depreciationYears);

  // Build year rows
  const rows: LngYearRow[] = [];
  let cash = 0;
  let accumulated = 0;
  let retained = 0;
  let seniorBal = seniorDebt;
  let shlBal    = shlAmount;

  // Refinancing state
  let seniorRateCurrent = I.seniorInterestRatePct;
  let seniorAmortCurrent = seniorAnnualRepayBase;
  let refiDone = false;

  // Construction row (yearIdx = -1)
  // FCFE in construction = -equityAmount (sponsor puts in only equity; debt drawn separately)
  rows.push({
    year: I.startYear - 1, yearIdx: -1,
    volumeMmbtu: 0, volumeM3Lng: 0,
    revenue: 0, feedGasCost: 0, grossMargin: 0,
    transportCost: 0, fixedOpex: 0, totalOpex: 0,
    ebitda: 0, depreciation: 0, ebit: 0,
    seniorOpening: 0, seniorDraw: seniorDebt, seniorRepay: 0, seniorInterest: 0, seniorClosing: seniorDebt,
    shlOpening: 0, shlDraw: shlAmount, shlRepay: 0, shlInterest: 0, shlClosing: shlAmount,
    ebt: 0, tax: 0, netProfit: 0,
    capex: -totalCapexUsd, wcDelta: 0,
    dscr: NaN, cfads: 0,
    fcff: -totalCapexUsd,
    fcfe: -equityAmount,       // ← fixed: only equity outflow, not total CAPEX
    cash: 0, netPPE: totalCapexUsd, accumDep: 0, ar: 0, ap: 0,
    retainedEarnings: 0, paidInEquity: equityAmount,
  });

  for (let y = 0; y < N; y++) {
    // Cumulative inflation factors (y=0 means base year, factor = 1)
    const revEsc   = cumulAt(revInflation,   y, 0.03);
    const fgEsc    = cumulAt(fgInflation,    y, 0.02);
    const opexEsc  = cumulAt(opexInflation,  y, 0.05);
    const transEsc = cumulAt(transInflation, y, 0.05);

    // Volume — apply per-year utilization if provided, else ramp Y1 to 70%
    const utilOverride = I.utilizationPerYear && I.utilizationPerYear.length > y
      ? I.utilizationPerYear[y]
      : (y === 0 ? 0.70 : 1.0);
    const volumeMmbtu = baseAnnualMmbtu * utilOverride;
    const volumeM3Lng = volumeMmbtu / I.mmbtuPerM3Lng;

    // Revenue
    const sellingPrice = I.sellingPriceUsdPerMmbtu * revEsc;
    const revenue      = volumeMmbtu * sellingPrice;
    const feedGasCost  = volumeMmbtu * I.feedGasPriceUsdPerMmbtu * fgEsc;
    const grossMargin  = revenue - feedGasCost;

    // Transport cost = trips × distance × cost/km × inflation
    const tripsPerYear  = volumeM3Lng / Math.max(1, I.trailerCapacityM3);
    const transportCost = tripsPerYear * I.roundTripDistanceKm * I.transportCostUsdPerKm * transEsc;

    // Fixed OPEX escalated
    const fixedOpex = (
      I.opexSalariesUsd +
      I.opexAccommodationUsd +
      I.opexEnergyUtilitiesUsd +
      I.opexLandLeaseUsd +
      I.opexMaintenanceInsuranceUsd +
      I.opexJvOverheadsUsd
    ) * opexEsc;

    const totalOpex = fixedOpex + transportCost;
    const ebitda    = grossMargin - totalOpex;

    // Depreciation
    const depreciation = y < I.depreciationYears ? annualDep : 0;
    const ebit = ebitda - depreciation;

    // ── Refinancing ──
    if (I.refiEnabled && !refiDone && y === (I.refiYear ?? 5)) {
      // Refi: reset interest rate; recalculate amort over remaining new tenor
      seniorRateCurrent = I.refiNewRatePct ?? I.seniorInterestRatePct;
      const refiTenor = I.refiNewTenorYears ?? 5;
      seniorAmortCurrent = refiTenor > 0 ? seniorBal / refiTenor : 0;
      refiDone = true;
    }

    // Senior debt
    const seniorOpening  = seniorBal;
    const inGrace        = y < grace;
    const afterTenor     = y >= I.debtTenorYears;
    const seniorRepay    = (!inGrace && !afterTenor) ? Math.min(seniorAmortCurrent, seniorBal) : 0;
    const seniorInterest = seniorOpening * seniorRateCurrent;
    const seniorClosing  = Math.max(0, seniorOpening - seniorRepay);
    seniorBal = seniorClosing;

    // SHL: interest-only, bullet at end of tenor
    const shlOpening  = shlBal;
    const shlRepay    = (y === shlTenor - 1) ? shlBal : 0;
    const shlInterest = shlOpening * I.shlInterestRatePct;
    const shlClosing  = Math.max(0, shlOpening - shlRepay);
    shlBal = shlClosing;

    // P&L
    const ebt       = ebit - seniorInterest - shlInterest;
    const tax       = Math.max(0, ebt) * I.taxRatePct;
    const netProfit = ebt - tax;

    // DSCR — CFADS = EBITDA - tax (before debt service)
    const debtService = seniorRepay + seniorInterest;
    const cfads = ebitda - tax;
    const dscr  = debtService > 0 ? cfads / debtService : Infinity;

    // Working capital
    const newAR = revenue / 12 * I.arMonths;
    const newAP = totalOpex / 12 * I.apMonths;
    const prevRow = rows[rows.length - 1];
    const wcDelta = -(newAR - prevRow.ar) + (newAP - prevRow.ap);

    // Cash balance
    const netCash = netProfit + depreciation + wcDelta - seniorRepay - shlRepay;
    cash = Math.max(0, cash + netCash);

    // Balance sheet accumulators
    accumulated += depreciation;
    retained += netProfit;
    const netPPE = Math.max(0, totalCapexUsd - accumulated);

    // IRR cash flows
    // FCFF = unlevered free cash flow (for project IRR)
    const fcff = ebit * (1 - I.taxRatePct) + depreciation + wcDelta;
    // FCFE = levered free cash flow to equity (for equity IRR)
    // = Net Profit + D&A + WC change - senior repay - SHL repay
    const fcfe = netProfit + depreciation + wcDelta - seniorRepay - shlRepay;

    rows.push({
      year: I.startYear + y, yearIdx: y,
      volumeMmbtu, volumeM3Lng,
      revenue, feedGasCost, grossMargin,
      transportCost, fixedOpex, totalOpex,
      ebitda, depreciation, ebit,
      seniorOpening, seniorDraw: 0, seniorRepay, seniorInterest, seniorClosing,
      shlOpening, shlDraw: 0, shlRepay, shlInterest, shlClosing,
      ebt, tax, netProfit,
      capex: 0, wcDelta, dscr, cfads,
      fcff, fcfe,
      cash, netPPE, accumDep: accumulated,
      ar: newAR, ap: newAP,
      retainedEarnings: retained,
      paidInEquity: equityAmount,
    });
  }

  // ── IRR ──
  // Project IRR: construction FCFF + operating FCFF
  const fcffCf: number[] = [-totalCapexUsd, ...rows.slice(1).map(r => r.fcff)];
  // Equity IRR: year -1 = -equityAmount (construction equity), years 0..N-1 = FCFE
  const fcfeCf: number[] = [-equityAmount, ...rows.slice(1).map(r => r.fcfe)];

  const projectIRR = irr(fcffCf);
  const equityIRR  = irr(fcfeCf);

  // ── NPV ──
  const npvProject = npv(I.discountRateProject, fcffCf);
  const npvEquity  = npv(I.discountRateEquity,  fcfeCf);

  // ── Payback (equity) ──
  let cumCash = fcfeCf[0];
  let paybackYears = NaN;
  for (let i = 1; i < fcfeCf.length; i++) {
    const prev = cumCash;
    cumCash += fcfeCf[i];
    if (prev < 0 && cumCash >= 0) {
      paybackYears = i - 1 + Math.abs(prev) / (cumCash - prev);
      break;
    }
  }

  // ── DSCR stats ──
  const dscrValues = rows.slice(1).map(r => r.dscr).filter(d => isFinite(d) && d > 0 && d < 100);
  const minDSCR = dscrValues.length ? Math.min(...dscrValues) : NaN;
  const avgDSCR = dscrValues.length ? dscrValues.reduce((a, b) => a + b, 0) / dscrValues.length : NaN;

  // ── LCOE (levelised cost per MMBTU) ──
  const pvRate = I.discountRateProject;
  const pv = (arr: number[]) => arr.reduce((s, v, i) => s + v / Math.pow(1 + pvRate, i + 1), 0);
  const pvCosts = totalCapexUsd + pv(rows.slice(1).map(r => r.totalOpex + r.feedGasCost + r.tax));
  const pvMmbtu = pv(rows.slice(1).map(r => r.volumeMmbtu));
  const lcoe = pvMmbtu > 0 ? pvCosts / pvMmbtu : 0;

  // ── CAPEX per m³/day ──
  const capexPerM3Day = I.capacityM3LngPerDay > 0 ? totalCapexUsd / I.capacityM3LngPerDay : 0;

  // ── CAPEX breakdown with VAT ──
  const contingencyFactor = 1 + I.contingencyPct;
  const capexBreakdown = I.capexItems.map(it => {
    const baseWithContingency = it.amountUsd * contingencyFactor;
    const vatRate  = it.vatPct ?? 0;
    const vatUsd   = baseWithContingency * vatRate;
    const totalUsd = baseWithContingency + vatUsd;
    const units    = it.units ?? 1;
    const annualDep = totalUsd / Math.max(1, I.depreciationYears);
    return { label: it.label, amountUsd: baseWithContingency, vatUsd, totalUsd, units, annualDep };
  });

  return {
    inputs: I,
    rows,
    totalCapexUsd,
    debtAmount,
    shlAmount,
    seniorDebt,
    equityAmount,
    projectIRR,
    equityIRR,
    npvProject,
    npvEquity,
    paybackYears,
    minDSCR,
    avgDSCR,
    lcoe,
    capexPerM3Day,
    capexBreakdown,
  };
}

// ─── Formatters ─────────────────────────────────────────────────────────────

export const fmtUsd = (v: number, d = 0) =>
  isFinite(v) ? `$${v < 0 ? "-" : ""}${Math.abs(v / 1e6).toFixed(d === 0 ? 2 : d)}M` : "—";
export const fmtUsdK = (v: number) =>
  isFinite(v) ? `$${(v / 1000).toFixed(0)}K` : "—";
export const fmtNum = (v: number, d = 0) =>
  isFinite(v) ? v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—";
export const fmtPct = (v: number) =>
  isFinite(v) ? `${(v * 100).toFixed(1)}%` : "—";
