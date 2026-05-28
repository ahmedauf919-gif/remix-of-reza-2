import { LngOutputs, fmtNum, fmtPct, fmtUsd } from "@/lib/lngModel";
import {
  CheckCircle2, AlertTriangle, Info, TrendingUp, Shield, Zap,
  ThumbsUp, ThumbsDown, Minus,
} from "lucide-react";

type Rec = { level: "good" | "warn" | "info"; title: string; body: string };
type ScoreItem = {
  metric: string;
  value: string;
  benchmark: string;
  verdict: "strong" | "ok" | "weak";
  weight: number;
  rationale: string;
};

function buildScore(m: LngOutputs): { items: ScoreItem[]; score: number; verdict: "Invest" | "Conditional" | "Pass"; headline: string } {
  const I = m.inputs;
  const items: ScoreItem[] = [];

  // 1. Equity IRR vs cost of equity
  const ke = I.discountRateEquity;
  const irr = Number.isFinite(m.equityIRR) ? m.equityIRR : -1;
  const spread = irr - ke;
  items.push({
    metric: "Equity IRR vs cost of equity",
    value: `${fmtPct(irr)} vs ${fmtPct(ke)} (spread ${fmtPct(spread)})`,
    benchmark: "≥ +300 bps strong, 0–300 ok, <0 weak",
    verdict: spread >= 0.03 ? "strong" : spread >= 0 ? "ok" : "weak",
    weight: 0.25,
    rationale: "Does the project clear the equity hurdle rate?",
  });

  // 2. Absolute equity IRR
  items.push({
    metric: "Equity IRR (absolute)",
    value: fmtPct(irr),
    benchmark: "≥ 20% strong, 15–20% ok, <15% weak",
    verdict: irr >= 0.20 ? "strong" : irr >= 0.15 ? "ok" : "weak",
    weight: 0.15,
    rationale: "Absolute return target for USD-denominated LNG equity.",
  });

  // 3. Equity payback
  const pb = m.paybackYears;
  const pbOk = Number.isFinite(pb) && pb > 0;
  items.push({
    metric: "Equity payback",
    value: pbOk ? `${fmtNum(pb, 1)} yrs` : "n/a",
    benchmark: "≤ 5y strong, 5–8y ok, >8y weak",
    verdict: !pbOk ? "weak" : pb <= 5 ? "strong" : pb <= 8 ? "ok" : "weak",
    weight: 0.10,
    rationale: "Time to recover the sponsor equity cheque.",
  });

  // 4. Min DSCR covenant cushion
  const cushion = m.minDSCR - 1.30;
  items.push({
    metric: "Min DSCR cushion vs 1.30x",
    value: `${fmtNum(m.minDSCR, 2)}x (cushion ${cushion >= 0 ? "+" : ""}${fmtNum(cushion, 2)}x)`,
    benchmark: "≥ +0.20x strong, 0–0.20 ok, <0 breach",
    verdict: cushion >= 0.20 ? "strong" : cushion >= 0 ? "ok" : "weak",
    weight: 0.20,
    rationale: "Lender covenant headroom — breach triggers default.",
  });

  // 5. LCOE vs selling price
  const lcoeMargin = I.sellingPriceUsdPerMmbtu - m.lcoe;
  items.push({
    metric: "LCOE vs selling price",
    value: `$${fmtNum(m.lcoe, 2)}/MMBTU vs $${fmtNum(I.sellingPriceUsdPerMmbtu, 2)}/MMBTU (margin $${fmtNum(lcoeMargin, 2)})`,
    benchmark: "LCOE < price by ≥ $2 strong, $0–2 ok, negative weak",
    verdict: lcoeMargin >= 2 ? "strong" : lcoeMargin >= 0 ? "ok" : "weak",
    weight: 0.15,
    rationale: "Levelised cost below selling price confirms value creation.",
  });

  // 6. Project IRR vs WACC proxy
  const projSpread = m.projectIRR - I.discountRateProject;
  items.push({
    metric: "Project IRR vs WACC proxy",
    value: `${fmtPct(m.projectIRR)} vs ${fmtPct(I.discountRateProject)}`,
    benchmark: "≥ +200 bps strong",
    verdict: projSpread >= 0.02 ? "strong" : projSpread >= 0 ? "ok" : "weak",
    weight: 0.10,
    rationale: "Asset-level value creation above the cost of capital.",
  });

  // 7. Gearing
  items.push({
    metric: "Effective gearing",
    value: fmtPct(I.debtRatioPct),
    benchmark: "60–75% optimal, 75–80% ok, >80% weak",
    verdict: I.debtRatioPct >= 0.60 && I.debtRatioPct <= 0.75 ? "strong"
           : I.debtRatioPct <= 0.80 ? "ok" : "weak",
    weight: 0.05,
    rationale: "Leverage must be serviceable across stress scenarios.",
  });

  const map: Record<string, number> = { strong: 1, ok: 0.6, weak: 0.15 };
  const num = items.reduce((s, it) => s + it.weight * map[it.verdict], 0);
  const den = items.reduce((s, it) => s + it.weight, 0);
  const score = Math.round((num / den) * 100);

  let verdict: "Invest" | "Conditional" | "Pass";
  let headline: string;
  if (score >= 75) {
    verdict = "Invest";
    headline = "Strong shareholder case — proceed to financial close.";
  } else if (score >= 55) {
    verdict = "Conditional";
    headline = "Workable — close the identified gaps before committing capital.";
  } else {
    verdict = "Pass";
    headline = "Does not meet shareholder thresholds at current assumptions.";
  }

  return { items, score, verdict, headline };
}

