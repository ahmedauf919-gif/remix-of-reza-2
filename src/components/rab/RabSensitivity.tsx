import * as React from "react";
import type { Inputs } from "@/lib/rab/types";
import { runModel } from "@/lib/rab/engine";
import { fmtMSAR, fmtPct, fmtTariff } from "@/lib/rab/format";

type Variable = {
  key: string;
  label: string;
  unit: string;
  base: (i: Inputs) => number;
  apply: (i: Inputs, v: number) => Inputs;
  fmt: (v: number) => string;
};

const VARS: Variable[] = [
  { key: "wacc", label: "WACC", unit: "%", base: i => i.wacc, apply: (i, v) => ({ ...i, wacc: v }), fmt: fmtPct },
  { key: "tariffYear1", label: "Initial Tariff", unit: "SAR/MMBtu", base: i => i.tariffYear1, apply: (i, v) => ({ ...i, tariffYear1: v }), fmt: fmtTariff },
  { key: "newCustomersPerYear", label: "New Customers / Year", unit: "", base: i => i.newCustomersPerYear, apply: (i, v) => ({ ...i, newCustomersPerYear: v }), fmt: (v) => v.toFixed(0) },
  { key: "volumeGrowth", label: "Volume Growth", unit: "%", base: i => i.volumeGrowth, apply: (i, v) => ({ ...i, volumeGrowth: v }), fmt: fmtPct },
  { key: "cpi", label: "CPI", unit: "%", base: i => i.cpi, apply: (i, v) => ({ ...i, cpi: v }), fmt: fmtPct },
  { key: "debtRate", label: "Debt Rate", unit: "%", base: i => i.debtRate, apply: (i, v) => ({ ...i, debtRate: v }), fmt: fmtPct },
];

const DELTAS = [-0.2, -0.1, 0, 0.1, 0.2];

export function Sensitivity({ inp }: { inp: Inputs }) {
  const [varKey, setVarKey] = React.useState("wacc");
  const variable = VARS.find(v => v.key === varKey)!;

  const rows = React.useMemo(() => {
    const base = variable.base(inp);
    return DELTAS.map(d => {
      const v = base * (1 + d);
      const m = runModel(variable.apply(inp, v));
      return {
        delta: d, value: v,
        tariff: m.kpi.rabTariffAvg,
        lcoe: m.kpi.lcoeRAB,
        irr: m.kpi.projectIRR,
        npv: m.kpi.npv,
        payback: m.kpi.paybackYears,
      };
    });
  }, [inp, variable]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Sensitivity variable:</label>
        <select
          value={varKey}
          onChange={(e) => setVarKey(e.target.value)}
          className="rounded-md border border-border bg-input px-3 py-1.5 text-sm"
        >
          {VARS.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
        </select>
        <span className="text-xs text-muted-foreground">Base: {variable.fmt(variable.base(inp))}</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Δ {variable.label}</th>
              <th className="px-3 py-2 text-right">Value</th>
              <th className="px-3 py-2 text-right">Avg Tariff</th>
              <th className="px-3 py-2 text-right">LCOE</th>
              <th className="px-3 py-2 text-right">Project IRR</th>
              <th className="px-3 py-2 text-right">NPV (M SAR)</th>
              <th className="px-3 py-2 text-right">Payback (y)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => (
              <tr key={i} className={`bg-card num ${r.delta === 0 ? "bg-accent/10 font-semibold" : ""}`}>
                <td className="px-3 py-2 text-left">{(r.delta * 100).toFixed(0)}%</td>
                <td className="px-3 py-2 text-right">{variable.fmt(r.value)}</td>
                <td className="px-3 py-2 text-right">{fmtTariff(r.tariff)}</td>
                <td className="px-3 py-2 text-right">{fmtTariff(r.lcoe)}</td>
                <td className="px-3 py-2 text-right">{fmtPct(r.irr)}</td>
                <td className="px-3 py-2 text-right">{fmtMSAR(r.npv)}</td>
                <td className="px-3 py-2 text-right">{r.payback ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        One-factor-at-a-time sensitivity. Each row re-runs the full 30-year model with the selected variable shifted by Δ while all other inputs stay at their current values.
      </p>
    </div>
  );
}
