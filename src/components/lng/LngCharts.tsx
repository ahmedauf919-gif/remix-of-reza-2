import { LngOutputs, fmtNum, fmtPct } from "@/lib/lngModel";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  LineChart, Line, ComposedChart, ReferenceLine, Cell, PieChart, Pie,
} from "recharts";

const Card = ({ title, children, h = 280 }: { title: string; children: React.ReactNode; h?: number }) => (
  <div className="rounded-xl border bg-card p-5 shadow-sm">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div style={{ height: h }}>{children}</div>
  </div>
);

const tt = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: 12,
  },
};

export const LngCharts = ({ m }: { m: LngOutputs }) => {
  const opRows = m.rows.filter(r => r.yearIdx >= 0);

  const data = opRows.map(r => ({
    year: r.year,
    Revenue: r.revenue,
    FeedGas: -r.feedGasCost,
    GrossMargin: r.grossMargin,
    EBITDA: r.ebitda,
    NetProfit: r.netProfit,
    DSCR:
      r.yearIdx >= 0 &&
      isFinite(r.dscr) &&
      r.dscr > 0 &&
      r.dscr < 50 &&
      (r.seniorClosing > 0 || r.seniorRepay > 0)
        ? +r.dscr.toFixed(2)
        : null,
    Debt: r.seniorClosing + r.shlClosing,
    FCFE: r.fcfe,
    Volume: r.volumeMmbtu / 1000,
  }));

  // CAPEX breakdown pie data
  const capexData = m.capexBreakdown.map(c => ({ name: c.label, value: c.totalUsd }));
  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(200 70% 50%)",
    "hsl(35 90% 50%)",
    "hsl(280 60% 55%)",
    "hsl(142 70% 45%)",
  ];

  // Cost composition per MMBTU (Y1)
  const y1 = m.rows.find(r => r.yearIdx === 0);
  const vol1 = y1?.volumeMmbtu || 1;
  const sellingPriceY1 =
    y1 && y1.volumeMmbtu > 0
      ? y1.revenue / y1.volumeMmbtu
      : m.inputs.sellingPriceUsdPerMmbtu;

  const compData = [
    { name: "Feed Gas Cost",  value: (y1?.feedGasCost || 0) / vol1,    group: "Cost" },
    { name: "Fixed OPEX",     value: (y1?.fixedOpex || 0) / vol1,      group: "Cost" },
    { name: "Transport",      value: (y1?.transportCost || 0) / vol1,   group: "Cost" },
    { name: "Depreciation",   value: (y1?.depreciation || 0) / vol1,   group: "CAPEX" },
    { name: "Senior Interest",value: (y1?.seniorInterest || 0) / vol1,  group: "Financing" },
    { name: "SHL Interest",   value: (y1?.shlInterest || 0) / vol1,    group: "Financing" },
    { name: "Tax",            value: (y1?.tax || 0) / vol1,            group: "Tax" },
    { name: "Net Margin",     value: Math.max(0, (y1?.netProfit || 0) / vol1), group: "Margin" },
  ].filter(c => c.value > 0.001);

  return (
    <div className="space-y-6">
      {/* Revenue, Feed Gas & EBITDA */}
      <Card title="Revenue, Feed Gas & EBITDA (USD)" h={300}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${fmtNum(v / 1000, 0)}K`} tick={{ fontSize: 11 }} />
            <Tooltip {...tt} formatter={(v: number) => `$${fmtNum(v, 0)}`} />
            <Legend />
            <Bar dataKey="Revenue"  fill="hsl(var(--primary))"     name="Revenue" />
            <Bar dataKey="FeedGas"  fill="hsl(var(--destructive))" name="Feed Gas Cost" />
            <Line dataKey="EBITDA"    stroke="hsl(var(--accent))"    strokeWidth={2} name="EBITDA"     dot={{ r: 2 }} />
            <Line dataKey="NetProfit" stroke="hsl(142 70% 45%)"      strokeWidth={2} name="Net Profit" dot={{ r: 2 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* DSCR Profile */}
        <Card title="DSCR Profile">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} ticks={[0, 1, 1.3, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
              <Tooltip {...tt} />
              <ReferenceLine
                y={1.3}
                stroke="hsl(var(--accent))"
                strokeDasharray="4 4"
                label={{ value: "1.30x covenant", fontSize: 10, fill: "hsl(var(--accent))" }}
              />
              <ReferenceLine y={1} stroke="hsl(var(--destructive))" strokeDasharray="2 2" />
              <Line
                type="monotone"
                dataKey="DSCR"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* FCFE */}
        <Card title="Free Cash Flow to Equity (USD)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${fmtNum(v / 1000, 0)}K`} tick={{ fontSize: 11 }} />
              <Tooltip {...tt} formatter={(v: number) => `$${fmtNum(v, 0)}`} />
              <ReferenceLine y={0} stroke="hsl(var(--border))" />
              <Bar dataKey="FCFE" name="FCFE" radius={[3, 3, 0, 0]}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.FCFE >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* CAPEX Breakdown Pie */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-3">CAPEX Breakdown (USD incl. contingency)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={capexData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {capexData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tt} formatter={(v: number) => `$${fmtNum(v, 0)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost composition per MMBTU */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-3">
            Cost Composition — ${fmtNum(sellingPriceY1, 2)}/MMBTU (Y1)
          </h3>
          <div style={{ height: Math.max(240, compData.length * 34) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compData} layout="vertical" margin={{ left: 120, right: 70 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" tickFormatter={(v) => `$${v.toFixed(2)}`} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip
                  {...tt}
                  formatter={(v: number) => [
                    `$${v.toFixed(3)}/MMBTU (${fmtPct(v / sellingPriceY1)})`,
                    "Cost",
                  ]}
                />
                <Bar
                  dataKey="value"
                  label={{
                    position: "right",
                    formatter: (v: number) => fmtPct(v / sellingPriceY1),
                    fontSize: 10,
                  }}
                  radius={[0, 3, 3, 0]}
                >
                  {compData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Debt balance over time */}
      <Card title="Outstanding Debt Balance (USD)" h={260}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} stackOffset="none">
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${fmtNum(v / 1000, 0)}K`} tick={{ fontSize: 11 }} />
            <Tooltip {...tt} formatter={(v: number) => `$${fmtNum(v, 0)}`} />
            <Legend />
            <Bar dataKey="Debt" fill="hsl(var(--accent))" name="Total Debt Outstanding" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
