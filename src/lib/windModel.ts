// Wind 552 MWp project finance engine
// Closed-form IDC where possible; fixed-point iteration for DSCR-sculpted debt sizing.

export interface ProjectInputs {
  // Identity
  projectName: string;
  scenario: string;

  // Timing
  constructionStart: number; // year
  constructionMonths: number;
  operationsYears: number;

  // Capex (USD '000)
  epcCost: number;
  developmentCost: number;
  substationContingency: number;
  dsraInitial: number;

  // Capacity & Production
  capacityMWp: number;
  yieldKWhPerKWp: number; // MWh per MWp = kWh per kWp (numerically). e.g. 3828
  degradation: number; // %/yr decimal
  availability: number; // decimal
  ownConsumptionLoss: number; // decimal

  // Tariff
  tariffUsdPerKWh: number;
  tariffEscalation: number; // decimal /yr

  // Opex (USD '000 p.a., real)
  oAndM: number;
  assetMgmt: number;
  spvCost: number;
  insurance: number;
  cpi: number; // decimal /yr

  // Working capital
  daysReceivable: number;
  daysPayable: number;

  // Debt sizing
  gearing: number; // target debt / total uses (initial guess)
  sizingMode: "fixed-gearing" | "dscr-sculpted";
  targetDSCR: number;
  debtTenorYears: number;
  graceYears: number;
  interestRate: number; // all-in decimal
  upfrontFeePct: number; // decimal of debt amount
  commitmentFeePct: number; // decimal p.a. on undrawn

  // Tax & depreciation
  taxRate: number; // decimal
  depreciationYears: number;
  taxHolidayYears: number;

  // Discount rates
  discountRateProject: number;
  discountRateEquity: number;
}

export const DEFAULT_INPUTS: ProjectInputs = {
  projectName: "Wind 552 MWp",
  scenario: "Base Fixed",
  constructionStart: 2027,
  constructionMonths: 24,
  operationsYears: 25,

  epcCost: 336168,
  developmentCost: 9936,
  substationContingency: 139334.49,
  dsraInitial: 44820,

  capacityMWp: 552,
  yieldKWhPerKWp: 3828.12,
  degradation: 0.005,
  availability: 0.97,
  ownConsumptionLoss: 0.02,

  tariffUsdPerKWh: 0.03,
  tariffEscalation: 0.0,

  oAndM: 5034.24,
  assetMgmt: 496.8,
  spvCost: 46.368,
  insurance: 0,
  cpi: 0.022,

  daysReceivable: 60,
  daysPayable: 30,

  gearing: 0.8,
  sizingMode: "dscr-sculpted",
  targetDSCR: 1.30,
  debtTenorYears: 20,
  graceYears: 2,
  interestRate: 0.076,
  upfrontFeePct: 0.0125,
  commitmentFeePct: 0.0125,

  taxRate: 0.225,
  depreciationYears: 20,
  taxHolidayYears: 0,

  discountRateProject: 0.08,
  discountRateEquity: 0.10,
};

export interface AnnualRow {
  year: number;
  // Production
  mwh: number;
  // Income statement
  revenue: number;
  opex: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interest: number;
  ebt: number;
  tax: number;
  netIncome: number;
  // Cashflow
  workingCapitalChange: number;
  cfads: number; // cash flow available for debt service
  debtService: number; // interest + principal
  principal: number;
  cffi: number; // cashflow for investors
  // Debt
  openingDebt: number;
  closingDebt: number;
  dscr: number;
  // Balance sheet
  ppe: number;
  cash: number;
  receivables: number;
  payables: number;
  equity: number;
}

export interface ModelOutputs {
  inputs: ProjectInputs;
  // Sources & Uses
  totalUses: number;
  totalSources: number;
  idc: number;
  upfrontFee: number;
  commitmentFee: number;
  debtAmount: number;
  equityAmount: number;
  effectiveGearing: number;

  // Annual schedule (operations only, indexed by ops year 1..N)
  rows: AnnualRow[];

  // Construction-period rows (for sources/uses chart)
  constructionYears: number[];
  constructionDraws: number[]; // total funding per year
  equityDraws: number[];
  debtDraws: number[];

  // KPIs
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

  // Convergence info
  iterations: number;
  converged: boolean;
}

