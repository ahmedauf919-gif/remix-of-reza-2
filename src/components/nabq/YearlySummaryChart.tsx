import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getYearlySummary } from "@/data/nabq/batteryData";

export function YearlySummaryChart() {
  const data = getYearlySummary();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Annual Energy Totals</h3>
        <p className="text-sm text-muted-foreground">
          Grid vs Solar by year (MWh)
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatNumber}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number, name: string) => [
                `${formatNumber(value)} MWh`,
                name === "grid" ? "Grid" : "Solar",
              ]}
            />
            <Legend />
            <Bar
              dataKey="grid"
              name="Grid"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="solar"
              name="Solar"
              fill="hsl(var(--chart-3))"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Summary cards */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {data.map((item) => (
          <div
            key={item.year}
            className="rounded-lg bg-secondary/50 p-3 text-center"
          >
            <p className="text-xs text-muted-foreground">{item.year}</p>
            <p className="text-lg font-bold text-primary">
              {(item.total / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-chart-3">{item.solarPercentage}% Solar</p>
          </div>
        ))}
      </div>
    </div>
  );
}
