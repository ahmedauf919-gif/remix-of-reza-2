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

      {/* Revised PPA composition showing CAPEX/OPEX/DebtService/Tax/Margin as % of tariff */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-3">PPA Tariff Composition — {fmtNum(tariff, 2)} EGP/m³</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stacked composition bar */}
          <div className="h-72">
            {(() => {
              const groups = [
                { name: "CAPEX (Depreciation)", pct: m.tariffComposition.filter(c => c.group === "CAPEX").reduce((s, c) => s + c.pct, 0), color: "hsl(var(--primary))" },
                { name: "OPEX (Variable)", pct: m.tariffComposition.filter(c => c.group === "OPEX-Var").reduce((s, c) => s + c.pct, 0), color: "hsl(var(--accent))" },
                { name: "OPEX (Fixed + Electricity + SG&A)", pct: m.tariffComposition.filter(c => ["OPEX-Fixed", "Electricity", "SG&A"].includes(c.group)).reduce((s, c) => s + c.pct, 0), color: "hsl(200 70% 50%)" },
                { name: "Debt Service (Interest)", pct: m.tariffComposition.filter(c => c.group === "Financing").reduce((s, c) => s + c.pct, 0), color: "hsl(280 60% 55%)" },
                { name: "Income Tax", pct: m.tariffComposition.filter(c => c.group === "Tax").reduce((s, c) => s + c.pct, 0), color: "hsl(35 90% 50%)" },
                { name: "Equity Margin", pct: m.tariffComposition.filter(c => c.group === "Margin").reduce((s, c) => s + c.pct, 0), color: "hsl(142 70% 45%)" },
              ].filter(g => g.pct > 0);
              return (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={groups} layout="vertical" margin={{ left: 200, right: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                    <XAxis type="number" tickFormatter={(v) => fmtPct(v)} domain={[0, 1]}/>
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={200}/>
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [fmtPct(v), "% of Tariff"]}/>
                    <Bar dataKey="pct" label={{ position: "right", formatter: (v: any) => fmtPct(v), fontSize: 11 }}>
                      {groups.map((g, i) => <Cell key={i} fill={g.color}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>
          {/* Table summary */}
          <div className="text-sm">
            <table className="w-full">
              <thead><tr className="text-xs text-muted-foreground border-b">
                <th className="py-1.5 text-left">Component</th>
                <th className="py-1.5 text-right">EGP/m³</th>
                <th className="py-1.5 text-right">% of Tariff</th>
              </tr></thead>
              <tbody>
                {[
                  { name: "CAPEX (Depreciation)", group: ["CAPEX"] },
                  { name: "OPEX — Variable", group: ["OPEX-Var"] },
                  { name: "OPEX — Fixed & Electricity & SGA", group: ["OPEX-Fixed", "Electricity", "SG&A"] },
                  { name: "Debt Service (Interest)", group: ["Financing"] },
                  { name: "Income Tax", group: ["Tax"] },
                  { name: "Equity Margin / Profit", group: ["Margin"] },
                ].map((row, i) => {
                  const total = m.tariffComposition.filter(c => row.group.includes(c.group)).reduce((s, c) => s + c.value, 0);
                  const pct = m.tariffComposition.filter(c => row.group.includes(c.group)).reduce((s, c) => s + c.pct, 0);
                  return (
                    <tr key={i} className="border-b border-border/30">
                      <td className="py-1.5">{row.name}</td>
                      <td className="py-1.5 text-right font-mono">{fmtNum(total, 3)}</td>
                      <td className="py-1.5 text-right font-mono">{fmtPct(pct)}</td>
                    </tr>
                  );
                })}
                <tr className="font-semibold border-t-2">
                  <td className="py-2">Total Tariff</td>
                  <td className="py-2 text-right font-mono">{fmtNum(tariff, 3)}</td>
                  <td className="py-2 text-right font-mono">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
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
