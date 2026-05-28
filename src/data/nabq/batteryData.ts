// NABQ Battery & Solar Operations Data

export interface BatteryKPIData {
  gridCapacity: number; // MW
  solarCapacity: number; // MWp
  batteryCapacity: number; // MW
  batteryDuration: number; // hrs
  roundTripEfficiency: number; // %
  dieselPrice: number; // EGP
  solarEfficiency: number; // %
  transformerLimit: number; // MW
  batteryCostPerMwh: number; // EGP
}

export interface MonthlyEnergyData {
  month: number;
  monthName: string;
  grid: number; // MWh
  solar: number; // MWh
  total: number; // MWh (Grid + Solar + Batteries offset)
  solarPercentage: number; // %
}

export interface YearlyEnergyData {
  year: string;
  months: MonthlyEnergyData[];
  totals: {
    grid: number;
    solar: number;
    total: number;
    solarPercentage: number;
  };
}

export interface DailyLoadProfile {
  day: number;
  hours: number[]; // 24 hours of MW demand
}

export interface YearlyProjection {
  year: number;
  inflation: number; // %
  extraCapacityUtilization: number; // MW
}

// KPI Summary
export const batteryKpiData: BatteryKPIData = {
  gridCapacity: 106,
  solarCapacity: 16,
  batteryCapacity: 16,
  batteryDuration: 1,
  roundTripEfficiency: 85,
  dieselPrice: 20,
  solarEfficiency: 90,
  transformerLimit: 106,
  batteryCostPerMwh: 120000,
};

