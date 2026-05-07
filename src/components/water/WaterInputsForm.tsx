import { WaterInputs } from "@/lib/waterModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

export const WaterInputsForm = ({ inputs, onChange }: { inputs: WaterInputs; onChange: (i: WaterInputs) => void }) => {
  const set = <K extends keyof WaterInputs>(k: K, v: WaterInputs[K]) => onChange({ ...inputs, [k]: v });
  const F = (k: keyof WaterInputs, label: string, suffix?: string, step = 1) => (
    <Field label={label} value={inputs[k] as number} onChange={(n) => set(k, n as any)} step={step} suffix={suffix} />
  );

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

      <Section title="FX & Inflation">
        {F("fxRateEgpPerUsd", "FX Rate", "EGP/USD", 0.01)}
        {F("egpInflation", "EGP Cost Inflation", "%", 0.001)}
        {F("revenueInflation", "Revenue Inflation", "%", 0.001)}
        {F("electricityInflation", "Electricity Inflation", "%", 0.001)}
        {F("usdInflation", "USD Inflation", "%", 0.001)}
      </Section>

      <Section title="Plant Capacity & Take">
        {F("capacityM3Day", "Installed Capacity", "m³/day")}
        {F("minTakePct", "Year-1 Min Take", "%", 0.01)}
        {F("realizedPctOfMinTake", "Realized % of Min Take", "%", 0.01)}
      </Section>

      <Section title="Pricing">
        {F("sellingPriceEgpPerM3", "Selling Price", "EGP/m³", 0.5)}
        {F("pctPeggedToUsd", "% Pegged to USD", "%", 0.01)}
      </Section>

      <Section title="CAPEX">
        {F("feedSysUsd", "Feed System", "USD")}
        {F("pretreatmentUsd", "Pretreatment", "USD")}
        {F("roUnitUsd", "RO Unit", "USD")}
        {F("bwCipUsd", "BW/CIP", "USD")}
        {F("installationEgp", "Installation", "EGP")}
        {F("drillingUsd", "Drilling/Wells", "USD")}
        {F("contingencyPct", "Contingency", "%", 0.01)}
      </Section>

      <Section title="Financing">
        {F("debtToEquity", "Debt %", "of total", 0.01)}
        {F("loanTenorYears", "Loan Tenor", "years")}
        {F("debtRateYr1", "Yr-1 Interest Rate", "%", 0.01)}
        {F("debtRateStepDown", "Annual Step-down", "pp", 0.01)}
        {F("debtRateFloor", "Rate Floor", "%", 0.01)}
        {F("bankSpread", "Bank Spread", "%", 0.005)}
      </Section>

      <Section title="OPEX — Fixed & Electricity">
        <div className="flex items-center justify-between rounded border p-2">
          <Label>Electricity Included</Label>
          <Switch checked={inputs.electricityIncluded} onCheckedChange={(v) => set("electricityIncluded", v)} />
        </div>
        {F("electricityPriceEgpKwh", "Electricity Price", "EGP/kWh", 0.01)}
        {F("electricityKwhPerM3", "Electricity Use", "kWh/m³", 0.1)}
        <div className="flex items-center justify-between rounded border p-2">
          <Label>Wells Included</Label>
          <Switch checked={inputs.wellsIncluded} onCheckedChange={(v) => set("wellsIncluded", v)} />
        </div>
        {F("wellsCostEgpPerM3", "Wells Cost", "EGP/m³", 0.01)}
        {F("otherVarEgpPerM3", "Other Variable", "EGP/m³", 0.01)}
        {F("salariesEgpMonth", "Salaries", "EGP/month")}
        {F("otherFixedEgpMonth", "Other Fixed", "EGP/month")}
      </Section>

      <Section title="OPEX — Variable USD/m³ (RO Consumables)">
        {F("chemicalsUsdPerM3", "Chemicals", "USD/m³", 0.001)}
        {F("smbsUsdPerM3", "SMBS", "USD/m³", 0.001)}
        {F("hppUsdPerM3", "HPP", "USD/m³", 0.001)}
        {F("feedUsdPerM3", "Feed", "USD/m³", 0.0001)}
        {F("mmfUsdPerM3", "MMF", "USD/m³", 0.0001)}
        {F("dosingUsdPerM3", "Dosing Pumps", "USD/m³", 0.0001)}
        {F("boosterUsdPerM3", "Booster/Turbo", "USD/m³", 0.0001)}
        {F("vfdUsdPerM3", "VFD", "USD/m³", 0.0001)}
        {F("pxUsdPerM3", "PX", "USD/m³", 0.0001)}
        {F("pressureVesselUsdPerM3", "Pressure Vessel", "USD/m³", 0.0001)}
        {F("cfsUsdPerM3", "CF's", "USD/m³", 0.0001)}
        {F("instrumentationUsdPerM3", "Instrumentation", "USD/m³", 0.0001)}
        {F("cipPumpsUsdPerM3", "CIP Pumps", "USD/m³", 0.0001)}
        {F("pvcUsdPerM3", "PVC", "USD/m³", 0.0001)}
      </Section>

      <Section title="SG&A, Depreciation, WC, Tax">
        {F("headOfficeEgpMonth", "Head Office", "EGP/month")}
        {F("headOfficeAllocPct", "HQ Allocation", "%", 0.01)}
        {F("otherSgaEgpMonth", "Other SG&A", "EGP/month")}
        {F("depreciationYears", "Depreciation Tenor", "years")}
        {F("receivablesDays", "Receivables", "DOH")}
        {F("payablesDays", "Payables", "DOH")}
        {F("taxRate", "Tax Rate", "%", 0.01)}
        {F("discountRateProject", "Project Discount Rate", "%", 0.01)}
        {F("discountRateEquity", "Equity Discount Rate", "%", 0.01)}
      </Section>
    </div>
  );
};
