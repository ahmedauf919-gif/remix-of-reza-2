// NABQ Clients Data

export interface TopClient {
  rank: number;
  name: string;
  consumption: number; // kWh
  avgLoad: number; // kW
  percentage: number; // % of total consumption
}

export interface ClientCapacity {
  name: string;
  date: string; // e.g. "Jan-13"
  contractedCapacity: number; // kVA
  avgLoad?: number; // kW
  exceededCapacity?: number; // kVA
}

export interface CapacityExceedance {
  name: string;
  contractedCapacity: number;
  exceededCapacity: number;
}

// Sheet 1: Top 20 Clients by Consumption 2025
export const topClients: TopClient[] = [
  { rank: 1, name: "Radames- Aqua", consumption: 28839016, avgLoad: 3292, percentage: 7 },
  { rank: 2, name: "Grand Azure", consumption: 27160995, avgLoad: 3101, percentage: 6 },
  { rank: 3, name: "Rainbow", consumption: 20524061, avgLoad: 2343, percentage: 5 },
  { rank: 4, name: "Radames -2", consumption: 20049538, avgLoad: 2289, percentage: 5 },
  { rank: 5, name: "IU", consumption: 16763400, avgLoad: 1914, percentage: 4 },
  { rank: 6, name: "Nabq Orintal", consumption: 16352982, avgLoad: 1867, percentage: 4 },
  { rank: 7, name: "Moran", consumption: 15146711, avgLoad: 1729, percentage: 4 },
  { rank: 8, name: "Garden Palace", consumption: 15109513, avgLoad: 1725, percentage: 4 },
  { rank: 9, name: "AlBatros", consumption: 13972535, avgLoad: 1595, percentage: 3 },
  { rank: 10, name: "El-Dahbia", consumption: 13703969, avgLoad: 1564, percentage: 3 },
  { rank: 11, name: "Lagouna Viesta", consumption: 13651861, avgLoad: 1558, percentage: 3 },
  { rank: 12, name: "Nobiaya Village", consumption: 12168873, avgLoad: 1389, percentage: 3 },
  { rank: 13, name: "Grand Azure club", consumption: 11201879, avgLoad: 1279, percentage: 3 },
  { rank: 14, name: "Magic Life", consumption: 10856164, avgLoad: 1239, percentage: 3 },
  { rank: 15, name: "Bab - El- Shams", consumption: 10798351, avgLoad: 1233, percentage: 3 },
  { rank: 16, name: "Coral Sea", consumption: 10503401, avgLoad: 1199, percentage: 2 },
  { rank: 17, name: "Helton", consumption: 9373685, avgLoad: 1070, percentage: 2 },
  { rank: 18, name: "Rehana", consumption: 9194733, avgLoad: 1050, percentage: 2 },
  { rank: 19, name: "Nobia Sharm", consumption: 8311163, avgLoad: 949, percentage: 2 },
  { rank: 20, name: "IU-Tiran", consumption: 8268106, avgLoad: 944, percentage: 2 },
];

