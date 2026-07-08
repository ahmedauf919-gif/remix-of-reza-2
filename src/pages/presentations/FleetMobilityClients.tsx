import { type CSSProperties, type ReactNode, type SyntheticEvent } from "react";
import { DeckShell } from "./DeckShell";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import {
  Flame, Zap, Droplets, Truck, Car, Globe, CheckCircle2, ArrowRight, Star, BarChart2, MapPin,
} from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";

// ─── Photos ───────────────────────────────────────────────────────────────────

const P: Record<string, string> = {
  cover:   MEDIA + "taqa-hub-dusk.jpg",
  fleet:   MEDIA + "fleet-hero.jpg",
  fuel:    MEDIA + "mastergas-station.jpg",
  cng:     MEDIA + "cng-station-truck.jpg",
  ev:      MEDIA + "ev-collage.jpg",
  digital: MEDIA + "waqood-screen.jpg",
  energy:  MEDIA + "cng-plant-night.jpg",
  road:    MEDIA + "station-ev-app.jpg",
};

// ─── Deck design system: "Kinetic Blue" ──────────────────────────────────────

const FMX_CSS = `
@keyframes fmx-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fmx-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes fmx-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.fmx-up { animation: fmx-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
.fmx-in { animation: fmx-in 0.5s ease-out both; }
.fmx-grow { animation: fmx-grow 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: left center; }
@media (prefers-reduced-motion: reduce) {
  .fmx-up, .fmx-in, .fmx-grow { animation: none !important; }
}
`;

const Fmx = () => <style>{FMX_CSS}</style>;

/** Staggered entrance delay. */
const d = (i: number): CSSProperties => ({ animationDelay: `${i * 65}ms` });

/** Lighter companion tone for each section color (gradient endpoints, dark-slide accents). */
const LIGHT_TONE: Record<string, string> = {
  "#0369a1": "#38bdf8",
  "#dc2626": "#f87171",
  "#b45309": "#f59e0b",
  "#059669": "#34d399",
  "#7c3aed": "#a78bfa",
  "#002060": "#38bdf8",
};
const lite = (c: string) => LIGHT_TONE[c] ?? "#38bdf8";

const GLASS = "rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/15";

const hideImg = (e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = "none"; };

// ─── Shared primitives ────────────────────────────────────────────────────────

function Chip({ color, label, dark = false }: { color: string; label: string; dark?: boolean }) {
  return (
    <span
      className="inline-flex h-7 items-center gap-2 whitespace-nowrap rounded-full px-3.5 font-display text-[14px] font-semibold uppercase leading-none tracking-[0.22em]"
      style={dark
        ? { background: "rgba(255,255,255,0.08)", color: lite(color), boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16)" }
        : { background: `${color}0f`, color, boxShadow: `inset 0 0 0 1px ${color}30` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dark ? lite(color) : color }} />
      {label}
    </span>
  );
}

function SpeedLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {[
        { top: 96, right: -140, w: 460, o: 0.5 },
        { top: 134, right: -30, w: 340, o: 0.32 },
        { top: 172, right: -210, w: 540, o: 0.2 },
      ].map((l, i) => (
        <div
          key={i}
          className="absolute h-[2px] -skew-y-[14deg] rounded-full"
          style={{ top: l.top, right: l.right, width: l.w, opacity: l.o, background: "linear-gradient(90deg, transparent 0%, #0369a1 35%, #38bdf8 100%)" }}
        />
      ))}
    </div>
  );
}

