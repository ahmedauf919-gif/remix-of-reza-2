import { egpPerLoadIncrease } from "@/data/nabq/dieselData";
import { TrendingUp } from "lucide-react";

export function LoadIncreaseCard() {
  const data = Object.entries(egpPerLoadIncrease).map(([key, value]) => ({
    percentage: key,
    egp: value,
  }));

  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-warning/10 p-3">
          <TrendingUp className="h-5 w-5 text-warning" />
        </div>
        <div>
          <h3 className="font-semibold">EGP Per Load Increase</h3>
          <p className="text-xs text-muted-foreground">Cost impact analysis</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={item.percentage}
            className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${
                  index === 0
                    ? "bg-success"
                    : index === 1
                    ? "bg-warning"
                    : "bg-destructive"
                }`}
              />
              <span className="font-mono text-sm font-medium">
                {item.percentage}
              </span>
            </div>
            <span className="font-mono text-lg font-bold text-primary">
              {item.egp}M EGP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
