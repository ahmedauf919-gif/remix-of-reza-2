import { transformerSpecs } from "@/data/nabq/dieselData";
import { Zap, Settings, Gauge } from "lucide-react";

export function TransformerSpecs() {
  const specs = [
    {
      icon: Zap,
      label: "Transformers",
      value: transformerSpecs.count,
      unit: "units",
    },
    {
      icon: Gauge,
      label: "Power Factor",
      value: transformerSpecs.powerFactor,
      unit: "",
    },
    {
      icon: Settings,
      label: "Capacity",
      value: transformerSpecs.capacity,
      unit: "MVA each",
    },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="mb-4 font-semibold">Transformer Specifications</h3>
      <div className="space-y-4">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-center justify-between border-b border-border/30 pb-3 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <spec.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{spec.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg font-semibold">
                {spec.value}
              </span>
              {spec.unit && (
                <span className="text-xs text-muted-foreground">
                  {spec.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
