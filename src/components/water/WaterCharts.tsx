import { WaterOutputs, fmtNum } from "@/lib/waterModel";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line, ComposedChart } from "recharts";

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border bg-card p-5 shadow-sm">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div className="h-72">{children}</div>
  </div>
);

export const WaterCharts = ({ m }: { m: WaterOutputs }) => {
  const data = m.rows.filter(r => r.yearIdx >= 0).map(r => ({
    year: r.year,
    Revenue: r.revenue / 1000,
    OpEx: -(r.operatingCost + r.sga) / 1000,
    EBITDA: r.ebitda / 1000,
    NetProfit: r.netProfit / 1000,
    DSCR: r.dscr,
    Debt: r.debtClosing / 1000,
    FCFE: r.fcfe / 1000,
  }));

  const lcomData = [
    { name: "Fixed", value: m.fixedCostPerM3 },
    { name: "Variable", value: m.variableCostPerM3 },
    { name: "Electricity", value: m.electricityCostPerM3 },
    { name: "Depreciation", value: m.depreciationPerM3 },
  ];

  return (
    <div className="space-y-6">
      <Card title="Cashflow & Profitability (EGP '000)">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => fmtNum(v)} />
            <Tooltip formatter={(v: number) => fmtNum(v)} />
            <Legend />
            <Bar dataKey="Revenue" fill="hsl(var(--primary))" />
            <Bar dataKey="OpEx" fill="hsl(var(--destructive))" />
            <Line dataKey="EBITDA" stroke="hsl(var(--accent))" strokeWidth={2} />
            <Line dataKey="NetProfit" stroke="hsl(var(--success, 142 70% 45%))" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="DSCR Profile (cap @ 4)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 4]} />
              <Tooltip formatter={(v: number) => fmtNum(v, 2)} />
              <Line dataKey="DSCR" stroke="hsl(var(--primary))" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Debt Outstanding (EGP '000)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => fmtNum(v)} />
              <Tooltip formatter={(v: number) => fmtNum(v)} />
              <Bar dataKey="Debt" fill="hsl(var(--accent))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="LCOM³ Components (EGP per m³)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={lcomData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v: number) => fmtNum(v, 2)} />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Free Cash Flow to Equity (EGP '000)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => fmtNum(v)} />
            <Tooltip formatter={(v: number) => fmtNum(v)} />
            <Bar dataKey="FCFE" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
