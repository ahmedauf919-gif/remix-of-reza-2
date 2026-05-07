import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { WaterInputs, WaterOutputs, fmtNum, fmtPct, fmtEgp } from "./waterModel";

export async function generateWaterMemo(I: WaterInputs, m: WaterOutputs) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  doc.setFillColor(11, 37, 69);
  doc.rect(0, 0, W, 80, "F");
  doc.setTextColor(255); doc.setFontSize(20); doc.setFont("helvetica", "bold");
  doc.text("Investment Memorandum — Water (SWRO)", 40, 38);
  doc.setFontSize(11); doc.setFont("helvetica", "normal");
  doc.text(`${I.projectName} · ${today}`, 40, 58);

  doc.setTextColor(0);
  let y = 110;
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.text("Executive Summary", 40, y); y += 8;
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  const rec = m.minDSCR >= 1.3 && m.equityIRR >= 0.15
    ? "RECOMMEND PROCEED — financial metrics meet underwriting thresholds."
    : m.minDSCR >= 1.1
    ? "PROCEED WITH CAUTION — debt metrics adequate; review equity returns."
    : "DO NOT PROCEED AS STRUCTURED — DSCR below covenant threshold.";
  y += 14;
  doc.text(doc.splitTextToSize(rec, W - 80), 40, y); y += 30;

  autoTable(doc, {
    startY: y, theme: "grid",
    head: [["Metric", "Value"]],
    body: [
      ["Total CAPEX (EGP)", fmtEgp(m.totalCapexWithIdc)],
      ["Debt / Equity", `${fmtEgp(m.debtAmount)} / ${fmtEgp(m.equityAmount)}`],
      ["Capacity (m³/day)", fmtNum(I.capacityM3Day)],
      ["Selling Price (EGP/m³)", fmtNum(I.sellingPriceEgpPerM3)],
      ["LCOM³ (EGP/m³)", fmtNum(m.lcom3, 2)],
      ["Project IRR", fmtPct(m.projectIRR)],
      ["Equity IRR", fmtPct(m.equityIRR)],
      ["Min DSCR / Avg DSCR", `${fmtNum(m.minDSCR, 2)} / ${fmtNum(m.avgDSCR, 2)}`],
      ["Equity Payback (years)", fmtNum(m.equityPaybackYears, 1)],
    ],
    styles: { fontSize: 10 },
  });

  doc.addPage();
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.text("CAPEX Breakdown", 40, 50);
  autoTable(doc, {
    startY: 60, theme: "grid",
    head: [["Item", "EGP", "% Total"]],
    body: [
      ["Feed System", fmtEgp(m.feedSysEgp), fmtPct(m.feedSysEgp / m.totalCapexWithIdc)],
      ["Pretreatment", fmtEgp(m.pretreatmentEgp), fmtPct(m.pretreatmentEgp / m.totalCapexWithIdc)],
      ["RO Unit", fmtEgp(m.roUnitEgp), fmtPct(m.roUnitEgp / m.totalCapexWithIdc)],
      ["BW/CIP", fmtEgp(m.bwCipEgp), fmtPct(m.bwCipEgp / m.totalCapexWithIdc)],
      ["Installation", fmtEgp(m.installationEgpAll), fmtPct(m.installationEgpAll / m.totalCapexWithIdc)],
      ["Drilling", fmtEgp(m.drillingEgp), fmtPct(m.drillingEgp / m.totalCapexWithIdc)],
      ["IDC", fmtEgp(m.idc), fmtPct(m.idc / m.totalCapexWithIdc)],
      ["Total", fmtEgp(m.totalCapexWithIdc), "100%"],
    ],
    styles: { fontSize: 10 },
  });

  const opRows = m.rows.filter(r => r.yearIdx >= 0).slice(0, 12);
  doc.addPage();
  doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.text("Income Statement (first 12 years, EGP '000)", 40, 50);
  autoTable(doc, {
    startY: 60, theme: "striped",
    head: [["Yr", "Revenue", "OpEx", "EBITDA", "Dep.", "Interest", "Net Profit", "DSCR"]],
    body: opRows.map(r => [
      r.year,
      fmtNum(r.revenue / 1000),
      fmtNum(-(r.operatingCost + r.sga) / 1000),
      fmtNum(r.ebitda / 1000),
      fmtNum(-r.depreciation / 1000),
      fmtNum(-r.interest / 1000),
      fmtNum(r.netProfit / 1000),
      isFinite(r.dscr) ? fmtNum(r.dscr, 2) : "—",
    ]),
    styles: { fontSize: 9 },
  });

  doc.save(`investment-memo-water-${I.projectName.replace(/\s+/g, "-")}.pdf`);
}
