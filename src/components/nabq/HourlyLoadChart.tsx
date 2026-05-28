import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { avgHourlyDemand } from "@/data/nabq/batteryData";

import { getSolarHourlyMW } from "@/data/nabq/batteryData";

interface HourlyLoadChartProps {
  batteryCapacity?: number;
  transformerLimit?: number;
  solarSize?: number;
}

export function HourlyLoadChart({ batteryCapacity = 16, transformerLimit = 106, solarSize = 16 }: HourlyLoadChartProps) {
  const solarMW = getSolarHourlyMW(solarSize);
  // Calculate load with solar reduction and battery peak shaving
  const data = avgHourlyDemand.map((d) => {
    const afterSolar = Math.max(0, d.demand - solarMW[d.hour]);
    const isPeakHour = d.hour >= 17 && d.hour <= 22;
    const peakThreshold = 70;
    const batteryDischarge = isPeakHour && afterSolar > peakThreshold
      ? Math.min(batteryCapacity, afterSolar - peakThreshold)
      : 0;
    const effectiveDemand = afterSolar - batteryDischarge;
    
    const isChargingHour = d.hour >= 1 && d.hour <= 6;
    const batteryCharge = isChargingHour ? Math.min(batteryCapacity * 0.3, 5) : 0;
    
    return {
      ...d,
      label: `${d.hour.toString().padStart(2, "0")}:00`,
      originalDemand: d.demand,
      effectiveDemand,
      batteryEffect: batteryDischarge > 0 ? -batteryDischarge : batteryCharge,
    };
  });

  const maxDemandOriginal = Math.max(...data.map(d => d.originalDemand));
  const maxDemandWithBattery = Math.max(...data.map(d => d.effectiveDemand));
  const peakReduction = maxDemandOriginal - maxDemandWithBattery;

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Daily Load Profile</h3>
            <p className="text-sm text-muted-foreground">
              Peak shaving effect with {batteryCapacity} MW battery
            </p>
          </div>
          {batteryCapacity > 0 && (
            <div className="text-right">
              <div className="text-sm font-semibold text-success">-{peakReduction} MW</div>
              <div className="text-xs text-muted-foreground">Peak Reduction</div>
            </div>
          )}
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="label"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[40, 110]}
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
                if (name === "originalDemand") return [`${value} MW`, "Original Demand"];
                if (name === "effectiveDemand") return [`${value} MW`, "With Battery"];
                return [`${value} MW`, name];
              }}
            />
            <ReferenceLine
              y={transformerLimit}
              stroke="hsl(var(--destructive))"
              strokeDasharray="5 5"
              label={{
                value: `Limit: ${transformerLimit} MW`,
                position: "top",
                fill: "hsl(var(--destructive))",
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="originalDemand"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              name="originalDemand"
            />
            <Line
              type="monotone"
              dataKey="effectiveDemand"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--chart-2))" }}
              name="effectiveDemand"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 border-t-2 border-dashed border-muted-foreground" />
          <span className="text-muted-foreground">Without Battery</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-chart-2" />
          <span className="text-muted-foreground">With Battery</span>
        </div>
      </div>
    </div>
  );
}
