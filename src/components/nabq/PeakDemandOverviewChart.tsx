import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Legend, LabelList } from "recharts";
import { monthlyPeakDemandOverview } from "@/data/nabq/overviewData";

const chartConfig = {
  peak2023: { label: "2023", color: "hsl(var(--chart-3))" },
  peak2024: { label: "2024", color: "hsl(var(--chart-2))" },
  peak2025: { label: "2025", color: "hsl(var(--chart-1))" },
};

export function PeakDemandOverviewChart() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Monthly Peak Demand (MW)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ComposedChart data={monthlyPeakDemandOverview} margin={{ top: 25, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} label={{ value: "MW", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            
            <Bar dataKey="peak2023" name="2023" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} opacity={0.6}>
              <LabelList dataKey="peak2023" position="top" fontSize={9} fill="hsl(var(--muted-foreground))" />
            </Bar>
            <Bar dataKey="peak2024" name="2024" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} opacity={0.75}>
              <LabelList dataKey="peak2024" position="top" fontSize={9} fill="hsl(var(--muted-foreground))" />
            </Bar>
            <Bar dataKey="peak2025" name="2025" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} opacity={0.9}>
              <LabelList dataKey="peak2025" position="top" fontSize={9} fill="hsl(var(--muted-foreground))" />
            </Bar>
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
