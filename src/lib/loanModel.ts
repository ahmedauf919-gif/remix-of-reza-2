export type Currency = "EGP" | "EUR" | "JPY" | "USD";

export interface Tranche {
  id: number;
  lender: string;
  currency: Currency;
  group: number; // tenor group label from source
  principal: number; // initial principal in tranche currency
  tenorYears: number; // amortization years
  rate: number; // annual interest rate (decimal)
  graceYears?: number; // years before principal repayment starts
}

export interface FxRates {
  EGP: number; // EGP per USD
  EUR: number; // EUR per USD
  JPY: number; // JPY per USD
}

export const DEFAULT_FX: FxRates = { EGP: 54, EUR: 0.87, JPY: 159.62 };

export const DEFAULT_TRANCHES: Tranche[] = [
  { id: 1, lender: "NIB", currency: "EGP", group: 5, principal: 103.68, tenorYears: 3, rate: 0.075 },
  { id: 2, lender: "NIB", currency: "EGP", group: 5, principal: 18.0, tenorYears: 3, rate: 0.12 },
  { id: 3, lender: "ICO", currency: "EUR", group: 5, principal: 19.14, tenorYears: 10, rate: 0.011818 },
  { id: 4, lender: "NIB", currency: "EGP", group: 6, principal: 117.612, tenorYears: 10, rate: 0.090909 },
  { id: 5, lender: "NIB", currency: "EGP", group: 6, principal: 20.79, tenorYears: 10, rate: 0.145455 },
  { id: 6, lender: "KFW", currency: "EUR", group: 6, principal: 23.751, tenorYears: 20, rate: 0.007238 },
  { id: 7, lender: "NIB", currency: "EGP", group: 7, principal: 427.68, tenorYears: 3, rate: 0.075 },
  { id: 8, lender: "NIB", currency: "EGP", group: 7, principal: 74.88, tenorYears: 3, rate: 0.12 },
  { id: 9, lender: "JICA", currency: "JPY", group: 7, principal: 9632.4463, tenorYears: 18, rate: 0.0072 },
  { id: 10, lender: "NIB", currency: "EGP", group: 8, principal: 190.08, tenorYears: 3, rate: 0.075 },
  { id: 11, lender: "NIB", currency: "EGP", group: 8, principal: 33.12, tenorYears: 3, rate: 0.12 },
];

export const START_YEAR = 2026;
export const NUM_YEARS = 20;
export const YEARS = Array.from({ length: NUM_YEARS }, (_, i) => START_YEAR + i);

export interface Schedule {
  balance: number[];
  principal: number[];
  interest: number[];
}

export function buildSchedule(t: Tranche): Schedule {
  const balance = new Array(NUM_YEARS).fill(0);
  const principal = new Array(NUM_YEARS).fill(0);
  const interest = new Array(NUM_YEARS).fill(0);
  const grace = t.graceYears ?? 0;
  const annualPrincipal = t.principal / t.tenorYears;
  let remaining = t.principal;
  for (let y = 0; y < NUM_YEARS; y++) {
    // Interest charged on opening balance
    const opening = remaining;
    let pay = 0;
    if (y >= grace && y < grace + t.tenorYears) {
      pay = annualPrincipal;
    }
    interest[y] = opening * t.rate;
    principal[y] = pay;
    remaining = Math.max(0, remaining - pay);
    balance[y] = remaining;
  }
  return { balance, principal, interest };
}

export function toUsd(value: number, ccy: Currency, fx: FxRates): number {
  if (ccy === "USD") return value;
  return value / fx[ccy];
}

export interface ComputedTranche {
  tranche: Tranche;
  native: Schedule;
  usd: Schedule;
}

export function computeAll(tranches: Tranche[], fx: FxRates): ComputedTranche[] {
  return tranches.map((t) => {
    const native = buildSchedule(t);
    const usd: Schedule = {
      balance: native.balance.map((v) => toUsd(v, t.currency, fx)),
      principal: native.principal.map((v) => toUsd(v, t.currency, fx)),
      interest: native.interest.map((v) => toUsd(v, t.currency, fx)),
    };
    return { tranche: t, native, usd };
  });
}

export function sumByYear(computed: ComputedTranche[], field: keyof Schedule): number[] {
  const totals = new Array(NUM_YEARS).fill(0);
  computed.forEach((c) => c.usd[field].forEach((v, i) => (totals[i] += v)));
  return totals;
}

export function fmt(n: number, digits = 2): string {
  if (!isFinite(n)) return "-";
  if (Math.abs(n) < 0.005) return "-";
  return n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
