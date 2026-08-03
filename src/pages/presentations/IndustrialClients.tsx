import { DeckShell } from "./DeckShell";
import type { ReactNode } from "react";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import {
  Flame, Zap, Truck, Droplets, Battery, ArrowRight,
  Star, Sun, Layers,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import taqaLogo from "@/assets/taqa-logo.png";
import {
  SlideStyles, Kicker, CornerWash, GhostNum, Bracket, BlueprintGrid, ColHead, ScopeSlide, ValuePropSlide,
  TimelineSlide, TrackRecordSlide, ChartTrackRecordSlide, TrustedBySlide, statSize, d, hideImg, lighter,
  type TrackStat,
} from "./slides";
import { TRUSTED_BY_LOGOS } from "./trustedByLogos";

// ─── Photos ───────────────────────────────────────────────────────────────────

const P: Record<string, string> = {
  cover:    MEDIA + "cng-plant-night.jpg",
  factory:  MEDIA + "ind-bess-site.jpg",
  cng:      MEDIA + "ind-gas-chain.jpg",
  electric: MEDIA + "ind-power-sourcing.jpg",
  pipeline: MEDIA + "ind-gas-network.jpg",
  chp:      MEDIA + "ind-chp.jpg",
  solar:    MEDIA + "solar-farm-aerial.jpg",
  battery:  MEDIA + "site-containers.jpg",
};

// ─── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "intro",       label: "Introduction",   color: "#c2410c", slides: [0, 1, 2, 3] },
  { id: "trusted",     label: "Trusted By",      color: "#c2410c", slides: [4] },
  { id: "overview",    label: "Solutions",       color: "#c2410c", slides: [5] },
  { id: "cng",         label: "Mobile CNG",      color: "#c2410c", slides: [6, 7, 8, 9] },
  { id: "electricity", label: "Electricity",     color: "#1d4ed8", slides: [10, 11, 12, 13] },
  { id: "gas",         label: "Gas",             color: "#059669", slides: [14, 15, 16, 17] },
  { id: "chp",         label: "CHP",             color: "#b45309", slides: [18, 19, 20, 21] },
  { id: "solar",       label: "Solar",           color: "#ca8a04", slides: [22, 23, 24, 25] },
  { id: "bess",        label: "Energy Storage",  color: "#7c3aed", slides: [26, 27, 28, 29] },
  { id: "closing",     label: "Closing",         color: "#002060", slides: [30, 31, 32] },
];

function sectionOf(idx: number) {
  return SECTIONS.find(s => s.slides.includes(idx)) ?? SECTIONS[0];
}

const SOLUTION_CHIPS: { s: string; c: string }[] = [
  { s: "Mobile CNG",  c: "#c2410c" },
  { s: "Electricity", c: "#1d4ed8" },
  { s: "Gas",         c: "#059669" },
  { s: "CHP",         c: "#b45309" },
  { s: "Solar",       c: "#ca8a04" },
  { s: "Storage",     c: "#7c3aed" },
];

// ─── Slide 0: Cover ───────────────────────────────────────────────────────────

