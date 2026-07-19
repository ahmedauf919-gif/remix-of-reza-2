import PptxGenJS from "pptxgenjs";
import taqaLogo from "@/assets/taqa-logo.png";

const NAVY = "002060";
const BLUE = "005298";
const GREEN = "009045";
const DARK = "2F2F2F";
const AMBER = "D97706";
const GOV_RED = "B91C1C";
const SLATE_BG = "F1F5F9";
const SLATE_TEXT = "475569";
const WHITE = "FFFFFF";
const FONT = "Arial";

export interface PvPptxYear {
  year: number;
  /** What the client would pay the grid at the full escalating government tariff (EGP, millions). */
  govCostM: number;
  /** What the client actually pays TAQA under the discounted rate (EGP, millions). */
  clientCostM: number;
}

export interface PvPptxData {
  headline: string;
  intro: string;
  kWp: number;
  area: number;
  discountPct: number;
  waccPct: number;
  govTariff: number;
  voltageLabel: string;
  savingsY1: number;
  npv: number;
  pureSavings: number;
  co2PerYr: number;
  co2Lifetime: number;
  years: PvPptxYear[];
}

const fmt = (n: number, d = 1) => n.toLocaleString(undefined, { maximumFractionDigits: d });
const fmtM = (n: number, d = 1) => (n / 1e6).toLocaleString(undefined, { maximumFractionDigits: d });

const HIGHLIGHTS = [
  {
    title: "Zero CapEx Rollout",
    desc: "TAQA funds, builds and operates the PV plant on your rooftop or adjacent land — no capital outlay, no execution risk.",
  },
  {
    title: "Guaranteed Tariff Discount",
    desc: "Every kWh is billed at a locked-in discount to the government tariff, escalating with the grid price so savings compound.",
  },
  {
    title: "One Partner, 25-Year Horizon",
    desc: "A single O&M relationship for the life of the plant — TAQA maintains performance while you capture the savings.",
  },
];