/** Light content slide wrapper — soft section-color wash + ghost numeral watermark. */
function LightSlide({ color, ghost, children }: { color: string; ghost?: string; children: ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f8fafc] font-deck">
      <Fmx />
      <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${color} 0%, ${lite(color)} 45%, transparent 92%)` }} />
      <div aria-hidden className="absolute -right-44 -top-44 h-[560px] w-[560px] rounded-full" style={{ background: `radial-gradient(circle, ${color}0d 0%, transparent 65%)` }} />
      <div aria-hidden className="absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full" style={{ background: `radial-gradient(circle, ${color}07 0%, transparent 65%)` }} />
      {ghost && (
        <div aria-hidden className="absolute -bottom-16 right-6 select-none font-display font-bold leading-none tracking-tighter" style={{ fontSize: 230, color: "#002060", opacity: 0.045 }}>
          {ghost}
        </div>
      )}
      <div className="relative z-10 flex h-full flex-col p-14">{children}</div>
    </div>
  );
}

/** Dark "moment" slide wrapper — navy-black gradient, duotone photo, speed lines. */
function DarkSlide({ photo, alt, children }: { photo?: string; alt?: string; children: ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden font-deck" style={{ background: "linear-gradient(135deg, #050e1a 0%, #0a1f33 55%, #0c2740 100%)" }}>
      <Fmx />
      {photo && (
        <img
          src={photo}
          alt={alt ?? ""}
          loading="lazy"
          className="fmx-in absolute inset-0 h-full w-full object-cover opacity-30"
          onError={hideImg}
        />
      )}
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(5,14,26,0.96) 0%, rgba(6,22,40,0.88) 42%, rgba(12,39,64,0.6) 72%, rgba(3,105,161,0.38) 100%)" }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to top, rgba(5,14,26,0.85), transparent)" }} />
      <SpeedLines />
      <div className="relative z-10 flex h-full flex-col p-14">{children}</div>
    </div>
  );
}

/** Small duotone photo card used in light-slide headers. */
function PhotoChip({ photo, alt, color, delay = 2 }: { photo: string; alt: string; color: string; delay?: number }) {
  return (
    <div
      className="fmx-up relative h-[92px] w-[220px] shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5"
      style={{ ...d(delay), background: `linear-gradient(135deg, #0c2740, ${color})` }}
    >
      <img src={photo} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-luminosity" onError={hideImg} />
      <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}59, transparent 62%)` }} />
    </div>
  );
}

/** Standard light-slide header: kicker chip (+ optional icon tile), title, subtitle, optional photo chip. */
function Header({ color, kicker, title, sub, icon, photo, photoAlt, titleSize = 38 }: {
  color: string; kicker: string; title: string; sub?: string; icon?: ReactNode; photo?: string; photoAlt?: string; titleSize?: number;
}) {
  return (
    <div className="mb-6 flex shrink-0 items-start justify-between gap-8">
      <div className="min-w-0">
        <div className="fmx-up flex items-center gap-3" style={d(0)}>
          {icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-md" style={{ background: `linear-gradient(135deg, ${color}, ${lite(color)})` }}>
              {icon}
            </div>
          )}
          <Chip color={color} label={kicker} />
        </div>
        <h2 className="fmx-up mt-3 font-display font-bold leading-[1.08] tracking-tight text-[#002060]" style={{ ...d(1), fontSize: titleSize }}>
          {title}
        </h2>
        {sub && <p className="fmx-up mt-2 max-w-[860px] text-[17px] leading-relaxed text-slate-600" style={d(2)}>{sub}</p>}
      </div>
      {photo && <PhotoChip photo={photo} alt={photoAlt ?? ""} color={color} />}
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "intro",     label: "Introduction",   color: "#0369a1", slides: [0, 1, 2, 3] },
  { id: "challenge", label: "Fleet Challenge", color: "#dc2626", slides: [4, 5] },
  { id: "overview",  label: "Solutions",       color: "#0369a1", slides: [6] },
  { id: "fuel",      label: "Fuel Stations",   color: "#b45309", slides: [7, 8, 9, 10] },
  { id: "cng",       label: "Natural Gas",     color: "#059669", slides: [11, 12, 13, 14] },
  { id: "ev",        label: "EV Charging",     color: "#7c3aed", slides: [15, 16, 17, 18] },
  { id: "waqood",    label: "Waqood",          color: "#0369a1", slides: [19, 20, 21, 22] },
  { id: "closing",   label: "Closing",         color: "#002060", slides: [23, 24, 25] },
];

function sectionOf(slideIdx: number) {
  return SECTIONS.find(s => s.slides.includes(slideIdx)) ?? SECTIONS[0];
}

// ─── Slide 0: Cover ──────────────────────────────────────────────────────────

function CoverSlide() {
  const pillars = [
    { icon: <Truck className="h-4 w-4" />,     label: "Fuel Stations",        color: "#f59e0b" },
    { icon: <Flame className="h-4 w-4" />,     label: "Natural Gas (CNG)",    color: "#34d399" },
    { icon: <Zap className="h-4 w-4" />,       label: "EV Charging",          color: "#a78bfa" },
    { icon: <BarChart2 className="h-4 w-4" />, label: "Waqood Smart System",  color: "#38bdf8" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden font-deck" style={{ background: "linear-gradient(135deg, #050e1a 0%, #0a1f33 55%, #0c2740 100%)" }}>
      <Fmx />
      <img
        src={P.cover}
        alt="Commercial fleet vehicles moving along a highway at dusk"
        loading="lazy"
        className="fmx-in absolute inset-0 h-full w-full object-cover opacity-40"
        onError={hideImg}
      />
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(5,14,26,0.97) 0%, rgba(0,24,53,0.9) 38%, rgba(0,32,96,0.72) 66%, rgba(3,105,161,0.55) 100%)" }} />
      <SpeedLines />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="fmx-up flex items-center justify-between" style={d(0)}>
          <img src={taqaLogo} alt="TAQA Arabia logo" className="h-12 rounded-lg bg-white/95 object-contain px-3 py-1.5 shadow-lg" />
          <Chip dark color="#0369a1" label="Client Presentation · Jun 2026" />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="fmx-grow h-[3px] w-24 rounded-full" style={{ ...d(1), background: "linear-gradient(90deg, #0369a1, #38bdf8)" }} />
          <h1 className="fmx-up mt-7 font-display text-[76px] font-bold leading-[1.02] tracking-tight text-white" style={d(2)}>
            Fleet &amp; Mobility<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #38bdf8 0%, #7dd3fc 55%, #bae6fd 100%)" }}>
              Sector
            </span>
          </h1>
          <p className="fmx-up mt-6 text-[20px] text-white/85" style={d(3)}>Integrated Energy &amp; Mobility Solutions · Jun 2026</p>
        </div>

        <div>
          <div className="grid grid-cols-4 gap-3">
            {pillars.map((s, i) => (
              <div key={s.label} className={`fmx-up flex items-center gap-3 ${GLASS} px-4 py-3.5`} style={d(4 + i)}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <span className="text-[16px] font-semibold leading-tight text-white/90">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="fmx-up mt-5 font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/60" style={d(8)}>
            A World OF ENERGY · TAQA Arabia · Confidential
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 1: About ──────────────────────────────────────────────────────────

function AboutSlide() {
  const divisions = [
    { label: "Gas",       icon: <Flame className="h-5 w-5" />,    desc: "Distribution, EPC, NGV stations, Mobile CNG",   color: "#059669" },
    { label: "Power",     icon: <Zap className="h-5 w-5" />,      desc: "Generation, solar PV, EV charging",             color: "#FFC10E" },
    { label: "Petroleum", icon: <Truck className="h-5 w-5" />,    desc: "Oil-marketing stations, lubricants, bulk fuel", color: "#b45309" },
    { label: "Water",     icon: <Droplets className="h-5 w-5" />, desc: "RO desalination, filtration, solar ops",        color: "#0369a1" },
  ];
  return (
    <LightSlide color="#0369a1">
      <Header
        color="#0369a1"
        kicker="TAQA Arabia · Who We Are"
        title="Egypt's leading integrated energy infrastructure developer"
      />
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        <div className="col-span-5 flex min-h-0 flex-col gap-4">
          <div className="fmx-up flex gap-2" style={d(3)}>
            {["IGU Member", "IGEM Accredited"].map(b => (
              <span key={b} className="rounded-full px-3 py-1 text-[14px] font-semibold text-[#0369a1]" style={{ background: "#0369a10f", boxShadow: "inset 0 0 0 1px #0369a130" }}>
                {b}
              </span>
            ))}
          </div>
          <p className="fmx-up text-[17px] leading-relaxed text-slate-600" style={d(4)}>
            Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility developer. TAQA is uniquely positioned to support different mobility solutions to fuel vehicles with different energy sources such as petroleum products, lubes, electricity for EVs and natural gas for NGVs.
          </p>
          <div className="fmx-up relative min-h-0 flex-1 overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5" style={{ ...d(5), background: "linear-gradient(135deg, #0c2740, #0369a1)" }}>
            <img src={P.fleet} alt="Row of commercial fleet vehicles ready for dispatch" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-85" onError={hideImg} />
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,14,26,0.8), transparent 55%)" }} />
            <p className="absolute bottom-3.5 left-4 font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/90">
              Founded 2006 · Listed on EGX 2023
            </p>
          </div>
        </div>
        <div className="col-span-7 grid grid-cols-1 content-stretch gap-3">
          {divisions.map((dv, i) => (
            <div key={dv.label} className="fmx-up relative flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5" style={d(4 + i)}>
              <div aria-hidden className="absolute left-0 top-0 h-full w-[3px]" style={{ background: dv.color }} />
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md" style={{ background: `linear-gradient(135deg, ${dv.color}, ${dv.color}cc)` }}>
                {dv.icon}
              </div>
              <div>
                <div className="font-display text-[17px] font-bold text-[#002060]">{dv.label}</div>
                <div className="text-[16px] text-slate-600">{dv.desc}</div>
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
    { value: "8",      label: "Countries",           sub: "Egypt, GCC, Africa & Greece" },
    { value: "4",      label: "Operating divisions", sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates",        sub: "Across Egypt" },
    { value: "3,400+", label: "Employees",           sub: "Across all divisions" },
  ];
  const regions = [
    { name: "GCC",    desc: "Partnered for Sovereign water-desalination projects." },
    { name: "Africa", desc: "Pursuing gas and power opportunities across sub-Saharan markets." },
    { name: "Greece", desc: "Expanding into European energy infrastructure." },
  ];
  const fleets = ["Commercial & logistics fleets", "Industrial & construction fleets", "Government & municipal fleets", "Tourism & hospitality fleets", "Oil & gas sector vehicles"];
  return (
    <LightSlide color="#0369a1">
      <Header
        color="#0369a1"
        kicker="TAQA Arabia · Regional Presence"
        title="A growing platform across Egypt, the GCC, Africa and Greece"
        photo={P.energy}
        photoAlt="High-voltage power lines against a sunset sky"
      />
      <div className="mb-5 grid shrink-0 grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={m.label} className="fmx-up relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5" style={d(3 + i)}>
            <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, #0369a1, #38bdf8)" }} />
            <div className="bg-clip-text font-display text-[44px] font-bold leading-none text-transparent" style={{ backgroundImage: "linear-gradient(100deg, #0369a1, #38bdf8)" }}>
              {m.value}
            </div>
            <div className="mt-2 text-[16px] font-semibold text-[#002060]">{m.label}</div>
            <div className="mt-0.5 text-[14px] text-slate-500">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-5">
        <div className="fmx-up rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5" style={d(7)}>
          <div className="flex items-center gap-2.5">
            <Globe className="h-4 w-4 text-[#0369a1]" />
            <h3 className="font-display text-[15px] font-semibold uppercase tracking-[0.22em] text-[#0369a1]">International Expansion</h3>
          </div>
          <div className="mt-4 space-y-3.5">
            {regions.map(r => (
              <div key={r.name} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: "linear-gradient(135deg, #0369a1, #38bdf8)" }}>
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="text-[17px] font-semibold text-[#002060]">{r.name}</div>
                  <div className="text-[16px] leading-snug text-slate-600">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="fmx-up relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ring-1 ring-black/10" style={{ ...d(8), background: "linear-gradient(150deg, #071a2e, #0c2740)" }}>
          <img src={P.energy} alt="Energy transmission infrastructure at dusk" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" onError={hideImg} />
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(150deg, rgba(5,14,26,0.7), rgba(3,105,161,0.35))" }} />
          <div className="relative">
            <h3 className="font-display text-[15px] font-semibold uppercase tracking-[0.22em] text-[#7dd3fc]">Geographic Footprint</h3>
            <p className="mt-2.5 text-[16px] leading-snug text-white/85">
              Concessions in 8 Egyptian governorates. TAQA serves the full spectrum of fleet and mobility clients:
            </p>
            <div className="mt-3 space-y-1.5">
              {fleets.map(f => (
                <div key={f} className="flex items-center gap-2.5 text-[16px] text-white/90">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#38bdf8]" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Slide 3: In Numbers ─────────────────────────────────────────────────────

function NumbersSlide() {
  const heroes = [
    { value: "EGP 13.4bn", label: "Revenue",                   sub: "FY 2025" },
    { value: "EGP 1.5bn",  label: "EBITDA",                    sub: "FY 2025" },
    { value: "~6.5M",      label: "Residential gas customers", sub: "Active connections" },
  ];
  const divisions = [
    { div: "GAS",       icon: <Flame className="h-4 w-4" />, color: "#059669", stats: ["86 CNG stations", "18 conversion centers", "Capacity 12K cars/year", "Master Gas virtual pipeline"] },
    { div: "POWER",     icon: <Zap className="h-4 w-4" />,   color: "#FFC10E", stats: ["+130 charging stations", "1st private EV licence", "Waqood EnerTech", "AC & DC fast chargers"] },
    { div: "PETROLEUM", icon: <Truck className="h-4 w-4" />, color: "#b45309", stats: ["230+ fuel stations", "172 Wataniya", "2 fuel terminals", "Suez & Alexandria"] },
    { div: "MOBILITY",  icon: <Car className="h-4 w-4" />,   color: "#0369a1", stats: ["Fuel · CNG · EV · Waqood", "One account, one SLA", "Fleet card & cashless", "Consolidated billing"] },
  ];
  return (
    <LightSlide color="#0369a1">
      <Header
        color="#0369a1"
        kicker="TAQA Arabia · In Numbers"
        title="The scale behind a single residential utility partner — FY 2025"
        photo={P.fuel}
        photoAlt="Fuel station forecourt with pumps in warm light"
      />
      <div className="mb-5 grid shrink-0 grid-cols-3 gap-4">
        {heroes.map((m, i) => (
          <div key={m.label} className="fmx-up relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ring-1 ring-white/10" style={{ ...d(3 + i), background: "linear-gradient(135deg, #071a2e, #0c2740)" }}>
            <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, #0369a1, #38bdf8)" }} />
            <div aria-hidden className="absolute -right-10 -top-12 h-40 w-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%)" }} />
            <div className="bg-clip-text font-display text-[38px] font-bold leading-none text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #7dd3fc, #38bdf8)" }}>
              {m.value}
            </div>
            <div className="mt-2 text-[16px] font-semibold text-white/95">{m.label}</div>
            <div className="mt-0.5 text-[14px] text-white/60">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-4 gap-4">
        {divisions.map((dv, i) => (
          <div key={dv.div} className="fmx-up relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5" style={d(6 + i)}>
            <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: dv.color }} />
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${dv.color}, ${dv.color}cc)` }}>
                {dv.icon}
              </div>
              <span className="font-display text-[15px] font-bold tracking-[0.14em] text-[#002060]">{dv.div}</span>
            </div>
            <div className="space-y-1.5">
              {dv.stats.map(s => (
                <div key={s} className="flex items-start gap-2">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dv.color }} />
                  <span className="text-[16px] leading-snug text-slate-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LightSlide>
  );
}

