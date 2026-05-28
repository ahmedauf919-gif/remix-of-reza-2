import { cn } from "@/lib/utils";
import { transformerCapacityData, loadingLevels } from "@/data/nabq/dieselData";
import { useMemo } from "react";

interface CapacityHeatmapProps {
  selectedYear?: string;
  growthRate?: number;
  efficiency?: number;
}

export function CapacityHeatmap({ 
  selectedYear = "all",
  growthRate = 5,
  efficiency = 25 
}: CapacityHeatmapProps) {
  // Calculate adjusted data based on filters
  const { displayData, adjustedDiesel, maxLoad, avgLoad } = useMemo(() => {
    const growthMultiplier = 1 + ((growthRate - 5) / 100);
    const efficiencyMultiplier = 25 / efficiency;

    if (selectedYear === "all") {
      // Aggregate data across all years by month
      const monthlyAggregates: Record<string, {
        month: number;
        monthName: string;
        levels: number[];
        minMwh: number;
        maxMwh: number;
        avgMwh: number;
        diesel: number;
      }> = {};

      transformerCapacityData.forEach(yearData => {
        yearData.months.forEach(month => {
          const key = month.monthName;
          
          if (!monthlyAggregates[key]) {
            monthlyAggregates[key] = {
              month: month.month,
              monthName: month.monthName,
              levels: [...month.levels],
              minMwh: month.minMwh,
              maxMwh: month.maxMwh,
              avgMwh: month.avgMwh,
              diesel: month.diesel,
            };
          } else {
            // Sum up levels across years
            monthlyAggregates[key].levels = monthlyAggregates[key].levels.map(
              (val, idx) => val + month.levels[idx]
            );
            monthlyAggregates[key].minMwh = Math.min(monthlyAggregates[key].minMwh, month.minMwh);
            monthlyAggregates[key].maxMwh = Math.max(monthlyAggregates[key].maxMwh, month.maxMwh);
            monthlyAggregates[key].avgMwh = Math.round((monthlyAggregates[key].avgMwh + month.avgMwh) / 2);
            monthlyAggregates[key].diesel += month.diesel;
          }
        });
      });

      const months = Object.values(monthlyAggregates)
        .sort((a, b) => a.month - b.month)
        .slice(0, 10);

      const totalDiesel = transformerCapacityData.reduce((sum, y) => sum + y.diesel, 0);
      const adjustedTotal = Math.round(totalDiesel * growthMultiplier * efficiencyMultiplier);

      const allMaxMwh = months.map(m => m.maxMwh);
      const allAvgMwh = months.filter(m => m.avgMwh > 0).map(m => m.avgMwh);

      return {
        displayData: months,
        adjustedDiesel: adjustedTotal,
        maxLoad: Math.max(...allMaxMwh, 0),
        avgLoad: allAvgMwh.length > 0 
          ? Math.round(allAvgMwh.reduce((a, b) => a + b, 0) / allAvgMwh.length)
          : 0,
      };
    } else {
      // Single year data
      const yearData = transformerCapacityData.find(d => d.year === selectedYear);
      if (!yearData) {
        return { displayData: [], adjustedDiesel: 0, maxLoad: 0, avgLoad: 0 };
      }

      const adjustedTotal = Math.round(yearData.diesel * growthMultiplier * efficiencyMultiplier);
      const months = yearData.months.slice(0, 10);
      const allMaxMwh = months.map(m => m.maxMwh);
      const allAvgMwh = months.filter(m => m.avgMwh > 0).map(m => m.avgMwh);

      return {
        displayData: months,
        adjustedDiesel: adjustedTotal,
        maxLoad: Math.max(...allMaxMwh, 0),
        avgLoad: allAvgMwh.length > 0 
          ? Math.round(allAvgMwh.reduce((a, b) => a + b, 0) / allAvgMwh.length)
          : 0,
      };
    }
  }, [selectedYear, growthRate, efficiency]);

  const getIntensity = (value: number, maxValue: number) => {
    if (value === 0) return 0;
    return Math.min((value / maxValue) * 100, 100);
  };

  const getColorClass = (levelIndex: number, intensity: number) => {
    if (intensity === 0) return "bg-secondary/30";

    if (levelIndex <= 1) {
      return intensity > 50 ? "bg-accent/70" : "bg-accent/40";
    } else if (levelIndex === 2) {
      return intensity > 50 ? "bg-success/70" : "bg-success/40";
    } else if (levelIndex === 3) {
      return intensity > 50 ? "bg-warning/70" : "bg-warning/40";
    } else {
      return intensity > 50 ? "bg-destructive/70" : "bg-destructive/40";
    }
  };

  const maxValues = displayData.map((m) =>
    Math.max(...m.levels.filter((l) => l > 0), 1)
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Transformer Capacity Utilization
          </h3>
          <p className="text-sm text-muted-foreground">
            Hours exceeded per loading factor level
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

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        {loadingLevels.map((level, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className={cn(
                "h-3 w-3 rounded",
                idx <= 1
                  ? "bg-accent"
                  : idx === 2
                  ? "bg-success"
                  : idx === 3
                  ? "bg-warning"
                  : "bg-destructive"
              )}
            />
            <span className="text-muted-foreground">
              {level.factor} ({level.capacity})
            </span>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="mb-2 grid grid-cols-[80px_repeat(6,1fr)] gap-1">
            <div className="text-xs font-medium text-muted-foreground">
              Month
            </div>
            {loadingLevels.map((level, idx) => (
              <div
                key={idx}
                className="text-center text-xs font-medium text-muted-foreground"
              >
                {level.factor}
              </div>
            ))}
          </div>

          {/* Rows */}
          {displayData.map((month, monthIdx) => (
            <div
              key={month.month}
              className="mb-1 grid grid-cols-[80px_repeat(6,1fr)] gap-1"
            >
              <div className="flex items-center text-sm font-medium">
                {month.monthName}
              </div>
              {month.levels.map((value, levelIdx) => (
                <div
                  key={levelIdx}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-md text-xs font-mono font-medium transition-all hover:scale-105",
                    getColorClass(
                      levelIdx,
                      getIntensity(value, maxValues[monthIdx] || 1)
                    )
                  )}
                >
                  {value > 0 ? value : "-"}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 md:grid-cols-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Total Diesel</p>
          <p className="font-mono text-lg font-bold text-primary">
            {formatNumber(adjustedDiesel)}L
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Peak Month</p>
          <p className="text-lg font-bold">August</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Max Load</p>
          <p className="font-mono text-lg font-bold text-destructive">
            {maxLoad} MWh
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Avg Load</p>
          <p className="font-mono text-lg font-bold text-accent">
            {avgLoad} MWh
          </p>
        </div>
      </div>
    </div>
  );
}
