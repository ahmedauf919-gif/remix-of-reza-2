import { DeckShell } from "./DeckShell";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import type { CSSProperties } from "react";
import {
  Flame, Zap, Droplets, Truck, Battery, Globe, CheckCircle2, SunMedium,
  ArrowRight, Fuel, Route,
} from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";
import {
  SlideStyles, Kicker, CornerWash, Bracket, BlueprintGrid, ColHead,
  ScopeSlide, ValuePropSlide, TrackRecordSlide, TrustedBySlide, ChartTrackRecordSlide,
  d, hideImg, lighter,
} from "./slides";
import { TRUSTED_BY_LOGOS } from "./trustedByLogos";
// NOTE: TrustedBySlide, ChartTrackRecordSlide and TRUSTED_BY_LOGOS are the new shared
// components this deck must now use for its "Trusted By" and chart-based track-record
// slides — see the task brief. Do not remove these imports.

// ─── Photos ───────────────────────────────────────────────────────────────────

const P: Record<string, string> = {
  cover:   MEDIA + "crops-field.jpg",
  farm:    MEDIA + "integrated-farm.jpg",
  water:   MEDIA + "ro-plant.jpg",
  solar:   MEDIA + "solar-farm-aerial.jpg",
  battery: MEDIA + "site-containers.jpg",
  cng:     MEDIA + "cng-farm-truck.jpg",
  dina:    MEDIA + "farm-solar-containers.jpg",
  energy:  MEDIA + "solar-irrigation.jpg",
};

const ALT: Record<string, string> = {
  [P.cover]:   "Rolling farmland under a golden sky at sunset",
  [P.farm]:    "Tractor working long rows of crops on a large farm",
  [P.water]:   "Irrigation water flowing across cultivated fields",
  [P.solar]:   "Rows of solar photovoltaic panels under a clear sky",
  [P.battery]: "Utility-scale battery energy storage enclosures",
  [P.cng]:     "Rural road leading to agricultural facilities",
  [P.dina]:    "Sunlit green field on a large agricultural estate",
  [P.energy]:  "Power transmission infrastructure at dusk",
};

// ─── Constants ────────────────────────────────────────────────────────────────

const GREEN = "#15803d";
const LIME  = "#84cc16";
const GOLD  = "#FFC10E";
const NAVY  = "#002060";
const SKY   = "#0095C8";

/** Lighter tone per section color — used for gradient endpoints on local slides. */
const TONE: Record<string, string> = {
  "#15803d": "#84cc16",
  "#0095C8": "#5bc9f2",
  "#d97706": "#fbbf24",
  "#7B35C2": "#c084fc",
  "#E68A00": "#ffb84d",
  "#002060": "#4f7dd9",
  "#dc2626": "#f87171",
};
const tone = (c: string) => TONE[c] ?? lighter(c);

/** Gradient-text style helper. */
const gt = (from: string, to: string): CSSProperties => ({
  backgroundImage: `linear-gradient(100deg, ${from}, ${to})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});

// ─── Local slide chrome (built on the shared system) ──────────────────────────

/** Light content-slide chrome: shared styles + corner wash + blueprint grid. */
function LightSlide({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color={color} />
      <BlueprintGrid light />
      <div className="relative z-10 flex h-full min-h-0 flex-col p-14">{children}</div>
    </div>
  );
}

/** Dark "moment" slide chrome: forest gradient + duotone photo + accent glow. */
function DarkSlide({ photo, tint = GREEN, children }: { photo?: string; tint?: string; children: React.ReactNode }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(135deg, #04150c 0%, #0c2f1a 62%, #0a2a18 100%)" }}
    >
      <SlideStyles />
      {photo && (
        <img
          src={photo}
          alt={ALT[photo] ?? "Agricultural landscape"}
          loading="lazy"
          onError={hideImg}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          style={{ mixBlendMode: "luminosity" }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: `linear-gradient(115deg, rgba(4,21,12,0.94) 0%, rgba(7,30,17,0.78) 50%, ${tint}38 100%)` }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 -right-44 h-[600px] w-[600px] rounded-full"
        style={{ background: `radial-gradient(circle, ${tone(tint)}22, transparent 65%)` }}
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col p-14">{children}</div>
    </div>
  );
}

/** Small framed photo card with deck-hue gradient backdrop (never a white gap). */
function PhotoCard({ src, className = "" }: { src: string; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg shrink-0 ${className}`}
      style={{ background: "linear-gradient(135deg, #0c2f1a, #15803d)" }}
    >
      <img src={src} alt={ALT[src] ?? "Agricultural landscape"} className="absolute inset-0 h-full w-full object-cover" loading="lazy" onError={hideImg} />
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(4,21,12,0.05), rgba(4,21,12,0.28))" }} />
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "intro",     label: "Introduction",    color: GREEN,     slides: [0, 1, 2, 3, 4] },
  { id: "challenge", label: "The Challenge",   color: "#dc2626", slides: [5] },
  { id: "solution",  label: "Farm Solution",   color: GREEN,     slides: [6, 7] },
  { id: "overview",  label: "Overview",        color: GREEN,     slides: [8] },
  { id: "solar",     label: "Solar",           color: "#d97706", slides: [9, 10, 11] },
  { id: "cng",       label: "Mobile CNG",      color: "#E68A00", slides: [12, 13, 14] },
  { id: "water",     label: "Water Solutions", color: "#0095C8", slides: [15, 16, 17] },
  { id: "battery",   label: "Battery Storage", color: "#7B35C2", slides: [18, 19, 20] },
  { id: "closing",   label: "Closing",         color: NAVY,      slides: [21, 22, 23] },
];

function sectionOf(slideIdx: number) {
  return SECTIONS.find(s => s.slides.includes(slideIdx)) ?? SECTIONS[0];
}

// ─── Slide 0: Cover ───────────────────────────────────────────────────────────

