import { getYearData, yearlyEnergyData } from "@/data/nabq/batteryData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface EnergyStatsTableProps {
  selectedYear?: string;
  selectedMonth?: string;
}

export function EnergyStatsTable({ selectedYear = "2025", selectedMonth = "all" }: EnergyStatsTableProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Show comparison across years for a specific month
  if (selectedMonth !== "all") {
    const monthIndex = parseInt(selectedMonth) - 1;
    const comparisonData = yearlyEnergyData.map(yearData => ({
      year: yearData.year,
      ...yearData.months[monthIndex],
    }));

    return (
      <div className="glass-card p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">{comparisonData[0]?.monthName} - Year Over Year</h3>
          <p className="text-sm text-muted-foreground">
            Compare {comparisonData[0]?.monthName} across all years
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Year</TableHead>
                <TableHead className="text-right text-muted-foreground">Grid</TableHead>
                <TableHead className="text-right text-muted-foreground">Solar</TableHead>
                <TableHead className="text-right text-muted-foreground">Total</TableHead>
                <TableHead className="text-right text-muted-foreground">Solar %</TableHead>
                <TableHead className="text-right text-muted-foreground">YoY Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row, index) => {
                const prevTotal = index > 0 ? comparisonData[index - 1].total : row.total;
                const growth = ((row.total - prevTotal) / prevTotal) * 100;
                
                return (
                  <TableRow
                    key={row.year}
                    className="border-border/30 transition-colors hover:bg-secondary/30"
                  >
                    <TableCell className="font-medium">{row.year}</TableCell>
                    <TableCell className="text-right font-mono text-chart-1">
                      {formatNumber(row.grid)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-chart-3">
                      {formatNumber(row.solar)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {formatNumber(row.total)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-mono font-semibold",
                        row.solarPercentage >= 10 ? "text-success" : "text-chart-3"
                      )}
                    >
                      {row.solarPercentage}%
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-mono font-semibold",
                        index === 0 ? "text-muted-foreground" : growth > 0 ? "text-warning" : "text-success"
                      )}
                    >
                      {index === 0 ? "-" : `+${growth.toFixed(1)}%`}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Show monthly breakdown for selected year
  const yearData = getYearData(selectedYear === "all" ? "2025" : selectedYear);

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Monthly Energy Breakdown - {selectedYear === "all" ? "2025" : selectedYear}</h3>
        <p className="text-sm text-muted-foreground">
          Grid, Solar, and Total consumption (MWh)
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Month</TableHead>
              <TableHead className="text-right text-muted-foreground">Grid</TableHead>
              <TableHead className="text-right text-muted-foreground">Solar</TableHead>
              <TableHead className="text-right text-muted-foreground">Total</TableHead>
              <TableHead className="text-right text-muted-foreground">Solar %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {yearData.months.map((month) => (
              <TableRow
                key={month.month}
                className="border-border/30 transition-colors hover:bg-secondary/30"
              >
                <TableCell className="font-medium">{month.monthName}</TableCell>
                <TableCell className="text-right font-mono text-chart-1">
                  {formatNumber(month.grid)}
                </TableCell>
                <TableCell className="text-right font-mono text-chart-3">
                  {formatNumber(month.solar)}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">
                  {formatNumber(month.total)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono font-semibold",
                    month.solarPercentage >= 10
                      ? "text-success"
                      : month.solarPercentage >= 7
                      ? "text-chart-3"
                      : "text-warning"
                  )}
                >
                  {month.solarPercentage}%
                </TableCell>
              </TableRow>
            ))}
            {/* Yearly Total Row */}
            <TableRow className="border-t-2 border-border bg-secondary/20 font-bold">
              <TableCell>TOTAL</TableCell>
              <TableCell className="text-right font-mono text-chart-1">
                {formatNumber(yearData.totals.grid)}
              </TableCell>
              <TableCell className="text-right font-mono text-chart-3">
                {formatNumber(yearData.totals.solar)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatNumber(yearData.totals.total)}
              </TableCell>
              <TableCell className="text-right font-mono text-primary">
                {yearData.totals.solarPercentage}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
