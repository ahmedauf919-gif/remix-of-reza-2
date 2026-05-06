import { ProjectInputs, DebtTranche, CAPEX_TAXABLE_DEFAULT, CAPEX_TAX_EXCLUDED } from "@/lib/windModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface Props {
  inputs: ProjectInputs;
  onChange: (i: ProjectInputs) => void;
}

type Field<T = ProjectInputs> = {
  key: keyof T;
  label: string;
  unit?: string;
  step?: number;
  pct?: boolean;
  switch01?: boolean;
  min?: number;
  max?: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Reusable atoms
// ─────────────────────────────────────────────────────────────────────────────
const NumberField = <T extends Record<string, any>>({ obj, k, f, onSet }: {
  obj: T; k: keyof T; f: Omit<Field<T>, "key">; onSet: (v: any) => void;
}) => {
  const raw = obj[k] as unknown as number;
  const display = f.pct ? (Number(raw) * 100).toFixed(3) : String(raw);
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">
        {f.label} {f.unit && <span className="opacity-60">({f.unit})</span>}{f.pct && <span className="opacity-60">(%)</span>}
      </Label>
      <Input type="number" step={f.step ?? 1} min={f.min} max={f.max} className="h-9 font-mono"
        value={display}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          if (isNaN(n)) return;
          let val = f.pct ? n / 100 : n;
          if (f.min !== undefined) val = Math.max(f.min, val);
          if (f.max !== undefined) val = Math.min(f.max, val);
          onSet(val);
        }}/>
    </div>
  );
};

