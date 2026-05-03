import { ModelOutputs, fmt } from "@/lib/windModel";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Line, LineChart, ReferenceLine, Area, AreaChart } from "recharts";

const tooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(var(--foreground))" },
};

export const CashflowChart = ({ m }: { m: ModelOutputs }) => {
  const data = m.rows.map(r => ({
    year: r.year,
    Revenue: +r.revenue.toFixed(0),
    Opex: -+r.opex.toFixed(0),
    DebtService: -+r.debtService.toFixed(0),
    Tax: -+r.tax.toFixed(0),
    CFFI: +r.cffi.toFixed(0),
  }));
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <h3 className="font-semibold mb-3">Annual cashflow waterfall</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} stackOffset="sign">
          <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
          <XAxis dataKey="year" tick={{ fontSize: 11 }}/>
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v / 1000, 0) + "m"}/>
          <Tooltip {...tooltipStyle} formatter={(v: number) => fmt(v) + "k"}/>
          <Legend wrapperStyle={{ fontSize: 12 }}/>
          <ReferenceLine y={0} stroke="hsl(var(--border))"/>
          <Bar dataKey="Revenue" stackId="a" fill="hsl(var(--primary))"/>
          <Bar dataKey="Opex" stackId="a" fill="hsl(var(--accent))"/>
          <Bar dataKey="Tax" stackId="a" fill="hsl(var(--destructive))" opacity={0.7}/>
          <Bar dataKey="DebtService" stackId="a" fill="hsl(var(--muted-foreground))"/>
          <Line type="monotone" dataKey="CFFI" stroke="hsl(var(--success, var(--primary)))" strokeWidth={2} dot={false}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DSCRChart = ({ m }: { m: ModelOutputs }) => {
  const data = m.rows.map(r => ({ year: r.year, DSCR: +r.dscr.toFixed(3) }));
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <h3 className="font-semibold mb-3">DSCR profile</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
          <XAxis dataKey="year" tick={{ fontSize: 11 }}/>
          <YAxis tick={{ fontSize: 11 }} domain={[0, "auto"]}/>
          <Tooltip {...tooltipStyle}/>
          <ReferenceLine y={m.inputs.targetDSCR} stroke="hsl(var(--accent))" strokeDasharray="4 4" label={{ value: `Target ${m.inputs.targetDSCR}x`, fontSize: 10, fill: "hsl(var(--accent))" }}/>
          <ReferenceLine y={1} stroke="hsl(var(--destructive))" strokeDasharray="2 2"/>
          <Line type="monotone" dataKey="DSCR" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 2 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DebtBalanceChart = ({ m }: { m: ModelOutputs }) => {
  const data = m.rows.map(r => ({ year: r.year, Debt: +r.closingDebt.toFixed(0) }));
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <h3 className="font-semibold mb-3">Outstanding debt</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
          <XAxis dataKey="year" tick={{ fontSize: 11 }}/>
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v / 1000, 0) + "m"}/>
          <Tooltip {...tooltipStyle} formatter={(v: number) => fmt(v) + "k"}/>
          <Area type="monotone" dataKey="Debt" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