// ─── Slide 4: Fleet Challenge ─────────────────────────────────────────────────

function FleetChallengeSlide() {
  const pains = [
    { label: "HIGH FUEL COST",           desc: "Diesel and petrol are the biggest operating cost — volatile, exposed to every oil-price spike.", color: "#dc2626" },
    { label: "FRAGMENTED SUPPLIERS",     desc: "Fuel, gas, chargers and software from separate vendors — no single view or accountability.",     color: "#b45309" },
    { label: "FUEL LEAKAGE & FRAUD",     desc: "Cash, paper receipts and no per-vehicle control quietly inflate the bill.",                      color: "#7c3aed" },
    { label: "RISING CARBON & CITY RISK", desc: "100% combustion means maximum emissions and exposure to low-emission zones.",                   color: "#059669" },
  ];
  return (
    <DarkSlide photo={P.fleet} alt="Heavy trucks lined up at a fuel depot">
      <div className="fmx-up" style={d(0)}>
        <Chip dark color="#dc2626" label="Fleet & Mobility · The Challenge" />
      </div>
      <h2 className="fmx-up mt-4 font-display text-[42px] font-bold leading-[1.08] tracking-tight text-white" style={d(1)}>
        The fleet operator's energy challenge
      </h2>
      <div className="mt-7 grid flex-1 grid-cols-2 gap-4">
        {pains.map((c, i) => (
          <div key={c.label} className={`fmx-up relative overflow-hidden ${GLASS} p-5`} style={d(2 + i)}>
            <div aria-hidden className="absolute left-0 top-0 h-full w-[3px]" style={{ background: c.color }} />
            <div className="font-display text-[15px] font-semibold uppercase tracking-[0.22em]" style={{ color: lite(c.color) }}>{c.label}</div>
            <p className="mt-2 text-[17px] leading-relaxed text-white/85">{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="fmx-up mt-4 shrink-0 rounded-2xl p-5 ring-1 ring-white/15" style={{ ...d(6), background: "linear-gradient(100deg, rgba(3,105,161,0.4), rgba(56,189,248,0.14))" }}>
        <div className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-[#38bdf8]" />
          <h3 className="font-display text-[15px] font-semibold uppercase tracking-[0.22em] text-[#7dd3fc]">TAQA's Answer</h3>
        </div>
        <p className="mt-2 text-[17px] leading-relaxed text-white/90">
          A managed energy transition from <strong className="font-semibold text-white">diesel today</strong> → <strong className="font-semibold text-[#6ee7b7]">CNG as the bridge</strong> → <strong className="font-semibold text-[#c4b5fd]">EV as the destination</strong> — financed and staged at the fleet's own pace. One partner, one account, one Waqood dashboard.
        </p>
      </div>
    </DarkSlide>
  );
}

// ─── Slide 5: Mobility Energy Pathway ────────────────────────────────────────

function PathwaySlide() {
  const stages = [
    { label: "NOW",    title: "Optimise the Combustion Fleet", desc: "Consolidate diesel and petrol under one Waqood account with depot fuelling — squeeze cost and visibility out of the fleet you run today.",                            color: "#b45309", icon: <Truck className="h-5 w-5" /> },
    { label: "BRIDGE", title: "Convert to Natural Gas",        desc: "Convert suitable vehicles to CNG and fuel them via the station network or the Master Gas mobile virtual pipeline — the fastest payback in the transition, up to ~40% lower fuel cost.", color: "#059669", icon: <Flame className="h-5 w-5" /> },
    { label: "FUTURE", title: "Electrify the Fleet",           desc: "Roll out depot and en-route charging — backed by TAQA Power's EV licence and distribution expertise.",                                                               color: "#7c3aed", icon: <Zap className="h-5 w-5" /> },
  ];
  return (
    <LightSlide color="#0369a1">
      <Header
        color="#0369a1"
        kicker="Fleet & Mobility · The Pathway"
        title="Diesel today, natural gas as the bridge, electric as the destination — at your pace"
        photo={P.road}
        photoAlt="Open highway stretching toward the horizon"
      />
      <div className="fmx-up relative mb-4 shrink-0" style={d(3)}>
        <div aria-hidden className="absolute left-[16%] right-[16%] top-1/2 h-[2px] -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(90deg, #b45309, #059669, #7c3aed)", opacity: 0.3 }} />
        <div className="relative grid grid-cols-3">
          {stages.map(s => (
            <div key={s.label} className="flex justify-center">
              <span className="rounded-full px-4 py-1.5 font-display text-[14px] font-bold uppercase tracking-[0.22em] text-white shadow-md" style={{ background: `linear-gradient(100deg, ${s.color}, ${lite(s.color)})` }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-5">
        {stages.map((s, i) => (
          <div key={s.label} className="fmx-up relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5" style={d(4 + i)}>
            <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${s.color}, ${lite(s.color)})` }} />
            {i < 2 && (
              <div aria-hidden className="absolute -right-3 top-1/2 z-10 -translate-y-1/2">
                <ArrowRight className="h-5 w-5 text-slate-300" />
              </div>
            )}
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md" style={{ background: `linear-gradient(135deg, ${s.color}, ${lite(s.color)})` }}>
              {s.icon}
            </div>
            <h3 className="font-display text-[17px] font-bold leading-snug text-[#002060]">{s.title}</h3>
            <p className="mt-2 flex-1 text-[16px] leading-relaxed text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="fmx-up mt-4 shrink-0 rounded-2xl px-5 py-3.5" style={{ ...d(7), background: "#0369a10a", boxShadow: "inset 0 0 0 1px #0369a11f" }}>
        <p className="text-center text-[16px] leading-relaxed text-slate-600">
          <strong className="font-semibold text-[#002060]">TAQA finances and manages each step,</strong> so the fleet moves down the cost-and-carbon curve at its own pace — never stranded, never forced.
        </p>
      </div>
    </LightSlide>
  );
}

// ─── Slide 6: Solutions Overview ─────────────────────────────────────────────

function SolutionsOverviewSlide() {
  const solutions = [
    { num: "01", label: "Fuel Stations",       desc: "Keep today's fleet moving — diesel and gasoline from a nationwide TAQA-operated station network and two terminals.",                       icon: <Truck className="h-5 w-5" />,     color: "#b45309" },
    { num: "02", label: "Natural Gas (CNG)",   desc: "Convert the fleet you own to gas — licensed NGV conversion plus TAQA's CNG network and the Master Gas mobile virtual pipeline.",           icon: <Flame className="h-5 w-5" />,     color: "#059669" },
    { num: "03", label: "EV Charging",         desc: "Electrify with the holder of Egypt's first private EV-charging licence — depot, destination and en-route AC/DC charging, end-to-end.",     icon: <Zap className="h-5 w-5" />,       color: "#7c3aed" },
    { num: "04", label: "Waqood Smart System", desc: "See and control the whole fleet from one screen — fuel, CNG and EV data in a single dashboard.",                                           icon: <BarChart2 className="h-5 w-5" />, color: "#0369a1" },
  ];
  return (
    <LightSlide color="#0369a1">
      <Header
        color="#0369a1"
        kicker="Fleet & Mobility · Solutions Overview"
        title="Solutions Overview"
        sub="The following slides detail every service TAQA Arabia's mobility sector offers to fleets."
        photo={P.fleet}
        photoAlt="Fleet of delivery vans parked in formation"
      />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-5">
        {solutions.map((s, i) => (
          <div key={s.num} className="fmx-up relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5" style={d(3 + i)}>
            <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${s.color}, ${lite(s.color)})` }} />
            <div aria-hidden className="absolute -top-3 right-4 select-none font-display text-[84px] font-bold leading-none tracking-tighter" style={{ color: s.color, opacity: 0.08 }}>
              {s.num}
            </div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md" style={{ background: `linear-gradient(135deg, ${s.color}, ${lite(s.color)})` }}>
              {s.icon}
            </div>
            <h3 className="font-display text-[18px] font-bold text-[#002060]">{s.label}</h3>
            <p className="mt-1.5 text-[16px] leading-relaxed text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </LightSlide>
  );
}

// ─── Reusable: FleetScopeSlide ────────────────────────────────────────────────

interface FleetScopeSlideProps {
  num: string;
  title: string;
  subtitle: string;
  color: string;
  icon: ReactNode;
  taqaInvests: string[];
  steps: { n: number; text: string }[];
  receive: string[];
  photo: string;
  photoAlt: string;
}

function FleetScopeSlide({ num, title, subtitle, color, icon, taqaInvests, steps, receive, photo, photoAlt }: FleetScopeSlideProps) {
  return (
    <LightSlide color={color} ghost={`0${num}`}>
      <Header
        color={color}
        icon={icon}
        kicker={`Solution 0${num} · Fleet & Mobility`}
        title={title}
        sub={subtitle}
        titleSize={34}
        photo={photo}
        photoAlt={photoAlt}
      />
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-5">
        <div className="fmx-up rounded-2xl p-5" style={{ ...d(3), background: `${color}0a`, boxShadow: `inset 0 0 0 1px ${color}24` }}>
          <h3 className="font-display text-[15px] font-semibold uppercase tracking-[0.22em]" style={{ color }}>TAQA Invests</h3>
          <div className="mt-4 space-y-2.5">
            {taqaInvests.map(item => (
              <div key={item} className="flex items-start gap-2.5">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                <span className="text-[16px] leading-snug text-slate-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="fmx-up rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5" style={d(4)}>
          <h3 className="font-display text-[15px] font-semibold uppercase tracking-[0.22em] text-[#002060]">How It Works</h3>
          <div className="relative mt-4">
            <div aria-hidden className="absolute bottom-3 left-[11px] top-2 w-[2px] rounded-full" style={{ background: `${color}2e` }} />
            {steps.map((s, i) => (
              <div key={s.n} className="fmx-up relative flex gap-3 pb-3 last:pb-0" style={d(5 + i)}>
                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-[14px] font-bold text-white shadow-md" style={{ background: `linear-gradient(135deg, ${color}, ${lite(color)})` }}>
                  {s.n}
                </div>
                <span className="pt-0.5 text-[16px] leading-snug text-slate-600">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="fmx-up relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ring-1 ring-black/10" style={{ ...d(5), background: "linear-gradient(150deg, #071a2e, #0c2740)" }}>
          <img src={photo} alt={photoAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" onError={hideImg} />
          <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(150deg, rgba(5,14,26,0.75), ${color}40)` }} />
          <div className="relative">
            <h3 className="font-display text-[15px] font-semibold uppercase tracking-[0.22em]" style={{ color: lite(color) }}>What You Receive</h3>
            <div className="mt-4 space-y-3">
              {receive.map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: lite(color) }} />
                  <span className="text-[16px] leading-snug text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Reusable: FleetValuePropSlide ───────────────────────────────────────────

interface FleetValuePropSlideProps {
  num: string;
  title: string;
  color: string;
  icon: ReactNode;
  gains: { label: string; desc: string }[];
  edge: { label: string; desc: string }[];
  photo: string;
  photoAlt: string;
}

function FleetValuePropSlide({ num, title, color, icon, gains, edge, photo, photoAlt }: FleetValuePropSlideProps) {
  return (
    <LightSlide color={color} ghost={`0${num}`}>
      <Header
        color={color}
        icon={icon}
        kicker={`Solution 0${num} · Value Proposition`}
        title={title}
        titleSize={34}
        photo={photo}
        photoAlt={photoAlt}
      />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-6">
        <div className="min-h-0">
          <div className="fmx-up mb-3 flex items-center gap-2.5" style={d(3)}>
            <span aria-hidden className="h-[3px] w-8 rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${lite(color)})` }} />
            <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-slate-500">What You Gain</p>
          </div>
          <div className="space-y-2.5">
            {gains.map((g, i) => (
              <div key={g.label} className="fmx-up flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5" style={d(4 + i)}>
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}14` }}>
                  <CheckCircle2 className="h-4 w-4" style={{ color }} />
                </span>
                <div>
                  <div className="text-[17px] font-semibold text-[#002060]">{g.label}</div>
                  <div className="mt-0.5 text-[16px] leading-snug text-slate-600">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="min-h-0">
          <div className="fmx-up mb-3 flex items-center gap-2.5" style={d(4)}>
            <span aria-hidden className="h-[3px] w-8 rounded-full" style={{ background: "linear-gradient(90deg, #002060, #0369a1)" }} />
            <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-slate-500">TAQA Arabia Edge</p>
          </div>
          <div className="space-y-2.5">
            {edge.map((e, i) => (
              <div key={e.label} className="fmx-up flex items-start gap-3 rounded-2xl p-3.5 shadow-md ring-1 ring-black/10" style={{ ...d(5 + i), background: "linear-gradient(120deg, #071a2e, #0c2740)" }}>
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Star className="h-4 w-4" style={{ color: lite(color) }} />
                </span>
                <div>
                  <div className="text-[17px] font-semibold text-white">{e.label}</div>
                  <div className="mt-0.5 text-[16px] leading-snug text-white/80">{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Reusable: FleetTimelineSlide ────────────────────────────────────────────

interface FleetTimelineSlideProps {
  num: string;
  title: string;
  color: string;
  icon: ReactNode;
  phases: { range: string; label: string; desc: string }[];
  groups: { label: string; range: string; color: string }[];
  photo: string;
  photoAlt: string;
}

function FleetTimelineSlide({ num, title, color, icon, phases, groups, photo, photoAlt }: FleetTimelineSlideProps) {
  return (
    <LightSlide color={color} ghost={`0${num}`}>
      <Header
        color={color}
        icon={icon}
        kicker={`Solution 0${num} · Implementation Timeline`}
        title={title}
        titleSize={34}
        photo={photo}
        photoAlt={photoAlt}
      />
      <div className="mb-5 flex shrink-0 gap-2.5">
        {groups.map((g, i) => (
          <div key={g.label} className="fmx-up relative flex-1 overflow-hidden rounded-xl px-4 py-3 text-white shadow-md" style={{ ...d(3 + i), background: `linear-gradient(100deg, ${g.color}, ${g.color}d9)` }}>
            <div aria-hidden className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
            <div className="font-display text-[15px] font-bold uppercase tracking-[0.22em]">{g.label}</div>
            <div className="mt-0.5 text-[14px] font-medium text-white/80">{g.range}</div>
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 content-stretch gap-4">
        {phases.map((p, i) => (
          <div key={i} className="fmx-up relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5" style={d(6 + i)}>
            <div aria-hidden className="absolute left-0 top-0 h-full w-[3px]" style={{ background: `linear-gradient(180deg, ${color}, ${lite(color)})` }} />
            <div className="mb-1.5 flex items-center gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-[14px] font-bold text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${color}, ${lite(color)})` }}>
                {i + 1}
              </div>
              <span className="font-display text-[14px] font-semibold uppercase tracking-[0.14em] text-slate-500">{p.range}</span>
            </div>
            <div className="text-[17px] font-bold text-[#002060]">{p.label}</div>
            <p className="mt-1 text-[16px] leading-snug text-slate-600">{p.desc}</p>
          </div>
        ))}
      </div>
    </LightSlide>
  );
}

// ─── Reusable: FleetTrackRecordSlide ─────────────────────────────────────────

interface FleetTrackRecordSlideProps {
  num: string;
  title: string;
  color: string;
  icon: ReactNode;
  headline: string;
  subheadline: string;
  body: string;
  stats: { value: string; label: string }[];
  photo: string;
  photoAlt: string;
}

function FleetTrackRecordSlide({ num, title, color, icon, headline, subheadline, body, stats, photo, photoAlt }: FleetTrackRecordSlideProps) {
  return (
    <DarkSlide photo={photo} alt={photoAlt}>
      <div className="fmx-up flex items-center gap-3" style={d(0)}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-md" style={{ background: `linear-gradient(135deg, ${color}, ${lite(color)})` }}>
          {icon}
        </div>
        <Chip dark color={color} label={`Solution 0${num} · Proven Track Record`} />
      </div>
      <h2 className="fmx-up mt-4 font-display text-[38px] font-bold leading-[1.08] tracking-tight text-white" style={d(1)}>
        {title}
      </h2>
      <div className="mt-7 grid min-h-0 flex-1 grid-cols-12 gap-6">
        <div className={`fmx-up col-span-7 flex flex-col ${GLASS} p-6`} style={d(2)}>
          <div className="flex items-center gap-2.5">
            <Star className="h-5 w-5 shrink-0" style={{ color: lite(color) }} />
            <h3 className="font-display text-[20px] font-bold leading-snug text-white">{headline}</h3>
          </div>
          <p className="mt-1.5 text-[16px] font-semibold" style={{ color: lite(color) }}>{subheadline}</p>
          <p className="mt-3 text-[17px] leading-relaxed text-white/85">{body}</p>
        </div>
        <div className="col-span-5 grid grid-cols-2 content-stretch gap-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`fmx-up relative flex flex-col justify-center overflow-hidden ${GLASS} p-4`} style={d(3 + i)}>
              <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, ${lite(color)})` }} />
              <div className="bg-clip-text font-display text-[34px] font-bold leading-none text-transparent" style={{ backgroundImage: `linear-gradient(95deg, ${lite(color)}, #e2e8f0)` }}>
                {s.value}
              </div>
              <div className="mt-2 text-[12.5px] leading-snug text-white/80">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </DarkSlide>
  );
}

// ─── Slide 23: Why One Partner ────────────────────────────────────────────────

function WhyOnePartnerSlide() {
  const pillars = [
    { label: "One SLA",                     desc: "A single service-level agreement governs fuel, gas, conversion, charging and Waqood — one uptime guarantee, one renewal." },
    { label: "One Communication Point",     desc: "A single account team and 24/7 hotline — no chasing multiple contractors." },
    { label: "One Commercial Relationship", desc: "Consolidated billing, aligned contract terms and a single negotiation." },
    { label: "One Engineering Standard",    desc: "Solutions designed to interoperate — shared accounts, shared monitoring." },
    { label: "One Accountable Owner",       desc: "End-to-end responsibility removes interface risk." },
  ];
  const services = [
    { label: "Fuel Stations",       color: "#f59e0b" },
    { label: "Natural Gas (CNG)",   color: "#34d399" },
    { label: "EV Charging",         color: "#a78bfa" },
    { label: "Waqood Smart System", color: "#38bdf8" },
  ];
  return (
    <LightSlide color="#002060">
      <Header
        color="#002060"
        kicker="Closing · Why One Partner"
        title="The TAQA One-Stop-Shop"
        sub="One SLA, one communication point, one accountable operator — across every utility in the fleet."
      />
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        <div className="fmx-up relative col-span-5 flex flex-col overflow-hidden rounded-2xl p-5 text-white shadow-lg ring-1 ring-black/10" style={{ ...d(3), background: "linear-gradient(150deg, #071a2e, #0c2740)" }}>
          <img src={P.fleet} alt="Commercial fleet vehicles operating as one unified network" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-10" onError={hideImg} />
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(150deg, rgba(5,14,26,0.75), rgba(3,105,161,0.3))" }} />
          <div className="relative flex flex-1 flex-col">
            <h3 className="font-display text-[15px] font-semibold uppercase tracking-[0.22em] text-[#7dd3fc]">
              TAQA Arabia — Mobility Solutions
            </h3>
            <p className="mt-1 text-[15px] text-white/70">Fuel · CNG · Waqood · EV Charging</p>
            <div className="mt-4 space-y-2.5">
              {services.map((s, i) => (
                <div key={s.label} className={`fmx-up flex items-center gap-3 ${GLASS} px-4 py-2.5`} style={d(4 + i)}>
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="text-[14.5px] font-semibold text-white/95">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto border-t border-white/10 pt-3.5">
              <p className="flex items-center gap-2 text-[15px] font-medium text-white/75">
                From Fragmented Vendors <ArrowRight className="h-3.5 w-3.5 text-[#38bdf8]" /> A Single Operator
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-7">
          <div className="relative">
            <div aria-hidden className="absolute bottom-6 left-[13px] top-4 w-[2px] rounded-full bg-[#00206026]" />
            <div className="space-y-2.5">
              {pillars.map((p, i) => (
                <div key={p.label} className="fmx-up relative flex items-start gap-3.5" style={d(4 + i)}>
                  <div className="relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-[14px] font-bold text-white shadow-md" style={{ background: "linear-gradient(135deg, #002060, #0369a1)" }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-black/5">
                    <div className="text-[17px] font-bold text-[#002060]">{p.label}</div>
                    <div className="mt-0.5 text-[16px] leading-snug text-slate-600">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

// ─── Slide 24: Integrated Economics ──────────────────────────────────────────

function IntegratedEconomicsSlide() {
  const todayItems = [
    { label: "High, volatile fuel bill",  desc: "Diesel and petrol are the biggest cost — exposed to every oil-price spike." },
    { label: "Fragmented suppliers",      desc: "Fuel, gas, chargers and software from separate vendors — no single view." },
    { label: "Fuel leakage & fraud",      desc: "Cash, paper receipts and no per-vehicle control quietly inflate the bill." },
    { label: "Rising carbon & city risk", desc: "100% combustion means maximum emissions and low-emission zone exposure." },
  ];
  const taqaItems = [
    { label: "Up to ~40% lower fuel cost", desc: "CNG and EV displace the most expensive litres — predictable, managed pricing (illustrative)." },
    { label: "One partner, one account",   desc: "Fuel, gas, conversion, charging and Waqood under a single SLA." },
    { label: "Leakage designed out",       desc: "Waqood PINs, limits and verified readings stop unauthorized and phantom fuelling." },
    { label: "Falling carbon, every year", desc: "Each step down the pathway cuts CO₂ — near-zero once the fleet reaches EV." },
  ];
  return (
    <LightSlide color="#002060">
      <Header
        color="#002060"
        kicker="Closing · Integrated Economics"
        title="The Integrated Economics: Diesel-Only vs. TAQA"
        sub="Why a managed energy mix beats a diesel-only fleet — and widens the gap every year."
        titleSize={36}
        photo={P.road}
        photoAlt="Highway traffic streaking past at night"
      />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-6">
        <div>
          <div className="fmx-up mb-3 flex items-center gap-2.5" style={d(3)}>
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#dc2626]" />
            <h3 className="font-display text-[15px] font-semibold uppercase tracking-[0.22em] text-[#dc2626]">Today — Diesel-Only Fleet</h3>
          </div>
          <div className="space-y-2.5">
            {todayItems.map((item, i) => (
              <div key={item.label} className="fmx-up relative overflow-hidden rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-black/5" style={d(4 + i)}>
                <div aria-hidden className="absolute left-0 top-0 h-full w-[3px] bg-[#dc2626]" />
                <div className="text-[14.5px] font-semibold text-[#002060]">{item.label}</div>
                <div className="mt-0.5 text-[16px] leading-snug text-slate-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="fmx-up mb-3 flex items-center gap-2.5" style={d(4)}>
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#059669]" />
            <h3 className="font-display text-[15px] font-semibold uppercase tracking-[0.22em] text-[#059669]">With TAQA — Integrated Mix</h3>
          </div>
          <div className="space-y-2.5">
            {taqaItems.map((item, i) => (
              <div key={item.label} className="fmx-up relative overflow-hidden rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-black/5" style={d(5 + i)}>
                <div aria-hidden className="absolute left-0 top-0 h-full w-[3px] bg-[#059669]" />
                <div className="text-[14.5px] font-semibold text-[#002060]">{item.label}</div>
                <div className="mt-0.5 text-[16px] leading-snug text-slate-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fmx-up mt-5 shrink-0 rounded-2xl px-5 py-3.5 ring-1 ring-black/10" style={{ ...d(9), background: "linear-gradient(100deg, #071a2e, #0c2740)" }}>
        <p className="text-center text-[16px] leading-relaxed text-white/90">
          The result: a lower and more predictable cost per kilometre, fewer suppliers, controlled fuel spend and a steadily stronger ESG story — from one partner, financed and staged at your pace.
        </p>
      </div>
    </LightSlide>
  );
}

// ─── Slide 25: Closing ────────────────────────────────────────────────────────

function ClosingSlide() {
  const proof = [
    { label: "Fuel Stations",     stat: "230+ stations under management",                                icon: <Truck className="h-4 w-4" />,     color: "#b45309" },
    { label: "Natural Gas (CNG)", stat: "86 CNG stations operating",                                     icon: <Flame className="h-4 w-4" />,     color: "#059669" },
    { label: "EV Charging",       stat: "1st EV-charging licence in Egypt · 130+ EV charge points live", icon: <Zap className="h-4 w-4" />,       color: "#7c3aed" },
    { label: "Waqood",            stat: "One dashboard for every energy type",                           icon: <BarChart2 className="h-4 w-4" />, color: "#0369a1" },
  ];
  return (
    <DarkSlide photo={P.ev} alt="Electric vehicle plugged into a charging station">
      <div className="fmx-up" style={d(0)}>
        <Chip dark color="#002060" label="Fleet & Mobility · Closing" />
      </div>
      <h2 className="fmx-up mt-4 max-w-[1000px] font-display text-[44px] font-bold leading-[1.06] tracking-tight text-white" style={d(1)}>
        From Pump to Plug: Your Fleet's Energy Partner
      </h2>
      <p className="fmx-up mt-3 text-[16px] text-white/80" style={d(2)}>
        One partner for every kilometre — today's diesel to tomorrow's electric.
      </p>
      <div className="mt-7 grid min-h-0 flex-1 grid-cols-2 gap-6">
        <div className={`fmx-up flex flex-col ${GLASS} p-6`} style={d(3)}>
          <div className="fmx-grow h-[3px] w-12 rounded-full" style={{ ...d(4), background: "linear-gradient(90deg, #0369a1, #38bdf8)" }} />
          <p className="mt-4 text-[17px] leading-relaxed text-white/90">
            From pump to plug, TAQA fuels every kilometre your fleet will ever drive. Egypt's largest private energy developer is the single partner that can move your fleet from diesel today to electric tomorrow — fuel, CNG, conversion, charging and the Waqood platform that ties them together, financed and measured at every step.
          </p>
          <p className="mt-auto border-t border-white/10 pt-4 font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/60">
            A World OF ENERGY · TAQA Arabia
          </p>
        </div>
        <div className="flex flex-col justify-between gap-3">
          {proof.map((s, i) => (
            <div key={s.label} className={`fmx-up flex flex-1 items-center gap-4 ${GLASS} px-5 py-3`} style={d(4 + i)}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md" style={{ background: `linear-gradient(135deg, ${s.color}, ${lite(s.color)})` }}>
                {s.icon}
              </div>
              <div>
                <div className="text-[17px] font-bold text-white">{s.label}</div>
                <div className="text-[13.5px] leading-snug text-white/75">{s.stat}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DarkSlide>
  );
}

// ─── All Slides ───────────────────────────────────────────────────────────────

const SLIDES = [
  // 0
  { title: "Cover",                          render: () => <CoverSlide /> },
  // 1
  { title: "About TAQA Arabia",              render: () => <AboutSlide /> },
  // 2
  { title: "Regional Presence",              render: () => <RegionalSlide /> },
  // 3
  { title: "In Numbers",                     render: () => <NumbersSlide /> },
  // 4
  { title: "The Fleet Challenge",            render: () => <FleetChallengeSlide /> },
  // 5
  { title: "The Mobility Energy Pathway",    render: () => <PathwaySlide /> },
  // 6
  { title: "Solutions Overview",             render: () => <SolutionsOverviewSlide /> },
  // 7
  {
    title: "Fuel Stations: Scope",
    render: () => (
      <FleetScopeSlide
        num="1" title="Fuel Stations: Scope & How It Works"
        subtitle="Keep today's fleet moving — diesel and gasoline from a nationwide TAQA-operated station network and two owned terminals."
        color="#b45309" icon={<Truck className="w-5 h-5" />} photo={P.fuel}
        photoAlt="Fuel station forecourt with pumps in warm light"
        taqaInvests={["National station network & depot fuelling", "Two owned terminals (Suez & Alexandria)", "Quality-assured supply chain", "Cashless fleet-card system", "Consolidated billing & reporting"]}
        steps={[
          { n: 1, text: "Fleet profiled — fuel type, volume and routes mapped." },
          { n: 2, text: "Account activated for cashless fuelling across the network." },
          { n: 3, text: "Depot or on-site fuelling installed where required." },
          { n: 4, text: "Fleet refuels at TAQA/Wataniya stations or depot bowsers." },
          { n: 5, text: "Consumption reported monthly — one consolidated bill." },
        ]}
        receive={["Nationwide fuelling access", "Depot & on-site supply options", "Spec-compliant, quality-assured fuel", "One consolidated bill"]}
      />
    ),
  },
  // 8
  {
    title: "Fuel Stations: Value Proposition",
    render: () => (
      <FleetValuePropSlide
        num="1" title="Fuel Stations: Value Proposition"
        color="#b45309" icon={<Truck className="w-5 h-5" />} photo={P.fuel}
        photoAlt="Fuel station forecourt with pumps in warm light"
        gains={[
          { label: "Depot & On-Site Fueling",   desc: "Bulk and on-site delivery keep heavy fleets fueled at base — no detours, no queueing." },
          { label: "Spec-Compliant Supply",     desc: "Quality-assured fuel from owned terminals protects engines, warranties and resale value." },
          { label: "Predictable Fuel Spend",    desc: "Consolidated billing and consumption reporting turn fuel from a blind cost into a managed, forecastable line." },
          { label: "A Single Point of Contact", desc: "One TAQA account team handles fuel, delivery and logistics — no juggling multiple suppliers." },
        ]}
        edge={[
          { label: "Assured Fuel Quality",     desc: "Two owned terminals and a controlled logistics chain — traceable, spec-compliant fuel." },
          { label: "Nationwide Fueling Reach", desc: "230+ stations (TAQA + Wataniya/Quick Fuel) covering Egypt's major corridors." },
          { label: "Fleet Card & Cashless",    desc: "Per-driver and per-vehicle fuel cards eliminate cash and paper receipts." },
          { label: "Depot Fuelling Option",    desc: "On-site tanks and bowsers keep heavy fleets fueled without leaving the base." },
        ]}
      />
    ),
  },
  // 9
  {
    title: "Fuel Stations: Timeline",
    render: () => (
      <FleetTimelineSlide
        num="1" title="Fuel Stations: Implementation Timeline"
        color="#b45309" icon={<Truck className="w-5 h-5" />} photo={P.fuel}
        photoAlt="Fuel station forecourt with pumps in warm light"
        phases={[
          { range: "Day 0–7",   label: "Account Setup",      desc: "Fleet profiling, fuel account & credit terms." },
          { range: "Day 7–14",  label: "Network Activation", desc: "Station access & depot survey." },
          { range: "Day 14–30", label: "Depot Fuelling",     desc: "On-site tank/bowser install where needed." },
          { range: "Day 30+",   label: "Live Fuelling",      desc: "Cashless refuelling across the network." },
          { range: "Monthly",   label: "Reporting",          desc: "Consolidated billing & consumption analytics." },
          { range: "Ongoing",   label: "Optimisation",       desc: "Route, supply & spend reviews." },
        ]}
        groups={[
          { label: "SET UP", range: "Day 0–14",  color: "#b45309" },
          { label: "DEPLOY", range: "Day 14–30", color: "#92400e" },
          { label: "MANAGE", range: "Ongoing",   color: "#78350f" },
        ]}
      />
    ),
  },
  // 10
  {
    title: "Fuel Stations: Track Record",
    render: () => (
      <FleetTrackRecordSlide
        num="1" title="Fuel Stations: Proven Track Record"
        color="#b45309" icon={<Truck className="w-5 h-5" />} photo={P.fuel}
        photoAlt="Fuel station forecourt with pumps in warm light"
        headline="TAQA Petroleum — National Fuelling Backbone"
        subheadline="A fuel-marketing network built over two decades — and growing fast."
        body="TAQA Petroleum was the first privately owned Egyptian company licensed to supply fuel, operating its own retail stations and two storage terminals in Suez and Alexandria. In 2026 it took over management of 172 Wataniya stations through Quick Fuel — a major step-change in reach. It is the dependable foundation that keeps commercial fleets fuelled today, and the same accredited partner behind the gas and EV infrastructure of tomorrow."
        stats={[
          { value: "230+", label: "Wataniya stations + own stations" },
          { value: "1st",  label: "Private fuel licence in Egypt" },
          { value: "2",    label: "Owned storage terminals" },
          { value: "43+",  label: "Terminal capacities in litres" },
        ]}
      />
    ),
  },
  // 11
  {
    title: "Natural Gas (CNG): Scope",
    render: () => (
      <FleetScopeSlide
        num="2" title="Natural Gas (CNG): Scope & How It Works"
        subtitle="Convert the fleet you own to gas — and fuel it: licensed NGV conversion plus TAQA's CNG network and the Master Gas mobile virtual pipeline."
        color="#059669" icon={<Flame className="w-5 h-5" />} photo={P.cng}
        photoAlt="CNG fuelling infrastructure at a natural-gas station"
        taqaInvests={["Licensed conversion workshops across Egypt", "CNG station network (86 stations)", "Master Gas mobile virtual pipeline", "SCADA-monitored dispatch", "Cylinder certification & re-testing"]}
        steps={[
          { n: 1, text: "Fleet assessed — suitable vehicles, routes and payback analysed." },
          { n: 2, text: "Bi-fuel or dedicated CNG chosen; fuelling via network or Master Gas." },
          { n: 3, text: "Licensed conversion — cylinder fitted, safety sign-off." },
          { n: 4, text: "Fleet switches to CNG fuelling via stations or depot." },
          { n: 5, text: "TAQA dispatches refills, re-tests cylinders and monitors uptime." },
        ]}
        receive={["Licensed NGV conversions", "86 CNG stations + mobile pipeline", "Per-vehicle cylinder management", "~40% fuel cost saving"]}
      />
    ),
  },
  // 12
  {
    title: "Natural Gas (CNG): Value Proposition",
    render: () => (
      <FleetValuePropSlide
        num="2" title="Natural Gas (CNG): Value Proposition"
        color="#059669" icon={<Flame className="w-5 h-5" />} photo={P.cng}
        photoAlt="CNG fuelling infrastructure at a natural-gas station"
        gains={[
          { label: "~40% Lower Fuel Cost",      desc: "CNG is structurally cheaper than petrol and diesel — the single fastest lever on operating cost." },
          { label: "Bi-Fuel & Fully Certified", desc: "Bi-fuel keeps petrol as a fallback; conversions, cylinders and stations are licensed and periodically re-tested." },
          { label: "Fastest Payback",           desc: "Conversion cost is typically recovered within months from fuel savings — then it is pure margin." },
          { label: "Cleaner, Quieter Engines",  desc: "Natural gas cuts particulates, NOx and engine noise — better for cities, drivers and ESG." },
        ]}
        edge={[
          { label: "Convert + Fuel, One Partner", desc: "TAQA both converts the vehicle and fuels it — one accountable provider across the whole gas switch." },
          { label: "Conversion Workshops",        desc: "In-house facilities convert and certify fleet vehicles. 20 conversion centers across Egypt." },
          { label: "Master Gas CNG",              desc: "A real, operating CNG network plus a mobile virtual pipeline that fuels depots with no fixed connection." },
          { label: "No Pipeline, No Problem",     desc: "Master Gas brings natural gas to remote depots in days — no waiting years for a fixed connection." },
        ]}
      />
    ),
  },
  // 13
  {
    title: "Natural Gas (CNG): Timeline",
    render: () => (
      <FleetTimelineSlide
        num="2" title="Natural Gas (CNG): Implementation Timeline"
        color="#059669" icon={<Flame className="w-5 h-5" />} photo={P.cng}
        photoAlt="CNG fuelling infrastructure at a natural-gas station"
        phases={[
          { range: "Day 0–10",  label: "Assessment",      desc: "Suitable vehicles, routes & payback." },
          { range: "Day 10–20", label: "Conversion Plan", desc: "Dedicated vs. bi-fuel; fuelling via network, Master Gas or NGV station." },
          { range: "Day 20–45", label: "Conversion",      desc: "Licensed conversion or NGV station build." },
          { range: "Day 45–55", label: "Inspection",      desc: "Certification & safety sign-off." },
          { range: "Day 55–65", label: "Go-Live",         desc: "CNG fuelling across the fleet." },
          { range: "Ongoing",   label: "Re-test & O&M",   desc: "SCADA dispatch & cylinder re-testing." },
        ]}
        groups={[
          { label: "ASSESS",           range: "Day 0–20",  color: "#059669" },
          { label: "CONVERT & SUPPLY", range: "Day 20–65", color: "#047857" },
          { label: "OPERATE",          range: "Ongoing",   color: "#065f46" },
        ]}
      />
    ),
  },
  // 14
  {
    title: "Natural Gas (CNG): Track Record",
    render: () => (
      <FleetTrackRecordSlide
        num="2" title="Natural Gas (CNG): Proven Track Record"
        color="#059669" icon={<Flame className="w-5 h-5" />} photo={P.cng}
        photoAlt="CNG fuelling infrastructure at a natural-gas station"
        headline="Master Gas — Virtual Pipeline & Conversion"
        subheadline="Convert and fuel — run by the operator of the gas network."
        body="Through its Gas division, TAQA Arabia operates 86 CNG stations, runs licensed vehicle-conversion centres, and pioneered mobile CNG in Egypt under the Master Gas brand — a virtual pipeline to sites with no fixed gas infrastructure. Because one partner both converts vehicles and fuels them, natural gas becomes the lowest-cost, lowest-disruption fuel switch a fleet can make."
        stats={[
          { value: "86",     label: "CNG stations operated" },
          { value: "18+",    label: "Licensed conversion centres" },
          { value: "Mobile", label: "Master Gas virtual pipeline" },
          { value: "~40%",   label: "Lower fuel cost (illustrative)" },
        ]}
      />
    ),
  },
  // 15
  {
    title: "EV Charging: Scope",
    render: () => (
      <FleetScopeSlide
        num="3" title="EV Charging: Scope & How It Works"
        subtitle="Electrify with the holder of Egypt's first private EV-charging licence — depot, destination and en-route AC/DC charging, end-to-end."
        color="#7c3aed" icon={<Zap className="w-5 h-5" />} photo={P.ev}
        photoAlt="Electric vehicle connected to a fast charger"
        taqaInvests={["AC & DC charging infrastructure", "Grid-capacity upgrades", "Energy management & load balancing", "Operator/user mobile app", "BOO/BOOT charger financing"]}
        steps={[
          { n: 1, text: "TAQA surveys the depot grid, fleet duty-cycle and charging mix." },
          { n: 2, text: "AC chargers overnight at depot; DC chargers for en-route top-ups." },
          { n: 3, text: "Grid upgrades installed to support charging load." },
          { n: 4, text: "App onboarded — drivers authenticate and charge." },
          { n: 5, text: "TAQA operates, maintains and manages billing." },
        ]}
        receive={["Depot + en-route coverage", "Managed charging & billing app", "24/7 hotline & lifecycle O&M", "Grid-capacity secured"]}
      />
    ),
  },
  // 16
  {
    title: "EV Charging: Value Proposition",
    render: () => (
      <FleetValuePropSlide
        num="3" title="EV Charging: Value Proposition"
        color="#7c3aed" icon={<Zap className="w-5 h-5" />} photo={P.ev}
        photoAlt="Electric vehicle connected to a fast charger"
        gains={[
          { label: "Lowest Energy Cost/Km",   desc: "Electricity per kilometer undercuts both diesel and petrol — the end-state of the cost curve." },
          { label: "Future-Proofed Fleet",    desc: "Charging positions the fleet ahead of regulation, fuel bans and customer demand." },
          { label: "Zero Tailpipe Emissions", desc: "A genuinely zero-emission fleet — the strongest possible ESG and city-access position." },
          { label: "Managed Uptime & App",    desc: "Lifecycle O&M, an operator/user app and a 24/7 hotline keep every charger available and billing." },
        ]}
        edge={[
          { label: "Flexible Financing Options", desc: "TAQA can fund the whole charging network under a profit-share model — zero charging capex." },
          { label: "Depot-to-Highway Coverage",  desc: "Overnight depot AC plus en-route DC fast charging — both the base and the road are covered." },
          { label: "Grid Capacity Secured",      desc: "The power-distribution arm de-risks the hardest part of EV adoption — getting power to site." },
          { label: "One Energy Partner",         desc: "Charging integrates with CNG conversion and fuel management — single account." },
        ]}
      />
    ),
  },
  // 17
  {
    title: "EV Charging: Timeline",
    render: () => (
      <FleetTimelineSlide
        num="3" title="EV Charging: Implementation Timeline"
        color="#7c3aed" icon={<Zap className="w-5 h-5" />} photo={P.ev}
        photoAlt="Electric vehicle connected to a fast charger"
        phases={[
          { range: "Day 0–14",   label: "Site Assessment",  desc: "Grid survey, duty-cycle & site mix." },
          { range: "Day 14–30",  label: "Commercial Model", desc: "Full-investment/profit-share structuring." },
          { range: "Day 30–60",  label: "Supply",           desc: "AC/DC charger & grid-equipment procurement." },
          { range: "Day 60–95",  label: "Installation",     desc: "Install across depot, en-route; grid tie-in." },
          { range: "Day 95–110", label: "Activation",       desc: "App onboarding, testing & go-live." },
          { range: "Day 110+",   label: "O&M & Uptime",     desc: "24/7 monitoring, maintenance & billing." },
        ]}
        groups={[
          { label: "DESIGN",  range: "Day 0–30",   color: "#7c3aed" },
          { label: "BUILD",   range: "Day 30–110", color: "#6d28d9" },
          { label: "OPERATE", range: "Day 110+",   color: "#5b21b6" },
        ]}
      />
    ),
  },
  // 18
  {
    title: "EV Charging: Track Record",
    render: () => (
      <FleetTrackRecordSlide
        num="3" title="EV Charging: Proven Track Record"
        color="#7c3aed" icon={<Zap className="w-5 h-5" />} photo={P.ev}
        photoAlt="Electric vehicle connected to a fast charger"
        headline="Pioneering Egypt's EV-charging rollout from the front."
        subheadline="Egypt's first private EV-charging licence holder."
        body="TAQA Power secured Egypt's first private EV-charging licence and is rolling out AC and DC charging across depot, commercial and highway locations, supported by an operator/user app and a 24/7 hotline. As Egypt's largest private power player, TAQA pairs charging with on-site solar and distribution — a complete green-mobility package."
        stats={[
          { value: "1st",   label: "Private EV-charging licence in Egypt" },
          { value: "130+",  label: "EV charge points live" },
          { value: "AC+DC", label: "Fast chargers" },
          { value: "24/7",  label: "App & hotline support" },
        ]}
      />
    ),
  },
  // 19
  {
    title: "Waqood Smart System: Scope",
    render: () => (
      <FleetScopeSlide
        num="4" title="Waqood Smart System: Scope & How It Works"
        subtitle="See and control the whole fleet from one screen — fuel, CNG and EV data in a single dashboard."
        color="#0369a1" icon={<BarChart2 className="w-5 h-5" />} photo={P.digital}
        photoAlt="Analytics dashboard with live fleet performance charts"
        taqaInvests={["Waqood EnerTech platform", "Per-vehicle stickers & per-driver PINs", "Integration with fuel, CNG & EV stations", "Real-time fraud alerts", "Consolidated analytics & billing"]}
        steps={[
          { n: 1, text: "Vehicles and drivers are scoped and rules configured." },
          { n: 2, text: "Vehicle stickers and per-driver PINs activated." },
          { n: 3, text: "Fuel, CNG and EV data connected to the Waqood platform." },
          { n: 4, text: "Single-pane dashboard goes live with consolidated billing." },
          { n: 5, text: "Analytics, alerts and spend reviews run continuously." },
        ]}
        receive={["One dashboard for fuel, CNG & EV", "Per-driver PINs and daily limits", "Real-time fraud alerts", "Consolidated billing"]}
      />
    ),
  },
  // 20
  {
    title: "Waqood Smart System: Value Proposition",
    render: () => (
      <FleetValuePropSlide
        num="4" title="Waqood Smart System: Value Proposition"
        color="#0369a1" icon={<BarChart2 className="w-5 h-5" />} photo={P.digital}
        photoAlt="Analytics dashboard with live fleet performance charts"
        gains={[
          { label: "One Dashboard",            desc: "Litres, m³ of gas and kWh charged appear in a single dashboard — true total-energy visibility." },
          { label: "Fraud Designed Out",       desc: "Per-driver PINs, daily limits and pump-reading capture make unauthorized or phantom fuelling almost impossible." },
          { label: "Decisions From Data",      desc: "Live consumption and behavior analytics show exactly where cost and waste sit across the fleet." },
          { label: "Higher Asset Utilisation", desc: "Consumption and behavior data surface idle, thirsty and inefficient vehicles to fix." },
        ]}
        edge={[
          { label: "Waqood by EnerTech",              desc: "Waqood is TAQA Arabia's own energy-technology company — the platform is owned, not rented." },
          { label: "TAQA Arabia Diverse Network",     desc: "Utilize TAQA Arabia's network of CNG, fuel and EV stations scattered across Egypt." },
          { label: "One Platform for All Energy Types", desc: "Supports a client's transition from diesel today → CNG tomorrow → EV in the future under a single provider." },
          { label: "Premium Customer Support",        desc: "Dedicated account management and a single communication channel for fast issue resolution." },
        ]}
      />
    ),
  },
  // 21
  {
    title: "Waqood Smart System: Timeline",
    render: () => (
      <FleetTimelineSlide
        num="4" title="Waqood Smart System: Implementation Timeline"
        color="#0369a1" icon={<BarChart2 className="w-5 h-5" />} photo={P.digital}
        photoAlt="Analytics dashboard with live fleet performance charts"
        phases={[
          { range: "Day 0–7",   label: "Discovery",      desc: "Vehicles, drivers & rules scoping." },
          { range: "Day 7–14",  label: "Onboarding",     desc: "Stickers, PINs & limits configured." },
          { range: "Day 14–21", label: "Integration",    desc: "Fuel, CNG & EV data connected." },
          { range: "Day 21–30", label: "Dashboard Live", desc: "Single-pane dashboard & billing live." },
          { range: "Day 30–45", label: "Tuning",         desc: "Limits, alerts & reports refined." },
          { range: "Ongoing",   label: "Optimise",       desc: "Analytics, ESG & savings reviews." },
        ]}
        groups={[
          { label: "ONBOARD",  range: "Day 0–14",  color: "#0369a1" },
          { label: "ACTIVATE", range: "Day 14–30", color: "#075985" },
          { label: "OPTIMISE", range: "Ongoing",   color: "#0c4a6e" },
        ]}
      />
    ),
  },
  // 22
  {
    title: "Waqood Smart System: Track Record",
    render: () => (
      <FleetTrackRecordSlide
        num="4" title="Waqood Smart System: Proven Track Record"
        color="#0369a1" icon={<BarChart2 className="w-5 h-5" />} photo={P.digital}
        photoAlt="Analytics dashboard with live fleet performance charts"
        headline="Waqood · Fleet Dashboard"
        subheadline="Egypt's smart fuel platform, built inside TAQA Arabia."
        body="Waqood is TAQA Arabia's own EnerTech company, built to digitalise fuel payments for fleet operators. A driver scans a vehicle sticker, captures the pump reading and enters a personal PIN before the transaction is approved — while managers set daily limits, receive fraud alerts and watch live analytics on a single dashboard. Extended across fuel, CNG and EV, Waqood turns a complex multi-fuel operation into one optimised, fully reported system."
        stats={[
          { value: "PIN",  label: "Per-driver PINs, limits & alerts" },
          { value: "1",    label: "Dashboard, every fuel type" },
          { value: "Live", label: "Real-time analytics & fraud control" },
          { value: "Own",  label: "EnerTech — a TAQA Arabia company" },
        ]}
      />
    ),
  },
  // 23
  { title: "Why One Partner",      render: () => <WhyOnePartnerSlide /> },
  // 24
  { title: "Integrated Economics", render: () => <IntegratedEconomicsSlide /> },
  // 25
  { title: "From Pump to Plug",    render: () => <ClosingSlide /> },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FleetMobilityClients() {
  return (
    <DeckShell
      title="Fleet & Mobility Clients"
      subtitle="TAQA Arabia · Integrated Energy & Mobility Solutions · Jun 2026"
      sections={SECTIONS}
      slides={SLIDES}
      pdf="fleet-mobility-clients.pdf"
    />
  );
}
