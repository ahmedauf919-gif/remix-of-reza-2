import { ModelOutputs, fmt, fmtPct } from "@/lib/windModel";
import { CheckCircle2, AlertTriangle, Info, TrendingUp, Shield, Zap, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

type Rec = { level: "good" | "warn" | "info"; title: string; body: string };

type ScoreItem = {
  metric: string;
  value: string;
  benchmark: string;
  verdict: "strong" | "ok" | "weak";
  weight: number; // 0-1
  rationale: string;
};

function buildShareholderScore(m: ModelOutputs): { items: ScoreItem[]; score: number; verdict: "Invest" | "Conditional" | "Pass"; headline: string } {
  const I = m.inputs;
  const items: ScoreItem[] = [];

  // 1) Equity IRR vs Cost of Equity (spread)
  const irr = Number.isFinite(m.commonEquityIRR) ? m.commonEquityIRR : -1;
  const spread = irr - m.costOfEquity;
  items.push({
    metric: "Equity IRR vs Cost of Equity",
    value: `${fmtPct(irr)} vs ${fmtPct(m.costOfEquity)} (spread ${fmtPct(spread)})`,
    benchmark: "≥ +300 bps strong, 0–300 bps ok, <0 weak",
    verdict: spread >= 0.03 ? "strong" : spread >= 0 ? "ok" : "weak",
    weight: 0.25,
    rationale: "Primary shareholder hurdle — does the project clear the risk-adjusted equity cost?",
  });

  // 2) Absolute Equity IRR
  items.push({
    metric: "Equity IRR (absolute)",
    value: fmtPct(irr),
    benchmark: "≥ 12% strong, 8–12% ok, <8% weak (USD renewables)",
    verdict: irr >= 0.12 ? "strong" : irr >= 0.08 ? "ok" : "weak",
    weight: 0.15,
    rationale: "Sponsor-level absolute return target for merchant/contracted wind.",
  });

  // 3) Equity payback
  const payback = m.paybackYears;
  const paybackOk = Number.isFinite(payback) && payback > 0;
  items.push({
    metric: "Equity payback",
    value: paybackOk ? `${fmt(payback, 1)} yrs` : "n/a",
    benchmark: "≤ 7y strong, 7–10y ok, >10y weak",
    verdict: !paybackOk ? "weak" : payback <= 7 ? "strong" : payback <= 10 ? "ok" : "weak",
    weight: 0.1,
    rationale: "Time to recover equity cheque — shorter is better for sponsor liquidity.",
  });

  // 4) Min DSCR vs target (debt safety = equity safety)
  const dscrCushion = m.minDSCR - I.targetDSCR;
  items.push({
    metric: "Min DSCR cushion",
    value: `${fmt(m.minDSCR)}x (target ${fmt(I.targetDSCR)}x)`,
    benchmark: "≥ +0.10x strong, 0 to +0.10x ok, <0 weak",
    verdict: dscrCushion >= 0.1 ? "strong" : dscrCushion >= 0 ? "ok" : "weak",
    weight: 0.1,
    rationale: "Headroom over covenant protects equity distributions in stress.",
  });

  // 5) LCOE vs PPA
  const ppa = I.tariffUsdPerKWh;
  const coverage = ppa > 0 ? m.lcoeUsdPerKWh / ppa : 1;
  items.push({
    metric: "LCOE / PPA price",
    value: fmtPct(coverage),
    benchmark: "≤ 75% strong, 75–90% ok, >90% weak",
    verdict: coverage <= 0.75 ? "strong" : coverage <= 0.9 ? "ok" : "weak",
    weight: 0.1,
    rationale: "Margin cushion against generation/price under-performance.",
  });

  // 6) Project IRR vs WACC
  const projSpread = m.projectIRR - m.wacc;
  items.push({
    metric: "Project IRR vs WACC",
    value: `${fmtPct(m.projectIRR)} vs ${fmtPct(m.wacc)}`,
    benchmark: "≥ +200 bps strong, 0–200 bps ok, <0 weak",
    verdict: projSpread >= 0.02 ? "strong" : projSpread >= 0 ? "ok" : "weak",
    weight: 0.1,
    rationale: "Unlevered economics — does the asset itself create value?",
  });

  // 7) Equity multiple (MOIC) — derived from equityIRRSeries
  const inflows = m.equityIRRSeries.reduce((s, r) => s + Math.max(0, r.net), 0);
  const outflows = m.equityIRRSeries.reduce((s, r) => s + Math.max(0, -r.net), 0);
  const moic = outflows > 0 ? inflows / outflows : NaN;
  const moicOk = Number.isFinite(moic) && moic > 0;
  items.push({
    metric: "Equity multiple (MOIC)",
    value: moicOk ? `${fmt(moic, 2)}x` : "n/a",
    benchmark: "≥ 2.5x strong, 1.7–2.5x ok, <1.7x weak",
    verdict: !moicOk ? "weak" : moic >= 2.5 ? "strong" : moic >= 1.7 ? "ok" : "weak",
    weight: 0.1,
    rationale: "Total cash-on-cash return to common equity over the life of the project.",
  });

  // 8) Gearing (capital efficiency)
  const g = m.effectiveGearing;
  items.push({
    metric: "Effective gearing",
    value: fmtPct(g),
    benchmark: "70–80% optimal, 60–70% or 80–85% ok, <60% or >85% weak",
    verdict: g >= 0.7 && g <= 0.8 ? "strong" : g >= 0.6 && g <= 0.85 ? "ok" : "weak",
    weight: 0.05,
    rationale: "Right-sized leverage maximises equity return without breaching lender appetite.",
  });

  // 9) Tenor vs PPA tail
  const tail = I.tariffFixedYears - I.debtTenorYears;
  items.push({
    metric: "PPA tail vs debt",
    value: `${fmt(tail, 1)} yrs`,
    benchmark: "≥ 2y strong, 0–2y ok, <0 weak",
    verdict: tail >= 2 ? "strong" : tail >= 0 ? "ok" : "weak",
    weight: 0.05,
    rationale: "Tail protects shareholders from merchant exposure during debt life.",
  });

  // Score 0-100
  const map = { strong: 1, ok: 0.6, weak: 0.15 } as const;
  const num = items.reduce((s, it) => s + it.weight * map[it.verdict], 0);
  const den = items.reduce((s, it) => s + it.weight, 0);
  const score = Math.round((num / den) * 100);

  let verdict: "Invest" | "Conditional" | "Pass";
  let headline: string;
  if (score >= 75) {
    verdict = "Invest";
    headline = "Strong shareholder case — metrics clear hurdles with cushion. Proceed to documentation.";
  } else if (score >= 55) {
    verdict = "Conditional";
    headline = "Workable but not compelling — close the gaps below before committing equity.";
  } else {
    verdict = "Pass";
    headline = "Project does not meet shareholder thresholds at base case. Restructure or walk away.";
  }
  return { items, score, verdict, headline };
}

const ScoreBadge = ({ v }: { v: ScoreItem["verdict"] }) => {
  const cls = v === "strong" ? "bg-success/15 text-success border-success/30"
    : v === "ok" ? "bg-primary/10 text-primary border-primary/30"
    : "bg-destructive/10 text-destructive border-destructive/30";
  const label = v === "strong" ? "Strong" : v === "ok" ? "Acceptable" : "Weak";
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
};

const ShareholderVerdict = ({ m }: { m: ModelOutputs }) => {
  const { items, score, verdict, headline } = buildShareholderScore(m);
  const ringColor = verdict === "Invest" ? "text-success" : verdict === "Conditional" ? "text-primary" : "text-destructive";
  const Icon = verdict === "Invest" ? ThumbsUp : verdict === "Conditional" ? Minus : ThumbsDown;
  return (
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
      <p className="text-xs text-muted-foreground">Score is a weighted blend of return, safety and capital-efficiency metrics. It is a base-case indicator — always confirm with lender stress cases (P90, capex +10%, opex +10%, rates +200 bps).</p>
    </div>
  );
};

function buildRecs(m: ModelOutputs): Rec[] {
  const I = m.inputs;
  const out: Rec[] = [];

  // DSCR
  if (m.minDSCR < I.targetDSCR - 0.01) {
    out.push({ level: "warn", title: `Min DSCR ${fmt(m.minDSCR)}x is below target ${fmt(I.targetDSCR)}x`,
      body: "Reduce gearing, extend tenor, or revisit tariff/yield assumptions. With sculpted sizing the solver should already meet the target — investigate the breach year before relying on the result." });
  } else {
    out.push({ level: "good", title: `DSCR cushion: min ${fmt(m.minDSCR)}x / avg ${fmt(m.avgDSCR)}x`,
      body: "Coverage profile satisfies covenants. Best practice is to keep min DSCR ≥ target + 0.05x to absorb realistic stress (yield -5%, opex +10%)." });
  }

  // Gearing
  if (m.effectiveGearing > 0.85) {
    out.push({ level: "warn", title: `High effective gearing ${fmtPct(m.effectiveGearing)}`,
      body: "Lender appetite for renewables is typically 70–80% gearing. Above 85% expect higher margins, tighter covenants and a larger DSRA (12-month look-forward minimum)." });
  } else if (m.effectiveGearing < 0.6) {
    out.push({ level: "info", title: `Conservative gearing ${fmtPct(m.effectiveGearing)}`,
      body: "There may be room to lever up to lift equity IRR. Run a sensitivity at 75% gearing if your lenders allow it." });
  }

  // LCOE / IRR sanity
  if (m.lcoeUsdPerKWh > I.tariffUsdPerKWh) {
    out.push({ level: "warn", title: `LCOE ${fmt(m.lcoeUsdPerKWh*100,2)}¢/kWh exceeds PPA tariff ${fmt(I.tariffUsdPerKWh*100,2)}¢/kWh`,
      body: "The project is value-destructive at this tariff. Renegotiate price, push capex down, or improve yield/availability before signing." });
  } else {
    out.push({ level: "good", title: `LCOE ${fmt(m.lcoeUsdPerKWh*100,2)}¢/kWh < PPA ${fmt(I.tariffUsdPerKWh*100,2)}¢/kWh`,
      body: `Margin of ${fmt((I.tariffUsdPerKWh - m.lcoeUsdPerKWh)*100,2)}¢/kWh provides a buffer against generation underperformance.` });
  }

  // Equity IRR vs WACC
  if (Number.isFinite(m.commonEquityIRR) && m.commonEquityIRR < m.costOfEquity) {
    out.push({ level: "warn", title: `Equity IRR ${fmtPct(m.commonEquityIRR)} below cost of equity ${fmtPct(m.costOfEquity)}`,
      body: "The project does not clear the equity hurdle. Either negotiate higher tariff, improve P50 yield, optimise capex per MW, or reduce the equity ticket via more sub-debt." });
  }

  // Capex per MW
  const capexPerMW = m.totalUses / I.capacityMWp;
  if (capexPerMW > 1500) {
    out.push({ level: "warn", title: `Capex ${fmt(capexPerMW)}k$/MW is above wind benchmark`,
      body: "Onshore wind benchmarks are typically 1,100–1,400 k$/MW. Investigate EPC scope, soft costs, contingency sizing or grid connection costs." });
  } else if (capexPerMW < 900) {
    out.push({ level: "info", title: `Capex ${fmt(capexPerMW)}k$/MW is aggressive`,
      body: "Make sure the EPC scope is complete (BoP, civil, substation, grid tie-in, owner's costs, contingency ≥ 5%)." });
  }

  // DSRA
  if (I.dsraTargetMonths < 6) {
    out.push({ level: "warn", title: "DSRA below 6 months",
      body: "Most lenders require at least a 6-month DSRA; PF best practice is 12-month forward look. Increase to comply with typical term-sheet requirements." });
  }

  // Tax / inflation
  if (I.modelInflationOn === 0) {
    out.push({ level: "info", title: "Inflation switched off",
      body: "Run at least one scenario with CPI on (≥2.5% USD) to test real-terms cashflows and to match how lenders model the project." });
  }

  // Tenor vs PPA
  if (I.debtTenorYears > I.tariffFixedYears) {
    out.push({ level: "warn", title: `Debt tenor ${I.debtTenorYears}y exceeds fixed PPA period ${I.tariffFixedYears}y`,
      body: "Tail risk: when the fixed tariff expires, debt service is exposed to merchant pricing. Best practice is tenor ≤ PPA tenor minus 2 years (tail = 2y)." });
  }

  // Balance check
  if (m.maxBalanceCheck > 1) {
    out.push({ level: "warn", title: `Balance sheet does not tie (max abs ${fmt(m.maxBalanceCheck)})`,
      body: "Re-check working-capital, dividend, and DSRA flows. A clean PF model should balance to <$1k across the operations period." });
  } else {
    out.push({ level: "good", title: "Balance sheet ties",
      body: "Assets = Liabilities + Equity across all years (max abs <$1k). Integrity passes." });
  }

  // Cost of capital coherence
  out.push({ level: "info", title: `WACC ${fmtPct(m.wacc)} (Ke ${fmtPct(m.costOfEquity)} / Kd ${fmtPct(m.blendedRate)} after-tax)`,
    body: `LCOE is discounted at ${fmtPct(m.lcoeDiscountRateUsed)}. WACC is computed from current capital structure, country ERP and risk-free rate — review riskFreeRate and beta on the Inputs tab.` });

  // Top LCOE drivers — cite the 3 biggest contributors
  const topDrivers = [...m.lcoeContributions].sort((a, b) => b.pct - a.pct).slice(0, 3);
  if (topDrivers.length) {
    const list = topDrivers.map(d => `${d.label} (${fmtPct(d.pct)} of LCOE, ${fmt(d.usdPerMWh, 2)} $/MWh)`).join("; ");
    out.push({ level: "info", title: "Top 3 LCOE drivers", body: `Focus negotiation/optimisation on: ${list}.` });
  }

  // PPA-price coverage — how much of PPA is consumed by costs
  const ppaUsdMWh = I.tariffUsdPerKWh * 1000;
  const lcoeUsdMWh = m.lcoeUsdPerKWh * 1000;
  if (ppaUsdMWh > 0) {
    const coverage = lcoeUsdMWh / ppaUsdMWh;
    if (coverage > 0.95) {
      out.push({ level: "warn", title: `LCOE consumes ${fmtPct(coverage)} of the PPA price`,
        body: "Margin is razor-thin (<5%). Even small under-performance will breach DSCR. Aim for LCOE ≤ 85% of PPA at base case." });
    } else if (coverage < 0.6) {
      out.push({ level: "info", title: `Strong PPA margin — LCOE is only ${fmtPct(coverage)} of PPA`,
        body: "Comfortable head-room. If lender appetite allows, consider trading some margin for higher gearing or a longer tenor to lift equity IRR." });
    }
  }

  // Tax engine — make sure auto-tax is reasonable vs hard capex
  if ((I.taxesCapexAuto ?? 1) === 1) {
    const hardCapex = I.epcCost + I.developmentExpenses + I.developmentPremiums + I.substation + I.contingency;
    if (hardCapex > 0 && I.taxesCapex / hardCapex > 0.18) {
      out.push({ level: "warn", title: `Auto-computed taxes (capex) = ${fmtPct(I.taxesCapex / hardCapex)} of hard capex`,
        body: "VAT + customs feels high vs hard capex — confirm onshore/offshore split and that VAT is recoverable post-COD if so." });
    }
  }

  // General PF best practices
  out.push({ level: "info", title: "Run lender stress cases before close",
      body: "Standard set: P90 yield, capex overrun +10%, opex +10%, delay 6 months, base rate +200bps, FX -20% (if non-USD revenue). Min DSCR should stay ≥ 1.10x in each stress." });

  return out;
}

const Item = ({ r }: { r: Rec }) => {
  const icon = r.level === "good" ? <CheckCircle2 className="h-5 w-5"/>
    : r.level === "warn" ? <AlertTriangle className="h-5 w-5"/>
    : <Info className="h-5 w-5"/>;
  const color = r.level === "good" ? "text-success border-success/30 bg-success/5"
    : r.level === "warn" ? "text-destructive border-destructive/30 bg-destructive/5"
    : "text-primary border-primary/30 bg-primary/5";
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="space-y-1">
          <div className="font-semibold text-foreground">{r.title}</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
        </div>
      </div>
    </div>
  );
};

export const RecommendationsView = ({ m }: { m: ModelOutputs }) => {
  const recs = buildRecs(m);
  return (
    <div className="space-y-6">
      <ShareholderVerdict m={m}/>

      <div className="rounded-xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary"/>
          <div>
            <h2 className="text-lg font-semibold">Model recommendations</h2>
            <p className="text-sm text-muted-foreground">Best-practice diagnostics generated from your current assumptions.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground flex gap-1 items-center"><TrendingUp className="h-3 w-3"/>Equity IRR</div><div className="font-mono font-semibold text-base">{fmtPct(m.commonEquityIRR)}</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground flex gap-1 items-center"><Zap className="h-3 w-3"/>LCOE</div><div className="font-mono font-semibold text-base">{fmt(m.lcoeUsdPerKWh*100,2)}¢/kWh</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">WACC</div><div className="font-mono font-semibold text-base">{fmtPct(m.wacc)}</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">Min DSCR</div><div className="font-mono font-semibold text-base">{fmt(m.minDSCR)}x</div></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {recs.map((r, i) => <Item key={i} r={r}/>)}
      </div>
    </div>
  );
};
