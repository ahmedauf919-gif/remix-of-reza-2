import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageOrientation,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, Header, Footer,
  PageNumber, LevelFormat, TabStopType, TabStopPosition,
} from "docx";
import { saveAs } from "file-saver";
import { ModelOutputs, ProjectInputs, fmt, fmtPct } from "./windModel";

const NAVY = "0B2545";
const ACCENT = "1E6091";
const MUTED = "5B6B7A";
const LIGHT = "EAF2F8";
const RULE = "C7D3DD";

const border = { style: BorderStyle.SINGLE, size: 4, color: RULE };
const cellBorders = { top: border, bottom: border, left: border, right: border };

const txt = (s: string, opts: any = {}) => new TextRun({ text: s, font: "Calibri", ...opts });
const p = (children: any[], opts: any = {}) => new Paragraph({ children, spacing: { after: 120 }, ...opts });
const h1 = (s: string) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 320, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 4 } },
  children: [new TextRun({ text: s, font: "Calibri", bold: true, size: 30, color: NAVY })],
});
const h2 = (s: string) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 220, after: 100 },
  children: [new TextRun({ text: s, font: "Calibri", bold: true, size: 24, color: ACCENT })],
});
const bullet = (s: string) => new Paragraph({
  numbering: { reference: "memo-bullets", level: 0 },
  spacing: { after: 80 },
  children: [new TextRun({ text: s, font: "Calibri", size: 22 })],
});

function kpiTable(rows: { label: string; value: string; sub?: string }[]) {
  const cols = 3;
  const colWidth = Math.floor(9360 / cols);
  const buckets: typeof rows[] = [];
  for (let i = 0; i < rows.length; i += cols) buckets.push(rows.slice(i, i + cols));
  const trs: TableRow[] = [];
  buckets.forEach(b => {
    while (b.length < cols) b.push({ label: "", value: "" });
    trs.push(new TableRow({
      children: b.map(it => new TableCell({
        borders: cellBorders,
        width: { size: colWidth, type: WidthType.DXA },
        shading: { fill: LIGHT, type: ShadingType.CLEAR, color: "auto" },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        children: [
          new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: it.label, font: "Calibri", size: 16, color: MUTED, bold: true })] }),
          new Paragraph({ spacing: { after: it.sub ? 40 : 0 }, children: [new TextRun({ text: it.value, font: "Calibri", size: 28, bold: true, color: NAVY })] }),
          ...(it.sub ? [new Paragraph({ children: [new TextRun({ text: it.sub, font: "Calibri", size: 16, color: MUTED })] })] : []),
        ],
      })),
    }));
  });
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: Array(cols).fill(colWidth),
    rows: trs,
  });
}

function dataTable(headers: string[], rows: string[][]) {
  const colWidth = Math.floor(9360 / headers.length);
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: Array(headers.length).fill(colWidth),
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(h => new TableCell({
          borders: cellBorders,
          width: { size: colWidth, type: WidthType.DXA },
          shading: { fill: NAVY, type: ShadingType.CLEAR, color: "auto" },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: h, font: "Calibri", size: 20, bold: true, color: "FFFFFF" })] })],
        })),
      }),
      ...rows.map((r, i) => new TableRow({
        children: r.map((c, j) => new TableCell({
          borders: cellBorders,
          width: { size: colWidth, type: WidthType.DXA },
          shading: i % 2 === 0 ? undefined : { fill: LIGHT, type: ShadingType.CLEAR, color: "auto" },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            alignment: j === 0 ? AlignmentType.LEFT : AlignmentType.RIGHT,
            children: [new TextRun({ text: c, font: "Calibri", size: 20, bold: j === 0 })],
          })],
        })),
      })),
    ],
  });
}

