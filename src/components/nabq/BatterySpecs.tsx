import { Battery, Sun, Zap, Timer } from "lucide-react";

interface BatterySpecsProps {
  batteryCapacity?: number;
  efficiency?: number;
  solarSize?: number;
}

export function BatterySpecs({ batteryCapacity = 16, efficiency = 85, solarSize = 16 }: BatterySpecsProps) {
  const specs = [
    {
      icon: Battery,
      label: "Battery Capacity",
      value: batteryCapacity,
      unit: "MW",
      color: "text-chart-2",
      highlight: true,
    },
    {
      icon: Timer,
      label: "Duration",
      value: 1,
      unit: "hr",
      color: "text-chart-3",
    },
    {
      icon: Zap,
      label: "Round-trip Eff.",
      value: efficiency,
      unit: "%",
      color: "text-success",
    },
    {
      icon: Sun,
      label: "Solar Capacity",
      value: solarSize,
      unit: "MWp",
      color: "text-chart-3",
    },
  ];

  const energyStorage = batteryCapacity * 1;
  const peakShavingPotential = batteryCapacity;
  const annualCycles = 365;
  const estimatedLifespan = Math.round(4000 / annualCycles);

  return (
    <div className="glass-card p-6">
      <h3 className="mb-4 font-semibold">System Specifications</h3>
      <div className="space-y-4">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className={`flex items-center justify-between border-b border-border/30 pb-3 last:border-0 last:pb-0 ${
              spec.highlight ? "bg-chart-2/5 -mx-2 px-2 py-2 rounded-lg" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <spec.icon className={`h-4 w-4 ${spec.color}`} />
              <span className="text-sm text-muted-foreground">{spec.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`font-mono text-lg font-semibold ${spec.highlight ? "text-chart-2" : ""}`}>
                {spec.value}
              </span>
              <span className="text-xs text-muted-foreground">{spec.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/30">
        <h4 className="text-xs font-medium text-muted-foreground mb-3">Derived Metrics</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-muted-foreground">Energy Storage</div>
            <div className="font-mono font-semibold">{energyStorage} MWh</div>
          </div>
          <div>
            <div className="text-muted-foreground">Peak Shaving</div>
            <div className="font-mono font-semibold text-success">-{peakShavingPotential} MW</div>
          </div>
          <div>
            <div className="text-muted-foreground">Daily Cycles</div>
            <div className="font-mono font-semibold">1</div>
          </div>
          <div>
            <div className="text-muted-foreground">Est. Lifespan</div>
            <div className="font-mono font-semibold">{estimatedLifespan} years</div>
          </div>
        </div>
      </div>
    </div>
  );
}
