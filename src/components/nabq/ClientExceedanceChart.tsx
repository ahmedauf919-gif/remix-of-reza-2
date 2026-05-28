import { useState } from "react";
import { clientExceedances } from "@/data/nabq/clientsDetailData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Slider } from "@/components/ui/slider";

const allData = clientExceedances
  .map((c) => ({
    name: c.name,
    fullName: c.name,
    contracted: c.contractedCapacity,
    exceeded: c.exceededCapacity,
    total: c.contractedCapacity + c.exceededCapacity,
  }))
  .sort((a, b) => b.total - a.total)
  .map((c, i) => ({ ...c, index: i }));

export function ClientExceedanceChart() {
  const [range, setRange] = useState<number[]>([1, allData.length]);

  const chartData = allData.slice(range[0] - 1, range[1]);

  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="mb-1 text-lg font-semibold">Client Capacity Exceedance 2025</h3>
          <p className="text-sm text-muted-foreground">
            Contracted vs Exceeded Capacity (kVA) — Showing clients {range[0]}–{range[1]} of {allData.length}
          </p>
        </div>
        <div className="flex items-center gap-3 min-w-[250px]">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Range: {range[0]}–{range[1]}</span>
          <Slider
            min={1}
            max={allData.length}
            step={1}
            value={range}
            onValueChange={setRange}
            minStepsBetweenThumbs={1}
            className="w-[200px]"
          />
        </div>
      </div>
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 10, right: 10, top: 5, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ""}
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} kVA`,
                name === "contracted" ? "Contracted" : "Exceeded",
              ]}
            />
            <Legend wrapperStyle={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <Bar dataKey="contracted" stackId="a" fill="hsl(var(--chart-1))" name="Contracted" radius={[0, 0, 0, 0]} />
            <Bar dataKey="exceeded" stackId="a" fill="hsl(var(--destructive))" name="Exceeded" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
