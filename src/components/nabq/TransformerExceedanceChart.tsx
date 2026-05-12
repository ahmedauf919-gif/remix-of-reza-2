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
} from "recharts";
import { yearlyPeakData } from "@/data/nabq/peakDemandData";

import { getSolarHourlyMW } from "@/data/nabq/batteryData";

interface TransformerExceedanceChartProps {
  batteryCapacity: number;
  transformerLimit: number;
  solarSize?: number;
}

export function TransformerExceedanceChart({
  batteryCapacity,
  transformerLimit,
  solarSize = 16,
}: TransformerExceedanceChartProps) {
  const solarMW = getSolarHourlyMW(solarSize);
  const years = Object.keys(yearlyPeakData).sort();

  const data = years.map((year) => {
    const yearData = yearlyPeakData[year];
    let maxExceedance = 0;
    let hoursExceeded = 0;
    let peakDemand = 0;

    yearData.months.forEach((monthData) => {
      monthData.days.forEach((day) => {
        day.hours.forEach((demand, hourIndex) => {
          const afterSolar = Math.max(0, demand - solarMW[hourIndex]);
          const isPeakHour = hourIndex >= 16 && hourIndex <= 22;
          const discharge = isPeakHour ? Math.min(batteryCapacity, afterSolar) : 0;
          const effective = afterSolar - discharge;

          if (effective > peakDemand) peakDemand = effective;

          if (effective > transformerLimit) {
            hoursExceeded++;
            const exceedance = effective - transformerLimit;
            if (exceedance > maxExceedance) maxExceedance = exceedance;
          }
        });
      });
    });

    return {
      year,
      peakDemand,
      maxExceedance: Math.round(maxExceedance),
      hoursExceeded,
    };
  });

  return (
    <div className="glass-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Transformer Exceedance Across Years
        </h3>
        <p className="text-sm text-muted-foreground">
          Peak demand vs {transformerLimit} MW limit — max exceedance (MW) &amp;
          hours over limit per year
        </p>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              yAxisId="mw"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              label={{
                value: "MW",
                angle: -90,
                position: "insideLeft",
                style: { fill: "hsl(var(--muted-foreground))", fontSize: 11 },
              }}
            />
            <YAxis
              yAxisId="hours"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Hours",
                angle: 90,
                position: "insideRight",
                style: { fill: "hsl(var(--muted-foreground))", fontSize: 11 },
              }}
            />
            <ReferenceLine
              yAxisId="mw"
              y={transformerLimit}
              stroke="hsl(var(--destructive))"
              strokeDasharray="6 3"
              label={{
                value: `Limit: ${transformerLimit} MW`,
                position: "insideTopRight",
                style: {
                  fill: "hsl(var(--destructive))",
                  fontSize: 10,
                  fontWeight: 600,
                },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              formatter={(value: number, name: string) => {
                if (name === "Peak Demand") return [`${value} MW`, name];
                if (name === "Max Exceedance") return [`${value} MW`, name];
                if (name === "Hours Over Limit")
                  return [`${value.toLocaleString()} hrs`, name];
                return [value, name];
              }}
            />
            <Legend
              wrapperStyle={{
                color: "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
            />
            <Line
              yAxisId="mw"
              type="monotone"
              dataKey="peakDemand"
              name="Peak Demand"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
            <Bar
              yAxisId="mw"
              dataKey="maxExceedance"
              name="Max Exceedance"
              fill="hsl(var(--destructive))"
              opacity={0.7}
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="hours"
              type="monotone"
              dataKey="hoursExceeded"
              name="Hours Over Limit"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              strokeDasharray="4 2"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
