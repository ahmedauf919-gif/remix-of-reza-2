import { useEffect, useRef } from "react";
import { CheckCircle2, HandCoins, Layers } from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";

const NAVY = "#002060";
const BLUE = "#005298";
const GREEN = "#009045";
const DARK = "#2f2f2f";

const SLIDE_W = 1600;
const SLIDE_H = 900;

/* Fixed pixel layout constants — the slide is always rendered at exactly
   1600x900, so the chart panel's size can be computed deterministically
   from these instead of measuring a live (possibly off-screen) layout. */
const HEADER_H = 96;
const DIVIDER_H = 6;
const LEFT_COL_W = 730;
const BODY_GAP = 28;      // gap-7
const BODY_PAD_X = 36;    // px-9
const BODY_PAD_TOP = 24;  // pt-6
const BODY_PAD_BOTTOM = 16; // pb-4
const CAPTION_H = 56;
const OUTCOMES_H = 56;
const FOOTER_ACCENT_H = 4;
const FOOTER_H = 52;

export interface PvSlideData {
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
  years: { year: number; savingsM: number; cumM: number }[];
}

const fmt = (n: number, d = 1) => n.toLocaleString(undefined, { maximumFractionDigits: d });
const fmtM = (n: number, d = 1) => (n / 1e6).toLocaleString(undefined, { maximumFractionDigits: d });

const HIGHLIGHTS = [
  {
    icon: HandCoins, title: "Zero CapEx Rollout",
    desc: "TAQA funds, builds and operates the PV plant on your rooftop or adjacent land — no capital outlay, no execution risk.",
  },
  {
    icon: CheckCircle2, title: "Guaranteed Tariff Discount",
    desc: "Every kWh is billed at a locked-in discount to the government tariff, escalating with the grid price so savings compound.",
  },
  {
    icon: Layers, title: "One Partner, 25-Year Horizon",
    desc: "A single O&M relationship for the life of the plant — TAQA maintains performance while you capture the savings.",
  },
];

/** Draws the annual/cumulative savings chart onto a native canvas — rasterized
    up front so html2canvas captures a guaranteed-correct bitmap (no SVG quirks). */
function drawChart(canvas: HTMLCanvasElement, years: PvSlideData["years"], dpr: number, W: number, H: number) {
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const padL = 46, padR = 46, padT = 16, padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxAnnual = Math.max(...years.map(y => y.savingsM)) * 1.15;
  const maxCum = Math.max(...years.map(y => y.cumM)) * 1.08;
  const n = years.length;
  const barW = (plotW / n) * 0.6;
  const step = plotW / n;

  // gridlines
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();
  }

  // bars — annual savings
  ctx.fillStyle = "#d97706";
  years.forEach((y, i) => {
    const x = padL + i * step + (step - barW) / 2;
    const h = (y.savingsM / maxAnnual) * plotH;
    const yy = padT + plotH - h;
    ctx.beginPath();
    const r = Math.min(4, barW / 2);
    ctx.moveTo(x, yy + r);
    ctx.arcTo(x, yy, x + r, yy, r);
    ctx.arcTo(x + barW, yy, x + barW, yy + r, r);
    ctx.lineTo(x + barW, padT + plotH);
    ctx.lineTo(x, padT + plotH);
    ctx.closePath();
    ctx.fill();
  });

  // line — cumulative savings
  ctx.strokeStyle = BLUE;
  ctx.lineWidth = 2.75;
  ctx.beginPath();
  years.forEach((y, i) => {
    const x = padL + i * step + step / 2;
    const yy = padT + plotH - (y.cumM / maxCum) * plotH;
    if (i === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
  });
  ctx.stroke();

  // axis line
  ctx.strokeStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.moveTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  // x-axis ticks — every 5 years
  ctx.fillStyle = "#64748b";
  ctx.font = "11px 'DM Sans', system-ui, sans-serif";
  ctx.textAlign = "center";
  years.forEach((y, i) => {
    if (y.year === 1 || y.year % 5 === 0) {
      const x = padL + i * step + step / 2;
      ctx.fillText(`Y${y.year}`, x, padT + plotH + 18);
    }
  });

  // legend
  const legY = 8;
  ctx.fillStyle = "#d97706";
  ctx.fillRect(padL, legY, 10, 10);
  ctx.fillStyle = "#334155";
  ctx.textAlign = "left";
  ctx.font = "600 11px 'DM Sans', system-ui, sans-serif";
  ctx.fillText("Annual savings (EGP M)", padL + 16, legY + 9);
  ctx.strokeStyle = BLUE;
  ctx.lineWidth = 2.75;
  ctx.beginPath();
  ctx.moveTo(padL + 220, legY + 5);
  ctx.lineTo(padL + 244, legY + 5);
  ctx.stroke();
  ctx.fillText("Cumulative savings (EGP M)", padL + 250, legY + 9);
}