// Sheet 2: All Clients Contracted Capacity with dates
export const clientCapacities: ClientCapacity[] = [
  { name: "Grand Azure", date: "Jan-13", contractedCapacity: 8696, avgLoad: 3101, exceededCapacity: 1946 },
  { name: "Grand Azure club", date: "Jan-13", contractedCapacity: 0, avgLoad: 1279 },
  { name: "Sea Club", date: "Jan-13", contractedCapacity: 2717, avgLoad: 782 },
  { name: "Sea Life & Sea Garden", date: "Jan-13", contractedCapacity: 2717, avgLoad: 489 },
  { name: "Magic Life", date: "Jan-13", contractedCapacity: 2717, avgLoad: 1239, exceededCapacity: 429 },
  { name: "Lagouna Viesta", date: "Jan-13", contractedCapacity: 2717, avgLoad: 1558, exceededCapacity: 1425 },
  { name: "Horizon", date: "Jan-13", contractedCapacity: 652, avgLoad: 29 },
  { name: "Palmera", date: "Jan-13", contractedCapacity: 1087, avgLoad: 264 },
  { name: "Zawara", date: "Jan-13", contractedCapacity: 652 },
  { name: "Radamis", date: "Jan-13", contractedCapacity: 4348, avgLoad: 3292, exceededCapacity: 4060 },
  { name: "AL-Batrous", date: "Jan-13", contractedCapacity: 2174, avgLoad: 1595, exceededCapacity: 2005 },
  { name: "Lagonna TDA", date: "Jan-13", contractedCapacity: 1196, avgLoad: 114 },
  { name: "IU", date: "Jan-13", contractedCapacity: 2174, avgLoad: 1914, exceededCapacity: 3326 },
  { name: "Nabq Central", date: "Jan-13", contractedCapacity: 543, avgLoad: 11 },
  { name: "Rehana", date: "Jan-13", contractedCapacity: 1087, avgLoad: 1050, exceededCapacity: 1829 },
  { name: "Misr Tiran", date: "Jan-13", contractedCapacity: 217, avgLoad: 172, exceededCapacity: 233 },
  { name: "Intercontinital", date: "Jan-13", contractedCapacity: 1087, avgLoad: 494, exceededCapacity: 452 },
  { name: "EL-Mawany", date: "Jan-13", contractedCapacity: 543, avgLoad: 21 },
  { name: "Environment", date: "Jan-13", contractedCapacity: 1087, avgLoad: 105 },
  { name: "Napq Mall", date: "Jan-13", contractedCapacity: 543, avgLoad: 105 },
  { name: "Egi Dream", date: "Jan-13", contractedCapacity: 40, avgLoad: 3 },
  { name: "Travco Housing", date: "Jan-13", contractedCapacity: 652, avgLoad: 313, exceededCapacity: 330 },
  { name: "Hilton Sharm", date: "Jan-13", contractedCapacity: 2717, avgLoad: 1070, exceededCapacity: 141 },
  { name: "Oriental", date: "Jan-13", contractedCapacity: 2717, avgLoad: 938 },
  { name: "Dahabia", date: "Jan-13", contractedCapacity: 2174, avgLoad: 1564, exceededCapacity: 2081 },
  { name: "Tower Prestige", date: "Jan-13", contractedCapacity: 8696, avgLoad: 750 },
  { name: "Tower Center", date: "Jan-13", contractedCapacity: 2174, avgLoad: 0 },
  { name: "Sun Moon", date: "Jan-13", contractedCapacity: 1739, avgLoad: 703, exceededCapacity: 446 },
  { name: "Joy", date: "Jan-13", contractedCapacity: 2174, avgLoad: 617 },
  { name: "Nabq Development", date: "Jan-13", contractedCapacity: 1630, avgLoad: 433 },
  { name: "Coral Sea", date: "Jan-13", contractedCapacity: 2174, avgLoad: 1199, exceededCapacity: 993 },
  { name: "Moran", date: "Jan-13", contractedCapacity: 4348, avgLoad: 1729, exceededCapacity: 162 },
  { name: "Rainbow", date: "Jan-13", contractedCapacity: 2000, avgLoad: 2343, exceededCapacity: 4009 },
  { name: "Le Mirage", date: "Jan-13", contractedCapacity: 100, avgLoad: 20 },
  { name: "Hayat Sharm", date: "Jan-13", contractedCapacity: 1087, avgLoad: 97 },
  { name: "Sabina", date: "Jan-13", contractedCapacity: 543, avgLoad: 51 },
  { name: "Sharm Bride", date: "Jan-13", contractedCapacity: 1087, avgLoad: 270 },
  { name: "Plaza", date: "Jan-13", contractedCapacity: 543, avgLoad: 786, exceededCapacity: 1785 },
  { name: "Haskey", date: "Jan-13", contractedCapacity: 543, avgLoad: 46 },
  { name: "Tera", date: "Jan-13", contractedCapacity: 761, avgLoad: 603, exceededCapacity: 797 },
  { name: "Hausa", date: "Jan-13", contractedCapacity: 1304 },
  { name: "Nobian Village", date: "Jan-13", contractedCapacity: 4348, avgLoad: 1389 },
  { name: "Lagonna Garden", date: "Jan-13", contractedCapacity: 1902, avgLoad: 525 },
  { name: "Garden Palace", date: "Jan-13", contractedCapacity: 2174, avgLoad: 1725, exceededCapacity: 2310 },
  { name: "Bab EL-Shams", date: "Jan-13", contractedCapacity: 3913, avgLoad: 1233 },
  { name: "Sharm Residence", date: "Jan-13", contractedCapacity: 1087, avgLoad: 657, exceededCapacity: 989 },
  { name: "Oriental Villa", date: "Jan-13", contractedCapacity: 1087, avgLoad: 135 },
  { name: "Oriental Mall", date: "Jan-13", contractedCapacity: 1087, avgLoad: 66 },
  { name: "Shram Land", date: "Jan-13", contractedCapacity: 2174, avgLoad: 1020, exceededCapacity: 470 },
  { name: "Relantex", date: "Jan-13", contractedCapacity: 6000, avgLoad: 364 },
  { name: "Nabq Sinai", date: "Jan-13", contractedCapacity: 1630, avgLoad: 699, exceededCapacity: 295 },
  { name: "Nobian Sharm", date: "Jan-13", contractedCapacity: 543, avgLoad: 949, exceededCapacity: 2486 },
  { name: "City Stars", date: "Jan-13", contractedCapacity: 76087, avgLoad: 250 },
  { name: "Vodafone", date: "Jan-13", contractedCapacity: 543, avgLoad: 4 },
  { name: "Sharm Up", date: "Jan-13", contractedCapacity: 435, avgLoad: 246, exceededCapacity: 297 },
  { name: "Moon Shah", date: "Jan-13", contractedCapacity: 1630, avgLoad: 55 },
  { name: "Rief Goash", date: "Jan-13", contractedCapacity: 50, avgLoad: 125, exceededCapacity: 351 },
  { name: "Nabq for Touristic Services", date: "Jan-13", contractedCapacity: 50 },
  { name: "Light Sharm", date: "Jan-13", contractedCapacity: 435, avgLoad: 40 },
  { name: "Nabq Oriental (Rixos)", date: "Jan-13", contractedCapacity: 4348, avgLoad: 1867, exceededCapacity: 258 },
  { name: "Maraqia Sharm", date: "Jan-13", contractedCapacity: 800, avgLoad: 296, exceededCapacity: 24 },
  { name: "Pharana Park", date: "Jan-13", contractedCapacity: 543, avgLoad: 416, exceededCapacity: 674 },
  { name: "EL-Qaheria", date: "Jan-13", contractedCapacity: 50, avgLoad: 73, exceededCapacity: 156 },
  { name: "Coral Sea Water Station", date: "Jan-13", contractedCapacity: 700, avgLoad: 209 },
  { name: "Palmes Grand Plaza", date: "Jan-13", contractedCapacity: 50, avgLoad: 3 },
  { name: "Splash", date: "Jan-13", contractedCapacity: 100, avgLoad: 723, exceededCapacity: 1694 },
  { name: "MFO", date: "Jan-13", contractedCapacity: 163, avgLoad: 20 },
  { name: "Lagouna Residence", date: "Jan-13", contractedCapacity: 3261, avgLoad: 120 },
  { name: "Sabah", date: "Jan-13", contractedCapacity: 1087, avgLoad: 176 },
  { name: "Hyber Market White & Night", date: "Jan-13", contractedCapacity: 543, avgLoad: 25 },
  { name: "Dolfina", date: "Jan-13", contractedCapacity: 489, avgLoad: 69 },
  { name: "Ragab Sons", date: "Jan-13", contractedCapacity: 435, avgLoad: 6 },
  { name: "Rehana Housing", date: "Jun-13", contractedCapacity: 3533, avgLoad: 104 },
  { name: "Nabq Oriental Housing", date: "Jun-13", contractedCapacity: 2174, avgLoad: 158 },
  { name: "Policeman Complex", date: "Jan-15", contractedCapacity: 109, avgLoad: 35 },
  { name: "Mona Sharm", date: "Apr-15", contractedCapacity: 54, avgLoad: 141, exceededCapacity: 391 },
  { name: "The Egyptian Mall", date: "Apr-15", contractedCapacity: 109, avgLoad: 161, exceededCapacity: 294 },
  { name: "Nabq Hites", date: "Aug-15", contractedCapacity: 109, avgLoad: 82, exceededCapacity: 132 },
  { name: "Dimound Plaza", date: "Sep-15", contractedCapacity: 4891, avgLoad: 919 },
  { name: "Delmar (Porto Sharm)", date: "Oct-15", contractedCapacity: 2174, avgLoad: 790 },
  { name: "Bab El-Shams Alkaza Housing", date: "Mar-16", contractedCapacity: 109, avgLoad: 151, exceededCapacity: 314 },
  { name: "Concrete Tourism Dev.", date: "Dec-17", contractedCapacity: 50, avgLoad: 58, exceededCapacity: 131 },
  { name: "Palmera Hotels & Resorts", date: "Jan-21", contractedCapacity: 1087, avgLoad: 41 },
  { name: "Nabq Park Residence", date: "Sep-22", contractedCapacity: 22, avgLoad: 90, exceededCapacity: 277 },
  { name: "Shatranj Construction", date: "Jan-21", contractedCapacity: 54, avgLoad: 38, exceededCapacity: 46 },
  { name: "Swan Tourism Dev.", date: "Jan-21", contractedCapacity: 109, avgLoad: 0 },
  { name: "Ministry of Interior", date: "Nov-21", contractedCapacity: 0, avgLoad: 3, exceededCapacity: 9 },
  { name: "Nabq Reserve - Ministry of Environment", date: "Oct-22", contractedCapacity: 5, avgLoad: 0 },
  { name: "Medical Storage", date: "Mar-21", contractedCapacity: 217, avgLoad: 5 },
  { name: "National Bank (Société Générale)", date: "Dec-24", contractedCapacity: 0, avgLoad: 6, exceededCapacity: 17 },
  { name: "Radamis Hotels & Resorts", date: "Jan-24", contractedCapacity: 0, avgLoad: 2289, exceededCapacity: 7430 },
  { name: "Sharm El Sheikh Local Unit", date: "Mar-23", contractedCapacity: 0, avgLoad: 15, exceededCapacity: 39 },
  { name: "Regency Plaza", date: "Jul-24", contractedCapacity: 543, avgLoad: 22 },
  { name: "Infinity e", date: "Jan-24", contractedCapacity: 0, avgLoad: 3, exceededCapacity: 11 },
  { name: "Global Hotels", date: "Dec-25", contractedCapacity: 54 },
  { name: "Golden Flower", date: "Dec-25", contractedCapacity: 54 },
  { name: "Baia Bianka", date: "Dec-25", contractedCapacity: 250 },
  { name: "IU (Dec-25)", date: "Dec-25", contractedCapacity: 1500 },
  { name: "Radamis 1 (Services)", date: "Dec-25", contractedCapacity: 4500 },
  { name: "Radamis 2", date: "Dec-25", contractedCapacity: 20000 },
  { name: "Radamis Village", date: "Dec-25", contractedCapacity: 6000 },
  { name: "Radamis Staff Residence 1", date: "Dec-25", contractedCapacity: 2500 },
  { name: "Radamis Staff Residence 2", date: "Dec-25", contractedCapacity: 2000 },
  { name: "Tamra Beach Staff Residence", date: "Dec-25", contractedCapacity: 1000 },
];

