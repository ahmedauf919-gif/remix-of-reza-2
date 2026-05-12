import { useMemo, useState } from "react";
import { WaterInputs, sensitivityIRR, fmtPct, fmtNum } from "@/lib/waterModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Table = ({ title, field, inputs, step }: { title: string; field: keyof WaterInputs; inputs: WaterInputs; step: number }) => {
  // Build 7 multipliers around 1.0 using user-defined step (e.g. 5 → 85%/90%/95%/100%/105%/110%/115%)
  const mults = useMemo(() => {
    const s = step / 100;
    return [-3, -2, -1, 0, 1, 2, 3].map(k => +(1 + k * s).toFixed(6));
  }, [step]);
  const rows = useMemo(() => sensitivityIRR(inputs, field, mults), [inputs, field, mults]);
  const baseVal = inputs[field] as number;
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm overflow-x-auto">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">Base = {fmtNum(baseVal, 4)} (actual input). Step = ±{step}%.</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground">
            <th className="py-1.5 text-left">Scenario</th>
            <th className="py-1.5 text-right">Value</th>
            <th className="py-1.5 text-right">Project IRR</th>
            <th className="py-1.5 text-right">Equity IRR</th>
            <th className="py-1.5 text-right">Min DSCR</th>
            <th className="py-1.5 text-right">LCOM³</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
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
                <td className="py-1.5 text-right font-mono">{fmtNum(r.lcom3, 2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const WaterSensitivity = ({ inputs }: { inputs: WaterInputs }) => {
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
        <p className="text-xs text-muted-foreground ml-auto">Base column = actual input value; other rows shift it by ±step.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Table title="Selling Price" field="sellingPriceEgpPerM3" inputs={inputs} step={step}/>
        <Table title="FX Rate (EGP/USD)" field="fxRateEgpPerUsd" inputs={inputs} step={step}/>
        <Table title="Electricity Price" field="electricityPriceEgpKwh" inputs={inputs} step={step}/>
        <Table title="CAPEX scaler (RO Unit, legacy)" field="roUnitUsd" inputs={inputs} step={step}/>
        <Table title="Min Take" field="minTakePct" inputs={inputs} step={step}/>
        <Table title="Senior Debt Rate (Yr1)" field="debtRateYr1" inputs={inputs} step={step}/>
      </div>
    </div>
  );
};