// Multi-year energy data (2025-2028 with projected growth)
// Requirement: solar energy stays constant across years.
const rawYearlyEnergyData: YearlyEnergyData[] = [
  {
    year: "2025",
    months: [
      { month: 1, monthName: "Jan", grid: 19608, solar: 2272, total: 21880, solarPercentage: 10 },
      { month: 2, monthName: "Feb", grid: 16245, solar: 2503, total: 18747, solarPercentage: 13 },
      { month: 3, monthName: "Mar", grid: 20872, solar: 2859, total: 23731, solarPercentage: 12 },
      { month: 4, monthName: "Apr", grid: 27312, solar: 2817, total: 30129, solarPercentage: 9 },
      { month: 5, monthName: "May", grid: 34577, solar: 3046, total: 37623, solarPercentage: 8 },
      { month: 6, monthName: "Jun", grid: 39107, solar: 3121, total: 42228, solarPercentage: 7 },
      { month: 7, monthName: "Jul", grid: 48798, solar: 3158, total: 51957, solarPercentage: 6 },
      { month: 8, monthName: "Aug", grid: 53911, solar: 2910, total: 56821, solarPercentage: 5 },
      { month: 9, monthName: "Sep", grid: 44719, solar: 2842, total: 47562, solarPercentage: 6 },
      { month: 10, monthName: "Oct", grid: 27435, solar: 2789, total: 30224, solarPercentage: 9 },
      { month: 11, monthName: "Nov", grid: 31419, solar: 2206, total: 33624, solarPercentage: 7 },
      { month: 12, monthName: "Dec", grid: 21818, solar: 2114, total: 23932, solarPercentage: 9 },
    ],
    totals: { grid: 385822, solar: 32637, total: 418459, solarPercentage: 8 },
  },
  {
    year: "2026",
    months: [
      { month: 1, monthName: "Jan", grid: 21569, solar: 2499, total: 24068, solarPercentage: 10 },
      { month: 2, monthName: "Feb", grid: 17870, solar: 2753, total: 20622, solarPercentage: 13 },
      { month: 3, monthName: "Mar", grid: 22959, solar: 3145, total: 26104, solarPercentage: 12 },
      { month: 4, monthName: "Apr", grid: 30043, solar: 3099, total: 33142, solarPercentage: 9 },
      { month: 5, monthName: "May", grid: 38035, solar: 3351, total: 41385, solarPercentage: 8 },
      { month: 6, monthName: "Jun", grid: 43018, solar: 3433, total: 46451, solarPercentage: 7 },
      { month: 7, monthName: "Jul", grid: 53678, solar: 3474, total: 57152, solarPercentage: 6 },
      { month: 8, monthName: "Aug", grid: 59302, solar: 3201, total: 62503, solarPercentage: 5 },
      { month: 9, monthName: "Sep", grid: 49191, solar: 3126, total: 52318, solarPercentage: 6 },
      { month: 10, monthName: "Oct", grid: 30179, solar: 3068, total: 33246, solarPercentage: 9 },
      { month: 11, monthName: "Nov", grid: 34561, solar: 2427, total: 36987, solarPercentage: 7 },
      { month: 12, monthName: "Dec", grid: 24000, solar: 2325, total: 26325, solarPercentage: 9 },
    ],
    totals: { grid: 424404, solar: 35901, total: 460305, solarPercentage: 8 },
  },
  {
    year: "2027",
    months: [
      { month: 1, monthName: "Jan", grid: 23726, solar: 2749, total: 26475, solarPercentage: 10 },
      { month: 2, monthName: "Feb", grid: 19657, solar: 3029, total: 22685, solarPercentage: 13 },
      { month: 3, monthName: "Mar", grid: 25255, solar: 3460, total: 28715, solarPercentage: 12 },
      { month: 4, monthName: "Apr", grid: 33048, solar: 3409, total: 36456, solarPercentage: 9 },
      { month: 5, monthName: "May", grid: 41838, solar: 3686, total: 45524, solarPercentage: 8 },
      { month: 6, monthName: "Jun", grid: 47319, solar: 3777, total: 51096, solarPercentage: 7 },
      { month: 7, monthName: "Jul", grid: 59046, solar: 3821, total: 62867, solarPercentage: 6 },
      { month: 8, monthName: "Aug", grid: 65232, solar: 3521, total: 68753, solarPercentage: 5 },
      { month: 9, monthName: "Sep", grid: 54110, solar: 3439, total: 57549, solarPercentage: 6 },
      { month: 10, monthName: "Oct", grid: 33196, solar: 3375, total: 36571, solarPercentage: 9 },
      { month: 11, monthName: "Nov", grid: 38017, solar: 2669, total: 40686, solarPercentage: 7 },
      { month: 12, monthName: "Dec", grid: 26400, solar: 2558, total: 28958, solarPercentage: 9 },
    ],
    totals: { grid: 466845, solar: 39491, total: 506335, solarPercentage: 8 },
  },
  {
    year: "2028",
    months: [
      { month: 1, monthName: "Jan", grid: 26099, solar: 3024, total: 29122, solarPercentage: 10 },
      { month: 2, monthName: "Feb", grid: 21622, solar: 3331, total: 24953, solarPercentage: 13 },
      { month: 3, monthName: "Mar", grid: 27781, solar: 3806, total: 31586, solarPercentage: 12 },
      { month: 4, monthName: "Apr", grid: 36352, solar: 3750, total: 40102, solarPercentage: 9 },
      { month: 5, monthName: "May", grid: 46022, solar: 4054, total: 50076, solarPercentage: 8 },
      { month: 6, monthName: "Jun", grid: 52051, solar: 4154, total: 56206, solarPercentage: 7 },
      { month: 7, monthName: "Jul", grid: 64950, solar: 4203, total: 69154, solarPercentage: 6 },
      { month: 8, monthName: "Aug", grid: 71756, solar: 3873, total: 75629, solarPercentage: 5 },
      { month: 9, monthName: "Sep", grid: 59521, solar: 3783, total: 63304, solarPercentage: 6 },
      { month: 10, monthName: "Oct", grid: 36516, solar: 3712, total: 40228, solarPercentage: 9 },
      { month: 11, monthName: "Nov", grid: 41819, solar: 2936, total: 44755, solarPercentage: 7 },
      { month: 12, monthName: "Dec", grid: 29040, solar: 2814, total: 31854, solarPercentage: 9 },
    ],
    totals: { grid: 513529, solar: 43440, total: 556969, solarPercentage: 8 },
  },
];

const baseSolarByMonth = rawYearlyEnergyData[0].months.map((m) => m.solar);

export const yearlyEnergyData: YearlyEnergyData[] = rawYearlyEnergyData.map((yearData) => {
  const months: MonthlyEnergyData[] = yearData.months.map((m, idx) => {
    const solar = baseSolarByMonth[idx] ?? m.solar;
    const total = m.grid + solar;
    const solarPercentage = total > 0 ? Math.round((solar / total) * 100) : 0;

    return {
      ...m,
      solar,
      total,
      solarPercentage,
    };
  });

  const totalsGrid = months.reduce((acc, m) => acc + m.grid, 0);
  const totalsSolar = months.reduce((acc, m) => acc + m.solar, 0);
  const totalsTotal = totalsGrid + totalsSolar;

  return {
    year: yearData.year,
    months,
    totals: {
      grid: totalsGrid,
      solar: totalsSolar,
      total: totalsTotal,
      solarPercentage: totalsTotal > 0 ? Math.round((totalsSolar / totalsTotal) * 100) : 0,
    },
  };
});

