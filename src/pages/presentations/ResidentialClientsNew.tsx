import { DeckShell } from "./DeckShell";

const MEDIA = import.meta.env.BASE_URL + "presentations/media/";
import {
  Flame, Zap, Droplets, Truck, Battery, Car, Sun, CheckCircle2,
  ArrowRight, Star, Wrench,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import taqaLogo from "@/assets/taqa-logo.png";
import {
  SlideStyles, Kicker, CornerWash, GhostNum, Bracket, BlueprintGrid,
  ScopeSlide, ValuePropSlide, TimelineSlide, TrackRecordSlide, ChartTrackRecordSlide, TrustedBySlide,
  d, hideImg, lighter,
} from "./slides";
import { TRUSTED_BY_LOGOS } from "./trustedByLogos";

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
// 30 slides (0-indexed). "Trusted By" follows "In Numbers"; solution order is
// Solar PV, Mobile CNG, Water, Gas, Electricity, Diesel Rental, EV Chargers.

const SECTIONS = [
  { id: "intro",       label: "Introduction",       color: "#7c3aed", slides: [0,1,2,3,4] },
  { id: "overview",    label: "Solutions Overview",  color: "#7c3aed", slides: [5] },
  { id: "solar",       label: "Solar PV",            color: "#16a34a", slides: [6,7,8] },
  { id: "cng",         label: "Mobile CNG",          color: "#E68A00", slides: [9,10,11] },
  { id: "water",       label: "Water",               color: "#0095C8", slides: [12,13,14] },
  { id: "gas",         label: "Gas Distribution",    color: "#009045", slides: [15,16,17] },
  { id: "electricity", label: "Electricity",         color: "#d97706", slides: [18,19,20] },
  { id: "diesel",      label: "Diesel Rental",       color: "#6B6B6B", slides: [21,22,23] },
  { id: "ev",          label: "EV Chargers",         color: "#7c3aed", slides: [24,25,26] },
  { id: "closing",     label: "Closing",             color: "#002060", slides: [27,28,29] },
];

const SOLUTION_CHIPS: { s: string; c: string }[] = [
  { s: "Solar PV",       c: "#16a34a" },
  { s: "Mobile CNG",     c: "#E68A00" },
  { s: "Water",          c: "#0095C8" },
  { s: "Gas",            c: "#009045" },
  { s: "Electricity",    c: "#d97706" },
  { s: "Diesel Back-up", c: "#6B6B6B" },
  { s: "EV Charging",    c: "#7c3aed" },
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

// ─── Slide 1: Who We Are ──────────────────────────────────────────────────────

function AboutSlide() {
  const divisions = [
    { label: "Gas",       icon: <Flame className="h-5 w-5" />,    desc: "Distribution, EPC & mobile CNG/LNG",     color: "#E68A00" },
    { label: "Power",     icon: <Zap className="h-5 w-5" />,      desc: "Generation (+1,600 MVA), solar & EV",    color: "#d97706" },
    { label: "Petroleum", icon: <Truck className="h-5 w-5" />,    desc: "Oil-marketing stations & fuel logistics", color: "#7c3aed" },
    { label: "Water",     icon: <Droplets className="h-5 w-5" />, desc: "Desalination & solar-powered treatment",  color: "#0095C8" },
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
            A World of Energy, Delivered End-to-End
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
            water, back-up power and EV charging — under a single relationship.
          </p>
          <div className="sx-up mt-5 flex flex-wrap gap-2" style={d(260)}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600 ring-1 ring-black/10 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#7c3aed]" /> Active member of the International Gas Union (IGU)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600 ring-1 ring-black/10 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#7c3aed]" /> Accredited by the IGEM
            </span>
          </div>
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
    { value: "10",     label: "Countries of presence", sub: "Egypt, GCC, Africa & South Asia" },
    { value: "4",      label: "Operating divisions",    sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates",           sub: "Industrial, residential & touristic" },
    { value: "3,400+", label: "Employees",              sub: "Across all divisions" },
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
        <h2 className="sx-up mt-4 font-display text-[30px] font-bold leading-tight tracking-tight text-[#002060]" style={d(60)}>
          Presence Across Africa &amp; the Middle East
        </h2>

        <div className="mt-5 grid min-h-0 flex-1 grid-cols-[300px_1fr] gap-6">
          {/* Metrics, stacked */}
          <div className="flex min-h-0 flex-col gap-3">
            {metrics.map((m, i) => (
              <div key={m.label} className="sx-up flex-1" style={d(140 + i * 60)}>
                <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
                  <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full" style={{ background: "linear-gradient(180deg, #7c3aed, #a78bfa)" }} />
                  <div className="pl-2.5">
                    <div
                      className="font-display text-[28px] font-bold leading-none tracking-tight bg-clip-text text-transparent"
                      style={{ backgroundImage: "linear-gradient(100deg, #7c3aed, #a78bfa)" }}
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
          <div className="sx-up flex min-h-0 flex-col" style={d(380)}>
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-black/5 shadow-sm">
              <Bracket color={VIOLET} pos="tr" />
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
    { value: "EGP 13.4bn", label: "Revenue",                     sub: "FY 2025", hero: true },
    { value: "EGP 18bn+",  label: "Assets under Management",     sub: "Group-wide" },
    { value: "~7M",        label: "Customers across Egypt",      sub: "FY 2025" },
  ];
  const divCards = [
    { div: "GAS",            icon: <Flame className="h-4 w-4" />,    color: "#E68A00", stat: "+10,000 km network, 8 governorate concessions (15yr)" },
    { div: "POWER",          icon: <Zap className="h-4 w-4" />,      color: "#d97706", stat: "+1,600 MVA distribution, +150 MW generation" },
    { div: "WATER",          icon: <Droplets className="h-4 w-4" />, color: "#0095C8", stat: "+47,000 m³/day desalination, 15 operational locations" },
    { div: "MOBILITY & CNG", icon: <Truck className="h-4 w-4" />,    color: "#7c3aed", stat: "300 total stations, 1st private EV-charging license" },
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

        <p className="sx-in mt-4 text-center font-display text-[14px] font-semibold uppercase tracking-[0.18em] text-slate-400" style={d(700)}>
          Founded 2006 · Listed on EGX 2023 · 3,400+ employees across all divisions
        </p>
      </div>
    </div>
  );
}

// ─── Slide 5: Solutions Overview ──────────────────────────────────────────────

function SolutionsOverviewSlide() {
  const solutions = [
    { num: "01", label: "Solar PV",                 desc: "Rooftop and common-area solar PV — cutting bills, with flexible ownership.",              icon: <Sun className="h-5 w-5" />,      color: "#16a34a" },
    { num: "02", label: "Mobile CNG",               desc: "Off-grid natural gas delivered via mobile virtual pipeline — zero infrastructure capex.", icon: <Truck className="h-5 w-5" />,    color: "#E68A00" },
    { num: "03", label: "Water Desalination",       desc: "Reverse-osmosis plants and digitalized, solar-powered water operations.",                 icon: <Droplets className="h-5 w-5" />, color: "#0095C8" },
    { num: "04", label: "Gas Distribution",         desc: "End-to-end gas network EPC — design, build, commission and operate.",                     icon: <Flame className="h-5 w-5" />,    color: "#009045" },
    { num: "05", label: "Electricity Distribution", desc: "Turnkey MV/LV networks, smart metering and licensed lifetime O&M.",                       icon: <Zap className="h-5 w-5" />,      color: "#d97706" },
    { num: "06", label: "Diesel Rental",            desc: "Emergency & back-up power gensets on a flexible rental / OPEX model.",                    icon: <Battery className="h-5 w-5" />,  color: "#6B6B6B" },
    { num: "07", label: "EV Chargers",              desc: "AC, DC and golf-car charging with full-investment green-mobility services.",              icon: <Car className="h-5 w-5" />,      color: "#7c3aed" },
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

// ─── Water Track Record — bespoke case-study slide (Soma Bay BOO transition) ──
// Not a 25-yr 2-series comparison like the CNG/Solar charts, so ChartTrackRecordSlide
// doesn't fit; this is a local bar-chart component styled to match its dark aesthetic.

function WaterCaseStudySlide() {
  const color = "#0095C8";
  const chartData = [
    { site: "TAQA (Solar + Efficient RO)", kwh: 12045000 },
    { site: "Conventional RO", kwh: 24090000 },
  ];
  const stats = [
    { value: "~USD 9M",   label: "Invested by TAQA Water under a Build-Own-Operate model" },
    { value: "50%",       label: "Less energy consumption vs. conventional RO" },
    { value: "~EGP 33.6M", label: "Saved per year" },
    { value: "~10,000 t", label: "CO₂ cut annually" },
  ];
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
            <Droplets className="h-5 w-5" />
          </div>
          <Kicker color={color} dark>Solution 03 · Water Desalination · Case Study — Soma Bay</Kicker>
        </div>

        <h2 className="sx-up mt-5 max-w-[1120px] font-display text-[38px] font-bold leading-[1.1] tracking-tight text-white" style={d(80)}>
          Self-Operating Desalination, Transitioned to BOO
        </h2>
        <div className="sx-up mt-3 flex items-start gap-2.5" style={d(140)}>
          <Star className="mt-1 h-5 w-5 shrink-0" style={{ color: lighter(color), fill: lighter(color) }} />
          <p className="max-w-[1020px] text-[17px] font-medium leading-snug text-white/90">
            Reliable water security was needed, but capital was tied up in Soma Bay's core hospitality business — and conventional RO meant high running costs.
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-[1.35fr_1fr] gap-6">
          {/* Chart card */}
          <div className="sx-up relative flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/15 backdrop-blur-md" style={d(200)}>
            <Bracket color={lighter(color)} pos="tl" />
            <div className="mb-1 flex items-center gap-4 pl-1">
              <span className="text-[13px] font-semibold text-white/80">Annual Power Consumption (kWh)</span>
              <span className="ml-auto text-[12px] text-white/40">TAQA vs. Conventional RO</span>
            </div>
            <div className="min-h-0 flex-1 pl-1 pr-2 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="site" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }} axisLine={{ stroke: "rgba(255,255,255,0.15)" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.55)" }} axisLine={false} tickLine={false} width={56}
                    tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`} />
                  <Tooltip
                    contentStyle={{ background: "#1c1917", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                    formatter={(v: number) => [`${v.toLocaleString()} kWh`, "Annual consumption"]}
                  />
                  <Bar dataKey="kwh" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                    {chartData.map((entry, i) => (
                      <Cell key={entry.site} fill={i === 0 ? lighter(color) : "#64748b"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="pl-1 pt-2 text-[13px] leading-snug text-white/60">
              Energy-efficient RO paired with solar PV cuts annual power consumption in half versus conventional RO.
            </p>
          </div>

          {/* Body + stats */}
          <div className="flex min-h-0 flex-col gap-4">
            <div className="sx-up relative shrink-0 overflow-hidden rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/15 backdrop-blur-md" style={d(260)}>
              <p className="text-[14px] leading-[1.5] text-white/90">
                TAQA Water invested under a Build-Own-Operate model, preserving Soma Bay's capital for core
                operations — recognised as Power &amp; Water Project of the Year and Sustainable Initiative of the
                Year at the Big 5 Construct Egypt Impact Awards.
              </p>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="sx-up flex flex-col justify-center rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md"
                  style={d(320 + i * 70)}
                >
                  <div
                    className="font-display text-[24px] font-bold leading-none tracking-tight bg-clip-text text-transparent"
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

// ─── Slide 34: Why One Partner ────────────────────────────────────────────────

function WhyOnePartnerSlide() {
  const benefits = [
    { label: "One SLA",                     desc: "A single service-level agreement governs gas, power, water, back-up and EV — one uptime guarantee, one penalty regime, one renewal." },
    { label: "One Communication Point",     desc: "A single account team and 24/7 hotline for every utility — no chasing five contractors when something needs attention." },
    { label: "One Commercial Relationship", desc: "Consolidated billing, aligned contract terms and a single negotiation instead of six separate procurement cycles." },
    { label: "One Engineering Standard",    desc: "Utilities designed to interoperate from day one — shared trenches, shared metering platform, shared monitoring." },
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
            From fragmented vendors to a single operator — one SLA, one communication point, one accountable owner
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

// ─── Slide 35: Bundle ─────────────────────────────────────────────────────────

function BundleSlide() {
  const bundles = [
    { combo: "Solar + Desalination",           desc: "On-site solar PV powers the RO plant — Egypt's first eco green desalination model, cutting both energy cost and CO₂.", color: "#0095C8" },
    { combo: "Solar + EV Charging",            desc: "Community solar feeds EV chargers, lowering charging cost and maximising the green-mobility story for residents.",     color: "#7c3aed" },
    { combo: "Distribution + Smart Metering",  desc: "One metering platform bills electricity and water together — shared infrastructure, single resident app.",             color: "#d97706" },
    { combo: "Gas + Mobile CNG",               desc: "Mobile CNG bridges supply until the permanent gas network goes live — seamless handover, no diesel gap.",              color: "#E68A00" },
    { combo: "Diesel + Distribution",          desc: "Back-up gensets integrate directly into the TAQA-built distribution network with automatic transfer — true redundancy.", color: "#6B6B6B" },
    { combo: "Shared O&M & Monitoring",        desc: "One control room and field team monitor every utility — pooled spares, pooled response, lower unit O&M cost.",         color: "#009045" },
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
          <p className="relative text-[15px] leading-snug text-white/85">
            <span className="font-bold text-[#FFC10E]">Sold as one SLA:</span>{" "}
            lower combined cost · shared infrastructure &amp; trenches · one billing &amp; monitoring platform · stronger ESG / green-rating story · single accountable operator for the entire community utility backbone.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 36: Success Story — Soma Bay ──────────────────────────────────────

function SomaBaySlide() {
  const stats = [
    { value: "50,000+", label: "People served (Red Sea Gov.)" },
    { value: "8,560 t",  label: "Tonnes CO₂ avoided / year" },
    { value: "50%",      label: "Less power than peer plants" },
    { value: "2",        label: "Industry awards won" },
  ];
  const combined = [
    { label: "Solar PV",           icon: <Sun className="h-4 w-4" /> },
    { label: "Power Distribution", icon: <Zap className="h-4 w-4" /> },
    { label: "Water Desalination", icon: <Droplets className="h-4 w-4" /> },
    { label: "Smart O&M",          icon: <Wrench className="h-4 w-4" /> },
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
            Egypt's first &amp; largest eco solar-powered desalination plant
          </p>
        </div>

        <div className="mt-5 grid min-h-0 flex-1 grid-cols-[1fr_430px] gap-6">
          {/* Narrative glass card */}
          <div className="sx-up relative flex flex-col justify-center overflow-hidden rounded-2xl bg-white/[0.07] p-8 ring-1 ring-white/15 backdrop-blur-md" style={d(190)}>
            <Bracket color="#a78bfa" pos="tl" />
            <p className="pl-3 text-[18px] leading-[1.65] text-white/90">
              At Soma Bay on the Red Sea, TAQA Arabia integrated solar generation, power distribution and
              reverse-osmosis desalination into a single, renewable-powered utility system — using technology that
              consumes 50% less power than its peers.
            </p>
            <p className="mt-4 pl-3 text-[18px] leading-[1.65] text-white/90">
              It is the clearest proof of the bundled, one-SLA model serving a residential and touristic destination.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 pl-3">
              {combined.map(c => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[14px] font-semibold text-white/90 ring-1 ring-white/15"
                >
                  {c.icon}
                  {c.label}
                </span>
              ))}
            </div>
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

// ─── Chart data — 25-yr comparisons from the source deck ─────────────────────

const CNG_VS_DIESEL = [
  { year: "Y1", taqa: 70.0,   diesel: 100.0 },
  { year: "Y2", taqa: 77.0,   diesel: 110.0 },
  { year: "Y3", taqa: 84.7,   diesel: 121.0 },
  { year: "Y4", taqa: 93.17,  diesel: 133.1 },
  { year: "Y5", taqa: 102.49, diesel: 146.41 },
  { year: "Y6", taqa: 112.74, diesel: 161.05 },
  { year: "Y7", taqa: 124.01, diesel: 177.16 },
  { year: "Y8", taqa: 136.41, diesel: 194.87 },
  { year: "Y9", taqa: 150.05, diesel: 214.36 },
  { year: "Y10", taqa: 165.06, diesel: 235.79 },
  { year: "Y11", taqa: 181.56, diesel: 259.37 },
  { year: "Y12", taqa: 199.72, diesel: 285.31 },
  { year: "Y13", taqa: 219.69, diesel: 313.84 },
  { year: "Y14", taqa: 241.66, diesel: 345.23 },
  { year: "Y15", taqa: 265.82, diesel: 379.75 },
  { year: "Y16", taqa: 292.41, diesel: 417.72 },
  { year: "Y17", taqa: 321.65, diesel: 459.5 },
  { year: "Y18", taqa: 353.81, diesel: 505.45 },
  { year: "Y19", taqa: 389.19, diesel: 555.99 },
  { year: "Y20", taqa: 428.11, diesel: 611.59 },
  { year: "Y21", taqa: 470.92, diesel: 672.75 },
  { year: "Y22", taqa: 518.02, diesel: 740.02 },
  { year: "Y23", taqa: 569.82, diesel: 814.03 },
  { year: "Y24", taqa: 626.8,  diesel: 895.43 },
  { year: "Y25", taqa: 689.48, diesel: 984.97 },
];

const SOLAR_VS_GOV_TARIFF = [
  { year: "Y1", taqa: 2.17,  gov: 2.55 },
  { year: "Y2", taqa: 2.39,  gov: 2.81 },
  { year: "Y3", taqa: 2.63,  gov: 3.09 },
  { year: "Y4", taqa: 2.89,  gov: 3.39 },
  { year: "Y5", taqa: 3.18,  gov: 3.73 },
  { year: "Y6", taqa: 3.49,  gov: 4.11 },
  { year: "Y7", taqa: 3.84,  gov: 4.52 },
  { year: "Y8", taqa: 4.23,  gov: 4.97 },
  { year: "Y9", taqa: 4.65,  gov: 5.47 },
  { year: "Y10", taqa: 5.12, gov: 6.01 },
  { year: "Y11", taqa: 5.63, gov: 6.61 },
  { year: "Y12", taqa: 6.19, gov: 7.28 },
  { year: "Y13", taqa: 6.81, gov: 8.0 },
  { year: "Y14", taqa: 7.49, gov: 8.8 },
  { year: "Y15", taqa: 8.24, gov: 9.68 },
  { year: "Y16", taqa: 9.06, gov: 10.65 },
  { year: "Y17", taqa: 9.97, gov: 11.72 },
  { year: "Y18", taqa: 10.97, gov: 12.89 },
  { year: "Y19", taqa: 12.07, gov: 14.18 },
  { year: "Y20", taqa: 13.27, gov: 15.6 },
  { year: "Y21", taqa: 14.6,  gov: 17.16 },
  { year: "Y22", taqa: 16.06, gov: 18.87 },
  { year: "Y23", taqa: 17.66, gov: 20.76 },
  { year: "Y24", taqa: 19.43, gov: 22.83 },
  { year: "Y25", taqa: 21.37, gov: 25.12 },
];

// ─── Narration (30 entries, matches SLIDES order exactly) ────────────────────

const NARRATION: readonly string[] = [
  // 0 — Cover
  "TAQA Arabia presents an integrated utility roadmap built specifically for residential developers and communities. Across the following slides you will see seven solutions — mobile CNG, electricity, water, gas, diesel back-up, EV charging and solar — each delivered by one partner under one service-level agreement. Instead of managing six or seven separate vendors, a developer gains a single accountable relationship covering every utility a community needs, from first contact through years of live operation, starting right now.",
  // 1 — Who We Are
  "Founded in 2006 and listed on the Egyptian Exchange since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility developer, spanning four divisions — Gas, Power, Petroleum and Water. Gas covers distribution, EPC and mobile CNG and LNG; Power spans over 1,600 MVA of generation plus solar and EV; Petroleum runs fuel logistics; and Water covers desalination and solar-powered treatment. For a developer, that breadth means one accredited partner — a member of the International Gas Union and the IGEM — delivers every utility.",
  // 2 — Regional Presence
  "This map traces TAQA Arabia's actual live footprint, not just ambition — ten countries of presence across Egypt, the Gulf, Africa and South Asia, spanning four operating divisions: Gas, Power, Petroleum and Water. The company already operates across more than twenty governorates, covering industrial, residential and touristic developments, backed by over 3,400 employees on the ground. For a prospective community, that scale means TAQA Arabia already has the local licensing, logistics and technical teams in place to deliver utilities reliably, wherever the development sits.",
  // 3 — In Numbers
  "Behind that footprint sits real financial scale. TAQA Arabia posted EGP 13.4 billion in revenue for fiscal year 2025, with group-wide assets exceeding EGP 18 billion, and around 7 million customers across Egypt already served. By division, Gas runs over 10,000 kilometers of network across 8 governorate concessions, Power distributes over 1,600 MVA and generates over 150 megawatts, Water desalinates over 47,000 cubic meters a day across 15 locations, and Mobility and CNG run 300 stations, backed by Egypt's first private EV-charging license.",
  // 4 — Trusted By
  "Developers of this caliber already trust TAQA Arabia to run their community utilities — names like SODIC, Emaar, Palm Hills, Marassi, Hyde Park and Mountain View among them. These are not pilot projects; they are live, ongoing relationships across some of Egypt's most prominent residential and mixed-use developments. That existing track record with tier-one developers is exactly the kind of reference a new community can lean on when deciding whether to hand its utility backbone to a single partner.",
  // 5 — Solutions Overview
  "Seven integrated solutions sit under one partner and one service-level agreement. Solar PV delivers rooftop and common-area generation; Mobile CNG delivers off-grid natural gas with zero infrastructure capex; Water Desalination brings reverse-osmosis plants with solar-powered, digitalized operations; Gas Distribution is end-to-end network EPC; Electricity Distribution covers turnkey MV and LV networks with smart metering and lifetime operations; Diesel Rental provides back-up power on a flexible rental model; and EV Chargers cover AC, DC and golf-car charging — each detailed on the slides that follow.",
  // 6 — Solar PV: Scope
  "Now, let's talk about our Solar PV solution. TAQA studies roof shading, structural capacity and the community's load profile, then installs grid-tied rooftop and carport solar arrays complete with inverters and mounting structures, financed under a BOO or BOOT model so the community pays only for the solar power it uses. Panels generate clean power through daylight hours, offsetting household and common-area consumption, while TAQA continuously monitors yield and maintains the system to keep performance high.",
  // 7 — Solar PV: Value Proposition
  "TAQA, the first national company to commercially operate a plot at the Benban solar park, offers CAPEX, BOOT, BOO or zero-capex PPA structures — letting a community own the system outright, transfer it over time, or simply buy cheaper solar power with no upfront cost. Every megawatt-peak installed avoids roughly 1,000 tons of CO2 a year, rooftops and idle car parks become productive assets, and locking in solar pricing hedges the community against rising grid tariffs, backed by 25-plus years of performance guarantees.",
  // 8 — Solar PV: Track Record
  "TAQA's 20 megawatt Sharm El-Sheikh solar plant, built in a record four to six months, powers all of Nabq Bay and generates 42 gigawatt-hours of clean energy every year, avoiding roughly 500,000 tons of CO2 over its lifetime. Its tariff runs steadily below the government's medium-voltage rate, and the same model has delivered a 15 percent tariff discount at Soma Bay — proof that TAQA's solar pricing beats the grid consistently, year after year.",
  // 9 — Mobile CNG: Scope
  "Now, let's talk about our Mobile CNG solution. TAQA funds, builds, owns and operates the mobile CNG chain, so the community pays only for the gas it consumes, with little to no upfront capital required. Gas is compressed at a TAQA mother station to roughly 250 bar, then hauled to the community by dedicated CNG trailers acting as a virtual pipeline. On-site skids decompress and regulate it to safe delivery pressure, and odorized, metered gas flows to homes and amenities, with TAQA monitoring volumes and refilling before supply ever runs low.",
  // 10 — Mobile CNG: Value Proposition
  "Communities gain reliable natural gas even where no pipeline exists — compounds, resorts and remote developments included — at lower cost than diesel or LPG, cutting CO2 emissions by roughly 24 percent and lowering NOx and particulates for ESG and green-rating targets. TAQA backs this with a nationwide trailer fleet under its Master Gas logistics network, a zero-capex BOO or BOOT delivery model, and capacity scaling from starter to heavy load — ready to bridge seamlessly once the fixed grid arrives.",
  // 11 — Mobile CNG: Track Record
  "TAQA Arabia was the first company in Egypt to supply natural gas through a mobile virtual pipeline, and today runs 86 CNG stations across 20 governorates, including 10 existing Mobile CNG projects such as El-Kharga. The chart tracks 25 years of pricing against diesel, showing TAQA gas holding a guaranteed 30 percent savings versus the current diesel price throughout — proof this is not a short-term discount but a durable, long-term cost advantage for the community.",
  // 12 — Water Desalination: Scope
  "Now, let's talk about our Water Desalination solution. TAQA builds and owns the complete desalination chain, starting with intake and pre-treatment of seawater or brackish water, then reverse-osmosis membranes that strip out salt and impurities, followed by remineralization to potable standard. Treated water is stored, pumped and distributed to the community through smart meters, with TAQA operating the plant and guaranteeing both output volume and quality — all financed under a BOO or BOOT model so the community pays only for the water it actually uses.",
  // 13 — Water Desalination: Value Proposition
  "Energy-efficient reverse osmosis, paired with variable-speed drives, peak-demand control and solar PV, cuts power use roughly in half compared with conventional plants, whether the source is seawater for coastal compounds or brackish water for inland cities like New Cairo and 6th of October. Residents get dynamic app-based billing, consumption analytics and real-time notifications, while solar-powered operation and responsible brine management support LEED and green-community certification — delivering a scalable, ESG-friendly water supply that grows alongside the development.",
  // 14 — Water Desalination: Track Record
  "At Soma Bay, TAQA Water invested around nine million dollars under a build-own-operate model, preserving the resort's capital for its core hospitality business rather than tying it up in infrastructure. The energy-efficient, solar-paired RO plant uses roughly half the power of conventional desalination, saving about EGP 33.6 million and cutting around 10,000 tons of CO2 every year — a result recognized with Power and Water Project of the Year and Sustainable Initiative of the Year at the Big 5 Construct Egypt Impact Awards.",
  // 15 — Gas Distribution: Scope
  "Now, let's talk about our Gas Distribution solution. TAQA secures the gas concession and designs the network, then lays steel and PE distribution mains and service lines out to every home, regulating pressure down to safe domestic levels through city-gate and pressure-reduction stations. Each connection is metered and commissioned individually, and TAQA continues to operate, inspect and bill for the gas delivered for the life of the concession — giving the community a licensed, professionally managed piped-gas network from day one, with lifetime emergency response included.",
  // 16 — Gas Distribution: Value Proposition
  "Switching residents from diesel and LPG to piped natural gas lowers their living costs immediately, since subsidized piped gas is far cheaper than LPG cylinders or electric heating, while connection to the national gas grid lifts the community's overall asset value and tenancy appeal. Where the fixed pipeline has not reached yet, mobile CNG bridges the gap so no community has to wait — all delivered under IGEM and EGAS-aligned standards, by one partner across every phase, including in-house engineering through TAQA's own EGUSCO arm.",
  // 17 — Gas Distribution: Track Record
  "As Egypt's first private natural gas distributor, licensed by EGAS, TAQA Gas holds more than 25 exclusive governorate concessions that ensure long-term stability, operates over 10,000 kilometers of pipeline, and commands 66 percent of the private gas-distribution market — serving 1.9 million connections across residential, commercial and heavy-industry sites. The business is certified to ISO 9001, ISO 14001 and ISO 45001, with engineering, construction, operations, billing and 24/7 emergency response handled fully in-house.",
  // 18 — Electricity Distribution: Scope
  "Now, let's talk about our Electricity Distribution solution. TAQA designs the distribution network around the community's load and master plan, then builds and energizes MV and LV substations, ring-main units, transformers, cabling, switchgear and protection equipment. Power is stepped down and distributed to every plot and amenity, smart meters record what each household consumes, and SCADA systems paired with a 24/7 team keep the whole network balanced, monitored and online — all financed under a BOO or BOOT structure so the developer is not carrying the capital cost.",
  // 19 — Electricity Distribution: Value Proposition
  "A profit-share model can turn the distribution network from a cost center into a new recurring revenue stream for the developer, while demand-side management and tariff optimization lower what residents actually pay. Every unit gets stable, metered, billable power from handover without relying on stretched public infrastructure, and the network is engineered from day one to be future-ready for solar, storage and EV loads — so the community scales without rebuilding later, backed by guaranteed reliability performance.",
  // 20 — Electricity Distribution: Track Record
  "TAQA Power's network is anchored by major substations including the 250 MVA 6th of October substation and the 160 MVA Nabq substation, together distributing over 1,600 MVA across 31 million square meters of concession area and serving more than 12,000 end-user connections. TAQA delivers engineering, EPC, substations, grid connections and full distribution networks in-house, backed by preventive maintenance and digital energy management — trusted by tier-one developers including LMD, Marakez, Pioneer Property and Emaar.",
  // 21 — Diesel Rental: Scope
  "Now, let's talk about our Diesel Rental solution. TAQA sizes rental gensets to the site's standby or prime load, then delivers, installs and synchronizes the units on site, complete with fuel tanks and automatic transfer switches so generators start the instant the grid fails. TAQA manages refuelling, servicing and remote telemetry monitoring throughout, and capacity can scale up or down as the project's needs change — a pure rental arrangement that puts reliable power on site from day one without owning a single asset.",
  // 22 — Diesel Rental: Value Proposition
  "Instant back-up power keeps lifts, water pumps, lighting, security and every common area running through any grid outage, protecting both business and resident continuity. The same temporary power used during construction converts seamlessly into permanent back-up at handover, and TAQA's 24/7 operations, remote monitoring and rapid response remove the operating burden entirely — all on a pure rental model, from 500 kVA up to 20 MVA, with no capital outlay and guaranteed response SLAs.",
  // 23 — Diesel Rental: Track Record
  "TAQA has installed 38 megawatts of diesel power across Egypt, using fast-start, heavy-duty gensets sized from 0.5 to 2 megawatts that scale simply by adding units. These units are built for grid support, standby backup and fully off-grid sites, delivering guaranteed uptime with minimal maintenance — a track record trusted by operators like Dina Farms, who depend on that reliability to keep operations running without interruption, day and night.",
  // 24 — EV Chargers: Scope
  "Now, let's talk about our EV Charging solution. TAQA assesses parking layout, expected demand and available grid capacity, then installs AC and DC chargers along with any necessary grid upgrades, all financed under a BOO or BOOT model so the community pays only for the energy actually charged. Smart load-balancing shares power intelligently across every charging point, residents authenticate and charge through an app or RFID card, and TAQA operates, maintains and settles all payments — delivering a fully managed, future-ready charging network from day one.",
  // 25 — EV Chargers: Value Proposition
  "Holding Egypt's first private EV-charging license, TAQA turns EV-ready parking into a genuine deciding amenity for buyers, covering AC, DC fast and golf-car charging to meet every residential and resort mobility need. Adoption is effortless thanks to app-based charging, transparent billing and a 24/7 hotline backed by operator and user apps, while flexible financing lets TAQA invest directly in the chargers or share the resulting profit with the developer.",
  // 26 — EV Chargers: Track Record
  "As holder of Egypt's first private EV-charging license, TAQA is rolling out three charger lines — AC, DC and golf-car — across residential, commercial and highway sites, supported by six end-to-end services and a 24/7 hotline with app support. As Egypt's largest private power player, TAQA pairs this charging network with on-site solar and distribution, giving any community a complete, integrated green-mobility package rather than a standalone charger installation.",
  // 27 — Why One Partner
  "Seven utilities, one accountable operator. A single service-level agreement governs gas, power, water, back-up and EV charging with one uptime guarantee and one renewal, backed by a single account team and 24/7 hotline instead of chasing five different contractors. Billing is consolidated, contract terms are aligned into one negotiation instead of six separate procurement cycles, and every utility is engineered from day one to interoperate through shared trenches, shared metering and shared monitoring — a single owner accountable end to end.",
  // 28 — Cross-Solution Benefits
  "Combining solutions compounds the value in ways no single vendor can match. Solar powering desalination creates an eco green desalination model, community solar feeding EV chargers lowers charging cost, and shared metering bills electricity and water together through a single resident app. Mobile CNG bridges supply until the permanent gas network goes live with no diesel gap, and back-up gensets integrate directly into the distribution network for true redundancy — all sold as one SLA, at a lower combined cost, with a stronger ESG story.",
  // 29 — Success Story: Soma Bay
  "At Soma Bay, TAQA Arabia integrated solar generation, power distribution and reverse-osmosis desalination into one renewable-powered system using technology that consumes 50 percent less power than its peers — serving more than 50,000 people across the Red Sea Governorate, avoiding 8,560 tons of CO2 every year, and earning two industry awards. It stands as the clearest proof the bundled, one-SLA model works in practice. Explore the integrated residential utility model for your development, and reach out to TAQA Arabia to get started.",
];

// ─── SLIDES Array (30 slides, 0-indexed) ─────────────────────────────────────

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
  { title: "Who We Are", render: () => <AboutSlide /> },
  // 2
  { title: "Regional Presence", render: () => <RegionalSlide /> },
  // 3
  { title: "In Numbers", render: () => <NumbersSlide /> },
  // 4
  { title: "Trusted By", render: () => <TrustedBySlide color={VIOLET} logos={TRUSTED_BY_LOGOS} /> },
  // 5
  { title: "Solutions Overview", render: () => <SolutionsOverviewSlide /> },
  // ── Solar PV ─────────────────────────────────────────────────────────────────
  // 6
  {
    title: "Solar PV: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={7} solutionLabel="Solar PV" color="#16a34a" icon={solarIcon} photo={P.solar}
        subtitle="Rooftop and common-area solar PV — cutting bills, with flexible ownership."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the solar power you use — little to no upfront CapEx."
        taqaInvests={["Rooftop & carport PV arrays", "Inverters & mounting structures", "Net-metering & connection works", "Monitoring & performance platform", "BOO / BOOT solar financing"]}
        steps={[
          "TAQA studies roofs, shading and the community's load profile.",
          "PV arrays and inverters are installed and grid-tied.",
          "Panels generate clean power during daylight hours.",
          "Solar offsets common-area and household consumption.",
          "TAQA monitors yield and maintains the system.",
        ]}
        whatYouReceive={["Clean on-site solar generation", "Lower common-area energy bills", "Monitored, maintained PV assets"]}
      />
    ),
  },
  // 7
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
  // 8
  {
    title: "Solar PV: Track Record",
    render: () => (
      <ChartTrackRecordSlide
        solutionNum={7} solutionLabel="Solar PV" color="#16a34a" icon={solarIcon}
        heading="Largest Solar Plant in Sharm El-Sheikh"
        subheading="Powering a green, smart city with clean and cheaper energy in Sharm El-Sheikh"
        body="TAQA Arabia built the largest solar plant in Sharm El-Sheikh, powering all of Nabq Bay — plus Soma Bay's solar PV at a 15% tariff discount."
        data={SOLAR_VS_GOV_TARIFF}
        xKey="year"
        series={[
          { key: "taqa", name: "TAQA Tariff", color: "#16a34a" },
          { key: "gov", name: "Government (MV) Tariff", color: "#94a3b8" },
        ]}
        yLabel="EGP / kWh"
        stats={[
          { value: "20 MW",   label: "Sharm El-Sheikh solar plant" },
          { value: "42 GWh",  label: "Clean energy generated per year" },
          { value: "≈500k t", label: "CO₂ avoided over its lifetime" },
          { value: "4-6 mo",  label: "Record build time" },
        ]}
      />
    ),
  },
  // ── Mobile CNG ──────────────────────────────────────────────────────────────
  // 9
  {
    title: "Mobile CNG: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
        subtitle="Off-grid natural gas delivered via mobile virtual pipeline — zero infrastructure capex."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the gas you consume — little to no upfront CapEx."
        taqaInvests={["Mother station & compression skids", "CNG/virtual-pipeline trailers", "On-site decompression & PRMS skid", "Metering, odorization & safety controls", "BOO / BOOT asset financing"]}
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
  // 10
  {
    title: "Mobile CNG: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon} photo={P.cng}
        whatYouGain={[
          { label: "Off-Grid Gas Supply",           desc: "Reliable natural gas to communities without pipeline access — compounds, resorts and remote developments." },
          { label: "Cost Savings vs. Diesel & LPG", desc: "Lower fuel cost than diesel; replaces LPG and electric heating across the development." },
          { label: "Cleaner Emissions",             desc: "Cuts CO₂ by ~24% vs. diesel and lowers NOx & particulates — supports ESG and green-rating targets." },
          { label: "Offset Diesel Quota",           desc: "Reduce reliance on diesel quotas by providing cleaner and more cost-effective fuel alternatives." },
        ]}
        taqaEdge={[
          { label: "Flexible Delivery Approach",          desc: "BOO/BOOT or EPC via Capacity-as-a-Service — no upfront infrastructure cost for the community developer." },
          { label: "Nationwide Logistics Via Master Gas", desc: "A dedicated trailer fleet keeps refills on schedule across governorates." },
          { label: "Scalable to Any Load",                desc: "Starter (550 litres/day of diesel) to Heavy (5,500+ litres/day of diesel) — scales with occupancy, bridges to grid later." },
          { label: "Presence Across Many Governorates",   desc: "A nationwide portfolio of Mobile CNG projects extends gas access across Egypt." },
        ]}
      />
    ),
  },
  // 11
  {
    title: "Mobile CNG: Track Record",
    render: () => (
      <ChartTrackRecordSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#E68A00" icon={cngIcon}
        heading="Pioneering Mobile CNG in Egypt"
        subheading="First company in Egypt to supply natural gas through a mobile virtual pipeline"
        body="TAQA Arabia pioneered mobile CNG in Egypt — trucking gas via virtual pipeline to off-grid compounds."
        data={CNG_VS_DIESEL}
        xKey="year"
        series={[
          { key: "taqa", name: "TAQA CNG Price", color: "#E68A00" },
          { key: "diesel", name: "Diesel Price", color: "#94a3b8" },
        ]}
        yLabel="Indicative price (EGP)"
        valueFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${Math.round(v)}`)}
        stats={[
          { value: "1st",  label: "First mobile virtual pipeline gas supplier" },
          { value: "86",   label: "CNG stations across 20 governorates" },
          { value: "10",   label: "Existing Mobile CNG projects, incl. El-Kharga" },
          { value: "30%",  label: "Guaranteed savings vs. current diesel price" },
        ]}
      />
    ),
  },
  // ── Water Desalination ───────────────────────────────────────────────────────
  // 12
  {
    title: "Water Desalination: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={3} solutionLabel="Water Desalination" color="#0095C8" icon={waterIcon} photo={P.water}
        subtitle="Reverse-osmosis plants and digitalized, solar-powered water operations."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the water you use — little to no upfront CapEx."
        taqaInvests={["Intake & pre-treatment system", "Reverse-osmosis desalination trains", "Post-treatment & storage tanks", "Pumping, distribution & smart meters", "BOO / BOOT plant financing"]}
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
  // 13
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
          { label: "Flexible Commercial Models", desc: "Delivered as EPC, long-term O&M or BOO — choose the structure that fits your balance sheet." },
          { label: "Green-Rating Enabler",       desc: "Solar-powered RO and brine management support LEED / green-community certification and ESG goals." },
          { label: "Scales With the Community",  desc: "Minimum scale of 400 m³/day RO, with modular trains added in phases as the community grows." },
          { label: "Smart Operations & Uptime",  desc: "Real-time monitoring, leak & failure detection and predictive-maintenance dashboards." },
        ]}
      />
    ),
  },
  // 14
  { title: "Water Desalination: Track Record", render: () => <WaterCaseStudySlide /> },
  // ── Gas Distribution ─────────────────────────────────────────────────────────
  // 15
  {
    title: "Gas Distribution: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={4} solutionLabel="Gas Distribution" color="#009045" icon={gasIcon} photo={P.pipeline}
        subtitle="End-to-end gas network EPC — design, build, commission and operate."
        taqaInvests={["City-gate & pressure-reduction stations", "Steel & PE distribution mains", "Service lines to each home", "Domestic meters & regulators", "BOO / BOOT network financing"]}
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
  // 16
  {
    title: "Gas Distribution: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={4} solutionLabel="Gas Distribution" color="#009045" icon={gasIcon} photo={P.pipeline}
        whatYouGain={[
          { label: "Diesel & LPG Fuel-Switching",          desc: "Manage the full transition from diesel and LPG to cleaner, cheaper natural gas." },
          { label: "Flexible Gas Sourcing — M-CNG or SNG", desc: "Where no fixed pipeline exists yet, gas is supplied via M-CNG (mobile CNG) or SNG — no community waits." },
          { label: "Higher Asset Value",                   desc: "Connection to the national gas grid is a core industrial utility that lifts community asset value and tenancy." },
          { label: "Lower Living Costs",                   desc: "Subsidized piped natural gas is far cheaper than LPG cylinders or electric heating for residents." },
        ]}
        taqaEdge={[
          { label: "Flexible Commercial Models",    desc: "Delivered as EPC, long-term O&M or BOO — choose the structure that fits your balance sheet." },
          { label: "External & Internal Networks",  desc: "TAQA builds the external distribution backbone and the internal in-compound and in-building network." },
          { label: "One Partner Across all Phases", desc: "A single accountable party from feasibility to handover — in-house engineering arm EGUSCO builds to spec." },
          { label: "Standards Compliance",          desc: "Aligned with IGEM, EGAS and international gas-safety standards — protects residents and de-risks approvals." },
        ]}
      />
    ),
  },
  // 17
  {
    title: "Gas Distribution: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={4} solutionLabel="Gas Distribution" color="#009045" icon={gasIcon} photo={P.pipeline}
        heading="Egypt's Largest Private Gas Network"
        subheading="Egypt's first private natural gas distributor, licensed by EGAS"
        body="TAQA Gas delivers surveys through engineering, construction, O&M, billing and 24/7 emergency response — fully in-house, across Egypt's largest private gas pipeline network, by a wide margin. Certified to ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018."
        stats={[
          { value: "+25",     label: "Exclusive governorate concessions, ensuring long-term stability" },
          { value: "10k+ km", label: "Robust, high-pressure pipeline network" },
          { value: "66%",     label: "Dominant market share of private gas distribution concessions in Egypt" },
          { value: "1.9M",    label: "Powering complex residential, commercial & heavy-industry sites" },
        ]}
      />
    ),
  },
  // ── Electricity Distribution ─────────────────────────────────────────────────
  // 18
  {
    title: "Electricity Distribution: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#d97706" icon={elecIcon} photo={P.electricity}
        subtitle="Turnkey distribution networks for residential developments — from power sourcing and design through licensed lifetime O&M."
        taqaInvests={["MV/LV substations & ring-main units", "Distribution transformers", "Cabling, switchgear & protection", "Smart meters & SCADA", "BOO / BOOT network financing"]}
        steps={[
          "TAQA designs the network to the community's load and master plan.",
          "Substations, transformers and cabling are built and energized.",
          "Power is stepped down and distributed to every plot and amenity.",
          "Smart meters record each unit consumed per household.",
          "SCADA and a 24/7 team keep the network balanced and online.",
        ]}
        whatYouReceive={["A fully built, licensed power network", "Metered electricity to every home", "24/7 operation, faults and billing handled"]}
      />
    ),
  },
  // 19
  {
    title: "Electricity Distribution: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#d97706" icon={elecIcon} photo={P.electricity}
        whatYouGain={[
          { label: "Potential New Revenue Stream", desc: "The profit-share model turns the distribution network from a cost center into recurring income for the developer." },
          { label: "Lower Resident Bills",         desc: "Demand-side management and tariff optimization reduce consumption and end-user charges." },
          { label: "Guaranteed Power Quality",     desc: "Stable, metered, billable electricity to every unit from handover — no reliance on stretched public utilities." },
          { label: "Future-Ready Network",         desc: "Designed for solar, storage and EV loads from day one — the community scales without re-builds." },
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
  // 20
  {
    title: "Electricity Distribution: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#d97706" icon={elecIcon} photo={P.electricity}
        heading="TAQA Power: Scale, Efficiency & Yield"
        subheading="One of Egypt's first private utilities licensed for power generation and distribution"
        body="Anchored by major substations like 6th of October (250 MVA) and Nabq (160 MVA), TAQA Power delivers engineering, EPC, substations, grid connections and distribution networks end to end. Network operation, preventive maintenance, advanced metering and digital energy management keep supply uninterrupted, while integrated utility management and renewable-energy integration maximize asset value long-term. Trusted by tier-1 developers including LMD, Marakez, Pioneer Property and Emaar."
        stats={[
          { value: "+1,600 MVA", label: "Total MVA distributed across Egypt" },
          { value: "31M m²",     label: "Area covered across different concessions" },
          { value: "12k+",       label: "End users connected to electricity" },
          { value: "250 MVA",    label: "6th of October substation (Nabq: 160 MVA)" },
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
          { label: "Hands-Off Reliability",           desc: "TAQA's 24/7 O&M, remote monitoring and rapid response remove the operating burden entirely." },
        ]}
        taqaEdge={[
          { label: "Rental & OPEX Model", desc: "Rental and full-service options with guaranteed response SLAs — no capital outlay." },
          { label: "Rapid Deployment",    desc: "Standardized gensets and skid solutions installed and commissioned fast." },
          { label: "Flexible Capacity",   desc: "Modular sizing from 500 kVA to 20 MVA — scale up or relocate as the development grows." },
          { label: "Bundled Transition",  desc: "Bridges to permanent gas or grid power within one partner." },
        ]}
      />
    ),
  },
  // 23
  {
    title: "Diesel Rental: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={5} solutionLabel="Diesel Rental" color="#6B6B6B" icon={dieselIcon} photo={P.generator}
        heading="Distributed Diesel Generation Across Egypt"
        subheading="Reliable diesel generator solutions for off-grid sites and business continuity during power shortages"
        body="Gensets are rated 0.5–2 MW, right-sized to demand and scaled up simply by adding units. Fast-start units deliver dependable power for grid support, standby backup and off-grid sites, designed for heavy-duty use with guaranteed uptime and minimal maintenance. Trusted by tier-1 developers including Dina Farms."
        stats={[
          { value: "38 MW",     label: "Diesel power installed across Egypt" },
          { value: "0.5–2 MW",  label: "Genset size, tailored to client needs" },
          { value: "Fast-Start", label: "Grid support, standby backup & off-grid deployment" },
          { value: "Heavy-Duty", label: "Guaranteed uptime with minimal maintenance" },
        ]}
      />
    ),
  },
  // ── EV Chargers ──────────────────────────────────────────────────────────────
  // 24
  {
    title: "EV Chargers: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={6} solutionLabel="EV Chargers" color="#7c3aed" icon={evIcon} photo={P.ev}
        subtitle="AC, DC and golf-car charging with full-investment green-mobility services."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the energy you charge — little to no upfront CapEx."
        taqaInvests={["AC & DC fast-charging units", "Grid connection & upgrade works", "Energy-management & load balancing", "Payment, app & access platform", "BOO / BOOT charger financing"]}
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
  // 25
  {
    title: "EV Chargers: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={6} solutionLabel="EV Chargers" color="#7c3aed" icon={evIcon} photo={P.ev}
        whatYouGain={[
          { label: "Full Charger Range",             desc: "AC, DC fast and golf-car chargers cover every residential and resort mobility need." },
          { label: "Future-Proof Amenity",           desc: "EV-ready parking is now a deciding factor for buyers — it differentiates and future-proofs the community." },
          { label: "Effortless Resident Experience", desc: "App-based charging, transparent billing and a 24/7 hotline make adoption simple for residents." },
          { label: "Hotline & Mobile App",           desc: "24/7 TAQA hotline plus a user and operator app for seamless charging and management." },
        ]}
        taqaEdge={[
          { label: "First EV License in Egypt",  desc: "TAQA holds the first private EV-charging license in the country — a genuine first-mover advantage." },
          { label: "Lifecycle O&M & Uptime",     desc: "Ongoing operation and maintenance keep every charger available and revenue-generating." },
          { label: "Flexible Financing Options", desc: "TAQA invests in the chargers, or a profit-share model turns charging into an income stream shared with the developer." },
          { label: "Turnkey Engineering",        desc: "Site assessment, design, supply and installation delivered end-to-end by one partner." },
        ]}
      />
    ),
  },
  // 26
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
  // ── Closing ──────────────────────────────────────────────────────────────────
  // 27
  { title: "Why One Partner", render: () => <WhyOnePartnerSlide /> },
  // 28
  { title: "Cross-Solution Benefits", render: () => <BundleSlide /> },
  // 29
  { title: "Success Story: Soma Bay", render: () => <SomaBaySlide /> },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ResidentialClientsNew() {
  return (
    <DeckShell
      title="Residential Clients"
      subtitle="TAQA Arabia · Integrated Energy & Utility Solutions · Jan 2026"
      sections={SECTIONS}
      slides={SLIDES}
      narration={NARRATION}
      pdf="residential-clients.pdf"
    />
  );
}
