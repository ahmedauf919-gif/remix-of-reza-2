import { Slider } from "@/components/ui/slider";
import { Battery } from "lucide-react";

interface BatteryCapacityFilterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function BatteryCapacityFilter({
  value,
  onChange,
  min = 0,
  max = 500,
  step = 10,
}: BatteryCapacityFilterProps) {
  const handleChange = (values: number[]) => {
    onChange(values[0]);
  };

  // Calculate the effect on peak shaving
  const peakShavingCapacity = value; // MW that can be shaved
  const energyCapacity = value * 1; // 1 hour duration
  const estimatedSavings = value > 0 ? Math.round(value * 42000) : 0; // Rough estimate EGP/month

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Battery className="h-4 w-4 text-chart-2" />
        <span className="text-sm font-medium">Battery Capacity Simulation</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Capacity</span>
          <span className="font-mono text-lg font-semibold text-chart-2">
            {value} <span className="text-xs text-muted-foreground">MW</span>
          </span>
        </div>

        <Slider
          value={[value]}
          onValueChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min} MW</span>
          <span>{max} MW</span>
        </div>

        {/* Impact Preview */}
        <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Peak Shaving</span>
            <span className="font-mono text-success">-{peakShavingCapacity} MW</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Energy Storage</span>
            <span className="font-mono">{energyCapacity} MWh</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Est. Monthly Savings</span>
            <span className="font-mono text-chart-3">
              {estimatedSavings.toLocaleString()} EGP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
