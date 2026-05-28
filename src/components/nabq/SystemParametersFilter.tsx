import { Slider } from "@/components/ui/slider";
import { Settings, Sun, Zap, Gauge, TrendingUp } from "lucide-react";

export interface SystemParameters {
  efficiency: number;           // % (round-trip battery efficiency)
  powerFactor: number;          // 0-1
  solarSize: number;            // MWp
  transformerCapacity: number;  // MVA (total transformer capacity)
  inflationRate: number;        // % annual increase
}

export function computeMaxTransformerMw(params: SystemParameters): number {
  return Math.round((params.efficiency / 100) * params.powerFactor * params.transformerCapacity);
}

interface SystemParametersFilterProps {
  params: SystemParameters;
  onChange: (params: SystemParameters) => void;
}

export function SystemParametersFilter({ params, onChange }: SystemParametersFilterProps) {
  const update = (key: keyof SystemParameters, value: number) => {
    onChange({ ...params, [key]: value });
  };

  const maxTransMw = computeMaxTransformerMw(params);

  const filters = [
    {
      icon: Gauge,
      label: "Efficiency",
      key: "efficiency" as const,
      value: params.efficiency,
      min: 50,
      max: 100,
      step: 1,
      unit: "%",
      display: `${params.efficiency}%`,
    },
    {
      icon: Settings,
      label: "Power Factor",
      key: "powerFactor" as const,
      value: params.powerFactor,
      min: 0.7,
      max: 1.0,
      step: 0.01,
      unit: "",
      display: params.powerFactor.toFixed(2),
    },
    {
      icon: Sun,
      label: "Solar Size",
      key: "solarSize" as const,
      value: params.solarSize,
      min: 0,
      max: 100,
      step: 1,
      unit: "MWp",
      display: `${params.solarSize} MWp`,
    },
    {
      icon: Zap,
      label: "Transformer Capacity",
      key: "transformerCapacity" as const,
      value: params.transformerCapacity,
      min: 50,
      max: 300,
      step: 1,
      unit: "MVA",
      display: `${params.transformerCapacity} MVA`,
    },
    {
      icon: TrendingUp,
      label: "Inflation Rate",
      key: "inflationRate" as const,
      value: params.inflationRate,
      min: 1,
      max: 30,
      step: 1,
      unit: "%/yr",
      display: `${params.inflationRate}%/yr`,
    },
  ];

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-4 w-4 text-chart-1" />
        <span className="text-sm font-medium">System Parameters</span>
        <span className="ml-auto text-xs font-mono font-semibold text-chart-1">
          Max Transformers: {maxTransMw} MW = {params.efficiency}% × {params.powerFactor.toFixed(2)} × {params.transformerCapacity} MVA
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {filters.map((f) => (
          <div key={f.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <f.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{f.label}</span>
              </div>
              <span className="font-mono text-sm font-semibold text-chart-1">
                {f.display}
              </span>
            </div>
            <Slider
              value={[f.value]}
              onValueChange={(v) => update(f.key, v[0])}
              min={f.min}
              max={f.max}
              step={f.step}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{f.min}{f.unit}</span>
              <span>{f.max}{f.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
