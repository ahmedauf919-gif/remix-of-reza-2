import * as React from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  value,
  onChange,
  type = "number",
  step,
  suffix,
  className,
}: {
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  type?: "number" | "percent";
  step?: number;
  suffix?: string;
  className?: string;
}) {
  const display = type === "percent" ? (Number(value) * 100).toString() : String(value);
  return (
    <label className={cn("flex flex-col gap-1 text-xs", className)}>
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          step={step ?? (type === "percent" ? 0.1 : "any")}
          value={display}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange(type === "percent" ? v / 100 : v);
          }}
          className="w-full rounded-md border border-border bg-input px-2 py-1.5 text-sm num text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {suffix && <span className="text-muted-foreground text-xs">{suffix}</span>}
      </div>
    </label>
  );
}
