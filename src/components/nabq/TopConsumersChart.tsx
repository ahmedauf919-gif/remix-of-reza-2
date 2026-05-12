import { topClients } from "@/data/nabq/clientsData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const chartData = topClients.map((c) => ({
  name: c.name,
  consumption: Math.round(c.consumption / 1000000 * 10) / 10,
  avgLoad: c.avgLoad,
}));

export function TopConsumersChart() {
  return (
    <div className="glass-card p-6">
      <h3 className="mb-1 text-lg font-semibold">Top 20 Contracts by Consumption</h3>
      <p className="mb-4 text-sm text-muted-foreground">2025 Annual Consumption (GWh)</p>
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              width={115}
              interval={0}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`${value} GWh`, "Consumption"]}
            />
            <Bar dataKey="consumption" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={index < 5 ? "hsl(var(--primary))" : index < 10 ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"}
                  opacity={index < 5 ? 1 : index < 10 ? 0.8 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
