export function npv(rate: number, cashflows: number[]): number {
  let v = 0;
  for (let i = 0; i < cashflows.length; i++) v += cashflows[i] / Math.pow(1 + rate, i);
  return v;
}

export function irr(cashflows: number[], guess = 0.1): number {
  // Grid-scan for a bracketing sign change, then bisect. Endpoint-only sign checks
  // miss roots when the NPV curve crosses zero multiple times (multi-sign-change FCF).
  const f = (r: number) => npv(r, cashflows);
  let lo = NaN;
  let hi = NaN;
  let flo = NaN;
  let fhi = NaN;
  const step = 0.01;
  let prevR = -0.9;
  let prevF = f(prevR);
  for (let r = prevR + step; r <= 1.0 + 1e-12; r += step) {
    const fr = f(r);
    if (Number.isFinite(prevF) && Number.isFinite(fr) && prevF * fr <= 0) {
      lo = prevR; flo = prevF;
      hi = r; fhi = fr;
      break;
    }
    prevR = r;
    prevF = fr;
  }
  // If no bracket in the grid, try expanding upward in coarse steps
  if (!Number.isFinite(lo)) {
    prevR = 1.0;
    prevF = f(prevR);
    for (let r = 2.0; r <= 21.0; r += 1.0) {
      const fr = f(r);
      if (Number.isFinite(prevF) && Number.isFinite(fr) && prevF * fr <= 0) {
        lo = prevR; flo = prevF;
        hi = r; fhi = fr;
        break;
      }
      prevR = r;
      prevF = fr;
    }
  }
  if (!Number.isFinite(lo)) return NaN;
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
