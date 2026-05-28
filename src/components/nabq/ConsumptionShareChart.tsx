import { topClients } from "@/data/nabq/clientsData";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Collect clients until we reach ~70% of total consumption
let cumulative = 0;
const top70: { name: string; value: number }[] = [];
for (const c of topClients) {
  if (cumulative >= 70) break;
  top70.push({ name: c.name, value: c.percentage });
  cumulative += c.percentage;
}
const othersShare = 100 - top70.reduce((s, c) => s + c.value, 0);
const chartData = [...top70, { name: "Others", value: othersShare }];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--secondary))",
  "hsl(var(--destructive))",
  "hsl(var(--primary) / 0.7)",
  "hsl(var(--accent) / 0.7)",
  "hsl(var(--chart-3) / 0.7)",
  "hsl(var(--chart-4) / 0.7)",
  "hsl(var(--chart-5) / 0.7)",
  "hsl(var(--muted-foreground))",
];

export function ConsumptionShareChart() {
  return (
    <div className="glass-card p-6">
      <h3 className="mb-1 text-lg font-semibold">Top 20 Clients</h3>
      <p className="mb-4 text-sm text-muted-foreground">Top 20 clients by consumption share (2025) reflect around 70% of total NABQ consumption</p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={({ name, value, x, y, textAnchor }) => (
                <text x={x} y={y} textAnchor={textAnchor} fill="hsl(var(--foreground))" fontSize={11}>
                  {`${name}: ${value}%`}
                </text>
              )}
              labelLine={{ stroke: "hsl(var(--muted-foreground))" }}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`${value}%`, "Share"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