function CoverSlide() {
  const pillars = [
    { icon: <Droplets className="w-4 h-4" />, label: "Water Solutions", color: SKY },
    { icon: <SunMedium className="w-4 h-4" />, label: "Solar", color: "#d97706" },
    { icon: <Battery className="w-4 h-4" />, label: "Battery Storage", color: "#7B35C2" },
    { icon: <Truck className="w-4 h-4" />, label: "Mobile CNG", color: "#E68A00" },
  ];
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(135deg, #04150c 0%, #0c2f1a 60%, #0a2a18 100%)" }}
    >
      <SlideStyles />
      <img
        src={P.cover}
        alt={ALT[P.cover]}
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(112deg, rgba(4,21,12,0.96) 0%, rgba(6,28,16,0.84) 46%, rgba(21,128,61,0.34) 100%)" }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-52 h-[560px] w-[560px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(132,204,22,0.16), transparent 65%)" }}
      />

      <div className="relative z-10 flex h-full flex-col px-14 pt-12 pb-10">
        {/* Top row */}
        <div className="sx-up flex items-center justify-between" style={d(0)}>
          <div className="rounded-xl bg-white/95 px-4 py-2 shadow-lg ring-1 ring-black/10">
            <img src={taqaLogo} alt="TAQA Arabia logo" className="h-9 object-contain" />
          </div>
          <Kicker color={GREEN} dark>Client Presentation · Jan 2026</Kicker>
        </div>

        {/* Title block */}
        <div className="flex-1 flex flex-col justify-center">
          <div
            className="sx-up h-[3px] w-20 rounded-full"
            style={{ ...d(80), background: `linear-gradient(90deg, ${GREEN}, ${LIME})` }}
          />
          <h1 className="sx-up mt-6 font-display text-[74px] font-bold leading-[0.98] tracking-tight text-white" style={d(140)}>
            Agriculture
            <br />
            <span style={gt("#4ade80", "#bef264")}>Clients</span>
          </h1>
          <p className="sx-up mt-5 text-[21px] text-white/85" style={d(220)}>Integrated Energy &amp; Utility Solutions</p>
          <div className="mt-8 flex items-center gap-3">
            {pillars.map((p, i) => (
              <div
                key={p.label}
                className="sx-up flex items-center gap-2.5 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md pl-2.5 pr-4 h-10"
                style={d(300 + i * 55)}
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                  style={{ background: `linear-gradient(135deg, ${p.color}, ${tone(p.color)})` }}
                >
                  {p.icon}
                </span>
                <span className="text-[16px] font-semibold text-white/90">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sx-in flex items-center justify-between border-t border-white/10 pt-5" style={d(500)}>
          <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/50">
            TAQA Arabia · Confidential
          </p>
          <p className="text-[14px] text-white/50">Jan 2026</p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 1: About TAQA Arabia ───────────────────────────────────────────────

function AboutSlide() {
  const divisions = [
    { label: "Gas",       icon: <Flame className="w-5 h-5" />,    desc: "Distribution, EPC & virtual pipeline",                       color: "#E68A00" },
    { label: "Power",     icon: <Zap className="w-5 h-5" />,      desc: "Generation & distribution (+1,600 MVA), solar PV, EV",      color: "#d97706" },
    { label: "Petroleum", icon: <Truck className="w-5 h-5" />,    desc: "Oil-marketing stations, lubricants",                        color: GREEN },
    { label: "Water",     icon: <Droplets className="w-5 h-5" />, desc: "Reverse-osmosis desalination, filtration, smart solar ops", color: SKY },
  ];
  return (
    <LightSlide color={GREEN}>
      <div className="sx-up" style={d(0)}><Kicker color={GREEN}>TAQA Arabia · Who We Are</Kicker></div>
      <h2 className="sx-up mt-4 max-w-[980px] font-display text-[42px] font-bold leading-[1.08] tracking-tight" style={{ ...d(60), color: NAVY }}>
        Egypt's leading integrated energy infrastructure developer
      </h2>

      <div className="mt-8 flex-1 min-h-0 grid grid-cols-2 gap-10">
        {/* Narrative + photo */}
        <div className="flex flex-col min-h-0">
          <div className="sx-up space-y-4 text-[17px] leading-relaxed text-slate-600" style={d(140)}>
            <p>
              Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest
              private-sector energy and utility developer.
            </p>
            <p>
              Across four divisions — Gas, Power, Petroleum and Water — TAQA finances, builds,
              owns and operates the utility backbone of residential communities, industrial zones
              and touristic destinations.
            </p>
            <p className="text-[14px] text-slate-400">
              Active member of the International Gas Union (IGU) · Accredited by the IGEM
              (Institution of Gas Engineers &amp; Managers).
            </p>
          </div>
          <div className="sx-up mt-6 flex-1 min-h-0" style={d(200)}>
            <PhotoCard src={P.farm} className="h-full w-full rounded-3xl" />
          </div>
        </div>

        {/* Division cards */}
        <div className="flex flex-col justify-between gap-3">
          {divisions.map((dv, idx) => (
            <div key={dv.label} className="sx-up flex-1" style={d(200 + idx * 65)}>
              <div className="relative flex h-full items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
                <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full" style={{ background: dv.color }} />
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${dv.color}, ${tone(dv.color)})` }}
                >
                  {dv.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[18px] font-bold" style={{ color: NAVY }}>{dv.label}</div>
                  <div className="text-[16px] text-slate-500 leading-snug">{dv.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Slide 2: Regional Presence ───────────────────────────────────────────────

function RegionalSlide() {
  const metrics = [
    { value: "10",     label: "Countries of presence",  sub: "Egypt, GCC, Africa & South Asia" },
    { value: "4",      label: "Operating divisions",    sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates in Egypt",  sub: "Industrial, residential & touristic" },
    { value: "3,400+", label: "Employees",              sub: "Across all divisions" },
  ];
  return (
    <LightSlide color={GREEN}>
      <div className="sx-up" style={d(0)}><Kicker color={GREEN}>TAQA Arabia · Regional Presence</Kicker></div>
      <h2 className="sx-up mt-4 max-w-[1020px] font-display text-[32px] font-bold leading-[1.08] tracking-tight" style={{ ...d(60), color: NAVY }}>
        Presence Across Africa &amp; the Middle East
      </h2>

      <div className="mt-5 flex-1 min-h-0 grid grid-cols-[300px_1fr] gap-6">
        {/* Metrics + narrative, stacked */}
        <div className="flex min-h-0 flex-col gap-3">
          {metrics.map((m, idx) => (
            <div key={m.label} className="sx-up flex-1" style={d(120 + idx * 60)}>
              <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
                <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full" style={{ background: `linear-gradient(180deg, ${GREEN}, ${LIME})` }} />
                <div className="pl-2.5">
                  <div className="font-display text-[28px] font-bold leading-none" style={gt(GREEN, "#4d9d2a")}>{m.value}</div>
                  <div className="mt-1 text-[15px] font-semibold leading-tight" style={{ color: NAVY }}>{m.label}</div>
                  <div className="text-[12.5px] text-slate-500 leading-tight">{m.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map — real, live TAQA Arabia footprint by country */}
        <div className="sx-up flex min-h-0 flex-col" style={d(360)}>
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-black/5 shadow-sm">
            <Bracket color={GREEN} pos="tr" />
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
    </LightSlide>
  );
}

// ─── Slide 3: In Numbers ──────────────────────────────────────────────────────

function NumbersSlide() {
  const heroStats = [
    { value: "EGP 13.4bn", label: "Revenue",                    sub: "FY 2025", hero: true },
    { value: "EGP 18bn+",  label: "Assets under Management",    sub: "Group-wide, FY 2025" },
    { value: "~7M",        label: "Customers across Egypt",     sub: "FY 2025" },
  ];
  const divCards = [
    { div: "GAS",            icon: <Flame className="h-4 w-4" />,    color: "#E68A00", stat: "+10,000 km network, 8 governorate concessions (15-yr)" },
    { div: "POWER",          icon: <Zap className="h-4 w-4" />,      color: "#d97706", stat: "+1,600 MVA distribution, +150 MW generation" },
    { div: "WATER",          icon: <Droplets className="h-4 w-4" />, color: "#0095C8", stat: "+47,000 m³/day desalination, 15 operational locations" },
    { div: "MOBILITY & CNG", icon: <Truck className="h-4 w-4" />,    color: "#7B35C2", stat: "300 total stations, 1st private EV-charging license" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color={GREEN} />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color={GREEN}>TAQA Arabia · In Numbers</Kicker>
        </div>
        <h2 className="sx-up mt-4 font-display text-[34px] font-bold leading-tight tracking-tight text-[#002060]" style={d(60)}>
          The scale behind a single integrated energy partner — FY 2025
        </h2>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {heroStats.map((m, i) => (
            <div
              key={m.label}
              className={`sx-up relative overflow-hidden rounded-2xl p-6 ${
                m.hero ? "col-span-2 text-white shadow-xl" : "bg-white ring-1 ring-black/5 shadow-sm"
              }`}
              style={{
                ...d(120 + i * 70),
                ...(m.hero ? { background: "linear-gradient(130deg, #04150c 0%, #0c2f1a 55%, #14532d 100%)" } : {}),
              }}
            >
              {m.hero && <BlueprintGrid />}
              {m.hero && <Bracket color="#a3e635" pos="br" />}
              <div
                className={`relative font-display font-bold leading-none tracking-tight bg-clip-text text-transparent ${m.hero ? "text-[52px]" : "text-[36px]"}`}
                style={{
                  backgroundImage: m.hero
                    ? "linear-gradient(100deg, #a3e635, #fde047)"
                    : `linear-gradient(100deg, ${GREEN}, #4ade80)`,
                }}
              >
                {m.value}
              </div>
              <div className={`relative mt-2.5 text-[17px] font-semibold ${m.hero ? "text-white" : "text-[#002060]"}`}>{m.label}</div>
              <div className={`relative mt-0.5 text-[14px] ${m.hero ? "text-white/70" : "text-slate-500"}`}>{m.sub}</div>
            </div>
          ))}
        </div>

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

// ─── Slide 4: The Challenge ───────────────────────────────────────────────────

function ChallengeSlide() {
  const pains = [
    {
      label: "Expensive Diesel Dependence",
      icon: <Fuel className="w-5 h-5" />,
      color: "#dc2626",
      desc: "Pivots and pumps run on diesel gensets — the single largest and most volatile cost on the farm, exposed to every fuel-price spike.",
    },
    {
      label: "No Pipeline, No Grid",
      icon: <Route className="w-5 h-5" />,
      color: "#c084fc",
      desc: "Remote reclamation land sits far from the gas pipeline and the electricity grid, with no easy connection in sight.",
    },
    {
      label: "Water Insecurity",
      icon: <Droplets className="w-5 h-5" />,
      color: SKY,
      desc: "Over-abstracted groundwater and unreliable supply put crop yield — and the whole investment — at risk.",
    },
    {
      label: "Fragile, Unmanaged Power",
      icon: <Zap className="w-5 h-5" />,
      color: "#f59e0b",
      desc: "Stand-alone gensets fail, waste fuel at part-load and offer no backup — an interruption can cost an entire irrigation cycle.",
    },
  ];
  return (
    <DarkSlide photo={P.farm} tint="#dc2626">
      <div className="sx-up" style={d(0)}><Kicker color="#dc2626" dark>Agriculture · The Challenge</Kicker></div>
      <h2 className="sx-up mt-5 max-w-[1080px] font-display text-[40px] font-bold leading-[1.08] tracking-tight text-white" style={d(70)}>
        Remote, off-grid agriculture is held back by costly fuel, fragile power and water insecurity
      </h2>
      <p className="sx-up mt-2 max-w-[1000px] text-[16px] text-white/70" style={d(110)}>
        Egypt is reclaiming millions of feddans of desert farmland — almost all of it off-grid.
      </p>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {pains.map((c, idx) => (
          <div key={c.label} className="sx-up" style={d(150 + idx * 65)}>
            <div className="h-full rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-5">
              <div
                className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${c.color}, ${tone(c.color)})` }}
              >
                {c.icon}
              </div>
              <h3 className="font-display text-[17px] font-bold text-white mb-2 leading-tight">{c.label}</h3>
              <p className="text-[15px] leading-relaxed text-white/85">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sx-up mt-auto" style={d(420)}>
        <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-6 pl-8">
          <Bracket color={LIME} pos="br" />
          <div aria-hidden className="absolute left-0 top-0 h-full w-[4px]" style={{ background: `linear-gradient(180deg, ${GREEN}, ${LIME})` }} />
          <div className="mb-1.5 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5" style={{ color: LIME }} />
            <h3 className="font-display text-[18px] font-bold" style={gt("#4ade80", "#bef264")}>TAQA's Integrated Answer</h3>
          </div>
          <p className="text-[17px] leading-relaxed text-white/90 max-w-[1020px]">
            One operator delivers clean water + a smart, multi-source power stack — solar by day, batteries after
            sunset, gas gensets for firming, diesel only as backup — all under a single BOO/BOOT agreement
            with no farm capex.
          </p>
        </div>
      </div>
    </DarkSlide>
  );
}

// ─── Slide 5: Integrated Farm Solution ───────────────────────────────────────

function IntegratedSolutionSlide() {
  const sources = [
    { icon: <SunMedium className="w-4 h-4" />, label: "Solar",          desc: "Cheapest day power",  color: "#d97706" },
    { icon: <Battery className="w-4 h-4" />,   label: "Battery",        desc: "Solar after sunset",  color: "#7B35C2" },
    { icon: <Truck className="w-4 h-4" />,     label: "Mobile CNG",     desc: "Clean gas firming",   color: "#E68A00" },
    { icon: <Flame className="w-4 h-4" />,     label: "Diesel Gensets", desc: "Backup / peaks only", color: "#6B6B6B" },
  ];
  return (
    <LightSlide color={GREEN}>
      <div className="sx-up" style={d(0)}><Kicker color={GREEN}>TAQA · Integrated Farm Solution</Kicker></div>
      <h2 className="sx-up mt-4 max-w-[1120px] font-display text-[38px] font-bold leading-[1.08] tracking-tight" style={{ ...d(60), color: NAVY }}>
        One partner connects water and a smart, multi-source power stack to keep every pivot turning
      </h2>

      <div className="mt-6 flex-1 min-h-0 flex flex-col gap-4">
        {/* Flow diagram */}
        <div className="flex-1 min-h-0 flex items-stretch gap-4">
          {/* Energy sources */}
          <div className="sx-up flex-1 min-h-0" style={d(160)}>
            <div className="relative h-full overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm flex flex-col">
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${GREEN}, ${LIME})` }} />
              <ColHead color={GREEN}>Energy Sources</ColHead>
              <div className="flex-1 flex flex-col justify-between gap-2">
                {sources.map(s => (
                  <div key={s.label} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: s.color + "0C" }}>
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                      style={{ background: `linear-gradient(135deg, ${s.color}, ${tone(s.color)})` }}
                    >
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[17px] font-semibold leading-tight" style={{ color: NAVY }}>{s.label}</div>
                      <div className="text-[13px] text-slate-500 leading-tight">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connector → EMS → connector */}
          <div className="sx-up flex items-center shrink-0" style={d(220)}>
            <div className="flex items-center">
              <div className="h-[2px] w-8" style={{ background: `linear-gradient(90deg, ${GREEN}30, ${GREEN})` }} />
              <ArrowRight className="w-4 h-4 -ml-1.5" style={{ color: GREEN }} />
              <div
                className="mx-1 flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full text-center text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${GREEN}, ${LIME})` }}
              >
                <Zap className="w-6 h-6 mb-1.5" style={{ color: "#fef9c3" }} />
                <div className="font-display text-[15px] font-bold leading-tight px-4">TAQA Smart<br />Energy Mgmt</div>
              </div>
              <div className="h-[2px] w-8" style={{ background: `linear-gradient(90deg, ${GREEN}, ${GREEN}30)` }} />
              <ArrowRight className="w-4 h-4 -ml-1.5" style={{ color: GREEN }} />
            </div>
          </div>

          {/* Output */}
          <div className="sx-up flex-1 min-h-0" style={d(280)}>
            <div
              className="relative h-full overflow-hidden rounded-2xl p-6 text-white flex flex-col justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0c2f1a 100%)` }}
            >
              <BlueprintGrid />
              <Bracket color={GOLD} pos="br" />
              <div
                aria-hidden
                className="absolute -right-12 -bottom-16 h-48 w-48 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(132,204,22,0.2), transparent 65%)" }}
              />
              <p className="relative font-display text-[15px] font-semibold uppercase tracking-[0.22em] mb-2.5" style={{ color: GOLD }}>
                Powered Pivots 24/7
              </p>
              <p className="relative text-[17px] leading-relaxed text-white/90">
                Round-the-clock irrigation — optimised source mix, always on, minimum cost.
              </p>
            </div>
          </div>
        </div>

        {/* Water strip */}
        <div className="sx-up" style={d(360)}>
          <div className="flex items-center gap-4 rounded-2xl px-5 py-3.5 ring-1 ring-black/5 bg-white shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${SKY}, ${tone(SKY)})` }}>
              <Droplets className="w-4 h-4" />
            </div>
            <span className="font-display text-[16px] font-bold" style={{ color: NAVY }}>Water Solutions</span>
            <span className="text-[16px] text-slate-500">Desalination · Wells · Pumping</span>
          </div>
        </div>

        {/* Quote */}
        <div className="sx-up" style={d(420)}>
          <div
            className="rounded-2xl px-5 py-3.5 text-center font-display text-[16px] font-semibold"
            style={{ background: GREEN + "0D", boxShadow: `inset 0 0 0 1px ${GREEN}26`, color: "#14532d" }}
          >
            "TAQA delivers the whole farm energy-and-water backbone as one system."
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Slide 6: Smart Energy Mix ────────────────────────────────────────────────

function SmartEnergyMixSlide() {
  const steps = [
    { n: "01", icon: <SunMedium className="w-5 h-5" />, color: "#d97706", title: "Solar first",      desc: "Cheapest, cleanest power runs the pivots all day." },
    { n: "02", icon: <Battery className="w-5 h-5" />,   color: "#7B35C2", title: "Then batteries",   desc: "Stored daytime solar carries irrigation into the evening and early morning." },
    { n: "03", icon: <Truck className="w-5 h-5" />,     color: "#E68A00", title: "Gas gensets firm", desc: "Mobile-CNG gensets fill gaps at ~40% less than diesel." },
    { n: "04", icon: <Flame className="w-5 h-5" />,     color: "#6B6B6B", title: "Diesel last",      desc: "Runs only for peaks and backup — minimised, not relied on." },
  ];
  return (
    <LightSlide color={GREEN}>
      <div className="sx-up" style={d(0)}><Kicker color={GREEN}>TAQA · Smart Energy Mix</Kicker></div>
      <h2 className="sx-up mt-4 max-w-[1120px] font-display text-[38px] font-bold leading-[1.08] tracking-tight" style={{ ...d(60), color: NAVY }}>
        Solar by day, batteries after sunset, gas and diesel for firming — least-cost, lowest-carbon, always on
      </h2>

      {/* Step flow with connecting line */}
      <div className="relative mt-9 flex-1 min-h-0">
        <div
          aria-hidden
          className="absolute left-[8%] right-[8%] top-[26px] h-[2px]"
          style={{ background: "linear-gradient(90deg, #d97706, #7B35C2, #E68A00, #6B6B6B)", opacity: 0.35 }}
        />
        <div className="grid h-full grid-cols-4 gap-5">
          {steps.map((s, idx) => (
            <div key={s.n} className="sx-up min-h-0" style={d(160 + idx * 65)}>
              <div className="flex h-full flex-col">
                <div
                  className="relative z-10 mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${tone(s.color)})` }}
                >
                  {s.icon}
                </div>
                <div className="relative flex-1 overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${s.color}, ${tone(s.color)})` }} />
                  <div className="font-display text-[30px] font-bold leading-none mb-2" style={gt(s.color, tone(s.color))}>{s.n}</div>
                  <h3 className="font-display text-[18px] font-bold mb-1.5" style={{ color: NAVY }}>{s.title}</h3>
                  <p className="text-[16px] leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sx-up mt-5" style={d(460)}>
        <div
          className="rounded-2xl px-5 py-3.5 text-center text-[17px] font-medium"
          style={{ background: GREEN + "0D", boxShadow: `inset 0 0 0 1px ${GREEN}26`, color: "#14532d" }}
        >
          One TAQA energy-management system optimises the mix every minute — least cost, lowest carbon, always on.
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Slide 7: Solutions Overview ──────────────────────────────────────────────

function SolutionsOverviewSlide() {
  const solutions = [
    { num: "01", label: "Solar",           desc: "Tailored solar PV via PPA to power pivots and pumps by day — no farm capex.",      icon: <SunMedium className="w-5 h-5" />, color: "#d97706" },
    { num: "02", label: "Mobile CNG",      desc: "Portable natural gas to fuel farm gensets — ~40% cheaper than diesel.",            icon: <Truck className="w-5 h-5" />,     color: "#E68A00" },
    { num: "03", label: "Water Solutions", desc: "Desalination, groundwater treatment and smart, solar-powered irrigation pumping.", icon: <Droplets className="w-5 h-5" />,  color: SKY },
    { num: "04", label: "Battery Storage", desc: "Shifts solar into the night and firms the stack so pivots never stop.",            icon: <Battery className="w-5 h-5" />,   color: "#7B35C2" },
  ];
  const journey = ["Scope & How It Works", "Value Proposition", "Proven Track Record"];
  return (
    <LightSlide color={GREEN}>
      <div className="sx-up" style={d(0)}><Kicker color={GREEN}>Agriculture Clients · Solutions Overview</Kicker></div>
      <h2 className="sx-up mt-4 max-w-[1120px] font-display text-[38px] font-bold leading-[1.08] tracking-tight" style={{ ...d(60), color: NAVY }}>
        The following slides detail every solution TAQA Arabia offers to farms and agribusiness
      </h2>
      <div className="sx-up mt-4 flex items-center gap-2 flex-wrap" style={d(120)}>
        <span className="text-[15px] font-medium text-slate-500 mr-1">Each solution:</span>
        {journey.map((j, idx) => (
          <span key={j} className="flex items-center gap-2">
            <span className="rounded-full bg-white px-3.5 h-7 inline-flex items-center text-[15px] font-semibold ring-1 ring-black/5 shadow-sm" style={{ color: NAVY }}>
              {j}
            </span>
            {idx < journey.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
          </span>
        ))}
      </div>

      <div className="mt-6 flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-5">
        {solutions.map((s, idx) => (
          <div key={s.num} className="sx-up min-h-0" style={d(180 + idx * 60)}>
            <div className="relative h-full overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-[0_10px_30px_-16px_rgba(0,32,96,0.25)]">
              <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${s.color}, ${tone(s.color)})` }} />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-7 right-3 select-none font-display font-bold leading-none"
                style={{ fontSize: 110, color: s.color, opacity: 0.08, letterSpacing: "-0.04em" }}
              >
                {s.num}
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${tone(s.color)})` }}
                >
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[19px] font-bold" style={{ color: NAVY }}>{s.label}</h3>
                  <p className="mt-1.5 text-[17px] leading-relaxed text-slate-600 max-w-[420px]">{s.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </LightSlide>
  );
}

// ─── Slide 24: Why One Partner ────────────────────────────────────────────────

function WhyOnePartnerSlide() {
  const benefits = [
    { label: "One SLA",                     desc: "A single agreement covers water, solar, storage, gas and diesel — one uptime guarantee for the whole farm." },
    { label: "One Communication Point",     desc: "A single account team and 24/7 hotline — no chasing separate water and power contractors." },
    { label: "One Commercial Relationship", desc: "Consolidated billing and aligned BOO/BOOT terms instead of separate procurement cycles." },
    { label: "One Smart System",            desc: "Water and the full power stack run on one TAQA energy-management platform — optimised together." },
    { label: "One Accountable Owner",       desc: "End-to-end responsibility removes interface risk — TAQA owns the farm's water-and-energy uptime." },
  ];
  const solutions = ["Water Solutions", "Solar", "Storage", "Mobile CNG", "Diesel", "Smart EMS"];
  return (
    <LightSlide color={NAVY}>
      <div className="flex items-end justify-between gap-8">
        <div>
          <div className="sx-up" style={d(0)}><Kicker color={NAVY}>Why One Partner</Kicker></div>
          <h2 className="sx-up mt-4 font-display text-[40px] font-bold leading-none tracking-tight" style={{ ...d(60), color: NAVY }}>
            The TAQA One-Stop-Shop
          </h2>
        </div>
        <p className="sx-up max-w-[430px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
          One SLA, one communication point, one accountable operator — for the farm's water and power.
        </p>
      </div>

      <div className="mt-6 flex-1 min-h-0 grid grid-cols-2 gap-6">
        {/* Solutions hub */}
        <div className="sx-up min-h-0" style={d(180)}>
          <div
            className="relative h-full overflow-hidden rounded-2xl p-6 text-white flex flex-col shadow-xl"
            style={{ background: `linear-gradient(140deg, ${NAVY} 0%, #0c2f1a 100%)` }}
          >
            <BlueprintGrid />
            <Bracket color={GOLD} pos="br" />
            <div
              aria-hidden
              className="absolute -right-16 -top-20 h-56 w-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(132,204,22,0.22), transparent 65%)" }}
            />
            <h3 className="relative font-display text-[18px] font-bold mb-4" style={gt(GOLD, "#ffe08a")}>
              TAQA Arabia — All Farm Solutions
            </h3>
            <div className="relative grid grid-cols-2 gap-2.5">
              {solutions.map((s, i) => (
                <div
                  key={s}
                  className="sx-up flex items-center gap-2.5 rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-md px-3.5 py-2.5"
                  style={d(240 + i * 55)}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: `linear-gradient(135deg, ${GOLD}, ${LIME})` }} />
                  <span className="text-[16px] font-semibold text-white/95">{s}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-auto flex items-center gap-2.5 border-t border-white/15 pt-4">
              <span className="text-[16px] text-white/70">From Fragmented Vendors</span>
              <ArrowRight className="w-4 h-4 shrink-0" style={{ color: LIME }} />
              <span className="text-[16px] font-semibold text-white/95">One Integrated Operator</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="flex flex-col justify-between gap-2.5 min-h-0">
          {benefits.map((b, idx) => (
            <div key={b.label} className="sx-up flex-1" style={d(220 + idx * 60)}>
              <div className="relative flex h-full items-center gap-3 rounded-xl bg-white p-3.5 pl-4 ring-1 ring-black/5 shadow-sm">
                <span aria-hidden className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full" style={{ background: `linear-gradient(180deg, ${GREEN}, ${LIME})` }} />
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ background: `linear-gradient(135deg, ${GREEN}, ${LIME})` }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-[17px] font-bold leading-tight" style={{ color: NAVY }}>{b.label}</div>
                  <div className="text-[16px] leading-snug text-slate-600">{b.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Slide 25: Integrated Economics ───────────────────────────────────────────

function IntegratedEconomicsSlide() {
  const today = [
    { label: "High, volatile fuel bill", desc: "Diesel is the biggest farm cost — exposed to every price spike." },
    { label: "Pivots stop on failure",   desc: "Stand-alone gensets fail with no backup — lost irrigation cycles." },
    { label: "High carbon footprint",    desc: "100% diesel means maximum CO₂ and emissions per feddan." },
    { label: "Multiple vendors",         desc: "Separate water, fuel and genset suppliers — no accountability." },
  ];
  const withTaqa = [
    { label: "Up to ~40% lower energy cost", desc: "Solar + storage + CNG displace most diesel hours — predictable PPA tariffs." },
    { label: "24/7 irrigation uptime",       desc: "Batteries and multi-source firming keep pivots turning through any gap." },
    { label: "Sharply lower CO₂",            desc: "Each 1 MWp of solar avoids ~1,000 t CO₂/yr; CNG cuts a further ~24% vs diesel." },
    { label: "One accountable partner",      desc: "Single SLA for water + power, zero capex under BOO/BOOT, one smart system." },
  ];
  return (
    <LightSlide color={NAVY}>
      <div className="flex items-end justify-between gap-8">
        <div>
          <div className="sx-up" style={d(0)}><Kicker color={NAVY}>Integrated Economics</Kicker></div>
          <h2 className="sx-up mt-4 whitespace-nowrap font-display text-[32px] font-bold leading-tight tracking-tight" style={{ ...d(60), color: NAVY }}>
            The Integrated Economics: Diesel-Only vs. TAQA
          </h2>
        </div>
        <p className="sx-up max-w-[400px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
          What changes when one partner runs an optimised water-and-power stack — illustrative
        </p>
      </div>

      <div className="relative mt-5 flex-1 min-h-0 grid grid-cols-2 gap-6">
        {/* VS badge */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white font-display text-[17px] font-bold shadow-xl ring-1 ring-black/10"
          style={{ color: NAVY }}
        >
          VS
        </div>

        {/* Today */}
        <div className="sx-up min-h-0" style={d(180)}>
          <div className="relative h-full overflow-hidden rounded-2xl p-5 ring-1 ring-red-200 bg-red-50/70 flex flex-col">
            <Bracket color="#dc2626" pos="tl" />
            <div className="mb-3.5 flex items-center gap-2.5 pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm" style={{ background: "linear-gradient(135deg, #dc2626, #f87171)" }}>
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="font-display text-[17px] font-bold text-red-800">Today — Diesel-Only Farm</h3>
            </div>
            <div className="flex-1 flex flex-col justify-between gap-2">
              {today.map(t => (
                <div key={t.label} className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-red-100">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
                  <div className="min-w-0">
                    <div className="text-[16px] font-bold leading-tight text-red-800">{t.label}</div>
                    <div className="text-[15px] leading-snug text-slate-600">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* With TAQA */}
        <div className="sx-up min-h-0" style={d(240)}>
          <div className="relative h-full overflow-hidden rounded-2xl p-5 flex flex-col" style={{ background: GREEN + "0A", boxShadow: `inset 0 0 0 1px ${GREEN}30` }}>
            <Bracket color={GREEN} pos="tr" />
            <div className="mb-3.5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${GREEN}, ${LIME})` }}>
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-display text-[17px] font-bold" style={{ color: "#14532d" }}>With TAQA — Integrated Stack</h3>
            </div>
            <div className="flex-1 flex flex-col justify-between gap-2">
              {withTaqa.map(t => (
                <div key={t.label} className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5" style={{ boxShadow: `inset 0 0 0 1px ${GREEN}1f` }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GREEN }} />
                  <div className="min-w-0">
                    <div className="text-[16px] font-bold leading-tight" style={{ color: NAVY }}>{t.label}</div>
                    <div className="text-[15px] leading-snug text-slate-600">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="sx-up mt-3 text-center text-[14px] leading-snug text-slate-600" style={d(340)}>
        <span className="font-bold" style={{ color: "#14532d" }}>The result:</span> lower and more predictable
        energy cost, secured water, round-the-clock irrigation and a stronger ESG story — from one partner, with no capex.
      </p>
      <p className="sx-up mt-1 text-center text-[12px] text-slate-400" style={d(380)}>
        Figures are illustrative / market-based and depend on farm size, crop, irrigation schedule and fuel prices.
      </p>
    </LightSlide>
  );
}

// ─── Slide 27: Proven on the Ground (Closing) ─────────────────────────────────

function ClosingSlide() {
  const pillars = [
    { label: "Water Solutions", color: SKY },
    { label: "Solar",           color: "#d97706" },
    { label: "Battery Storage", color: "#7B35C2" },
    { label: "Mobile CNG",      color: "#E68A00" },
  ];
  const stats = [
    { value: "Dina Farms", label: "Live agricultural solar project" },
    { value: "Benban",     label: "Landmark solar project" },
    { value: "~1,000 t",   label: "CO₂/MWp/yr avoided" },
    { value: "Zero Capex", label: "Under BOO/BOOT" },
  ];
  return (
    <DarkSlide photo={P.dina} tint={GREEN}>
      <div className="sx-up" style={d(0)}><Kicker color={GREEN} dark>Proven on the Ground</Kicker></div>
      <h2 className="sx-up mt-5 font-display text-[52px] font-bold leading-[1.02] tracking-tight text-white" style={d(70)}>
        Dina Farms <span style={gt("#4ade80", "#bef264")}>&amp; Beyond</span>
      </h2>
      <p className="sx-up mt-3 text-[17px] text-white/80" style={d(130)}>
        Real agricultural renewable projects — the foundation for the fully integrated farm.
      </p>

      <div className="sx-up mt-6" style={d(190)}>
        <div className="relative max-w-[1020px] overflow-hidden rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/15 backdrop-blur-md">
          <Bracket color={LIME} pos="tl" />
          <p className="pl-3 text-[17px] leading-relaxed text-white/90">
            TAQA Arabia operates renewable-energy projects at Dina Farms — one of Egypt's largest integrated
            agricultural operations — alongside its landmark Benban solar developments. These projects prove
            TAQA can deploy and run clean energy at true agricultural scale. The next step is the fully
            integrated stack: pairing that solar with storage, gas and water under one operator.
          </p>
        </div>
      </div>

      <div className="sx-up mt-6 flex items-center gap-3" style={d(260)}>
        {pillars.map(s => (
          <div key={s.label} className="flex items-center gap-2.5 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md px-4 h-10">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${s.color}, ${tone(s.color)})` }} />
            <span className="text-[16px] font-semibold text-white/95">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={s.label} className="sx-up" style={d(320 + idx * 65)}>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-5">
              <div className="font-display text-[24px] font-bold leading-tight" style={gt("#a3e635", "#fde047")}>{s.value}</div>
              <div className="mt-1.5 text-[15px] leading-snug text-white/80">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </DarkSlide>
  );
}

// ─── Narration (24 slides, 0-indexed, same order as SLIDES) ──────────────────

const NARRATION: readonly string[] = [
  // 0 Cover
  "TAQA Arabia presents an integrated energy and water roadmap built specifically for Egypt's agriculture sector. Across the next slides you'll see four connected solutions — water solutions, solar power, battery storage and mobile CNG — each delivered under one accountable partner rather than a patchwork of separate vendors. Together they form a single integrated energy and utility offering designed to keep farms watered, powered and profitable, with TAQA financing, building, owning and operating the infrastructure end to end.",
  // 1 About TAQA Arabia
  "Founded in 2006 and listed on the Egyptian Exchange since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility developer, spanning four divisions. Gas covers distribution, EPC and virtual pipeline; Power covers generation and distribution beyond 1,600 megavolt-amps plus solar PV and EV charging; Petroleum runs oil-marketing stations and lubricants; and Water covers reverse-osmosis desalination, filtration and smart solar operations. TAQA finances, builds, owns and operates this utility backbone for residential communities, industrial zones and touristic destinations across the country.",
  // 2 Regional Presence
  "TAQA Arabia's footprint spans ten countries across Egypt, the GCC, wider Africa and South Asia — a real, live operating presence today, not an aspiration, with each market's mix tailored to local needs. Within Egypt alone the group operates across more than 20 governorates, covering industrial, residential and touristic developments, run by four operating divisions and a workforce of over 3,400 employees. That combination of regional reach and deep local depth is exactly what lets TAQA extend the same energy and water model into agriculture.",
  // 3 In Numbers
  "In fiscal year 2025, TAQA Arabia's gas and power businesses generated 13.4 billion Egyptian pounds in revenue, running over 10,000 kilometers of gas network under 8 governorate concessions, more than 1,600 megavolt-amps of distribution, over 150 megawatts of generation, and more than 18 billion pounds in assets under management. On the water and mobility side, the group serves around 7 million customers across Egypt, desalinates over 47,000 cubic meters a day across 15 locations, runs 300 stations nationwide, and holds Egypt's first private EV-charging licence.",
  // 4 Trusted By
  "TAQA Arabia's client roster spans industrial leaders, major real-estate developers, resort and hospitality operators, and heavy-industry producers alike — names like Emaar, SODIC, Palm Hills, Orascom Development, Ezz Steel and Lafarge Holcim, alongside Soma Bay, Rixos Hotels, Steigenberger and Travco Group. These are organizations that already depend on TAQA to run their critical water and energy infrastructure every day, across sectors as different as cement, ceramics, pharmaceuticals and tourism — the same reliability and scale TAQA now brings to agriculture.",
  // 5 The Challenge
  "Remote desert farms across Egypt's reclaimed land — millions of feddans of it, almost entirely off-grid — face expensive diesel dependence, no access to gas pipelines or the grid, water insecurity from over-abstracted groundwater, and fragile power where one genset failure can cost an irrigation cycle. TAQA's answer is one operator delivering clean water plus a smart multi-source power stack — solar by day, batteries after sunset, gas for firming, diesel only as backup — under one BOO or BOOT agreement, with no farm capex.",
  // 6 Integrated Farm Solution
  "One partner connects the farm's water supply to a smart, multi-source power stack that keeps every pivot turning around the clock. Solar delivers the cheapest power during the day, batteries carry that stored solar after sunset, mobile CNG gensets provide clean firming, and diesel gensets stand by strictly for backup and peaks. TAQA's smart energy-management system blends all four sources automatically for the lowest cost, while a parallel water strip covers desalination, wells and pumping — delivering, in TAQA's words, the whole farm energy-and-water backbone as one system.",
  // 7 Smart Energy Mix
  "The dispatch order is deliberate. Solar runs first, the cheapest and cleanest power available, driving the pivots all day. Stored solar in the batteries then carries irrigation into the evening and early morning. When more is needed, gas gensets fill the remaining gaps at roughly 40 percent less cost than diesel. Diesel comes last, reserved only for peaks and true backup rather than everyday reliance. One TAQA energy-management system optimizes this exact mix every minute, holding down cost and carbon while keeping the farm powered continuously.",
  // 8 Solutions Overview
  "Four solutions make up TAQA's integrated agriculture stack: solar delivered through a PPA to power pivots and pumps by day with no farm capex; mobile CNG, portable natural gas that fuels farm gensets at roughly 40 percent less than diesel; water solutions covering desalination, groundwater treatment and smart solar-powered irrigation pumping; and battery storage that shifts solar into the night and firms the stack so pivots never stop. Each of these four is explored in turn across its scope, its value proposition and its proven track record.",
  // 9 Solar: Scope
  "Now, let's talk about our Solar solution. TAQA funds, builds, owns and operates the solar system, so the farm pays only for the solar power it uses, with little to no upfront capital cost — covering ground-mount and pump-side PV arrays, inverters and mounting, pump controllers and soft starters, plus monitoring and connection works. TAQA first assesses the land, sun hours and the farm's pumping load, then installs arrays near the pumps so panels generate clean power through daylight irrigation hours, driving pumps and cold rooms directly while TAQA monitors yield and maintains the system.",
  // 10 Solar: Value Proposition
  "Solar delivers lower energy bills than diesel-only pivot power through long-term PPAs, greater energy security against fuel-price spikes, and a real sustainability gain — each megawatt-peak avoids roughly 1,000 tons of CO2 a year, strengthening ESG and export credentials — while turning idle farmland into a productive asset. TAQA backs this with flexible CAPEX, BOOT, BOO or zero-capex PPA financing, remote monitoring and guarantees for 25-plus years, and its track record as Egypt's solar pioneer operating multiple solar farms and desalination projects nationwide.",
  // 11 Solar: Case Study — Dina Farms
  "Farms typically run diesel gensets at around 10 Egyptian pounds per kilowatt-hour, rising every year. At Dina Farms, one of Egypt's largest agricultural operations, TAQA's 7-megawatt-peak solar plant instead delivers power at just 0.054 US dollars per kilowatt-hour — saving roughly 6 pounds per kilowatt-hour and about 89 million pounds in the first year alone. Over the full 25-year contract, under BOO or BOOT terms with no farm capex, savings compound to 9.3 billion Egyptian pounds, alongside roughly 1,000 tons of CO2 avoided per megawatt-peak every year.",
  // 12 Mobile CNG: Scope
  "Now, let's talk about our Mobile CNG solution. TAQA funds, builds, owns and operates the gas supply chain, so the farm pays only for the gas it uses, with little to no upfront capital cost — covering a mother station and compression, CNG virtual-pipeline trailers, on-site decompression and a PRMS skid, plus metering and safety controls. Gas is compressed at the mother station to around 250 bar, trailered to the farm as a virtual pipeline, then decompressed on-site to process pressure before it fuels dryers, greenhouses and processing, with TAQA tracking usage and refilling ahead of demand.",
  // 13 Mobile CNG: Value Proposition
  "Mobile CNG brings reliable natural gas to remote farms with no pipeline access, delivered by mobile virtual pipeline. It costs less than diesel, cutting the farm's biggest running expense, while emitting roughly 24 percent less CO2 and helping offset diesel-quota reliance. TAQA's edge comes from Master Gas, running Egypt's leading CNG virtual pipeline with stations scattered nationwide, flexible CAPEX, BOOT, BOO or PPA financing, and a scale running from a starter tier of 550 litres of diesel-equivalent a day up to heavy loads of 5,500-plus litres nationwide.",
  // 14 Mobile CNG: Case Study
  "TAQA pioneered mobile CNG in Egypt — the first company in the country to supply natural gas through a mobile virtual pipeline. Today that network has grown to 86 stations spread across 20 governorates, extending gas access into four entirely off-grid regions, including the whole of El Kharga governorate, which TAQA supplies in full. On top of that footprint, TAQA already runs 10 existing mobile-CNG projects, proof that this virtual-pipeline model scales reliably from a single farm to an entire governorate with no fixed pipeline in the ground.",
  // 15 Water Solutions: Scope
  "Now, let's talk about our Water Solutions. TAQA funds, builds, owns and operates the water plant, so the farm pays only for the water it uses, with little to no upfront capital cost — covering brackish or seawater reverse-osmosis desalination units, pre-treatment and filtration, storage reservoirs and pumping, plus irrigation distribution and smart meters. TAQA first studies the farm's water source, salinity and demand, then treats brackish or seawater through reverse osmosis to irrigation quality before storing, pumping and distributing it to the fields — operating the plant continuously and guaranteeing both volume and quality.",
  // 16 Water Solutions: Value Proposition
  "Water solutions deliver guaranteed water security independent of grid-utility and groundwater constraints, lower energy and water cost through variable-speed drives, peak-demand control and solar-powered pumping, reduced pressure on the aquifer as desalination frees up groundwater, and a stronger sustainability and ESG story through solar-powered desalination and brine management. TAQA backs this with flexible delivery — BOO, BOOT or Capacity-as-a-Service with no upfront infrastructure cost — smart leak and failure monitoring, a design tailored to the farm's crop type and irrigation schedule, and contractual guarantees on volume and quality.",
  // 17 Water Solutions: Track Record
  "On Egypt's Red Sea coast, TAQA built the country's first green desalination facility at Soma Bay, powered entirely by renewable energy and using technology that consumes 50 percent less power than comparable plants. Across its water business, TAQA now delivers more than 47,000 cubic meters of contracted desalination a day from 15 operational locations, avoiding 8,560 tons of CO2 every year. That same solar-powered, smart-operated model — already proven at scale on the coast — is what now secures irrigation supply for large farms and agribusiness.",
  // 18 Battery Storage: Scope
  "Now, let's talk about our Battery Storage solution. TAQA funds, builds, owns and operates the battery system, so the farm pays only for the service it receives, with little to no upfront capital cost — covering battery energy-storage units, a power-conversion system and inverters, switchgear and the grid or solar interface, plus energy-management and SCADA controls. TAQA sizes the storage to the farm's load and solar profile, then installs it so the system charges from surplus daytime solar and discharges to run pumps and cold storage after dark — the energy-management system optimizing every charge and discharge cycle.",
  // 19 Battery Storage: Value Proposition
  "Battery storage stores the day's solar surplus and dispatches it to keep pivots running into the evening and early morning, displacing costly diesel-genset hours and cutting fuel spend and engine wear. More stored solar dispatched means less diesel burned, so the farm's carbon footprint shrinks year over year, while the same asset stacks solar-shifting, peak support and backup value at once. TAQA backs this with flexible CAPEX, BOOT, BOO or PPA financing, 25-plus years of O&M guarantees, and a smart EMS optimizing every cycle for lowest cost.",
  // 20 Battery Storage: Case Study
  "Rather than relying on diesel at 10 Egyptian pounds per kilowatt-hour, TAQA pairs solar with battery storage to maximize savings. One client's 1.1-megawatt solar array paired with a 4-megawatt battery, giving four hours of storage, delivers power at just 4 pounds per kilowatt-hour, rising only 10 percent a year — saving 6 pounds per kilowatt-hour and roughly 14 million pounds in year one. Over the full 25-year term, under a no-capex BOO or BOOT structure, savings reach 1.3 billion pounds, while batteries shift day energy into the night.",
  // 21 Why One Partner
  "TAQA Arabia replaces a patchwork of fragmented vendors — covering water, solar, storage, mobile CNG, diesel and smart energy management — with one integrated operator. That means one SLA covering the whole farm, one communication point through a dedicated account team and 24/7 hotline instead of chasing separate contractors, one commercial relationship with consolidated billing and aligned BOO or BOOT terms, one smart system running water and power on a single TAQA platform, and one accountable owner who takes end-to-end responsibility, removing interface risk and owning the farm's uptime completely.",
  // 22 Integrated Economics
  "Today, a diesel-only farm carries a high, volatile fuel bill, stops pivots when gensets fail, runs high carbon emissions on 100 percent diesel, and juggles multiple vendors with no accountability. TAQA's integrated stack cuts costs up to roughly 40 percent as solar, storage and CNG displace diesel hours under predictable PPA tariffs, keeps irrigation running 24/7, and sharply lowers carbon — solar avoids about 1,000 tons of CO2 per megawatt-peak yearly, CNG cuts a further 24 percent versus diesel — while the farm gains one accountable partner at zero capex.",
  // 23 Proven on the Ground (Closing)
  "TAQA Arabia already operates renewable-energy projects at Dina Farms — one of Egypt's largest integrated agricultural operations — alongside its landmark Benban solar developments, proving it can deploy clean energy at agricultural scale. The next step is the fully integrated stack: pairing that same solar with battery storage, mobile CNG and water solutions under one operator, at zero capex through a BOO or BOOT structure, avoiding roughly 1,000 tons of CO2 per megawatt-peak every year. The four solutions are ready today — the question is when your farm gets started.",
];

// ─── SLIDES Array (24 slides, 0-indexed) ──────────────────────────────────────

const waterIcon   = <Droplets className="w-5 h-5" />;
const solarIcon   = <SunMedium className="w-5 h-5" />;
const batteryIcon = <Battery className="w-5 h-5" />;
const cngIcon     = <Truck className="w-5 h-5" />;

const SLIDES = [
  // 0
  { title: "Cover",                           render: () => <CoverSlide /> },
  // 1
  { title: "About TAQA Arabia",               render: () => <AboutSlide /> },
  // 2
  { title: "Regional Presence",               render: () => <RegionalSlide /> },
  // 3
  { title: "In Numbers",                      render: () => <NumbersSlide /> },
  // 4
  { title: "Trusted By",                      render: () => <TrustedBySlide color={GREEN} logos={TRUSTED_BY_LOGOS} /> },
  // 5
  { title: "The Challenge",                   render: () => <ChallengeSlide /> },
  // 6
  { title: "Integrated Farm Solution",        render: () => <IntegratedSolutionSlide /> },
  // 7
  { title: "Smart Energy Mix",                render: () => <SmartEnergyMixSlide /> },
  // 8
  { title: "Solutions Overview",              render: () => <SolutionsOverviewSlide /> },

  // ── Solar ────────────────────────────────────────────────────────────────────
  // 9
  {
    title: "Solar: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={1} solutionLabel="Solar" color="#d97706" icon={solarIcon} photo={P.solar}
        subtitle="Tailored solar PV to power pivots and pumps by day. Integrated with storage and diesel for round-the-clock supply."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the solar power you use — little to no upfront CapEx."
        taqaInvests={[
          "Ground-mount & pump-side PV arrays",
          "Solar inverters & mounting",
          "Pump controllers & soft starters",
          "Monitoring & connection works",
        ]}
        steps={[
          "TAQA assesses land, sun hours and the farm's pumping load.",
          "PV arrays and inverters are installed near pumps and facilities.",
          "Panels generate clean power through daylight irrigation hours.",
          "Solar drives pumps, cold rooms and farm loads directly.",
          "TAQA monitors yield and maintains the system.",
        ]}
        whatYouReceive={[
          "Daytime power matched to irrigation needs",
          "Sharp cut in diesel and grid costs",
          "Monitored, maintained PV assets",
        ]}
      />
    ),
  },
  // 10
  {
    title: "Solar: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={1} solutionLabel="Solar" color="#d97706" icon={solarIcon} photo={P.solar}
        whatYouGain={[
          { label: "Lower Energy Bills",          desc: "Clean solar energy at lower cost than diesel-only pivot power, through long-term PPAs." },
          { label: "Energy Security",             desc: "On-site generation reduces exposure to fuel-price spikes and supply disruption." },
          { label: "Sustainability & Carbon Cut", desc: "Each 1 MWp avoids ~1,000 tons of CO₂ a year — strong ESG and export credentials." },
          { label: "Uses Idle Land",              desc: "Marginal and unused farmland becomes a productive, cost-saving energy asset." },
        ]}
        taqaEdge={[
          { label: "Flexible Financing Solutions", desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time, or buy cheaper solar under a zero-capex PPA." },
          { label: "Single Energy Partner",        desc: "One single utility provider for electricity and water — solar and batteries for maximum savings and utilisation." },
          { label: "Lifecycle O&M & Guarantee",   desc: "Remote monitoring, maintenance and performance guarantees keep output high for 25+ years." },
          { label: "Egypt's Solar Pioneer",        desc: "Operating multiple solar farms and water desalination projects across Egypt." },
        ]}
      />
    ),
  },
  // 11
  {
    title: "Solar: Case Study — Dina Farms",
    render: () => (
      <ChartTrackRecordSlide
        solutionNum={1} solutionLabel="Solar" color="#d97706" icon={solarIcon}
        heading="Solar: Case Study — Dina Farms"
        subheading="Powering one of Egypt's largest farms with a 7 MWp solar plant"
        body="Farms typically run diesel gensets at ~10 EGP/kWh, rising every year. TAQA's 7 MWp solar plant for Dina Farms delivers power at a 0.054 USD/kWh tariff — saving ~6 EGP/kWh and ~89 million EGP in the first year alone."
        xKey="year" yLabel="EGP/kWh (25 yrs)"
        series={[
          { key: "taqa", name: "TAQA Tariff", color: "#4ade80" },
          { key: "diesel", name: "Diesel Generator", color: "#f87171" },
        ]}
        data={[
          { year: "Y1", taqa: 4.37, diesel: 10.0 }, { year: "Y2", taqa: 4.81, diesel: 11.0 },
          { year: "Y3", taqa: 5.29, diesel: 12.1 }, { year: "Y4", taqa: 5.82, diesel: 13.31 },
          { year: "Y5", taqa: 6.4, diesel: 14.64 }, { year: "Y6", taqa: 7.04, diesel: 16.11 },
          { year: "Y7", taqa: 7.74, diesel: 17.72 }, { year: "Y8", taqa: 8.52, diesel: 19.49 },
          { year: "Y9", taqa: 9.37, diesel: 21.44 }, { year: "Y10", taqa: 10.3, diesel: 23.58 },
          { year: "Y11", taqa: 11.33, diesel: 25.94 }, { year: "Y12", taqa: 12.47, diesel: 28.53 },
          { year: "Y13", taqa: 13.71, diesel: 31.38 }, { year: "Y14", taqa: 15.09, diesel: 34.52 },
          { year: "Y15", taqa: 16.6, diesel: 37.97 }, { year: "Y16", taqa: 18.25, diesel: 41.77 },
          { year: "Y17", taqa: 20.08, diesel: 45.95 }, { year: "Y18", taqa: 22.09, diesel: 50.54 },
          { year: "Y19", taqa: 24.3, diesel: 55.6 }, { year: "Y20", taqa: 26.73, diesel: 61.16 },
          { year: "Y21", taqa: 29.4, diesel: 67.27 }, { year: "Y22", taqa: 32.34, diesel: 74.0 },
          { year: "Y23", taqa: 35.57, diesel: 81.4 }, { year: "Y24", taqa: 39.13, diesel: 89.54 },
          { year: "Y25", taqa: 43.04, diesel: 98.5 },
        ]}
        stats={[
          { value: "9.3B EGP", label: "Total savings over 25 years" },
          { value: "Dina Farms", label: "Live agricultural solar project" },
          { value: "BOO/BOOT", label: "PPA models, no farm capex" },
          { value: "~1,000 t", label: "CO₂ avoided / MWp / yr" },
        ]}
      />
    ),
  },

  // ── Mobile CNG ──────────────────────────────────────────────────────────────
  // 12
  {
    title: "Mobile CNG: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={2} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
        subtitle="Portable natural gas to fuel farm gas-gensets. A cleaner, cheaper alternative to diesel where there is no pipeline."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the gas you use — little to no upfront CapEx."
        taqaInvests={[
          "Mother station & compression",
          "CNG/virtual-pipeline trailers",
          "On-site decompression & PRMS skid",
          "Metering & safety controls",
        ]}
        steps={[
          "Gas is compressed at a TAQA mother station to ~250 bar.",
          "Trailers deliver it to the farm as a virtual pipeline.",
          "On-site skids decompress and regulate to process pressure.",
          "Gas fuels dryers, greenhouses and processing.",
          "TAQA tracks usage and refills ahead of demand.",
        ]}
        whatYouReceive={[
          "Pipeline-grade gas without a pipeline",
          "Lower-cost fuel for drying & processing",
          "Managed supply and refills",
        ]}
      />
    ),
  },
  // 13
  {
    title: "Mobile CNG: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={2} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
        whatYouGain={[
          { label: "Off-Grid Gas Supply",     desc: "Reliable natural gas to remote farms with no pipeline access, by mobile virtual pipeline." },
          { label: "Cost Savings vs. Diesel", desc: "Lower fuel cost than diesel — a major cut to the farm's biggest running expense." },
          { label: "Cleaner Operations",      desc: "~24% lower CO₂ than diesel helps the farm meet tightening emissions and export requirements." },
          { label: "Offset Diesel Quota",     desc: "Reduce reliance on diesel quotas by providing cleaner and more cost-effective fuel alternatives." },
        ]}
        taqaEdge={[
          { label: "Master Gas Scale and Network", desc: "TAQA's Master Gas runs Egypt's leading CNG virtual pipeline and has CNG stations scattered across Egypt." },
          { label: "Flexible Financing Solutions", desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time, or buy cheaper solar under a zero-capex PPA." },
          { label: "Scalable to Any Load",         desc: "Starter (550 litres/day of diesel) to Heavy (5,500+ litres/day of diesel) — scales with the farm's gas demand." },
          { label: "Nationwide Presence", desc: "Operates a nationwide portfolio of Mobile CNG projects, extending gas access and reliability across Egypt's governorates." },
        ]}
      />
    ),
  },
  // 14
  {
    title: "Mobile CNG: Case Study",
    render: () => (
      <ChartTrackRecordSlide
        solutionNum={2} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon}
        heading="Mobile CNG: Proven Track Record"
        subheading="First company in Egypt to supply natural gas through a mobile virtual pipeline"
        body="TAQA pioneered mobile CNG in Egypt — 86 stations extend a virtual pipeline into four off-grid governorates, including all of El Kharga."
        xKey="year" yLabel="TAQA CNG vs Diesel price (25 yrs)"
        valueFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}
        series={[
          { key: "cng", name: "TAQA CNG Price", color: "#4ade80" },
          { key: "diesel", name: "Diesel Price", color: "#f87171" },
        ]}
        data={[
          { year: "Y1", cng: 70.0, diesel: 100.0 }, { year: "Y2", cng: 77.0, diesel: 110.0 },
          { year: "Y3", cng: 84.7, diesel: 121.0 }, { year: "Y4", cng: 93.17, diesel: 133.1 },
          { year: "Y5", cng: 102.49, diesel: 146.41 }, { year: "Y6", cng: 112.74, diesel: 161.05 },
          { year: "Y7", cng: 124.01, diesel: 177.16 }, { year: "Y8", cng: 136.41, diesel: 194.87 },
          { year: "Y9", cng: 150.05, diesel: 214.36 }, { year: "Y10", cng: 165.06, diesel: 235.79 },
          { year: "Y11", cng: 181.56, diesel: 259.37 }, { year: "Y12", cng: 199.72, diesel: 285.31 },
          { year: "Y13", cng: 219.69, diesel: 313.84 }, { year: "Y14", cng: 241.66, diesel: 345.23 },
          { year: "Y15", cng: 265.82, diesel: 379.75 }, { year: "Y16", cng: 292.41, diesel: 417.72 },
          { year: "Y17", cng: 321.65, diesel: 459.5 }, { year: "Y18", cng: 353.81, diesel: 505.45 },
          { year: "Y19", cng: 389.19, diesel: 555.99 }, { year: "Y20", cng: 428.11, diesel: 611.59 },
          { year: "Y21", cng: 470.92, diesel: 672.75 }, { year: "Y22", cng: 518.02, diesel: 740.02 },
          { year: "Y23", cng: 569.82, diesel: 814.03 }, { year: "Y24", cng: 626.8, diesel: 895.43 },
          { year: "Y25", cng: 689.48, diesel: 984.97 },
        ]}
        stats={[
          { value: "86", label: "CNG stations across 20 governorates" },
          { value: "4", label: "Off-grid governorates served" },
          { value: "10", label: "Existing mobile-CNG projects" },
          { value: "El Kharga", label: "Whole governorate supplied" },
        ]}
      />
    ),
  },

  // ── Water Solutions ─────────────────────────────────────────────────────────
  // 15
  {
    title: "Water Solutions: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={3} solutionLabel="Water Solutions" color="#0095C8" icon={waterIcon} photo={P.water}
        subtitle="Reliable, cost-effective water for the farm. Desalination, groundwater treatment and smart irrigation pumping."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the water you use — little to no upfront CapEx."
        taqaInvests={[
          "Brackish/seawater RO desalination units",
          "Pre-treatment & filtration system",
          "Storage reservoirs & pumping",
          "Irrigation distribution & smart meters",
        ]}
        steps={[
          "TAQA studies the farm's water source, salinity and demand.",
          "Brackish or seawater is drawn in and pre-treated.",
          "Reverse-osmosis units desalinate water to irrigation quality.",
          "Treated water is stored, pumped and distributed to fields.",
          "TAQA operates the plant and guarantees volume and quality.",
        ]}
        whatYouReceive={[
          "Reliable irrigation-grade water on demand",
          "Independence from strained groundwater",
          "Guaranteed volume, quality and uptime",
        ]}
      />
    ),
  },
  // 16
  {
    title: "Water Solutions: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={3} solutionLabel="Water Solutions" color="#0095C8" icon={waterIcon} photo={P.water}
        whatYouGain={[
          { label: "Guaranteed Water Security",   desc: "Reliable freshwater for irrigation, independent of grid-utility and groundwater constraints." },
          { label: "Lower Energy & Water Cost",   desc: "VSDs, peak-demand control and solar-powered pumping cut energy use and non-revenue water losses." },
          { label: "Frees Up Groundwater",        desc: "Desalination and treatment reduce over-abstraction, protecting the aquifer for the long term." },
          { label: "Sustainability & ESG Impact", desc: "Solar-powered desalination, brine management and a reduced freshwater-extraction footprint." },
        ]}
        taqaEdge={[
          { label: "Flexible Delivery Approach", desc: "BOO/BOOT or EPC via Capacity-as-a-Service — no upfront infrastructure cost." },
          { label: "Smart Operations & Uptime",  desc: "Real-time monitoring, leak & failure detection and predictive-maintenance dashboards." },
          { label: "Tailored to the Farm",       desc: "Solutions sized to crop type, hectares and irrigation schedule — not one-size-fits-all." },
          { label: "Performance Guarantees",     desc: "Volume and quality backed by contractual SLAs." },
        ]}
      />
    ),
  },
  // 17
  {
    title: "Water Solutions: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={3} solutionLabel="Water Solutions" color="#0095C8" icon={waterIcon} photo={P.water}
        heading="Water Solutions: Proven Track Record"
        subheading="Eco Solar Desalination — Soma Bay"
        body="On the Red Sea, TAQA Water built Egypt's first green desalination facility powered entirely by renewable energy, using technology that consumes 50% less power than peers. The same solar-powered, smart-operated water model — proven at scale — secures irrigation supply for large farms and agribusiness."
        stats={[
          { value: "+47,000 m³/day", label: "Contracted desalination" },
          { value: "15",             label: "Operational water locations" },
          { value: "50% less power", label: "Than peer plants" },
          { value: "8,560 t CO₂",   label: "Avoided per year" },
        ]}
      />
    ),
  },

  // ── Battery Storage ─────────────────────────────────────────────────────────
  // 18
  {
    title: "Battery Storage: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={4} solutionLabel="Battery Storage (BESS)" color="#7B35C2" icon={batteryIcon} photo={P.battery}
        subtitle="Battery storage that shifts solar into the night. Firms the power stack — so irrigation never stops."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the service — little to no upfront CapEx."
        taqaInvests={[
          "Battery energy-storage units",
          "Power-conversion system & inverters",
          "Switchgear & grid/solar interface",
          "EMS & SCADA controls",
        ]}
        steps={[
          "TAQA sizes storage to the farm's load and solar profile.",
          "Battery units and conversion systems are installed.",
          "Storage charges from surplus daytime solar.",
          "It discharges to run pumps and cold storage after dark.",
          "An energy-management system optimizes every cycle.",
        ]}
        whatYouReceive={[
          "Round-the-clock power from daytime solar",
          "Backup through grid and supply gaps",
          "Stable energy for cold-chain and pumps",
        ]}
      />
    ),
  },
  // 19
  {
    title: "Battery Storage: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={4} solutionLabel="Battery Storage" color="#7B35C2" icon={batteryIcon} photo={P.battery}
        whatYouGain={[
          { label: "Solar After Sunset",     desc: "Stores daytime solar surplus and dispatches it to run pivots into the evening and early morning." },
          { label: "Less Diesel, Lower Cost", desc: "Battery dispatch displaces costly diesel-genset hours, cutting fuel spend and engine wear." },
          { label: "Greener Every Year",     desc: "More stored solar dispatched means less diesel and a steadily smaller carbon footprint." },
          { label: "A Stacked Asset",        desc: "One system delivers solar-shifting, peak support and backup — value across multiple uses." },
        ]}
        taqaEdge={[
          { label: "Flexible Financing Solutions", desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time, or buy cheaper solar under a zero-capex PPA." },
          { label: "Single Energy Partner",        desc: "One single utility provider for electricity and water — solar and batteries for maximum savings and utilisation." },
          { label: "Lifecycle O&M & Guarantee",   desc: "Remote monitoring, maintenance and performance guarantees keep output high for 25+ years." },
          { label: "Smart Energy Management",     desc: "TAQA Arabia's EMS optimises charge/discharge against loads, solar and fuel cost for the lowest cost per kWh." },
        ]}
      />
    ),
  },
  // 20
  {
    title: "Battery Storage: Case Study",
    render: () => (
      <ChartTrackRecordSlide
        solutionNum={4} solutionLabel="Battery Storage" color="#7B35C2" icon={batteryIcon}
        heading="Battery Storage (BESS): Case Study"
        subheading="Turning intermittent solar into round-the-clock farm power"
        body="TAQA pairs solar with battery storage so clients maximise savings instead of relying on diesel at 10 EGP/kWh. One client runs a 1.1 MW PV + 4 MW battery system (4-hour storage) at 4 EGP/kWh, +10% a year — saving 6 EGP/kWh and 14 million EGP in year one."
        xKey="year" yLabel="EGP/kWh (25 yrs)"
        series={[
          { key: "taqa", name: "TAQA Tariff", color: "#4ade80" },
          { key: "diesel", name: "Diesel Generator", color: "#f87171" },
        ]}
        data={[
          { year: "Y1", taqa: 4.0, diesel: 10.0 }, { year: "Y2", taqa: 4.4, diesel: 11.0 },
          { year: "Y3", taqa: 4.84, diesel: 12.1 }, { year: "Y4", taqa: 5.32, diesel: 13.31 },
          { year: "Y5", taqa: 5.86, diesel: 14.64 }, { year: "Y6", taqa: 6.44, diesel: 16.11 },
          { year: "Y7", taqa: 7.09, diesel: 17.72 }, { year: "Y8", taqa: 7.79, diesel: 19.49 },
          { year: "Y9", taqa: 8.57, diesel: 21.44 }, { year: "Y10", taqa: 9.43, diesel: 23.58 },
          { year: "Y11", taqa: 10.37, diesel: 25.94 }, { year: "Y12", taqa: 11.41, diesel: 28.53 },
          { year: "Y13", taqa: 12.55, diesel: 31.38 }, { year: "Y14", taqa: 13.81, diesel: 34.52 },
          { year: "Y15", taqa: 15.19, diesel: 37.97 }, { year: "Y16", taqa: 16.71, diesel: 41.77 },
          { year: "Y17", taqa: 18.38, diesel: 45.95 }, { year: "Y18", taqa: 20.22, diesel: 50.54 },
          { year: "Y19", taqa: 22.24, diesel: 55.6 }, { year: "Y20", taqa: 24.46, diesel: 61.16 },
          { year: "Y21", taqa: 26.91, diesel: 67.27 }, { year: "Y22", taqa: 29.6, diesel: 74.0 },
          { year: "Y23", taqa: 32.56, diesel: 81.4 }, { year: "Y24", taqa: 35.82, diesel: 89.54 },
          { year: "Y25", taqa: 39.4, diesel: 98.5 },
        ]}
        stats={[
          { value: "Solar shifting", label: "Day energy used at night" },
          { value: "Peak support", label: "Firms the power stack" },
          { value: "BOO/BOOT", label: "No farm capex" },
          { value: "1.3B EGP", label: "Savings over 25 years" },
        ]}
      />
    ),
  },

  // ── Closing ─────────────────────────────────────────────────────────────────
  // 21
  { title: "Why One Partner",         render: () => <WhyOnePartnerSlide /> },
  // 22
  { title: "Integrated Economics",    render: () => <IntegratedEconomicsSlide /> },
  // 23
  { title: "Proven on the Ground",    render: () => <ClosingSlide /> },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AgricultureClients() {
  return (
    <DeckShell
      title="Agriculture Clients"
      subtitle="TAQA Arabia · Integrated Agri-Energy & Water Solutions · Jan 2026"
      sections={SECTIONS}
      slides={SLIDES}
      pdf="agriculture-clients.pdf"
      narration={NARRATION}
    />
  );
}
