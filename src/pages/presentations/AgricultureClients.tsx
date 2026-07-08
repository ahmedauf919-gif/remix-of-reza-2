import { DeckShell } from "./DeckShell";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import {
  Flame, Zap, Droplets, Truck, Battery, Globe, CheckCircle2, SunMedium,
  ArrowRight, MapPin,
} from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";

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

/** Lighter tone per section color — used for gradient text endpoints. */
const TONE: Record<string, string> = {
  "#15803d": "#84cc16",
  "#0095C8": "#5bc9f2",
  "#d97706": "#fbbf24",
  "#7B35C2": "#c084fc",
  "#E68A00": "#ffb84d",
  "#002060": "#4f7dd9",
  "#dc2626": "#f87171",
};
const tone = (c: string) => TONE[c] ?? LIME;

/** Gradient-text style helper. */
const gt = (from: string, to: string): React.CSSProperties => ({
  backgroundImage: `linear-gradient(100deg, ${from}, ${to})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});

// ─── Motion / shared atoms ────────────────────────────────────────────────────

function AgxStyles() {
  return (
    <style>{`
      @keyframes agx-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes agx-in { from { opacity: 0; } to { opacity: 1; } }
      .agx-up { animation: agx-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
      .agx-in { animation: agx-in 0.3s ease-out both; }
      @media (prefers-reduced-motion: reduce) {
        .agx-up, .agx-in { animation: none; }
      }
    `}</style>
  );
}

/** Staggered fade-up wrapper. */
function Rise({ i = 0, className = "", children }: { i?: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={`agx-up ${className}`} style={{ animationDelay: `${i * 65}ms` }}>
      {children}
    </div>
  );
}

/** Kicker chip — colored dot + uppercase label. */
function Kicker({ color, dark = false, children }: { color: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full px-4 h-7 ${dark ? "bg-white/10 ring-1 ring-white/15 backdrop-blur-md" : ""}`}
      style={dark ? undefined : { background: color + "0F", boxShadow: `inset 0 0 0 1px ${color}30` }}
    >
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: dark ? tone(color) : color }} />
      <span
        className={`font-display text-[14px] font-semibold uppercase tracking-[0.22em] whitespace-nowrap ${dark ? "text-white/85" : ""}`}
        style={dark ? undefined : { color }}
      >
        {children}
      </span>
    </div>
  );
}

/** Oversized ghost numeral watermark. */
function Ghost({ text, color }: { text: string; color: string }) {
  return (
    <div
      aria-hidden
      className="absolute -bottom-14 right-2 font-display font-bold leading-none select-none pointer-events-none"
      style={{ fontSize: 230, color, opacity: 0.05, letterSpacing: "-0.04em" }}
    >
      {text}
    </div>
  );
}

/** Light content-slide chrome: soft wash + optional ghost numeral. */
function LightSlide({ color, num, children }: { color: string; num?: string; children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden font-deck bg-[#f9fbf9] p-14 flex flex-col">
      <AgxStyles />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(720px 440px at 100% 0%, ${color}0D, transparent 65%)` }}
      />
      {num && <Ghost text={num} color={color} />}
      <div className="relative z-10 flex h-full min-h-0 flex-col">{children}</div>
    </div>
  );
}

/** Dark "moment" slide chrome: forest gradient + duotone photo + accent glow. */
function DarkSlide({ photo, tint = GREEN, children }: { photo?: string; tint?: string; children: React.ReactNode }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck p-14 flex flex-col"
      style={{ background: "linear-gradient(135deg, #04150c 0%, #0c2f1a 62%, #0a2a18 100%)" }}
    >
      <AgxStyles />
      {photo && (
        <img
          src={photo}
          alt={ALT[photo] ?? "Agricultural landscape"}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          style={{ mixBlendMode: "luminosity" }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: `linear-gradient(115deg, rgba(4,21,12,0.94) 0%, rgba(7,30,17,0.78) 50%, ${tint}38 100%)` }}
      />
      <div
        aria-hidden
        className="absolute -right-44 -bottom-56 h-[600px] w-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${tone(tint)}22, transparent 65%)` }}
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col">{children}</div>
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
      <img src={src} alt={ALT[src] ?? "Agricultural landscape"} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
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
      className="relative h-full w-full overflow-hidden font-deck flex flex-col"
      style={{ background: "linear-gradient(135deg, #04150c 0%, #0c2f1a 60%, #0a2a18 100%)" }}
    >
      <AgxStyles />
      <img
        src={P.cover}
        alt={ALT[P.cover]}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(112deg, rgba(4,21,12,0.96) 0%, rgba(6,28,16,0.84) 46%, rgba(21,128,61,0.34) 100%)" }}
      />
      <div
        aria-hidden
        className="absolute -right-40 -top-52 h-[560px] w-[560px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(132,204,22,0.16), transparent 65%)" }}
      />

      <div className="relative z-10 flex h-full flex-col px-14 pt-12 pb-10">
        {/* Top row */}
        <Rise i={0} className="flex items-center justify-between">
          <div className="rounded-xl bg-white/95 px-4 py-2 shadow-lg ring-1 ring-black/10">
            <img src={taqaLogo} alt="TAQA Arabia logo" className="h-9 object-contain" />
          </div>
          <Kicker color={GREEN} dark>Client Presentation · Jan 2026</Kicker>
        </Rise>

        {/* Title block */}
        <div className="flex-1 flex flex-col justify-center">
          <Rise i={1}>
            <div className="mb-6 h-[3px] w-20 rounded-full" style={{ background: `linear-gradient(90deg, ${GREEN}, ${LIME})` }} />
          </Rise>
          <Rise i={2}>
            <h1 className="font-display font-bold tracking-tight text-white leading-[0.98]" style={{ fontSize: 74 }}>
              Agriculture
              <br />
              <span style={gt("#4ade80", "#bef264")}>Clients</span>
            </h1>
          </Rise>
          <Rise i={3}>
            <p className="mt-5 text-[21px] text-white/85">Integrated Energy &amp; Utility Solutions</p>
          </Rise>
          <Rise i={4} className="mt-8 flex items-center gap-3">
            {pillars.map(p => (
              <div key={p.label} className="flex items-center gap-2.5 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md pl-2.5 pr-4 h-10">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                  style={{ background: `linear-gradient(135deg, ${p.color}, ${tone(p.color)})` }}
                >
                  {p.icon}
                </span>
                <span className="text-[16px] font-semibold text-white/90">{p.label}</span>
              </div>
            ))}
          </Rise>
        </div>

        {/* Footer */}
        <Rise i={5} className="flex items-center justify-between border-t border-white/10 pt-5">
          <p className="text-[14px] uppercase tracking-[0.22em] font-display font-semibold text-white/50">
            TAQA Arabia · Confidential
          </p>
          <p className="text-[14px] text-white/50">Jan 2026</p>
        </Rise>
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
      <Rise i={0}><Kicker color={GREEN}>TAQA Arabia · Who We Are</Kicker></Rise>
      <Rise i={1}>
        <h2 className="mt-4 font-display font-bold tracking-tight leading-[1.08] text-[42px] max-w-[980px]" style={{ color: NAVY }}>
          Egypt's leading integrated energy infrastructure developer
        </h2>
      </Rise>

      <div className="mt-8 flex-1 min-h-0 grid grid-cols-2 gap-10">
        {/* Narrative + photo */}
        <div className="flex flex-col min-h-0">
          <Rise i={2} className="space-y-4 text-[16px] leading-relaxed text-slate-600">
            <p>
              Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest
              private-sector energy and utility developer.
            </p>
            <p>
              Across four divisions — Gas, Power, Petroleum and Water — TAQA finances, builds,
              owns and operates the utility backbone of residential communities, industrial zones
              and touristic destinations.
            </p>
          </Rise>
          <Rise i={3} className="mt-6 flex-1 min-h-0">
            <PhotoCard src={P.farm} className="h-full w-full rounded-3xl" />
          </Rise>
        </div>

        {/* Division cards */}
        <div className="flex flex-col justify-between gap-3">
          {divisions.map((d, idx) => (
            <Rise key={d.label} i={3 + idx} className="flex-1">
              <div className="flex h-full items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-[0_10px_30px_-14px_rgba(0,32,96,0.18)]">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${d.color}, ${tone(d.color)})` }}
                >
                  {d.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[18px] font-bold" style={{ color: NAVY }}>{d.label}</div>
                  <div className="text-[16px] text-slate-500 leading-snug">{d.desc}</div>
                </div>
              </div>
            </Rise>
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
      <Rise i={0}><Kicker color={GREEN}>TAQA Arabia · Regional Presence</Kicker></Rise>
      <Rise i={1}>
        <h2 className="mt-4 font-display font-bold tracking-tight leading-[1.08] text-[38px] max-w-[1020px]" style={{ color: NAVY }}>
          A growing platform across Egypt, the GCC, Africa and Greece
        </h2>
      </Rise>

      {/* Metric strip */}
      <div className="mt-7 grid grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <Rise key={m.label} i={2 + idx}>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-[0_10px_30px_-14px_rgba(0,32,96,0.18)]">
              <div className="h-[3px] w-9 rounded-full mb-3" style={{ background: `linear-gradient(90deg, ${GREEN}, ${LIME})` }} />
              <div className="font-display text-[38px] font-bold leading-none" style={gt(GREEN, "#4d9d2a")}>{m.value}</div>
              <div className="mt-1.5 text-[16px] font-semibold" style={{ color: NAVY }}>{m.label}</div>
              <div className="text-[14px] text-slate-500">{m.sub}</div>
            </div>
          </Rise>
        ))}
      </div>

      <div className="mt-5 flex-1 min-h-0 grid grid-cols-2 gap-5">
        {/* International expansion */}
        <Rise i={6} className="min-h-0">
          <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-black/5 shadow-[0_10px_30px_-14px_rgba(0,32,96,0.18)] flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
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
        </Rise>

        {/* Geographic footprint */}
        <Rise i={7} className="min-h-0">
          <div
            className="h-full rounded-3xl p-6 text-white flex flex-col shadow-[0_18px_44px_-18px_rgba(0,32,96,0.55)]"
            style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0c2f1a 100%)` }}
          >
            <h3 className="font-display text-[17px] font-bold mb-2.5" style={gt(GOLD, "#ffe08a")}>Geographic Footprint</h3>
            <p className="text-[16px] text-white/85 leading-snug mb-3.5">
              Concessions in 8 Egyptian governorates renewed for 15 years. TAQA serves the full spectrum of customer types:
            </p>
            <div className="flex-1 flex flex-col justify-between">
              {customers.map(c => (
                <div key={c} className="flex items-center gap-2.5 text-[16px] text-white/90">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                  {c}
                </div>
              ))}
            </div>
          </div>
        </Rise>
      </div>
    </LightSlide>
  );
}