// Sheet 3: Clients Exceeding Contracted Capacity
export const capacityExceedances: CapacityExceedance[] = [
  { name: "Grand Azure", contractedCapacity: 8696, exceededCapacity: 1946 },
  { name: "Magic Life", contractedCapacity: 2717, exceededCapacity: 429 },
  { name: "Lagouna Viesta", contractedCapacity: 2717, exceededCapacity: 1425 },
  { name: "Radamis", contractedCapacity: 4348, exceededCapacity: 4060 },
  { name: "AL-Batrous", contractedCapacity: 2174, exceededCapacity: 2005 },
  { name: "IU", contractedCapacity: 2174, exceededCapacity: 3326 },
  { name: "Rehana", contractedCapacity: 1087, exceededCapacity: 1829 },
  { name: "Misr Tiran", contractedCapacity: 217, exceededCapacity: 233 },
  { name: "Intercontinital", contractedCapacity: 1087, exceededCapacity: 452 },
  { name: "Travco Housing", contractedCapacity: 652, exceededCapacity: 330 },
  { name: "Hilton Sharm", contractedCapacity: 2717, exceededCapacity: 141 },
  { name: "Dahabia", contractedCapacity: 2174, exceededCapacity: 2081 },
  { name: "Sun Moon", contractedCapacity: 1739, exceededCapacity: 446 },
  { name: "Coral Sea", contractedCapacity: 2174, exceededCapacity: 993 },
  { name: "Moran", contractedCapacity: 4348, exceededCapacity: 162 },
  { name: "Rainbow", contractedCapacity: 2000, exceededCapacity: 4009 },
  { name: "Plaza", contractedCapacity: 543, exceededCapacity: 1785 },
  { name: "Tera", contractedCapacity: 761, exceededCapacity: 797 },
  { name: "Garden Palace", contractedCapacity: 2174, exceededCapacity: 2310 },
  { name: "Sharm Residence", contractedCapacity: 1087, exceededCapacity: 989 },
  { name: "Shram Land", contractedCapacity: 2174, exceededCapacity: 470 },
  { name: "Nabq Sinai", contractedCapacity: 1630, exceededCapacity: 295 },
  { name: "Nobian Sharm", contractedCapacity: 543, exceededCapacity: 2486 },
  { name: "Sharm Up", contractedCapacity: 435, exceededCapacity: 297 },
  { name: "Rief Goash", contractedCapacity: 50, exceededCapacity: 351 },
  { name: "Nabq Oriental (Rixos)", contractedCapacity: 4348, exceededCapacity: 258 },
  { name: "Maraqia Sharm", contractedCapacity: 800, exceededCapacity: 24 },
  { name: "Pharana Park", contractedCapacity: 543, exceededCapacity: 674 },
  { name: "EL-Qaheria", contractedCapacity: 50, exceededCapacity: 156 },
  { name: "Splash", contractedCapacity: 100, exceededCapacity: 1694 },
  { name: "Mona Sharm", contractedCapacity: 54, exceededCapacity: 391 },
  { name: "The Egyptian Mall", contractedCapacity: 109, exceededCapacity: 294 },
  { name: "Nabq Hites", contractedCapacity: 109, exceededCapacity: 132 },
  { name: "Bab El-Shams Alkaza Housing", contractedCapacity: 109, exceededCapacity: 314 },
  { name: "Concrete Tourism Dev.", contractedCapacity: 50, exceededCapacity: 131 },
  { name: "Nabq Park Residence", contractedCapacity: 22, exceededCapacity: 277 },
  { name: "Shatranj Construction", contractedCapacity: 54, exceededCapacity: 46 },
  { name: "Ministry of Interior", contractedCapacity: 0, exceededCapacity: 9 },
  { name: "National Bank (Société Générale)", contractedCapacity: 0, exceededCapacity: 17 },
  { name: "Radamis Hotels & Resorts", contractedCapacity: 0, exceededCapacity: 7430 },
  { name: "Sharm El Sheikh Local Unit", contractedCapacity: 0, exceededCapacity: 39 },
  { name: "Infinity e", contractedCapacity: 0, exceededCapacity: 11 },
];

