import { useMemo, useState } from "react";
import { taqaGasData } from "@/data/taqa/taqaGas";
import { masterGasData } from "@/data/taqa/masterGas";
import { petroleumData } from "@/data/taqa/petroleum";
import { electricityData } from "@/data/taqa/electricity";
import { waterData } from "@/data/taqa/water";
import { CHART_COLORS } from "@/data/taqa/types";
import {
  Building2,
  Factory,
  Hotel,
  Utensils,
  Pill,
  Cog,
  Hammer,
  Leaf,
  Droplet,
  ShoppingBag,
  Fuel,
  Zap,
  Flame,
  Car,
  Home,
  Wrench,
  Layers,
} from "lucide-react";

type Row = { name: string; service: string; governorate: string; activity: string; company: string };

const COMPANY_META: Record<string, { color: string; icon: JSX.Element; services: string[] }> = {
  "Gas": {
    color: "hsl(38, 92%, 50%)",
    icon: <Flame className="w-4 h-4" />,
    services: ["Natural Gas Distribution", "Gas Engineering & Construction"],
  },
  "Master Gas": {
    color: "hsl(160, 70%, 45%)",
    icon: <Fuel className="w-4 h-4" />,
    services: ["CNG Vehicle Distribution", "Mobile CNG Units", "Conversion Centers"],
  },
  "Petroleum": {
    color: "hsl(280, 65%, 55%)",
    icon: <Car className="w-4 h-4" />,
    services: ["Petroleum Products Distribution", "Fuel Stations Operations"],
  },
  "Electricity": {
    color: "hsl(195, 90%, 48%)",
    icon: <Zap className="w-4 h-4" />,
    services: ["MV Distribution", "LV Distribution", "Power Generation", "Solar PV Plants", "O&M"],
  },
  "Water": {
    color: "hsl(210, 80%, 55%)",
    icon: <Droplet className="w-4 h-4" />,
    services: ["Water Desalination", "Water Treatment"],
  },
};

const ACTIVITY_ICONS: Record<string, JSX.Element> = {
  "Hotels": <Hotel className="w-5 h-5" />,
  "Food Industries": <Utensils className="w-5 h-5" />,
  "Pharmaceuticals": <Pill className="w-5 h-5" />,
  "Engineering Industries": <Cog className="w-5 h-5" />,
  "Iron & Steel": <Hammer className="w-5 h-5" />,
  "Cement": <Layers className="w-5 h-5" />,
  "Brick Kilns": <Hammer className="w-5 h-5" />,
  "Ceramics & Porcelain": <Layers className="w-5 h-5" />,
  "Other Industries": <Factory className="w-5 h-5" />,
  "Petroleum Products": <Fuel className="w-5 h-5" />,
  "Natural Gas Products": <Flame className="w-5 h-5" />,
  "Residential Complex": <Home className="w-5 h-5" />,
  "Water Plant": <Droplet className="w-5 h-5" />,
  "Shopping Center": <ShoppingBag className="w-5 h-5" />,
  "Other Services": <Wrench className="w-5 h-5" />,
};

function iconFor(activity: string) {
  return ACTIVITY_ICONS[activity] || <Building2 className="w-5 h-5" />;
}

