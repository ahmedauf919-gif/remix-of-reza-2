import { DeckShell } from "./DeckShell";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import type { CSSProperties } from "react";
import {
  Flame, Zap, Droplets, Truck, Battery, Globe, CheckCircle2, SunMedium,
  ArrowRight, MapPin,
} from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";
import {
  SlideStyles, Kicker, CornerWash, Bracket, BlueprintGrid, ColHead,
  ScopeSlide, ValuePropSlide, TimelineSlide, TrackRecordSlide, d, hideImg, lighter,
} from "./slides";

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
  { id: "intro",     label: "Introduction",    color: GREEN,     slides: [0, 1, 2, 3] },
  { id: "challenge", label: "The Challenge",   color: "#dc2626", slides: [4] },
  { id: "solution",  label: "Farm Solution",   color: GREEN,     slides: [5, 6] },
  { id: "overview",  label: "Overview",        color: GREEN,     slides: [7] },
  { id: "water",     label: "Water Solutions", color: "#0095C8", slides: [8, 9, 10, 11] },
  { id: "solar",     label: "Solar",           color: "#d97706", slides: [12, 13, 14, 15] },
  { id: "battery",   label: "Battery Storage", color: "#7B35C2", slides: [16, 17, 18, 19] },
  { id: "cng",       label: "Mobile CNG",      color: "#E68A00", slides: [20, 21, 22, 23] },
  { id: "closing",   label: "Closing",         color: NAVY,      slides: [24, 25, 26] },
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
    { label: "Power",     icon: <Zap className="w-5 h-5" />,      desc: "Generation & distribution, solar PV, EV",                   color: "#d97706" },
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
    { value: "8",      label: "Countries",             sub: "Egypt, GCC, Africa & Greece" },
    { value: "4",      label: "Operating divisions",   sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates in Egypt", sub: "Full customer spectrum" },
    { value: "3,400+", label: "Employees",             sub: "Across all divisions" },
  ];
  const regions = [
    { name: "GCC",    desc: "Partnered with Al Ghaneim & WETICO for Sovereign water-desalination projects." },
    { name: "Africa", desc: "Pursuing gas and power opportunities across sub-Saharan markets." },
    { name: "Greece", desc: "Expanding into European energy infrastructure." },
  ];
  const customers = [
    "Agricultural farms & agribusiness",
    "Residential communities & compounds",
    "Industrial zones & factories",
    "Touristic destinations & resorts",
  ];
  return (
    <LightSlide color={GREEN}>
      <div className="sx-up" style={d(0)}><Kicker color={GREEN}>TAQA Arabia · Regional Presence</Kicker></div>
      <h2 className="sx-up mt-4 max-w-[1020px] font-display text-[38px] font-bold leading-[1.08] tracking-tight" style={{ ...d(60), color: NAVY }}>
        A growing platform across Egypt, the GCC, Africa and Greece
      </h2>

      {/* Metric strip */}
      <div className="mt-7 grid grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={m.label} className="sx-up" style={d(120 + idx * 60)}>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
              <div className="h-[3px] w-9 rounded-full mb-3" style={{ background: `linear-gradient(90deg, ${GREEN}, ${LIME})` }} />
              <div className="font-display text-[38px] font-bold leading-none" style={gt(GREEN, "#4d9d2a")}>{m.value}</div>
              <div className="mt-1.5 text-[16px] font-semibold" style={{ color: NAVY }}>{m.label}</div>
              <div className="text-[14px] text-slate-500">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex-1 min-h-0 grid grid-cols-2 gap-5">
        {/* International expansion */}
        <div className="sx-up min-h-0" style={d(380)}>
          <div className="relative h-full rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm flex flex-col overflow-hidden">
            <Bracket color={GREEN} pos="tr" />
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, ${LIME})` }}>
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="font-display text-[17px] font-bold" style={{ color: NAVY }}>International Expansion</h3>
            </div>
            <div className="flex-1 flex flex-col justify-between gap-2.5">
              {regions.map(r => (
                <div key={r.name} className="flex items-start gap-3 rounded-xl p-3" style={{ background: GREEN + "0A" }}>
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GREEN }} />
                  <p className="text-[16px] leading-snug text-slate-600">
                    <span className="font-bold" style={{ color: NAVY }}>{r.name}</span> — {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic footprint */}
        <div className="sx-up min-h-0" style={d(440)}>
          <div
            className="relative h-full overflow-hidden rounded-2xl p-6 text-white flex flex-col shadow-lg"
            style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0c2f1a 100%)` }}
          >
            <BlueprintGrid />
            <Bracket color={GOLD} pos="br" />
            <h3 className="relative font-display text-[17px] font-bold mb-2.5" style={gt(GOLD, "#ffe08a")}>Geographic Footprint</h3>
            <p className="relative text-[16px] text-white/85 leading-snug mb-3.5">
              Concessions in 8 Egyptian governorates renewed for 15 years. TAQA serves the full spectrum of customer types:
            </p>
            <div className="relative flex-1 flex flex-col justify-between">
              {customers.map(c => (
                <div key={c} className="flex items-center gap-2.5 text-[16px] text-white/90">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Slide 3: In Numbers ──────────────────────────────────────────────────────

function NumbersSlide() {
  const heroes = [
    { value: "EGP 13.4bn", label: "Revenue",       sub: "FY 2025" },
    { value: "EGP 1.5bn",  label: "EBITDA",        sub: "FY 2025" },
    { value: "~7M",        label: "Customers served", sub: "Approximate, all utilities" },
  ];
  const divisions = [
    { div: "GAS",          icon: <Flame className="w-4 h-4" />,    stats: ["+10,000 km", "8 governorates, 15yr"],    color: "#E68A00" },
    { div: "POWER",        icon: <Zap className="w-4 h-4" />,      stats: ["+1,600 MVA", "+150 MW"],                 color: "#d97706" },
    { div: "WATER",        icon: <Droplets className="w-4 h-4" />, stats: ["+47,000 m³/day", "15 locations"],        color: SKY },
    { div: "MOBILITY/CNG", icon: <Truck className="w-4 h-4" />,    stats: ["86 stations", "1st private EV licence"], color: "#7B35C2" },
  ];
  return (
    <LightSlide color={GREEN}>
      <div className="sx-up" style={d(0)}><Kicker color={GREEN}>TAQA Arabia · In Numbers</Kicker></div>
      <h2 className="sx-up mt-4 max-w-[1040px] font-display text-[38px] font-bold leading-[1.08] tracking-tight" style={{ ...d(60), color: NAVY }}>
        The scale behind a single integrated energy partner — FY 2025
      </h2>

      {/* Hero financials */}
      <div className="mt-7 grid grid-cols-3 gap-4">
        {heroes.map((m, idx) => (
          <div key={m.label} className="sx-up" style={d(120 + idx * 70)}>
            <div
              className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #04150c 0%, #0c2f1a 70%, #14532d 100%)" }}
            >
              <BlueprintGrid />
              <div
                aria-hidden
                className="absolute -right-10 -top-14 h-40 w-40 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(132,204,22,0.22), transparent 65%)" }}
              />
              <div className="relative font-display text-[36px] font-bold leading-none" style={gt("#a3e635", "#fde047")}>{m.value}</div>
              <div className="relative mt-2 text-[17px] font-semibold text-white/95">{m.label}</div>
              <div className="relative text-[14px] text-white/60">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Division bento */}
      <div className="mt-5 flex-1 min-h-0 grid grid-cols-4 gap-4">
        {divisions.map((dv, idx) => (
          <div key={dv.div} className="sx-up min-h-0" style={d(360 + idx * 60)}>
            <div className="relative h-full overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm flex flex-col">
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${dv.color}, ${tone(dv.color)})` }} />
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${dv.color}, ${tone(dv.color)})` }}
                >
                  {dv.icon}
                </div>
                <span className="font-display text-[16px] font-bold tracking-tight" style={{ color: NAVY }}>{dv.div}</span>
              </div>
              <div className="space-y-2.5">
                {dv.stats.map(s => (
                  <div key={s} className="flex items-start gap-2.5">
                    <span className="mt-[8px] h-2 w-2 rotate-45 shrink-0" style={{ background: dv.color }} />
                    <span className="text-[17px] font-semibold text-slate-700 leading-snug">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </LightSlide>
  );
}

// ─── Slide 4: The Challenge ───────────────────────────────────────────────────

function ChallengeSlide() {
  const pains = [
    {
      label: "Power",
      icon: <Zap className="w-5 h-5" />,
      color: "#dc2626",
      desc: "Pivots and pumps run on diesel gensets — the biggest operating cost, volatile price, CO₂ exposure.",
    },
    {
      label: "Water",
      icon: <Droplets className="w-5 h-5" />,
      color: SKY,
      desc: "Groundwater depletion and poor-quality feed water threaten long-term irrigation security.",
    },
    {
      label: "Fragmentation",
      icon: <Globe className="w-5 h-5" />,
      color: "#c084fc",
      desc: "Water, fuel and power come from separate suppliers with no unified view or accountability.",
    },
  ];
  return (
    <DarkSlide photo={P.farm} tint="#dc2626">
      <div className="sx-up" style={d(0)}><Kicker color="#dc2626" dark>Agriculture · The Challenge</Kicker></div>
      <h2 className="sx-up mt-5 max-w-[980px] font-display text-[44px] font-bold leading-[1.06] tracking-tight text-white" style={d(70)}>
        Energy and water — the two biggest costs on any farm
      </h2>

      <div className="mt-8 grid grid-cols-3 gap-5">
        {pains.map((c, idx) => (
          <div key={c.label} className="sx-up" style={d(150 + idx * 65)}>
            <div className="h-full rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-6">
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${c.color}, ${tone(c.color)})` }}
              >
                {c.icon}
              </div>
              <h3 className="font-display text-[19px] font-bold text-white mb-2">{c.label}</h3>
              <p className="text-[17px] leading-relaxed text-white/85">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sx-up mt-auto" style={d(380)}>
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
    { num: "01", label: "Water Solutions", desc: "Desalination, groundwater treatment and smart, solar-powered irrigation pumping.", icon: <Droplets className="w-5 h-5" />,  color: SKY },
    { num: "02", label: "Solar",           desc: "Tailored solar PV via PPA to power pivots and pumps by day — no farm capex.",      icon: <SunMedium className="w-5 h-5" />, color: "#d97706" },
    { num: "03", label: "Battery Storage", desc: "Shifts solar into the night and firms the stack so pivots never stop.",            icon: <Battery className="w-5 h-5" />,   color: "#7B35C2" },
    { num: "04", label: "Mobile CNG",      desc: "Portable natural gas to fuel farm gensets — ~40% cheaper than diesel.",            icon: <Truck className="w-5 h-5" />,     color: "#E68A00" },
  ];
  const journey = ["Scope & How It Works", "Value Proposition", "Implementation Timeline", "Proven Track Record"];
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

      <p className="sx-up mt-3.5 text-center text-[14px] text-slate-500" style={d(360)}>
        Figures are illustrative / market-based and depend on farm size, crop, irrigation schedule and fuel prices.
      </p>
    </LightSlide>
  );
}

// ─── Slide 26: Proven on the Ground (Closing) ─────────────────────────────────

function ClosingSlide() {
  const pillars = [
    { label: "Water Solutions", color: SKY },
    { label: "Solar",           color: "#d97706" },
    { label: "Battery Storage", color: "#7B35C2" },
    { label: "Mobile CNG",      color: "#E68A00" },
  ];
  const stats = [
    { value: "Dina Farms", label: "Live agricultural solar project" },
    { value: "Benban",     label: "Landmark solar development" },
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

// ─── SLIDES Array (27 slides, 0-indexed) ─────────────────────────────────────

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
  { title: "The Challenge",                   render: () => <ChallengeSlide /> },
  // 5
  { title: "Integrated Farm Solution",        render: () => <IntegratedSolutionSlide /> },
  // 6
  { title: "Smart Energy Mix",                render: () => <SmartEnergyMixSlide /> },
  // 7
  { title: "Solutions Overview",              render: () => <SolutionsOverviewSlide /> },

  // ── Water Solutions ─────────────────────────────────────────────────────────
  // 8
  {
    title: "Water Solutions: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={1} solutionLabel="Water Solutions" color="#0095C8" icon={waterIcon} photo={P.water}
        subtitle="Reliable, cost-effective water for the farm. Desalination, groundwater treatment and smart irrigation pumping."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the water you use — little to no upfront CapEx."
        taqaInvests={[
          "Brackish/seawater RO desalination units",
          "Pre-treatment & filtration",
          "Storage reservoirs & pumping",
          "Irrigation distribution & smart meters",
        ]}
        steps={[
          "TAQA studies crop water demand and source-water quality.",
          "RO plant and pumping designed and financed.",
          "Water is treated to irrigation standard.",
          "Smart meters distribute and bill.",
          "TAQA monitors quality and manages operations.",
        ]}
        whatYouReceive={[
          "Reliable irrigation water independent of public utilities",
          "Guaranteed volume and quality",
          "Full plant operation and maintenance",
          "Your own water source",
        ]}
      />
    ),
  },
  // 9
  {
    title: "Water Solutions: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={1} solutionLabel="Water Solutions" color="#0095C8" icon={waterIcon} photo={P.water}
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
  // 10
  {
    title: "Water Solutions: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={1} solutionLabel="Water Solutions" color="#0095C8" icon={waterIcon} photo={P.water}
        phases={[
          { days: "Day 0–20",    label: "Water Demand Study (crop water need & source-water survey)" },
          { days: "Day 20–60",   label: "Plant Design (RO sizing, pumping & solar integration)" },
          { days: "Day 45–75",   label: "Commercial Model (BOO/BOOT & water-purchase agreement)" },
          { days: "Day 75–210",  label: "Construction (plant, wells, networks & smart metering)" },
          { days: "Day 210–260", label: "Commissioning (testing, water-quality validation & handover)" },
          { days: "Day 260+",    label: "Smart O&M (IoT monitoring & predictive maintenance)" },
        ]}
        groups={[
          { label: "STUDY & DESIGN",  range: "Day 0–60" },
          { label: "FINANCE & BUILD", range: "Day 45–260" },
          { label: "SMART OPERATE",   range: "Day 260+" },
        ]}
      />
    ),
  },
  // 11
  {
    title: "Water Solutions: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={1} solutionLabel="Water Solutions" color="#0095C8" icon={waterIcon} photo={P.water}
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

  // ── Solar ────────────────────────────────────────────────────────────────────
  // 12
  {
    title: "Solar: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={2} solutionLabel="Solar" color="#d97706" icon={solarIcon} photo={P.solar}
        subtitle="Tailored solar PV to power pivots and pumps by day. Integrated with storage and diesel for round-the-clock supply."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the solar power you use — little to no upfront CapEx."
        taqaInvests={[
          "Ground-mount & pump-side PV arrays",
          "Solar inverters & mounting",
          "Pump controllers & soft starters",
          "Monitoring & connection works",
        ]}
        steps={[
          "TAQA assesses land, sun hours and pivot load.",
          "Arrays are sized and designed for the crop mix.",
          "Panels are installed and tied to pump controllers.",
          "Solar powers pivots and pumps at zero marginal cost.",
          "TAQA monitors output and dispatches per the energy plan.",
        ]}
        whatYouReceive={[
          "Lowest-cost day power for pivots",
          "Integrated with batteries and gensets",
          "Zero-capex PPA option",
          "25-year performance guarantee",
        ]}
      />
    ),
  },
  // 13
  {
    title: "Solar: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={2} solutionLabel="Solar" color="#d97706" icon={solarIcon} photo={P.solar}
        whatYouGain={[
          { label: "Lower Energy Bills",          desc: "Clean solar energy at lower cost than diesel-only pivot power, through long-term PPAs." },
          { label: "Energy Security",             desc: "On-site generation reduces exposure to fuel-price spikes and supply disruption." },
          { label: "Sustainability & Carbon Cut", desc: "Each 1 MWp avoids ~1,000 tons of CO₂ a year — strong ESG and export credentials." },
          { label: "Uses Idle Land",              desc: "Marginal and unused farmland becomes a productive, cost-saving energy asset." },
        ]}
        taqaEdge={[
          { label: "Flexible Financing Solutions", desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time, or buy cheaper solar under a zero-capex PPA." },
          { label: "Single Energy Partner",        desc: "One provider for electricity and water — solar and batteries for maximum savings." },
          { label: "Lifecycle O&M & Guarantee",   desc: "Remote monitoring, maintenance and performance guarantees for 25+ years." },
          { label: "Egypt's Solar Pioneer",        desc: "Operating multiple solar farms and water desalination projects across Egypt." },
        ]}
      />
    ),
  },
  // 14
  {
    title: "Solar: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={2} solutionLabel="Solar" color="#d97706" icon={solarIcon} photo={P.solar}
        phases={[
          { days: "Day 0–21",    label: "Site & Energy Study (irradiation, pivot load & land survey)" },
          { days: "Day 21–55",   label: "System Design (array sizing & genset/battery-tie design)" },
          { days: "Day 40–75",   label: "PPA Structuring (BOO/BOOT & tariff agreement)" },
          { days: "Day 75–130",  label: "Procurement (panels, inverters & mounting sourcing)" },
          { days: "Day 130–210", label: "Install & Commission (build, tie-in, testing & go-live)" },
          { days: "Day 210+",    label: "O&M (monitoring & performance maintenance)" },
        ]}
        groups={[
          { label: "STUDY & DESIGN",  range: "Day 0–55" },
          { label: "FINANCE & BUILD", range: "Day 40–210" },
          { label: "OPERATE",         range: "Day 210+" },
        ]}
      />
    ),
  },
  // 15
  {
    title: "Solar: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={2} solutionLabel="Solar" color="#d97706" icon={solarIcon} photo={P.dina}
        heading="Solar: Proven Track Record"
        subheading="Powering one of Egypt's largest farms with renewable energy"
        body="TAQA Arabia operates renewable-energy projects at Dina Farms — one of Egypt's largest integrated agricultural operations — alongside its landmark Benban solar developments. It is direct proof that TAQA can deploy and run solar at true agricultural scale, powering irrigation and farm operations with clean energy."
        stats={[
          { value: "Dina Farms", label: "Live agricultural solar project" },
          { value: "Benban",     label: "Landmark solar development" },
          { value: "BOO/BOOT",   label: "PPA models, no farm capex" },
          { value: "~1,000 t",   label: "CO₂ avoided/MWp/yr" },
        ]}
      />
    ),
  },

  // ── Battery Storage ─────────────────────────────────────────────────────────
  // 16
  {
    title: "Battery Storage: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={3} solutionLabel="Battery Storage (BESS)" color="#7B35C2" icon={batteryIcon} photo={P.battery}
        subtitle="Battery storage that shifts solar into the night. Firms the power stack — so irrigation never stops."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the service — little to no upfront CapEx."
        taqaInvests={[
          "Battery energy-storage units",
          "Power-conversion system & inverters",
          "Switchgear & grid/solar interface",
          "EMS & SCADA controls",
        ]}
        steps={[
          "TAQA sizes storage to the farm's pivot profile and solar surplus.",
          "Batteries charge during peak solar hours.",
          "Stored energy dispatches to pivots in the evening and early morning.",
          "EMS optimises charge/discharge against solar and genset costs.",
          "TAQA monitors and guarantees performance.",
        ]}
        whatYouReceive={[
          "Solar power after sunset",
          "Reduced diesel genset hours",
          "24/7 irrigation uptime",
          "EMS-optimised dispatch",
        ]}
      />
    ),
  },
  // 17
  {
    title: "Battery Storage: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={3} solutionLabel="Battery Storage" color="#7B35C2" icon={batteryIcon} photo={P.battery}
        whatYouGain={[
          { label: "Solar After Sunset",     desc: "Stores daytime solar surplus and dispatches it to run pivots into the evening and early morning." },
          { label: "Less Diesel, Lower Cost", desc: "Battery dispatch displaces costly diesel-genset hours, cutting fuel spend and engine wear." },
          { label: "Greener Every Year",     desc: "More stored solar dispatched means less diesel and a steadily smaller carbon footprint." },
          { label: "A Stacked Asset",        desc: "One system delivers solar-shifting, peak support and backup — value across multiple uses." },
        ]}
        taqaEdge={[
          { label: "Flexible Financing Solutions", desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time." },
          { label: "Single Energy Partner",        desc: "One provider for solar, storage and water — maximum savings and utilisation." },
          { label: "Lifecycle O&M & Guarantee",   desc: "Remote monitoring, maintenance and performance guarantees 25+ years." },
          { label: "Smart Energy Management",     desc: "EMS automatically optimises charge/discharge against loads, solar and fuel cost." },
        ]}
      />
    ),
  },
  // 18
  {
    title: "Battery Storage: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={3} solutionLabel="Battery Storage" color="#7B35C2" icon={batteryIcon} photo={P.battery}
        phases={[
          { days: "Day 0–21",    label: "Load & Solar Study (farm load profile and solar surplus assessment)" },
          { days: "Day 21–55",   label: "System Design (BESS sizing & hybrid configuration)" },
          { days: "Day 40–75",   label: "Commercial Model (BOO/BOOT & savings agreement)" },
          { days: "Day 75–140",  label: "Procurement (batteries, PCS & EMS sourcing)" },
          { days: "Day 140–220", label: "Install & Commission (build, integration, testing & go-live)" },
          { days: "Day 220+",    label: "Smart O&M (EMS monitoring & performance maintenance)" },
        ]}
        groups={[
          { label: "STUDY & DESIGN",  range: "Day 0–55" },
          { label: "FINANCE & BUILD", range: "Day 40–220" },
          { label: "SMART OPERATE",   range: "Day 220+" },
        ]}
      />
    ),
  },
  // 19
  {
    title: "Battery Storage: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={3} solutionLabel="Battery Storage" color="#7B35C2" icon={batteryIcon} photo={P.battery}
        heading="Battery Storage: Proven Track Record"
        subheading="Turning intermittent solar into round-the-clock farm power"
        body="As Egypt's largest private power player, TAQA Arabia pairs Battery Energy Storage with its solar and distribution assets. Storage lets farms shift solar into the evening, shave peaks and secure supply — the natural next step in TAQA's integrated energy model."
        stats={[
          { value: "Peak shaving",  label: "Cuts costly demand charges" },
          { value: "Solar firming", label: "Day-to-night energy shift" },
          { value: "BOO/BOOT",      label: "No client capex" },
          { value: "24/7 EMS",      label: "Monitoring & O&M" },
        ]}
      />
    ),
  },

  // ── Mobile CNG ──────────────────────────────────────────────────────────────
  // 20
  {
    title: "Mobile CNG: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={4} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
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
          "Metered gas fuels dryers, greenhouses and processing.",
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
  // 21
  {
    title: "Mobile CNG: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={4} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
        whatYouGain={[
          { label: "Off-Grid Gas Supply",     desc: "Reliable natural gas to remote farms with no pipeline access, by mobile virtual pipeline." },
          { label: "Cost Savings vs. Diesel", desc: "≈40% lower fuel cost than diesel — a major cut to the farm's biggest running expense." },
          { label: "Cleaner Operations",      desc: "~24% lower CO₂ than diesel helps the farm meet tightening emissions and export requirements." },
          { label: "99.5% Uptime SLA",        desc: "SCADA-monitored hot-swap replenishment guarantees uninterrupted gas for the gensets." },
        ]}
        taqaEdge={[
          { label: "Master Gas Scale & Network",   desc: "TAQA's Master Gas runs Egypt's leading CNG virtual pipeline with stations across Egypt." },
          { label: "Flexible Financing Solutions", desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time." },
          { label: "Scalable to Any Load",         desc: "Starter (500 Nm³/day) to Heavy (5,000+ Nm³/day) — scales with the farm's gas demand." },
          { label: "Lifecycle O&M & Guarantee",   desc: "Remote monitoring, maintenance and performance guarantees." },
        ]}
      />
    ),
  },
  // 22
  {
    title: "Mobile CNG: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={4} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
        phases={[
          { days: "Day 0",       label: "Discovery (initial farm assessment and gas demand evaluation)" },
          { days: "Day 1–3",     label: "Initial Contact (TAQA commercial team engagement and requirements scoping)" },
          { days: "Day 4–7",     label: "Site Audit (technical site visit and consumption profiling)" },
          { days: "Day 8–14",    label: "Contract (commercial terms and supply agreement finalisation)" },
          { days: "Day 15–30",   label: "Mobilization (equipment preparation and trailer scheduling)" },
          { days: "Day 90–120",  label: "On-Site Install (PRMS skid, metering and safety systems installed)" },
          { days: "Day 120–200", label: "Live Gas (first gas delivered; metered supply commences)" },
        ]}
        groups={[
          { label: "DISCOVERY & AUDIT",    range: "Day 0–14" },
          { label: "CONTRACTING",          range: "Day 8–14" },
          { label: "DEPLOYMENT & GO-LIVE", range: "Day 90–200" },
        ]}
      />
    ),
  },
  // 23
  {
    title: "Mobile CNG: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={4} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
        heading="Mobile CNG: Proven Track Record"
        subheading="Virtual Pipeline — 4 Governorates. First company in Egypt to supply natural gas through a mobile virtual pipeline."
        body="TAQA Arabia pioneered mobile CNG in Egypt, using its network of 86 CNG stations to extend a virtual pipeline into four governorates with no fixed gas infrastructure. The same model brings clean, lower-cost gas to off-grid farms and agribusiness — fueling gensets that would otherwise burn diesel."
        stats={[
          { value: "86",     label: "CNG stations feeding the virtual pipeline" },
          { value: "4",      label: "Governorates served off-grid" },
          { value: "+2,350", label: "mmscf CNG delivered/year" },
          { value: "+10",    label: "Active mobile-CNG clients" },
        ]}
      />
    ),
  },

  // ── Closing ─────────────────────────────────────────────────────────────────
  // 24
  { title: "Why One Partner",         render: () => <WhyOnePartnerSlide /> },
  // 25
  { title: "Integrated Economics",    render: () => <IntegratedEconomicsSlide /> },
  // 26
  { title: "Proven on the Ground",    render: () => <ClosingSlide /> },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AgricultureClients() {
  return (
    <DeckShell
      title="Agriculture Clients"
      subtitle="TAQA Arabia · Integrated Agri-Energy & Water Solutions · Jun 2026"
      sections={SECTIONS}
      slides={SLIDES}
      pdf="agriculture-clients.pdf"
    />
  );
}
