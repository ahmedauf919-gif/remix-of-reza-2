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

  // PPA contribution: each major cost line / tariff (Y1 view)
  const tariff = m.tariffEgpPerM3;
  const ppaData = [
    { name: "Fixed costs", value: m.fixedCostPerM3, pct: m.fixedCostPerM3 / tariff },
    { name: "Variable (FX)", value: m.variableCostPerM3 - (m.inputs.wellsIncluded ? m.inputs.wellsCostEgpPerM3 : 0) - m.inputs.otherVarEgpPerM3, pct: 0 },
    { name: "Wells & Other Var", value: (m.inputs.wellsIncluded ? m.inputs.wellsCostEgpPerM3 : 0) + m.inputs.otherVarEgpPerM3, pct: 0 },
    { name: "Electricity", value: m.electricityCostPerM3, pct: m.electricityCostPerM3 / tariff },
    { name: "Depreciation", value: m.depreciationPerM3, pct: m.depreciationPerM3 / tariff },
  ].map(d => ({ ...d, pct: d.value / tariff, label: `${fmtPct(d.value / tariff)}` }));
  const margin = Math.max(0, 1 - ppaData.reduce((s, d) => s + d.pct, 0));
  ppaData.push({ name: "Margin / Profit", value: tariff * margin, pct: margin, label: fmtPct(margin) });

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

      <Card title={`PPA Tariff Composition — ${fmtNum(tariff, 2)} EGP/m³`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ppaData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
            <XAxis type="number" tickFormatter={(v) => fmtNum(v, 2)} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120}/>
            <Tooltip {...tooltipStyle} formatter={(v: number, _n, p: any) => [`${fmtNum(v, 3)} EGP/m³ (${fmtPct(p.payload.pct)})`, "Contribution"]}/>
            <Bar dataKey="value" label={{ position: "right", formatter: (v: any) => v.label, fontSize: 11 }}>
              {ppaData.map((_, i) => <Cell key={i} fill={["hsl(var(--primary))","hsl(var(--accent))","hsl(var(--muted-foreground))","hsl(var(--destructive))","hsl(var(--success, 142 70% 45%))","hsl(var(--success, 142 70% 45%))"][i % 6]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

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
