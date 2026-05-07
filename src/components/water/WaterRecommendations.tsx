import { WaterOutputs, fmtPct, fmtNum } from "@/lib/waterModel";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export const WaterRecommendations = ({ m }: { m: WaterOutputs }) => {
  const I = m.inputs;
  const recs: { kind: "ok" | "warn" | "info"; title: string; body: string }[] = [];

  if (m.minDSCR >= 1.3) recs.push({ kind: "ok", title: "Debt service comfortably covered", body: `Min DSCR of ${fmtNum(m.minDSCR, 2)}x sits well above the 1.3x lender benchmark.` });
  else if (m.minDSCR >= 1.1) recs.push({ kind: "warn", title: "Tight DSCR headroom", body: `Min DSCR ${fmtNum(m.minDSCR, 2)}x is close to covenant; consider extending tenor or lowering gearing.` });
  else recs.push({ kind: "warn", title: "DSCR breach risk", body: `Min DSCR ${fmtNum(m.minDSCR, 2)}x — debt sizing or pricing must be revisited.` });

  if (m.equityIRR >= 0.18) recs.push({ kind: "ok", title: "Equity returns attractive", body: `Equity IRR of ${fmtPct(m.equityIRR)} exceeds 18% hurdle.` });
  else if (m.equityIRR >= 0.12) recs.push({ kind: "info", title: "Equity returns acceptable", body: `Equity IRR of ${fmtPct(m.equityIRR)} between 12–18% — verify against sponsor hurdle.` });
  else recs.push({ kind: "warn", title: "Equity returns below benchmark", body: `Equity IRR of ${fmtPct(m.equityIRR)} below 12% — increase tariff or reduce CAPEX.` });

  if (m.tariffAllocFx > 0.2) recs.push({ kind: "warn", title: "High FX exposure in cost stack", body: `${fmtPct(m.tariffAllocFx)} of tariff covers USD-linked variables. Consider USD-pegged tariff or hedging.` });
  if (m.tariffAllocElectricity > 0.4) recs.push({ kind: "info", title: "Electricity is the dominant cost", body: `${fmtPct(m.tariffAllocElectricity)} of tariff goes to electricity — explore PPA or PV hybrid.` });

  if (m.utilisationPct < 0.9) recs.push({ kind: "info", title: "Capacity underutilised", body: `Utilisation ${fmtPct(m.utilisationPct)} vs installed — confirm offtaker minimum take.` });
  if (I.contingencyPct < 0.05) recs.push({ kind: "warn", title: "Low CAPEX contingency", body: `Contingency at ${fmtPct(I.contingencyPct)} — typical SWRO projects use 5–10%.` });

  if (m.lcom3 > I.sellingPriceEgpPerM3 * 0.6) recs.push({ kind: "info", title: "Tight LCOM³ vs tariff", body: `LCOM³ ${fmtNum(m.lcom3, 2)} EGP/m³ vs tariff ${fmtNum(I.sellingPriceEgpPerM3)} EGP/m³ — limited margin cushion.` });

  const Icon = (k: string) => k === "ok" ? <CheckCircle2 className="h-5 w-5 text-green-600"/> : k === "warn" ? <AlertTriangle className="h-5 w-5 text-amber-600"/> : <Info className="h-5 w-5 text-blue-600"/>;

  return (
    <div className="space-y-3">
      {recs.map((r, i) => (
        <div key={i} className="flex gap-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="mt-0.5">{Icon(r.kind)}</div>
          <div>
            <div className="font-semibold">{r.title}</div>
            <div className="text-sm text-muted-foreground">{r.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
