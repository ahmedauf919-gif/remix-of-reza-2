import { useMemo, useState } from "react";
import { PvInputs, pvSensitivity, fmtPct, fmtNum } from "@/lib/pvModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Table = ({ title, field, inputs, step }: { title: string; field: keyof PvInputs; inputs: PvInputs; step: number }) => {
  const mults = useMemo(() => {
    const s = step / 100;
    return [-3, -2, -1, 0, 1, 2, 3].map(k => +(1 + k * s).toFixed(6));
  }, [step]);
  const rows = useMemo(() => pvSensitivity(inputs, field, mults), [inputs, field, mults]);
  const baseVal = inputs[field] as number;
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm overflow-x-auto">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">Base = {fmtNum(baseVal, 4)}. Step = ±{step}%.</p>
      <table className="w-full text-sm">
        <thead><tr className="text-xs text-muted-foreground">
          <th className="py-1.5 text-left">Scenario</th><th className="py-1.5 text-right">Value</th>
          <th className="py-1.5 text-right">Project IRR</th><th className="py-1.5 text-right">Equity IRR</th>
          <th className="py-1.5 text-right">Min DSCR</th><th className="py-1.5 text-right">LCOE</th>
        </tr></thead>
        <tbody>
          {rows.map(r => {
            const isBase = r.mult === 1;
            const delta = (r.mult - 1) * 100;
            const label = isBase ? "Base" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`;
            return (
              <tr key={r.mult} className={`border-t border-border/40 ${isBase ? "bg-secondary/30 font-medium" : ""}`}>
                <td className="py-1.5">{label}</td>
                <td className="py-1.5 text-right font-mono">{fmtNum(baseVal * r.mult, 4)}</td>
                <td className="py-1.5 text-right font-mono">{fmtPct(r.projectIRR)}</td>
                <td className="py-1.5 text-right font-mono">{fmtPct(r.equityIRR)}</td>
                <td className="py-1.5 text-right font-mono">{fmtNum(r.minDSCR, 2)}</td>
                <td className="py-1.5 text-right font-mono">{fmtNum(r.lcoe, 3)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const PvSensitivity = ({ inputs }: { inputs: PvInputs }) => {
  const [step, setStep] = useState(5);
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Step size (%)</Label>
          <Input type="number" step={1} min={1} max={50} value={step} onChange={(e) => setStep(Math.max(1, parseFloat(e.target.value) || 5))} className="w-32"/>
        </div>
        <div className="flex gap-2">
          {[1, 2.5, 5, 10, 15, 20].map(s => (
            <Button key={s} size="sm" variant={step === s ? "default" : "outline"} onClick={() => setStep(s)}>±{s}%</Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Table title="Government Tariff (EGP/kWh)" field="govtTariffEgp" inputs={inputs} step={step}/>
        <Table title="Yield P50" field="yieldP50" inputs={inputs} step={step}/>
        <Table title="Capacity (kWp)" field="capacityKwp" inputs={inputs} step={step}/>
        <Table title="Maintenance (USD)" field="maintenanceUsd" inputs={inputs} step={step}/>
        <Table title="Bank Spread" field="spreadPct" inputs={inputs} step={step}/>
        <Table title="Capitalised Interest" field="capitalisedInterestEgp" inputs={inputs} step={step}/>
      </div>
    </div>
  );
};
