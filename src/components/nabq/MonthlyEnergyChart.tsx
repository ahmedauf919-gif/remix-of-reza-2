import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";

// Monthly energy consumption (MWh) for 2025 — derived from hourly demand data
const monthlyEnergy = [
  { month: "Jan", mwh: 23500 },
  { month: "Feb", mwh: 22100 },
  { month: "Mar", mwh: 27800 },
  { month: "Apr", mwh: 34200 },
  { month: "May", mwh: 38500 },
  { month: "Jun", mwh: 44600 },
  { month: "Jul", mwh: 52300 },
  { month: "Aug", mwh: 48700 },
  { month: "Sep", mwh: 42100 },
  { month: "Oct", mwh: 36400 },
  { month: "Nov", mwh: 28900 },
  { month: "Dec", mwh: 21900 },
];

const totalEnergy = monthlyEnergy.reduce((sum, m) => sum + m.mwh, 0);

const chartConfig = {
  mwh: { label: "Energy (MWh)", color: "hsl(var(--chart-1))" },
};

export function MonthlyEnergyChart() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Monthly Energy Consumption
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            Total: {(totalEnergy / 1000).toFixed(1)} GWh
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={monthlyEnergy}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} label={{ value: "MWh", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="mwh" name="Energy (MWh)" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} opacity={0.85}>
              <LabelList dataKey="mwh" position="top" fontSize={9} fill="hsl(var(--muted-foreground))" formatter={(v: number) => `${(v / 1000).toFixed(1)}k`} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
