import { cn } from "@/lib/utils";

export function KPICard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "default" | "gold" | "success" | "warning" | "destructive";
}) {
  const toneCls = {
    default: "border-border",
    gold: "border-gold/40 bg-gold/5",
    success: "border-success/40 bg-success/5",
    warning: "border-warning/40 bg-warning/5",
    destructive: "border-destructive/40 bg-destructive/5",
  }[tone];
  return (
    <div className={cn("rounded-lg border bg-card p-3", toneCls)}>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold num text-foreground">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground num">{sub}</div>}
    </div>
  );
}