const FieldsGrid = ({ inputs, onChange, fields }: { inputs: ProjectInputs; onChange: (i: ProjectInputs) => void; fields: Field[] }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {fields.map((f) => (
      <NumberField key={String(f.key)} obj={inputs} k={f.key} f={f}
        onSet={(v) => onChange({ ...inputs, [f.key]: v })} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Construction drawdown schedule editor — monthly % allocation (up to 36 months)
// ─────────────────────────────────────────────────────────────────────────────
const CapexScheduleEditor = ({ inputs, onChange }: Props) => {
  const M = Math.max(1, Math.min(36, Math.round(inputs.constructionMonths)));
  // Ensure schedule length matches constructionMonths.
  const sched: number[] = (() => {
    const s = (inputs.capexSchedulePct ?? []).slice(0, M);
    while (s.length < M) s.push(0);
    return s;
  })();
  const total = sched.reduce((a, b) => a + b, 0);

  const setMonth = (idx: number, v: number) => {
    const next = sched.slice();
    next[idx] = isNaN(v) ? 0 : v;
    onChange({ ...inputs, capexSchedulePct: next });
  };
  const distributeEvenly = () => {
    const v = 100 / M;
    onChange({ ...inputs, capexSchedulePct: Array.from({ length: M }, () => v) });
  };
  const normalizeTo100 = () => {
    if (total <= 0) return distributeEvenly();
    const next = sched.map(v => (v / total) * 100);
    onChange({ ...inputs, capexSchedulePct: next });
  };
  const setMonths = (months: number) => {
    const m = Math.max(1, Math.min(36, Math.round(months)));
    onChange({ ...inputs, constructionMonths: m, capexSchedulePct: Array.from({ length: m }, () => 100 / m) });
  };

  // Group months into year blocks for display.
  const years: { year: number; months: { idx: number; monthInYear: number }[] }[] = [];
  for (let m = 0; m < M; m++) {
    const yIdx = Math.floor(m / 12);
    if (!years[yIdx]) years[yIdx] = { year: inputs.constructionStart + yIdx, months: [] };
    years[yIdx].months.push({ idx: m, monthInYear: (m % 12) + 1 });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[180px]">
          <Label className="text-xs text-muted-foreground">Construction duration (months, max 36)</Label>
          <Input type="number" min={1} max={36} step={1} className="h-9 mt-1 font-mono"
            value={inputs.constructionMonths}
            onChange={(e) => setMonths(parseFloat(e.target.value))} />
        </div>
        <div className="min-w-[120px]">
          <Label className="text-xs text-muted-foreground">Total allocated</Label>
          <div className={`h-9 mt-1 flex items-center px-3 rounded-md border font-mono text-sm ${
            Math.abs(total - 100) < 0.01 ? "border-border" : "border-destructive text-destructive"
          }`}>
            {total.toFixed(2)}%
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={distributeEvenly}>Distribute evenly</Button>
        <Button variant="outline" size="sm" onClick={normalizeTo100}>Normalize to 100%</Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Allocate capex spend across construction months. Used to compute IDC (interest during construction) and yearly draws.
        The schedule is auto-normalized in calculations, but for clarity it should sum to 100%.
      </p>

      <div className="space-y-4">
        {years.map((y, yi) => {
          const yearTotal = y.months.reduce((s, m) => s + (sched[m.idx] || 0), 0);
          return (
            <div key={yi} className="rounded-lg border border-border/60 bg-secondary/20 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-sm">Year {yi + 1} — {y.year}</div>
                <div className="text-xs text-muted-foreground font-mono">Subtotal: {yearTotal.toFixed(2)}%</div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
                {y.months.map((m) => (
                  <div key={m.idx}>
                    <Label className="text-[10px] text-muted-foreground">M{m.monthInYear}</Label>
                    <Input type="number" step={0.1} className="h-8 font-mono text-xs px-2"
                      value={Number(sched[m.idx] ?? 0).toFixed(2)}
                      onChange={(e) => setMonth(m.idx, parseFloat(e.target.value))} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section field definitions (mirror of Excel "Inputs" sheet)
// ─────────────────────────────────────────────────────────────────────────────
const TIMING: Field[] = [
  { key: "constructionStart", label: "Construction start year" },
  { key: "preOpsMonths", label: "Pre-operations period", unit: "months" },
  { key: "operationsYears", label: "Operations period", unit: "years" },
  { key: "planningStartYear", label: "Planning start year" },
  { key: "planningMonths", label: "Planning duration", unit: "months" },
  { key: "delayMonths", label: "Delay duration", unit: "months" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Major maintenance schedule editor — % of hard capex per operations year
// ─────────────────────────────────────────────────────────────────────────────
const MajorMaintenanceScheduleEditor = ({ inputs, onChange }: Props) => {
  const N = Math.max(1, Math.floor(Number(inputs.operationsYears) || 0));
  const sched: number[] = (() => {
    const s = (inputs.mmSchedulePctOfCapex ?? []).slice(0, N);
    while (s.length < N) s.push(0);
    return s;
  })();
  const opsStart = inputs.constructionStart + Math.ceil((inputs.constructionMonths + inputs.preOpsMonths) / 12);
  const setYear = (idx: number, vPct: number) => {
    const next = sched.slice();
    next[idx] = isNaN(vPct) ? 0 : vPct / 100;
    onChange({ ...inputs, mmSchedulePctOfCapex: next });
  };
  const clearAll = () => onChange({ ...inputs, mmSchedulePctOfCapex: Array.from({ length: N }, () => 0) });
  const total = sched.reduce((a, b) => a + b, 0) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Scheduled major maintenance — % of hard capex per year</div>
          <p className="text-xs text-muted-foreground mt-1">
            Allocate one-off / cyclical major maintenance as a % of hard capex (EPC + development + substation/contingency).
            Applied in addition to the flat annual amounts above and escalated by CPI.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground font-mono">Cumulative: {total.toFixed(2)}%</div>
          <Button variant="outline" size="sm" onClick={clearAll}>Clear</Button>
        </div>
      </div>
      <div className="rounded-lg border border-border/60 bg-secondary/20 p-3">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
          {sched.map((v, idx) => (
            <div key={idx}>
              <Label className="text-[10px] text-muted-foreground">Y{idx + 1} — {opsStart + idx}</Label>
              <Input type="number" step={0.1} className="h-8 font-mono text-xs px-2"
                value={(Number(v) * 100).toFixed(2)}
                onChange={(e) => setYear(idx, parseFloat(e.target.value))} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CAPEX: Field[] = [
  { key: "preConstructionCosts", label: "Pre-construction costs", unit: "USD '000" },
  { key: "epcCost", label: "EPC costs", unit: "USD '000" },
  { key: "developmentPremiums", label: "Development premiums", unit: "USD '000" },
  { key: "developmentExpenses", label: "Development expenses", unit: "USD '000" },
  { key: "land", label: "Land", unit: "USD '000" },
  { key: "esMeasures", label: "E&S implementation", unit: "USD '000" },
  { key: "lendersTechAdvisors", label: "Lenders technical advisors", unit: "USD '000" },
  { key: "legalExpenses", label: "Legal expenses", unit: "USD '000" },
  { key: "administrativeCosts", label: "Administrative costs", unit: "USD '000" },
  { key: "financialAudit", label: "Financial audit", unit: "USD '000" },
  { key: "insuranceConstruction", label: "Insurance during construction", unit: "USD '000" },
  { key: "contingency", label: "Contingency", unit: "USD '000" },
  { key: "substation", label: "Substation", unit: "USD '000" },
  { key: "loanRepayment", label: "Loan repayment (capex)", unit: "USD '000" },
  { key: "taxesCapex", label: "Taxes (capex)", unit: "USD '000" },
  { key: "capexSpare15", label: "Spare 15", unit: "USD '000" },
  { key: "capexSpare16", label: "Spare 16", unit: "USD '000" },
  { key: "capexSpare17", label: "Spare 17", unit: "USD '000" },
  { key: "capexSpare18", label: "Spare 18", unit: "USD '000" },
  { key: "capexSpare19", label: "Spare 19", unit: "USD '000" },
  { key: "capexSpare20", label: "Spare 20", unit: "USD '000" },
  { key: "delayCostsPerMonth", label: "Construction delay costs", unit: "USD '000 p.m." },
];

// ─────────────────────────────────────────────────────────────────────────────
// Combined Capex + monthly drawdown editor — every capex line gets its own monthly % allocation
// ─────────────────────────────────────────────────────────────────────────────
const CAPEX_ITEMS: { key: keyof ProjectInputs; label: string }[] = [
  { key: "preConstructionCosts", label: "Pre-construction costs" },
  { key: "epcCost", label: "EPC costs" },
  { key: "developmentPremiums", label: "Development premiums" },
  { key: "developmentExpenses", label: "Development expenses" },
  { key: "land", label: "Land" },
  { key: "esMeasures", label: "E&S implementation" },
  { key: "lendersTechAdvisors", label: "Lenders technical advisors" },
  { key: "legalExpenses", label: "Legal expenses" },
  { key: "administrativeCosts", label: "Administrative costs" },
  { key: "financialAudit", label: "Financial audit" },
  { key: "insuranceConstruction", label: "Insurance during construction" },
  { key: "contingency", label: "Contingency" },
  { key: "substation", label: "Substation" },
  { key: "loanRepayment", label: "Loan repayment (capex)" },
  { key: "taxesCapex", label: "Taxes (capex)" },
  { key: "compEsmp", label: "Compensation — ESMP" },
  { key: "compCsr", label: "Compensation — CSR" },
  { key: "capexSpare15", label: "Spare 15" },
  { key: "capexSpare16", label: "Spare 16" },
  { key: "capexSpare17", label: "Spare 17" },
  { key: "capexSpare18", label: "Spare 18" },
  { key: "capexSpare19", label: "Spare 19" },
  { key: "capexSpare20", label: "Spare 20" },
];

const CapexWithScheduleEditor = ({ inputs, onChange }: Props) => {
  const M = Math.max(1, Math.min(36, Math.round(inputs.constructionMonths)));
  const itemScheds = inputs.capexItemSchedulesPct ?? {};
  const monthsHeader = Array.from({ length: M }, (_, m) => ({ m, year: Math.floor(m / 12) + 1, mInYear: (m % 12) + 1 }));

  const getSched = (k: string): number[] => {
    const s = (itemScheds[k] ?? []).slice(0, M);
    while (s.length < M) s.push(0);
    return s;
  };
  const setSchedCell = (k: string, mIdx: number, vPct: number) => {
    const cur = getSched(k);
    cur[mIdx] = isNaN(vPct) ? 0 : vPct;
    onChange({ ...inputs, capexItemSchedulesPct: { ...itemScheds, [k]: cur } });
  };
  const distributeEvenly = (k: string) => {
    onChange({ ...inputs, capexItemSchedulesPct: { ...itemScheds, [k]: Array.from({ length: M }, () => 100 / M) } });
  };
  const clearItem = (k: string) => {
    onChange({ ...inputs, capexItemSchedulesPct: { ...itemScheds, [k]: Array.from({ length: M }, () => 0) } });
  };
  const applyToAll = (sourceKey: string) => {
    const src = getSched(sourceKey);
    const next = { ...itemScheds };
    for (const it of CAPEX_ITEMS) next[it.key as string] = src.slice();
    onChange({ ...inputs, capexItemSchedulesPct: next });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <NumberField obj={inputs} k={"constructionMonths" as keyof ProjectInputs}
          f={{ label: "Construction period", unit: "months" }}
          onSet={(v) => onChange({ ...inputs, constructionMonths: Math.max(1, Math.min(36, Math.round(v))) })} />
        <NumberField obj={inputs} k={"capacityMWp" as keyof ProjectInputs}
          f={{ label: "Capacity (used for USD/MW basis)", unit: "MW" }}
          onSet={(v) => onChange({ ...inputs, capacityMWp: v })} />
        <NumberField obj={inputs} k={"vatRate" as keyof ProjectInputs}
          f={{ label: "VAT rate (onshore supply)", pct: true, step: 0.001 }}
          onSet={(v) => onChange({ ...inputs, vatRate: v })} />
        <NumberField obj={inputs} k={"customsDutyRate" as keyof ProjectInputs}
          f={{ label: "VAT rate (offshore supply)", pct: true, step: 0.001 }}
          onSet={(v) => onChange({ ...inputs, customsDutyRate: v })} />
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Switch checked={(inputs.taxesCapexAuto ?? 1) === 1}
          onCheckedChange={(v) => onChange({ ...inputs, taxesCapexAuto: v ? 1 : 0 })} />
        <span>Auto-compute "Taxes (capex)" from Onshore VAT × onshore portion + Offshore VAT × offshore portion on every taxable line. Onshore % + Offshore % must sum to 100. Loan repayment is excluded.</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Per-line basis: <b>USD '000</b> = absolute amount; <b>USD/MW</b> = amount per MW × capacity.
        Loan repayment is always treated as an absolute amount and is excluded from auto-tax.
      </p>
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-xs">
          <thead className="bg-secondary/40 sticky top-0">
            <tr>
              <th className="text-left p-2 min-w-[170px]">Capex item</th>
              <th className="p-2 min-w-[110px]">Basis</th>
              <th className="text-right p-2 min-w-[110px]">Amount</th>
              <th className="text-right p-2 min-w-[110px]">Resolved (USD '000)</th>
              <th className="p-2 min-w-[80px]">Taxable</th>
              <th className="text-right p-2 min-w-[90px]">Onshore %</th>
              <th className="text-right p-2 min-w-[90px]">Offshore %</th>
              <th className="p-2 min-w-[150px]">Actions</th>
              {monthsHeader.map(h => (
                <th key={h.m} className="text-right p-1 font-mono text-[10px] min-w-[52px]">
                  Y{h.year}M{h.mInYear}
                </th>
              ))}
              <th className="text-right p-2 min-w-[60px]">Σ%</th>
            </tr>
          </thead>
          <tbody>
            {CAPEX_ITEMS.map(it => {
              const k = it.key as string;
              const sched = getSched(k);
              const sum = sched.reduce((a, b) => a + b, 0);
              const amount = inputs[it.key] as unknown as number;
              const basisPerMW = (inputs.capexBasisPerMW?.[k] ?? 0) === 1;
              const resolved = basisPerMW ? (amount || 0) * (inputs.capacityMWp || 0) : (amount || 0);
              const taxExcluded = CAPEX_TAX_EXCLUDED.has(k);
              const taxable = inputs.capexTaxable?.[k] ?? CAPEX_TAXABLE_DEFAULT[k] ?? false;
              const onshorePct = (inputs.capexOnshorePct?.[k] ?? 1) * 100;
              const setBasis = (v: 0 | 1) =>
                onChange({ ...inputs, capexBasisPerMW: { ...(inputs.capexBasisPerMW ?? {}), [k]: v } });
              const setTaxable = (v: boolean) =>
                onChange({ ...inputs, capexTaxable: { ...(inputs.capexTaxable ?? {}), [k]: v } });
              const setOnshore = (pct: number) =>
                onChange({ ...inputs, capexOnshorePct: { ...(inputs.capexOnshorePct ?? {}), [k]: Math.max(0, Math.min(1, pct / 100)) } });
              return (
                <tr key={String(it.key)} className="border-t border-border/40 hover:bg-secondary/20">
                  <td className="p-2 font-medium">{it.label}</td>
                  <td className="p-1">
                    {k === "loanRepayment" ? (
                      <span className="text-[10px] text-muted-foreground">USD '000 (fixed)</span>
                    ) : (
                      <Select value={basisPerMW ? "perMW" : "abs"} onValueChange={(v) => setBasis(v === "perMW" ? 1 : 0)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="abs">USD '000</SelectItem>
                          <SelectItem value="perMW">USD '000 / MW</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                  <td className="p-1">
                    <Input type="number" step={1} className="h-8 font-mono text-xs text-right"
                      value={String(amount ?? 0)}
                      onChange={(e) => onChange({ ...inputs, [it.key]: parseFloat(e.target.value) || 0 })} />
                  </td>
                  <td className="p-2 text-right font-mono text-muted-foreground">{resolved.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                  <td className="p-1 text-center">
                    {taxExcluded ? (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    ) : (
                      <Switch checked={!!taxable} onCheckedChange={setTaxable} />
                    )}
                  </td>
                  <td className="p-1">
                    {taxExcluded ? (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    ) : (
                      <Input type="number" step={1} min={0} max={100} className="h-8 font-mono text-xs text-right"
                        value={onshorePct.toFixed(0)}
                        onChange={(e) => setOnshore(parseFloat(e.target.value) || 0)} />
                    )}
                  </td>
                  <td className="p-1">
                    {taxExcluded ? (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    ) : (
                      <Input type="number" step={1} min={0} max={100} className="h-8 font-mono text-xs text-right"
                        value={(100 - onshorePct).toFixed(0)}
                        onChange={(e) => setOnshore(100 - (parseFloat(e.target.value) || 0))} />
                    )}
                  </td>
                  <td className="p-1">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]" onClick={() => distributeEvenly(k)}>Even</Button>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]" onClick={() => clearItem(k)}>Clear</Button>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-[10px]" onClick={() => applyToAll(k)}>Copy→all</Button>
                    </div>
                  </td>
                  {monthsHeader.map(h => (
                    <td key={h.m} className="p-0.5">
                      <Input type="number" step={0.1} className="h-8 font-mono text-[11px] text-right px-1"
                        value={Number(sched[h.m] ?? 0).toFixed(2)}
                        onChange={(e) => setSchedCell(k, h.m, parseFloat(e.target.value))} />
                    </td>
                  ))}
                  <td className={`p-2 text-right font-mono ${Math.abs(sum - 100) < 0.01 || sum === 0 ? "text-muted-foreground" : "text-destructive"}`}>
                    {sum.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <NumberField obj={inputs} k={"delayCostsPerMonth" as keyof ProjectInputs}
          f={{ label: "Construction delay costs", unit: "USD '000 p.m." }}
          onSet={(v) => onChange({ ...inputs, delayCostsPerMonth: v })} />
      </div>
    </div>
  );
};

const COMP_PAYMENTS: Field[] = [
  { key: "compEsmp", label: "ESMP", unit: "USD '000" },
  { key: "compCsr", label: "CSR", unit: "USD '000" },
];

const MAJOR_MAINT: Field[] = [
  { key: "mmWindSpareParts", label: "Renewable farm spare parts", unit: "USD '000 p.a." },
  { key: "mmSubstationSpareParts", label: "Substation spare parts", unit: "USD '000 p.a." },
  { key: "mmDecommissioning", label: "Decommissioning", unit: "USD '000 p.a." },
  { key: "mmPmCm", label: "PM & CM", unit: "USD '000 p.a." },
  { key: "mmSpare", label: "Spare", unit: "USD '000 p.a." },
];

const RESERVES: Field[] = [
  { key: "dsraTargetMonths", label: "DSRA target lookforward", unit: "months" },
  { key: "performanceBond", label: "Performance bond (Land)", unit: "USD '000" },
  { key: "feeOnDSRAPct", label: "Fee on DSRA amount", pct: true, step: 0.001 },
  { key: "corpGuaranteeMonths", label: "Corp. guarantee months", unit: "months" },
  { key: "corpGuaranteeFeePct", label: "Corp. guarantee fee", pct: true, step: 0.001 },
  { key: "manualDSRAInput", label: "Manual DSRA input", unit: "USD '000" },
  { key: "statReserveMinNOPATPct", label: "Statutory reserve min", pct: true, step: 0.01 },
  { key: "shareCapital", label: "Share capital", unit: "USD '000" },
  { key: "initialWCAmount", label: "Initial WC amount", unit: "USD '000" },
  { key: "cashShortageOpY1", label: "Cash shortage OpY1", unit: "USD '000" },
];

const PERF_BOND: Field[] = [
  { key: "pbStartYear", label: "PB start year" },
  { key: "pbStep1Year", label: "PB stepdown 1 year" },
  { key: "pbStep2Year", label: "PB stepdown 2 year" },
  { key: "pbEndYear", label: "PB end year" },
  { key: "pbStartExposure", label: "Start exposure", pct: true, step: 0.01 },
  { key: "pbStep1Exposure", label: "Stepdown 1 exposure", pct: true, step: 0.01 },
  { key: "pbStep2Exposure", label: "Stepdown 2 exposure", pct: true, step: 0.01 },
];

const PRODUCTION: Field[] = [
  { key: "capacityMWp", label: "DC capacity", unit: "MWp" },
  { key: "hoursPerDay", label: "Max hours of generation", unit: "h/day" },
  { key: "yieldKWhPerKWp", label: "P50 yield per MW", unit: "kWh/kWp", step: 0.01 },
  { key: "yieldP75Pct", label: "P75 % of P50", pct: true, step: 0.01 },
  { key: "yieldP90Pct", label: "P90 % of P50", pct: true, step: 0.01 },
  { key: "yieldSparePct", label: "Spare % of P50", pct: true, step: 0.01 },
  { key: "availabilityBase", label: "Availability — Base", pct: true, step: 0.01 },
  { key: "availabilityHigh", label: "Availability — High", pct: true, step: 0.01 },
  { key: "availabilityLow", label: "Availability — Low", pct: true, step: 0.01 },
];

const LOSSES: Field[] = [
  { key: "degradation", label: "Annual degradation", pct: true, step: 0.001 },
  { key: "ownConsumption", label: "Own consumption", pct: true, step: 0.001 },
  { key: "transformerLosses", label: "Transformer losses", pct: true, step: 0.001 },
  { key: "lineLosses", label: "Line losses", pct: true, step: 0.001 },
  { key: "otherLosses", label: "Other losses", pct: true, step: 0.001 },
  { key: "availability", label: "Availability", pct: true, step: 0.01 },
];

const TARIFF: Field[] = [
  { key: "tariffUsdPerKWh", label: "Start price", unit: "USD/kWh", step: 0.001 },
  { key: "tariffEscalation", label: "Tariff escalation p.a.", pct: true, step: 0.001 },
  { key: "tariffFixedYears", label: "Fixed-price agreement", unit: "years" },
  { key: "tariffPostYearGrowth", label: "Growth post fixed-price", pct: true, step: 0.001 },
  { key: "tariffIndexUSDWeight", label: "Index USD weight", pct: true, step: 0.01 },
  { key: "tariffIndexEGPWeight", label: "Index EGP weight", pct: true, step: 0.01 },
  { key: "tariffPriceEGP", label: "Price EGP", step: 0.01 },
  { key: "tariffWorstUsdPerKWh", label: "Worst-case price", unit: "USD/kWh", step: 0.001 },
  { key: "tariffSpareUsdPerKWh", label: "Spare-case price", unit: "USD/kWh", step: 0.001 },
];

const CDM: Field[] = [
  { key: "cdmStartYear", label: "CDM start year" },
  { key: "cdmDurationYears", label: "CDM duration", unit: "years" },
  { key: "gridEmissionFactor", label: "Grid emission factor", unit: "tCO2/MWh", step: 0.001 },
  { key: "cdmPriceUSD", label: "Carbon price", unit: "USD/tCO2", step: 0.5 },
];

const OPEX: Field[] = [
  { key: "oAndM", label: "O&M", unit: "USD '000 p.a." },
  { key: "assetMgmt", label: "Asset management", unit: "USD '000 p.a." },
  { key: "spvCost", label: "SPV cost / licence", unit: "USD '000 p.a." },
  { key: "insurance", label: "Insurance during ops", unit: "USD '000 p.a." },
  { key: "csrContribution", label: "CSR contribution", unit: "USD '000 p.a." },
  { key: "eetcCost", label: "EETC cost", unit: "USD '000 p.a." },
  { key: "bondExpenses", label: "Bond expenses", unit: "USD '000 p.a." },
  { key: "lease", label: "Lease", unit: "USD '000 p.a." },
  { key: "auxiliaryPower", label: "Auxiliary power", unit: "USD '000 p.a." },
  { key: "opexContingency", label: "Opex contingency", unit: "USD '000 p.a." },
  { key: "usufructEGP", label: "User's share usufruct (EGP)", unit: "EGP '000 p.a." },
  { key: "opexVat", label: "VAT on opex (manual)", unit: "USD '000 p.a." },
  { key: "cpi", label: "Opex escalation (CPI)", pct: true, step: 0.001 },
  { key: "daysReceivable", label: "Debtor days", unit: "days" },
  { key: "daysPayable", label: "Creditor days", unit: "days" },
  { key: "debtorMonths", label: "Debtors", unit: "months" },
  { key: "creditorMonths", label: "Creditors", unit: "months" },
];

const OPEX_PER_MW_KEYS = ["oAndM","assetMgmt","spvCost","insurance","csrContribution","eetcCost","bondExpenses","lease","auxiliaryPower","opexContingency","usufructEGP"] as const;
const OpexEditor = ({ inputs, onChange }: Props) => {
  const setBasis = (k: string, v: 0 | 1) =>
    onChange({ ...inputs, opexBasisPerMW: { ...(inputs.opexBasisPerMW ?? {}), [k]: v } });
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Per-line basis: <b>USD '000 p.a.</b> = absolute, or <b>USD '000/MW p.a.</b> = per MW × capacity ({inputs.capacityMWp} MW).
      </p>
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-xs">
          <thead className="bg-secondary/40">
            <tr>
              <th className="text-left p-2 min-w-[170px]">Opex item</th>
              <th className="p-2 min-w-[140px]">Basis</th>
              <th className="text-right p-2 min-w-[120px]">Amount</th>
              <th className="text-right p-2 min-w-[140px]">Resolved (USD '000 p.a.)</th>
            </tr>
          </thead>
          <tbody>
            {OPEX.filter(f => (OPEX_PER_MW_KEYS as readonly string[]).includes(f.key as string)).map(f => {
              const k = f.key as string;
              const amt = inputs[f.key] as unknown as number;
              const perMW = (inputs.opexBasisPerMW?.[k] ?? 0) === 1;
              const resolved = perMW ? (amt || 0) * (inputs.capacityMWp || 0) : (amt || 0);
              return (
                <tr key={k} className="border-t border-border/40 hover:bg-secondary/20">
                  <td className="p-2 font-medium">{f.label}</td>
                  <td className="p-1">
                    <Select value={perMW ? "perMW" : "abs"} onValueChange={(v) => setBasis(k, v === "perMW" ? 1 : 0)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abs">USD '000 p.a.</SelectItem>
                        <SelectItem value="perMW">USD '000 / MW p.a.</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-1">
                    <Input type="number" step={0.1} className="h-8 font-mono text-xs text-right"
                      value={String(amt ?? 0)}
                      onChange={(e) => onChange({ ...inputs, [k]: parseFloat(e.target.value) || 0 })} />
                  </td>
                  <td className="p-2 text-right font-mono text-muted-foreground">{resolved.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {OPEX.filter(f => !(OPEX_PER_MW_KEYS as readonly string[]).includes(f.key as string)).map(f => (
          <NumberField key={String(f.key)} obj={inputs} k={f.key} f={f}
            onSet={(v) => onChange({ ...inputs, [f.key]: v })} />
        ))}
      </div>
    </div>
  );
};

const VAR_OPEX: Field[] = [
  { key: "varOpexSpare1", label: "Variable opex spare 1", unit: "USD/MWh", step: 0.01 },
  { key: "varOpexSpare2", label: "Variable opex spare 2", unit: "USD/MWh", step: 0.01 },
  { key: "varOpexSpare3", label: "Variable opex spare 3", unit: "USD/MWh", step: 0.01 },
  { key: "pctRevConvLocalEUR", label: "Conv. local to EUR", pct: true, step: 0.001 },
  { key: "pctRevUsufructLease", label: "Usufruct lease", pct: true, step: 0.001 },
  { key: "pctRevInsuranceOps", label: "Insurance during ops", pct: true, step: 0.001 },
  { key: "migaPremium", label: "Equity cover - MIGA", unit: "USD '000" },
];

const DEBT_OVERALL: Field[] = [
  { key: "gearing", label: "Target gearing (fixed mode)", pct: true, step: 0.01 },
  { key: "targetDSCR", label: "Target DSCR (sculpt mode)", step: 0.01, min: 0, max: 4 },
  { key: "debtTenorYears", label: "Debt tenor", unit: "years" },
  { key: "graceYears", label: "Grace period", unit: "years" },
];

const REFI: Field[] = [
  { key: "refinanceYear", label: "Refinance year" },
  { key: "refinanceFee", label: "Refinance fee", pct: true, step: 0.001 },
  { key: "refinanceMargin", label: "Refinance margin", pct: true, step: 0.001 },
  { key: "refinanceAmount", label: "Refinance amount", unit: "USD '000" },
];

const SHLOAN: Field[] = [
  { key: "shLoanFunding", label: "SH loan funding", unit: "USD '000" },
  { key: "shLoanRate", label: "SH loan all-in rate", pct: true, step: 0.001 },
];

const PREF_EQUITY: Field[] = [
  { key: "totalEquityExclPlanning", label: "Total equity (excl. planning)", unit: "USD '000" },
  { key: "planningPhaseEquity", label: "Planning phase equity", unit: "USD '000" },
  { key: "prefEquityFunding", label: "Preferential equity funding", unit: "USD '000" },
  { key: "prefEquityCoupon", label: "Pref. equity coupon rate", pct: true, step: 0.001 },
  { key: "prefCashCollateralPct", label: "Cash collateral for EQ LC", pct: true, step: 0.01 },
  { key: "prefPlacementFeePct", label: "Placement fee", pct: true, step: 0.001 },
];

const COF: Field[] = [
  { key: "cofStandbyLimit", label: "Standby debt/equity limit", unit: "USD '000" },
  { key: "cofGearing", label: "Senior debt gearing", pct: true, step: 0.01 },
  { key: "cofLimit", label: "Cost overrun limit", unit: "USD '000" },
  { key: "cofTenorYears", label: "Tenor", unit: "years" },
  { key: "cofGraceYears", label: "Grace", unit: "years" },
  { key: "cofHedgedPct", label: "% hedged", pct: true, step: 0.01 },
  { key: "cofHedgedRate", label: "Hedged rate", pct: true, step: 0.001 },
  { key: "cofMargin", label: "Margin over base", pct: true, step: 0.001 },
  { key: "cofUpfrontFee", label: "Upfront fee", pct: true, step: 0.001 },
  { key: "cofCommitmentFeeOfMargin", label: "Commitment fee % of margin", pct: true, step: 0.001 },
  { key: "cofCommitmentFee", label: "Commitment fee p.a.", pct: true, step: 0.0001 },
  { key: "cofTargetDSCR", label: "Target DSCR", step: 0.01, min: 0, max: 4 },
];

const SUBDEBT: Field[] = [
  { key: "subDebtLimit", label: "Limit", unit: "Ref_Curr '000" },
  { key: "subDebtTenorYears", label: "Tenor", unit: "years" },
  { key: "subDebtGraceYears", label: "Grace", unit: "years" },
  { key: "subDebtMargin", label: "Margin over base", pct: true, step: 0.001 },
  { key: "subDebtUpfrontFee", label: "Upfront fee", pct: true, step: 0.001 },
  { key: "subDebtCommitmentFeeOfMargin", label: "Commitment fee % of margin", pct: true, step: 0.001 },
  { key: "subDebtCommitmentFee", label: "Commitment fee p.a.", pct: true, step: 0.0001 },
  { key: "subDebtAgencyFee", label: "Agency fee", unit: "USD '000 p.a." },
  { key: "subDebtTargetDSCR", label: "Target DSCR", step: 0.01, min: 0, max: 4 },
  { key: "subDebtManualRepayment", label: "Manual repayment", unit: "USD '000" },
];

const DISTRIBUTIONS: Field[] = [
  { key: "payoutRatio", label: "Payout ratio", pct: true, step: 0.01 },
  { key: "minCashBalance", label: "Min cash balance", unit: "USD '000" },
  { key: "minCashBalanceMultiple", label: "Min cash balance multiple", step: 0.5 },
  { key: "linkOpexMonths", label: "Link to OPEX months", unit: "months" },
  { key: "carriedInterestPct", label: "Carried interest", pct: true, step: 0.01 },
  { key: "carriedInterestOneTime", label: "Carried interest one-time", unit: "USD '000" },
];

const TAX_CORE: Field[] = [
  { key: "taxRate", label: "Corporate tax rate", pct: true, step: 0.005 },
  { key: "taxStartYear", label: "Tax start year" },
  { key: "taxEndYear", label: "Tax end year" },
  { key: "taxPeriods", label: "Tax periods", unit: "years" },
  { key: "additionalLevy", label: "Additional levy on revenue", pct: true, step: 0.001 },
  { key: "realEstateTaxRate", label: "Real estate tax rate", pct: true, step: 0.0001 },
  { key: "realEstateTaxableAmount", label: "Taxable amount", pct: true, step: 0.01 },
  { key: "exemptedProportion", label: "Exempted proportion", unit: "USD '000" },
  { key: "rentalValuePct", label: "Rental value", pct: true, step: 0.001 },
  { key: "taxHolidayYears", label: "Tax holiday", unit: "years" },
  { key: "taxHolidayStartYear", label: "Tax holiday start year" },
  { key: "taxHolidayEndYear", label: "Tax holiday end year" },
  { key: "taxCalcMonths", label: "Calculation of tax due", unit: "months" },
  { key: "taxAdvanceMonths", label: "Payment of advance", unit: "months" },
  { key: "taxBalanceMonths", label: "Payment of balance", unit: "months" },
];

const NOKUS: Field[] = [
  { key: "nokusRate", label: "NOKUS tax rate", pct: true, step: 0.001 },
  { key: "nokusStartYear", label: "NOKUS start year" },
  { key: "nokusEndYear", label: "NOKUS end year" },
  { key: "nokusThresholdRate", label: "Threshold tax rate", pct: true, step: 0.001 },
];

const WHT: Field[] = [
  { key: "whtDividendsRate", label: "WHT dividends rate", pct: true, step: 0.01 },
  { key: "whtSHLoanRate", label: "WHT SH loan interest rate", pct: true, step: 0.01 },
  { key: "whtPrefShareRate", label: "WHT pref share coupon rate", pct: true, step: 0.01 },
  { key: "relPartyDeductMultiple", label: "Related party debt limit", unit: "x equity", step: 0.5 },
];

const DEPREC: Field[] = [
  { key: "depreciationYears", label: "Depreciation — long term", unit: "years" },
  { key: "idcDepreciationYears", label: "Depreciation — IDC & fees", unit: "years" },
];

const DISCOUNT: Field[] = [
  { key: "discountRateProject", label: "Project (pre-tax)", pct: true, step: 0.005 },
  { key: "discountRateProjectPostTax", label: "Project (post-tax)", pct: true, step: 0.005 },
  { key: "discountRateInvestor", label: "Investor blended", pct: true, step: 0.005 },
  { key: "discountRateEquity", label: "Common equity", pct: true, step: 0.005 },
  { key: "discountRatePref", label: "Preferential equity", pct: true, step: 0.005 },
];

const MACRO: Field[] = [
  { key: "baseRate", label: "Base rate (SOFR)", pct: true, step: 0.001 },
  { key: "baseRateLIBOR", label: "Base rate (LIBOR 6m)", pct: true, step: 0.001 },
  { key: "baseRateCBE", label: "Base rate (CBE)", pct: true, step: 0.001 },
  { key: "cpiGeneral", label: "CPI (general)", pct: true, step: 0.001 },
  { key: "cpiUSDollar", label: "CPI USD", pct: true, step: 0.001 },
  { key: "cpiBlend", label: "CPI blend US-EGP", pct: true, step: 0.001 },
  { key: "oAndMInflRate", label: "O&M inflation rate", pct: true, step: 0.001 },
  { key: "lcoeDiscountFactor", label: "LCOE discount factor", pct: true, step: 0.005 },
  { key: "depositRate", label: "Deposit rate (interest income)", pct: true, step: 0.001 },
];

const FX: Field[] = [
  { key: "fxEUR", label: "EUR : USD", step: 0.001 },
  { key: "fxEGP", label: "EGP : USD", step: 0.0001 },
  { key: "fxSpare", label: "Spare : USD", step: 0.001 },
];

const COVENANTS: Field[] = [
  { key: "covInPeriodP50", label: "DSCR (in period) — P50", step: 0.01, min: 0, max: 4 },
  { key: "covInPeriodP90", label: "DSCR (in period) — P90", step: 0.01, min: 0, max: 4 },
  { key: "cov12moBwP50", label: "DSCR (12m b/w) — P50", step: 0.01, min: 0, max: 4 },
  { key: "cov12moBwP90", label: "DSCR (12m b/w) — P90", step: 0.01, min: 0, max: 4 },
  { key: "cov12moFwP50", label: "DSCR (12m f/w) — P50", step: 0.01, min: 0, max: 4 },
  { key: "cov12moFwP90", label: "DSCR (12m f/w) — P90", step: 0.01, min: 0, max: 4 },
  { key: "llcrP50", label: "LLCR — P50", step: 0.01, min: 0, max: 4 },
  { key: "llcrP90", label: "LLCR — P90", step: 0.01, min: 0, max: 4 },
  { key: "plcrP50", label: "PLCR — P50", step: 0.01, min: 0, max: 4 },
  { key: "plcrP90", label: "PLCR — P90", step: 0.01, min: 0, max: 4 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tranche editor
// ─────────────────────────────────────────────────────────────────────────────
const TRANCHE_FIELDS: Omit<Field<DebtTranche>, "key">[] & { key: keyof DebtTranche }[] = [] as any;

const TrancheEditor = ({ t, onChange, label }: { t: DebtTranche; label: string; onChange: (t: DebtTranche) => void; }) => {
  const set = <K extends keyof DebtTranche>(k: K, v: DebtTranche[K]) => onChange({ ...t, [k]: v });
  const fields: Field<DebtTranche>[] = [
    { key: "baseRate", label: "Base rate", pct: true, step: 0.001 },
    { key: "hedgedPct", label: "% hedged", pct: true, step: 0.01 },
    { key: "hedgedRate", label: "Hedged rate", pct: true, step: 0.001 },
    { key: "underlyingRate", label: "Underlying rate", pct: true, step: 0.001 },
    { key: "riskMargin", label: "Risk margin", pct: true, step: 0.001 },
    { key: "upfrontFeePct", label: "Upfront fee", pct: true, step: 0.001 },
    { key: "commitmentFeePct", label: "Commitment fee p.a.", pct: true, step: 0.001 },
    { key: "agencyFee", label: "Agency fee", unit: "USD '000 p.a." },
    { key: "targetDSCR", label: "Tranche target DSCR", step: 0.01, min: 0, max: 4 },
    { key: "sharePct", label: "Share of total debt", pct: true, step: 0.01 },
  ];
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/20 p-4 space-y-3">
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <Label className="text-xs text-muted-foreground">Tranche name</Label>
          <Input className="h-9 mt-1" value={t.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div className="min-w-[140px]">
          <Label className="text-xs text-muted-foreground">Enabled</Label>
          <Select value={t.enabled ? "1" : "0"} onValueChange={v => set("enabled", v === "1")}>
            <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Yes</SelectItem>
              <SelectItem value="0">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[160px]">
          <Label className="text-xs text-muted-foreground">Repayment method</Label>
          <Select value={t.method} onValueChange={v => set("method", v as DebtTranche["method"])}>
            <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="annuity">Annuity</SelectItem>
              <SelectItem value="sculpted">Sculpted</SelectItem>
              <SelectItem value="llcr-sculpted">LLCR-sculpted</SelectItem>
              <SelectItem value="manual">Manual schedule</SelectItem>
              <SelectItem value="bullet">Bullet / Balloon</SelectItem>
              <SelectItem value="mortgage">Mortgage-style</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[160px]">
          <Label className="text-xs text-muted-foreground">Base rate reference</Label>
          <Select value={t.baseRateRef ?? "SOFR"} onValueChange={v => set("baseRateRef", v as any)}>
            <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="SOFR">SOFR</SelectItem>
              <SelectItem value="LIBOR">LIBOR 6m</SelectItem>
              <SelectItem value="CBE">CBE</SelectItem>
              <SelectItem value="Fixed">Fixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {fields.map(f => (
          <NumberField key={String(f.key)} obj={t} k={f.key} f={f}
            onSet={(v) => set(f.key, v)} />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main form
// ─────────────────────────────────────────────────────────────────────────────
export const InputsForm = ({ inputs, onChange }: Props) => {
  const set = <K extends keyof ProjectInputs>(k: K, v: ProjectInputs[K]) =>
    onChange({ ...inputs, [k]: v });

  return (
    <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="border-b border-border bg-secondary/40 px-5 py-3">
        <h3 className="font-semibold">Project inputs — full assumption set</h3>
        <p className="text-xs text-muted-foreground">Mirrors the Wind 552 Inputs tab. Edits recalculate instantly with closed-form IDC and JS-based DSCR sculpting.</p>
      </div>

      <div className="space-y-4 p-5">
        {/* Identity row */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <Label className="text-xs text-muted-foreground">Project name</Label>
            <Input className="h-9 mt-1" value={inputs.projectName} onChange={(e) => set("projectName", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Scenario</Label>
            <Input className="h-9 mt-1" value={inputs.scenario} onChange={(e) => set("scenario", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Company</Label>
            <Input className="h-9 mt-1" value={inputs.companyName} onChange={(e) => set("companyName", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Country</Label>
            <Input className="h-9 mt-1" value={inputs.country} onChange={(e) => set("country", e.target.value)} />
          </div>
        </div>

        <Tabs defaultValue="construction">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="construction">Construction</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="opex">Opex</TabsTrigger>
            <TabsTrigger value="debt">Debt</TabsTrigger>
            <TabsTrigger value="equity">Equity & dist.</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="macro">Macro & FX</TabsTrigger>
          </TabsList>

          {/* Construction */}
          <TabsContent value="construction" className="m-0 pt-4">
            <Accordion type="multiple" defaultValue={["timing", "schedule", "capex", "reserves"]}>
              <AccordionItem value="timing">
                <AccordionTrigger>Timing</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={TIMING}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="capex">
                <AccordionTrigger>Capital expenditure & per-item monthly allocation</AccordionTrigger>
                <AccordionContent><CapexWithScheduleEditor inputs={inputs} onChange={onChange}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="mm">
                <AccordionTrigger>Major maintenance (real)</AccordionTrigger>
                <AccordionContent>
                  <FieldsGrid inputs={inputs} onChange={onChange} fields={MAJOR_MAINT}/>
                  <div className="mt-6">
                    <MajorMaintenanceScheduleEditor inputs={inputs} onChange={onChange} />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reserves">
                <AccordionTrigger>Reserves & DSRA</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={RESERVES}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="pb">
                <AccordionTrigger>Performance bond (Land/Usufruct)</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={PERF_BOND}/></AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Operations */}
          <TabsContent value="operations" className="m-0 pt-4">
            <Accordion type="multiple" defaultValue={["volume", "losses"]}>
              <AccordionItem value="volume">
                <AccordionTrigger>Volume & yield</AccordionTrigger>
                <AccordionContent>
                  <div className="mb-3 max-w-xs">
                    <Label className="text-xs text-muted-foreground">Yield case</Label>
                    <Select value={inputs.yieldCase} onValueChange={(v) => set("yieldCase", v as ProjectInputs["yieldCase"])}>
                      <SelectTrigger className="h-9 mt-1"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P50">P50</SelectItem>
                        <SelectItem value="P75">P75</SelectItem>
                        <SelectItem value="P90">P90</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FieldsGrid inputs={inputs} onChange={onChange} fields={PRODUCTION}/>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="losses">
                <AccordionTrigger>Loss factors & availability</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={LOSSES}/></AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Revenue */}
          <TabsContent value="revenue" className="m-0 pt-4">
            <Accordion type="multiple" defaultValue={["tariff", "cdm"]}>
              <AccordionItem value="tariff">
                <AccordionTrigger>PPA / Tariff</AccordionTrigger>
                <AccordionContent>
                  <div className="mb-3 max-w-xs">
                    <Label className="text-xs text-muted-foreground">Tariff currency</Label>
                    <Select value={inputs.tariffCurrency} onValueChange={(v) => set("tariffCurrency", v as ProjectInputs["tariffCurrency"])}>
                      <SelectTrigger className="h-9 mt-1"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EGP">EGP</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FieldsGrid inputs={inputs} onChange={onChange} fields={TARIFF}/>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="cdm">
                <AccordionTrigger>Clean Development Mechanism (carbon)</AccordionTrigger>
                <AccordionContent>
                  <div className="mb-3 max-w-xs">
                    <Label className="text-xs text-muted-foreground">CDM switch</Label>
                    <Select value={String(inputs.cdmSwitch)} onValueChange={(v) => set("cdmSwitch", Number(v) as 0|1)}>
                      <SelectTrigger className="h-9 mt-1"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">On</SelectItem>
                        <SelectItem value="0">Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FieldsGrid inputs={inputs} onChange={onChange} fields={CDM}/>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Opex */}
          <TabsContent value="opex" className="m-0 pt-4">
            <Accordion type="multiple" defaultValue={["fixed", "var"]}>
              <AccordionItem value="fixed">
                <AccordionTrigger>Fixed operating costs</AccordionTrigger>
                <AccordionContent><OpexEditor inputs={inputs} onChange={onChange}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="var">
                <AccordionTrigger>Variable opex & % of revenue</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={VAR_OPEX}/></AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Debt */}
          <TabsContent value="debt" className="m-0 pt-4">
            <Accordion type="multiple" defaultValue={["overall", "t1"]}>
              <AccordionItem value="overall">
                <AccordionTrigger>Overall debt sizing</AccordionTrigger>
                <AccordionContent>
                  <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Payment periodicity</Label>
                      <Select value={inputs.paymentPeriodicity} onValueChange={(v) => set("paymentPeriodicity", v as ProjectInputs["paymentPeriodicity"])}>
                        <SelectTrigger className="h-9 mt-1"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Semi-annual">Semi-annual</SelectItem>
                          <SelectItem value="Annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Sizing mode</Label>
                      <Select value={inputs.sizingMode} onValueChange={(v) => set("sizingMode", v as ProjectInputs["sizingMode"])}>
                        <SelectTrigger className="h-9 mt-1"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed-gearing">Fixed gearing</SelectItem>
                          <SelectItem value="dscr-sculpted">DSCR-sculpted</SelectItem>
                          <SelectItem value="llcr-sculpted">LLCR-sculpted</SelectItem>
                          <SelectItem value="manual">Manual schedule</SelectItem>
                          <SelectItem value="bullet">Bullet / Balloon</SelectItem>
                          <SelectItem value="mortgage">Mortgage-style</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Base rate reference</Label>
                      <Select value={inputs.baseRateRef ?? "SOFR"} onValueChange={(v) => set("baseRateRef", v as any)}>
                        <SelectTrigger className="h-9 mt-1"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOFR">SOFR</SelectItem>
                          <SelectItem value="LIBOR">LIBOR 6m</SelectItem>
                          <SelectItem value="CBE">CBE</SelectItem>
                          <SelectItem value="Fixed">Fixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <FieldsGrid inputs={inputs} onChange={onChange} fields={DEBT_OVERALL}/>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t1">
                <AccordionTrigger>Tranche 1 — {inputs.debt1.name}</AccordionTrigger>
                <AccordionContent>
                  <TrancheEditor t={inputs.debt1} label="Primary senior facility" onChange={(t) => set("debt1", t)} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t2">
                <AccordionTrigger>Tranche 2 — {inputs.debt2.name}</AccordionTrigger>
                <AccordionContent>
                  <TrancheEditor t={inputs.debt2} label="Optional secondary facility" onChange={(t) => set("debt2", t)} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="t3">
                <AccordionTrigger>Tranche 3 — {inputs.debt3.name}</AccordionTrigger>
                <AccordionContent>
                  <TrancheEditor t={inputs.debt3} label="Optional tertiary facility" onChange={(t) => set("debt3", t)} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="refi">
                <AccordionTrigger>Refinancing</AccordionTrigger>
                <AccordionContent>
                  <div className="mb-3 max-w-xs">
                    <Label className="text-xs text-muted-foreground">Refinance switch</Label>
                    <Select value={String(inputs.refinanceSwitch)} onValueChange={(v) => set("refinanceSwitch", Number(v) as 0|1)}>
                      <SelectTrigger className="h-9 mt-1"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">On</SelectItem>
                        <SelectItem value="0">Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FieldsGrid inputs={inputs} onChange={onChange} fields={REFI}/>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shloan">
                <AccordionTrigger>Shareholder loan</AccordionTrigger>
                <AccordionContent>
                  <FieldsGrid inputs={inputs} onChange={onChange} fields={SHLOAN}/>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="cof">
                <AccordionTrigger>Cost overrun facility</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={COF}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="sub">
                <AccordionTrigger>Subordinated debt</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={SUBDEBT}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="cov">
                <AccordionTrigger>Covenants — target ratios</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={COVENANTS}/></AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Equity & distributions */}
          <TabsContent value="equity" className="m-0 pt-4">
            <Accordion type="multiple" defaultValue={["pref", "dist", "disc"]}>
              <AccordionItem value="pref">
                <AccordionTrigger>Equity, preferential equity & SH loan</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={PREF_EQUITY}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="dist">
                <AccordionTrigger>Distributions</AccordionTrigger>
                <AccordionContent>
                  <FieldsGrid inputs={inputs} onChange={onChange} fields={DISTRIBUTIONS}/>
            <div className="mt-4 max-w-xs">
              <Label className="text-xs text-muted-foreground">Dividends restricted to retained earnings?</Label>
              <Select value={String(inputs.divRestrictedToRetainedEarnings)} onValueChange={(v) => set("divRestrictedToRetainedEarnings", Number(v) as 0|1)}>
                <SelectTrigger className="h-9 mt-1"><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Yes</SelectItem>
                  <SelectItem value="0">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="disc">
                <AccordionTrigger>Discount rate (auto WACC)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-xs text-muted-foreground">
                    Project NPV, equity NPV and LCOE are now discounted at the WACC computed from your
                    current capital structure (Ke = Rf + β × country ERP, Kd after-tax, gearing solved by the model).
                    Adjust risk-free rate, equity beta and country in the Cost of Capital / Macro sections.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Tax */}
          <TabsContent value="tax" className="m-0 pt-4">
            <Accordion type="multiple" defaultValue={["corp", "wht", "deprec"]}>
              <AccordionItem value="corp">
                <AccordionTrigger>Corporate tax</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={TAX_CORE}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="wht">
                <AccordionTrigger>Withholding tax & related parties</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={WHT}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="deprec">
                <AccordionTrigger>Depreciation</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={DEPREC}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="nokus">
                <AccordionTrigger>NOKUS (Norwegian Private Investor)</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={NOKUS}/></AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Macro & FX */}
          <TabsContent value="macro" className="m-0 pt-4">
            <Accordion type="multiple" defaultValue={["macro", "fx"]}>
              <AccordionItem value="macro">
                <AccordionTrigger>Macro — rates & inflation</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={MACRO}/></AccordionContent>
              </AccordionItem>
              <AccordionItem value="fx">
                <AccordionTrigger>Foreign exchange</AccordionTrigger>
                <AccordionContent><FieldsGrid inputs={inputs} onChange={onChange} fields={FX}/></AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
