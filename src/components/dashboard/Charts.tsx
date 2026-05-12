import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ComputedTranche, YEARS } from "@/lib/loanModel";

const COLORS = ["hsl(28 95% 52%)", "hsl(200 90% 45%)", "hsl(142 70% 40%)", "hsl(280 70% 55%)", "hsl(340 75% 55%)"];

export const DebtServiceChart = ({ computed }: { computed: ComputedTranche[] }) => {
  const data = YEARS.map((y, i) => {
    let interest = 0, principal = 0;
    computed.forEach((c) => {
      interest += c.usd.interest[i];
      principal += c.usd.principal[i];
    });
    return { year: y, Interest: +interest.toFixed(2), Principal: +principal.toFixed(2) };
  });
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <h3 className="font-semibold">Annual debt service (USD millions)</h3>
      <p className="mb-4 text-xs text-muted-foreground">Stacked principal + interest across all tranches.</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Principal" stackId="a" fill="hsl(28 95% 52%)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Interest" stackId="a" fill="hsl(200 90% 45%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BalanceChart = ({ computed }: { computed: ComputedTranche[] }) => {
  const data = YEARS.map((y, i) => {
    const row: Record<string, number | string> = { year: y };
    let total = 0;
    computed.forEach((c) => total += c.usd.balance[i]);
    row["Outstanding debt"] = +total.toFixed(2);
    return row;
  });
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <h3 className="font-semibold">Outstanding debt over time (USD millions)</h3>
      <p className="mb-4 text-xs text-muted-foreground">Total closing balance across all tranches.</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="bal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(28 95% 52%)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="hsl(28 95% 52%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
          <Area type="monotone" dataKey="Outstanding debt" stroke="hsl(28 95% 52%)" fill="url(#bal)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MixPie = ({ computed, by }: { computed: ComputedTranche[]; by: "currency" | "lender" }) => {
  const map = new Map<string, number>();
  computed.forEach((c) => {
    const key = by === "currency" ? c.tranche.currency : c.tranche.lender;
    map.set(key, (map.get(key) || 0) + c.usd.principal.reduce((a, b) => a + b, 0));
  });
  const data = Array.from(map.entries()).map(([name, value]) => ({ name, value: +value.toFixed(2) }));
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <h3 className="font-semibold">Debt mix by {by} (USDm)</h3>
      <p className="mb-4 text-xs text-muted-foreground">Total principal share across the program.</p>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
