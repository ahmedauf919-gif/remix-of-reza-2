export interface ClientRecord {
  name: string;
  service: string;
  governorate: string;
  activity: string;
}

export function parseRecords(raw: string, defaultService?: string): ClientRecord[] {
  return raw.trim().split('\n').filter(l => l.trim()).map(l => {
    const parts = l.split('|');
    if (defaultService) {
      return { name: parts[0], service: defaultService, governorate: parts[1], activity: parts[2] };
    }
    return { name: parts[0], service: parts[1], governorate: parts[2], activity: parts[3] };
  });
}

export function countBy(records: ClientRecord[], key: keyof ClientRecord): { name: string; count: number }[] {
  const map = new Map<string, number>();
  records.forEach(r => map.set(r[key], (map.get(r[key]) || 0) + 1));
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// SVG coords + Google Maps lat/lng
export const GOVERNORATE_COORDS: Record<string, { svg: [number, number]; latLng: [number, number] }> = {
  "Cairo": { svg: [310, 195], latLng: [30.0444, 31.2357] },
  "Giza": { svg: [290, 200], latLng: [30.0131, 31.2089] },
  "Alexandria": { svg: [215, 115], latLng: [31.2001, 29.9187] },
  "Suez": { svg: [345, 190], latLng: [29.9668, 32.5498] },
  "Beni Suef": { svg: [295, 245], latLng: [29.0661, 31.0994] },
  "Minya": { svg: [280, 300], latLng: [28.0871, 30.7618] },
  "Asyut": { svg: [270, 360], latLng: [27.1783, 31.1859] },
  "Sohag": { svg: [260, 400], latLng: [26.5569, 31.6948] },
  "Red Sea": { svg: [380, 320], latLng: [25.0694, 34.3032] },
  "Damietta": { svg: [305, 105], latLng: [31.4175, 31.8144] },
  "Kafr El Sheikh": { svg: [265, 110], latLng: [31.1117, 30.9388] },
  "Monufia": { svg: [275, 140], latLng: [30.5972, 30.9876] },
  "Qalyubia": { svg: [300, 155], latLng: [30.3292, 31.2422] },
  "Beheira": { svg: [230, 130], latLng: [30.8481, 30.3436] },
  "Gharbia": { svg: [280, 120], latLng: [30.8754, 31.0335] },
  "Dakahlia": { svg: [295, 120], latLng: [31.0409, 31.3785] },
  "Sharqia": { svg: [315, 140], latLng: [30.7327, 31.7195] },
  "Ismailia": { svg: [340, 155], latLng: [30.5965, 32.2715] },
  "Fayoum": { svg: [270, 230], latLng: [29.3084, 30.8428] },
  "South Sinai": { svg: [390, 230], latLng: [28.4917, 33.8000] },
  "Port Said": { svg: [340, 110], latLng: [31.2653, 32.3019] },
  "New Valley": { svg: [200, 380], latLng: [25.4390, 30.5586] },
  "Matrouh": { svg: [140, 115], latLng: [31.3543, 27.2373] },
};

export const CHART_COLORS = [
  "hsl(195, 90%, 48%)",
  "hsl(38, 92%, 50%)",
  "hsl(160, 70%, 45%)",
  "hsl(280, 65%, 55%)",
  "hsl(350, 70%, 55%)",
  "hsl(210, 80%, 55%)",
  "hsl(120, 60%, 45%)",
  "hsl(30, 80%, 55%)",
  "hsl(250, 60%, 55%)",
  "hsl(0, 70%, 55%)",
  "hsl(180, 60%, 45%)",
  "hsl(60, 70%, 50%)",
];
