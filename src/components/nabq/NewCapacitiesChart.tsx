import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

const newCapacities = [
  { name: "Global Hotels", mva: 54 },
  { name: "Golden Flower", mva: 54 },
  { name: "Baia Bianka", mva: 250 },
  { name: "IU", mva: 1500 },
  { name: "Radamis", mva: 35000 },
  { name: "Tamra Beach Staff Residence", mva: 1000 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
];

export function NewCapacitiesChart() {
  const total = newCapacities.reduce((s, c) => s + c.mva, 0);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          New Capacities Added
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            Total: {total.toLocaleString()} kVA
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={newCapacities} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => v.toLocaleString()} />
              <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value.toLocaleString()} kVA`, "Capacity"]}
              />
              <Bar dataKey="mva" radius={[0, 4, 4, 0]}>
                {newCapacities.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList dataKey="mva" position="right" formatter={(v: number) => v.toLocaleString()} style={{ fontSize: 11, fill: "hsl(var(--foreground))" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
