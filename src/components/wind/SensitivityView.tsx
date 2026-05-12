import { useMemo, useState } from "react";
import { ProjectInputs, runModel } from "@/lib/windModel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type VarDef = {
  key: keyof ProjectInputs;
  label: string;
  unit: "pct" | "abs" | "x";  // how to display the variable value
  // Default deltas applied to the base value. For "pct" inputs (decimal),
  // these are absolute additive deltas in percentage points (e.g. 0.01 = +1pp).
  // For "abs" / "x" inputs, these are relative deltas (-20% .. +20%).
};

const VARIABLES: VarDef[] = [
  { key: "tariffUsdPerKWh", label: "Tariff (USD/kWh)", unit: "abs" },
  { key: "yieldKWhPerKWp", label: "Yield (kWh/kWp)", unit: "abs" },
  { key: "availability", label: "Availability", unit: "pct" },
  { key: "epcCost", label: "EPC Cost", unit: "abs" },
  { key: "oAndM", label: "O&M Opex", unit: "abs" },
  { key: "gearing", label: "Gearing", unit: "pct" },
  { key: "interestRate", label: "Interest rate", unit: "pct" },
  { key: "debtTenorYears", label: "Debt tenor (yrs)", unit: "abs" },
  { key: "taxRate", label: "Tax rate", unit: "pct" },
  { key: "cpi", label: "Opex inflation", unit: "pct" },
  { key: "tariffEscalation", label: "Tariff escalation", unit: "pct" },
  { key: "degradation", label: "Degradation", unit: "pct" },
  { key: "riskFreeRate", label: "Risk-free rate (WACC)", unit: "pct" },
  { key: "equityBeta", label: "Equity beta (WACC)", unit: "abs" },
  { key: "vatRate", label: "VAT rate (capex)", unit: "pct" },
  { key: "customsDutyRate", label: "Customs duty (capex)", unit: "pct" },
];

const DEFAULT_DELTAS_REL = [-0.2, -0.1, -0.05, 0, 0.05, 0.1, 0.2];   // relative
const DEFAULT_DELTAS_PP = [-0.02, -0.01, -0.005, 0, 0.005, 0.01, 0.02]; // percentage points (decimal)

const fmtPct = (v: number) => (isFinite(v) ? (v * 100).toFixed(2) + "%" : "n/a");
const fmtNum = (v: number, d = 2) => (isFinite(v) ? v.toFixed(d) : "n/a");

function applyDelta(base: number, delta: number, unit: VarDef["unit"]): number {
  if (unit === "pct") return base + delta;
  return base * (1 + delta);
}

function deltaLabel(delta: number, unit: VarDef["unit"]): string {
  if (delta === 0) return "Base";
  if (unit === "pct") return (delta >= 0 ? "+" : "") + (delta * 100).toFixed(2) + "pp";
  return (delta >= 0 ? "+" : "") + (delta * 100).toFixed(0) + "%";
}

function valueLabel(v: number, unit: VarDef["unit"]): string {
  if (unit === "pct") return (v * 100).toFixed(2) + "%";
  if (v >= 100) return v.toFixed(0);
  return v.toFixed(4);
}

export const SensitivityView = ({ inputs }: { inputs: ProjectInputs }) => {
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(VARIABLES.slice(0, 6).map(v => [v.key, true]))
  );
  const [rangePct, setRangePct] = useState<number>(20); // % range for relative
  const [rangePP, setRangePP] = useState<number>(2);    // pp range for percentage
  const [steps, setSteps] = useState<number>(7);

  const deltasRel = useMemo(() => buildDeltas(rangePct / 100, steps), [rangePct, steps]);
  const deltasPP = useMemo(() => buildDeltas(rangePP / 100, steps), [rangePP, steps]);

  const baseModel = useMemo(() => runModel(inputs), [inputs]);
  const baseIRR = baseModel.equityIRR;

  const results = useMemo(() => {
    return VARIABLES.filter(v => selected[v.key as string]).map(v => {
      const base = inputs[v.key] as number;
      const deltas = v.unit === "pct" ? deltasPP : deltasRel;
      const cells = deltas.map(delta => {
        const newVal = applyDelta(base, delta, v.unit);
        const newInputs = { ...inputs, [v.key]: newVal } as ProjectInputs;
        let irr = NaN;
        try {
          irr = runModel(newInputs).equityIRR;
        } catch { /* ignore */ }
        return { delta, newVal, irr };
      });
      return { v, base, cells };
    });
  }, [inputs, selected, deltasRel, deltasPP]);

  const deltasForHeader = (unit: VarDef["unit"]) => unit === "pct" ? deltasPP : deltasRel;

  const rowsByUnit = {
    abs: results.filter(r => r.v.unit !== "pct"),
    pct: results.filter(r => r.v.unit === "pct"),
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <h3 className="font-semibold mb-1">Sensitivity on Equity IRR</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Base equity IRR: <span className="font-mono font-semibold text-foreground">{fmtPct(baseIRR)}</span>.
          Each cell re-runs the full model with one variable shifted.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label className="text-xs">Relative range (±%)</Label>
            <Input type="number" value={rangePct} min={1} max={50}
              onChange={e => setRangePct(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label className="text-xs">Percentage-point range (±pp)</Label>
            <Input type="number" step="0.5" value={rangePP} min={0.1} max={20}
              onChange={e => setRangePP(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label className="text-xs">Steps (odd, includes base)</Label>
            <Input type="number" value={steps} min={3} max={11}
              onChange={e => {
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
                      const diff = c.irr - baseIRR;
                      const color = c.delta === 0
                        ? "text-foreground"
                        : diff > 0 ? "text-emerald-600 dark:text-emerald-400"
                        : diff < 0 ? "text-rose-600 dark:text-rose-400"
                        : "text-muted-foreground";
                      return (
                        <TableCell key={i} className={`text-right font-mono ${color}`}>
                          <div>{fmtPct(c.irr)}</div>
                          {c.delta !== 0 && isFinite(c.irr) && (
                            <div className="text-[10px] opacity-70">
                              {(diff >= 0 ? "+" : "") + fmtNum(diff * 100, 2)}pp
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

function buildDeltas(range: number, steps: number): number[] {
  const n = steps % 2 === 0 ? steps + 1 : steps;
  const half = (n - 1) / 2;
  const arr: number[] = [];
  for (let i = -half; i <= half; i++) arr.push((i / half) * range);
  return arr;
}
