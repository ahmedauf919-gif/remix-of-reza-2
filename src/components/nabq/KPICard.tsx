import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "primary" | "accent" | "success" | "warning";
  className?: string;
}

export function KPICard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  variant = "primary",
  className,
}: KPICardProps) {
  const variantStyles = {
    primary: "border-primary/30 hover:border-primary/50",
    accent: "border-accent/30 hover:border-accent/50",
    success: "border-success/30 hover:border-success/50",
    warning: "border-warning/30 hover:border-warning/50",
  };

  const iconStyles = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  const glowStyles = {
    primary: "glow-primary",
    accent: "glow-accent",
    success: "",
    warning: "",
  };

  return (
    <div
      className={cn(
        "glass-card p-6 transition-all duration-300 hover:scale-[1.02]",
        variantStyles[variant],
        glowStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="kpi-label">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="kpi-value">{value}</span>
            {unit && (
              <span className="text-lg font-medium text-muted-foreground">
                {unit}
              </span>
            )}
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last year</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-xl p-3", iconStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
