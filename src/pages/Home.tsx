import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Wind, SunMedium, Droplets, Truck, ArrowRight, Plus,
  TrendingUp, Layers, FileDown, Shield, Zap, Briefcase,
  Ruler, Presentation, ChevronRight, BarChart2, Flame, FolderOpen,
  Gauge, Battery, Waves, Car,
} from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.jpg";
import { DirectoryPanel } from "@/components/directory/DirectoryPanel";
import { ThemeToggle } from "@/components/ThemeToggle";

const investmentModels = [
  {
    id: "reza",
    title: "Wind – REZA Scenario A",
    subtitle: "Project Finance Model",
    description:
      "Full project finance model for wind renewables: CAPEX, debt sizing, DSCR, LCOE, equity IRR and multi-variable sensitivities.",
    icon: Wind,
    href: "/models/reza",
    iconBg: "bg-[#005298]/10 text-[#005298]",
    borderHover: "hover:border-[#005298]/40",
    tag: "Wind Energy",
    tagColor: "bg-[#005298]/10 text-[#005298]",
  },
  {
    id: "reza-2",
    title: "Solar – REZA Scenario B",
    subtitle: "Project Finance Model",
    description:
      "Independent scenario with its own saved assumptions — run in parallel for side-by-side comparison against Scenario A.",
    icon: SunMedium,
    href: "/models/reza-2",
    iconBg: "bg-amber-50 text-amber-600",
    borderHover: "hover:border-amber-400/40",
    tag: "Solar Energy",
    tagColor: "bg-amber-50 text-amber-700",
  },
  {
    id: "pv",
    title: "PV Solar",
    subtitle: "Project Finance Model",
    description:
      "Utility-scale solar PV: yield analysis (P50 / P90), CAPEX, debt sculpting, DSCR, LCOE, equity IRR and tariff composition.",
    icon: SunMedium,
    href: "/models/pv",
    iconBg: "bg-amber-50 text-amber-600",
    borderHover: "hover:border-amber-400/40",
    tag: "Solar Energy",
    tagColor: "bg-amber-50 text-amber-700",
  },
  {
    id: "water",
    title: "Water (SWRO)",
    subtitle: "Project Finance Model",
    description:
      "Seawater reverse-osmosis desalination: CAPEX, debt sizing, DSCR, LCOM³, equity IRR, tariff allocation and sensitivities.",
    icon: Droplets,
    href: "/models/water",
    iconBg: "bg-cyan-50 text-cyan-600",
    borderHover: "hover:border-cyan-400/40",
    tag: "Water",
    tagColor: "bg-cyan-50 text-cyan-700",
  },
  {
    id: "cng",
    title: "Mobile CNG",
    subtitle: "Project Finance Model",
    description:
      "Mother station CAPEX, trailer fleet sizing, transport fees, gas commissions, debt sculpting, DSCR and equity IRR.",
    icon: Truck,
    href: "/models/cng",
    iconBg: "bg-emerald-50 text-emerald-600",
    borderHover: "hover:border-emerald-400/40",
    tag: "Gas",
    tagColor: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "lngtz",
    title: "Tanzania Micro LNG",
    subtitle: "Project Finance Model",
    description:
      "Small-scale LNG liquefaction, semi-trailer distribution fleet, feed gas cost, SHL / senior debt sizing, DSCR and equity IRR.",
    icon: Flame,
    href: "/models/lngtz",
    iconBg: "bg-orange-50 text-orange-600",
    borderHover: "hover:border-orange-400/40",
    tag: "LNG",
    tagColor: "bg-orange-50 text-orange-700",
  },
  {
    id: "rab-ksa",
    title: "RAB Tariff Calculator",
    subtitle: "Saudi Gas Distribution",
    description:
      "Regulated Asset Base tariff model for Saudi gas distribution concessions. 6 building blocks, ZATCA Zakat 2024, Income Tax Art. 21, 30-year financials.",
    icon: Flame,
    href: "/models/rab-ksa",
    iconBg: "bg-green-50 text-green-700",
    borderHover: "hover:border-green-400/40",
    tag: "KSA",
    tagColor: "bg-green-50 text-green-700",
  },
];

type CategoryId = "investment" | "sizing" | "presentations" | "directory" | "analytics";

