import { Tranche, Currency } from "@/lib/loanModel";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  tranches: Tranche[];
  onChange: (t: Tranche[]) => void;
}

const ccyColors: Record<Currency, string> = {
  EGP: "bg-primary/10 text-primary border-primary/20",
  EUR: "bg-accent/10 text-accent border-accent/20",
  JPY: "bg-success/10 text-success border-success/20",
  USD: "bg-muted text-foreground",
};

export const TranchesTable = ({ tranches, onChange }: Props) => {
  const update = (id: number, patch: Partial<Tranche>) =>
    onChange(tranches.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const remove = (id: number) => onChange(tranches.filter((t) => t.id !== id));
  const add = () => {
    const nextId = Math.max(0, ...tranches.map((t) => t.id)) + 1;
    onChange([
      ...tranches,
      { id: nextId, lender: "New", currency: "USD", group: 9, principal: 10, tenorYears: 5, rate: 0.05 },
    ]);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-3">
        <div>
          <h3 className="font-semibold">Loan tranches</h3>
          <p className="text-xs text-muted-foreground">Edit any field to recompute the schedules and KPIs.</p>
        </div>
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="mr-1 h-4 w-4" /> Add tranche
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Lender</th>
              <th className="px-4 py-3 text-left">Ccy</th>
              <th className="px-4 py-3 text-right">Principal</th>
              <th className="px-4 py-3 text-right">Tenor (yrs)</th>
              <th className="px-4 py-3 text-right">Rate</th>
              <th className="px-4 py-3 text-right">Annual P+I (yr1)</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tranches.map((t) => {
              const annualP = t.principal / t.tenorYears;
              const yr1Int = t.principal * t.rate;
              return (
                <tr key={t.id} className="border-t border-border/60 transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="px-4 py-2">
                    <Input className="h-8 w-24" value={t.lender} onChange={(e) => update(t.id, { lender: e.target.value })} />
                  </td>
                  <td className="px-4 py-2">
                    <Select value={t.currency} onValueChange={(v) => update(t.id, { currency: v as Currency })}>
                      <SelectTrigger className="h-8 w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["EGP", "EUR", "JPY", "USD"] as Currency[]).map((c) => (
                          <SelectItem key={c} value={c}>
                            <Badge variant="outline" className={ccyColors[c]}>{c}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      step="0.01"
                      className="h-8 w-32 text-right font-mono"
                      value={t.principal}
                      onChange={(e) => update(t.id, { principal: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      className="h-8 w-20 text-right font-mono"
                      value={t.tenorYears}
                      onChange={(e) => update(t.id, { tenorYears: Math.max(1, parseInt(e.target.value) || 1) })}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      step="0.0001"
                      className="h-8 w-24 text-right font-mono"
                      value={(t.rate * 100).toFixed(4)}
                      onChange={(e) => update(t.id, { rate: (parseFloat(e.target.value) || 0) / 100 })}
                    />
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">
                    {(annualP + yr1Int).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
