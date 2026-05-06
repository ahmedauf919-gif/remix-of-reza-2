import { ModelOutputs, fmt, fmtPct } from "@/lib/windModel";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, LabelList } from "recharts";

const tooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(var(--foreground))" },
};

export const LcoeWaterfallChart = ({ m }: { m: ModelOutputs }) => {
  const data = m.lcoeContributions.map(c => ({
    name: c.label,
    pct: +(c.pct * 100).toFixed(2),
    usd: +c.usdPerMWh.toFixed(2),
  }));
  const ppaUsd = m.inputs.tariffUsdPerKWh * 1000; // USD/MWh
  const lcoeUsd = m.lcoeUsdPerKWh * 1000;
  const palette = [
    "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))",
    "hsl(209 100% 42%)", "hsl(45 99% 53%)", "hsl(142 100% 28%)",
    "hsl(217 100% 19%)", "hsl(0 75% 50%)", "hsl(215 16% 40%)",
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-semibold">LCOE waterfall — % weight per item</h3>
        <div className="text-sm text-muted-foreground">
          LCOE: <span className="font-mono font-semibold text-foreground">{fmt(lcoeUsd, 2)} USD/MWh</span>
          <span className="mx-2">·</span>
          PPA: <span className="font-mono font-semibold text-foreground">{fmt(ppaUsd, 2)} USD/MWh</span>
          <span className="mx-2">·</span>
          Margin: <span className={`font-mono font-semibold ${ppaUsd >= lcoeUsd ? "text-success" : "text-destructive"}`}>{fmt(ppaUsd - lcoeUsd, 2)}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(280, 40 * data.length + 60)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 60, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
          <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => v + "%"}/>
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={240}/>
          <Tooltip {...tooltipStyle}
            formatter={(_v: number, _n: string, p: any) => [`${fmt(p.payload.pct, 2)}% · ${fmt(p.payload.usd, 2)} USD/MWh`, "Contribution"]}/>
          <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]}/>)}
            <LabelList dataKey="pct" position="right" formatter={(v: any) => `${fmt(Number(v), 1)}%`} style={{ fontSize: 11, fill: "hsl(var(--foreground))" }}/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 rounded bg-secondary/30 px-2 py-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded" style={{ background: palette[i % palette.length] }}/>
            <span className="flex-1 truncate" title={d.name}>{d.name}</span>
            <span className="font-mono">{fmt(d.pct, 1)}%</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Each bar shows that item's discounted-cost share of total LCOE (and the implied $/MWh contribution).
        Items with the same % weight on LCOE represent the same % of price you would need to charge in the PPA to break even on that bucket.
      </p>
    </div>
  );
};