const categories = [
  {
    id: "investment" as CategoryId,
    label: "Investment Models",
    description: "Project finance models for renewable energy, water and gas infrastructure.",
    icon: Briefcase,
    count: 6,
    iconBg: "bg-[#002060]",
    iconColor: "text-[#FFC10E]",
    accent: "border-[#005298]/30 hover:border-[#005298]/60",
    activeAccent: "border-[#005298] ring-2 ring-[#005298]/20",
    badgeBg: "bg-[#005298]/10 text-[#005298]",
  },
  {
    id: "sizing" as CategoryId,
    label: "Sizing Models",
    description: "Technical sizing tools for capacity planning and equipment specification.",
    icon: Ruler,
    count: 8,
    iconBg: "bg-emerald-700",
    iconColor: "text-white",
    accent: "border-emerald-300/40 hover:border-emerald-400/60",
    activeAccent: "border-emerald-500 ring-2 ring-emerald-500/20",
    badgeBg: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "presentations" as CategoryId,
    label: "Client Presentations",
    description: "Investor-ready presentation templates and executive summary generators.",
    icon: Presentation,
    count: 4,
    iconBg: "bg-violet-700",
    iconColor: "text-white",
    accent: "border-violet-300/40 hover:border-violet-400/60",
    activeAccent: "border-violet-500 ring-2 ring-violet-500/20",
    badgeBg: "bg-violet-50 text-violet-700",
  },
  {
    id: "analytics" as CategoryId,
    label: "TAQA Analytics",
    description: "Internal business intelligence — client portfolio maps, sector breakdowns and operational dashboards.",
    icon: TrendingUp,
    count: 1,
    iconBg: "bg-[#E8A020]",
    iconColor: "text-white",
    accent: "border-amber-300/40 hover:border-amber-400/60",
    activeAccent: "border-amber-500 ring-2 ring-amber-500/20",
    badgeBg: "bg-amber-50 text-amber-700",
  },
  {
    id: "directory" as CategoryId,
    label: "Directory",
    description: "Saved model scenarios — search, retrieve and reload any saved configuration.",
    icon: FolderOpen,
    count: -1,
    iconBg: "bg-[#002060]",
    iconColor: "text-[#FFC10E]",
    accent: "border-[#002060]/20 hover:border-[#002060]/50",
    activeAccent: "border-[#002060] ring-2 ring-[#002060]/20",
    badgeBg: "bg-[#002060]/10 text-[#002060]",
  },
];

const stats = [
  { label: "Financial Models",       value: "6",   icon: Layers },
  { label: "Sensitivity Variables",  value: "12+", icon: TrendingUp },
  { label: "Export Formats",         value: "3",   icon: FileDown },
  { label: "Auto-Save & Cloud Sync", value: "✓",   icon: Shield },
];

