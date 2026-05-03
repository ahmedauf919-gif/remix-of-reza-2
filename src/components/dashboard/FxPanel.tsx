import { FxRates } from "@/lib/loanModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  fx: FxRates;
  onChange: (fx: FxRates) => void;
}

export const FxPanel = ({ fx, onChange }: Props) => {
  const fields: { key: keyof FxRates; label: string }[] = [
    { key: "EGP", label: "EGP / USD" },
    { key: "EUR", label: "EUR / USD" },
    { key: "JPY", label: "JPY / USD" },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <h3 className="font-semibold">FX rates</h3>
      <p className="mb-4 text-xs text-muted-foreground">Used to convert each tranche to USD.</p>
      <div className="grid grid-cols-3 gap-3">
        {fields.map((f) => (
          <div key={f.key}>
            <Label className="text-xs text-muted-foreground">{f.label}</Label>
            <Input
              type="number"
              step="0.01"
              className="mt-1 font-mono"
              value={fx[f.key]}
              onChange={(e) => onChange({ ...fx, [f.key]: parseFloat(e.target.value) || 0 })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
