import { useMemo, useState } from "react";
import { PvInputs, runPvModel } from "@/lib/pvModel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type VarDef = {
  key: keyof PvInputs;
  label: string;
  unit: "pct" | "abs";
};

const VARIABLES: VarDef[] = [
  { key: "govtTariffEgp",          label: "Government tariff (EGP/kWh)", unit: "abs" },
  { key: "separateTariffEgp",      label: "Separate tariff (EGP/kWh)",   unit: "abs" },
  { key: "yieldP50",               label: "Yield P50 (kWh/kWp)",         unit: "abs" },
  { key: "yieldP90",               label: "Yield P90 (kWh/kWp)",         unit: "abs" },
  { key: "capacityKwp",            label: "Installed capacity (kWp)",     unit: "abs" },
  { key: "lossThereafterPct",      label: "Annual degradation",           unit: "pct" },
  { key: "maintenanceUsd",         label: "Maintenance / O&M (USD)",      unit: "abs" },
  { key: "insurancePctOfCapex",    label: "Insurance % of CAPEX",         unit: "pct" },
  { key: "debtPct",                label: "Gearing",                       unit: "pct" },
  { key: "spreadPct",              label: "Bank spread",                   unit: "pct" },
  { key: "loanTenorYears",         label: "Debt tenor (yrs)",              unit: "abs" },
  { key: "taxRatePct",             label: "Tax rate",                      unit: "pct" },
  { key: "opexYoYPct",             label: "OPEX escalation",               unit: "pct" },
  { key: "capitalisedInterestEgp", label: "Capitalised interest (EGP)",   unit: "abs" },
  { key: "contingencyPct",         label: "Contingency %",                 unit: "pct" },
];

const fmtPct = (v: number) => (isFinite(v) ? (v * 100).toFixed(2) + "%" : "n/a");
const fmtNum = (v: number, d = 2) => (isFinite(v) ? v.toFixed(d) : "n/a");

function applyDelta(base: number, delta: number, unit: VarDef["unit"]): number {
  return unit === "pct" ? base + delta : base * (1 + delta);
}
function deltaLabel(delta: number, unit: VarDef["unit"]): string {
  if (delta === 0) return "Base";
  if (unit === "pct") return (delta >= 0 ? "+" : "") + (delta * 100).toFixed(2) + "pp";
  return (delta >= 0 ? "+" : "") + (delta * 100).toFixed(0) + "%";
}
function valueLabel(v: number, unit: VarDef["unit"]): string {
  if (unit === "pct") return (v * 100).toFixed(2) + "%";
  if (Math.abs(v) >= 100) return v.toFixed(0);
  return v.toFixed(4);
}
function buildDeltas(range: number, steps: number): number[] {
  const n = steps % 2 === 0 ? steps + 1 : steps;
  const half = (n - 1) / 2;
  const arr: number[] = [];
  for (let i = -half; i <= half; i++) arr.push((i / half) * range);
  return arr;
}

type Metric = "equityIRR" | "projectIRR" | "minDSCR" | "lcoe";
const METRICS: { key: Metric; label: string }[] = [
  { key: "equityIRR", label: "Equity IRR" },
  { key: "projectIRR", label: "Project IRR" },
  { key: "minDSCR", label: "Min DSCR" },
  { key: "lcoe", label: "LCOE (EGP/kWh)" },
];

