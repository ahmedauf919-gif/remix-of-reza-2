import { useMemo, useState } from "react";
import { ClientRecord, countBy, GOVERNORATE_COORDS, CHART_COLORS } from "@/data/taqa/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Search, X } from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const EGYPT_CENTER: [number, number] = [26.5, 30.0];
const SAT_TILES = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const LABEL_TILES = "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png";

function openGoogleMaps(govName: string) {
  const coords = GOVERNORATE_COORDS[govName];
  if (!coords) return;
  window.open(`https://www.google.com/maps?q=${coords.latLng[0]},${coords.latLng[1]}&z=10`, "_blank");
}

// Stat Card
export function StatCard({ label, value, icon, badge }: { label: string; value: number | string; icon?: React.ReactNode; badge?: string }) {
  return (
    <div className="glass-card stat-glow rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-slate-600 text-sm">{icon}{label}</div>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold" style={{ color: "hsl(var(--tab-theme))" }}>{value}</span>
        {badge && <span className="text-xs text-slate-500 bg-slate-100 rounded-lg px-2 py-1">{badge}</span>}
      </div>
    </div>
  );
}

// Bar Chart Component
export function SectorBarChart({ data, title }: { data: { name: string; count: number }[]; title: string }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-slate-800 font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 28)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 15% 88%)" />
          <XAxis type="number" tick={{ fill: "#475569", fontSize: 11 }} />
          <YAxis dataKey="name" type="category" width={150} tick={{ fill: "#475569", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#1e293b" }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            <LabelList dataKey="count" position="right" fill="#334155" fontSize={11} fontWeight="bold" />
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Simple Satellite Egypt Map
export function EgyptMap({ data, title }: { data: { name: string; count: number }[]; title: string }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-slate-800 font-semibold mb-2">{title}</h3>
      <p className="text-xs text-slate-500 mb-3">Click any marker to open in Google Maps</p>
      <div style={{ height: 420, borderRadius: 8, overflow: "hidden", zIndex: 0, position: "relative" }}>
        <MapContainer center={EGYPT_CENTER} zoom={5} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
          <TileLayer url={SAT_TILES} attribution="ESRI World Imagery" />
          <TileLayer url={LABEL_TILES} attribution="CartoDB" />
          {data.map(d => {
            const coords = GOVERNORATE_COORDS[d.name];
            if (!coords) return null;
            const r = 8 + (d.count / maxCount) * 18;
            return (
              <CircleMarker
                key={d.name}
                center={coords.latLng as [number, number]}
                radius={r}
                fillColor="hsl(195, 90%, 48%)"
                color="#ffffff"
                weight={1.5}
                fillOpacity={0.8}
                eventHandlers={{ click: () => openGoogleMaps(d.name) }}
              >
                <LTooltip permanent={false} direction="top">
                  <span className="font-semibold">{d.name}</span>: {d.count}
                </LTooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

// Dual-layer Satellite Map (CNG stations + MCNG)
export function DualEgyptMap({ stationsData, mcngData, title }: {
  stationsData: { name: string; count: number }[];
  mcngData: { name: string; count: number }[];
  title: string;
}) {
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
      <h3 className="text-slate-800 font-semibold mb-2">{title}</h3>
      <div className="flex gap-4 mb-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "hsl(155, 65%, 40%)" }} /> CNG Stations
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "hsl(38, 92%, 50%)" }} /> MCNG Units
        </div>
      </div>
      <div style={{ height: 420, borderRadius: 8, overflow: "hidden", zIndex: 0, position: "relative" }}>
        <MapContainer center={EGYPT_CENTER} zoom={5} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
          <TileLayer url={SAT_TILES} attribution="ESRI World Imagery" />
          <TileLayer url={LABEL_TILES} attribution="CartoDB" />
          {[...allGovs.entries()].filter(([, v]) => v.stations > 0).map(([name, { stations, mcng }]) => {
            const coords = GOVERNORATE_COORDS[name];
            if (!coords) return null;
            const baseR = 6 + ((stations + mcng) / maxCount) * 16;
            const [lat, lng] = coords.latLng;
            return (
              <CircleMarker
                key={`st-${name}`}
                center={[lat, lng - (mcng > 0 ? 0.18 : 0)] as [number, number]}
                radius={Math.max(6, baseR * 0.7)}
                fillColor="hsl(155, 65%, 40%)"
                color="#fff"
                weight={1.5}
                fillOpacity={0.8}
                eventHandlers={{ click: () => openGoogleMaps(name) }}
              >
                <LTooltip>{name} — CNG Stations: {stations}</LTooltip>
              </CircleMarker>
            );
          })}
          {[...allGovs.entries()].filter(([, v]) => v.mcng > 0).map(([name, { stations, mcng }]) => {
            const coords = GOVERNORATE_COORDS[name];
            if (!coords) return null;
            const baseR = 6 + ((stations + mcng) / maxCount) * 16;
            const [lat, lng] = coords.latLng;
            return (
              <CircleMarker
                key={`mc-${name}`}
                center={[lat, lng + (stations > 0 ? 0.18 : 0)] as [number, number]}
                radius={Math.max(6, baseR * 0.55)}
                fillColor="hsl(38, 92%, 50%)"
                color="#fff"
                weight={1.5}
                fillOpacity={0.8}
                eventHandlers={{ click: () => openGoogleMaps(name) }}
              >
                <LTooltip>{name} — MCNG: {mcng}</LTooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

// Company color mapping
const COMPANY_COLORS: Record<string, string> = {
  "TAQA Gas": "hsl(280, 65%, 55%)",
  "Master Gas": "hsl(155, 65%, 40%)",
  "Petroleum": "hsl(0, 0%, 45%)",
  "Electricity": "hsl(45, 90%, 50%)",
  "Water": "hsl(210, 80%, 55%)",
};

// Consolidated Satellite Map — company-segregated markers with activity breakdown
export function ConsolidatedEgyptMap({ data, allRecords, title }: {
  data: { name: string; count: number }[];
  allRecords: { name: string; service: string; governorate: string; activity: string; company: string }[];
  title: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);

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
      <h3 className="text-slate-800 font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-3 mb-3">
        {Object.entries(COMPANY_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
            {name}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mb-2">Click any marker to see company & activity breakdown</p>
      <div className="relative" style={{ zIndex: 0 }}>
        <div style={{ height: 460, borderRadius: 8, overflow: "hidden" }}>
          <MapContainer center={EGYPT_CENTER} zoom={5} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
            <TileLayer url={SAT_TILES} attribution="ESRI World Imagery" />
            <TileLayer url={LABEL_TILES} attribution="CartoDB" />
            {data.map(d => {
              const coords = GOVERNORATE_COORDS[d.name];
              if (!coords) return null;
              const compMap = govCompanyData.get(d.name);
              if (!compMap) return null;
              const companies = [...compMap.entries()];
              const baseR = 8 + (d.count / maxCount) * 16;
              const isSelected = selected === d.name;
              // Use dominant company's color
              const dominantCompany = companies.reduce((a, b) => a[1].count >= b[1].count ? a : b);
              const color = COMPANY_COLORS[dominantCompany[0]] || "hsl(195,90%,48%)";
              return (
                <CircleMarker
                  key={d.name}
                  center={coords.latLng as [number, number]}
                  radius={isSelected ? baseR + 4 : baseR}
                  fillColor={color}
                  color={isSelected ? "#ffffff" : "rgba(255,255,255,0.6)"}
                  weight={isSelected ? 2.5 : 1.5}
                  fillOpacity={isSelected ? 0.95 : 0.75}
                  eventHandlers={{ click: () => setSelected(isSelected ? null : d.name) }}
                >
                  <LTooltip direction="top">
                    <strong>{d.name}</strong> — {d.count} records
                  </LTooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {selected && selectedInfo && (
          <div
            className="absolute top-2 right-2 w-72 rounded-xl p-4 shadow-xl z-[1000] max-h-[440px] overflow-y-auto scrollbar-thin"
            style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-800 font-bold text-sm">{selected}</h4>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-500 mb-3">Total records: {selectedInfo.total}</p>
            {selectedInfo.companies.map(c => (
              <div key={c.company} className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ background: COMPANY_COLORS[c.company] }} />
                  <span className="text-xs font-semibold text-slate-800">{c.company}</span>
                  <span className="text-xs text-slate-500">({c.count})</span>
                </div>
                <ul className="mt-1 space-y-0.5 ml-4">
                  {c.activities.map(a => (
                    <li key={a} className="text-xs text-slate-600 pl-2 border-l-2" style={{ borderColor: COMPANY_COLORS[c.company] }}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={() => openGoogleMaps(selected)}
              className="mt-2 w-full text-xs py-1.5 rounded-lg text-white transition-colors"
              style={{ background: "hsl(var(--tab-theme))" }}
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

  const selectStyle: React.CSSProperties = {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    outline: "none",
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-slate-800 font-semibold">Portfolio ({filtered.length})</h3>
        <div className="flex items-center flex-wrap gap-2">
          <select value={govFilter} onChange={e => { setGovFilter(e.target.value); setPage(0); }} style={selectStyle}>
            <option value="">All Governorates</option>
            {governorates.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={actFilter} onChange={e => { setActFilter(e.target.value); setPage(0); }} style={selectStyle}>
            <option value="">All Activities</option>
            {activities.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          {hasService && (
            <select value={serviceFilter} onChange={e => { setServiceFilter(e.target.value); setPage(0); }} style={selectStyle}>
              <option value="">All Services</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="pl-9 pr-3 py-1.5 rounded-lg text-sm text-slate-800 outline-none focus:ring-1 focus:ring-blue-300"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
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
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 text-slate-600 font-medium">#</th>
              {columns.map(c => (
                <th key={c} className="text-left py-2 px-3 text-slate-600 font-medium">{colLabels[c]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3 text-slate-500">{page * perPage + i + 1}</td>
                {columns.map(c => (
                  <td key={c} className="py-2 px-3 text-slate-800">{r[c]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 rounded text-slate-700 text-sm disabled:opacity-40" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>Prev</button>
          <span className="text-slate-500 text-sm">{page + 1} / {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page >= pages - 1} className="px-3 py-1 rounded text-slate-700 text-sm disabled:opacity-40" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>Next</button>
        </div>
      )}
    </div>
  );
}