// Growth factor based on Excel inflation schedule (5% cumulative per year from base 2025)
const getEnergyGrowthFactor = (year: string): number => {
  const y = parseInt(year);
  if (y <= 2025) return 1.0;
  return 1 + ((y - 2025) * 5) / 100;
};

// Dynamically generate year data for any year up to 2050
const generateYearData = (year: string): YearlyEnergyData => {
  const baseYear = yearlyEnergyData[0]; // 2025 base
  const growthFactor = getEnergyGrowthFactor(year);

  const months: MonthlyEnergyData[] = baseYear.months.map((m) => {
    const grid = Math.round(m.grid * growthFactor);
    const solar = m.solar; // Solar stays constant
    const total = grid + solar;
    const solarPercentage = total > 0 ? Math.round((solar / total) * 100) : 0;
    return { ...m, grid, solar, total, solarPercentage };
  });

  const totalsGrid = months.reduce((acc, m) => acc + m.grid, 0);
  const totalsSolar = months.reduce((acc, m) => acc + m.solar, 0);
  const totalsTotal = totalsGrid + totalsSolar;

  return {
    year,
    months,
    totals: {
      grid: totalsGrid,
      solar: totalsSolar,
      total: totalsTotal,
      solarPercentage: totalsTotal > 0 ? Math.round((totalsSolar / totalsTotal) * 100) : 0,
    },
  };
};

// Helper to get data for a specific year (dynamically generated for years beyond dataset)
export const getYearData = (year: string): YearlyEnergyData => {
  const existing = yearlyEnergyData.find(d => d.year === year);
  if (existing) return existing;
  return generateYearData(year);
};

// Helper to get combined data for all years (for comparison charts)
export const getMonthlyComparisonData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((monthName, index) => {
    const result: Record<string, any> = { monthName };
    yearlyEnergyData.forEach(yearData => {
      const monthData = yearData.months[index];
      result[`grid${yearData.year}`] = monthData.grid;
      result[`solar${yearData.year}`] = monthData.solar;
      result[`total${yearData.year}`] = monthData.total;
      result[`solarPct${yearData.year}`] = monthData.solarPercentage;
    });
    return result;
  });
};

// Get yearly summary for overview
export const getYearlySummary = () => 
  yearlyEnergyData.map(d => ({
    year: d.year,
    ...d.totals,
  }));

// Legacy export for backward compatibility
export const monthlyEnergyData = yearlyEnergyData[0].months;
export const yearlyEnergyTotals = yearlyEnergyData[0].totals;

// Inflation projections from Excel (2026-2053)
export const yearlyProjections: YearlyProjection[] = Array.from({ length: 2053 - 2026 + 1 }, (_, i) => {
  const year = 2026 + i;
  return {
    year,
    inflation: (i + 1) * 5,
    extraCapacityUtilization: year === 2026 ? 17.25 : 34.50,
  };
});

// Battery specifications
export const batterySpecs = {
  capacity: 16, // MW
  duration: 1, // hrs
  energyCapacity: 16, // kWh (MW * 1000 for actual, shown as 16 in data)
  roundTripEfficiency: 0.85, // 85%
  maxStorage: 16, // kWh
};

// Solar specifications
export const solarSpecs = {
  capacity: 16, // MWp
  targetCapacityFactor: 0.17, // 17%
  factorYield: 0.96, // 96%
  hourlyCapacityFactor: 0.2329, // 23.29%
  yield: 2040,
};

// Wind specifications (currently disabled)
export const windSpecs = {
  included: false,
  capacity: 110.4, // MWp
  targetCapacityFactor: 0.50, // 50%
  factorYield: 1.00, // 100%
  hourlyCapacityFactor: 0.4327, // 43.27%
  yield: 3790,
};

