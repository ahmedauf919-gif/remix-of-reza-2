import { ModelOutputs, fmt, fmtPct } from "@/lib/windModel";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, LabelList } from "recharts";

const tooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(var(--foreground))" },
};

export const LcoeWaterfallChart = ({ m }: { m: ModelOutputs }) => {
  const ppaUsd = m.inputs.tariffUsdPerKWh * 1000; // USD/MWh
  const lcoeUsd = m.lcoeUsdPerKWh * 1000;
  const data = m.lcoeContributions.map(c => ({
    name: c.label,
    pctLcoe: +(c.pct * 100).toFixed(2),
    pctPpa: ppaUsd > 0 ? +((c.usdPerMWh / ppaUsd) * 100).toFixed(2) : 0,
    usd: +c.usdPerMWh.toFixed(2),
  }));
  const palette = [
    "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))",
    "hsl(209 100% 42%)", "hsl(45 99% 53%)", "hsl(142 100% 28%)",
    "hsl(217 100% 19%)", "hsl(0 75% 50%)", "hsl(215 16% 40%)",
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h3 className="font-semibold">LCOE waterfall — % weight per item (per CAPEX & OPEX line)</h3>
        <div className="text-sm text-muted-foreground">
          LCOE: <span className="font-mono font-semibold text-foreground">{fmt(lcoeUsd, 2)} USD/MWh</span>
          <span className="mx-2">·</span>
          PPA: <span className="font-mono font-semibold text-foreground">{fmt(ppaUsd, 2)} USD/MWh</span>
          <span className="mx-2">·</span>
          Margin: <span className={`font-mono font-semibold ${ppaUsd >= lcoeUsd ? "text-success" : "text-destructive"}`}>{fmt(ppaUsd - lcoeUsd, 2)}</span>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="rounded-lg border border-border bg-muted/30 p-2">
          <div className="text-muted-foreground">WACC (discount rate)</div>
          <div className="font-mono font-semibold text-foreground text-sm">{fmtPct(m.wacc, 2)}</div>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-2">
          <div className="text-muted-foreground">Cost of Equity</div>
          <div className="font-mono font-semibold text-foreground text-sm">{fmtPct(m.costOfEquity, 2)}</div>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-2">
          <div className="text-muted-foreground">After-tax Cost of Debt</div>
          <div className="font-mono font-semibold text-foreground text-sm">{fmtPct(m.inputs.costOfDebt * (1 - m.inputs.taxRate), 2)}</div>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-2">
          <div className="text-muted-foreground">Gearing (D/(D+E))</div>
          <div className="font-mono font-semibold text-foreground text-sm">{fmtPct(m.inputs.gearing, 1)}</div>
        </div>
      </div>
      <div className={`mb-4 rounded-lg border p-3 text-xs ${ppaUsd >= lcoeUsd ? "border-success/40 bg-success/5 text-foreground" : "border-destructive/40 bg-destructive/5 text-foreground"}`}>
        {ppaUsd >= lcoeUsd ? (
          <>✓ PPA price ({fmt(ppaUsd, 2)} USD/MWh) is above LCOE ({fmt(lcoeUsd, 2)} USD/MWh) — the project earns <span className="font-semibold">{fmt(ppaUsd - lcoeUsd, 2)} USD/MWh</span> margin over its full lifecycle cost (discounted at WACC = {fmtPct(m.wacc, 2)}).</>
        ) : (
          <>⚠ LCOE ({fmt(lcoeUsd, 2)} USD/MWh) exceeds PPA ({fmt(ppaUsd, 2)} USD/MWh) by <span className="font-semibold">{fmt(lcoeUsd - ppaUsd, 2)} USD/MWh</span>. Likely drivers: WACC is high ({fmtPct(m.wacc, 2)}) which inflates the discounted cost base, CAPEX/MW or OPEX assumptions are heavy, capacity factor (net energy) is low, or PPA tariff is set below the project's break-even. Lower WACC, reduce CAPEX/MW, increase capacity factor, or raise PPA to close the gap.</>
        )}
      </div>
      <ResponsiveContainer width="100%" height={Math.max(360, 32 * data.length + 80)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 80, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
          <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => v + "%"}/>
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={250}/>
          <Tooltip {...tooltipStyle}
            formatter={(_v: number, n: string, p: any) => {
              if (n === "% of LCOE") return [`${fmt(p.payload.pctLcoe, 2)}% · ${fmt(p.payload.usd, 2)} USD/MWh`, "% of LCOE"];
              return [`${fmt(p.payload.pctPpa, 2)}% of PPA price`, "% of PPA"];
            }}/>
          <Bar dataKey="pctLcoe" name="% of LCOE" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]}/>)}
            <LabelList dataKey="pctLcoe" position="right" formatter={(v: any) => `${fmt(Number(v), 1)}%`} style={{ fontSize: 10, fill: "hsl(var(--foreground))" }}/>
          </Bar>
          <Bar dataKey="pctPpa" name="% of PPA" radius={[0, 6, 6, 0]} fill="hsl(var(--muted-foreground))" fillOpacity={0.4}>
            <LabelList dataKey="pctPpa" position="right" formatter={(v: any) => `${fmt(Number(v), 1)}%`} style={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-3 text-xs text-muted-foreground">
        Each line shows that item's discounted-cost weight in LCOE (coloured) and what % of the PPA price it consumes (grey).
        If the grey bars sum below 100%, the project earns a margin over LCOE; above 100% means LCOE exceeds PPA.
      </p>
    </div>
  );
};
