export type Ownership = "saudi" | "foreign" | "mixed";
export type CalendarBasis = "hijri" | "gregorian";


export interface CapexItem {
  name: string;
  amount: number;
  life: number;
  shortLife?: boolean; // replaced at end of life
}

export interface Inputs {
  // Timeline
  constructionStartYear: number;
  commissioningYear: number;
  concessionEndYear: number;

  // Ownership
  ownership: Ownership;
  saudiPct: number; // 0..1 (used when mixed)

  // Macro
  cpi: number;
  fx: number;
  wacc: number;
  vat: number;
  calendar: CalendarBasis;
  opexEfficiencyX: number;
  priceControlYears: number;
  applyPriceControl: boolean;
  replacementCapexCPI: boolean;

  // Customers & Volume
  initialCustomers: number;
  newCustomersPerYear: number;
  volumeCapMMSCFD: number; // MMSCF/day cap on total throughput
  volumeGrowth: number;
  volumePerCustomerMMBtu: number; // base customers, MMBtu/year
  volPerNewCustomerMMBtu: number; // new customers, MMBtu/year

  // Revenue
  tariffYear1: number;
  gasCommodityPrice: number;
  connectionFee: number;
  connectionCapexPerNewCustomer: number;
  connectionCapexLife: number;
  tariffMode: "rab" | "fixed";
  applyTariffInflation: boolean;

  // CapEx (amounts entered EXCLUDING VAT)
  capexItems: CapexItem[];
  expansionCapexPerCustomer: number;
  vehicleCount: number;
  vehicleUnitCost: number;
  preOpCapexPct: number; // of initial capex
  capexPhasing: [number, number, number]; // year 1,2,3 fractions
  capexVATRate: number; // VAT % paid on capex (cash only, not P&L, not RAB)

  // Working Capital
  daysReceivable: number;
  daysInventory: number;
  daysPayable: number;

  // OPEX — controllable (Year 1)
  opexControllable: { name: string; amount: number }[];
  // Pass-through
  opexPassThrough: { name: string; amount: number }[];
  // Variable (SAR per MMBtu, scales with volume, escalated by CPI)
  opexVariable: { name: string; ratePerMMBtu: number }[];
  // PRMS periodic maintenance — fires every N years post-commissioning, escalated by CPI
  prmsMainCapacityMMSCF: number;       // main station capacity in MMSCF
  prmsMainCostPerMMBtu: number;        // SAR per MMBtu of capacity
  prmsMainIntervalYears: number;       // every N years
  prmsClientCostPerMMBtu: number;      // SAR per MMBtu of current-year client volume
  prmsClientIntervalYears: number;     // every N years
  // Variable
  odorantSARperKG: number;
  sparePartsPctCapex: number;
  consumablesMonthly: number;
  scadaPerStationMonthly: number;
  stationCount: number;

  // Financing
  debtRatio: number;
  debtRate: number;
  debtTenor: number;
  debtGracePeriod: number; // years after commissioning before principal repayment
  loanFeesPct: number; // one-time loan arrangement fee as % of total debt
  dividendPayoutRatio: number; // 0..1 of net profit distributed as dividend
  withholdingTaxRate: number; // 0..1 on dividends
  overdraftLimit: number;
  overdraftRate: number;

  // Zakat
  zakatRate: number; // computed from calendar
  // Tax
  citRate: number;
  lossOffsetCap: number; // 0.25

  gasConvMMBtuPerMMSCF: number;
  daysPerYear: number;
}

export interface YearRow {
  year: number;
  idx: number; // 1-based
  isConstruction: boolean;

  // Customers & volume
  customers: number;
  newCustomersAdded: number;
  volumeMMBtu: number;

  // CWIP / RAB
  cwipOpening: number;
  cwipSpend: number;
  cwipReturn: number;
  cwipClosing: number;
  cwipTransfer: number;

  openingRAB: number;
  capexAdditions: number;
  connectionCapexAdded: number;
  expansionCapexAdded: number;
  replacementCapexAdded: number;
  replacementBreakdown: { name: string; amount: number }[];
  initialCapexAdded: number;
  initialCapexBreakdown: { name: string; amount: number }[];
  depreciation: number;
  rabIndex: number;
  closingRAB: number;
  averageRAB: number;
  netFixedAssets: number; // gross - accumulated dep
  accumulatedDep: number;

  // Building blocks
  bb1Return: number;
  bb2Dep: number;
  bb3Tax: number;
  bb4Controllable: number;
  bb4Fixed: number;
  bb4Variable: number;
  bb5PassThrough: number;
  bb6Recon: number;
  revenueRequirement: number;

  // Tariff
  rabTariff: number;
  actualTariff: number;
  tariffCoverage: number;

  // P&L
  gasRevenue: number;
  commodityRevenue: number;
  connectionRevenue: number;
  totalRevenue: number;
  cogs: number;
  grossProfit: number;
  gAndA: number;
  ebitda: number;
  da: number;
  ebit: number;
  interest: number;
  ebt: number;
  zakat: number;
  cit: number;
  taxZakatTotal: number;
  netProfit: number;

  // Loss pool
  openingLossPool: number;
  lossOffsetUsed: number;
  closingLossPool: number;

  // Zakat schedule pieces
  shareCapital: number;
  retainedEarnings: number;
  ltDebtBalance: number;
  zakatBaseRaw: number;
  zakatBaseFinal: number;

  // Cash
  ocf: number;
  icf: number;
  fcf: number;
  fcfEquity: number;
  debtDrawdown: number;
  debtRepayment: number;
  overdraftBalance: number;
  cashBalance: number;
  cumulativeFCF: number;
  equityCashFlow: number;
  loanFees: number;
  dividend: number;
  dividendWHT: number;
  dividendNet: number;

  // VAT (cash only — not in P&L per Saudi VAT law)
  inputVATPaid: number;       // VAT paid on capex this year
  outputVATCollected: number; // VAT collected on distribution revenue
  vatRemitted: number;        // VAT remitted to ZATCA
  vatRecoverable: number;     // EoP recoverable VAT balance
  netVATCash: number;         // net cash impact from VAT

  // Working capital
  accountsReceivable: number;
  inventory: number;
  accountsPayable: number;
  workingCapital: number;
  deltaWorkingCapital: number;

  // DSCR
  dscr: number | null;
}

export interface ModelOutput {
  rows: YearRow[];
  kpi: {
    rabTariffAvg: number;
    lcoeRAB: number;
    lcoeUnlevered: number;
    projectIRR: number;
    equityIRR: number;
    dividendIRR: number;
    npv: number;
    paybackYears: number | null;
    totalCapex: number;
    totalRevenue: number;
    minDSCR: number | null;
    peakOverdraftPct: number;
    closingLossPool: number;
    lossPoolExhaustYear: number | null;
    totalTaxZakat: number;
  };
  lcoeBreakdown: { label: string; value: number; pct: number }[];
}
