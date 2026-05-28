import type { Inputs, YearRow, ModelOutput, CapexItem } from "./types";
import { irr, npv } from "./finance";

interface AssetVintage {
  name: string;
  amount: number;
  life: number;
  startYearIdx: number; // index when depreciation starts
  shortLife: boolean;
}

export function runModel(inp: Inputs): ModelOutput {
  const startY = inp.constructionStartYear;
  const endY = inp.concessionEndYear;
  const N = Math.max(1, endY - startY + 1);
  const commIdx = inp.commissioningYear - startY + 1; // 1-based index
  const rows: YearRow[] = [];

  // Effective Zakat rate — calendar-aware. ZATCA statutory rate is 2.5% on Hijri year.
  // For Gregorian filers, base is grossed up by 365/354 → effective rate ≈ 2.5775%.
  // If user already provided a custom rate (anything other than the two canonical values),
  // respect it as an explicit override.
  const HIJRI_RATE = 0.025;
  const GREGORIAN_RATE = 0.025 * 365 / 354;
  const isCanonicalRate = Math.abs(inp.zakatRate - HIJRI_RATE) < 1e-6
    || Math.abs(inp.zakatRate - GREGORIAN_RATE) < 1e-6
    || Math.abs(inp.zakatRate - 0.02577) < 1e-4;
  const effectiveZakatRate = isCanonicalRate
    ? (inp.calendar === "hijri" ? HIJRI_RATE : GREGORIAN_RATE)
    : inp.zakatRate;

  // CapEx inputs are entered VAT-INCLUSIVE (gross). Engine extracts the VAT and
  // uses the ex-VAT amount as the base for RAB, depreciation, debt sizing and P&L.
  // The VAT portion is a cash-only initial outlay reimbursed via output VAT on
  // gas sales (tracked in the VAT recovery schedule) — never enters RAB or P&L.
  const vatRate = inp.capexVATRate ?? 0;
  const vatDivisor = 1 + vatRate;
  const exVAT = (gross: number) => gross / vatDivisor;

  // Build initial capex base totals (EX-VAT for RAB)
  const initialCapexBase = inp.capexItems.reduce((s, c) => s + exVAT(c.amount), 0)
    + inp.vehicleCount * exVAT(inp.vehicleUnitCost);
  const preOpCapex = initialCapexBase * inp.preOpCapexPct;
  const totalInitialCapex = initialCapexBase + preOpCapex; // ex-VAT

  // Vintages list — added during construction & later for replacements/expansions
  const vintages: AssetVintage[] = [];

  // Seed initial vintages phased across construction (years 1..commIdx)
  // Distribute across capex items pro-rata
  const phasing = inp.capexPhasing.slice(0, commIdx);
  const phaseSum = phasing.reduce((a, b) => a + b, 0) || 1;
  const normPhasing = phasing.map((p) => p / phaseSum);

  const allInitialItems: CapexItem[] = [
    ...inp.capexItems.map(c => ({ ...c, amount: exVAT(c.amount) })),
    { name: "Vehicles", amount: inp.vehicleCount * exVAT(inp.vehicleUnitCost), life: 5, shortLife: true },
    { name: "Pre-Operational", amount: preOpCapex, life: 30 },
  ];

  // CWIP schedule (construction)
  let cwip = 0;
  const cwipPerYear: { spend: number; ret: number; closing: number; transfer: number }[] = [];
  for (let i = 0; i < commIdx; i++) {
    const frac = normPhasing[i] ?? 0;
    const spend = totalInitialCapex * frac;
    const ret = (cwip + spend / 2) * inp.wacc; // approximate WACC return during the year
    cwip = cwip + spend + ret;
    const last = i === commIdx - 1;
    cwipPerYear.push({ spend, ret, closing: last ? 0 : cwip, transfer: last ? cwip : 0 });
    if (last) {
      // Create vintages on commissioning — distributed by item weight in initial capex
      const totalSeed = cwip;
      const grossInitial = allInitialItems.reduce((s, c) => s + c.amount, 0);
      for (const it of allInitialItems) {
        const remaining = Math.max(1, N - commIdx + 1);
        vintages.push({
          name: it.name,
          amount: totalSeed * (it.amount / grossInitial),
          life: Math.min(it.life, remaining), // cap life so RAB fully depreciates by concession end
          startYearIdx: commIdx,
          shortLife: !!it.shortLife,
        });
      }
      cwip = 0;
    }
  }

  // Debt: total finance = initial capex + preop (approx project cost)
  const projectCost = totalInitialCapex;
  const totalDebt = projectCost * inp.debtRatio;
  // Equity injected during construction pro-rata
  const equityTotal = projectCost - totalDebt;

  // Tariff baseline (re-derived at price control reviews)
  let currentTariff = inp.tariffYear1;
  let lastReviewIdx = commIdx;

  // Loss pool & retained earnings
  let lossPool = 0;
  let retainedEarnings = 0;
  let shareCapitalPaid = 0;
  let debtBalance = 0;
  let overdraft = 0;
  let cash = 0;
  let cumulativeFCF = 0;
  let prevAllowed = 0;
  let prevActual = 0;
  let lossPoolExhaustYear: number | null = null;
  let vatRecoverableBal = 0; // input VAT carried forward, offset against output VAT
  let prevAR = 0, prevInv = 0, prevAP = 0; // working capital opening

  for (let i = 1; i <= N; i++) {
    const year = startY + i - 1;
    const isConstruction = i < commIdx;
    const row: YearRow = blankRow(year, i, isConstruction);

    // Snapshot OPENING balances before any in-year mutations.
    // ZATCA requires opening equity / opening long-term liabilities for the Zakat base.
    const openingDebtBalance = debtBalance;
    const openingShareCapital = shareCapitalPaid;
    const openingRetainedEarnings = retainedEarnings;

    // === CWIP ===
    if (i <= commIdx) {
      const c = cwipPerYear[i - 1];
      row.cwipOpening = i === 1 ? 0 : (cwipPerYear[i - 2]?.closing ?? 0);
      row.cwipSpend = c.spend;
      row.cwipReturn = c.ret;
      row.cwipClosing = c.closing;
      row.cwipTransfer = c.transfer;
    }

    // === Customers & Volume ===
    if (!isConstruction) {
      const yearsPostComm = i - commIdx;
      const baseCust = inp.initialCustomers + inp.newCustomersPerYear * yearsPostComm;
      row.customers = baseCust;
      const growth = Math.pow(1 + inp.volumeGrowth, yearsPostComm);
      const baseVol = inp.initialCustomers * inp.volumePerCustomerMMBtu * growth;
      const newCust = Math.max(0, row.customers - inp.initialCustomers);
      const newVol = newCust * inp.volPerNewCustomerMMBtu * growth;
      const volCapMMBtu = inp.volumeCapMMSCFD * inp.gasConvMMBtuPerMMSCF * inp.daysPerYear;
      row.volumeMMBtu = Math.min(baseVol + newVol, volCapMMBtu);
    }

    // === RAB roll-forward ===
    const openingRAB = i === 1 ? 0 : rows[i - 2].closingRAB;
    row.openingRAB = openingRAB;

    // Expansion & connection capex are NOT added to RAB — only tracked for reporting / cohort IRR
    let expansionCapex = 0;
    let connectionCapex = 0;
    let newCustThisYear = 0;
    if (!isConstruction && i > commIdx) {
      newCustThisYear = Math.max(0, row.customers - rows[i - 2].customers);
      connectionCapex = newCustThisYear * inp.connectionCapexPerNewCustomer;
    } else if (i === commIdx) {
      newCustThisYear = row.customers;
    }
    row.newCustomersAdded = newCustThisYear;

    // Short-life asset replacement at end-of-life — each vintage retires exactly once at
    // (startYearIdx + life) and is replaced by a new vintage that takes over the schedule.
    let replacementCapex = 0;
    const replacements: AssetVintage[] = [];
    const replBreakdown: { name: string; amount: number }[] = [];
    for (const v of vintages) {
      if (!v.shortLife) continue;
      if (i !== v.startYearIdx + v.life) continue; // fires once at end of THIS vintage's life
      const remaining = N - i + 1;
      if (remaining <= 0) continue;
      const yearsSinceCommissioning = i - commIdx;
      const escFactor = inp.replacementCapexCPI ? Math.pow(1 + inp.cpi, Math.max(0, yearsSinceCommissioning)) : 1;
      const repl = v.amount * escFactor;
      replacementCapex += repl;
      const existing = replBreakdown.find(b => b.name === v.name);
      if (existing) existing.amount += repl;
      else replBreakdown.push({ name: v.name, amount: repl });
      replacements.push({ name: v.name, amount: repl, life: Math.min(v.life, remaining), startYearIdx: i, shortLife: true });
    }
    vintages.push(...replacements);
    row.replacementBreakdown = replBreakdown;

    row.initialCapexAdded = i === commIdx ? row.cwipTransfer : 0;
    if (i === commIdx) {
      const grossInitial = allInitialItems.reduce((s, c) => s + c.amount, 0) || 1;
      row.initialCapexBreakdown = allInitialItems.map(it => ({
        name: it.name,
        amount: row.cwipTransfer * (it.amount / grossInitial),
      }));
    }
    row.expansionCapexAdded = 0;
    row.replacementCapexAdded = replacementCapex;
    row.connectionCapexAdded = connectionCapex;
    row.capexAdditions = row.initialCapexAdded + replacementCapex;

    // Depreciation: sum over active vintages
    let dep = 0;
    let grossActive = 0;
    let accumActive = 0;
    for (const v of vintages) {
      if (i >= v.startYearIdx && i < v.startYearIdx + v.life) {
        dep += v.amount / v.life;
      }
      const yearsActive = Math.min(Math.max(0, i - v.startYearIdx + 1), v.life);
      grossActive += v.amount;
      accumActive += (v.amount / v.life) * yearsActive;
    }
    row.depreciation = dep;
    row.accumulatedDep = accumActive;
    row.netFixedAssets = Math.max(0, grossActive - accumActive);

    // RAB indexation
    row.rabIndex = 0;
    // Force terminal RAB to zero in the final concession year (true-up any residual via depreciation)
    if (i === N && !isConstruction) {
      const residual = openingRAB + row.capexAdditions + row.rabIndex;
      row.depreciation = Math.max(row.depreciation, residual);
      // re-sync accumulated dep with the residual write-off
      accumActive = grossActive;
      row.accumulatedDep = accumActive;
      row.netFixedAssets = 0;
    }
    row.closingRAB = Math.max(0, openingRAB + row.capexAdditions - row.depreciation + row.rabIndex);
    row.averageRAB = openingRAB === 0 ? row.closingRAB : (openingRAB + row.closingRAB) / 2;

    // === Building Blocks ===
    row.bb1Return = row.averageRAB * inp.wacc;
    row.bb2Dep = row.depreciation;

    // BB4 controllable escalated by (CPI - X)
    const baseControllable = inp.opexControllable.reduce((s, x) => s + x.amount, 0);
    const escFactor = isConstruction ? 0 : Math.pow(1 + inp.cpi - inp.opexEfficiencyX, i - commIdx);
    row.bb4Fixed = isConstruction ? 0 : baseControllable * escFactor;
    row.bb4Variable = 0;
    if (!isConstruction) {
      const odorant = row.volumeMMBtu * 0.0005 * inp.odorantSARperKG;
      const spares = grossActive * inp.sparePartsPctCapex;
      const consumables = inp.consumablesMonthly * 12;
      const scada = inp.scadaPerStationMonthly * 12 * inp.stationCount;
      const variableRate = inp.opexVariable.reduce((s, x) => s + x.ratePerMMBtu, 0);
      const cpiEsc = Math.pow(1 + inp.cpi, i - commIdx);
      const variableOpex = row.volumeMMBtu * variableRate * cpiEsc;
      const yearsPostComm = i - commIdx;
      let prmsMain = 0;
      let prmsClient = 0;
      if (yearsPostComm > 0 && (inp.prmsMainIntervalYears ?? 0) > 0
          && yearsPostComm % inp.prmsMainIntervalYears === 0) {
        prmsMain = inp.prmsMainCostPerMMBtu * 12 * cpiEsc;
      }
      if (yearsPostComm > 0 && (inp.prmsClientIntervalYears ?? 0) > 0
          && yearsPostComm % inp.prmsClientIntervalYears === 0) {
        prmsClient = inp.prmsClientCostPerMMBtu * 12 * cpiEsc;
      }
      row.bb4Variable = odorant + spares + consumables + scada + variableOpex + prmsMain + prmsClient;
    }
    row.bb4Controllable = row.bb4Fixed + row.bb4Variable;

    // BB5 pass-through (actual cost, escalate by CPI only — no efficiency cut)
    const basePT = inp.opexPassThrough.reduce((s, x) => s + x.amount, 0);
    row.bb5PassThrough = isConstruction ? 0 : basePT * Math.pow(1 + inp.cpi, i - commIdx);

    // BB6 reconciliation: true-up from previous year
    row.bb6Recon = i > commIdx ? prevAllowed - prevActual : 0;

    // === Tariff derivation ===
    row.bb3Tax = 0;
    const provisionalRevReq = row.bb1Return + row.bb2Dep + row.bb4Controllable + row.bb5PassThrough + row.bb6Recon;

    if (!isConstruction) {
      row.rabTariff = row.volumeMMBtu > 0 ? Math.max(0, provisionalRevReq / row.volumeMMBtu) : 0;
      if (inp.tariffMode === "rab") {
        currentTariff = row.rabTariff;
        lastReviewIdx = i;
      } else {
        const sinceReview = i - lastReviewIdx;
        if (inp.applyPriceControl && sinceReview >= inp.priceControlYears) {
          currentTariff = row.rabTariff;
          lastReviewIdx = i;
        } else if (i > commIdx) {
          if (inp.applyTariffInflation) currentTariff = currentTariff * (1 + inp.cpi);
        }
      }
      row.actualTariff = currentTariff;
      row.tariffCoverage = row.rabTariff > 0 ? currentTariff / row.rabTariff : 0;
    }

    // === Income Statement ===
    row.gasRevenue = isConstruction ? 0 : row.actualTariff * row.volumeMMBtu;
    row.commodityRevenue = isConstruction ? 0 : inp.gasCommodityPrice * row.volumeMMBtu;
    const dCust = i > commIdx ? Math.max(0, row.customers - rows[i - 2].customers) : (i === commIdx ? row.customers : 0);
    row.connectionRevenue = dCust * inp.connectionFee;
    row.totalRevenue = row.gasRevenue + row.commodityRevenue + row.connectionRevenue;

    const variableCogs = isConstruction ? 0 : (inp.consumablesMonthly * 12);
    row.cogs = row.commodityRevenue + variableCogs;
    row.grossProfit = row.totalRevenue - row.cogs;

    row.gAndA = isConstruction ? 0 : (row.bb4Controllable - variableCogs) + row.bb5PassThrough;
    row.ebitda = row.grossProfit - row.gAndA;
    row.da = row.depreciation;
    row.ebit = row.ebitda - row.da;

    // === Financing ===
    if (isConstruction) {
      const phaseFrac = normPhasing[i - 1] ?? 0;
      row.debtDrawdown = totalDebt * phaseFrac;
      debtBalance += row.debtDrawdown;
      shareCapitalPaid += equityTotal * phaseFrac;
      row.loanFees = totalDebt * (inp.loanFeesPct ?? 0) * phaseFrac;
    }
    const grace = Math.max(0, inp.debtGracePeriod ?? 0);
    if (!isConstruction && i >= commIdx + grace) {
      const yearOfRepay = i - commIdx - grace + 1;
      if (yearOfRepay <= inp.debtTenor) {
        row.debtRepayment = totalDebt / inp.debtTenor;
        debtBalance = Math.max(0, debtBalance - row.debtRepayment);
      }
    }
    row.ltDebtBalance = debtBalance;

    const loanInterest = row.ltDebtBalance > 0 || row.debtRepayment > 0
      ? (debtBalance + row.debtRepayment) * inp.debtRate
      : 0;
    const overdraftInterest = overdraft * inp.overdraftRate;
    row.interest = isConstruction ? row.loanFees : loanInterest + overdraftInterest;
    row.ebt = row.ebit - row.interest;

    // === Tax / Zakat ===
    let zakatDue = 0;
    let citDue = 0;
    const ownership = inp.ownership;
    const saudiShare = ownership === "saudi" ? 1 : ownership === "foreign" ? 0 : inp.saudiPct;
    const foreignShare = 1 - saudiShare;

    if (foreignShare > 0 && !isConstruction) {
      const ebtForeign = row.ebt * foreignShare;
      if (ebtForeign <= 0) {
        lossPool += Math.abs(ebtForeign);
        row.openingLossPool = lossPool - Math.abs(ebtForeign);
        row.closingLossPool = lossPool;
      } else {
        row.openingLossPool = lossPool;
        const maxOffset = Math.min(lossPool, ebtForeign * inp.lossOffsetCap);
        row.lossOffsetUsed = maxOffset;
        const taxable = ebtForeign - maxOffset;
        citDue = taxable * inp.citRate;
        lossPool -= maxOffset;
        row.closingLossPool = lossPool;
        if (lossPool === 0 && lossPoolExhaustYear === null && row.openingLossPool > 0) {
          lossPoolExhaustYear = year;
        }
      }
    } else {
      row.openingLossPool = lossPool;
      row.closingLossPool = lossPool;
    }

    row.shareCapital = shareCapitalPaid;
    row.retainedEarnings = retainedEarnings;
    if (saudiShare > 0 && !isConstruction) {
      // ZATCA Zakat base = Sources of funds - Uses of funds (deductible assets)
      //   Sources: OPENING equity (paid-up capital + retained earnings) + OPENING long-term liabilities
      //            (only the portion remaining beyond 12 months — exclude current portion of LT debt)
      //   Uses:    Net fixed assets + CWIP + long-term investments + deferred charges
      // Floor: Zakat base shall NOT be less than "adjusted net profit" (الربح المعدل) per ZATCA Art.6.
      //   Strict definition = Accounting Net Profit + non-deductible expenses - exempt income
      //                     + unpaid provisions - reversed prior-year provisions (Zakat itself NOT added back).
      //   Proxy used here  = EBT (pre-Zakat profit). Valid for this SPV because there are no related-party
      //   loans, no exempt dividend income, no entertainment/fines/donations, and no discretionary
      //   provisions — so every ZATCA adjustment evaluates to zero and Adjusted Net Profit ≡ EBT.
      //   If the model later adds holding-company features, replace ebtFloorShare with an explicit
      //   adjustment layer (nonDeductibleOpex, exemptIncome, provisionsNet).
      // No upper cap — when LT debt is large the base can legitimately exceed equity.
      // Calendar: rate input already encodes Hijri (2.50%) vs Gregorian (≈2.5775% = 2.5% × 365/354).
      const currentPortion = row.debtRepayment; // next-12-months principal classified as current
      const longTermDebt = Math.max(0, openingDebtBalance - currentPortion);
      const equity = openingShareCapital + Math.max(0, openingRetainedEarnings);
      const sources = (equity + longTermDebt) * saudiShare;
      const uses = (row.netFixedAssets + row.cwipClosing) * saudiShare;
      const rawBase = sources - uses;
      const ebtFloorShare = Math.max(0, row.ebt) * saudiShare; // adjusted net profit proxy (see comment above)
      const finalBase = Math.max(ebtFloorShare, Math.max(0, rawBase));
      row.zakatBaseRaw = rawBase;
      row.zakatBaseFinal = finalBase;
      zakatDue = finalBase * effectiveZakatRate;
    }

    row.zakat = zakatDue;
    row.cit = citDue;
    row.taxZakatTotal = zakatDue + citDue;
    row.bb3Tax = row.taxZakatTotal;
    row.revenueRequirement = row.bb1Return + row.bb2Dep + row.bb3Tax + row.bb4Controllable + row.bb5PassThrough + row.bb6Recon;

    row.netProfit = row.ebt - row.taxZakatTotal;
    retainedEarnings += row.netProfit;
    row.dividend = (!isConstruction && row.netProfit > 0)
      ? row.netProfit * (inp.dividendPayoutRatio ?? 0)
      : 0;
    row.dividendWHT = row.dividend * (inp.withholdingTaxRate ?? 0);
    row.dividendNet = row.dividend - row.dividendWHT;
    retainedEarnings -= row.dividend;

    // === VAT (cash-only per Saudi VAT Law — not P&L, not RAB) ===
    // Input VAT paid on capex spend this year (construction CWIP + post-comm replacement).
    // Output VAT collected only on distribution (tariff×volume) revenue — commodity is a
    // pure pass-through with VAT already handled by ARAMCO; connection fee VAT is immaterial here.
    // Recoverable balance offsets output VAT; excess output is remitted to ZATCA.
    // vatRate already declared at top of runModel (ex-VAT helper).
    row.inputVATPaid = isConstruction
      ? row.cwipSpend * vatRate
      : replacementCapex * vatRate;
    row.outputVATCollected = isConstruction ? 0 : row.gasRevenue * vatRate;
    const vatRecOpening = vatRecoverableBal;
    const availableCredit = vatRecOpening + row.inputVATPaid;
    row.vatRemitted = Math.max(0, row.outputVATCollected - availableCredit);
    vatRecoverableBal = Math.max(0, availableCredit - row.outputVATCollected);
    row.vatRecoverable = vatRecoverableBal;
    // Net VAT cash impact = +collected - paid on capex - remitted to ZATCA
    row.netVATCash = row.outputVATCollected - row.inputVATPaid - row.vatRemitted;

    // === Working Capital (operating years only) ===
    if (!isConstruction) {
      row.accountsReceivable = (row.totalRevenue / 365) * (inp.daysReceivable ?? 0);
      row.inventory = (row.cogs / 365) * (inp.daysInventory ?? 0);
      row.accountsPayable = ((row.cogs + row.gAndA) / 365) * (inp.daysPayable ?? 0);
    }
    row.workingCapital = row.accountsReceivable + row.inventory - row.accountsPayable;
    row.deltaWorkingCapital = row.workingCapital - (prevAR + prevInv - prevAP);
    prevAR = row.accountsReceivable; prevInv = row.inventory; prevAP = row.accountsPayable;

    // === Cash Flow ===
    // Levered OCF: netProfit + D&A − ΔWC (indirect method).
    row.ocf = isConstruction ? 0 : (row.netProfit + row.da - row.deltaWorkingCapital);
    row.icf = isConstruction ? -row.cwipSpend : -replacementCapex;

    // Project (unlevered) FCF — used for project IRR. Independent of financing.
    // VAT on capex is a real cash outflow during construction even though it's
    // recovered later via output VAT — include net VAT cash in project FCF.
    row.fcf = isConstruction
      ? -row.cwipSpend + row.netVATCash
      : (row.ebitda - row.taxZakatTotal - replacementCapex - row.deltaWorkingCapital + row.netVATCash);

    // Cash balance: include net VAT cash (off-P&L) on top of OCF/ICF/financing.
    const financingCFCash = row.debtDrawdown - row.debtRepayment
      + (isConstruction ? equityTotal * (normPhasing[i - 1] ?? 0) : 0);
    let netCash = row.ocf + row.icf + financingCFCash - row.dividend + row.netVATCash;

    if (cash + netCash < 0) {
        const need = -(cash + netCash);
        const draw = Math.min(need, inp.overdraftLimit - overdraft);
        overdraft += draw;
        netCash += draw;
      } else if (overdraft > 0 && cash + netCash > 0) {
        const repay = Math.min(overdraft, cash + netCash);
        overdraft -= repay;
        netCash -= repay;
      }
    cash = Math.max(0, cash + netCash);
    row.cashBalance = cash;
    row.overdraftBalance = overdraft;

    // Equity FCF (to equity holders): levered OCF + ICF + net debt flows.
    // Equity injection is added separately at IRR time, not here.
    // Net VAT cash is real cash to equity (input VAT funded by equity/debt during construction;
    // recovered through output VAT post-commissioning). Include in equity FCF.
    row.fcfEquity = row.ocf + row.icf + (row.debtDrawdown - row.debtRepayment) + row.netVATCash;
    row.equityCashFlow = row.fcfEquity;
    cumulativeFCF += row.fcf;
    row.cumulativeFCF = cumulativeFCF;

    const debtService = row.debtRepayment + (loanInterest);
    row.dscr = debtService > 0 ? (row.ebitda) / debtService : null;

    // BB6 true-up compares allowed DISTRIBUTION revenue vs actual DISTRIBUTION revenue.
    // Commodity is a pure pass-through and is excluded from both sides.
    prevAllowed = row.bb1Return + row.bb2Dep + row.bb3Tax + row.bb4Controllable + row.bb5PassThrough;
    prevActual = row.gasRevenue;

    rows.push(row);
  }

  // === KPIs ===
  const projectCFs = rows.map((r) => r.fcf);
  // Equity IRR: fcfEquity already nets (ocf + icf + debt draw - debt repay).
  // During construction that resolves to -(equity portion of capex), i.e. the
  // equity injection. Do NOT subtract equity injection again — double-count.
  const equityCFs = rows.map((r) => r.fcfEquity);
  const projectIRR = irr(projectCFs);
  const equityIRR = irr(equityCFs);
  // Dividend IRR: equity injections (out) + net dividends received (in) + terminal book equity at end
  const lastRow = rows[rows.length - 1];
  const terminalEquity = lastRow ? Math.max(0, lastRow.shareCapital + lastRow.retainedEarnings) : 0;
  const dividendCFs = rows.map((r, i) => {
    const eqInj = r.isConstruction ? -(equityTotal * (normPhasing[i] ?? 0)) : 0;
    const terminal = i === rows.length - 1 ? terminalEquity : 0;
    return eqInj + r.dividendNet + terminal;
  });
  const dividendIRR = irr(dividendCFs);
  const projectNPV = npv(inp.wacc, projectCFs);

  let payback: number | null = null;
  let cum = 0;
  for (let i = 0; i < rows.length; i++) {
    cum += rows[i].fcf;
    if (cum >= 0) { payback = i + 1; break; }
  }

  const volSeries = rows.map((r) => r.volumeMMBtu);
  const pvVol = npv(inp.wacc, volSeries);

  const bb1 = npv(inp.wacc, rows.map((r) => r.bb1Return));
  const bb2 = npv(inp.wacc, rows.map((r) => r.bb2Dep));
  const bb3 = npv(inp.wacc, rows.map((r) => r.bb3Tax));
  const bb4 = npv(inp.wacc, rows.map((r) => r.bb4Controllable));
  const bb5 = npv(inp.wacc, rows.map((r) => r.bb5PassThrough));
  const lcoeRAB = pvVol > 0 ? (bb1 + bb2 + bb3 + bb4 + bb5) / pvVol : 0;

  const capexPV = npv(inp.wacc, rows.map((r, i) => (r.isConstruction ? r.cwipSpend : (r.capexAdditions - (i + 1 === commIdx ? r.cwipTransfer : 0)))));
  const opexPV = bb4 + bb5;
  const taxPV = bb3;
  const lcoeUnlevered = pvVol > 0 ? (capexPV + opexPV + taxPV) / pvVol : 0;

  const totalVol = rows.reduce((s, r) => s + r.volumeMMBtu, 0);
  const totalRev = rows.reduce((s, r) => s + r.gasRevenue, 0);
  const rabTariffAvg = totalVol > 0
    ? rows.reduce((s, r) => s + r.rabTariff * r.volumeMMBtu, 0) / totalVol
    : 0;

  const dscrs = rows.filter((r) => r.dscr !== null && r.debtRepayment > 0).map((r) => r.dscr as number);
  const minDSCR = dscrs.length ? Math.min(...dscrs) : null;

  const peakOd = Math.max(...rows.map((r) => r.overdraftBalance));
  const peakOdPct = inp.overdraftLimit > 0 ? peakOd / inp.overdraftLimit : 0;

  const totalTaxZakat = rows.reduce((s, r) => s + r.taxZakatTotal, 0);
  const totalCapex = totalInitialCapex + rows.reduce((s, r, i) => s + (i + 1 > commIdx ? r.capexAdditions : 0), 0);

  const lcoeBreakdown = [
    { label: "Return on Capital (BB1)", value: pvVol > 0 ? bb1 / pvVol : 0, pct: bb1 / (bb1 + bb2 + bb3 + bb4 + bb5) },
    { label: "Depreciation (BB2)", value: pvVol > 0 ? bb2 / pvVol : 0, pct: bb2 / (bb1 + bb2 + bb3 + bb4 + bb5) },
    { label: "Tax/Zakat (BB3)", value: pvVol > 0 ? bb3 / pvVol : 0, pct: bb3 / (bb1 + bb2 + bb3 + bb4 + bb5) },
    { label: "Controllable OPEX (BB4)", value: pvVol > 0 ? bb4 / pvVol : 0, pct: bb4 / (bb1 + bb2 + bb3 + bb4 + bb5) },
    { label: "Pass-Through OPEX (BB5)", value: pvVol > 0 ? bb5 / pvVol : 0, pct: bb5 / (bb1 + bb2 + bb3 + bb4 + bb5) },
  ];

  return {
    rows,
    kpi: {
      rabTariffAvg,
      lcoeRAB,
      lcoeUnlevered,
      projectIRR,
      equityIRR,
      dividendIRR,
      npv: projectNPV,
      paybackYears: payback,
      totalCapex,
      totalRevenue: totalRev,
      minDSCR,
      peakOverdraftPct: peakOdPct,
      closingLossPool: lossPool,
      lossPoolExhaustYear,
      totalTaxZakat,
    },
    lcoeBreakdown,
  };
}

