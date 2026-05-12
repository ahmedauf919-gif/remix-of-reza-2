import { useMemo } from "react";
import { transformerCapacityData } from "@/data/nabq/dieselData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface MonthlyStatsTableProps {
  selectedYear?: string;
  growthRate?: number;
  efficiency?: number;
  dieselPrice?: number;
}

export function MonthlyStatsTable({ 
  selectedYear = "all",
  growthRate = 5,
  efficiency = 25,
  dieselPrice = 20
}: MonthlyStatsTableProps) {
  // Calculate adjusted values based on filters
  const adjustedData = useMemo(() => {
    const growthMultiplier = 1 + ((growthRate - 5) / 100);
    const efficiencyMultiplier = 25 / efficiency;
    
    if (selectedYear === "all") {
      // Aggregate data across all years by month
      const monthlyAggregates: Record<string, {
        monthName: string;
        month: number;
        minMwh: number;
        maxMwh: number;
        totalAvgMwh: number;
        countAvg: number;
        diesel: number;
        egpCost: number;
      }> = {};

      transformerCapacityData.forEach(yearData => {
        yearData.months.forEach(month => {
          if (month.maxMwh === 0) return;
          
          const key = month.monthName;
          const adjustedDiesel = Math.round(month.diesel * growthMultiplier * efficiencyMultiplier);
          
          if (!monthlyAggregates[key]) {
            monthlyAggregates[key] = {
              monthName: month.monthName,
              month: month.month,
              minMwh: month.minMwh,
              maxMwh: month.maxMwh,
              totalAvgMwh: month.avgMwh,
              countAvg: 1,
              diesel: adjustedDiesel,
              egpCost: adjustedDiesel * dieselPrice,
            };
          } else {
            monthlyAggregates[key].minMwh = Math.min(monthlyAggregates[key].minMwh, month.minMwh);
            monthlyAggregates[key].maxMwh = Math.max(monthlyAggregates[key].maxMwh, month.maxMwh);
            monthlyAggregates[key].totalAvgMwh += month.avgMwh;
            monthlyAggregates[key].countAvg += 1;
            monthlyAggregates[key].diesel += adjustedDiesel;
            monthlyAggregates[key].egpCost += adjustedDiesel * dieselPrice;
          }
        });
      });

      return Object.values(monthlyAggregates)
        .sort((a, b) => a.month - b.month)
        .map(item => ({
          ...item,
          avgMwh: Math.round(item.totalAvgMwh / item.countAvg),
        }));
    } else {
      // Single year data
      const yearData = transformerCapacityData.find(d => d.year === selectedYear);
      if (!yearData) return [];
      
      return yearData.months
        .filter(m => m.maxMwh > 0)
        .map(month => ({
          ...month,
          diesel: Math.round(month.diesel * growthMultiplier * efficiencyMultiplier),
          egpCost: Math.round(month.diesel * growthMultiplier * efficiencyMultiplier * dieselPrice),
        }));
    }
  }, [selectedYear, growthRate, efficiency, dieselPrice]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Monthly Energy Statistics</h3>
          <p className="text-sm text-muted-foreground">
            Min, Max, Average MWh and Diesel consumption
            {(growthRate !== 5 || efficiency !== 25) && (
              <span className="ml-2 text-warning">(Adjusted)</span>
            )}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Year: <span className="font-semibold text-foreground">
            {selectedYear === "all" ? "All Years (Aggregated)" : selectedYear}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Month</TableHead>
              <TableHead className="text-right text-muted-foreground">
                Min MWh
              </TableHead>
              <TableHead className="text-right text-muted-foreground">
                Max MWh
              </TableHead>
              <TableHead className="text-right text-muted-foreground">
                Avg MWh
              </TableHead>
              <TableHead className="text-right text-muted-foreground">
                Diesel (L)
              </TableHead>
              <TableHead className="text-right text-muted-foreground">
                Cost (EGP)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustedData.map((month) => (
              <TableRow
                key={month.month}
                className="border-border/30 transition-colors hover:bg-secondary/30"
              >
                <TableCell className="font-medium">
                  {month.monthName}
                </TableCell>
                <TableCell className="text-right font-mono text-chart-1">
                  {month.minMwh}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono font-semibold",
                    month.maxMwh > 100 ? "text-destructive" : "text-warning"
                  )}
                >
                  {month.maxMwh}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {month.avgMwh}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono font-semibold",
                    month.diesel > 0 ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {month.diesel > 0 ? formatNumber(month.diesel) : "-"}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono",
                    month.egpCost > 0 ? "text-warning" : "text-muted-foreground"
                  )}
                >
                  {month.egpCost > 0 ? formatNumber(month.egpCost) : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