export function ClientsOverviewTab() {
  const allData = useMemo<Row[]>(() => [
    ...taqaGasData.map(r => ({ ...r, company: "Gas" })),
    ...masterGasData.map(r => ({ ...r, company: "Master Gas" })),
    ...petroleumData.map(r => ({ ...r, company: "Petroleum" })),
    ...electricityData.map(r => ({ ...r, company: "Electricity" })),
    ...waterData.map(r => ({ ...r, company: "Water" })),
  ], []);

  const companies = useMemo(() => Array.from(new Set(allData.map(r => r.company))), [allData]);
  const [selectedCompany, setSelectedCompany] = useState<string>("All");

  const filtered = useMemo(
    () => selectedCompany === "All" ? allData : allData.filter(r => r.company === selectedCompany),
    [allData, selectedCompany]
  );

  // Aggregate activities
  const activityMap = useMemo(() => {
    const map = new Map<string, { count: number; companies: Set<string> }>();
    filtered.forEach(r => {
      const existing = map.get(r.activity) || { count: 0, companies: new Set<string>() };
      existing.count++;
      existing.companies.add(r.company);
      map.set(r.activity, existing);
    });
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, count: v.count, companies: Array.from(v.companies) }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  const totalClients = filtered.length;
  const totalActivities = activityMap.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero header */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, hsl(195,90%,48%) 0%, transparent 40%), radial-gradient(circle at 80% 70%, hsl(38,92%,50%) 0%, transparent 45%)",
          }}
        />
        <div className="relative">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Who We Serve</h2>
          <p className="text-white/70 max-w-2xl">
            A panoramic look at the industries and communities powered by TAQA Arabia — across gas,
            electricity, petroleum, water and CNG.
          </p>
          <div className="flex flex-wrap gap-6 mt-6">
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wider">Total Clients</div>
              <div className="text-3xl font-bold" style={{ color: "hsl(var(--tab-theme))" }}>{totalClients.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wider">Industries / Activities</div>
              <div className="text-3xl font-bold" style={{ color: "hsl(var(--tab-theme))" }}>{totalActivities}</div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wider">Companies</div>
              <div className="text-3xl font-bold" style={{ color: "hsl(var(--tab-theme))" }}>{companies.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Company filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCompany("All")}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            selectedCompany === "All"
              ? "bg-white text-black border-white"
              : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
          }`}
        >
          All Portfolio
        </button>
        {companies.map(c => {
          const meta = COMPANY_META[c];
          const active = selectedCompany === c;
          return (
            <button
              key={c}
              onClick={() => setSelectedCompany(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                active ? "text-black border-transparent" : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
              }`}
              style={active ? { background: meta?.color } : undefined}
            >
              {meta?.icon}
              {c}
            </button>
          );
        })}
      </div>

      {/* Services provided per company */}
      <div>
        <h3 className="text-white text-lg font-semibold mb-3">Services Provided</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(selectedCompany === "All" ? companies : [selectedCompany]).map(c => {
            const meta = COMPANY_META[c];
            return (
              <div key={c} className="glass-card rounded-xl p-5 border-l-4" style={{ borderLeftColor: meta?.color }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-2 rounded-lg" style={{ background: `${meta?.color}33`, color: meta?.color }}>
                    {meta?.icon}
                  </span>
                  <h4 className="text-white font-bold">{c}</h4>
                </div>
                <ul className="space-y-1.5">
                  {meta?.services.map(s => (
                    <li key={s} className="text-white/80 text-sm flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity / Industry cards */}
      <div>
        <h3 className="text-white text-lg font-semibold mb-3">Client Industries & Activities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {activityMap.map((a, i) => {
            const color = CHART_COLORS[i % CHART_COLORS.length];
            return (
              <div
                key={a.name}
                className="glass-card rounded-xl p-4 hover:scale-[1.02] transition-transform relative overflow-hidden"
              >
                <div
                  className="absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-20"
                  style={{ background: color }}
                />
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center p-2 rounded-lg mb-3"
                    style={{ background: `${color}33`, color }}
                  >
                    {iconFor(a.name)}
                  </div>
                  <div className="text-white font-semibold text-sm leading-tight mb-1">{a.name}</div>
                  <div className="text-2xl font-bold" style={{ color }}>{a.count}</div>
                  <div className="text-white/50 text-xs mt-1">clients</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {a.companies.map(c => (
                      <span
                        key={c}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity by company matrix */}
      <div className="glass-card rounded-xl p-5 overflow-x-auto">
        <h3 className="text-white font-semibold mb-4">Activity Coverage by Company</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/60 text-left border-b border-white/10">
              <th className="py-2 pr-4">Activity</th>
              {companies.map(c => (
                <th key={c} className="py-2 px-3 text-center">{c}</th>
              ))}
              <th className="py-2 px-3 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {activityMap.map(a => {
              const perCompany = companies.map(c =>
                allData.filter(r => r.activity === a.name && r.company === c).length
              );
              return (
                <tr key={a.name} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 pr-4 text-white">{a.name}</td>
                  {perCompany.map((n, i) => (
                    <td key={i} className="py-2 px-3 text-center">
                      {n > 0 ? (
                        <span className="inline-block min-w-[28px] px-2 py-0.5 rounded text-xs font-semibold"
                          style={{ background: `${COMPANY_META[companies[i]]?.color}33`, color: COMPANY_META[companies[i]]?.color }}>
                          {n}
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                  ))}
                  <td className="py-2 px-3 text-center text-white font-bold">{a.count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
