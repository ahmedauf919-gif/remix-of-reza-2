import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";
import { getYearData } from "@/data/nabq/batteryData";

interface SolarPercentageChartProps {
  selectedYear?: string;
  solarSize?: number;
}

export function SolarPercentageChart({ selectedYear = "2025", solarSize = 16 }: SolarPercentageChartProps) {
  const solarScale = solarSize / 16;
  const yearData = getYearData(selectedYear === "all" ? "2025" : selectedYear);
  const scaledMonths = yearData.months.map((m) => {
    const scaledSolar = Math.round(m.solar * solarScale);
    const total = m.grid + scaledSolar;
    return {
      ...m,
      solar: scaledSolar,
      total,
      solarPercentage: total > 0 ? Math.round((scaledSolar / total) * 100) : 0,
    };
  });
  
  const getBarColor = (percentage: number) => {
    if (percentage >= 10) return "hsl(var(--success))";
    if (percentage >= 7) return "hsl(var(--chart-3))";
    return "hsl(var(--warning))";
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Solar Contribution</h3>
        <p className="text-sm text-muted-foreground">
          Monthly solar percentage - {selectedYear === "all" ? "2025" : selectedYear} • {solarSize} MWp
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={scaledMonths}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="monthName"
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
              tickFormatter={(value) => `${value}%`}
              domain={[0, 15]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value}%`, "Solar %"]}
            />
            <ReferenceLine
              y={8}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{
                value: "Avg 8%",
                position: "right",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
              }}
            />
            <Bar dataKey="solarPercentage" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="solarPercentage"
                position="top"
                formatter={(v: number) => `${v}%`}
                style={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 600 }}
              />
              {scaledMonths.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.solarPercentage)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