const Badge = ({ v }: { v: ScoreItem["verdict"] }) => {
  const cls =
    v === "strong"
      ? "bg-success/15 text-success border-success/30"
      : v === "ok"
      ? "bg-primary/10 text-primary border-primary/30"
      : "bg-destructive/10 text-destructive border-destructive/30";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {v === "strong" ? "Strong" : v === "ok" ? "Acceptable" : "Weak"}
    </span>
  );
};

const VerdictPanel = ({ m }: { m: LngOutputs }) => {
  const { items, score, verdict, headline } = buildScore(m);
  const ringColor =
    verdict === "Invest" ? "text-success" : verdict === "Conditional" ? "text-primary" : "text-destructive";
  const Icon = verdict === "Invest" ? ThumbsUp : verdict === "Conditional" ? Minus : ThumbsDown;

  return (
    <div className="rounded-xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)] space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl bg-secondary p-2.5 ${ringColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Shareholder verdict</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">{headline}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase">Score</div>
            <div className={`text-3xl font-bold font-mono ${ringColor}`}>
              {score}<span className="text-base text-muted-foreground">/100</span>
            </div>
          </div>
          <div
            className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
              verdict === "Invest"
                ? "border-success/40 bg-success/10 text-success"
                : verdict === "Conditional"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {verdict}
          </div>
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
              <th className="py-2 font-medium">Why</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="py-2 pr-3 font-medium">{it.metric}</td>
                <td className="py-2 pr-3 font-mono text-xs">{it.value}</td>
                <td className="py-2 pr-3 text-muted-foreground text-xs">{it.benchmark}</td>
                <td className="py-2 pr-3"><Badge v={it.verdict} /></td>
                <td className="py-2 text-muted-foreground text-xs">{it.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function buildRecs(m: LngOutputs): Rec[] {
  const I = m.inputs;
  const out: Rec[] = [];
  const y1 = m.rows.find(r => r.yearIdx === 0);

  // DSCR check
  if (m.minDSCR < 1.30) {
    out.push({
      level: "warn",
      title: `Min DSCR ${fmtNum(m.minDSCR, 2)}x is below the 1.30x covenant`,
      body: "Reduce gearing, extend tenor, increase selling price, or cut OPEX to restore coverage.",
    });
  } else {
    out.push({
      level: "good",
      title: `DSCR covenant satisfied (min ${fmtNum(m.minDSCR, 2)}x / avg ${fmtNum(m.avgDSCR, 2)}x)`,
      body: "Coverage profile satisfies typical project finance covenants.",
    });
  }

  // Equity IRR vs hurdle
  if (Number.isFinite(m.equityIRR) && m.equityIRR < I.discountRateEquity) {
    out.push({
      level: "warn",
      title: `Equity IRR ${fmtPct(m.equityIRR)} is below cost of equity ${fmtPct(I.discountRateEquity)}`,
      body: "Consider raising the selling price, reducing CAPEX or OPEX, or restructuring the debt package.",
    });
  } else if (Number.isFinite(m.equityIRR)) {
    out.push({
      level: "good",
      title: `Equity IRR ${fmtPct(m.equityIRR)} clears the ${fmtPct(I.discountRateEquity)} equity hurdle`,
      body: `Spread of ${fmtPct(m.equityIRR - I.discountRateEquity)} above the hurdle rate.`,
    });
  }

  // LCOE vs selling price
  const lcoeMargin = I.sellingPriceUsdPerMmbtu - m.lcoe;
  if (lcoeMargin < 0) {
    out.push({
      level: "warn",
      title: `LCOE $${fmtNum(m.lcoe, 2)}/MMBTU exceeds selling price $${fmtNum(I.sellingPriceUsdPerMmbtu, 2)}/MMBTU`,
      body: "Project is value-destructive at current pricing. Renegotiate tariff, cut CAPEX, or improve utilization.",
    });
  } else {
    out.push({
      level: "good",
      title: `LCOE $${fmtNum(m.lcoe, 2)}/MMBTU is below selling price — margin $${fmtNum(lcoeMargin, 2)}/MMBTU`,
      body: "Positive levelised margin confirms the project covers all costs including capital.",
    });
  }

  // CAPEX efficiency
  out.push({
    level: "info",
    title: `CAPEX intensity: $${fmtNum(m.capexPerM3Day, 0)}/m³/day (total ${fmtUsd(m.totalCapexUsd)})`,
    body: "Industry benchmark for small-scale LNG is typically $80,000–$150,000/m³/day. Validate against vendor quotes.",
  });

  // Y1 EBITDA margin
  if (y1 && y1.revenue > 0) {
    const ebitdaMargin = y1.ebitda / y1.revenue;
    if (ebitdaMargin < 0.30) {
      out.push({
        level: "warn",
        title: `Y1 EBITDA margin ${fmtPct(ebitdaMargin)} is thin`,
        body: "Ramp-up year profitability is low. Consider reducing fixed OPEX or adjusting the ramp-up utilization schedule.",
      });
    } else {
      out.push({
        level: "good",
        title: `Y1 EBITDA margin ${fmtPct(ebitdaMargin)} is healthy`,
        body: "Even at ramp-up utilization, the project generates a strong operating margin.",
      });
    }
  }

  // Payback
  if (!Number.isFinite(m.paybackYears)) {
    out.push({
      level: "warn",
      title: "Equity payback not achieved within the project horizon",
      body: "The cumulative FCFE never turns positive. Re-examine pricing, volume, or financing assumptions.",
    });
  } else if (m.paybackYears > 8) {
    out.push({
      level: "warn",
      title: `Equity payback of ${fmtNum(m.paybackYears, 1)} years is long`,
      body: "Payback beyond 8 years may not meet DFI or development bank criteria.",
    });
  }

  // Lender stress cases
  out.push({
    level: "info",
    title: "Lender stress cases to run",
    body: "Volume −15%, OPEX +10%, feed gas +20%, selling price −10%, interest rate +300 bps. Min DSCR should hold ≥ 1.10x under all scenarios.",
  });

  // Refinancing note
  if (!(I.refiEnabled)) {
    out.push({
      level: "info",
      title: "Consider refinancing after Year 3–5",
      body: "Once construction and ramp-up risk have been de-risked, refinancing at a lower rate can materially improve equity IRR. Enable the Refinancing Option in the Financial tab.",
    });
  } else {
    out.push({
      level: "info",
      title: `Refinancing enabled at Year ${I.refiYear ?? 5} at ${fmtPct(I.refiNewRatePct ?? 0.08)}`,
      body: `New tenor: ${I.refiNewTenorYears ?? 5} years. Ensure the refinancing assumptions are aligned with market conditions at close.`,
    });
  }

  return out;
}

const Item = ({ r }: { r: Rec }) => {
  const icon =
    r.level === "good"
      ? <CheckCircle2 className="h-5 w-5" />
      : r.level === "warn"
      ? <AlertTriangle className="h-5 w-5" />
      : <Info className="h-5 w-5" />;
  const color =
    r.level === "good"
      ? "text-success border-success/30 bg-success/5"
      : r.level === "warn"
      ? "text-destructive border-destructive/30 bg-destructive/5"
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

export const LngRecommendations = ({ m }: { m: LngOutputs }) => {
  const recs = buildRecs(m);
  const I = m.inputs;
  const startYr = I.startYear + 1;  // construction year
  const endYr   = startYr + I.projectDurationYears - 1;

  return (
    <div className="space-y-6">
      {/* IC Memo Header */}
      <div className="rounded-xl border-2 border-[#002060] bg-white p-6 shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#005298] mb-1">Investment Committee Memorandum</div>
            <h1 className="text-2xl font-bold text-[#002060]">{I.projectName}</h1>
            <div className="text-sm text-gray-500 mt-1">Tanzania Micro LNG · {I.capacityM3LngPerDay} m³/day · {startYr}–{endYr}</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-lg bg-[#002060] text-white px-4 py-2 text-center min-w-[90px]">
              <div className="text-xs opacity-75">Total CAPEX</div>
              <div className="font-bold text-sm">{fmtUsd(m.totalCapexUsd)}</div>
            </div>
            <div className="rounded-lg bg-[#005298] text-white px-4 py-2 text-center min-w-[90px]">
              <div className="text-xs opacity-75">Project IRR</div>
              <div className="font-bold text-sm">{fmtPct(m.projectIRR)}</div>
            </div>
            <div className="rounded-lg bg-[#FFC10E] text-[#002060] px-4 py-2 text-center min-w-[90px]">
              <div className="text-xs font-semibold opacity-75">Equity IRR</div>
              <div className="font-bold text-sm">{fmtPct(m.equityIRR)}</div>
            </div>
          </div>
        </div>
        {/* Executive Summary */}
        <div className="mt-5 rounded-lg border border-[#002060]/20 bg-[#002060]/5 p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#002060] mb-2">Executive Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {I.projectName} is a {I.capacityM3LngPerDay} m³/day micro-LNG facility in Tanzania with a {I.projectDurationYears}-year operational life.
            The project requires a total capital investment of {fmtUsd(m.totalCapexUsd)} ({fmtPct(I.debtRatioPct)} debt-funded),
            generating an unlevered project IRR of {fmtPct(m.projectIRR)} and a levered equity IRR of {fmtPct(m.equityIRR)}.
            At a selling price of ${fmtNum(I.sellingPriceUsdPerMmbtu, 2)}/MMBTU, the LCOE of ${fmtNum(m.lcoe, 2)}/MMBTU
            implies a margin of ${fmtNum(I.sellingPriceUsdPerMmbtu - m.lcoe, 2)}/MMBTU.
            Minimum DSCR is {fmtNum(m.minDSCR, 2)}x ({m.minDSCR >= 1.3 ? "above" : "below"} the 1.30x covenant).
          </p>
        </div>
        {/* Key Metrics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { label: "NPV (Project)", v: fmtUsd(m.npvProject) },
            { label: "NPV (Equity)",  v: fmtUsd(m.npvEquity) },
            { label: "Min DSCR",      v: `${fmtNum(m.minDSCR,2)}x` },
            { label: "Avg DSCR",      v: `${fmtNum(m.avgDSCR,2)}x` },
            { label: "Payback",       v: isFinite(m.paybackYears) ? `${fmtNum(m.paybackYears,1)} yrs` : "—" },
            { label: "Senior Debt",   v: fmtUsd(m.seniorDebt) },
            { label: "SHL",           v: m.shlAmount > 0 ? fmtUsd(m.shlAmount) : "—" },
            { label: "CAPEX/m³·day",  v: `$${fmtNum(m.capexPerM3Day, 0)}` },
          ].map(cell => (
            <div key={cell.label} className="rounded bg-gray-50 border border-gray-200 p-2">
              <div className="text-[#005298] font-medium">{cell.label}</div>
              <div className="font-mono font-semibold text-[#002060]">{cell.v}</div>
            </div>
          ))}
        </div>
        {/* Funding Structure */}
        <div className="mt-4 overflow-auto">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#002060] mb-2">Funding Structure</h3>
          <table className="w-full text-xs">
            <thead><tr className="text-left text-gray-500"><th className="py-1 pr-4">Tranche</th><th className="py-1 pr-4 text-right">USD</th><th className="py-1 text-right">% Total</th></tr></thead>
            <tbody>
              <tr className="border-t border-gray-200"><td className="py-1 pr-4">Senior Debt</td><td className="py-1 pr-4 text-right font-mono">{fmtUsd(m.seniorDebt)}</td><td className="py-1 text-right">{fmtPct(m.seniorDebt / Math.max(1, m.totalCapexUsd))}</td></tr>
              {m.shlAmount > 0 && <tr className="border-t border-gray-200"><td className="py-1 pr-4">Shareholder Loan</td><td className="py-1 pr-4 text-right font-mono">{fmtUsd(m.shlAmount)}</td><td className="py-1 text-right">{fmtPct(m.shlAmount / Math.max(1, m.totalCapexUsd))}</td></tr>}
              <tr className="border-t border-gray-200"><td className="py-1 pr-4">Sponsor Equity</td><td className="py-1 pr-4 text-right font-mono">{fmtUsd(m.equityAmount)}</td><td className="py-1 text-right">{fmtPct(m.equityAmount / Math.max(1, m.totalCapexUsd))}</td></tr>
              <tr className="border-t-2 border-[#002060] font-semibold"><td className="py-1 pr-4">Total</td><td className="py-1 pr-4 text-right font-mono">{fmtUsd(m.totalCapexUsd)}</td><td className="py-1 text-right">100%</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <VerdictPanel m={m} />

      <div className="rounded-xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Model recommendations</h2>
            <p className="text-sm text-muted-foreground">Best-practice diagnostics from your current assumptions.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="rounded-lg bg-secondary/40 p-3">
            <div className="text-xs text-muted-foreground flex gap-1 items-center">
              <TrendingUp className="h-3 w-3" /> Equity IRR
            </div>
            <div className="font-mono font-semibold text-base">{fmtPct(m.equityIRR)}</div>
          </div>
          <div className="rounded-lg bg-secondary/40 p-3">
            <div className="text-xs text-muted-foreground flex gap-1 items-center">
              <Zap className="h-3 w-3" /> LCOE
            </div>
            <div className="font-mono font-semibold text-base">${fmtNum(m.lcoe, 2)}/MMBTU</div>
          </div>
          <div className="rounded-lg bg-secondary/40 p-3">
            <div className="text-xs text-muted-foreground flex gap-1 items-center">
              <Shield className="h-3 w-3" /> Min DSCR
            </div>
            <div className="font-mono font-semibold text-base">{fmtNum(m.minDSCR, 2)}x</div>
          </div>
          <div className="rounded-lg bg-secondary/40 p-3">
            <div className="text-xs text-muted-foreground">Total CAPEX</div>
            <div className="font-mono font-semibold text-base">{fmtUsd(m.totalCapexUsd)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {recs.map((r, i) => <Item key={i} r={r} />)}
      </div>
    </div>
  );
};
