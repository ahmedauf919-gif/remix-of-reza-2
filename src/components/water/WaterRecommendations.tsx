import { WaterOutputs, fmtNum, fmtPct, fmtEgp } from "@/lib/waterModel";
import { CheckCircle2, AlertTriangle, Info, ThumbsUp, ThumbsDown, Minus, Shield, TrendingUp } from "lucide-react";

type ScoreItem = {
  metric: string; value: string; benchmark: string;
  verdict: "strong" | "ok" | "weak"; weight: number; rationale: string;
};

function buildScore(m: WaterOutputs) {
  const I = m.inputs;
  const items: ScoreItem[] = [];

  const eqIRR = isFinite(m.equityIRR) ? m.equityIRR : -1;
  items.push({
    metric: "Equity IRR vs hurdle",
    value: `${fmtPct(eqIRR)} vs ${fmtPct(I.discountRateEquity)}`,
    benchmark: "≥ +300bps strong, 0–300bps ok, <0 weak",
    verdict: eqIRR - I.discountRateEquity >= 0.03 ? "strong" : eqIRR >= I.discountRateEquity ? "ok" : "weak",
    weight: 0.25,
    rationale: "Primary shareholder hurdle — does the project clear the cost of equity?",
  });

  items.push({
    metric: "Equity IRR (absolute)",
    value: fmtPct(eqIRR),
    benchmark: "≥ 18% strong, 12–18% ok, <12% weak",
    verdict: eqIRR >= 0.18 ? "strong" : eqIRR >= 0.12 ? "ok" : "weak",
    weight: 0.15,
    rationale: "Sponsor absolute return target for SWRO/water PF.",
  });

  const payback = m.equityPaybackYears;
  const ok = isFinite(payback) && payback > 0;
  items.push({
    metric: "Equity payback",
    value: ok ? `${fmtNum(payback, 1)} yrs` : "n/a",
    benchmark: "≤ 7y strong, 7–10y ok, >10y weak",
    verdict: !ok ? "weak" : payback <= 7 ? "strong" : payback <= 10 ? "ok" : "weak",
    weight: 0.1, rationale: "Time to recover equity cheque.",
  });

  const cushion = m.minDSCR - 1.3;
  items.push({
    metric: "Min DSCR cushion",
    value: `${fmtNum(m.minDSCR, 2)}x (target 1.30x)`,
    benchmark: "≥ +0.10x strong, 0–0.10x ok, <0 weak",
    verdict: cushion >= 0.1 ? "strong" : cushion >= 0 ? "ok" : "weak",
    weight: 0.15, rationale: "Headroom over covenant protects equity distributions.",
  });

  const projSpread = m.projectIRR - I.discountRateProject;
  items.push({
    metric: "Project IRR vs WACC",
    value: `${fmtPct(m.projectIRR)} vs ${fmtPct(I.discountRateProject)}`,
    benchmark: "≥ +200bps strong, 0–200bps ok, <0 weak",
    verdict: projSpread >= 0.02 ? "strong" : projSpread >= 0 ? "ok" : "weak",
    weight: 0.1, rationale: "Unlevered economics — does the asset itself create value?",
  });

  const lcomCov = I.sellingPriceEgpPerM3 > 0 ? m.lcom3 / I.sellingPriceEgpPerM3 : 1;
  items.push({
    metric: "LCOM³ / Tariff",
    value: fmtPct(lcomCov),
    benchmark: "≤ 70% strong, 70–90% ok, >90% weak",
    verdict: lcomCov <= 0.7 ? "strong" : lcomCov <= 0.9 ? "ok" : "weak",
    weight: 0.1, rationale: "Margin cushion of tariff over levelized cost.",
  });

  items.push({
    metric: "Gearing",
    value: fmtPct(I.debtToEquity),
    benchmark: "70–80% optimal, 60–85% ok",
    verdict: I.debtToEquity >= 0.7 && I.debtToEquity <= 0.8 ? "strong" : I.debtToEquity >= 0.6 && I.debtToEquity <= 0.85 ? "ok" : "weak",
    weight: 0.05, rationale: "Right-sized leverage maximises equity return.",
  });

  items.push({
    metric: "Capacity utilisation",
    value: fmtPct(m.utilisationPct),
    benchmark: "≥ 90% strong, 80–90% ok, <80% weak",
    verdict: m.utilisationPct >= 0.9 ? "strong" : m.utilisationPct >= 0.8 ? "ok" : "weak",
    weight: 0.05, rationale: "Higher take ratio → more revenue per unit of capex.",
  });

  items.push({
    metric: "FX exposure in tariff",
    value: fmtPct(m.tariffAllocFx),
    benchmark: "≤ 20% strong, 20–35% ok, >35% weak",
    verdict: m.tariffAllocFx <= 0.2 ? "strong" : m.tariffAllocFx <= 0.35 ? "ok" : "weak",
    weight: 0.05, rationale: "Lower FX-linked share reduces devaluation risk.",
  });

  const map = { strong: 1, ok: 0.6, weak: 0.15 } as const;
  const num = items.reduce((s, it) => s + it.weight * map[it.verdict], 0);
  const den = items.reduce((s, it) => s + it.weight, 0);
  const score = Math.round((num / den) * 100);

  let verdict: "Invest" | "Conditional" | "Pass", headline: string;
  if (score >= 75) { verdict = "Invest"; headline = "Strong shareholder case — metrics clear hurdles with cushion. Proceed to documentation."; }
  else if (score >= 55) { verdict = "Conditional"; headline = "Workable but not compelling — close the gaps below before committing equity."; }
  else { verdict = "Pass"; headline = "Project does not meet shareholder thresholds at base case. Restructure or walk away."; }
  return { items, score, verdict, headline };
}

