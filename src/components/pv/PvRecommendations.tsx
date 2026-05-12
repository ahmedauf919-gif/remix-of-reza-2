import { PvOutputs, fmtNum, fmtPct, fmtEgp } from "@/lib/pvModel";
import { CheckCircle2, AlertTriangle, Info, TrendingUp, Shield, Zap, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

type Rec = { level: "good" | "warn" | "info"; title: string; body: string };

type ScoreItem = { metric: string; value: string; benchmark: string; verdict: "strong" | "ok" | "weak"; weight: number; rationale: string };

function buildShareholderScore(m: PvOutputs) {
  const I = m.inputs;
  const items: ScoreItem[] = [];
  const tariff = m.rows.find(r => r.yearIdx === 0)?.tariffEgp ?? 0;

  // Equity IRR vs cost of equity (proxy = discountRateEquity)
  const ke = I.discountRateEquity;
  const irr = Number.isFinite(m.equityIRR) ? m.equityIRR : -1;
  const spread = irr - ke;
  items.push({
    metric: "Equity IRR vs cost of equity",
    value: `${fmtPct(irr)} vs ${fmtPct(ke)} (spread ${fmtPct(spread)})`,
    benchmark: "≥ +300 bps strong, 0–300 bps ok, <0 weak",
    verdict: spread >= 0.03 ? "strong" : spread >= 0 ? "ok" : "weak",
    weight: 0.25,
    rationale: "Does the project clear the risk-adjusted equity hurdle?",
  });

  items.push({
    metric: "Equity IRR (absolute)",
    value: fmtPct(irr),
    benchmark: "≥ 18% strong, 12–18% ok, <12% weak (EGP solar)",
    verdict: irr >= 0.18 ? "strong" : irr >= 0.12 ? "ok" : "weak",
    weight: 0.15,
    rationale: "Absolute return target for EGP-denominated PV equity.",
  });

  const payback = m.paybackYears;
  const pbOk = Number.isFinite(payback) && payback > 0;
  items.push({
    metric: "Equity payback",
    value: pbOk ? `${fmtNum(payback, 1)} yrs` : "n/a",
    benchmark: "≤ 6y strong, 6–9y ok, >9y weak",
    verdict: !pbOk ? "weak" : payback <= 6 ? "strong" : payback <= 9 ? "ok" : "weak",
    weight: 0.1,
    rationale: "Time to recover equity cheque.",
  });

  const dscrCushion = m.minDSCR - 1.3;
  items.push({
    metric: "Min DSCR cushion",
    value: `${fmtNum(m.minDSCR, 2)}x (target 1.30x)`,
    benchmark: "≥ +0.10x strong, 0 to +0.10x ok, <0 weak",
    verdict: dscrCushion >= 0.1 ? "strong" : dscrCushion >= 0 ? "ok" : "weak",
    weight: 0.15,
    rationale: "Headroom over covenant protects distributions in stress.",
  });

  const coverage = tariff > 0 ? m.lcoeEgpPerKwh / tariff : 1;
  items.push({
    metric: "LCOE / tariff",
    value: fmtPct(coverage),
    benchmark: "≤ 70% strong, 70–85% ok, >85% weak",
    verdict: coverage <= 0.70 ? "strong" : coverage <= 0.85 ? "ok" : "weak",
    weight: 0.1,
    rationale: "Margin cushion against generation under-performance.",
  });

  const projSpread = m.projectIRR - I.discountRateProject;
  items.push({
    metric: "Project IRR vs WACC proxy",
    value: `${fmtPct(m.projectIRR)} vs ${fmtPct(I.discountRateProject)}`,
    benchmark: "≥ +200 bps strong, 0–200 bps ok, <0 weak",
    verdict: projSpread >= 0.02 ? "strong" : projSpread >= 0 ? "ok" : "weak",
    weight: 0.1,
    rationale: "Unlevered economics — does the asset itself create value?",
  });

  items.push({
    metric: "Effective gearing",
    value: fmtPct(I.debtPct),
    benchmark: "60–75% optimal, 50–80% ok, outside weak",
    verdict: I.debtPct >= 0.6 && I.debtPct <= 0.75 ? "strong" : I.debtPct >= 0.5 && I.debtPct <= 0.8 ? "ok" : "weak",
    weight: 0.1,
    rationale: "Right-sized leverage maximises equity return without breaching lender appetite.",
  });

  const tail = I.contractYears - I.loanTenorYears;
  items.push({
    metric: "Contract tail vs debt",
    value: `${fmtNum(tail, 1)} yrs`,
    benchmark: "≥ 3y strong, 0–3y ok, <0 weak",
    verdict: tail >= 3 ? "strong" : tail >= 0 ? "ok" : "weak",
    weight: 0.05,
    rationale: "Tail protects shareholders from merchant exposure during debt life.",
  });

  const map = { strong: 1, ok: 0.6, weak: 0.15 } as const;
  const num = items.reduce((s, it) => s + it.weight * map[it.verdict], 0);
  const den = items.reduce((s, it) => s + it.weight, 0);
  const score = Math.round((num / den) * 100);

  let verdict: "Invest" | "Conditional" | "Pass";
  let headline: string;
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

const ShareholderVerdict = ({ m }: { m: PvOutputs }) => {
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
      <p className="text-xs text-muted-foreground">Score is a weighted blend of return, safety and capital-efficiency metrics. Always confirm with lender stress cases (P90 yield, capex +10%, opex +10%, rates +200 bps).</p>
    </div>
  );
};

function buildRecs(m: PvOutputs): Rec[] {
  const I = m.inputs;
  const out: Rec[] = [];
  const tariff = m.rows.find(r => r.yearIdx === 0)?.tariffEgp ?? 0;

  if (m.minDSCR < 1.3) {
    out.push({ level: "warn", title: `Min DSCR ${fmtNum(m.minDSCR, 2)}x is below 1.30x target`,
      body: "Reduce gearing, extend tenor, add a grace period, or revisit tariff/yield assumptions before signing." });
  } else {
    out.push({ level: "good", title: `DSCR cushion: min ${fmtNum(m.minDSCR, 2)}x / avg ${fmtNum(m.avgDSCR, 2)}x`,
      body: "Coverage profile satisfies typical PF covenants. Best practice is to keep min DSCR ≥ 1.40x to absorb realistic stress (yield -7%, opex +10%)." });
  }

  if (I.debtPct > 0.8) {
    out.push({ level: "warn", title: `High gearing ${fmtPct(I.debtPct)}`,
      body: "Lender appetite for solar is typically 65–75%. Above 80% expect higher margins, tighter covenants and a 12-month DSRA requirement." });
  } else if (I.debtPct < 0.5) {
    out.push({ level: "info", title: `Conservative gearing ${fmtPct(I.debtPct)}`,
      body: "Room to lever up to lift equity IRR. Run a sensitivity at 70% gearing if your lenders allow." });
  }

  if (tariff > 0 && m.lcoeEgpPerKwh > tariff) {
    out.push({ level: "warn", title: `LCOE ${fmtNum(m.lcoeEgpPerKwh, 3)} EGP/kWh exceeds tariff ${fmtNum(tariff, 3)} EGP/kWh`,
      body: "The project is value-destructive at this tariff. Renegotiate price, push CAPEX down, or improve yield/availability." });
  } else if (tariff > 0) {
    out.push({ level: "good", title: `LCOE ${fmtNum(m.lcoeEgpPerKwh, 3)} < tariff ${fmtNum(tariff, 3)} EGP/kWh`,
      body: `Margin of ${fmtNum(tariff - m.lcoeEgpPerKwh, 3)} EGP/kWh provides a buffer against generation under-performance.` });
  }

  if (Number.isFinite(m.equityIRR) && m.equityIRR < I.discountRateEquity) {
    out.push({ level: "warn", title: `Equity IRR ${fmtPct(m.equityIRR)} below cost of equity ${fmtPct(I.discountRateEquity)}`,
      body: "Negotiate higher tariff, improve P50 yield, optimise CAPEX per kWp, or reduce equity ticket via more sub-debt." });
  }

  const capexPerKwp = m.totalCapexEgp / Math.max(1, I.capacityKwp);
  // very rough EGP/kWp benchmark — flag if extreme
  if (capexPerKwp > 35000) {
    out.push({ level: "warn", title: `CAPEX ${fmtNum(capexPerKwp, 0)} EGP/kWp is above benchmark`,
      body: "Egyptian utility-scale PV benchmarks are typically 18,000–28,000 EGP/kWp (~600-900 USD/kWp). Investigate BOS scope, customs, and contingency sizing." });
  }

  if (I.loanTenorYears > I.contractYears) {
    out.push({ level: "warn", title: `Debt tenor ${I.loanTenorYears}y exceeds contract horizon ${I.contractYears}y`,
      body: "Tail risk: when the contract expires, debt service is exposed to merchant pricing. Best practice is tenor ≤ contract tenor minus 3 years." });
  }

  if (I.graceYears === 0) {
    out.push({ level: "info", title: "No grace period on debt principal",
      body: "Solar projects often warrant 6–12 months of post-COD grace to absorb commissioning ramp. Consider a small grace to lift early-year DSCR." });
  }

  // Top tariff drivers
  const topDrivers = [...m.tariffComposition].filter(c => c.value > 0).sort((a, b) => b.value - a.value).slice(0, 3);
  if (topDrivers.length) {
    const list = topDrivers.map(d => `${d.name} (${fmtPct(d.pct)} of tariff, ${fmtNum(d.value, 4)} EGP/kWh)`).join("; ");
    out.push({ level: "info", title: "Top 3 tariff drivers", body: `Focus negotiation/optimisation on: ${list}.` });
  }

  out.push({ level: "info", title: "Run lender stress cases before close",
    body: "Standard set: P90 yield, CAPEX +10%, OPEX +10%, delay 6 months, base rate +300 bps, EGP devaluation -20%. Min DSCR should stay ≥ 1.10x in each stress." });

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

export const PvRecommendations = ({ m }: { m: PvOutputs }) => {
  const recs = buildRecs(m);
  const I = m.inputs;
  const tariffY1 = m.rows.find(r => r.yearIdx === 0)?.tariffEgp ?? I.govtBaseTariffEgp;
  const annualEnergyKwh = m.rows.find(r => r.yearIdx === 0)?.energyKwh ?? 0;
  return (
    <div className="space-y-6">

      {/* IC Memo Header */}
      <div className="rounded-xl border-2 border-[#002060] bg-white p-6 shadow-md">
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-border pb-4 mb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#005298] mb-1">Investment Committee Memorandum</div>
            <h1 className="text-2xl font-bold text-[#002060]">{I.projectName}</h1>
            <p className="text-sm text-muted-foreground mt-1">{I.scenario} · Solar PV ({I.contractType}) · {I.startYear}–{I.startYear + I.contractYears - 1}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="rounded-lg bg-[#002060] text-white px-4 py-2 text-center min-w-[90px]">
              <div className="text-xs opacity-70">Total CAPEX</div>
              <div className="font-bold font-mono text-sm">{fmtEgp(m.totalCapexEgp)}</div>
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
            {I.projectName} is a {I.contractYears}-year {I.contractType} solar PV project with an installed capacity of {fmtNum(I.capacityKwp / 1000, 1)} MWp,
            targeting an annual energy yield of {fmtNum(annualEnergyKwh / 1e6, 2)} GWh/year (P{I.yieldCase === "P50" ? "50" : "90"} case).
            Revenue is secured at a {I.voltageLevel} PPA tariff of {fmtNum(tariffY1, 4)} EGP/kWh with {fmtPct(I.govtEscalationPct)} annual escalation.
            Total CAPEX of {fmtEgp(m.totalCapexEgp)} is financed at {fmtPct(I.debtPct)} gearing over a {I.loanTenorYears}-year senior debt facility.
            The project targets an equity IRR of {fmtPct(m.equityIRR)} against a cost of equity of {fmtPct(I.discountRateEquity)},
            delivering a {fmtPct(m.equityIRR - I.discountRateEquity)} spread with an LCOE of {fmtNum(m.lcoeEgpPerKwh, 4)} EGP/kWh
            and an equity payback of {Number.isFinite(m.paybackYears) ? `${fmtNum(m.paybackYears, 1)} years` : "N/A"}.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "NPV (Project)", value: fmtEgp(m.npvProject), sub: `@ ${fmtPct(I.discountRateProject)} discount` },
            { label: "NPV (Equity)", value: fmtEgp(m.npvEquity), sub: `@ ${fmtPct(I.discountRateEquity)} discount` },
            { label: "Min DSCR", value: `${fmtNum(m.minDSCR, 2)}x`, sub: `Avg ${fmtNum(m.avgDSCR, 2)}x · Covenant 1.30x` },
            { label: "LCOE", value: `${fmtNum(m.lcoeEgpPerKwh, 4)} EGP/kWh`, sub: "Levelised cost of energy" },
            { label: "Capacity", value: `${fmtNum(I.capacityKwp / 1000, 1)} MWp`, sub: `${I.structureType} mount · P${I.yieldCase === "P50" ? "50" : "90"}` },
            { label: "Y1 Tariff", value: `${fmtNum(tariffY1, 4)} EGP/kWh`, sub: `${fmtPct(I.govtEscalationPct)}/yr escalation` },
            { label: "Debt Amount", value: fmtEgp(m.debtAmount), sub: `${I.loanTenorYears}y tenor · ${I.graceYears}y grace` },
            { label: "Equity Cheque", value: fmtEgp(m.paidInEquity), sub: `${fmtPct(1 - I.debtPct)} of total CAPEX` },
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
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#002060] mb-2">CAPEX Breakdown</h3>
            <table className="w-full text-xs">
              <tbody>
                {m.capexBreakdown.map((item, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="py-1">{item.label}</td>
                    <td className="py-1 text-right font-mono">{fmtEgp(item.totalEgp)}</td>
                    <td className="py-1 text-right text-muted-foreground">{fmtPct(item.totalEgp / m.totalCapexEgp, 1)}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-1.5">Total CAPEX (incl. IDC)</td>
                  <td className="py-1.5 text-right font-mono">{fmtEgp(m.totalCapexEgp)}</td>
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
                  <td className="py-1 text-right text-muted-foreground">{fmtPct(m.debtAmount / m.totalCapexEgp, 1)}</td>
                </tr>
                {m.shareholderLoan > 0 && (
                  <tr className="border-b border-border/30">
                    <td className="py-1">Shareholder Loan</td>
                    <td className="py-1 text-right font-mono">{fmtEgp(m.shareholderLoan)}</td>
                    <td className="py-1 text-right text-muted-foreground">{fmtPct(m.shareholderLoan / m.totalCapexEgp, 1)}</td>
                  </tr>
                )}
                <tr className="border-b border-border/30">
                  <td className="py-1">Sponsor Equity</td>
                  <td className="py-1 text-right font-mono">{fmtEgp(m.paidInEquity)}</td>
                  <td className="py-1 text-right text-muted-foreground">{fmtPct(m.paidInEquity / m.totalCapexEgp, 1)}</td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-1.5">Total</td>
                  <td className="py-1.5 text-right font-mono">{fmtEgp(m.totalCapexEgp)}</td>
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
              { risk: "Solar resource / yield risk", mitigation: `P${I.yieldCase === "P50" ? "50" : "90"} case used; lender stress at P90 (−7%) recommended` },
              { risk: "Tariff / off-take risk", mitigation: `${I.contractType} structure with ${fmtPct(I.govtEscalationPct)} annual escalation; government counterparty` },
              { risk: "CAPEX overrun", mitigation: `${fmtPct(I.contingencyPct)} contingency included; EPC lump-sum contract recommended` },
              { risk: "OPEX / degradation", mitigation: `${fmtPct(I.lossThereafterPct)}/yr degradation modelled; O&M indexed at ${fmtPct(I.opexYoYPct)}/yr` },
              { risk: "Interest rate risk", mitigation: "Fixed spread structure; sensitivity run at base rate +300 bps" },
              { risk: "Construction timeline", mitigation: `${I.constructionMonths}-month EPC schedule; delay scenario should be stress-tested` },
            ].map((r, i) => (
              <div key={i} className="rounded bg-[#f0f4f8] p-2">
                <div className="font-semibold text-[#002060]">{r.risk}</div>
                <div className="text-muted-foreground mt-0.5">{r.mitigation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground flex gap-1 items-center"><TrendingUp className="h-3 w-3"/>Equity IRR</div><div className="font-mono font-semibold text-base">{fmtPct(m.equityIRR)}</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground flex gap-1 items-center"><Zap className="h-3 w-3"/>LCOE</div><div className="font-mono font-semibold text-base">{fmtNum(m.lcoeEgpPerKwh, 3)} EGP/kWh</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground flex gap-1 items-center"><Shield className="h-3 w-3"/>Min DSCR</div><div className="font-mono font-semibold text-base">{fmtNum(m.minDSCR, 2)}x</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">CAPEX</div><div className="font-mono font-semibold text-base">{fmtEgp(m.totalCapexEgp)}</div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {recs.map((r, i) => <Item key={i} r={r}/>)}
      </div>
    </div>
  );
};
