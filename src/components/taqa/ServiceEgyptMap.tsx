import { useMemo, useState } from "react";
import { ClientRecord, GOVERNORATE_COORDS } from "@/data/taqa/types";
import { X } from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SAT_TILES = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const LABEL_TILES = "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png";
const EGYPT_CENTER: [number, number] = [26.5, 30.0];

const SERVICE_LABELS: Record<string, string> = {
  "MV Distribution": "MV Dist",
  "LV Distribution": "LV Dist",
  "Power Generation": "Power Gen",
  "O&M": "O&M",
  "Solar Power Plant": "Solar",
};

const SERVICE_COLORS: Record<string, string> = {
  "MV Dist": "hsl(45, 90%, 50%)",
  "LV Dist": "hsl(30, 85%, 55%)",
  "Power Gen": "hsl(0, 70%, 55%)",
  "O&M": "hsl(210, 80%, 55%)",
  "Solar": "hsl(55, 90%, 50%)",
};

function openGoogleMaps(govName: string) {
  const coords = GOVERNORATE_COORDS[govName];
  if (!coords) return;
  window.open(`https://www.google.com/maps?q=${coords.latLng[0]},${coords.latLng[1]}&z=10`, "_blank");
}

export function ServiceEgyptMap({ records, title }: { records: ClientRecord[]; title: string }) {
  const [selected, setSelected] = useState<string | null>(null);

  const govServiceData = useMemo(() => {
    const map = new Map<string, Map<string, { count: number; activities: Set<string> }>>();
    records.forEach(r => {
      const label = SERVICE_LABELS[r.service] || r.service;
      if (!map.has(r.governorate)) map.set(r.governorate, new Map());
      const svcMap = map.get(r.governorate)!;
      if (!svcMap.has(label)) svcMap.set(label, { count: 0, activities: new Set() });
      const entry = svcMap.get(label)!;
      entry.count++;
      entry.activities.add(r.activity);
    });
    return map;
  }, [records]);

  const govTotals = useMemo(() => {
    return [...govServiceData.entries()].map(([name, svcMap]) => ({
      name,
      count: [...svcMap.values()].reduce((s, v) => s + v.count, 0),
    }));
  }, [govServiceData]);

  const maxCount = Math.max(...govTotals.map(d => d.count), 1);

  const selectedInfo = useMemo(() => {
    if (!selected) return null;
    const svcMap = govServiceData.get(selected);
    if (!svcMap) return null;
    const total = [...svcMap.values()].reduce((s, v) => s + v.count, 0);
    const services = [...svcMap.entries()].map(([service, { count, activities }]) => ({
      service, count, activities: [...activities],
    }));
    return { total, services };
  }, [selected, govServiceData]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-slate-800 font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-3 mb-3">
        {Object.entries(SERVICE_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
            {name}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mb-2">Click any marker to see service & activity breakdown</p>
      <div className="relative" style={{ zIndex: 0 }}>
        <div style={{ height: 440, borderRadius: 8, overflow: "hidden" }}>
          <MapContainer center={EGYPT_CENTER} zoom={5} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
            <TileLayer url={SAT_TILES} attribution="ESRI World Imagery" />
            <TileLayer url={LABEL_TILES} attribution="CartoDB" />
            {govTotals.map(d => {
              const coords = GOVERNORATE_COORDS[d.name];
              if (!coords) return null;
              const svcMap = govServiceData.get(d.name)!;
              const isSelected = selected === d.name;
              // Use dominant service color
              const dominantService = [...svcMap.entries()].reduce((a, b) => a[1].count >= b[1].count ? a : b);
              const color = SERVICE_COLORS[dominantService[0]] || "hsl(195,90%,48%)";
              const r = 8 + (d.count / maxCount) * 18;
              return (
                <CircleMarker
                  key={d.name}
                  center={coords.latLng as [number, number]}
                  radius={isSelected ? r + 4 : r}
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
            className="absolute top-2 right-2 w-72 rounded-xl p-4 shadow-xl z-[1000] max-h-[420px] overflow-y-auto scrollbar-thin"
            style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-800 font-bold text-sm">{selected}</h4>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-500 mb-3">Total records: {selectedInfo.total}</p>
            {selectedInfo.services.map(s => (
              <div key={s.service} className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ background: SERVICE_COLORS[s.service] }} />
                  <span className="text-xs font-semibold text-slate-800">{s.service}</span>
                  <span className="text-xs text-slate-500">({s.count})</span>
                </div>
                <ul className="mt-1 space-y-0.5 ml-4">
                  {s.activities.map(a => (
                    <li key={a} className="text-xs text-slate-600 pl-2 border-l-2" style={{ borderColor: SERVICE_COLORS[s.service] }}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={() => openGoogleMaps(selected)}
              className="mt-2 w-full text-xs py-1.5 rounded-lg text-white transition-colors"
              style={{ background: "hsl(45, 90%, 45%)", color: "#1a1a1a" }}
            >
              Open in Google Maps ↗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
