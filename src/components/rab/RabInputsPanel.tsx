import * as React from "react";
import type { Inputs, Ownership, CalendarBasis } from "@/lib/rab/types";
import { Section } from "./RabSection";
import { Field } from "./RabField";

type Patch = (p: Partial<Inputs>) => void;

export function InputsPanel({ inp, patch }: { inp: Inputs; patch: Patch }) {
  const setZakatRate = (cal: CalendarBasis) => patch({ calendar: cal, zakatRate: cal === "hijri" ? 0.025 : 0.02577 });

  return (
    <div className="flex flex-col gap-2">
      <Section title="1. Project Timeline" defaultOpen>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Construction Start" value={inp.constructionStartYear} onChange={(v) => patch({ constructionStartYear: v })} />
          <Field label="Commissioning Year" value={inp.commissioningYear} onChange={(v) => patch({ commissioningYear: v })} />
          <Field label="Concession End" value={inp.concessionEndYear} onChange={(v) => patch({ concessionEndYear: v })} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Duration: <span className="num text-foreground">{inp.concessionEndYear - inp.constructionStartYear + 1}</span> years
        </p>
      </Section>

      <Section title="2. Ownership & Tax Regime" defaultOpen badge={
        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-medium text-gold">
          {inp.ownership === "saudi" ? "Zakat 2.577%" : inp.ownership === "foreign" ? "CIT 20%" : "Mixed"}
        </span>
      }>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {(["saudi", "foreign", "mixed"] as Ownership[]).map((o) => (
              <button
                key={o}
                onClick={() => patch({ ownership: o })}
                className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                  inp.ownership === o ? "border-gold bg-gold/10 text-gold" : "border-border bg-input text-muted-foreground hover:bg-accent"
                }`}
              >
                {o === "saudi" ? "100% Saudi/GCC" : o === "foreign" ? "100% Foreign" : "Mixed"}
              </button>
            ))}
          </div>
          {inp.ownership === "mixed" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Saudi/GCC Share</span>
                <span className="num text-foreground">{(inp.saudiPct * 100).toFixed(0)}% / {((1 - inp.saudiPct) * 100).toFixed(0)}% Foreign</span>
              </div>
              <input
                type="range" min={0} max={100} value={inp.saudiPct * 100}
                onChange={(e) => patch({ saudiPct: Number(e.target.value) / 100 })}
                className="w-full accent-gold"
              />
            </div>
          )}
        </div>
      </Section>

      <Section title="3. Macro & Regulatory">
        <div className="grid grid-cols-2 gap-3">
          <Field label="CPI" type="percent" value={inp.cpi} onChange={(v) => patch({ cpi: v })} suffix="%" />
          <Field label="USD/SAR FX" value={inp.fx} onChange={(v) => patch({ fx: v })} />
          <Field label="Vanilla WACC" type="percent" value={inp.wacc} onChange={(v) => patch({ wacc: v })} suffix="%" />
          <Field label="VAT" type="percent" value={inp.vat} onChange={(v) => patch({ vat: v })} suffix="%" />
          <Field label="OPEX Efficiency (X)" type="percent" value={inp.opexEfficiencyX} onChange={(v) => patch({ opexEfficiencyX: v })} suffix="%" />
          <Field label="Price Control Period" value={inp.priceControlYears} onChange={(v) => patch({ priceControlYears: v })} suffix="yrs" />
          <label className="col-span-2 flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground">Apply Price Control Reset</span>
            <input type="checkbox" checked={inp.applyPriceControl}
              onChange={(e) => patch({ applyPriceControl: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
          </label>
          <label className="col-span-2 flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Fiscal Calendar</span>
            <div className="flex gap-2">
              {(["gregorian", "hijri"] as CalendarBasis[]).map((c) => (
                <button key={c} onClick={() => setZakatRate(c)}
                  className={`flex-1 rounded-md border px-3 py-1.5 text-xs ${inp.calendar === c ? "border-gold bg-gold/10 text-gold" : "border-border bg-input text-muted-foreground"}`}
                >{c === "gregorian" ? "Gregorian (2.577%)" : "Hijri (2.5%)"}</button>
              ))}
            </div>
          </label>
        </div>
      </Section>

      <Section title="4. Customer & Volume Drivers">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Days / Year" value={inp.daysPerYear} onChange={(v) => patch({ daysPerYear: v })} suffix="d" />
          <Field label="MMBtu per MMSCF" value={inp.gasConvMMBtuPerMMSCF} onChange={(v) => patch({ gasConvMMBtuPerMMSCF: v })} suffix="MMBtu" />
          <Field label="Initial Customers" value={inp.initialCustomers} onChange={(v) => patch({ initialCustomers: v })} />
          <Field label="New Customers / Year" value={inp.newCustomersPerYear} onChange={(v) => patch({ newCustomersPerYear: v })} />
          <Field label="Volume Cap (MMSCF/day)" value={inp.volumeCapMMSCFD} onChange={(v) => patch({ volumeCapMMSCFD: v })} step={0.01} suffix="MMSCFD" />
          <Field label="Volume Growth" type="percent" value={inp.volumeGrowth} onChange={(v) => patch({ volumeGrowth: v })} suffix="%" />
          <Field
            label="Vol/Customer (MMSCF/day)"
            value={Number((inp.volumePerCustomerMMBtu / (inp.gasConvMMBtuPerMMSCF * inp.daysPerYear)).toFixed(4))}
            onChange={(v) => patch({ volumePerCustomerMMBtu: v * inp.gasConvMMBtuPerMMSCF * inp.daysPerYear })}
            step={0.001}
          />
          <Field
            label="Vol/New Customer (MMSCF/day)"
            value={Number((inp.volPerNewCustomerMMBtu / (inp.gasConvMMBtuPerMMSCF * inp.daysPerYear)).toFixed(4))}
            onChange={(v) => patch({ volPerNewCustomerMMBtu: v * inp.gasConvMMBtuPerMMSCF * inp.daysPerYear })}
            step={0.001}
          />
        </div>
      </Section>

      <Section title="5. Revenue & Tariff">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tariff Year 1 (SAR/MMBtu)" value={inp.tariffYear1} onChange={(v) => patch({ tariffYear1: v })} step={0.001} />
          <Field label="Gas Commodity (Pass-Through)" value={inp.gasCommodityPrice} onChange={(v) => patch({ gasCommodityPrice: v })} step={0.01} />
          <Field label="Connection Fee (SAR)" value={inp.connectionFee} onChange={(v) => patch({ connectionFee: v })} />
          <label className="col-span-2 flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">Tariff Mode</span>
            <div className="flex gap-2">
              {(["fixed", "rab"] as const).map((m) => (
                <button key={m} onClick={() => patch({ tariffMode: m })}
                  className={`flex-1 rounded-md border px-3 py-1.5 text-xs ${inp.tariffMode === m ? "border-gold bg-gold/10 text-gold" : "border-border bg-input text-muted-foreground"}`}
                >{m === "fixed" ? "Fixed Price (set above)" : "RAB-Derived Each Year"}</button>
              ))}
            </div>
          </label>
          {inp.tariffMode === "fixed" && (
            <label className="col-span-2 flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">Apply Inflation (CPI) to Tariff</span>
              <input type="checkbox" checked={inp.applyTariffInflation}
                onChange={(e) => patch({ applyTariffInflation: e.target.checked })}
                className="h-4 w-4 accent-gold"
              />
            </label>
          )}
        </div>
      </Section>

      <Section title="6. CapEx">
        <div className="space-y-2">
          <label className="flex items-center justify-between gap-2 text-xs pb-1">
            <span className="text-muted-foreground">Escalate Replacement CapEx with CPI</span>
            <input type="checkbox" checked={inp.replacementCapexCPI}
              onChange={(e) => patch({ replacementCapexCPI: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
          </label>
          {inp.capexItems.map((it, i) => (
            <div key={i} className="grid grid-cols-12 items-center gap-2 text-xs">
              <span className="col-span-6 text-muted-foreground truncate">{it.name}</span>
              <input
                type="number" value={it.amount}
                onChange={(e) => {
                  const items = [...inp.capexItems];
                  items[i] = { ...items[i], amount: Number(e.target.value) };
                  patch({ capexItems: items });
                }}
                className="col-span-4 rounded-md border border-border bg-input px-2 py-1 num text-sm"
              />
              <div className="col-span-2 flex items-center gap-1">
                <input
                  type="number" min={1} value={it.life}
                  onChange={(e) => {
                    const items = [...inp.capexItems];
                    items[i] = { ...items[i], life: Math.max(1, Number(e.target.value)) };
                    patch({ capexItems: items });
                  }}
                  className="w-full rounded-md border border-border bg-input px-1 py-1 num text-sm text-right"
                />
                <span className="text-muted-foreground">y</span>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-12 items-center gap-2 text-xs pt-1 border-t border-border/40">
            <span className="col-span-6 text-muted-foreground truncate">Connection CapEx (per New Customer)</span>
            <input
              type="number" value={inp.connectionCapexPerNewCustomer}
              onChange={(e) => patch({ connectionCapexPerNewCustomer: Number(e.target.value) })}
              className="col-span-4 rounded-md border border-border bg-input px-2 py-1 num text-sm"
            />
            <div className="col-span-2 flex items-center gap-1">
              <input
                type="number" min={1} value={inp.connectionCapexLife}
                onChange={(e) => patch({ connectionCapexLife: Math.max(1, Number(e.target.value)) })}
                className="w-full rounded-md border border-border bg-input px-1 py-1 num text-sm text-right"
              />
              <span className="text-muted-foreground">y</span>
            </div>
            <span className="col-span-12 text-[10px] text-muted-foreground text-right">
              = {(inp.newCustomersPerYear * inp.connectionCapexPerNewCustomer).toLocaleString()} /yr
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
            <Field label="Vehicle Count" value={inp.vehicleCount} onChange={(v) => patch({ vehicleCount: v })} />
            <Field label="Vehicle Unit Cost (incl. VAT)" value={inp.vehicleUnitCost} onChange={(v) => patch({ vehicleUnitCost: v })} />
            <Field label="Pre-Op CapEx %" type="percent" value={inp.preOpCapexPct} onChange={(v) => patch({ preOpCapexPct: v })} suffix="%" />
            <Field label="CapEx VAT Rate" type="percent" value={inp.capexVATRate} onChange={(v) => patch({ capexVATRate: v })} suffix="%" />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
            All CapEx amounts above are entered <span className="text-foreground">VAT-inclusive (gross)</span>.
            The engine automatically strips the {(inp.capexVATRate*100).toFixed(0)}% VAT and uses the
            <span className="text-foreground"> ex-VAT base for RAB, depreciation, debt sizing and P&amp;L</span>.
            The VAT portion is a cash-only initial outlay reimbursed via output VAT on gas sales
            (Saudi VAT Law). It NEVER enters RAB or the income statement.
          </p>
        </div>
      </Section>

      <Section title="7. Working Capital">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Days Receivable" value={inp.daysReceivable} onChange={(v) => patch({ daysReceivable: v })} suffix="d" />
          <Field label="Days Inventory" value={inp.daysInventory} onChange={(v) => patch({ daysInventory: v })} suffix="d" />
          <Field label="Days Payable" value={inp.daysPayable} onChange={(v) => patch({ daysPayable: v })} suffix="d" />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          AR = Revenue × (DaysAR/365); Inventory = COGS × (DaysInv/365); AP = (COGS+G&amp;A) × (DaysAP/365).
          ΔWC reduces operating cash flow (indirect method).
        </p>
      </Section>

      <Section title="8. OPEX">
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wide text-gold">Controllable (CPI–X)</div>
            {inp.opexControllable.map((it, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2 text-xs py-0.5">
                <span className="col-span-7 text-muted-foreground truncate">{it.name}</span>
                <input type="number" value={it.amount}
                  onChange={(e) => {
                    const arr = [...inp.opexControllable];
                    arr[i] = { ...arr[i], amount: Number(e.target.value) };
                    patch({ opexControllable: arr });
                  }}
                  className="col-span-5 rounded-md border border-border bg-input px-2 py-1 num"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wide text-gold">Pass-Through (CPI only)</div>
            {inp.opexPassThrough.map((it, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2 text-xs py-0.5">
                <span className="col-span-7 text-muted-foreground truncate">{it.name}</span>
                <input type="number" value={it.amount}
                  onChange={(e) => {
                    const arr = [...inp.opexPassThrough];
                    arr[i] = { ...arr[i], amount: Number(e.target.value) };
                    patch({ opexPassThrough: arr });
                  }}
                  className="col-span-5 rounded-md border border-border bg-input px-2 py-1 num"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wide text-gold">Variable (SAR / MMBtu × Volume, CPI-escalated)</div>
            {inp.opexVariable.map((it, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2 text-xs py-0.5">
                <span className="col-span-7 text-muted-foreground truncate">{it.name}</span>
                <input type="number" step="0.001" value={it.ratePerMMBtu}
                  onChange={(e) => {
                    const arr = [...inp.opexVariable];
                    arr[i] = { ...arr[i], ratePerMMBtu: Number(e.target.value) };
                    patch({ opexVariable: arr });
                  }}
                  className="col-span-5 rounded-md border border-border bg-input px-2 py-1 num"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wide text-gold">PRMS Periodic Maintenance (CPI-escalated)</div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Main PRMS Cost (SAR/month)" value={inp.prmsMainCostPerMMBtu} onChange={(v) => patch({ prmsMainCostPerMMBtu: v })} />
              <Field label="Main PRMS Interval (yrs)" value={inp.prmsMainIntervalYears} onChange={(v) => patch({ prmsMainIntervalYears: v })} />
              <Field label="Client PRMS Cost (SAR/month)" value={inp.prmsClientCostPerMMBtu} onChange={(v) => patch({ prmsClientCostPerMMBtu: v })} />
              <Field label="Client PRMS Interval (yrs)" value={inp.prmsClientIntervalYears} onChange={(v) => patch({ prmsClientIntervalYears: v })} />
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">
              Annual charge = monthly cost × 12, fires every N years post-commissioning, escalated by CPI.
            </div>
          </div>
        </div>
      </Section>

      <Section title="9. Financing">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Debt Ratio" type="percent" value={inp.debtRatio} onChange={(v) => patch({ debtRatio: v })} suffix="%" />
          <Field label="Debt Rate" type="percent" value={inp.debtRate} onChange={(v) => patch({ debtRate: v })} suffix="%" />
          <Field label="Debt Tenor (yrs)" value={inp.debtTenor} onChange={(v) => patch({ debtTenor: v })} />
          <Field label="Grace Period (yrs)" value={inp.debtGracePeriod} onChange={(v) => patch({ debtGracePeriod: v })} />
          <Field label="Loan Fees" type="percent" value={inp.loanFeesPct} onChange={(v) => patch({ loanFeesPct: v })} suffix="%" />
          <Field label="Dividend Payout Ratio" type="percent" value={inp.dividendPayoutRatio} onChange={(v) => patch({ dividendPayoutRatio: v })} suffix="%" />
          <Field label="Withholding Tax" type="percent" value={inp.withholdingTaxRate} onChange={(v) => patch({ withholdingTaxRate: v })} suffix="%" />
          <Field label="Overdraft Rate" type="percent" value={inp.overdraftRate} onChange={(v) => patch({ overdraftRate: v })} suffix="%" />
          <Field label="Overdraft Limit (SAR)" value={inp.overdraftLimit} onChange={(v) => patch({ overdraftLimit: v })} className="col-span-2" />
        </div>
      </Section>

      {(inp.ownership === "foreign" || inp.ownership === "mixed") && (
        <Section title="10. Income Tax & Loss Carry-Forward" defaultOpen>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CIT Rate" type="percent" value={inp.citRate} onChange={(v) => patch({ citRate: v })} suffix="%" />
            <Field label="Loss Offset Cap" type="percent" value={inp.lossOffsetCap} onChange={(v) => patch({ lossOffsetCap: v })} suffix="%" />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Per Saudi Income Tax Law Art. 21: losses carry forward indefinitely; max offset 25% of annual taxable profit; no carry-back.
          </p>
        </Section>
      )}

    </div>
  );
}