const features = [
  { icon: Zap,      label: "Real-time recalculation as you type" },
  { icon: FileDown, label: "Excel, PDF & Word memo exports" },
  { icon: Shield,   label: "Auto-save with cloud sync via Supabase" },
  { icon: TrendingUp, label: "Multi-variable sensitivity analysis" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [dirCount, setDirCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    import("@/lib/directoryStore").then(m => setDirCount(m.loadEntries().length));
  }, [activeCategory]);

  // Bring the newly opened accordion row into view if it isn't fully visible
  // (skip on first mount — nothing is expanded yet).
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (activeCategory) panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">

      {/* ── Sticky top nav ─────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#002060] border-b border-white/10 shadow-lg">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img
              src={taqaLogo}
              alt="TAQA Arabia"
              className="h-9 w-auto rounded shadow"
            />
            <div className="border-l border-white/20 pl-3 hidden sm:block">
              <p className="text-white text-sm font-semibold tracking-wide leading-none">
                Financial Models Platform
              </p>
              <p className="text-white/40 text-[10px] mt-0.5">
                Internal Analytics · v2.0
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-xs hidden md:block">
              Confidential — Internal Use Only
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-taqa-hero-animated text-white py-16">
        <div
          className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full
                       bg-[#005298]/30 blur-[80px] pointer-events-none animate-float-slow"
        />
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full
                       bg-[#FFC10E]/10 blur-[60px] pointer-events-none animate-float"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), " +
              "linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="container relative z-10">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="w-14 h-[3px] bg-[#FFC10E] rounded-full mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              TAQA Arabia
              <br />
              <span className="text-gradient-gold">Financial Models</span>
            </h1>
            <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-lg">
              Advanced project-finance models for renewable energy, water, and
              gas infrastructure — purpose-built for TAQA Arabia's investment
              pipeline.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 md:gap-10">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-2.5 animate-fade-in-up"
                  style={{ animationDelay: `${120 + i * 80}ms` }}
                >
                  <div className="p-2 rounded-lg bg-white/10 border border-white/10">
                    <Icon className="h-4 w-4 text-[#FFC10E]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold leading-none">{s.value}</div>
                    <div className="text-[11px] text-white/50 mt-0.5">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="h-[3px] bg-gradient-to-r from-[#FFC10E] via-[#FFC10E]/50 to-transparent" />

      {/* ── Feature pills ──────────────────────────────────── */}
      <div className="bg-white border-b border-border">
        <div className="container py-3 flex flex-wrap gap-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground
                           bg-muted/60 rounded-full px-3 py-1.5 border border-border/60"
              >
                <Icon className="h-3.5 w-3.5 text-[#005298]" />
                {f.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────── */}
      <main className="container py-10 flex-1">

        {/* Category accordion — hidden until clicked, opens inline */}
        <div className="space-y-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <div
                key={cat.id}
                ref={isActive ? panelRef : undefined}
                className={`rounded-xl border-2 bg-white shadow-sm overflow-hidden
                             transition-all duration-200 animate-fade-in-up
                             ${isActive ? cat.activeAccent + " shadow-md" : "border-border " + cat.accent}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <button
                  onClick={() => setActiveCategory(isActive ? null : cat.id)}
                  className="w-full text-left p-5 flex items-center gap-4"
                >
                  <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${cat.iconBg}`}>
                    <Icon className={`h-6 w-6 ${cat.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-[#002060] text-base leading-snug">{cat.label}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{cat.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {cat.id === "directory" && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cat.badgeBg}`}>
                        {dirCount} saved
                      </span>
                    )}
                    {cat.id !== "directory" && cat.count > 0 && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cat.badgeBg}`}>
                        {cat.count} models
                      </span>
                    )}
                    {cat.id !== "directory" && cat.count === 0 && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Coming soon
                      </span>
                    )}
                    <ChevronRight
                      className={`h-5 w-5 transition-transform duration-200
                                   ${isActive ? "rotate-90 text-[#005298]" : "text-muted-foreground/50"}`}
                    />
                  </div>
                </button>

                {isActive && (
                  <div className="border-t border-border/60 px-5 pb-6 pt-5">
        {cat.id === "investment" && (
          <div className="animate-fade-in-up">
            <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 text-[#005298]" />
              <span className="font-medium text-[#002060]">Investment Models</span>
              <span className="text-border">·</span>
              <span>All models persist your inputs automatically and support one-click Excel export.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {investmentModels.map((m, i) => {
                const Icon = m.icon;
                const isHovered = hoveredModel === m.id;
                return (
                  <Link
                    key={m.id}
                    to={m.href}
                    onMouseEnter={() => setHoveredModel(m.id)}
                    onMouseLeave={() => setHoveredModel(null)}
                    className="group block animate-fade-in-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div
                      className={`relative h-full rounded-xl border bg-white p-6 shadow-sm
                                   transition-all duration-300 overflow-hidden
                                   ${isHovered
                                     ? "shadow-xl -translate-y-1.5 border-[#005298]/30"
                                     : `border-border ${m.borderHover}`
                                   }`}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-[#005298]/[0.03]
                                    to-[#FFC10E]/[0.04] opacity-0 group-hover:opacity-100
                                    transition-opacity duration-300 rounded-xl"
                      />

                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full
                                       text-[11px] font-semibold tracking-wide ${m.tagColor}`}
                        >
                          {m.tag}
                        </span>
                        <div
                          className={`h-11 w-11 rounded-xl flex items-center justify-center
                                       transition-transform duration-300 group-hover:scale-110
                                       group-hover:shadow-md ${m.iconBg}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="relative z-10">
                        <h3 className="font-bold text-[#002060] text-base leading-snug">
                          {m.title}
                        </h3>
                        <p className="text-[11px] text-[#005298] font-medium mt-0.5 mb-2.5">
                          {m.subtitle}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      <div
                        className="relative z-10 mt-5 flex items-center gap-1.5 text-xs
                                     font-semibold text-[#005298] opacity-0 -translate-x-1
                                     group-hover:opacity-100 group-hover:translate-x-0
                                     transition-all duration-300"
                      >
                        Open Model
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>

                      <div
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFC10E]
                                     scale-x-0 group-hover:scale-x-100 origin-left
                                     transition-transform duration-300 rounded-b-xl"
                      />
                    </div>
                  </Link>
                );
              })}

              {/* Coming soon slot */}
              <div
                className="rounded-xl border-2 border-dashed border-border/50
                             flex items-center justify-center bg-muted/20 min-h-[220px]
                             transition-colors hover:border-border hover:bg-muted/30"
              >
                <div className="text-center text-muted-foreground">
                  <Plus className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium opacity-50">More models coming</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {cat.id === "sizing" && (
          <div className="animate-fade-in-up">
            <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Ruler className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-[#002060]">Sizing Models</span>
              <span className="text-border">·</span>
              <span>Technical capacity and equipment sizing tools.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* NABQ card */}
              <Link
                to="/sizing/nabq"
                className="group block animate-fade-in-up"
              >
                <div className="relative h-full rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 hover:border-emerald-500/30 border-border">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-emerald-300/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-50 text-emerald-700">
                      Energy Analytics
                    </span>
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-emerald-700 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                      <BarChart2 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-[#002060] text-base leading-snug">NABQ</h3>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5 mb-2.5">Power & Diesel Analytics</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Power consumption analysis, diesel cost forecasting, battery sizing, solar integration, and client load dashboards for NABQ.
                    </p>
                  </div>
                  <div className="relative z-10 mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Open Dashboard
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-b-xl" />
                </div>
              </Link>

              {/* Engineering sizing tools */}
              {[
                {
                  to: "/sizing/gas-load", group: "Gas", color: "#E68A00", icon: Gauge,
                  title: "Gas Load Profiling", sub: "Demand Calculator",
                  desc: "Build a facility demand curve, compute peak flow and pick the Mobile CNG capacity tier — Starter (500 Nm³/d) to Heavy (5,000+ Nm³/d).",
                },
                {
                  to: "/sizing/gas-network", group: "Gas", color: "#009045", icon: Flame,
                  title: "Gas Network Hydraulics", sub: "Pipe & Regulator Sizing",
                  desc: "Route-plan distribution grids: pressure-drop modeling, pipe diameter selection and regulator capacity for industrial sites and compounds.",
                },
                {
                  to: "/sizing/pv-yield", group: "Renewables", color: "#d97706", icon: SunMedium,
                  title: "PV", sub: "Rooftop Savings & NPV",
                  desc: "Turn your factory rooftop or adjacent land into savings — TAQA's discount vs government tariffs, yearly savings, NPV, EGP/m² and CO₂ avoided.",
                },
                {
                  to: "/sizing/bess", group: "Storage", color: "#7B35C2", icon: Battery,
                  title: "BESS Optimization", sub: "Peak Shaving & Solar Firming",
                  desc: "Size storage capacity and power from peak profile and tariff analysis — solar firming, peak shaving, DoD and round-trip efficiency.",
                },
                {
                  to: "/sizing/grid-load-flow", group: "Power", color: "#1d4ed8", icon: Zap,
                  title: "Grid Integration & Load Flow", sub: "EHV → MV/LV Modeling",
                  desc: "Load studies and interconnection planning — transformer MVA sizing with N-1, losses, voltage drop and 220 kV vs 500 kV evacuation limits.",
                },
                {
                  to: "/sizing/chp", group: "Power", color: "#c2410c", icon: Flame,
                  title: "CHP & Tri-Gen Simulator", sub: "Thermal Load Matching",
                  desc: "Power and thermal load profiling to size a cogeneration plant — heat recovery, absorption cooling and ~85% total fuel efficiency.",
                },
                {
                  to: "/sizing/ev-chargers", group: "Mobility", color: "#0369a1", icon: Car,
                  title: "EV Charger Mix", sub: "Duty-Cycle Calculator",
                  desc: "Fleet duty-cycle analysis, parking and grid capacity — the optimal blend of AC, DC fast and golf-car chargers for a site.",
                },
              ].map(t => (
                <Link key={t.to} to={t.to} className="group block animate-fade-in-up">
                  <div className="relative h-full rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 border-border" style={{ borderColor: undefined }}>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide" style={{ background: `${t.color}14`, color: t.color }}>
                        {t.group}
                      </span>
                      <div className="h-11 w-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md" style={{ background: t.color }}>
                        <t.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-bold text-[#002060] text-base leading-snug">{t.title}</h3>
                      <p className="text-[11px] font-medium mt-0.5 mb-2.5" style={{ color: t.color }}>{t.sub}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                    </div>
                    <div className="relative z-10 mt-5 flex items-center gap-1.5 text-xs font-semibold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ color: t.color }}>
                      Open Tool
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-b-xl" style={{ background: t.color }} />
                  </div>
                </Link>
              ))}

              {/* SWRO Membrane Sizing */}
              <div className="relative h-full rounded-xl border bg-white p-6 shadow-sm overflow-hidden border-border opacity-80">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-cyan-50 text-cyan-700">
                    Water
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-cyan-700">
                      <Waves className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Coming Soon</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#002060] text-base leading-snug">SWRO Membrane Sizing</h3>
                  <p className="text-[11px] text-cyan-700 font-medium mt-0.5 mb-2.5">Technical Sizing Tool</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Determine membrane count, pressure vessels, HP pump sizing and specific energy (kWh/m³) from feed water quality and recovery rate targets.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
        {cat.id === "presentations" && (
          <div className="animate-fade-in-up">
            <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Presentation className="h-4 w-4 text-violet-600" />
              <span className="font-medium text-[#002060]">Client Presentations</span>
              <span className="text-border">·</span>
              <span>Investor-ready templates and executive summaries.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  to: "/presentations/fleet-mobility-clients",
                  title: "Fleet & Mobility Clients",
                  slides: 26,
                  color: "#0369a1",
                  glow: "#38bdf8",
                  dark: "#001020",
                  img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=70",
                  alt: "Fuel station at dusk",
                  desc: "Fuel, CNG, EV charging and the Waqood smart system — one energy partner for fleet operators.",
                },
                {
                  to: "/presentations/agriculture-clients",
                  title: "Agriculture Clients",
                  slides: 27,
                  color: "#15803d",
                  glow: "#84cc16",
                  dark: "#052e16",
                  img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=70",
                  alt: "Green farm field at sunrise",
                  desc: "Water, solar, BESS and CNG for agri-businesses — cut energy cost, secure water, boost yield.",
                },
                {
                  to: "/presentations/industrial-clients",
                  title: "Industrial Clients",
                  slides: 32,
                  color: "#c2410c",
                  glow: "#f59e0b",
                  dark: "#1c0700",
                  img: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1200&q=70",
                  alt: "Industrial plant machinery",
                  desc: "CNG, electricity, gas, CHP, solar PV and BESS — reliability, efficiency and decarbonisation.",
                },
                {
                  to: "/presentations/residential-clients",
                  title: "Residential Clients",
                  slides: 36,
                  color: "#7c3aed",
                  glow: "#c4b5fd",
                  dark: "#1e0a3c",
                  img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=70",
                  alt: "Modern residential compound",
                  desc: "CNG, electricity, water, gas, diesel back-up, EV chargers and solar PV for developers and communities.",
                },
              ].map(p => (
                <Link
                  key={p.to}
                  to={p.to}
                  className="group relative block rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-40 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${p.dark}, ${p.color})` }}>
                    <img src={p.img} alt={p.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${p.dark}f2, ${p.dark}66 45%, transparent)` }} />
                    <span className="absolute top-3 right-3 text-white/90 text-[10px] font-semibold px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20">Jun 2026</span>
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-display text-white text-xl font-bold leading-tight drop-shadow">{p.title}</h3>
                      <p className="text-[11px] font-semibold mt-1" style={{ color: p.glow }}>Client Presentation · {p.slides} slides</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-start justify-between gap-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold mt-0.5 whitespace-nowrap" style={{ color: p.color }}>
                      Open deck <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {cat.id === "analytics" && (
          <div className="animate-fade-in-up">
            <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-[#002060]">TAQA Analytics</span>
              <span className="text-border">·</span>
              <span>Internal business intelligence and client portfolio dashboards.</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Link to="/analytics/taqa" className="block group">
                <div className="relative h-full rounded-xl border bg-white p-6 shadow-sm overflow-hidden hover:shadow-md hover:border-amber-400/40 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-amber-50 text-amber-700">Analytics</span>
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-[#E8A020]">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-[#002060] text-base leading-snug">TAQA Arabia Dashboard</h3>
                  <p className="text-[11px] text-amber-700 font-medium mt-0.5 mb-2.5">Business Intelligence</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Client portfolio maps across Gas, Master Gas, Petroleum, Electricity and Water. Geographic distribution, sector breakdown and client analytics.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}
        {cat.id === "directory" && (
          <div className="animate-fade-in-up">
            <DirectoryPanel />
          </div>
        )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-[#002060] text-white/40 text-xs py-6 mt-auto">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img
              src={taqaLogo}
              alt=""
              className="h-6 w-auto rounded opacity-60"
            />
            <span>© 2026 TAQA Arabia — Confidential, Internal Use Only</span>
          </div>
          <span className="text-white/25">Financial Models Platform v2.0</span>
        </div>
      </footer>
    </div>
  );
}
