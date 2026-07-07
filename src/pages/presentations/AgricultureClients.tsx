import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Home as HomeIcon,
  Flame, Zap, Droplets, Truck, Battery, Globe, CheckCircle2, SunMedium,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import taqaLogo from "@/assets/taqa-logo.png";

// ─── Photos ───────────────────────────────────────────────────────────────────

const P: Record<string, string> = {
  cover:   "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
  farm:    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1400&q=80",
  water:   "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1400&q=80",
  solar:   "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80",
  battery: "https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=1400&q=80",
  cng:     "https://images.unsplash.com/photo-1568605135229-43af0a9bc4e8?auto=format&fit=crop&w=1400&q=80",
  dina:    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80",
  energy:  "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1400&q=80",
};

// ─── Constants ────────────────────────────────────────────────────────────────

const GREEN = "#15803d";
const GOLD  = "#FFC10E";
const NAVY  = "#002060";

// ─── PhotoBanner ──────────────────────────────────────────────────────────────

function PhotoBanner({ src, height = 148 }: { src: string; height?: number }) {
  return (
    <div className="relative overflow-hidden -mx-10 -mt-10 mb-5 shrink-0" style={{ height }}>
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(255,255,255,1) 90%)" }}
      />
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
  return (
    <div className="flex flex-col h-full justify-between relative overflow-hidden" style={{ background: "#001a0d" }}>
      <img
        src={P.cover}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.35, mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #001a0dee 0%, #002060cc 40%, #003a1aaa 70%, #15803d66 100%)" }}
      />
      <div className="flex items-center gap-3 p-8 relative z-10">
        <img src={taqaLogo} alt="TAQA Arabia" className="h-12 object-contain bg-white/90 rounded px-3 py-1" />
      </div>
      <div className="px-12 pb-4 relative z-10">
        <div className="w-16 h-1 rounded-full mb-6" style={{ background: GOLD }} />
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
          Agriculture<br />
          <span style={{ color: GOLD }}>Clients</span>
        </h1>
        <p className="text-white/70 text-xl mb-2">Integrated Energy &amp; Utility Solutions</p>
        <p className="text-white/40 text-sm">Jan 2026</p>
      </div>
      <div className="px-12 py-8 border-t border-white/10 relative z-10">
        <p className="text-white/30 text-xs">TAQA Arabia · Confidential</p>
      </div>
    </div>
  );
}

// ─── Slide 1: About TAQA Arabia ───────────────────────────────────────────────

function AboutSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.farm} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: GREEN }}>
          TAQA Arabia · Who We Are
        </p>
        <h2 className="text-3xl font-bold" style={{ color: NAVY }}>
          Egypt's leading integrated energy infrastructure developer
        </h2>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
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
        <div className="space-y-3">
          {[
            { label: "Gas",       icon: <Flame className="w-4 h-4" />,    desc: "Distribution, EPC & virtual pipeline" },
            { label: "Power",     icon: <Zap className="w-4 h-4" />,      desc: "Generation & distribution, solar PV, EV" },
            { label: "Petroleum", icon: <Truck className="w-4 h-4" />,    desc: "Oil-marketing stations, lubricants" },
            { label: "Water",     icon: <Droplets className="w-4 h-4" />, desc: "Reverse-osmosis desalination, filtration, smart solar ops" },
          ].map(d => (
            <div key={d.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#f0f7f2] border border-[#15803d]/10">
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: GREEN, color: GOLD }}
              >
                {d.icon}
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: NAVY }}>{d.label}</div>
                <div className="text-xs text-gray-500">{d.desc}</div>
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
    { value: "8",      label: "Countries",            sub: "Egypt, GCC, Africa & Greece" },
    { value: "4",      label: "Operating divisions",  sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates in Egypt",sub: "Full customer spectrum" },
    { value: "3,400+", label: "Employees",            sub: "Across all divisions" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.energy} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: GREEN }}>
          TAQA Arabia · Regional Presence
        </p>
        <h2 className="text-3xl font-bold" style={{ color: NAVY }}>
          A growing platform across Egypt, the GCC, Africa and Greece
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {metrics.map(m => (
          <div key={m.label} className="rounded-xl p-4 text-white text-center" style={{ background: NAVY }}>
            <div className="text-3xl font-bold" style={{ color: GOLD }}>{m.value}</div>
            <div className="text-xs font-semibold mt-1">{m.label}</div>
            <div className="text-[10px] text-white/50 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#f0f7f2] p-5 border border-[#15803d]/10">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4" style={{ color: GREEN }} />
            <h3 className="font-bold text-sm" style={{ color: NAVY }}>International Expansion</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>GCC</strong> — Partnered with Al Ghaneim &amp; WETICO for Sovereign water-desalination
            projects.<br /><br />
            <strong>Africa</strong> — Pursuing gas and power opportunities across sub-Saharan markets.<br /><br />
            <strong>Greece</strong> — Expanding into European energy infrastructure.
          </p>
        </div>
        <div className="rounded-xl p-5 text-white" style={{ background: NAVY }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: GOLD }}>Geographic Footprint</h3>
          <p className="text-xs text-white/70 leading-relaxed mb-3">
            Concessions in 8 Egyptian governorates renewed for 15 years. TAQA serves the full
            spectrum of customer types:
          </p>
          {[
            "Agricultural farms & agribusiness",
            "Residential communities & compounds",
            "Industrial zones & factories",
            "Touristic destinations & resorts",
          ].map(i => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/80 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
              {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 3: In Numbers ──────────────────────────────────────────────────────

function NumbersSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.solar} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: GREEN }}>
          TAQA Arabia · In Numbers
        </p>
        <h2 className="text-2xl font-bold" style={{ color: NAVY }}>
          The scale behind a single integrated energy partner — FY 2025
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { value: "EGP 13.4bn", label: "Revenue",      sub: "FY 2025" },
          { value: "EGP 1.5bn",  label: "EBITDA",       sub: "FY 2025" },
          { value: "~6.5M",      label: "Gas customers", sub: "Active connections" },
        ].map(m => (
          <div
            key={m.label}
            className="rounded-xl p-5 text-white text-center"
            style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${GREEN} 100%)` }}
          >
            <div className="text-xl font-bold" style={{ color: GOLD }}>{m.value}</div>
            <div className="text-xs font-semibold mt-1">{m.label}</div>
            <div className="text-[10px] text-white/50 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { div: "GAS",          icon: <Flame className="w-4 h-4" />,    stats: ["+10,000 km", "8 governorates, 15yr"],     color: "#E68A00" },
          { div: "POWER",        icon: <Zap className="w-4 h-4" />,      stats: ["+1,600 MVA", "+150 MW"],                  color: GOLD },
          { div: "WATER",        icon: <Droplets className="w-4 h-4" />, stats: ["+47,000 m³/day", "15 locations"],         color: "#0095C8" },
          { div: "MOBILITY/CNG", icon: <Truck className="w-4 h-4" />,    stats: ["86 stations", "1st private EV licence"],  color: "#7B35C2" },
        ].map(d => (
          <div key={d.div} className="rounded-xl bg-[#f0f7f2] p-4 border border-[#15803d]/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: d.color }}>
                <span className="text-white">{d.icon}</span>
              </div>
              <span className="font-bold text-xs" style={{ color: NAVY }}>{d.div}</span>
            </div>
            {d.stats.map(s => (
              <div key={s} className="flex items-start gap-1.5 mb-1">
                <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: d.color }} />
                <span className="text-[11px] text-gray-600">{s}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 4: The Challenge ───────────────────────────────────────────────────

function ChallengeSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.farm} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#dc2626] mb-1">
          Agriculture · The Challenge
        </p>
        <h2 className="text-3xl font-bold" style={{ color: NAVY }}>
          Energy and water — the two biggest costs on any farm
        </h2>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {[
          {
            label: "Power",
            icon: <Zap className="w-5 h-5 text-white" />,
            color: "#dc2626",
            desc: "Pivots and pumps run on diesel gensets — the biggest operating cost, volatile price, CO₂ exposure.",
          },
          {
            label: "Water",
            icon: <Droplets className="w-5 h-5 text-white" />,
            color: "#0095C8",
            desc: "Groundwater depletion and poor-quality feed water threaten long-term irrigation security.",
          },
          {
            label: "Fragmentation",
            icon: <Globe className="w-5 h-5 text-white" />,
            color: "#7B35C2",
            desc: "Water, fuel and power come from separate suppliers with no unified view or accountability.",
          },
        ].map(c => (
          <div key={c.label} className="rounded-xl p-5 border-2" style={{ borderColor: c.color + "40", background: c.color + "08" }}>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3" style={{ background: c.color }}>
              {c.icon}
            </div>
            <h3 className="font-bold mb-2" style={{ color: NAVY }}>{c.label}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
      <div
        className="rounded-xl p-5 text-white"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${GREEN} 100%)` }}
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5" style={{ color: GOLD }} />
          <h3 className="font-bold" style={{ color: GOLD }}>TAQA's Integrated Answer</h3>
        </div>
        <p className="text-sm text-white/85 leading-relaxed">
          One operator delivers clean water + a smart, multi-source power stack — solar by day, batteries after
          sunset, gas gensets for firming, diesel only as backup — all under a single BOO/BOOT agreement
          with no farm capex.
        </p>
      </div>
    </div>
  );
}

