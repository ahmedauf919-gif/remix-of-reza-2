import { DeckShell } from "./DeckShell";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import {
  Flame, Zap, Truck, Droplets, Battery, Globe, CheckCircle2, ArrowRight,
  Star, Sun, Layers, MapPin,
} from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";

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

// ─── Design-system primitives — "Forged Steel" ───────────────────────────────

/** Lighter companion tone for each section color (gradient endpoints). */
const LIGHTER: Record<string, string> = {
  "#c2410c": "#fb923c",
  "#1d4ed8": "#60a5fa",
  "#059669": "#34d399",
  "#b45309": "#fbbf24",
  "#ca8a04": "#facc15",
  "#7c3aed": "#a78bfa",
  "#002060": "#60a5fa",
};
const lighter = (c: string) => LIGHTER[c] ?? "#f59e0b";

/** Entrance animation keyframes — remounted with every slide, so they replay. */
function InxStyles() {
  return (
    <style>{`
      @keyframes inx-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes inx-in { from { opacity: 0; } to { opacity: 1; } }
      .inx-up { animation: inx-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
      .inx-in { animation: inx-in 0.5s ease both; }
      @media (prefers-reduced-motion: reduce) {
        .inx-up, .inx-in { animation: none; }
      }
    `}</style>
  );
}

/** Stagger-delay helper. */
const d = (ms: number) => ({ animationDelay: `${ms}ms` });

const hideImg = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

/** Subtle blueprint grid overlay. */
function BlueprintGrid({ light = false }: { light?: boolean }) {
  const c = light ? "rgba(0,32,96,0.035)" : "rgba(255,255,255,0.04)";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          `repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px 48px),` +
          `repeating-linear-gradient(90deg, ${c} 0 1px, transparent 1px 48px)`,
      }}
    />
  );
}

