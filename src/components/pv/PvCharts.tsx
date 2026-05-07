import { PvOutputs, fmtNum, fmtPct } from "@/lib/pvModel";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line, ComposedChart, ReferenceLine, Cell } from "recharts";

const Card = ({ title, children, h = 280 }: { title: string; children: React.ReactNode; h?: number }) => (
  <div className="rounded-xl border bg-card p-5 shadow-sm">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div style={{ height: h }}>{children}</div>
  </div>
);

const tt = { contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 } };

export const PvCharts = ({ m }: { m: PvOutputs }) => {
  const data = m.rows.filter(r => r.yearIdx >= 0).map(r => ({
    year: r.year,
    Revenue: r.revenue / 1000,
    OpEx: -r.opex / 1000,
    EBITDA: r.ebitda / 1000,
    NetProfit: r.netProfit / 1000,
    DSCR: r.principalRepay > 0 || r.interest > 0 ? +r.dscr.toFixed(3) : null,
    Debt: r.debtClosing / 1000,
    FCFE: r.fcfe / 1000,
    Energy: r.energyKwh / 1000,
  }));

  const groupColor: Record<string, string> = {
    "CAPEX": "hsl(var(--primary))",
    "OPEX": "hsl(var(--accent))",
    "Financing": "hsl(280 60% 55%)",
    "Tax": "hsl(35 90% 50%)",
    "Margin": "hsl(142 70% 45%)",
  };
  const comp = [...m.tariffComposition].filter(c => c.value > 0).sort((a, b) => b.value - a.value).map(c => ({ ...c, label: fmtPct(c.pct) }));
  const tariff = m.rows.find(r => r.yearIdx === 0)?.tariffEgp ?? 0;

  return (
    <div className="space-y-6">
      <Card title="Cashflow & Profitability (EGP '000)" h={300}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => fmtNum(v)} />
            <Tooltip {...tt} formatter={(v: number) => fmtNum(v)} />
            <Legend />
            <Bar dataKey="Revenue" fill="hsl(var(--primary))" />
            <Bar dataKey="OpEx" fill="hsl(var(--destructive))" />
            <Line dataKey="EBITDA" stroke="hsl(var(--accent))" strokeWidth={2} />
            <Line dataKey="NetProfit" stroke="hsl(142 70% 45%)" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="DSCR Profile">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
              <XAxis dataKey="year" tick={{ fontSize: 11 }}/>
              <YAxis tick={{ fontSize: 11 }} domain={[0, 4]} ticks={[0,1,1.3,2,3,4]}/>
              <Tooltip {...tt}/>
              <ReferenceLine y={1.3} stroke="hsl(var(--accent))" strokeDasharray="4 4" label={{ value: "Target 1.30x", fontSize: 10, fill: "hsl(var(--accent))" }}/>
              <ReferenceLine y={1} stroke="hsl(var(--destructive))" strokeDasharray="2 2"/>
              <Line type="monotone" dataKey="DSCR" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 2 }}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Energy Production (MWh)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="year"/>
              <YAxis tickFormatter={(v) => fmtNum(v)}/>
              <Tooltip {...tt} formatter={(v: number) => fmtNum(v)}/>
              <Bar dataKey="Energy" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold mb-3">Tariff Composition — {fmtNum(tariff, 3)} EGP/kWh (Year 1)</h3>
        <div style={{ height: Math.max(280, comp.length * 28) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comp} layout="vertical" margin={{ left: 140, right: 60 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
              <XAxis type="number" tickFormatter={(v) => fmtNum(v, 3)}/>
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140}/>
              <Tooltip {...tt} formatter={(v: number, _n, p: any) => [`${fmtNum(v, 4)} EGP/kWh (${fmtPct(p.payload.pct)}) — ${p.payload.group}`, "Contribution"]}/>
              <Bar dataKey="value" label={{ position: "right", formatter: (v: any) => v.label, fontSize: 11 }}>
                {comp.map((c, i) => <Cell key={i} fill={groupColor[c.group] || "hsl(var(--primary))"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Card title="FCFE (EGP '000)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="year"/>
            <YAxis tickFormatter={(v) => fmtNum(v)}/>
            <Tooltip {...tt} formatter={(v: number) => fmtNum(v)}/>
            <Bar dataKey="FCFE" fill="hsl(var(--primary))"/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
