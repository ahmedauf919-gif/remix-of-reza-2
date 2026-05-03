import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface Props {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  accent?: "primary" | "accent" | "success";
}

export const KpiCard = ({ label, value, hint, icon, accent = "primary" }: Props) => {
  const ring =
    accent === "primary"
      ? "from-primary/15 to-primary/0 text-primary"
      : accent === "accent"
      ? "from-accent/15 to-accent/0 text-accent"
      : "from-success/15 to-success/0 text-success";
  return (
    <Card className="relative overflow-hidden border-border/60 bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${ring} blur-2xl`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && <div className={`rounded-xl bg-secondary p-2.5 ${accent === "primary" ? "text-primary" : accent === "accent" ? "text-accent" : "text-success"}`}>{icon}</div>}
      </div>
    </Card>
  );
};
