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
import { getYearData, yearlyEnergyData, solarSpecs } from "@/data/nabq/batteryData";

interface EnergyMixChartProps {
  selectedYear?: string;
  batteryCapacity?: number;
  solarSize?: number;
}

export function EnergyMixChart({ selectedYear = "2025", batteryCapacity = 16, solarSize = 16 }: EnergyMixChartProps) {
  const yearData = selectedYear === "all" 
    ? yearlyEnergyData[0]
    : getYearData(selectedYear);
  
  // Scale solar based on solarSize relative to default (16 MWp)
  const solarScale = solarSize / (solarSpecs.capacity || 16);

  const adjustedMonths = yearData.months.map((month) => {
    const scaledSolar = Math.round(month.solar * solarScale);
    const peakFactor = month.grid > 40000 ? 1.2 : month.grid > 30000 ? 1.0 : 0.8;
    const batteryShiftMWh = batteryCapacity * 30 * 4 * peakFactor;
    const gridReduction = Math.min(batteryShiftMWh, month.grid * 0.2);

    return {
      ...month,
      grid: Math.round(month.grid - gridReduction),
      solar: scaledSolar,
      batteryContribution: Math.round(gridReduction),
    };
  });
  
  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Monthly Energy Mix</h3>
        <p className="text-sm text-muted-foreground">
          Grid vs Solar contribution - {selectedYear === "all" ? "All Years" : selectedYear} (MWh)
          {batteryCapacity > 0 && ` • ${batteryCapacity}MW Battery`}
          {solarSize !== 16 && ` • ${solarSize}MWp Solar`}
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={adjustedMonths}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} MWh`,
                name === "grid" ? "Grid" : name === "solar" ? "Solar" : "Battery Shift",
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="grid"
              name="Grid"
              stackId="1"
              stroke="hsl(var(--chart-1))"
              fill="url(#colorGrid)"
            />
            <Area
              type="monotone"
              dataKey="solar"
              name="Solar"
              stackId="1"
              stroke="hsl(var(--chart-3))"
              fill="url(#colorSolar)"
            />
            {batteryCapacity > 0 && (
              <Area
                type="monotone"
                dataKey="batteryContribution"
                name="Battery Shift"
                stackId="1"
                stroke="hsl(var(--chart-2))"
                fill="url(#colorBattery)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
