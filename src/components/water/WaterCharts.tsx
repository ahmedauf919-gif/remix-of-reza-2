import { WaterOutputs, fmtNum, fmtPct } from "@/lib/waterModel";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line, ComposedChart, ReferenceLine, Cell } from "recharts";

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border bg-card p-5 shadow-sm">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div className="h-72">{children}</div>
  </div>
);

const tooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(var(--foreground))" },
};

export const WaterCharts = ({ m }: { m: WaterOutputs }) => {
  const data = m.rows.filter(r => r.yearIdx >= 0).map(r => ({
    year: r.year,
    Revenue: r.revenue / 1000,
    OpEx: -(r.operatingCost + r.sga) / 1000,
    EBITDA: r.ebitda / 1000,
    NetProfit: r.netProfit / 1000,
    DSCR: r.debtClosing > 0 || r.principalRepay > 0 ? +r.dscr.toFixed(3) : null,
    Debt: r.debtClosing / 1000,
    FCFE: r.fcfe / 1000,
  }));

  // Per-line PPA tariff composition (Reza-style breakdown)
  const tariff = m.tariffEgpPerM3;
  const groupColor: Record<string, string> = {
    "CAPEX": "hsl(var(--primary))",
    "OPEX-Var": "hsl(var(--accent))",
    "OPEX-Fixed": "hsl(var(--muted-foreground))",
    "Electricity": "hsl(var(--destructive))",
    "SG&A": "hsl(220 70% 50%)",
    "Financing": "hsl(280 60% 55%)",
    "Tax": "hsl(35 90% 50%)",
    "Margin": "hsl(142 70% 45%)",
  };
  const compData = [...m.tariffComposition]
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .map(c => ({ ...c, label: fmtPct(c.pct) }));

  return (
    <div className="space-y-6">
      <Card title="Cashflow & Profitability (EGP '000)">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => fmtNum(v)} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => fmtNum(v)} />
            <Legend />
            <Bar dataKey="Revenue" fill="hsl(var(--primary))" />
            <Bar dataKey="OpEx" fill="hsl(var(--destructive))" />
            <Line dataKey="EBITDA" stroke="hsl(var(--accent))" strokeWidth={2} />
            <Line dataKey="NetProfit" stroke="hsl(var(--success, 142 70% 45%))" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="DSCR profile">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
              <XAxis dataKey="year" tick={{ fontSize: 11 }}/>
              <YAxis tick={{ fontSize: 11 }} domain={[0, 2]} allowDataOverflow ticks={[0, 0.5, 1, 1.5, 2]}/>
              <Tooltip {...tooltipStyle}/>
              <ReferenceLine y={1.3} stroke="hsl(var(--accent))" strokeDasharray="4 4" label={{ value: "Target 1.30x", fontSize: 10, fill: "hsl(var(--accent))" }}/>
              <ReferenceLine y={1} stroke="hsl(var(--destructive))" strokeDasharray="2 2"/>
              <Line type="monotone" dataKey="DSCR" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 2 }}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Debt Outstanding (EGP '000)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => fmtNum(v)} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => fmtNum(v)} />
              <Bar dataKey="Debt" fill="hsl(var(--accent))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-3">PPA Tariff Composition — {fmtNum(tariff, 2)} EGP/m³ (per-line contribution)</h3>
        <div style={{ height: Math.max(320, compData.length * 28) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compData} layout="vertical" margin={{ left: 140, right: 60 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
              <XAxis type="number" tickFormatter={(v) => fmtNum(v, 2)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140}/>
              <Tooltip {...tooltipStyle} formatter={(v: number, _n, p: any) => [`${fmtNum(v, 3)} EGP/m³ (${fmtPct(p.payload.pct)}) — ${p.payload.group}`, "Contribution"]}/>
              <Bar dataKey="value" label={{ position: "right", formatter: (v: any) => v.label, fontSize: 11 }}>
                {compData.map((c, i) => <Cell key={i} fill={groupColor[c.group] || "hsl(var(--primary))"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Card title="Free Cash Flow to Equity (EGP '000)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => fmtNum(v)} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => fmtNum(v)} />
            <Bar dataKey="FCFE" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
