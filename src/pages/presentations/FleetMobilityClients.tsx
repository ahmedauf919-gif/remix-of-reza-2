import { DeckShell } from "./DeckShell";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import {
  Flame, Zap, Droplets, Truck, Car, ArrowRight, Star, BarChart2,
} from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";
import {
  SlideStyles, Kicker, CornerWash, Bracket, BlueprintGrid, ColHead,
  ScopeSlide, ValuePropSlide, TimelineSlide, TrackRecordSlide, TrustedBySlide, d, hideImg, lighter,
} from "./slides";
import { TRUSTED_BY_LOGOS } from "./trustedByLogos";

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
  { id: "trusted",   label: "Trusted By",     color: "#0d9488", slides: [4] },
  { id: "challenge", label: "Fleet Challenge", color: "#dc2626", slides: [5, 6] },
  { id: "overview",  label: "Solutions",       color: "#0369a1", slides: [7] },
  { id: "fuel",      label: "Fuel Stations",   color: "#b45309", slides: [8, 9, 10, 11] },
  { id: "cng",       label: "Natural Gas",     color: "#059669", slides: [12, 13, 14, 15] },
  { id: "ev",        label: "EV Charging",     color: "#7c3aed", slides: [16, 17, 18, 19] },
  { id: "waqood",    label: "Waqood",          color: "#0369a1", slides: [20, 21, 22, 23] },
  { id: "closing",   label: "Closing",         color: "#002060", slides: [24, 25, 26] },
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
    { value: "8",      label: "Countries",           sub: "Egypt, GCC, Africa, Greece & South Asia" },
    { value: "4",      label: "Operating divisions", sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates",        sub: "Across Egypt" },
    { value: "3,400+", label: "Employees",           sub: "Across all divisions" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color="#0369a1" />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color="#0369a1">TAQA Arabia · Regional Presence</Kicker>
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
                  <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full" style={{ background: "linear-gradient(180deg, #0369a1, #38bdf8)" }} />
                  <div className="pl-2.5">
                    <div
                      className="font-display text-[28px] font-bold leading-none tracking-tight bg-clip-text text-transparent"
                      style={{ backgroundImage: "linear-gradient(100deg, #0369a1, #38bdf8)" }}
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
              <Bracket color="#0369a1" pos="tr" />
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

// ─── Slide 3: In Numbers ─────────────────────────────────────────────────────

function NumbersSlide() {
  const heroStats = [
    { value: "EGP 13.4bn", label: "Revenue",                   sub: "FY 2025", hero: true },
    { value: "EGP 1.5bn",  label: "EBITDA",                    sub: "FY 2025" },
    { value: "~6.5M",      label: "Residential gas customers", sub: "Gas division" },
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
              <div className="mt-3 space-y-2.5">
                {c.stats.map(s => (
                  <div key={s} className="flex items-start gap-2.5">
                    <span aria-hidden className="mt-[8px] h-2 w-2 shrink-0 rotate-45" style={{ background: c.color }} />
                    <span className="text-[17px] font-semibold leading-snug text-slate-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="sx-up mt-3 shrink-0 text-center text-[14px] font-medium text-slate-500" style={d(660)}>
          Founded 2006 · Listed on EGX 2023 · 3,400+ employees across all divisions
        </p>
      </div>
    </div>
  );
}

// ─── Slide 4: Fleet Challenge — dark "moment" slide ──────────────────────────

function FleetChallengeSlide() {
  const pains = [
    { label: "FUEL IS THE BIGGEST LEVER",       desc: "Fuel is typically 30–50% of fleet operating cost — small per-litre moves swing the entire P&L.",         color: "#dc2626" },
    { label: "VOLATILE, UNPREDICTABLE PRICES",  desc: "Diesel and petrol track global oil and policy — budgeting fuel becomes guesswork year to year.",           color: "#b45309" },
    { label: "TIGHTENING EMISSIONS PRESSURE",   desc: "ESG targets, low-emission city zones and customer mandates are closing in on combustion fleets.",          color: "#059669" },
    { label: "FRAGMENTED SUPPLIERS",            desc: "Fuel, gas, chargers and telematics from separate vendors means many contracts and no single view.",       color: "#7c3aed" },
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
          The Fleet Operator's Challenge
        </h2>
        <p className="sx-up mt-2 text-[17px] text-white/75" style={d(110)}>
          Why fleet energy is the biggest cost — and the hardest one to control.
        </p>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-4">
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
    { label: "FUTURE", title: "Electrify the Fleet",           desc: "Roll out depot and en-route charging — backed by Egypt's first EV licence, +1,600 MVA of grid, solar and storage — for the lowest cost per km and zero tailpipe emissions.", color: "#7c3aed", icon: <Zap className="h-5 w-5" /> },
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
          className="sx-up relative mt-4 shrink-0 overflow-hidden rounded-2xl px-7 py-3 text-center shadow-lg"
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
    { num: "02", label: "Natural Gas (CNG)",   desc: "Convert the fleet you own to gas — and fuel it: licensed NGV conversion plus TAQA's CNG network and the Master Gas mobile virtual pipeline.", icon: <Flame className="h-5 w-5" />,     color: "#059669" },
    { num: "03", label: "EV Charging",         desc: "Electrify with the holder of Egypt's first private EV-charging licence — depot, destination and en-route AC/DC charging, end-to-end.", icon: <Zap className="h-5 w-5" />,       color: "#7c3aed" },
    { num: "04", label: "Waqood Smart System", desc: "See and control the whole fleet from one screen — TAQA's EnerTech platform that digitalizes fueling, spend and control.",               icon: <BarChart2 className="h-5 w-5" />, color: "#0369a1" },
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
    { label: "One Commercial Relationship", desc: "Consolidated billing, aligned contract terms and a single negotiation instead of six separate procurement cycles." },
    { label: "One Engineering Standard",    desc: "Solutions designed to interoperate — shared accounts, shared monitoring." },
    { label: "One Accountable Owner",       desc: "End-to-end responsibility removes interface risk and finger-pointing between specialised vendors." },
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
    { label: "Rising carbon & city risk", desc: "100% combustion means maximum emissions and exposure to low-emission zones." },
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

      <div className="relative z-10 flex h-full flex-col px-14 py-10">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="sx-up" style={d(0)}>
              <Kicker color="#002060">Closing · Integrated Economics</Kicker>
            </div>
            <h2 className="sx-up mt-4 whitespace-nowrap font-display text-[32px] font-bold leading-tight tracking-tight text-[#002060]" style={d(60)}>
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
                <div key={item.label} className="sx-up relative rounded-xl bg-white px-4 py-3 ring-1 ring-black/5 shadow-sm" style={d(200 + i * 60)}>
                  <span aria-hidden className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-[#dc2626]" />
                  <div className="pl-2 text-[17px] font-bold leading-tight text-[#002060]">{item.label}</div>
                  <div className="mt-0.5 pl-2 text-[15px] leading-snug text-slate-600">{item.desc}</div>
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
                <div key={item.label} className="sx-up relative rounded-xl bg-white px-4 py-3 ring-1 ring-black/5 shadow-sm" style={d(260 + i * 60)}>
                  <span aria-hidden className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-[#059669]" />
                  <div className="pl-2 text-[17px] font-bold leading-tight text-[#002060]">{item.label}</div>
                  <div className="mt-0.5 pl-2 text-[15px] leading-snug text-slate-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="sx-up relative mt-4 shrink-0 overflow-hidden rounded-2xl px-7 py-3 text-center shadow-lg"
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
            <div className="mt-4 rounded-xl bg-white/10 p-4 pl-3.5 ring-1 ring-white/10">
              <p className="text-[15px] leading-snug text-white/90">
                <span className="font-display text-[13px] font-bold uppercase tracking-[0.18em] text-[#7dd3fc]">The Next Step</span>{" "}
                — let TAQA build your fleet's transition map: a complimentary baseline of your current fuel cost,
                emissions and the savings available at each stage of the journey.
              </p>
            </div>
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

// ─── SLIDES Array (27 slides, 0-indexed) ─────────────────────────────────────

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
  {
    title: "Trusted By",
    render: () => (
      <TrustedBySlide
        color="#0d9488"
        heading="Clients and Partners Served Across Multiple Divisions"
        subheading="A representative cross-section of the developers, industrials, hospitality groups and institutions TAQA Arabia serves today."
        logos={TRUSTED_BY_LOGOS}
      />
    ),
  },
  // 5
  { title: "The Fleet Challenge",            render: () => <FleetChallengeSlide /> },
  // 6
  { title: "The Mobility Energy Pathway",    render: () => <PathwaySlide /> },
  // 7
  { title: "Solutions Overview",             render: () => <SolutionsOverviewSlide /> },

  // ── Fuel Stations ────────────────────────────────────────────────────────────
  // 8
  {
    title: "Fuel Stations: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={1} solutionLabel="Fuel Stations" color="#b45309" icon={fuelIcon} photo={P.fuel}
        subtitle="Keep today's fleet moving — diesel and gasoline from a nationwide TAQA-operated station network and two owned terminals."
        taqaInvests={["Forecourt, tanks & dispensers", "Canopy, shop & safety systems", "Automation, POS & fuel-management", "Fleet cards & telemetry", "Station financing & licensing"]}
        steps={[
          "TAQA secures the licence and builds the station to spec.",
          "Tanks, dispensers and automation are installed and certified.",
          "Fleet vehicles fuel using cards linked to each driver and vehicle.",
          "Every litre is captured digitally against limits and rules.",
          "TAQA supplies fuel, runs the site and reports consumption.",
        ]}
        whatYouReceive={["Reliable fuel supply for your fleet", "172 Wataniya stations added to the network", "Controlled, card-based fuelling", "Full station operation and reporting"]}
      />
    ),
  },
  // 9
  {
    title: "Fuel Stations: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={1} solutionLabel="Fuel Stations" color="#b45309" icon={fuelIcon} photo={P.fuel}
        whatYouGain={[
          { label: "Depot & On-Site Fueling",   desc: "Bulk and on-site delivery keep heavy fleets fueled at base — no detours, no queueing at the pump." },
          { label: "Spec-Compliant Supply",     desc: "Quality-assured fuel from owned terminals protects engines, warranties and resale value." },
          { label: "Predictable Fuel Spend",    desc: "Consolidated billing and consumption reporting turn fuel from a blind cost into a managed, forecastable line." },
          { label: "A Single Point of Contact", desc: "One TAQA account team handles fuel, delivery and logistics — no juggling multiple suppliers." },
        ]}
        taqaEdge={[
          { label: "Assured Fuel Quality",        desc: "Two owned terminals and a controlled logistics chain mean traceable, spec-compliant fuel that protects engines." },
          { label: "Nationwide Fueling Reach",     desc: "TAQA's own stations plus 172 newly managed Wataniya sites mean drivers refuel wherever the route goes." },
          { label: "A Ready Transition Partner",   desc: "The partner fueling you today is the one that converts you to CNG and electrifies you tomorrow." },
          { label: "One Cashless Account",         desc: "A single fuel account replaces cash and scattered receipts — every liter logged to the right vehicle." },
        ]}
      />
    ),
  },
  // 10
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
  // 11
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
  // 12
  {
    title: "Natural Gas (CNG): Scope",
    render: () => (
      <ScopeSlide
        solutionNum={2} solutionLabel="Natural Gas (CNG)" color="#059669" icon={cngIcon} photo={P.cng}
        subtitle="Convert the fleet you own to gas — and fuel it: licensed NGV conversion plus TAQA's CNG network and the Master Gas mobile virtual pipeline."
        taqaInvests={["CNG mother & daughter stations", "Compression & dispensing skids", "Vehicle conversion workshops", "Virtual-pipeline trailers", "Station financing"]}
        steps={[
          "TAQA converts fleet vehicles to run on compressed natural gas.",
          "Gas is compressed and dispensed at TAQA CNG stations.",
          "Where no pipeline exists, trailers supply gas as a virtual pipeline.",
          "Drivers fuel with cards that log every fill.",
          "TAQA maintains stations, skids and converted vehicles.",
        ]}
        whatYouReceive={["Lower-cost CNG fuel for the fleet", "Cheaper fuel cost per kilometre", "Conversion and refuelling network", "Managed supply, even off-pipeline"]}
      />
    ),
  },
  // 13
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
  // 14
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
  // 15
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
  // 16
  {
    title: "EV Charging: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={3} solutionLabel="EV Charging" color="#7c3aed" icon={evIcon} photo={P.ev}
        subtitle="Electrify with the holder of Egypt's first private EV-charging licence — depot, destination and en-route AC/DC charging, end-to-end."
        taqaInvests={["Depot AC/DC fast chargers", "Grid connection & transformer upgrades", "Smart charge-management system", "Driver app, RFID & billing", "Charger financing"]}
        steps={[
          "TAQA sizes depot and route charging to fleet duty cycles.",
          "Chargers and grid upgrades are installed at depots and hubs.",
          "Smart scheduling charges vehicles overnight at lowest cost.",
          "Drivers authenticate; every kWh is logged per vehicle.",
          "TAQA operates, maintains and reports on the network.",
        ]}
        whatYouReceive={["Depot and en-route charging ready to use", "Depot-to-road coverage", "Optimised, low-cost charging windows", "Maintained uptime with full reporting"]}
      />
    ),
  },
  // 17
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
          { label: "One Energy Partner",         desc: "Charging integrates with TAQA's fuel and CNG offering — one partner across the whole transition." },
        ]}
      />
    ),
  },
  // 18
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
  // 19
  {
    title: "EV Charging: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={3} solutionLabel="EV Charging" color="#7c3aed" icon={evIcon} photo={P.ev}
        heading="Pioneering Egypt's EV-charging rollout from the front."
        subheading="Egypt's first private EV-charging licence holder."
        body="TAQA Power secured Egypt's first private EV-charging licence and is rolling out AC and DC charging across depot, commercial and highway locations, supported by an operator/user app and a 24/7 hotline. As Egypt's largest private power distributor with 130+ chargers capacity, TAQA pairs charging with the grid, solar and storage — the complete electrification package for any fleet."
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
  // 20
  {
    title: "Waqood Smart System: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={4} solutionLabel="Waqood Smart System" color="#0369a1" icon={waqoodIcon} photo={P.digital}
        subtitle="See and control the whole fleet from one screen — TAQA's EnerTech platform that digitalizes fueling, spend and control."
        taqaInvests={["Vehicle RFID tags & stickers", "Driver PIN & access devices", "Station-side reader integration", "Waqood platform & dashboards", "Onboarding & configuration"]}
        steps={[
          "Vehicles, drivers and rules are configured in the Waqood platform.",
          "RFID stickers and driver PINs are issued and linked.",
          "At the pump, the system verifies vehicle, driver and limit.",
          "Only authorized fuelling within set limits is allowed.",
          "Every transaction streams to live dashboards and reports.",
        ]}
        whatYouReceive={["Total control over fleet fuelling", "Every litre tracked", "Real-time consumption dashboards", "Leakage and fraud designed out"]}
      />
    ),
  },
  // 21
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
  // 22
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
  // 23
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
  // 24
  { title: "Why One Partner",      render: () => <WhyOnePartnerSlide /> },
  // 25
  { title: "Integrated Economics", render: () => <IntegratedEconomicsSlide /> },
  // 26
  { title: "From Pump to Plug",    render: () => <ClosingSlide /> },
];

// ─── Narration (27 entries, matches SLIDES order) ────────────────────────────

const NARRATION: string[] = [
  // 0 — Cover
  "Welcome to TAQA Arabia's Fleet and Mobility Sector presentation, an integrated energy roadmap built for clients running commercial fleets. Over the next slides we will walk through four connected solutions — fuel stations, natural gas or CNG, EV charging, and the Waqood smart system — showing how each works on its own and how they combine into a single coordinated program for the fleet's entire energy transition, from today's pump to tomorrow's plug, delivered by one partner under one account.",
  // 1 — About TAQA Arabia
  "Founded in 2006 and listed on the Egyptian Exchange since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility developer. It operates through four divisions: Gas, covering distribution, EPC work, NGV stations and Mobile CNG; Power, covering generation, solar PV and EV charging; Petroleum, covering oil-marketing stations, lubricants and bulk fuel; and Water, covering desalination and filtration. As an IGU member and IGEM-accredited company, TAQA can fuel a fleet across petroleum, electricity and natural gas from one organisation.",
  // 2 — Regional Presence
  "This map shows TAQA Arabia's actual, live footprint alongside the markets it is currently studying — operations spanning eight countries across Egypt, the GCC, Africa and South Asia. Within Egypt alone, that reach extends across more than twenty governorates, run through four operating divisions of Gas, Power, Petroleum and Water, and supported by a workforce of over 3,400 employees. For a fleet client, that scale means a partner with the people, licences and infrastructure already in place nationwide, not one still building toward it.",
  // 3 — In Numbers
  "In fiscal year 2025 TAQA Arabia posted EGP 13.4 billion in revenue and EGP 1.5 billion in EBITDA, while serving roughly 6.5 million residential gas customers. Behind those numbers sit real fleet-relevant assets: 86 CNG stations, 18 conversion centres and the Master Gas virtual pipeline in Gas; over 130 charging stations and Egypt's first private EV licence in Power; and 230-plus fuel stations, including 172 Wataniya sites, plus two fuel terminals in Petroleum — all reachable through one mobility account, one SLA and consolidated billing.",
  // 4 — Trusted By
  "These are real clients and partners across developers, industrials, hospitality groups and public institutions that already rely on TAQA Arabia's energy and utility services today. This representative cross-section spans multiple divisions of the business, from gas and power to water and petroleum, and reflects relationships built over years of delivery rather than one-off projects. For a fleet operator evaluating TAQA as a partner, it is evidence that organisations of comparable scale and complexity already trust the company across more than one part of their operations.",
  // 5 — The Fleet Challenge
  "For most fleet operators, fuel typically eats thirty to fifty percent of total operating cost, so even small per-litre moves swing the entire budget. Diesel and petrol prices track volatile global oil markets and policy shifts, turning fuel budgeting into guesswork year to year. Meanwhile, tightening ESG targets, low-emission city zones and customer mandates are closing in on combustion-only fleets, while sourcing fuel, gas, chargers and telematics from separate vendors leaves operators juggling many contracts with no single view of spend.",
  // 6 — The Mobility Energy Pathway
  "TAQA charts a phased, three-stage path, not an all-at-once switch. Today, it optimises the fleet you run now, consolidating diesel and petrol under one Waqood account with depot fuelling. As a bridge, it converts vehicles to CNG, fuelled through the station network or Master Gas, for the fastest payback at roughly forty percent lower cost. Finally, it electrifies the fleet with depot and en-route charging, backed by Egypt's first EV licence and strong grid capacity, financed and staged at the fleet's own pace.",
  // 7 — Solutions Overview
  "Four integrated solutions follow across the coming slides. Fuel stations keep today's fleet moving through a nationwide, TAQA-operated network and two owned terminals. Natural gas lets a fleet convert vehicles it already owns through licensed NGV conversion, fuelled by TAQA's CNG network and the Master Gas virtual pipeline. EV charging is delivered end-to-end by the holder of Egypt's first private EV-charging licence, covering depot, destination and en-route AC and DC charging. Waqood ties it together, digitalising fuelling, spend and control from one screen.",
  // 8 — Fuel Stations: Scope
  "For fuel stations, TAQA finances and builds everything on site — the forecourt, tanks and dispensers, the canopy, shop and safety systems, and the automation and fuel-management technology, alongside the fleet cards drivers use daily. TAQA secures the licence, builds to spec, and certifies every tank and dispenser before fleet vehicles begin fuelling on cards tied to each driver. Every litre is captured digitally against agreed limits, while TAQA supplies fuel, runs the site and reports consumption — reinforced by 172 newly added Wataniya stations.",
  // 9 — Fuel Stations: Value Proposition
  "Fuel stations deliver value on several fronts. Depot and on-site fuelling keeps heavy fleets running from base with no detours or queueing at the pump, while quality-assured supply from two owned terminals protects engines and resale value. Consolidated billing turns fuel spend into something predictable, and one TAQA account team removes the juggling of suppliers. TAQA's edge is traceable fuel from its own terminals, a network extended by 172 Wataniya sites, one cashless account, and a ready partner for the CNG and EV steps ahead.",
  // 10 — Fuel Stations: Timeline
  "Getting a fleet onto the network moves quickly. Within the first week, TAQA sets up the fleet profile, fuel account and credit terms; by day fourteen, station access and a depot survey activate the network; and by day thirty, on-site tank and bowser installation brings depot fuelling online where needed. From that point, cashless fuelling runs live across the network, with consolidated monthly billing and consumption analytics, followed by ongoing reviews of route, supply and spend to keep the account optimised as the fleet grows.",
  // 11 — Fuel Stations: Track Record
  "TAQA Petroleum was the first privately owned Egyptian company licensed to supply fuel, building its business on its own retail stations and two storage terminals in Suez and Alexandria. In 2026 it took over management of 172 Wataniya stations through Quick Fuel, pushing its footprint past 230 stations, backed by terminal capacities exceeding 43 units in litres. It is the dependable backbone keeping commercial fleets fuelled today, and the same accredited operator behind the gas and EV infrastructure TAQA is building for tomorrow.",
  // 12 — Natural Gas (CNG): Scope
  "For natural gas, TAQA converts fleet vehicles you own to run on compressed natural gas, then fuels them through mother and daughter CNG stations built with compression and dispensing skids. Vehicles are converted in TAQA's own workshops, gas compressed and dispensed at TAQA CNG stations, and where no pipeline exists, virtual-pipeline trailers bring gas to the depot instead. Drivers fuel using cards that log every fill, and TAQA maintains stations, skids and converted vehicles — giving lower-cost fuel and managed supply off the pipeline grid.",
  // 13 — Natural Gas (CNG): Value Proposition
  "Natural gas is cheaper than petrol and diesel, running up to roughly forty percent lower on fuel cost — the fastest lever on cost. Conversions are bi-fuel, so petrol stays a fallback, and cylinders and stations are licensed and periodically re-tested. Conversion cost is recovered within months from fuel savings, and engines run cleaner and quieter, cutting particulates, NOx and noise. TAQA owns both sides of the switch: 20 conversion centres converting vehicles in-house, plus Master Gas bringing gas to remote depots in days.",
  // 14 — Natural Gas (CNG): Timeline
  "The gas conversion journey moves through clear stages. Assessment of suitable vehicles, routes and payback runs through day ten, followed by a conversion plan choosing dedicated or bi-fuel setups and how the fleet will be supplied — via the station network, Master Gas or a new NGV station. Conversion or station construction runs from day twenty to forty-five, followed by inspection and safety sign-off through day fifty-five, with CNG fuelling live by day sixty-five, then ongoing re-testing and SCADA-managed operations.",
  // 15 — Natural Gas (CNG): Track Record
  "Through its Gas division, TAQA Arabia operates 86 CNG stations and runs more than 18 licensed vehicle-conversion centres across Egypt, while pioneering mobile CNG under the Master Gas brand — a genuine virtual pipeline reaching sites with no fixed gas infrastructure at all. Because one partner both converts vehicles and then fuels them, natural gas becomes the lowest-cost, lowest-disruption fuel switch a fleet can make, unlocking savings of roughly forty percent while avoiding the years-long wait a fixed pipeline connection would otherwise require.",
  // 16 — EV Charging: Scope
  "For EV charging, TAQA sizes depot and route charging around each fleet's duty cycles, then installs AC and DC fast chargers with any grid connection and transformer upgrades needed. A smart charge-management system schedules vehicles to charge overnight at the lowest cost, drivers authenticate through the app and RFID, and every kilowatt-hour is logged per vehicle. TAQA finances the chargers, then operates and reports on the network — leaving the fleet with depot and en-route charging ready to use, on optimised windows with dependable uptime.",
  // 17 — EV Charging: Value Proposition
  "Electricity delivers the lowest energy cost per kilometre of any fuel in the transition, positioning the operator ahead of tightening regulation, fuel bans and customer demands. Zero tailpipe emissions give the strongest possible ESG and city-access position, while lifecycle maintenance, an operator and user app, and a 24/7 hotline keep every charger available and billing correctly. TAQA's edge includes flexible financing up to a full profit-share model with zero charging capex, depot-to-highway coverage, and secured grid capacity through its own power-distribution arm.",
  // 18 — EV Charging: Timeline
  "Rolling out EV charging takes roughly 110 days start to finish. Site assessment, covering the grid survey, duty-cycle analysis and site mix, runs through day fourteen, followed by structuring the commercial model — full investment or profit-share — through day thirty. Charger and grid-equipment procurement follows through day sixty, then installation across depot and en-route locations with grid tie-in through day ninety-five, and app onboarding and go-live through day 110. From there, 24/7 monitoring, maintenance and billing keep the network running around the clock.",
  // 19 — EV Charging: Track Record
  "TAQA Power secured Egypt's first private EV-charging licence and is rolling out AC and DC charging across depot, commercial and highway locations, supported by an operator and user app plus a 24/7 hotline. As Egypt's largest private power distributor, with capacity behind more than 130 live charge points already, TAQA pairs its charging rollout with the grid, solar and storage assets the rest of the business already owns. That combination gives any fleet a complete electrification package from a single, proven provider.",
  // 20 — Waqood Smart System: Scope
  "For the Waqood smart system, TAQA configures every vehicle, driver and fuelling rule inside the Waqood platform, then issues RFID stickers for vehicles and PINs for drivers, integrated with reader hardware at the station side. At the pump, the system verifies the vehicle, the driver and their limit before allowing only authorised fuelling within the set rules, and every transaction streams live to dashboards the moment it happens. The result is total control over fuelling, every litre tracked, and leakage or fraud designed out entirely.",
  // 21 — Waqood Smart System: Value Proposition
  "Waqood brings litres of fuel, cubic metres of gas and kilowatt-hours of charging into one dashboard, giving total-energy visibility across every fuel type the fleet uses. Per-driver PINs, daily limits and captured pump readings make unauthorised fuelling almost impossible, while live analytics show managers where cost and waste sit, surfacing inefficient vehicles worth fixing. TAQA's edge: Waqood is its own EnerTech company, owned rather than rented, plugged into TAQA's nationwide network, and built for the transition from diesel to CNG to EV under one provider.",
  // 22 — Waqood Smart System: Timeline
  "Getting Waqood live moves in clear stages. Discovery of vehicles, drivers and rules takes the first week, followed by onboarding — issuing stickers, PINs and limits — through day fourteen. Fuel, CNG and EV data integrate into the platform through day twenty-one, and the single-pane dashboard and billing go fully live by day thirty. From there, limits, alerts and reports are tuned through day forty-five, and ongoing analytics reviews cover ESG performance and savings opportunities as ordinary business as usual.",
  // 23 — Waqood Smart System: Track Record
  "Waqood is TAQA Arabia's own EnerTech company, purpose-built to digitalise fuel payments for fleet operators. At the pump, a driver scans the vehicle's sticker, the system captures the pump reading, and the driver enters a personal PIN before the transaction is approved — while fleet managers set daily limits, receive fraud alerts and watch live analytics on a single dashboard. Extended across fuel, CNG and EV charging, Waqood turns a complex, multi-fuel operation into one optimised, fully reported system, owned end-to-end by TAQA Arabia.",
  // 24 — Why One Partner
  "Bringing fuel, gas, EV charging and Waqood under one roof means one service-level agreement covering every energy type, with one uptime guarantee and one renewal instead of several. It also means one communication point through a dedicated account team and 24/7 hotline, and one commercial relationship with consolidated billing and a single negotiation replacing up to six separate procurement cycles. Solutions are engineered to interoperate on shared accounts and monitoring, and end-to-end accountability sits with one owner — turning fragmented suppliers into a single operator.",
  // 25 — Integrated Economics
  "A diesel-only fleet today carries a high, volatile fuel bill exposed to every oil-price spike, sources fuel and chargers from fragmented vendors, loses money to leakage through cash and paper receipts, and carries maximum emissions and low-emission-zone exposure. With TAQA's integrated mix, fuel cost falls by up to forty percent as CNG and EV displace the priciest litres, everything runs through one partner, Waqood's PINs design leakage out, and carbon falls every year — delivering a lower cost per kilometre and a stronger ESG story.",
  // 26 — From Pump to Plug (Closing)
  "From pump to plug, TAQA Arabia is the one partner that can carry your fleet from today's diesel to tomorrow's electric — spanning 230-plus fuel stations, 86 CNG stations, Egypt's first EV-charging licence with 130-plus charge points live, and the Waqood platform tying every energy type into one dashboard, financed at every step. The next move is simple: let TAQA build your fleet's transition map, starting with a baseline of your fuel cost, emissions and savings — reach out to your TAQA account team today.",
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FleetMobilityClients() {
  return (
    <DeckShell
      title="Fleet & Mobility Clients"
      subtitle="TAQA Arabia · Integrated Energy & Mobility Solutions · Jun 2026"
      sections={SECTIONS}
      slides={SLIDES}
      narration={NARRATION}
      pdf="fleet-mobility-clients.pdf"
    />
  );
}
