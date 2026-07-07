import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Home as HomeIcon,
  Flame, Zap, Truck, Droplets, Battery, Globe,
  CheckCircle2, ArrowRight, Star, Sun, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import taqaLogo from "@/assets/taqa-logo.png";

// ─── Photos ───────────────────────────────────────────────────────────────────

const P: Record<string, string> = {
  cover:    "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80",
  factory:  "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?auto=format&fit=crop&w=1400&q=80",
  cng:      "https://images.unsplash.com/photo-1568605135229-43af0a9bc4e8?auto=format&fit=crop&w=1400&q=80",
  electric: "https://images.unsplash.com/photo-1548529293-0fbaae5b1b36?auto=format&fit=crop&w=1400&q=80",
  pipeline: "https://images.unsplash.com/photo-1498354136128-58f790194fa7?auto=format&fit=crop&w=1400&q=80",
  chp:      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80",
  solar:    "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80",
  battery:  "https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=1400&q=80",
};

// ─── PhotoBanner ─────────────────────────────────────────────────────────────

function PhotoBanner({ src, height = 158 }: { src: string; height?: number }) {
  return (
    <div className="relative overflow-hidden -mx-10 -mt-10 mb-5 shrink-0" style={{ height }}>
      <img
        src={src} alt=""
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
  { id: "intro",       label: "Introduction",   color: "#c2410c", slides: [0, 1, 2, 3] },
  { id: "overview",    label: "Solutions",       color: "#c2410c", slides: [4] },
  { id: "cng",         label: "Mobile CNG",      color: "#c2410c", slides: [5, 6, 7, 8] },
  { id: "electricity", label: "Electricity",     color: "#1d4ed8", slides: [9, 10, 11, 12] },
  { id: "gas",         label: "Gas",             color: "#059669", slides: [13, 14, 15, 16] },
  { id: "chp",         label: "CHP",             color: "#b45309", slides: [17, 18, 19, 20] },
  { id: "solar",       label: "Solar",           color: "#ca8a04", slides: [21, 22, 23, 24] },
  { id: "bess",        label: "Energy Storage",  color: "#7c3aed", slides: [25, 26, 27, 28] },
  { id: "closing",     label: "Closing",         color: "#002060", slides: [29, 30, 31] },
];

function sectionOf(idx: number) {
  return SECTIONS.find(s => s.slides.includes(idx)) ?? SECTIONS[0];
}

// ─── Slide 0: Cover ───────────────────────────────────────────────────────────

function CoverSlide() {
  return (
    <div className="flex flex-col h-full justify-between relative overflow-hidden" style={{ background: "#1a0a00" }}>
      <img src={P.cover} alt="" className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.35, mixBlendMode: "luminosity" }} />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #1a0a00ee 0%, #3d1500cc 40%, #7a2c0088 70%, #c2410c44 100%)" }} />
      <div className="flex items-center gap-3 p-8 relative z-10">
        <img src={taqaLogo} alt="TAQA Arabia" className="h-12 object-contain bg-white/90 rounded px-3 py-1" />
      </div>
      <div className="px-12 pb-4 relative z-10">
        <div className="w-16 h-1 bg-[#FFC10E] rounded-full mb-6" />
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
          Industrial<br /><span style={{ color: "#FFC10E" }}>Clients</span>
        </h1>
        <p className="text-white/70 text-xl mb-2">Integrated Energy &amp; Utility Solutions · Jan 2026</p>
      </div>
      <div className="px-12 py-8 border-t border-white/10 relative z-10">
        <p className="text-white/30 text-xs">TAQA Arabia · Confidential</p>
      </div>
    </div>
  );
}

// ─── Slide 1: About ───────────────────────────────────────────────────────────

