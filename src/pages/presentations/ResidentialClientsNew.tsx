import React from "react";
import { DeckShell } from "./DeckShell";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import { Flame, Zap, Droplets, Truck, Battery, Car, Sun, Globe, CheckCircle2, ArrowRight, Star, MapPin } from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";

// ─── Photos ───────────────────────────────────────────────────────────────────

const P: Record<string, string> = {
  cover:       MEDIA + "res-resort.jpg",
  buildings:   MEDIA + "res-resort-power.jpg",
  cng:         MEDIA + "res-cng-chain.jpg",
  electricity: MEDIA + "res-power-home.jpg",
  water:       MEDIA + "res-water-chain.jpg",
  pipeline:    MEDIA + "res-gas-home.jpg",
  generator:   MEDIA + "res-fuel-storage.jpg",
  ev:          MEDIA + "res-ev-golf.jpg",
  solar:       MEDIA + "res-solar-team.jpg",
  resort:      MEDIA + "res-resort.jpg",
  city:        MEDIA + "wind-grid.jpg",
};

const ALT: Record<string, string> = {
  [P.cover]:       "Modern glass residential towers at dusk",
  [P.buildings]:   "Contemporary residential compound architecture",
  [P.cng]:         "Modern homes served by off-grid mobile CNG supply",
  [P.electricity]: "Illuminated residential district powered at night",
  [P.water]:       "Clean water flowing from treated supply",
  [P.pipeline]:    "Gas pipeline infrastructure crossing the landscape at sunset",
  [P.generator]:   "Industrial back-up power generation equipment",
  [P.ev]:          "Electric vehicle connected to a residential charger",
  [P.solar]:       "Rooftop solar photovoltaic panels under a clear sky",
  [P.resort]:      "Red Sea resort coastline at Soma Bay",
  [P.city]:        "City skyline of a growing metropolitan region",
};

const altFor = (src: string) => ALT[src] ?? "Residential development photograph";

// ─── Design primitives ────────────────────────────────────────────────────────

const NAVY = "#002060";
const GOLD = "#FFC10E";

/** Entrance keyframes — transform/opacity only, replayed on slide remount. */
function Fx() {
  return (
    <style>{`
      @keyframes rnx-up { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
      @keyframes rnx-in { from { opacity:0; } to { opacity:1; } }
      @keyframes rnx-left { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
      .rnx-up { animation: rnx-up .5s cubic-bezier(.22,1,.36,1) both; }
      .rnx-in { animation: rnx-in .7s ease-out both; }
      .rnx-left { animation: rnx-left .5s cubic-bezier(.22,1,.36,1) both; }
      @media (prefers-reduced-motion: reduce) {
        .rnx-up, .rnx-in, .rnx-left { animation: none; }
      }
    `}</style>
  );
}

/** Stagger helper — 70ms steps. */
const d = (i: number): React.CSSProperties => ({ animationDelay: `${i * 70}ms` });

/** Kicker chip: colored dot + uppercase label. */
function Kicker({ color, label, dark = false, className = "" }: { color: string; label: string; dark?: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 h-7 font-display text-[14px] font-semibold uppercase tracking-[0.22em] whitespace-nowrap ${
        dark ? "bg-white/10 text-white/90 ring-1 ring-white/15 backdrop-blur-md" : "bg-white text-slate-700 ring-1 ring-black/[0.08] shadow-sm"
      } ${className}`}
    >
      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
      {label}
    </span>
  );
}

/** Photo with deck-hue gradient backdrop + duotone overlay — never a white gap. */
function Photo({ src, className = "", overlay }: { src: string; className?: string; overlay?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: "linear-gradient(135deg,#1e1145,#0d0620)" }}>
      <img src={src} alt={altFor(src)} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div aria-hidden className="absolute inset-0" style={{ background: overlay ?? "linear-gradient(160deg, rgba(13,6,32,0.18), rgba(30,17,69,0.42))" }} />
    </div>
  );
}

/** Light content slide chrome: soft section wash + oversized ghost numeral. */
function LightSlide({ color, watermark, children }: { color: string; watermark?: string; children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden font-deck" style={{ background: "#fbfaff" }}>
      <Fx />
      <div aria-hidden className="absolute -top-44 -right-44 h-[600px] w-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${color}14, transparent 65%)` }} />
      <div aria-hidden className="absolute -bottom-52 -left-36 h-[520px] w-[520px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${color}0a, transparent 65%)` }} />
      {watermark && (
        <div aria-hidden className="absolute -top-14 right-10 font-display font-bold leading-none pointer-events-none select-none" style={{ fontSize: 240, color: `${color}0d`, letterSpacing: "-0.04em" }}>
          {watermark}
        </div>
      )}
      <div className="relative z-10 h-full w-full flex flex-col p-14">{children}</div>
    </div>
  );
}

/** Standard light-slide header: icon tile + kicker chip + display title (+ optional tagline). */
function SlideHeader({ color, kicker, title, icon, tagline, tight = false }: { color: string; kicker: string; title: string; icon?: React.ReactNode; tagline?: string; tight?: boolean }) {
  return (
    <header className={`shrink-0 ${tight ? "mb-5" : "mb-7"}`}>
      <div className="rnx-up flex items-center gap-3" style={d(0)}>
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md shrink-0" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 10px 24px -10px ${color}80` }}>
            {icon}
          </span>
        )}
        <Kicker color={color} label={kicker} />
      </div>
      <h2 className="rnx-up font-display text-[42px] font-bold tracking-tight leading-[1.04] mt-3" style={{ ...d(1), color: NAVY }}>
        {title}
      </h2>
      {tagline && (
        <p className="rnx-up text-[17px] text-slate-600 leading-snug mt-2 max-w-[880px]" style={d(2)}>{tagline}</p>
      )}
    </header>
  );
}

/** Small uppercase card heading. */
function CardLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] mb-3.5" style={{ color: color ?? "#64748b" }}>
      {children}
    </h3>
  );
}

const gradText = (color: string): React.CSSProperties => ({
  backgroundImage: `linear-gradient(95deg, ${color}, ${color}99)`,
});

// ─── Sections ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "intro",       label: "Introduction",       color: "#7c3aed", slides: [0,1,2,3] },
  { id: "overview",    label: "Solutions Overview",  color: "#7c3aed", slides: [4] },
  { id: "cng",         label: "Mobile CNG",          color: "#E68A00", slides: [5,6,7,8] },
  { id: "electricity", label: "Electricity",         color: "#d97706", slides: [9,10,11,12] },
  { id: "water",       label: "Water",               color: "#0095C8", slides: [13,14,15,16] },
  { id: "gas",         label: "Gas Distribution",    color: "#009045", slides: [17,18,19,20] },
  { id: "diesel",      label: "Diesel Rental",       color: "#6B6B6B", slides: [21,22,23,24] },
  { id: "ev",          label: "EV Chargers",         color: "#7c3aed", slides: [25,26,27,28] },
  { id: "solar",       label: "Solar PV",            color: "#16a34a", slides: [29,30,31,32] },
  { id: "closing",     label: "Closing",             color: "#002060", slides: [33,34,35] },
];

function sectionOf(idx: number) {
  return SECTIONS.find(s => s.slides.includes(idx)) ?? SECTIONS[0];
}

// ─── Cover ────────────────────────────────────────────────────────────────────

