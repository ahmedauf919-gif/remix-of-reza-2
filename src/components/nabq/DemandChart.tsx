import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { monthlyDemandTrends } from "@/data/nabq/dieselData";
import { useMemo } from "react";

interface DemandChartProps {
  selectedYear?: string;
  growthRate?: number;
}

export function DemandChart({ selectedYear = "all", growthRate = 5 }: DemandChartProps) {
  // Apply growth rate adjustment to demand data
  const adjustedData = useMemo(() => {
    const baseGrowth = 5;
    const growthDiff = (growthRate - baseGrowth) / 100;
    
    return monthlyDemandTrends.map(item => ({
      ...item,
      y2025: Math.round(item.y2025 * (1 + growthDiff * 0)),
      y2026: Math.round(item.y2026 * (1 + growthDiff * 1)),
      y2027: Math.round(item.y2027 * (1 + growthDiff * 2)),
      y2028: Math.round(item.y2028 * (1 + growthDiff * 3)),
    }));
  }, [growthRate]);

  // Determine which years to show based on filter
  const showYear = (year: string) => {
    if (selectedYear === "all") return true;
    return year === selectedYear || year === "2025";
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Demand Forecast by Year</h3>
        <p className="text-sm text-muted-foreground">
          Average monthly MWh consumption projection
          {growthRate !== 5 && (
            <span className="ml-2 text-warning">
              (Growth: {growthRate}%)
            </span>
          )}
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={adjustedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="color2025" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="color2026" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="color2027" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="color2028" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.5} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
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
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            {showYear("2025") && (
              <Area
                type="monotone"
                dataKey="y2025"
                name="2025"
                stroke="hsl(var(--muted-foreground))"
                fillOpacity={1}
                fill="url(#color2025)"
                strokeWidth={2}
              />
            )}
            {showYear("2026") && (
              <Area
                type="monotone"
                dataKey="y2026"
                name="2026"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#color2026)"
                strokeWidth={2}
              />
            )}
            {showYear("2027") && (
              <Area
                type="monotone"
                dataKey="y2027"
                name="2027"
                stroke="hsl(var(--chart-3))"
                fillOpacity={1}
                fill="url(#color2027)"
                strokeWidth={2}
              />
            )}
            {showYear("2028") && (
              <Area
                type="monotone"
                dataKey="y2028"
                name="2028"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#color2028)"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
