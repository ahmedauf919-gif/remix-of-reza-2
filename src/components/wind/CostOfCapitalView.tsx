import { useMemo, useState } from "react";
import { ModelOutputs, fmt, fmtPct } from "@/lib/windModel";
import damodaran from "@/lib/damodaranERP.json";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Activity, Gauge, Layers, TrendingUp } from "lucide-react";

type Row = {
  country: string; rating: string;
  adjDefaultSpread: number | null; countryRiskPremium: number | null;
  erp: number | null; corpTax: number | null;
  sovCDS: number | null; cdsErp: number | null;
};

const DATA = damodaran as Row[];

export const CostOfCapitalView = ({ m }: { m: ModelOutputs }) => {
  const [country, setCountry] = useState<string>("Egypt");
  const [riskFree, setRiskFree] = useState<number>(4.5);   // % US 10Y treasury
  const [beta, setBeta] = useState<number>(0.85);          // unlevered renewables ~0.6, levered ~0.85
  const [search, setSearch] = useState<string>("");

  const row = useMemo(() => DATA.find(r => r.country.toLowerCase() === country.toLowerCase()), [country]);
  const erp = row?.erp ?? 0;                          // total equity risk premium for country (%)
  const costOfEquity = riskFree + beta * erp;          // CAPM with country-adjusted ERP

  const gearing = m.effectiveGearing;                  // debt / total uses
  const equityWeight = 1 - gearing;
  const kd = m.blendedRate * 100;                      // %
  const tax = m.inputs.taxRate;                        // 0..1
  const afterTaxKd = kd * (1 - tax);
  const wacc = equityWeight * costOfEquity + gearing * afterTaxKd;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q ? DATA.filter(r => r.country.toLowerCase().includes(q)) : DATA;
    return [...list].sort((a, b) => a.country.localeCompare(b.country));
  }, [search]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Country" value={country} hint={row?.rating ?? "—"} icon={<Layers className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="Equity Risk Premium" value={`${fmt(erp, 2)}%`} hint="Damodaran (latest)" icon={<TrendingUp className="h-5 w-5"/>} accent="accent"/>
        <KpiCard label="Cost of Equity" value={`${fmt(costOfEquity, 2)}%`} hint={`Rf ${fmt(riskFree,2)}% + β${fmt(beta,2)}·ERP`} icon={<TrendingUp className="h-5 w-5"/>} accent="success"/>
        <KpiCard label="After-tax Cost of Debt" value={`${fmt(afterTaxKd, 2)}%`} hint={`${fmt(kd,2)}% × (1−${fmtPct(tax,1)})`} icon={<Activity className="h-5 w-5"/>} accent="primary"/>
        <KpiCard label="WACC / Discount rate" value={`${fmt(wacc, 2)}%`} hint={`E ${fmtPct(equityWeight,1)} · D ${fmtPct(gearing,1)}`} icon={<Gauge className="h-5 w-5"/>} accent="success"/>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <h3 className="font-semibold mb-3">WACC inputs</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <Label className="text-xs">Country</Label>
            <select className="mt-1 w-full rounded-md border border-input bg-background px-2 py-2 text-sm" value={country} onChange={(e) => setCountry(e.target.value)}>
              {[...DATA].sort((a,b)=>a.country.localeCompare(b.country)).map(r => (
                <option key={r.country} value={r.country}>{r.country}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs">Risk-free rate (%)</Label>
            <Input type="number" step={0.1} value={riskFree} onChange={(e) => setRiskFree(parseFloat(e.target.value) || 0)}/>
          </div>
          <div>
            <Label className="text-xs">Equity beta (levered)</Label>
            <Input type="number" step={0.05} value={beta} onChange={(e) => setBeta(parseFloat(e.target.value) || 0)}/>
          </div>
          <div className="text-xs text-muted-foreground self-end">
            Cost of Equity = Rf + β × ERP<br/>
            WACC = E/V × Ke + D/V × Kd × (1 − t)
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="font-semibold">Damodaran — Country Risk & Equity Risk Premiums</h3>
            <p className="text-xs text-muted-foreground">Source: Aswath Damodaran, NYU Stern · Last updated January 2026</p>
          </div>
          <Input placeholder="Search country…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs"/>
        </div>
        <div className="overflow-auto max-h-[600px] rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left px-3 py-2">Country</th>
                <th className="text-left px-3 py-2">Moody's</th>
                <th className="text-right px-3 py-2">Adj. Default Spread</th>
                <th className="text-right px-3 py-2">Country Risk Premium</th>
                <th className="text-right px-3 py-2">Equity Risk Premium</th>
                <th className="text-right px-3 py-2">Corp. Tax</th>
                <th className="text-right px-3 py-2">Sov. CDS</th>
                <th className="text-right px-3 py-2">ERP (CDS-based)</th>
                <th className="text-right px-3 py-2">Use</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.country} className={`border-t border-border/40 ${r.country === country ? "bg-primary/10" : ""}`}>
                  <td className="px-3 py-1.5">{r.country}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">{r.rating}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{r.adjDefaultSpread != null ? `${fmt(r.adjDefaultSpread,2)}%` : "—"}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{r.countryRiskPremium != null ? `${fmt(r.countryRiskPremium,2)}%` : "—"}</td>
                  <td className="px-3 py-1.5 text-right font-mono font-semibold">{r.erp != null ? `${fmt(r.erp,2)}%` : "—"}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{r.corpTax != null ? `${fmt(r.corpTax,2)}%` : "—"}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{r.sovCDS != null ? `${fmt(r.sovCDS,2)}%` : "—"}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{r.cdsErp != null ? `${fmt(r.cdsErp,2)}%` : "—"}</td>
                  <td className="px-3 py-1.5 text-right">
                    <button className="text-xs text-primary hover:underline" onClick={() => setCountry(r.country)}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};