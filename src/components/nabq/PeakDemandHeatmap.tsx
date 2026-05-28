import { getPeakDataForMonth, calculateMonthStats } from "@/data/nabq/peakDemandData";
import { getSolarHourlyMW } from "@/data/nabq/batteryData";
import { cn } from "@/lib/utils";

interface PeakDemandHeatmapProps {
  selectedYear?: string;
  selectedMonth?: string;
  batteryCapacity?: number;
  transformerLimit?: number;
  solarSize?: number;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function PeakDemandHeatmap({
  selectedYear = "2025",
  selectedMonth = "all",
  batteryCapacity = 16,
  transformerLimit = 106,
  solarSize = 16,
}: PeakDemandHeatmapProps) {
  const year = selectedYear === "all" ? "2025" : selectedYear;
  const month = selectedMonth === "all" ? 8 : parseInt(selectedMonth);
  const solarMW = getSolarHourlyMW(solarSize);

  const monthData = getPeakDataForMonth(year, month);

  const adjustedMonthData = monthData.map((day) => ({
    ...day,
    hours: day.hours.map((demand, hourIndex) => {
      const afterSolar = Math.max(0, demand - solarMW[hourIndex]);
      const isPeakHour = hourIndex >= 16 && hourIndex <= 22;
      const batteryDischarge = isPeakHour ? Math.min(batteryCapacity, afterSolar) : 0;
      return afterSolar - batteryDischarge;
    }),
  }));

  const stats = calculateMonthStats(adjustedMonthData, transformerLimit);
  const originalStats = calculateMonthStats(monthData, transformerLimit);

  const getColor = (value: number) => {
    const percentage = value / transformerLimit;

    if (value > transformerLimit) return "bg-destructive text-destructive-foreground";
    if (percentage >= 0.9) return "bg-warning/80 text-warning-foreground";
    if (percentage >= 0.75) return "bg-chart-3/60 text-foreground";
    if (percentage >= 0.6) return "bg-chart-2/40 text-foreground";
    return "bg-secondary text-muted-foreground";
  };

  const displayCount = Math.min(30, adjustedMonthData.length);
  const displayDays = adjustedMonthData.slice(0, displayCount);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {monthNames[month - 1]} {year} Peak Demand Heatmap
            </h3>
            <p className="text-sm text-muted-foreground">
              Hourly MW demand (Day 1-{displayCount}) - Red = Over {transformerLimit} MW limit
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-destructive">{stats.maxDemand} MW</div>
              <div className="text-xs text-muted-foreground">Peak (with battery)</div>
            </div>
            {batteryCapacity > 0 && originalStats.maxDemand !== stats.maxDemand && (
              <div className="text-center">
                <div className="font-semibold text-success">
                  -{originalStats.maxDemand - stats.maxDemand} MW
                </div>
                <div className="text-xs text-muted-foreground">Reduction</div>
              </div>
            )}
            <div className="text-center">
              <div className="font-semibold text-warning">{stats.hoursAboveLimit}</div>
              <div className="text-xs text-muted-foreground">Hours &gt;Limit</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="mb-2 flex">
            <div className="w-12 shrink-0" />
            {hours.map((hour) => (
              <div key={hour} className="flex-1 text-center text-[10px] text-muted-foreground">
                {hour.toString().padStart(2, "0")}
              </div>
            ))}
          </div>

          <div className="max-h-[520px] space-y-1 overflow-y-auto pr-2">
            {displayDays.map((day) => (
              <div key={day.day} className="flex items-center">
                <div className="w-12 shrink-0 text-xs font-medium text-muted-foreground">
                  Day {day.day}
                </div>
                <div className="flex flex-1 gap-0.5">
                  {day.hours.map((demand, hourIndex) => (
                    <div
                      key={hourIndex}
                      className={cn(
                        "flex flex-1 items-center justify-center rounded-sm py-1 text-[9px] font-medium transition-colors",
                        getColor(demand)
                      )}
                      title={`Day ${day.day}, ${hourIndex}:00 - ${demand} MW`}
                    >
                      {demand > 95 ? demand : ""}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-6 rounded bg-secondary" />
              <span className="text-muted-foreground">&lt;60%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-6 rounded bg-chart-2/40" />
              <span className="text-muted-foreground">60-75%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-6 rounded bg-chart-3/60" />
              <span className="text-muted-foreground">75-90%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-6 rounded bg-warning/80" />
              <span className="text-muted-foreground">90-100%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-6 rounded bg-destructive" />
              <span className="text-muted-foreground">&gt;100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
