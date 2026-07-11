import { useMemo, useState } from "react";
import { CngInputs, runCngModel } from "@/lib/cngModel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type VarDef = { key: keyof CngInputs; label: string; unit: "pct" | "abs" };

const VARIABLES: VarDef[] = [
  { key: "transportSellingPriceEgp", label: "Transport price (EGP/m³)", unit: "abs" },
  { key: "gasCommissionEgp",         label: "Gas commission (EGP/m³)",  unit: "abs" },
  { key: "meterM3PerHour",           label: "Meter capacity (m³/hr)",   unit: "abs" },
  { key: "variableTransportPerKmEgp",label: "Variable transport (EGP/km)", unit: "abs" },
  { key: "msKwhPerM3",               label: "kWh per m³ compressed",    unit: "abs" },
  { key: "msElectricityEgpKwh",      label: "Electricity price",        unit: "abs" },
  { key: "debtPct",                  label: "Gearing",                  unit: "pct" },
  { key: "spreadPct",                label: "Bank spread",              unit: "pct" },
  { key: "loanTenorYears",           label: "Debt tenor (yrs)",         unit: "abs" },
  { key: "citTaxRatePct",            label: "CIT tax rate",             unit: "pct" },
  { key: "contingencyPct",           label: "Contingency %",            unit: "pct" },
];

const fmtPct = (v: number) => (isFinite(v) ? (v * 100).toFixed(2) + "%" : "n/a");
const fmtNum = (v: number, d = 2) => (isFinite(v) ? v.toFixed(d) : "n/a");
const applyDelta = (base: number, delta: number, unit: VarDef["unit"]) => unit === "pct" ? base + delta : base * (1 + delta);
const deltaLabel = (delta: number, unit: VarDef["unit"]) => delta === 0 ? "Base" : unit === "pct" ? (delta >= 0 ? "+" : "") + (delta * 100).toFixed(2) + "pp" : (delta >= 0 ? "+" : "") + (delta * 100).toFixed(0) + "%";
const valueLabel = (v: number, unit: VarDef["unit"]) => unit === "pct" ? (v * 100).toFixed(2) + "%" : Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(4);
function buildDeltas(range: number, steps: number): number[] {
  const n = steps % 2 === 0 ? steps + 1 : steps;
  const half = (n - 1) / 2;
  const arr: number[] = [];
  for (let i = -half; i <= half; i++) arr.push((i / half) * range);
  return arr;
}

type Metric = "equityIRR" | "projectIRR" | "minDSCR" | "lcom";
const METRICS: { key: Metric; label: string }[] = [
  { key: "equityIRR", label: "Equity IRR" },
  { key: "projectIRR", label: "Project IRR" },
  { key: "minDSCR", label: "Min DSCR" },
  { key: "lcom", label: "LCOM³ (EGP/m³)" },
];

