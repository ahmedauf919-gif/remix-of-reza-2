export function npv(rate: number, cashflows: number[]): number {
  let v = 0;
  for (let i = 0; i < cashflows.length; i++) v += cashflows[i] / Math.pow(1 + rate, i);
  return v;
}

export function irr(cashflows: number[], guess = 0.1): number {
  // Bisection over a wide range for robustness
  const f = (r: number) => npv(r, cashflows);
  let lo = -0.99;
  let hi = 1.0;
  let flo = f(lo);
  let fhi = f(hi);
  // expand hi if same sign
  let tries = 0;
  while (flo * fhi > 0 && tries < 20) {
    hi += 1.0;
    fhi = f(hi);
    tries++;
  }
  if (flo * fhi > 0) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (Math.abs(fm) < 1e-6) return mid;
    if (flo * fm < 0) {
      hi = mid;
      fhi = fm;
    } else {
      lo = mid;
      flo = fm;
    }
  }
  return (lo + hi) / 2;
}

export function pv(rate: number, values: number[]): number {
  return npv(rate, values);
}