// ─── Slide 5: Integrated Farm Solution ───────────────────────────────────────

function IntegratedSolutionSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.farm} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: GREEN }}>
          TAQA · Integrated Farm Solution
        </p>
        <h2 className="text-2xl font-bold" style={{ color: NAVY }}>
          One partner connects water and a smart, multi-source power stack to keep every pivot turning
        </h2>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {/* Flow diagram */}
        <div className="flex items-stretch gap-3">
          {/* Energy Sources */}
          <div className="flex-1 rounded-xl bg-[#f0f7f2] p-4 border border-[#15803d]/15">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>
              Energy Sources
            </p>
            {[
              { icon: <SunMedium className="w-4 h-4" />, label: "Solar",         desc: "Cheapest day power",   color: "#d97706" },
              { icon: <Battery className="w-4 h-4" />,   label: "Battery",       desc: "Solar after sunset",   color: "#7B35C2" },
              { icon: <Truck className="w-4 h-4" />,     label: "Mobile CNG",    desc: "Clean gas firming",    color: "#E68A00" },
              { icon: <Flame className="w-4 h-4" />,     label: "Diesel Gensets",desc: "Backup / peaks only",  color: "#6B6B6B" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 mb-2">
                <div
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ background: s.color }}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: NAVY }}>{s.label}</div>
                  <div className="text-[10px] text-gray-500">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrow + EMS */}
          <div className="flex flex-col items-center justify-center gap-2 px-1">
            <div className="text-gray-400 text-xl font-bold">→</div>
            <div
              className="rounded-xl p-3 text-center text-white shrink-0"
              style={{ background: GREEN, minWidth: 100 }}
            >
              <Zap className="w-5 h-5 mx-auto mb-1" style={{ color: GOLD }} />
              <div className="text-[9px] font-bold leading-tight">TAQA Smart<br />Energy Mgmt</div>
            </div>
            <div className="text-gray-400 text-xl font-bold">→</div>
          </div>

          {/* Output */}
          <div className="flex-1 rounded-xl p-4 text-white" style={{ background: NAVY }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>
              Powered Pivots 24/7
            </p>
            <p className="text-xs text-white/70 leading-relaxed">
              Round-the-clock irrigation — optimised source mix, always on, minimum cost.
            </p>
          </div>
        </div>

        {/* Water */}
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ background: "#0095C808", border: "2px solid #0095C840" }}
        >
          <Droplets className="w-5 h-5 shrink-0" style={{ color: "#0095C8" }} />
          <div>
            <span className="font-bold text-sm" style={{ color: NAVY }}>Water Solutions</span>
            <span className="text-xs text-gray-500 ml-2">Desalination · Wells · Pumping</span>
          </div>
        </div>

        <div
          className="rounded-xl p-3 text-center text-sm font-semibold"
          style={{ background: GREEN + "12", border: `1.5px solid ${GREEN}30`, color: GREEN }}
        >
          "TAQA delivers the whole farm energy-and-water backbone as one system."
        </div>
      </div>
    </div>
  );
}

// ─── Slide 6: Smart Energy Mix ────────────────────────────────────────────────