/** Kicker chip — colored dot + uppercase label. */
function Kicker({ color, dark = false, children }: { color: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 font-display text-[14px] font-semibold uppercase tracking-[0.22em] ${
        dark
          ? "bg-white/10 text-white/90 ring-1 ring-white/15 backdrop-blur-md"
          : "bg-white text-slate-600 ring-1 ring-black/10 shadow-sm"
      }`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dark ? lighter(color) : color }} />
      {children}
    </span>
  );
}

/** Soft section-color wash for a corner of light slides. */
function CornerWash({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-28 -top-28 h-[440px] w-[440px] rounded-full"
      style={{ background: `radial-gradient(circle, ${color}12, transparent 65%)` }}
    />
  );
}

/** Oversized ghost numeral watermark for solution content slides. */
function GhostNum({ n }: { n: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-10 right-2 select-none font-display text-[210px] font-bold leading-none text-[#002060] opacity-[0.045]"
    >
      {String(n).padStart(2, "0")}
    </div>
  );
}

/** Angular corner bracket accent for cards. */
function Bracket({ color, pos = "tl" }: { color: string; pos?: "tl" | "br" }) {
  const cls = pos === "tl" ? "left-3 top-3 border-l-2 border-t-2" : "bottom-3 right-3 border-b-2 border-r-2";
  return <span aria-hidden className={`pointer-events-none absolute h-4 w-4 ${cls}`} style={{ borderColor: `${color}55` }} />;
}

/** Full-height photo rail on the left of every solution slide. */
function SolutionRail({
  num, label, kicker, color, photo, alt,
}: { num: number; label: string; kicker: string; color: string; photo: string; alt: string }) {
  return (
    <div
      className="relative h-full w-[300px] shrink-0 overflow-hidden"
      style={{ background: `linear-gradient(165deg, ${color} 0%, #1c1917 60%, #0c0a09 100%)` }}
    >
      <img
        src={photo}
        alt={alt}
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${color}8c 0%, rgba(12,10,9,0.35) 42%, rgba(12,10,9,0.94) 100%)` }}
      />
      <BlueprintGrid />
      <Bracket color={lighter(color)} pos="br" />
      <div className="relative z-10 flex h-full flex-col justify-between p-7">
        <span className="inx-up inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20 backdrop-blur-md" style={d(0)}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: lighter(color) }} />
          <span className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/90">
            Solution {String(num).padStart(2, "0")}
          </span>
        </span>
        <div>
          <div className="inx-in select-none font-display text-[118px] font-bold leading-none text-white/10" style={d(100)}>
            {String(num).padStart(2, "0")}
          </div>
          <div
            className="inx-up mt-2 h-[3px] w-12 rounded-full"
            style={{ ...d(140), background: `linear-gradient(90deg, ${lighter(color)}, #f59e0b)` }}
          />
          <h3 className="inx-up mt-3 font-display text-[26px] font-bold leading-tight tracking-tight text-white" style={d(180)}>
            {label}
          </h3>
          <p className="inx-up mt-2 font-display text-[14px] font-semibold uppercase tracking-[0.2em] text-white/70" style={d(230)}>
            {kicker}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Small uppercase column heading with a 3px accent bar. */
function ColHead({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="font-display text-[14px] font-bold uppercase tracking-[0.2em] text-slate-500">{children}</p>
      <div className="mt-1.5 h-[3px] w-8 rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${lighter(color)})` }} />
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "intro",       label: "Introduction",   color: "#c2410c", slides: [0, 1, 2, 3] },
  { id: "overview",    label: "Solutions",       color: "#c2410c", slides: [4] },
  { id: "cng",         label: "Mobile CNG",      color: "#c2410c", slides: [5, 6, 7, 8] },
  { id: "electricity", label: "Electricity",     color: "#1d4ed8", slides: [9, 10, 11, 12] },
  { id: "gas",         label: "Gas",             color: "#059669", slides: [13, 14, 15, 16] },
  { id: "chp",         label: "CHP",             color: "#b45309", slides: [17, 18, 19, 20] },
  { id: "solar",       label: "Solar",           color: "#ca8a04", slides: [21, 22, 23, 24] },
  { id: "bess",        label: "Energy Storage",  color: "#7c3aed", slides: [25, 26, 27, 28] },
  { id: "closing",     label: "Closing",         color: "#002060", slides: [29, 30, 31] },
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
      <InxStyles />
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
        <div className="inx-up flex items-center justify-between" style={d(0)}>
          <img src={taqaLogo} alt="TAQA Arabia logo" className="h-12 rounded-lg bg-white/95 px-3 py-1.5 object-contain shadow-lg" />
          <Kicker color="#c2410c" dark>TAQA Arabia · Client Presentation</Kicker>
        </div>

        <div className="flex-1" />

        {/* Title block */}
        <div>
          <div
            className="inx-up h-[3px] w-16 rounded-full"
            style={{ ...d(80), background: "linear-gradient(90deg, #c2410c, #f59e0b)" }}
          />
          <h1 className="inx-up mt-6 font-display text-[76px] font-bold leading-[1.02] tracking-tight text-white" style={d(140)}>
            Industrial
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #fb923c 0%, #f59e0b 55%, #fbbf24 100%)" }}
            >
              Clients
            </span>
          </h1>
          <p className="inx-up mt-5 text-[19px] text-white/85" style={d(220)}>
            Integrated Energy &amp; Utility Solutions · Jan 2026
          </p>
        </div>

        {/* Solution chips */}
        <div className="mt-9 flex flex-wrap gap-2.5">
          {SOLUTION_CHIPS.map((c, i) => (
            <span
              key={c.s}
              className="inx-up inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[15px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-md"
              style={d(300 + i * 55)}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: lighter(c.c) }} />
              {c.s}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="inx-in mt-8 flex items-center justify-between border-t border-white/10 pt-5" style={d(500)}>
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
      <InxStyles />
      <CornerWash color="#c2410c" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full gap-10 p-14">
        {/* Left — narrative */}
        <div className="flex w-[530px] shrink-0 flex-col">
          <div className="inx-up" style={d(0)}>
            <Kicker color="#c2410c">TAQA Arabia · Who We Are</Kicker>
          </div>
          <h2 className="inx-up mt-5 font-display text-[30px] font-bold leading-[1.15] tracking-tight text-[#002060]" style={d(60)}>
            Egypt's leading integrated energy infrastructure developer — a true one-stop-shop for industrial utilities
          </h2>
          <div
            className="inx-up mt-4 h-[3px] w-14 rounded-full"
            style={{ ...d(110), background: "linear-gradient(90deg, #c2410c, #f59e0b)" }}
          />
          <p className="inx-up mt-5 text-[17px] leading-relaxed text-slate-600" style={d(160)}>
            Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility
            developer. Across four divisions — Gas, Power, Petroleum and Water — TAQA finances, builds, owns and operates the
            utility backbone of industrial zones and touristic destinations. For an industrial developer, that means one
            accredited partner with a proven delivery record can supply gas, power, water and steam under a single relationship.
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {["Active member of the International Gas Union (IGU)", "Accredited by the IGEM"].map((b, i) => (
              <span
                key={b}
                className="inx-up rounded-full bg-[#c2410c]/10 px-3.5 py-1.5 text-[14px] font-semibold text-[#9a3412] ring-1 ring-[#c2410c]/15"
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
            className="inx-up relative h-[178px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-md"
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
              className="inx-up relative flex items-center gap-3.5 rounded-2xl bg-white p-3.5 ring-1 ring-black/5 shadow-sm"
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
    { value: "8",      label: "Countries",           sub: "Egypt, GCC, Africa & Greece", hero: true },
    { value: "4",      label: "Operating divisions", sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates",        sub: "Across Egypt" },
    { value: "3,400+", label: "Employees",           sub: "Across all divisions" },
  ];
  const intl = [
    { region: "GCC",    desc: "Partnered with Al Ghaneim & WETICO for sovereign water-desalination projects." },
    { region: "Africa", desc: "Pursuing gas and power opportunities across sub-Saharan markets." },
    { region: "Greece", desc: "Expanding into European energy infrastructure." },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <InxStyles />
      <CornerWash color="#c2410c" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="inx-up" style={d(0)}>
          <Kicker color="#c2410c">TAQA Arabia · Regional Presence</Kicker>
        </div>
        <h2 className="inx-up mt-4 font-display text-[34px] font-bold leading-tight tracking-tight text-[#002060]" style={d(60)}>
          A growing platform across Egypt, the GCC, Africa and Greece
        </h2>

        {/* Bento metrics */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`inx-up relative overflow-hidden rounded-2xl p-5 ${
                m.hero ? "text-white shadow-lg" : "bg-white ring-1 ring-black/5 shadow-sm"
              }`}
              style={{
                ...d(120 + i * 60),
                ...(m.hero ? { background: "linear-gradient(140deg, #002060 0%, #0a2f7a 100%)" } : {}),
              }}
            >
              {m.hero && <BlueprintGrid />}
              <div
                className="relative font-display text-[44px] font-bold leading-none tracking-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: m.hero
                    ? "linear-gradient(100deg, #ffffff, #fbbf24)"
                    : "linear-gradient(100deg, #c2410c, #fb923c)",
                }}
              >
                {m.value}
              </div>
              <div className={`relative mt-2 text-[16px] font-semibold ${m.hero ? "text-white" : "text-[#002060]"}`}>{m.label}</div>
              <div className={`relative mt-0.5 text-[14px] ${m.hero ? "text-white/70" : "text-slate-500"}`}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Two feature cards */}
        <div className="mt-4 grid min-h-0 flex-1 grid-cols-2 gap-4">
          <div className="inx-up relative overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm" style={d(380)}>
            <Bracket color="#c2410c" pos="tl" />
            <div className="mb-3 flex items-center gap-2.5 pl-3">
              <Globe className="h-4.5 w-4.5 h-[18px] w-[18px] text-[#c2410c]" />
              <h3 className="font-display text-[17px] font-bold tracking-tight text-[#002060]">International Expansion</h3>
            </div>
            <div className="space-y-2.5 pl-3">
              {intl.map(x => (
                <div key={x.region} className="flex items-start gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: "#c2410c" }} />
                  <p className="text-[16px] leading-snug text-slate-600">
                    <span className="font-semibold text-[#002060]">{x.region}</span> — {x.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="inx-up relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
            style={{ ...d(440), background: "linear-gradient(140deg, #002060 0%, #0a2f7a 100%)" }}
          >
            <BlueprintGrid />
            <div className="relative mb-2 flex items-center gap-2.5">
              <MapPin className="h-[18px] w-[18px] text-[#FFC10E]" />
              <h3 className="font-display text-[17px] font-bold tracking-tight text-[#FFC10E]">Geographic Footprint</h3>
            </div>
            <p className="relative text-[16px] leading-snug text-white/85">
              Concessions in 8 Egyptian governorates renewed for 15 years. TAQA serves the full spectrum:
            </p>
            <div className="relative mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {["Industrial zones & factories", "Free zones & logistics parks", "Touristic destinations & resorts", "Commercial & mixed-use developments"].map(i => (
                <div key={i} className="flex items-start gap-2 text-[15px] font-medium text-white/90">
                  <CheckCircle2 className="mt-[1px] h-4 w-4 shrink-0 text-[#FFC10E]" />
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 3: In Numbers ──────────────────────────────────────────────────────

function NumbersSlide() {
  const heroStats = [
    { value: "EGP 13.4bn", label: "Revenue",       sub: "FY 2025", hero: true },
    { value: "EGP 1.5bn",  label: "EBITDA",        sub: "FY 2025" },
    { value: "~6.5M",      label: "Gas customers", sub: "Active connections" },
  ];
  const divCards = [
    { div: "GAS",            icon: <Flame className="h-4 w-4" />,    color: "#c2410c", stat: "+10,000 km, 8 governorates (15yr)" },
    { div: "POWER",          icon: <Zap className="h-4 w-4" />,      color: "#1d4ed8", stat: "+1,600 MVA, +150 MW" },
    { div: "WATER",          icon: <Droplets className="h-4 w-4" />, color: "#0369a1", stat: "+47,000 m³/day, 15 locations" },
    { div: "MOBILITY & CNG", icon: <Truck className="h-4 w-4" />,    color: "#7c3aed", stat: "86 stations, 1st private EV licence" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <InxStyles />
      <CornerWash color="#c2410c" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="inx-up" style={d(0)}>
          <Kicker color="#c2410c">TAQA Arabia · In Numbers</Kicker>
        </div>
        <h2 className="inx-up mt-4 font-display text-[34px] font-bold leading-tight tracking-tight text-[#002060]" style={d(60)}>
          The scale behind a single integrated energy partner — FY 2025
        </h2>

        {/* Hero bento */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {heroStats.map((m, i) => (
            <div
              key={m.label}
              className={`inx-up relative overflow-hidden rounded-2xl p-6 ${
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
              className="inx-up relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm"
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
              <p className="mt-auto pt-3 text-[16px] font-medium leading-snug text-slate-600">{c.stat}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 4: Solutions Overview ──────────────────────────────────────────────

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
      <InxStyles />
      <CornerWash color="#c2410c" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="inx-up" style={d(0)}>
              <Kicker color="#c2410c">Industrial Clients · Solutions Overview</Kicker>
            </div>
            <h2 className="inx-up mt-4 font-display text-[40px] font-bold leading-none tracking-tight text-[#002060]" style={d(60)}>
              Six integrated solutions
            </h2>
          </div>
          <p className="inx-up max-w-[420px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
            The following slides detail every solution TAQA Arabia offers to industrial sites, factories and parks.
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-4">
          {solutions.map((s, i) => (
            <div
              key={s.num}
              className="inx-up group relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-[0_10px_30px_-16px_rgba(0,32,96,0.25)]"
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

// ─── Reusable: ScopeSlide ────────────────────────────────────────────────────

interface ScopeProps {
  solutionNum: number;
  solutionLabel: string;
  subtitle: string;
  tagline?: string;
  color: string;
  icon: React.ReactNode;
  photo: string;
  taqaInvests: string[];
  steps: string[];
  whatYouReceive: string[];
}

function ScopeSlide({ solutionNum, solutionLabel, subtitle, tagline, color, icon, photo, taqaInvests, steps, whatYouReceive }: ScopeProps) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <InxStyles />
      <SolutionRail
        num={solutionNum}
        label={solutionLabel}
        kicker="Scope & How It Works"
        color={color}
        photo={photo}
        alt={`${solutionLabel} infrastructure operated by TAQA Arabia`}
      />

      <div className="relative flex min-w-0 flex-1 flex-col p-12">
        <GhostNum n={solutionNum} />
        <CornerWash color={color} />

        {/* Header */}
        <div className="relative z-10 flex items-start gap-4">
          <div
            className="inx-up mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{ ...d(60), background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="inx-up font-display text-[24px] font-bold leading-snug tracking-tight text-[#002060]" style={d(100)}>
              {subtitle}
            </h2>
            {tagline && (
              <p className="inx-up mt-1.5 text-[16px] italic leading-snug text-slate-500" style={d(150)}>
                {tagline}
              </p>
            )}
          </div>
        </div>

        {/* Three columns */}
        <div className="relative z-10 mt-6 grid min-h-0 flex-1 grid-cols-3 gap-4">
          {/* TAQA Invests */}
          <div className="inx-up relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm" style={d(200)}>
            <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, ${lighter(color)})` }} />
            <ColHead color={color}>TAQA Invests</ColHead>
            <div className="space-y-2.5">
              {taqaInvests.map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: color }} />
                  <span className="text-[16px] leading-snug text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works — numbered flow with connecting line */}
          <div className="inx-up relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm" style={d(260)}>
            <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, ${lighter(color)})` }} />
            <ColHead color={color}>How It Works</ColHead>
            <div className="relative">
              <span aria-hidden className="absolute bottom-3 left-[11px] top-2 w-px" style={{ background: `${color}30` }} />
              {steps.map((s, i) => (
                <div key={i} className="relative mb-2.5 flex items-start gap-3 last:mb-0">
                  <div
                    className="relative z-10 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white shadow"
                    style={{ background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
                  >
                    {i + 1}
                  </div>
                  <span className="pt-0.5 text-[16px] leading-snug text-slate-600">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What You Receive — dark navy */}
          <div
            className="inx-up relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
            style={{ ...d(320), background: "linear-gradient(150deg, #002060 0%, #0a2f7a 100%)" }}
          >
            <BlueprintGrid />
            <Bracket color="#FFC10E" pos="br" />
            <div className="relative">
              <p className="font-display text-[14px] font-bold uppercase tracking-[0.2em] text-[#FFC10E]">What You Receive</p>
              <div className="mt-1.5 h-[3px] w-8 rounded-full" style={{ background: "linear-gradient(90deg, #FFC10E, #fb923c)" }} />
              <div className="mt-4 space-y-3">
                {whatYouReceive.map(r => (
                  <div key={r} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC10E]" />
                    <span className="text-[16px] leading-snug text-white/90">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable: ValuePropSlide ────────────────────────────────────────────────

interface ValueItem { label: string; desc: string; }
interface ValueProps {
  solutionNum: number;
  solutionLabel: string;
  color: string;
  icon: React.ReactNode;
  photo: string;
  whatYouGain: ValueItem[];
  taqaEdge: ValueItem[];
}

function ValuePropSlide({ solutionNum, solutionLabel, color, icon, photo, whatYouGain, taqaEdge }: ValueProps) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <InxStyles />
      <SolutionRail
        num={solutionNum}
        label={solutionLabel}
        kicker="Value Proposition"
        color={color}
        photo={photo}
        alt={`${solutionLabel} infrastructure operated by TAQA Arabia`}
      />

      <div className="relative flex min-w-0 flex-1 flex-col p-12">
        <GhostNum n={solutionNum} />
        <CornerWash color={color} />

        <div className="relative z-10 flex items-center gap-4">
          <div
            className="inx-up flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{ ...d(60), background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
          >
            {icon}
          </div>
          <h2 className="inx-up font-display text-[26px] font-bold leading-tight tracking-tight text-[#002060]" style={d(100)}>
            What TAQA Arabia delivers for your site
          </h2>
        </div>

        <div className="relative z-10 mt-5 grid min-h-0 flex-1 grid-cols-2 gap-5">
          {/* What You Gain */}
          <div className="flex min-h-0 flex-col">
            <div className="inx-up" style={d(160)}>
              <ColHead color={color}>What You Gain</ColHead>
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-2.5">
              {whatYouGain.map((v, i) => (
                <div
                  key={v.label}
                  className="inx-up flex flex-1 items-start gap-3 rounded-xl bg-white p-3.5 ring-1 ring-black/5 shadow-sm"
                  style={d(200 + i * 60)}
                >
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${color}14`, color }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[17px] font-bold leading-tight text-[#002060]">{v.label}</div>
                    <div className="mt-1 text-[16px] leading-[1.4] text-slate-600">{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TAQA Arabia Edge */}
          <div className="flex min-h-0 flex-col">
            <div className="inx-up" style={d(220)}>
              <ColHead color="#002060">TAQA Arabia Edge</ColHead>
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-2.5">
              {taqaEdge.map((v, i) => (
                <div
                  key={v.label}
                  className="inx-up relative flex flex-1 items-start gap-3 overflow-hidden rounded-xl p-3.5 shadow-md"
                  style={{ ...d(260 + i * 60), background: "linear-gradient(140deg, #002060 0%, #0a2f7a 100%)" }}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFC10E] ring-1 ring-white/10">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[17px] font-bold leading-tight text-[#FFC10E]">{v.label}</div>
                    <div className="mt-1 text-[16px] leading-[1.4] text-white/80">{v.desc}</div>
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

// ─── Reusable: TimelineSlide ─────────────────────────────────────────────────

interface Phase { days: string; label: string; }
interface Group { label: string; range: string; }
interface TimelineProps {
  solutionNum: number;
  solutionLabel: string;
  color: string;
  icon: React.ReactNode;
  photo: string;
  phases: Phase[];
  groups: Group[];
}

function TimelineSlide({ solutionNum, solutionLabel, color, icon, photo, phases, groups }: TimelineProps) {
  const tint = ["14", "1f", "2b"];
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <InxStyles />
      <SolutionRail
        num={solutionNum}
        label={solutionLabel}
        kicker="Implementation Timeline"
        color={color}
        photo={photo}
        alt={`${solutionLabel} infrastructure operated by TAQA Arabia`}
      />

      <div className="relative flex min-w-0 flex-1 flex-col p-12">
        <GhostNum n={solutionNum} />
        <CornerWash color={color} />

        <div className="relative z-10 flex items-center gap-4">
          <div
            className="inx-up flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{ ...d(60), background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
          >
            {icon}
          </div>
          <h2 className="inx-up font-display text-[26px] font-bold leading-tight tracking-tight text-[#002060]" style={d(100)}>
            From first contact to live supply
          </h2>
        </div>

        <div className="relative z-10 mt-6 grid min-h-0 flex-1 grid-cols-[1fr_330px] gap-8">
          {/* Numbered phase flow with connecting line */}
          <div className="relative flex min-h-0 flex-col justify-between">
            <span aria-hidden className="absolute bottom-4 left-[14px] top-3 w-px" style={{ background: `${color}30` }} />
            {phases.map((p, i) => (
              <div key={i} className="inx-up relative flex items-center gap-4 py-1" style={d(160 + i * 55)}>
                <div
                  className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white shadow"
                  style={{ background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
                >
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[14px] font-bold uppercase tracking-[0.18em]" style={{ color }}>{p.days}</div>
                  <div className="text-[17px] font-semibold leading-snug text-[#002060]">{p.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Milestone groups */}
          <div className="flex min-h-0 flex-col">
            <div className="inx-up" style={d(220)}>
              <ColHead color={color}>Milestone Groups</ColHead>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              {groups.map((g, i) => (
                <div
                  key={i}
                  className="inx-up relative overflow-hidden rounded-2xl p-4 ring-1"
                  style={{
                    ...d(280 + i * 70),
                    background: `${color}${tint[i] ?? "1f"}`,
                    borderColor: `${color}30`,
                    // @ts-expect-error -- CSS var for ring color via style not needed; ring uses default
                    "--tw-ring-color": `${color}2e`,
                  }}
                >
                  <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full" style={{ background: color }} />
                  <div className="pl-2.5">
                    <div className="font-display text-[17px] font-bold tracking-tight text-[#002060]">{g.label}</div>
                    <div className="mt-0.5 font-display text-[15px] font-bold uppercase tracking-[0.14em]" style={{ color }}>{g.range}</div>
                  </div>
                </div>
              ))}
              <div
                className="inx-up relative mt-auto overflow-hidden rounded-2xl p-4 shadow-md"
                style={{ ...d(500), background: "linear-gradient(140deg, #002060 0%, #0a2f7a 100%)" }}
              >
                <p className="text-[15px] leading-snug text-white/80">
                  Timelines are indicative and subject to site conditions, regulatory approvals and customer readiness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable: TrackRecordSlide — dark "moment" slide ────────────────────────

interface TrackStat { value: string; label: string; }
interface TrackProps {
  solutionNum: number;
  solutionLabel: string;
  heading: string;
  subheading: string;
  body: string;
  color: string;
  icon: React.ReactNode;
  photo: string;
  stats: TrackStat[];
}

const statSize = (v: string) => (v.length > 8 ? "text-[24px]" : v.length > 5 ? "text-[32px]" : "text-[44px]");

function TrackRecordSlide({ solutionNum, solutionLabel, heading, subheading, body, color, icon, photo, stats }: TrackProps) {
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0c0a09 0%, #1c1917 55%, #292524 100%)" }}
    >
      <InxStyles />
      <img
        src={photo}
        alt={`${solutionLabel} infrastructure operated by TAQA Arabia`}
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(115deg, rgba(12,10,9,0.95) 0%, rgba(28,25,23,0.85) 52%, ${color}59 100%)` }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-40 h-[560px] w-[560px] rounded-full"
        style={{ background: `radial-gradient(circle, ${color}30, transparent 65%)` }}
      />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="inx-up flex items-center gap-3" style={d(0)}>
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

        <h2 className="inx-up mt-5 max-w-[1080px] font-display text-[38px] font-bold leading-[1.1] tracking-tight text-white" style={d(80)}>
          {heading}
        </h2>
        <div className="inx-up mt-3 flex items-start gap-2.5" style={d(140)}>
          <Star className="mt-0.5 h-5 w-5 shrink-0" style={{ color: lighter(color), fill: lighter(color) }} />
          <p className="max-w-[1020px] text-[17px] font-medium leading-snug text-white/90">{subheading}</p>
        </div>

        <div className="mt-7 grid min-h-0 flex-1 grid-cols-[1fr_420px] gap-6">
          {/* Body — glass narrative card */}
          <div className="inx-up relative overflow-hidden rounded-2xl bg-white/[0.07] p-7 ring-1 ring-white/15 backdrop-blur-md" style={d(220)}>
            <Bracket color={lighter(color)} pos="tl" />
            <p className="pl-3 text-[16px] leading-relaxed text-white/90">{body}</p>
            <div
              className="absolute bottom-6 left-10 h-[3px] w-14 rounded-full"
              style={{ background: `linear-gradient(90deg, ${lighter(color)}, #f59e0b)` }}
            />
          </div>

          {/* Glass stat bento */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="inx-up flex flex-col justify-center rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md"
                style={d(280 + i * 70)}
              >
                <div
                  className={`font-display font-bold leading-[1.05] tracking-tight bg-clip-text text-transparent ${statSize(s.value)}`}
                  style={{ backgroundImage: `linear-gradient(105deg, #ffffff 0%, ${lighter(color)} 100%)` }}
                >
                  {s.value}
                </div>
                <div className="mt-1.5 text-[15px] leading-snug text-white/75">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 29: Why One Partner ────────────────────────────────────────────────

function WhyOnePartnerSlide() {
  const benefits = [
    { label: "One SLA",                     desc: "A single service-level agreement governs gas, power, CHP, solar and storage — one uptime guarantee, one renewal." },
    { label: "One Communication Point",     desc: "A single account team and 24/7 hotline for every utility — no chasing multiple contractors." },
    { label: "One Commercial Relationship", desc: "Consolidated billing, aligned contract terms and a single negotiation." },
    { label: "One Engineering Standard",    desc: "Utilities designed to interoperate from day one — shared infrastructure, metering and monitoring." },
    { label: "One Accountable Owner",       desc: "End-to-end responsibility removes interface risk and finger-pointing between specialised vendors." },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <InxStyles />
      <CornerWash color="#002060" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="inx-up" style={d(0)}>
              <Kicker color="#002060">Why One Partner</Kicker>
            </div>
            <h2 className="inx-up mt-4 font-display text-[38px] font-bold leading-none tracking-tight text-[#002060]" style={d(60)}>
              The TAQA One-Stop-Shop
            </h2>
          </div>
          <p className="inx-up max-w-[430px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
            One SLA, one communication point, one accountable operator — across every utility on the site
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-5">
          {/* All-solutions dark card */}
          <div
            className="inx-up relative flex flex-col overflow-hidden rounded-2xl p-6 shadow-xl"
            style={{ ...d(180), background: "linear-gradient(145deg, #002060 0%, #0a2f7a 70%, #123c94 100%)" }}
          >
            <BlueprintGrid />
            <Bracket color="#FFC10E" pos="br" />
            <h3 className="relative font-display text-[18px] font-bold tracking-tight text-[#FFC10E]">TAQA Arabia — All Solutions</h3>
            <div className="relative mt-4 grid grid-cols-2 gap-2.5">
              {SOLUTION_CHIPS.map((s, i) => (
                <div
                  key={s.s}
                  className="inx-up flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-3 ring-1 ring-white/10"
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
                className="inx-up relative flex flex-1 items-start gap-3 rounded-xl bg-white p-3 pl-4 ring-1 ring-black/5 shadow-sm"
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

// ─── Slide 30: Bundle ─────────────────────────────────────────────────────────

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
      <InxStyles />
      <CornerWash color="#002060" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="inx-up" style={d(0)}>
              <Kicker color="#002060">The Power of the Bundle</Kicker>
            </div>
            <h2 className="inx-up mt-4 font-display text-[38px] font-bold leading-none tracking-tight text-[#002060]" style={d(60)}>
              Cross-Solution Benefits
            </h2>
          </div>
          <p className="inx-up max-w-[440px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
            How combining the solutions under one SLA creates value no single vendor can match
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-4">
          {bundles.map((b, i) => (
            <div
              key={b.combo}
              className="inx-up relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-[0_10px_30px_-16px_rgba(0,32,96,0.25)]"
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
          className="inx-up relative mt-4 overflow-hidden rounded-2xl px-7 py-4 text-center shadow-lg"
          style={{ ...d(520), background: "linear-gradient(120deg, #002060 0%, #0a2f7a 100%)" }}
        >
          <BlueprintGrid />
          <p className="relative text-[16px] leading-snug text-white/85">
            <span className="font-bold text-[#FFC10E]">Sold as one SLA:</span>{" "}
            lower combined energy cost · shared infrastructure · one billing &amp; monitoring platform · stronger ESG / decarbonisation story · single accountable operator.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 31: Success Story — dark closing moment ───────────────────────────

function SuccessStorySlide() {
  const combined = [
    { s: "Mobile CNG",               c: "#c2410c" },
    { s: "Electricity Distribution", c: "#1d4ed8" },
    { s: "Gas Distribution",         c: "#059669" },
    { s: "CHP",                      c: "#b45309" },
    { s: "Solar PV",                 c: "#ca8a04" },
    { s: "Energy Storage (BESS)",    c: "#7c3aed" },
  ];
  const stats = [
    { value: "6 solutions", label: "on one site" },
    { value: "1 SLA",       label: "one bill" },
    { value: "Lower",       label: "combined energy cost" },
    { value: "24/7",        label: "monitoring & O&M" },
  ];
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0c0a09 0%, #1c1917 55%, #292524 100%)" }}
    >
      <InxStyles />
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
        <div className="inx-up" style={d(0)}>
          <Kicker color="#f59e0b" dark>Success Story</Kicker>
        </div>
        <h2 className="inx-up mt-4 font-display text-[42px] font-bold leading-none tracking-tight text-white" style={d(70)}>
          Integrated{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(95deg, #fb923c, #fbbf24)" }}
          >
            Industrial Energy
          </span>
        </h2>
        <p className="inx-up mt-2.5 text-[17px] text-white/80" style={d(130)}>
          A single industrial client running on multiple TAQA solutions — the one-stop-shop, proven.
        </p>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-[1fr_430px] gap-6">
          {/* Narrative glass card */}
          <div className="inx-up relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.07] p-7 ring-1 ring-white/15 backdrop-blur-md" style={d(190)}>
            <Bracket color="#f59e0b" pos="tl" />
            <div className="flex items-center gap-2.5 pl-3">
              <Star className="h-5 w-5 shrink-0 text-[#fbbf24]" style={{ fill: "#fbbf24" }} />
              <h3 className="font-display text-[17px] font-bold tracking-tight text-white">
                One site. Multiple TAQA solutions. One accountable operator.
              </h3>
            </div>
            <p className="mt-3 pl-3 text-[17px] leading-relaxed text-white/85">
              Across Egypt's industrial zones, TAQA Arabia serves as the complete energy backbone for manufacturing sites,
              factories and free zones. One site, multiple TAQA solutions, one accountable operator — delivering gas, power,
              CHP, solar and storage under a single SLA, eliminating interface risk, cutting energy costs and supporting the
              site's decarbonisation targets.
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
            <div className="inx-up rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md" style={d(260)}>
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
                  className="inx-up flex flex-col justify-center rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md"
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

// ─── SLIDES Array (32 slides, 0-indexed) ─────────────────────────────────────

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
  { title: "Solutions Overview", render: () => <SolutionsOverviewSlide /> },

  // ── Mobile CNG ──────────────────────────────────────────────────────────────
  // 5
  {
    title: "Mobile CNG: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon} photo={P.cng}
        subtitle="Portable natural-gas supply delivering cost savings, flexibility and energy security for off-grid industrial sites."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the gas you consume — little to no upfront CapEx."
        taqaInvests={["Mother station & compression", "CNG/virtual-pipeline trailers", "On-site decompression & PRMS skid", "Industrial metering & controls", "BOO/BOOT financing"]}
        steps={[
          "Gas is compressed at a TAQA mother station to ~250 bar.",
          "Trailers deliver it to your plant as a virtual pipeline.",
          "On-site skids decompress and regulate to process pressure.",
          "Metered gas feeds boilers, furnaces and process lines.",
          "TAQA tracks usage and refills ahead of demand.",
        ]}
        whatYouReceive={["Pipeline-grade gas without a pipeline", "Continuous feed for industrial processes", "Managed supply and refills"]}
      />
    ),
  },
  // 6
  {
    title: "Mobile CNG: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon} photo={P.cng}
        whatYouGain={[
          { label: "Off-Grid Gas Supply",           desc: "Reliable natural gas to the factory without pipeline access." },
          { label: "Cost Savings vs. Diesel & LPG", desc: "≈40% lower fuel cost than diesel; replaces LPG and electric heating." },
          { label: "Cleaner Emissions",             desc: "Cuts CO₂ by ~24% vs. diesel and lowers NOx & particulates — supports ESG." },
          { label: "99.5% Uptime SLA",              desc: "SCADA-monitored hot-swap replenishment guarantees uninterrupted supply to every factory." },
        ]}
        taqaEdge={[
          { label: "Flexible Delivery Approach",          desc: "BOO/BOOT or EPC via Capacity-as-a-Service — no upfront infrastructure cost." },
          { label: "Nationwide Logistics Via Master Gas", desc: "A dedicated trailer fleet keeps refills on schedule across governorates." },
          { label: "Scalable to Any Load",                desc: "Starter (500 Nm³/day) to Heavy (5,000+ Nm³/day) — scales with occupancy." },
          { label: "Reliability & Smart O&M",             desc: "24/7 predictive maintenance and rapid-response teams." },
        ]}
      />
    ),
  },
  // 7
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
  // 8
  {
    title: "Mobile CNG: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon} photo={P.cng}
        heading="Virtual Pipeline — 4 Governorates"
        subheading="First company in Egypt to supply natural gas through a mobile virtual pipeline"
        body="TAQA Arabia pioneered mobile CNG in Egypt, using its network of 86 CNG stations to extend a virtual pipeline into four governorates with no fixed gas infrastructure. The model now serves ceramics, glass, food-processing and other industrial clients — proving off-grid factories can run on clean natural gas years before the pipeline arrives."
        stats={[
          { value: "86",     label: "CNG stations feeding the virtual pipeline" },
          { value: "4",      label: "Governorates served off-grid" },
          { value: "+2,350", label: "mmscf CNG delivered per year" },
          { value: "+10",    label: "Active mobile-CNG clients" },
        ]}
      />
    ),
  },

  // ── Electricity Distribution ─────────────────────────────────────────────────
  // 9
  {
    title: "Electricity Distribution: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        subtitle="Turnkey distribution networks for industrial sites and parks — from power sourcing and design through licensed lifetime O&M."
        taqaInvests={["HV/MV substations & switchgear", "Distribution transformers", "Cabling, protection & metering", "SCADA & control room", "BOO/BOOT financing"]}
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
  // 10
  {
    title: "Electricity Distribution: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        whatYouGain={[
          { label: "Potential New Revenue Stream", desc: "The profit-share model turns the distribution network from a cost center into recurring income." },
          { label: "Lower Factory Bills",          desc: "Demand-side management and tariff optimization reduce consumption and end-user charges." },
          { label: "Guaranteed Power Quality",     desc: "Stable, metered, billable electricity to every unit from handover." },
          { label: "Future-Ready Network",         desc: "Designed for solar, storage and EV loads from day one." },
        ]}
        taqaEdge={[
          { label: "Flexible Delivery Approach", desc: "Take it as EPC build, licensed O&M, or a profit-share — TAQA flexes from substation to metering." },
          { label: "Faster Time-to-Handover",    desc: "Integrated teams for power sourcing, engineering and construction cut the critical path." },
          { label: "Deep Industrial Experience", desc: "Designed and operated 450+ MVA across industrial zones." },
          { label: "24/7 Control Room",          desc: "Dedicated SCADA, predictive maintenance and rapid-response O&M." },
        ]}
      />
    ),
  },
  // 11
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
  // 12
  {
    title: "Electricity Distribution: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        heading="Powering industrial zones across Egypt"
        subheading="Egypt's largest private power infrastructure operator"
        body="TAQA Power designs, builds and operates licensed electrical distribution networks for industrial zones, free zones and mixed-use developments across Egypt, with +450 MVA distributed across zones. As Egypt's largest private power infrastructure operator, TAQA brings the same turnkey discipline — from grid interconnection to smart metering — to any industrial site."
        stats={[
          { value: "+450 MVA", label: "distributed across industrial zones" },
          { value: "26",       label: "licensed distribution concessions" },
          { value: "+12,000",  label: "customers served" },
          { value: "24/7",     label: "SCADA monitoring" },
        ]}
      />
    ),
  },

  // ── Gas Distribution ─────────────────────────────────────────────────────────
  // 13
  {
    title: "Gas Distribution: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
        subtitle="End-to-end EPC for natural-gas distribution networks across industrial sites, parks and free zones."
        taqaInvests={["City-gate & PRMS stations", "Steel distribution mains", "Factory service lines", "Industrial meters & regulators", "BOO/BOOT financing"]}
        steps={[
          "TAQA secures the concession and designs the gas grid.",
          "Mains and service lines are laid across the zone.",
          "Pressure is regulated to each factory's process requirement.",
          "Industrial meters commission and bill per consumption.",
          "TAQA operates, inspects and maintains the network.",
        ]}
        whatYouReceive={["A licensed industrial gas network", "Safe, metered gas to every factory", "Lifetime operation and emergency response"]}
      />
    ),
  },
  // 14
  {
    title: "Gas Distribution: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
        whatYouGain={[
          { label: "Diesel & LPG Fuel-Switching",          desc: "Manage the full transition from diesel and LPG to cleaner, cheaper natural gas." },
          { label: "Flexible Gas Sourcing — M-CNG or SNG", desc: "Where no fixed pipeline exists yet, gas is supplied via M-CNG or SNG — no factory waits." },
          { label: "Lower Factory Bills",                  desc: "Subsidized piped natural gas is far cheaper than LPG cylinders or electric heating." },
          { label: "Higher Asset Value",                   desc: "Connection to the national gas grid lifts site value and tenancy." },
        ]}
        taqaEdge={[
          { label: "Flexible Commercial Models",    desc: "Delivered as EPC, long-term O&M or BOO." },
          { label: "External & Internal Networks",  desc: "TAQA builds the external distribution backbone and the internal factory network." },
          { label: "One Partner Across All Phases", desc: "Single accountable party from feasibility to handover." },
          { label: "Standards Compliance",          desc: "Aligned with IGEM, EGAS and international gas-safety standards." },
        ]}
      />
    ),
  },
  // 15
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
  // 16
  {
    title: "Gas Distribution: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
        heading="Egypt's largest private gas distribution network — built, owned and operated by TAQA"
        subheading="+10,000 km of distribution mains across 8 governorates with 15-year renewable concessions"
        body="TAQA Gas operates one of Egypt's largest private piped-gas networks: +10,000 km of distribution mains across 8 governorates with 15-year renewable concessions. As the holder of 66% of Egypt's private gas concessions, TAQA brings the same proven engineering and O&M platform to industrial zones, free zones and large-scale industrial developments."
        stats={[
          { value: "+10,000 km", label: "network" },
          { value: "8",          label: "governorate concessions (15yr)" },
          { value: "66%",        label: "private concession share" },
          { value: "~6.5M",      label: "customers served" },
        ]}
      />
    ),
  },

  // ── CHP ──────────────────────────────────────────────────────────────────────
  // 17
  {
    title: "CHP: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={4} solutionLabel="CHP" color="#b45309" icon={chpIcon} photo={P.chp}
        subtitle="Combined Heat & Power — capturing waste heat to deliver electricity plus thermal energy from a single fuel input."
        taqaInvests={["Gas engine/turbine genset", "Waste-heat recovery unit", "Absorption chiller (tri-gen)", "Grid sync, controls & SCADA", "BOO/BOOT plant financing"]}
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
  // 18
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
          { label: "Flexible Commercial Models",    desc: "Delivered as EPC, long-term O&M or BOO." },
          { label: "Integrated Gas + CHP Solution", desc: "TAQA can supply both the natural gas and the CHP plant — one provider for fuel and energy." },
          { label: "Guaranteed Performance",        desc: "Performance SLA backed by 24/7 monitoring and rapid response." },
          { label: "Deep Cogeneration Experience",  desc: "6 captive power plants and +150 MW contracted generation including flare-to-power and CHP systems." },
        ]}
      />
    ),
  },
  // 19
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
          { label: "AUDIT & DESIGN",           range: "Day 0–60" },
          { label: "FINANCE, PROCURE & BUILD", range: "Day 45–270" },
          { label: "OPERATE",                  range: "Day 270+" },
        ]}
      />
    ),
  },
  // 20
  {
    title: "CHP: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={4} solutionLabel="CHP" color="#b45309" icon={chpIcon} photo={P.chp}
        heading="Captive Power & Cogeneration"
        subheading="Owning and operating high-efficiency captive generation"
        body="TAQA Power owns and operates 6 captive power plants and +150 MW of contracted generation through long-term agreements, including flare-to-power and combined-heat-and-power systems. The same engineering, fuel-logistics and 24/7 O&M discipline underpins TAQA's CHP offering for industrial clients."
        stats={[
          { value: "6",       label: "Captive power plants operated" },
          { value: "+150 MW", label: "contracted generation" },
          { value: "CHP",     label: "Flare-to-power & CHP experience" },
          { value: "24/7",    label: "O&M and SCADA" },
        ]}
      />
    ),
  },

  // ── Solar ─────────────────────────────────────────────────────────────────────
  // 21
  {
    title: "Solar: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={5} solutionLabel="Solar" color="#ca8a04" icon={solarIcon} photo={P.solar}
        subtitle="Tailored solar PV solutions delivering measurable value across financing, sustainability and operations."
        taqaInvests={["Rooftop & ground-mount PV", "Inverters & transformers", "Connection & net-metering works", "Monitoring & SCADA", "BOO/BOOT financing"]}
        steps={[
          "TAQA assesses roof, land and the factory's energy profile.",
          "Arrays are sized and designed for optimal yield.",
          "Panels are installed; grid tie-in and metering completed.",
          "Solar generation offsets grid purchases at zero marginal cost.",
          "TAQA monitors output and guarantees performance for 25+ years.",
        ]}
        whatYouReceive={["Lowest-cost energy from day one", "Net metering and grid tie-in", "Zero-capex PPA option", "25-year performance guarantee"]}
      />
    ),
  },
  // 22
  {
    title: "Solar: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={5} solutionLabel="Solar PV" color="#ca8a04" icon={solarIcon} photo={P.solar}
        whatYouGain={[
          { label: "Lower Energy Bills",       desc: "Solar's cost per kWh sits well below the grid tariff — factories save from day one." },
          { label: "Tariff-Hike Hedge",        desc: "Lock in clean-energy cost for decades and insulate the factory from grid-price escalation." },
          { label: "Higher Property Value",    desc: "Solar-equipped, lower-running-cost sites command a premium." },
          { label: "Green Living Credentials", desc: "Visible clean energy strengthens ESG and sustainability story." },
        ]}
        taqaEdge={[
          { label: "Egypt's Solar Pioneer",      desc: "TAQA was the first national company to commercially operate a plot at the Benban solar park." },
          { label: "Flexible Models",            desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time, or buy cheaper solar under a zero-capex PPA." },
          { label: "Turnkey Engineering",        desc: "Survey, design, supply, installation and grid tie-in delivered end-to-end." },
          { label: "Lifecycle O&M & Guarantee", desc: "Remote monitoring, maintenance and performance guarantees for 25+ years." },
        ]}
      />
    ),
  },
  // 23
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
  // 24
  {
    title: "Solar: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={5} solutionLabel="Solar" color="#ca8a04" icon={solarIcon} photo={P.solar}
        heading="Solar Development & Investment"
        subheading="Developing and investing in tailored solar across Egypt"
        body="TAQA Arabia develops, finances and operates solar PV assets under tailored PPA agreements, integrating solar with its power-distribution and storage offering. As the first national company to commercially operate at the Benban solar park, TAQA brings utility-scale solar expertise to industrial rooftops and ground mounts. 65 MW solar plant in Benban, Upper Egypt (est. 2019)."
        stats={[
          { value: "65 MW",    label: "Benban solar plant" },
          { value: "1st",      label: "to operate at Benban" },
          { value: "BOO/BOOT", label: "& PPA models" },
          { value: "25+ yr",   label: "performance guarantee" },
        ]}
      />
    ),
  },

  // ── Energy Storage (BESS) ─────────────────────────────────────────────────────
  // 25
  {
    title: "Energy Storage (BESS): Scope",
    render: () => (
      <ScopeSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon} photo={P.battery}
        subtitle="Battery Energy Storage Systems — storing clean power to cut peak charges, firm up solar and secure supply."
        taqaInvests={["Battery energy-storage units", "Power-conversion system & inverters", "Switchgear & grid interface", "EMS & SCADA controls", "BOO/BOOT financing"]}
        steps={[
          "TAQA sizes storage to the factory's peak profile and solar surplus.",
          "Batteries charge during off-peak or peak-solar hours.",
          "Stored energy dispatches during peak demand — shaving the most expensive part of the bill.",
          "EMS optimises charge/discharge against tariff and solar signals.",
          "TAQA monitors and guarantees performance.",
        ]}
        whatYouReceive={["Peak-demand charge reduction", "Solar firming through the evening", "Backup supply on grid failure", "EMS-optimised dispatch"]}
      />
    ),
  },
  // 26
  {
    title: "Energy Storage (BESS): Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon} photo={P.battery}
        whatYouGain={[
          { label: "Peak-Demand Savings",      desc: "Discharge stored energy during peak hours to slash demand charges and tariff exposure." },
          { label: "Uninterrupted Production", desc: "Instant-response backup protects critical lines and avoids costly downtime during outages." },
          { label: "Grid Services Revenue",    desc: "Frequency regulation and load balancing can create new value streams." },
          { label: "Future-Proof & Green",     desc: "Enables deeper renewable integration and supports the factory's carbon-reduction targets." },
        ]}
        taqaEdge={[
          { label: "Flexible Financing",      desc: "CAPEX, BOOT/BOO — choose the structure that fits the balance sheet." },
          { label: "Integrated Solar + BESS", desc: "Pair storage with TAQA's solar PV for round-the-clock clean power." },
          { label: "Smart EMS",               desc: "AI-driven charge/discharge optimisation against loads, tariffs and solar signals." },
          { label: "Proven Operator",         desc: "Same 24/7 O&M discipline applied across TAQA's generation, distribution and solar assets." },
        ]}
      />
    ),
  },
  // 27
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
  // 28
  {
    title: "Energy Storage (BESS): Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon} photo={P.battery}
        heading="Solar-Plus-Storage Integration"
        subheading="Integrating storage with solar and distribution for round-the-clock clean power"
        body="As Egypt's largest private power player, TAQA Arabia pairs Battery Energy Storage with its solar and distribution assets to deliver dispatchable, lower-carbon energy. Storage lets industrial clients shift solar into the evening, shave peaks and secure supply — the natural next step in TAQA's integrated energy model."
        stats={[
          { value: "Peak shaving",  label: "cuts costly demand charges" },
          { value: "Solar firming", label: "day-to-night energy shift" },
          { value: "BOO/BOOT",      label: "no client capex" },
          { value: "24/7",          label: "EMS monitoring & O&M" },
        ]}
      />
    ),
  },

  // ── Closing ───────────────────────────────────────────────────────────────────
  // 29
  { title: "Why One Partner", render: () => <WhyOnePartnerSlide /> },
  // 30
  { title: "Cross-Solution Benefits", render: () => <BundleSlide /> },
  // 31
  { title: "Success Story: Integrated Industrial Energy", render: () => <SuccessStorySlide /> },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function IndustrialClients() {
  return (
    <DeckShell
      title="Industrial Clients"
      subtitle="TAQA Arabia · Integrated Industrial Energy Solutions · Jun 2026"
      sections={SECTIONS}
      slides={SLIDES}
      pdf="industrial-clients.pdf"
    />
  );
}