function blankRow(year: number, idx: number, isConstruction: boolean): YearRow {
  return {
    year, idx, isConstruction,
    customers: 0, newCustomersAdded: 0, volumeMMBtu: 0,
    cwipOpening: 0, cwipSpend: 0, cwipReturn: 0, cwipClosing: 0, cwipTransfer: 0,
    openingRAB: 0, capexAdditions: 0, connectionCapexAdded: 0, expansionCapexAdded: 0, replacementCapexAdded: 0, replacementBreakdown: [], initialCapexAdded: 0, initialCapexBreakdown: [],
    depreciation: 0, rabIndex: 0, closingRAB: 0, averageRAB: 0,
    netFixedAssets: 0, accumulatedDep: 0,
    bb1Return: 0, bb2Dep: 0, bb3Tax: 0, bb4Controllable: 0, bb4Fixed: 0, bb4Variable: 0, bb5PassThrough: 0, bb6Recon: 0, revenueRequirement: 0,
    rabTariff: 0, actualTariff: 0, tariffCoverage: 0,
    gasRevenue: 0, commodityRevenue: 0, connectionRevenue: 0, totalRevenue: 0,
    cogs: 0, grossProfit: 0, gAndA: 0, ebitda: 0, da: 0, ebit: 0, interest: 0, ebt: 0,
    zakat: 0, cit: 0, taxZakatTotal: 0, netProfit: 0,
    openingLossPool: 0, lossOffsetUsed: 0, closingLossPool: 0,
    shareCapital: 0, retainedEarnings: 0, ltDebtBalance: 0, zakatBaseRaw: 0, zakatBaseFinal: 0,
    ocf: 0, icf: 0, fcf: 0, fcfEquity: 0, equityCashFlow: 0,
    debtDrawdown: 0, debtRepayment: 0, overdraftBalance: 0, cashBalance: 0, cumulativeFCF: 0,
    loanFees: 0, dividend: 0, dividendWHT: 0, dividendNet: 0,
    inputVATPaid: 0, outputVATCollected: 0, vatRemitted: 0, vatRecoverable: 0, netVATCash: 0,
    accountsReceivable: 0, inventory: 0, accountsPayable: 0, workingCapital: 0, deltaWorkingCapital: 0,
    dscr: null,
  };
}