// Helper: parse date string like "Jan-13" to year number
function parseYear(dateStr: string): number {
  const parts = dateStr.split("-");
  const yr = parseInt(parts[1]);
  return yr < 50 ? 2000 + yr : 1900 + yr;
}

// Compute cumulative contracted capacity by year
export function getYearlyCapacityGrowth() {
  const byYear: Record<number, number> = {};

  for (const c of clientCapacities) {
    if (c.contractedCapacity <= 0) continue;
    const year = parseYear(c.date);
    byYear[year] = (byYear[year] || 0) + c.contractedCapacity;
  }

  const years = Object.keys(byYear).map(Number).sort((a, b) => a - b);
  let cumulative = 0;
  return years.map((year) => {
    cumulative += byYear[year];
    return {
      year: year.toString(),
      added: Math.round(byYear[year] / 1000 * 10) / 10, // MVA added
      cumulative: Math.round(cumulative / 1000 * 10) / 10, // MVA total
    };
  });
}

// Derived KPI data
export const clientsKpiData = {
  totalClients: clientCapacities.length,
  totalContractedCapacity: 247115, // kVA
  totalConsumption2025: topClients.reduce((sum, c) => sum + c.consumption, 0),
  clientsExceedingCapacity: capacityExceedances.length,
  top5ConsumptionShare: topClients.slice(0, 5).reduce((sum, c) => sum + c.percentage, 0),
};