export const PvSensitivity = ({ inputs }: { inputs: PvInputs }) => {
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(VARIABLES.slice(0, 6).map(v => [v.key as string, true]))
  );
  const [metric, setMetric] = useState<Metric>("equityIRR");
  const [rangePct, setRangePct] = useState<number>(20);
  const [rangePP, setRangePP] = useState<number>(2);
  const [steps, setSteps] = useState<number>(7);

  const deltasRel = useMemo(() => buildDeltas(rangePct / 100, steps), [rangePct, steps]);
  const deltasPP = useMemo(() => buildDeltas(rangePP / 100, steps), [rangePP, steps]);

  const baseModel = useMemo(() => runPvModel(inputs), [inputs]);
  const baseVal = (m: typeof baseModel) =>
    metric === "equityIRR" ? m.equityIRR : metric === "projectIRR" ? m.projectIRR : metric === "minDSCR" ? m.minDSCR : m.lcoeEgpPerKwh;
  const baseMetric = baseVal(baseModel);

  const isPctMetric = metric === "equityIRR" || metric === "projectIRR";
  const fmtMetric = (v: number) => isPctMetric ? fmtPct(v) : fmtNum(v, metric === "lcoe" ? 3 : 2);

  const results = useMemo(() => {
    return VARIABLES.filter(v => selected[v.key as string]).map(v => {
      const base = inputs[v.key] as number;
      const deltas = v.unit === "pct" ? deltasPP : deltasRel;
      const cells = deltas.map(delta => {
        const newVal = applyDelta(base, delta, v.unit);
        const newInputs = { ...inputs, [v.key]: newVal } as PvInputs;
        let val = NaN;
        try { val = baseVal(runPvModel(newInputs)); } catch {}
        return { delta, newVal, val };
      });
      return { v, base, cells };
    });
  }, [inputs, selected, deltasRel, deltasPP, metric]);

  const deltasForHeader = (unit: VarDef["unit"]) => (unit === "pct" ? deltasPP : deltasRel);
  const rowsByUnit = {
    abs: results.filter(r => r.v.unit !== "pct"),
    pct: results.filter(r => r.v.unit === "pct"),
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <h3 className="font-semibold mb-1">Sensitivity matrix</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Base {METRICS.find(x => x.key === metric)?.label}: <span className="font-mono font-semibold text-foreground">{fmtMetric(baseMetric)}</span>.
          Each cell re-runs the full model with one variable shifted.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-xs">Output metric</Label>
            <select
              value={metric}
              onChange={e => setMetric(e.target.value as Metric)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {METRICS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs">Relative range (±%)</Label>
            <Input type="number" value={rangePct} min={1} max={50} onChange={e => setRangePct(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label className="text-xs">Percentage-point range (±pp)</Label>
            <Input type="number" step="0.5" value={rangePP} min={0.1} max={20} onChange={e => setRangePP(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label className="text-xs">Steps (odd, includes base)</Label>
            <Input type="number" value={steps} min={3} max={11} onChange={e => {
              const n = Math.max(3, Math.min(11, Number(e.target.value) || 7));
              setSteps(n % 2 === 0 ? n + 1 : n);
            }} />
          </div>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Variables to test</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {VARIABLES.map(v => (
              <label key={v.key as string} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={!!selected[v.key as string]}
                  onCheckedChange={(c) => setSelected(s => ({ ...s, [v.key as string]: !!c }))}
                />
                <span>{v.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {(["abs", "pct"] as const).map(unit => {
        const rows = rowsByUnit[unit];
        if (rows.length === 0) return null;
        const deltas = deltasForHeader(unit);
        return (
          <div key={unit} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] overflow-x-auto">
            <h4 className="font-semibold mb-3">
              {unit === "abs" ? "Relative shifts (% of base value)" : "Percentage-point shifts"}
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead className="text-right">Base</TableHead>
                  {deltas.map(d => (
                    <TableHead key={d} className="text-right">{deltaLabel(d, unit)}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ v, base, cells }) => (
                  <TableRow key={v.key as string}>
                    <TableCell className="font-medium">{v.label}</TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {valueLabel(base, v.unit)}
                    </TableCell>
                    {cells.map((c, i) => {
                      const diff = c.val - baseMetric;
                      // for LCOE, lower is better → invert color
                      const better = metric === "lcoe" ? diff < 0 : diff > 0;
                      const worse = metric === "lcoe" ? diff > 0 : diff < 0;
                      const color = c.delta === 0
                        ? "text-foreground"
                        : better ? "text-emerald-600 dark:text-emerald-400"
                        : worse ? "text-rose-600 dark:text-rose-400"
                        : "text-muted-foreground";
                      return (
                        <TableCell key={i} className={`text-right font-mono ${color}`}>
                          <div>{fmtMetric(c.val)}</div>
                          {c.delta !== 0 && isFinite(c.val) && (
                            <div className="text-[10px] opacity-70">
                              {(diff >= 0 ? "+" : "") + (isPctMetric ? fmtNum(diff * 100, 2) + "pp" : fmtNum(diff, metric === "lcoe" ? 3 : 2))}
                            </div>
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