export async function generateInvestmentMemo(I: ProjectInputs, m: ModelOutputs) {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const development = I.preConstructionCosts + I.developmentPremiums + I.developmentExpenses
    + I.land + I.esMeasures + I.lendersTechAdvisors + I.legalExpenses
    + I.administrativeCosts + I.financialAudit + I.insuranceConstruction;

  const usesRows: [string, number][] = [
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
  ].filter(([, v]) => (v as number) > 0) as [string, number][];

  const sourcesRows: [string, number][] = [
    ["Senior debt", m.debtAmount],
    ["Common equity", m.commonEquityAmount],
    ["Preferential equity", m.prefEquityAmount],
    ["Shareholder loan", m.shLoanAmount],
  ].filter(([, v]) => (v as number) > 0) as [string, number][];

  const cf = m.rows.slice(0, Math.min(10, m.rows.length));

  const recommendation =
    m.minDSCR >= I.targetDSCR && m.commonEquityIRR >= 0.12
      ? "RECOMMEND PROCEED — financial metrics meet underwriting thresholds."
      : m.minDSCR >= I.targetDSCR
      ? "PROCEED WITH CAUTION — debt metrics pass; equity returns below 12% benchmark."
      : "DO NOT PROCEED AS STRUCTURED — DSCR below covenant; restructure required.";

  const doc = new Document({
    creator: "Lovable",
    title: `${I.projectName} — Investment Memorandum`,
    styles: {
      default: { document: { run: { font: "Calibri", size: 22 } } },
    },
    numbering: {
      config: [{
        reference: "memo-bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } },
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      headers: {
        default: new Header({ children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 4 } },
          children: [new TextRun({ text: `${I.projectName} · Investment Memorandum · CONFIDENTIAL`, font: "Calibri", size: 16, color: MUTED })],
        })] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: `Prepared ${today}`, font: "Calibri", size: 16, color: MUTED }),
            new TextRun({ text: "\tPage ", font: "Calibri", size: 16, color: MUTED }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 16, color: MUTED }),
            new TextRun({ text: " of ", font: "Calibri", size: 16, color: MUTED }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Calibri", size: 16, color: MUTED }),
          ],
        })] }),
      },
      children: [
        // Cover
        new Paragraph({ spacing: { before: 1800, after: 200 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "INVESTMENT MEMORANDUM", font: "Calibri", size: 28, bold: true, color: ACCENT, characterSpacing: 80 })] }),
        new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: I.projectName, font: "Calibri", size: 56, bold: true, color: NAVY })] }),
        new Paragraph({ spacing: { after: 600 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `${I.capacityMWp} MWp Renewable Energy Project`, font: "Calibri", size: 24, color: MUTED })] }),
        new Paragraph({ spacing: { after: 80 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `Scenario: ${I.scenario}`, font: "Calibri", size: 22, color: MUTED })] }),
        new Paragraph({ spacing: { after: 1200 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: today, font: "Calibri", size: 22, color: MUTED })] }),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "STRICTLY PRIVATE & CONFIDENTIAL", font: "Calibri", size: 18, bold: true, color: NAVY, characterSpacing: 60 })] }),

        new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }),

        // 1. Executive Summary
        h1("1. Executive Summary"),
        p([txt(`This memorandum presents `), txt(I.projectName, { bold: true }),
          txt(`, a ${I.capacityMWp} MWp utility-scale renewable energy facility seeking project financing. The transaction has been structured under a `),
          txt(`${I.sizingMode === "dscr-sculpted" ? "DSCR-sculpted" : "fixed-gearing"} debt sizing approach`, { bold: true }),
          txt(` with a target DSCR of ${fmt(I.targetDSCR)}x and a tenor of ${I.debtTenorYears} years.`)]),
        h2("Key Financial Metrics"),
        kpiTable([
          { label: "TOTAL CAPITALIZATION", value: `$${fmt(m.totalUses / 1000)}m`, sub: `${I.capacityMWp} MWp` },
          { label: "EFFECTIVE GEARING", value: fmtPct(m.effectiveGearing), sub: I.sizingMode === "dscr-sculpted" ? "DSCR-sculpted" : "Fixed" },
          { label: "PROJECT IRR", value: fmtPct(m.projectIRR), sub: "Pre-financing" },
          { label: "EQUITY IRR (COMMON)", value: fmtPct(m.commonEquityIRR), sub: `Blended ${fmtPct(m.blendedEquityIRR)}` },
          { label: "MIN DSCR", value: `${fmt(m.minDSCR)}x`, sub: `Avg ${fmt(m.avgDSCR)}x` },
          { label: "LCOE", value: `${fmt(m.lcoeUsdPerKWh * 100, 2)}¢/kWh`, sub: "Levelized" },
        ]),
        h2("Recommendation"),
        p([txt(recommendation, { bold: true, color: m.minDSCR >= I.targetDSCR ? NAVY : "B22222" })]),

        // 2. Transaction Overview
        h1("2. Transaction Overview"),
        dataTable(
          ["Parameter", "Value"],
          [
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
          ],
        ),

        // 3. Sources & Uses
        h1("3. Sources & Uses of Funds"),
        h2("Uses of Funds (USD '000)"),
        dataTable(
          ["Item", "Amount", "% Total"],
          [
            ...usesRows.map(([l, v]) => [l, fmt(v), fmtPct(v / m.totalUses, 1)]),
            ["TOTAL USES", fmt(m.totalUses), "100.0%"],
          ],
        ),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 200 } }),
        h2("Sources of Funds (USD '000)"),
        dataTable(
          ["Item", "Amount", "% Total"],
          [
            ...sourcesRows.map(([l, v]) => [l, fmt(v), fmtPct(v / m.totalSources, 1)]),
            ["TOTAL SOURCES", fmt(m.totalSources), "100.0%"],
          ],
        ),

        // 4. Returns Analysis
        h1("4. Returns Analysis"),
        kpiTable([
          { label: "PROJECT IRR", value: fmtPct(m.projectIRR), sub: `NPV $${fmt(m.npvProject / 1000)}m @ ${fmtPct(I.discountRateProject, 1)}` },
          { label: "EQUITY IRR (BLENDED)", value: fmtPct(m.blendedEquityIRR), sub: `NPV $${fmt(m.npvEquity / 1000)}m @ ${fmtPct(I.discountRateEquity, 1)}` },
          { label: "EQUITY PAYBACK", value: isNaN(m.paybackYears) ? "—" : `${m.paybackYears} yrs`, sub: "Cumulative CFFI" },
          { label: "COMMON EQUITY IRR", value: fmtPct(m.commonEquityIRR) },
          { label: "PREF. EQUITY IRR", value: fmtPct(m.prefEquityIRR) },
          { label: "SH. LOAN IRR", value: fmtPct(m.shLoanIRR) },
        ]),

        // 5. Debt Profile
        h1("5. Debt Structure & Coverage"),
        dataTable(
          ["Metric", "Value"],
          [
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
          ],
        ),

        // 6. Cashflow Snapshot
        h1("6. Operating Cashflow Snapshot"),
        p([txt(`First ${cf.length} years of operations (USD '000):`, { italics: true, color: MUTED })]),
        dataTable(
          ["Year", "Revenue", "EBITDA", "CFADS", "Debt service", "DSCR"],
          cf.map(r => [
            String(r.year), fmt(r.revenue), fmt(r.ebitda), fmt(r.cfads),
            fmt(-r.debtService), `${fmt(r.dscr)}x`,
          ]),
        ),

        // 7. Risks
        h1("7. Key Risks & Mitigants"),
        h2("Resource & Production"),
        bullet(`Energy yield assumption: ${fmt(I.capacityMWp)} MWp at ${fmtPct(I.availability)} availability with ${fmtPct(I.degradation, 2)} annual degradation.`),
        bullet("Mitigant: Independent yield assessment and long-term performance warranties from EPC contractor."),
        h2("Revenue & Offtake"),
        bullet(`Tariff of ${(I.tariffUsdPerKWh * 100).toFixed(2)}¢/kWh fixed for ${I.tariffFixedYears} years; post-fixed period escalation applies.`),
        bullet("Mitigant: Long-term PPA with creditworthy offtaker; currency hedging where applicable."),
        h2("Construction & Cost Overrun"),
        bullet(`Total capex of $${fmt(m.totalUses / 1000)}m with contingency of $${fmt(I.contingency / 1000)}m.`),
        bullet("Mitigant: Fixed-price turnkey EPC contract with liquidated damages."),
        h2("Financing & Coverage"),
        bullet(`Min DSCR of ${fmt(m.minDSCR)}x against ${fmt(I.targetDSCR)}x target; ${I.dsraTargetMonths}-month DSRA in place.`),
        bullet("Mitigant: Cash sweep mechanics and lock-up triggers protect senior lenders."),

        // 8. Conclusion
        h1("8. Conclusion"),
        p([txt(recommendation, { bold: true, size: 24, color: NAVY })]),
        p([txt(`Based on a project IRR of ${fmtPct(m.projectIRR)}, common equity IRR of ${fmtPct(m.commonEquityIRR)}, and a minimum DSCR of ${fmt(m.minDSCR)}x against the ${fmt(I.targetDSCR)}x covenant, the transaction `),
          txt(m.debtServiceCoverageOk ? "satisfies" : "does not satisfy", { bold: true }),
          txt(` standard project finance underwriting criteria. The model converged in ${m.iterations} solver iterations.`)]),

        new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "— END OF MEMORANDUM —", font: "Calibri", size: 18, color: MUTED, characterSpacing: 60 })] }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${I.projectName.replace(/\s+/g, "_")}_Investment_Memo.docx`);
}