export const fmtSAR = (v: number, dp = 0) =>
  isFinite(v)
    ? v.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp })
    : "—";

export const fmtMSAR = (v: number) => {
  if (!isFinite(v)) return "—";
  const abs = Math.abs(v);
  if (abs >= 1e9) return (v / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return (v / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return (v / 1e3).toFixed(1) + "K";
  return v.toFixed(0);
};

export const fmtPct = (v: number, dp = 2) =>
  isFinite(v) ? (v * 100).toFixed(dp) + "%" : "—";

export const fmtTariff = (v: number) =>
  isFinite(v) ? v.toFixed(4) : "—";
