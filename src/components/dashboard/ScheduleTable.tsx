import { ComputedTranche, YEARS, fmt } from "@/lib/loanModel";

interface Props {
  computed: ComputedTranche[];
  view: "native" | "usd";
}

export const ScheduleTable = ({ computed, view }: Props) => {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="border-b border-border bg-secondary/40 px-5 py-3">
        <h3 className="font-semibold">
          Amortization schedule {view === "usd" ? "(USD millions)" : "(native currency)"}
        </h3>
        <p className="text-xs text-muted-foreground">
          Interest, principal, and closing balance per tranche per year.
        </p>
      </div>
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
            <tr>
              <th className="sticky left-0 z-20 bg-muted/80 px-3 py-2 text-left">Tranche</th>
              <th className="px-3 py-2 text-left">Series</th>
              {YEARS.map((y) => (
                <th key={y} className="px-2 py-2 text-right font-mono text-muted-foreground">{y}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {computed.map(({ tranche, native, usd }) => {
              const data = view === "usd" ? usd : native;
              const series: { key: keyof typeof data; label: string; cls: string }[] = [
                { key: "interest", label: "Interest", cls: "text-accent" },
                { key: "principal", label: "Principal", cls: "text-primary" },
                { key: "balance", label: "Balance", cls: "text-foreground font-medium" },
              ];
              return series.map((s, i) => (
                <tr key={`${tranche.id}-${s.key}`} className="border-t border-border/40 hover:bg-secondary/30">
                  {i === 0 && (
                    <td rowSpan={3} className="sticky left-0 bg-card px-3 py-2 align-top">
                      <div className="font-semibold">#{tranche.id} {tranche.lender}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {tranche.currency} · {tranche.tenorYears}y · {(tranche.rate * 100).toFixed(2)}%
                      </div>
                    </td>
                  )}
                  <td className={`px-3 py-1.5 ${s.cls}`}>{s.label}</td>
                  {data[s.key].map((v, j) => (
                    <td key={j} className="px-2 py-1.5 text-right font-mono tabular-nums">
                      {fmt(v, view === "usd" ? 2 : tranche.currency === "JPY" ? 0 : 2)}
                    </td>
                  ))}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
