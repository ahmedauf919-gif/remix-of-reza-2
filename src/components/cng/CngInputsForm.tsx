import { CngInputs, CngCapexItem, RepaymentMethod, Periodicity, fmtNum } from "@/lib/cngModel";
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

const PctField = ({ label, value, onChange, step = 0.5 }: { label: string; value: number; onChange: (n: number) => void; step?: number }) => (
  <div className="space-y-1">
    <Label className="text-xs text-muted-foreground">{label} (%)</Label>
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

function YearArrayEditor({ years, values, fallback, onChange, step = 0.5, asPct = true, prefix = "Y" }:
  { years: number; values: number[] | undefined; fallback: number; onChange: (a: number[]) => void; step?: number; asPct?: boolean; prefix?: string }) {
  const arr = Array.from({ length: years }, (_, i) => values?.[i] ?? fallback);
  const update = (i: number, v: number) => { const n = [...arr]; n[i] = v; onChange(n); };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-1">
        <Button size="sm" variant="outline" onClick={() => onChange(Array.from({ length: years }, () => arr[0] ?? fallback))}>Fill {prefix}1 → all</Button>
        <Button size="sm" variant="ghost" onClick={() => onChange([])}>Reset</Button>
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

export const CngInputsForm = ({ inputs, onChange }: { inputs: CngInputs; onChange: (i: CngInputs) => void }) => {
  const set = <K extends keyof CngInputs>(k: K, v: CngInputs[K]) => onChange({ ...inputs, [k]: v });
  const F = (k: keyof CngInputs, label: string, suffix?: string, step = 1) => (
    <Field label={label} value={inputs[k] as number} onChange={(n) => set(k, n as any)} step={step} suffix={suffix} />
  );

  const updateCapex = (idx: number, patch: Partial<CngCapexItem>) => set("capexItems", inputs.capexItems.map((it, i) => i === idx ? { ...it, ...patch } : it));
  const addCapex = () => set("capexItems", [...inputs.capexItems, { key: `it${Date.now()}`, label: "New Item", group: "Mother Station", units: 1, costPerUnit: 0, vatPct: 0.14, customsPct: 0, usefulLife: 20 }]);
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
        {F("developmentMonths", "Development", "months")}
        {F("constructionMonths", "Construction", "months")}
        {F("contractYears", "Contract Duration", "years")}
      </Section>

      <Tabs defaultValue="volume">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="volume">Volume & Pricing</TabsTrigger>
          <TabsTrigger value="logistics">Compression & Logistics</TabsTrigger>
          <TabsTrigger value="capex">CAPEX</TabsTrigger>
          <TabsTrigger value="opex">OPEX</TabsTrigger>
          <TabsTrigger value="debt">Debt</TabsTrigger>
          <TabsTrigger value="macro">Macro & Tax</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="m-0 pt-4">
          <Section title="Volume">
            <Field label="Meter capacity" value={inputs.meterM3PerHour} onChange={(n) => set("meterM3PerHour", n)} step={10} suffix="m³/hr"/>
            <div className="space-y-1 col-span-1 md:col-span-2 lg:col-span-3">
              <Label className="text-xs text-muted-foreground">Daily volume (m³/day) = {fmtNum(inputs.meterM3PerHour * inputs.operatingHoursPerDay, 0)} m³ · Annual = {fmtNum(inputs.meterM3PerHour * inputs.operatingHoursPerDay * inputs.operatingDaysPerYear, 0)} m³</Label>
            </div>
            {F("operatingDaysPerYear", "Operating days", "days/yr")}
            {F("operatingHoursPerDay", "Operating hours", "hr/day")}
          </Section>
          <div className="mt-4">
            <FullSection title="Minimum Take per year (%)">
              <YearArrayEditor years={N} values={inputs.minTakePerYear} fallback={1.0}
                onChange={(a) => set("minTakePerYear", a)} step={1} asPct/>
            </FullSection>
          </div>
          <div className="mt-4">
            <Section title="Pricing (EGP/m³)">
              {F("transportSellingPriceEgp", "Transportation selling price", "EGP/m³", 0.1)}
              {F("gasCommissionEgp", "Gas commission", "EGP/m³", 0.1)}
            </Section>
          </div>
          <div className="mt-4">
            <FullSection title="Revenue inflation per year (%)">
              <YearArrayEditor years={N} values={inputs.revenueInflationPerYear} fallback={0.05}
                onChange={(a) => set("revenueInflationPerYear", a)} step={0.5} asPct/>
            </FullSection>
          </div>
        </TabsContent>

        <TabsContent value="logistics" className="m-0 pt-4">
          <Section title="Compression">
            {F("compressorCapacityM3hr", "Compressor capacity", "m³/hr", 50)}
            {F("numCompressors", "# compressors")}
            <PctField label="Compressor performance" value={inputs.compressorPerformance} onChange={(n) => set("compressorPerformance", n)} step={1}/>
            <PctField label="Flow sharing factor" value={inputs.flowSharingFactor} onChange={(n) => set("flowSharingFactor", n)} step={1}/>
          </Section>
          <div className="mt-4">
            <Section title="Trailers / Trucks">
              {F("numTrailers", "# trailers")}
              {F("trailerCapacityM3", "Trailer capacity", "m³", 100)}
              <PctField label="Unutilized % per truck" value={inputs.unutilizedPctPerTruck} onChange={(n) => set("unutilizedPctPerTruck", n)} step={1}/>
              {F("tripsPerMonth", "Trips / month / trailer")}
              {F("distancePerTripKm", "Distance per trip", "km")}
              {F("miscKm", "Misc.", "km")}
              {F("averageSpeedKmh", "Avg speed", "km/h")}
              {F("trailerOverlapStationHr", "Overlap @ station", "hr", 0.1)}
              {F("trailerOverlapPruHr", "Overlap @ PRU", "hr", 0.1)}
            </Section>
          </div>
        </TabsContent>

        <TabsContent value="capex" className="m-0 pt-4">
          <FullSection title="CAPEX (itemised, with VAT and customs)">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="w-32">Group</TableHead>
                  <TableHead className="w-20">Units</TableHead>
                  <TableHead className="w-32">Cost / Unit</TableHead>
                  <TableHead className="w-20">VAT %</TableHead>
                  <TableHead className="w-20">Customs %</TableHead>
                  <TableHead className="w-20">Life (yrs)</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inputs.capexItems.map((it, i) => (
                  <TableRow key={i}>
                    <TableCell><Input value={it.label} onChange={(e) => updateCapex(i, { label: e.target.value })} /></TableCell>
                    <TableCell>
                      <Select value={it.group} onValueChange={(v) => updateCapex(i, { group: v as CngCapexItem["group"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mother Station">Mother Station</SelectItem>
                          <SelectItem value="Trailer">Trailer</SelectItem>
                          <SelectItem value="Daughter Station">Daughter Station</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Input type="number" step={1} value={it.units} onChange={(e) => updateCapex(i, { units: parseFloat(e.target.value) || 0 })} /></TableCell>
                    <TableCell><Input type="number" step={1000} value={it.costPerUnit} onChange={(e) => updateCapex(i, { costPerUnit: parseFloat(e.target.value) || 0 })} /></TableCell>
                    <TableCell><Input type="number" step={0.5} value={+((it.vatPct * 100).toFixed(2))} onChange={(e) => updateCapex(i, { vatPct: (parseFloat(e.target.value) || 0) / 100 })} /></TableCell>
                    <TableCell><Input type="number" step={0.5} value={+(((it.customsPct ?? 0) * 100).toFixed(2))} onChange={(e) => updateCapex(i, { customsPct: (parseFloat(e.target.value) || 0) / 100 })} /></TableCell>
                    <TableCell><Input type="number" step={0.5} value={+it.usefulLife.toFixed(2)} onChange={(e) => updateCapex(i, { usefulLife: parseFloat(e.target.value) || 0 })} /></TableCell>
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
              <YearArrayEditor years={Months} values={inputs.capexDrawScheduleMonthly}
                fallback={1 / Months} onChange={(a) => set("capexDrawScheduleMonthly", a)} step={0.5} asPct prefix="M" />
            </FullSection>
          </div>
        </TabsContent>

        <TabsContent value="opex" className="m-0 pt-4">
          <Section title="Mother Station — Salaries">
            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground font-medium pb-1 border-b">
              <span>Role</span><span className="text-right">Count</span><span className="text-right">EGP/month / person</span>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-3 gap-2 items-center">
              <span className="text-sm">Engineers / PM</span>
              <Input type="number" step={1} value={inputs.msEngineersCount} onChange={(e) => set("msEngineersCount", parseFloat(e.target.value)||0)} className="h-8"/>
              <Input type="number" step={500} value={inputs.msEngineerSalaryEgpMo} onChange={(e) => set("msEngineerSalaryEgpMo", parseFloat(e.target.value)||0)} className="h-8"/>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-3 gap-2 items-center">
              <span className="text-sm">Mother Station Technicians</span>
              <Input type="number" step={1} value={inputs.msTechniciansCount} onChange={(e) => set("msTechniciansCount", parseFloat(e.target.value)||0)} className="h-8"/>
              <Input type="number" step={500} value={inputs.msTechnicianSalaryEgpMo} onChange={(e) => set("msTechnicianSalaryEgpMo", parseFloat(e.target.value)||0)} className="h-8"/>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-3 gap-2 items-center">
              <span className="text-sm">PRU / Daughter Station Technicians</span>
              <Input type="number" step={1} value={inputs.msPruTechniciansCount} onChange={(e) => set("msPruTechniciansCount", parseFloat(e.target.value)||0)} className="h-8"/>
              <Input type="number" step={500} value={inputs.msPruTechnicianSalaryEgpMo} onChange={(e) => set("msPruTechnicianSalaryEgpMo", parseFloat(e.target.value)||0)} className="h-8"/>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-xs text-muted-foreground border-t pt-1">
              Monthly salary total: EGP {fmtNum((inputs.msEngineersCount * inputs.msEngineerSalaryEgpMo) + (inputs.msTechniciansCount * inputs.msTechnicianSalaryEgpMo) + (inputs.msPruTechniciansCount * inputs.msPruTechnicianSalaryEgpMo), 0)}
            </div>
            {F("msPruRentEgpMo", "PRU/Site rent", "EGP/mo", 1000)}
            {F("pruCapacityM3hr", "PRU capacity", "m³/hr", 50)}
          </Section>
          <div className="mt-4">
            <Section title="Compression — Electricity">
              {F("msElectricityEgpKwh", "Electricity price", "EGP/kWh", 0.1)}
              {F("msKwhPerM3", "kWh per m³ compressed", "kWh/m³", 0.01)}
            </Section>
          </div>
          <div className="mt-4">
            <Section title="Trailer / Transport">
              {F("fixedTransportPerTripEgp", "Fixed transport / trip", "EGP", 100)}
              {F("variableTransportPerKmEgp", "Variable transport / km", "EGP/km", 0.5)}
              {F("tireCostPerYearEgp", "Tire cost / yr / trailer", "EGP/yr", 1000)}
            </Section>
          </div>
          <div className="mt-4">
            <Section title="Daughter / Other">
              {F("tollEgpMo", "Toll", "EGP/mo", 1000)}
              {F("insuranceEgpMo", "Insurance", "EGP/mo", 1000)}
              {F("miscEgpMo", "Misc.", "EGP/mo", 1000)}
            </Section>
          </div>
          <div className="mt-4">
            <Section title="SGA / Head office">
              {F("headOfficeEgpMo", "HO monthly expense", "EGP/mo", 1000)}
              <PctField label="HO allocation %" value={inputs.headOfficeAllocPct} onChange={(n) => set("headOfficeAllocPct", n)} step={1}/>
            </Section>
          </div>
          <div className="mt-4">
            <FullSection title="Cost inflation per year (%)">
              <YearArrayEditor years={N} values={inputs.costInflationPerYear} fallback={0.10}
                onChange={(a) => set("costInflationPerYear", a)} step={0.5} asPct/>
            </FullSection>
          </div>
        </TabsContent>

        <TabsContent value="debt" className="m-0 pt-4">
          <FullSection title="Senior Debt">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <PctField label="Debt %" value={inputs.debtPct} onChange={(n) => set("debtPct", Math.max(0, Math.min(1, n)))} step={1}/>
              <PctField label="Bank spread" value={inputs.spreadPct} onChange={(n) => set("spreadPct", n)} step={0.1}/>
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
                    <SelectItem value="Equal">Equal</SelectItem>
                    <SelectItem value="Customized">Customized</SelectItem>
                    <SelectItem value="Annuity">Annuity</SelectItem>
                    <SelectItem value="Sculpted">Sculpted (DSCR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {F("graceYears", "Grace", "years")}
              {inputs.repaymentMethod === "Sculpted" && (
                <PctField label="Target DSCR" value={inputs.targetDSCR} onChange={(n) => set("targetDSCR", n)} step={5}/>
              )}
            </div>
            {inputs.repaymentMethod === "Customized" && (
              <YearArrayEditor years={Tenor} values={inputs.customizedSchedule} fallback={0} onChange={(a) => set("customizedSchedule", a)} step={0.5} asPct/>
            )}
            <div className="mt-4">
              <Label className="text-xs">Bank all-in interest rate per year (overrides corridor + spread)</Label>
              <YearArrayEditor years={N} values={inputs.bankInterestPerYear} fallback={(inputs.corridorPctPerYear[0] ?? 0.20) + inputs.spreadPct}
                onChange={(a) => set("bankInterestPerYear", a)} step={0.25} asPct/>
            </div>
          </FullSection>

          <div className="mt-4">
            <FullSection title="Shareholder Loan">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-center justify-between rounded border p-2">
                  <Label>Enable</Label>
                  <Switch checked={inputs.slEnabled} onCheckedChange={(v) => set("slEnabled", v)}/>
                </div>
                <PctField label="SL % of equity" value={inputs.slPctOfEquity} onChange={(n) => set("slPctOfEquity", Math.max(0, Math.min(1, n)))} step={5}/>
                <PctField label="SL interest rate" value={inputs.slRatePct} onChange={(n) => set("slRatePct", n)} step={0.5}/>
                {F("slTenorYears", "SL tenor", "years")}
                {F("slGraceYears", "SL grace", "years")}
              </div>
            </FullSection>
          </div>

          <div className="mt-4">
            <FullSection title="Refinancing">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-center justify-between rounded border p-2">
                  <Label>Enable</Label>
                  <Switch checked={inputs.refiEnabled} onCheckedChange={(v) => set("refiEnabled", v)}/>
                </div>
                {F("refiYear", "Refi year (1 = first ops)")}
                <PctField label="New rate" value={inputs.refiNewRatePct} onChange={(n) => set("refiNewRatePct", n)} step={0.25}/>
                {F("refiNewTenorYears", "New tenor", "years")}
              </div>
            </FullSection>
          </div>
        </TabsContent>

        <TabsContent value="macro" className="m-0 pt-4">
          <Section title="Working capital, tax & discount">
            {F("arDays", "A/R", "days")}
            {F("apDays", "A/P", "days")}
            <PctField label="CIT tax rate" value={inputs.citTaxRatePct} onChange={(n) => set("citTaxRatePct", n)} step={0.5}/>
            <PctField label="VAT rate" value={inputs.vatTaxRatePct} onChange={(n) => set("vatTaxRatePct", n)} step={0.5}/>
            <PctField label="Project discount rate" value={inputs.discountRateProject} onChange={(n) => set("discountRateProject", n)} step={0.25}/>
            <PctField label="Equity discount rate" value={inputs.discountRateEquity} onChange={(n) => set("discountRateEquity", n)} step={0.25}/>
          </Section>
          <div className="mt-4">
            <FullSection title="EGP / USD per year">
              <YearArrayEditor years={N} values={inputs.fxEgpPerUsdPerYear} fallback={50}
                onChange={(a) => set("fxEgpPerUsdPerYear", a)} step={1} asPct={false}/>
            </FullSection>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
