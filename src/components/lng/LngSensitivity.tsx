import { LngInputs, LngOutputs, runLngModel, fmtPct } from "@/lib/lngModel";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, ReferenceLine,
} from "recharts";

export function LngSensitivity({
  inputs,
  baseModel,
}: {
  inputs: LngInputs;
  baseModel: LngOutputs;
}) {
  const baseIRR = baseModel.equityIRR;

  const vars: { key: keyof LngInputs; label: string }[] = [
    { key: "sellingPriceUsdPerMmbtu", label: "LNG Selling Price" },
    { key: "feedGasPriceUsdPerMmbtu", label: "Feed Gas Cost" },
    { key: "capacityM3LngPerDay",     label: "Plant Capacity" },
    { key: "seniorInterestRatePct",   label: "Senior Interest Rate" },
    { key: "debtRatioPct",            label: "Debt Ratio" },
  ];

  const results = vars.map(v => {
    const base = inputs[v.key] as number;
    const hi = runLngModel({ ...inputs, [v.key]: base * 1.1 }).equityIRR;
    const lo = runLngModel({ ...inputs, [v.key]: base * 0.9 }).equityIRR;
    return { label: v.label, hi, lo, range: Math.abs(hi - lo) };
  });

  // CAPEX sensitivity — scale all capex items
  const capexHi = runLngModel({
    ...inputs,
    capexItems: inputs.capexItems.map(c => ({ ...c, amountUsd: c.amountUsd * 1.1 })),
  }).equityIRR;
  const capexLo = runLngModel({
    ...inputs,
    capexItems: inputs.capexItems.map(c => ({ ...c, amountUsd: c.amountUsd * 0.9 })),
  }).equityIRR;
  results.push({ label: "Total CAPEX", hi: capexHi, lo: capexLo, range: Math.abs(capexHi - capexLo) });

  results.sort((a, b) => b.range - a.range);

  const chartData = results.map(r => ({
    label: r.label,
    upside:   Math.max(r.hi, r.lo) - baseIRR,
    downside: Math.min(r.hi, r.lo) - baseIRR,
    hiIRR: r.hi,
    loIRR: r.lo,
  }));

  return (
    <div className="space-y-6">
      {/* Tornado chart */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-1">
          Sensitivity — Equity IRR (base: {fmtPct(baseIRR)})
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Each variable shifted ±10% from base case. Ranked by impact.
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 160, right: 60 }}>
              <XAxis
                type="number"
                tickFormatter={v => `${(v * 100).toFixed(1)}pp`}
                tick={{ fontSize: 10 }}
              />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={155} />
              <Tooltip
                formatter={(v: number, name: string) => [
                  `${(v * 100).toFixed(2)}pp`,
                  name === "upside" ? "+10% scenario" : "−10% scenario",
                ]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <ReferenceLine x={0} stroke="hsl(var(--border))" />
              <Bar dataKey="upside"   name="upside"   fill="hsl(var(--primary))"     radius={[0, 4, 4, 0]} />
              <Bar dataKey="downside" name="downside" fill="hsl(var(--destructive))" radius={[4, 0, 0, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensitivity table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-secondary/40 px-5 py-3">
          <h3 className="font-semibold">Sensitivity Table — Equity IRR</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs">
              <th className="px-4 py-2 text-left">Variable</th>
              <th className="px-4 py-2 text-right">−10%</th>
              <th className="px-4 py-2 text-right">Base</th>
              <th className="px-4 py-2 text-right">+10%</th>
              <th className="px-4 py-2 text-right">Range</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="border-t border-border/40 hover:bg-muted/20">
                <td className="px-4 py-2">{r.label}</td>
                <td className="px-4 py-2 text-right font-mono text-destructive">
                  {fmtPct(Math.min(r.hi, r.lo))}
                </td>
                <td className="px-4 py-2 text-right font-mono font-semibold">
                  {fmtPct(baseIRR)}
                </td>
                <td className="px-4 py-2 text-right font-mono text-primary">
                  {fmtPct(Math.max(r.hi, r.lo))}
                </td>
                <td className="px-4 py-2 text-right font-mono text-muted-foreground">
                  {fmtPct(r.range)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
