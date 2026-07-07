import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Home as HomeIcon,
  Flame, Zap, Droplets, Truck, Car, Globe,
  CheckCircle2, ArrowRight, Star, BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import taqaLogo from "@/assets/taqa-logo.png";

// ─── Photos ───────────────────────────────────────────────────────────────────

const P: Record<string, string> = {
  cover:   "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80",
  fleet:   "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80",
  fuel:    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80",
  cng:     "https://images.unsplash.com/photo-1568605135229-43af0a9bc4e8?auto=format&fit=crop&w=1400&q=80",
  ev:      "https://images.unsplash.com/photo-1593941799082-4fc77a3c4fc3?auto=format&fit=crop&w=1400&q=80",
  digital: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
  energy:  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80",
  road:    "https://images.unsplash.com/photo-1543965170-e399d68c2362?auto=format&fit=crop&w=1400&q=80",
};

// ─── PhotoBanner ─────────────────────────────────────────────────────────────

function PhotoBanner({ src, height = 158 }: { src: string; height?: number }) {
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
  return (
    <div className="flex flex-col h-full justify-between relative overflow-hidden" style={{ background: "#001020" }}>
      <img src={P.cover} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.35 }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #001020ee 0%, #001845cc 40%, #002060aa 70%, #0369a1 100%)" }} />
      <div className="flex items-center gap-3 p-8 relative z-10">
        <img src={taqaLogo} alt="TAQA Arabia" className="h-12 object-contain bg-white/90 rounded px-3 py-1" />
      </div>
      <div className="px-12 pb-4 relative z-10">
        <div className="w-16 h-1 bg-[#FFC10E] rounded-full mb-6" />
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
          Fleet &amp; Mobility<br />
          <span style={{ color: "#FFC10E" }}>Sector</span>
        </h1>
        <p className="text-white/70 text-xl mb-2">Integrated Energy &amp; Mobility Solutions · Jun 2026</p>
      </div>
      <div className="px-12 py-8 border-t border-white/10 relative z-10">
        <p className="text-white/30 text-xs">A World OF ENERGY · TAQA Arabia · Confidential</p>
      </div>
    </div>
  );
}

// ─── Slide 1: About ──────────────────────────────────────────────────────────

function AboutSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.fleet} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0369a1] mb-1">TAQA Arabia · Who We Are</p>
        <h2 className="text-3xl font-bold text-[#002060]">Egypt's leading integrated energy infrastructure developer</h2>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <span className="text-xs border border-[#0369a1]/40 text-[#0369a1] rounded px-2 py-0.5 font-semibold">IGU Member</span>
            <span className="text-xs border border-[#0369a1]/40 text-[#0369a1] rounded px-2 py-0.5 font-semibold">IGEM Accredited</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility developer. TAQA is uniquely positioned to support different mobility solutions to fuel vehicles with different energy sources such as petroleum products, lubes, electricity for EVs and natural gas for NGVs.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { label: "Gas",       icon: <Flame className="w-4 h-4" />,    desc: "Distribution, EPC, NGV stations, Mobile CNG",    color: "#059669" },
            { label: "Power",     icon: <Zap className="w-4 h-4" />,      desc: "Generation, solar PV, EV charging",              color: "#FFC10E" },
            { label: "Petroleum", icon: <Truck className="w-4 h-4" />,    desc: "Oil-marketing stations, lubricants, bulk fuel",   color: "#b45309" },
            { label: "Water",     icon: <Droplets className="w-4 h-4" />, desc: "RO desalination, filtration, solar ops",          color: "#0369a1" },
          ].map(d => (
            <div key={d.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#f0f4f8] border border-[#0369a1]/10">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: d.color }}>{d.icon}</div>
              <div>
                <div className="font-semibold text-[#002060] text-sm">{d.label}</div>
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
    { value: "8",      label: "Countries",         sub: "Egypt, GCC, Africa & Greece" },
    { value: "4",      label: "Operating divisions", sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates",       sub: "Across Egypt" },
    { value: "3,400+", label: "Employees",          sub: "Across all divisions" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.energy} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0369a1] mb-1">TAQA Arabia · Regional Presence</p>
        <h2 className="text-3xl font-bold text-[#002060]">A growing platform across Egypt, the GCC, Africa and Greece</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {metrics.map(m => (
          <div key={m.label} className="rounded-xl bg-[#002060] p-4 text-white text-center">
            <div className="text-3xl font-bold text-[#FFC10E]">{m.value}</div>
            <div className="text-xs font-semibold mt-1">{m.label}</div>
            <div className="text-[10px] text-white/50 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#f0f4f8] p-5 border border-[#0369a1]/10">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-[#0369a1]" />
            <h3 className="font-bold text-[#002060] text-sm">International Expansion</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>GCC</strong> — Partnered for Sovereign water-desalination projects.<br /><br />
            <strong>Africa</strong> — Pursuing gas and power opportunities across sub-Saharan markets.<br /><br />
            <strong>Greece</strong> — Expanding into European energy infrastructure.
          </p>
        </div>
        <div className="rounded-xl bg-[#002060] p-5 text-white">
          <h3 className="font-bold text-[#FFC10E] text-sm mb-3">Geographic Footprint</h3>
          <p className="text-xs text-white/70 leading-relaxed mb-3">
            Concessions in 8 Egyptian governorates. TAQA serves the full spectrum of fleet and mobility clients:
          </p>
          {["Commercial & logistics fleets", "Industrial & construction fleets", "Government & municipal fleets", "Tourism & hospitality fleets", "Oil & gas sector vehicles"].map(i => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/80 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC10E] shrink-0" />
              {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 3: In Numbers ─────────────────────────────────────────────────────

function NumbersSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.fuel} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0369a1] mb-1">TAQA Arabia · In Numbers</p>
        <h2 className="text-3xl font-bold text-[#002060]">The scale behind a single residential utility partner — FY 2025</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { value: "EGP 13.4bn", label: "Revenue",                  sub: "FY 2025" },
          { value: "EGP 1.5bn",  label: "EBITDA",                   sub: "FY 2025" },
          { value: "~6.5M",      label: "Residential gas customers", sub: "Active connections" },
        ].map(m => (
          <div key={m.label} className="rounded-xl bg-gradient-to-br from-[#002060] to-[#0369a1] p-5 text-white text-center">
            <div className="text-2xl font-bold text-[#FFC10E]">{m.value}</div>
            <div className="text-xs font-semibold mt-1">{m.label}</div>
            <div className="text-[10px] text-white/50 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { div: "GAS",       icon: <Flame className="w-4 h-4" />,    color: "#059669", stats: ["86 CNG stations", "18 conversion centers", "Capacity 12K cars/year", "Master Gas virtual pipeline"] },
          { div: "POWER",     icon: <Zap className="w-4 h-4" />,      color: "#FFC10E", stats: ["+130 charging stations", "1st private EV licence", "Waqood EnerTech", "AC & DC fast chargers"] },
          { div: "PETROLEUM", icon: <Truck className="w-4 h-4" />,    color: "#b45309", stats: ["230+ fuel stations", "172 Wataniya", "2 fuel terminals", "Suez & Alexandria"] },
          { div: "MOBILITY",  icon: <Car className="w-4 h-4" />,      color: "#0369a1", stats: ["Fuel · CNG · EV · Waqood", "One account, one SLA", "Fleet card & cashless", "Consolidated billing"] },
        ].map(d => (
          <div key={d.div} className="rounded-xl bg-[#f0f4f8] p-4 border border-[#0369a1]/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: d.color }}>{d.icon}</div>
              <span className="font-bold text-[#002060] text-xs">{d.div}</span>
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

// ─── Slide 4: Fleet Challenge ─────────────────────────────────────────────────

function FleetChallengeSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.fleet} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#dc2626] mb-1">Fleet & Mobility · The Challenge</p>
        <h2 className="text-3xl font-bold text-[#002060]">The fleet operator's energy challenge</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {[
          { label: "HIGH FUEL COST",          desc: "Diesel and petrol are the biggest operating cost — volatile, exposed to every oil-price spike.",              color: "#dc2626" },
          { label: "FRAGMENTED SUPPLIERS",    desc: "Fuel, gas, chargers and software from separate vendors — no single view or accountability.",                   color: "#b45309" },
          { label: "FUEL LEAKAGE & FRAUD",    desc: "Cash, paper receipts and no per-vehicle control quietly inflate the bill.",                                    color: "#7c3aed" },
          { label: "RISING CARBON & CITY RISK", desc: "100% combustion means maximum emissions and exposure to low-emission zones.",                              color: "#059669" },
        ].map(c => (
          <div key={c.label} className="rounded-xl p-4 border-l-4" style={{ borderColor: c.color, background: c.color + "08" }}>
            <div className="font-bold text-xs mb-1" style={{ color: c.color }}>{c.label}</div>
            <p className="text-sm text-gray-700 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-[#002060] p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight className="w-4 h-4 text-[#FFC10E]" />
          <h3 className="font-bold text-[#FFC10E] text-sm">TAQA's Answer</h3>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          A managed energy transition from <strong className="text-white">diesel today</strong> → <strong className="text-[#6ee7b7]">CNG as the bridge</strong> → <strong className="text-[#c4b5fd]">EV as the destination</strong> — financed and staged at the fleet's own pace. One partner, one account, one Waqood dashboard.
        </p>
      </div>
    </div>
  );
}

// ─── Slide 5: Mobility Energy Pathway ────────────────────────────────────────

function PathwaySlide() {
  const stages = [
    { label: "NOW",    title: "Optimise the Combustion Fleet",  desc: "Consolidate diesel and petrol under one Waqood account with depot fuelling — squeeze cost and visibility out of the fleet you run today.",                                                                          color: "#b45309", icon: <Truck className="w-5 h-5" /> },
    { label: "BRIDGE", title: "Convert to Natural Gas",          desc: "Convert suitable vehicles to CNG and fuel them via the station network or the Master Gas mobile virtual pipeline — the fastest payback in the transition, up to ~40% lower fuel cost.",                               color: "#059669", icon: <Flame className="w-5 h-5" /> },
    { label: "FUTURE", title: "Electrify the Fleet",             desc: "Roll out depot and en-route charging — backed by TAQA Power's EV licence and distribution expertise.",                                                                                                                  color: "#7c3aed", icon: <Zap className="w-5 h-5" /> },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.road} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0369a1] mb-1">Fleet & Mobility · The Pathway</p>
        <h2 className="text-3xl font-bold text-[#002060]">Diesel today, natural gas as the bridge, electric as the destination — at your pace</h2>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-4 mb-4">
        {stages.map((s, i) => (
          <div key={s.label} className="relative rounded-xl p-5 border-2 flex flex-col" style={{ borderColor: s.color + "40", background: s.color + "06" }}>
            {i < 2 && (
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-5 h-5 text-gray-300" />
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded text-white" style={{ background: s.color }}>{s.label}</span>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ background: s.color }}>{s.icon}</div>
            </div>
            <h3 className="font-bold text-[#002060] text-sm mb-2">{s.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed flex-1">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-[#f0f4f8] p-4 border border-[#0369a1]/10">
        <p className="text-xs text-gray-600 leading-relaxed text-center">
          <strong className="text-[#002060]">TAQA finances and manages each step,</strong> so the fleet moves down the cost-and-carbon curve at its own pace — never stranded, never forced.
        </p>
      </div>
    </div>
  );
}

// ─── Slide 6: Solutions Overview ─────────────────────────────────────────────

function SolutionsOverviewSlide() {
  const solutions = [
    { num: "01", label: "Fuel Stations",       desc: "Keep today's fleet moving — diesel and gasoline from a nationwide TAQA-operated station network and two terminals.",                                                          icon: <Truck className="w-5 h-5" />,    color: "#b45309" },
    { num: "02", label: "Natural Gas (CNG)",   desc: "Convert the fleet you own to gas — licensed NGV conversion plus TAQA's CNG network and the Master Gas mobile virtual pipeline.",                                            icon: <Flame className="w-5 h-5" />,    color: "#059669" },
    { num: "03", label: "EV Charging",         desc: "Electrify with the holder of Egypt's first private EV-charging licence — depot, destination and en-route AC/DC charging, end-to-end.",                                     icon: <Zap className="w-5 h-5" />,      color: "#7c3aed" },
    { num: "04", label: "Waqood Smart System", desc: "See and control the whole fleet from one screen — fuel, CNG and EV data in a single dashboard.",                                                                           icon: <BarChart2 className="w-5 h-5" />, color: "#0369a1" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.fleet} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0369a1] mb-1">Fleet & Mobility · Solutions Overview</p>
        <h2 className="text-3xl font-bold text-[#002060]">Mobility · Solutions Overview</h2>
        <p className="text-gray-500 text-sm mt-1">The following slides detail every service TAQA Arabia's mobility sector offers to fleets.</p>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-5">
        {solutions.map(s => (
          <div key={s.num} className="rounded-xl border-2 p-6 flex flex-col gap-4" style={{ borderColor: s.color + "30" }}>
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white" style={{ background: s.color }}>{s.icon}</div>
              <span className="text-4xl font-black opacity-10 text-[#002060]">{s.num}</span>
            </div>
            <div>
              <h3 className="font-bold text-[#002060] text-base">{s.label}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
}

function FleetScopeSlide({ num, title, subtitle, color, icon, taqaInvests, steps, receive, photo }: FleetScopeSlideProps) {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{num} · Scope &amp; How It Works</p>
          <h2 className="text-2xl font-bold text-[#002060]">{title}</h2>
          <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{ background: color + "0D", border: `1.5px solid ${color}22` }}>
          <h3 className="font-bold text-[#002060] text-xs uppercase tracking-wide mb-3">TAQA Invests</h3>
          {taqaInvests.map(item => (
            <div key={item} className="flex items-start gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
              <span className="text-xs text-gray-600">{item}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-[#f0f4f8] p-4">
          <h3 className="font-bold text-[#002060] text-xs uppercase tracking-wide mb-3">How It Works</h3>
          {steps.map(s => (
            <div key={s.n} className="flex items-start gap-2 mb-2.5">
              <div className="h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: color }}>{s.n}</div>
              <span className="text-xs text-gray-600 leading-relaxed">{s.text}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-[#002060] p-4 text-white">
          <h3 className="font-bold text-[#FFC10E] text-xs uppercase tracking-wide mb-3">What You Receive</h3>
          {receive.map(item => (
            <div key={item} className="flex items-start gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-[#FFC10E] shrink-0" />
              <span className="text-xs text-white/80">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
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
}

function FleetValuePropSlide({ num, title, color, icon, gains, edge, photo }: FleetValuePropSlideProps) {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{num} · Value Proposition</p>
          <h2 className="text-2xl font-bold text-[#002060]">{title}</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">What You Gain</p>
          <div className="space-y-2.5">
            {gains.map(g => (
              <div key={g.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: color + "0D" }}>
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                <div>
                  <div className="font-semibold text-[#002060] text-sm">{g.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">TAQA Arabia Edge</p>
          <div className="space-y-2.5">
            {edge.map(e => (
              <div key={e.label} className="flex items-start gap-3 p-3 rounded-xl bg-[#002060]">
                <Star className="w-4 h-4 mt-0.5 shrink-0 text-[#FFC10E]" />
                <div>
                  <div className="font-semibold text-white text-sm">{e.label}</div>
                  <div className="text-xs text-white/60 mt-0.5 leading-relaxed">{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
}

function FleetTimelineSlide({ num, title, color, icon, phases, groups, photo }: FleetTimelineSlideProps) {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} height={130} />
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{num} · Implementation Timeline</p>
          <h2 className="text-2xl font-bold text-[#002060]">{title}</h2>
        </div>
      </div>
      <div className="flex gap-2 mb-5">
        {groups.map(g => (
          <div key={g.label} className="flex-1 rounded-lg p-3 text-center" style={{ background: g.color }}>
            <div className="text-white font-black text-xs uppercase tracking-widest">{g.label}</div>
            <div className="text-white/70 text-[10px] mt-0.5">{g.range}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {phases.map((p, i) => (
          <div key={i} className="rounded-xl p-4 border" style={{ borderColor: color + "30", background: color + "06" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: color }}>{i + 1}</div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{p.range}</span>
            </div>
            <div className="font-bold text-[#002060] text-sm mb-1">{p.label}</div>
            <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
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
}

function FleetTrackRecordSlide({ num, title, color, icon, headline, subheadline, body, stats, photo }: FleetTrackRecordSlideProps) {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{num} · Proven Track Record</p>
          <h2 className="text-2xl font-bold text-[#002060]">{title}</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl p-6" style={{ background: color + "08", border: `1.5px solid ${color}20` }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4" style={{ color }} />
            <h3 className="font-bold text-[#002060] text-base">{headline}</h3>
          </div>
          <p className="text-[#0369a1] text-xs font-medium mb-3">{subheadline}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 content-start">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl text-center p-4" style={{ background: color }}>
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-[10px] text-white/70 mt-1 leading-tight">{s.label}</div>
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
    { label: "One SLA",                    desc: "A single service-level agreement governs fuel, gas, conversion, charging and Waqood — one uptime guarantee, one renewal." },
    { label: "One Communication Point",    desc: "A single account team and 24/7 hotline — no chasing multiple contractors." },
    { label: "One Commercial Relationship", desc: "Consolidated billing, aligned contract terms and a single negotiation." },
    { label: "One Engineering Standard",   desc: "Solutions designed to interoperate — shared accounts, shared monitoring." },
    { label: "One Accountable Owner",      desc: "End-to-end responsibility removes interface risk." },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.fleet} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#002060] mb-1">Why One Partner</p>
        <h2 className="text-3xl font-bold text-[#002060]">The TAQA One-Stop-Shop</h2>
        <p className="text-gray-500 text-sm mt-1">One SLA, one communication point, one accountable operator — across every utility in the fleet.</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-[#002060] p-6 text-white flex flex-col">
          <h3 className="font-bold text-[#FFC10E] mb-4 text-sm">TAQA Arabia — Mobility Solutions: Fuel · CNG · Waqood · EV Charging</h3>
          {["Fuel Stations", "Natural Gas (CNG)", "EV Charging", "Waqood Smart System"].map(s => (
            <div key={s} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#FFC10E] shrink-0" />
              <span className="text-white text-sm font-medium">{s}</span>
            </div>
          ))}
          <div className="mt-auto pt-4 border-t border-white/10">
            <p className="text-xs text-white/60">From Fragmented Vendors → A Single Operator</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {pillars.map(p => (
            <div key={p.label} className="flex items-start gap-3 p-3 rounded-xl bg-[#f0f4f8] border border-[#002060]/10">
              <ArrowRight className="w-4 h-4 text-[#0369a1] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[#002060] text-sm">{p.label}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{p.desc}</div>
              </div>
            </div>
          ))}
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
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.road} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0369a1] mb-1">Integrated Economics</p>
        <h2 className="text-3xl font-bold text-[#002060]">The Integrated Economics: Diesel-Only vs. TAQA</h2>
        <p className="text-gray-500 text-sm mt-0.5">Why a managed energy mix beats a diesel-only fleet — and widens the gap every year.</p>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-[#dc2626]" />
            <h3 className="font-bold text-[#dc2626] text-sm uppercase tracking-wide">Today — Diesel-Only Fleet</h3>
          </div>
          <div className="space-y-2">
            {todayItems.map(item => (
              <div key={item.label} className="p-3 rounded-xl border-l-4 border-[#dc2626] bg-[#dc262608]">
                <div className="font-semibold text-[#002060] text-xs">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-[#059669]" />
            <h3 className="font-bold text-[#059669] text-sm uppercase tracking-wide">With TAQA — Integrated Mix</h3>
          </div>
          <div className="space-y-2">
            {taqaItems.map(item => (
              <div key={item.label} className="p-3 rounded-xl border-l-4 border-[#059669] bg-[#05966908]">
                <div className="font-semibold text-[#002060] text-xs">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-[#002060] p-4">
        <p className="text-xs text-white/80 leading-relaxed text-center">
          The result: a lower and more predictable cost per kilometre, fewer suppliers, controlled fuel spend and a steadily stronger ESG story — from one partner, financed and staged at your pace.
        </p>
      </div>
    </div>
  );
}

// ─── Slide 25: Closing ────────────────────────────────────────────────────────

function ClosingSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.ev} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0369a1] mb-1">Fleet & Mobility · Closing</p>
        <h2 className="text-3xl font-bold text-[#002060]">From Pump to Plug: Your Fleet's Energy Partner</h2>
        <p className="text-gray-500 text-sm mt-1">One partner for every kilometre — today's diesel to tomorrow's electric.</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-gradient-to-br from-[#001020] to-[#0369a1] p-6 text-white flex flex-col justify-between">
          <div>
            <div className="w-10 h-1 bg-[#FFC10E] rounded-full mb-4" />
            <p className="text-sm text-white/90 leading-relaxed">
              From pump to plug, TAQA fuels every kilometre your fleet will ever drive. Egypt's largest private energy developer is the single partner that can move your fleet from diesel today to electric tomorrow — fuel, CNG, conversion, charging and the Waqood platform that ties them together, financed and measured at every step.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/40">A World OF ENERGY · TAQA Arabia</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Fuel Stations",       stat: "230+ stations under management",                              color: "#b45309", icon: <Truck className="w-4 h-4" /> },
            { label: "Natural Gas (CNG)",   stat: "86 CNG stations operating",                                   color: "#059669", icon: <Flame className="w-4 h-4" /> },
            { label: "EV Charging",         stat: "1st EV-charging licence in Egypt · 130+ EV charge points live", color: "#7c3aed", icon: <Zap className="w-4 h-4" /> },
            { label: "Waqood",              stat: "One dashboard for every energy type",                         color: "#0369a1", icon: <BarChart2 className="w-4 h-4" /> },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: s.color + "30", background: s.color + "08" }}>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: s.color }}>{s.icon}</div>
              <div>
                <div className="font-bold text-[#002060] text-sm">{s.label}</div>
                <div className="text-xs text-gray-500">{s.stat}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
        gains={[
          { label: "Depot & On-Site Fueling",      desc: "Bulk and on-site delivery keep heavy fleets fueled at base — no detours, no queueing." },
          { label: "Spec-Compliant Supply",         desc: "Quality-assured fuel from owned terminals protects engines, warranties and resale value." },
          { label: "Predictable Fuel Spend",        desc: "Consolidated billing and consumption reporting turn fuel from a blind cost into a managed, forecastable line." },
          { label: "A Single Point of Contact",     desc: "One TAQA account team handles fuel, delivery and logistics — no juggling multiple suppliers." },
        ]}
        edge={[
          { label: "Assured Fuel Quality",          desc: "Two owned terminals and a controlled logistics chain — traceable, spec-compliant fuel." },
          { label: "Nationwide Fueling Reach",      desc: "230+ stations (TAQA + Wataniya/Quick Fuel) covering Egypt's major corridors." },
          { label: "Fleet Card & Cashless",         desc: "Per-driver and per-vehicle fuel cards eliminate cash and paper receipts." },
          { label: "Depot Fuelling Option",         desc: "On-site tanks and bowsers keep heavy fleets fueled without leaving the base." },
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
        phases={[
          { range: "Day 0–7",   label: "Account Setup",    desc: "Fleet profiling, fuel account & credit terms." },
          { range: "Day 7–14",  label: "Network Activation", desc: "Station access & depot survey." },
          { range: "Day 14–30", label: "Depot Fuelling",   desc: "On-site tank/bowser install where needed." },
          { range: "Day 30+",   label: "Live Fuelling",    desc: "Cashless refuelling across the network." },
          { range: "Monthly",   label: "Reporting",        desc: "Consolidated billing & consumption analytics." },
          { range: "Ongoing",   label: "Optimisation",     desc: "Route, supply & spend reviews." },
        ]}
        groups={[
          { label: "SET UP",  range: "Day 0–14",  color: "#b45309" },
          { label: "DEPLOY",  range: "Day 14–30", color: "#92400e" },
          { label: "MANAGE",  range: "Ongoing",   color: "#78350f" },
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
        gains={[
          { label: "~40% Lower Fuel Cost",       desc: "CNG is structurally cheaper than petrol and diesel — the single fastest lever on operating cost." },
          { label: "Bi-Fuel & Fully Certified",  desc: "Bi-fuel keeps petrol as a fallback; conversions, cylinders and stations are licensed and periodically re-tested." },
          { label: "Fastest Payback",            desc: "Conversion cost is typically recovered within months from fuel savings — then it is pure margin." },
          { label: "Cleaner, Quieter Engines",   desc: "Natural gas cuts particulates, NOx and engine noise — better for cities, drivers and ESG." },
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
        phases={[
          { range: "Day 0–10",  label: "Assessment",      desc: "Suitable vehicles, routes & payback." },
          { range: "Day 10–20", label: "Conversion Plan", desc: "Dedicated vs. bi-fuel; fuelling via network, Master Gas or NGV station." },
          { range: "Day 20–45", label: "Conversion",      desc: "Licensed conversion or NGV station build." },
          { range: "Day 45–55", label: "Inspection",      desc: "Certification & safety sign-off." },
          { range: "Day 55–65", label: "Go-Live",         desc: "CNG fuelling across the fleet." },
          { range: "Ongoing",   label: "Re-test & O&M",  desc: "SCADA dispatch & cylinder re-testing." },
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
        gains={[
          { label: "Lowest Energy Cost/Km",   desc: "Electricity per kilometer undercuts both diesel and petrol — the end-state of the cost curve." },
          { label: "Future-Proofed Fleet",     desc: "Charging positions the fleet ahead of regulation, fuel bans and customer demand." },
          { label: "Zero Tailpipe Emissions",  desc: "A genuinely zero-emission fleet — the strongest possible ESG and city-access position." },
          { label: "Managed Uptime & App",     desc: "Lifecycle O&M, an operator/user app and a 24/7 hotline keep every charger available and billing." },
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
        phases={[
          { range: "Day 0–14",   label: "Site Assessment",    desc: "Grid survey, duty-cycle & site mix." },
          { range: "Day 14–30",  label: "Commercial Model",   desc: "Full-investment/profit-share structuring." },
          { range: "Day 30–60",  label: "Supply",             desc: "AC/DC charger & grid-equipment procurement." },
          { range: "Day 60–95",  label: "Installation",       desc: "Install across depot, en-route; grid tie-in." },
          { range: "Day 95–110", label: "Activation",         desc: "App onboarding, testing & go-live." },
          { range: "Day 110+",   label: "O&M & Uptime",       desc: "24/7 monitoring, maintenance & billing." },
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
        headline="Pioneering Egypt's EV-charging rollout from the front."
        subheadline="Egypt's first private EV-charging licence holder."
        body="TAQA Power secured Egypt's first private EV-charging licence and is rolling out AC and DC charging across depot, commercial and highway locations, supported by an operator/user app and a 24/7 hotline. As Egypt's largest private power player, TAQA pairs charging with on-site solar and distribution — a complete green-mobility package."
        stats={[
          { value: "1st",  label: "Private EV-charging licence in Egypt" },
          { value: "130+", label: "EV charge points live" },
          { value: "AC+DC", label: "Fast chargers" },
          { value: "24/7", label: "App & hotline support" },
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
        gains={[
          { label: "One Dashboard",          desc: "Litres, m³ of gas and kWh charged appear in a single dashboard — true total-energy visibility." },
          { label: "Fraud Designed Out",     desc: "Per-driver PINs, daily limits and pump-reading capture make unauthorized or phantom fuelling almost impossible." },
          { label: "Decisions From Data",    desc: "Live consumption and behavior analytics show exactly where cost and waste sit across the fleet." },
          { label: "Higher Asset Utilisation", desc: "Consumption and behavior data surface idle, thirsty and inefficient vehicles to fix." },
        ]}
        edge={[
          { label: "Waqood by EnerTech",             desc: "Waqood is TAQA Arabia's own energy-technology company — the platform is owned, not rented." },
          { label: "TAQA Arabia Diverse Network",    desc: "Utilize TAQA Arabia's network of CNG, fuel and EV stations scattered across Egypt." },
          { label: "One Platform for All Energy Types", desc: "Supports a client's transition from diesel today → CNG tomorrow → EV in the future under a single provider." },
          { label: "Premium Customer Support",       desc: "Dedicated account management and a single communication channel for fast issue resolution." },
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
        @keyframes fm-slide-right { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fm-slide-left  { from { opacity:0; transform:translateX(-32px); } to { opacity:1; transform:translateX(0); } }
        .fm-fwd { animation: fm-slide-right 0.32s cubic-bezier(0.16,1,0.3,1) both; }
        .fm-bwd { animation: fm-slide-left  0.32s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div className="min-h-screen bg-[#0d1117] flex flex-col">
        {/* Progress bar */}
        <div className="h-0.5 bg-white/10 shrink-0">
          <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, background: section.color }} />
        </div>

        {/* Header */}
        <header className="bg-[#161b22] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="secondary" size="sm" className="gap-1.5 shrink-0"><HomeIcon className="h-4 w-4" />Home</Button></Link>
            <div className="border-l border-white/20 pl-3 hidden sm:block">
              <p className="text-white text-sm font-bold">Fleet &amp; Mobility Clients</p>
              <p className="text-white/40 text-[10px]">TAQA Arabia · Integrated Energy &amp; Mobility Solutions · Jun 2026</p>
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
                  className={`px-3 py-2 text-xs font-medium whitespace-nowrap rounded-lg transition-colors ${isActive ? "text-white font-semibold" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}
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
            <div key={animKey} className={direction === "fwd" ? "fm-fwd h-full" : "fm-bwd h-full"}>
              {SLIDES[current].render()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={() => go(current - 1)} disabled={current === 0} className="gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent">
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
                    className={`rounded-full transition-all shrink-0 ${isActive ? "w-5 h-3" : "w-2.5 h-2.5 opacity-30 hover:opacity-60"}`}
                    style={{ background: sec.color }}
                    title={SLIDES[i].title}
                  />
                );
              })}
            </div>

            <Button variant="outline" onClick={() => go(current + 1)} disabled={current === total - 1} className="gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent">
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
