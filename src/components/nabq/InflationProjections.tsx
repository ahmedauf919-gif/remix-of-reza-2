import { useState } from "react";
import { TrendingUp, Pencil, Check } from "lucide-react";

interface InflationProjectionsProps {
  inflationRate?: number;
}

export function InflationProjections({ inflationRate = 10 }: InflationProjectionsProps) {
  const baseCapacity = 17.25;

  const initialValues = Array.from({ length: 2050 - 2026 + 1 }, (_, i) => {
    return i === 0 ? baseCapacity : baseCapacity * 2;
  });

  const [capacityValues, setCapacityValues] = useState<number[]>(initialValues);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const projections = capacityValues.map((val, i) => ({
    year: 2026 + i,
    extraCapacityUtilization: val,
  }));

  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-accent/10 p-3">
          <TrendingUp className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold">Radames Capacity Added</h3>
          <p className="text-xs text-muted-foreground">
            Yearly capacity growth forecast
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {projections.map((proj, index) => (
          <div
            key={proj.year}
            className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${
                  index === 0
                    ? "bg-success"
                    : index < 3
                    ? "bg-warning"
                    : "bg-destructive"
                }`}
              />
              <span className="font-mono text-sm font-medium">{proj.year}</span>
            </div>
            <div className="flex items-center gap-2">
              {editingIndex === index ? (
                <>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const newVals = [...capacityValues];
                        newVals[index] = parseFloat(editValue) || 0;
                        setCapacityValues(newVals);
                        setEditingIndex(null);
                      }
                    }}
                    className="w-24 rounded border border-border bg-background px-2 py-1 font-mono text-sm text-primary focus:outline-none focus:ring-1 focus:ring-ring"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      const newVals = [...capacityValues];
                      newVals[index] = parseFloat(editValue) || 0;
                      setCapacityValues(newVals);
                      setEditingIndex(null);
                    }}
                    className="rounded p-1 text-success hover:bg-success/10"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="font-mono text-lg font-bold text-primary">
                    +{proj.extraCapacityUtilization.toFixed(2)} MW
                  </span>
                  <button
                    onClick={() => {
                      setEditingIndex(index);
                      setEditValue(proj.extraCapacityUtilization.toFixed(2));
                    }}
                    className="rounded p-1 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
