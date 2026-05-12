import { getYearlyCapacityGrowth } from "@/data/nabq/clientsData";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function CapacityGrowthChart() {
  const data = getYearlyCapacityGrowth();

  return (
    <div className="glass-card p-6">
      <h3 className="mb-1 text-lg font-semibold">
        Contracted Capacity Growth
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Year-over-year capacity additions & cumulative total (MVA)
      </p>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "MVA Added",
                angle: -90,
                position: "insideLeft",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Cumulative MVA",
                angle: 90,
                position: "insideRight",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number, name: string) => [
                `${value} MVA`,
                name === "added" ? "Added" : "Cumulative",
              ]}
            />
            <Legend
              formatter={(value) =>
                value === "added" ? "Capacity Added" : "Cumulative Total"
              }
            />
            <Bar
              yAxisId="left"
              dataKey="added"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              opacity={0.85}
            />
            <Line
              yAxisId="right"
              dataKey="cumulative"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(var(--chart-3))" }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
