import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { monthlySolarGeneration } from "@/data/nabq/overviewData";

const chartConfig = {
  mwh: { label: "Generation (MWh)", color: "hsl(45 93% 47%)" },
};

export function MonthlySolarChart() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Monthly Solar Generation</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={monthlySolarGeneration}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} label={{ value: "MWh", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="mwh" name="Solar (MWh)" fill="hsl(45 93% 47%)" radius={[4, 4, 0, 0]} opacity={0.85} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
