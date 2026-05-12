import { top20Clients, allClients } from "@/data/nabq/clientsDetailData";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const top20Total = top20Clients.reduce((s, c) => s + c.share, 0);
const chartData = [
  ...top20Clients.map((c) => ({ name: c.name, value: c.share })),
  { name: "Other Clients", value: 100 - top20Total },
];

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
  "hsl(var(--primary) / 0.5)",
  "hsl(var(--accent) / 0.5)",
  "hsl(var(--chart-3) / 0.5)",
  "hsl(var(--chart-4) / 0.5)",
  "hsl(var(--chart-5) / 0.5)",
  "hsl(var(--secondary) / 0.7)",
  "hsl(var(--destructive) / 0.7)",
  "hsl(var(--muted-foreground) / 0.7)",
];

export function ClientConsumptionShareChart() {
  return (
    <div className="glass-card p-6">
      <h3 className="mb-1 text-lg font-semibold">Top 20 Clients</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Top 20 clients by consumption share (2025) — ~75% of total NABQ consumption
      </p>
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