const ScoreBadge = ({ v }: { v: ScoreItem["verdict"] }) => {
  const cls = v === "strong" ? "bg-success/15 text-success border-success/30"
    : v === "ok" ? "bg-primary/10 text-primary border-primary/30"
    : "bg-destructive/10 text-destructive border-destructive/30";
  const label = v === "strong" ? "Strong" : v === "ok" ? "Acceptable" : "Weak";
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
};

export const WaterRecommendations = ({ m }: { m: WaterOutputs }) => {
  const I = m.inputs;
  const { items, score, verdict, headline } = buildScore(m);
  const ringColor = verdict === "Invest" ? "text-success" : verdict === "Conditional" ? "text-primary" : "text-destructive";
  const Icon = verdict === "Invest" ? ThumbsUp : verdict === "Conditional" ? Minus : ThumbsDown;

  const recs: { kind: "ok" | "warn" | "info"; title: string; body: string }[] = [];
  if (m.minDSCR >= 1.3) recs.push({ kind: "ok", title: "Debt service comfortably covered", body: `Min DSCR of ${fmtNum(m.minDSCR, 2)}x sits above the 1.3x lender benchmark.` });
  else if (m.minDSCR >= 1.1) recs.push({ kind: "warn", title: "Tight DSCR headroom", body: `Min DSCR ${fmtNum(m.minDSCR, 2)}x — consider extending tenor or lowering gearing.` });
  else recs.push({ kind: "warn", title: "DSCR breach risk", body: `Min DSCR ${fmtNum(m.minDSCR, 2)}x — debt sizing or pricing must be revisited.` });
  if (m.tariffAllocFx > 0.2) recs.push({ kind: "warn", title: "High FX exposure in cost stack", body: `${fmtPct(m.tariffAllocFx)} of tariff covers USD-linked variables. Consider USD-pegged tariff.` });
  if (m.tariffAllocElectricity > 0.4) recs.push({ kind: "info", title: "Electricity dominates costs", body: `${fmtPct(m.tariffAllocElectricity)} of tariff is electricity — explore PV hybrid.` });
  if (I.contingencyPct < 0.05) recs.push({ kind: "warn", title: "Low CAPEX contingency", body: `Contingency at ${fmtPct(I.contingencyPct)} — typical SWRO 5–10%.` });

  const Item = ({ r }: { r: typeof recs[number] }) => {
    const icon = r.kind === "ok" ? <CheckCircle2 className="h-5 w-5"/> : r.kind === "warn" ? <AlertTriangle className="h-5 w-5"/> : <Info className="h-5 w-5"/>;
    const color = r.kind === "ok" ? "text-success border-success/30 bg-success/5" : r.kind === "warn" ? "text-destructive border-destructive/30 bg-destructive/5" : "text-primary border-primary/30 bg-primary/5";
    return (
      <div className={`rounded-xl border p-4 ${color}`}>
        <div className="flex items-start gap-3"><div className="mt-0.5 shrink-0">{icon}</div>
          <div className="space-y-1"><div className="font-semibold text-foreground">{r.title}</div><p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* IC Memo Header */}
      <div className="rounded-xl border-2 border-[#002060] bg-white p-6 shadow-md">
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-border pb-4 mb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#005298] mb-1">Investment Committee Memorandum</div>
            <h1 className="text-2xl font-bold text-[#002060]">{I.projectName}</h1>
            <p className="text-sm text-muted-foreground mt-1">{I.scenario} · SWRO Desalination · {I.startYear}–{I.startYear + I.contractYears - 1}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="rounded-lg bg-[#002060] text-white px-4 py-2 text-center min-w-[90px]">
              <div className="text-xs opacity-70">Total CAPEX</div>
              <div className="font-bold font-mono text-sm">{fmtEgp(m.totalCapexWithIdc)}</div>
            </div>
            <div className="rounded-lg bg-[#005298] text-white px-4 py-2 text-center min-w-[90px]">
              <div className="text-xs opacity-70">Equity IRR</div>
              <div className="font-bold font-mono text-sm">{fmtPct(m.equityIRR)}</div>
            </div>
            <div className="rounded-lg bg-[#FFC10E] text-[#002060] px-4 py-2 text-center min-w-[90px]">
              <div className="text-xs font-semibold opacity-80">Project IRR</div>
              <div className="font-bold font-mono text-sm">{fmtPct(m.projectIRR)}</div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#002060] mb-2">Executive Summary</h2>
          <p className="text-sm leading-relaxed text-foreground">
            {I.projectName} is a {I.contractYears}-year SWRO desalination project with a nameplate capacity of {fmtNum(I.capacityM3Day, 0)} m³/day ({fmtNum(I.capacityM3Day * 365 / 1e6, 2)}M m³/year).
            Operating at a minimum take-or-pay of {fmtPct(I.minTakePct)}, the plant delivers water at a PPA tariff of EGP {fmtNum(I.sellingPriceEgpPerM3, 2)}/m³
            {I.pctPeggedToUsd > 0 ? ` (${fmtPct(I.pctPeggedToUsd)} USD-indexed)` : " (fully EGP-denominated)"}.
            Total project cost of {fmtEgp(m.totalCapexWithIdc)} is financed at {fmtPct(I.debtToEquity)} gearing over a {I.loanTenorYears}-year senior debt facility.
            The project targets an equity IRR of {fmtPct(m.equityIRR)} against a cost of equity of {fmtPct(I.discountRateEquity)},
            delivering a {fmtPct(m.equityIRR - I.discountRateEquity)} spread with a levelised cost of water (LCOM³) of {fmtNum(m.lcom3, 3)} EGP/m³
            and an equity payback of {Number.isFinite(m.equityPaybackYears) ? `${fmtNum(m.equityPaybackYears, 1)} years` : "N/A"}.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "NPV (Project)", value: fmtEgp(m.npvProject), sub: `@ ${fmtPct(I.discountRateProject)} discount` },
            { label: "NPV (Equity)", value: fmtEgp(m.npvEquity), sub: `@ ${fmtPct(I.discountRateEquity)} discount` },
            { label: "Min DSCR", value: `${fmtNum(m.minDSCR, 2)}x`, sub: `Avg ${fmtNum(m.avgDSCR, 2)}x · Covenant 1.30x` },
            { label: "LCOM³", value: `${fmtNum(m.lcom3, 3)} EGP/m³`, sub: "Levelised cost of water delivery" },
            { label: "Capacity", value: `${fmtNum(I.capacityM3Day, 0)} m³/day`, sub: `${fmtPct(I.minTakePct)} min take-or-pay` },
            { label: "PPA Tariff", value: `${fmtNum(I.sellingPriceEgpPerM3, 2)} EGP/m³`, sub: I.pctPeggedToUsd > 0 ? `${fmtPct(I.pctPeggedToUsd)} USD-pegged` : "Fully EGP" },
            { label: "Debt Amount", value: fmtEgp(m.debtAmount), sub: `${I.loanTenorYears}y tenor · ${I.debtGraceYears}y grace` },
            { label: "Equity Cheque", value: fmtEgp(m.equityAmount), sub: `${fmtPct(1 - I.debtToEquity)} of total CAPEX` },
          ].map((item, i) => (
            <div key={i} className="rounded-lg bg-[#f0f4f8] p-3">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="font-bold font-mono text-sm mt-0.5">{item.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* CAPEX Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#002060] mb-2">CAPEX Structure</h3>
            <table className="w-full text-xs">
              <tbody>
                {m.capexResolved.map((item, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="py-1">{item.label}</td>
                    <td className="py-1 text-right font-mono">{fmtEgp(item.amountEgp)}</td>
                    <td className="py-1 text-right text-muted-foreground">{fmtPct(item.amountEgp / m.totalRoCapex, 1)}</td>
                  </tr>
                ))}
                {m.idc > 0 && (
                  <tr className="border-b border-border/30">
                    <td className="py-1 text-muted-foreground italic">Interest During Construction</td>
                    <td className="py-1 text-right font-mono">{fmtEgp(m.idc)}</td>
                    <td className="py-1 text-right text-muted-foreground">—</td>
                  </tr>
                )}
                <tr className="font-semibold">
                  <td className="py-1.5">Total CAPEX (incl. IDC)</td>
                  <td className="py-1.5 text-right font-mono">{fmtEgp(m.totalCapexWithIdc)}</td>
                  <td className="py-1.5 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#002060] mb-2">Funding Structure</h3>
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="py-1">Senior Debt</td>
                  <td className="py-1 text-right font-mono">{fmtEgp(m.debtAmount)}</td>
                  <td className="py-1 text-right text-muted-foreground">{fmtPct(m.debtAmount / m.totalCapexWithIdc, 1)}</td>
                </tr>
                {I.shareholderLoanPct > 0 && (
                  <tr className="border-b border-border/30">
                    <td className="py-1">Shareholder Loan</td>
                    <td className="py-1 text-right font-mono">{fmtEgp(m.totalCapexWithIdc * (1 - I.debtToEquity) * I.shareholderLoanPct)}</td>
                    <td className="py-1 text-right text-muted-foreground">{fmtPct((1 - I.debtToEquity) * I.shareholderLoanPct, 1)}</td>
                  </tr>
                )}
                <tr className="border-b border-border/30">
                  <td className="py-1">Sponsor Equity</td>
                  <td className="py-1 text-right font-mono">{fmtEgp(m.equityAmount)}</td>
                  <td className="py-1 text-right text-muted-foreground">{fmtPct(m.equityAmount / m.totalCapexWithIdc, 1)}</td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-1.5">Total</td>
                  <td className="py-1.5 text-right font-mono">{fmtEgp(m.totalCapexWithIdc)}</td>
                  <td className="py-1.5 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Risks */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#002060] mb-2">Key Risk Factors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {[
              { risk: "Water demand / offtake risk", mitigation: `${fmtPct(I.minTakePct)} minimum take-or-pay contract provides revenue floor` },
              { risk: "RO membrane replacement", mitigation: "Periodic replacement (every 5–7y) must be reserved; MMRA provision recommended" },
              { risk: "Electricity price inflation", mitigation: `${fmtNum(I.electricityKwhPerM3, 2)} kWh/m³ at EGP ${fmtNum(I.electricityPriceEgpKwh, 2)}/kWh; pass-through clauses advisable` },
              { risk: "EGP/USD depreciation", mitigation: I.pctPeggedToUsd > 0 ? `${fmtPct(I.pctPeggedToUsd)} of tariff USD-indexed; chemical/membrane cost partially hedged` : "No USD peg — full EGP depreciation risk on USD-denominated OPEX" },
              { risk: "Regulatory / tariff risk", mitigation: "PPA tariff must be enshrined in off-take agreement with government counterparty" },
              { risk: "Construction timeline", mitigation: `${I.constructionMonths}-month build programme with ${fmtPct(I.contingencyPct)} CAPEX contingency` },
            ].map((r, i) => (
              <div key={i} className="rounded bg-[#f0f4f8] p-2">
                <div className="font-semibold text-[#002060]">{r.risk}</div>
                <div className="text-muted-foreground mt-0.5">{r.mitigation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)] space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl bg-secondary p-2.5 ${ringColor}`}><Icon className="h-6 w-6"/></div>
            <div>
              <h2 className="text-lg font-semibold">Shareholder verdict</h2>
              <p className="text-sm text-muted-foreground max-w-2xl">{headline}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Score</div>
              <div className={`text-3xl font-bold font-mono ${ringColor}`}>{score}<span className="text-base text-muted-foreground">/100</span></div>
            </div>
            <div className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
              verdict === "Invest" ? "border-success/40 bg-success/10 text-success"
              : verdict === "Conditional" ? "border-primary/40 bg-primary/10 text-primary"
              : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}>{verdict}</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b border-border">
              <tr className="text-left">
                <th className="py-2 pr-3 font-medium">Metric</th>
                <th className="py-2 pr-3 font-medium">Value</th>
                <th className="py-2 pr-3 font-medium">Benchmark</th>
                <th className="py-2 pr-3 font-medium">Verdict</th>
                <th className="py-2 font-medium">Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-3 font-medium">{it.metric}</td>
                  <td className="py-2 pr-3 font-mono">{it.value}</td>
                  <td className="py-2 pr-3 text-muted-foreground text-xs">{it.benchmark}</td>
                  <td className="py-2 pr-3"><ScoreBadge v={it.verdict}/></td>
                  <td className="py-2 text-muted-foreground text-xs">{it.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">Score is a weighted blend of return, safety and capital-efficiency metrics.</p>
      </div>

      <div className="rounded-xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary"/>
          <div><h2 className="text-lg font-semibold">Model recommendations</h2><p className="text-sm text-muted-foreground">Best-practice diagnostics from your current assumptions.</p></div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground flex gap-1 items-center"><TrendingUp className="h-3 w-3"/>Equity IRR</div><div className="font-mono font-semibold text-base">{fmtPct(m.equityIRR)}</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">Project IRR</div><div className="font-mono font-semibold text-base">{fmtPct(m.projectIRR)}</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">Min DSCR</div><div className="font-mono font-semibold text-base">{fmtNum(m.minDSCR, 2)}x</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">LCOM³</div><div className="font-mono font-semibold text-base">{fmtNum(m.lcom3, 2)} EGP/m³</div></div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {recs.map((r, i) => <Item key={i} r={r}/>)}
        </div>
      </div>
    </div>
  );
};
