import * as React from "react";
import type { ModelOutput, Inputs } from "@/lib/rab/types";
import { KPICard } from "./RabKPICard";
import { fmtMSAR, fmtPct, fmtSAR, fmtTariff } from "@/lib/rab/format";
import { irr, npv } from "@/lib/rab/finance";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ReferenceLine,
} from "recharts";

const CHART_COLORS = [
  "var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)",
  "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-chart-6)",
];

const tooltipStyle = {
  backgroundColor: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: "6px",
  fontSize: "11px",
};

export type DashboardMode = "summary" | "charts" | "output" | "all";

export function Dashboard({ out, inp, mode = "all" }: { out: ModelOutput; inp: Inputs; mode?: DashboardMode }) {
  const { kpi, rows, lcoeBreakdown } = out;
  const show = (m: DashboardMode) => mode === "all" || mode === m;

  const ownershipLabel = inp.ownership === "saudi" ? "100% Saudi/GCC" : inp.ownership === "foreign" ? "100% Foreign" : `Mixed ${Math.round(inp.saudiPct*100)}/${100-Math.round(inp.saudiPct*100)}`;
  const taxLabel = inp.ownership === "saudi" ? `Zakat ${(inp.zakatRate*100).toFixed(3)}%` : inp.ownership === "foreign" ? `CIT ${(inp.citRate*100).toFixed(0)}%` : "Zakat + CIT";

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      {show("summary") && <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Key Metrics</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <KPICard tone="gold" label="Ownership" value={<span className="text-sm">{ownershipLabel}</span>} sub={taxLabel} />
          <KPICard tone="gold" label="RAB Tariff (Avg)" value={fmtTariff(kpi.rabTariffAvg)} sub="SAR/MMBtu" />
          <KPICard label="LCOE (RAB)" value={fmtTariff(kpi.lcoeRAB)} sub="SAR/MMBtu" />
          <KPICard label="LCOE (Unlevered)" value={fmtTariff(kpi.lcoeUnlevered)} sub="SAR/MMBtu" />
          <KPICard tone={kpi.projectIRR > inp.wacc ? "success" : "destructive"} label="Project IRR" value={fmtPct(kpi.projectIRR)} sub={`vs WACC ${fmtPct(inp.wacc)}`} />
          <KPICard tone={kpi.equityIRR > inp.wacc ? "success" : "warning"} label="Equity IRR" value={fmtPct(kpi.equityIRR)} />
          <KPICard tone={kpi.dividendIRR > inp.wacc ? "success" : "warning"} label="Dividend IRR" value={fmtPct(kpi.dividendIRR)} sub="net of WHT" />
          <KPICard label="NPV @ WACC" value={fmtMSAR(kpi.npv) + " SAR"} />
          <KPICard label="Payback" value={kpi.paybackYears ?? "—"} sub="years" />
          <KPICard label="Total CapEx" value={fmtMSAR(kpi.totalCapex) + " SAR"} />
          <KPICard label="Total Revenue (30y)" value={fmtMSAR(kpi.totalRevenue) + " SAR"} />
          <KPICard label="Min DSCR" value={kpi.minDSCR !== null ? kpi.minDSCR.toFixed(2) + "x" : "—"} tone={kpi.minDSCR && kpi.minDSCR >= 1.2 ? "success" : "warning"} />
          <KPICard label="Peak Overdraft" value={fmtPct(kpi.peakOverdraftPct)} />
          <KPICard label="Total Tax/Zakat" value={fmtMSAR(kpi.totalTaxZakat) + " SAR"} />
          <KPICard label="Effective Tax Rate" value={(() => {
            const totEbt = rows.reduce((s,r)=>s+Math.max(0,r.ebt),0);
            return totEbt > 0 ? ((kpi.totalTaxZakat / totEbt) * 100).toFixed(2) + "%" : "—";
          })()} sub="lifetime" />
          <KPICard label="Loss Pool Remaining" value={fmtMSAR(kpi.closingLossPool)} sub={kpi.lossPoolExhaustYear ? `Exhausted ${kpi.lossPoolExhaustYear}` : "—"} />
        </div>
      </section>}

      {/* Risk Flags */}
      {show("summary") && <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Risk Flags</h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <Flag ok={kpi.projectIRR > inp.wacc} label="Project IRR > WACC" />
          <Flag ok={kpi.minDSCR === null || kpi.minDSCR >= 1.2} label="Min DSCR ≥ 1.20x" />
          <Flag ok={kpi.peakOverdraftPct <= 1} label="Overdraft within limit" />
          <Flag ok={rows.some(r => r.netProfit > 0)} label="Profitability achieved" />
          {(inp.ownership !== "saudi") && (
            <Flag ok={kpi.closingLossPool === 0} label="Loss pool exhausted" />
          )}
          <Flag ok={rows[rows.length-1].closingRAB < kpi.totalCapex * 0.05} label="Terminal RAB ≈ 0" />
        </div>
      </section>}

      {/* Building Blocks Chart */}
      {show("charts") && <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">6 Building Blocks Stack (Revenue Requirement)</h2>
        <div className="h-72 rounded-lg border border-border bg-card p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows.map(r => ({
              year: r.year,
              "BB1 Return": r.bb1Return,
              "BB2 Depreciation": r.bb2Dep,
              "BB3 Tax/Zakat": r.bb3Tax,
              "BB4 Controllable": r.bb4Controllable,
              "BB5 Pass-Through": r.bb5PassThrough,
              "BB6 Recon": r.bb6Recon,
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v)=>fmtMSAR(v)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtSAR(v, 0)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {["BB1 Return","BB2 Depreciation","BB3 Tax/Zakat","BB4 Controllable","BB5 Pass-Through","BB6 Recon"].map((k,i)=>(
                <Bar key={k} dataKey={k} stackId="a" fill={CHART_COLORS[i]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>}

      {show("charts") && <div className="grid gap-6 lg:grid-cols-2">
        {/* Tariff Comparison */}
        <ChartCard title="Tariff: RAB vs Actual vs LCOE">
          <LineChart data={rows.filter(r => !r.isConstruction).map(r => ({
            year: r.year, "RAB Tariff": r.rabTariff, "Actual": r.actualTariff, "LCOE": kpi.lcoeRAB,
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtTariff(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="RAB Tariff" stroke={CHART_COLORS[0]} dot={false} />
            <Line type="monotone" dataKey="Actual" stroke={CHART_COLORS[1]} dot={false} />
            <Line type="monotone" dataKey="LCOE" stroke={CHART_COLORS[2]} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ChartCard>

        {/* Revenue stack */}
        <ChartCard title="Revenue / Cost Stack">
          <AreaChart data={rows.map(r => ({
            year: r.year, Revenue: r.totalRevenue, COGS: r.cogs, OPEX: r.gAndA, "D&A": r.da,
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v)=>fmtMSAR(v)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtSAR(v, 0)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Revenue" stackId="r" stroke={CHART_COLORS[2]} fill={CHART_COLORS[2]} fillOpacity={0.4} />
            <Area type="monotone" dataKey="COGS" stackId="c" stroke={CHART_COLORS[3]} fill={CHART_COLORS[3]} fillOpacity={0.4} />
            <Area type="monotone" dataKey="OPEX" stackId="c" stroke={CHART_COLORS[4]} fill={CHART_COLORS[4]} fillOpacity={0.4} />
            <Area type="monotone" dataKey="D&A" stackId="c" stroke={CHART_COLORS[5]} fill={CHART_COLORS[5]} fillOpacity={0.4} />
          </AreaChart>
        </ChartCard>

        {/* Cumulative FCF */}
        <ChartCard title="Cumulative Free Cash Flow (Payback)">
          <LineChart data={rows.map(r => ({ year: r.year, "Cum FCF": r.cumulativeFCF }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v)=>fmtMSAR(v)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtSAR(v, 0)} />
            <Line type="monotone" dataKey="Cum FCF" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>

        {/* Debt + overdraft */}
        <ChartCard title="Debt & Overdraft Balance">
          <AreaChart data={rows.map(r => ({ year: r.year, Debt: r.ltDebtBalance, Overdraft: r.overdraftBalance }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v)=>fmtMSAR(v)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtSAR(v, 0)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Debt" stackId="d" stroke={CHART_COLORS[1]} fill={CHART_COLORS[1]} fillOpacity={0.4} />
            <Area type="monotone" dataKey="Overdraft" stackId="d" stroke={CHART_COLORS[3]} fill={CHART_COLORS[3]} fillOpacity={0.4} />
          </AreaChart>
        </ChartCard>

        {/* Volume & customers */}
        <ChartCard title="Customer & Volume Growth">
          <LineChart data={rows.map(r => ({ year: r.year, Customers: r.customers, "Volume (MMBtu)": r.volumeMMBtu }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} />
            <YAxis yAxisId="l" stroke="var(--color-muted-foreground)" fontSize={10} />
            <YAxis yAxisId="r" orientation="right" stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v)=>fmtMSAR(v)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtSAR(v, 0)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="l" type="monotone" dataKey="Customers" stroke={CHART_COLORS[0]} dot={false} />
            <Line yAxisId="r" type="monotone" dataKey="Volume (MMBtu)" stroke={CHART_COLORS[2]} dot={false} />
          </LineChart>
        </ChartCard>

        {/* LCOE donut */}
        <ChartCard title="LCOE Component Breakdown">
          <PieChart>
            <Pie data={lcoeBreakdown.filter(x=>x.value>0)} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={60} outerRadius={100}>
              {lcoeBreakdown.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtTariff(v) + " SAR/MMBtu"} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ChartCard>

        {/* Project IRR Cash Flows */}
        <ChartCard title={`Project Cash Flows (IRR ${fmtPct(kpi.projectIRR)})`}>
          <BarChart data={rows.map(r => ({ year: r.year, "Project FCF": r.fcf }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v)=>fmtMSAR(v)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtSAR(v, 0)} />
            <ReferenceLine y={0} stroke="var(--color-muted-foreground)" />
            <Bar dataKey="Project FCF">
              {rows.map((r, i) => (
                <Cell key={i} fill={r.fcf >= 0 ? "var(--color-success)" : "var(--color-destructive)"} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>

        {/* Equity IRR Cash Flows */}
        <ChartCard title={`Equity Cash Flows (IRR ${fmtPct(kpi.equityIRR)})`}>
          <BarChart data={rows.map(r => ({ year: r.year, "Equity CF": r.equityCashFlow }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v)=>fmtMSAR(v)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtSAR(v, 0)} />
            <ReferenceLine y={0} stroke="var(--color-muted-foreground)" />
            <Bar dataKey="Equity CF">
              {rows.map((r, i) => (
                <Cell key={i} fill={r.equityCashFlow >= 0 ? "var(--color-success)" : "var(--color-destructive)"} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>

        {(inp.ownership !== "saudi") && (
          <ChartCard title="Loss Pool Depletion">
            <BarChart data={rows.map(r=>({year:r.year, "Opening Pool":r.openingLossPool, "Offset Used":r.lossOffsetUsed}))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickFormatter={(v)=>fmtMSAR(v)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v:number)=>fmtSAR(v,0)} />
              <Legend wrapperStyle={{fontSize:11}} />
              <Bar dataKey="Opening Pool" fill={CHART_COLORS[3]} />
              <Bar dataKey="Offset Used" fill={CHART_COLORS[2]} />
            </BarChart>
          </ChartCard>
        )}
      </div>}

      {/* LCOE Breakdown Table */}
      {show("summary") && <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">LCOE Breakdown</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Component</th>
                <th className="px-3 py-2 text-right">SAR/MMBtu</th>
                <th className="px-3 py-2 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lcoeBreakdown.map((c) => (
                <tr key={c.label} className="bg-card">
                  <td className="px-3 py-2">{c.label}</td>
                  <td className="px-3 py-2 text-right num">{fmtTariff(c.value)}</td>
                  <td className="px-3 py-2 text-right num">{(c.pct * 100).toFixed(2)}%</td>
                </tr>
              ))}
              <tr className="bg-gold/10 font-semibold">
                <td className="px-3 py-2">Total LCOE</td>
                <td className="px-3 py-2 text-right num text-gold">{fmtTariff(kpi.lcoeRAB)}</td>
                <td className="px-3 py-2 text-right num">100.00%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>}

      {show("output") && (<React.Fragment>
      {/* RAB / Building Blocks */}
      <TransposedTable
        title="RAB Schedule & Building Blocks"
        years={rows.map(r => r.year)}
        rows={[
          { label: "Opening RAB", values: rows.map(r => fmtMSAR(r.openingRAB)) },
          { label: "+ CapEx Additions", values: rows.map(r => fmtMSAR(r.capexAdditions)) },
          { label: "− Depreciation", values: rows.map(r => fmtMSAR(r.depreciation)) },
          { label: "+ RAB Indexation", values: rows.map(r => fmtMSAR(r.rabIndex)) },
          { label: "Closing RAB", values: rows.map(r => fmtMSAR(r.closingRAB)), bold: true },
          { label: "Average RAB", values: rows.map(r => fmtMSAR(r.averageRAB)) },
          { label: "BB1 — Return on Capital", values: rows.map(r => fmtMSAR(r.bb1Return)) },
          { label: "BB2 — Depreciation", values: rows.map(r => fmtMSAR(r.bb2Dep)) },
          { label: "BB3 — Tax / Zakat", values: rows.map(r => fmtMSAR(r.bb3Tax)) },
          { label: "BB4 — Controllable OPEX", values: rows.map(r => fmtMSAR(r.bb4Controllable)) },
          { label: "BB5 — Pass-Through OPEX", values: rows.map(r => fmtMSAR(r.bb5PassThrough)) },
          { label: "BB6 — Reconciliation", values: rows.map(r => fmtMSAR(r.bb6Recon)) },
          { label: "Revenue Requirement", values: rows.map(r => fmtMSAR(r.revenueRequirement)), bold: true },
          { label: "Volume (MMBtu)", values: rows.map(r => fmtMSAR(r.volumeMMBtu)) },
          { label: "RAB Tariff (SAR/MMBtu)", values: rows.map(r => fmtTariff(r.rabTariff)) },
          { label: "Actual Tariff (SAR/MMBtu)", values: rows.map(r => fmtTariff(r.actualTariff)) },
        ]}
      />

      {/* CWIP */}
      <TransposedTable
        title="CWIP Schedule (Construction Period)"
        years={rows.filter(r => r.cwipSpend > 0 || r.cwipTransfer > 0).map(r => r.year)}
        rows={(() => {
          const cw = rows.filter(r => r.cwipSpend > 0 || r.cwipTransfer > 0);
          return [
            { label: "Opening CWIP", values: cw.map(r => fmtMSAR(r.cwipOpening)) },
            { label: "+ CapEx Spend", values: cw.map(r => fmtMSAR(r.cwipSpend)) },
            { label: "+ WACC Return (AFUDC)", values: cw.map(r => fmtMSAR(r.cwipReturn)) },
            { label: "Closing CWIP", values: cw.map(r => fmtMSAR(r.cwipClosing)), bold: true },
            { label: "Transfer to RAB", values: cw.map(r => fmtMSAR(r.cwipTransfer)) },
          ];
        })()}
      />

      {/* CapEx Schedule */}
      <TransposedTable
        title="CapEx Schedule"
        years={rows.map(r => r.year)}
        rows={(() => {
          const initNames = Array.from(new Set(rows.flatMap(r => r.initialCapexBreakdown.map(b => b.name))));
          const initRows = initNames.map(name => ({
            label: `   • ${name}`,
            values: rows.map(r => {
              const b = r.initialCapexBreakdown.find(x => x.name === name);
              return b ? fmtMSAR(b.amount) : "—";
            }),
          }));
          const replNames = Array.from(new Set(rows.flatMap(r => r.replacementBreakdown.map(b => b.name))));
          const replRows = replNames.map(name => ({
            label: `   • ${name}`,
            values: rows.map(r => {
              const b = r.replacementBreakdown.find(x => x.name === name);
              return b ? fmtMSAR(b.amount) : "—";
            }),
          }));
          return [
            { label: "Initial CapEx (commissioned, ex-VAT)", values: rows.map(r => fmtMSAR(r.initialCapexAdded)), bold: true },
            ...initRows,
            { label: "Replacement CapEx (short-life, ex-VAT)", values: rows.map(r => fmtMSAR(r.replacementCapexAdded)), bold: true },
            ...replRows,
            { label: `Connection CapEx (New Customers, ${inp.connectionCapexLife}y life, ex-VAT)`, values: rows.map(r => fmtMSAR(r.connectionCapexAdded)) },
            { label: "Total CapEx Additions (RAB, ex-VAT)", values: rows.map(r => fmtMSAR(r.capexAdditions)), bold: true },
            { label: `VAT on CapEx @ ${(inp.capexVATRate*100).toFixed(0)}% (cash only, NOT in RAB)`, values: rows.map(r => fmtMSAR(r.inputVATPaid)), bold: true },
            { label: "Total CapEx Cash Outflow (incl. VAT)", values: rows.map(r => fmtMSAR(r.capexAdditions + r.inputVATPaid)), bold: true },
            { label: "New Customers Added", values: rows.map(r => r.newCustomersAdded ? Math.round(r.newCustomersAdded).toString() : "—") },
            { label: "Depreciation (all vintages, on ex-VAT base)", values: rows.map(r => fmtMSAR(r.depreciation)) },
          ];
        })()}
      />

      {/* Income Statement */}
      <TransposedTable
        title="Income Statement"
        years={rows.map(r => r.year)}
        rows={[
          { label: "Tariff (SAR/MMBtu)", values: rows.map(r => r.actualTariff ? r.actualTariff.toFixed(4) : "—") },
          { label: "Volume (MMBtu)", values: rows.map(r => fmtMSAR(r.volumeMMBtu)) },
          { label: "Gas Distribution Revenue", values: rows.map(r => fmtMSAR(r.gasRevenue)) },
          { label: "Gas Commodity Revenue", values: rows.map(r => fmtMSAR(r.commodityRevenue)) },
          { label: "Connection Revenue", values: rows.map(r => fmtMSAR(r.connectionRevenue)) },
          { label: "Total Revenue", values: rows.map(r => fmtMSAR(r.totalRevenue)), bold: true },
          { label: "COGS", values: rows.map(r => fmtMSAR(-r.cogs)) },
          { label: "Gross Profit", values: rows.map(r => fmtMSAR(r.grossProfit)), bold: true },
          { label: "  Controllable OPEX — Fixed (BB4)", values: rows.map(r => fmtMSAR(-r.bb4Fixed)) },
          { label: "  Controllable OPEX — Variable (BB4, ex-COGS)", values: rows.map(r => fmtMSAR(-(r.gAndA - r.bb4Fixed - r.bb5PassThrough))) },
          { label: "  Pass-Through OPEX (BB5)", values: rows.map(r => fmtMSAR(-r.bb5PassThrough)) },
          { label: "G&A / OPEX (Total)", values: rows.map(r => fmtMSAR(-r.gAndA)), bold: true },
          { label: "EBITDA", values: rows.map(r => fmtMSAR(r.ebitda)), bold: true },
          { label: "Depreciation & Amortization", values: rows.map(r => fmtMSAR(-r.da)) },
          { label: "EBIT", values: rows.map(r => fmtMSAR(r.ebit)), bold: true },
          { label: "Interest Expense", values: rows.map(r => fmtMSAR(-r.interest)) },
          { label: "EBT", values: rows.map(r => fmtMSAR(r.ebt)), bold: true },
          { label: "Zakat", values: rows.map(r => fmtMSAR(-r.zakat)) },
          { label: "Corporate Income Tax", values: rows.map(r => fmtMSAR(-r.cit)) },
          { label: "Effective Tax Rate", values: rows.map(r => r.ebt > 0 ? ((r.taxZakatTotal / r.ebt) * 100).toFixed(2) + "%" : "—") },
          { label: "Net Profit", values: rows.map(r => fmtMSAR(r.netProfit)), bold: true },
        ]}
      />

      {/* Balance Sheet */}
      <TransposedTable
        title="Balance Sheet"
        years={rows.map(r => r.year)}
        rows={(() => {
          const totalAssets = rows.map(r => r.cashBalance + r.netFixedAssets + r.cwipClosing);
          const totalLiab = rows.map(r => r.ltDebtBalance + r.overdraftBalance);
          const totalEquity = rows.map(r => r.shareCapital + r.retainedEarnings);
          return [
            { label: "ASSETS", values: rows.map(() => ""), header: true },
            { label: "  Cash & Equivalents", values: rows.map(r => fmtMSAR(r.cashBalance)) },
            { label: "  Net Fixed Assets", values: rows.map(r => fmtMSAR(r.netFixedAssets)) },
            { label: "  CWIP", values: rows.map(r => fmtMSAR(r.cwipClosing)) },
            { label: "Total Assets", values: totalAssets.map(fmtMSAR), bold: true },
            { label: "LIABILITIES", values: rows.map(() => ""), header: true },
            { label: "  Long-Term Debt", values: rows.map(r => fmtMSAR(r.ltDebtBalance)) },
            { label: "  Overdraft", values: rows.map(r => fmtMSAR(r.overdraftBalance)) },
            { label: "Total Liabilities", values: totalLiab.map(fmtMSAR), bold: true },
            { label: "EQUITY", values: rows.map(() => ""), header: true },
            { label: "  Share Capital", values: rows.map(r => fmtMSAR(r.shareCapital)) },
            { label: "  Retained Earnings", values: rows.map(r => fmtMSAR(r.retainedEarnings)) },
            { label: "Total Equity", values: totalEquity.map(fmtMSAR), bold: true },
            { label: "Total Liab. + Equity", values: totalLiab.map((l, i) => fmtMSAR(l + totalEquity[i])), bold: true },
          ];
        })()}
      />

      {/* Cash Flow Statement */}
      <TransposedTable
        title="Cash Flow Statement"
        years={rows.map(r => r.year)}
        rows={[
          { label: "OPERATING ACTIVITIES", values: rows.map(() => ""), header: true },
          { label: "  Net Profit", values: rows.map(r => fmtMSAR(r.netProfit)) },
          { label: "  + D&A", values: rows.map(r => fmtMSAR(r.da)) },
          { label: "  − Δ Working Capital", values: rows.map(r => fmtMSAR(-r.deltaWorkingCapital)) },
          { label: "Operating Cash Flow", values: rows.map(r => fmtMSAR(r.ocf)), bold: true },
          { label: "INVESTING ACTIVITIES", values: rows.map(() => ""), header: true },
          { label: "  CapEx (ex-VAT)", values: rows.map(r => fmtMSAR(r.icf)) },
          { label: "Investing Cash Flow", values: rows.map(r => fmtMSAR(r.icf)), bold: true },
          { label: "VAT CASH (Off-P&L, Saudi VAT Law)", values: rows.map(() => ""), header: true },
          { label: "  + Output VAT Collected", values: rows.map(r => fmtMSAR(r.outputVATCollected)) },
          { label: "  − Input VAT Paid on CapEx", values: rows.map(r => fmtMSAR(-r.inputVATPaid)) },
          { label: "  − VAT Remitted to ZATCA", values: rows.map(r => fmtMSAR(-r.vatRemitted)) },
          { label: "Net VAT Cash", values: rows.map(r => fmtMSAR(r.netVATCash)), bold: true },
          { label: "Free Cash Flow (incl. VAT)", values: rows.map(r => fmtMSAR(r.fcf)), bold: true },
          { label: "FINANCING ACTIVITIES", values: rows.map(() => ""), header: true },
          { label: "  Debt Drawdown", values: rows.map(r => fmtMSAR(r.debtDrawdown)) },
          { label: "  Debt Repayment", values: rows.map(r => fmtMSAR(-r.debtRepayment)) },
          { label: "  Interest Paid (memo, in NP)", values: rows.map(r => fmtMSAR(-r.interest)) },
          { label: "Cash Balance (EoP)", values: rows.map(r => fmtMSAR(r.cashBalance)), bold: true },
          { label: "Cumulative FCF", values: rows.map(r => fmtMSAR(r.cumulativeFCF)), bold: true },
          { label: "DSCR", values: rows.map(r => r.dscr !== null ? r.dscr.toFixed(2) + "x" : "—") },
        ]}
      />

      {/* Working Capital Schedule */}
      <TransposedTable
        title="Working Capital Schedule"
        years={rows.map(r => r.year)}
        rows={[
          { label: `Accounts Receivable (${inp.daysReceivable}d)`, values: rows.map(r => fmtMSAR(r.accountsReceivable)) },
          { label: `Inventory (${inp.daysInventory}d)`, values: rows.map(r => fmtMSAR(r.inventory)) },
          { label: `Accounts Payable (${inp.daysPayable}d)`, values: rows.map(r => fmtMSAR(-r.accountsPayable)) },
          { label: "Net Working Capital", values: rows.map(r => fmtMSAR(r.workingCapital)), bold: true },
          { label: "Δ Working Capital (cash impact)", values: rows.map(r => fmtMSAR(-r.deltaWorkingCapital)), bold: true },
        ]}
      />

      {/* Loss carry-forward */}
      {(inp.ownership !== "saudi") && (
        <TransposedTable
          title="Loss Carry-Forward Schedule (Art. 21)"
          years={rows.filter(r => !r.isConstruction).map(r => r.year)}
          rows={(() => {
            const op = rows.filter(r => !r.isConstruction);
            return [
              { label: "EBT", values: op.map(r => fmtMSAR(r.ebt)) },
              { label: "Opening Loss Pool", values: op.map(r => fmtMSAR(r.openingLossPool)) },
              { label: "Max Offset (25%)", values: op.map(r => fmtMSAR(r.ebt > 0 ? r.ebt * inp.lossOffsetCap : 0)) },
              { label: "Actual Offset", values: op.map(r => fmtMSAR(r.lossOffsetUsed)) },
              { label: "Taxable Income", values: op.map(r => fmtMSAR(Math.max(0, r.ebt - r.lossOffsetUsed))) },
              { label: "Tax @ 20%", values: op.map(r => fmtMSAR(r.cit)) },
              { label: "Closing Loss Pool", values: op.map(r => fmtMSAR(r.closingLossPool)), bold: true },
            ];
          })()}
        />
      )}

      {/* Zakat schedule */}
      {(inp.ownership !== "foreign") && (
        <TransposedTable
          title="Zakat Schedule (ZATCA 2024)"
          years={rows.map(r => r.isConstruction ? `${r.year} (C)` : `${r.year}`)}
          rows={(() => {
            const op = rows;
            return [
              { label: "Share Capital", values: op.map(r => fmtMSAR(r.shareCapital)) },
              { label: "Retained Earnings", values: op.map(r => fmtMSAR(r.retainedEarnings)) },
              { label: "LT Debt", values: op.map(r => fmtMSAR(r.ltDebtBalance)) },
              { label: "Net Fixed Assets", values: op.map(r => fmtMSAR(r.netFixedAssets)) },
              { label: "CWIP", values: op.map(r => fmtMSAR(r.cwipClosing)) },
              { label: "Raw Zakat Base", values: op.map(r => r.isConstruction ? "—" : fmtMSAR(r.zakatBaseRaw)) },
              { label: "Final Zakat Base", values: op.map(r => r.isConstruction ? "—" : fmtMSAR(r.zakatBaseFinal)), bold: true },
              { label: "Zakat Due (SAR)", values: op.map(r => r.isConstruction ? "—" : fmtSAR(r.zakat, 0)), bold: true },
              { label: "EBT", values: op.map(r => fmtMSAR(r.ebt)) },
              { label: "Effective Tax Rate", values: op.map(r => r.isConstruction ? "—" : (r.ebt > 0 ? ((r.taxZakatTotal / r.ebt) * 100).toFixed(2) + "%" : "—")), bold: true },
            ];
          })()}
        />
      )}
      {/* Project IRR — Detailed Cash Flow Build-up */}
      <TransposedTable
        title={`Project IRR — Detailed Cash Flow Build-up (IRR ${fmtPct(kpi.projectIRR)})`}
        years={rows.map(r => r.year)}
        rows={(() => {
          let cum = 0;
          return [
            { label: "Total Revenue", values: rows.map(r => fmtMSAR(r.totalRevenue)) },
            { label: "  Gas / Tariff Revenue", values: rows.map(r => fmtMSAR(r.gasRevenue)) },
            { label: "  Commodity Revenue", values: rows.map(r => fmtMSAR(r.commodityRevenue)) },
            { label: "  Connection Revenue", values: rows.map(r => fmtMSAR(r.connectionRevenue)) },
            { label: "COGS", values: rows.map(r => fmtMSAR(-r.cogs)) },
            { label: "G&A / OPEX", values: rows.map(r => fmtMSAR(-r.gAndA)) },
            { label: "EBITDA", values: rows.map(r => fmtMSAR(r.ebitda)), bold: true },
            { label: "− Tax / Zakat", values: rows.map(r => fmtMSAR(-r.taxZakatTotal)) },
            { label: "− Δ Working Capital", values: rows.map(r => fmtMSAR(-r.deltaWorkingCapital)) },
            { label: "− CapEx (ex-VAT)", values: rows.map(r => fmtMSAR(r.icf)) },
            { label: "    Initial CapEx", values: rows.map(r => fmtMSAR(-r.initialCapexAdded)) },
            { label: "    Connection CapEx", values: rows.map(r => fmtMSAR(-r.connectionCapexAdded)) },
            { label: "    Expansion CapEx", values: rows.map(r => fmtMSAR(-r.expansionCapexAdded)) },
            { label: "    Replacement CapEx", values: rows.map(r => fmtMSAR(-r.replacementCapexAdded)) },
            { label: "+ Net VAT Cash (off-P&L)", values: rows.map(r => fmtMSAR(r.netVATCash)) },
            { label: "Free Cash Flow (Project, incl. VAT)", values: rows.map(r => fmtMSAR(r.fcf)), bold: true },
            { label: "Cumulative FCF", values: rows.map(r => { cum += r.fcf; return fmtMSAR(cum); }), bold: true },
          ];
        })()}
      />

      {/* Equity IRR — Detailed Cash Flow Build-up */}
      <TransposedTable
        title={`Equity IRR — Detailed Cash Flow Build-up (IRR ${fmtPct(kpi.equityIRR)})`}
        years={rows.map(r => r.year)}
        rows={(() => {
          let cum = 0;
          let prevSC = 0;
          const equityInj = rows.map(r => {
            const inj = r.isConstruction ? Math.max(0, r.shareCapital - prevSC) : 0;
            prevSC = r.shareCapital;
            return inj;
          });
          return [
            { label: "Free Cash Flow (Project, incl. VAT)", values: rows.map(r => fmtMSAR(r.fcf)) },
            { label: "+ Debt Drawdown", values: rows.map(r => fmtMSAR(r.debtDrawdown)) },
            { label: "− Debt Repayment", values: rows.map(r => fmtMSAR(-r.debtRepayment)) },
            { label: "− Interest Paid (memo, already in NP)", values: rows.map(r => fmtMSAR(-r.interest)) },
            { label: "FCF to Equity (after debt service, incl. VAT)", values: rows.map(r => fmtMSAR(r.fcfEquity)), bold: true },
            { label: "− Equity Contribution", values: equityInj.map(v => fmtMSAR(-v)) },
            { label: "Net Equity Cash Flow", values: rows.map(r => fmtMSAR(r.equityCashFlow)), bold: true },
            { label: "Cumulative Equity CF", values: rows.map(r => { cum += r.equityCashFlow; return fmtMSAR(cum); }), bold: true },
            { label: "Net Profit (memo)", values: rows.map(r => fmtMSAR(r.netProfit)) },
            { label: "Net VAT Cash (memo, included above)", values: rows.map(r => fmtMSAR(r.netVATCash)) },
          ];
        })()}
      />

      {/* Dividend IRR — Detailed Build-up */}
      <TransposedTable
        title={`Dividend IRR — Detailed Cash Flow Build-up (IRR ${fmtPct(kpi.dividendIRR)})`}
        years={rows.map(r => r.year)}
        rows={(() => {
          let cum = 0;
          let prevSC = 0;
          const equityInj = rows.map(r => {
            const inj = r.isConstruction ? Math.max(0, r.shareCapital - prevSC) : 0;
            prevSC = r.shareCapital;
            return inj;
          });
          const lastIdx = rows.length - 1;
          const lastRow = rows[lastIdx];
          const terminalEquity = lastRow ? Math.max(0, lastRow.shareCapital + lastRow.retainedEarnings) : 0;
          return [
            { label: "Net Profit", values: rows.map(r => fmtMSAR(r.netProfit)) },
            { label: `× Payout Ratio (${(inp.dividendPayoutRatio*100).toFixed(0)}%)`, values: rows.map(r => fmtMSAR(r.dividend)) },
            { label: "Gross Dividend", values: rows.map(r => fmtMSAR(r.dividend)), bold: true },
            { label: `− Withholding Tax (${(inp.withholdingTaxRate*100).toFixed(2)}%)`, values: rows.map(r => fmtMSAR(-r.dividendWHT)) },
            { label: "Net Dividend to Shareholder", values: rows.map(r => fmtMSAR(r.dividendNet)), bold: true },
            { label: "− Equity Contribution", values: equityInj.map(v => fmtMSAR(-v)) },
            { label: "+ Terminal Book Equity (final yr)", values: rows.map((_, i) => fmtMSAR(i === lastIdx ? terminalEquity : 0)) },
            { label: "Dividend Cash Flow to Shareholder", values: rows.map((r, i) => fmtMSAR(r.dividendNet - equityInj[i] + (i === lastIdx ? terminalEquity : 0))), bold: true },
            { label: "Cumulative Dividend CF", values: rows.map((r, i) => { cum += r.dividendNet - equityInj[i] + (i === lastIdx ? terminalEquity : 0); return fmtMSAR(cum); }), bold: true },
            { label: "Retained Earnings (memo)", values: rows.map(r => fmtMSAR(r.retainedEarnings)) },
          ];
        })()}
      />

      {/* New Customers — Connection Project IRR */}
      <NewCustomersConnectionIRR rows={rows} inp={inp} />

      {/* VAT Schedule — Saudi VAT Law: cash-only, recovery capped at total input VAT paid on CapEx */}
      <TransposedTable
        title={`VAT Schedule (15% — Cash-Only, Off P&L) — Recovery Capped at Total CapEx VAT`}
        years={rows.map(r => r.year)}
        rows={(() => {
          const totalInputVAT = rows.reduce((s, r) => s + r.inputVATPaid, 0);
          const cumIn: number[] = []; const cumOut: number[] = []; const cumRem: number[] = [];
          const recYear: number[] = []; const cumRec: number[] = []; const cumNet: number[] = [];
          let aIn=0,aOut=0,aRem=0,aRec=0,aNet=0;
          rows.forEach(r => {
            aIn += r.inputVATPaid; cumIn.push(aIn);
            aOut += r.outputVATCollected; cumOut.push(aOut);
            aRem += r.vatRemitted; cumRem.push(aRem);
            const rec = r.outputVATCollected - r.vatRemitted; recYear.push(rec);
            aRec += rec; cumRec.push(aRec);
            aNet += r.netVATCash; cumNet.push(aNet);
          });
          return [
            { label: "Input VAT Paid on CapEx (cash out)", values: rows.map(r => fmtMSAR(r.inputVATPaid)) },
            { label: "Cumulative Input VAT (recovery ceiling)", values: cumIn.map(v => fmtMSAR(v)), bold: true },
            { label: "Output VAT Collected on Distribution Rev. (cash in)", values: rows.map(r => fmtMSAR(r.outputVATCollected)) },
            { label: "Cumulative Output VAT Collected", values: cumOut.map(v => fmtMSAR(v)) },
            { label: "VAT Recoverable Balance (EoP)", values: rows.map(r => fmtMSAR(r.vatRecoverable)), bold: true },
            { label: "VAT Recovered This Year (output offset vs. capex VAT)", values: recYear.map(v => fmtMSAR(v)) },
            { label: "Cumulative VAT Recovered (capped at Total Input VAT)", values: cumRec.map(v => fmtMSAR(v)), bold: true },
            { label: "VAT Remitted to ZATCA (cash out)", values: rows.map(r => fmtMSAR(r.vatRemitted)) },
            { label: "Cumulative VAT Remitted to ZATCA", values: cumRem.map(v => fmtMSAR(v)) },
            { label: "Net VAT Cash Flow (in − out − remitted)", values: rows.map(r => fmtMSAR(r.netVATCash)), bold: true },
            { label: "Cumulative Net VAT Cash", values: cumNet.map(v => fmtMSAR(v)), bold: true },
            { label: "Total Input VAT Paid (project lifetime)", values: rows.map((_, i) => i === rows.length - 1 ? fmtMSAR(totalInputVAT) : "—") },
          ];
        })()}
      />
      </React.Fragment>)}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Flag({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs ${ok ? "border-success/40 bg-success/5 text-success" : "border-destructive/40 bg-destructive/5 text-destructive"}`}>
      <span>{ok ? "✓" : "✕"}</span>
      <span>{label}</span>
    </div>
  );
}

interface TRow { label: string; values: (string | number)[]; bold?: boolean; header?: boolean }
function TransposedTable({ title, years, rows }: { title: string; years: (number | string)[]; rows: TRow[] }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead className="bg-secondary text-[10px] uppercase text-muted-foreground sticky top-0">
            <tr>
              <th className="sticky left-0 z-10 bg-secondary whitespace-nowrap px-2 py-2 text-left min-w-[200px]">Line Item</th>
              {years.map(y => (
                <th key={y} className="whitespace-nowrap px-2 py-2 text-right">{y}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => (
              <tr key={i} className={r.header ? "bg-secondary/60" : "bg-card"}>
                <td className={`sticky left-0 z-10 whitespace-nowrap px-2 py-1.5 text-left ${r.header ? "bg-secondary/60 font-semibold uppercase text-[10px] tracking-wide text-muted-foreground" : r.bold ? "bg-card font-semibold text-foreground" : "bg-card font-medium text-foreground"}`}>{r.label}</td>
                {r.values.map((v, j) => (
                  <td key={j} className={`whitespace-nowrap px-2 py-1.5 num text-right ${r.bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ScrollTable({
  title, head, body, rowClass,
}: { title: string; head: string[]; body: (string | number)[][]; rowClass?: (i: number) => string }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead className="bg-secondary text-[10px] uppercase text-muted-foreground">
            <tr>
              {head.map((h, i) => (
                <th key={i} className={`whitespace-nowrap px-2 py-2 ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {body.map((r, i) => (
              <tr key={i} className={`bg-card ${rowClass?.(i) ?? ""}`}>
                {r.map((c, j) => (
                  <td key={j} className={`whitespace-nowrap px-2 py-1.5 num ${j === 0 ? "text-left font-medium text-foreground" : "text-right text-muted-foreground"}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NewCustomersConnectionIRR({ rows, inp }: { rows: import("@/lib/rab/types").YearRow[]; inp: Inputs }) {
  // Cohort-aggregated mini-project: investment = connection capex per year,
  // inflows = connection fees (year of connection) + ongoing distribution revenue
  // attributable to cumulative new customers (volume × actual tariff).
  const post = rows.filter(r => !r.isConstruction);
  if (post.length === 0) return null;

  let cumNew = 0;
  const series = post.map((r) => {
    cumNew += r.newCustomersAdded;
    const escVolGrowth = Math.pow(1 + inp.volumeGrowth, Math.max(0, r.idx - (inp.commissioningYear - inp.constructionStartYear + 1)));
    const distRev = cumNew * inp.volPerNewCustomerMMBtu * escVolGrowth * r.actualTariff;
    const connFee = r.newCustomersAdded * inp.connectionFee;
    const capex = r.connectionCapexAdded;
    const netCF = connFee + distRev - capex;
    return { year: r.year, newCust: r.newCustomersAdded, cumNew, capex, connFee, distRev, netCF };
  });

  const cfs = series.map(s => s.netCF);
  const projectIRR = irr(cfs);
  const projectNPV = npv(inp.wacc, cfs);
  const totalCapex = series.reduce((s, x) => s + x.capex, 0);
  const totalFees = series.reduce((s, x) => s + x.connFee, 0);
  const totalDist = series.reduce((s, x) => s + x.distRev, 0);
  let cum = 0;
  let payback: number | null = null;
  for (let i = 0; i < cfs.length; i++) { cum += cfs[i]; if (cum >= 0) { payback = i + 1; break; } }
  const coverageRatio = totalCapex > 0 ? totalFees / totalCapex : 0;

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        New Customers — Connection Project IRR
      </h2>
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <KPICard tone={projectIRR > inp.wacc ? "success" : "destructive"} label="Cohort IRR" value={fmtPct(projectIRR)} sub={`vs WACC ${fmtPct(inp.wacc)}`} />
        <KPICard label="NPV @ WACC" value={fmtMSAR(projectNPV) + " SAR"} />
        <KPICard label="Payback" value={payback ?? "—"} sub="yrs after comm." />
        <KPICard label="Total Conn. CapEx" value={fmtMSAR(totalCapex) + " SAR"} />
        <KPICard label="Total Conn. Fees" value={fmtMSAR(totalFees) + " SAR"} />
        <KPICard tone={coverageRatio >= 1 ? "success" : "warning"} label="Fees / CapEx" value={(coverageRatio * 100).toFixed(1) + "%"} sub={coverageRatio >= 1 ? "Fees cover CapEx" : "Fees short of CapEx"} />
      </div>
      <TransposedTable
        title="Cohort Cash Flows"
        years={series.map(s => s.year)}
        rows={[
          { label: "New Customers Added", values: series.map(s => Math.round(s.newCust).toString()) },
          { label: "Cumulative New Customers", values: series.map(s => Math.round(s.cumNew).toString()) },
          { label: "− Connection CapEx", values: series.map(s => fmtMSAR(-s.capex)) },
          { label: "+ Connection Fees", values: series.map(s => fmtMSAR(s.connFee)) },
          { label: "+ Distribution Revenue (new cust.)", values: series.map(s => fmtMSAR(s.distRev)) },
          { label: "Net Cash Flow", values: series.map(s => fmtMSAR(s.netCF)), bold: true },
        ]}
      />
      <p className="mt-2 text-[11px] text-muted-foreground">
        IRR treats each year's new-customer connections as a mini-project: CapEx outflow = New Customers × Connection CapEx per Customer; inflows = one-time connection fees plus ongoing distribution revenue (volume × actual tariff) from cumulative new customers. Distribution revenue uses the volume-growth toggle from Sensitivity. Total project size shown: {fmtMSAR(totalDist)} SAR lifetime distribution revenue.
      </p>
    </section>
  );
}