function SmartEnergyMixSlide() {
  const steps = [
    { n: "1", icon: <SunMedium className="w-5 h-5" />, color: "#d97706", title: "Solar first",       desc: "Cheapest, cleanest power runs the pivots all day." },
    { n: "2", icon: <Battery className="w-5 h-5" />,   color: "#7B35C2", title: "Then batteries",    desc: "Stored daytime solar carries irrigation into the evening and early morning." },
    { n: "3", icon: <Truck className="w-5 h-5" />,     color: "#E68A00", title: "Gas gensets firm",  desc: "Mobile-CNG gensets fill gaps at ~40% less than diesel." },
    { n: "4", icon: <Flame className="w-5 h-5" />,     color: "#6B6B6B", title: "Diesel last",       desc: "Runs only for peaks and backup — minimised, not relied on." },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.energy} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: GREEN }}>
          TAQA · Smart Energy Mix
        </p>
        <h2 className="text-2xl font-bold" style={{ color: NAVY }}>
          Solar by day, batteries after sunset, gas and diesel for firming — least-cost, lowest-carbon, always on
        </h2>
      </div>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map(s => (
          <div
            key={s.n}
            className="rounded-xl p-5 border-2 flex flex-col gap-3"
            style={{ borderColor: s.color + "40", background: s.color + "08" }}
          >
            <div className="flex items-center justify-between">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: s.color }}
              >
                {s.icon}
              </div>
              <span className="text-3xl font-black opacity-10" style={{ color: NAVY }}>{s.n}</span>
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: NAVY }}>{s.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="mt-4 rounded-xl p-4 text-center text-sm font-medium"
        style={{ background: GREEN + "10", border: `1.5px solid ${GREEN}30`, color: GREEN }}
      >
        One TAQA energy-management system optimises the mix every minute — least cost, lowest carbon, always on.
      </div>
    </div>
  );
}

// ─── Slide 7: Solutions Overview ──────────────────────────────────────────────

