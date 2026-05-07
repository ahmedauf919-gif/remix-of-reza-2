import { PvInputs, PvCapexItem, Ccy, VoltageLevel, RepaymentMethod, Periodicity, DepMethod, YieldCase, TariffSource } from "@/lib/pvModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Plus } from "lucide-react";

const Field = ({ label, value, onChange, step = 1, suffix }: { label: string; value: number; onChange: (n: number) => void; step?: number; suffix?: string }) => (
  <div className="space-y-1">
    <Label className="text-xs text-muted-foreground">{label}{suffix ? ` (${suffix})` : ""}</Label>
    <Input type="number" step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />
  </div>
);

const PctField = ({ label, value, onChange, step = 0.5, suffix }: { label: string; value: number; onChange: (n: number) => void; step?: number; suffix?: string }) => (
  <div className="space-y-1">
    <Label className="text-xs text-muted-foreground">{label} (%) {suffix && <span className="opacity-60">({suffix})</span>}</Label>
    <Input type="number" step={step} value={+(value * 100).toFixed(4)} onChange={(e) => { const r = parseFloat(e.target.value); onChange(isFinite(r) ? r / 100 : 0); }} />
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

function YearArrayEditor({ label, years, values, fallback, onChange, step = 0.001, asPct = false, prefix = "Y" }:
  { label: string; years: number; values: number[] | undefined; fallback: number; onChange: (a: number[]) => void; step?: number; asPct?: boolean; prefix?: string }) {
  const arr = Array.from({ length: years }, (_, i) => values?.[i] ?? fallback);
  const update = (i: number, v: number) => { const n = [...arr]; n[i] = v; onChange(n); };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs">{label}</Label>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" onClick={() => onChange(Array.from({ length: years }, () => arr[0] ?? fallback))}>Fill {prefix}1 → all</Button>
          <Button size="sm" variant="ghost" onClick={() => onChange([])}>Reset</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead><tr>{arr.map((_, i) => <th key={i} className="px-1 font-normal text-muted-foreground">{prefix}{i + 1}</th>)}</tr></thead>
          <tbody><tr>{arr.map((v, i) => (
            <td key={i} className="px-1">
              <Input type="number" step={step} value={asPct ? +(v * 100).toFixed(4) : v}
                onChange={(e) => { const raw = parseFloat(e.target.value); update(i, asPct ? (isFinite(raw) ? raw / 100 : 0) : (isFinite(raw) ? raw : 0)); }}
                className="h-8 w-20" />
            </td>
          ))}</tr></tbody>
        </table>
      </div>
    </div>
  );
}

