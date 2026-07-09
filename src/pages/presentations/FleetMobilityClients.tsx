import { DeckShell } from "./DeckShell";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import {
  Flame, Zap, Droplets, Truck, Car, Globe, CheckCircle2, ArrowRight, Star, BarChart2, MapPin,
} from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";
import {
  SlideStyles, Kicker, CornerWash, Bracket, BlueprintGrid, ColHead,
  ScopeSlide, ValuePropSlide, TimelineSlide, TrackRecordSlide, d, hideImg, lighter,
} from "./slides";

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
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0c0a09 0%, #1c1917 55%, #292524 100%)" }}
    >
      <SlideStyles />
      <img
        src={P.cover}
        alt="Commercial fleet vehicles moving along a highway at dusk"
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(115deg, rgba(12,10,9,0.96) 0%, rgba(28,25,23,0.86) 48%, rgba(3,105,161,0.45) 100%)" }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-40 h-[620px] w-[620px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.2), transparent 65%)" }}
      />

      <div className="relative z-10 flex h-full flex-col px-16 py-12">
        {/* Top row */}
        <div className="sx-up flex items-center justify-between" style={d(0)}>
          <img src={taqaLogo} alt="TAQA Arabia logo" className="h-12 rounded-lg bg-white/95 px-3 py-1.5 object-contain shadow-lg" />
          <Kicker color="#0369a1" dark>Client Presentation · Jun 2026</Kicker>
        </div>

        <div className="flex-1" />

        {/* Title block */}
        <div>
          <div
            className="sx-up h-[3px] w-16 rounded-full"
            style={{ ...d(80), background: "linear-gradient(90deg, #0369a1, #38bdf8)" }}
          />
          <h1 className="sx-up mt-6 font-display text-[76px] font-bold leading-[1.02] tracking-tight text-white" style={d(140)}>
            Fleet &amp; Mobility
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(95deg, #38bdf8 0%, #7dd3fc 55%, #bae6fd 100%)" }}
            >
              Sector
            </span>
          </h1>
          <p className="sx-up mt-5 text-[19px] text-white/85" style={d(220)}>
            Integrated Energy &amp; Mobility Solutions · Jun 2026
          </p>
        </div>

        {/* Pillar chips */}
        <div className="mt-9 flex flex-wrap gap-2.5">
          {pillars.map((c, i) => (
            <span
              key={c.label}
              className="sx-up inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[15px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-md"
              style={d(300 + i * 55)}
            >
              <span style={{ color: c.color }}>{c.icon}</span>
              {c.label}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="sx-in mt-8 flex items-center justify-between border-t border-white/10 pt-5" style={d(500)}>
          <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/55">
            A World OF ENERGY · TAQA Arabia · Confidential
          </p>
          <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Fuel · CNG · EV · Waqood
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
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#0369a1" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full gap-10 p-14">
        {/* Left — narrative */}
        <div className="flex w-[530px] shrink-0 flex-col">
          <div className="sx-up" style={d(0)}>
            <Kicker color="#0369a1">TAQA Arabia · Who We Are</Kicker>
          </div>
          <h2 className="sx-up mt-5 font-display text-[32px] font-bold leading-[1.15] tracking-tight text-[#002060]" style={d(60)}>
            Egypt's leading integrated energy infrastructure developer
          </h2>
          <div
            className="sx-up mt-4 h-[3px] w-14 rounded-full"
            style={{ ...d(110), background: "linear-gradient(90deg, #0369a1, #38bdf8)" }}
          />
          <p className="sx-up mt-5 text-[17px] leading-relaxed text-slate-600" style={d(160)}>
            Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest private-sector energy and
            utility developer. TAQA is uniquely positioned to support different mobility solutions to fuel vehicles with
            different energy sources such as petroleum products, lubes, electricity for EVs and natural gas for NGVs.
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {["IGU Member", "IGEM Accredited"].map((b, i) => (
              <span
                key={b}
                className="sx-up rounded-full bg-[#0369a1]/10 px-3.5 py-1.5 text-[14px] font-semibold text-[#075985] ring-1 ring-[#0369a1]/15"
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
            style={{ ...d(120), background: "linear-gradient(135deg, #0c4a6e, #1c1917)" }}
          >
            <img
              src={P.fleet}
              alt="Row of commercial fleet vehicles ready for dispatch"
              loading="lazy"
              onError={hideImg}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,10,9,0) 35%, rgba(12,10,9,0.72) 100%)" }} />
            <p className="absolute bottom-3 left-4 font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/90">
              Founded 2006 · Listed on EGX 2023
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
    { value: "8",      label: "Countries",           sub: "Egypt, GCC, Africa & Greece", hero: true },
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
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#0369a1" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color="#0369a1">TAQA Arabia · Regional Presence</Kicker>
        </div>
        <h2 className="sx-up mt-4 font-display text-[34px] font-bold leading-tight tracking-tight text-[#002060]" style={d(60)}>
          A growing platform across Egypt, the GCC, Africa and Greece
        </h2>

        {/* Bento metrics */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`sx-up relative overflow-hidden rounded-2xl p-5 ${
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
                    ? "linear-gradient(100deg, #ffffff, #7dd3fc)"
                    : "linear-gradient(100deg, #0369a1, #38bdf8)",
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
          <div className="sx-up relative overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm" style={d(380)}>
            <Bracket color="#0369a1" pos="tl" />
            <div className="mb-3 flex items-center gap-2.5 pl-3">
              <Globe className="h-[18px] w-[18px] text-[#0369a1]" />
              <h3 className="font-display text-[17px] font-bold tracking-tight text-[#002060]">International Expansion</h3>
            </div>
            <div className="space-y-3 pl-3">
              {regions.map(x => (
                <div key={x.name} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: "linear-gradient(135deg, #0369a1, #38bdf8)" }}>
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-[16px] leading-snug text-slate-600">
                    <span className="font-semibold text-[#002060]">{x.name}</span> — {x.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="sx-up relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
            style={{ ...d(440), background: "linear-gradient(140deg, #002060 0%, #0a2f7a 100%)" }}
          >
            <BlueprintGrid />
            <div className="relative mb-2 flex items-center gap-2.5">
              <MapPin className="h-[18px] w-[18px] text-[#FFC10E]" />
              <h3 className="font-display text-[17px] font-bold tracking-tight text-[#FFC10E]">Geographic Footprint</h3>
            </div>
            <p className="relative text-[16px] leading-snug text-white/85">
              Concessions in 8 Egyptian governorates. TAQA serves the full spectrum of fleet and mobility clients:
            </p>
            <div className="relative mt-3 space-y-2">
              {fleets.map(f => (
                <div key={f} className="flex items-start gap-2 text-[15px] font-medium text-white/90">
                  <CheckCircle2 className="mt-[1px] h-4 w-4 shrink-0 text-[#FFC10E]" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 3: In Numbers ─────────────────────────────────────────────────────

function NumbersSlide() {
  const heroStats = [
    { value: "EGP 13.4bn", label: "Revenue",                   sub: "FY 2025", hero: true },
    { value: "EGP 1.5bn",  label: "EBITDA",                    sub: "FY 2025" },
    { value: "~6.5M",      label: "Residential gas customers", sub: "Active connections" },
  ];
  const divCards = [
    { div: "GAS",       icon: <Flame className="h-4 w-4" />, color: "#059669", stats: ["86 CNG stations", "18 conversion centers", "Capacity 12K cars/year", "Master Gas virtual pipeline"] },
    { div: "POWER",     icon: <Zap className="h-4 w-4" />,   color: "#FFC10E", stats: ["+130 charging stations", "1st private EV licence", "Waqood EnerTech", "AC & DC fast chargers"] },
    { div: "PETROLEUM", icon: <Truck className="h-4 w-4" />, color: "#b45309", stats: ["230+ fuel stations", "172 Wataniya", "2 fuel terminals", "Suez & Alexandria"] },
    { div: "MOBILITY",  icon: <Car className="h-4 w-4" />,   color: "#0369a1", stats: ["Fuel · CNG · EV · Waqood", "One account, one SLA", "Fleet card & cashless", "Consolidated billing"] },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#0369a1" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color="#0369a1">TAQA Arabia · In Numbers</Kicker>
        </div>
        <h2 className="sx-up mt-4 font-display text-[34px] font-bold leading-tight tracking-tight text-[#002060]" style={d(60)}>
          The scale behind a single residential utility partner — FY 2025
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
                ...(m.hero ? { background: "linear-gradient(130deg, #0c0a09 0%, #1c1917 55%, #0c4a6e 100%)" } : {}),
              }}
            >
              {m.hero && <BlueprintGrid />}
              {m.hero && <Bracket color="#38bdf8" pos="br" />}
              <div
                className={`relative font-display font-bold leading-none tracking-tight bg-clip-text text-transparent ${m.hero ? "text-[52px]" : "text-[32px]"}`}
                style={{
                  backgroundImage: m.hero
                    ? "linear-gradient(100deg, #38bdf8, #bae6fd)"
                    : "linear-gradient(100deg, #0369a1, #38bdf8)",
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
              <div className="mt-3 space-y-1.5">
                {c.stats.map(s => (
                  <div key={s} className="flex items-start gap-2">
                    <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: c.color }} />
                    <span className="text-[16px] leading-snug text-slate-600">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 4: Fleet Challenge — dark "moment" slide ──────────────────────────

function FleetChallengeSlide() {
  const pains = [
    { label: "HIGH FUEL COST",            desc: "Diesel and petrol are the biggest operating cost — volatile, exposed to every oil-price spike.", color: "#dc2626" },
    { label: "FRAGMENTED SUPPLIERS",      desc: "Fuel, gas, chargers and software from separate vendors — no single view or accountability.",     color: "#b45309" },
    { label: "FUEL LEAKAGE & FRAUD",      desc: "Cash, paper receipts and no per-vehicle control quietly inflate the bill.",                      color: "#7c3aed" },
    { label: "RISING CARBON & CITY RISK", desc: "100% combustion means maximum emissions and exposure to low-emission zones.",                    color: "#059669" },
  ];
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0c0a09 0%, #1c1917 55%, #292524 100%)" }}
    >
      <SlideStyles />
      <img
        src={P.fleet}
        alt="Heavy trucks lined up at a fuel depot"
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(115deg, rgba(12,10,9,0.95) 0%, rgba(28,25,23,0.85) 52%, rgba(220,38,38,0.35) 100%)" }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-40 h-[560px] w-[560px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(220,38,38,0.19), transparent 65%)" }}
      />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color="#dc2626" dark>Fleet &amp; Mobility · The Challenge</Kicker>
        </div>
        <h2 className="sx-up mt-4 font-display text-[44px] font-bold leading-[1.08] tracking-tight text-white" style={d(70)}>
          The fleet operator's energy challenge
        </h2>

        <div className="mt-7 grid min-h-0 flex-1 grid-cols-2 gap-4">
          {pains.map((c, i) => (
            <div
              key={c.label}
              className="sx-up relative overflow-hidden rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/15 backdrop-blur-md"
              style={d(140 + i * 65)}
            >
              <span aria-hidden className="absolute inset-y-4 left-0 w-[3px] rounded-r-full" style={{ background: c.color }} />
              <div className="pl-3 font-display text-[15px] font-semibold uppercase tracking-[0.22em]" style={{ color: lighter(c.color) }}>
                {c.label}
              </div>
              <p className="mt-2 pl-3 text-[17px] leading-relaxed text-white/85">{c.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="sx-up relative mt-4 shrink-0 overflow-hidden rounded-2xl p-6 ring-1 ring-white/15"
          style={{ ...d(420), background: "linear-gradient(100deg, rgba(3,105,161,0.45), rgba(56,189,248,0.14))" }}
        >
          <Bracket color="#38bdf8" pos="br" />
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-[#38bdf8]" />
            <h3 className="font-display text-[15px] font-semibold uppercase tracking-[0.22em] text-[#7dd3fc]">TAQA's Answer</h3>
          </div>
          <p className="mt-2 text-[17px] leading-relaxed text-white/90">
            A managed energy transition from <strong className="font-semibold text-white">diesel today</strong> → <strong className="font-semibold text-[#6ee7b7]">CNG as the bridge</strong> → <strong className="font-semibold text-[#c4b5fd]">EV as the destination</strong> — financed and staged at the fleet's own pace. One partner, one account, one Waqood dashboard.
          </p>
        </div>
      </div>
    </div>
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
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#0369a1" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color="#0369a1">Fleet &amp; Mobility · The Pathway</Kicker>
        </div>
        <h2 className="sx-up mt-4 max-w-[1100px] font-display text-[34px] font-bold leading-[1.15] tracking-tight text-[#002060]" style={d(60)}>
          Diesel today, natural gas as the bridge, electric as the destination — at your pace
        </h2>

        {/* Stage badges over a connecting line */}
        <div className="sx-up relative mt-6 shrink-0" style={d(160)}>
          <div aria-hidden className="absolute left-[16%] right-[16%] top-1/2 h-[2px] -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(90deg, #b45309, #059669, #7c3aed)", opacity: 0.3 }} />
          <div className="relative grid grid-cols-3">
            {stages.map(s => (
              <div key={s.label} className="flex justify-center">
                <span className="rounded-full px-4 py-1.5 font-display text-[15px] font-bold uppercase tracking-[0.22em] text-white shadow-md" style={{ background: `linear-gradient(100deg, ${s.color}, ${lighter(s.color)})` }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid min-h-0 flex-1 grid-cols-3 gap-5">
          {stages.map((s, i) => (
            <div
              key={s.label}
              className="sx-up relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-[0_10px_30px_-16px_rgba(0,32,96,0.25)]"
              style={d(220 + i * 65)}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${s.color}, ${lighter(s.color)})` }} />
              {i < 2 && (
                <div aria-hidden className="absolute -right-3 top-1/2 z-10 -translate-y-1/2">
                  <ArrowRight className="h-5 w-5 text-slate-300" />
                </div>
              )}
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md" style={{ background: `linear-gradient(135deg, ${s.color}, ${lighter(s.color)})` }}>
                {s.icon}
              </div>
              <h3 className="font-display text-[18px] font-bold leading-snug tracking-tight text-[#002060]">{s.title}</h3>
              <p className="mt-2 flex-1 text-[16px] leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="sx-up relative mt-5 shrink-0 overflow-hidden rounded-2xl px-7 py-4 text-center shadow-lg"
          style={{ ...d(460), background: "linear-gradient(120deg, #002060 0%, #0a2f7a 100%)" }}
        >
          <BlueprintGrid />
          <p className="relative text-[16px] leading-snug text-white/85">
            <span className="font-bold text-[#FFC10E]">TAQA finances and manages each step,</span>{" "}
            so the fleet moves down the cost-and-carbon curve at its own pace — never stranded, never forced.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 6: Solutions Overview ─────────────────────────────────────────────

function SolutionsOverviewSlide() {
  const solutions = [
    { num: "01", label: "Fuel Stations",       desc: "Keep today's fleet moving — diesel and gasoline from a nationwide TAQA-operated station network and two terminals.",                   icon: <Truck className="h-5 w-5" />,     color: "#b45309" },
    { num: "02", label: "Natural Gas (CNG)",   desc: "Convert the fleet you own to gas — licensed NGV conversion plus TAQA's CNG network and the Master Gas mobile virtual pipeline.",       icon: <Flame className="h-5 w-5" />,     color: "#059669" },
    { num: "03", label: "EV Charging",         desc: "Electrify with the holder of Egypt's first private EV-charging licence — depot, destination and en-route AC/DC charging, end-to-end.", icon: <Zap className="h-5 w-5" />,       color: "#7c3aed" },
    { num: "04", label: "Waqood Smart System", desc: "See and control the whole fleet from one screen — fuel, CNG and EV data in a single dashboard.",                                       icon: <BarChart2 className="h-5 w-5" />, color: "#0369a1" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#0369a1" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="sx-up" style={d(0)}>
              <Kicker color="#0369a1">Fleet &amp; Mobility · Solutions Overview</Kicker>
            </div>
            <h2 className="sx-up mt-4 font-display text-[40px] font-bold leading-none tracking-tight text-[#002060]" style={d(60)}>
              Solutions Overview
            </h2>
          </div>
          <p className="sx-up max-w-[440px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
            The following slides detail every service TAQA Arabia's mobility sector offers to fleets.
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-5">
          {solutions.map((s, i) => (
            <div
              key={s.num}
              className="sx-up group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-[0_10px_30px_-16px_rgba(0,32,96,0.25)]"
              style={d(160 + i * 60)}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${s.color}, ${lighter(s.color)})` }} />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[92px] font-bold leading-none"
                style={{ color: s.color, opacity: 0.07 }}
              >
                {s.num}
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${s.color}, ${lighter(s.color)})` }}
              >
                {s.icon}
              </div>
              <h3 className="mt-3 font-display text-[19px] font-bold leading-tight tracking-tight text-[#002060]">{s.label}</h3>
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
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#002060" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="sx-up" style={d(0)}>
              <Kicker color="#002060">Closing · Why One Partner</Kicker>
            </div>
            <h2 className="sx-up mt-4 font-display text-[38px] font-bold leading-none tracking-tight text-[#002060]" style={d(60)}>
              The TAQA One-Stop-Shop
            </h2>
          </div>
          <p className="sx-up max-w-[430px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
            One SLA, one communication point, one accountable operator — across every utility in the fleet.
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-5">
          {/* Mobility solutions dark card */}
          <div
            className="sx-up relative flex flex-col overflow-hidden rounded-2xl p-6 shadow-xl"
            style={{ ...d(180), background: "linear-gradient(145deg, #002060 0%, #0a2f7a 70%, #123c94 100%)" }}
          >
            <BlueprintGrid />
            <Bracket color="#FFC10E" pos="br" />
            <h3 className="relative font-display text-[18px] font-bold tracking-tight text-[#FFC10E]">TAQA Arabia — Mobility Solutions</h3>
            <p className="relative mt-1 text-[15px] text-white/70">Fuel · CNG · Waqood · EV Charging</p>
            <div className="relative mt-4 grid grid-cols-2 gap-2.5">
              {services.map((s, i) => (
                <div
                  key={s.label}
                  className="sx-up flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-3 ring-1 ring-white/10"
                  style={d(240 + i * 55)}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="text-[16px] font-semibold text-white">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
              <span className="text-[16px] text-white/70">From Fragmented Vendors</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#FFC10E]" />
              <span className="text-[16px] font-bold text-white">A Single Operator</span>
            </div>
          </div>

          {/* Pillars */}
          <div className="flex min-h-0 flex-col justify-between gap-2.5">
            {pillars.map((b, i) => (
              <div
                key={b.label}
                className="sx-up relative flex flex-1 items-start gap-3 rounded-xl bg-white p-3 pl-4 ring-1 ring-black/5 shadow-sm"
                style={d(220 + i * 60)}
              >
                <span aria-hidden className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#0369a1] to-[#38bdf8]" />
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0369a1]/10 text-[#0369a1]">
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
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#002060" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="sx-up" style={d(0)}>
              <Kicker color="#002060">Closing · Integrated Economics</Kicker>
            </div>
            <h2 className="sx-up mt-4 font-display text-[38px] font-bold leading-none tracking-tight text-[#002060]" style={d(60)}>
              The Integrated Economics: Diesel-Only vs. TAQA
            </h2>
          </div>
          <p className="sx-up max-w-[400px] pb-1 text-right text-[16px] leading-snug text-slate-500" style={d(120)}>
            Why a managed energy mix beats a diesel-only fleet — and widens the gap every year.
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-6">
          <div className="flex min-h-0 flex-col">
            <div className="sx-up" style={d(160)}>
              <ColHead color="#dc2626">Today — Diesel-Only Fleet</ColHead>
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-2.5">
              {todayItems.map((item, i) => (
                <div key={item.label} className="sx-up relative flex-1 overflow-hidden rounded-xl bg-white px-4 py-2.5 ring-1 ring-black/5 shadow-sm" style={d(200 + i * 60)}>
                  <span aria-hidden className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-[#dc2626]" />
                  <div className="pl-2 text-[17px] font-bold leading-tight text-[#002060]">{item.label}</div>
                  <div className="mt-0.5 pl-2 text-[16px] leading-snug text-slate-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex min-h-0 flex-col">
            <div className="sx-up" style={d(220)}>
              <ColHead color="#059669">With TAQA — Integrated Mix</ColHead>
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-2.5">
              {taqaItems.map((item, i) => (
                <div key={item.label} className="sx-up relative flex-1 overflow-hidden rounded-xl bg-white px-4 py-2.5 ring-1 ring-black/5 shadow-sm" style={d(260 + i * 60)}>
                  <span aria-hidden className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-[#059669]" />
                  <div className="pl-2 text-[17px] font-bold leading-tight text-[#002060]">{item.label}</div>
                  <div className="mt-0.5 pl-2 text-[16px] leading-snug text-slate-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="sx-up relative mt-5 shrink-0 overflow-hidden rounded-2xl px-7 py-4 text-center shadow-lg"
          style={{ ...d(520), background: "linear-gradient(120deg, #002060 0%, #0a2f7a 100%)" }}
        >
          <BlueprintGrid />
          <p className="relative text-[16px] leading-snug text-white/85">
            The result: a lower and more predictable cost per kilometre, fewer suppliers, controlled fuel spend and a steadily stronger ESG story — from one partner, financed and staged at your pace.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 25: Closing — dark closing moment ─────────────────────────────────

function ClosingSlide() {
  const proof = [
    { label: "Fuel Stations",     stat: "230+ stations under management",                                icon: <Truck className="h-4 w-4" />,     color: "#b45309" },
    { label: "Natural Gas (CNG)", stat: "86 CNG stations operating",                                     icon: <Flame className="h-4 w-4" />,     color: "#059669" },
    { label: "EV Charging",       stat: "1st EV-charging licence in Egypt · 130+ EV charge points live", icon: <Zap className="h-4 w-4" />,       color: "#7c3aed" },
    { label: "Waqood",            stat: "One dashboard for every energy type",                           icon: <BarChart2 className="h-4 w-4" />, color: "#0369a1" },
  ];
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0c0a09 0%, #1c1917 55%, #292524 100%)" }}
    >
      <SlideStyles />
      <img
        src={P.ev}
        alt="Electric vehicle plugged into a charging station"
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(115deg, rgba(12,10,9,0.95) 0%, rgba(0,20,55,0.85) 55%, rgba(3,105,161,0.55) 100%)" }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-44 h-[620px] w-[620px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.2), transparent 65%)" }}
      />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color="#0369a1" dark>Fleet &amp; Mobility · Closing</Kicker>
        </div>
        <h2 className="sx-up mt-4 max-w-[1000px] font-display text-[44px] font-bold leading-[1.06] tracking-tight text-white" style={d(70)}>
          From Pump to Plug:{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(95deg, #38bdf8, #bae6fd)" }}
          >
            Your Fleet's Energy Partner
          </span>
        </h2>
        <p className="sx-up mt-2.5 text-[17px] text-white/80" style={d(130)}>
          One partner for every kilometre — today's diesel to tomorrow's electric.
        </p>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-[1fr_460px] gap-6">
          {/* Narrative glass card */}
          <div className="sx-up relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.07] p-7 ring-1 ring-white/15 backdrop-blur-md" style={d(190)}>
            <Bracket color="#38bdf8" pos="tl" />
            <div className="flex items-center gap-2.5 pl-3">
              <Star className="h-5 w-5 shrink-0 text-[#7dd3fc]" style={{ fill: "#7dd3fc" }} />
              <h3 className="font-display text-[17px] font-bold tracking-tight text-white">
                One partner. Every kilometre. Every energy type.
              </h3>
            </div>
            <p className="mt-3 pl-3 text-[17px] leading-relaxed text-white/85">
              From pump to plug, TAQA fuels every kilometre your fleet will ever drive. Egypt's largest private energy
              developer is the single partner that can move your fleet from diesel today to electric tomorrow — fuel,
              CNG, conversion, charging and the Waqood platform that ties them together, financed and measured at every
              step.
            </p>
            <div className="mt-auto flex items-center gap-2.5 border-t border-white/10 pl-3 pt-4">
              <ArrowRight className="h-4 w-4 shrink-0 text-[#7dd3fc]" />
              <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/60">
                A World OF ENERGY · TAQA Arabia
              </p>
            </div>
          </div>

          {/* Proof rows */}
          <div className="flex min-h-0 flex-col justify-between gap-3">
            {proof.map((s, i) => (
              <div
                key={s.label}
                className="sx-up flex flex-1 items-center gap-4 rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/15 backdrop-blur-md"
                style={d(260 + i * 65)}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${lighter(s.color)})` }}
                >
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[17px] font-bold text-white">{s.label}</div>
                  <div className="text-[16px] leading-snug text-white/75">{s.stat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SLIDES Array (26 slides, 0-indexed) ─────────────────────────────────────

const fuelIcon   = <Truck className="w-5 h-5" />;
const cngIcon    = <Flame className="w-5 h-5" />;
const evIcon     = <Zap className="w-5 h-5" />;
const waqoodIcon = <BarChart2 className="w-5 h-5" />;

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

  // ── Fuel Stations ────────────────────────────────────────────────────────────
  // 7
  {
    title: "Fuel Stations: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={1} solutionLabel="Fuel Stations" color="#b45309" icon={fuelIcon} photo={P.fuel}
        subtitle="Keep today's fleet moving — diesel and gasoline from a nationwide TAQA-operated station network and two owned terminals."
        taqaInvests={["National station network & depot fuelling", "Two owned terminals (Suez & Alexandria)", "Quality-assured supply chain", "Cashless fleet-card system", "Consolidated billing & reporting"]}
        steps={[
          "Fleet profiled — fuel type, volume and routes mapped.",
          "Account activated for cashless fuelling across the network.",
          "Depot or on-site fuelling installed where required.",
          "Fleet refuels at TAQA/Wataniya stations or depot bowsers.",
          "Consumption reported monthly — one consolidated bill.",
        ]}
        whatYouReceive={["Nationwide fuelling access", "Depot & on-site supply options", "Spec-compliant, quality-assured fuel", "One consolidated bill"]}
      />
    ),
  },
  // 8
  {
    title: "Fuel Stations: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={1} solutionLabel="Fuel Stations" color="#b45309" icon={fuelIcon} photo={P.fuel}
        whatYouGain={[
          { label: "Depot & On-Site Fueling",   desc: "Bulk and on-site delivery keep heavy fleets fueled at base — no detours, no queueing." },
          { label: "Spec-Compliant Supply",     desc: "Quality-assured fuel from owned terminals protects engines, warranties and resale value." },
          { label: "Predictable Fuel Spend",    desc: "Consolidated billing and consumption reporting turn fuel from a blind cost into a managed, forecastable line." },
          { label: "A Single Point of Contact", desc: "One TAQA account team handles fuel, delivery and logistics — no juggling multiple suppliers." },
        ]}
        taqaEdge={[
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
      <TimelineSlide
        solutionNum={1} solutionLabel="Fuel Stations" color="#b45309" icon={fuelIcon} photo={P.fuel}
        phases={[
          { days: "Day 0–7",   label: "Account Setup — Fleet profiling, fuel account & credit terms." },
          { days: "Day 7–14",  label: "Network Activation — Station access & depot survey." },
          { days: "Day 14–30", label: "Depot Fuelling — On-site tank/bowser install where needed." },
          { days: "Day 30+",   label: "Live Fuelling — Cashless refuelling across the network." },
          { days: "Monthly",   label: "Reporting — Consolidated billing & consumption analytics." },
          { days: "Ongoing",   label: "Optimisation — Route, supply & spend reviews." },
        ]}
        groups={[
          { label: "SET UP", range: "Day 0–14" },
          { label: "DEPLOY", range: "Day 14–30" },
          { label: "MANAGE", range: "Ongoing" },
        ]}
      />
    ),
  },
  // 10
  {
    title: "Fuel Stations: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={1} solutionLabel="Fuel Stations" color="#b45309" icon={fuelIcon} photo={P.fuel}
        heading="TAQA Petroleum — National Fuelling Backbone"
        subheading="A fuel-marketing network built over two decades — and growing fast."
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

  // ── Natural Gas (CNG) ────────────────────────────────────────────────────────
  // 11
  {
    title: "Natural Gas (CNG): Scope",
    render: () => (
      <ScopeSlide
        solutionNum={2} solutionLabel="Natural Gas (CNG)" color="#059669" icon={cngIcon} photo={P.cng}
        subtitle="Convert the fleet you own to gas — and fuel it: licensed NGV conversion plus TAQA's CNG network and the Master Gas mobile virtual pipeline."
        taqaInvests={["Licensed conversion workshops across Egypt", "CNG station network (86 stations)", "Master Gas mobile virtual pipeline", "SCADA-monitored dispatch", "Cylinder certification & re-testing"]}
        steps={[
          "Fleet assessed — suitable vehicles, routes and payback analysed.",
          "Bi-fuel or dedicated CNG chosen; fuelling via network or Master Gas.",
          "Licensed conversion — cylinder fitted, safety sign-off.",
          "Fleet switches to CNG fuelling via stations or depot.",
          "TAQA dispatches refills, re-tests cylinders and monitors uptime.",
        ]}
        whatYouReceive={["Licensed NGV conversions", "86 CNG stations + mobile pipeline", "Per-vehicle cylinder management", "~40% fuel cost saving"]}
      />
    ),
  },
  // 12
  {
    title: "Natural Gas (CNG): Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={2} solutionLabel="Natural Gas (CNG)" color="#059669" icon={cngIcon} photo={P.cng}
        whatYouGain={[
          { label: "~40% Lower Fuel Cost",      desc: "CNG is structurally cheaper than petrol and diesel — the single fastest lever on operating cost." },
          { label: "Bi-Fuel & Fully Certified", desc: "Bi-fuel keeps petrol as a fallback; conversions, cylinders and stations are licensed and periodically re-tested." },
          { label: "Fastest Payback",           desc: "Conversion cost is typically recovered within months from fuel savings — then it is pure margin." },
          { label: "Cleaner, Quieter Engines",  desc: "Natural gas cuts particulates, NOx and engine noise — better for cities, drivers and ESG." },
        ]}
        taqaEdge={[
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
      <TimelineSlide
        solutionNum={2} solutionLabel="Natural Gas (CNG)" color="#059669" icon={cngIcon} photo={P.cng}
        phases={[
          { days: "Day 0–10",  label: "Assessment — Suitable vehicles, routes & payback." },
          { days: "Day 10–20", label: "Conversion Plan — Dedicated vs. bi-fuel; fuelling via network, Master Gas or NGV station." },
          { days: "Day 20–45", label: "Conversion — Licensed conversion or NGV station build." },
          { days: "Day 45–55", label: "Inspection — Certification & safety sign-off." },
          { days: "Day 55–65", label: "Go-Live — CNG fuelling across the fleet." },
          { days: "Ongoing",   label: "Re-test & O&M — SCADA dispatch & cylinder re-testing." },
        ]}
        groups={[
          { label: "ASSESS",           range: "Day 0–20" },
          { label: "CONVERT & SUPPLY", range: "Day 20–65" },
          { label: "OPERATE",          range: "Ongoing" },
        ]}
      />
    ),
  },
  // 14
  {
    title: "Natural Gas (CNG): Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={2} solutionLabel="Natural Gas (CNG)" color="#059669" icon={cngIcon} photo={P.cng}
        heading="Master Gas — Virtual Pipeline & Conversion"
        subheading="Convert and fuel — run by the operator of the gas network."
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

  // ── EV Charging ──────────────────────────────────────────────────────────────
  // 15
  {
    title: "EV Charging: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={3} solutionLabel="EV Charging" color="#7c3aed" icon={evIcon} photo={P.ev}
        subtitle="Electrify with the holder of Egypt's first private EV-charging licence — depot, destination and en-route AC/DC charging, end-to-end."
        taqaInvests={["AC & DC charging infrastructure", "Grid-capacity upgrades", "Energy management & load balancing", "Operator/user mobile app", "BOO/BOOT charger financing"]}
        steps={[
          "TAQA surveys the depot grid, fleet duty-cycle and charging mix.",
          "AC chargers overnight at depot; DC chargers for en-route top-ups.",
          "Grid upgrades installed to support charging load.",
          "App onboarded — drivers authenticate and charge.",
          "TAQA operates, maintains and manages billing.",
        ]}
        whatYouReceive={["Depot + en-route coverage", "Managed charging & billing app", "24/7 hotline & lifecycle O&M", "Grid-capacity secured"]}
      />
    ),
  },
  // 16
  {
    title: "EV Charging: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={3} solutionLabel="EV Charging" color="#7c3aed" icon={evIcon} photo={P.ev}
        whatYouGain={[
          { label: "Lowest Energy Cost/Km",   desc: "Electricity per kilometer undercuts both diesel and petrol — the end-state of the cost curve." },
          { label: "Future-Proofed Fleet",    desc: "Charging positions the fleet ahead of regulation, fuel bans and customer demand." },
          { label: "Zero Tailpipe Emissions", desc: "A genuinely zero-emission fleet — the strongest possible ESG and city-access position." },
          { label: "Managed Uptime & App",    desc: "Lifecycle O&M, an operator/user app and a 24/7 hotline keep every charger available and billing." },
        ]}
        taqaEdge={[
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
      <TimelineSlide
        solutionNum={3} solutionLabel="EV Charging" color="#7c3aed" icon={evIcon} photo={P.ev}
        phases={[
          { days: "Day 0–14",   label: "Site Assessment — Grid survey, duty-cycle & site mix." },
          { days: "Day 14–30",  label: "Commercial Model — Full-investment/profit-share structuring." },
          { days: "Day 30–60",  label: "Supply — AC/DC charger & grid-equipment procurement." },
          { days: "Day 60–95",  label: "Installation — Install across depot, en-route; grid tie-in." },
          { days: "Day 95–110", label: "Activation — App onboarding, testing & go-live." },
          { days: "Day 110+",   label: "O&M & Uptime — 24/7 monitoring, maintenance & billing." },
        ]}
        groups={[
          { label: "DESIGN",  range: "Day 0–30" },
          { label: "BUILD",   range: "Day 30–110" },
          { label: "OPERATE", range: "Day 110+" },
        ]}
      />
    ),
  },
  // 18
  {
    title: "EV Charging: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={3} solutionLabel="EV Charging" color="#7c3aed" icon={evIcon} photo={P.ev}
        heading="Pioneering Egypt's EV-charging rollout from the front."
        subheading="Egypt's first private EV-charging licence holder."
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

  // ── Waqood Smart System ──────────────────────────────────────────────────────
  // 19
  {
    title: "Waqood Smart System: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={4} solutionLabel="Waqood Smart System" color="#0369a1" icon={waqoodIcon} photo={P.digital}
        subtitle="See and control the whole fleet from one screen — fuel, CNG and EV data in a single dashboard."
        taqaInvests={["Waqood EnerTech platform", "Per-vehicle stickers & per-driver PINs", "Integration with fuel, CNG & EV stations", "Real-time fraud alerts", "Consolidated analytics & billing"]}
        steps={[
          "Vehicles and drivers are scoped and rules configured.",
          "Vehicle stickers and per-driver PINs activated.",
          "Fuel, CNG and EV data connected to the Waqood platform.",
          "Single-pane dashboard goes live with consolidated billing.",
          "Analytics, alerts and spend reviews run continuously.",
        ]}
        whatYouReceive={["One dashboard for fuel, CNG & EV", "Per-driver PINs and daily limits", "Real-time fraud alerts", "Consolidated billing"]}
      />
    ),
  },
  // 20
  {
    title: "Waqood Smart System: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={4} solutionLabel="Waqood Smart System" color="#0369a1" icon={waqoodIcon} photo={P.digital}
        whatYouGain={[
          { label: "One Dashboard",            desc: "Litres, m³ of gas and kWh charged appear in a single dashboard — true total-energy visibility." },
          { label: "Fraud Designed Out",       desc: "Per-driver PINs, daily limits and pump-reading capture make unauthorized or phantom fuelling almost impossible." },
          { label: "Decisions From Data",      desc: "Live consumption and behavior analytics show exactly where cost and waste sit across the fleet." },
          { label: "Higher Asset Utilisation", desc: "Consumption and behavior data surface idle, thirsty and inefficient vehicles to fix." },
        ]}
        taqaEdge={[
          { label: "Waqood by EnerTech",                desc: "Waqood is TAQA Arabia's own energy-technology company — the platform is owned, not rented." },
          { label: "TAQA Arabia Diverse Network",       desc: "Utilize TAQA Arabia's network of CNG, fuel and EV stations scattered across Egypt." },
          { label: "One Platform for All Energy Types", desc: "Supports a client's transition from diesel today → CNG tomorrow → EV in the future under a single provider." },
          { label: "Premium Customer Support",          desc: "Dedicated account management and a single communication channel for fast issue resolution." },
        ]}
      />
    ),
  },
  // 21
  {
    title: "Waqood Smart System: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={4} solutionLabel="Waqood Smart System" color="#0369a1" icon={waqoodIcon} photo={P.digital}
        phases={[
          { days: "Day 0–7",   label: "Discovery — Vehicles, drivers & rules scoping." },
          { days: "Day 7–14",  label: "Onboarding — Stickers, PINs & limits configured." },
          { days: "Day 14–21", label: "Integration — Fuel, CNG & EV data connected." },
          { days: "Day 21–30", label: "Dashboard Live — Single-pane dashboard & billing live." },
          { days: "Day 30–45", label: "Tuning — Limits, alerts & reports refined." },
          { days: "Ongoing",   label: "Optimise — Analytics, ESG & savings reviews." },
        ]}
        groups={[
          { label: "ONBOARD",  range: "Day 0–14" },
          { label: "ACTIVATE", range: "Day 14–30" },
          { label: "OPTIMISE", range: "Ongoing" },
        ]}
      />
    ),
  },
  // 22
  {
    title: "Waqood Smart System: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={4} solutionLabel="Waqood Smart System" color="#0369a1" icon={waqoodIcon} photo={P.digital}
        heading="Waqood · Fleet Dashboard"
        subheading="Egypt's smart fuel platform, built inside TAQA Arabia."
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

  // ── Closing ──────────────────────────────────────────────────────────────────
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
