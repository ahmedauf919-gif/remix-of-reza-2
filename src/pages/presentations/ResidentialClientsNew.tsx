import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Home as HomeIcon, Download,
  Flame, Zap, Droplets, Truck, Battery, Car, Globe, Users,
  CheckCircle2, ArrowRight, Star, Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import taqaLogo from "@/assets/taqa-logo.png";

const P: Record<string, string> = {
  cover:      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80",
  buildings:  "https://images.unsplash.com/photo-1486406691009-3fd3f000ea5a?auto=format&fit=crop&w=1400&q=80",
  city:       "https://images.unsplash.com/photo-1524492000408-81a939da285a?auto=format&fit=crop&w=1400&q=80",
  solar:      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80",
  energy:     "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80",
  cng:        "https://images.unsplash.com/photo-1568605135229-43af0a9bc4e8?auto=format&fit=crop&w=1400&q=80",
  homes:      "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=1400&q=80",
  truck:      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80",
  electricity:"https://images.unsplash.com/photo-1548529293-0fbaae5b1b36?auto=format&fit=crop&w=1400&q=80",
  smart:      "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1400&q=80",
  water:      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=80",
  ocean:      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  beach:      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80",
  pipeline:   "https://images.unsplash.com/photo-1498354136128-58f790194fa7?auto=format&fit=crop&w=1400&q=80",
  gas:        "https://images.unsplash.com/photo-1472492243-a3f56ef0a7af?auto=format&fit=crop&w=1400&q=80",
  generator:  "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?auto=format&fit=crop&w=1400&q=80",
  plant:      "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1400&q=80",
  ev:         "https://images.unsplash.com/photo-1593941799082-4fc77a3c4fc3?auto=format&fit=crop&w=1400&q=80",
  green:      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1400&q=80",
  meeting:    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
  integrated: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80",
  resort:     "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
  rooftop:    "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=1400&q=80",
};

function PhotoBanner({ src, height = 158 }: { src: string; height?: number }) {
  return (
    <div className="relative overflow-hidden -mx-10 -mt-10 mb-5 shrink-0" style={{ height }}>
      <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(255,255,255,1) 90%)" }} />
    </div>
  );
}

const SECTIONS = [
  { id: "intro",       label: "Introduction",          color: "#005298",  slides: [0,1,2,3] },
  { id: "overview",    label: "Solutions Overview",    color: "#7c3aed",  slides: [4] },
  { id: "cng",         label: "Mobile CNG",            color: "#E68A00",  slides: [5,6,7] },
  { id: "electricity", label: "Electricity",           color: "#FFC10E",  slides: [8,9,10] },
  { id: "water",       label: "Water",                 color: "#0095C8",  slides: [11,12,13] },
  { id: "gas",         label: "Gas Distribution",      color: "#009045",  slides: [14,15,16] },
  { id: "diesel",      label: "Diesel Rental",         color: "#6B6B6B",  slides: [17,18,19] },
  { id: "ev",          label: "EV Chargers",           color: "#7B35C2",  slides: [20,21,22] },
  { id: "solar",       label: "Solar PV",              color: "#d97706",  slides: [23,24,25] },
  { id: "closing",     label: "Closing",               color: "#002060",  slides: [26,27,28] },
];
function sectionOf(i: number) { return SECTIONS.find(s => s.slides.includes(i)) ?? SECTIONS[0]; }

function CoverSlide() {
  return (
    <div className="flex flex-col h-full justify-between relative overflow-hidden" style={{ background: "#1a0040" }}>
      <img src={P.cover} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.35, mixBlendMode: "luminosity" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a0040ee 0%, #3b0083cc 40%, #5b21b6aa 70%, #7c3aed 100%)" }} />
      <div className="flex items-center gap-3 p-8 relative z-10">
        <img src={taqaLogo} alt="TAQA Arabia" className="h-12 object-contain bg-white/90 rounded px-3 py-1" />
      </div>
      <div className="px-12 pb-4 relative z-10">
        <div className="w-16 h-1 bg-[#FFC10E] rounded-full mb-6" />
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">Residential<br /><span style={{ color: "#FFC10E" }}>Clients</span></h1>
        <p className="text-white/70 text-xl mb-2">Integrated Energy &amp; Utility Solutions</p>
        <p className="text-white/40 text-sm">January 2026</p>
      </div>
      <div className="px-12 py-8 border-t border-white/10 relative z-10"><p className="text-white/30 text-xs">TAQA Arabia · Confidential</p></div>
    </div>
  );
}

function AboutSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.buildings} />
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">TAQA Arabia · Who We Are</p>
        <h2 className="text-3xl font-bold text-[#002060]">Egypt's leading integrated energy infrastructure developer</h2>
        <p className="text-[#7c3aed] mt-1">A true one-stop-shop for residential utilities</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-[#002060] text-lg">A World of Energy, Delivered End-to-End</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility developer.</p>
          <p className="text-gray-600 text-sm leading-relaxed">Across four divisions — Gas, Power, Petroleum and Water — TAQA finances, builds, owns and operates the utility backbone of residential communities, industrial zones and touristic destinations.</p>
          <p className="text-gray-600 text-sm leading-relaxed">For a residential developer, that means <strong>one accredited partner</strong> can deliver gas, electricity, water, solar, back-up power and EV charging — under a single SLA.</p>
        </div>
        <div className="space-y-3">
          {[
            { label: "Gas", icon: <Flame className="w-4 h-4" />, desc: "Distribution, EPC & virtual pipeline" },
            { label: "Power", icon: <Zap className="w-4 h-4" />, desc: "MV/LV distribution, solar & generation" },
            { label: "Petroleum", icon: <Truck className="w-4 h-4" />, desc: "Mobile CNG, EV charging & fuel retail" },
            { label: "Water", icon: <Droplets className="w-4 h-4" />, desc: "Desalination & treatment" },
          ].map(d => (
            <div key={d.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#f0f4f8] border border-[#005298]/10">
              <div className="h-9 w-9 rounded-lg bg-[#7c3aed] flex items-center justify-center text-white">{d.icon}</div>
              <div><div className="font-semibold text-[#002060] text-sm">{d.label}</div><div className="text-xs text-gray-500">{d.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegionalSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.city} />
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">TAQA Arabia · In Numbers</p>
        <h2 className="text-3xl font-bold text-[#002060]">The scale behind a single residential utility partner</h2>
        <p className="text-[#7c3aed] text-sm">FY 2025</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { value: "EGP 13.4bn", label: "Revenue", sub: "FY 2025" },
          { value: "EGP 1.5bn", label: "EBITDA", sub: "FY 2025" },
          { value: "~6.5M", label: "Residential gas customers", sub: "Active connections" },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-5 text-white text-center" style={{ background: "linear-gradient(135deg, #002060, #005298)" }}>
            <div className="text-2xl font-bold text-[#FFC10E]">{m.value}</div>
            <div className="text-xs font-semibold mt-1">{m.label}</div>
            <div className="text-[10px] text-white/50 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { div: "GAS", icon: <Flame className="w-4 h-4" />, stats: ["+10,000 km network", "8 concessions (15-yr)", "66% private share", "~6.5M customers"], color: "#E68A00" },
          { div: "POWER", icon: <Zap className="w-4 h-4" />, stats: ["+1,600 MVA distribution", "+150 MW generation", "26 residential concessions", "+12,000 customers"], color: "#FFC10E" },
          { div: "WATER", icon: <Droplets className="w-4 h-4" />, stats: ["+47,000 m³/day", "15 locations", "50% less power vs peers", "Egypt's 1st eco solar RO"], color: "#0095C8" },
          { div: "MOBILITY", icon: <Truck className="w-4 h-4" />, stats: ["86 CNG stations", "1st EV-charging license", "4 governorates via CNG", "Solar + EV integration"], color: "#7c3aed" },
        ].map(d => (
          <div key={d.div} className="rounded-xl bg-[#f0f4f8] p-4 border border-[#005298]/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: d.color }}><span className="text-white">{d.icon}</span></div>
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

function NumbersSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.homes} />
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">TAQA Arabia · Regional Presence</p>
        <h2 className="text-3xl font-bold text-[#002060]">A growing platform across Egypt and beyond</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { value: "8", label: "Countries of presence", sub: "Egypt, GCC, Africa & Greece" },
          { value: "4", label: "Operating divisions", sub: "Gas · Power · Petroleum · Water" },
          { value: "20+", label: "Governorates in Egypt", sub: "Residential, industrial & touristic" },
          { value: "3,400+", label: "Employees", sub: "Across all divisions" },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-4 text-white text-center" style={{ background: "#002060" }}>
            <div className="text-3xl font-bold text-[#FFC10E]">{m.value}</div>
            <div className="text-xs font-semibold mt-1">{m.label}</div>
            <div className="text-[10px] text-white/50 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#f0f4f8] p-5 border border-[#005298]/10">
          <div className="flex items-center gap-2 mb-3"><Globe className="w-4 h-4 text-[#7c3aed]" /><h3 className="font-bold text-[#002060] text-sm">International Expansion</h3></div>
          <p className="text-xs text-gray-600 leading-relaxed"><strong>GCC</strong> — Water-desalination projects with sovereign partners.<br /><br /><strong>Africa</strong> — Gas and power opportunities across sub-Saharan markets.<br /><br /><strong>Greece</strong> — Expanding into European energy infrastructure.</p>
        </div>
        <div className="rounded-xl p-5 text-white" style={{ background: "#002060" }}>
          <h3 className="font-bold text-[#FFC10E] text-sm mb-3">Developer Clients Served</h3>
          <p className="text-xs text-white/70 leading-relaxed mb-2">TAQA serves Egypt's leading residential developers:</p>
          {["Emaar · Ora · City Edge", "Marakez · LMD · Coldwell", "New Cairo & October clusters", "Red Sea & North Coast resorts", "New administrative capital concessions"].map(i => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/80 mb-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#FFC10E] shrink-0" />{i}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SolutionsOverviewSlide() {
  const solutions = [
    { num: "01", label: "Mobile CNG", desc: "Off-grid gas before the pipeline arrives — zero capex, bridge-to-grid security.", icon: <Truck className="w-5 h-5" />, color: "#E68A00" },
    { num: "02", label: "Electricity Distribution", desc: "Licensed MV/LV networks, smart metering and lifetime O&M under one concession.", icon: <Zap className="w-5 h-5" />, color: "#FFC10E" },
    { num: "03", label: "Water Desalination", desc: "RO desalination with solar integration — freshwater security, no capex.", icon: <Droplets className="w-5 h-5" />, color: "#0095C8" },
    { num: "04", label: "Gas Distribution", desc: "End-to-end EPC for piped natural-gas networks across new communities.", icon: <Flame className="w-5 h-5" />, color: "#009045" },
    { num: "05", label: "Diesel Rental", desc: "Emergency and back-up power on a rental / OPEX model with 24/7 O&M.", icon: <Battery className="w-5 h-5" />, color: "#6B6B6B" },
    { num: "06", label: "EV Chargers", desc: "AC, DC and golf-cart chargers — full-investment option, resident app.", icon: <Car className="w-5 h-5" />, color: "#7B35C2" },
    { num: "07", label: "Solar PV", desc: "Rooftop and ground-mount solar for common areas, lower bills and ESG.", icon: <Sun className="w-5 h-5" />, color: "#d97706" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.energy} />
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">Residential Clients · Solutions Overview</p>
        <h2 className="text-3xl font-bold text-[#002060]">Seven integrated solutions for residential developments</h2>
        <p className="text-gray-500 text-sm mt-1">Each solution: Scope &amp; Value Proposition → Client Value &amp; Timeline → Proven Track Record</p>
      </div>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {solutions.map(s => (
          <div key={s.num} className="rounded-xl border-2 p-4 flex flex-col gap-2" style={{ borderColor: s.color + "30" }}>
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white" style={{ background: s.color }}>{s.icon}</div>
              <span className="text-2xl font-black opacity-10 text-[#002060]">{s.num}</span>
            </div>
            <div><h3 className="font-bold text-[#002060] text-sm">{s.label}</h3><p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ScopeProps { num: number; title: string; subtitle: string; color: string; icon: React.ReactNode; scopeTitle: string; scopeDesc: string; deliverables: string[]; photo: string; }
function ScopeSlide({ num, title, subtitle, color, icon, scopeTitle, scopeDesc, deliverables, photo }: ScopeProps) {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{num} · Scope &amp; Value Proposition</p>
          <h2 className="text-2xl font-bold text-[#002060]">{title}</h2>
          <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ background: color + "0D", border: `1.5px solid ${color}22` }}>
          <h3 className="font-bold text-[#002060] text-base mb-2">{scopeTitle}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{scopeDesc}</p>
        </div>
        <div className="rounded-xl bg-[#f0f4f8] p-6">
          <h3 className="font-bold text-[#002060] text-sm mb-3">What we deliver</h3>
          <ul className="space-y-2">{deliverables.map(d => (<li key={d} className="flex items-start gap-2 text-sm text-gray-600"><div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: color }} />{d}</li>))}</ul>
        </div>
      </div>
    </div>
  );
}

interface ValueProps { num: number; title: string; color: string; icon: React.ReactNode; values: { label: string; desc: string }[]; timeline: { phase: string; desc: string }[]; photo: string; }
function ValueSlide({ num, title, color, icon, values, timeline, photo }: ValueProps) {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{num} · Value to the Client &amp; Delivery Timeline</p>
          <h2 className="text-2xl font-bold text-[#002060]">{title}</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Value added to the client</p>
          <div className="space-y-3">
            {values.map(v => (
              <div key={v.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: color + "0D" }}>
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                <div><div className="font-semibold text-[#002060] text-sm">{v.label}</div><div className="text-xs text-gray-500 mt-0.5">{v.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Delivery timeline</p>
          <div className="relative pl-4 border-l-2" style={{ borderColor: color + "40" }}>
            {timeline.map((t, i) => (
              <div key={i} className="relative mb-4">
                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: color }} />
                <div className="font-semibold text-[#002060] text-xs">{t.phase}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TrackProps { num: number; title: string; color: string; icon: React.ReactNode; headline: string; subheadline: string; body: string; stats: { value: string; label: string }[]; photo: string; }
function TrackRecordSlide({ num, title, color, icon, headline, subheadline, body, stats, photo }: TrackProps) {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{num} · Proven Track Record</p>
          <h2 className="text-2xl font-bold text-[#002060]">{title}</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl p-6" style={{ background: color + "08", border: `1.5px solid ${color}20` }}>
          <div className="flex items-center gap-2 mb-2"><Star className="w-4 h-4" style={{ color }} /><h3 className="font-bold text-[#002060] text-base">{headline}</h3></div>
          <p className="text-[#005298] text-xs font-medium mb-3">{subheadline}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 content-start">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl text-center p-4" style={{ background: color, color: "#fff" }}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-[10px] text-white/70 mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhyOnePartnerSlide() {
  const solutions = ["Mobile CNG", "Electricity", "Water", "Gas", "Diesel Back-up", "EV Charging", "Solar PV"];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.meeting} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#002060] mb-1">Why One Partner</p>
        <h2 className="text-3xl font-bold text-[#002060]">The TAQA One-Stop-Shop</h2>
        <p className="text-gray-500 text-sm mt-1">One SLA, one communication point, one accountable operator — across every utility in the community</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-[#002060] p-6 text-white">
          <h3 className="font-bold text-[#FFC10E] mb-4 text-sm">TAQA Arabia — All Utilities</h3>
          <div className="grid grid-cols-2 gap-2">
            {solutions.map(s => (
              <div key={s} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-[#FFC10E] shrink-0" />
                <span className="text-white text-xs font-medium">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10"><p className="text-xs text-white/60">From Fragmented Vendors → A Single Operator</p></div>
        </div>
        <div className="space-y-3">
          {[
            { label: "One SLA", desc: "A single service-level agreement governs all seven utilities — one uptime guarantee, one penalty regime, one renewal." },
            { label: "One Communication Point", desc: "A single account team and 24/7 hotline for every utility — no chasing multiple contractors." },
            { label: "One Commercial Relationship", desc: "Consolidated billing, joint procurement and bundled pricing that no single-service provider can match." },
            { label: "One Track Record", desc: "TAQA has already integrated multiple solutions at Soma Bay and across Egypt's leading residential developments." },
          ].map(p => (
            <div key={p.label} className="flex items-start gap-3 p-3 rounded-xl bg-[#f0f4f8] border border-[#002060]/10">
              <ArrowRight className="w-4 h-4 text-[#005298] shrink-0 mt-0.5" />
              <div><div className="font-bold text-[#002060] text-sm">{p.label}</div><div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{p.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BundleSlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.integrated} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#002060] mb-1">The Power of the Bundle</p>
        <h2 className="text-3xl font-bold text-[#002060]">Cross-Solution Benefits</h2>
        <p className="text-gray-500 text-sm mt-1">How combining solutions under one SLA creates value no single vendor can match</p>
      </div>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { combo: "Solar + EV Charging", desc: "Community solar feeds EV chargers, lowering charging cost and maximising the green-mobility story.", color: "#d97706" },
          { combo: "Solar + Desalination", desc: "On-site solar powers the RO plant — Egypt's first eco green desalination model at Soma Bay.", color: "#0095C8" },
          { combo: "Gas + Mobile CNG", desc: "Mobile CNG bridges supply until the fixed pipeline arrives — same partner, continuous supply.", color: "#E68A00" },
          { combo: "Distribution + Smart Metering", desc: "One platform bills electricity and water together — shared infrastructure, single resident app.", color: "#FFC10E" },
          { combo: "Diesel + Solar PV", desc: "Hybrid diesel-solar eliminates night-time grid dependency and can charge batteries for 24/7 self-sufficiency.", color: "#009045" },
          { combo: "EV + Distribution", desc: "Charging infrastructure integrated into the MV/LV network from design — no retrofitting, no interface risk.", color: "#005298" },
        ].map(b => (
          <div key={b.combo} className="rounded-xl p-4 border-l-4" style={{ borderColor: b.color, background: b.color + "08" }}>
            <h3 className="font-bold text-[#002060] text-sm mb-2">{b.combo}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SomaBaySlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.resort} height={175} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#009045] mb-1">Success Story</p>
        <h2 className="text-3xl font-bold text-[#002060]">Soma Bay</h2>
        <p className="text-gray-500 text-sm mt-1">A single destination running on multiple TAQA solutions — the one-stop-shop, proven</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-gradient-to-br from-[#0095C8]/10 to-[#009045]/10 p-6 border border-[#0095C8]/20">
          <div className="flex items-center gap-2 mb-3"><Star className="w-5 h-5 text-[#0095C8]" /><h3 className="font-bold text-[#002060]">Egypt's first &amp; largest eco solar-powered desalination plant</h3></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">At Soma Bay on the Red Sea, TAQA Arabia integrated solar generation, power distribution and reverse-osmosis desalination into a single, renewable-powered utility system — using technology that consumes 50% less power than its peers.</p>
          <p className="text-sm text-gray-600 leading-relaxed">It is the clearest proof of the bundled, one-SLA model serving a residential and touristic destination.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["🏆 Sustainable Project of the Year", "🏆 Power & Water Project of the Year"].map(a => (
              <span key={a} className="text-[11px] bg-[#009045]/10 text-[#009045] rounded-full px-3 py-1 font-medium">{a}</span>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl bg-[#002060] p-5 text-white">
            <p className="text-xs text-white/50 mb-3">Solutions combined on one site</p>
            {[{ s: "Solar PV", c: "#FFC10E" }, { s: "Power Distribution", c: "#FFC10E" }, { s: "Water Desalination", c: "#0095C8" }].map(i => (
              <div key={i.s} className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full shrink-0" style={{ background: i.c }} /><span className="text-white text-sm font-medium">{i.s}</span></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{ value: "50,000+", label: "People served" }, { value: "8,560 t", label: "CO₂/yr saved" }, { value: "+47,000", label: "m³/day capacity" }, { value: "50%", label: "Less power vs peers" }].map(s => (
              <div key={s.label} className="rounded-xl bg-[#f0f4f8] p-3 text-center border border-[#0095C8]/10">
                <div className="text-xl font-black text-[#0095C8]">{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  { title: "Cover", render: () => <CoverSlide /> },
  { title: "Who We Are", render: () => <AboutSlide /> },
  { title: "In Numbers", render: () => <RegionalSlide /> },
  { title: "Regional Presence", render: () => <NumbersSlide /> },
  { title: "Solutions Overview", render: () => <SolutionsOverviewSlide /> },
  // Mobile CNG
  { title: "Mobile CNG: Scope", render: () => <ScopeSlide num={1} title="Mobile CNG" subtitle="Portable natural-gas supply — zero infrastructure capex" color="#E68A00" icon={<Truck className="w-5 h-5" />} scopeTitle="Mobile CNG Solution" scopeDesc="TAQA Arabia delivers portable CNG via MEGC trailers with an integrated PRU — connecting any compound or remote community to natural gas without waiting for a pipeline, at zero infrastructure capex." deliverables={["MEGC trailers (5,700 Nm³ at 250 bar) with optional onboard PRU", "Mother / Mobile / Daughter virtual-pipeline station chain", "Capacity-as-a-Service billing (monthly subscription)", "24/7 emergency dispatch and customer service hotline", "O&M, HSE and driver training", "Bridge-to-grid transition planning"]} photo={P.cng} /> },
  { title: "Mobile CNG: Value", render: () => <ValueSlide num={1} title="Mobile CNG: Value to the Client" color="#E68A00" icon={<Truck className="w-5 h-5" />} values={[{ label: "Immediate Liveability", desc: "Hot water, cooking gas and heating from day one — units become sellable before the pipeline arrives." }, { label: "Lower Resident Bills", desc: "Natural gas at ~13 EGP/m³ vs. ~20.5 EGP/L diesel — lower service charges for residents." }, { label: "Zero Developer Capex", desc: "TAQA finances, owns and operates the asset; the developer preserves capital for the core build." }, { label: "Bridge-to-Grid Security", desc: "A committed transition plan to piped gas when the fixed network arrives." }]} timeline={[{ phase: "Week 1–2: Site survey & agreement", desc: "TAQA assesses site access, consumption profile and connection points." }, { phase: "Week 3–4: Equipment installation", desc: "MEGC trailers and PRU delivered, installed, and safety-checked." }, { phase: "Month 2: Live supply", desc: "First gas delivered; resident usage tracked via smart metering." }, { phase: "Ongoing: O&M + grid transition", desc: "24/7 monitoring and coordinated handover when fixed pipeline arrives." }]} photo={P.homes} /> },
  { title: "Mobile CNG: Track Record", render: () => <TrackRecordSlide num={1} title="Mobile CNG: Proven Track Record" color="#E68A00" icon={<Truck className="w-5 h-5" />} headline="Virtual Pipeline — 4 Governorates" subheadline="First company in Egypt to supply natural gas through a mobile virtual pipeline" body="TAQA Arabia pioneered mobile CNG in Egypt, using 86 CNG stations to extend a virtual pipeline into four governorates with no fixed gas infrastructure. The same model now serves industrial, residential, touristic and agribusiness clients." stats={[{ value: "86", label: "CNG stations" }, { value: "4", label: "Governorates served" }, { value: "1st", label: "Virtual pipeline operator" }, { value: "24/7", label: "Emergency dispatch" }]} photo={P.truck} /> },
  // Electricity Distribution
  { title: "Electricity: Scope", render: () => <ScopeSlide num={2} title="Electricity Distribution" subtitle="Turnkey distribution networks for residential developments" color="#FFC10E" icon={<Zap className="w-5 h-5" />} scopeTitle="Turnkey Power Distribution" scopeDesc="TAQA Arabia is the largest private electricity distributor in Egypt. For residential developments it sources power, builds the substation and MV/LV network, installs smart metering, and operates the whole asset under a licensed long-term concession." deliverables={["Power sourcing, government relations & grid MV interconnection", "Substation development & engineering", "MV/LV network design, supply and installation", "Smart metering and AMI system", "Lifetime O&M under GOEIC license", "Profit-share revenue model for the developer"]} photo={P.electricity} /> },
  { title: "Electricity: Value", render: () => <ValueSlide num={2} title="Electricity Distribution: Value to the Client" color="#FFC10E" icon={<Zap className="w-5 h-5" />} values={[{ label: "Guaranteed Power Quality", desc: "Stable, metered, billable electricity to every unit from handover." }, { label: "A New Revenue Stream", desc: "The profit-share model turns the distribution network into recurring income." }, { label: "Single Accountable Operator", desc: "One licensed party owns sourcing, network, metering and O&M." }, { label: "Regulatory Peace of Mind", desc: "GOEIC-licensed operation; all permits and audits are TAQA's responsibility." }]} timeline={[{ phase: "Month 1–3: Design & permitting", desc: "Load study, SLD, grid connection approval and GOEIC licence preparation." }, { phase: "Month 4–10: Civil & electromechanical works", desc: "Substation construction, MV cable laying, LV network and metering." }, { phase: "Month 11–12: Commissioning", desc: "Testing, energisation and handover to TAQA O&M team." }, { phase: "Year 1+: Live O&M", desc: "24/7 monitoring, billing collection, preventive and corrective maintenance." }]} photo={P.smart} /> },
  { title: "Electricity: Track Record", render: () => <TrackRecordSlide num={2} title="Electricity Distribution: Proven Track Record" color="#FFC10E" icon={<Zap className="w-5 h-5" />} headline="Mixed-Use Compounds — 950 MVA" subheadline="Powering Egypt's leading residential and mixed-use developments" body="TAQA Power operates +1,600 MVA of distribution capacity, of which 950 MVA serves 26 mixed-use and residential concessions across 31 million m². Its NABQ (160 MVA) and 6th of October Developers (250 MVA) substations anchor a network serving Emaar, Ora, City Edge, Marakez and LMD." stats={[{ value: "+1,600", label: "MVA distribution capacity" }, { value: "950", label: "MVA in residential concessions" }, { value: "26", label: "Residential concessions" }, { value: "31M m²", label: "Development footprint" }]} photo={P.buildings} /> },
  // Water Desalination
  { title: "Water: Scope", render: () => <ScopeSlide num={3} title="Water Desalination" subtitle="Reliable freshwater for residential developments — turnkey RO" color="#0095C8" icon={<Droplets className="w-5 h-5" />} scopeTitle="Turnkey Desalination & Smart Water" scopeDesc="TAQA Arabia delivers guaranteed freshwater security for residential and coastal developments via reverse-osmosis desalination plants and fully digitalized water operations — using technology that consumes up to 50% less power than its peers." deliverables={["Reverse-osmosis (RO) desalination plant design & build", "Pre-treatment, post-treatment & brine management", "Energy-recovery systems (50% less power vs peers)", "SCADA-based smart water management", "Solar integration for green desalination", "Lifetime O&M and water-purchase agreement (per-m³ billing)"]} photo={P.water} /> },
  { title: "Water: Value", render: () => <ValueSlide num={3} title="Water Desalination: Value to the Client" color="#0095C8" icon={<Droplets className="w-5 h-5" />} values={[{ label: "Water Security on Day One", desc: "Coastal and desert developments get reliable potable water independent of public-network capacity." }, { label: "No Capex, Predictable OPEX", desc: "TAQA funds and owns the plant; the developer pays a transparent per-m³ rate." }, { label: "Green-Rating Enabler", desc: "Solar-powered RO supports LEED / green-community certification and ESG goals." }, { label: "Lifecycle Peace of Mind", desc: "TAQA owns membrane replacement, chemical costs and O&M." }]} timeline={[{ phase: "Month 1–2: Feasibility & design", desc: "Water demand analysis, RO sizing and solar integration plan." }, { phase: "Month 3–8: Plant construction", desc: "Civil works, equipment installation and SCADA system." }, { phase: "Month 9–10: Testing & commissioning", desc: "Water quality testing, flow rate validation and handover." }, { phase: "Year 1+: O&M", desc: "24/7 SCADA monitoring, membrane management and billing." }]} photo={P.ocean} /> },
  { title: "Water: Track Record", render: () => <TrackRecordSlide num={3} title="Water Desalination: Proven Track Record" color="#0095C8" icon={<Droplets className="w-5 h-5" />} headline="Soma Bay — Eco Solar Desalination" subheadline="Egypt's first & largest eco solar-powered desalination plant" body="On the Red Sea, TAQA Water built Egypt's first green desalination facility powered entirely by renewable energy, consuming 50% less power than peers. It serves 50,000+ people and cuts CO₂ by 8,560 tonnes per year — winning Sustainable Project of the Year and Power & Water Project of the Year." stats={[{ value: "+47,000", label: "m³/day capacity" }, { value: "15", label: "Operational locations" }, { value: "8,560 t", label: "CO₂/yr saved" }, { value: "50%", label: "Less power vs peers" }]} photo={P.beach} /> },
  // Gas Distribution
  { title: "Gas Distribution: Scope", render: () => <ScopeSlide num={4} title="Gas Distribution" subtitle="End-to-end EPC for natural-gas networks across residential communities" color="#009045" icon={<Flame className="w-5 h-5" />} scopeTitle="Turnkey Gas Network EPC" scopeDesc="As Egypt's largest private gas distributor, TAQA Arabia delivers full-scope Engineering, Procurement and Construction for natural-gas distribution networks — from feasibility and route planning through testing, commissioning and lifetime operation." deliverables={["Feasibility studies & network route planning", "Detailed engineering & design", "Procurement of pipes, valves, pressure regulators & meters", "Pipeline construction & civil works", "PRS station installation & commissioning", "EGAS-compliant handover & lifetime O&M"]} photo={P.pipeline} /> },
  { title: "Gas Distribution: Value", render: () => <ValueSlide num={4} title="Gas Distribution: Value to the Client" color="#009045" icon={<Flame className="w-5 h-5" />} values={[{ label: "Piped Gas to Every Home", desc: "Residents get safe, metered, always-on natural gas for cooking, heating and hot water." }, { label: "Higher Property Value", desc: "Connection to the national gas grid is a premium amenity that lifts unit sale and rental value." }, { label: "One EPC Partner", desc: "A single accountable party from feasibility to handover removes interface risk." }, { label: "Safe & Compliant", desc: "IGEM / EGAS-compliant design and construction with full documentation." }]} timeline={[{ phase: "Month 1–2: Feasibility & EGAS approval", desc: "Route survey, demand assessment and regulatory approvals." }, { phase: "Month 3–6: Procurement & civil works", desc: "Pipe procurement, trenching, laying and backfill." }, { phase: "Month 7–8: Testing & commissioning", desc: "Pressure testing, purging, metering and EGAS inspection." }, { phase: "Year 1+: O&M & expansion", desc: "Meter reading, leak detection, maintenance and new connections." }]} photo={P.homes} /> },
  { title: "Gas Distribution: Track Record", render: () => <TrackRecordSlide num={4} title="Gas Distribution: Proven Track Record" color="#009045" icon={<Flame className="w-5 h-5" />} headline="+10,000 km Network — 8 Governorates" subheadline="Egypt's largest private gas distributor, ~6.5 million residential customers" body="TAQA Gas operates 10,000+ km across 8 governorate concessions, renewed for 15 years since 2019. With ~6.5 million residential customers connected and a 66% share of private concessions, it has the EPC and operating track record to build any new residential community's gas backbone." stats={[{ value: "+10,000", label: "km of gas network" }, { value: "~6.5M", label: "Residential customers" }, { value: "66%", label: "Private concession share" }, { value: "8", label: "Governorate concessions" }]} photo={P.gas} /> },
  // Diesel Rental
  { title: "Diesel Rental: Scope", render: () => <ScopeSlide num={5} title="Diesel Rental" subtitle="Emergency & back-up power on a rental / OPEX model with 24/7 O&M" color="#6B6B6B" icon={<Battery className="w-5 h-5" />} scopeTitle="Turnkey Diesel Power Solutions" scopeDesc="TAQA Arabia supplies, installs, rents and operates diesel generator sets for emergency and back-up power across residential compounds — on a flexible rental model with full 24/7 operation and maintenance." deliverables={["Diesel generator supply, sizing & commissioning", "Synchronization, ATS & switchgear integration", "Acoustic enclosure & exhaust system", "Fuel supply & storage management", "24/7 remote monitoring & rapid response O&M", "Flexible capacity — scale up/down with occupancy"]} photo={P.generator} /> },
  { title: "Diesel Rental: Value", render: () => <ValueSlide num={5} title="Diesel Rental: Value to the Client" color="#6B6B6B" icon={<Battery className="w-5 h-5" />} values={[{ label: "Uninterrupted Living", desc: "Residents keep power to elevators, water pumps, security and common areas during grid failures." }, { label: "No Capital Lock-Up", desc: "Rental model means the developer avoids buying, owning and depreciating generator assets." }, { label: "Right-Sized & Relocatable", desc: "Capacity flexes with construction phases and occupancy, then redeploys where needed." }, { label: "Hands-Off Reliability", desc: "TAQA's 24/7 O&M and rapid response team mean the developer never worries about fuel or maintenance." }]} timeline={[{ phase: "Week 1: Site survey & sizing", desc: "Load assessment, generator sizing and ATS design." }, { phase: "Week 2–3: Delivery & installation", desc: "Generator delivery, civil foundation, cabling and ATS integration." }, { phase: "Week 4: Commissioning & training", desc: "Load testing, auto-start verification and staff briefing." }, { phase: "Ongoing: Monitoring & fuel management", desc: "24/7 SCADA, scheduled maintenance and automatic fuel replenishment." }]} photo={P.energy} /> },
  { title: "Diesel Rental: Track Record", render: () => <TrackRecordSlide num={5} title="Diesel Rental: Proven Track Record" color="#6B6B6B" icon={<Battery className="w-5 h-5" />} headline="Captive Power — 6 Plants" subheadline="Owning and operating captive generation across Egypt's toughest sites" body="TAQA Power owns and operates 6 captive power plants and +150 MW of contracted generation capacity — including flare-to-power and CHP systems. The same engineering, fuel-logistics and 24/7 O&M discipline underpins TAQA's diesel back-up rental offering for residential communities." stats={[{ value: "6", label: "Captive power plants" }, { value: "+150", label: "MW contracted generation" }, { value: "24/7", label: "O&M coverage" }, { value: "CHP", label: "Flare-to-power capability" }]} photo={P.plant} /> },
  // EV Chargers
  { title: "EV Chargers: Scope", render: () => <ScopeSlide num={6} title="EV Chargers" subtitle="Green-mobility charging — three charger lines, six end-to-end services" color="#7B35C2" icon={<Car className="w-5 h-5" />} scopeTitle="EV Charging Infrastructure" scopeDesc="TAQA Arabia holds Egypt's first EV-charging license and delivers complete green-mobility infrastructure for residential developments — engineering, supply, installation, operation and full investment — backed by a 24/7 hotline and mobile app." deliverables={["AC EV chargers — residential & commercial", "DC fast chargers — highways & community gateways", "Golf-cart chargers for touristic / resort developments", "Operator & user mobile app", "24/7 hotline and remote monitoring", "Full-investment model — zero capex for the developer"]} photo={P.ev} /> },
  { title: "EV Chargers: Value", render: () => <ValueSlide num={6} title="EV Chargers: Value to the Client" color="#7B35C2" icon={<Car className="w-5 h-5" />} values={[{ label: "Future-Proof Amenity", desc: "EV-ready parking differentiates and future-proofs the community for buyers." }, { label: "New Recurring Revenue", desc: "The profit-share model turns charging into an income stream for the developer." }, { label: "Zero Capex Entry", desc: "Full-investment option — no hardware or installation cost for the developer." }, { label: "Effortless Resident Experience", desc: "App-based charging, transparent billing and 24/7 support." }]} timeline={[{ phase: "Week 1–2: Capacity planning", desc: "Parking layout, charger sizing, solar integration assessment." }, { phase: "Week 3–4: Installation", desc: "Cable infrastructure, charger mounting, app configuration." }, { phase: "Month 2: Go-live", desc: "Resident onboarding, app launch and billing activation." }, { phase: "Ongoing: Monitoring & expansion", desc: "Usage analytics, charger maintenance and capacity additions." }]} photo={P.green} /> },
  { title: "EV Chargers: Track Record", render: () => <TrackRecordSlide num={6} title="EV Chargers: Proven Track Record" color="#7B35C2" icon={<Car className="w-5 h-5" />} headline="First EV License — Green Mobility" subheadline="Pioneering Egypt's EV-charging rollout from the front" body="TAQA Power secured the first private EV-charging license in Egypt and is rolling out AC and DC charging across residential, commercial and highway locations, supported by its own mobile app and 24/7 hotline. As Egypt's largest private power player, TAQA pairs charging with on-site solar and distribution." stats={[{ value: "1st", label: "Private EV-charging license" }, { value: "AC+DC", label: "Full charger range" }, { value: "24/7", label: "Hotline & monitoring" }, { value: "App", label: "Mobile app for residents" }]} photo={P.ev} /> },
  // Solar PV
  { title: "Solar PV: Scope", render: () => <ScopeSlide num={7} title="Solar PV" subtitle="Rooftop and ground-mount solar — lower bills, green ratings, ESG" color="#d97706" icon={<Sun className="w-5 h-5" />} scopeTitle="Community Solar PV Systems" scopeDesc="TAQA Power designs, builds and operates solar PV systems for residential communities — from rooftop arrays on common buildings to ground-mount installations powering community facilities. Every system is backed by an O&M contract and performance guarantee, with optional battery storage integration." deliverables={["Site feasibility study & solar resource assessment", "Rooftop and ground-mount system engineering", "Grid connection & net-metering configuration", "Community facility and common-area solar integration", "SCADA monitoring with yield and savings reporting", "Optional BESS integration for night-time supply"]} photo={P.solar} /> },
  { title: "Solar PV: Value", render: () => <ValueSlide num={7} title="Solar PV: Value to the Client" color="#d97706" icon={<Sun className="w-5 h-5" />} values={[{ label: "Lower Service Charges", desc: "Solar generation for common areas reduces electricity cost — lowering annual service charge for residents." }, { label: "Green Community Rating", desc: "On-site solar supports LEED, EDGE and green-community certifications that command premium sale prices." }, { label: "Developer Differentiation", desc: "Solar-powered amenities — pools, gyms, clubhouses — are a marketing differentiator in a competitive market." }, { label: "Export Revenue", desc: "Surplus generation can be exported or wheeled under net-metering — a new income stream for the community." }]} timeline={[{ phase: "Month 1: Assessment & design", desc: "Load profiling, irradiance analysis and system sizing." }, { phase: "Month 2–4: Installation", desc: "Mounting structure, panels, inverters and cabling." }, { phase: "Month 5: Grid connection", desc: "Authority approvals, metering and go-live." }, { phase: "Year 1+: O&M", desc: "Periodic cleaning, preventive maintenance and performance reporting." }]} photo={P.rooftop} /> },
  { title: "Solar PV: Track Record", render: () => <TrackRecordSlide num={7} title="Solar PV: Proven Track Record" color="#d97706" icon={<Sun className="w-5 h-5" />} headline="Soma Bay — Solar-Powered Green Desalination" subheadline="Egypt's first eco solar desalination — solar powering the whole water system" body="TAQA Water's Soma Bay project uses solar PV to power an entire RO desalination plant — the first of its kind in Egypt. As Egypt's largest private power player with +150 MW of contracted generation and a GOEIC operating license, TAQA brings the same solar expertise and O&M discipline to residential community solar installations." stats={[{ value: "+150", label: "MW contracted generation" }, { value: "GOEIC", label: "Licensed operator" }, { value: "Soma Bay", label: "Solar + desalination" }, { value: "24/7", label: "SCADA monitoring" }]} photo={P.solar} /> },
  // Closing
  { title: "Why One Partner", render: () => <WhyOnePartnerSlide /> },
  { title: "Cross-Solution Benefits", render: () => <BundleSlide /> },
  { title: "Success Story: Soma Bay", render: () => <SomaBaySlide /> },
];

export default function ResidentialClientsNew() {
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
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setDirection("fwd"); setAnimKey(k => k + 1); setCurrent(c => Math.min(total - 1, c + 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setDirection("bwd"); setAnimKey(k => k + 1); setCurrent(c => Math.max(0, c - 1)); }
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
        @keyframes rn-slide-right { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
        @keyframes rn-slide-left  { from { opacity:0; transform:translateX(-32px); } to { opacity:1; transform:translateX(0); } }
        .rn-fwd { animation: rn-slide-right 0.32s cubic-bezier(0.16,1,0.3,1) both; }
        .rn-bwd { animation: rn-slide-left  0.32s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>
      <div className="min-h-screen bg-[#0d1117] flex flex-col">
        <div className="h-0.5 bg-white/10 shrink-0">
          <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, background: section.color }} />
        </div>
        <header className="bg-[#161b22] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="secondary" size="sm" className="gap-1.5 shrink-0"><HomeIcon className="h-4 w-4" />Home</Button></Link>
            <div className="border-l border-white/20 pl-3 hidden sm:block">
              <p className="text-white text-sm font-bold">Residential Clients</p>
              <p className="text-white/40 text-[10px]">TAQA Arabia · Integrated Energy &amp; Utility Solutions · Jan 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-xs hidden md:flex items-center gap-2">
              <span className="font-medium" style={{ color: section.color }}>{section.label}</span>
              <span>·</span>{current + 1} / {total}
            </span>
          </div>
        </header>
        <div className="bg-[#161b22] border-b border-white/10 px-4 overflow-x-auto">
          <div className="flex gap-1 py-1">
            {SECTIONS.map(s => {
              const isActive = s.slides.some(i => i === current);
              return (
                <button key={s.id} onClick={() => go(s.slides[0])} className={`px-3 py-2 text-xs font-medium whitespace-nowrap rounded-lg transition-colors ${isActive ? "text-white font-semibold" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`} style={isActive ? { background: s.color } : undefined}>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 flex flex-col p-4 md:p-6 gap-4">
          <div className="flex-1 rounded-2xl shadow-2xl overflow-hidden border border-white/10 cursor-pointer" style={{ minHeight: "520px" }} onClick={handleSlideClick}>
            <div key={animKey} className={direction === "fwd" ? "rn-fwd h-full" : "rn-bwd h-full"}>
              {SLIDES[current].render()}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={() => go(current - 1)} disabled={current === 0} className="gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent"><ChevronLeft className="h-4 w-4" /> Previous</Button>
            <div className="flex items-center gap-1 overflow-x-auto max-w-[50vw] pb-1">
              {SLIDES.map((_, i) => { const sec = sectionOf(i); const isActive = i === current; return (<button key={i} onClick={() => go(i)} className={`rounded-full transition-all shrink-0 ${isActive ? "w-5 h-3" : "w-2.5 h-2.5 opacity-30 hover:opacity-60"}`} style={{ background: sec.color }} title={SLIDES[i].title} />); })}
            </div>
            <Button variant="outline" onClick={() => go(current + 1)} disabled={current === total - 1} className="gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent">Next <ChevronRight className="h-4 w-4" /></Button>
          </div>
          <div className="text-center">
            <span className="text-xs text-white/30"><span className="font-medium" style={{ color: section.color }}>{section.label}</span>{" · "}{SLIDES[current].title}{" · "}Slide {current + 1} of {total}</span>
          </div>
        </div>
      </div>
    </>
  );
}
