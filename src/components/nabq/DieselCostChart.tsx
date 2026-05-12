import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface YearlyDieselData {
  year: string;
  diesel: number;
  egpCost: number;
}

interface DieselCostChartProps {
  yearlyData?: YearlyDieselData[];
  dieselPrice?: number;
  selectedYear?: string;
}

export function DieselCostChart({ 
  yearlyData = [], 
  dieselPrice = 20,
  selectedYear = "all" 
}: DieselCostChartProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const colors = [
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-1))",
  ];

  // Filter data based on selected year
  const displayData = selectedYear === "all" 
    ? yearlyData 
    : yearlyData.filter(d => d.year === selectedYear);

  // Early return if no data
  if (!yearlyData || yearlyData.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Annual Diesel Consumption</h3>
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Annual Diesel Consumption</h3>
        <p className="text-sm text-muted-foreground">
          Projected liters needed per year
          <span className="ml-2 text-primary">
            (@ {dieselPrice} EGP/L)
          </span>
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="year"
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
              tickFormatter={formatNumber}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number, name: string) => {
                if (name === "diesel") {
                  return [`${formatNumber(value)} liters`, "Diesel"];
                }
                return [value, name];
              }}
            />
            <Bar dataKey="diesel" radius={[8, 8, 0, 0]}>
              {displayData.map((entry, index) => {
                const colorIndex = yearlyData.findIndex(d => d.year === entry.year);
                return (
                  <Cell key={`cell-${index}`} fill={colors[colorIndex] || colors[0]} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={`mt-4 grid gap-4 ${displayData.length === 1 ? 'grid-cols-1' : displayData.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {displayData.map((item, index) => {
          const colorIndex = yearlyData.findIndex(d => d.year === item.year);
          return (
            <div
              key={item.year}
              className="rounded-lg bg-secondary/50 p-3 text-center"
            >
              <p className="text-xs text-muted-foreground">{item.year}</p>
              <p
                className="text-lg font-bold"
                style={{ color: colors[colorIndex] || colors[0] }}
              >
                {formatNumber(item.diesel)}L
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatNumber(item.egpCost)} EGP
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