export const CngSensitivity = ({ inputs }: { inputs: CngInputs }) => {
  const [selected, setSelected] = useState<Record<string, boolean>>(Object.fromEntries(VARIABLES.slice(0, 6).map(v => [v.key as string, true])));
  const [metric, setMetric] = useState<Metric>("equityIRR");
  const [rangePct, setRangePct] = useState(20);
  const [rangePP, setRangePP] = useState(2);
  const [steps, setSteps] = useState(7);

  const deltasRel = useMemo(() => buildDeltas(rangePct / 100, steps), [rangePct, steps]);
  const deltasPP = useMemo(() => buildDeltas(rangePP / 100, steps), [rangePP, steps]);
  const baseModel = useMemo(() => runCngModel(inputs), [inputs]);
  const baseVal = (m: typeof baseModel) => metric === "equityIRR" ? m.equityIRR : metric === "projectIRR" ? m.projectIRR : metric === "minDSCR" ? m.minDSCR : m.lcomEgpPerM3;
  const baseMetric = baseVal(baseModel);
  const isPctMetric = metric === "equityIRR" || metric === "projectIRR";
  const fmtMetric = (v: number) => isPctMetric ? fmtPct(v) : fmtNum(v, metric === "lcom" ? 3 : 2);

  const results = useMemo(() => VARIABLES.filter(v => selected[v.key as string]).map(v => {
    const base = inputs[v.key] as number;
    const deltas = v.unit === "pct" ? deltasPP : deltasRel;
    const cells = deltas.map(delta => {
      const newVal = applyDelta(base, delta, v.unit);
      const newInputs = { ...inputs, [v.key]: newVal } as CngInputs;
      let val = NaN;
      try { val = baseVal(runCngModel(newInputs)); } catch {}
      return { delta, newVal, val };
    });
    return { v, base, cells };
  }), [inputs, selected, deltasRel, deltasPP, metric]);

  const rowsByUnit = { abs: results.filter(r => r.v.unit !== "pct"), pct: results.filter(r => r.v.unit === "pct") };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <h3 className="font-semibold mb-1">Sensitivity matrix</h3>
        <p className="text-sm text-muted-foreground mb-4">Base {METRICS.find(x => x.key === metric)?.label}: <span className="font-mono font-semibold text-foreground">{fmtMetric(baseMetric)}</span>.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-xs">Output metric</Label>
            <select value={metric} onChange={e => setMetric(e.target.value as Metric)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {METRICS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
          </div>
          <div><Label className="text-xs">Relative range (±%)</Label><Input type="number" value={rangePct} min={1} max={50} onChange={e => setRangePct(Number(e.target.value) || 0)}/></div>
          <div><Label className="text-xs">Percentage-point range (±pp)</Label><Input type="number" step="0.5" value={rangePP} min={0.1} max={20} onChange={e => setRangePP(Number(e.target.value) || 0)}/></div>
          <div><Label className="text-xs">Steps (odd)</Label><Input type="number" value={steps} min={3} max={11} onChange={e => { const n = Math.max(3, Math.min(11, Number(e.target.value) || 7)); setSteps(n % 2 === 0 ? n + 1 : n); }}/></div>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Variables to test</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {VARIABLES.map(v => (
              <label key={v.key as string} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={!!selected[v.key as string]} onCheckedChange={(c) => setSelected(s => ({ ...s, [v.key as string]: !!c }))}/>
                <span>{v.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {(["abs","pct"] as const).map(unit => {
        const rows = rowsByUnit[unit];
        if (rows.length === 0) return null;
        const deltas = unit === "pct" ? deltasPP : deltasRel;
        return (
          <div key={unit} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] overflow-x-auto">
            <h4 className="font-semibold mb-3">{unit === "abs" ? "Relative shifts (% of base value)" : "Percentage-point shifts"}</h4>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Variable</TableHead><TableHead className="text-right">Base</TableHead>
                {deltas.map(d => <TableHead key={d} className="text-right">{deltaLabel(d, unit)}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {rows.map(({ v, base, cells }) => (
                  <TableRow key={v.key as string}>
                    <TableCell className="font-medium">{v.label}</TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">{valueLabel(base, v.unit)}</TableCell>
                    {cells.map((c, i) => {
                      const diff = c.val - baseMetric;
                      const better = metric === "lcom" ? diff < 0 : diff > 0;
                      const worse = metric === "lcom" ? diff > 0 : diff < 0;
                      const color = c.delta === 0 ? "text-foreground" : better ? "text-emerald-600 dark:text-emerald-400" : worse ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground";
                      return (
                        <TableCell key={i} className={`text-right font-mono ${color}`}>
                          <div>{fmtMetric(c.val)}</div>
                          {c.delta !== 0 && isFinite(c.val) && (
                            <div className="text-[10px] opacity-70">{(diff >= 0 ? "+" : "") + (isPctMetric ? fmtNum(diff * 100, 2) + "pp" : fmtNum(diff, metric === "lcom" ? 3 : 2))}</div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
};