// ─── Slide 3: In Numbers ──────────────────────────────────────────────────────

function NumbersSlide() {
  const heroes = [
    { value: "EGP 13.4bn", label: "Revenue",       sub: "FY 2025" },
    { value: "EGP 1.5bn",  label: "EBITDA",        sub: "FY 2025" },
    { value: "~6.5M",      label: "Gas customers", sub: "Active connections" },
  ];
  const divisions = [
    { div: "GAS",          icon: <Flame className="w-4 h-4" />,    stats: ["+10,000 km", "8 governorates, 15yr"],    color: "#E68A00" },
    { div: "POWER",        icon: <Zap className="w-4 h-4" />,      stats: ["+1,600 MVA", "+150 MW"],                 color: "#d97706" },
    { div: "WATER",        icon: <Droplets className="w-4 h-4" />, stats: ["+47,000 m³/day", "15 locations"],        color: SKY },
    { div: "MOBILITY/CNG", icon: <Truck className="w-4 h-4" />,    stats: ["86 stations", "1st private EV licence"], color: "#7B35C2" },
  ];
  return (
    <LightSlide color={GREEN}>
      <Rise i={0}><Kicker color={GREEN}>TAQA Arabia · In Numbers</Kicker></Rise>
      <Rise i={1}>
        <h2 className="mt-4 font-display font-bold tracking-tight leading-[1.08] text-[38px] max-w-[1040px]" style={{ color: NAVY }}>
          The scale behind a single integrated energy partner — FY 2025
        </h2>
      </Rise>

      {/* Hero financials */}
      <div className="mt-7 grid grid-cols-3 gap-4">
        {heroes.map((m, idx) => (
          <Rise key={m.label} i={2 + idx}>
            <div
              className="relative overflow-hidden rounded-3xl p-6 text-white shadow-[0_18px_44px_-18px_rgba(4,21,12,0.6)]"
              style={{ background: "linear-gradient(135deg, #04150c 0%, #0c2f1a 70%, #14532d 100%)" }}
            >
              <div
                aria-hidden
                className="absolute -right-10 -top-14 h-40 w-40 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(132,204,22,0.22), transparent 65%)" }}
              />
              <div className="font-display text-[36px] font-bold leading-none" style={gt("#a3e635", "#fde047")}>{m.value}</div>
              <div className="mt-2 text-[17px] font-semibold text-white/95">{m.label}</div>
              <div className="text-[14px] text-white/60">{m.sub}</div>
            </div>
          </Rise>
        ))}
      </div>

      {/* Division bento */}
      <div className="mt-5 flex-1 min-h-0 grid grid-cols-4 gap-4">
        {divisions.map((d, idx) => (
          <Rise key={d.div} i={5 + idx} className="min-h-0">
            <div className="h-full rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-[0_10px_30px_-14px_rgba(0,32,96,0.18)] flex flex-col">
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${d.color}, ${tone(d.color)})` }}
                >
                  {d.icon}
                </div>
                <span className="font-display text-[16px] font-bold tracking-tight" style={{ color: NAVY }}>{d.div}</span>
              </div>
              <div className="space-y-2.5">
                {d.stats.map(s => (
                  <div key={s} className="flex items-start gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-[16px] font-medium text-slate-600 leading-snug">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </Rise>
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
      <Rise i={0}><Kicker color="#dc2626" dark>Agriculture · The Challenge</Kicker></Rise>
      <Rise i={1}>
        <h2 className="mt-5 font-display font-bold tracking-tight text-white leading-[1.06] text-[44px] max-w-[980px]">
          Energy and water — the two biggest costs on any farm
        </h2>
      </Rise>

      <div className="mt-8 grid grid-cols-3 gap-5">
        {pains.map((c, idx) => (
          <Rise key={c.label} i={2 + idx}>
            <div className="h-full rounded-3xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-6">
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${c.color}, ${tone(c.color)})` }}
              >
                {c.icon}
              </div>
              <h3 className="font-display text-[19px] font-bold text-white mb-2">{c.label}</h3>
              <p className="text-[17px] leading-relaxed text-white/85">{c.desc}</p>
            </div>
          </Rise>
        ))}
      </div>

      <Rise i={5} className="mt-auto">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-6 pl-8">
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
      </Rise>
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
      <Rise i={0}><Kicker color={GREEN}>TAQA · Integrated Farm Solution</Kicker></Rise>
      <Rise i={1}>
        <h2 className="mt-4 font-display font-bold tracking-tight leading-[1.1] text-[30px] max-w-[1060px]" style={{ color: NAVY }}>
          One partner connects water and a smart, multi-source power stack to keep every pivot turning
        </h2>
      </Rise>

      <div className="mt-6 flex-1 min-h-0 flex flex-col gap-4">
        {/* Flow diagram */}
        <div className="flex-1 min-h-0 flex items-stretch gap-4">
          {/* Energy sources */}
          <Rise i={2} className="flex-1 min-h-0">
            <div className="h-full rounded-3xl bg-white p-5 ring-1 ring-black/5 shadow-[0_10px_30px_-14px_rgba(0,32,96,0.18)] flex flex-col">
              <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GREEN }}>
                Energy Sources
              </p>
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
                      <div className="text-[12.5px] text-slate-500 leading-tight">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Rise>

          {/* Connector → EMS → connector */}
          <Rise i={3} className="flex items-center shrink-0">
            <div className="flex items-center">
              <div className="h-[2px] w-8" style={{ background: `linear-gradient(90deg, ${GREEN}30, ${GREEN})` }} />
              <ArrowRight className="w-4 h-4 -ml-1.5" style={{ color: GREEN }} />
              <div
                className="mx-1 flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full text-center text-white shadow-[0_18px_40px_-14px_rgba(21,128,61,0.55)]"
                style={{ background: `linear-gradient(135deg, ${GREEN}, ${LIME})` }}
              >
                <Zap className="w-6 h-6 mb-1.5" style={{ color: "#fef9c3" }} />
                <div className="font-display text-[15px] font-bold leading-tight px-4">TAQA Smart<br />Energy Mgmt</div>
              </div>
              <div className="h-[2px] w-8" style={{ background: `linear-gradient(90deg, ${GREEN}, ${GREEN}30)` }} />
              <ArrowRight className="w-4 h-4 -ml-1.5" style={{ color: GREEN }} />
            </div>
          </Rise>

          {/* Output */}
          <Rise i={4} className="flex-1 min-h-0">
            <div
              className="relative h-full overflow-hidden rounded-3xl p-6 text-white flex flex-col justify-center shadow-[0_18px_44px_-18px_rgba(0,32,96,0.55)]"
              style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0c2f1a 100%)` }}
            >
              <div
                aria-hidden
                className="absolute -right-12 -bottom-16 h-48 w-48 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(132,204,22,0.2), transparent 65%)" }}
              />
              <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] mb-2.5" style={{ color: GOLD }}>
                Powered Pivots 24/7
              </p>
              <p className="text-[17px] leading-relaxed text-white/90">
                Round-the-clock irrigation — optimised source mix, always on, minimum cost.
              </p>
            </div>
          </Rise>
        </div>

        {/* Water strip */}
        <Rise i={5}>
          <div className="flex items-center gap-4 rounded-2xl px-5 py-3.5 ring-1 ring-black/5 bg-white shadow-[0_10px_30px_-14px_rgba(0,149,200,0.25)]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${SKY}, ${tone(SKY)})` }}>
              <Droplets className="w-4 h-4" />
            </div>
            <span className="font-display text-[16px] font-bold" style={{ color: NAVY }}>Water Solutions</span>
            <span className="text-[16px] text-slate-500">Desalination · Wells · Pumping</span>
          </div>
        </Rise>

        {/* Quote */}
        <Rise i={6}>
          <div
            className="rounded-2xl px-5 py-3.5 text-center font-display text-[16px] font-semibold"
            style={{ background: GREEN + "0D", boxShadow: `inset 0 0 0 1px ${GREEN}26`, color: "#14532d" }}
          >
            "TAQA delivers the whole farm energy-and-water backbone as one system."
          </div>
        </Rise>
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
      <Rise i={0}><Kicker color={GREEN}>TAQA · Smart Energy Mix</Kicker></Rise>
      <Rise i={1}>
        <h2 className="mt-4 font-display font-bold tracking-tight leading-[1.1] text-[30px] max-w-[1080px]" style={{ color: NAVY }}>
          Solar by day, batteries after sunset, gas and diesel for firming — least-cost, lowest-carbon, always on
        </h2>
      </Rise>

      {/* Step flow with connecting line */}
      <div className="relative mt-9 flex-1 min-h-0">
        <div
          aria-hidden
          className="absolute left-[8%] right-[8%] top-[26px] h-[2px]"
          style={{ background: "linear-gradient(90deg, #d97706, #7B35C2, #E68A00, #6B6B6B)", opacity: 0.35 }}
        />
        <div className="grid h-full grid-cols-4 gap-5">
          {steps.map((s, idx) => (
            <Rise key={s.n} i={2 + idx} className="min-h-0">
              <div className="flex h-full flex-col">
                <div
                  className="relative z-10 mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${tone(s.color)})` }}
                >
                  {s.icon}
                </div>
                <div className="flex-1 rounded-3xl bg-white p-5 ring-1 ring-black/5 shadow-[0_10px_30px_-14px_rgba(0,32,96,0.18)]">
                  <div className="font-display text-[30px] font-bold leading-none mb-2" style={gt(s.color, tone(s.color))}>{s.n}</div>
                  <h3 className="font-display text-[17px] font-bold mb-1.5" style={{ color: NAVY }}>{s.title}</h3>
                  <p className="text-[16px] leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </div>

      <Rise i={6} className="mt-5">
        <div
          className="rounded-2xl px-5 py-3.5 text-center text-[17px] font-medium"
          style={{ background: GREEN + "0D", boxShadow: `inset 0 0 0 1px ${GREEN}26`, color: "#14532d" }}
        >
          One TAQA energy-management system optimises the mix every minute — least cost, lowest carbon, always on.
        </div>
      </Rise>
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
      <Rise i={0}><Kicker color={GREEN}>Agriculture Clients · Solutions Overview</Kicker></Rise>
      <Rise i={1}>
        <h2 className="mt-4 font-display font-bold tracking-tight leading-[1.08] text-[34px] max-w-[1060px]" style={{ color: NAVY }}>
          The following slides detail every solution TAQA Arabia offers to farms and agribusiness
        </h2>
      </Rise>
      <Rise i={2} className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-[15px] font-medium text-slate-500 mr-1">Each solution:</span>
        {journey.map((j, idx) => (
          <span key={j} className="flex items-center gap-2">
            <span className="rounded-full bg-white px-3.5 h-7 inline-flex items-center text-[15px] font-semibold ring-1 ring-black/5 shadow-sm" style={{ color: NAVY }}>
              {j}
            </span>
            {idx < journey.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
          </span>
        ))}
      </Rise>

      <div className="mt-6 flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-5">
        {solutions.map((s, idx) => (
          <Rise key={s.num} i={3 + idx} className="min-h-0">
            <div className="relative h-full overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/5 shadow-[0_10px_30px_-14px_rgba(0,32,96,0.18)]">
              <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${s.color}, ${tone(s.color)})` }} />
              <div
                aria-hidden
                className="absolute -bottom-7 right-3 font-display font-bold leading-none select-none"
                style={{ fontSize: 110, color: s.color, opacity: 0.08, letterSpacing: "-0.04em" }}
              >
                {s.num}
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
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
          </Rise>
        ))}
      </div>
    </LightSlide>
  );
}

// ─── Reusable: AgriScopeSlide ─────────────────────────────────────────────────

interface AgriScopeSlideProps {
  sectionLabel: string;
  title: string;
  subtitle: string;
  tagline: string;
  color: string;
  icon: React.ReactNode;
  taqaInvests: string[];
  steps: string[];
  whatYouReceive: string[];
  photo: string;
}

function AgriScopeSlide({
  sectionLabel, title, subtitle, tagline, color, icon,
  taqaInvests, steps, whatYouReceive, photo,
}: AgriScopeSlideProps) {
  const num = "0" + sectionLabel.trim().charAt(0);
  return (
    <LightSlide color={color} num={num}>
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <Rise i={0}><Kicker color={color}>{sectionLabel}</Kicker></Rise>
          <Rise i={1}>
            <h2 className="mt-3.5 font-display font-bold tracking-tight leading-[1.08] text-[30px] max-w-[840px]" style={{ color: NAVY }}>
              {title}
            </h2>
            <p className="mt-1.5 text-[16px] text-slate-500">{subtitle}</p>
          </Rise>
        </div>
        <Rise i={1}><PhotoCard src={photo} className="h-[96px] w-[210px]" /></Rise>
      </div>

      {/* Tagline */}
      <Rise i={2} className="mt-4">
        <div className="relative overflow-hidden rounded-2xl bg-white px-5 py-3 ring-1 ring-black/5 shadow-sm">
          <div aria-hidden className="absolute left-0 top-0 h-full w-[3px]" style={{ background: `linear-gradient(180deg, ${color}, ${tone(color)})` }} />
          <p className="text-[17px] font-medium leading-snug" style={{ color: NAVY }}>{tagline}</p>
        </div>
      </Rise>

      {/* Three columns */}
      <div className="mt-4 flex-1 min-h-0 grid grid-cols-3 gap-4">
        {/* TAQA Invests */}
        <Rise i={3} className="min-h-0">
          <div className="h-full rounded-3xl p-5 ring-1 ring-black/5 bg-white shadow-[0_10px_30px_-14px_rgba(0,32,96,0.16)] flex flex-col">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: `linear-gradient(135deg, ${color}, ${tone(color)})` }}>
                {icon}
              </span>
              <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em]" style={{ color }}>TAQA Invests</p>
            </div>
            <div className="flex-1 flex flex-col justify-evenly">
              {taqaInvests.map(t => (
                <div key={t} className="flex items-start gap-2.5 py-1">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-[16px] leading-snug text-slate-600">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </Rise>

        {/* How it works */}
        <Rise i={4} className="min-h-0">
          <div className="h-full rounded-3xl p-5 ring-1 ring-black/5 flex flex-col" style={{ background: color + "08" }}>
            <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color }}>How It Works</p>
            <div className="relative flex-1 flex flex-col justify-evenly pl-9">
              <div aria-hidden className="absolute left-[13px] top-2 bottom-2 w-[2px] rounded-full" style={{ background: color + "30" }} />
              {steps.map((s, i) => (
                <div key={i} className="relative py-1">
                  <div
                    className="absolute -left-9 top-1 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white text-[14px] font-bold font-display ring-2"
                    style={{ color, boxShadow: `0 0 0 2px ${color}` }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-[16px] leading-snug text-slate-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </Rise>

        {/* What you receive */}
        <Rise i={5} className="min-h-0">
          <div
            className="relative h-full overflow-hidden rounded-3xl p-5 text-white flex flex-col shadow-[0_18px_44px_-18px_rgba(0,32,96,0.55)]"
            style={{ background: `linear-gradient(150deg, ${NAVY} 0%, #0c2f1a 100%)` }}
          >
            <div
              aria-hidden
              className="absolute -right-12 -top-14 h-44 w-44 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${tone(color)}30, transparent 65%)` }}
            />
            <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GOLD }}>What You Receive</p>
            <div className="flex-1 flex flex-col justify-evenly">
              {whatYouReceive.map(w => (
                <div key={w} className="flex items-start gap-2.5 py-1">
                  <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0" style={{ color: GOLD }} />
                  <span className="text-[16px] leading-snug text-white/90">{w}</span>
                </div>
              ))}
            </div>
          </div>
        </Rise>
      </div>
    </LightSlide>
  );
}

// ─── Reusable: AgriValueSlide ─────────────────────────────────────────────────

interface AgriValueSlideProps {
  sectionLabel: string;
  title: string;
  color: string;
  icon: React.ReactNode;
  gains: { label: string; desc: string }[];
  edge: { label: string; desc: string }[];
  photo: string;
}

function AgriValueSlide({ sectionLabel, title, color, icon, gains, edge, photo }: AgriValueSlideProps) {
  const num = "0" + sectionLabel.trim().charAt(0);
  return (
    <LightSlide color={color} num={num}>
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <Rise i={0}><Kicker color={color}>{sectionLabel}</Kicker></Rise>
          <Rise i={1} className="mt-3.5 flex items-center gap-3.5">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${color}, ${tone(color)})` }}
            >
              {icon}
            </div>
            <h2 className="font-display font-bold tracking-tight leading-[1.08] text-[32px]" style={{ color: NAVY }}>
              {title}
            </h2>
          </Rise>
        </div>
        <Rise i={1}><PhotoCard src={photo} className="h-[96px] w-[210px]" /></Rise>
      </div>

      <div className="mt-6 flex-1 min-h-0 grid grid-cols-2 gap-6">
        {/* Gains */}
        <div className="flex flex-col min-h-0">
          <Rise i={2}>
            <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color }}>What You Gain</p>
          </Rise>
          <div className="flex-1 flex flex-col justify-between gap-2.5">
            {gains.map((g, idx) => (
              <Rise key={g.label} i={3 + idx} className="flex-1">
                <div className="flex h-full items-start gap-3 rounded-2xl p-3.5 ring-1 ring-black/5 bg-white shadow-sm">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ background: `linear-gradient(135deg, ${color}, ${tone(color)})` }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-[15.5px] font-bold leading-tight" style={{ color: NAVY }}>{g.label}</div>
                    <div className="mt-0.5 text-[16px] leading-snug text-slate-600">{g.desc}</div>
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>

        {/* Edge */}
        <div className="flex flex-col min-h-0">
          <Rise i={3}>
            <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: GREEN }}>TAQA Arabia Edge</p>
          </Rise>
          <div className="flex-1 flex flex-col justify-between gap-2.5">
            {edge.map((e, idx) => (
              <Rise key={e.label} i={4 + idx} className="flex-1">
                <div className="flex h-full items-start gap-3 rounded-2xl p-3.5" style={{ background: GREEN + "0A", boxShadow: `inset 0 0 0 1px ${GREEN}1f` }}>
                  <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full" style={{ background: `linear-gradient(135deg, ${GREEN}, ${LIME})` }} />
                  <div className="min-w-0">
                    <div className="font-display text-[15.5px] font-bold leading-tight" style={{ color: NAVY }}>{e.label}</div>
                    <div className="mt-0.5 text-[16px] leading-snug text-slate-600">{e.desc}</div>
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Reusable: AgriTimelineSlide ──────────────────────────────────────────────

interface AgriTimelinePhase {
  day: string;
  label: string;
  desc: string;
}
interface AgriTimelineGroup {
  label: string;
  range: string;
  color?: string;
}
interface AgriTimelineSlideProps {
  sectionLabel: string;
  title: string;
  color: string;
  icon: React.ReactNode;
  phases: AgriTimelinePhase[];
  groups: AgriTimelineGroup[];
  photo: string;
}

function AgriTimelineSlide({ sectionLabel, title, color, icon, phases, groups, photo }: AgriTimelineSlideProps) {
  const num = "0" + sectionLabel.trim().charAt(0);
  return (
    <LightSlide color={color} num={num}>
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <Rise i={0}><Kicker color={color}>{sectionLabel}</Kicker></Rise>
          <Rise i={1} className="mt-3.5 flex items-center gap-3.5">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${color}, ${tone(color)})` }}
            >
              {icon}
            </div>
            <h2 className="font-display font-bold tracking-tight leading-[1.08] text-[32px]" style={{ color: NAVY }}>
              {title}
            </h2>
          </Rise>
        </div>
        <Rise i={1}><PhotoCard src={photo} className="h-[96px] w-[210px]" /></Rise>
      </div>

      {/* Phase group bands */}
      <div className="mt-5 grid gap-3" style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}>
        {groups.map((g, i) => (
          <Rise key={i} i={2 + i}>
            <div
              className="rounded-2xl px-4 py-3 text-white shadow-md flex items-baseline justify-between gap-2"
              style={{ background: `linear-gradient(135deg, ${g.color ?? color}, ${color})` }}
            >
              <span className="font-display text-[14px] font-semibold uppercase tracking-[0.18em]">{g.label}</span>
              <span className="text-[15px] font-medium text-white/85 whitespace-nowrap">{g.range}</span>
            </div>
          </Rise>
        ))}
      </div>

      {/* Vertical phase timeline */}
      <div className="relative mt-5 flex-1 min-h-0 flex flex-col justify-evenly pl-10">
        <div aria-hidden className="absolute left-[13px] top-2 bottom-2 w-[2px] rounded-full" style={{ background: `linear-gradient(180deg, ${color}, ${color}20)` }} />
        {phases.map((p, i) => (
          <Rise key={i} i={3 + i} className="relative py-0.5">
            <div
              className="absolute -left-10 top-0.5 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white ring-2"
              style={{ boxShadow: `0 0 0 2px ${color}` }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: `linear-gradient(135deg, ${color}, ${tone(color)})` }} />
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className="rounded-full px-2.5 py-0.5 font-display text-[14px] font-bold whitespace-nowrap"
                style={{ background: color + "12", color }}
              >
                {p.day}
              </span>
              <span className="font-display text-[15.5px] font-bold" style={{ color: NAVY }}>{p.label}</span>
              <span className="text-[16px] text-slate-500">{p.desc}</span>
            </div>
          </Rise>
        ))}
      </div>
    </LightSlide>
  );
}

