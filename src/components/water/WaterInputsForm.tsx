import { WaterInputs, CapexItem, OpexVarItem, OpexFixedItem, Ccy } from "@/lib/waterModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Plus } from "lucide-react";

/** Percent-display field — user enters 80 for 80% (stored as 0.80). */
const PctField = ({ label, value, onChange, step = 0.5, suffix }: { label: string; value: number; onChange: (n: number) => void; step?: number; suffix?: string }) => (
  <div className="space-y-1">
    <Label className="text-xs text-muted-foreground">{label} (%) {suffix && <span className="opacity-60">({suffix})</span>}</Label>
    <Input type="number" step={step} value={+(value * 100).toFixed(4)} onChange={(e) => { const r = parseFloat(e.target.value); onChange(isFinite(r) ? r / 100 : 0); }} />
  </div>
);

const Field = ({ label, value, onChange, step = 1, suffix }: { label: string; value: number; onChange: (n: number) => void; step?: number; suffix?: string }) => (
  <div className="space-y-1">
    <Label className="text-xs text-muted-foreground">{label}{suffix ? ` (${suffix})` : ""}</Label>
    <Input type="number" step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border bg-card p-5 shadow-sm">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{children}</div>
  </div>
);

const FullSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border bg-card p-5 shadow-sm">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

// Year-array editor (compact horizontal scroller)
function YearArrayEditor({
  label, years, values, fallback, onChange, step = 0.001, asPct = false,
}: { label: string; years: number; values: number[] | undefined; fallback: number; onChange: (a: number[]) => void; step?: number; asPct?: boolean }) {
  const arr = Array.from({ length: years }, (_, i) => values?.[i] ?? fallback);
  const update = (i: number, v: number) => {
    const n = [...arr]; n[i] = v; onChange(n);
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs">{label}</Label>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" onClick={() => onChange(Array.from({ length: years }, () => arr[0] ?? fallback))}>
            Fill Y1 → all
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onChange([])}>Reset to scalar</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead><tr>{arr.map((_, i) => <th key={i} className="px-1 font-normal text-muted-foreground">Y{i + 1}</th>)}</tr></thead>
          <tbody><tr>{arr.map((v, i) => (
            <td key={i} className="px-1">
              <Input type="number" step={step} value={asPct ? +(v * 100).toFixed(4) : v}
                onChange={(e) => {
                  const raw = parseFloat(e.target.value);
                  update(i, asPct ? (isFinite(raw) ? raw / 100 : 0) : (isFinite(raw) ? raw : 0));
                }}
                className="h-8 w-20" />
            </td>
          ))}</tr></tbody>
        </table>
      </div>
    </div>
  );
}

