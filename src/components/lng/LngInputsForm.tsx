import { LngInputs, LngCapexItem, LngCustomer, DEFAULT_LNG_INPUTS } from "@/lib/lngModel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const N = (v: number | undefined, fb = 0) => (v == null || !isFinite(Number(v)) ? fb : Number(v));
const pct = (v: number) => +(v * 100).toFixed(4);
const dec = (v: number) => +(v / 100);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-medium text-muted-foreground mb-1">{children}</label>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
  />
);
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
);
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><Label>{label}</Label>{children}</div>
);
const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-[#002060] border-b border-border pb-1 mb-3 mt-5">{children}</h3>
);

// Inline year-array editor — shows one cell per year (up to maxYears)
function YearArrayEditor({
  label,
  values,
  onChange,
  maxYears = 15,
  format = "pct",
  step = "0.1",
}: {
  label: string;
  values: number[];
  onChange: (v: number[]) => void;
  maxYears?: number;
  format?: "pct" | "number";
  step?: string;
}) {
  const displayed = Array.from({ length: maxYears }, (_, i) =>
    values[i] != null ? values[i] : (values[values.length - 1] ?? 0)
  );
  const handleChange = (i: number, raw: string) => {
    const parsed = parseFloat(raw);
    const num = isFinite(parsed) ? (format === "pct" ? parsed / 100 : parsed) : displayed[i];
    const next = [...displayed];
    next[i] = num;
    onChange(next);
  };
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border border-border rounded-lg overflow-hidden">
          <thead className="bg-muted/50">
            <tr>
              {displayed.map((_, i) => (
                <th key={i} className="px-2 py-1 text-center font-medium text-muted-foreground border-r border-border/40 last:border-0">Y{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {displayed.map((v, i) => (
                <td key={i} className="border-r border-border/40 last:border-0 p-0">
                  <input
                    type="number"
                    step={step}
                    value={format === "pct" ? pct(v) : v}
                    onChange={e => handleChange(i, e.target.value)}
                    className="w-16 text-center bg-transparent font-mono py-1 px-1 focus:outline-none focus:bg-primary/5"
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Props = { inputs: LngInputs; onChange: (v: LngInputs) => void };

export function LngInputsForm({ inputs: I, onChange }: Props) {
  const set = <K extends keyof LngInputs>(k: K, v: LngInputs[K]) => onChange({ ...I, [k]: v });

  const setCustomer = (idx: number, field: keyof LngCustomer, val: unknown) => {
    const c = I.customers.map((cust, i) => i === idx ? { ...cust, [field]: val } : cust);
    set("customers", c);
  };

  const setCapex = (idx: number, field: keyof LngCapexItem, val: unknown) => {
    const items = I.capexItems.map((it, i) => i === idx ? { ...it, [field]: val } : it);
    set("capexItems", items);
  };

  const addCapexRow = () => set("capexItems", [
    ...I.capexItems,
    { key: `item${I.capexItems.length}`, label: "New Item", amountUsd: 0, vatPct: 0.18, units: 1 },
  ]);
  const removeCapex = (idx: number) => set("capexItems", I.capexItems.filter((_, i) => i !== idx));

  const N_years = I.projectDurationYears || 15;
  const N_months = I.constructionMonths || 12;

  // Ensure draw schedule has correct length
  const drawSchedule = Array.from({ length: N_months }, (_, i) =>
    (I.capexDrawScheduleMonthly ?? [])[i] ?? (1 / N_months)
  );

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="volumes">Volumes & Customers</TabsTrigger>
        <TabsTrigger value="capex">CAPEX</TabsTrigger>
        <TabsTrigger value="opex">OPEX</TabsTrigger>
        <TabsTrigger value="transport">Transport</TabsTrigger>
        <TabsTrigger value="financial">Financial</TabsTrigger>
        <TabsTrigger value="macro">Macro & FX</TabsTrigger>
      </TabsList>

      {/* ── General ── */}
      <TabsContent value="general" className="space-y-4 pt-4">
        <Row>
          <Field label="Project Name">
            <Input value={I.projectName} onChange={e => set("projectName", e.target.value)} />
          </Field>
          <Field label="Commercial Operations Start Year">
            <Input type="number" value={I.startYear} onChange={e => set("startYear", N(+e.target.value, 2027))} />
          </Field>
          <Field label="Project Duration (years)">
            <Input type="number" value={I.projectDurationYears} onChange={e => set("projectDurationYears", N(+e.target.value, 15))} />
          </Field>
          <Field label="Construction Period (months)">
            <Input type="number" value={I.constructionMonths} onChange={e => set("constructionMonths", N(+e.target.value, 12))} />
          </Field>
          <Field label="Depreciation Period (years)">
            <Input type="number" value={I.depreciationYears} onChange={e => set("depreciationYears", N(+e.target.value, 15))} />
          </Field>
          <Field label="Contingency (%)">
            <Input type="number" value={pct(I.contingencyPct)} onChange={e => set("contingencyPct", dec(+e.target.value))} step="0.1" />
          </Field>
        </Row>

        <SectionHeader>Revenue Assumptions</SectionHeader>
        <Row>
          <Field label="Selling Price (USD/MMBTU)">
            <Input type="number" value={I.sellingPriceUsdPerMmbtu} onChange={e => set("sellingPriceUsdPerMmbtu", N(+e.target.value, 18))} step="0.1" />
          </Field>
          <Field label="Feed Gas Cost (USD/MMBTU)">
            <Input type="number" value={I.feedGasPriceUsdPerMmbtu} onChange={e => set("feedGasPriceUsdPerMmbtu", N(+e.target.value, 5.5))} step="0.1" />
          </Field>
        </Row>
        <p className="text-xs text-muted-foreground">Inflation escalation rates are configured in the <strong>Macro &amp; FX</strong> tab.</p>
      </TabsContent>

      {/* ── Volumes & Customers ── */}
      <TabsContent value="volumes" className="space-y-4 pt-4">
        <SectionHeader>Facility Capacity</SectionHeader>
        <Row>
          <Field label="LNG Production Capacity (m³/day)">
            <Input type="number" value={I.capacityM3LngPerDay} onChange={e => set("capacityM3LngPerDay", N(+e.target.value, 40))} />
          </Field>
          <Field label="MMBTU per m³ LNG (conversion)">
            <Input type="number" value={I.mmbtuPerM3Lng} onChange={e => set("mmbtuPerM3Lng", N(+e.target.value, 21.5))} step="0.1" />
          </Field>
          <Field label="Facility Operating Days / Year">
            <Input type="number" value={I.facilityOperatingDays} onChange={e => set("facilityOperatingDays", N(+e.target.value, 330))} />
          </Field>
          <Field label="Demand Utilization (%)">
            <Input type="number" value={pct(I.demandUtilizationPct)} onChange={e => set("demandUtilizationPct", dec(+e.target.value))} step="1" />
          </Field>
        </Row>

        <SectionHeader>Utilization Ramp-Up per Year (%)</SectionHeader>
        <YearArrayEditor
          label="Volume utilization per year (% of base annual volume, 100% = full)"
          values={(I.utilizationPerYear ?? []).length > 0
            ? (I.utilizationPerYear as number[])
            : DEFAULT_LNG_INPUTS.utilizationPerYear && DEFAULT_LNG_INPUTS.utilizationPerYear.length > 0
              ? DEFAULT_LNG_INPUTS.utilizationPerYear
              : Array.from({ length: N_years }, (_, i) => i === 0 ? 0.70 : 1.0)
          }
          onChange={v => set("utilizationPerYear", v)}
          maxYears={N_years}
          format="pct"
        />
        <p className="text-xs text-muted-foreground">Y1 defaults to 70% ramp-up. Set all to 100% for full utilization from year 1.</p>

        <SectionHeader>Customer Volumes (MMBTU/day)</SectionHeader>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Volume (MMBTU/day)</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground">Active</th>
              </tr>
            </thead>
            <tbody>
              {I.customers.map((c, i) => (
                <tr key={i} className="border-t border-border/40">
                  <td className="px-4 py-2 text-muted-foreground font-mono text-xs">C{i + 1}</td>
                  <td className="px-4 py-2">
                    <Input value={c.name} onChange={e => setCustomer(i, "name", e.target.value)} />
                  </td>
                  <td className="px-4 py-2">
                    <Input type="number" value={c.volumeMmbtuPerDay} onChange={e => setCustomer(i, "volumeMmbtuPerDay", N(+e.target.value))} className="text-right" />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input type="checkbox" checked={c.enabled} onChange={e => setCustomer(i, "enabled", e.target.checked)} className="w-4 h-4 accent-primary cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Total enabled: {I.customers.filter(c => c.enabled).reduce((s, c) => s + c.volumeMmbtuPerDay, 0).toLocaleString()} MMBTU/day ·
          Capacity: {(I.capacityM3LngPerDay * I.mmbtuPerM3Lng * I.demandUtilizationPct).toFixed(0)} MMBTU/day (after utilization)
        </p>
      </TabsContent>

      {/* ── CAPEX ── */}
      <TabsContent value="capex" className="space-y-4 pt-4">
        <SectionHeader>Capital Expenditure (USD)</SectionHeader>
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Units</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Amount (USD)</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">VAT %</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">VAT (USD)</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Total w/VAT</th>
                <th className="px-3 py-2 w-10"/>
              </tr>
            </thead>
            <tbody>
              {I.capexItems.map((it, i) => {
                const vatRate = it.vatPct ?? 0;
                const vatAmt  = it.amountUsd * vatRate;
                const total   = it.amountUsd + vatAmt;
                return (
                  <tr key={i} className="border-t border-border/40">
                    <td className="px-3 py-2">
                      <Input value={it.label} onChange={e => setCapex(i, "label", e.target.value)} />
                    </td>
                    <td className="px-3 py-2 w-20">
                      <Input type="number" value={it.units ?? 1} onChange={e => setCapex(i, "units", N(+e.target.value, 1))} className="text-right" />
                    </td>
                    <td className="px-3 py-2 w-36">
                      <Input type="number" value={it.amountUsd} onChange={e => setCapex(i, "amountUsd", N(+e.target.value))} className="text-right" />
                    </td>
                    <td className="px-3 py-2 w-20">
                      <Input type="number" value={pct(vatRate)} step="1" onChange={e => setCapex(i, "vatPct", dec(+e.target.value))} className="text-right" />
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">${vatAmt.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs font-semibold">${total.toLocaleString()}</td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => removeCapex(i)} className="text-muted-foreground hover:text-destructive text-lg leading-none">×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button onClick={addCapexRow} className="text-xs text-primary underline">+ Add CAPEX item</button>
        <div className="text-xs text-muted-foreground mt-1">
          Base CAPEX: ${I.capexItems.reduce((s, it) => s + it.amountUsd, 0).toLocaleString()} USD ·
          With {pct(I.contingencyPct)}% contingency: ${(I.capexItems.reduce((s, it) => s + it.amountUsd, 0) * (1 + I.contingencyPct)).toLocaleString()} USD
        </div>

        <SectionHeader>Construction Draw Schedule (% per month)</SectionHeader>
        <p className="text-xs text-muted-foreground mb-2">CAPEX disbursement profile across the {N_months}-month construction period. Values should sum to 100%.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border border-border rounded-lg overflow-hidden">
            <thead className="bg-muted/50">
              <tr>
                {drawSchedule.map((_, i) => (
                  <th key={i} className="px-2 py-1 text-center font-medium text-muted-foreground border-r border-border/40 last:border-0">M{i + 1}</th>
                ))}
                <th className="px-2 py-1 text-center font-medium text-muted-foreground">Sum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {drawSchedule.map((v, i) => (
                  <td key={i} className="border-r border-border/40 last:border-0 p-0">
                    <input
                      type="number"
                      step="0.1"
                      value={pct(v)}
                      onChange={e => {
                        const next = [...drawSchedule];
                        next[i] = dec(parseFloat(e.target.value) || 0);
                        set("capexDrawScheduleMonthly", next);
                      }}
                      className="w-14 text-center bg-transparent font-mono py-1 px-1 focus:outline-none focus:bg-primary/5"
                    />
                  </td>
                ))}
                <td className="px-2 py-1 text-center font-mono font-semibold text-xs">
                  {pct(drawSchedule.reduce((s, v) => s + v, 0))}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>

      {/* ── OPEX ── */}
      <TabsContent value="opex" className="space-y-4 pt-4">
        <SectionHeader>Fixed Operating Costs (USD/year, base year)</SectionHeader>
        <Row>
          <Field label="Salaries & Benefits">
            <Input type="number" value={I.opexSalariesUsd} onChange={e => set("opexSalariesUsd", N(+e.target.value))} />
          </Field>
          <Field label="Accommodation">
            <Input type="number" value={I.opexAccommodationUsd} onChange={e => set("opexAccommodationUsd", N(+e.target.value))} />
          </Field>
          <Field label="Energy & Utilities">
            <Input type="number" value={I.opexEnergyUtilitiesUsd} onChange={e => set("opexEnergyUtilitiesUsd", N(+e.target.value))} />
          </Field>
          <Field label="Land Lease">
            <Input type="number" value={I.opexLandLeaseUsd} onChange={e => set("opexLandLeaseUsd", N(+e.target.value))} />
          </Field>
          <Field label="O&M + Site Insurance">
            <Input type="number" value={I.opexMaintenanceInsuranceUsd} onChange={e => set("opexMaintenanceInsuranceUsd", N(+e.target.value))} />
          </Field>
          <Field label="JV Overheads">
            <Input type="number" value={I.opexJvOverheadsUsd} onChange={e => set("opexJvOverheadsUsd", N(+e.target.value))} />
          </Field>
        </Row>
        <div className="text-xs text-muted-foreground">
          Total base fixed OPEX: ${(I.opexSalariesUsd + I.opexAccommodationUsd + I.opexEnergyUtilitiesUsd + I.opexLandLeaseUsd + I.opexMaintenanceInsuranceUsd + I.opexJvOverheadsUsd).toLocaleString()} USD/year
        </div>
        <p className="text-xs text-muted-foreground">OPEX inflation rates are configured in the <strong>Macro &amp; FX</strong> tab.</p>
      </TabsContent>

      {/* ── Transport ── */}
      <TabsContent value="transport" className="space-y-4 pt-4">
        <SectionHeader>Semi-Trailer Fleet & Transportation</SectionHeader>
        <Row>
          <Field label="Number of Semi-Trailers">
            <Input type="number" value={I.numSemiTrailers} onChange={e => set("numSemiTrailers", N(+e.target.value, 4))} />
          </Field>
          <Field label="Trailer Capacity (m³ LNG each)">
            <Input type="number" value={I.trailerCapacityM3} onChange={e => set("trailerCapacityM3", N(+e.target.value, 40))} />
          </Field>
          <Field label="Round-Trip Distance (km)">
            <Input type="number" value={I.roundTripDistanceKm} onChange={e => set("roundTripDistanceKm", N(+e.target.value, 400))} />
          </Field>
          <Field label="Transport Cost (USD/km)">
            <Input type="number" value={I.transportCostUsdPerKm} onChange={e => set("transportCostUsdPerKm", N(+e.target.value, 2.5))} step="0.1" />
          </Field>
        </Row>
        <div className="text-xs text-muted-foreground">
          Fleet capacity: {(I.numSemiTrailers * I.trailerCapacityM3).toLocaleString()} m³ LNG total
        </div>
        <p className="text-xs text-muted-foreground">Transport inflation rates are configured in the <strong>Macro &amp; FX</strong> tab.</p>
      </TabsContent>

      {/* ── Financial ── */}
      <TabsContent value="financial" className="space-y-4 pt-4">

        <SectionHeader>Senior Debt</SectionHeader>
        <Row>
          <Field label="Debt Ratio (% of CAPEX)">
            <Input type="number" value={pct(I.debtRatioPct)} onChange={e => set("debtRatioPct", dec(+e.target.value))} step="1" />
          </Field>
          <Field label="Senior Interest Rate (% p.a.)">
            <Input type="number" value={pct(I.seniorInterestRatePct)} onChange={e => set("seniorInterestRatePct", dec(+e.target.value))} step="0.1" />
          </Field>
          <Field label="Debt Tenor (years)">
            <Input type="number" value={I.debtTenorYears} onChange={e => set("debtTenorYears", N(+e.target.value, 10))} />
          </Field>
          <Field label="Grace Period (years)">
            <Input type="number" value={I.debtGraceYears} onChange={e => set("debtGraceYears", N(+e.target.value, 1))} />
          </Field>
        </Row>

        <SectionHeader>Shareholder Loan (SHL)</SectionHeader>
        <Row>
          <Field label="SHL as % of Total Debt">
            <Input type="number" value={pct(I.shlPctOfDebt)} onChange={e => set("shlPctOfDebt", dec(+e.target.value))} step="1" />
          </Field>
          <Field label="SHL Interest Rate (% p.a.)">
            <Input type="number" value={pct(I.shlInterestRatePct)} onChange={e => set("shlInterestRatePct", dec(+e.target.value))} step="0.1" />
          </Field>
        </Row>
        <p className="text-xs text-muted-foreground">
          The SHL is interest-only with a bullet repayment at senior debt maturity ({I.debtTenorYears} years — set under Senior Debt above).
        </p>

        <SectionHeader>Refinancing Option</SectionHeader>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            id="refiEnabled"
            checked={I.refiEnabled ?? false}
            onChange={e => set("refiEnabled", e.target.checked)}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          <label htmlFor="refiEnabled" className="text-sm font-medium cursor-pointer">Enable senior debt refinancing</label>
        </div>
        {(I.refiEnabled) && (
          <Row>
            <Field label="Refinancing Year (operating year)">
              <Input type="number" value={I.refiYear ?? 5} onChange={e => set("refiYear", N(+e.target.value, 5))} />
            </Field>
            <Field label="New Interest Rate (% p.a.)">
              <Input type="number" value={pct(I.refiNewRatePct ?? 0.08)} onChange={e => set("refiNewRatePct", dec(+e.target.value))} step="0.1" />
            </Field>
            <Field label="New Tenor (years from refi)">
              <Input type="number" value={I.refiNewTenorYears ?? 5} onChange={e => set("refiNewTenorYears", N(+e.target.value, 5))} />
            </Field>
          </Row>
        )}

        <SectionHeader>Taxes & Returns</SectionHeader>
        <Row>
          <Field label="Corporate Income Tax (%)">
            <Input type="number" value={pct(I.taxRatePct)} onChange={e => set("taxRatePct", dec(+e.target.value))} step="1" />
          </Field>
          <Field label="Withholding Tax on Dividends (%)">
            <Input type="number" value={pct(I.withholdingTaxPct)} onChange={e => set("withholdingTaxPct", dec(+e.target.value))} step="1" />
          </Field>
          <Field label="Project Discount Rate (%)">
            <Input type="number" value={pct(I.discountRateProject)} onChange={e => set("discountRateProject", dec(+e.target.value))} step="0.5" />
          </Field>
          <Field label="Equity Discount Rate (%)">
            <Input type="number" value={pct(I.discountRateEquity)} onChange={e => set("discountRateEquity", dec(+e.target.value))} step="0.5" />
          </Field>
        </Row>

        <SectionHeader>Working Capital</SectionHeader>
        <Row>
          <Field label="Accounts Receivable (months of revenue)">
            <Input type="number" value={I.arMonths} onChange={e => set("arMonths", N(+e.target.value, 1.5))} step="0.5" />
          </Field>
          <Field label="Accounts Payable (months of OPEX)">
            <Input type="number" value={I.apMonths} onChange={e => set("apMonths", N(+e.target.value, 1))} step="0.5" />
          </Field>
        </Row>
      </TabsContent>

      {/* ── Macro & FX ── */}
      <TabsContent value="macro" className="space-y-6 pt-4">
        <SectionHeader>Foreign Exchange</SectionHeader>
        <Row>
          <Field label="USD to EGP Rate">
            <Input type="number" value={I.usdToEgp} onChange={e => set("usdToEgp", N(+e.target.value, 50))} step="1" />
          </Field>
        </Row>
        <p className="text-xs text-muted-foreground">
          Note: This model is denominated in USD. The EGP rate is used for reference display only.
        </p>

        <SectionHeader>Inflation Rate Assumptions (% per year)</SectionHeader>

        <YearArrayEditor
          label="Revenue / Selling Price Inflation (% p.a.)"
          values={I.revenueInflationPerYear ?? Array.from({ length: N_years }, () => 0.03)}
          onChange={v => set("revenueInflationPerYear", v)}
          maxYears={N_years}
          format="pct"
        />

        <YearArrayEditor
          label="Fixed OPEX Inflation (% p.a.)"
          values={I.opexInflationPerYear ?? Array.from({ length: N_years }, () => 0.05)}
          onChange={v => set("opexInflationPerYear", v)}
          maxYears={N_years}
          format="pct"
        />

        <YearArrayEditor
          label="Transport Cost Inflation (% p.a.)"
          values={I.transportInflationPerYear ?? Array.from({ length: N_years }, () => 0.05)}
          onChange={v => set("transportInflationPerYear", v)}
          maxYears={N_years}
          format="pct"
        />

        <YearArrayEditor
          label="Feed Gas Price Inflation (% p.a.)"
          values={I.feedGasInflationPerYear ?? Array.from({ length: N_years }, () => 0.02)}
          onChange={v => set("feedGasInflationPerYear", v)}
          maxYears={N_years}
          format="pct"
        />

        <SectionHeader>FX Rate — Construction Period (USD/TZS or local rate per month)</SectionHeader>
        <p className="text-xs text-muted-foreground mb-2">Optional: enter the expected USD rate for each of the {N_months} construction months (used for local cost conversion reporting).</p>
        <YearArrayEditor
          label="FX rate per construction month"
          values={I.fxRateConstructionPerMonth ?? Array.from({ length: N_months }, () => 0)}
          onChange={v => set("fxRateConstructionPerMonth", v)}
          maxYears={N_months}
          format="number"
          step="1"
        />
      </TabsContent>
    </Tabs>
  );
}