async function toDataUri(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Builds an editable PowerPoint slide (native shapes/text/chart, not a flattened
 * image) matching the TAQA deck template, and triggers a .pptx download.
 * The chart explicitly plots two series — government tariff cost vs the
 * client's discounted cost with TAQA — so the saving is visually the gap
 * between two clearly labeled, editable series rather than a single bar.
 */
export async function exportPvPptx(data: PvPptxData): Promise<void> {
  const logoDataUri = await toDataUri(taqaLogo).catch(() => null);

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.333" x 7.5" — standard PowerPoint widescreen
  const W = 13.333, H = 7.5;
  const slide = pptx.addSlide();
  slide.background = { color: WHITE };

  // ── Header ──────────────────────────────────────────────────────────────
  const headerH = 0.85;
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: headerH, fill: { color: DARK }, line: { type: "none" } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: headerH, h: headerH, fill: { color: GREEN }, line: { type: "none" } });
  slide.addText("☀", { x: 0, y: 0, w: headerH, h: headerH, align: "center", valign: "middle", color: WHITE, fontSize: 26, fontFace: FONT });
  slide.addText(
    [
      { text: "PV: ", options: { bold: true, color: WHITE, fontSize: 24 } },
      { text: "Rooftop Savings & Yield", options: { bold: false, color: WHITE, fontSize: 24 } },
    ],
    { x: headerH + 0.25, y: 0, w: 8.3, h: headerH, valign: "middle", fontFace: FONT }
  );
  if (logoDataUri) {
    slide.addShape(pptx.ShapeType.roundRect, { x: W - 1.75, y: headerH / 2 - 0.3, w: 1.4, h: 0.6, fill: { color: WHITE }, rectRadius: 0.06, line: { type: "none" } });
    slide.addImage({ data: logoDataUri, x: W - 1.67, y: headerH / 2 - 0.22, w: 1.24, h: 0.44 });
  }

  const dividerH = 0.06;
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: headerH, w: W, h: dividerH, fill: { color: GREEN }, line: { type: "none" } });

  // ── Body layout budget ───────────────────────────────────────────────────
  const bodyTop = headerH + dividerH + 0.15;
  const outcomesH = 0.45, footerAccentH = 0.05, footerH = 0.45;
  const bodyBottom = H - footerH - footerAccentH - outcomesH;
  const leftX = 0.35, leftW = 6.0;
  const rightX = leftX + leftW + 0.3;
  const rightW = W - rightX - 0.33;

  // ── Left column ──────────────────────────────────────────────────────────
  let y = bodyTop;
  const kickerH = 0.34;
  slide.addShape(pptx.ShapeType.rect, { x: leftX, y, w: leftW, h: kickerH, fill: { color: GREEN }, line: { type: "none" } });
  slide.addText("TAQA PV · ROOFTOP SAVINGS & YIELD", {
    x: leftX + 0.12, y, w: leftW - 0.24, h: kickerH, valign: "middle", color: WHITE, bold: true, fontSize: 11, fontFace: FONT, charSpacing: 1,
  });
  y += kickerH + 0.16;

  const headlineH = 0.6;
  slide.addText(data.headline, { x: leftX, y, w: leftW, h: headlineH, color: NAVY, bold: true, fontSize: 18, fontFace: FONT, valign: "top" });
  y += headlineH + 0.08;

  const introH = 1.0;
  slide.addText(data.intro, {
    x: leftX, y, w: leftW, h: introH, color: SLATE_TEXT, fontSize: 10.5, fontFace: FONT, valign: "top", lineSpacingMultiple: 1.22,
  });
  y += introH + 0.14;

  const cardH = 0.68, cardGap = 0.1;
  HIGHLIGHTS.forEach((h, i) => {
    const cy = y + i * (cardH + cardGap);
    slide.addShape(pptx.ShapeType.rect, { x: leftX, y: cy, w: leftW, h: cardH, fill: { color: SLATE_BG }, line: { type: "none" } });
    slide.addShape(pptx.ShapeType.rect, { x: leftX, y: cy, w: 0.06, h: cardH, fill: { color: GREEN }, line: { type: "none" } });
    slide.addText(h.title, { x: leftX + 0.18, y: cy + 0.05, w: leftW - 0.32, h: 0.26, color: BLUE, bold: true, fontSize: 11.5, fontFace: FONT });
    slide.addText(h.desc, { x: leftX + 0.18, y: cy + 0.29, w: leftW - 0.32, h: cardH - 0.32, color: SLATE_TEXT, fontSize: 9, fontFace: FONT, valign: "top", lineSpacingMultiple: 1.1 });
  });
  y += 3 * cardH + 2 * cardGap + 0.16;

  const statH = Math.max(0.7, bodyBottom - y);
  const statGap = 0.12;
  const statW = (leftW - 2 * statGap) / 3;
  const stats = [
    { value: `EGP ${fmtM(data.savingsY1)}M`, label: "Saved In Year 1" },
    { value: `EGP ${fmtM(data.npv)}M`, label: `NPV At ${fmt(data.waccPct, 0)}% WACC` },
    { value: `${fmt(data.co2PerYr, 0)} t`, label: "CO₂ Avoided Per Year" },
  ];
  stats.forEach((s, i) => {
    const sx = leftX + i * (statW + statGap);
    slide.addShape(pptx.ShapeType.rect, { x: sx, y, w: statW, h: statH, fill: { color: SLATE_BG }, line: { type: "none" } });
    slide.addShape(pptx.ShapeType.rect, { x: sx, y, w: 0.06, h: statH, fill: { color: GREEN }, line: { type: "none" } });
    slide.addText(s.value, { x: sx + 0.14, y: y + 0.08, w: statW - 0.24, h: 0.34, color: BLUE, bold: true, fontSize: 15, fontFace: FONT });
    slide.addText(s.label, { x: sx + 0.14, y: y + 0.42, w: statW - 0.24, h: statH - 0.46, color: SLATE_TEXT, fontSize: 8, fontFace: FONT, valign: "top" });
  });

  // ── Right column — native, editable combo chart replaces the photo ──────
  const captionH = 0.5;
  const chartY = bodyTop;
  const chartH = bodyBottom - chartY - captionH;
  const years = data.years.map(yr => `Y${yr.year}`);

  slide.addChart(
    [
      {
        type: pptx.ChartType.bar,
        data: [{ name: `Your Cost With TAQA (${data.discountPct}% off, EGP M)`, labels: years, values: data.years.map(yr => yr.clientCostM) }],
        options: { chartColors: [AMBER] },
      },
      {
        type: pptx.ChartType.line,
        data: [{ name: "Government Tariff Cost (EGP M)", labels: years, values: data.years.map(yr => yr.govCostM) }],
        options: { chartColors: [GOV_RED], lineSize: 2.5, lineDataSymbol: "none" },
      },
    ],
    {
      x: rightX, y: chartY, w: rightW, h: chartH,
      showLegend: true, legendPos: "t", legendFontSize: 9, legendColor: SLATE_TEXT,
      showTitle: false,
      catAxisLabelFontSize: 7, catAxisLabelColor: SLATE_TEXT,
      valAxisLabelFontSize: 8, valAxisLabelColor: SLATE_TEXT,
      valAxisTitle: "EGP, millions", showValAxisTitle: true, valAxisTitleFontSize: 8,
      barGapWidthPct: 30,
      valGridLine: { color: "E2E8F0", style: "solid", size: 0.75 },
      catGridLine: { style: "none" },
    }
  );

  slide.addShape(pptx.ShapeType.rect, { x: rightX, y: chartY + chartH, w: rightW, h: captionH, fill: { color: DARK }, line: { type: "none" } });
  slide.addText(`EGP ${fmtM(data.pureSavings, 0)}M Saved Over 25 Years — The Gap Between The Lines`, {
    x: rightX + 0.18, y: chartY + chartH, w: rightW - 0.36, h: captionH, valign: "middle", color: WHITE, bold: true, fontSize: 12.5, fontFace: FONT,
  });

  // ── Key outcomes strip ───────────────────────────────────────────────────
  const outY = bodyBottom;
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: outY, w: W, h: outcomesH, fill: { color: BLUE }, line: { type: "none" } });
  const outcomes = [
    { label: "Rooftop capacity", value: `${fmt(data.kWp, 0)} kWp` },
    { label: "Site footprint", value: `${fmt(data.area, 0)} m²` },
    { label: "Discount vs government tariff", value: `${fmt(data.discountPct, 0)}%` },
    { label: "25-yr CO₂ avoided", value: `${fmt(data.co2Lifetime, 0)} t` },
  ];
  slide.addText("KEY OUTCOMES", { x: 0.35, y: outY, w: 1.5, h: outcomesH, valign: "middle", color: WHITE, bold: true, fontSize: 10, fontFace: FONT, charSpacing: 1 });
  const outColW = (W - 2.1) / outcomes.length;
  outcomes.forEach((o, i) => {
    const ox = 2.0 + i * outColW;
    slide.addText(
      [
        { text: `${o.value}  `, options: { bold: true, color: WHITE, fontSize: 12 } },
        { text: o.label, options: { color: "DBEAFE", fontSize: 9.5 } },
      ],
      { x: ox, y: outY, w: outColW - 0.1, h: outcomesH, valign: "middle", fontFace: FONT }
    );
  });

  // ── Footer ───────────────────────────────────────────────────────────────
  const footerAccentY = outY + outcomesH;
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: footerAccentY, w: W, h: footerAccentH, fill: { color: GREEN }, line: { type: "none" } });
  const footerY = footerAccentY + footerAccentH;
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: footerY, w: W, h: footerH, fill: { color: DARK }, line: { type: "none" } });
  if (logoDataUri) {
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: footerY + 0.06, w: 0.85, h: footerH - 0.12, fill: { color: WHITE }, rectRadius: 0.05, line: { type: "none" } });
    slide.addImage({ data: logoDataUri, x: 0.36, y: footerY + 0.1, w: 0.73, h: footerH - 0.2 });
  }
  slide.addText(
    [
      { text: "A World ", options: { italic: true, color: "CBD5E1", fontSize: 11 } },
      { text: "OF ENERGY", options: { bold: true, color: WHITE, fontSize: 11 } },
    ],
    { x: W - 3.0, y: footerY, w: 2.7, h: footerH, align: "right", valign: "middle", fontFace: FONT }
  );

  await pptx.writeFile({ fileName: `PV-Rooftop-Savings-${Math.round(data.kWp)}kWp.pptx` });
}
