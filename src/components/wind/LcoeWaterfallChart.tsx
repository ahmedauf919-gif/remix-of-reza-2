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
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-semibold">LCOE waterfall — % weight per item (per CAPEX & OPEX line)</h3>
        <div className="text-sm text-muted-foreground">
          LCOE: <span className="font-mono font-semibold text-foreground">{fmt(lcoeUsd, 2)} USD/MWh</span>
          <span className="mx-2">·</span>
          PPA: <span className="font-mono font-semibold text-foreground">{fmt(ppaUsd, 2)} USD/MWh</span>
          <span className="mx-2">·</span>
          Margin: <span className={`font-mono font-semibold ${ppaUsd >= lcoeUsd ? "text-success" : "text-destructive"}`}>{fmt(ppaUsd - lcoeUsd, 2)}</span>
        </div>
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
