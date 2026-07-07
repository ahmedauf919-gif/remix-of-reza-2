import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Home as HomeIcon,
  Flame, Zap, Droplets, Truck, Battery, Car, Sun,
  Globe, CheckCircle2, ArrowRight, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import taqaLogo from "@/assets/taqa-logo.png";

// ─── Photos ───────────────────────────────────────────────────────────────────

const P: Record<string, string> = {
  cover:       "https://images.unsplash.com/photo-1486406691009-3fd3f000ea5a?auto=format&fit=crop&w=1600&q=80",
  buildings:   "https://images.unsplash.com/photo-1524492000408-81a939da285a?auto=format&fit=crop&w=1400&q=80",
  cng:         "https://images.unsplash.com/photo-1568605135229-43af0a9bc4e8?auto=format&fit=crop&w=1400&q=80",
  electricity: "https://images.unsplash.com/photo-1548529293-0fbaae5b1b36?auto=format&fit=crop&w=1400&q=80",
  water:       "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=80",
  pipeline:    "https://images.unsplash.com/photo-1498354136128-58f790194fa7?auto=format&fit=crop&w=1400&q=80",
  generator:   "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?auto=format&fit=crop&w=1400&q=80",
  ev:          "https://images.unsplash.com/photo-1593941799082-4fc77a3c4fc3?auto=format&fit=crop&w=1400&q=80",
  solar:       "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80",
  resort:      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
  city:        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80",
};

// ─── PhotoBanner ──────────────────────────────────────────────────────────────

function PhotoBanner({ src, height = 140 }: { src: string; height?: number }) {
  return (
    <div className="relative overflow-hidden -mx-10 -mt-10 mb-5 shrink-0" style={{ height }}>
      <img
        src={src} alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(255,255,255,1) 90%)" }} />
    </div>
  );
}

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
  return (
    <div className="flex flex-col h-full justify-between relative overflow-hidden" style={{ background: "#0d0020" }}>
      <img src={P.cover} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.35, mixBlendMode: "luminosity" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d0020ee 0%, #1a004acc 40%, #2d006080 70%, #7c3aed22 100%)" }} />
      <div className="flex items-center p-8 relative z-10">
        <img src={taqaLogo} alt="TAQA Arabia" className="h-12 object-contain bg-white/90 rounded px-3 py-1" />
      </div>
      <div className="px-12 pb-4 relative z-10">
        <div className="w-16 h-1 bg-[#FFC10E] rounded-full mb-6" />
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
          Residential<br />
          <span style={{ color: "#FFC10E" }}>Customers</span>
        </h1>
        <p className="text-white/70 text-xl mb-2">Integrated Energy &amp; Utility Solutions · Jan 2026</p>
      </div>
      <div className="px-12 py-8 border-t border-white/10 relative z-10">
        <p className="text-white/30 text-xs">TAQA Arabia · Confidential</p>
      </div>
    </div>
  );
}

// ─── Intro Slides ─────────────────────────────────────────────────────────────