export const PvInputsForm = ({ inputs, onChange }: { inputs: PvInputs; onChange: (i: PvInputs) => void }) => {
  const set = <K extends keyof PvInputs>(k: K, v: PvInputs[K]) => onChange({ ...inputs, [k]: v });
  const F = (k: keyof PvInputs, label: string, suffix?: string, step = 1) => (
    <Field label={label} value={inputs[k] as number} onChange={(n) => set(k, n as any)} step={step} suffix={suffix} />
  );

  const updateCapex = (idx: number, patch: Partial<PvCapexItem>) => set("capexItems", inputs.capexItems.map((it, i) => i === idx ? { ...it, ...patch } : it));
  const addCapex = () => set("capexItems", [...inputs.capexItems, { key: `it${Date.now()}`, label: "New Item", currency: "USD", units: 0, costPerUnit: 0, vatPct: 0.05, customsPct: 0.07, usefulLife: 25, depMethod: "StraightLine" }]);
  const removeCapex = (idx: number) => set("capexItems", inputs.capexItems.filter((_, i) => i !== idx));

  const N = inputs.contractYears;
  const Tenor = inputs.loanTenorYears;
  const Months = Math.max(1, inputs.constructionMonths);

  return (
    <div className="space-y-6">
      <Section title="Project & Timing">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Project Name</Label>
          <Input value={inputs.projectName} onChange={(e) => set("projectName", e.target.value)} />
        </div>
        {F("startYear", "Operations Start Year")}
        {F("constructionMonths", "Construction", "months")}
        {F("contractYears", "Forecast Horizon", "years")}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Contract Type</Label>
          <Select value={inputs.contractType} onValueChange={(v) => set("contractType", v as PvInputs["contractType"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BOO">BOO</SelectItem>
              <SelectItem value="BOT">BOT</SelectItem>
              <SelectItem value="PPA">PPA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Tabs defaultValue="capacity">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="capacity">Capacity & Yield</TabsTrigger>
          <TabsTrigger value="tariff">Tariff</TabsTrigger>
          <TabsTrigger value="capex">CAPEX</TabsTrigger>
          <TabsTrigger value="opex">OPEX</TabsTrigger>
          <TabsTrigger value="debt">Debt</TabsTrigger>
          <TabsTrigger value="macro">Macro & FX</TabsTrigger>
          <TabsTrigger value="tax">Tax / WC / Discount</TabsTrigger>
        </TabsList>

        <TabsContent value="capacity" className="m-0 pt-4">
          <Section title="PV Capacity & Yield">
            {F("capacityKwp", "Installed Capacity", "kWp", 10)}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Structure Type</Label>
              <Select value={inputs.structureType} onValueChange={(v) => set("structureType", v as PvInputs["structureType"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="Tracker">Tracker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Yield Case</Label>
              <Select value={inputs.yieldCase} onValueChange={(v) => set("yieldCase", v as YieldCase)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="P50">P50</SelectItem>
                  <SelectItem value="P90">P90</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {F("yieldP50", "Yield P50", "kWh/kWp/yr", 1)}
            {F("yieldP90", "Yield P90", "kWh/kWp/yr", 1)}
            <PctField label="Loss in Year 1" value={inputs.lossYr1} onChange={(n) => set("lossYr1", n)} step={0.1}/>
            <PctField label="Annual Degradation (thereafter)" value={inputs.lossThereafterPct} onChange={(n) => set("lossThereafterPct", n)} step={0.05}/>
          </Section>

          <div className="mt-4">
            <Section title="Land & Rent">
              <div className="flex items-center justify-between rounded border p-2 col-span-1">
                <Label>Rent Enabled</Label>
                <Switch checked={inputs.rentEnabled} onCheckedChange={(v) => set("rentEnabled", v)} />
              </div>
              {F("landAreaSqm", "Land Area", "sqm", 100)}
              {F("rentEgpPerSqm", "Rent (Y1)", "EGP/sqm", 1)}
              <div className="col-span-full text-xs text-muted-foreground">Rent escalates yearly using the <span className="font-medium">Usufruct YoY</span> rate set under OPEX.</div>
            </Section>
          </div>
        </TabsContent>

        <TabsContent value="tariff" className="m-0 pt-4">
          <Section title="Tariff Source">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Source</Label>
              <Select value={inputs.tariffSource} onValueChange={(v) => set("tariffSource", v as TariffSource)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government">Government Tariff</SelectItem>
                  <SelectItem value="Custom">Custom Tariff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {inputs.tariffSource === "Government" && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Voltage Level</Label>
                  <Select value={inputs.voltageLevel} onValueChange={(v) => set("voltageLevel", v as VoltageLevel)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Extra High Voltage">Extra High Voltage</SelectItem>
                      <SelectItem value="High Voltage">High Voltage</SelectItem>
                      <SelectItem value="Medium Voltage">Medium Voltage</SelectItem>
                      <SelectItem value="Low Voltage">Low Voltage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {F("govtBaseTariffEgp", "Base Tariff (Y1)", "EGP/kWh", 0.01)}
                <PctField label="Default Escalation YoY" value={inputs.govtEscalationPct} onChange={(n) => set("govtEscalationPct", n)} step={0.5}/>
              </>
            )}
          </Section>

          <div className="mt-4">
            <FullSection title="Tariff Schedule (EGP/kWh per year)">
              <div className="mb-3 flex items-center gap-2">
                <Button size="sm" variant="outline"
                  onClick={() => set("tariffPerYear",
                    Array.from({ length: N }, (_, i) => inputs.govtBaseTariffEgp * Math.pow(1 + inputs.govtEscalationPct, i)))}>
                  Generate from base × escalation
                </Button>
                <Button size="sm" variant="ghost" onClick={() => set("tariffPerYear", [])}>Clear (use formula)</Button>
              </div>
              <YearArrayEditor label="Tariff (EGP/kWh)" years={N} values={inputs.tariffPerYear} fallback={inputs.govtBaseTariffEgp}
                onChange={(a) => set("tariffPerYear", a)} step={0.01} />
            </FullSection>
          </div>

          <div className="mt-4">
            <FullSection title="Annual Savings vs Tariff (%)">
              <YearArrayEditor label="Savings %" years={N} values={inputs.savingsPctPerYear} fallback={0.20}
                onChange={(a) => set("savingsPctPerYear", a)} step={0.5} asPct />
            </FullSection>
          </div>
        </TabsContent>

        <TabsContent value="capex" className="m-0 pt-4">
          <FullSection title="CAPEX (itemised, VAT & customs per item)">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="w-20">Ccy</TableHead>
                  <TableHead className="w-28">Units</TableHead>
                  <TableHead className="w-32">Cost / Unit</TableHead>
                  <TableHead className="w-20">VAT %</TableHead>
                  <TableHead className="w-20">Customs %</TableHead>
                  <TableHead className="w-20">Life (yrs)</TableHead>
                  <TableHead className="w-32">Dep. Method</TableHead>
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
                    <TableCell><Input type="number" step={1} value={it.units} onChange={(e) => updateCapex(i, { units: parseFloat(e.target.value) || 0 })} /></TableCell>
                    <TableCell><Input type="number" step={1} value={it.costPerUnit} onChange={(e) => updateCapex(i, { costPerUnit: parseFloat(e.target.value) || 0 })} /></TableCell>
                    <TableCell><Input type="number" step={0.5} value={+((it.vatPct * 100).toFixed(2))} onChange={(e) => updateCapex(i, { vatPct: (parseFloat(e.target.value) || 0) / 100 })} /></TableCell>
                    <TableCell><Input type="number" step={0.5} value={+(((it.customsPct ?? 0) * 100).toFixed(2))} onChange={(e) => updateCapex(i, { customsPct: (parseFloat(e.target.value) || 0) / 100 })} /></TableCell>
                    <TableCell><Input type="number" step={1} value={it.usefulLife} onChange={(e) => updateCapex(i, { usefulLife: parseInt(e.target.value) || 0 })} /></TableCell>
                    <TableCell>
                      <Select value={it.depMethod} onValueChange={(v) => updateCapex(i, { depMethod: v as DepMethod })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="StraightLine">Straight Line</SelectItem>
                          <SelectItem value="UnitOfProduction">Unit of Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Button size="icon" variant="ghost" onClick={() => removeCapex(i)}><Trash2 className="h-4 w-4"/></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button size="sm" variant="outline" onClick={addCapex} className="mt-3 gap-2"><Plus className="h-4 w-4"/>Add CAPEX item</Button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <PctField label="Contingency" value={inputs.contingencyPct} onChange={(n) => set("contingencyPct", n)} step={0.5}/>
            </div>
          </FullSection>

          <div className="mt-4">
            <FullSection title={`CAPEX Drawdown — % per construction month (×${Months})`}>
              <div className="mb-3 flex items-center gap-2">
                <Button size="sm" variant="outline"
                  onClick={() => set("capexDrawScheduleMonthly", Array.from({ length: Months }, () => 1 / Months))}>
                  Linear (equal split)
                </Button>
                <Button size="sm" variant="ghost" onClick={() => set("capexDrawScheduleMonthly", [])}>Clear</Button>
                <span className="text-xs text-muted-foreground ml-auto">Sum normalises to 100%. Drives Capitalised Interest (IDC).</span>
              </div>
              <YearArrayEditor label="Drawdown" years={Months} values={inputs.capexDrawScheduleMonthly}
                fallback={1 / Months} onChange={(a) => set("capexDrawScheduleMonthly", a)} step={0.5} asPct prefix="M" />
            </FullSection>
          </div>
        </TabsContent>

        <TabsContent value="opex" className="m-0 pt-4">
          <Section title="OPEX">
            {F("maintenancePerMwUsd", "Maintenance", "USD/MW/yr", 100)}
            <PctField label="Maintenance EGP %" value={inputs.maintenanceEgpPct} onChange={(n) => set("maintenanceEgpPct", n)} step={5}/>
            <PctField label="Maintenance USD %" value={inputs.maintenanceUsdPct} onChange={(n) => set("maintenanceUsdPct", n)} step={5}/>
            <div className="flex items-center justify-between rounded border p-2 col-span-1">
              <Label>Maintenance Taxable (apply VAT)</Label>
              <Switch checked={inputs.maintenanceTaxable} onCheckedChange={(v) => set("maintenanceTaxable", v)} />
            </div>
            {inputs.maintenanceTaxable && (
              <PctField label="Maintenance VAT" value={inputs.maintenanceVatPct} onChange={(n) => set("maintenanceVatPct", n)} step={0.5}/>
            )}
            <PctField label="OPEX YoY (real)" value={inputs.opexYoYPct} onChange={(n) => set("opexYoYPct", n)} step={0.25}/>
            <PctField label="Insurance % of CAPEX" value={inputs.insurancePctOfCapex} onChange={(n) => set("insurancePctOfCapex", n)} step={0.05}/>
            {F("replacementDurationYears", "Replacement every", "years")}
            <PctField label="Replacement Cost % of CAPEX" value={inputs.replacementCostPctOfCapex} onChange={(n) => set("replacementCostPctOfCapex", n)} step={0.5}/>
            <PctField label="Usufruct % of Revenue" value={inputs.usufructPctOfRevenue} onChange={(n) => set("usufructPctOfRevenue", n)} step={0.5}/>
            <PctField label="Usufruct YoY (also escalates Rent)" value={inputs.usufructYoYPct} onChange={(n) => set("usufructYoYPct", n)} step={0.5}/>
          </Section>
        </TabsContent>

        <TabsContent value="debt" className="m-0 pt-4">
          <FullSection title="Debt Assumptions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <PctField label="Debt %" value={inputs.debtPct} onChange={(n) => set("debtPct", Math.max(0, Math.min(1, n)))} step={1} suffix="enter 70 for 70%"/>
              <PctField label="Bank Spread (fallback)" value={inputs.spreadPct} onChange={(n) => set("spreadPct", n)} step={0.1}/>
              {F("loanTenorYears", "Tenor", "years")}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Periodicity</Label>
                <Select value={inputs.paymentPeriodicity} onValueChange={(v) => set("paymentPeriodicity", v as Periodicity)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Semi-Annual">Semi-Annual</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Repayment Method</Label>
                <Select value={inputs.repaymentMethod} onValueChange={(v) => set("repaymentMethod", v as RepaymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equal">Equal Payments</SelectItem>
                    <SelectItem value="Customized">Customized</SelectItem>
                    <SelectItem value="Annuity">Annuity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {F("graceYears", "Grace Period (interest-only)", "years")}
            </div>
            {inputs.repaymentMethod === "Customized" && (
              <YearArrayEditor label="Customised principal % per year (sums to 100%)" years={Tenor} values={inputs.customizedSchedule} fallback={0} onChange={(a) => set("customizedSchedule", a)} step={0.5} asPct/>
            )}
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-2">
                <Button size="sm" variant="outline"
                  onClick={() => set("bankInterestPerYear",
                    Array.from({ length: N }, (_, i) => (inputs.corridorPctPerYear[i] ?? inputs.corridorPctPerYear[inputs.corridorPctPerYear.length - 1] ?? 0.0925) + inputs.spreadPct))}>
                  Seed from Corridor + Spread
                </Button>
                <Button size="sm" variant="ghost" onClick={() => set("bankInterestPerYear", [])}>Clear (use Corridor + Spread)</Button>
                <span className="text-xs text-muted-foreground ml-auto">When set, overrides Corridor + Spread per year.</span>
              </div>
              <YearArrayEditor label="Bank All-in Interest Rate per year (%)" years={N} values={inputs.bankInterestPerYear}
                fallback={(inputs.corridorPctPerYear[0] ?? 0.0925) + inputs.spreadPct} onChange={(a) => set("bankInterestPerYear", a)} step={0.25} asPct/>
            </div>
          </FullSection>
        </TabsContent>

        <TabsContent value="macro" className="m-0 pt-4">
          <FullSection title="Macro Economic Assumptions">
            <div className="space-y-4">
              <YearArrayEditor label="EGP Inflation per year (%)" years={N} values={inputs.egpInflationPerYear} fallback={0.15} onChange={(a) => set("egpInflationPerYear", a)} step={0.5} asPct/>
              <YearArrayEditor label="USD Inflation per year (%)" years={N} values={inputs.usdInflationPerYear} fallback={0.03} onChange={(a) => set("usdInflationPerYear", a)} step={0.25} asPct/>
              <YearArrayEditor label="CBE Corridor per year (%)" years={N} values={inputs.corridorPctPerYear} fallback={0.0925} onChange={(a) => set("corridorPctPerYear", a)} step={0.25} asPct/>
              <YearArrayEditor label="EGP / USD per year" years={N} values={inputs.fxEgpPerUsdPerYear} fallback={50} onChange={(a) => set("fxEgpPerUsdPerYear", a)} step={1}/>
            </div>
          </FullSection>
        </TabsContent>

        <TabsContent value="tax" className="m-0 pt-4">
          <Section title="Working Capital, Tax & Discount Rates">
            {F("arDays", "A/R", "days")}
            {F("apDays", "A/P", "days")}
            <PctField label="Income Tax Rate" value={inputs.taxRatePct} onChange={(n) => set("taxRatePct", n)} step={0.5}/>
            <PctField label="Project Discount Rate" value={inputs.discountRateProject} onChange={(n) => set("discountRateProject", n)} step={0.25}/>
            <PctField label="Equity Discount Rate" value={inputs.discountRateEquity} onChange={(n) => set("discountRateEquity", n)} step={0.25}/>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
};
