import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { averageSolarProfile } from "@/data/nabq/overviewData";

const chartConfig = {
  mw: { label: "Solar Output (MW)", color: "hsl(45 93% 47%)" },
};

export function SolarProfileChart() {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Average Daily Solar Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={averageSolarProfile}>
            <defs>
              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(45 93% 47%)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(45 93% 47%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="hour" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} tickFormatter={(v) => `${v}:00`} />
            <YAxis tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} label={{ value: "MW", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="mw" name="Solar Output (MW)" stroke="hsl(45 93% 47%)" fill="url(#solarGradient)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