function CoverSlide() {
  const chips = [
    { icon: <Truck className="w-4 h-4" />,    label: "Mobile CNG" },
    { icon: <Zap className="w-4 h-4" />,      label: "Electricity" },
    { icon: <Droplets className="w-4 h-4" />, label: "Water" },
    { icon: <Flame className="w-4 h-4" />,    label: "Gas" },
    { icon: <Battery className="w-4 h-4" />,  label: "Diesel Back-up" },
    { icon: <Car className="w-4 h-4" />,      label: "EV Charging" },
    { icon: <Sun className="w-4 h-4" />,      label: "Solar PV" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden font-deck" style={{ background: "linear-gradient(135deg,#0d0620 0%,#1e1145 100%)" }}>
      <Fx />
      <img src={P.cover} alt={altFor(P.cover)} className="rnx-in absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.38, mixBlendMode: "luminosity" }} />
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(13,6,32,0.94) 0%, rgba(30,17,69,0.82) 45%, rgba(124,58,237,0.30) 100%)" }} />
      <div aria-hidden className="absolute -top-48 right-[-160px] h-[560px] w-[560px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.38), transparent 65%)" }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-56 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(13,6,32,0.9), transparent)" }} />

      <div className="relative z-10 h-full flex flex-col p-14 pb-10">
        <div className="rnx-up flex items-center justify-between" style={d(0)}>
          <img src={taqaLogo} alt="TAQA Arabia" className="h-12 object-contain bg-white/95 rounded-xl px-3.5 py-1.5 shadow-lg" />
          <Kicker dark color={GOLD} label="TAQA Arabia · Jan 2026" />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="rnx-up h-[3px] w-16 rounded-full mb-7" style={{ ...d(1), background: `linear-gradient(90deg, ${GOLD}, ${GOLD}33)` }} />
          <h1 className="rnx-up font-display text-[72px] font-bold tracking-tight leading-[0.98] text-white" style={d(2)}>
            Residential
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(95deg, ${GOLD}, #ffe08a)` }}>Customers</span>
          </h1>
          <p className="rnx-up text-white/85 text-[19px] mt-5" style={d(3)}>
            Integrated Energy &amp; Utility Solutions for Developers &amp; Communities
          </p>
          <div className="rnx-up mt-8 flex flex-wrap items-center gap-2" style={d(4)}>
            {chips.map(c => (
              <span key={c.label} className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/15 px-3.5 h-9 text-[15px] font-medium text-white/90">
                <span className="text-[#c4b5fd]">{c.icon}</span>
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="rnx-up flex items-center justify-between border-t border-white/10 pt-4" style={d(5)}>
          <p className="text-white/50 text-[14px] tracking-wide">TAQA Arabia · Confidential</p>
          <p className="text-white/50 text-[14px] tracking-wide">Seven solutions · One partner · One SLA</p>
        </div>
      </div>
    </div>
  );
}

// ─── Intro Slides ─────────────────────────────────────────────────────────────

function AboutSlide() {
  const divs: { label: string; icon: React.ReactNode; desc: string; color: string }[] = [
    { label: "Gas",       icon: <Flame className="w-4 h-4" />,    desc: "Distribution, EPC & virtual pipeline", color: "#E68A00" },
    { label: "Power",     icon: <Zap className="w-4 h-4" />,      desc: "MV/LV distribution, generation & solar", color: "#d97706" },
    { label: "Petroleum", icon: <Truck className="w-4 h-4" />,    desc: "Mobile CNG & fuel retail", color: "#7c3aed" },
    { label: "Water",     icon: <Droplets className="w-4 h-4" />, desc: "Desalination & treatment", color: "#0095C8" },
  ];
  return (
    <LightSlide color="#7c3aed">
      <SlideHeader
        color="#7c3aed"
        kicker="TAQA Arabia · Who We Are"
        title="Egypt's leading integrated energy infrastructure developer"
        tagline="A true one-stop-shop for residential utilities."
        tight
      />
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6">
        <div className="col-span-6 flex flex-col justify-center gap-4 text-[17px] text-slate-600 leading-relaxed pr-2">
          <p className="rnx-up" style={d(2)}>Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility developer.</p>
          <p className="rnx-up" style={d(3)}>Across four divisions — Gas, Power, Petroleum and Water — TAQA finances, builds, owns and operates the utility backbone of residential communities, industrial zones and touristic destinations.</p>
          <p className="rnx-up" style={d(4)}>
            For a residential developer, that means <strong className="font-semibold" style={{ color: NAVY }}>one accredited partner</strong> can deliver gas, electricity, water, back-up power and EV charging — under a single SLA, with one point of contact.
          </p>
        </div>
        <div className="col-span-6 flex flex-col gap-3 min-h-0">
          <Photo src={P.buildings} className="rnx-up rounded-2xl h-[118px] shrink-0 ring-1 ring-black/10" overlay="linear-gradient(160deg, rgba(124,58,237,0.24), rgba(13,6,32,0.45))" />
          {divs.map((v, i) => (
            <div key={v.label} className="rnx-up flex items-center gap-3.5 rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_10px_28px_-18px_rgba(2,6,23,0.35)] px-4 py-2.5" style={d(3 + i)}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0" style={{ background: `linear-gradient(135deg, ${v.color}, ${v.color}cc)` }}>{v.icon}</span>
              <div className="min-w-0">
                <div className="font-display font-bold text-[17px]" style={{ color: NAVY }}>{v.label}</div>
                <div className="text-[15px] text-slate-500 leading-snug">{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LightSlide>
  );
}

function RegionalSlide() {
  const metrics = [
    { value: "8",      label: "Countries",           sub: "Egypt, GCC, Africa & Greece" },
    { value: "4",      label: "Operating divisions",  sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates",        sub: "Across Egypt" },
    { value: "3,400+", label: "Employees",           sub: "Across all divisions" },
  ];
  const intl = [
    { region: "GCC",    desc: "Partnered for Sovereign water-desalination projects." },
    { region: "Africa", desc: "Pursuing gas and power opportunities across sub-Saharan markets." },
    { region: "Greece", desc: "Expanding into European energy infrastructure." },
  ];
  return (
    <LightSlide color="#7c3aed">
      <SlideHeader color="#7c3aed" kicker="TAQA Arabia · Regional Presence" title="A growing platform across Egypt, the GCC, Africa and Greece" tight />
      <div className="grid grid-cols-4 gap-4 mb-5 shrink-0">
        {metrics.map((m, i) => (
          <div key={m.label} className="rnx-up rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_30px_-18px_rgba(2,6,23,0.35)] p-4 relative overflow-hidden" style={d(2 + i)}>
            <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, #7c3aed, #c4b5fd)" }} />
            <div className="font-display text-[40px] font-bold tracking-tight leading-none bg-clip-text text-transparent" style={gradText("#7c3aed")}>{m.value}</div>
            <div className="font-semibold text-[16px] mt-1.5" style={{ color: NAVY }}>{m.label}</div>
            <div className="text-[14px] text-slate-500 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-5">
        <div className="rnx-up rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_30px_-18px_rgba(2,6,23,0.35)] p-5" style={d(5)}>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-[#7c3aed]" />
            <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-slate-500">International Expansion</h3>
          </div>
          <div className="space-y-3.5">
            {intl.map(r => (
              <div key={r.region} className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5f3ff] text-[#7c3aed] shrink-0"><MapPin className="w-4 h-4" /></span>
                <div>
                  <div className="font-display font-bold text-[17px]" style={{ color: NAVY }}>{r.region}</div>
                  <div className="text-[16px] text-slate-600 leading-snug">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rnx-up rounded-2xl p-5 text-white relative overflow-hidden" style={{ ...d(6), background: "linear-gradient(155deg, #002060 0%, #001034 100%)" }}>
          <div aria-hidden className="absolute -top-20 -right-20 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.35), transparent 65%)" }} />
          <h3 className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-[#FFC10E] mb-2.5 relative">Geographic Footprint</h3>
          <p className="text-[16px] text-white/85 leading-snug mb-3 relative">Concessions across Egypt with 15-year renewals. TAQA serves the full spectrum:</p>
          <div className="space-y-2.5 relative">
            {["Residential communities & compounds", "Industrial zones & factories", "Touristic destinations & resorts", "Commercial & mixed-use developments"].map(i => (
              <div key={i} className="flex items-center gap-2.5 text-[16px] text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#FFC10E] shrink-0" />{i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

function NumbersSlide() {
  const heroes = [
    { value: "EGP 13.4bn", label: "Revenue",                    sub: "FY 2025" },
    { value: "EGP 1.5bn",  label: "EBITDA",                     sub: "FY 2025" },
    { value: "~6.5M",      label: "Residential gas customers",  sub: "Active connections" },
  ];
  const divCards: { div: string; icon: React.ReactNode; stats: string[]; color: string }[] = [
    { div: "GAS",           icon: <Flame className="w-4 h-4" />,    stats: ["+10,000 km", "8 governorates 15yr"],   color: "#E68A00" },
    { div: "POWER",         icon: <Zap className="w-4 h-4" />,      stats: ["+1,600 MVA", "+150 MW"],               color: "#d97706" },
    { div: "WATER",         icon: <Droplets className="w-4 h-4" />, stats: ["+47,000 m³/day", "15 locations"],      color: "#0095C8" },
    { div: "MOBILITY & CNG", icon: <Truck className="w-4 h-4" />,   stats: ["86 CNG stations", "1st EV licence"],   color: "#7c3aed" },
  ];
  return (
    <LightSlide color="#7c3aed">
      <SlideHeader color="#7c3aed" kicker="TAQA Arabia · In Numbers" title="The scale behind a single residential utility partner" tagline="FY 2025 group performance across four operating divisions." tight />
      <div className="grid grid-cols-3 gap-4 mb-5 shrink-0">
        {heroes.map((m, i) => (
          <div key={m.label} className="rnx-up rounded-2xl p-5 text-white relative overflow-hidden ring-1 ring-black/10" style={{ ...d(2 + i), background: "linear-gradient(140deg, #2a1259 0%, #4c1d95 55%, #7c3aed 130%)" }}>
            <div aria-hidden className="absolute -top-16 -right-16 h-44 w-44 rounded-full" style={{ background: "radial-gradient(circle, rgba(196,181,253,0.35), transparent 65%)" }} />
            <div className="font-display text-[32px] font-bold tracking-tight leading-none bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(95deg, ${GOLD}, #ffe08a)` }}>{m.value}</div>
            <div className="text-[16px] font-semibold mt-2">{m.label}</div>
            <div className="text-[14px] text-white/70 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-4 gap-4">
        {divCards.map((v, i) => (
          <div key={v.div} className="rnx-up rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_30px_-18px_rgba(2,6,23,0.35)] p-4 relative overflow-hidden" style={d(5 + i)}>
            <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${v.color}, ${v.color}33)` }} />
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white shrink-0" style={{ background: `linear-gradient(135deg, ${v.color}, ${v.color}cc)` }}>{v.icon}</span>
              <span className="font-display font-bold text-[15px] tracking-wide" style={{ color: NAVY }}>{v.div}</span>
            </div>
            <div className="space-y-2">
              {v.stats.map(s => (
                <div key={s} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full shrink-0" style={{ background: v.color }} />
                  <span className="text-[16px] text-slate-600 leading-snug">{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LightSlide>
  );
}

function SolutionsOverviewSlide() {
  const solutions: { num: string; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { num: "01", label: "Mobile CNG",               desc: "Off-grid natural gas delivered via mobile virtual pipeline — zero infrastructure capex.", icon: <Truck className="w-5 h-5" />,    color: "#E68A00" },
    { num: "02", label: "Electricity Distribution", desc: "Turnkey MV/LV networks, smart metering and licensed lifetime O&M.",                       icon: <Zap className="w-5 h-5" />,      color: "#d97706" },
    { num: "03", label: "Water Desalination",       desc: "Reverse-osmosis plants and digitalized, solar-powered water operations.",                 icon: <Droplets className="w-5 h-5" />, color: "#0095C8" },
    { num: "04", label: "Gas Distribution",         desc: "End-to-end gas network EPC — design, build, commission and operate.",                     icon: <Flame className="w-5 h-5" />,    color: "#009045" },
    { num: "05", label: "Diesel Rental",            desc: "Emergency & back-up power gensets on a flexible rental/OPEX model.",                      icon: <Battery className="w-5 h-5" />,  color: "#6B6B6B" },
    { num: "06", label: "EV Chargers",              desc: "AC, DC and golf-car charging with full-investment green-mobility services.",              icon: <Car className="w-5 h-5" />,      color: "#7c3aed" },
    { num: "07", label: "Solar PV",                 desc: "Rooftop and common-area solar PV — cutting bills, with flexible ownership.",              icon: <Sun className="w-5 h-5" />,      color: "#16a34a" },
  ];
  return (
    <LightSlide color="#7c3aed" watermark="7">
      <SlideHeader color="#7c3aed" kicker="Residential Customers · Solutions Overview" title="Seven integrated solutions — one partner, one SLA" tight />
      <div className="flex-1 min-h-0 grid grid-cols-4 grid-rows-2 gap-4">
        {solutions.map((s, i) => (
          <div key={s.num} className="rnx-up rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_30px_-18px_rgba(2,6,23,0.35)] p-4 flex flex-col relative overflow-hidden" style={d(2 + i)}>
            <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}33)` }} />
            <div className="flex items-start justify-between mb-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)` }}>{s.icon}</span>
              <span className="font-display text-[40px] font-bold leading-none select-none" style={{ color: `${s.color}22` }}>{s.num}</span>
            </div>
            <h3 className="font-display font-bold text-[17px] leading-tight" style={{ color: NAVY }}>{s.label}</h3>
            <p className="text-[16px] text-slate-600 leading-snug mt-1.5">{s.desc}</p>
          </div>
        ))}
        <div className="rnx-up rounded-2xl p-4 flex flex-col justify-end text-white relative overflow-hidden" style={{ ...d(9), background: "linear-gradient(155deg, #002060 0%, #001034 100%)" }}>
          <div aria-hidden className="absolute -top-16 -right-16 h-48 w-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4), transparent 65%)" }} />
          <span className="font-display text-[64px] font-bold leading-none bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(95deg, ${GOLD}, #ffe08a)` }}>7→1</span>
          <p className="text-[16px] text-white/90 leading-snug mt-2 font-medium">Seven utilities delivered by one accountable partner, under one SLA.</p>
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Generic Slide Components ─────────────────────────────────────────────────

interface ScopeSlideProps {
  num: string;
  solutionName: string;
  color: string;
  icon: React.ReactNode;
  tagline?: string;
  taqdInvests: string[];
  steps: string[];
  whatYouReceive: string[];
  photo: string;
}

function ScopeSlide({ num, solutionName, color, icon, tagline, taqdInvests, steps, whatYouReceive, photo }: ScopeSlideProps) {
  return (
    <LightSlide color={color} watermark={`0${num}`}>
      <SlideHeader color={color} icon={icon} kicker={`Solution 0${num} · ${solutionName}`} title="Scope & How It Works" tagline={tagline} tight />
      <div className="flex-1 min-h-0 grid grid-cols-3 gap-5">
        {/* TAQA invests */}
        <section className="rnx-up rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_32px_-18px_rgba(2,6,23,0.35)] p-5 relative overflow-hidden" style={d(3)}>
          <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, ${color}33)` }} />
          <CardLabel color={color}>TAQA Invests</CardLabel>
          <ul className="space-y-2.5">
            {taqdInvests.map(item => (
              <li key={item} className="flex items-start gap-2.5 text-[16px] leading-snug text-slate-600">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full shrink-0" style={{ background: color }} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Numbered step flow with connecting line */}
        <section className="rnx-up rounded-2xl p-5 ring-1 ring-black/5 relative overflow-hidden" style={{ ...d(4), background: `linear-gradient(170deg, ${color}0f 0%, ${color}05 100%)` }}>
          <CardLabel color={color}>How It Works</CardLabel>
          <ol className="relative">
            <span aria-hidden className="absolute left-[13px] top-3 bottom-4 w-px" style={{ background: `linear-gradient(to bottom, ${color}59, ${color}14)` }} />
            {steps.map((step, i) => (
              <li key={i} className="relative flex items-start gap-3 pb-3.5 last:pb-0">
                <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-white font-display text-[14px] font-bold shrink-0" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>{i + 1}</span>
                <span className="text-[16px] leading-snug text-slate-600 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* What you receive — dark card with photo cap */}
        <section className="rnx-up rounded-2xl overflow-hidden ring-1 ring-black/10 text-white flex flex-col" style={{ ...d(5), background: "linear-gradient(160deg, #002060 0%, #001034 100%)" }}>
          <div className="relative h-[100px] shrink-0" style={{ background: "linear-gradient(135deg,#1e1145,#0d0620)" }}>
            <img src={photo} alt={altFor(photo)} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${color}26 0%, rgba(0,32,96,0) 35%, #002060 100%)` }} />
          </div>
          <div className="px-5 pt-3 pb-5 flex-1">
            <CardLabel color={GOLD}>What You Receive</CardLabel>
            <ul className="space-y-3">
              {whatYouReceive.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-[16px] leading-snug text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC10E] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </LightSlide>
  );
}

interface ValueItem { label: string; desc: string }

interface ValueSlideProps {
  num: string;
  solutionName: string;
  color: string;
  icon: React.ReactNode;
  whatYouGain: ValueItem[];
  taqaEdge: ValueItem[];
  photo: string;
}

function ValueSlide({ num, solutionName, color, icon, whatYouGain, taqaEdge, photo }: ValueSlideProps) {
  return (
    <LightSlide color={color} watermark={`0${num}`}>
      <SlideHeader color={color} icon={icon} kicker={`Solution 0${num} · ${solutionName}`} title="Value Proposition" tight />
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-5">
        {/* What you gain */}
        <section className="rnx-up rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_32px_-18px_rgba(2,6,23,0.35)] p-5 relative overflow-hidden" style={d(2)}>
          <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, ${color}33)` }} />
          <CardLabel color={color}>What You Gain</CardLabel>
          <div className="space-y-3.5">
            {whatYouGain.map((v, i) => (
              <div key={v.label} className="rnx-up flex items-start gap-3" style={d(3 + i)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ background: `${color}14`, color }}>
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-display font-bold text-[15.5px] leading-tight" style={{ color: NAVY }}>{v.label}</div>
                  <div className="text-[16px] text-slate-600 leading-snug mt-0.5">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TAQA edge — dark card with faint duotone photo */}
        <section className="rnx-up rounded-2xl p-5 text-white ring-1 ring-black/10 relative overflow-hidden" style={{ ...d(3), background: "linear-gradient(160deg, #002060 0%, #001034 100%)" }}>
          <img src={photo} alt={altFor(photo)} className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.14, mixBlendMode: "luminosity" }} loading="lazy" />
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(0,32,96,0.55), rgba(0,16,52,0.9))" }} />
          <div className="relative">
            <CardLabel color={GOLD}>TAQA Arabia Edge</CardLabel>
            <div className="space-y-3.5">
              {taqaEdge.map((v, i) => (
                <div key={v.label} className="rnx-up flex items-start gap-3" style={d(4 + i)}>
                  <span className="font-display text-[15px] font-bold text-[#FFC10E] w-7 shrink-0 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-[15.5px] leading-tight text-white">{v.label}</div>
                    <div className="text-[16px] text-white/85 leading-snug mt-0.5">{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </LightSlide>
  );
}

interface TimelinePhase { days: string; label: string }
interface TimelineGroup { label: string; range: string }

interface TimelineSlideProps {
  num: string;
  solutionName: string;
  color: string;
  icon: React.ReactNode;
  photo: string;
  phases: TimelinePhase[];
  groups: TimelineGroup[];
}

function TimelineSlide({ num, solutionName, color, icon, photo, phases, groups }: TimelineSlideProps) {
  return (
    <LightSlide color={color} watermark={`0${num}`}>
      <SlideHeader color={color} icon={icon} kicker={`Solution 0${num} · ${solutionName}`} title="Implementation Timeline" />
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Horizontal step flow with connecting line */}
        <div className="flex-1 flex items-center">
          <div className="w-full relative">
            <div aria-hidden className="absolute left-1 right-0 top-[9px] h-[3px] rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}1a)` }} />
            <div className="flex">
              {phases.map((p, i) => (
                <div key={i} className="rnx-up flex-1 min-w-0 pr-4 last:pr-0" style={d(2 + i)}>
                  <span className="relative z-10 block h-[21px] w-[21px] rounded-full bg-white shadow-sm" style={{ border: `6px solid ${color}` }} />
                  <div className="mt-3 font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-slate-500">{p.days}</div>
                  <div className="mt-1 text-[17px] font-semibold leading-snug" style={{ color: NAVY }}>{p.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery groups + photo */}
        <div className="shrink-0 grid grid-cols-4 gap-4 h-[168px]">
          <Photo src={photo} className="rnx-up rounded-2xl ring-1 ring-black/10" overlay={`linear-gradient(160deg, ${color}33, rgba(13,6,32,0.5))`} />
          {groups.map((g, i) => (
            <div key={i} className="rnx-up rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_30px_-18px_rgba(2,6,23,0.35)] p-4 flex flex-col justify-between relative overflow-hidden" style={d(4 + i)}>
              <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, ${color}33)` }} />
              <div className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-slate-400">Delivery group {String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className="font-display text-[26px] font-bold tracking-tight leading-none bg-clip-text text-transparent" style={gradText(color)}>{g.range}</div>
                <div className="mt-1.5 font-display font-bold text-[16px] tracking-wide" style={{ color: NAVY }}>{g.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LightSlide>
  );
}

interface StatBox { value: string; label: string }

interface TrackRecordSlideProps {
  num: string;
  solutionName: string;
  color: string;
  icon: React.ReactNode;
  photo: string;
  subheadline: string;
  body: string;
  stats: StatBox[];
}

function TrackRecordSlide({ num, solutionName, color, icon, photo, subheadline, body, stats }: TrackRecordSlideProps) {
  return (
    <LightSlide color={color} watermark={`0${num}`}>
      <SlideHeader color={color} icon={icon} kicker={`Solution 0${num} · ${solutionName}`} title="Proven Track Record" tight />
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-5">
        {/* Photo hero with overlaid story */}
        <figure className="rnx-up col-span-7 relative rounded-2xl overflow-hidden ring-1 ring-black/10" style={{ ...d(2), background: "linear-gradient(135deg,#1e1145,#0d0620)" }}>
          <img src={photo} alt={altFor(photo)} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(4,8,26,0.95) 0%, rgba(4,8,26,0.62) 55%, ${color}2e 100%)` }} />
          <figcaption className="absolute inset-x-0 bottom-0 p-6">
            <div className="flex items-start gap-2.5 mb-2.5">
              <Star className="w-5 h-5 shrink-0 mt-0.5" style={{ color: GOLD }} />
              <h3 className="font-display text-[19px] font-bold text-white leading-snug">{subheadline}</h3>
            </div>
            <p className="text-[14.5px] leading-relaxed text-white/90">{body}</p>
          </figcaption>
        </figure>

        {/* Bento stats — hero cell + supporting cells */}
        <div className="col-span-5 grid grid-cols-2 gap-4">
          <div className="rnx-up col-span-2 rounded-2xl p-5 text-white flex flex-col justify-center relative overflow-hidden ring-1 ring-black/10" style={{ ...d(3), background: `linear-gradient(135deg, ${color} 0%, #002060 130%)` }}>
            <div aria-hidden className="absolute -top-14 -right-14 h-44 w-44 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.22), transparent 65%)" }} />
            <div className="font-display text-[42px] font-bold tracking-tight leading-none">{stats[0]?.value}</div>
            <div className="text-[16px] text-white/90 mt-1.5 leading-snug">{stats[0]?.label}</div>
          </div>
          {stats.slice(1, 3).map((s, i) => (
            <div key={s.label} className="rnx-up rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_30px_-18px_rgba(2,6,23,0.35)] p-4 flex flex-col justify-center" style={d(4 + i)}>
              <div className="font-display text-[23px] font-bold tracking-tight leading-tight bg-clip-text text-transparent" style={gradText(color)}>{s.value}</div>
              <div className="text-[15px] text-slate-600 mt-1 leading-snug">{s.label}</div>
            </div>
          ))}
          {stats[3] && (
            <div className="rnx-up col-span-2 rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_30px_-18px_rgba(2,6,23,0.35)] p-4 flex items-center gap-4" style={d(6)}>
              <div className="font-display text-[28px] font-bold tracking-tight leading-none bg-clip-text text-transparent shrink-0" style={gradText(color)}>{stats[3].value}</div>
              <div className="text-[15px] text-slate-600 leading-snug">{stats[3].label}</div>
            </div>
          )}
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Closing Slides ───────────────────────────────────────────────────────────

function WhyOnePartnerSlide() {
  const solutions = ["Mobile CNG", "Electricity", "Water", "Gas", "Diesel Back-up", "EV Charging", "Solar PV"];
  const pillars = [
    { label: "One SLA",                     desc: "A single service-level agreement governs gas, power, water, back-up and EV — one uptime guarantee, one penalty regime, one renewal." },
    { label: "One Communication Point",     desc: "A single account team and 24/7 hotline for every utility." },
    { label: "One Commercial Relationship", desc: "Consolidated billing, aligned contract terms and a single negotiation instead of six separate cycles." },
    { label: "One Engineering Standard",    desc: "Utilities designed to interoperate from day one — shared trenches, shared metering, shared monitoring." },
    { label: "One Accountable Owner",       desc: "End-to-end responsibility removes interface risk and finger-pointing." },
  ];
  return (
    <LightSlide color="#002060" watermark="1">
      <SlideHeader
        color="#7c3aed"
        kicker="Why One Partner"
        title="The TAQA One-Stop-Shop"
        tagline="One SLA, one communication point, one accountable operator — across every utility in the community."
        tight
      />
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-5">
        <div className="rnx-up col-span-5 rounded-2xl p-5 text-white flex flex-col relative overflow-hidden ring-1 ring-black/10" style={{ ...d(2), background: "linear-gradient(155deg, #002060 0%, #001034 100%)" }}>
          <div aria-hidden className="absolute -top-20 -right-20 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.38), transparent 65%)" }} />
          <CardLabel color={GOLD}>Solutions Under One SLA</CardLabel>
          <div className="grid grid-cols-2 gap-2 relative">
            {solutions.map(s => (
              <div key={s} className="flex items-center gap-2.5 bg-white/10 ring-1 ring-white/15 rounded-xl px-3 h-10 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#FFC10E] shrink-0" />
                <span className="text-white text-[15px] font-medium">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-4 flex items-end gap-3 relative">
            <span className="font-display text-[56px] font-bold leading-none bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(95deg, ${GOLD}, #ffe08a)` }}>7→1</span>
            <span className="text-[15px] text-white/80 leading-snug pb-1.5">seven utilities,<br />one accountable operator</span>
          </div>
        </div>
        <div className="col-span-7 flex flex-col gap-2.5">
          {pillars.map((p, i) => (
            <div key={p.label} className="rnx-up flex items-start gap-3.5 rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_10px_26px_-18px_rgba(2,6,23,0.35)] px-4 py-2.5" style={d(3 + i)}>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5f3ff] text-[#7c3aed] shrink-0 mt-0.5">
                <ArrowRight className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="font-display font-bold text-[15.5px] leading-tight" style={{ color: NAVY }}>{p.label}</div>
                <div className="text-[16px] text-slate-600 leading-snug mt-0.5">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LightSlide>
  );
}

function BundleSlide() {
  const bundles = [
    { combo: "Solar + Desalination",         desc: "On-site solar PV powers the RO plant — the greenest, lowest-cost water in the community.",  color: "#0095C8" },
    { combo: "Solar + EV Charging",          desc: "Pair rooftop solar with EV chargers — charge with clean energy, strengthen the ESG story.", color: "#7c3aed" },
    { combo: "Gas + Mobile CNG",             desc: "Mobile CNG bridges supply until the permanent gas network goes live — no community waits.",  color: "#E68A00" },
    { combo: "Diesel Back-up + Electricity", desc: "One provider supplies both the distribution network and emergency backup — single O&M.",     color: "#6B6B6B" },
    { combo: "EV + Distribution",            desc: "Power distribution designed for EV loads from day one — no future re-build.",                color: "#d97706" },
    { combo: "Shared O&M & Monitoring",      desc: "One control room and field team monitor every utility — pooled spares, pooled response.",   color: "#009045" },
  ];
  return (
    <LightSlide color="#002060" watermark="+">
      <SlideHeader
        color="#7c3aed"
        kicker="The Power of the Bundle"
        title="Cross-Solution Benefits"
        tagline="How combining the solutions under one SLA creates value no single vendor can match."
        tight
      />
      <div className="flex-1 min-h-0 grid grid-cols-3 gap-4">
        {bundles.map((b, i) => (
          <div key={b.combo} className="rnx-up rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_12px_30px_-18px_rgba(2,6,23,0.35)] p-4 relative overflow-hidden flex flex-col" style={d(2 + i)}>
            <div aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: `linear-gradient(to bottom, ${b.color}, ${b.color}33)` }} />
            <span className="mb-2 inline-flex h-2 w-8 rounded-full" style={{ background: `${b.color}33` }} />
            <h3 className="font-display font-bold text-[16px] leading-tight" style={{ color: NAVY }}>{b.combo}</h3>
            <p className="text-[16px] text-slate-600 leading-snug mt-1.5">{b.desc}</p>
          </div>
        ))}
      </div>
      <div className="rnx-up shrink-0 mt-4 rounded-2xl px-6 py-3.5 relative overflow-hidden" style={{ ...d(8), background: "linear-gradient(120deg, #002060 0%, #1e1145 100%)" }}>
        <div aria-hidden className="absolute -top-10 right-10 h-32 w-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.45), transparent 65%)" }} />
        <p className="relative text-[16px] text-white/90 text-center">
          <span className="text-[#FFC10E] font-display font-bold">Sold as one SLA: </span>
          lower combined energy cost · shared infrastructure · one billing platform · stronger ESG story · single accountable operator
        </p>
      </div>
    </LightSlide>
  );
}

function SomaBaySlide() {
  const stats: StatBox[] = [
    { value: "+47,000 m³/day", label: "Desalination capacity" },
    { value: "20 MW",          label: "Solar plant (Sharm El-Sheikh)" },
    { value: "50,000+",        label: "People served" },
    { value: "8,560 t",        label: "CO₂ avoided per year" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden font-deck" style={{ background: "linear-gradient(135deg,#0d0620 0%,#1e1145 100%)" }}>
      <Fx />
      <img src={P.resort} alt={altFor(P.resort)} className="rnx-in absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.42, mixBlendMode: "luminosity" }} />
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(13,6,32,0.95) 0%, rgba(30,17,69,0.8) 50%, rgba(124,58,237,0.28) 100%)" }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(13,6,32,0.85), transparent)" }} />

      <div className="relative z-10 h-full flex flex-col p-14">
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-8 items-center">
          <div className="col-span-7">
            <div className="rnx-up" style={d(0)}>
              <Kicker dark color={GOLD} label="Success Story" />
            </div>
            <h2 className="rnx-up font-display text-[56px] font-bold tracking-tight leading-[1.0] text-white mt-4" style={d(1)}>
              Soma <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #a78bfa, #c4b5fd)" }}>Bay</span>
            </h2>
            <p className="rnx-up text-[17px] font-medium text-[#FFC10E] mt-3" style={d(2)}>
              Egypt's most celebrated eco-resort — powered by the TAQA one-stop-shop
            </p>
            <p className="rnx-up text-[17px] text-white/90 leading-relaxed mt-4 max-w-[600px]" style={d(3)}>
              At Soma Bay on the Red Sea, TAQA Arabia delivers the full integrated utility stack: Egypt's first eco solar-powered desalination plant, an MV/LV distribution network, and EV charging — all under one SLA.
            </p>
            <p className="rnx-up text-[17px] text-white/90 leading-relaxed mt-3 max-w-[600px]" style={d(4)}>
              The result: a landmark resort that runs on renewable energy, serves 50,000+ people with guaranteed-quality water, and sets the benchmark for sustainable touristic development in Egypt.
            </p>
            <div className="rnx-up mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/15 pl-5 pr-2 py-2" style={d(5)}>
              <span className="text-[16px] font-medium text-white">Explore the integrated residential utility model for your development</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#002060]" style={{ background: `linear-gradient(135deg, ${GOLD}, #ffd75e)` }}>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div className="col-span-5 grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={s.label} className="rnx-up rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-4 flex flex-col justify-center min-h-[118px]" style={d(3 + i)}>
                <div className="font-display text-[24px] font-bold tracking-tight leading-tight bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(95deg, ${GOLD}, #ffe08a)` }}>{s.value}</div>
                <div className="text-[15px] text-white/80 mt-1.5 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rnx-up shrink-0 flex items-center justify-between border-t border-white/10 pt-4" style={d(7)}>
          <p className="text-white/50 text-[14px] tracking-wide flex items-center gap-2"><Star className="w-3.5 h-3.5 text-[#FFC10E]" /> TAQA Arabia · Integrated Energy &amp; Utility Solutions</p>
          <p className="text-white/50 text-[14px] tracking-wide">Contact TAQA Arabia</p>
        </div>
      </div>
    </div>
  );
}

// ─── Slides Array (36 slides, 0-indexed) ─────────────────────────────────────

const SLIDES: { title: string; render: () => React.ReactElement }[] = [
  // 0 Cover
  { title: "Cover", render: () => <CoverSlide /> },
  // 1 About
  { title: "About TAQA Arabia", render: () => <AboutSlide /> },
  // 2 Regional
  { title: "Regional Presence", render: () => <RegionalSlide /> },
  // 3 Numbers
  { title: "In Numbers", render: () => <NumbersSlide /> },
  // 4 Overview
  { title: "Solutions Overview", render: () => <SolutionsOverviewSlide /> },

  // ── Mobile CNG ──
  // 5
  {
    title: "Mobile CNG: Scope",
    render: () => (
      <ScopeSlide
        num="1" solutionName="Mobile CNG" color="#E68A00" icon={<Truck className="w-5 h-5" />} photo={P.cng}
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the gas you consume — little to no upfront CapEx."
        taqdInvests={["Mother station & compression skids", "CNG/virtual-pipeline trailers", "On-site decompression & PRMS skid", "Metering, odorization & safety controls", "BOO/BOOT asset financing"]}
        steps={["Gas is compressed at a TAQA mother station to ~250 bar.", "CNG trailers haul it to your community as a virtual pipeline.", "On-site skids decompress and regulate gas to delivery pressure.", "Odorized, metered gas flows to homes and amenities.", "TAQA monitors volumes and refills before you run low."]}
        whatYouReceive={["Piped-quality gas with no physical pipeline", "Reliable supply to off-grid compounds", "Seamless switch-over once the grid arrives"]}
      />
    ),
  },
  // 6
  {
    title: "Mobile CNG: Value Proposition",
    render: () => (
      <ValueSlide
        num="1" solutionName="Mobile CNG" color="#E68A00" icon={<Truck className="w-5 h-5" />} photo={P.cng}
        whatYouGain={[
          { label: "Off-Grid Gas Supply",           desc: "Reliable natural gas to communities without pipeline access — compounds, resorts and remote developments." },
          { label: "Cost Savings vs. Diesel & LPG", desc: "≈40% lower fuel cost than diesel; replaces LPG and electric heating." },
          { label: "Cleaner Emissions",             desc: "Cuts CO₂ by ~24% vs. diesel and lowers NOx & particulates — supports ESG and green-rating targets." },
          { label: "99.5% Uptime SLA",              desc: "SCADA-monitored hot-swap replenishment guarantees uninterrupted supply to every home." },
        ]}
        taqaEdge={[
          { label: "Flexible Delivery Approach",          desc: "BOO/BOOT or EPC via Capacity-as-a-Service — no upfront infrastructure cost." },
          { label: "Nationwide Logistics Via Master Gas", desc: "A dedicated trailer fleet keeps refills on schedule across governorates." },
          { label: "Scalable to Any Load",                desc: "Starter (500 Nm³/day) to Heavy (5,000+ Nm³/day) — scales with occupancy, bridges to grid later." },
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
        num="1" solutionName="Mobile CNG" color="#E68A00" icon={<Truck className="w-5 h-5" />} photo={P.cng}
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
        num="1" solutionName="Mobile CNG" color="#E68A00" icon={<Truck className="w-5 h-5" />} photo={P.cng}
        subheadline="El-Kharga — Virtual Pipeline City. First Egyptian city to run entirely on natural gas."
        body="In the New Valley Governorate — far from any fixed gas grid — TAQA Arabia became the first to run an entire city on natural gas, trucking CNG through its mobile virtual pipeline. The roll-out scales to serve up to 14,000 households at completion, proving an off-grid city can live on clean natural gas years before a physical pipeline arrives."
        stats={[
          { value: "1st",          label: "First city in Egypt run on natural gas" },
          { value: "14,000",       label: "Households served at completion" },
          { value: "+2,350 mmscf", label: "CNG delivered per year" },
          { value: "+10",          label: "Active mobile-CNG clients" },
        ]}
      />
    ),
  },

  // ── Electricity Distribution ──
  // 9
  {
    title: "Electricity Distribution: Scope",
    render: () => (
      <ScopeSlide
        num="2" solutionName="Electricity Distribution" color="#d97706" icon={<Zap className="w-5 h-5" />} photo={P.electricity}
        tagline="Turnkey distribution networks for residential developments — from power sourcing and design through licensed lifetime O&M."
        taqdInvests={["MV/LV substations & ring-main units", "Distribution transformers", "Cabling, switchgear & protection", "Smart meters & SCADA", "BOO/BOOT network financing"]}
        steps={["TAQA designs the network to the community's phased load.", "Substations and feeders are built and energized.", "Power reaches every home and amenity at the right voltage.", "Smart meters bill each unit.", "24/7 monitoring and rapid response keep the community powered."]}
        whatYouReceive={["A licensed community power network", "Reliable supply to every unit", "Operation, metering and billing handled"]}
      />
    ),
  },
  // 10
  {
    title: "Electricity Distribution: Value Proposition",
    render: () => (
      <ValueSlide
        num="2" solutionName="Electricity Distribution" color="#d97706" icon={<Zap className="w-5 h-5" />} photo={P.electricity}
        whatYouGain={[
          { label: "Potential New Revenue Stream", desc: "The profit-share model turns the distribution network from a cost center into recurring income for the developer." },
          { label: "Lower Resident Bills",         desc: "Demand-side management and tariff optimization reduce consumption and end-user charges." },
          { label: "Guaranteed Power Quality",     desc: "Stable, metered, billable electricity to every unit from handover." },
          { label: "Future-Ready Network",         desc: "Designed for solar, storage and EV loads from day one — the community scales without re-builds." },
        ]}
        taqaEdge={[
          { label: "Flexible Delivery Approach", desc: "EPC build, licensed O&M, or profit-share — TAQA flexes from substation to metering." },
          { label: "Faster Time-to-Handover",    desc: "Integrated teams for power sourcing, engineering and construction." },
          { label: "26 Residential Concessions", desc: "Deep experience in residential distribution across Egypt." },
          { label: "24/7 Control Room",          desc: "SCADA monitoring, predictive maintenance, rapid response." },
        ]}
      />
    ),
  },
  // 11
  {
    title: "Electricity Distribution: Timeline",
    render: () => (
      <TimelineSlide
        num="2" solutionName="Electricity Distribution" color="#d97706" icon={<Zap className="w-5 h-5" />} photo={P.electricity}
        phases={[
          { days: "Day 0–30",   label: "Power Sourcing" },
          { days: "Day 30–75",  label: "Engineering Approval" },
          { days: "Day 75–120", label: "MEP Approval" },
          { days: "Day 120–240",label: "Network Build" },
          { days: "Day 240–300",label: "Smart Metering" },
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
        num="2" solutionName="Electricity Distribution" color="#d97706" icon={<Zap className="w-5 h-5" />} photo={P.electricity}
        subheadline="Powering residential communities across Egypt."
        body="TAQA Power designs, builds and operates licensed electrical distribution networks for residential communities across Egypt, with +1,600 MVA in the distribution portfolio and 26 residential concessions. From gated compounds to touristic resorts, TAQA brings the same turnkey discipline — grid interconnection to smart metering — to any development."
        stats={[
          { value: "+1,600 MVA", label: "Distribution portfolio" },
          { value: "26",         label: "Residential concessions" },
          { value: "+12,000",    label: "Customers served" },
          { value: "24/7",       label: "SCADA monitoring" },
        ]}
      />
    ),
  },

  // ── Water Desalination ──
  // 13
  {
    title: "Water Desalination: Scope",
    render: () => (
      <ScopeSlide
        num="3" solutionName="Water Desalination" color="#0095C8" icon={<Droplets className="w-5 h-5" />} photo={P.water}
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the water you use — little to no upfront CapEx."
        taqdInvests={["Intake & pre-treatment system", "Reverse-osmosis desalination trains", "Post-treatment & storage tanks", "Pumping, distribution & smart meters", "BOO/BOOT plant financing"]}
        steps={["Seawater or brackish water is drawn in and pre-treated.", "Reverse-osmosis membranes remove salt and impurities.", "Clean water is remineralized to potable standard.", "Treated water is stored, pumped and distributed to the community.", "TAQA operates the plant and guarantees output quality."]}
        whatYouReceive={["Potable water independent of the public network", "Guaranteed volume and quality", "Full plant operation and maintenance"]}
      />
    ),
  },
  // 14
  {
    title: "Water Desalination: Value Proposition",
    render: () => (
      <ValueSlide
        num="3" solutionName="Water Desalination" color="#0095C8" icon={<Droplets className="w-5 h-5" />} photo={P.water}
        whatYouGain={[
          { label: "50% Lower Energy Use",        desc: "Advanced energy-efficient desalination plus VSDs, peak-demand control and solar PV cut power use." },
          { label: "Seawater & Brackish Supply",  desc: "Seawater RO for coastal compounds and brackish RO for inland cities like New Cairo & 6th of October." },
          { label: "Resident Experience",          desc: "Dynamic billing, consumption analytics and real-time notifications via mobile app." },
          { label: "Sustainability & ESG Impact", desc: "Solar-powered desalination, brine management and a reduced freshwater-extraction footprint." },
        ]}
        taqaEdge={[
          { label: "Flexible Commercial Models", desc: "EPC, long-term O&M or BOO." },
          { label: "Green-Rating Enabler",       desc: "Solar-powered RO and brine management support LEED/green-community certification." },
          { label: "Scales With the Community", desc: "Modular RO trains add capacity in phases, matching plant output to real occupancy growth." },
          { label: "Smart Operations & Uptime", desc: "Real-time monitoring, leak & failure detection and predictive-maintenance dashboards." },
        ]}
      />
    ),
  },
  // 15
  {
    title: "Water Desalination: Timeline",
    render: () => (
      <TimelineSlide
        num="3" solutionName="Water Desalination" color="#0095C8" icon={<Droplets className="w-5 h-5" />} photo={P.water}
        phases={[
          { days: "Day 0–20",    label: "Water Demand Study" },
          { days: "Day 20–60",   label: "Plant Design (RO sizing, pre/post-treatment & PV integration)" },
          { days: "Day 45–75",   label: "Commercial Model" },
          { days: "Day 75–210",  label: "Construction" },
          { days: "Day 210–260", label: "Commissioning" },
          { days: "Day 260+",    label: "Smart O&M" },
        ]}
        groups={[
          { label: "STUDY & DESIGN",  range: "Day 0–60" },
          { label: "FINANCE & BUILD", range: "Day 45–260" },
          { label: "SMART OPERATE",   range: "Day 260+" },
        ]}
      />
    ),
  },
  // 16
  {
    title: "Water Desalination: Track Record",
    render: () => (
      <TrackRecordSlide
        num="3" solutionName="Water Desalination" color="#0095C8" icon={<Droplets className="w-5 h-5" />} photo={P.water}
        subheadline="Soma Bay — Eco Solar Desalination. Egypt's first & largest eco solar-powered water-desalination plant."
        body="On the Red Sea, TAQA Water built Egypt's first green desalination facility powered entirely by renewable energy, using technology that consumes 50% less power than peers. It serves 50,000+ people in the Red Sea Governorate and cuts CO₂ by 8,560 tonnes a year."
        stats={[
          { value: "+47,000 m³/day", label: "Contracted desalination capacity" },
          { value: "15",             label: "Operational water locations" },
          { value: "50,000+",        label: "People served at Soma Bay" },
          { value: "8,560 t",        label: "CO₂ avoided per year" },
        ]}
      />
    ),
  },

  // ── Gas Distribution ──
  // 17
  {
    title: "Gas Distribution: Scope",
    render: () => (
      <ScopeSlide
        num="4" solutionName="Gas Distribution" color="#009045" icon={<Flame className="w-5 h-5" />} photo={P.pipeline}
        taqdInvests={["City-gate & pressure-reduction stations", "Steel & PE distribution mains", "Service lines to each home", "Domestic meters & regulators", "BOO/BOOT network financing"]}
        steps={["TAQA secures the concession and designs the gas network.", "Mains and service lines are laid across the community.", "Pressure is regulated down to safe domestic levels.", "Each home is connected, metered and commissioned.", "TAQA operates, inspects and bills for the gas delivered."]}
        whatYouReceive={["A licensed piped-gas network", "Safe, metered gas to every home", "Lifetime operation and emergency response"]}
      />
    ),
  },
  // 18
  {
    title: "Gas Distribution: Value Proposition",
    render: () => (
      <ValueSlide
        num="4" solutionName="Gas Distribution" color="#009045" icon={<Flame className="w-5 h-5" />} photo={P.pipeline}
        whatYouGain={[
          { label: "Diesel & LPG Fuel-Switching",         desc: "Manage the full transition from diesel and LPG to cleaner, cheaper natural gas." },
          { label: "Flexible Gas Sourcing — M-CNG or SNG",desc: "Where no fixed pipeline exists, gas is supplied via M-CNG or SNG — no community waits." },
          { label: "Higher Asset Value",                   desc: "Connection to the national gas grid lifts community asset value and tenancy." },
          { label: "Lower Living Costs",                   desc: "Subsidized piped natural gas is far cheaper than LPG cylinders or electric heating for residents." },
        ]}
        taqaEdge={[
          { label: "Flexible Commercial Models",     desc: "EPC, long-term O&M or BOO." },
          { label: "External & Internal Networks",   desc: "TAQA builds the external backbone and the internal in-compound and in-building network." },
          { label: "One Partner Across all Phases", desc: "Single accountable party from feasibility to handover." },
          { label: "Standards Compliance",           desc: "Aligned with IGEM, EGAS and international gas-safety standards." },
        ]}
      />
    ),
  },
  // 19
  {
    title: "Gas Distribution: Timeline",
    render: () => (
      <TimelineSlide
        num="4" solutionName="Gas Distribution" color="#009045" icon={<Flame className="w-5 h-5" />} photo={P.pipeline}
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
  // 20
  {
    title: "Gas Distribution: Track Record",
    render: () => (
      <TrackRecordSlide
        num="4" solutionName="Gas Distribution" color="#009045" icon={<Flame className="w-5 h-5" />} photo={P.pipeline}
        subheadline="Egypt's largest private gas distribution network."
        body="TAQA Gas operates one of Egypt's largest private piped-gas networks: +10,000 km of distribution mains across 8 governorates with 15-year renewable concessions. With 66% of Egypt's private gas concessions and ~6.5 million residential customers, TAQA is the proven gas infrastructure partner for any residential development."
        stats={[
          { value: "+10,000 km", label: "Network" },
          { value: "8",          label: "Governorate concessions (15yr)" },
          { value: "66%",        label: "Private concession share" },
          { value: "~6.5M",      label: "Residential customers" },
        ]}
      />
    ),
  },

  // ── Diesel Rental ──
  // 21
  {
    title: "Diesel Rental: Scope",
    render: () => (
      <ScopeSlide
        num="5" solutionName="Diesel Rental" color="#6B6B6B" icon={<Battery className="w-5 h-5" />} photo={P.generator}
        taqdInvests={["Rental diesel generator sets", "Fuel tanks & automatic transfer switch", "Synchronization & distribution panels", "Remote telemetry & monitoring", "Fuel-supply logistics"]}
        steps={["TAQA sizes gensets to the site's standby or prime load.", "Units are delivered, installed and synchronized on site.", "Generators start automatically on grid loss or demand.", "TAQA manages refuelling, service and remote monitoring.", "Units scale up or down as the project's needs change."]}
        whatYouReceive={["Immediate, reliable backup or prime power", "Fuel, service and monitoring included", "Flexible capacity with no asset purchase", "Power on day one"]}
      />
    ),
  },
  // 22
  {
    title: "Diesel Rental: Value Proposition",
    render: () => (
      <ValueSlide
        num="5" solutionName="Diesel Rental" color="#6B6B6B" icon={<Battery className="w-5 h-5" />} photo={P.generator}
        whatYouGain={[
          { label: "Business / Community Continuity", desc: "Instant back-up power keeps lifts, pumps, lighting and amenities running through any outage." },
          { label: "Uninterrupted Living",             desc: "Residents keep power to elevators, water pumps, security and common areas during grid failures." },
          { label: "Construction-Phase Power",         desc: "Temporary power for the build site converts seamlessly into back-up power at handover." },
          { label: "Hands-Off Reliability",            desc: "Fully managed fuel, service, monitoring and rapid response — zero operational burden." },
        ]}
        taqaEdge={[
          { label: "Full OPEX Model",            desc: "No genset purchase — a fixed rental per kVA, fuel and maintenance all-in." },
          { label: "Construction to Operations",desc: "One provider from site power during build through lifetime back-up." },
          { label: "500 kVA to 20 MVA",         desc: "Any load, any phase of development, scaled to real need." },
          { label: "24/7 O&M & Rapid Response", desc: "Dedicated team, remote telemetry and SLA-backed response times." },
        ]}
      />
    ),
  },
  // 23
  {
    title: "Diesel Rental: Timeline",
    render: () => (
      <TimelineSlide
        num="5" solutionName="Diesel Rental" color="#6B6B6B" icon={<Battery className="w-5 h-5" />} photo={P.generator}
        phases={[
          { days: "Day 0–7",  label: "Load Assessment" },
          { days: "Day 7–14", label: "Genset Sizing" },
          { days: "Day 14–25",label: "Delivery" },
          { days: "Day 25–35",label: "Integration (synchronization, ATS & switchgear tie-in)" },
          { days: "Day 35–45",label: "Commissioning" },
          { days: "Day 45+",  label: "24/7 O&M" },
        ]}
        groups={[
          { label: "ASSESS & SIZE",      range: "Day 0–14" },
          { label: "DEPLOY & INTEGRATE", range: "Day 14–45" },
          { label: "OPERATE",            range: "Day 45+" },
        ]}
      />
    ),
  },
  // 24
  {
    title: "Diesel Rental: Track Record",
    render: () => (
      <TrackRecordSlide
        num="5" solutionName="Diesel Rental" color="#6B6B6B" icon={<Battery className="w-5 h-5" />} photo={P.generator}
        subheadline="Captive Power — 6 Plants. Owning and operating captive generation across Egypt's toughest sites."
        body="TAQA Power owns and operates 6 captive power plants and +150 MW of contracted generation capacity through long-term agreements, including flare-to-power and combined-heat-and-power systems. The same engineering, fuel-logistics and 24/7 O&M discipline underpins TAQA's diesel back-up rental offering for residential communities."
        stats={[
          { value: "6",              label: "Captive power plants operated" },
          { value: "+150 MW",        label: "Contracted generation" },
          { value: "500 kVA–20 MVA", label: "Genset sizing range" },
          { value: "24/7",           label: "O&M and rapid response" },
        ]}
      />
    ),
  },

  // ── EV Chargers ──
  // 25
  {
    title: "EV Chargers: Scope",
    render: () => (
      <ScopeSlide
        num="6" solutionName="EV Chargers" color="#7c3aed" icon={<Car className="w-5 h-5" />} photo={P.ev}
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the energy you charge — little to no upfront CapEx."
        taqdInvests={["AC & DC fast-charging units", "Grid connection & upgrade works", "Energy-management & load balancing", "Payment, app & access platform", "BOO/BOOT charger financing"]}
        steps={["TAQA assesses parking, demand and available grid capacity.", "Chargers and any needed grid upgrades are installed.", "Smart load-management shares power across charging points.", "Residents authenticate and charge via app or RFID.", "TAQA operates, maintains and settles payments."]}
        whatYouReceive={["A ready community charging network", "Seamless app-based charging & billing", "Maintained, future-ready infrastructure"]}
      />
    ),
  },
  // 26
  {
    title: "EV Chargers: Value Proposition",
    render: () => (
      <ValueSlide
        num="6" solutionName="EV Chargers" color="#7c3aed" icon={<Car className="w-5 h-5" />} photo={P.ev}
        whatYouGain={[
          { label: "Full Charger Range",           desc: "AC, DC fast and golf-car chargers cover every residential and resort mobility need." },
          { label: "Future-Proof Amenity",         desc: "EV-ready parking is now a deciding factor for buyers — it differentiates and future-proofs the community." },
          { label: "Effortless Resident Experience",desc: "App-based charging, transparent billing and a 24/7 hotline make adoption simple." },
          { label: "Hotline & Mobile App",         desc: "24/7 TAQA hotline plus a user and operator app." },
        ]}
        taqaEdge={[
          { label: "First EV License in Egypt",  desc: "TAQA holds the first private EV-charging license in the country." },
          { label: "Lifecycle O&M & Uptime",     desc: "Ongoing operation and maintenance keep every charger available." },
          { label: "Flexible Financing Options", desc: "TAQA invests in the chargers or profit-share model turning charging into income." },
          { label: "Turnkey Engineering",        desc: "Site assessment, design, supply and installation delivered end-to-end." },
        ]}
      />
    ),
  },
  // 27
  {
    title: "EV Chargers: Timeline",
    render: () => (
      <TimelineSlide
        num="6" solutionName="EV Chargers" color="#7c3aed" icon={<Car className="w-5 h-5" />} photo={P.ev}
        phases={[
          { days: "Day 0–14",  label: "Site Assessment" },
          { days: "Day 14–30", label: "Commercial Model" },
          { days: "Day 30–60", label: "Supply (AC/DC/golf-car charger procurement)" },
          { days: "Day 60–90", label: "Installation" },
          { days: "Day 90–105",label: "Activation" },
          { days: "Day 105+",  label: "O&M & Support" },
        ]}
        groups={[
          { label: "ASSESS & STRUCTURE", range: "Day 0–30" },
          { label: "SUPPLY & INSTALL",   range: "Day 30–105" },
          { label: "OPERATE & SUPPORT",  range: "Day 105+" },
        ]}
      />
    ),
  },
  // 28
  {
    title: "EV Chargers: Track Record",
    render: () => (
      <TrackRecordSlide
        num="6" solutionName="EV Chargers" color="#7c3aed" icon={<Car className="w-5 h-5" />} photo={P.ev}
        subheadline="First EV License — Green Mobility. Pioneering Egypt's EV-charging rollout from the front."
        body="TAQA Power secured the first private EV-charging license in Egypt and is rolling out AC and DC charging across residential, commercial and highway locations, supported by its own operator and user mobile app and 24/7 hotline. As Egypt's largest private power player, TAQA pairs charging with on-site solar and distribution — a complete green-mobility package for any community."
        stats={[
          { value: "1st", label: "Private EV-charging license in Egypt" },
          { value: "3",   label: "Charger lines: AC, DC & golf-car" },
          { value: "6",   label: "End-to-end services offered" },
          { value: "24/7",label: "Hotline & app support" },
        ]}
      />
    ),
  },

  // ── Solar PV ──
  // 29
  {
    title: "Solar PV: Scope",
    render: () => (
      <ScopeSlide
        num="7" solutionName="Solar PV" color="#16a34a" icon={<Sun className="w-5 h-5" />} photo={P.solar}
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the solar power you use — little to no upfront CapEx."
        taqdInvests={["Rooftop & carport PV arrays", "Inverters & mounting structures", "Net-metering & connection works", "Monitoring & performance platform", "BOO/BOOT solar financing"]}
        steps={["TAQA studies roofs, shading and the community's energy profile.", "Arrays are sized and designed for optimal yield.", "Panels are installed; grid tie-in and metering completed.", "Solar generation offsets common-area and resident bills.", "TAQA monitors output and guarantees performance for 25+ years."]}
        whatYouReceive={["Lower energy bills from day one", "Net metering and grid tie-in", "Zero-capex PPA option", "25-year performance guarantee"]}
      />
    ),
  },
  // 30
  {
    title: "Solar PV: Value Proposition",
    render: () => (
      <ValueSlide
        num="7" solutionName="Solar PV" color="#16a34a" icon={<Sun className="w-5 h-5" />} photo={P.solar}
        whatYouGain={[
          { label: "Lower Energy Bills",     desc: "Solar's cost per kWh sits well below the grid tariff — residents and common areas save from day one." },
          { label: "Tariff-Hike Hedge",      desc: "Lock in clean-energy cost for decades and insulate the community from grid-price escalation." },
          { label: "Uses Idle Space",        desc: "Rooftops, car parks and unused land become productive, revenue-saving assets." },
          { label: "Strong ESG Credentials", desc: "Each 1 MWp avoids ~1,000 tons of CO₂ a year — measurable proof for sustainability reporting." },
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
  // 31
  {
    title: "Solar PV: Timeline",
    render: () => (
      <TimelineSlide
        num="7" solutionName="Solar PV" color="#16a34a" icon={<Sun className="w-5 h-5" />} photo={P.solar}
        phases={[
          { days: "Day 0–14",   label: "Site & Yield Study" },
          { days: "Day 14–30",  label: "Commercial Model" },
          { days: "Day 30–60",  label: "Design & Procure" },
          { days: "Day 60–110", label: "EPC Installation" },
          { days: "Day 110–125",label: "Commissioning" },
          { days: "Day 125+",   label: "O&M & Monitoring" },
        ]}
        groups={[
          { label: "ASSESS & DESIGN",     range: "Day 0–30" },
          { label: "BUILD & CONNECT",     range: "Day 30–110" },
          { label: "OPERATE & GUARANTEE", range: "Day 110+" },
        ]}
      />
    ),
  },
  // 32
  {
    title: "Solar PV: Track Record",
    render: () => (
      <TrackRecordSlide
        num="7" solutionName="Solar PV" color="#16a34a" icon={<Sun className="w-5 h-5" />} photo={P.solar}
        subheadline="Largest Solar Plant in Sharm El-Sheikh — powering a green, smart city with clean energy."
        body="TAQA Power built the largest solar plant in Sharm El-Sheikh — 20 MW across 250,000 m² — generating over 42 GWh a year, enough clean electricity for about 6,000 hotel rooms and 30% of the Nabq region's load, delivered in a record four months. As the first national company to commercially operate a plot at the Benban solar park, TAQA brings the same utility-scale expertise to residential rooftops and community solar."
        stats={[
          { value: "20 MW",    label: "Sharm El-Sheikh solar plant" },
          { value: "42 GWh",   label: "Clean energy generated per year" },
          { value: "≈500k t",  label: "CO₂ avoided over its lifetime" },
          { value: "4 months", label: "Record build time" },
        ]}
      />
    ),
  },

  // ── Closing ──
  // 33
  { title: "Why One Partner", render: () => <WhyOnePartnerSlide /> },
  // 34
  { title: "Cross-Solution Benefits", render: () => <BundleSlide /> },
  // 35
  { title: "Success Story: Soma Bay", render: () => <SomaBaySlide /> },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResidentialClientsNew() {
  return (
    <DeckShell
      title="Residential Clients"
      subtitle="TAQA Arabia · Integrated Energy & Utility Solutions · Jun 2026"
      sections={SECTIONS}
      slides={SLIDES}
      pdf="residential-clients.pdf"
    />
  );
}