// ─── Reusable: AgriTrackRecordSlide ───────────────────────────────────────────

interface AgriTrackRecordSlideProps {
  sectionLabel: string;
  title: string;
  subheadline: string;
  body: string;
  color: string;
  icon: React.ReactNode;
  stats: { value: string; label: string }[];
  photo: string;
}

function AgriTrackRecordSlide({
  sectionLabel, title, subheadline, body, color, icon, stats, photo,
}: AgriTrackRecordSlideProps) {
  return (
    <DarkSlide photo={photo} tint={color}>
      <Rise i={0} className="flex items-center gap-3">
        <Kicker color={color} dark>{sectionLabel}</Kicker>
      </Rise>
      <Rise i={1} className="mt-5 flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}, ${tone(color)})` }}
        >
          {icon}
        </div>
        <h2 className="font-display font-bold tracking-tight text-white leading-[1.06] text-[38px]">
          {title}
        </h2>
      </Rise>

      <div className="mt-9 flex-1 min-h-0 grid grid-cols-5 gap-8">
        {/* Story */}
        <div className="col-span-3 flex flex-col justify-center">
          <Rise i={2}>
            <div className="mb-4 h-[3px] w-16 rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${tone(color)})` }} />
            <h3 className="font-display text-[24px] font-bold leading-snug" style={gt(tone(color), "#ffffff")}>
              {subheadline}
            </h3>
          </Rise>
          <Rise i={3}>
            <p className="mt-4 text-[16px] leading-relaxed text-white/90">{body}</p>
          </Rise>
        </div>

        {/* Glass stats */}
        <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-4 content-center">
          {stats.map((s, idx) => (
            <Rise key={s.label} i={4 + idx} className="min-h-0">
              <div className="flex h-full flex-col justify-center rounded-3xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-4">
                <div className="font-display text-[21px] font-bold leading-tight" style={gt(tone(color), "#ffffff")}>{s.value}</div>
                <div className="mt-1.5 text-[12.5px] leading-snug text-white/80">{s.label}</div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </DarkSlide>
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
      <Rise i={0}><Kicker color={NAVY}>Why One Partner</Kicker></Rise>
      <Rise i={1} className="mt-4 flex items-baseline gap-4 flex-wrap">
        <h2 className="font-display font-bold tracking-tight leading-[1.05] text-[40px]" style={{ color: NAVY }}>
          The TAQA One-Stop-Shop
        </h2>
        <p className="text-[17px] text-slate-500">
          One SLA, one communication point, one accountable operator — for the farm's water and power.
        </p>
      </Rise>

      <div className="mt-6 flex-1 min-h-0 grid grid-cols-2 gap-6">
        {/* Solutions hub */}
        <Rise i={2} className="min-h-0">
          <div
            className="relative h-full overflow-hidden rounded-3xl p-6 text-white flex flex-col shadow-[0_18px_44px_-18px_rgba(0,32,96,0.55)]"
            style={{ background: `linear-gradient(140deg, ${NAVY} 0%, #0c2f1a 100%)` }}
          >
            <div
              aria-hidden
              className="absolute -right-16 -top-20 h-56 w-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(132,204,22,0.22), transparent 65%)" }}
            />
            <h3 className="font-display text-[18px] font-bold mb-4" style={gt(GOLD, "#ffe08a")}>
              TAQA Arabia — All Farm Solutions
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {solutions.map(s => (
                <div key={s} className="flex items-center gap-2.5 rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-md px-3.5 py-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: `linear-gradient(135deg, ${GOLD}, ${LIME})` }} />
                  <span className="text-[16px] font-semibold text-white/95">{s}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2.5 border-t border-white/15 pt-4">
              <span className="text-[16px] text-white/70">From Fragmented Vendors</span>
              <ArrowRight className="w-4 h-4" style={{ color: LIME }} />
              <span className="text-[16px] font-semibold text-white/95">One Integrated Operator</span>
            </div>
          </div>
        </Rise>

        {/* Benefits */}
        <div className="flex flex-col justify-between gap-2.5 min-h-0">
          {benefits.map((b, idx) => (
            <Rise key={b.label} i={3 + idx} className="flex-1">
              <div className="flex h-full items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-black/5 shadow-sm">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: `linear-gradient(135deg, ${GREEN}, ${LIME})` }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-[17px] font-bold leading-tight" style={{ color: NAVY }}>{b.label}</div>
                  <div className="text-[16px] leading-snug text-slate-600">{b.desc}</div>
                </div>
              </div>
            </Rise>
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
      <Rise i={0}><Kicker color={NAVY}>Integrated Economics</Kicker></Rise>
      <Rise i={1}>
        <h2 className="mt-4 font-display font-bold tracking-tight leading-[1.08] text-[34px]" style={{ color: NAVY }}>
          The Integrated Economics: Diesel-Only vs. TAQA
        </h2>
        <p className="mt-1 text-[16px] text-slate-500">
          What changes when one partner runs an optimised water-and-power stack — illustrative
        </p>
      </Rise>

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
        <Rise i={2} className="min-h-0">
          <div className="h-full rounded-3xl p-5 ring-1 ring-red-200 bg-red-50/70 flex flex-col">
            <div className="mb-3.5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm" style={{ background: "linear-gradient(135deg, #dc2626, #f87171)" }}>
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="font-display text-[17px] font-bold text-red-800">Today — Diesel-Only Farm</h3>
            </div>
            <div className="flex-1 flex flex-col justify-between gap-2">
              {today.map(t => (
                <div key={t.label} className="flex flex-1 items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-red-100">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
                  <div className="min-w-0">
                    <div className="text-[14.5px] font-bold leading-tight text-red-800">{t.label}</div>
                    <div className="text-[16px] leading-snug text-slate-600">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Rise>

        {/* With TAQA */}
        <Rise i={3} className="min-h-0">
          <div className="h-full rounded-3xl p-5 flex flex-col" style={{ background: GREEN + "0A", boxShadow: `inset 0 0 0 1px ${GREEN}30` }}>
            <div className="mb-3.5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${GREEN}, ${LIME})` }}>
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-display text-[17px] font-bold" style={{ color: "#14532d" }}>With TAQA — Integrated Stack</h3>
            </div>
            <div className="flex-1 flex flex-col justify-between gap-2">
              {withTaqa.map(t => (
                <div key={t.label} className="flex flex-1 items-center gap-3 rounded-xl bg-white p-3" style={{ boxShadow: `inset 0 0 0 1px ${GREEN}1f` }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GREEN }} />
                  <div className="min-w-0">
                    <div className="text-[14.5px] font-bold leading-tight" style={{ color: NAVY }}>{t.label}</div>
                    <div className="text-[16px] leading-snug text-slate-600">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Rise>
      </div>

      <Rise i={4}>
        <p className="mt-3.5 text-center text-[14px] text-slate-500">
          Figures are illustrative / market-based and depend on farm size, crop, irrigation schedule and fuel prices.
        </p>
      </Rise>
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
      <Rise i={0}><Kicker color={GREEN} dark>Proven on the Ground</Kicker></Rise>
      <Rise i={1}>
        <h2 className="mt-5 font-display font-bold tracking-tight leading-[1.02] text-[52px] text-white">
          Dina Farms <span style={gt("#4ade80", "#bef264")}>&amp; Beyond</span>
        </h2>
        <p className="mt-3 text-[16px] text-white/80">
          Real agricultural renewable projects — the foundation for the fully integrated farm.
        </p>
      </Rise>

      <Rise i={2}>
        <p className="mt-6 max-w-[980px] text-[16px] leading-relaxed text-white/90">
          TAQA Arabia operates renewable-energy projects at Dina Farms — one of Egypt's largest integrated
          agricultural operations — alongside its landmark Benban solar developments. These projects prove
          TAQA can deploy and run clean energy at true agricultural scale. The next step is the fully
          integrated stack: pairing that solar with storage, gas and water under one operator.
        </p>
      </Rise>

      <Rise i={3} className="mt-7 flex items-center gap-3">
        {pillars.map(s => (
          <div key={s.label} className="flex items-center gap-2.5 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md px-4 h-10">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${s.color}, ${tone(s.color)})` }} />
            <span className="text-[16px] font-semibold text-white/95">{s.label}</span>
          </div>
        ))}
      </Rise>

      <div className="mt-auto grid grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <Rise key={s.label} i={4 + idx}>
            <div className="rounded-3xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-5">
              <div className="font-display text-[22px] font-bold leading-tight" style={gt("#a3e635", "#fde047")}>{s.value}</div>
              <div className="mt-1.5 text-[15px] leading-snug text-white/80">{s.label}</div>
            </div>
          </Rise>
        ))}
      </div>
    </DarkSlide>
  );
}

// ─── All Slides Array ─────────────────────────────────────────────────────────

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
  // 8 — Water: Scope
  {
    title: "Water Solutions: Scope",
    render: () => (
      <AgriScopeSlide
        sectionLabel="1 · Water Solutions: Scope & How It Works"
        title="Reliable, cost-effective water for the farm"
        subtitle="Desalination, groundwater treatment and smart irrigation pumping"
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the water you use — little to no upfront CapEx."
        color="#0095C8"
        icon={<Droplets className="w-4 h-4" />}
        taqaInvests={[
          "Brackish/seawater RO desalination units",
          "Pre-treatment & filtration",
          "Storage reservoirs & pumping",
          "Irrigation distribution & smart meters",
          "BOO/BOOT plant financing",
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
        photo={P.water}
      />
    ),
  },
  // 9 — Water: Value
  {
    title: "Water Solutions: Value Proposition",
    render: () => (
      <AgriValueSlide
        sectionLabel="1 · Water Solutions: Value Proposition"
        title="Water Solutions: Value Proposition"
        color="#0095C8"
        icon={<Droplets className="w-5 h-5" />}
        gains={[
          { label: "Guaranteed Water Security",  desc: "Reliable freshwater for irrigation, independent of grid-utility and groundwater constraints." },
          { label: "Lower Energy & Water Cost",  desc: "VSDs, peak-demand control and solar-powered pumping cut energy use and non-revenue water losses." },
          { label: "Frees Up Groundwater",       desc: "Desalination and treatment reduce over-abstraction, protecting the aquifer for the long term." },
          { label: "Sustainability & ESG Impact",desc: "Solar-powered desalination, brine management and a reduced freshwater-extraction footprint." },
        ]}
        edge={[
          { label: "Flexible Delivery Approach", desc: "BOO/BOOT or EPC via Capacity-as-a-Service — no upfront infrastructure cost." },
          { label: "Smart Operations & Uptime",  desc: "Real-time monitoring, leak & failure detection and predictive-maintenance dashboards." },
          { label: "Tailored to the Farm",       desc: "Solutions sized to crop type, hectares and irrigation schedule — not one-size-fits-all." },
          { label: "Performance Guarantees",     desc: "Volume and quality backed by contractual SLAs." },
        ]}
        photo={P.water}
      />
    ),
  },
  // 10 — Water: Timeline
  {
    title: "Water Solutions: Timeline",
    render: () => (
      <AgriTimelineSlide
        sectionLabel="1 · Water Solutions: Implementation Timeline"
        title="Water Solutions: Implementation Timeline"
        color="#0095C8"
        icon={<Droplets className="w-5 h-5" />}
        phases={[
          { day: "Day 0–20",    label: "Water Demand Study", desc: "Crop water need & source-water survey." },
          { day: "Day 20–60",   label: "Plant Design",       desc: "RO sizing, pumping & solar integration." },
          { day: "Day 45–75",   label: "Commercial Model",   desc: "BOO/BOOT & water-purchase agreement." },
          { day: "Day 75–210",  label: "Construction",       desc: "Plant, wells, networks & smart metering." },
          { day: "Day 210–260", label: "Commissioning",      desc: "Testing, water-quality validation & handover." },
          { day: "Day 260+",    label: "Smart O&M",          desc: "IoT monitoring & predictive maintenance." },
        ]}
        groups={[
          { label: "STUDY & DESIGN", range: "Day 0–60",   color: "#0077A8" },
          { label: "FINANCE & BUILD",range: "Day 45–260",  color: "#0095C8" },
          { label: "SMART OPERATE",  range: "Day 260+",    color: "#006B9A" },
        ]}
        photo={P.water}
      />
    ),
  },
  // 11 — Water: Track Record
  {
    title: "Water Solutions: Track Record",
    render: () => (
      <AgriTrackRecordSlide
        sectionLabel="1 · Water Solutions: Proven Track Record"
        title="Water Solutions: Proven Track Record"
        subheadline="Eco Solar Desalination — Soma Bay"
        body="On the Red Sea, TAQA Water built Egypt's first green desalination facility powered entirely by renewable energy, using technology that consumes 50% less power than peers. The same solar-powered, smart-operated water model — proven at scale — secures irrigation supply for large farms and agribusiness."
        color="#0095C8"
        icon={<Droplets className="w-5 h-5" />}
        stats={[
          { value: "+47,000 m³/day", label: "Contracted desalination" },
          { value: "15",             label: "Operational water locations" },
          { value: "50% less power", label: "Than peer plants" },
          { value: "8,560 t CO₂",   label: "Avoided per year" },
        ]}
        photo={P.water}
      />
    ),
  },
  // 12 — Solar: Scope
  {
    title: "Solar: Scope",
    render: () => (
      <AgriScopeSlide
        sectionLabel="2 · Solar: Scope & How It Works"
        title="Tailored solar PV to power pivots and pumps by day"
        subtitle="Integrated with storage and diesel for round-the-clock supply"
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the solar power you use — little to no upfront CapEx."
        color="#d97706"
        icon={<SunMedium className="w-4 h-4" />}
        taqaInvests={[
          "Ground-mount & pump-side PV arrays",
          "Solar inverters & mounting",
          "Pump controllers & soft starters",
          "Monitoring & connection works",
          "BOO/BOOT solar financing",
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
        photo={P.solar}
      />
    ),
  },
  // 13 — Solar: Value
  {
    title: "Solar: Value Proposition",
    render: () => (
      <AgriValueSlide
        sectionLabel="2 · Solar: Value Proposition"
        title="Solar: Value Proposition"
        color="#d97706"
        icon={<SunMedium className="w-5 h-5" />}
        gains={[
          { label: "Lower Energy Bills",         desc: "Clean solar energy at lower cost than diesel-only pivot power, through long-term PPAs." },
          { label: "Energy Security",            desc: "On-site generation reduces exposure to fuel-price spikes and supply disruption." },
          { label: "Sustainability & Carbon Cut",desc: "Each 1 MWp avoids ~1,000 tons of CO₂ a year — strong ESG and export credentials." },
          { label: "Uses Idle Land",             desc: "Marginal and unused farmland becomes a productive, cost-saving energy asset." },
        ]}
        edge={[
          { label: "Flexible Financing Solutions",desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time, or buy cheaper solar under a zero-capex PPA." },
          { label: "Single Energy Partner",       desc: "One provider for electricity and water — solar and batteries for maximum savings." },
          { label: "Lifecycle O&M & Guarantee",  desc: "Remote monitoring, maintenance and performance guarantees for 25+ years." },
          { label: "Egypt's Solar Pioneer",       desc: "Operating multiple solar farms and water desalination projects across Egypt." },
        ]}
        photo={P.solar}
      />
    ),
  },
  // 14 — Solar: Timeline
  {
    title: "Solar: Timeline",
    render: () => (
      <AgriTimelineSlide
        sectionLabel="2 · Solar: Implementation Timeline"
        title="Solar: Implementation Timeline"
        color="#d97706"
        icon={<SunMedium className="w-5 h-5" />}
        phases={[
          { day: "Day 0–21",   label: "Site & Energy Study",  desc: "Irradiation, pivot load & land survey." },
          { day: "Day 21–55",  label: "System Design",        desc: "Array sizing & genset/battery-tie design." },
          { day: "Day 40–75",  label: "PPA Structuring",      desc: "BOO/BOOT & tariff agreement." },
          { day: "Day 75–130", label: "Procurement",          desc: "Panels, inverters & mounting sourcing." },
          { day: "Day 130–210",label: "Install & Commission", desc: "Build, tie-in, testing & go-live." },
          { day: "Day 210+",   label: "O&M",                  desc: "Monitoring & performance maintenance." },
        ]}
        groups={[
          { label: "STUDY & DESIGN", range: "Day 0–55",   color: "#B45309" },
          { label: "FINANCE & BUILD",range: "Day 40–210",  color: "#d97706" },
          { label: "OPERATE",        range: "Day 210+",    color: "#92400E" },
        ]}
        photo={P.solar}
      />
    ),
  },
  // 15 — Solar: Track Record
  {
    title: "Solar: Track Record",
    render: () => (
      <AgriTrackRecordSlide
        sectionLabel="2 · Solar: Proven Track Record"
        title="Solar: Proven Track Record"
        subheadline="Powering one of Egypt's largest farms with renewable energy"
        body="TAQA Arabia operates renewable-energy projects at Dina Farms — one of Egypt's largest integrated agricultural operations — alongside its landmark Benban solar developments. It is direct proof that TAQA can deploy and run solar at true agricultural scale, powering irrigation and farm operations with clean energy."
        color="#d97706"
        icon={<SunMedium className="w-5 h-5" />}
        stats={[
          { value: "Dina Farms", label: "Live agricultural solar project" },
          { value: "Benban",     label: "Landmark solar development" },
          { value: "BOO/BOOT",   label: "PPA models, no farm capex" },
          { value: "~1,000 t",   label: "CO₂ avoided/MWp/yr" },
        ]}
        photo={P.dina}
      />
    ),
  },
  // 16 — Battery: Scope
  {
    title: "Battery Storage: Scope",
    render: () => (
      <AgriScopeSlide
        sectionLabel="3 · Battery Storage (BESS): Scope & How It Works"
        title="Battery storage that shifts solar into the night"
        subtitle="Firms the power stack — so irrigation never stops"
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the service — little to no upfront CapEx."
        color="#7B35C2"
        icon={<Battery className="w-4 h-4" />}
        taqaInvests={[
          "Battery energy-storage units",
          "Power-conversion system & inverters",
          "Switchgear & grid/solar interface",
          "EMS & SCADA controls",
          "BOO/BOOT financing",
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
        photo={P.battery}
      />
    ),
  },
  // 17 — Battery: Value
  {
    title: "Battery Storage: Value Proposition",
    render: () => (
      <AgriValueSlide
        sectionLabel="3 · Battery Storage: Value Proposition"
        title="Battery Storage: Value Proposition"
        color="#7B35C2"
        icon={<Battery className="w-5 h-5" />}
        gains={[
          { label: "Solar After Sunset",    desc: "Stores daytime solar surplus and dispatches it to run pivots into the evening and early morning." },
          { label: "Less Diesel, Lower Cost",desc: "Battery dispatch displaces costly diesel-genset hours, cutting fuel spend and engine wear." },
          { label: "Greener Every Year",    desc: "More stored solar dispatched means less diesel and a steadily smaller carbon footprint." },
          { label: "A Stacked Asset",       desc: "One system delivers solar-shifting, peak support and backup — value across multiple uses." },
        ]}
        edge={[
          { label: "Flexible Financing Solutions",desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time." },
          { label: "Single Energy Partner",       desc: "One provider for solar, storage and water — maximum savings and utilisation." },
          { label: "Lifecycle O&M & Guarantee",  desc: "Remote monitoring, maintenance and performance guarantees 25+ years." },
          { label: "Smart Energy Management",    desc: "EMS automatically optimises charge/discharge against loads, solar and fuel cost." },
        ]}
        photo={P.battery}
      />
    ),
  },
  // 18 — Battery: Timeline
  {
    title: "Battery Storage: Timeline",
    render: () => (
      <AgriTimelineSlide
        sectionLabel="3 · Battery Storage: Implementation Timeline"
        title="Battery Storage: Implementation Timeline"
        color="#7B35C2"
        icon={<Battery className="w-5 h-5" />}
        phases={[
          { day: "Day 0–21",   label: "Load & Solar Study", desc: "Farm load profile and solar surplus assessment." },
          { day: "Day 21–55",  label: "System Design",      desc: "BESS sizing & hybrid configuration." },
          { day: "Day 40–75",  label: "Commercial Model",   desc: "BOO/BOOT & savings agreement." },
          { day: "Day 75–140", label: "Procurement",        desc: "Batteries, PCS & EMS sourcing." },
          { day: "Day 140–220",label: "Install & Commission",desc: "Build, integration, testing & go-live." },
          { day: "Day 220+",   label: "Smart O&M",          desc: "EMS monitoring & performance maintenance." },
        ]}
        groups={[
          { label: "STUDY & DESIGN", range: "Day 0–55",   color: "#6B21A8" },
          { label: "FINANCE & BUILD",range: "Day 40–220",  color: "#7B35C2" },
          { label: "SMART OPERATE",  range: "Day 220+",    color: "#581C87" },
        ]}
        photo={P.battery}
      />
    ),
  },
  // 19 — Battery: Track Record
  {
    title: "Battery Storage: Track Record",
    render: () => (
      <AgriTrackRecordSlide
        sectionLabel="3 · Battery Storage: Proven Track Record"
        title="Battery Storage: Proven Track Record"
        subheadline="Turning intermittent solar into round-the-clock farm power"
        body="As Egypt's largest private power player, TAQA Arabia pairs Battery Energy Storage with its solar and distribution assets. Storage lets farms shift solar into the evening, shave peaks and secure supply — the natural next step in TAQA's integrated energy model."
        color="#7B35C2"
        icon={<Battery className="w-5 h-5" />}
        stats={[
          { value: "Peak shaving",   label: "Cuts costly demand charges" },
          { value: "Solar firming",  label: "Day-to-night energy shift" },
          { value: "BOO/BOOT",       label: "No client capex" },
          { value: "24/7 EMS",       label: "Monitoring & O&M" },
        ]}
        photo={P.battery}
      />
    ),
  },
  // 20 — CNG: Scope
  {
    title: "Mobile CNG: Scope",
    render: () => (
      <AgriScopeSlide
        sectionLabel="4 · Mobile CNG: Scope & How It Works"
        title="Portable natural gas to fuel farm gas-gensets"
        subtitle="A cleaner, cheaper alternative to diesel where there is no pipeline"
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the gas you use — little to no upfront CapEx."
        color="#E68A00"
        icon={<Truck className="w-4 h-4" />}
        taqaInvests={[
          "Mother station & compression",
          "CNG/virtual-pipeline trailers",
          "On-site decompression & PRMS skid",
          "Metering & safety controls",
          "BOO/BOOT financing",
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
        photo={P.cng}
      />
    ),
  },
  // 21 — CNG: Value
  {
    title: "Mobile CNG: Value Proposition",
    render: () => (
      <AgriValueSlide
        sectionLabel="4 · Mobile CNG: Value Proposition"
        title="Mobile CNG: Value Proposition"
        color="#E68A00"
        icon={<Truck className="w-5 h-5" />}
        gains={[
          { label: "Off-Grid Gas Supply",   desc: "Reliable natural gas to remote farms with no pipeline access, by mobile virtual pipeline." },
          { label: "Cost Savings vs. Diesel",desc: "≈40% lower fuel cost than diesel — a major cut to the farm's biggest running expense." },
          { label: "Cleaner Operations",    desc: "~24% lower CO₂ than diesel helps the farm meet tightening emissions and export requirements." },
          { label: "99.5% Uptime SLA",      desc: "SCADA-monitored hot-swap replenishment guarantees uninterrupted gas for the gensets." },
        ]}
        edge={[
          { label: "Master Gas Scale & Network",  desc: "TAQA's Master Gas runs Egypt's leading CNG virtual pipeline with stations across Egypt." },
          { label: "Flexible Financing Solutions",desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time." },
          { label: "Scalable to Any Load",        desc: "Starter (500 Nm³/day) to Heavy (5,000+ Nm³/day) — scales with the farm's gas demand." },
          { label: "Lifecycle O&M & Guarantee",  desc: "Remote monitoring, maintenance and performance guarantees." },
        ]}
        photo={P.cng}
      />
    ),
  },
  // 22 — CNG: Timeline
  {
    title: "Mobile CNG: Timeline",
    render: () => (
      <AgriTimelineSlide
        sectionLabel="4 · Mobile CNG: Implementation Timeline"
        title="Mobile CNG: Implementation Timeline"
        color="#E68A00"
        icon={<Truck className="w-5 h-5" />}
        phases={[
          { day: "Day 0",       label: "Discovery",      desc: "Initial farm assessment and gas demand evaluation." },
          { day: "Day 1–3",     label: "Initial Contact",desc: "TAQA commercial team engagement and requirements scoping." },
          { day: "Day 4–7",     label: "Site Audit",     desc: "Technical site visit and consumption profiling." },
          { day: "Day 8–14",    label: "Contract",       desc: "Commercial terms and supply agreement finalisation." },
          { day: "Day 15–30",   label: "Mobilization",   desc: "Equipment preparation and trailer scheduling." },
          { day: "Day 90–120",  label: "On-Site Install",desc: "PRMS skid, metering and safety systems installed." },
          { day: "Day 120–200", label: "Live Gas",       desc: "First gas delivered; metered supply commences." },
        ]}
        groups={[
          { label: "DISCOVERY & AUDIT",   range: "Day 0–14",    color: "#B86000" },
          { label: "CONTRACTING",         range: "Day 8–14",     color: "#E68A00" },
          { label: "DEPLOYMENT & GO-LIVE",range: "Day 90–200",   color: "#8B5000" },
        ]}
        photo={P.cng}
      />
    ),
  },
  // 23 — CNG: Track Record
  {
    title: "Mobile CNG: Track Record",
    render: () => (
      <AgriTrackRecordSlide
        sectionLabel="4 · Mobile CNG: Proven Track Record"
        title="Mobile CNG: Proven Track Record"
        subheadline="Virtual Pipeline — 4 Governorates. First company in Egypt to supply natural gas through a mobile virtual pipeline."
        body="TAQA Arabia pioneered mobile CNG in Egypt, using its network of 86 CNG stations to extend a virtual pipeline into four governorates with no fixed gas infrastructure. The same model brings clean, lower-cost gas to off-grid farms and agribusiness — fueling gensets that would otherwise burn diesel."
        color="#E68A00"
        icon={<Truck className="w-5 h-5" />}
        stats={[
          { value: "86",      label: "CNG stations feeding the virtual pipeline" },
          { value: "4",       label: "Governorates served off-grid" },
          { value: "+2,350",  label: "mmscf CNG delivered/year" },
          { value: "+10",     label: "Active mobile-CNG clients" },
        ]}
        photo={P.cng}
      />
    ),
  },
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