/** Fixed 1600x900 slide, rendered off-screen and captured with html2canvas. */
export function PvSlideExport({ data, containerId }: { data: PvSlideData; containerId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartBoxRef = useRef<HTMLDivElement>(null);

  // The chart panel is a flex-1 box (fills whatever space the fixed header/
  // footer/caption bars leave) — measure its real laid-out size rather than
  // hand-deriving it, so it always exactly fills its box, no dead space.
  useEffect(() => {
    const box = chartBoxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;
    const w = Math.max(1, box.clientWidth - 4);
    const h = Math.max(1, box.clientHeight - 4);
    drawChart(canvas, data.years, 2, w, h);
  }, [data]);

  return (
    <div
      id={containerId}
      style={{ width: SLIDE_W, height: SLIDE_H, background: "#ffffff", fontFamily: "'DM Sans', system-ui, sans-serif" }}
      className="flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div style={{ background: DARK, height: HEADER_H }} className="relative flex items-stretch shrink-0" >
        <div style={{ background: GREEN, width: HEADER_H }} className="flex items-center justify-center shrink-0">
          <SunIcon />
        </div>
        <div className="flex-1 flex items-center px-8">
          <h1 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }} className="text-white text-[34px] leading-none">
            <span className="font-bold">PV:</span> <span className="font-normal">Rooftop Savings &amp; Yield</span>
          </h1>
        </div>
        <div className="flex items-center pr-8">
          <img src={taqaLogo} alt="TAQA Arabia" className="h-11 rounded bg-white/95 px-2 py-1" />
        </div>
      </div>
      <div style={{ background: GREEN, height: DIVIDER_H }} className="shrink-0" />

      {/* Body */}
      <div
        className="flex-1 min-h-0 flex"
        style={{ gap: BODY_GAP, paddingLeft: BODY_PAD_X, paddingRight: BODY_PAD_X, paddingTop: BODY_PAD_TOP, paddingBottom: BODY_PAD_BOTTOM }}
      >
        {/* Left column */}
        <div className="flex flex-col" style={{ width: LEFT_COL_W }}>
          <div style={{ background: GREEN }} className="px-4 py-2.5 rounded-sm shrink-0">
            <p style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }} className="text-white text-[13px] font-bold tracking-wide uppercase">
              TAQA PV · Rooftop Savings &amp; Yield
            </p>
          </div>

          <h2 style={{ color: NAVY, fontFamily: "'Space Grotesk', system-ui, sans-serif" }} className="text-[26px] font-bold leading-tight mt-4 shrink-0">
            {data.headline}
          </h2>
          <p className="text-[13.5px] leading-relaxed text-slate-600 mt-2.5 shrink-0">
            {data.intro}
          </p>

          {/* Highlight cards + stat row spread across the remaining height so the
              left column reaches the same depth as the chart panel on the right. */}
          <div className="flex-1 min-h-0 flex flex-col justify-around mt-3">
            <div className="flex flex-col gap-2.5">
              {HIGHLIGHTS.map(h => (
                <div key={h.title} style={{ background: "#f1f5f9", borderLeft: `4px solid ${GREEN}` }} className="px-3.5 py-3">
                  <p style={{ color: BLUE }} className="text-[14px] font-bold leading-tight flex items-center gap-1.5">
                    <h.icon className="h-3.5 w-3.5 shrink-0" /> {h.title}
                  </p>
                  <p className="text-[12px] text-slate-600 leading-snug mt-1">{h.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatBox value={`EGP ${fmtM(data.savingsY1)}M`} label="Saved In Year 1" />
              <StatBox value={`EGP ${fmtM(data.npv)}M`} label={`NPV At ${fmt(data.waccPct, 0)}% WACC`} />
              <StatBox value={`${fmt(data.co2PerYr, 0)} t`} label="CO₂ Avoided Per Year" />
            </div>
          </div>
        </div>

        {/* Right column — graph replaces the photo */}
        <div className="flex-1 flex flex-col min-w-0">
          <div ref={chartBoxRef} className="flex-1 min-h-0 rounded-t-md overflow-hidden ring-1 ring-slate-200 bg-white flex items-center justify-center">
            <canvas ref={canvasRef} />
          </div>
          <div style={{ background: DARK, height: CAPTION_H }} className="px-5 rounded-b-md flex items-center shrink-0">
            <p className="text-white text-[15px] font-bold">
              EGP {fmtM(data.pureSavings, 0)}M Saved Over 25 Years
            </p>
          </div>
        </div>
      </div>

      {/* Outcomes strip */}
      <div style={{ background: BLUE, height: OUTCOMES_H }} className="shrink-0 flex items-center px-9 gap-8">
        <p className="text-white text-[12px] font-bold uppercase tracking-wide shrink-0">Key Outcomes</p>
        <Outcome label="Rooftop capacity" value={`${fmt(data.kWp, 0)} kWp`} />
        <Outcome label="Site footprint" value={`${fmt(data.area, 0)} m²`} />
        <Outcome label="Discount vs government tariff" value={`${fmt(data.discountPct, 0)}%`} />
        <Outcome label="25-yr CO₂ avoided" value={`${fmt(data.co2Lifetime, 0)} t`} />
      </div>

      {/* Footer */}
      <div style={{ background: GREEN, height: FOOTER_ACCENT_H }} className="shrink-0" />
      <div style={{ background: DARK, height: FOOTER_H }} className="shrink-0 flex items-center justify-between px-8">
        <img src={taqaLogo} alt="TAQA Arabia" className="h-7 rounded bg-white/95 px-1.5 py-0.5" />
        <p className="text-white/70 text-[13px] italic">
          A World <span className="font-bold text-white not-italic">OF ENERGY</span>
        </p>
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ background: "#f1f5f9", borderLeft: `4px solid ${GREEN}` }} className="px-3 py-2.5">
      <p style={{ color: BLUE, fontFamily: "'Space Grotesk', system-ui, sans-serif" }} className="text-[19px] font-bold leading-none">{value}</p>
      <p className="text-[10.5px] text-slate-500 mt-1 leading-snug">{label}</p>
    </div>
  );
}

function Outcome({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5 shrink-0">
      <span className="text-white text-[15px] font-bold">{value}</span>
      <span className="text-white/70 text-[11px]">{label}</span>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export const PV_SLIDE_SIZE = { width: SLIDE_W, height: SLIDE_H };
