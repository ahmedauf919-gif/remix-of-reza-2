import { ModelOutputs, fmt, fmtPct } from "@/lib/windModel";
import { CheckCircle2, AlertTriangle, Info, TrendingUp, Shield, Zap } from "lucide-react";

type Rec = { level: "good" | "warn" | "info"; title: string; body: string };

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