// August peak demand profile (day 1-31, hourly MW)
export const augustDailyLoad: DailyLoadProfile[] = [
  { day: 1, hours: [72, 69, 68, 66, 68, 70, 69, 64, 61, 59, 56, 55, 57, 60, 61, 67, 78, 86, 87, 87, 82, 79, 75, 72] },
  { day: 2, hours: [68, 65, 64, 64, 65, 67, 68, 62, 60, 58, 55, 56, 58, 61, 62, 65, 78, 85, 87, 88, 83, 79, 75, 72] },
  { day: 3, hours: [68, 67, 63, 62, 64, 67, 68, 63, 52, 48, 50, 53, 57, 61, 62, 68, 79, 88, 90, 89, 84, 81, 78, 74] },
  { day: 4, hours: [70, 67, 64, 64, 66, 68, 68, 64, 62, 59, 55, 57, 59, 62, 63, 68, 80, 87, 89, 88, 84, 79, 76, 70] },
  { day: 5, hours: [68, 66, 65, 64, 66, 68, 68, 62, 60, 58, 55, 56, 58, 61, 63, 68, 79, 88, 89, 88, 85, 81, 77, 74] },
  { day: 6, hours: [71, 68, 66, 65, 67, 69, 68, 63, 60, 58, 53, 54, 57, 60, 62, 68, 81, 90, 92, 90, 87, 84, 79, 76] },
  { day: 7, hours: [72, 69, 67, 65, 67, 68, 68, 64, 61, 58, 54, 55, 58, 62, 63, 69, 81, 89, 91, 90, 86, 84, 81, 77] },
  { day: 8, hours: [73, 69, 67, 66, 68, 70, 69, 65, 63, 60, 57, 57, 59, 63, 64, 70, 81, 89, 92, 89, 85, 81, 78, 76] },
  { day: 9, hours: [71, 70, 67, 67, 67, 71, 72, 68, 66, 64, 58, 64, 63, 66, 72, 72, 84, 92, 94, 94, 92, 84, 80, 77] },
  { day: 10, hours: [74, 74, 72, 71, 73, 76, 76, 73, 70, 69, 75, 64, 67, 72, 72, 85, 92, 99, 100, 98, 94, 92, 88, 82] },
  { day: 11, hours: [79, 76, 74, 73, 75, 77, 77, 74, 70, 67, 64, 64, 69, 74, 74, 79, 88, 98, 101, 100, 97, 92, 90, 84] },
  { day: 12, hours: [79, 77, 76, 75, 78, 81, 78, 78, 76, 73, 69, 70, 72, 76, 77, 81, 89, 98, 100, 97, 95, 92, 91, 86] },
  { day: 13, hours: [82, 79, 78, 77, 80, 84, 81, 76, 76, 73, 70, 73, 74, 85, 79, 83, 95, 100, 102, 101, 98, 97, 93, 91] },
  { day: 14, hours: [86, 82, 80, 80, 82, 84, 83, 80, 79, 76, 72, 74, 77, 81, 82, 87, 96, 31, 58, 95, 99, 95, 90, 90] },
  { day: 15, hours: [81, 78, 77, 56, 76, 83, 80, 78, 74, 70, 65, 67, 68, 74, 77, 82, 91, 97, 99, 98, 97, 96, 93, 89] },
  { day: 16, hours: [85, 81, 79, 79, 80, 81, 79, 74, 70, 66, 63, 63, 67, 71, 73, 79, 87, 94, 94, 93, 92, 93, 89, 85] },
  { day: 17, hours: [82, 77, 75, 75, 77, 79, 77, 75, 70, 68, 71, 70, 78, 76, 69, 82, 88, 91, 93, 92, 90, 89, 85, 79] },
  { day: 18, hours: [77, 74, 72, 71, 73, 74, 73, 67, 63, 60, 58, 59, 63, 66, 54, 71, 83, 88, 90, 89, 88, 86, 82, 77] },
  { day: 19, hours: [73, 71, 68, 68, 69, 71, 70, 65, 63, 60, 58, 58, 61, 64, 66, 72, 83, 87, 89, 88, 87, 86, 82, 77] },
  { day: 20, hours: [74, 70, 68, 68, 70, 71, 71, 66, 64, 61, 58, 59, 62, 64, 65, 70, 81, 86, 90, 88, 85, 83, 81, 78] },
  { day: 21, hours: [74, 71, 69, 68, 70, 72, 71, 66, 63, 61, 57, 58, 60, 63, 63, 68, 81, 87, 89, 88, 85, 83, 78, 76] },
  { day: 22, hours: [73, 69, 67, 66, 67, 70, 69, 65, 63, 62, 54, 55, 55, 63, 63, 69, 79, 86, 85, 84, 82, 80, 77, 74] },
  { day: 23, hours: [70, 67, 66, 66, 68, 69, 70, 64, 62, 60, 57, 59, 62, 66, 67, 72, 83, 88, 92, 89, 88, 85, 81, 78] },
  { day: 24, hours: [74, 71, 68, 67, 69, 72, 71, 65, 63, 60, 58, 59, 61, 65, 65, 71, 83, 89, 90, 87, 85, 83, 81, 77] },
  { day: 25, hours: [74, 69, 67, 67, 68, 69, 69, 63, 61, 58, 55, 56, 58, 61, 62, 67, 78, 84, 86, 83, 80, 77, 74, 71] },
  { day: 26, hours: [68, 65, 64, 63, 65, 68, 68, 63, 61, 58, 56, 57, 59, 61, 62, 68, 80, 85, 87, 84, 81, 77, 75, 71] },
  { day: 27, hours: [68, 63, 63, 63, 64, 67, 67, 61, 58, 56, 54, 54, 56, 59, 60, 66, 76, 83, 85, 82, 79, 76, 73, 69] },
  { day: 28, hours: [67, 65, 62, 63, 65, 66, 66, 60, 57, 55, 51, 53, 52, 56, 58, 63, 75, 83, 85, 83, 79, 75, 72, 69] },
  { day: 29, hours: [66, 63, 61, 61, 63, 65, 64, 58, 55, 53, 50, 33, 53, 58, 59, 65, 75, 82, 85, 82, 79, 75, 72, 67] },
  { day: 30, hours: [64, 61, 59, 59, 60, 63, 63, 57, 56, 54, 51, 53, 55, 59, 58, 64, 75, 83, 85, 82, 77, 75, 71, 67] },
  { day: 31, hours: [64, 62, 60, 58, 61, 63, 63, 57, 55, 54, 51, 52, 53, 57, 58, 63, 77, 84, 86, 85, 81, 78, 74, 71] },
];

