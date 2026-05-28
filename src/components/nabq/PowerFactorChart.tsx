import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine } from "recharts";
import { monthlyPowerFactor } from "@/data/nabq/overviewData";

const chartConfig = {
  trns1: { label: "Transformer 1", color: "hsl(var(--chart-1))" },
  trns2: { label: "Transformer 2", color: "hsl(var(--chart-2))" },
  trns3: { label: "Transformer 3", color: "hsl(var(--chart-3))" },
};

export function PowerFactorChart() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Monthly Power Factor by Transformer</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={monthlyPowerFactor}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} />
            <YAxis domain={[94, 100]} tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={98} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label={{ value: "Avg 98%", fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
            <Line type="monotone" dataKey="trns1" name="Trns 1" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="trns2" name="Trns 2" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="trns3" name="Trns 3" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
