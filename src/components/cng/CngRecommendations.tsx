import { CngOutputs, fmtNum, fmtPct, fmtEgp } from "@/lib/cngModel";
import { CheckCircle2, AlertTriangle, Info, TrendingUp, Shield, Zap, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

type Rec = { level: "good" | "warn" | "info"; title: string; body: string };
type ScoreItem = { metric: string; value: string; benchmark: string; verdict: "strong" | "ok" | "weak"; weight: number; rationale: string };

function buildScore(m: CngOutputs) {
  const I = m.inputs;
  const items: ScoreItem[] = [];
  const ke = I.discountRateEquity;
  const irr = Number.isFinite(m.equityIRR) ? m.equityIRR : -1;
  const spread = irr - ke;
  items.push({ metric: "Equity IRR vs cost of equity", value: `${fmtPct(irr)} vs ${fmtPct(ke)} (spread ${fmtPct(spread)})`, benchmark: "≥ +300 bps strong, 0–300 ok, <0 weak", verdict: spread >= 0.03 ? "strong" : spread >= 0 ? "ok" : "weak", weight: 0.25, rationale: "Does the project clear the equity hurdle?" });
  items.push({ metric: "Equity IRR (absolute)", value: fmtPct(irr), benchmark: "≥ 25% strong, 18–25% ok (EGP downstream)", verdict: irr >= 0.25 ? "strong" : irr >= 0.18 ? "ok" : "weak", weight: 0.15, rationale: "Absolute return target for EGP CNG equity." });
  const pb = m.paybackYears, pbOk = Number.isFinite(pb) && pb > 0;
  items.push({ metric: "Equity payback", value: pbOk ? `${fmtNum(pb, 1)} yrs` : "n/a", benchmark: "≤ 4y strong, 4–6y ok", verdict: !pbOk ? "weak" : pb <= 4 ? "strong" : pb <= 6 ? "ok" : "weak", weight: 0.10, rationale: "Time to recover equity cheque." });
  const cushion = m.minDSCR - 1.3;
  items.push({ metric: "Min DSCR cushion", value: `${fmtNum(m.minDSCR, 2)}x`, benchmark: "≥ +0.10x strong, 0–0.10 ok", verdict: cushion >= 0.1 ? "strong" : cushion >= 0 ? "ok" : "weak", weight: 0.15, rationale: "Lender covenant headroom." });
  const util = m.utilizationPct;
  items.push({ metric: "Trailer utilisation", value: fmtPct(util), benchmark: "60–90% optimal", verdict: util >= 0.60 && util <= 0.90 ? "strong" : util > 0 && util <= 0.95 ? "ok" : "weak", weight: 0.10, rationale: "Right-sized fleet vs demand." });
  const projSpread = m.projectIRR - I.discountRateProject;
  items.push({ metric: "Project IRR vs WACC proxy", value: `${fmtPct(m.projectIRR)} vs ${fmtPct(I.discountRateProject)}`, benchmark: "≥ +200 bps strong", verdict: projSpread >= 0.02 ? "strong" : projSpread >= 0 ? "ok" : "weak", weight: 0.10, rationale: "Asset-level value creation." });
  items.push({ metric: "Effective gearing", value: fmtPct(I.debtPct), benchmark: "60–75% optimal", verdict: I.debtPct >= 0.6 && I.debtPct <= 0.75 ? "strong" : I.debtPct >= 0.5 && I.debtPct <= 0.8 ? "ok" : "weak", weight: 0.10, rationale: "Leverage discipline." });
  const tail = I.contractYears - I.loanTenorYears;
  items.push({ metric: "Contract tail vs debt", value: `${fmtNum(tail, 1)} yrs`, benchmark: "≥ 2y strong", verdict: tail >= 2 ? "strong" : tail >= 0 ? "ok" : "weak", weight: 0.05, rationale: "Tail protects shareholders." });

  const map = { strong: 1, ok: 0.6, weak: 0.15 } as const;
  const num = items.reduce((s, it) => s + it.weight * map[it.verdict], 0);
  const den = items.reduce((s, it) => s + it.weight, 0);
  const score = Math.round((num / den) * 100);
  let verdict: "Invest" | "Conditional" | "Pass", headline: string;
  if (score >= 75) { verdict = "Invest"; headline = "Strong shareholder case — proceed."; }
  else if (score >= 55) { verdict = "Conditional"; headline = "Workable — close the gaps below."; }
  else { verdict = "Pass"; headline = "Does not meet shareholder thresholds."; }
  return { items, score, verdict, headline };
}

const Badge = ({ v }: { v: ScoreItem["verdict"] }) => {
  const cls = v === "strong" ? "bg-success/15 text-success border-success/30" : v === "ok" ? "bg-primary/10 text-primary border-primary/30" : "bg-destructive/10 text-destructive border-destructive/30";
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>{v === "strong" ? "Strong" : v === "ok" ? "Acceptable" : "Weak"}</span>;
};

const Verdict = ({ m }: { m: CngOutputs }) => {
  const { items, score, verdict, headline } = buildScore(m);
  const ringColor = verdict === "Invest" ? "text-success" : verdict === "Conditional" ? "text-primary" : "text-destructive";
  const Icon = verdict === "Invest" ? ThumbsUp : verdict === "Conditional" ? Minus : ThumbsDown;
  return (
    <div className="rounded-xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)] space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl bg-secondary p-2.5 ${ringColor}`}><Icon className="h-6 w-6"/></div>
          <div><h2 className="text-lg font-semibold">Shareholder verdict</h2><p className="text-sm text-muted-foreground max-w-2xl">{headline}</p></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right"><div className="text-xs text-muted-foreground uppercase">Score</div><div className={`text-3xl font-bold font-mono ${ringColor}`}>{score}<span className="text-base text-muted-foreground">/100</span></div></div>
          <div className={`rounded-lg border px-3 py-2 text-sm font-semibold ${verdict === "Invest" ? "border-success/40 bg-success/10 text-success" : verdict === "Conditional" ? "border-primary/40 bg-primary/10 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive"}`}>{verdict}</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground border-b border-border"><tr className="text-left">
            <th className="py-2 pr-3 font-medium">Metric</th><th className="py-2 pr-3 font-medium">Value</th><th className="py-2 pr-3 font-medium">Benchmark</th><th className="py-2 pr-3 font-medium">Verdict</th><th className="py-2 font-medium">Why</th>
          </tr></thead>
          <tbody>{items.map((it, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              <td className="py-2 pr-3 font-medium">{it.metric}</td>
              <td className="py-2 pr-3 font-mono">{it.value}</td>
              <td className="py-2 pr-3 text-muted-foreground text-xs">{it.benchmark}</td>
              <td className="py-2 pr-3"><Badge v={it.verdict}/></td>
              <td className="py-2 text-muted-foreground text-xs">{it.rationale}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

function buildRecs(m: CngOutputs): Rec[] {
  const I = m.inputs;
  const out: Rec[] = [];
  const y1 = m.rows.find(r => r.yearIdx === 0);
  const y1Price = y1 && y1.volumeM3 > 0 ? y1.revenue / y1.volumeM3 : 0;

  if (m.minDSCR < 1.3) out.push({ level: "warn", title: `Min DSCR ${fmtNum(m.minDSCR, 2)}x is below 1.30x`, body: "Reduce gearing, extend tenor, or revisit pricing/volume assumptions." });
  else out.push({ level: "good", title: `DSCR cushion ok (min ${fmtNum(m.minDSCR, 2)}x / avg ${fmtNum(m.avgDSCR, 2)}x)`, body: "Coverage profile satisfies typical PF covenants." });

  if (m.utilizationPct > 0.95) out.push({ level: "warn", title: `Trailer utilisation ${fmtPct(m.utilizationPct)} — fleet is undersized`, body: "Add another trailer/truck or improve trip productivity to absorb peak demand." });
  else if (m.utilizationPct < 0.5) out.push({ level: "info", title: `Low utilisation ${fmtPct(m.utilizationPct)}`, body: "Fleet is oversized vs current demand. Consider deferring trailer CAPEX." });

  if (y1Price > 0 && m.lcomEgpPerM3 > y1Price) out.push({ level: "warn", title: `LCOM³ ${fmtNum(m.lcomEgpPerM3, 3)} EGP/m³ exceeds Y1 price ${fmtNum(y1Price, 3)}`, body: "Project is value-destructive at this price. Renegotiate transport tariff or cut variable cost." });
  else if (y1Price > 0) out.push({ level: "good", title: `LCOM³ ${fmtNum(m.lcomEgpPerM3, 3)} < price ${fmtNum(y1Price, 3)} EGP/m³`, body: `Margin of ${fmtNum(y1Price - m.lcomEgpPerM3, 3)} EGP/m³ provides cushion.` });

  if (Number.isFinite(m.equityIRR) && m.equityIRR < I.discountRateEquity) out.push({ level: "warn", title: `Equity IRR ${fmtPct(m.equityIRR)} below cost of equity ${fmtPct(I.discountRateEquity)}`, body: "Tighten OPEX, raise tariff or restructure debt." });

  if (I.loanTenorYears > I.contractYears) out.push({ level: "warn", title: `Debt tenor ${I.loanTenorYears}y exceeds contract ${I.contractYears}y`, body: "Tail risk: keep tenor at least 1–2y inside contract horizon." });

  out.push({ level: "info", title: "Lender stress cases to run", body: "Volume −15%, OPEX +10%, fuel/electricity +20%, rate +300 bps. Min DSCR should stay ≥ 1.10x." });
  return out;
}

const Item = ({ r }: { r: Rec }) => {
  const icon = r.level === "good" ? <CheckCircle2 className="h-5 w-5"/> : r.level === "warn" ? <AlertTriangle className="h-5 w-5"/> : <Info className="h-5 w-5"/>;
  const color = r.level === "good" ? "text-success border-success/30 bg-success/5" : r.level === "warn" ? "text-destructive border-destructive/30 bg-destructive/5" : "text-primary border-primary/30 bg-primary/5";
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="space-y-1"><div className="font-semibold text-foreground">{r.title}</div><p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p></div>
      </div>
    </div>
  );
};

export const CngRecommendations = ({ m }: { m: CngOutputs }) => {
  const recs = buildRecs(m);
  return (
    <div className="space-y-6">
      <Verdict m={m}/>
      <div className="rounded-xl border border-border bg-[var(--gradient-card)] p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3"><Shield className="h-6 w-6 text-primary"/>
          <div><h2 className="text-lg font-semibold">Model recommendations</h2><p className="text-sm text-muted-foreground">Best-practice diagnostics from your assumptions.</p></div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground flex gap-1 items-center"><TrendingUp className="h-3 w-3"/>Equity IRR</div><div className="font-mono font-semibold text-base">{fmtPct(m.equityIRR)}</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground flex gap-1 items-center"><Zap className="h-3 w-3"/>LCOM³</div><div className="font-mono font-semibold text-base">{fmtNum(m.lcomEgpPerM3, 3)} EGP/m³</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground flex gap-1 items-center"><Shield className="h-3 w-3"/>Min DSCR</div><div className="font-mono font-semibold text-base">{fmtNum(m.minDSCR, 2)}x</div></div>
          <div className="rounded-lg bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">CAPEX</div><div className="font-mono font-semibold text-base">{fmtEgp(m.totalCapexEgp)}</div></div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{recs.map((r, i) => <Item key={i} r={r}/>)}</div>
    </div>
  );
};