// Calculate peak demand stats for August
export const augustPeakStats = {
  maxDemand: Math.max(...augustDailyLoad.flatMap(d => d.hours)),
  minDemand: Math.min(...augustDailyLoad.flatMap(d => d.hours)),
  avgDemand: Math.round(augustDailyLoad.flatMap(d => d.hours).reduce((a, b) => a + b, 0) / (31 * 24)),
  hoursAboveLimit: augustDailyLoad.flatMap(d => d.hours).filter(h => h > 106).length,
};

// Hourly demand pattern (average across typical day)
export const avgHourlyDemand = Array.from({ length: 24 }, (_, hour) => {
  const hourlyValues = augustDailyLoad.map(d => d.hours[hour]);
  return {
    hour,
    demand: Math.round(hourlyValues.reduce((a, b) => a + b, 0) / hourlyValues.length),
  };
});

// Energy source breakdown for pie chart
export const energySourceBreakdown = [
  { source: "Grid", value: yearlyEnergyTotals.grid, color: "hsl(var(--chart-1))" },
  { source: "Solar", value: yearlyEnergyTotals.solar, color: "hsl(var(--chart-3))" },
];

// Capacity factors comparison
export const capacityFactors = {
  wind: { target: 50, actual: 43.27 },
  solar: { target: 17, actual: 23.29 },
};

// Solar hourly capacity factor curve (fraction of peak output per hour)
// Represents a typical desert solar profile peaking around 12-13h
const solarHourlyCF = [
  0, 0, 0, 0, 0, 0,       // 0-5: night
  0.05, 0.15, 0.35, 0.55, // 6-9: morning ramp
  0.75, 0.90, 0.98, 1.0,  // 10-13: peak
  0.92, 0.75, 0.50, 0.25, // 14-17: afternoon decline
  0.05, 0, 0, 0, 0, 0,    // 18-23: night
];

/**
 * Returns hourly solar MW output for a given solar park size.
 * Based on capacity factor curve and MWp rating.
 * Average CF ~23% matches solarSpecs.hourlyCapacityFactor.
 */
export const getSolarHourlyMW = (solarSizeMWp: number): number[] =>
  solarHourlyCF.map((cf) => Math.round(solarSizeMWp * cf * 100) / 100);

/**
 * Returns solar scale factor relative to the 16 MWp baseline.
 */
export const getSolarScale = (solarSizeMWp: number): number =>
  solarSizeMWp / (solarSpecs.capacity || 16);
