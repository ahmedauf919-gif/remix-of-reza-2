import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wind, SunMedium, Droplets, Truck, ArrowRight, Plus,
  TrendingUp, Layers, FileDown, Shield, Zap, Briefcase,
  Ruler, Presentation, ChevronRight, BarChart2, Flame, FolderOpen,
  Gauge, Battery, Waves,
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
    count: 4,
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
  const [activeCategory, setActiveCategory] = useState<CategoryId>("investment");
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [dirCount, setDirCount] = useState(0);

  useEffect(() => {
    import("@/lib/directoryStore").then(m => setDirCount(m.loadEntries().length));
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

        {/* Category tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-left rounded-xl border-2 bg-white p-5 shadow-sm
                             transition-all duration-200 animate-fade-in-up
                             ${isActive ? cat.activeAccent + " shadow-md" : "border-border " + cat.accent}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ${cat.iconBg}`}>
                    <Icon className={`h-6 w-6 ${cat.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1.5">
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
                      className={`h-4 w-4 transition-transform duration-200
                                   ${isActive ? "rotate-90 text-[#005298]" : "text-muted-foreground/50"}`}
                    />
                  </div>
                </div>
                <h2 className="font-bold text-[#002060] text-base leading-snug">{cat.label}</h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{cat.description}</p>
              </button>
            );
          })}
        </div>

        {/* ── Panel: Investment Models ── */}
        {activeCategory === "investment" && (
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

        {/* ── Panel: Sizing Models ── */}
        {activeCategory === "sizing" && (
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

              {/* CNG Station Sizing */}
              <div className="relative h-full rounded-xl border bg-white p-6 shadow-sm overflow-hidden border-border opacity-80">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-50 text-emerald-700">
                    Gas
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-emerald-700">
                      <Gauge className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Coming Soon</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#002060] text-base leading-snug">CNG Station Sizing</h3>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5 mb-2.5">Technical Sizing Tool</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Size compressors, cascade storage, dispensers and priority panels based on vehicle count, fill patterns and daily throughput targets.
                  </p>
                </div>
              </div>

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

              {/* BESS Sizing */}
              <div className="relative h-full rounded-xl border bg-white p-6 shadow-sm overflow-hidden border-border opacity-80">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-violet-50 text-violet-700">
                    Storage
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-violet-700">
                      <Battery className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Coming Soon</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#002060] text-base leading-snug">BESS Sizing</h3>
                  <p className="text-[11px] text-violet-700 font-medium mt-0.5 mb-2.5">Technical Sizing Tool</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Calculate battery capacity (MWh) and power (MW) from peak shaving targets, backup hours, depth of discharge and round-trip efficiency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Panel: Client Presentations ── */}
        {activeCategory === "presentations" && (
          <div className="animate-fade-in-up">
            <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Presentation className="h-4 w-4 text-violet-600" />
              <span className="font-medium text-[#002060]">Client Presentations</span>
              <span className="text-border">·</span>
              <span>Investor-ready templates and executive summaries.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Fleet & Mobility Clients */}
              <Link to="/presentations/fleet-mobility-clients" className="block rounded-xl border border-border bg-white hover:shadow-md transition-shadow overflow-hidden group">
                <div className="h-24 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=60" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#001020]/80 to-[#0369a1]/60" />
                  <span className="absolute bottom-2 left-3 text-white text-xs font-semibold">Jun 2026</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#002060] text-sm leading-snug">Fleet &amp; Mobility Clients</h3>
                  <p className="text-[11px] text-[#0369a1] font-medium mt-0.5 mb-2">Client Presentation · 26 slides</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Integrated energy & mobility solutions — fuel, CNG, EV charging and Waqood smart system for fleet operators.</p>
                </div>
              </Link>
              {/* Agriculture Clients */}
              <Link to="/presentations/agriculture-clients" className="block rounded-xl border border-border bg-white hover:shadow-md transition-shadow overflow-hidden group">
                <div className="h-24 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=60" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#052e16]/80 to-[#15803d]/60" />
                  <span className="absolute bottom-2 left-3 text-white text-xs font-semibold">Jun 2026</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#002060] text-sm leading-snug">Agriculture Clients</h3>
                  <p className="text-[11px] text-[#15803d] font-medium mt-0.5 mb-2">Client Presentation · 27 slides</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Water, solar, BESS and CNG solutions for agri-businesses — cut energy cost, ensure water security and boost yield.</p>
                </div>
              </Link>
              {/* Industrial Clients */}
              <Link to="/presentations/industrial-clients" className="block rounded-xl border border-border bg-white hover:shadow-md transition-shadow overflow-hidden group">
                <div className="h-24 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=60" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1c0700]/80 to-[#c2410c]/60" />
                  <span className="absolute bottom-2 left-3 text-white text-xs font-semibold">Jun 2026</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#002060] text-sm leading-snug">Industrial Clients</h3>
                  <p className="text-[11px] text-[#c2410c] font-medium mt-0.5 mb-2">Client Presentation · 32 slides</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">CNG, electricity, gas, CHP, solar PV and BESS for industrial operators — reliability, efficiency and decarbonisation.</p>
                </div>
              </Link>
              {/* Residential Clients */}
              <Link to="/presentations/residential-clients" className="block rounded-xl border border-border bg-white hover:shadow-md transition-shadow overflow-hidden group">
                <div className="h-24 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=60" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1e0a3c]/80 to-[#7c3aed]/60" />
                  <span className="absolute bottom-2 left-3 text-white text-xs font-semibold">Jun 2026</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#002060] text-sm leading-snug">Residential Clients</h3>
                  <p className="text-[11px] text-[#7c3aed] font-medium mt-0.5 mb-2">Client Presentation · 36 slides</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">CNG, electricity, water, gas, diesel, EV chargers and solar PV for residential developers and communities.</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* ── Panel: TAQA Analytics ── */}
        {activeCategory === "analytics" && (
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

        {/* ── Panel: Directory ── */}
        {activeCategory === "directory" && (
          <div className="animate-fade-in-up">
            <DirectoryPanel />
          </div>
        )}

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
