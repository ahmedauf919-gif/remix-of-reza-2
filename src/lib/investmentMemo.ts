import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ModelOutputs, ProjectInputs, fmt, fmtPct } from "./windModel";
import taqaLogo from "@/assets/taqa-logo.jpg";

const NAVY: [number, number, number] = [11, 37, 69];
const ACCENT: [number, number, number] = [30, 96, 145];
const MUTED: [number, number, number] = [91, 107, 122];
const LIGHT: [number, number, number] = [234, 242, 248];

async function loadImage(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.readAsDataURL(blob);
  });
}

export async function generateInvestmentMemo(I: ProjectInputs, m: ModelOutputs) {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const logoData = await loadImage(taqaLogo);

  const development = I.preConstructionCosts + I.developmentPremiums + I.developmentExpenses
    + I.land + I.esMeasures + I.lendersTechAdvisors + I.legalExpenses
    + I.administrativeCosts + I.financialAudit + I.insuranceConstruction;

  const usesRows: [string, number][] = ([
    ["EPC costs", I.epcCost],
    ["Development & soft costs", development],
    ["Substation", I.substation],
    ["Contingency", I.contingency],
    ["Taxes (capex)", I.taxesCapex],
    ["Loan repayment (existing)", I.loanRepayment],
    [`DSRA (${I.dsraTargetMonths}-mo)`, m.dsraInitialAuto],
    ["IDC", m.idc],
    ["Upfront fees", m.upfrontFee],
    ["Commitment fees", m.commitmentFee],
  ] as [string, number][]).filter(([, v]) => v > 0);

  const sourcesRows: [string, number][] = ([
    ["Senior debt", m.debtAmount],
    ["Common equity", m.commonEquityAmount],
    ["Preferential equity", m.prefEquityAmount],
    ["Shareholder loan", m.shLoanAmount],
  ] as [string, number][]).filter(([, v]) => v > 0);

  const cf = m.rows.slice(0, Math.min(10, m.rows.length));

  const recommendation =
    m.minDSCR >= I.targetDSCR && m.commonEquityIRR >= 0.12
      ? "RECOMMEND PROCEED — financial metrics meet underwriting thresholds."
      : m.minDSCR >= I.targetDSCR
      ? "PROCEED WITH CAUTION — debt metrics pass; equity returns below 12% benchmark."
      : "DO NOT PROCEED AS STRUCTURED — DSCR below covenant; restructure required.";

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 54;
  const contentW = pageW - margin * 2;
  let y = margin;

  const center = (text: string, yy: number, size = 11, color: [number, number, number] = [0, 0, 0], bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, pageW / 2, yy, { align: "center" });
  };

  const addLogos = (yy: number, h = 50) => {
    const w = h; // square-ish
    doc.addImage(logoData, "JPEG", margin, yy, w, h);
    doc.addImage(logoData, "JPEG", pageW - margin - w, yy, w, h);
  };

  const ensureSpace = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const h1 = (s: string) => {
    ensureSpace(40);
    y += 10;
    doc.setDrawColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setLineWidth(1.2);
    center(s, y + 14, 16, NAVY, true);
    y += 20;
    doc.line(margin, y, pageW - margin, y);
    y += 16;
  };

  const h2 = (s: string) => {
    ensureSpace(28);
    y += 6;
    center(s, y + 12, 13, ACCENT, true);
    y += 22;
  };

  const para = (s: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(s, contentW);
    ensureSpace(lines.length * 14 + 4);
    lines.forEach((ln: string) => {
      doc.text(ln, pageW / 2, y, { align: "center" });
      y += 14;
    });
    y += 4;
  };

  const bullet = (s: string) => para("•  " + s);

  const dataTable = (head: string[], body: string[][]) => {
    autoTable(doc, {
      startY: y,
      head: [head],
      body,
      theme: "grid",
      styles: { font: "helvetica", fontSize: 9.5, halign: "center", cellPadding: 5, textColor: [40, 40, 40] },
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], halign: "center", fontStyle: "bold" },
      alternateRowStyles: { fillColor: LIGHT },
      margin: { left: margin, right: margin },
      tableWidth: contentW,
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 12;
  };

  const kpiTable = (rows: { label: string; value: string; sub?: string }[]) => {
    const cols = 3;
    const body: string[][] = [];
    for (let i = 0; i < rows.length; i += cols) {
      const slice = rows.slice(i, i + cols);
      while (slice.length < cols) slice.push({ label: "", value: "" });
      body.push(slice.map(r => `${r.label}\n${r.value}${r.sub ? "\n" + r.sub : ""}`));
    }
    autoTable(doc, {
      startY: y,
      body,
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10, halign: "center", valign: "middle", cellPadding: 8, fillColor: LIGHT, textColor: NAVY, fontStyle: "bold", minCellHeight: 50 },
      margin: { left: margin, right: margin },
      tableWidth: contentW,
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 12;
  };

  // ── Cover ─────────────────────────────────────────────────────────
  addLogos(margin, 60);
  y = margin + 180;
  center("INVESTMENT MEMORANDUM", y, 14, ACCENT, true); y += 36;
  center(I.projectName, y, 28, NAVY, true); y += 36;
  center(`${I.capacityMWp} MWp Renewable Energy Project`, y, 14, MUTED); y += 30;
  center(`Scenario: ${I.scenario}`, y, 12, MUTED); y += 18;
  center(today, y, 12, MUTED); y += 80;
  center("STRICTLY PRIVATE & CONFIDENTIAL", y, 11, NAVY, true);

  doc.addPage();
  y = margin;

  // ── 1. Executive Summary ───────────────────────────────────────────
  h1("1. Executive Summary");
  para(`This memorandum presents ${I.projectName}, a ${I.capacityMWp} MWp utility-scale renewable energy facility seeking project financing. The transaction has been structured under a ${I.sizingMode === "dscr-sculpted" ? "DSCR-sculpted" : "fixed-gearing"} debt sizing approach with a target DSCR of ${fmt(I.targetDSCR)}x and a tenor of ${I.debtTenorYears} years.`);
  h2("Key Financial Metrics");
  kpiTable([
    { label: "TOTAL CAPITALIZATION", value: `$${fmt(m.totalUses / 1000)}m`, sub: `${I.capacityMWp} MWp` },
    { label: "EFFECTIVE GEARING", value: fmtPct(m.effectiveGearing), sub: I.sizingMode === "dscr-sculpted" ? "DSCR-sculpted" : "Fixed" },
    { label: "PROJECT IRR", value: fmtPct(m.projectIRR), sub: "Pre-financing" },
    { label: "EQUITY IRR (COMMON)", value: fmtPct(m.commonEquityIRR), sub: `Blended ${fmtPct(m.blendedEquityIRR)}` },
    { label: "MIN DSCR", value: `${fmt(m.minDSCR)}x`, sub: `Avg ${fmt(m.avgDSCR)}x` },
    { label: "LCOE", value: `${fmt(m.lcoeUsdPerKWh * 100, 2)}¢/kWh`, sub: "Levelized" },
  ]);
  h2("Recommendation");
  para(recommendation);

  // ── 2. Transaction Overview ────────────────────────────────────────
  h1("2. Transaction Overview");
  dataTable(["Parameter", "Value"], [
    ["Project name", I.projectName],
    ["Installed capacity", `${fmt(I.capacityMWp)} MWp`],
    ["Scenario", I.scenario],
    ["Tariff", `${(I.tariffUsdPerKWh * 100).toFixed(2)}¢/kWh (${I.tariffCurrency})`],
    ["Tariff fixed period", `${I.tariffFixedYears} years`],
    ["Availability assumption", fmtPct(I.availability)],
    ["Annual degradation", fmtPct(I.degradation, 2)],
    ["Debt sizing mode", I.sizingMode === "dscr-sculpted" ? "DSCR-sculpted" : "Fixed gearing"],
    ["Target DSCR", `${fmt(I.targetDSCR)}x`],
    ["Debt tenor", `${I.debtTenorYears} years`],
    ["Senior debt rate", fmtPct(I.interestRate)],
    ["DSRA target", `${I.dsraTargetMonths} months`],
  ]);

  // ── 3. Sources & Uses ──────────────────────────────────────────────
  h1("3. Sources & Uses of Funds");
  h2("Uses of Funds (USD '000)");
  dataTable(["Item", "Amount", "% Total"], [
    ...usesRows.map(([l, v]) => [l, fmt(v), fmtPct(v / m.totalUses, 1)]),
    ["TOTAL USES", fmt(m.totalUses), "100.0%"],
  ]);
  h2("Sources of Funds (USD '000)");
  dataTable(["Item", "Amount", "% Total"], [
    ...sourcesRows.map(([l, v]) => [l, fmt(v), fmtPct(v / m.totalSources, 1)]),
    ["TOTAL SOURCES", fmt(m.totalSources), "100.0%"],
  ]);

  // ── 4. Returns ─────────────────────────────────────────────────────
  h1("4. Returns Analysis");
  kpiTable([
    { label: "PROJECT IRR", value: fmtPct(m.projectIRR), sub: `NPV $${fmt(m.npvProject / 1000)}m` },
    { label: "EQUITY IRR (BLENDED)", value: fmtPct(m.blendedEquityIRR), sub: `NPV $${fmt(m.npvEquity / 1000)}m` },
    { label: "EQUITY PAYBACK", value: isNaN(m.paybackYears) ? "—" : `${m.paybackYears} yrs`, sub: "Cumulative CFFI" },
    { label: "COMMON EQUITY IRR", value: fmtPct(m.commonEquityIRR) },
    { label: "PREF. EQUITY IRR", value: fmtPct(m.prefEquityIRR) },
    { label: "SH. LOAN IRR", value: fmtPct(m.shLoanIRR) },
  ]);

  // ── 5. Debt ────────────────────────────────────────────────────────
  h1("5. Debt Structure & Coverage");
  dataTable(["Metric", "Value"], [
    ["Senior debt drawn", `$${fmt(m.debtAmount / 1000)}m`],
    ["Effective gearing", fmtPct(m.effectiveGearing)],
    ["Blended cost of debt", fmtPct(m.blendedRate)],
    ["Tenor", `${I.debtTenorYears} years`],
    ["Loan life", `${m.loanLifeYears} years`],
    ["Min DSCR", `${fmt(m.minDSCR)}x`],
    ["Avg DSCR", `${fmt(m.avgDSCR)}x`],
    ["Min LLCR", `${fmt(m.minLLCR)}x`],
    ["Min PLCR", `${fmt(m.minPLCR)}x`],
    ["DSCR covenant", m.debtServiceCoverageOk ? "PASS" : "BREACH"],
  ]);

  // ── 6. Cashflow ────────────────────────────────────────────────────
  h1("6. Operating Cashflow Snapshot");
  para(`First ${cf.length} years of operations (USD '000)`);
  dataTable(["Year", "Revenue", "EBITDA", "CFADS", "Debt service", "DSCR"],
    cf.map(r => [String(r.year), fmt(r.revenue), fmt(r.ebitda), fmt(r.cfads), fmt(-r.debtService), `${fmt(r.dscr)}x`]),
  );

  // ── 7. Risks ───────────────────────────────────────────────────────
  h1("7. Key Risks & Mitigants");
  h2("Resource & Production");
  bullet(`Energy yield: ${fmt(I.capacityMWp)} MWp at ${fmtPct(I.availability)} availability with ${fmtPct(I.degradation, 2)} annual degradation.`);
  bullet("Mitigant: Independent yield assessment and long-term performance warranties from EPC contractor.");
  h2("Revenue & Offtake");
  bullet(`Tariff of ${(I.tariffUsdPerKWh * 100).toFixed(2)}¢/kWh fixed for ${I.tariffFixedYears} years.`);
  bullet("Mitigant: Long-term PPA with creditworthy offtaker; currency hedging where applicable.");
  h2("Construction & Cost Overrun");
  bullet(`Total capex of $${fmt(m.totalUses / 1000)}m with contingency of $${fmt(I.contingency / 1000)}m.`);
  bullet("Mitigant: Fixed-price turnkey EPC contract with liquidated damages.");
  h2("Financing & Coverage");
  bullet(`Min DSCR of ${fmt(m.minDSCR)}x against ${fmt(I.targetDSCR)}x target; ${I.dsraTargetMonths}-month DSRA in place.`);
  bullet("Mitigant: Cash sweep mechanics and lock-up triggers protect senior lenders.");

  // ── 8. Conclusion ──────────────────────────────────────────────────
  h1("8. Conclusion");
  para(recommendation);
  para(`Based on a project IRR of ${fmtPct(m.projectIRR)}, common equity IRR of ${fmtPct(m.commonEquityIRR)}, and a minimum DSCR of ${fmt(m.minDSCR)}x against the ${fmt(I.targetDSCR)}x covenant, the transaction ${m.debtServiceCoverageOk ? "satisfies" : "does not satisfy"} standard project finance underwriting criteria. The model converged in ${m.iterations} solver iterations.`);

  y += 20;
  ensureSpace(30);
  center("— END OF MEMORANDUM —", y, 11, MUTED);

  // ── Headers/Footers on every page ──────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) {
      doc.addImage(logoData, "JPEG", margin, 18, 32, 32);
      doc.addImage(logoData, "JPEG", pageW - margin - 32, 18, 32, 32);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text(`${I.projectName} · Investment Memorandum · CONFIDENTIAL`, pageW / 2, 36, { align: "center" });
      doc.setDrawColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.setLineWidth(0.5);
      doc.line(margin + 40, 44, pageW - margin - 40, 44);
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(`Prepared ${today}`, margin, pageH - 24);
    doc.text(`Page ${i} of ${totalPages}`, pageW - margin, pageH - 24, { align: "right" });
  }

  doc.save(`${I.projectName.replace(/\s+/g, "_")}_Investment_Memo.pdf`);
}