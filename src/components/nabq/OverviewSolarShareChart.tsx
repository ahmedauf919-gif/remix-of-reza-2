import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import { monthlySolarGeneration } from "@/data/nabq/overviewData";

// Approximate monthly consumption breakdown from 421 GWh annual (2025)
const monthlyConsumption = [
  28000, 26000, 30000, 35000, 38000, 42000, 48000, 45000, 40000, 36000, 30000, 23000,
];

const data = monthlySolarGeneration.map((s, i) => {
  const totalMwh = monthlyConsumption[i];
  const pct = (s.mwh / totalMwh) * 100;
  return { month: s.month, solarPct: parseFloat(pct.toFixed(2)) };
});

const chartConfig = {
  solarPct: { label: "Solar Share (%)", color: "hsl(45 93% 47%)" },
};

export function OverviewSolarShareChart() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Monthly Solar Share of Total Consumption (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} label={{ value: "%", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="solarPct" name="Solar Share (%)" fill="hsl(45 93% 47%)" radius={[4, 4, 0, 0]} opacity={0.85}>
              <LabelList dataKey="solarPct" position="top" fontSize={10} fill="hsl(var(--muted-foreground))" formatter={(v: number) => `${v}%`} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