function CoverSlide() {
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0c0a09 0%, #1c1917 55%, #292524 100%)" }}
    >
      <SlideStyles />
      <img
        src={P.cover}
        alt="Industrial energy plant glowing at dusk"
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(115deg, rgba(12,10,9,0.96) 0%, rgba(28,25,23,0.86) 48%, rgba(194,65,12,0.42) 100%)" }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-40 h-[620px] w-[620px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.22), transparent 65%)" }}
      />

      <div className="relative z-10 flex h-full flex-col px-16 py-12">
        {/* Top row */}
        <div className="sx-up flex items-center justify-between" style={d(0)}>
          <img src={taqaLogo} alt="TAQA Arabia logo" className="h-12 rounded-lg bg-white/95 px-3 py-1.5 object-contain shadow-lg" />
          <Kicker color="#c2410c" dark>TAQA Arabia · Client Presentation</Kicker>
        </div>

        <div className="flex-1" />

        {/* Title block */}
        <div>
          <div
            className="sx-up h-[3px] w-16 rounded-full"
            style={{ ...d(80), background: "linear-gradient(90deg, #c2410c, #f59e0b)" }}
          />
          <h1 className="sx-up mt-6 font-display text-[76px] font-bold leading-[1.02] tracking-tight text-white" style={d(140)}>
            Industrial
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #fb923c 0%, #f59e0b 55%, #fbbf24 100%)" }}
            >
              Clients
            </span>
          </h1>
          <p className="sx-up mt-5 text-[19px] text-white/85" style={d(220)}>
            Integrated Energy &amp; Utility Solutions · Jan 2026
          </p>
        </div>

        {/* Solution chips */}
        <div className="mt-9 flex flex-wrap gap-2.5">
          {SOLUTION_CHIPS.map((c, i) => (
            <span
              key={c.s}
              className="sx-up inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[15px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-md"
              style={d(300 + i * 55)}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: lighter(c.c) }} />
              {c.s}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="sx-in mt-8 flex items-center justify-between border-t border-white/10 pt-5" style={d(500)}>
          <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/55">
            TAQA Arabia · Confidential
          </p>
          <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Gas · Power · Petroleum · Water
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 1: About ───────────────────────────────────────────────────────────

function AboutSlide() {
  const divisions = [
    { label: "Gas",       icon: <Flame className="h-5 w-5" />,    desc: "Distribution, EPC, NGV stations, Mobile CNG",              color: "#c2410c" },
    { label: "Power",     icon: <Zap className="h-5 w-5" />,      desc: "Generation & distribution +1,600 MVA, renewable, EV",     color: "#1d4ed8" },
    { label: "Petroleum", icon: <Truck className="h-5 w-5" />,    desc: "Oil-marketing, lubricants, bulk fuel",                    color: "#b45309" },
    { label: "Water",     icon: <Droplets className="h-5 w-5" />, desc: "RO desalination, filtration, smart solar ops",            color: "#0369a1" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#c2410c" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full gap-10 p-14">
        {/* Left — narrative */}
        <div className="flex w-[530px] shrink-0 flex-col">
          <div className="sx-up" style={d(0)}>
            <Kicker color="#c2410c">TAQA Arabia · Who We Are</Kicker>
          </div>
          <h2 className="sx-up mt-5 font-display text-[30px] font-bold leading-[1.15] tracking-tight text-[#002060]" style={d(60)}>
            Egypt's leading integrated energy infrastructure developer — a true one-stop-shop for industrial utilities
          </h2>
          <div
            className="sx-up mt-4 h-[3px] w-14 rounded-full"
            style={{ ...d(110), background: "linear-gradient(90deg, #c2410c, #f59e0b)" }}
          />
          <p className="sx-up mt-5 text-[17px] leading-relaxed text-slate-600" style={d(160)}>
            Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility
            developer. Across four divisions — Gas, Power, Petroleum and Water — TAQA finances, builds, owns and operates the
            utility backbone of residential communities, industrial zones and touristic destinations. For an industrial
            developer, that means one accredited partner with a proven delivery record can supply gas, power, water and steam
            under a single relationship.
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {["Active member of the International Gas Union (IGU)", "Accredited by the IGEM"].map((b, i) => (
              <span
                key={b}
                className="sx-up rounded-full bg-[#c2410c]/10 px-3.5 py-1.5 text-[14px] font-semibold text-[#9a3412] ring-1 ring-[#c2410c]/15"
                style={d(240 + i * 60)}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Right — photo + divisions */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div
            className="sx-up relative h-[178px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-md"
            style={{ ...d(120), background: "linear-gradient(135deg, #7c2d12, #1c1917)" }}
          >
            <img
              src={P.factory}
              alt="Engineers working inside a modern industrial facility"
              loading="lazy"
              onError={hideImg}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,10,9,0) 35%, rgba(12,10,9,0.72) 100%)" }} />
            <p className="absolute bottom-3 left-4 font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/90">
              Four divisions · One partner
            </p>
          </div>
          {divisions.map((dv, i) => (
            <div
              key={dv.label}
              className="sx-up relative flex items-center gap-3.5 rounded-2xl bg-white p-3.5 ring-1 ring-black/5 shadow-sm"
              style={d(200 + i * 70)}
            >
              <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full" style={{ background: dv.color }} />
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow"
                style={{ background: `linear-gradient(135deg, ${dv.color}, ${lighter(dv.color)})` }}
              >
                {dv.icon}
              </div>
              <div className="min-w-0">
                <div className="font-display text-[16px] font-bold tracking-tight text-[#002060]">{dv.label}</div>
                <div className="truncate text-[16px] text-slate-600">{dv.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 2: Regional Presence ───────────────────────────────────────────────

function RegionalSlide() {
  const metrics = [
    { value: "10",     label: "Countries",           sub: "Egypt, GCC, Africa, Greece & South Asia" },
    { value: "4",      label: "Operating divisions", sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates",        sub: "Across Egypt" },
    { value: "3,400+", label: "Employees",           sub: "Across all divisions" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#c2410c" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color="#c2410c">TAQA Arabia · Regional Presence</Kicker>
        </div>
        <h2 className="sx-up mt-4 font-display text-[30px] font-bold leading-tight tracking-tight text-[#002060]" style={d(60)}>
          A growing platform across Egypt, the GCC, Africa and Greece
        </h2>

        <div className="mt-5 grid min-h-0 flex-1 grid-cols-[300px_1fr] gap-6">
          {/* Metrics, stacked */}
          <div className="flex min-h-0 flex-col gap-3">
            {metrics.map((m, i) => (
              <div key={m.label} className="sx-up flex-1" style={d(120 + i * 60)}>
                <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
                  <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full" style={{ background: "linear-gradient(180deg, #c2410c, #fb923c)" }} />
                  <div className="pl-2.5">
                    <div
                      className="font-display text-[28px] font-bold leading-none tracking-tight bg-clip-text text-transparent"
                      style={{ backgroundImage: "linear-gradient(100deg, #c2410c, #fb923c)" }}
                    >
                      {m.value}
                    </div>
                    <div className="mt-1 text-[15px] font-semibold leading-tight text-[#002060]">{m.label}</div>
                    <div className="text-[12.5px] leading-tight text-slate-500">{m.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map — real, live TAQA Arabia footprint by country */}
          <div className="sx-up flex min-h-0 flex-col" style={d(360)}>
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-black/5 shadow-sm">
              <Bracket color="#c2410c" pos="tr" />
              <img
                src={MEDIA + "taqa-regional-map.png"}
                alt="Map of TAQA Arabia's actual presence and markets under study across Africa, the Middle East and South Asia, with per-country project detail"
                className="max-h-full max-w-full object-contain"
                loading="lazy"
                onError={hideImg}
              />
            </div>
            <p className="mt-2 text-center text-[13px] text-slate-500">
              Actual presence and markets under study, with what TAQA Arabia is delivering in each country.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 3: In Numbers ──────────────────────────────────────────────────────

function NumbersSlide() {
  const heroStats = [
    { value: "EGP 13.4bn", label: "Revenue",                    sub: "FY 2025", hero: true },
    { value: "EGP 18bn+",  label: "Assets under Management",    sub: "Group-wide, FY 2025" },
    { value: "~6.5M",      label: "Gas customers nationwide",   sub: "FY 2025" },
  ];
  const divCards = [
    { div: "GAS",            icon: <Flame className="h-4 w-4" />,    color: "#c2410c", stat: "+10,000 km network, 8 governorate concessions (15-yr)" },
    { div: "POWER",          icon: <Zap className="h-4 w-4" />,      color: "#1d4ed8", stat: "+1,600 MVA distribution, +150 MW generation" },
    { div: "WATER",          icon: <Droplets className="h-4 w-4" />, color: "#0369a1", stat: "+47,000 m³/day desalination, 15 operational locations" },
    { div: "MOBILITY & CNG", icon: <Truck className="h-4 w-4" />,    color: "#7c3aed", stat: "300 total stations, 1st private EV-charging license" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#c2410c" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color="#c2410c">TAQA Arabia · In Numbers</Kicker>
        </div>
        <h2 className="sx-up mt-4 font-display text-[34px] font-bold leading-tight tracking-tight text-[#002060]" style={d(60)}>
          The scale behind a single integrated energy partner — FY 2025
        </h2>

        {/* Hero bento */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {heroStats.map((m, i) => (
            <div
              key={m.label}
              className={`sx-up relative overflow-hidden rounded-2xl p-6 ${
                m.hero ? "col-span-2 text-white shadow-xl" : "bg-white ring-1 ring-black/5 shadow-sm"
              }`}
              style={{
                ...d(120 + i * 70),
                ...(m.hero ? { background: "linear-gradient(130deg, #0c0a09 0%, #1c1917 55%, #7c2d12 100%)" } : {}),
              }}
            >
              {m.hero && <BlueprintGrid />}
              {m.hero && <Bracket color="#f59e0b" pos="br" />}
              <div
                className={`relative font-display font-bold leading-none tracking-tight bg-clip-text text-transparent ${m.hero ? "text-[52px]" : "text-[36px]"}`}
                style={{
                  backgroundImage: m.hero
                    ? "linear-gradient(100deg, #fb923c, #fbbf24)"
                    : "linear-gradient(100deg, #c2410c, #fb923c)",
                }}
              >
                {m.value}
              </div>
              <div className={`relative mt-2.5 text-[17px] font-semibold ${m.hero ? "text-white" : "text-[#002060]"}`}>{m.label}</div>
              <div className={`relative mt-0.5 text-[14px] ${m.hero ? "text-white/70" : "text-slate-500"}`}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Division strip */}
        <div className="mt-4 grid min-h-0 flex-1 grid-cols-4 gap-4">
          {divCards.map((c, i) => (
            <div
              key={c.div}
              className="sx-up relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm"
              style={d(360 + i * 70)}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${c.color}, ${lighter(c.color)})` }} />
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow"
                  style={{ background: `linear-gradient(135deg, ${c.color}, ${lighter(c.color)})` }}
                >
                  {c.icon}
                </div>
                <span className="font-display text-[15px] font-bold uppercase tracking-[0.14em] text-[#002060]">{c.div}</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {c.stat.split(", ").map(pt => (
                  <div key={pt} className="flex items-start gap-2.5">
                    <span aria-hidden className="mt-[8px] h-2 w-2 shrink-0 rotate-45" style={{ background: c.color }} />
                    <span className="text-[17px] font-semibold leading-snug text-slate-700">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="sx-up mt-3 text-center text-[13px] font-medium text-slate-400" style={d(660)}>
          Founded 2006 · Listed on EGX 2023 · 3,400+ employees across all divisions
        </p>
      </div>
    </div>
  );
}

// ─── Slide 4: Trusted By ──────────────────────────────────────────────────────
// (uses shared TrustedBySlide + TRUSTED_BY_LOGOS directly in the SLIDES array)

// ─── Slide 5: Solutions Overview ──────────────────────────────────────────────

function SolutionsOverviewSlide() {
  const solutions = [
    { num: "01", label: "Mobile CNG",               desc: "Off-grid natural gas via mobile virtual pipeline — zero infrastructure capex.", icon: <Truck className="h-5 w-5" />,   color: "#c2410c" },
    { num: "02", label: "Electricity Distribution", desc: "Turnkey MV/LV networks, smart metering and licensed lifetime O&M.",             icon: <Zap className="h-5 w-5" />,     color: "#1d4ed8" },
    { num: "03", label: "Gas Distribution",         desc: "End-to-end gas network EPC — design, build, commission and operate.",           icon: <Flame className="h-5 w-5" />,   color: "#059669" },
    { num: "04", label: "CHP",                      desc: "Combined Heat & Power — up to ~85% efficiency from a single fuel input.",       icon: <Layers className="h-5 w-5" />,  color: "#b45309" },
    { num: "05", label: "Solar",                    desc: "Tailored solar PV via PPA — clean power below grid tariffs, no capex.",         icon: <Sun className="h-5 w-5" />,     color: "#ca8a04" },
    { num: "06", label: "Energy Storage (BESS)",    desc: "Battery storage for peak shaving, solar firming and backup power.",             icon: <Battery className="h-5 w-5" />, color: "#7c3aed" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#c2410c" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="sx-up" style={d(0)}>
              <Kicker color="#c2410c">Industrial Clients · Solutions Overview</Kicker>
            </div>
            <h2 className="sx-up mt-4 font-display text-[40px] font-bold leading-none tracking-tight text-[#002060]" style={d(60)}>
              Six integrated solutions
            </h2>
          </div>
          <p className="sx-up max-w-[420px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
            The following slides detail every solution TAQA Arabia offers to industrial sites, factories and parks.
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-4">
          {solutions.map((s, i) => (
            <div
              key={s.num}
              className="sx-up group relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-[0_10px_30px_-16px_rgba(0,32,96,0.25)]"
              style={d(160 + i * 60)}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${s.color}, ${lighter(s.color)})` }} />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[88px] font-bold leading-none"
                style={{ color: s.color, opacity: 0.07 }}
              >
                {s.num}
              </div>
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${s.color}, ${lighter(s.color)})` }}
              >
                {s.icon}
              </div>
              <h3 className="mt-3 font-display text-[17px] font-bold leading-tight tracking-tight text-[#002060]">{s.label}</h3>
              <p className="mt-1.5 text-[16px] leading-snug text-slate-600">{s.desc}</p>
              <div className="mt-auto flex items-center gap-1.5 pt-2 font-display text-[14px] font-semibold uppercase tracking-[0.18em]" style={{ color: s.color }}>
                Solution {s.num}
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Bespoke: single-series growth chart (CHP · MAFI case study) ─────────────
// The MAFI table in the source deck has only ONE data series (no comparison
// line), so it doesn't fit ChartTrackRecordSlide's fixed 2-series shape.
// This local component mirrors that slide's dark "moment" aesthetic with a
// single recharts line instead.

interface SingleLineTrackProps {
  solutionNum: number;
  solutionLabel: string;
  heading: string;
  subheading: string;
  body: string;
  color: string;
  icon: ReactNode;
  data: Record<string, number | string>[];
  xKey: string;
  seriesKey: string;
  seriesName: string;
  yLabel: string;
  valueFormatter?: (v: number) => string;
  stats: TrackStat[];
}

function SingleLineTrackSlide({
  solutionNum, solutionLabel, heading, subheading, body, color, icon, data, xKey, seriesKey, seriesName, yLabel,
  valueFormatter = (v) => v.toLocaleString(), stats,
}: SingleLineTrackProps) {
  const tickColor = "rgba(255,255,255,0.55)";
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0c0a09 0%, #1c1917 55%, #292524 100%)" }}
    >
      <SlideStyles />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(115deg, rgba(12,10,9,0.95) 0%, rgba(28,25,23,0.9) 52%, ${color}40 100%)` }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-40 h-[560px] w-[560px] rounded-full"
        style={{ background: `radial-gradient(circle, ${color}30, transparent 65%)` }}
      />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up flex items-center gap-3" style={d(0)}>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
          >
            {icon}
          </div>
          <Kicker color={color} dark>
            Solution {String(solutionNum).padStart(2, "0")} · {solutionLabel} · Proven Track Record
          </Kicker>
        </div>

        <h2 className="sx-up mt-5 max-w-[1120px] font-display text-[38px] font-bold leading-[1.1] tracking-tight text-white" style={d(80)}>
          {heading}
        </h2>
        <div className="sx-up mt-3 flex items-start gap-2.5" style={d(140)}>
          <Star className="mt-1 h-5 w-5 shrink-0" style={{ color: lighter(color), fill: lighter(color) }} />
          <p className="max-w-[1020px] text-[17px] font-medium leading-snug text-white/90">{subheading}</p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-[1.35fr_1fr] gap-6">
          {/* Chart card */}
          <div className="sx-up relative flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/15 backdrop-blur-md" style={d(200)}>
            <Bracket color={lighter(color)} pos="tl" />
            <div className="mb-1 flex items-center gap-4 pl-1">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: lighter(color) }} />
                <span className="text-[13px] font-semibold text-white/80">{seriesName}</span>
              </div>
              <span className="ml-auto text-[12px] text-white/40">{yLabel}</span>
            </div>
            <div className="min-h-0 flex-1 pl-1 pr-2 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 4, right: 8, left: 2, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: tickColor }} axisLine={{ stroke: "rgba(255,255,255,0.15)" }} tickLine={false}
                    interval={Math.max(0, Math.floor(data.length / 8) - 1)} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} width={54}
                    tickFormatter={(v: number) => valueFormatter(v)} />
                  <Tooltip
                    contentStyle={{ background: "#1c1917", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                    formatter={(v: number) => [valueFormatter(v), seriesName]}
                  />
                  <Line type="monotone" dataKey={seriesKey} name={seriesName} stroke={lighter(color)} strokeWidth={2.75} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Body + stats */}
          <div className="flex min-h-0 flex-col gap-4">
            <div className="sx-up relative flex-1 overflow-hidden rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/15 backdrop-blur-md" style={d(260)}>
              <p className="text-[15px] leading-[1.6] text-white/90">{body}</p>
            </div>
            <div className="flex flex-col gap-3">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="sx-up flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3.5 ring-1 ring-white/15 backdrop-blur-md"
                  style={d(320 + i * 70)}
                >
                  <div className="text-[14px] leading-snug text-white/75">{s.label}</div>
                  <div
                    className={`shrink-0 pl-3 font-display font-bold leading-none bg-clip-text text-transparent ${statSize(s.value)}`}
                    style={{ backgroundImage: `linear-gradient(105deg, #ffffff 0%, ${lighter(color)} 100%)` }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bespoke: before/after bar comparison (BESS · Peak Transformer Load) ─────
// The source table is 2 categorical bars (Before/After), not a 25-year
// 2-series line — a bar chart fits the data shape far better.

interface BeforeAfterBarProps {
  solutionNum: number;
  solutionLabel: string;
  heading: string;
  subheading: string;
  body: string;
  color: string;
  icon: ReactNode;
  data: { label: string; value: number }[];
  yLabel: string;
  deltaLabel: string;
  stats: TrackStat[];
}

function BeforeAfterBarSlide({
  solutionNum, solutionLabel, heading, subheading, body, color, icon, data, yLabel, deltaLabel, stats,
}: BeforeAfterBarProps) {
  const tickColor = "rgba(255,255,255,0.55)";
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0c0a09 0%, #1c1917 55%, #292524 100%)" }}
    >
      <SlideStyles />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(115deg, rgba(12,10,9,0.95) 0%, rgba(28,25,23,0.9) 52%, ${color}40 100%)` }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-40 h-[560px] w-[560px] rounded-full"
        style={{ background: `radial-gradient(circle, ${color}30, transparent 65%)` }}
      />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up flex items-center gap-3" style={d(0)}>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
          >
            {icon}
          </div>
          <Kicker color={color} dark>
            Solution {String(solutionNum).padStart(2, "0")} · {solutionLabel} · Proven Track Record
          </Kicker>
        </div>

        <h2 className="sx-up mt-5 max-w-[1120px] font-display text-[38px] font-bold leading-[1.1] tracking-tight text-white" style={d(80)}>
          {heading}
        </h2>
        <div className="sx-up mt-3 flex items-start gap-2.5" style={d(140)}>
          <Star className="mt-1 h-5 w-5 shrink-0" style={{ color: lighter(color), fill: lighter(color) }} />
          <p className="max-w-[1020px] text-[17px] font-medium leading-snug text-white/90">{subheading}</p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-[1.05fr_1fr] gap-6">
          {/* Chart card */}
          <div className="sx-up relative flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/15 backdrop-blur-md" style={d(200)}>
            <Bracket color={lighter(color)} pos="tl" />
            <div className="mb-1 flex items-center justify-between pl-1">
              <span className="text-[13px] font-semibold text-white/80">{deltaLabel}</span>
              <span className="text-[12px] text-white/40">{yLabel}</span>
            </div>
            <div className="min-h-0 flex-1 pl-1 pr-2 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 13, fill: tickColor, fontWeight: 600 }} axisLine={{ stroke: "rgba(255,255,255,0.15)" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{ background: "#1c1917", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                    formatter={(v: number) => [`${v} (index)`, "Relative load"]}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                    {data.map((row, i) => (
                      <Cell key={row.label} fill={i === 0 ? "rgba(255,255,255,0.35)" : lighter(color)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Body + stats */}
          <div className="flex min-h-0 flex-col gap-4">
            <div className="sx-up relative flex-1 overflow-hidden rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/15 backdrop-blur-md" style={d(260)}>
              <p className="text-[15px] leading-[1.6] text-white/90">{body}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="sx-up flex flex-col justify-center rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md"
                  style={d(320 + i * 60)}
                >
                  <div
                    className={`font-display font-bold leading-[1.05] tracking-tight bg-clip-text text-transparent ${statSize(s.value)}`}
                    style={{ backgroundImage: `linear-gradient(105deg, #ffffff 0%, ${lighter(color)} 100%)` }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1.5 text-[13px] leading-snug text-white/75">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 30: Why One Partner ────────────────────────────────────────────────

function WhyOnePartnerSlide() {
  const benefits = [
    { label: "One SLA",                     desc: "A single service-level agreement governs gas, power, CHP, solar and storage — one uptime guarantee, one renewal." },
    { label: "One Communication Point",     desc: "A single account team and 24/7 hotline for every utility — no chasing multiple contractors." },
    { label: "One Commercial Relationship", desc: "Consolidated billing, aligned contract terms and a single negotiation instead of separate procurement cycles." },
    { label: "One Engineering Standard",    desc: "Utilities designed to interoperate from day one — shared infrastructure, metering and monitoring." },
    { label: "One Accountable Owner",       desc: "End-to-end responsibility removes interface risk and finger-pointing between specialised vendors." },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#002060" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="sx-up" style={d(0)}>
              <Kicker color="#002060">Why One Partner</Kicker>
            </div>
            <h2 className="sx-up mt-4 font-display text-[38px] font-bold leading-none tracking-tight text-[#002060]" style={d(60)}>
              The TAQA One-Stop-Shop
            </h2>
          </div>
          <p className="sx-up max-w-[430px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
            One SLA, one communication point, one accountable operator — across every utility on the site
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-5">
          {/* All-solutions dark card */}
          <div
            className="sx-up relative flex flex-col overflow-hidden rounded-2xl p-6 shadow-xl"
            style={{ ...d(180), background: "linear-gradient(145deg, #002060 0%, #0a2f7a 70%, #123c94 100%)" }}
          >
            <BlueprintGrid />
            <Bracket color="#FFC10E" pos="br" />
            <h3 className="relative font-display text-[18px] font-bold tracking-tight text-[#FFC10E]">TAQA Arabia — All Solutions</h3>
            <div className="relative mt-4 grid grid-cols-2 gap-2.5">
              {SOLUTION_CHIPS.map((s, i) => (
                <div
                  key={s.s}
                  className="sx-up flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-3 ring-1 ring-white/10"
                  style={d(240 + i * 55)}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: lighter(s.c) }} />
                  <span className="text-[16px] font-semibold text-white">{s.s}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
              <span className="text-[16px] text-white/70">From Fragmented Vendors</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#FFC10E]" />
              <span className="text-[16px] font-bold text-white">A Single Operator</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="flex min-h-0 flex-col justify-between gap-2.5">
            {benefits.map((b, i) => (
              <div
                key={b.label}
                className="sx-up relative flex flex-1 items-start gap-3 rounded-xl bg-white p-3 pl-4 ring-1 ring-black/5 shadow-sm"
                style={d(220 + i * 60)}
              >
                <span aria-hidden className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#c2410c] to-[#f59e0b]" />
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#c2410c]/10 text-[#c2410c]">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[17px] font-bold leading-tight text-[#002060]">{b.label}</div>
                  <div className="mt-0.5 text-[16px] leading-[1.35] text-slate-600">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 31: Bundle ─────────────────────────────────────────────────────────

function BundleSlide() {
  const bundles = [
    { combo: "Solar + Storage",         desc: "BESS stores daytime solar and dispatches it after sunset — pushing self-consumption and PPA savings far higher.", color: "#ca8a04" },
    { combo: "Solar + Distribution",    desc: "On-site solar feeds the TAQA-built network directly, lowering the plant's blended power cost.",                   color: "#1d4ed8" },
    { combo: "CHP + Gas",               desc: "TAQA's gas network fuels the CHP plant — one partner supplies the fuel and the cogeneration asset.",              color: "#b45309" },
    { combo: "Storage + Distribution",  desc: "BESS shaves peak demand on the distribution network, cutting the most expensive part of the bill.",               color: "#7c3aed" },
    { combo: "Gas + Mobile CNG",        desc: "Mobile CNG bridges supply until the permanent gas network goes live — no production gap.",                        color: "#c2410c" },
    { combo: "Shared O&M & Monitoring", desc: "One control room and field team monitor every utility — pooled spares, pooled response, lower unit cost.",       color: "#002060" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#002060" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="sx-up" style={d(0)}>
              <Kicker color="#002060">The Power of the Bundle</Kicker>
            </div>
            <h2 className="sx-up mt-4 font-display text-[38px] font-bold leading-none tracking-tight text-[#002060]" style={d(60)}>
              Cross-Solution Benefits
            </h2>
          </div>
          <p className="sx-up max-w-[440px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
            How combining the solutions under one SLA creates value no single vendor can match
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-4">
          {bundles.map((b, i) => (
            <div
              key={b.combo}
              className="sx-up relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-[0_10px_30px_-16px_rgba(0,32,96,0.25)]"
              style={d(160 + i * 55)}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${b.color}, ${lighter(b.color)})` }} />
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rotate-45" style={{ background: b.color }} />
                <h3 className="font-display text-[16px] font-bold leading-tight tracking-tight text-[#002060]">{b.combo}</h3>
              </div>
              <p className="mt-2 text-[16px] leading-snug text-slate-600">{b.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="sx-up relative mt-4 overflow-hidden rounded-2xl px-7 py-4 text-center shadow-lg"
          style={{ ...d(520), background: "linear-gradient(120deg, #002060 0%, #0a2f7a 100%)" }}
        >
          <BlueprintGrid />
          <p className="relative text-[16px] leading-snug text-white/85">
            <span className="font-bold text-[#FFC10E]">Sold as one SLA:</span>{" "}
            lower combined energy cost · shared infrastructure · one billing &amp; monitoring platform · stronger ESG / decarbonisation
            story · single accountable operator for the entire site's energy backbone.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 32: Success Story — dark closing moment ───────────────────────────

function SuccessStorySlide() {
  const combined = [
    { s: "Gas Distribution",   c: "#059669" },
    { s: "Power Distribution", c: "#1d4ed8" },
    { s: "CHP / Solar",        c: "#ca8a04" },
    { s: "Storage",            c: "#7c3aed" },
  ];
  const stats = [
    { value: "450 MVA", label: "Serving industrial parks" },
    { value: "+500",    label: "Factories served" },
    { value: "6.4 BCM", label: "Gas distributed per year" },
    { value: "+150 MW", label: "Captive generation" },
  ];
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0c0a09 0%, #1c1917 55%, #292524 100%)" }}
    >
      <SlideStyles />
      <img
        src={P.factory}
        alt="Integrated industrial energy site served by TAQA Arabia"
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(115deg, rgba(12,10,9,0.95) 0%, rgba(0,20,55,0.85) 55%, rgba(0,32,96,0.55) 100%)" }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-44 h-[620px] w-[620px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.2), transparent 65%)" }}
      />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color="#f59e0b" dark>Success Story</Kicker>
        </div>
        <h2 className="sx-up mt-4 font-display text-[42px] font-bold leading-none tracking-tight text-white" style={d(70)}>
          Integrated{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(95deg, #fb923c, #fbbf24)" }}
          >
            Industrial Energy
          </span>
        </h2>
        <p className="sx-up mt-2.5 text-[17px] text-white/80" style={d(130)}>
          A single industrial client running on multiple TAQA solutions — the one-stop-shop, proven.
        </p>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-[1fr_430px] gap-6">
          {/* Narrative glass card */}
          <div className="sx-up relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.07] p-7 ring-1 ring-white/15 backdrop-blur-md" style={d(190)}>
            <Bracket color="#f59e0b" pos="tl" />
            <div className="flex items-center gap-2.5 pl-3">
              <Star className="h-5 w-5 shrink-0 text-[#fbbf24]" style={{ fill: "#fbbf24" }} />
              <h3 className="font-display text-[17px] font-bold tracking-tight text-white">
                One site. Multiple TAQA solutions. One accountable operator.
              </h3>
            </div>
            <p className="mt-3 pl-3 text-[17px] leading-relaxed text-white/85">
              Across Egypt's industrial parks, TAQA Arabia combines gas distribution, private power distribution and on-site
              generation into a single, integrated energy system for factories — supplying the fuel, building the network and
              running the assets under one relationship. TAQA Power operates 450 MVA across 9 industrial-park concessions
              serving +500 factories. It is the clearest proof of the bundled, one-SLA model for industry.
            </p>
            <div className="mt-auto flex items-center gap-2.5 border-t border-white/10 pl-3 pt-4">
              <ArrowRight className="h-4 w-4 shrink-0 text-[#fbbf24]" />
              <p className="text-[17px] font-semibold leading-snug text-[#fbbf24]">
                Contact TAQA Arabia to explore how the integrated industrial energy model can work for your site.
              </p>
            </div>
          </div>

          {/* Solutions + stats */}
          <div className="flex min-h-0 flex-col gap-4">
            <div className="sx-up rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md" style={d(260)}>
              <p className="font-display text-[14px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Solutions combined on one site
              </p>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                {combined.map(i => (
                  <div key={i.s} className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: lighter(i.c) }} />
                    <span className="text-[15px] font-medium text-white/90">{i.s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="sx-up flex flex-col justify-center rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md"
                  style={d(320 + i * 65)}
                >
                  <div
                    className="font-display text-[24px] font-bold leading-tight tracking-tight bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(100deg, #ffffff, #fbbf24)" }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1 text-[14px] leading-snug text-white/75">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chart data ───────────────────────────────────────────────────────────────

const CNG_CHART = [
  { year: "Y1", taqa: 70.0, diesel: 100.0 }, { year: "Y2", taqa: 77.0, diesel: 110.0 },
  { year: "Y3", taqa: 84.7, diesel: 121.0 }, { year: "Y4", taqa: 93.17, diesel: 133.1 },
  { year: "Y5", taqa: 102.49, diesel: 146.41 }, { year: "Y6", taqa: 112.74, diesel: 161.05 },
  { year: "Y7", taqa: 124.01, diesel: 177.16 }, { year: "Y8", taqa: 136.41, diesel: 194.87 },
  { year: "Y9", taqa: 150.05, diesel: 214.36 }, { year: "Y10", taqa: 165.06, diesel: 235.79 },
  { year: "Y11", taqa: 181.56, diesel: 259.37 }, { year: "Y12", taqa: 199.72, diesel: 285.31 },
  { year: "Y13", taqa: 219.69, diesel: 313.84 }, { year: "Y14", taqa: 241.66, diesel: 345.23 },
  { year: "Y15", taqa: 265.82, diesel: 379.75 }, { year: "Y16", taqa: 292.41, diesel: 417.72 },
  { year: "Y17", taqa: 321.65, diesel: 459.5 }, { year: "Y18", taqa: 353.81, diesel: 505.45 },
  { year: "Y19", taqa: 389.19, diesel: 555.99 }, { year: "Y20", taqa: 428.11, diesel: 611.59 },
  { year: "Y21", taqa: 470.92, diesel: 672.75 }, { year: "Y22", taqa: 518.02, diesel: 740.02 },
  { year: "Y23", taqa: 569.82, diesel: 814.03 }, { year: "Y24", taqa: 626.8, diesel: 895.43 },
  { year: "Y25", taqa: 689.48, diesel: 984.97 },
];

const SOLAR_CHART = [
  { year: "Y1", taqa: 2.15, gov: 2.53 }, { year: "Y2", taqa: 2.37, gov: 2.78 },
  { year: "Y3", taqa: 2.6, gov: 3.06 }, { year: "Y4", taqa: 2.86, gov: 3.37 },
  { year: "Y5", taqa: 3.15, gov: 3.7 }, { year: "Y6", taqa: 3.46, gov: 4.07 },
  { year: "Y7", taqa: 3.81, gov: 4.48 }, { year: "Y8", taqa: 4.19, gov: 4.93 },
  { year: "Y9", taqa: 4.61, gov: 5.42 }, { year: "Y10", taqa: 5.07, gov: 5.97 },
  { year: "Y11", taqa: 5.58, gov: 6.56 }, { year: "Y12", taqa: 6.13, gov: 7.22 },
  { year: "Y13", taqa: 6.75, gov: 7.94 }, { year: "Y14", taqa: 7.42, gov: 8.73 },
  { year: "Y15", taqa: 8.16, gov: 9.61 }, { year: "Y16", taqa: 8.98, gov: 10.57 },
  { year: "Y17", taqa: 9.88, gov: 11.63 }, { year: "Y18", taqa: 10.87, gov: 12.79 },
  { year: "Y19", taqa: 11.95, gov: 14.07 }, { year: "Y20", taqa: 13.15, gov: 15.47 },
  { year: "Y21", taqa: 14.46, gov: 17.02 }, { year: "Y22", taqa: 15.91, gov: 18.72 },
  { year: "Y23", taqa: 17.5, gov: 20.59 }, { year: "Y24", taqa: 19.25, gov: 22.65 },
  { year: "Y25", taqa: 21.18, gov: 24.92 },
];

// MAFI chart values converted from EGP to EGP-millions for readable axis ticks.
const MAFI_CHART = [
  { year: "Y1", value: 120 }, { year: "Y2", value: 126 }, { year: "Y3", value: 136 },
  { year: "Y4", value: 142 }, { year: "Y5", value: 151 }, { year: "Y6", value: 160 },
  { year: "Y7", value: 170 }, { year: "Y8", value: 179 }, { year: "Y9", value: 191 },
  { year: "Y10", value: 200 }, { year: "Y11", value: 210 }, { year: "Y12", value: 219 },
  { year: "Y13", value: 262 }, { year: "Y14", value: 314 }, { year: "Y15", value: 370 },
  { year: "Y16", value: 435 }, { year: "Y17", value: 509 }, { year: "Y18", value: 592 },
  { year: "Y19", value: 685 }, { year: "Y20", value: 789 },
];

const BESS_CHART = [
  { label: "Before BESS", value: 100 },
  { label: "After BESS",  value: 65 },
];

// ─── SLIDES Array (33 slides, 0-indexed) ─────────────────────────────────────

const cngIcon   = <Truck className="w-5 h-5" />;
const elecIcon  = <Zap className="w-5 h-5" />;
const gasIcon   = <Flame className="w-5 h-5" />;
const chpIcon   = <Layers className="w-5 h-5" />;
const solarIcon = <Sun className="w-5 h-5" />;
const bessIcon  = <Battery className="w-5 h-5" />;

const SLIDES = [
  // 0
  { title: "Cover", render: () => <CoverSlide /> },
  // 1
  { title: "About TAQA Arabia", render: () => <AboutSlide /> },
  // 2
  { title: "Regional Presence", render: () => <RegionalSlide /> },
  // 3
  { title: "In Numbers", render: () => <NumbersSlide /> },
  // 4
  {
    title: "Trusted By",
    render: () => (
      <TrustedBySlide
        color="#c2410c"
        heading="Clients and Partners Served Across Multiple Divisions"
        subheading="A representative cross-section of the developers, industrials, hospitality groups and institutions TAQA Arabia serves today."
        logos={TRUSTED_BY_LOGOS}
      />
    ),
  },
  // 5
  { title: "Solutions Overview", render: () => <SolutionsOverviewSlide /> },

  // ── Mobile CNG ──────────────────────────────────────────────────────────────
  // 6
  {
    title: "Mobile CNG: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon} photo={P.cng}
        subtitle="Portable natural-gas supply delivering cost savings, flexibility and energy security for off-grid industrial sites."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the gas you consume — little to no upfront CapEx."
        taqaInvests={["Mother station & compression", "CNG/virtual-pipeline trailers", "On-site decompression & PRMS skid", "Industrial metering & controls"]}
        steps={[
          "Gas is compressed at a TAQA mother station to ~250 bar.",
          "Trailers deliver it to your plant as a virtual pipeline.",
          "On-site skids decompress and regulate to process pressure.",
          "Gas feeds boilers, furnaces and process lines.",
          "TAQA tracks usage and refills ahead of demand.",
        ]}
        whatYouReceive={["Pipeline-grade gas without a pipeline", "Continuous feed for industrial processes", "Managed supply and refills"]}
      />
    ),
  },
  // 7
  {
    title: "Mobile CNG: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon} photo={P.cng}
        whatYouGain={[
          { label: "Off-Grid Gas Supply",           desc: "Reliable natural gas to the factory without pipeline access." },
          { label: "Cost Savings vs. Diesel & LPG", desc: "Lower fuel cost than diesel; replaces LPG and electric heating across the development." },
          { label: "Cleaner Emissions",             desc: "Cuts CO₂ by ~24% vs. diesel and lowers NOx & particulates — supports ESG and green-rating targets." },
          { label: "Offset Diesel Quota",           desc: "Reduce reliance on diesel quotas by providing cleaner and more cost-effective fuel alternatives." },
        ]}
        taqaEdge={[
          { label: "Flexible Delivery Approach",          desc: "BOO/BOOT or EPC via Capacity-as-a-Service — no upfront infrastructure cost for the developer." },
          { label: "Nationwide Logistics",     desc: "A dedicated trailer fleet refills clients on schedule via Master Gas stations nationwide." },
          { label: "Scalable to Any Load",     desc: "Starter (550 litres/day of diesel) to Heavy (5,500+ litres/day) — scales with occupancy, bridges to grid later." },
          { label: "Broad Governorate Reach",  desc: "A nationwide portfolio of Mobile CNG projects extends gas access and lowers fuel costs." },
        ]}
      />
    ),
  },
  // 8
  {
    title: "Mobile CNG: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon} photo={P.cng}
        phases={[
          { days: "Day 0",       label: "Discovery" },
          { days: "Day 1–3",     label: "Initial Contact" },
          { days: "Day 4–7",     label: "Site Audit" },
          { days: "Day 8–14",    label: "Contract" },
          { days: "Day 15–30",   label: "Mobilization" },
          { days: "Day 90–120",  label: "On-Site Install" },
          { days: "Day 120–200", label: "Live Gas" },
        ]}
        groups={[
          { label: "DISCOVERY & AUDIT",    range: "Day 0–14" },
          { label: "CONTRACTING",          range: "Day 8–14" },
          { label: "DEPLOYMENT & GO-LIVE", range: "Day 90–200" },
        ]}
      />
    ),
  },
  // 9
  {
    title: "Mobile CNG: Track Record",
    render: () => (
      <ChartTrackRecordSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon}
        heading="TAQA CNG Price vs. Diesel Price — 25-Year Outlook"
        subheading="First company in Egypt to supply natural gas through a mobile virtual pipeline"
        body="TAQA pioneered mobile CNG in Egypt, reaching 4 off-grid governorates via an 86-station network."
        data={CNG_CHART}
        xKey="year"
        series={[
          { key: "taqa", name: "TAQA CNG Price", color: "#fb923c" },
          { key: "diesel", name: "Diesel Price", color: "#f87171" },
        ]}
        yLabel="Indicative unit price (EGP)"
        valueFormatter={(v) => (v >= 1000 ? "1k" : `${Math.round(v)}`)}
        stats={[
          { value: "86",       label: "CNG stations across the network" },
          { value: "20",       label: "Governorates covered nationwide" },
          { value: "4",        label: "Off-grid governorates reached via virtual pipeline" },
          { value: "10",       label: "Existing Mobile CNG projects — incl. a full governorate (El Kharga)" },
        ]}
      />
    ),
  },

  // ── Electricity Distribution ─────────────────────────────────────────────────
  // 10
  {
    title: "Electricity Distribution: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        subtitle="Turnkey distribution networks for industrial sites and parks — from power sourcing and design through licensed lifetime O&M."
        taqaInvests={["HV/MV substations & switchgear", "Distribution transformers", "Cabling, protection & metering", "SCADA & control room"]}
        steps={[
          "TAQA designs the zone network to factory load demands.",
          "Substations, transformers and feeders are built and energized.",
          "Power is distributed to every plot at the right voltage.",
          "Smart meters bill each factory for its consumption.",
          "A 24/7 control room keeps the zone powered and balanced.",
        ]}
        whatYouReceive={["A licensed industrial power network", "Reliable supply to every factory", "Operation, metering and billing handled", "450 MVA in zones"]}
      />
    ),
  },
  // 11
  {
    title: "Electricity Distribution: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        whatYouGain={[
          { label: "Potential New Revenue Stream", desc: "The profit-share model turns the distribution network from a cost center into recurring income." },
          { label: "Lower Factory Bills",          desc: "Demand-side management and tariff optimization reduce consumption and end-user charges." },
          { label: "Guaranteed Power Quality",     desc: "Stable, metered, billable electricity to every unit from handover — no reliance on stretched public utilities." },
          { label: "Future-Ready Network",         desc: "Designed for solar, storage and EV loads from day one — the factory scales without re-builds." },
        ]}
        taqaEdge={[
          { label: "Flexible Delivery Approach", desc: "Take it as EPC build, licensed O&M, or a profit-share — TAQA flexes from substation to metering." },
          { label: "Faster Time-to-Handover",    desc: "TAQA's licensing relationships and in-house engineering compress approvals, so units energize on schedule." },
          { label: "Single Accountable Operator", desc: "One licensed party owns sourcing, network, metering and O&M — no finger-pointing between contractors." },
          { label: "Reliability & Smart O&M",    desc: "24/7 predictive maintenance and rapid-response teams with guaranteed SAIDI / SAIFI performance." },
        ]}
      />
    ),
  },
  // 12
  {
    title: "Electricity Distribution: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        phases={[
          { days: "Day 0–30",   label: "Power Sourcing" },
          { days: "Day 30–75",  label: "Engineering Approval" },
          { days: "Day 75–120", label: "MEP Approval" },
          { days: "Day 120–240", label: "Network Build" },
          { days: "Day 240–300", label: "Smart Metering" },
          { days: "Day 300+",   label: "Energise & O&M" },
        ]}
        groups={[
          { label: "SOURCE & DESIGN", range: "Day 0–75" },
          { label: "BUILD & METER",   range: "Day 75–300" },
          { label: "OPERATE",         range: "Day 300+" },
        ]}
      />
    ),
  },
  // 13
  {
    title: "Electricity Distribution: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        heading="TAQA Power: Scale, Efficiency & Yield"
        subheading="One of Egypt's first private utilities licensed for power generation and distribution"
        body="Anchored by major substations like 6th of October (250 MVA) and Nabq (160 MVA), TAQA Power delivers end-to-end infrastructure — engineering, EPC, substations, grid connections and distribution networks — plus smart energy management, advanced metering and digital tools for uninterrupted supply. Trusted by tier-1 developers including LMD, Marakez, Pioneer Property and Emaar for integrated utility management and renewable-energy integration that maximizes asset value long term."
        stats={[
          { value: "1,600+", label: "Total MVA distributed across Egypt" },
          { value: "31M m²", label: "Area covered across concessions" },
          { value: "12k+",   label: "End users connected to electricity" },
          { value: "Tier-1", label: "Developers trust TAQA — LMD, Marakez, Emaar & more" },
        ]}
      />
    ),
  },

  // ── Gas Distribution ─────────────────────────────────────────────────────────
  // 14
  {
    title: "Gas Distribution: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
        subtitle="End-to-end EPC for natural-gas distribution networks across industrial sites, parks and free zones."
        taqaInvests={["City-gate & PRMS stations", "Steel distribution mains", "Factory service lines", "Industrial meters & regulators"]}
        steps={[
          "TAQA secures the concession and designs the gas grid.",
          "Mains and service lines are laid across the zone.",
          "Pressure is regulated to each factory's process needs.",
          "Connections are metered, tested and commissioned.",
          "TAQA operates, inspects and bills for gas delivered.",
        ]}
        whatYouReceive={["A licensed industrial gas network", "6.4 BCM per year", "Process-grade gas to every factory", "Lifetime O&M and emergency response"]}
      />
    ),
  },
  // 15
  {
    title: "Gas Distribution: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
        whatYouGain={[
          { label: "Diesel & LPG Fuel-Switching",          desc: "Manage the full transition from diesel and LPG to cleaner, cheaper natural gas." },
          { label: "Flexible Gas Sourcing — M-CNG or SNG", desc: "Where no fixed pipeline exists yet, gas is supplied via M-CNG (mobile CNG) or SNG — no factory waits." },
          { label: "Lower Factory Bills",                  desc: "Subsidized piped natural gas is far cheaper than LPG cylinders or electric heating." },
          { label: "Higher Asset Value",                   desc: "Connection to the national gas grid is a core industrial utility that lifts site value and tenancy." },
        ]}
        taqaEdge={[
          { label: "Flexible Commercial Models",    desc: "Delivered as EPC, long-term O&M or BOO — choose the structure that fits your balance sheet." },
          { label: "External & Internal Networks",  desc: "TAQA builds the external distribution backbone and the internal factory network." },
          { label: "One Partner Across All Phases", desc: "One accountable party from feasibility to handover — in-house engineering arm EGUSCO builds to spec." },
          { label: "Standards Compliance",          desc: "Aligned with IGEM, EGAS and international gas-safety standards — de-risks approvals." },
        ]}
      />
    ),
  },
  // 16
  {
    title: "Gas Distribution: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
        phases={[
          { days: "Day 0–25",    label: "Feasibility" },
          { days: "Day 25–70",   label: "Engineering" },
          { days: "Day 70–120",  label: "Procurement" },
          { days: "Day 120–240", label: "Construction" },
          { days: "Day 240–280", label: "Commissioning" },
          { days: "Day 280+",    label: "Operation" },
        ]}
        groups={[
          { label: "PLAN & DESIGN",        range: "Day 0–70" },
          { label: "PROCURE & BUILD",      range: "Day 70–240" },
          { label: "COMMISSION & OPERATE", range: "Day 240+" },
        ]}
      />
    ),
  },
  // 17
  {
    title: "Gas Distribution: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
        heading="Egypt's Largest Private Gas Distribution Network"
        subheading="Egypt's first private natural gas distributor, licensed by EGAS"
        body="TAQA Gas is Egypt's first private natural gas distributor, licensed by EGAS — running the country's largest private pipeline network end-to-end, from engineering to 24/7 emergency response, and ISO-certified throughout."
        stats={[
          { value: "1.9M",  label: "Customers — residential, commercial & industrial" },
          { value: "+25",   label: "Exclusive governorate concessions" },
          { value: "66%",   label: "Share of Egypt's private gas concessions" },
          { value: "10k+",  label: "Kilometers of high-pressure pipeline" },
        ]}
      />
    ),
  },

  // ── CHP ──────────────────────────────────────────────────────────────────────
  // 18
  {
    title: "CHP: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={4} solutionLabel="CHP" color="#b45309" icon={chpIcon} photo={P.chp}
        subtitle="Combined Heat & Power — capturing waste heat to deliver electricity plus thermal energy from a single fuel input."
        taqaInvests={["Gas engine/turbine genset", "Waste-heat recovery unit", "Absorption chiller (tri-gen)", "Grid sync, controls & SCADA"]}
        steps={[
          "Natural gas feeds the on-site engine or turbine.",
          "The genset generates electricity for your plant.",
          "Exhaust and jacket heat are captured, not wasted.",
          "Recovered heat becomes steam, hot water — and cooling via chiller.",
          "Controls sync to the grid and match output to your load.",
        ]}
        whatYouReceive={["On-site power plus steam, hot water & cooling", "Up to ~85% total fuel efficiency", "One fuel input, three energy outputs"]}
      />
    ),
  },
  // 19
  {
    title: "CHP: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={4} solutionLabel="CHP" color="#b45309" icon={chpIcon} photo={P.chp}
        whatYouGain={[
          { label: "Lower Energy Costs",       desc: "A single fuel input delivers both electricity and thermal energy, cutting unit costs." },
          { label: "High Overall Efficiency",  desc: "Up to ~85% efficiency by capturing waste heat that would otherwise be lost." },
          { label: "Flexible Thermal Outputs", desc: "Steam, hot water, chilled water or direct heat — matched to process needs." },
          { label: "Reduced CO₂ Emissions",    desc: "Higher fuel utilization translates into a smaller carbon footprint per unit of output." },
        ]}
        taqaEdge={[
          { label: "Flexible Commercial Models",    desc: "Delivered as EPC, long-term O&M or BOO — choose the structure that fits your balance sheet." },
          { label: "Integrated Gas + CHP Solution", desc: "TAQA can supply both the natural gas and the CHP plant — one accountable provider for fuel and power." },
          { label: "Guaranteed Performance",        desc: "TAQA's O&M and performance guarantees keep the system running at peak efficiency." },
          { label: "Reliability & Smart O&M",       desc: "24/7 predictive maintenance and rapid-response teams with guaranteed SAIDI / SAIFI performance." },
        ]}
      />
    ),
  },
  // 20
  {
    title: "CHP: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={4} solutionLabel="CHP" color="#b45309" icon={chpIcon} photo={P.chp}
        phases={[
          { days: "Day 0–21",    label: "Energy Audit (power & thermal load profiling)" },
          { days: "Day 21–60",   label: "System Design (CHP sizing & tri-gen configuration)" },
          { days: "Day 45–80",   label: "Commercial Model (BOO/BOOT & performance guarantee)" },
          { days: "Day 80–160",  label: "Procurement (gensets, HRSG & chillers)" },
          { days: "Day 160–270", label: "Install & Commission" },
          { days: "Day 270+",    label: "O&M" },
        ]}
        groups={[
          { label: "AUDIT & DESIGN", range: "Day 0–60" },
          { label: "FINANCE & BUILD", range: "Day 45–270" },
          { label: "OPERATE",        range: "Day 270+" },
        ]}
      />
    ),
  },
  // 21
  {
    title: "CHP: Case Study “MAFI”",
    render: () => (
      <SingleLineTrackSlide
        solutionNum={4} solutionLabel="CHP" color="#b45309" icon={chpIcon}
        heading="Owning and Operating High-Efficiency Captive Generation"
        subheading="A show of muscle — what TAQA Arabia has already delivered · Captive Power & Cogeneration"
        body="A 9 MW captive CHP station saves the client EGP 6bn over the project life at 65%+ efficiency."
        data={MAFI_CHART}
        xKey="year"
        seriesKey="value"
        seriesName="MAFI value delivered"
        yLabel="EGP, millions"
        valueFormatter={(v) => `${v}M`}
        stats={[
          { value: "4 Products", label: "Electricity, steam, chilled water and boiled water" },
          { value: "6 Billion",  label: "EGP savings over 20 years" },
          { value: "~85%",       label: "CHP fuel efficiency" },
          { value: "24/7",       label: "Performance-guaranteed O&M" },
        ]}
      />
    ),
  },

  // ── Solar ─────────────────────────────────────────────────────────────────────
  // 22
  {
    title: "Solar: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={5} solutionLabel="Solar" color="#ca8a04" icon={solarIcon} photo={P.solar}
        subtitle="Tailored solar PV solutions delivering measurable value across financing, sustainability and operations."
        taqaInvests={["Rooftop & ground-mount PV", "Inverters & transformers", "Connection & net-metering works", "Monitoring & SCADA"]}
        steps={[
          "TAQA assesses roof, land and the plant's load curve.",
          "PV arrays and inverters are installed and grid-tied.",
          "Panels generate clean power across the working day.",
          "Solar offsets daytime process and facility loads.",
          "TAQA monitors yield and maintains the system.",
        ]}
        whatYouReceive={["On-site solar cutting daytime grid draw", "Lower, hedged energy cost from day one", "Monitored, maintained PV assets"]}
      />
    ),
  },
  // 23
  {
    title: "Solar: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={5} solutionLabel="Solar PV" color="#ca8a04" icon={solarIcon} photo={P.solar}
        whatYouGain={[
          { label: "Lower Energy Bills",       desc: "Solar's cost per kWh sits well below the grid tariff — factories save from day one." },
          { label: "Tariff-Hike Hedge",        desc: "Lock in clean-energy cost for decades and insulate the factory from grid-price escalation." },
          { label: "Higher Property Value",    desc: "Solar-equipped, lower-running-cost sites command a premium." },
          { label: "Green Living Credentials", desc: "Visible clean energy strengthens the site's ESG and sustainability story." },
        ]}
        taqaEdge={[
          { label: "Egypt's Solar Pioneer",      desc: "TAQA was the first national company to commercially operate a plot at the Benban solar park." },
          { label: "Flexible Models",            desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time, or buy cheaper solar under a zero-capex PPA." },
          { label: "Turnkey Engineering",        desc: "Survey, design, supply, installation and grid tie-in delivered end-to-end by one partner." },
          { label: "Lifecycle O&M & Guarantee", desc: "Remote monitoring, maintenance and performance guarantees keep output high for 25+ years." },
        ]}
      />
    ),
  },
  // 24
  {
    title: "Solar: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={5} solutionLabel="Solar" color="#ca8a04" icon={solarIcon} photo={P.solar}
        phases={[
          { days: "Day 0–21",    label: "Site & Energy Study" },
          { days: "Day 21–55",   label: "System Design" },
          { days: "Day 40–75",   label: "PPA Structuring" },
          { days: "Day 75–130",  label: "Procurement" },
          { days: "Day 130–210", label: "Install & Commission" },
          { days: "Day 210+",    label: "O&M" },
        ]}
        groups={[
          { label: "STUDY & DESIGN",  range: "Day 0–55" },
          { label: "FINANCE & BUILD", range: "Day 40–210" },
          { label: "OPERATE",         range: "Day 210+" },
        ]}
      />
    ),
  },
  // 25
  {
    title: "Solar: Case Study “ASCOM”",
    render: () => (
      <ChartTrackRecordSlide
        solutionNum={5} solutionLabel="Solar" color="#ca8a04" icon={solarIcon}
        heading="Developing and Investing in Tailored Solar Across Egypt"
        subheading="A show of muscle — what TAQA Arabia has already delivered · 7 MW ASCOM solar plant"
        body="TAQA's 7 MW ASCOM solar plant cuts tariffs 15% and saved the client EGP 340M over 25 years."
        data={SOLAR_CHART}
        xKey="year"
        series={[
          { key: "taqa", name: "TAQA Tariff", color: "#facc15" },
          { key: "gov", name: "Government (MV) Tariff", color: "#94a3b8" },
        ]}
        yLabel="EGP / kWh"
        stats={[
          { value: "BOO/BOOT",     label: "PPA models, no client capex" },
          { value: "~1,000",       label: "t CO₂ avoided / MWp / yr" },
          { value: "340 Million",  label: "EGP total savings over 25 years" },
          { value: "24/7",         label: "Monitoring & O&M" },
        ]}
      />
    ),
  },

  // ── Energy Storage (BESS) ─────────────────────────────────────────────────────
  // 26
  {
    title: "Energy Storage (BESS): Scope",
    render: () => (
      <ScopeSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon} photo={P.battery}
        subtitle="Battery Energy Storage Systems — storing clean power to cut peak charges, firm up solar and secure supply."
        taqaInvests={["Battery energy-storage units", "Power-conversion system & inverters", "Switchgear & grid interface", "EMS & SCADA controls"]}
        steps={[
          "TAQA sizes storage to the plant's load and tariff profile.",
          "Battery units and conversion systems are installed.",
          "Storage charges when power is cheap or solar is surplus.",
          "It discharges to shave peaks and bridge outages.",
          "An energy-management system optimizes every cycle.",
        ]}
        whatYouReceive={["Peak shaving and lower demand charges", "Backup through grid disturbances", "Stored surplus from solar or off-peak"]}
      />
    ),
  },
  // 27
  {
    title: "Energy Storage (BESS): Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon} photo={P.battery}
        whatYouGain={[
          { label: "Peak-Demand Savings",      desc: "Discharge stored energy during peak hours to slash demand charges and tariff exposure." },
          { label: "Uninterrupted Production", desc: "Instant-response backup protects critical lines and avoids costly downtime during outages." },
          { label: "Grid Services Revenue",    desc: "Frequency regulation and load balancing can create new value streams." },
          { label: "Future-Proof & Green",     desc: "Enables deeper renewable integration and supports the plant's decarbonisation roadmap." },
        ]}
        taqaEdge={[
          { label: "Flexible Models",           desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time, or buy cheaper solar under a zero-capex PPA." },
          { label: "Smart Energy Management",   desc: "EMS analytics optimize charge/discharge automatically against tariffs and loads." },
          { label: "Lifecycle O&M & Guarantee", desc: "Remote monitoring, maintenance and performance guarantees keep output high for 25+ years." },
          { label: "One Energy Stack",          desc: "Storage, solar, power and gas from a single provider." },
        ]}
      />
    ),
  },
  // 28
  {
    title: "Energy Storage (BESS): Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon} photo={P.battery}
        phases={[
          { days: "Day 0–21",    label: "Load & Tariff Study" },
          { days: "Day 21–55",   label: "System Design (BESS sizing & use-case config)" },
          { days: "Day 40–75",   label: "Commercial Model" },
          { days: "Day 75–140",  label: "Procurement" },
          { days: "Day 140–220", label: "Install & Commission" },
          { days: "Day 220+",    label: "Smart O&M" },
        ]}
        groups={[
          { label: "STUDY & DESIGN",  range: "Day 0–55" },
          { label: "FINANCE & BUILD", range: "Day 40–220" },
          { label: "SMART OPERATE",   range: "Day 220+" },
        ]}
      />
    ),
  },
  // 29
  {
    title: "BESS: Backup Power & Grid Relief",
    render: () => (
      <BeforeAfterBarSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon}
        heading="From Diesel Backup to Smart Grid Support"
        subheading="Replacing diesel backup with BESS, paired with solar for a smarter grid"
        body="TAQA Arabia is currently deploying BESS as a direct alternative to diesel generators for backup power — cutting fuel logistics, maintenance, and emissions from standby operations. Paired with solar PV, the same BESS asset shifts stored daytime generation into peak-demand hours, easing the load carried by client transformers and helping defer costly infrastructure upgrades."
        data={BESS_CHART}
        yLabel="Relative peak transformer load (index, Before = 100)"
        deltaLabel="Peak Transformer Load — Before vs After BESS"
        stats={[
          { value: "35%",               label: "Reduction in peak transformer loading" },
          { value: "Diesel Displacement", label: "Backup runtime shifted from diesel to BESS" },
          { value: "Peak Shifting",     label: "Solar stored by day, discharged at peak demand" },
          { value: "BOO/BOOT",          label: "No client capex" },
        ]}
      />
    ),
  },

  // ── Closing ───────────────────────────────────────────────────────────────────
  // 30
  { title: "Why One Partner", render: () => <WhyOnePartnerSlide /> },
  // 31
  { title: "Cross-Solution Benefits", render: () => <BundleSlide /> },
  // 32
  { title: "Success Story: Integrated Industrial Energy", render: () => <SuccessStorySlide /> },
];

// ─── Narration (Play as Video) ─────────────────────────────────────────────────
// One entry per SLIDES index, same order, same length (33).

const NARRATION: readonly string[] = [
  // 0 — Cover
  "TAQA Arabia presents an integrated energy roadmap built for industrial clients. Over the next slides, six solutions — Mobile CNG, Electricity, Gas, Combined Heat and Power, Solar and Energy Storage — are unpacked one at a time, covering what TAQA builds and owns, the value each delivers, the timeline from first contact to live operation, and the track record behind it, all under one accountable partner spanning Gas, Power, Petroleum and Water.",
  // 1 — About TAQA Arabia
  "Founded in 2006 and listed on the Egyptian Exchange since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility developer. Its four divisions cover Gas — distribution, EPC and mobile CNG; Power — generation and distribution beyond 1,600 MVA, plus renewables and EV charging; Petroleum — oil-marketing and bulk fuel; and Water — desalination and filtration. TAQA finances, builds, owns and operates the utility backbone of industrial zones, residential communities and touristic destinations, an active International Gas Union member and IGEM-accredited throughout.",
  // 2 — Regional Presence
  "This is TAQA Arabia's actual footprint today, not an aspiration. The platform spans ten countries across Egypt, the GCC, Africa, Greece and South Asia, operating through four divisions — Gas, Power, Petroleum and Water. Within Egypt alone it reaches more than twenty governorates, and the whole platform is staffed by over 3,400 employees delivering live projects on the ground. The map that follows shows exactly what TAQA is building and operating in each market, both established and under study.",
  // 3 — In Numbers
  "In fiscal year 2025, TAQA Arabia generated EGP 13.4 billion in revenue on more than EGP 18 billion in group-wide assets under management, serving roughly 6.5 million gas customers nationwide. By division: Gas runs over 10,000 kilometers of network across 8 fifteen-year governorate concessions; Power distributes more than 1,600 MVA and generates over 150 MW; Water delivers over 47,000 cubic meters a day of desalination across 15 locations; and Mobility operates 300 stations, including Egypt's first private EV-charging license.",
  // 4 — Trusted By
  "This is a representative cross-section of the clients and partners TAQA Arabia already serves across every division — leading real-estate developers, industrial majors, hospitality groups and institutions who rely on TAQA for gas, power, water and integrated utility management. Their continued trust, often spanning multiple projects and multiple divisions at once, is itself the strongest evidence that the one-stop-shop model works in practice, not just on paper, for organizations with serious operational and reputational stakes.",
  // 5 — Solutions Overview
  "Six integrated solutions make up TAQA Arabia's offering for industrial sites, factories and parks. Mobile CNG delivers off-grid gas via virtual pipeline with zero infrastructure capex, Electricity Distribution provides turnkey MV and LV networks with smart metering and O&M, and Gas Distribution covers full network EPC from design to operation. Combined Heat and Power reaches nearly 85 percent efficiency from one fuel input, Solar delivers clean power below grid tariffs via PPA, and Battery Storage handles peak shaving, solar firming and backup power.",
  // 6 — Mobile CNG: Scope
  "Now, let's talk about our Mobile CNG solution. TAQA funds, builds, owns and operates the mobile CNG asset — the mother station and compression, the CNG and virtual-pipeline trailers, on-site decompression and PRMS skid, and industrial metering and controls. Gas is compressed to roughly 250 bar at the mother station, trucked to the plant as a virtual pipeline, then decompressed on-site to feed boilers, furnaces and process lines. TAQA tracks usage and refills ahead of demand, so the factory pays only for the gas it consumes, with little to no upfront capital.",
  // 7 — Mobile CNG: Value Proposition
  "Mobile CNG cuts fuel costs against diesel and LPG, replacing LPG and electric heating across the development. Emissions drop roughly 24 percent versus diesel, lowering NOx and particulates for ESG and green-rating targets, while offsetting diesel-quota reliance. TAQA delivers it as BOO, BOOT or EPC through Capacity-as-a-Service, refilled on schedule by a nationwide trailer fleet via Master Gas stations. It scales from a Starter load of 550 litres diesel-equivalent per day to Heavy loads above 5,500 litres, growing with occupancy before bridging to the grid.",
  // 8 — Mobile CNG: Timeline
  "The process moves in parallel to get factories running fast. Discovery and initial contact happen within the first three days, followed by a site audit through day seven and a signed contract by day fourteen. Mobilization runs from day fifteen through thirty, on-site installation follows between day ninety and one-hundred-twenty, and live gas typically flows to the plant somewhere between day one-hundred-twenty and day two-hundred — turning an off-grid site into a fully gas-fed facility in well under a year.",
  // 9 — Mobile CNG: Track Record
  "TAQA was the first company in Egypt to supply natural gas through a mobile virtual pipeline, and the twenty-five-year outlook shows why it matters: TAQA's CNG price consistently undercuts diesel, and that gap only widens further with every passing year. That advantage is already proven in the field across an 86-station network spanning 20 governorates, reaching 4 off-grid governorates that have no fixed pipeline access at all — including delivering gas to an entire governorate, El Kharga, among 10 existing Mobile CNG projects nationwide.",
  // 10 — Electricity Distribution: Scope
  "Now, let's talk about our Electricity Distribution solution. TAQA designs the zone's power network around actual factory load demands, then builds and energizes the HV and MV substations, switchgear, distribution transformers, cabling and protection equipment. Smart meters bill each factory individually for its own consumption, and a 24/7 control room keeps the entire zone powered, balanced and monitored. The result is a licensed industrial power network — already delivering 450 MVA across zones — with reliable supply, metering, billing and operations all handled by one accountable party.",
  // 11 — Electricity Distribution: Value Proposition
  "A profit-share model turns the distribution network from a cost center into a potential new revenue stream, while demand-side management and tariff optimization lower every factory's bill. Power quality is guaranteed — stable, metered and billable from handover, without relying on stretched public utilities — and the network is built future-ready for solar, storage and EV loads from day one. TAQA delivers it as EPC build, licensed O&M or profit-share, backed by 24/7 predictive maintenance and guaranteed SAIDI and SAIFI performance.",
  // 12 — Electricity Distribution: Timeline
  "Power sourcing runs through the first thirty days, followed by engineering approval out to day seventy-five and MEP approval through day one-hundred-twenty. Network build then proceeds from day one-hundred-twenty through two-hundred-forty, smart metering rolls out through day three-hundred, and the network is energized and moves into full ongoing O&M beyond day three-hundred — sourcing and design in the first quarter, build and metering across the middle stretch, and operation from there on.",
  // 13 — Electricity Distribution: Track Record
  "TAQA Power is one of Egypt's first private utilities licensed for generation and distribution, anchored by substations including 6th of October at 250 MVA and Nabq at 160 MVA. It delivers end-to-end infrastructure — engineering, EPC, substations, grid connections and distribution networks — alongside smart energy management, metering and digital monitoring tools. Today that means over 1,600 MVA distributed across 31 million square meters, serving more than 12,000 end users — trusted by tier-one developers including LMD, Marakez, Pioneer Property and Emaar for renewable-energy integration.",
  // 14 — Gas Distribution: Scope
  "Now, let's talk about our Gas Distribution solution. TAQA secures the concession and designs the gas grid, then lays steel distribution mains and factory service lines from the city-gate and PRMS stations across the entire zone. Pressure is regulated down to each factory's specific process needs, every connection is metered, tested and commissioned, and TAQA continues to operate, inspect and bill for gas delivered. The result is a licensed industrial gas network moving 6.4 billion cubic meters a year, delivering process-grade gas to every factory with lifetime O&M and emergency response.",
  // 15 — Gas Distribution: Value Proposition
  "TAQA manages the full transition from diesel and LPG to cleaner, cheaper natural gas, bridging supply through mobile CNG or SNG where no fixed pipeline exists yet, so no factory waits. Subsidized piped gas runs far cheaper than LPG cylinders or electric heating, and connection to the national gas grid lifts both site value and tenancy. TAQA delivers it as EPC, long-term O&M or BOO, building the external and internal networks through its engineering arm EGUSCO, aligned with IGEM, EGAS and international gas-safety standards.",
  // 16 — Gas Distribution: Timeline
  "Feasibility work runs through day twenty-five, followed by engineering through day seventy and procurement through day one-hundred-twenty. Construction then continues from day one-hundred-twenty through two-hundred-forty, commissioning wraps up by day two-hundred-eighty, and the network moves into full operation from there — planning and design in the early phase, procurement and build through the middle, and commissioning straight into ongoing operation beyond day two-hundred-eighty.",
  // 17 — Gas Distribution: Track Record
  "TAQA Gas was Egypt's first private natural gas distributor, licensed by EGAS, and it now runs the country's largest private pipeline network end-to-end — from engineering through 24/7 emergency response, ISO-certified throughout. That network today serves 1.9 million residential, commercial and industrial customers across more than 25 exclusive governorate concessions, representing 66 percent of all of Egypt's private gas concessions, delivered through over 10,000 kilometers of high-pressure pipeline — a scale no other private operator in the country comes close to matching.",
  // 18 — CHP: Scope
  "Now, let's talk about our Combined Heat and Power solution. A single gas-fed engine or turbine generates electricity for the plant, while otherwise-wasted exhaust and jacket heat is captured by a waste-heat recovery unit and converted into steam, hot water, and — through an absorption chiller in tri-generation mode — chilled water. Grid-sync controls and SCADA keep output matched to the site's real-time load. TAQA installs and owns the genset, the heat-recovery unit and the chiller, so one fuel input delivers three energy outputs at up to 85 percent total efficiency.",
  // 19 — CHP: Value Proposition
  "Combined Heat and Power reaches up to 85 percent efficiency by capturing waste heat a standard generator would lose, cutting energy cost from a single fuel input while shrinking carbon footprint per unit of output. Thermal outputs are flexible — steam, hot water, chilled water or direct heat, matched to process — and TAQA can supply both the gas and the CHP plant as one accountable provider, delivered as EPC, long-term O&M or BOO, backed by performance guarantees and maintenance with guaranteed SAIDI and SAIFI.",
  // 20 — CHP: Timeline
  "An energy audit profiling both power and thermal load runs through day twenty-one, followed by system design covering CHP sizing and tri-generation configuration through day sixty, with the commercial model — BOO, BOOT or a performance guarantee — settled in parallel by day eighty. Procurement of gensets, heat-recovery units and chillers runs through day one-hundred-sixty, installation and commissioning continue through day two-hundred-seventy, and the plant then moves into full ongoing O&M beyond that point.",
  // 21 — CHP: Case Study "MAFI"
  "At client MAFI, TAQA owns and operates a 9 megawatt captive CHP station running above 65 percent efficiency, delivering four distinct products from one plant — electricity, steam, chilled water and boiled water. Over the project's 20-year life, that single station has already generated EGP 6 billion in savings for the client, backed by round-the-clock, performance-guaranteed O&M that keeps efficiency near 85 percent. It's a concrete demonstration of what TAQA Arabia has already delivered in high-efficiency captive generation, not a projection.",
  // 22 — Solar: Scope
  "Now, let's talk about our Solar solution. TAQA assesses the site's roof or land area alongside its load curve, then installs and grid-ties rooftop or ground-mount PV arrays, inverters and transformers, together with the connection and net-metering works needed for tie-in. Panels generate power across the working day to offset daytime process and facility loads, while TAQA continues to monitor yield and maintain the system. The client receives on-site solar that cuts daytime grid draw, a lower and hedged energy cost from day one, and a fully monitored, maintained PV asset.",
  // 23 — Solar: Value Proposition
  "Solar's cost per kilowatt-hour sits well below the grid tariff, and locking that rate in for decades hedges the site against tariff-hike escalation. Solar-equipped sites with lower running costs command a property-value premium, and visible clean energy strengthens the site's ESG and sustainability story. TAQA was the first national company to operate a plot at the Benban solar park, delivers it as CAPEX, BOOT, BOO or zero-capex PPA, handles survey through grid tie-in, and backs it with remote monitoring and performance guarantees for 25-plus years.",
  // 24 — Solar: Timeline
  "A site and energy study runs through day twenty-one, followed by system design through day fifty-five, with PPA structuring proceeding in parallel from day forty through seventy-five. Procurement continues through day one-hundred-thirty, installation and commissioning run through day two-hundred-ten, and the system then enters full ongoing O&M beyond that point — study and design first, financing and build through the middle stretch, and operation from day two-hundred-ten onward.",
  // 25 — Solar: Case Study "ASCOM"
  "TAQA's 7 megawatt ASCOM solar plant holds its tariff consistently below the government medium-voltage rate across the entire 25-year horizon, cutting tariffs by 15 percent and saving the client EGP 340 million in total over that period. Delivered under BOO or BOOT PPA models with no client capex at all, the plant also avoids roughly 1,000 tonnes of CO2 per megawatt-peak every year, all under continuous 24/7 monitoring and O&M — a direct demonstration of TAQA developing and investing in tailored solar across Egypt.",
  // 26 — Energy Storage (BESS): Scope
  "Now, let's talk about our Energy Storage solution. TAQA sizes battery storage to the plant's load and tariff profile, then installs the battery units, power-conversion system, inverters, switchgear and grid interface, all managed by an energy-management system and SCADA controls. Storage charges automatically when power is cheap or on-site solar is in surplus, then discharges to shave demand peaks and bridge outages, with every cycle optimized by the EMS. The client receives peak shaving with lower demand charges, backup power through grid disturbances, and stored surplus energy captured from solar or off-peak periods.",
  // 27 — Energy Storage (BESS): Value Proposition
  "Discharging stored energy during peak hours slashes demand charges and tariff exposure, while instant-response backup protects critical production lines and avoids costly downtime during outages. Frequency regulation and load balancing can open new grid-services revenue, and renewable integration supports the plant's decarbonisation roadmap. TAQA delivers it as CAPEX, BOOT, BOO or PPA, with an EMS that optimizes charge and discharge against tariffs and loads, backed by 25-plus years of lifecycle O&M — one energy stack combining storage, solar, power and gas from a single provider.",
  // 28 — Energy Storage (BESS): Timeline
  "A load and tariff study runs through day twenty-one, followed by system design covering BESS sizing and use-case configuration through day fifty-five, with the commercial model settled in parallel from day forty through seventy-five. Procurement continues through day one-hundred-forty, installation and commissioning run through day two-hundred-twenty, and the system then moves into smart, EMS-managed O&M beyond that point — study and design first, financing and build through the middle, smart operation from day two-hundred-twenty onward.",
  // 29 — BESS: Backup Power & Grid Relief
  "TAQA Arabia is actively deploying BESS as a direct alternative to diesel generators for backup power, cutting fuel logistics, maintenance and emissions from standby operations. Paired with solar, the same battery asset shifts stored daytime generation into peak-demand hours, easing the load carried by client transformers and helping defer costly infrastructure upgrades. In practice, that has already cut peak transformer loading by 35 percent, shifted backup runtime away from diesel onto BESS, delivered under BOO or BOOT terms with no client capex required.",
  // 30 — Why One Partner
  "Consolidating every utility under TAQA removes interface risk and cuts complexity for the client. One SLA governs gas, power, CHP, solar and storage, with one uptime guarantee and one renewal. One communication point means one account team and a 24/7 hotline instead of chasing multiple contractors. One commercial relationship brings consolidated billing and aligned contract terms instead of separate procurement cycles. Utilities are engineered to interoperate from day one on shared infrastructure and monitoring, and one accountable owner carries end-to-end responsibility, removing finger-pointing between vendors.",
  // 31 — Cross-Solution Benefits
  "Combined under one SLA, TAQA's solutions compound in value beyond what any single vendor can match. Solar paired with storage lets BESS dispatch stored daytime solar after sunset, pushing self-consumption and PPA savings higher, while solar paired with distribution feeds TAQA's network to lower blended power cost. Gas fuels CHP under one provider, storage eases peak-demand load on distribution, mobile CNG bridges supply until the permanent network goes live, and one shared control room and field team pool spares and response for lower cost.",
  // 32 — Success Story: Integrated Industrial Energy
  "Across Egypt's industrial parks, TAQA Arabia combines gas distribution, power distribution and on-site generation into one integrated system for factories — supplying the fuel, building the network and running the assets. TAQA Power operates 450 MVA across nine industrial-park concessions, serving more than 500 factories, while the platform distributes 6.4 billion cubic meters of gas a year and over 150 megawatts of captive generation. It's proof the bundled, one-SLA model works — contact TAQA Arabia to explore how it can work for your site.",
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function IndustrialClients() {
  return (
    <DeckShell
      title="Industrial Clients"
      subtitle="TAQA Arabia · Integrated Energy & Utility Solutions · Jan 2026"
      sections={SECTIONS}
      slides={SLIDES}
      narration={NARRATION}
      pdf="industrial-clients.pdf"
    />
  );
}