export const WaterInputsForm = ({ inputs, onChange }: { inputs: WaterInputs; onChange: (i: WaterInputs) => void }) => {
  const set = <K extends keyof WaterInputs>(k: K, v: WaterInputs[K]) => onChange({ ...inputs, [k]: v });
  const F = (k: keyof WaterInputs, label: string, suffix?: string, step = 1) => (
    <Field label={label} value={inputs[k] as number} onChange={(n) => set(k, n as any)} step={step} suffix={suffix} />
  );

  // CAPEX item helpers
  const updateCapex = (idx: number, patch: Partial<CapexItem>) => {
    const next = inputs.capexItems.map((it, i) => i === idx ? { ...it, ...patch } : it);
    set("capexItems", next);
  };
  const addCapex = () => set("capexItems", [...inputs.capexItems, { key: `item${Date.now()}`, label: "New Item", currency: "USD", amount: 0, taxPct: 0, depreciationYears: inputs.depreciationYears }]);
  const removeCapex = (idx: number) => set("capexItems", inputs.capexItems.filter((_, i) => i !== idx));

  const updateVar = (idx: number, patch: Partial<OpexVarItem>) => {
    const next = inputs.opexVariableItems.map((it, i) => i === idx ? { ...it, ...patch } : it);
    set("opexVariableItems", next);
  };
  const addVar = () => set("opexVariableItems", [...inputs.opexVariableItems, { key: `var${Date.now()}`, label: "New Item", currency: "USD", amountPerM3: 0 }]);
  const removeVar = (idx: number) => set("opexVariableItems", inputs.opexVariableItems.filter((_, i) => i !== idx));

  const updateFixed = (idx: number, patch: Partial<OpexFixedItem>) => {
    const next = inputs.opexFixedItems.map((it, i) => i === idx ? { ...it, ...patch } : it);
    set("opexFixedItems", next);
  };
  const addFixed = () => set("opexFixedItems", [...inputs.opexFixedItems, { key: `fix${Date.now()}`, label: "New Item", currency: "EGP", amountPerMonth: 0 }]);
  const removeFixed = (idx: number) => set("opexFixedItems", inputs.opexFixedItems.filter((_, i) => i !== idx));

  const N = inputs.contractYears;
  const Tenor = inputs.loanTenorYears;

  return (
    <div className="space-y-6">
      <Section title="Project & Timing">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Project Name</Label>
          <Input value={inputs.projectName} onChange={(e) => set("projectName", e.target.value)} />
        </div>
        {F("startYear", "Operations Start Year")}
        {F("developmentMonths", "Development", "months")}
        {F("constructionMonths", "Construction", "months")}
        {F("contractYears", "Contract Duration", "years")}
      </Section>

      <Tabs defaultValue="pricing">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="capacity">Capacity & Take</TabsTrigger>
          <TabsTrigger value="fx">FX & Inflation</TabsTrigger>
          <TabsTrigger value="capex">CAPEX</TabsTrigger>
          <TabsTrigger value="debt">Senior Debt</TabsTrigger>
          <TabsTrigger value="shl">Shareholder Loan</TabsTrigger>
          <TabsTrigger value="mm">Maintenance Reserve</TabsTrigger>
          <TabsTrigger value="tv">Terminal Value</TabsTrigger>
          <TabsTrigger value="opexvar">OPEX — Variable</TabsTrigger>
          <TabsTrigger value="opexfix">OPEX — Fixed</TabsTrigger>
          <TabsTrigger value="sga">SG&amp;A / WC / Tax</TabsTrigger>
        </TabsList>

      <TabsContent value="pricing" className="m-0 pt-4">
        <Section title="Pricing">
          {F("sellingPriceEgpPerM3", "Selling Price", "EGP/m³", 0.5)}
          <PctField label="% Pegged to USD" value={inputs.pctPeggedToUsd} onChange={(n) => set("pctPeggedToUsd", n)} step={1}/>
        </Section>
      </TabsContent>

      <TabsContent value="capacity" className="m-0 pt-4">
        <FullSection title="Plant Capacity & Take">
          <div className="space-y-4">
            <YearArrayEditor label="Installed Capacity per year (m³/day)" years={N} values={inputs.capacityM3DayPerYear} fallback={inputs.capacityM3Day} onChange={(a) => set("capacityM3DayPerYear", a)} step={50}/>
            <YearArrayEditor label="Min Take % per year" years={N} values={inputs.minTakePctPerYear} fallback={inputs.minTakePct} onChange={(a) => set("minTakePctPerYear", a)} step={0.5} asPct/>
          </div>
        </FullSection>
      </TabsContent>

      <TabsContent value="fx" className="m-0 pt-4">
      <FullSection title="FX & Inflation (per year, full PPA)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {F("fxRateEgpPerUsd", "FX Rate (scalar fallback)", "EGP/USD", 0.01)}
          {F("egpInflation", "EGP Cost Inflation", "decimal", 0.001)}
          {F("revenueInflation", "Revenue Inflation", "decimal", 0.001)}
          {F("electricityInflation", "Electricity Inflation", "decimal", 0.001)}
          {F("usdInflation", "USD Inflation", "decimal", 0.001)}
        </div>
        <div className="space-y-4">
          <YearArrayEditor label="FX EGP/USD per year" years={N} values={inputs.fxRatePerYear} fallback={inputs.fxRateEgpPerUsd} onChange={(a) => set("fxRatePerYear", a)} step={0.01}/>
          <YearArrayEditor label="EGP Inflation per year (%)" years={N} values={inputs.egpInflationPerYear} fallback={inputs.egpInflation} onChange={(a) => set("egpInflationPerYear", a)} step={0.1} asPct/>
          <YearArrayEditor label="Revenue Inflation per year (%)" years={N} values={inputs.revenueInflationPerYear} fallback={inputs.revenueInflation} onChange={(a) => set("revenueInflationPerYear", a)} step={0.1} asPct/>
          <YearArrayEditor label="Electricity Inflation per year (%)" years={N} values={inputs.electricityInflationPerYear} fallback={inputs.electricityInflation} onChange={(a) => set("electricityInflationPerYear", a)} step={0.1} asPct/>
          <YearArrayEditor label="USD Inflation per year (%)" years={N} values={inputs.usdInflationPerYear} fallback={inputs.usdInflation} onChange={(a) => set("usdInflationPerYear", a)} step={0.1} asPct/>
        </div>
      </FullSection>
      </TabsContent>

      <TabsContent value="capex" className="m-0 pt-4">
      <FullSection title="CAPEX (itemized)">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="w-24">Currency</TableHead>
              <TableHead className="w-40">Amount</TableHead>
              <TableHead className="w-28">Tax % (VAT/duty)</TableHead>
              <TableHead className="w-32">Depreciation (yrs)</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputs.capexItems.map((it, i) => (
              <TableRow key={i}>
                <TableCell><Input value={it.label} onChange={(e) => updateCapex(i, { label: e.target.value })} /></TableCell>
                <TableCell>
                  <Select value={it.currency} onValueChange={(v) => updateCapex(i, { currency: v as Ccy })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="EGP">EGP</SelectItem></SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Input type="number" step={100} value={it.amount} onChange={(e) => updateCapex(i, { amount: parseFloat(e.target.value) || 0 })} /></TableCell>
                <TableCell><Input type="number" step={0.5} value={+(((it.taxPct ?? 0) * 100).toFixed(4))} onChange={(e) => { const r = parseFloat(e.target.value); updateCapex(i, { taxPct: isFinite(r) ? r / 100 : 0 }); }} /></TableCell>
                <TableCell><Input type="number" step={1} value={it.depreciationYears} onChange={(e) => updateCapex(i, { depreciationYears: parseInt(e.target.value) || 0 })} /></TableCell>
                <TableCell><Button size="icon" variant="ghost" onClick={() => removeCapex(i)}><Trash2 className="h-4 w-4"/></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button size="sm" variant="outline" onClick={addCapex} className="mt-3 gap-2"><Plus className="h-4 w-4"/>Add CAPEX item</Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <PctField label="Contingency" value={inputs.contingencyPct} onChange={(n) => set("contingencyPct", n)} step={0.5}/>
        </div>
      </FullSection>
      </TabsContent>

      <TabsContent value="debt" className="m-0 pt-4">
      <FullSection title="Financing — Senior Debt">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <PctField label="Debt %" value={inputs.debtToEquity} onChange={(n) => set("debtToEquity", Math.max(0, Math.min(1, n)))} step={1} suffix="enter 80 for 80%"/>
          {F("loanTenorYears", "Loan Tenor", "years")}
          <PctField label="Bank Spread" value={inputs.bankSpread} onChange={(n) => set("bankSpread", n)} step={0.25}/>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Repayment Mode</Label>
            <Select value={inputs.debtRepaymentMode} onValueChange={(v) => set("debtRepaymentMode", v as any)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Equal principal</SelectItem>
                <SelectItem value="annuity">Annuity (level payment)</SelectItem>
                <SelectItem value="sculpted">Sculpted to target DSCR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {F("debtGraceYears", "Grace Period (interest-only)", "years")}
          {inputs.debtRepaymentMode === "sculpted" && F("targetDSCR", "Target DSCR (sculpting)", "x", 0.05)}
        </div>
        <YearArrayEditor label="Interest rate per loan year (%)" years={Tenor} values={inputs.debtRatePerYear} fallback={inputs.debtRateYr1} onChange={(a) => set("debtRatePerYear", a)} step={0.1} asPct/>
      </FullSection>
      </TabsContent>

      <TabsContent value="shl" className="m-0 pt-4">
      <FullSection title="Shareholder Loan (subordinated)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <PctField label="SHL % of Equity" value={inputs.shareholderLoanPct} onChange={(n) => set("shareholderLoanPct", Math.max(0, Math.min(1, n)))} step={1} suffix="enter 30 for 30%"/>
          <PctField label="SHL Rate" value={inputs.shareholderLoanRate} onChange={(n) => set("shareholderLoanRate", n)} step={0.25}/>
          {F("shareholderLoanTenorYears", "SHL Tenor", "years")}
          {F("shareholderLoanGraceYears", "SHL Grace", "years")}
        </div>
      </FullSection>
      </TabsContent>

      <TabsContent value="mm" className="m-0 pt-4">
      <FullSection title="Maintenance Reserve (major maintenance)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <PctField label="Annual MM Reserve % of CAPEX (scalar fallback)" value={inputs.mmAnnualPctOfCapex} onChange={(n) => set("mmAnnualPctOfCapex", n)} step={0.1}/>
        </div>
        <YearArrayEditor label="MM Reserve % of CAPEX per year" years={N} values={inputs.mmSchedulePctOfCapex} fallback={inputs.mmAnnualPctOfCapex} onChange={(a) => set("mmSchedulePctOfCapex", a)} step={0.1} asPct/>
      </FullSection>
      </TabsContent>

      <TabsContent value="tv" className="m-0 pt-4">
      <FullSection title="Terminal Value (end of contract)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Mode</Label>
            <Select value={inputs.terminalValueMode} onValueChange={(v) => set("terminalValueMode", v as any)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="salvage">Salvage % of CAPEX</SelectItem>
                <SelectItem value="ebitda-multiple">Exit EBITDA multiple</SelectItem>
                <SelectItem value="perpetuity">Gordon perpetuity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {inputs.terminalValueMode === "salvage" && <PctField label="Salvage % of CAPEX" value={inputs.salvageValuePct} onChange={(n) => set("salvageValuePct", n)} step={1}/>}
          {inputs.terminalValueMode === "ebitda-multiple" && F("exitEbitdaMultiple", "Exit EBITDA Multiple", "x", 0.5)}
          {inputs.terminalValueMode === "perpetuity" && <PctField label="Terminal Growth (g)" value={inputs.terminalGrowth} onChange={(n) => set("terminalGrowth", n)} step={0.25}/>}
        </div>
      </FullSection>
      </TabsContent>

      <TabsContent value="opexvar" className="m-0 pt-4">
      <FullSection title="OPEX — Variable (per m³)">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="w-24">Currency</TableHead>
              <TableHead className="w-32">Per m³</TableHead>
              <TableHead className="w-24">Tax %</TableHead>
              <TableHead className="w-32">EGP/m³ (Y1)</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputs.opexVariableItems.map((it, i) => {
              const gross = it.amountPerM3 * (1 + (it.taxPct ?? 0));
              const egpEq = it.currency === "USD" ? gross * inputs.fxRateEgpPerUsd : gross;
              return (
              <TableRow key={i}>
                <TableCell><Input value={it.label} onChange={(e) => updateVar(i, { label: e.target.value })} /></TableCell>
                <TableCell>
                  <Select value={it.currency} onValueChange={(v) => updateVar(i, { currency: v as Ccy })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="EGP">EGP</SelectItem></SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Input type="number" step={0.0001} value={it.amountPerM3} onChange={(e) => updateVar(i, { amountPerM3: parseFloat(e.target.value) || 0 })} /></TableCell>
                <TableCell><Input type="number" step={0.5} value={+(((it.taxPct ?? 0) * 100).toFixed(4))} onChange={(e) => { const r = parseFloat(e.target.value); updateVar(i, { taxPct: isFinite(r) ? r / 100 : 0 }); }} /></TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{egpEq.toLocaleString("en-US", { maximumFractionDigits: 4 })}</TableCell>
                <TableCell><Button size="icon" variant="ghost" onClick={() => removeVar(i)}><Trash2 className="h-4 w-4"/></Button></TableCell>
              </TableRow>
            );})}
          </TableBody>
        </Table>

        <Button size="sm" variant="outline" onClick={addVar} className="mt-3 gap-2"><Plus className="h-4 w-4"/>Add variable item</Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          <div className="flex items-center justify-between rounded border p-2 col-span-1">
            <Label>Electricity Included</Label>
            <Switch checked={inputs.electricityIncluded} onCheckedChange={(v) => set("electricityIncluded", v)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Electricity Currency</Label>
            <Select value={inputs.electricityCurrency} onValueChange={(v) => set("electricityCurrency", v as Ccy)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="EGP">EGP</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent>
            </Select>
          </div>
          {F("electricityPriceEgpKwh", `Electricity Price (${inputs.electricityCurrency}/kWh)`, undefined, 0.01)}
          {F("electricityKwhPerM3", "Electricity Use", "kWh/m³", 0.1)}
        </div>
      </FullSection>
      </TabsContent>

      <TabsContent value="opexfix" className="m-0 pt-4">
      <FullSection title="OPEX — Fixed (per month, with employees & taxes)">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="w-24">Currency</TableHead>
              <TableHead className="w-32">Per month</TableHead>
              <TableHead className="w-24"># Employees</TableHead>
              <TableHead className="w-24">Tax %</TableHead>
              <TableHead className="w-40">Total / month</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputs.opexFixedItems.map((it, i) => {
              const emp = it.employees ?? 1;
              const totalOwn = it.amountPerMonth * emp * (1 + (it.taxPct ?? 0));
              const totalEgp = it.currency === "USD" ? totalOwn * inputs.fxRateEgpPerUsd : totalOwn;
              return (
              <TableRow key={i}>
                <TableCell><Input value={it.label} onChange={(e) => updateFixed(i, { label: e.target.value })} /></TableCell>
                <TableCell>
                  <Select value={it.currency} onValueChange={(v) => updateFixed(i, { currency: v as Ccy })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="EGP">EGP</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Input type="number" step={100} value={it.amountPerMonth} onChange={(e) => updateFixed(i, { amountPerMonth: parseFloat(e.target.value) || 0 })} /></TableCell>
                <TableCell><Input type="number" step={1} value={emp} onChange={(e) => updateFixed(i, { employees: parseFloat(e.target.value) || 1 })} /></TableCell>
                <TableCell><Input type="number" step={0.5} value={+(((it.taxPct ?? 0) * 100).toFixed(4))} onChange={(e) => { const r = parseFloat(e.target.value); updateFixed(i, { taxPct: isFinite(r) ? r / 100 : 0 }); }} /></TableCell>
                <TableCell className="font-mono text-xs">
                  {totalOwn.toLocaleString("en-US", { maximumFractionDigits: 0 })} {it.currency}
                  {it.currency === "USD" && <div className="text-muted-foreground">≈ EGP {totalEgp.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>}
                </TableCell>
                <TableCell><Button size="icon" variant="ghost" onClick={() => removeFixed(i)}><Trash2 className="h-4 w-4"/></Button></TableCell>
              </TableRow>
            );})}
          </TableBody>
        </Table>
        <Button size="sm" variant="outline" onClick={addFixed} className="mt-3 gap-2"><Plus className="h-4 w-4"/>Add fixed item</Button>
      </FullSection>
      </TabsContent>

      <TabsContent value="sga" className="m-0 pt-4">
      <Section title="SG&A, WC, Tax (all EGP)">
        {F("headOfficeEgpMonth", "Head Office", "EGP per month")}
        {F("otherSgaEgpMonth", "Other SG&A", "EGP per month")}
        {F("receivablesDays", "Receivables", "DOH")}
        {F("payablesDays", "Payables", "DOH")}
        <PctField label="Tax Rate" value={inputs.taxRate} onChange={(n) => set("taxRate", n)} step={0.5}/>
        <PctField label="Project Discount Rate" value={inputs.discountRateProject} onChange={(n) => set("discountRateProject", n)} step={0.25}/>
        <PctField label="Equity Discount Rate" value={inputs.discountRateEquity} onChange={(n) => set("discountRateEquity", n)} step={0.25}/>
      </Section>
      </TabsContent>

      </Tabs>
    </div>
  );
};