function AboutSlide() {
  const divisions = [
    { label: "Gas",       icon: <Flame className="w-4 h-4" />,    desc: "Distribution, EPC, NGV stations, Mobile CNG" },
    { label: "Power",     icon: <Zap className="w-4 h-4" />,      desc: "Generation & distribution +1,600 MVA, renewable, EV" },
    { label: "Petroleum", icon: <Truck className="w-4 h-4" />,    desc: "Oil-marketing, lubricants, bulk fuel" },
    { label: "Water",     icon: <Droplets className="w-4 h-4" />, desc: "RO desalination, filtration, smart solar ops" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.factory} />
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c2410c] mb-1">TAQA Arabia · Who We Are</p>
        <h2 className="text-2xl font-bold text-[#002060] leading-snug">
          Egypt's leading integrated energy infrastructure developer — a true one-stop-shop for industrial utilities
        </h2>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <p className="text-gray-600 text-sm leading-relaxed">
            Founded in 2006 and listed on the EGX since 2023, TAQA Arabia is Egypt's largest private-sector energy and utility developer.
            Across four divisions — Gas, Power, Petroleum and Water — TAQA finances, builds, owns and operates the utility backbone
            of industrial zones and touristic destinations. For an industrial developer, that means one accredited partner with a proven
            delivery record can supply gas, power, water and steam under a single relationship.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Active member of the International Gas Union (IGU)", "Accredited by the IGEM"].map(b => (
              <span key={b} className="text-[11px] bg-[#c2410c]/10 text-[#c2410c] rounded-full px-3 py-1 font-medium">{b}</span>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {divisions.map(d => (
            <div key={d.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f0ee] border border-[#c2410c]/10">
              <div className="h-9 w-9 rounded-lg bg-[#c2410c] flex items-center justify-center text-[#FFC10E]">{d.icon}</div>
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
    { value: "8",      label: "Countries",          sub: "Egypt, GCC, Africa & Greece" },
    { value: "4",      label: "Operating divisions", sub: "Gas · Power · Petroleum · Water" },
    { value: "20+",    label: "Governorates",        sub: "Across Egypt" },
    { value: "3,400+", label: "Employees",           sub: "Across all divisions" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.factory} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c2410c] mb-1">TAQA Arabia · Regional Presence</p>
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
        <div className="rounded-xl bg-[#f5f0ee] p-5 border border-[#c2410c]/10">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-[#c2410c]" />
            <h3 className="font-bold text-[#002060] text-sm">International Expansion</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>GCC</strong> — Partnered with Al Ghaneim &amp; WETICO for sovereign water-desalination projects.<br /><br />
            <strong>Africa</strong> — Pursuing gas and power opportunities across sub-Saharan markets.<br /><br />
            <strong>Greece</strong> — Expanding into European energy infrastructure.
          </p>
        </div>
        <div className="rounded-xl bg-[#002060] p-5 text-white">
          <h3 className="font-bold text-[#FFC10E] text-sm mb-3">Geographic Footprint</h3>
          <p className="text-xs text-white/70 leading-relaxed mb-2">Concessions in 8 Egyptian governorates renewed for 15 years. TAQA serves the full spectrum:</p>
          {["Industrial zones & factories", "Free zones & logistics parks", "Touristic destinations & resorts", "Commercial & mixed-use developments"].map(i => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/80 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC10E] shrink-0" />{i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 3: In Numbers ──────────────────────────────────────────────────────

function NumbersSlide() {
  const divCards = [
    { div: "GAS",            icon: <Flame className="w-4 h-4" />,    color: "#c2410c", stats: ["+10,000 km, 8 governorates (15yr)"] },
    { div: "POWER",          icon: <Zap className="w-4 h-4" />,      color: "#1d4ed8", stats: ["+1,600 MVA, +150 MW"] },
    { div: "WATER",          icon: <Droplets className="w-4 h-4" />, color: "#0369a1", stats: ["+47,000 m³/day, 15 locations"] },
    { div: "MOBILITY & CNG", icon: <Truck className="w-4 h-4" />,   color: "#7c3aed", stats: ["86 stations, 1st private EV licence"] },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.electric} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c2410c] mb-1">TAQA Arabia · In Numbers</p>
        <h2 className="text-3xl font-bold text-[#002060]">The scale behind a single integrated energy partner — FY 2025</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { value: "EGP 13.4bn", label: "Revenue",       sub: "FY 2025" },
          { value: "EGP 1.5bn",  label: "EBITDA",        sub: "FY 2025" },
          { value: "~6.5M",      label: "Gas customers", sub: "Active connections" },
        ].map(m => (
          <div key={m.label} className="rounded-xl bg-gradient-to-br from-[#c2410c] to-[#7f1d1d] p-5 text-white text-center">
            <div className="text-2xl font-bold text-[#FFC10E]">{m.value}</div>
            <div className="text-xs font-semibold mt-1">{m.label}</div>
            <div className="text-[10px] text-white/50 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {divCards.map(d => (
          <div key={d.div} className="rounded-xl bg-[#f5f0ee] p-4 border border-[#c2410c]/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white" style={{ background: d.color }}>{d.icon}</div>
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

// ─── Slide 4: Solutions Overview ──────────────────────────────────────────────

function SolutionsOverviewSlide() {
  const solutions = [
    { num: "01", label: "Mobile CNG",             desc: "Off-grid natural gas via mobile virtual pipeline — zero infrastructure capex.",        icon: <Truck className="w-5 h-5" />,   color: "#c2410c" },
    { num: "02", label: "Electricity Distribution", desc: "Turnkey MV/LV networks, smart metering and licensed lifetime O&M.",                icon: <Zap className="w-5 h-5" />,     color: "#1d4ed8" },
    { num: "03", label: "Gas Distribution",        desc: "End-to-end gas network EPC — design, build, commission and operate.",                icon: <Flame className="w-5 h-5" />,   color: "#059669" },
    { num: "04", label: "CHP",                     desc: "Combined Heat & Power — up to ~85% efficiency from a single fuel input.",             icon: <Layers className="w-5 h-5" />,  color: "#b45309" },
    { num: "05", label: "Solar",                   desc: "Tailored solar PV via PPA — clean power below grid tariffs, no capex.",               icon: <Sun className="w-5 h-5" />,     color: "#ca8a04" },
    { num: "06", label: "Energy Storage (BESS)",   desc: "Battery storage for peak shaving, solar firming and backup power.",                  icon: <Battery className="w-5 h-5" />, color: "#7c3aed" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.factory} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c2410c] mb-1">Industrial Clients · Solutions Overview</p>
        <h2 className="text-3xl font-bold text-[#002060]">Six integrated solutions</h2>
        <p className="text-gray-500 text-sm mt-1">The following slides detail every solution TAQA Arabia offers to industrial sites, factories and parks.</p>
      </div>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {solutions.map(s => (
          <div key={s.num} className="rounded-xl border-2 p-5 flex flex-col gap-3" style={{ borderColor: s.color + "30" }}>
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white" style={{ background: s.color }}>{s.icon}</div>
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

// ─── Reusable: ScopeSlide ────────────────────────────────────────────────────

interface ScopeProps {
  solutionNum: number;
  solutionLabel: string;
  subtitle: string;
  tagline?: string;
  color: string;
  icon: React.ReactNode;
  photo: string;
  taqaInvests: string[];
  steps: string[];
  whatYouReceive: string[];
}

function ScopeSlide({ solutionNum, solutionLabel, subtitle, tagline, color, icon, photo, taqaInvests, steps, whatYouReceive }: ScopeProps) {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-4 flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color }}>{solutionNum} · {solutionLabel}: Scope &amp; How It Works</p>
          <h2 className="text-xl font-bold text-[#002060] leading-snug">{subtitle}</h2>
          {tagline && <p className="text-xs text-gray-500 mt-1 leading-relaxed italic">{tagline}</p>}
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{ background: color + "0D", border: `1.5px solid ${color}22` }}>
          <h3 className="font-bold text-[#002060] text-xs uppercase tracking-wide mb-3">TAQA Invests</h3>
          {taqaInvests.map(item => (
            <div key={item} className="flex items-start gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
              <span className="text-xs text-gray-600">{item}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-[#f5f5f5] p-4">
          <h3 className="font-bold text-[#002060] text-xs uppercase tracking-wide mb-3">How It Works</h3>
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-2 mb-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: color }}>{i + 1}</div>
              <span className="text-xs text-gray-600 mt-0.5">{s}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-[#002060] p-4 text-white">
          <h3 className="font-bold text-[#FFC10E] text-xs uppercase tracking-wide mb-3">What You Receive</h3>
          {whatYouReceive.map(r => (
            <div key={r} className="flex items-start gap-2 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC10E] shrink-0 mt-0.5" />
              <span className="text-xs text-white/80">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Reusable: ValuePropSlide ────────────────────────────────────────────────

interface ValueItem { label: string; desc: string; }
interface ValueProps {
  solutionNum: number;
  solutionLabel: string;
  color: string;
  icon: React.ReactNode;
  photo: string;
  whatYouGain: ValueItem[];
  taqaEdge: ValueItem[];
}

function ValuePropSlide({ solutionNum, solutionLabel, color, icon, photo, whatYouGain, taqaEdge }: ValueProps) {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color }}>{solutionNum} · {solutionLabel}: Value Proposition</p>
          <h2 className="text-xl font-bold text-[#002060]">What TAQA Arabia delivers for your site</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#002060] mb-3 pb-2 border-b border-[#002060]/10">What You Gain</p>
          <div className="space-y-2">
            {whatYouGain.map(v => (
              <div key={v.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: color + "0D" }}>
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                <div>
                  <div className="font-semibold text-[#002060] text-sm">{v.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#002060] mb-3 pb-2 border-b border-[#002060]/10">TAQA Arabia Edge</p>
          <div className="space-y-2">
            {taqaEdge.map(v => (
              <div key={v.label} className="flex items-start gap-3 p-3 rounded-xl bg-[#002060]">
                <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-[#FFC10E]" />
                <div>
                  <div className="font-semibold text-[#FFC10E] text-sm">{v.label}</div>
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

// ─── Reusable: TimelineSlide ─────────────────────────────────────────────────

interface Phase { days: string; label: string; }
interface Group { label: string; range: string; }
interface TimelineProps {
  solutionNum: number;
  solutionLabel: string;
  color: string;
  icon: React.ReactNode;
  photo: string;
  phases: Phase[];
  groups: Group[];
}

function TimelineSlide({ solutionNum, solutionLabel, color, icon, photo, phases, groups }: TimelineProps) {
  const bgHex = ["18", "28", "38"];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color }}>{solutionNum} · {solutionLabel}: Implementation Timeline</p>
          <h2 className="text-xl font-bold text-[#002060]">From first contact to live supply</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative pl-5 border-l-2" style={{ borderColor: color + "40" }}>
          {phases.map((p, i) => (
            <div key={i} className="relative mb-3">
              <div className="absolute -left-[22px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center"
                style={{ borderColor: color }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{p.days}</div>
              <div className="font-semibold text-[#002060] text-xs mt-0.5">{p.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Milestone Groups</p>
          {groups.map((g, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: color + (bgHex[i] ?? "20"), border: `1.5px solid ${color}30` }}>
              <div className="font-bold text-[#002060] text-sm">{g.label}</div>
              <div className="text-xs mt-1 font-medium" style={{ color }}>{g.range}</div>
            </div>
          ))}
          <div className="rounded-xl bg-[#002060] p-4">
            <p className="text-xs text-white/60 leading-relaxed">Timelines are indicative and subject to site conditions, regulatory approvals and customer readiness.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable: TrackRecordSlide ──────────────────────────────────────────────

interface TrackStat { value: string; label: string; }
interface TrackProps {
  solutionNum: number;
  solutionLabel: string;
  heading: string;
  subheading: string;
  body: string;
  color: string;
  icon: React.ReactNode;
  photo: string;
  stats: TrackStat[];
}

function TrackRecordSlide({ solutionNum, solutionLabel, heading, subheading, body, color, icon, photo, stats }: TrackProps) {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={photo} />
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: color }}>{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color }}>{solutionNum} · {solutionLabel}: Proven Track Record</p>
          <h2 className="text-xl font-bold text-[#002060]">{heading}</h2>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: color + "08", border: `1.5px solid ${color}20` }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4" style={{ color }} />
            <h3 className="font-bold text-[#002060] text-sm">{subheading}</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 content-start">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl text-center p-4" style={{ background: color }}>
              <div className="text-lg font-black text-white leading-tight">{s.value}</div>
              <div className="text-[10px] text-white/70 mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 29: Why One Partner ────────────────────────────────────────────────

function WhyOnePartnerSlide() {
  const benefits = [
    { label: "One SLA",                     desc: "A single service-level agreement governs gas, power, CHP, solar and storage — one uptime guarantee, one renewal." },
    { label: "One Communication Point",     desc: "A single account team and 24/7 hotline for every utility — no chasing multiple contractors." },
    { label: "One Commercial Relationship", desc: "Consolidated billing, aligned contract terms and a single negotiation." },
    { label: "One Engineering Standard",    desc: "Utilities designed to interoperate from day one — shared infrastructure, metering and monitoring." },
    { label: "One Accountable Owner",       desc: "End-to-end responsibility removes interface risk and finger-pointing between specialised vendors." },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.factory} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c2410c] mb-1">Why One Partner</p>
        <h2 className="text-3xl font-bold text-[#002060]">The TAQA One-Stop-Shop</h2>
        <p className="text-gray-500 text-sm mt-1">One SLA, one communication point, one accountable operator — across every utility on the site</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl bg-[#002060] p-5 text-white">
          <h3 className="font-bold text-[#FFC10E] mb-3 text-sm">TAQA Arabia — All Solutions</h3>
          <div className="grid grid-cols-2 gap-2">
            {["Mobile CNG", "Electricity", "Gas", "CHP", "Solar", "Storage"].map(s => (
              <div key={s} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-[#FFC10E] shrink-0" />
                <span className="text-white text-xs font-medium">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/60">From Fragmented Vendors → A Single Operator</p>
          </div>
        </div>
        <div className="space-y-2">
          {benefits.map(b => (
            <div key={b.label} className="flex items-start gap-3 p-3 rounded-xl bg-[#f5f0ee] border border-[#c2410c]/10">
              <ArrowRight className="w-4 h-4 text-[#c2410c] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[#002060] text-sm">{b.label}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 30: Bundle ─────────────────────────────────────────────────────────

function BundleSlide() {
  const bundles = [
    { combo: "Solar + Storage",        desc: "BESS stores daytime solar and dispatches it after sunset — pushing self-consumption and PPA savings far higher.",       color: "#ca8a04" },
    { combo: "Solar + Distribution",   desc: "On-site solar feeds the TAQA-built network directly, lowering the plant's blended power cost.",                        color: "#1d4ed8" },
    { combo: "CHP + Gas",              desc: "TAQA's gas network fuels the CHP plant — one partner supplies the fuel and the cogeneration asset.",                   color: "#b45309" },
    { combo: "Storage + Distribution", desc: "BESS shaves peak demand on the distribution network, cutting the most expensive part of the bill.",                    color: "#7c3aed" },
    { combo: "Gas + Mobile CNG",       desc: "Mobile CNG bridges supply until the permanent gas network goes live — no production gap.",                             color: "#c2410c" },
    { combo: "Shared O&M & Monitoring", desc: "One control room and field team monitor every utility — pooled spares, pooled response, lower unit cost.",            color: "#002060" },
  ];
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.electric} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c2410c] mb-1">The Power of the Bundle</p>
        <h2 className="text-3xl font-bold text-[#002060]">Cross-Solution Benefits</h2>
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
      <div className="mt-4 rounded-xl bg-[#002060] p-3 text-center">
        <p className="text-xs text-white/70">
          Sold as one SLA: lower combined energy cost · shared infrastructure · one billing &amp; monitoring platform · stronger ESG / decarbonisation story · single accountable operator.
        </p>
      </div>
    </div>
  );
}

// ─── Slide 31: Success Story ──────────────────────────────────────────────────

function SuccessStorySlide() {
  return (
    <div className="flex flex-col h-full bg-white p-10">
      <PhotoBanner src={P.factory} height={175} />
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c2410c] mb-1">Success Story</p>
        <h2 className="text-3xl font-bold text-[#002060]">Integrated Industrial Energy</h2>
        <p className="text-gray-500 text-sm mt-1">A single industrial client running on multiple TAQA solutions — the one-stop-shop, proven.</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl bg-gradient-to-br from-[#c2410c]/10 to-[#b45309]/10 p-6 border border-[#c2410c]/20">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#c2410c]" />
            <h3 className="font-bold text-[#002060]">One site. Multiple TAQA solutions. One accountable operator.</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Across Egypt's industrial zones, TAQA Arabia serves as the complete energy backbone for manufacturing sites,
            factories and free zones. One site, multiple TAQA solutions, one accountable operator — delivering gas, power,
            CHP, solar and storage under a single SLA, eliminating interface risk, cutting energy costs and supporting the
            site's decarbonisation targets.
          </p>
          <p className="text-sm font-semibold text-[#c2410c]">
            Contact TAQA Arabia to explore how the integrated industrial energy model can work for your site.
          </p>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl bg-[#002060] p-5 text-white">
            <p className="text-xs text-white/50 mb-3">Solutions combined on one site</p>
            {[
              { s: "Mobile CNG",               c: "#c2410c" },
              { s: "Electricity Distribution", c: "#1d4ed8" },
              { s: "Gas Distribution",         c: "#059669" },
              { s: "CHP",                      c: "#b45309" },
              { s: "Solar PV",                 c: "#ca8a04" },
              { s: "Energy Storage (BESS)",    c: "#7c3aed" },
            ].map(i => (
              <div key={i.s} className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: i.c }} />
                <span className="text-white text-xs font-medium">{i.s}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "6 solutions", label: "on one site" },
              { value: "1 SLA",       label: "one bill" },
              { value: "Lower",       label: "combined energy cost" },
              { value: "24/7",        label: "monitoring & O&M" },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-[#f5f0ee] p-3 text-center border border-[#c2410c]/10">
                <div className="text-lg font-black text-[#c2410c]">{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SLIDES Array (32 slides, 0-indexed) ─────────────────────────────────────

const cngIcon   = <Truck className="w-5 h-5" />;
const elecIcon  = <Zap className="w-5 h-5" />;
const gasIcon   = <Flame className="w-5 h-5" />;
const chpIcon   = <Layers className="w-5 h-5" />;
const solarIcon = <Sun className="w-5 h-5" />;
const bessIcon  = <Battery className="w-5 h-5" />;

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
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon} photo={P.cng}
        subtitle="Portable natural-gas supply delivering cost savings, flexibility and energy security for off-grid industrial sites."
        tagline="TAQA funds, builds, owns & operates the asset. You pay only for the gas you consume — little to no upfront CapEx."
        taqaInvests={["Mother station & compression", "CNG/virtual-pipeline trailers", "On-site decompression & PRMS skid", "Industrial metering & controls", "BOO/BOOT financing"]}
        steps={[
          "Gas is compressed at a TAQA mother station to ~250 bar.",
          "Trailers deliver it to your plant as a virtual pipeline.",
          "On-site skids decompress and regulate to process pressure.",
          "Metered gas feeds boilers, furnaces and process lines.",
          "TAQA tracks usage and refills ahead of demand.",
        ]}
        whatYouReceive={["Pipeline-grade gas without a pipeline", "Continuous feed for industrial processes", "Managed supply and refills"]}
      />
    ),
  },
  // 6
  {
    title: "Mobile CNG: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon} photo={P.cng}
        whatYouGain={[
          { label: "Off-Grid Gas Supply",           desc: "Reliable natural gas to the factory without pipeline access." },
          { label: "Cost Savings vs. Diesel & LPG", desc: "≈40% lower fuel cost than diesel; replaces LPG and electric heating." },
          { label: "Cleaner Emissions",             desc: "Cuts CO₂ by ~24% vs. diesel and lowers NOx & particulates — supports ESG." },
          { label: "99.5% Uptime SLA",              desc: "SCADA-monitored hot-swap replenishment guarantees uninterrupted supply to every factory." },
        ]}
        taqaEdge={[
          { label: "Flexible Delivery Approach",          desc: "BOO/BOOT or EPC via Capacity-as-a-Service — no upfront infrastructure cost." },
          { label: "Nationwide Logistics Via Master Gas", desc: "A dedicated trailer fleet keeps refills on schedule across governorates." },
          { label: "Scalable to Any Load",                desc: "Starter (500 Nm³/day) to Heavy (5,000+ Nm³/day) — scales with occupancy." },
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
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon} photo={P.cng}
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
        solutionNum={1} solutionLabel="Mobile CNG" color="#c2410c" icon={cngIcon} photo={P.cng}
        heading="Virtual Pipeline — 4 Governorates"
        subheading="First company in Egypt to supply natural gas through a mobile virtual pipeline"
        body="TAQA Arabia pioneered mobile CNG in Egypt, using its network of 86 CNG stations to extend a virtual pipeline into four governorates with no fixed gas infrastructure. The model now serves ceramics, glass, food-processing and other industrial clients — proving off-grid factories can run on clean natural gas years before the pipeline arrives."
        stats={[
          { value: "86",     label: "CNG stations feeding the virtual pipeline" },
          { value: "4",      label: "Governorates served off-grid" },
          { value: "+2,350", label: "mmscf CNG delivered per year" },
          { value: "+10",    label: "Active mobile-CNG clients" },
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
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        subtitle="Turnkey distribution networks for industrial sites and parks — from power sourcing and design through licensed lifetime O&M."
        taqaInvests={["HV/MV substations & switchgear", "Distribution transformers", "Cabling, protection & metering", "SCADA & control room", "BOO/BOOT financing"]}
        steps={[
          "TAQA designs the zone network to factory load demands.",
          "Substations, transformers and feeders are built and energized.",
          "Power is distributed to every plot at the right voltage.",
          "Smart meters bill each factory for its consumption.",
          "A 24/7 control room keeps the zone powered and balanced.",
        ]}
        whatYouReceive={["A licensed industrial power network", "Reliable supply to every factory", "Operation, metering and billing handled", "450 MVA in zones"]}
      />
    ),
  },
  // 10
  {
    title: "Electricity Distribution: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        whatYouGain={[
          { label: "Potential New Revenue Stream", desc: "The profit-share model turns the distribution network from a cost center into recurring income." },
          { label: "Lower Factory Bills",          desc: "Demand-side management and tariff optimization reduce consumption and end-user charges." },
          { label: "Guaranteed Power Quality",     desc: "Stable, metered, billable electricity to every unit from handover." },
          { label: "Future-Ready Network",         desc: "Designed for solar, storage and EV loads from day one." },
        ]}
        taqaEdge={[
          { label: "Flexible Delivery Approach", desc: "Take it as EPC build, licensed O&M, or a profit-share — TAQA flexes from substation to metering." },
          { label: "Faster Time-to-Handover",    desc: "Integrated teams for power sourcing, engineering and construction cut the critical path." },
          { label: "Deep Industrial Experience", desc: "Designed and operated 450+ MVA across industrial zones." },
          { label: "24/7 Control Room",          desc: "Dedicated SCADA, predictive maintenance and rapid-response O&M." },
        ]}
      />
    ),
  },
  // 11
  {
    title: "Electricity Distribution: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        phases={[
          { days: "Day 0–30",   label: "Power Sourcing" },
          { days: "Day 30–75",  label: "Engineering Approval" },
          { days: "Day 75–120", label: "MEP Approval" },
          { days: "Day 120–240", label: "Network Build" },
          { days: "Day 240–300", label: "Smart Metering" },
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
        solutionNum={2} solutionLabel="Electricity Distribution" color="#1d4ed8" icon={elecIcon} photo={P.electric}
        heading="Powering industrial zones across Egypt"
        subheading="Egypt's largest private power infrastructure operator"
        body="TAQA Power designs, builds and operates licensed electrical distribution networks for industrial zones, free zones and mixed-use developments across Egypt, with +450 MVA distributed across zones. As Egypt's largest private power infrastructure operator, TAQA brings the same turnkey discipline — from grid interconnection to smart metering — to any industrial site."
        stats={[
          { value: "+450 MVA", label: "distributed across industrial zones" },
          { value: "26",       label: "licensed distribution concessions" },
          { value: "+12,000",  label: "customers served" },
          { value: "24/7",     label: "SCADA monitoring" },
        ]}
      />
    ),
  },

  // ── Gas Distribution ─────────────────────────────────────────────────────────
  // 13
  {
    title: "Gas Distribution: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
        subtitle="End-to-end EPC for natural-gas distribution networks across industrial sites, parks and free zones."
        taqaInvests={["City-gate & PRMS stations", "Steel distribution mains", "Factory service lines", "Industrial meters & regulators", "BOO/BOOT financing"]}
        steps={[
          "TAQA secures the concession and designs the gas grid.",
          "Mains and service lines are laid across the zone.",
          "Pressure is regulated to each factory's process requirement.",
          "Industrial meters commission and bill per consumption.",
          "TAQA operates, inspects and maintains the network.",
        ]}
        whatYouReceive={["A licensed industrial gas network", "Safe, metered gas to every factory", "Lifetime operation and emergency response"]}
      />
    ),
  },
  // 14
  {
    title: "Gas Distribution: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
        whatYouGain={[
          { label: "Diesel & LPG Fuel-Switching",          desc: "Manage the full transition from diesel and LPG to cleaner, cheaper natural gas." },
          { label: "Flexible Gas Sourcing — M-CNG or SNG", desc: "Where no fixed pipeline exists yet, gas is supplied via M-CNG or SNG — no factory waits." },
          { label: "Lower Factory Bills",                  desc: "Subsidized piped natural gas is far cheaper than LPG cylinders or electric heating." },
          { label: "Higher Asset Value",                   desc: "Connection to the national gas grid lifts site value and tenancy." },
        ]}
        taqaEdge={[
          { label: "Flexible Commercial Models",    desc: "Delivered as EPC, long-term O&M or BOO." },
          { label: "External & Internal Networks",  desc: "TAQA builds the external distribution backbone and the internal factory network." },
          { label: "One Partner Across All Phases", desc: "Single accountable party from feasibility to handover." },
          { label: "Standards Compliance",          desc: "Aligned with IGEM, EGAS and international gas-safety standards." },
        ]}
      />
    ),
  },
  // 15
  {
    title: "Gas Distribution: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
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
  // 16
  {
    title: "Gas Distribution: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={3} solutionLabel="Gas Distribution" color="#059669" icon={gasIcon} photo={P.pipeline}
        heading="Egypt's largest private gas distribution network — built, owned and operated by TAQA"
        subheading="+10,000 km of distribution mains across 8 governorates with 15-year renewable concessions"
        body="TAQA Gas operates one of Egypt's largest private piped-gas networks: +10,000 km of distribution mains across 8 governorates with 15-year renewable concessions. As the holder of 66% of Egypt's private gas concessions, TAQA brings the same proven engineering and O&M platform to industrial zones, free zones and large-scale industrial developments."
        stats={[
          { value: "+10,000 km", label: "network" },
          { value: "8",          label: "governorate concessions (15yr)" },
          { value: "66%",        label: "private concession share" },
          { value: "~6.5M",      label: "customers served" },
        ]}
      />
    ),
  },

  // ── CHP ──────────────────────────────────────────────────────────────────────
  // 17
  {
    title: "CHP: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={4} solutionLabel="CHP" color="#b45309" icon={chpIcon} photo={P.chp}
        subtitle="Combined Heat & Power — capturing waste heat to deliver electricity plus thermal energy from a single fuel input."
        taqaInvests={["Gas engine/turbine genset", "Waste-heat recovery unit", "Absorption chiller (tri-gen)", "Grid sync, controls & SCADA", "BOO/BOOT plant financing"]}
        steps={[
          "Natural gas feeds the on-site engine or turbine.",
          "The genset generates electricity for your plant.",
          "Exhaust and jacket heat are captured, not wasted.",
          "Recovered heat becomes steam, hot water — and cooling via chiller.",
          "Controls sync to the grid and match output to your load.",
        ]}
        whatYouReceive={["On-site power plus steam, hot water & cooling", "Up to ~85% total fuel efficiency", "One fuel input, three energy outputs"]}
      />
    ),
  },
  // 18
  {
    title: "CHP: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={4} solutionLabel="CHP" color="#b45309" icon={chpIcon} photo={P.chp}
        whatYouGain={[
          { label: "Lower Energy Costs",       desc: "A single fuel input delivers both electricity and thermal energy, cutting unit costs." },
          { label: "High Overall Efficiency",  desc: "Up to ~85% efficiency by capturing waste heat that would otherwise be lost." },
          { label: "Flexible Thermal Outputs", desc: "Steam, hot water, chilled water or direct heat — matched to process needs." },
          { label: "Reduced CO₂ Emissions",    desc: "Higher fuel utilization translates into a smaller carbon footprint per unit of output." },
        ]}
        taqaEdge={[
          { label: "Flexible Commercial Models",    desc: "Delivered as EPC, long-term O&M or BOO." },
          { label: "Integrated Gas + CHP Solution", desc: "TAQA can supply both the natural gas and the CHP plant — one provider for fuel and energy." },
          { label: "Guaranteed Performance",        desc: "Performance SLA backed by 24/7 monitoring and rapid response." },
          { label: "Deep Cogeneration Experience",  desc: "6 captive power plants and +150 MW contracted generation including flare-to-power and CHP systems." },
        ]}
      />
    ),
  },
  // 19
  {
    title: "CHP: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={4} solutionLabel="CHP" color="#b45309" icon={chpIcon} photo={P.chp}
        phases={[
          { days: "Day 0–21",    label: "Energy Audit (power & thermal load profiling)" },
          { days: "Day 21–60",   label: "System Design (CHP sizing & tri-gen configuration)" },
          { days: "Day 45–80",   label: "Commercial Model (BOO/BOOT & performance guarantee)" },
          { days: "Day 80–160",  label: "Procurement (gensets, HRSG & chillers)" },
          { days: "Day 160–270", label: "Install & Commission" },
          { days: "Day 270+",    label: "O&M" },
        ]}
        groups={[
          { label: "AUDIT & DESIGN",           range: "Day 0–60" },
          { label: "FINANCE, PROCURE & BUILD", range: "Day 45–270" },
          { label: "OPERATE",                  range: "Day 270+" },
        ]}
      />
    ),
  },
  // 20
  {
    title: "CHP: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={4} solutionLabel="CHP" color="#b45309" icon={chpIcon} photo={P.chp}
        heading="Captive Power & Cogeneration"
        subheading="Owning and operating high-efficiency captive generation"
        body="TAQA Power owns and operates 6 captive power plants and +150 MW of contracted generation through long-term agreements, including flare-to-power and combined-heat-and-power systems. The same engineering, fuel-logistics and 24/7 O&M discipline underpins TAQA's CHP offering for industrial clients."
        stats={[
          { value: "6",       label: "Captive power plants operated" },
          { value: "+150 MW", label: "contracted generation" },
          { value: "CHP",     label: "Flare-to-power & CHP experience" },
          { value: "24/7",    label: "O&M and SCADA" },
        ]}
      />
    ),
  },

  // ── Solar ─────────────────────────────────────────────────────────────────────
  // 21
  {
    title: "Solar: Scope",
    render: () => (
      <ScopeSlide
        solutionNum={5} solutionLabel="Solar" color="#ca8a04" icon={solarIcon} photo={P.solar}
        subtitle="Tailored solar PV solutions delivering measurable value across financing, sustainability and operations."
        taqaInvests={["Rooftop & ground-mount PV", "Inverters & transformers", "Connection & net-metering works", "Monitoring & SCADA", "BOO/BOOT financing"]}
        steps={[
          "TAQA assesses roof, land and the factory's energy profile.",
          "Arrays are sized and designed for optimal yield.",
          "Panels are installed; grid tie-in and metering completed.",
          "Solar generation offsets grid purchases at zero marginal cost.",
          "TAQA monitors output and guarantees performance for 25+ years.",
        ]}
        whatYouReceive={["Lowest-cost energy from day one", "Net metering and grid tie-in", "Zero-capex PPA option", "25-year performance guarantee"]}
      />
    ),
  },
  // 22
  {
    title: "Solar: Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={5} solutionLabel="Solar PV" color="#ca8a04" icon={solarIcon} photo={P.solar}
        whatYouGain={[
          { label: "Lower Energy Bills",       desc: "Solar's cost per kWh sits well below the grid tariff — factories save from day one." },
          { label: "Tariff-Hike Hedge",        desc: "Lock in clean-energy cost for decades and insulate the factory from grid-price escalation." },
          { label: "Higher Property Value",    desc: "Solar-equipped, lower-running-cost sites command a premium." },
          { label: "Green Living Credentials", desc: "Visible clean energy strengthens ESG and sustainability story." },
        ]}
        taqaEdge={[
          { label: "Egypt's Solar Pioneer",      desc: "TAQA was the first national company to commercially operate a plot at the Benban solar park." },
          { label: "Flexible Models",            desc: "CAPEX, BOOT/BOO or PPA — own it, transfer it over time, or buy cheaper solar under a zero-capex PPA." },
          { label: "Turnkey Engineering",        desc: "Survey, design, supply, installation and grid tie-in delivered end-to-end." },
          { label: "Lifecycle O&M & Guarantee", desc: "Remote monitoring, maintenance and performance guarantees for 25+ years." },
        ]}
      />
    ),
  },
  // 23
  {
    title: "Solar: Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={5} solutionLabel="Solar" color="#ca8a04" icon={solarIcon} photo={P.solar}
        phases={[
          { days: "Day 0–21",    label: "Site & Energy Study" },
          { days: "Day 21–55",   label: "System Design" },
          { days: "Day 40–75",   label: "PPA Structuring" },
          { days: "Day 75–130",  label: "Procurement" },
          { days: "Day 130–210", label: "Install & Commission" },
          { days: "Day 210+",    label: "O&M" },
        ]}
        groups={[
          { label: "STUDY & DESIGN",  range: "Day 0–55" },
          { label: "FINANCE & BUILD", range: "Day 40–210" },
          { label: "OPERATE",         range: "Day 210+" },
        ]}
      />
    ),
  },
  // 24
  {
    title: "Solar: Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={5} solutionLabel="Solar" color="#ca8a04" icon={solarIcon} photo={P.solar}
        heading="Solar Development & Investment"
        subheading="Developing and investing in tailored solar across Egypt"
        body="TAQA Arabia develops, finances and operates solar PV assets under tailored PPA agreements, integrating solar with its power-distribution and storage offering. As the first national company to commercially operate at the Benban solar park, TAQA brings utility-scale solar expertise to industrial rooftops and ground mounts. 65 MW solar plant in Benban, Upper Egypt (est. 2019)."
        stats={[
          { value: "65 MW",    label: "Benban solar plant" },
          { value: "1st",      label: "to operate at Benban" },
          { value: "BOO/BOOT", label: "& PPA models" },
          { value: "25+ yr",   label: "performance guarantee" },
        ]}
      />
    ),
  },

  // ── Energy Storage (BESS) ─────────────────────────────────────────────────────
  // 25
  {
    title: "Energy Storage (BESS): Scope",
    render: () => (
      <ScopeSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon} photo={P.battery}
        subtitle="Battery Energy Storage Systems — storing clean power to cut peak charges, firm up solar and secure supply."
        taqaInvests={["Battery energy-storage units", "Power-conversion system & inverters", "Switchgear & grid interface", "EMS & SCADA controls", "BOO/BOOT financing"]}
        steps={[
          "TAQA sizes storage to the factory's peak profile and solar surplus.",
          "Batteries charge during off-peak or peak-solar hours.",
          "Stored energy dispatches during peak demand — shaving the most expensive part of the bill.",
          "EMS optimises charge/discharge against tariff and solar signals.",
          "TAQA monitors and guarantees performance.",
        ]}
        whatYouReceive={["Peak-demand charge reduction", "Solar firming through the evening", "Backup supply on grid failure", "EMS-optimised dispatch"]}
      />
    ),
  },
  // 26
  {
    title: "Energy Storage (BESS): Value Proposition",
    render: () => (
      <ValuePropSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon} photo={P.battery}
        whatYouGain={[
          { label: "Peak-Demand Savings",      desc: "Discharge stored energy during peak hours to slash demand charges and tariff exposure." },
          { label: "Uninterrupted Production", desc: "Instant-response backup protects critical lines and avoids costly downtime during outages." },
          { label: "Grid Services Revenue",    desc: "Frequency regulation and load balancing can create new value streams." },
          { label: "Future-Proof & Green",     desc: "Enables deeper renewable integration and supports the factory's carbon-reduction targets." },
        ]}
        taqaEdge={[
          { label: "Flexible Financing",      desc: "CAPEX, BOOT/BOO — choose the structure that fits the balance sheet." },
          { label: "Integrated Solar + BESS", desc: "Pair storage with TAQA's solar PV for round-the-clock clean power." },
          { label: "Smart EMS",               desc: "AI-driven charge/discharge optimisation against loads, tariffs and solar signals." },
          { label: "Proven Operator",         desc: "Same 24/7 O&M discipline applied across TAQA's generation, distribution and solar assets." },
        ]}
      />
    ),
  },
  // 27
  {
    title: "Energy Storage (BESS): Timeline",
    render: () => (
      <TimelineSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon} photo={P.battery}
        phases={[
          { days: "Day 0–21",    label: "Load & Tariff Study" },
          { days: "Day 21–55",   label: "System Design (BESS sizing & use-case config)" },
          { days: "Day 40–75",   label: "Commercial Model" },
          { days: "Day 75–140",  label: "Procurement" },
          { days: "Day 140–220", label: "Install & Commission" },
          { days: "Day 220+",    label: "Smart O&M" },
        ]}
        groups={[
          { label: "STUDY & DESIGN",  range: "Day 0–55" },
          { label: "FINANCE & BUILD", range: "Day 40–220" },
          { label: "SMART OPERATE",   range: "Day 220+" },
        ]}
      />
    ),
  },
  // 28
  {
    title: "Energy Storage (BESS): Track Record",
    render: () => (
      <TrackRecordSlide
        solutionNum={6} solutionLabel="Energy Storage (BESS)" color="#7c3aed" icon={bessIcon} photo={P.battery}
        heading="Solar-Plus-Storage Integration"
        subheading="Integrating storage with solar and distribution for round-the-clock clean power"
        body="As Egypt's largest private power player, TAQA Arabia pairs Battery Energy Storage with its solar and distribution assets to deliver dispatchable, lower-carbon energy. Storage lets industrial clients shift solar into the evening, shave peaks and secure supply — the natural next step in TAQA's integrated energy model."
        stats={[
          { value: "Peak shaving",  label: "cuts costly demand charges" },
          { value: "Solar firming", label: "day-to-night energy shift" },
          { value: "BOO/BOOT",      label: "no client capex" },
          { value: "24/7",          label: "EMS monitoring & O&M" },
        ]}
      />
    ),
  },

  // ── Closing ───────────────────────────────────────────────────────────────────
  // 29
  { title: "Why One Partner", render: () => <WhyOnePartnerSlide /> },
  // 30
  { title: "Cross-Solution Benefits", render: () => <BundleSlide /> },
  // 31
  { title: "Success Story: Integrated Industrial Energy", render: () => <SuccessStorySlide /> },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function IndustrialClients() {
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
        @keyframes ic-slide-right { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
        @keyframes ic-slide-left  { from { opacity:0; transform:translateX(-32px); } to { opacity:1; transform:translateX(0); } }
        .ic-fwd { animation: ic-slide-right 0.32s cubic-bezier(0.16,1,0.3,1) both; }
        .ic-bwd { animation: ic-slide-left  0.32s cubic-bezier(0.16,1,0.3,1) both; }
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
              <p className="text-white text-sm font-bold">Industrial Clients</p>
              <p className="text-white/40 text-[10px]">TAQA Arabia · Integrated Energy &amp; Utility Solutions · Jan 2026</p>
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
            <div key={animKey} className={direction === "fwd" ? "ic-fwd h-full" : "ic-bwd h-full"}>
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
