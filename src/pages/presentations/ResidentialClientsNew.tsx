import { DeckShell } from "./DeckShell";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import {
  Flame, Zap, Droplets, Truck, Battery, Car, Sun, Globe, CheckCircle2,
  ArrowRight, Star, MapPin,
} from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";
import {
  SlideStyles, Kicker, CornerWash, GhostNum, Bracket, BlueprintGrid,
  ScopeSlide, ValuePropSlide, TimelineSlide, TrackRecordSlide,
  d, hideImg, lighter,
} from "./slides";

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

// ─── Design constants ─────────────────────────────────────────────────────────

const NAVY = "#002060";
const GOLD = "#FFC10E";
const VIOLET = "#7c3aed";

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

const SOLUTION_CHIPS: { s: string; c: string }[] = [
  { s: "Mobile CNG",     c: "#E68A00" },
  { s: "Electricity",    c: "#d97706" },
  { s: "Water",          c: "#0095C8" },
  { s: "Gas",            c: "#009045" },
  { s: "Diesel Back-up", c: "#6B6B6B" },
  { s: "EV Charging",    c: "#7c3aed" },
  { s: "Solar PV",       c: "#16a34a" },
];

// ─── Slide 0: Cover ───────────────────────────────────────────────────────────

function CoverSlide() {
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0d0620 0%, #1e1145 55%, #2a1259 100%)" }}
    >
      <SlideStyles />
      <img
        src={P.cover}
        alt="Red Sea resort coastline at Soma Bay"
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(115deg, rgba(13,6,32,0.96) 0%, rgba(30,17,69,0.86) 48%, rgba(124,58,237,0.42) 100%)" }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-40 h-[620px] w-[620px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.24), transparent 65%)" }}
      />

      <div className="relative z-10 flex h-full flex-col px-16 py-12">
        {/* Top row */}
        <div className="sx-up flex items-center justify-between" style={d(0)}>
          <img src={taqaLogo} alt="TAQA Arabia logo" className="h-12 rounded-lg bg-white/95 px-3 py-1.5 object-contain shadow-lg" />
          <Kicker color={VIOLET} dark>TAQA Arabia · Jan 2026</Kicker>
        </div>

        <div className="flex-1" />

        {/* Title block */}
        <div>
          <div
            className="sx-up h-[3px] w-16 rounded-full"
            style={{ ...d(80), background: `linear-gradient(90deg, ${VIOLET}, ${GOLD})` }}
          />
          <h1 className="sx-up mt-6 font-display text-[76px] font-bold leading-[1.02] tracking-tight text-white" style={d(140)}>
            Residential
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(95deg, ${GOLD} 0%, #ffd75e 55%, #ffe08a 100%)` }}
            >
              Customers
            </span>
          </h1>
          <p className="sx-up mt-5 text-[19px] text-white/85" style={d(220)}>
            Integrated Energy &amp; Utility Solutions for Developers &amp; Communities
          </p>
        </div>

        {/* Solution chips */}
        <div className="mt-9 flex flex-wrap gap-2.5">
          {SOLUTION_CHIPS.map((c, i) => (
            <span
              key={c.s}
              className="sx-up inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[15px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-md"
              style={d(300 + i * 50)}
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
            Seven solutions · One partner · One SLA
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 1: About ───────────────────────────────────────────────────────────

function AboutSlide() {
  const divisions = [
    { label: "Gas",       icon: <Flame className="h-5 w-5" />,    desc: "Distribution, EPC & virtual pipeline",   color: "#E68A00" },
    { label: "Power",     icon: <Zap className="h-5 w-5" />,      desc: "MV/LV distribution, generation & solar", color: "#d97706" },
    { label: "Petroleum", icon: <Truck className="h-5 w-5" />,    desc: "Mobile CNG & fuel retail",               color: "#7c3aed" },
    { label: "Water",     icon: <Droplets className="h-5 w-5" />, desc: "Desalination & treatment",               color: "#0095C8" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color={VIOLET} />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full gap-10 p-14">
        {/* Left — narrative */}
        <div className="flex w-[530px] shrink-0 flex-col">
          <div className="sx-up" style={d(0)}>
            <Kicker color={VIOLET}>TAQA Arabia · Who We Are</Kicker>
          </div>
          <h2 className="sx-up mt-5 font-display text-[30px] font-bold leading-[1.15] tracking-tight text-[#002060]" style={d(60)}>
            Egypt's leading integrated energy infrastructure developer — a true one-stop-shop for residential utilities
          </h2>
          <div
            className="sx-up mt-4 h-[3px] w-14 rounded-full"
            style={{ ...d(110), background: `linear-gradient(90deg, ${VIOLET}, ${GOLD})` }}
          />
          <p className="sx-up mt-5 text-[17px] leading-relaxed text-slate-600" style={d(160)}>
            Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest private-sector energy and
            utility developer. Across four divisions — Gas, Power, Petroleum and Water — TAQA finances, builds, owns and
            operates the utility backbone of residential communities, industrial zones and touristic destinations.
          </p>
          <p className="sx-up mt-4 text-[17px] leading-relaxed text-slate-600" style={d(220)}>
            For a residential developer, that means{" "}
            <strong className="font-semibold text-[#002060]">one accredited partner</strong> can deliver gas, electricity,
            water, back-up power and EV charging — under a single SLA, with one point of contact.
          </p>
        </div>

        {/* Right — photo + divisions */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div
            className="sx-up relative h-[178px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-md"
            style={{ ...d(120), background: "linear-gradient(135deg, #1e1145, #0d0620)" }}
          >
            <img
              src={P.buildings}
              alt="Contemporary residential compound architecture"
              loading="lazy"
              onError={hideImg}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(13,6,32,0) 35%, rgba(13,6,32,0.72) 100%)" }} />
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
    { value: "8",      label: "Countries",           sub: "Egypt, GCC, Africa & Greece", hero: true },
    { value: "4",      label: "Operating divisions", sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates",        sub: "Across Egypt" },
    { value: "3,400+", label: "Employees",           sub: "Across all divisions" },
  ];
  const intl = [
    { region: "GCC",    desc: "Partnered for Sovereign water-desalination projects." },
    { region: "Africa", desc: "Pursuing gas and power opportunities across sub-Saharan markets." },
    { region: "Greece", desc: "Expanding into European energy infrastructure." },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color={VIOLET} />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color={VIOLET}>TAQA Arabia · Regional Presence</Kicker>
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
                    ? "linear-gradient(100deg, #ffffff, #fbbf24)"
                    : "linear-gradient(100deg, #7c3aed, #a78bfa)",
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
            <Bracket color={VIOLET} pos="tl" />
            <div className="mb-3 flex items-center gap-2.5 pl-3">
              <Globe className="h-[18px] w-[18px] text-[#7c3aed]" />
              <h3 className="font-display text-[17px] font-bold tracking-tight text-[#002060]">International Expansion</h3>
            </div>
            <div className="space-y-2.5 pl-3">
              {intl.map(x => (
                <div key={x.region} className="flex items-start gap-3">
                  <span className="mt-[7px] flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#f5f3ff] text-[#7c3aed]">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-[16px] leading-snug text-slate-600">
                    <span className="font-semibold text-[#002060]">{x.region}</span> — {x.desc}
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
              Concessions across Egypt with 15-year renewals. TAQA serves the full spectrum:
            </p>
            <div className="relative mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {["Residential communities & compounds", "Industrial zones & factories", "Touristic destinations & resorts", "Commercial & mixed-use developments"].map(i => (
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
    { value: "EGP 13.4bn", label: "Revenue",                   sub: "FY 2025", hero: true },
    { value: "EGP 1.5bn",  label: "EBITDA",                    sub: "FY 2025" },
    { value: "~6.5M",      label: "Residential gas customers", sub: "Active connections" },
  ];
  const divCards = [
    { div: "GAS",            icon: <Flame className="h-4 w-4" />,    color: "#E68A00", stat: "+10,000 km, 8 governorates (15yr)" },
    { div: "POWER",          icon: <Zap className="h-4 w-4" />,      color: "#d97706", stat: "+1,600 MVA, +150 MW" },
    { div: "WATER",          icon: <Droplets className="h-4 w-4" />, color: "#0095C8", stat: "+47,000 m³/day, 15 locations" },
    { div: "MOBILITY & CNG", icon: <Truck className="h-4 w-4" />,    color: "#7c3aed", stat: "86 CNG stations, 1st EV licence" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <CornerWash color={VIOLET} />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color={VIOLET}>TAQA Arabia · In Numbers</Kicker>
        </div>
        <h2 className="sx-up mt-4 font-display text-[34px] font-bold leading-tight tracking-tight text-[#002060]" style={d(60)}>
          The scale behind a single residential utility partner
        </h2>
        <p className="sx-up mt-2 text-[16px] leading-snug text-slate-500" style={d(100)}>
          FY 2025 group performance across four operating divisions.
        </p>

        {/* Hero bento */}
        <div className="mt-5 grid grid-cols-4 gap-4">
          {heroStats.map((m, i) => (
            <div
              key={m.label}
              className={`sx-up relative overflow-hidden rounded-2xl p-6 ${
                m.hero ? "col-span-2 text-white shadow-xl" : "bg-white ring-1 ring-black/5 shadow-sm"
              }`}
              style={{
                ...d(140 + i * 70),
                ...(m.hero ? { background: "linear-gradient(130deg, #0d0620 0%, #1e1145 55%, #4c1d95 100%)" } : {}),
              }}
            >
              {m.hero && <BlueprintGrid />}
              {m.hero && <Bracket color={GOLD} pos="br" />}
              <div
                className={`relative font-display font-bold leading-none tracking-tight bg-clip-text text-transparent ${m.hero ? "text-[52px]" : "text-[36px]"}`}
                style={{
                  backgroundImage: m.hero
                    ? "linear-gradient(100deg, #FFC10E, #ffe08a)"
                    : "linear-gradient(100deg, #7c3aed, #a78bfa)",
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
              style={d(380 + i * 70)}
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
    { num: "01", label: "Mobile CNG",               desc: "Off-grid natural gas delivered via mobile virtual pipeline — zero infrastructure capex.", icon: <Truck className="h-5 w-5" />,    color: "#E68A00" },
    { num: "02", label: "Electricity Distribution", desc: "Turnkey MV/LV networks, smart metering and licensed lifetime O&M.",                       icon: <Zap className="h-5 w-5" />,      color: "#d97706" },
    { num: "03", label: "Water Desalination",       desc: "Reverse-osmosis plants and digitalized, solar-powered water operations.",                 icon: <Droplets className="h-5 w-5" />, color: "#0095C8" },
    { num: "04", label: "Gas Distribution",         desc: "End-to-end gas network EPC — design, build, commission and operate.",                     icon: <Flame className="h-5 w-5" />,    color: "#009045" },
    { num: "05", label: "Diesel Rental",            desc: "Emergency & back-up power gensets on a flexible rental/OPEX model.",                      icon: <Battery className="h-5 w-5" />,  color: "#6B6B6B" },
    { num: "06", label: "EV Chargers",              desc: "AC, DC and golf-car charging with full-investment green-mobility services.",              icon: <Car className="h-5 w-5" />,      color: "#7c3aed" },
    { num: "07", label: "Solar PV",                 desc: "Rooftop and common-area solar PV — cutting bills, with flexible ownership.",              icon: <Sun className="h-5 w-5" />,      color: "#16a34a" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />
      <GhostNum n={7} />
      <CornerWash color={VIOLET} />
      <BlueprintGrid light />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div>
          <div className="sx-up" style={d(0)}>
            <Kicker color={VIOLET}>Residential Customers · Solutions Overview</Kicker>
          </div>
          <h2 className="sx-up mt-4 font-display text-[40px] font-bold leading-none tracking-tight text-[#002060]" style={d(60)}>
            Seven integrated solutions — one partner, one SLA
          </h2>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-4 grid-rows-2 gap-4">
          {solutions.map((s, i) => (
            <div
              key={s.num}
              className="sx-up group relative flex flex-col overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-[0_10px_30px_-16px_rgba(0,32,96,0.25)]"
              style={d(140 + i * 55)}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${s.color}, ${lighter(s.color)})` }} />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[76px] font-bold leading-none"
                style={{ color: s.color, opacity: 0.07 }}
              >
                {s.num}
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${s.color}, ${lighter(s.color)})` }}
              >
                {s.icon}
              </div>
              <h3 className="mt-2.5 font-display text-[17px] font-bold leading-tight tracking-tight text-[#002060]">{s.label}</h3>
              <p className="mt-1.5 text-[15px] leading-snug text-slate-600">{s.desc}</p>
              <div className="mt-auto flex items-center gap-1.5 pt-2 font-display text-[13px] font-semibold uppercase tracking-[0.18em]" style={{ color: s.color }}>
                Solution {s.num}
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}

          {/* 7→1 dark card */}
          <div
            className="sx-up relative flex flex-col justify-end overflow-hidden rounded-2xl p-4 text-white shadow-lg"
            style={{ ...d(140 + 7 * 55), background: "linear-gradient(155deg, #002060 0%, #001034 100%)" }}
          >
            <BlueprintGrid />
            <Bracket color={GOLD} pos="tr" />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4), transparent 65%)" }}
            />
            <span
              className="relative font-display text-[64px] font-bold leading-none bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(95deg, ${GOLD}, #ffe08a)` }}
            >
              7→1
            </span>
            <p className="relative mt-2 text-[15px] font-medium leading-snug text-white/90">
              Seven utilities delivered by one accountable partner, under one SLA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 33: Why One Partner ────────────────────────────────────────────────

function WhyOnePartnerSlide() {
  const benefits = [
    { label: "One SLA",                     desc: "A single service-level agreement governs gas, power, water, back-up and EV — one uptime guarantee, one penalty regime, one renewal." },
    { label: "One Communication Point",     desc: "A single account team and 24/7 hotline for every utility." },
    { label: "One Commercial Relationship", desc: "Consolidated billing, aligned contract terms and a single negotiation instead of six separate cycles." },
    { label: "One Engineering Standard",    desc: "Utilities designed to interoperate from day one — shared trenches, shared metering, shared monitoring." },
    { label: "One Accountable Owner",       desc: "End-to-end responsibility removes interface risk and finger-pointing." },
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
            One SLA, one communication point, one accountable operator — across every utility in the community
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-5">
          {/* All-solutions dark card */}
          <div
            className="sx-up relative flex flex-col overflow-hidden rounded-2xl p-6 shadow-xl"
            style={{ ...d(180), background: "linear-gradient(145deg, #002060 0%, #0a2f7a 70%, #123c94 100%)" }}
          >
            <BlueprintGrid />
            <Bracket color={GOLD} pos="br" />
            <h3 className="relative font-display text-[18px] font-bold tracking-tight text-[#FFC10E]">Solutions Under One SLA</h3>
            <div className="relative mt-4 grid grid-cols-2 gap-2.5">
              {SOLUTION_CHIPS.map((s, i) => (
                <div
                  key={s.s}
                  className="sx-up flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-2.5 ring-1 ring-white/10"
                  style={d(240 + i * 45)}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: lighter(s.c) }} />
                  <span className="text-[16px] font-semibold text-white">{s.s}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-auto flex items-end gap-3 border-t border-white/10 pt-4">
              <span
                className="font-display text-[44px] font-bold leading-none bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(95deg, ${GOLD}, #ffe08a)` }}
              >
                7→1
              </span>
              <span className="pb-1 text-[15px] leading-snug text-white/80">
                seven utilities,
                <br />
                one accountable operator
              </span>
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
                <span aria-hidden className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#7c3aed] to-[#a78bfa]" />
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7c3aed]/10 text-[#7c3aed]">
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

// ─── Slide 34: Bundle ─────────────────────────────────────────────────────────

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
          style={{ ...d(520), background: "linear-gradient(120deg, #002060 0%, #1e1145 100%)" }}
        >
          <BlueprintGrid />
          <p className="relative text-[16px] leading-snug text-white/85">
            <span className="font-bold text-[#FFC10E]">Sold as one SLA:</span>{" "}
            lower combined energy cost · shared infrastructure · one billing platform · stronger ESG story · single accountable operator
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 35: Success Story — Soma Bay ──────────────────────────────────────

function SomaBaySlide() {
  const stats = [
    { value: "+47,000 m³/day", label: "Desalination capacity" },
    { value: "20 MW",          label: "Solar plant (Sharm El-Sheikh)" },
    { value: "50,000+",        label: "People served" },
    { value: "8,560 t",        label: "CO₂ avoided per year" },
  ];
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0d0620 0%, #1e1145 55%, #2a1259 100%)" }}
    >
      <SlideStyles />
      <img
        src={P.resort}
        alt="Red Sea resort coastline at Soma Bay"
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(100deg, rgba(13,6,32,0.95) 0%, rgba(30,17,69,0.8) 50%, rgba(124,58,237,0.35) 100%)" }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-44 h-[620px] w-[620px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,193,14,0.18), transparent 65%)" }}
      />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up" style={d(0)}>
          <Kicker color={GOLD} dark>Success Story</Kicker>
        </div>
        <h2 className="sx-up mt-4 font-display text-[46px] font-bold leading-none tracking-tight text-white" style={d(70)}>
          Soma{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(95deg, #a78bfa, #c4b5fd)" }}
          >
            Bay
          </span>
        </h2>
        <div className="sx-up mt-3 flex items-start gap-2.5" style={d(130)}>
          <Star className="mt-1 h-5 w-5 shrink-0 text-[#FFC10E]" style={{ fill: GOLD }} />
          <p className="text-[19px] font-medium leading-snug text-[#FFC10E]">
            Egypt's most celebrated eco-resort — powered by the TAQA one-stop-shop
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-[1fr_430px] gap-6">
          {/* Narrative glass card */}
          <div className="sx-up relative flex flex-col justify-center overflow-hidden rounded-2xl bg-white/[0.07] p-8 ring-1 ring-white/15 backdrop-blur-md" style={d(190)}>
            <Bracket color="#a78bfa" pos="tl" />
            <p className="pl-3 text-[18px] leading-[1.7] text-white/90">
              At Soma Bay on the Red Sea, TAQA Arabia delivers the full integrated utility stack: Egypt's first eco
              solar-powered desalination plant, an MV/LV distribution network, and EV charging — all under one SLA.
            </p>
            <p className="mt-4 pl-3 text-[18px] leading-[1.7] text-white/90">
              The result: a landmark resort that runs on renewable energy, serves 50,000+ people with guaranteed-quality
              water, and sets the benchmark for sustainable touristic development in Egypt.
            </p>
            <div className="mt-6 flex items-center gap-2.5 border-t border-white/10 pl-3 pt-4">
              <ArrowRight className="h-4 w-4 shrink-0 text-[#FFC10E]" />
              <p className="text-[17px] font-semibold leading-snug text-[#FFC10E]">
                Explore the integrated residential utility model for your development
              </p>
            </div>
          </div>

          {/* Glass stat bento — 2×2 */}
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="sx-up flex flex-col justify-center rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md"
                style={d(260 + i * 70)}
              >
                <div
                  className="font-display text-[26px] font-bold leading-tight tracking-tight bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(100deg, #ffffff, ${GOLD})` }}
                >
                  {s.value}
                </div>
                <div className="mt-1.5 text-[15px] leading-snug text-white/75">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sx-in mt-5 flex shrink-0 items-center justify-between border-t border-white/10 pt-4" style={d(540)}>
          <p className="flex items-center gap-2 font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/55">
            <Star className="h-3.5 w-3.5 text-[#FFC10E]" /> TAQA Arabia · Integrated Energy &amp; Utility Solutions
          </p>
          <p className="font-display text-[14px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Contact TAQA Arabia
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SLIDES Array (36 slides, 0-indexed) ─────────────────────────────────────

const cngIcon    = <Truck className="w-5 h-5" />;
const elecIcon   = <Zap className="w-5 h-5" />;
const waterIcon  = <Droplets className="w-5 h-5" />;
const gasIcon    = <Flame className="w-5 h-5" />;
const dieselIcon = <Battery className="w-5 h-5" />;
const evIcon     = <Car className="w-5 h-5" />;
const solarIcon  = <Sun className="w-5 h-5" />;

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
        solutionNum={1} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
        subtitle="Off-grid natural gas delivered via mobile virtual pipeline — zero infrastructure capex."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the gas you consume — little to no upfront CapEx."
        taqaInvests={["Mother station & compression skids", "CNG/virtual-pipeline trailers", "On-site decompression & PRMS skid", "Metering, odorization & safety controls", "BOO/BOOT asset financing"]}
        steps={[
          "Gas is compressed at a TAQA mother station to ~250 bar.",
          "CNG trailers haul it to your community as a virtual pipeline.",
          "On-site skids decompress and regulate gas to delivery pressure.",
          "Odorized, metered gas flows to homes and amenities.",
          "TAQA monitors volumes and refills before you run low.",
        ]}
        whatYouReceive={["Piped-quality gas with no physical pipeline", "Reliable supply to off-grid compounds", "Seamless switch-over once the grid arrives"]}
      />
    ),
  },
  // 6
  {
    title: "Mobile CNG: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
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
        solutionNum={1} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
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
        solutionNum={1} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
        heading="El-Kharga — Virtual Pipeline City"
        subheading="First Egyptian city to run entirely on natural gas"
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

  // ── Electricity Distribution ─────────────────────────────────────────────────
  // 9
  {
    title: "Electricity Distribution: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#d97706" icon={elecIcon} photo={P.electricity}
        subtitle="Turnkey distribution networks for residential developments — from power sourcing and design through licensed lifetime O&M."
        taqaInvests={["MV/LV substations & ring-main units", "Distribution transformers", "Cabling, switchgear & protection", "Smart meters & SCADA", "BOO/BOOT network financing"]}
        steps={[
          "TAQA designs the network to the community's phased load.",
          "Substations and feeders are built and energized.",
          "Power reaches every home and amenity at the right voltage.",
          "Smart meters bill each unit.",
          "24/7 monitoring and rapid response keep the community powered.",
        ]}
        whatYouReceive={["A licensed community power network", "Reliable supply to every unit", "Operation, metering and billing handled"]}
      />
    ),
  },
  // 10
  {
    title: "Electricity Distribution: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#d97706" icon={elecIcon} photo={P.electricity}
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
        solutionNum={2} solutionLabel="Electricity Distribution" color="#d97706" icon={elecIcon} photo={P.electricity}
        phases={[
          { days: "Day 0–30",    label: "Power Sourcing" },
          { days: "Day 30–75",   label: "Engineering Approval" },
          { days: "Day 75–120",  label: "MEP Approval" },
          { days: "Day 120–240", label: "Network Build" },
          { days: "Day 240–300", label: "Smart Metering" },
          { days: "Day 300+",    label: "Energise & O&M" },
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
        solutionNum={2} solutionLabel="Electricity Distribution" color="#d97706" icon={elecIcon} photo={P.electricity}
        heading="Powering residential communities across Egypt"
        subheading="TAQA Power designs, builds and operates licensed electrical distribution networks for residential communities across Egypt, with +1,600 MVA in the distribution portfolio and 26 residential concessions"
        body="From gated compounds to touristic resorts, TAQA brings the same turnkey discipline — grid interconnection to smart metering — to any development."
        stats={[
          { value: "+1,600 MVA", label: "Distribution portfolio" },
          { value: "26",         label: "Residential concessions" },
          { value: "+12,000",    label: "Customers served" },
          { value: "24/7",       label: "SCADA monitoring" },
        ]}
      />
    ),
  },

  // ── Water Desalination ───────────────────────────────────────────────────────
  // 13
  {
    title: "Water Desalination: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={3} solutionLabel="Water Desalination" color="#0095C8" icon={waterIcon} photo={P.water}
        subtitle="Reverse-osmosis plants and digitalized, solar-powered water operations."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the water you use — little to no upfront CapEx."
        taqaInvests={["Intake & pre-treatment system", "Reverse-osmosis desalination trains", "Post-treatment & storage tanks", "Pumping, distribution & smart meters", "BOO/BOOT plant financing"]}
        steps={[
          "Seawater or brackish water is drawn in and pre-treated.",
          "Reverse-osmosis membranes remove salt and impurities.",
          "Clean water is remineralized to potable standard.",
          "Treated water is stored, pumped and distributed to the community.",
          "TAQA operates the plant and guarantees output quality.",
        ]}
        whatYouReceive={["Potable water independent of the public network", "Guaranteed volume and quality", "Full plant operation and maintenance"]}
      />
    ),
  },
  // 14
  {
    title: "Water Desalination: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={3} solutionLabel="Water Desalination" color="#0095C8" icon={waterIcon} photo={P.water}
        whatYouGain={[
          { label: "50% Lower Energy Use",        desc: "Advanced energy-efficient desalination plus VSDs, peak-demand control and solar PV cut power use." },
          { label: "Seawater & Brackish Supply",  desc: "Seawater RO for coastal compounds and brackish RO for inland cities like New Cairo & 6th of October." },
          { label: "Resident Experience",         desc: "Dynamic billing, consumption analytics and real-time notifications via mobile app." },
          { label: "Sustainability & ESG Impact", desc: "Solar-powered desalination, brine management and a reduced freshwater-extraction footprint." },
        ]}
        taqaEdge={[
          { label: "Flexible Commercial Models", desc: "EPC, long-term O&M or BOO." },
          { label: "Green-Rating Enabler",       desc: "Solar-powered RO and brine management support LEED/green-community certification." },
          { label: "Scales With the Community",  desc: "Modular RO trains add capacity in phases, matching plant output to real occupancy growth." },
          { label: "Smart Operations & Uptime",  desc: "Real-time monitoring, leak & failure detection and predictive-maintenance dashboards." },
        ]}
      />
    ),
  },
  // 15
  {
    title: "Water Desalination: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={3} solutionLabel="Water Desalination" color="#0095C8" icon={waterIcon} photo={P.water}
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
        solutionNum={3} solutionLabel="Water Desalination" color="#0095C8" icon={waterIcon} photo={P.water}
        heading="Soma Bay — Eco Solar Desalination"
        subheading="Egypt's first & largest eco solar-powered water-desalination plant"
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

  // ── Gas Distribution ─────────────────────────────────────────────────────────
  // 17
  {
    title: "Gas Distribution: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={4} solutionLabel="Gas Distribution" color="#009045" icon={gasIcon} photo={P.pipeline}
        subtitle="End-to-end gas network EPC — design, build, commission and operate."
        taqaInvests={["City-gate & pressure-reduction stations", "Steel & PE distribution mains", "Service lines to each home", "Domestic meters & regulators", "BOO/BOOT network financing"]}
        steps={[
          "TAQA secures the concession and designs the gas network.",
          "Mains and service lines are laid across the community.",
          "Pressure is regulated down to safe domestic levels.",
          "Each home is connected, metered and commissioned.",
          "TAQA operates, inspects and bills for the gas delivered.",
        ]}
        whatYouReceive={["A licensed piped-gas network", "Safe, metered gas to every home", "Lifetime operation and emergency response"]}
      />
    ),
  },
  // 18
  {
    title: "Gas Distribution: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={4} solutionLabel="Gas Distribution" color="#009045" icon={gasIcon} photo={P.pipeline}
        whatYouGain={[
          { label: "Diesel & LPG Fuel-Switching",          desc: "Manage the full transition from diesel and LPG to cleaner, cheaper natural gas." },
          { label: "Flexible Gas Sourcing — M-CNG or SNG", desc: "Where no fixed pipeline exists, gas is supplied via M-CNG or SNG — no community waits." },
          { label: "Higher Asset Value",                   desc: "Connection to the national gas grid lifts community asset value and tenancy." },
          { label: "Lower Living Costs",                   desc: "Subsidized piped natural gas is far cheaper than LPG cylinders or electric heating for residents." },
        ]}
        taqaEdge={[
          { label: "Flexible Commercial Models",    desc: "EPC, long-term O&M or BOO." },
          { label: "External & Internal Networks",  desc: "TAQA builds the external backbone and the internal in-compound and in-building network." },
          { label: "One Partner Across all Phases", desc: "Single accountable party from feasibility to handover." },
          { label: "Standards Compliance",          desc: "Aligned with IGEM, EGAS and international gas-safety standards." },
        ]}
      />
    ),
  },
  // 19
  {
    title: "Gas Distribution: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={4} solutionLabel="Gas Distribution" color="#009045" icon={gasIcon} photo={P.pipeline}
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
        solutionNum={4} solutionLabel="Gas Distribution" color="#009045" icon={gasIcon} photo={P.pipeline}
        heading="Egypt's largest private gas distribution network"
        subheading="TAQA Gas operates one of Egypt's largest private piped-gas networks: +10,000 km of distribution mains across 8 governorates with 15-year renewable concessions"
        body="With 66% of Egypt's private gas concessions and ~6.5 million residential customers, TAQA is the proven gas infrastructure partner for any residential development."
        stats={[
          { value: "+10,000 km", label: "Network" },
          { value: "8",          label: "Governorate concessions (15yr)" },
          { value: "66%",        label: "Private concession share" },
          { value: "~6.5M",      label: "Residential customers" },
        ]}
      />
    ),
  },

  // ── Diesel Rental ────────────────────────────────────────────────────────────
  // 21
  {
    title: "Diesel Rental: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={5} solutionLabel="Diesel Rental" color="#6B6B6B" icon={dieselIcon} photo={P.generator}
        subtitle="Emergency & back-up power gensets on a flexible rental/OPEX model."
        taqaInvests={["Rental diesel generator sets", "Fuel tanks & automatic transfer switch", "Synchronization & distribution panels", "Remote telemetry & monitoring", "Fuel-supply logistics"]}
        steps={[
          "TAQA sizes gensets to the site's standby or prime load.",
          "Units are delivered, installed and synchronized on site.",
          "Generators start automatically on grid loss or demand.",
          "TAQA manages refuelling, service and remote monitoring.",
          "Units scale up or down as the project's needs change.",
        ]}
        whatYouReceive={["Immediate, reliable backup or prime power", "Fuel, service and monitoring included", "Flexible capacity with no asset purchase", "Power on day one"]}
      />
    ),
  },
  // 22
  {
    title: "Diesel Rental: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={5} solutionLabel="Diesel Rental" color="#6B6B6B" icon={dieselIcon} photo={P.generator}
        whatYouGain={[
          { label: "Business / Community Continuity", desc: "Instant back-up power keeps lifts, pumps, lighting and amenities running through any outage." },
          { label: "Uninterrupted Living",            desc: "Residents keep power to elevators, water pumps, security and common areas during grid failures." },
          { label: "Construction-Phase Power",        desc: "Temporary power for the build site converts seamlessly into back-up power at handover." },
          { label: "Hands-Off Reliability",           desc: "Fully managed fuel, service, monitoring and rapid response — zero operational burden." },
        ]}
        taqaEdge={[
          { label: "Full OPEX Model",            desc: "No genset purchase — a fixed rental per kVA, fuel and maintenance all-in." },
          { label: "Construction to Operations", desc: "One provider from site power during build through lifetime back-up." },
          { label: "500 kVA to 20 MVA",          desc: "Any load, any phase of development, scaled to real need." },
          { label: "24/7 O&M & Rapid Response",  desc: "Dedicated team, remote telemetry and SLA-backed response times." },
        ]}
      />
    ),
  },
  // 23
  {
    title: "Diesel Rental: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={5} solutionLabel="Diesel Rental" color="#6B6B6B" icon={dieselIcon} photo={P.generator}
        phases={[
          { days: "Day 0–7",   label: "Load Assessment" },
          { days: "Day 7–14",  label: "Genset Sizing" },
          { days: "Day 14–25", label: "Delivery" },
          { days: "Day 25–35", label: "Integration (synchronization, ATS & switchgear tie-in)" },
          { days: "Day 35–45", label: "Commissioning" },
          { days: "Day 45+",   label: "24/7 O&M" },
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
        solutionNum={5} solutionLabel="Diesel Rental" color="#6B6B6B" icon={dieselIcon} photo={P.generator}
        heading="Captive Power — 6 Plants"
        subheading="Owning and operating captive generation across Egypt's toughest sites"
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

  // ── EV Chargers ──────────────────────────────────────────────────────────────
  // 25
  {
    title: "EV Chargers: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={6} solutionLabel="EV Chargers" color="#7c3aed" icon={evIcon} photo={P.ev}
        subtitle="AC, DC and golf-car charging with full-investment green-mobility services."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the energy you charge — little to no upfront CapEx."
        taqaInvests={["AC & DC fast-charging units", "Grid connection & upgrade works", "Energy-management & load balancing", "Payment, app & access platform", "BOO/BOOT charger financing"]}
        steps={[
          "TAQA assesses parking, demand and available grid capacity.",
          "Chargers and any needed grid upgrades are installed.",
          "Smart load-management shares power across charging points.",
          "Residents authenticate and charge via app or RFID.",
          "TAQA operates, maintains and settles payments.",
        ]}
        whatYouReceive={["A ready community charging network", "Seamless app-based charging & billing", "Maintained, future-ready infrastructure"]}
      />
    ),
  },
  // 26
  {
    title: "EV Chargers: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={6} solutionLabel="EV Chargers" color="#7c3aed" icon={evIcon} photo={P.ev}
        whatYouGain={[
          { label: "Full Charger Range",             desc: "AC, DC fast and golf-car chargers cover every residential and resort mobility need." },
          { label: "Future-Proof Amenity",           desc: "EV-ready parking is now a deciding factor for buyers — it differentiates and future-proofs the community." },
          { label: "Effortless Resident Experience", desc: "App-based charging, transparent billing and a 24/7 hotline make adoption simple." },
          { label: "Hotline & Mobile App",           desc: "24/7 TAQA hotline plus a user and operator app." },
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
        solutionNum={6} solutionLabel="EV Chargers" color="#7c3aed" icon={evIcon} photo={P.ev}
        phases={[
          { days: "Day 0–14",   label: "Site Assessment" },
          { days: "Day 14–30",  label: "Commercial Model" },
          { days: "Day 30–60",  label: "Supply (AC/DC/golf-car charger procurement)" },
          { days: "Day 60–90",  label: "Installation" },
          { days: "Day 90–105", label: "Activation" },
          { days: "Day 105+",   label: "O&M & Support" },
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
        solutionNum={6} solutionLabel="EV Chargers" color="#7c3aed" icon={evIcon} photo={P.ev}
        heading="First EV License — Green Mobility"
        subheading="Pioneering Egypt's EV-charging rollout from the front"
        body="TAQA Power secured the first private EV-charging license in Egypt and is rolling out AC and DC charging across residential, commercial and highway locations, supported by its own operator and user mobile app and 24/7 hotline. As Egypt's largest private power player, TAQA pairs charging with on-site solar and distribution — a complete green-mobility package for any community."
        stats={[
          { value: "1st",  label: "Private EV-charging license in Egypt" },
          { value: "3",    label: "Charger lines: AC, DC & golf-car" },
          { value: "6",    label: "End-to-end services offered" },
          { value: "24/7", label: "Hotline & app support" },
        ]}
      />
    ),
  },

  // ── Solar PV ─────────────────────────────────────────────────────────────────
  // 29
  {
    title: "Solar PV: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={7} solutionLabel="Solar PV" color="#16a34a" icon={solarIcon} photo={P.solar}
        subtitle="Rooftop and common-area solar PV — cutting bills, with flexible ownership."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the solar power you use — little to no upfront CapEx."
        taqaInvests={["Rooftop & carport PV arrays", "Inverters & mounting structures", "Net-metering & connection works", "Monitoring & performance platform", "BOO/BOOT solar financing"]}
        steps={[
          "TAQA studies roofs, shading and the community's energy profile.",
          "Arrays are sized and designed for optimal yield.",
          "Panels are installed; grid tie-in and metering completed.",
          "Solar generation offsets common-area and resident bills.",
          "TAQA monitors output and guarantees performance for 25+ years.",
        ]}
        whatYouReceive={["Lower energy bills from day one", "Net metering and grid tie-in", "Zero-capex PPA option", "25-year performance guarantee"]}
      />
    ),
  },
  // 30
  {
    title: "Solar PV: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={7} solutionLabel="Solar PV" color="#16a34a" icon={solarIcon} photo={P.solar}
        whatYouGain={[
          { label: "Lower Energy Bills",     desc: "Solar's cost per kWh sits well below the grid tariff — residents and common areas save from day one." },
          { label: "Tariff-Hike Hedge",      desc: "Lock in clean-energy cost for decades and insulate the community from grid-price escalation." },
          { label: "Uses Idle Space",        desc: "Rooftops, car parks and unused land become productive, revenue-saving assets." },
          { label: "Strong ESG Credentials", desc: "Each 1 MWp avoids ~1,000 tons of CO₂ a year — measurable proof for sustainability reporting." },
        ]}
        taqaEdge={[
          { label: "Egypt's Solar Pioneer",     desc: "TAQA was the first national company to commercially operate a plot at the Benban solar park." },
          { label: "Flexible Models",           desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time, or buy cheaper solar under a zero-capex PPA." },
          { label: "Turnkey Engineering",       desc: "Survey, design, supply, installation and grid tie-in delivered end-to-end by one partner." },
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
        solutionNum={7} solutionLabel="Solar PV" color="#16a34a" icon={solarIcon} photo={P.solar}
        phases={[
          { days: "Day 0–14",    label: "Site & Yield Study" },
          { days: "Day 14–30",   label: "Commercial Model" },
          { days: "Day 30–60",   label: "Design & Procure" },
          { days: "Day 60–110",  label: "EPC Installation" },
          { days: "Day 110–125", label: "Commissioning" },
          { days: "Day 125+",    label: "O&M & Monitoring" },
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
        solutionNum={7} solutionLabel="Solar PV" color="#16a34a" icon={solarIcon} photo={P.solar}
        heading="Largest Solar Plant in Sharm El-Sheikh"
        subheading="Powering a green, smart city with clean energy"
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

  // ── Closing ──────────────────────────────────────────────────────────────────
  // 33
  { title: "Why One Partner", render: () => <WhyOnePartnerSlide /> },
  // 34
  { title: "Cross-Solution Benefits", render: () => <BundleSlide /> },
  // 35
  { title: "Success Story: Soma Bay", render: () => <SomaBaySlide /> },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

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
