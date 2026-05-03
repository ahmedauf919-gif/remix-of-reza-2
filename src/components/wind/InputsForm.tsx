import { ProjectInputs } from "@/lib/windModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  inputs: ProjectInputs;
  onChange: (i: ProjectInputs) => void;
}

type Field = {
  key: keyof ProjectInputs;
  label: string;
  unit?: string;
  step?: number;
  pct?: boolean;
};

const sections: Record<string, Field[]> = {
  Project: [
    { key: "constructionStart", label: "Construction start year" },
    { key: "constructionMonths", label: "Construction duration", unit: "months" },
    { key: "operationsYears", label: "Operations period", unit: "years" },
    { key: "capacityMWp", label: "Installed capacity", unit: "MWp" },
  ],
  Capex: [
    { key: "epcCost", label: "EPC cost", unit: "USD '000" },
    { key: "developmentCost", label: "Development cost", unit: "USD '000" },
    { key: "substationContingency", label: "Substation & contingency", unit: "USD '000" },
    { key: "dsraInitial", label: "DSRA initial funding", unit: "USD '000" },
  ],
  Production: [
    { key: "yieldKWhPerKWp", label: "Annual yield", unit: "kWh/kWp" },
    { key: "availability", label: "Availability", pct: true, step: 0.01 },
    { key: "ownConsumptionLoss", label: "Own consumption + losses", pct: true, step: 0.01 },
    { key: "degradation", label: "Annual degradation", pct: true, step: 0.001 },
  ],
  Tariff: [
    { key: "tariffUsdPerKWh", label: "Tariff", unit: "USD/kWh", step: 0.001 },
    { key: "tariffEscalation", label: "Tariff escalation p.a.", pct: true, step: 0.001 },
  ],
  Opex: [
    { key: "oAndM", label: "O&M", unit: "USD '000 p.a." },
    { key: "assetMgmt", label: "Asset management", unit: "USD '000 p.a." },
    { key: "spvCost", label: "SPV / licence", unit: "USD '000 p.a." },
    { key: "insurance", label: "Insurance", unit: "USD '000 p.a." },
    { key: "cpi", label: "Opex CPI", pct: true, step: 0.001 },
    { key: "daysReceivable", label: "Days receivable", unit: "days" },
    { key: "daysPayable", label: "Days payable", unit: "days" },
  ],
  Debt: [
    { key: "gearing", label: "Target gearing (fixed mode)", pct: true, step: 0.01 },
    { key: "targetDSCR", label: "Target DSCR (sculpt mode)", step: 0.01 },
    { key: "debtTenorYears", label: "Debt tenor", unit: "years" },
    { key: "graceYears", label: "Grace period", unit: "years" },
    { key: "interestRate", label: "All-in interest rate", pct: true, step: 0.001 },
    { key: "upfrontFeePct", label: "Upfront fee", pct: true, step: 0.001 },
    { key: "commitmentFeePct", label: "Commitment fee p.a.", pct: true, step: 0.001 },
  ],
  Tax: [
    { key: "taxRate", label: "Corporate tax rate", pct: true, step: 0.005 },
    { key: "depreciationYears", label: "Depreciation period", unit: "years" },
    { key: "taxHolidayYears", label: "Tax holiday", unit: "years" },
    { key: "discountRateProject", label: "Discount rate (project)", pct: true, step: 0.005 },
    { key: "discountRateEquity", label: "Discount rate (equity)", pct: true, step: 0.005 },
  ],
};

export const InputsForm = ({ inputs, onChange }: Props) => {
  const set = <K extends keyof ProjectInputs>(k: K, v: ProjectInputs[K]) =>
    onChange({ ...inputs, [k]: v });

  const renderField = (f: Field) => {
    const raw = inputs[f.key] as number;
    const display = f.pct ? (raw * 100).toFixed(3) : String(raw);
    return (
      <div key={String(f.key)} className="space-y-1">
        <Label className="text-xs text-muted-foreground">
          {f.label} {f.unit && <span className="opacity-60">({f.unit})</span>}
          {f.pct && <span className="opacity-60">(%)</span>}
        </Label>
        <Input
          type="number"
          step={f.step ?? 1}
          className="h-9 font-mono"
          value={display}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            if (isNaN(n)) return;
            set(f.key, (f.pct ? n / 100 : n) as ProjectInputs[typeof f.key]);
          }}
        />
      </div>
    );
  };

  const tabs = Object.keys(sections);

  return (
    <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="border-b border-border bg-secondary/40 px-5 py-3">
        <h3 className="font-semibold">Project inputs</h3>
        <p className="text-xs text-muted-foreground">Edit any field — outputs recompute instantly with closed-form IDC and JS-based DSCR sculpting.</p>
      </div>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <Label className="text-xs text-muted-foreground">Project name</Label>
            <Input className="h-9 mt-1" value={inputs.projectName} onChange={(e) => set("projectName", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Scenario</Label>
            <Input className="h-9 mt-1" value={inputs.scenario} onChange={(e) => set("scenario", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Debt sizing mode</Label>
            <Select value={inputs.sizingMode} onValueChange={(v) => set("sizingMode", v as ProjectInputs["sizingMode"])}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed-gearing">Fixed gearing</SelectItem>
                <SelectItem value="dscr-sculpted">DSCR-sculpted (max debt)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue={tabs[0]}>
          <TabsList className="flex-wrap h-auto">
            {tabs.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t} value={t} className="m-0 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sections[t].map(renderField)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
