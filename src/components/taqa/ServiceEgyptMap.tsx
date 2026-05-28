import { useMemo, useState } from "react";
import { ClientRecord, GOVERNORATE_COORDS } from "@/data/taqa/types";
import { X } from "lucide-react";

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
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-3 mb-3">
        {Object.entries(SERVICE_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
            {name}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-2">Click any governorate to see service & activity breakdown</p>
      <div className="relative">
        <svg viewBox="0 0 500 520" className="w-full max-h-[500px]">
          <path d="M 100,88 L 145,93 L 195,97 L 220,95 C 232,86 250,79 268,78 C 280,80 290,85 305,88 L 325,91 L 348,93 L 365,95 L 374,108 L 384,135 L 392,165 L 396,195 L 394,220 L 389,242 L 383,250 L 376,242 L 369,222 L 363,198 L 359,172 L 357,148 L 357,128 L 359,110 L 352,102 L 342,98 L 340,108 L 338,125 L 338,145 L 340,168 L 344,192 L 350,218 L 358,248 L 368,280 L 378,312 L 388,345 L 396,378 L 404,410 L 412,445 L 418,480 L 420,490 L 80,490 L 80,88 Z" fill="hsl(220,20%,12%)" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.6" />
          <path d="M 275,470 C 270,440 265,420 262,400 C 260,380 268,360 272,340 C 276,310 280,285 285,260 C 288,240 292,220 298,205 L 310,195" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="2" opacity="0.3" />
          <path d="M 310,195 C 300,170 280,140 255,100" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.2" />
          <path d="M 310,195 C 308,170 302,140 290,100" fill="none" stroke="hsl(var(--tab-theme))" strokeWidth="1.5" opacity="0.2" />
          {govTotals.map(d => {
            const coords = GOVERNORATE_COORDS[d.name];
            if (!coords) return null;
            const svcMap = govServiceData.get(d.name);
            if (!svcMap) return null;
            const isSelected = selected === d.name;
            const services = [...svcMap.entries()];
            const baseR = 10 + (d.count / maxCount) * 18;
            const angleStep = (2 * Math.PI) / Math.max(services.length, 1);
            const spread = services.length > 1 ? Math.min(12, 6 + services.length * 2) : 0;

            return (
              <g key={d.name} onClick={() => setSelected(isSelected ? null : d.name)} className="cursor-pointer" role="button">
                {isSelected && <circle cx={coords.svg[0]} cy={coords.svg[1]} r={baseR + spread + 6} fill="none" stroke="hsl(0,0%,100%)" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 2" />}
                {services.map(([service, { count }], i) => {
                  const angle = angleStep * i - Math.PI / 2;
                  const cx = coords.svg[0] + Math.cos(angle) * spread;
                  const cy = coords.svg[1] + Math.sin(angle) * spread;
                  const r = Math.max(6, 5 + (count / maxCount) * 14);
                  const color = SERVICE_COLORS[service] || "hsl(0,0%,60%)";
                  return (
                    <g key={service}>
                      <circle cx={cx} cy={cy} r={r} fill={color} opacity={isSelected ? 0.9 : 0.6} />
                      <text x={cx} y={cy + 3} textAnchor="middle" fill="hsl(0,0%,100%)" fontSize="7" fontWeight="bold">{count}</text>
                    </g>
                  );
                })}
                <text x={coords.svg[0]} y={coords.svg[1] - baseR - spread - 2} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">{d.name}</text>
              </g>
            );
          })}
        </svg>

        {selected && selectedInfo && (
          <div className="absolute top-2 right-2 w-72 bg-popover border border-border rounded-xl p-4 shadow-xl z-10 max-h-[480px] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold text-sm">{selected}</h4>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Total records: {selectedInfo.total}</p>
            {selectedInfo.services.map(s => (
              <div key={s.service} className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: SERVICE_COLORS[s.service] }} />
                  <span className="text-xs font-semibold text-white">{s.service}</span>
                  <span className="text-xs text-muted-foreground">({s.count})</span>
                </div>
                <ul className="mt-1 space-y-0.5 ml-4">
                  {s.activities.map(a => (
                    <li key={a} className="text-xs text-muted-foreground pl-2 border-l-2" style={{ borderColor: SERVICE_COLORS[s.service] }}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={() => openGoogleMaps(selected)} className="mt-2 w-full text-xs py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              Open in Google Maps ↗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