function irr(cashflows: number[], guess = 0.1): number {
  // Newton-Raphson IRR
  let r = guess;
  for (let iter = 0; iter < 100; iter++) {
    let npv = 0;
    let dnpv = 0;
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

/** Build operating-year schedule given a debt amount; returns rows + KPIs. */
function simulate(inputs: ProjectInputs, debtAmount: number, idc: number, fees: number): {
  rows: AnnualRow[];
  totalCapex: number;
  equityAmount: number;
} {
  const I = inputs;
  const baseUses = I.epcCost + I.developmentCost + I.substationContingency + I.dsraInitial;
  const totalCapex = baseUses + idc + fees;
  const equityAmount = totalCapex - debtAmount;

  const N = I.operationsYears;
  const opsStartYear = I.constructionStart + Math.ceil(I.constructionMonths / 12);
  const depreciableBase = totalCapex - I.dsraInitial;
  const annualDeprec = depreciableBase / I.depreciationYears;

  const rows: AnnualRow[] = [];
  let debt = debtAmount;
  let cash = 0;
  let receivables = 0;
  let payables = 0;
  let ppe = depreciableBase;
  let equity = equityAmount;

  // Pre-compute principal schedule (mortgage-style, after grace period)
  const grace = I.graceYears;
  const amortYears = Math.max(1, I.debtTenorYears - grace);
  const r = I.interestRate;
  // Fixed annuity payment that fully amortizes debt over amortYears at rate r
  const annuity = r > 0
    ? debtAmount * (r * Math.pow(1 + r, amortYears)) / (Math.pow(1 + r, amortYears) - 1)
    : debtAmount / amortYears;

  for (let y = 1; y <= N; y++) {
    const year = opsStartYear + y - 1;
    const escal = Math.pow(1 + I.cpi, y - 1);
    const tariffEsc = Math.pow(1 + I.tariffEscalation, y - 1);
    const degr = Math.pow(1 - I.degradation, y - 1);

    const mwh = I.capacityMWp * I.yieldKWhPerKWp * I.availability * (1 - I.ownConsumptionLoss) * degr;
    const revenue = mwh * I.tariffUsdPerKWh * tariffEsc; // USD '000? mwh*usd/kwh = usd*1000... mwh*1000kwh*usd/kwh=usd*1000 → /1000 to get k... actually mwh=MWh, *USD/kWh*1000 = USD. We want '000 USD: mwh * tariff * 1
    // mwh * tariff_USD/kWh = USD/1000? 1 MWh = 1000 kWh → revenue_USD = mwh*1000*tariff. Convert to '000 USD = mwh*tariff
    // So revenue is already in '000 USD.
    const opex = (I.oAndM + I.assetMgmt + I.spvCost + I.insurance) * escal;
    const ebitda = revenue - opex;

    const depreciation = y <= I.depreciationYears ? annualDeprec : 0;
    const openingDebt = debt;
    const interest = openingDebt * r;
    const ebit = ebitda - depreciation;
    const ebt = ebit - interest;
    const tax = (y <= I.taxHolidayYears || ebt <= 0) ? 0 : ebt * I.taxRate;
    const netIncome = ebt - tax;

    // Working capital
    const newReceivables = revenue * (I.daysReceivable / 365);
    const newPayables = opex * (I.daysPayable / 365);
    const wcChange = -((newReceivables - receivables) - (newPayables - payables));
    receivables = newReceivables;
    payables = newPayables;

    const cfads = ebitda - tax + wcChange;

    // Principal payment
    let principal = 0;
    let debtService = interest;
    if (y > grace && debt > 1e-6) {
      principal = Math.min(debt, annuity - interest);
      principal = Math.max(0, principal);
      debtService = interest + principal;
    }
    debt -= principal;
    if (debt < 1e-6) debt = 0;

    const cffi = cfads - debtService;
    const dscr = debtService > 0 ? cfads / debtService : 0;

    ppe = Math.max(0, ppe - depreciation);
    cash += cffi; // cash to equity (modeled as distributed)
    equity += netIncome;

    rows.push({
      year, mwh, revenue, opex, ebitda, depreciation, ebit,
      interest, ebt, tax, netIncome,
      workingCapitalChange: wcChange, cfads, debtService, principal, cffi,
      openingDebt, closingDebt: debt, dscr,
      ppe, cash, receivables, payables, equity,
    });
  }

  return { rows, totalCapex, equityAmount };
}

/** Solve IDC + debt sizing iteratively. */
export function runModel(inputs: ProjectInputs): ModelOutputs {
  const I = inputs;
  const baseUses = I.epcCost + I.developmentCost + I.substationContingency + I.dsraInitial;
  const consYears = I.constructionMonths / 12;

  // Closed-form IDC for a uniformly-drawn debt facility over construction:
  // average outstanding ≈ debt/2 over consYears, IDC = debt/2 * r * consYears
  // Plus commitment fee on undrawn: ~ debt/2 * commit * consYears
  // Upfront fee on full debt amount.
  const computeFinancingCosts = (debt: number) => {
    const idc = debt * 0.5 * I.interestRate * consYears;
    const upfront = debt * I.upfrontFeePct;
    const commitment = debt * 0.5 * I.commitmentFeePct * consYears;
    return { idc, upfront, commitment, fees: upfront + commitment };
  };

  let debt = baseUses * I.gearing / (1 - I.gearing); // initial guess
  let iter = 0;
  let converged = false;

  if (I.sizingMode === "fixed-gearing") {
    // Fixed-point iteration: total uses = base + IDC + fees; debt = gearing * total uses
    for (iter = 0; iter < 50; iter++) {
      const fc = computeFinancingCosts(debt);
      const totalUses = baseUses + fc.idc + fc.fees;
      const newDebt = totalUses * I.gearing;
      if (Math.abs(newDebt - debt) < 0.01) { converged = true; break; }
      debt = newDebt;
    }
  } else {
    // DSCR-sculpted: find max debt such that min DSCR >= target.
    // Bisection on debt amount.
    let lo = 0;
    let hi = baseUses * 5; // generous upper bound
    for (iter = 0; iter < 60; iter++) {
      const mid = (lo + hi) / 2;
      const fc = computeFinancingCosts(mid);
      const sim = simulate(I, mid, fc.idc, fc.fees);
      const dscrs = sim.rows.filter(r => r.debtService > 0 && r.year > I.constructionStart + Math.ceil(consYears) + I.graceYears - 1).map(r => r.dscr);
      const minDSCR = dscrs.length ? Math.min(...dscrs) : 0;
      if (minDSCR >= I.targetDSCR) {
        lo = mid;
      } else {
        hi = mid;
      }
      if (hi - lo < 1) { converged = true; break; }
    }
    debt = lo;
  }

  const fc = computeFinancingCosts(debt);
  const sim = simulate(I, debt, fc.idc, fc.fees);
  const totalUses = sim.totalCapex;

  // Construction-year sources & uses (uniform draw)
  const consYearCount = Math.max(1, Math.ceil(consYears));
  const constructionYears: number[] = [];
  const constructionDraws: number[] = [];
  const equityDraws: number[] = [];
  const debtDraws: number[] = [];
  for (let i = 0; i < consYearCount; i++) {
    constructionYears.push(I.constructionStart + i);
    constructionDraws.push(totalUses / consYearCount);
    equityDraws.push(sim.equityAmount / consYearCount);
    debtDraws.push(debt / consYearCount);
  }

  // KPIs
  const dscrs = sim.rows.filter(r => r.debtService > 0).map(r => r.dscr);
  const minDSCR = dscrs.length ? Math.min(...dscrs) : 0;
  const avgDSCR = dscrs.length ? dscrs.reduce((a, b) => a + b, 0) / dscrs.length : 0;

  // Project IRR cashflows: -capex (spread over construction), then operating CFADS-Tax (~ ebitda - tax)
  const projCF: number[] = [];
  for (let i = 0; i < consYearCount; i++) projCF.push(-constructionDraws[i]);
  sim.rows.forEach(r => projCF.push(r.ebitda - r.tax + r.workingCapitalChange));
  const projectIRR = irr(projCF, 0.08);
  const npvProject = npv(I.discountRateProject, projCF);

  // Equity IRR: -equity each construction year, then CFFI
  const eqCF: number[] = [];
  for (let i = 0; i < consYearCount; i++) eqCF.push(-equityDraws[i]);
  sim.rows.forEach(r => eqCF.push(r.cffi));
  // Add DSRA release at end
  if (eqCF.length > 0) eqCF[eqCF.length - 1] += I.dsraInitial;
  const equityIRR = irr(eqCF, 0.12);
  const npvEquity = npv(I.discountRateEquity, eqCF);

  // Payback (equity)
  let cum = 0;
  let payback = NaN;
  for (let i = 0; i < eqCF.length; i++) {
    cum += eqCF[i];
    if (cum >= 0 && isNaN(payback)) {
      payback = i;
      break;
    }
  }

  const totalRevenue = sim.rows.reduce((s, r) => s + r.revenue, 0);
  const totalOpex = sim.rows.reduce((s, r) => s + r.opex, 0);
  const totalCFADS = sim.rows.reduce((s, r) => s + r.cfads, 0);
  const totalMWh = sim.rows.reduce((s, r) => s + r.mwh, 0);

  // LCOE: total discounted cost / total discounted MWh (in USD per kWh)
  let dCost = 0, dMWh = 0;
  const dr = I.discountRateProject;
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
    constructionYears,
    constructionDraws,
    equityDraws,
    debtDraws,
    minDSCR,
    avgDSCR,
    projectIRR,
    equityIRR,
    npvProject,
    npvEquity,
    paybackYears: payback,
    lcoeUsdPerKWh,
    totalRevenue,
    totalOpex,
    totalCFADS,
    iterations: iter,
    converged,
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
