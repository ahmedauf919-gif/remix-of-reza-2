import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { yearlyOverviewData } from "@/data/nabq/overviewData";

const chartConfig = {
  consumptionGwh: { label: "Consumption (GWh)", color: "hsl(var(--chart-1))" },
  numberOfClients: { label: "Clients", color: "hsl(var(--chart-4))" },
};

// CAGR 2013–2025
const consumptionCagr = ((421 / 175) ** (1 / 12) - 1) * 100;
const clientsCagr = ((103 / 73) ** (1 / 12) - 1) * 100;
const avgCagr = (consumptionCagr + clientsCagr) / 2;

export function ConsumptionGrowthChart() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Consumption & Clients Growth
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            CAGR: Consumption {consumptionCagr.toFixed(1)}% · Clients {clientsCagr.toFixed(1)}% · Avg {avgCagr.toFixed(1)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ComposedChart data={yearlyOverviewData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="year" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} label={{ value: "GWh", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} label={{ value: "Clients", angle: 90, position: "insideRight", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="consumptionGwh" name="Consumption (GWh)" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} opacity={0.85} />
            <Line yAxisId="right" type="monotone" dataKey="numberOfClients" name="Clients" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
