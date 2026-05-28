import { useMemo, useState } from "react";
import { ClientRecord, countBy, GOVERNORATE_COORDS, CHART_COLORS } from "@/data/taqa/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Search, X } from "lucide-react";

// Stat Card
export function StatCard({ label, value, icon, badge }: { label: string; value: number | string; icon?: React.ReactNode; badge?: string }) {
  return (
    <div className="glass-card stat-glow rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-white text-sm">{icon}{label}</div>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold" style={{ color: "hsl(var(--tab-theme))" }}>{value}</span>
        {badge && <span className="text-xs text-white/60 bg-white/10 rounded-lg px-2 py-1">{badge}</span>}
      </div>
    </div>
  );
}

// Bar Chart Component
export function SectorBarChart({ data, title }: { data: { name: string; count: number }[]; title: string }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 28)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
          <XAxis type="number" tick={{ fill: "#ffffff", fontSize: 11 }} />
          <YAxis dataKey="name" type="category" width={150} tick={{ fill: "#ffffff", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: "hsl(220,20%,12%)", border: "1px solid hsl(220,15%,20%)", borderRadius: 8, color: "hsl(210,20%,90%)" }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            <LabelList dataKey="count" position="right" fill="#ffffff" fontSize={11} fontWeight="bold" />
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function openGoogleMaps(govName: string) {
  const coords = GOVERNORATE_COORDS[govName];
  if (!coords) return;
  window.open(`https://www.google.com/maps?q=${coords.latLng[0]},${coords.latLng[1]}&z=10`, "_blank");
}

// Egypt Map - clickable markers open Google Maps
export function EgyptMap({ data, title }: { data: { name: string; count: number }[]; title: string }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <p className="text-xs text-muted-foreground mb-2">Click any marker to open in Google Maps</p>
      <svg viewBox="0 0 500 520" className="w-full max-h-[500px]">
        <path
          d="M 100,88 L 145,93 L 195,97 L 220,95 C 232,86 250,79 268,78 C 280,80 290,85 305,88 L 325,91 L 348,93 L 365,95 L 374,108 L 384,135 L 392,165 L 396,195 L 394,220 L 389,242 L 383,250 L 376,242 L 369,222 L 363,198 L 359,172 L 357,148 L 357,128 L 359,110 L 352,102 L 342,98 L 340,108 L 338,125 L 338,145 L 340,168 L 344,192 L 350,218 L 358,248 L 368,280 L 378,312 L 388,345 L 396,378 L 404,410 L 412,445 L 418,480 L 420,490 L 80,490 L 80,88 Z"
          fill="hsl(220,20%,12%)" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.6"
        />
        <path d="M 275,470 C 270,440 265,420 262,400 C 260,380 268,360 272,340 C 276,310 280,285 285,260 C 288,240 292,220 298,205 L 310,195" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="2" opacity="0.3" />
        <path d="M 310,195 C 300,170 280,140 255,100" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.2" />
        <path d="M 310,195 C 308,170 302,140 290,100" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.2" />
        {data.map(d => {
          const coords = GOVERNORATE_COORDS[d.name];
          if (!coords) return null;
          const r = 8 + (d.count / maxCount) * 22;
          return (
            <g key={d.name} onClick={() => openGoogleMaps(d.name)} className="cursor-pointer" role="button">
              <circle cx={coords.svg[0]} cy={coords.svg[1]} r={r} fill="hsl(var(--tab-theme))" opacity="0.3" />
              <circle cx={coords.svg[0]} cy={coords.svg[1]} r={r * 0.6} fill="hsl(var(--tab-theme))" opacity="0.6" />
              <text x={coords.svg[0]} y={coords.svg[1] - r - 4} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">{d.name}</text>
              <text x={coords.svg[0]} y={coords.svg[1] + 4} textAnchor="middle" fill="hsl(0,0%,100%)" fontSize="9" fontWeight="bold">{d.count}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Dual-layer Egypt Map (stations + MCNG) - clickable markers open Google Maps
export function DualEgyptMap({ stationsData, mcngData, title }: { stationsData: { name: string; count: number }[]; mcngData: { name: string; count: number }[]; title: string }) {
  const allGovs = useMemo(() => {
    const map = new Map<string, { stations: number; mcng: number }>();
    stationsData.forEach(d => map.set(d.name, { stations: d.count, mcng: 0 }));
    mcngData.forEach(d => {
      const existing = map.get(d.name) || { stations: 0, mcng: 0 };
      existing.mcng = d.count;
      map.set(d.name, existing);
    });
    return map;
  }, [stationsData, mcngData]);

  const maxCount = Math.max(...[...allGovs.values()].map(v => v.stations + v.mcng), 1);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <div className="flex gap-4 mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "hsl(155, 65%, 40%)" }} /> CNG Stations
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "hsl(38, 92%, 50%)" }} /> MCNG Units
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-2">Click any marker to open in Google Maps</p>
      <svg viewBox="0 0 500 520" className="w-full max-h-[500px]">
        <path d="M 100,88 L 145,93 L 195,97 L 220,95 C 232,86 250,79 268,78 C 280,80 290,85 305,88 L 325,91 L 348,93 L 365,95 L 374,108 L 384,135 L 392,165 L 396,195 L 394,220 L 389,242 L 383,250 L 376,242 L 369,222 L 363,198 L 359,172 L 357,148 L 357,128 L 359,110 L 352,102 L 342,98 L 340,108 L 338,125 L 338,145 L 340,168 L 344,192 L 350,218 L 358,248 L 368,280 L 378,312 L 388,345 L 396,378 L 404,410 L 412,445 L 418,480 L 420,490 L 80,490 L 80,88 Z" fill="hsl(220,20%,12%)" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.6" />
        <path d="M 275,470 C 270,440 265,420 262,400 C 260,380 268,360 272,340 C 276,310 280,285 285,260 C 288,240 292,220 298,205 L 310,195" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="2" opacity="0.3" />
        <path d="M 310,195 C 300,170 280,140 255,100" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.2" />
        <path d="M 310,195 C 308,170 302,140 290,100" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.2" />
        {[...allGovs.entries()].map(([name, { stations, mcng }]) => {
          const coords = GOVERNORATE_COORDS[name];
          if (!coords) return null;
          const total = stations + mcng;
          const r = 8 + (total / maxCount) * 22;
          return (
            <g key={name} onClick={() => openGoogleMaps(name)} className="cursor-pointer" role="button">
              {stations > 0 && (
                <>
                  <circle cx={coords.svg[0] - (mcng > 0 ? 8 : 0)} cy={coords.svg[1]} r={Math.max(6, r * 0.7)} fill="hsl(155, 65%, 40%)" opacity="0.5" />
                  <text x={coords.svg[0] - (mcng > 0 ? 8 : 0)} y={coords.svg[1] + 4} textAnchor="middle" fill="hsl(0,0%,100%)" fontSize="8" fontWeight="bold">{stations}</text>
                </>
              )}
              {mcng > 0 && (
                <>
                  <circle cx={coords.svg[0] + (stations > 0 ? 8 : 0)} cy={coords.svg[1]} r={Math.max(6, r * 0.5)} fill="hsl(38, 92%, 50%)" opacity="0.5" />
                  <text x={coords.svg[0] + (stations > 0 ? 8 : 0)} y={coords.svg[1] + 4} textAnchor="middle" fill="hsl(0,0%,100%)" fontSize="8" fontWeight="bold">{mcng}</text>
                </>
              )}
              <text x={coords.svg[0]} y={coords.svg[1] - r - 2} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">{name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Company color mapping
const COMPANY_COLORS: Record<string, string> = {
  "TAQA Gas": "hsl(280, 65%, 55%)",
  "Master Gas": "hsl(155, 65%, 40%)",
  "Petroleum": "hsl(0, 0%, 55%)",
  "Electricity": "hsl(45, 90%, 50%)",
  "Water": "hsl(210, 80%, 55%)",
};

// Consolidated Egypt Map - company-segregated markers with activity breakdown
export function ConsolidatedEgyptMap({ data, allRecords, title }: {
  data: { name: string; count: number }[];
  allRecords: { name: string; service: string; governorate: string; activity: string; company: string }[];
  title: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  // Group records by governorate then by company
  const govCompanyData = useMemo(() => {
    const map = new Map<string, Map<string, { count: number; activities: Set<string> }>>();
    allRecords.forEach(r => {
      if (!map.has(r.governorate)) map.set(r.governorate, new Map());
      const compMap = map.get(r.governorate)!;
      if (!compMap.has(r.company)) compMap.set(r.company, { count: 0, activities: new Set() });
      const entry = compMap.get(r.company)!;
      entry.count++;
      entry.activities.add(r.activity);
    });
    return map;
  }, [allRecords]);

  const maxCount = Math.max(...data.map(d => d.count), 1);

  const selectedInfo = useMemo(() => {
    if (!selected) return null;
    const compMap = govCompanyData.get(selected);
    if (!compMap) return null;
    const total = [...compMap.values()].reduce((s, v) => s + v.count, 0);
    const companies = [...compMap.entries()].map(([company, { count, activities }]) => ({
      company, count, activities: [...activities],
    }));
    return { total, companies };
  }, [selected, govCompanyData]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-3 mb-3">
        {Object.entries(COMPANY_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
            {name}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-2">Click any governorate to see company & activity breakdown</p>
      <div className="relative">
        <svg viewBox="0 0 500 520" className="w-full max-h-[500px]">
          {/* Realistic Egypt outline */}
          <path
            d="M 100,88 L 145,93 L 195,97 L 220,95 C 232,86 250,79 268,78 C 280,80 290,85 305,88 L 325,91 L 348,93 L 365,95 L 374,108 L 384,135 L 392,165 L 396,195 L 394,220 L 389,242 L 383,250 L 376,242 L 369,222 L 363,198 L 359,172 L 357,148 L 357,128 L 359,110 L 352,102 L 342,98 L 340,108 L 338,125 L 338,145 L 340,168 L 344,192 L 350,218 L 358,248 L 368,280 L 378,312 L 388,345 L 396,378 L 404,410 L 412,445 L 418,480 L 420,490 L 80,490 L 80,88 Z"
            fill="hsl(220,20%,12%)" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.6"
          />
          {/* Nile River */}
          <path
            d="M 275,470 C 270,440 265,420 262,400 C 260,380 268,360 272,340 C 276,310 280,285 285,260 C 288,240 292,220 298,205 L 310,195"
            fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="2" opacity="0.3"
          />
          {/* Nile Delta branches */}
          <path d="M 310,195 C 300,170 280,140 255,100" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.2" />
          <path d="M 310,195 C 308,170 302,140 290,100" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.2" />
          {data.map(d => {
            const coords = GOVERNORATE_COORDS[d.name];
            if (!coords) return null;
            const compMap = govCompanyData.get(d.name);
            if (!compMap) return null;
            const isSelected = selected === d.name;
            const companies = [...compMap.entries()];
            const baseR = 10 + (d.count / maxCount) * 18;

            // Arrange company circles around the governorate point
            const angleStep = (2 * Math.PI) / Math.max(companies.length, 1);
            const spread = companies.length > 1 ? Math.min(12, 6 + companies.length * 2) : 0;

            return (
              <g key={d.name} onClick={() => setSelected(isSelected ? null : d.name)} className="cursor-pointer" role="button">
                {/* Selection ring */}
                {isSelected && <circle cx={coords.svg[0]} cy={coords.svg[1]} r={baseR + spread + 6} fill="none" stroke="hsl(0,0%,100%)" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 2" />}
                {/* Company circles */}
                {companies.map(([company, { count }], i) => {
                  const angle = angleStep * i - Math.PI / 2;
                  const cx = coords.svg[0] + Math.cos(angle) * spread;
                  const cy = coords.svg[1] + Math.sin(angle) * spread;
                  const r = Math.max(6, 5 + (count / maxCount) * 14);
                  const color = COMPANY_COLORS[company] || "hsl(0,0%,60%)";
                  return (
                    <g key={company}>
                      <circle cx={cx} cy={cy} r={r} fill={color} opacity={isSelected ? 0.9 : 0.6} />
                      <text x={cx} y={cy + 3} textAnchor="middle" fill="hsl(0,0%,100%)" fontSize="7" fontWeight="bold">{count}</text>
                    </g>
                  );
                })}
                {/* Governorate label */}
                <text x={coords.svg[0]} y={coords.svg[1] - baseR - spread - 2} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">{d.name}</text>
              </g>
            );
          })}
        </svg>

        {/* Detail panel */}
        {selected && selectedInfo && (
          <div className="absolute top-2 right-2 w-72 rounded-xl p-4 shadow-xl z-10 max-h-[480px] overflow-y-auto scrollbar-thin" style={{ background: "hsl(220 20% 14%)", border: "1px solid hsl(220 15% 22%)" }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold text-sm">{selected}</h4>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Total records: {selectedInfo.total}</p>
            {selectedInfo.companies.map(c => (
              <div key={c.company} className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: COMPANY_COLORS[c.company] }} />
                  <span className="text-xs font-semibold text-white">{c.company}</span>
                  <span className="text-xs text-muted-foreground">({c.count})</span>
                </div>
                <ul className="mt-1 space-y-0.5 ml-4">
                  {c.activities.map(a => (
                    <li key={a} className="text-xs text-muted-foreground pl-2 border-l-2" style={{ borderColor: COMPANY_COLORS[c.company] }}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={() => openGoogleMaps(selected)}
              className="mt-2 w-full text-xs py-1.5 rounded-lg text-white/80 hover:text-white transition-colors"
              style={{ background: "hsl(220 20% 22%)" }}
            >
              Open in Google Maps ↗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Records Table
export function RecordsTable({ records, columns }: { records: ClientRecord[]; columns: (keyof ClientRecord)[] }) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [govFilter, setGovFilter] = useState("");
  const [actFilter, setActFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const perPage = 25;

  const hasService = columns.includes("service");
  const governorates = useMemo(() => [...new Set(records.map(r => r.governorate))].sort(), [records]);
  const activities = useMemo(() => [...new Set(records.map(r => r.activity))].sort(), [records]);
  const services = useMemo(() => hasService ? [...new Set(records.map(r => r.service))].sort() : [], [records, hasService]);

  const filtered = useMemo(() => {
    return records.filter(r => {
      if (govFilter && r.governorate !== govFilter) return false;
      if (actFilter && r.activity !== actFilter) return false;
      if (serviceFilter && r.service !== serviceFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!columns.some(c => r[c].toLowerCase().includes(s))) return false;
      }
      return true;
    });
  }, [records, search, columns, govFilter, actFilter, serviceFilter]);

  const pages = Math.ceil(filtered.length / perPage);
  const slice = filtered.slice(page * perPage, (page + 1) * perPage);

  const colLabels: Record<string, string> = {
    name: "Client Name",
    service: "Service",
    governorate: "Governorate",
    activity: "Activity",
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-white font-semibold">Portfolio ({filtered.length})</h3>
        <div className="flex items-center flex-wrap gap-2">
          <select
            value={govFilter}
            onChange={e => { setGovFilter(e.target.value); setPage(0); }}
            className="rounded-lg px-3 py-1.5 text-sm outline-none z-10"
            style={{ background: "hsl(220 20% 18%)", border: "1px solid hsl(220 15% 25%)", color: "#fff" }}
          >
            <option value="">All Governorates</option>
            {governorates.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            value={actFilter}
            onChange={e => { setActFilter(e.target.value); setPage(0); }}
            className="rounded-lg px-3 py-1.5 text-sm outline-none z-10"
            style={{ background: "hsl(220 20% 18%)", border: "1px solid hsl(220 15% 25%)", color: "#fff" }}
          >
            <option value="">All Activities</option>
            {activities.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          {hasService && (
            <select
              value={serviceFilter}
              onChange={e => { setServiceFilter(e.target.value); setPage(0); }}
              className="rounded-lg px-3 py-1.5 text-sm outline-none z-10"
              style={{ background: "hsl(220 20% 18%)", border: "1px solid hsl(220 15% 25%)", color: "#fff" }}
            >
              <option value="">All Services</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="pl-9 pr-3 py-1.5 rounded-lg text-sm text-white outline-none focus:ring-1"
              style={{ background: "hsl(220 20% 18%)", border: "1px solid hsl(220 15% 25%)", "--tw-ring-color": "hsl(var(--tab-theme))" } as React.CSSProperties}
              placeholder="Search..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-white font-medium">#</th>
              {columns.map(c => (
                <th key={c} className="text-left py-2 px-3 text-white font-medium">{colLabels[c]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                <td className="py-2 px-3 text-white">{page * perPage + i + 1}</td>
                {columns.map(c => (
                  <td key={c} className="py-2 px-3 text-white">{r[c]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 rounded text-white text-sm disabled:opacity-40" style={{ background: "hsl(220 20% 18%)" }}>Prev</button>
          <span className="text-white/60 text-sm">{page + 1} / {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page >= pages - 1} className="px-3 py-1 rounded text-white text-sm disabled:opacity-40" style={{ background: "hsl(220 20% 18%)" }}>Next</button>
        </div>
      )}
    </div>
  );
}