function SolutionsOverviewSlide() {
  const solutions = [
    { num: "01", label: "Water Solutions", desc: "Desalination, groundwater treatment and smart, solar-powered irrigation pumping.",           icon: <Droplets className="w-5 h-5" />, color: "#0095C8" },
    { num: "02", label: "Solar",           desc: "Tailored solar PV via PPA to power pivots and pumps by day — no farm capex.",               icon: <SunMedium className="w-5 h-5" />, color: "#d97706" },
    { num: "03", label: "Battery Storage", desc: "Shifts solar into the night and firms the stack so pivots never stop.",                      icon: <Battery className="w-5 h-5" />,   color: "#7B35C2" },
    { num: "04", label: "Mobile CNG",      desc: "Portable natural gas to fuel farm gensets — ~40% cheaper than diesel.",                     icon: <Truck className="w-5 h-5" />,     color: "#E68A00" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.farm} />
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: GREEN }}>
          Agriculture Clients · Solutions Overview
        </p>
        <h2 className="text-3xl font-bold" style={{ color: NAVY }}>
          The following slides detail every solution TAQA Arabia offers to farms and agribusiness
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Each solution: Scope &amp; How It Works → Value Proposition → Implementation Timeline → Proven Track Record
        </p>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-6">
        {solutions.map(s => (
          <div
            key={s.num}
            className="rounded-xl border-2 p-6 flex flex-col gap-3"
            style={{ borderColor: s.color + "30" }}
          >
            <div className="flex items-center justify-between">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center text-white"
                style={{ background: s.color }}
              >
                {s.icon}
              </div>
              <span className="text-4xl font-black opacity-10" style={{ color: NAVY }}>{s.num}</span>
            </div>
            <div>
              <h3 className="font-bold" style={{ color: NAVY }}>{s.label}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} height={120} />
      <div className="mb-3 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: color }}
        >
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
            {sectionLabel}
          </p>
          <h2 className="text-xl font-bold" style={{ color: NAVY }}>{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div
        className="rounded-xl p-3 mb-3 text-sm font-medium"
        style={{ background: color + "12", borderLeft: `3px solid ${color}`, color: NAVY }}
      >
        {tagline}
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* TAQA Invests */}
        <div className="rounded-xl p-4" style={{ background: color + "08", border: `1.5px solid ${color}20` }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color }}>
            TAQA Invests
          </p>
          {taqaInvests.map(i => (
            <div key={i} className="flex items-start gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
              <span className="text-xs text-gray-600">{i}</span>
            </div>
          ))}
        </div>
        {/* Steps */}
        <div className="rounded-xl p-4 bg-[#f8f8f8]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">How It Works</p>
          <div className="relative pl-5 border-l-2 border-gray-200">
            {steps.map((s, i) => (
              <div key={i} className="relative mb-3">
                <div
                  className="absolute -left-[22px] top-0 w-4 h-4 rounded-full border-2 bg-white text-[9px] font-bold flex items-center justify-center"
                  style={{ borderColor: color, color }}
                >
                  {i + 1}
                </div>
                <span className="text-xs text-gray-600 leading-relaxed">{s}</span>
              </div>
            ))}
          </div>
        </div>
        {/* What You Receive */}
        <div className="rounded-xl p-4 text-white" style={{ background: NAVY }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            What You Receive
          </p>
          {whatYouReceive.map(w => (
            <div key={w} className="flex items-start gap-2 mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: GOLD }} />
              <span className="text-xs text-white/80">{w}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
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
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-4 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: color }}
        >
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
            {sectionLabel}
          </p>
          <h2 className="text-2xl font-bold" style={{ color: NAVY }}>{title}</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">What You Gain</p>
          <div className="space-y-2">
            {gains.map(g => (
              <div
                key={g.label}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: color + "0D" }}
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                <div>
                  <div className="font-semibold text-sm" style={{ color: NAVY }}>{g.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">TAQA Arabia Edge</p>
          <div className="space-y-2">
            {edge.map(e => (
              <div
                key={e.label}
                className="flex items-start gap-3 p-3 rounded-xl bg-[#f0f7f2] border border-[#15803d]/10"
              >
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: GREEN }} />
                <div>
                  <div className="font-semibold text-sm" style={{ color: NAVY }}>{e.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} height={110} />
      <div className="mb-4 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: color }}
        >
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
            {sectionLabel}
          </p>
          <h2 className="text-2xl font-bold" style={{ color: NAVY }}>{title}</h2>
        </div>
      </div>

      {/* Phase group bands */}
      <div
        className="grid gap-2 mb-5"
        style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}
      >
        {groups.map((g, i) => (
          <div
            key={i}
            className="rounded-lg p-3 text-center text-white"
            style={{ background: g.color ?? color }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest">{g.label}</div>
            <div className="text-xs mt-0.5 opacity-80">{g.range}</div>
          </div>
        ))}
      </div>

      {/* Phase list */}
      <div className="flex-1 relative pl-5 border-l-2" style={{ borderColor: color + "40" }}>
        {phases.map((p, i) => (
          <div key={i} className="relative mb-3">
            <div
              className="absolute -left-[22px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center"
              style={{ borderColor: color }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[10px] font-bold shrink-0" style={{ color }}>{p.day}</span>
              <span className="font-semibold text-xs" style={{ color: NAVY }}>{p.label}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
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
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-5 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: color }}
        >
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
            {sectionLabel}
          </p>
          <h2 className="text-2xl font-bold" style={{ color: NAVY }}>{title}</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-xl p-6"
          style={{ background: color + "08", border: `1.5px solid ${color}20` }}
        >
          <h3 className="font-bold mb-2" style={{ color: NAVY }}>{subheadline}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 content-start">
          {stats.map(s => (
            <div
              key={s.label}
              className="rounded-xl text-center p-4"
              style={{ background: NAVY }}
            >
              <div className="text-base font-black" style={{ color }}>{s.value}</div>
              <div className="text-[10px] text-white/70 mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 24: Why One Partner ────────────────────────────────────────────────

function WhyOnePartnerSlide() {
  const benefits = [
    { label: "One SLA",                   desc: "A single agreement covers water, solar, storage, gas and diesel — one uptime guarantee for the whole farm." },
    { label: "One Communication Point",   desc: "A single account team and 24/7 hotline — no chasing separate water and power contractors." },
    { label: "One Commercial Relationship",desc: "Consolidated billing and aligned BOO/BOOT terms instead of separate procurement cycles." },
    { label: "One Smart System",           desc: "Water and the full power stack run on one TAQA energy-management platform — optimised together." },
    { label: "One Accountable Owner",      desc: "End-to-end responsibility removes interface risk — TAQA owns the farm's water-and-energy uptime." },
  ];
  const solutions = ["Water Solutions", "Solar", "Storage", "Mobile CNG", "Diesel", "Smart EMS"];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.farm} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: NAVY }}>
          Why One Partner
        </p>
        <h2 className="text-3xl font-bold" style={{ color: NAVY }}>The TAQA One-Stop-Shop</h2>
        <p className="text-gray-500 text-sm mt-1">
          One SLA, one communication point, one accountable operator — for the farm's water and power.
        </p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl p-5 text-white" style={{ background: NAVY }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: GOLD }}>TAQA Arabia — All Farm Solutions</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {solutions.map(s => (
              <div key={s} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: GOLD }} />
                <span className="text-white text-xs font-medium">{s}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/60">From Fragmented Vendors → One Integrated Operator</p>
          </div>
        </div>
        <div className="space-y-2">
          {benefits.map(b => (
            <div
              key={b.label}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#f0f7f2] border border-[#15803d]/10"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GREEN }} />
              <div>
                <div className="font-bold text-sm" style={{ color: NAVY }}>{b.label}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.energy} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: NAVY }}>
          Integrated Economics
        </p>
        <h2 className="text-2xl font-bold" style={{ color: NAVY }}>
          The Integrated Economics: Diesel-Only vs. TAQA
        </h2>
        <p className="text-gray-500 text-xs mt-1">
          What changes when one partner runs an optimised water-and-power stack — illustrative
        </p>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-5">
        {/* Today */}
        <div className="rounded-xl p-5 border-2 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-red-800">Today — Diesel-Only Farm</h3>
          </div>
          <div className="space-y-2">
            {today.map(t => (
              <div key={t.label} className="flex items-start gap-2 p-2 rounded-lg bg-white border border-red-100">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-red-400" />
                <div>
                  <div className="font-semibold text-xs text-red-800">{t.label}</div>
                  <div className="text-[11px] text-red-600 mt-0.5">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* With TAQA */}
        <div
          className="rounded-xl p-5 border-2"
          style={{ borderColor: GREEN + "50", background: GREEN + "08" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: GREEN }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold" style={{ color: GREEN }}>With TAQA — Integrated Stack</h3>
          </div>
          <div className="space-y-2">
            {withTaqa.map(t => (
              <div
                key={t.label}
                className="flex items-start gap-2 p-2 rounded-lg bg-white"
                style={{ border: `1px solid ${GREEN}20` }}
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GREEN }} />
                <div>
                  <div className="font-semibold text-xs" style={{ color: NAVY }}>{t.label}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-3">
        Figures are illustrative / market-based and depend on farm size, crop, irrigation schedule and fuel prices.
      </p>
    </div>
  );
}

// ─── Slide 26: Proven on the Ground (Closing) ─────────────────────────────────

function ClosingSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.dina} height={180} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: GREEN }}>
          Proven on the Ground
        </p>
        <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Dina Farms &amp; Beyond</h2>
        <p className="text-gray-500 text-sm mt-1">
          Real agricultural renewable projects — the foundation for the fully integrated farm.
        </p>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        TAQA Arabia operates renewable-energy projects at Dina Farms — one of Egypt's largest integrated
        agricultural operations — alongside its landmark Benban solar developments. These projects prove
        TAQA can deploy and run clean energy at true agricultural scale. The next step is the fully
        integrated stack: pairing that solar with storage, gas and water under one operator.
      </p>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Water Solutions", color: "#0095C8" },
          { label: "Solar",           color: "#d97706" },
          { label: "Battery Storage", color: "#7B35C2" },
          { label: "Mobile CNG",      color: "#E68A00" },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl p-3 text-center text-white text-xs font-semibold"
            style={{ background: s.color }}
          >
            {s.label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { value: "Dina Farms",  label: "Live agricultural solar project" },
          { value: "Benban",      label: "Landmark solar development" },
          { value: "~1,000 t",    label: "CO₂/MWp/yr avoided" },
          { value: "Zero Capex",  label: "Under BOO/BOOT" },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl p-4 text-center"
            style={{ background: GREEN + "0F", border: `1.5px solid ${GREEN}25` }}
          >
            <div className="text-sm font-black" style={{ color: GREEN }}>{s.value}</div>
            <div className="text-[10px] text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
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
        icon={<Droplets className="w-5 h-5" />}
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
        icon={<SunMedium className="w-5 h-5" />}
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
        icon={<Battery className="w-5 h-5" />}
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
        icon={<Truck className="w-5 h-5" />}
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
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<"fwd" | "bwd">("fwd");
  const total = SLIDES.length;
  const section = sectionOf(current);

  const go = (target: number) => {
    if (target < 0 || target >= total) return;
    setDirection(target > current ? "fwd" : "bwd");
    setAnimKey(k => k + 1);
    setCurrent(target);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setDirection("fwd");
        setAnimKey(k => k + 1);
        setCurrent(c => Math.min(total - 1, c + 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setDirection("bwd");
        setAnimKey(k => k + 1);
        setCurrent(c => Math.max(0, c - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const handleSlideClick = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("button") || t.closest("a") || t.closest("select") || t.closest("input")) return;
    go(current + 1);
  };

  const progressPct = ((current + 1) / total) * 100;

  return (
    <>
      <style>{`
        @keyframes ag-slide-right { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
        @keyframes ag-slide-left  { from { opacity:0; transform:translateX(-32px); } to { opacity:1; transform:translateX(0); } }
        .ag-fwd { animation: ag-slide-right 0.32s cubic-bezier(0.16,1,0.3,1) both; }
        .ag-bwd { animation: ag-slide-left  0.32s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div className="min-h-screen bg-[#0d1117] flex flex-col">

        {/* Progress bar */}
        <div className="h-0.5 bg-white/10 shrink-0">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: section.color }}
          />
        </div>

        {/* Header */}
        <header className="bg-[#161b22] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="secondary" size="sm" className="gap-1.5 shrink-0">
                <HomeIcon className="h-4 w-4" />Home
              </Button>
            </Link>
            <div className="border-l border-white/20 pl-3 hidden sm:block">
              <p className="text-white text-sm font-bold">Agriculture Clients</p>
              <p className="text-white/40 text-[10px]">
                TAQA Arabia · Integrated Energy &amp; Utility Solutions · Jan 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-xs hidden md:flex items-center gap-2">
              <span className="font-medium" style={{ color: section.color }}>{section.label}</span>
              <span>·</span>
              {current + 1} / {total}
            </span>
          </div>
        </header>

        {/* Section nav */}
        <div className="bg-[#161b22] border-b border-white/10 px-4 overflow-x-auto">
          <div className="flex gap-1 py-1">
            {SECTIONS.map(s => {
              const isActive = s.slides.some(i => i === current);
              return (
                <button
                  key={s.id}
                  onClick={() => go(s.slides[0])}
                  className={`px-3 py-2 text-xs font-medium whitespace-nowrap rounded-lg transition-colors ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                  style={isActive ? { background: s.color } : undefined}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slide canvas */}
        <div className="flex-1 flex flex-col p-4 md:p-6 gap-4">
          <div
            className="flex-1 rounded-2xl shadow-2xl overflow-hidden border border-white/10 cursor-pointer"
            style={{ minHeight: "520px" }}
            onClick={handleSlideClick}
          >
            <div key={animKey} className={direction === "fwd" ? "ag-fwd h-full" : "ag-bwd h-full"}>
              {SLIDES[current].render()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => go(current - 1)}
              disabled={current === 0}
              className="gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex items-center gap-1 overflow-x-auto max-w-[50vw] pb-1">
              {SLIDES.map((_, i) => {
                const sec = sectionOf(i);
                const isActive = i === current;
                return (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={`rounded-full transition-all shrink-0 ${
                      isActive ? "w-5 h-3" : "w-2.5 h-2.5 opacity-30 hover:opacity-60"
                    }`}
                    style={{ background: sec.color }}
                    title={SLIDES[i].title}
                  />
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => go(current + 1)}
              disabled={current === total - 1}
              className="gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <span className="text-xs text-white/30">
              <span className="font-medium" style={{ color: section.color }}>{section.label}</span>
              {" · "}{SLIDES[current].title}{" · "}Slide {current + 1} of {total}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
