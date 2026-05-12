import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getMonthlyComparisonData, yearlyEnergyData } from "@/data/nabq/batteryData";

const colors = {
  "2025": "hsl(var(--chart-1))",
  "2026": "hsl(var(--chart-2))",
  "2027": "hsl(var(--chart-3))",
  "2028": "hsl(var(--primary))",
};

interface YearlyComparisonChartProps {
  selectedMonth?: string;
}

export function YearlyComparisonChart({ selectedMonth = "all" }: YearlyComparisonChartProps) {
  const data = getMonthlyComparisonData();
  
  // Filter by month if selected
  const filteredData = selectedMonth !== "all" 
    ? data.filter((_, index) => index === parseInt(selectedMonth) - 1)
    : data;

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Total Energy Across Years</h3>
        <p className="text-sm text-muted-foreground">
          {selectedMonth === "all" ? "Monthly comparison 2025-2028 (MWh)" : "Year-over-year comparison (MWh)"}
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number, name: string) => {
                const year = name.replace("total", "");
                return [`${value.toLocaleString()} MWh`, year];
              }}
            />
            <Legend />
            {yearlyEnergyData.map((yearData) => (
              <Line
                key={yearData.year}
                type="monotone"
                dataKey={`total${yearData.year}`}
                name={yearData.year}
                stroke={colors[yearData.year as keyof typeof colors]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