function AboutSlide() {
  const divs: { label: string; icon: React.ReactNode; desc: string }[] = [
    { label: "Gas",       icon: <Flame className="w-4 h-4" />,    desc: "Distribution, EPC & virtual pipeline" },
    { label: "Power",     icon: <Zap className="w-4 h-4" />,      desc: "MV/LV distribution, generation & solar" },
    { label: "Petroleum", icon: <Truck className="w-4 h-4" />,    desc: "Mobile CNG & fuel retail" },
    { label: "Water",     icon: <Droplets className="w-4 h-4" />, desc: "Desalination & treatment" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.buildings} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">TAQA Arabia · Who We Are</p>
        <h2 className="text-2xl font-bold text-[#002060] leading-tight">
          Egypt's leading integrated energy infrastructure developer — a true one-stop-shop for residential utilities
        </h2>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p>Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility developer.</p>
          <p>Across four divisions — Gas, Power, Petroleum and Water — TAQA finances, builds, owns and operates the utility backbone of residential communities, industrial zones and touristic destinations.</p>
          <p>For a residential developer, that means <strong>one accredited partner</strong> can deliver gas, electricity, water, back-up power and EV charging — under a single SLA, with one point of contact.</p>
        </div>
        <div className="space-y-3">
          {divs.map(d => (
            <div key={d.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f3ff] border border-[#7c3aed]/10">
              <div className="h-9 w-9 rounded-lg bg-[#7c3aed] flex items-center justify-center text-white shrink-0">{d.icon}</div>
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

function RegionalSlide() {
  const metrics = [
    { value: "8",      label: "Countries",          sub: "Egypt, GCC, Africa & Greece" },
    { value: "4",      label: "Operating divisions", sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates",       sub: "Across Egypt" },
    { value: "3,400+", label: "Employees",          sub: "Across all divisions" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.city} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">TAQA Arabia · Regional Presence</p>
        <h2 className="text-2xl font-bold text-[#002060]">A growing platform across Egypt, the GCC, Africa and Greece</h2>
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
        <div className="rounded-xl bg-[#f5f3ff] p-5 border border-[#7c3aed]/10">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-[#7c3aed]" />
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
          <p className="text-xs text-white/70 leading-relaxed mb-2">Concessions across Egypt with 15-year renewals. TAQA serves the full spectrum:</p>
          {["Residential communities & compounds", "Industrial zones & factories", "Touristic destinations & resorts", "Commercial & mixed-use developments"].map(i => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/80 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC10E] shrink-0" />{i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NumbersSlide() {
  const divCards: { div: string; icon: React.ReactNode; stats: string[]; color: string }[] = [
    { div: "GAS",          icon: <Flame className="w-4 h-4" />,    stats: ["+10,000 km", "8 governorates 15yr"],   color: "#E68A00" },
    { div: "POWER",        icon: <Zap className="w-4 h-4" />,      stats: ["+1,600 MVA", "+150 MW"],               color: "#d97706" },
    { div: "WATER",        icon: <Droplets className="w-4 h-4" />, stats: ["+47,000 m³/day", "15 locations"],      color: "#0095C8" },
    { div: "MOBILITY&CNG", icon: <Truck className="w-4 h-4" />,    stats: ["86 CNG stations", "1st EV licence"],   color: "#7c3aed" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.solar} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">TAQA Arabia · In Numbers</p>
        <h2 className="text-2xl font-bold text-[#002060]">The scale behind a single residential utility partner — FY 2025</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { value: "EGP 13.4bn", label: "Revenue",                   sub: "FY 2025" },
          { value: "EGP 1.5bn",  label: "EBITDA",                    sub: "FY 2025" },
          { value: "~6.5M",      label: "Residential gas customers", sub: "Active connections" },
        ].map(m => (
          <div key={m.label} className="rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#7c3aed] p-5 text-white text-center">
            <div className="text-xl font-bold text-[#FFC10E]">{m.value}</div>
            <div className="text-xs font-semibold mt-1">{m.label}</div>
            <div className="text-[10px] text-white/50 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {divCards.map(d => (
          <div key={d.div} className="rounded-xl bg-[#f5f3ff] p-4 border border-[#7c3aed]/10">
            <div className="flex items-center gap-2 mb-2">
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

function SolutionsOverviewSlide() {
  const solutions: { num: string; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { num: "01", label: "Mobile CNG",              desc: "Off-grid natural gas delivered via mobile virtual pipeline — zero infrastructure capex.",      icon: <Truck className="w-5 h-5" />,    color: "#E68A00" },
    { num: "02", label: "Electricity Distribution", desc: "Turnkey MV/LV networks, smart metering and licensed lifetime O&M.",                          icon: <Zap className="w-5 h-5" />,      color: "#d97706" },
    { num: "03", label: "Water Desalination",       desc: "Reverse-osmosis plants and digitalized, solar-powered water operations.",                     icon: <Droplets className="w-5 h-5" />, color: "#0095C8" },
    { num: "04", label: "Gas Distribution",         desc: "End-to-end gas network EPC — design, build, commission and operate.",                         icon: <Flame className="w-5 h-5" />,    color: "#009045" },
    { num: "05", label: "Diesel Rental",            desc: "Emergency & back-up power gensets on a flexible rental/OPEX model.",                          icon: <Battery className="w-5 h-5" />,  color: "#6B6B6B" },
    { num: "06", label: "EV Chargers",              desc: "AC, DC and golf-car charging with full-investment green-mobility services.",                   icon: <Car className="w-5 h-5" />,      color: "#7c3aed" },
    { num: "07", label: "Solar PV",                 desc: "Rooftop and common-area solar PV — cutting bills, with flexible ownership.",                   icon: <Sun className="w-5 h-5" />,      color: "#16a34a" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.buildings} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">Residential Customers · Solutions Overview</p>
        <h2 className="text-2xl font-bold text-[#002060]">Seven integrated solutions — one partner, one SLA</h2>
      </div>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {solutions.map(s => (
          <div key={s.num} className="rounded-xl border-2 p-4 flex flex-col gap-2" style={{ borderColor: s.color + "30", background: s.color + "06" }}>
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white" style={{ background: s.color }}>{s.icon}</div>
              <span className="text-3xl font-black opacity-10 text-[#002060]">{s.num}</span>
            </div>
            <div>
              <h3 className="font-bold text-[#002060] text-sm">{s.label}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} height={120} />
      <div className="mb-4 flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color }}>{num} · {solutionName}</p>
          <h2 className="text-xl font-bold text-[#002060]">Scope &amp; How It Works</h2>
          {tagline && <p className="text-xs font-medium mt-1 leading-relaxed" style={{ color }}>{tagline}</p>}
        </div>
      </div>
      <div className="flex-1 grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{ background: color + "0D", border: `1.5px solid ${color}25` }}>
          <h3 className="font-bold text-[10px] uppercase tracking-wider mb-2.5" style={{ color }}>TAQA Invests</h3>
          <ul className="space-y-2">
            {taqdInvests.map(item => (
              <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
                <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: color }} />{item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-[#f5f3ff] p-4">
          <h3 className="font-bold text-[10px] uppercase tracking-wider text-[#7c3aed] mb-2.5">How It Works</h3>
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: color }}>{i + 1}</div>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl bg-[#002060] p-4 text-white">
          <h3 className="font-bold text-[10px] uppercase tracking-wider text-[#FFC10E] mb-2.5">What You Receive</h3>
          <ul className="space-y-2">
            {whatYouReceive.map(item => (
              <li key={item} className="flex items-start gap-1.5 text-xs text-white/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC10E] shrink-0 mt-0.5" />{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
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
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} height={120} />
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color }}>{num} · {solutionName}</p>
          <h2 className="text-xl font-bold text-[#002060]">Value Proposition</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl p-5" style={{ background: color + "08", border: `1.5px solid ${color}20` }}>
          <h3 className="font-bold text-[10px] uppercase tracking-wider mb-3" style={{ color }}>What You Gain</h3>
          <div className="space-y-3">
            {whatYouGain.map(v => (
              <div key={v.label} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                <div>
                  <div className="font-semibold text-[#002060] text-sm">{v.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-[#002060] p-5 text-white">
          <h3 className="font-bold text-[10px] uppercase tracking-wider text-[#FFC10E] mb-3">TAQA Arabia Edge</h3>
          <div className="space-y-3">
            {taqaEdge.map(v => (
              <div key={v.label} className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#FFC10E] shrink-0 mt-1.5" />
                <div>
                  <div className="font-semibold text-white text-sm">{v.label}</div>
                  <div className="text-xs text-white/60 mt-0.5 leading-relaxed">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} height={120} />
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color }}>{num} · {solutionName}</p>
          <h2 className="text-xl font-bold text-[#002060]">Implementation Timeline</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="relative pl-5 border-l-2" style={{ borderColor: color + "40" }}>
            {phases.map((phase, i) => (
              <div key={i} className="relative mb-4 last:mb-0">
                <div className="absolute -left-[22px] top-1 w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: color }} />
                <div className="text-[10px] font-medium text-gray-400 mb-0.5">{phase.days}</div>
                <div className="font-semibold text-[#002060] text-sm leading-snug">{phase.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Delivery Groups</p>
          {groups.map((g, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: color + "0D", border: `1.5px solid ${color}22` }}>
              <div className="text-[10px] text-gray-500 mb-1 font-medium">{g.range}</div>
              <div className="font-bold text-[#002060] text-sm">{g.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} height={120} />
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color }}>{num} · {solutionName}</p>
          <h2 className="text-xl font-bold text-[#002060]">Proven Track Record</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: color + "08", border: `1.5px solid ${color}20` }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 shrink-0" style={{ color }} />
            <h3 className="font-bold text-[#002060] text-sm leading-snug">{subheadline}</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 content-start">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl text-center p-4" style={{ background: color }}>
              <div className="text-lg font-black text-white leading-tight">{s.value}</div>
              <div className="text-[10px] text-white/75 mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Closing Slides ───────────────────────────────────────────────────────────

function WhyOnePartnerSlide() {
  const solutions = ["Mobile CNG", "Electricity", "Water", "Gas", "Diesel Back-up", "EV Charging", "Solar PV"];
  const pillars = [
    { label: "One SLA",                    desc: "A single service-level agreement governs gas, power, water, back-up and EV — one uptime guarantee, one penalty regime, one renewal." },
    { label: "One Communication Point",    desc: "A single account team and 24/7 hotline for every utility." },
    { label: "One Commercial Relationship",desc: "Consolidated billing, aligned contract terms and a single negotiation instead of six separate cycles." },
    { label: "One Engineering Standard",   desc: "Utilities designed to interoperate from day one — shared trenches, shared metering, shared monitoring." },
    { label: "One Accountable Owner",      desc: "End-to-end responsibility removes interface risk and finger-pointing." },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.buildings} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">Why One Partner</p>
        <h2 className="text-2xl font-bold text-[#002060]">Why One Partner: The TAQA One-Stop-Shop</h2>
        <p className="text-gray-500 text-sm mt-1">One SLA, one communication point, one accountable operator — across every utility in the community</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl bg-[#002060] p-5 text-white">
          <h3 className="font-bold text-[#FFC10E] text-sm mb-3">Solutions Under One SLA</h3>
          <div className="grid grid-cols-2 gap-2">
            {solutions.map(s => (
              <div key={s} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-[#FFC10E] shrink-0" />
                <span className="text-white text-xs font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {pillars.map(p => (
            <div key={p.label} className="flex items-start gap-3 p-3 rounded-xl bg-[#f5f3ff] border border-[#7c3aed]/10">
              <ArrowRight className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
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

function BundleSlide() {
  const bundles = [
    { combo: "Solar + Desalination",        desc: "On-site solar PV powers the RO plant — the greenest, lowest-cost water in the community.",            color: "#0095C8" },
    { combo: "Solar + EV Charging",          desc: "Pair rooftop solar with EV chargers — charge with clean energy, strengthen the ESG story.",            color: "#7c3aed" },
    { combo: "Gas + Mobile CNG",             desc: "Mobile CNG bridges supply until the permanent gas network goes live — no community waits.",             color: "#E68A00" },
    { combo: "Diesel Back-up + Electricity", desc: "One provider supplies both the distribution network and emergency backup — single O&M.",                color: "#6B6B6B" },
    { combo: "EV + Distribution",            desc: "Power distribution designed for EV loads from day one — no future re-build.",                          color: "#d97706" },
    { combo: "Shared O&M & Monitoring",      desc: "One control room and field team monitor every utility — pooled spares, pooled response.",               color: "#009045" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.city} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">The Power of the Bundle</p>
        <h2 className="text-2xl font-bold text-[#002060]">The Power of the Bundle: Cross-Solution Benefits</h2>
        <p className="text-gray-500 text-sm mt-1">How combining the solutions under one SLA creates value no single vendor can match</p>
      </div>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {bundles.map(b => (
          <div key={b.combo} className="rounded-xl p-4 border-l-4" style={{ borderColor: b.color, background: b.color + "08" }}>
            <h3 className="font-bold text-[#002060] text-sm mb-2">{b.combo}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-xl bg-[#002060]">
        <p className="text-xs text-white/70 text-center">
          <span className="text-[#FFC10E] font-semibold">Sold as one SLA: </span>
          lower combined energy cost · shared infrastructure · one billing platform · stronger ESG story · single accountable operator
        </p>
      </div>
    </div>
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
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.resort} height={160} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-1">Success Story</p>
        <h2 className="text-2xl font-bold text-[#002060]">Success Story: Soma Bay</h2>
        <p className="text-gray-500 text-sm mt-1">Egypt's most celebrated eco-resort — powered by the TAQA one-stop-shop</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-[#7c3aed]/10 to-[#0095C8]/10 p-5 border border-[#7c3aed]/20 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#7c3aed]" />
            <h3 className="font-bold text-[#002060] text-base">Egypt's most celebrated eco-resort — powered by the TAQA one-stop-shop</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            At Soma Bay on the Red Sea, TAQA Arabia delivers the full integrated utility stack: Egypt's first eco solar-powered desalination plant, an MV/LV distribution network, and EV charging — all under one SLA.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            The result: a landmark resort that runs on renewable energy, serves 50,000+ people with guaranteed-quality water, and sets the benchmark for sustainable touristic development in Egypt.
          </p>
          <div className="mt-auto p-3 rounded-lg bg-[#7c3aed] text-white text-xs font-medium text-center">
            Contact TAQA Arabia to explore the integrated residential utility model for your development.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 content-start">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl text-center p-4 bg-[#002060]">
              <div className="text-base font-black text-[#FFC10E] leading-tight">{s.value}</div>
              <div className="text-[10px] text-white/70 mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
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
        @keyframes rcn-slide-right { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
        @keyframes rcn-slide-left  { from { opacity:0; transform:translateX(-32px); } to { opacity:1; transform:translateX(0); } }
        .rcn-fwd { animation: rcn-slide-right 0.32s cubic-bezier(0.16,1,0.3,1) both; }
        .rcn-bwd { animation: rcn-slide-left  0.32s cubic-bezier(0.16,1,0.3,1) both; }
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
              <p className="text-white text-sm font-bold">Residential Customers</p>
              <p className="text-white/40 text-[10px]">TAQA Arabia · Integrated Energy &amp; Utility Solutions · Jan 2026</p>
            </div>
          </div>
          <span className="text-white/30 text-xs hidden md:flex items-center gap-2">
            <span className="font-medium" style={{ color: section.color }}>{section.label}</span>
            <span>·</span>
            {current + 1} / {total}
          </span>
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
            <div key={animKey} className={direction === "fwd" ? "rcn-fwd h-full" : "rcn-bwd h-full"}>
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
