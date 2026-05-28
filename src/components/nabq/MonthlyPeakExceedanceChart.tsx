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
  ReferenceLine,
  LabelList,
} from "recharts";
import { yearlyPeakData } from "@/data/nabq/peakDemandData";

import { getSolarHourlyMW } from "@/data/nabq/batteryData";

interface MonthlyPeakExceedanceChartProps {
  selectedYear?: string;
  batteryCapacity?: number;
  transformerLimit: number;
  solarSize?: number;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MonthlyPeakExceedanceChart({
  selectedYear = "2025",
  batteryCapacity = 16,
  transformerLimit,
  solarSize = 16,
}: MonthlyPeakExceedanceChartProps) {
  const solarMW = getSolarHourlyMW(solarSize);
  const year = selectedYear === "all" ? "2025" : selectedYear;
  const yearData = yearlyPeakData[year] || yearlyPeakData["2025"];

  const data = yearData.months.map((monthData) => {
    let maxDemand = 0;
    let exceedanceCount = 0;

    monthData.days.forEach((day) => {
      day.hours.forEach((demand, hourIndex) => {
        const afterSolar = Math.max(0, demand - solarMW[hourIndex]);
        const isPeakHour = hourIndex >= 16 && hourIndex <= 22;
        const discharge = isPeakHour ? Math.min(batteryCapacity, afterSolar) : 0;
        const effective = afterSolar - discharge;

        if (effective > maxDemand) maxDemand = effective;
        if (effective > transformerLimit) exceedanceCount++;
      });
    });

    return {
      month: monthData.monthName,
      maxDemand: Math.round(maxDemand),
      exceedanceCount,
    };
  });

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Monthly Peak Demand & Exceedance</h3>
        <p className="text-sm text-muted-foreground">
          Max recorded demand & hours exceeding {transformerLimit} MW limit — {selectedYear === "all" ? "2025" : selectedYear}
          {batteryCapacity > 0 && ` • ${batteryCapacity}MW Battery`}
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="mw"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: "MW", angle: -90, position: "insideLeft", style: { fill: "hsl(var(--muted-foreground))", fontSize: 11 } }}
            />
            <YAxis
              yAxisId="count"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: "Hours", angle: 90, position: "insideRight", style: { fill: "hsl(var(--muted-foreground))", fontSize: 11 } }}
            />
            <ReferenceLine
              yAxisId="mw"
              y={transformerLimit}
              stroke="hsl(var(--destructive))"
              strokeDasharray="6 3"
              label={{
                value: `Limit: ${transformerLimit} MW`,
                position: "insideTopRight",
                style: { fill: "hsl(var(--destructive))", fontSize: 10, fontWeight: 600 },
              }}
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
                if (name === "Max Demand") return [`${value} MW`, name];
                if (name === "Hours Over Limit") return [`${value} hrs`, name];
                return [value, name];
              }}
            />
            <Legend />
            <Bar
              yAxisId="count"
              dataKey="exceedanceCount"
              name="Hours Over Limit"
              fill="hsl(var(--destructive))"
              opacity={0.6}
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="exceedanceCount"
                position="top"
                style={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 600 }}
                formatter={(v: number) => (v > 0 ? v : "")}
              />
            </Bar>
            <Line
              yAxisId="mw"
              type="monotone"
              dataKey="maxDemand"
              name="Max Demand"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(var(--chart-1))" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
