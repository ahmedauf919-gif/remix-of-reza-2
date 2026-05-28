// NABQ Solar-Only Operations Data (Without Battery)
// This represents the grid + solar scenario assuming no battery storage

export interface SolarOnlyMonthlyData {
  month: number;
  monthName: string;
  grid: number; // MWh from grid
  solar: number; // MWh from solar
  total: number; // Total consumption
  solarPercentage: number;
  peakDemand: number; // MW peak without battery smoothing
  hoursOverLimit: number; // Hours exceeding transformer limit
}

export interface SolarOnlyYearlyData {
  year: string;
  months: SolarOnlyMonthlyData[];
  totals: {
    grid: number;
    solar: number;
    total: number;
    solarPercentage: number;
    totalHoursOverLimit: number;
  };
}

// System specifications without battery
export const solarOnlySpecs = {
  gridCapacity: 106, // MW
  solarCapacity: 16, // MWp
  transformerLimit: 106, // MW
  solarEfficiency: 0.90, // 90%
  capacityFactor: 0.2329, // 23.29%
  annualYield: 2040, // kWh/kWp
};

// Solar-only scenario data (2025-2028)
// Without battery, peak demands hit transformer limits more frequently
export const solarOnlyYearlyData: SolarOnlyYearlyData[] = [
  {
    year: "2025",
    months: [
      { month: 1, monthName: "Jan", grid: 19608, solar: 2272, total: 21880, solarPercentage: 10, peakDemand: 78, hoursOverLimit: 0 },
      { month: 2, monthName: "Feb", grid: 16245, solar: 2503, total: 18747, solarPercentage: 13, peakDemand: 72, hoursOverLimit: 0 },
      { month: 3, monthName: "Mar", grid: 20872, solar: 2859, total: 23731, solarPercentage: 12, peakDemand: 82, hoursOverLimit: 0 },
      { month: 4, monthName: "Apr", grid: 27312, solar: 2817, total: 30129, solarPercentage: 9, peakDemand: 88, hoursOverLimit: 0 },
      { month: 5, monthName: "May", grid: 34577, solar: 3046, total: 37623, solarPercentage: 8, peakDemand: 94, hoursOverLimit: 0 },
      { month: 6, monthName: "Jun", grid: 39107, solar: 3121, total: 42228, solarPercentage: 7, peakDemand: 98, hoursOverLimit: 0 },
      { month: 7, monthName: "Jul", grid: 48798, solar: 3158, total: 51957, solarPercentage: 6, peakDemand: 104, hoursOverLimit: 0 },
      { month: 8, monthName: "Aug", grid: 53911, solar: 2910, total: 56821, solarPercentage: 5, peakDemand: 102, hoursOverLimit: 0 },
      { month: 9, monthName: "Sep", grid: 44719, solar: 2842, total: 47562, solarPercentage: 6, peakDemand: 99, hoursOverLimit: 0 },
      { month: 10, monthName: "Oct", grid: 27435, solar: 2789, total: 30224, solarPercentage: 9, peakDemand: 85, hoursOverLimit: 0 },
      { month: 11, monthName: "Nov", grid: 31419, solar: 2206, total: 33624, solarPercentage: 7, peakDemand: 89, hoursOverLimit: 0 },
      { month: 12, monthName: "Dec", grid: 21818, solar: 2114, total: 23932, solarPercentage: 9, peakDemand: 76, hoursOverLimit: 0 },
    ],
    totals: { grid: 385822, solar: 32637, total: 418459, solarPercentage: 8, totalHoursOverLimit: 0 },
  },
  {
    year: "2026",
    months: [
      { month: 1, monthName: "Jan", grid: 21569, solar: 2499, total: 24068, solarPercentage: 10, peakDemand: 86, hoursOverLimit: 0 },
      { month: 2, monthName: "Feb", grid: 17870, solar: 2753, total: 20622, solarPercentage: 13, peakDemand: 79, hoursOverLimit: 0 },
      { month: 3, monthName: "Mar", grid: 22959, solar: 3145, total: 26104, solarPercentage: 12, peakDemand: 90, hoursOverLimit: 0 },
      { month: 4, monthName: "Apr", grid: 30043, solar: 3099, total: 33142, solarPercentage: 9, peakDemand: 97, hoursOverLimit: 0 },
      { month: 5, monthName: "May", grid: 38035, solar: 3351, total: 41385, solarPercentage: 8, peakDemand: 103, hoursOverLimit: 0 },
      { month: 6, monthName: "Jun", grid: 43018, solar: 3433, total: 46451, solarPercentage: 7, peakDemand: 108, hoursOverLimit: 12 },
      { month: 7, monthName: "Jul", grid: 53678, solar: 3474, total: 57152, solarPercentage: 6, peakDemand: 114, hoursOverLimit: 48 },
      { month: 8, monthName: "Aug", grid: 59302, solar: 3201, total: 62503, solarPercentage: 5, peakDemand: 112, hoursOverLimit: 36 },
      { month: 9, monthName: "Sep", grid: 49191, solar: 3126, total: 52318, solarPercentage: 6, peakDemand: 109, hoursOverLimit: 18 },
      { month: 10, monthName: "Oct", grid: 30179, solar: 3068, total: 33246, solarPercentage: 9, peakDemand: 94, hoursOverLimit: 0 },
      { month: 11, monthName: "Nov", grid: 34561, solar: 2427, total: 36987, solarPercentage: 7, peakDemand: 98, hoursOverLimit: 0 },
      { month: 12, monthName: "Dec", grid: 24000, solar: 2325, total: 26325, solarPercentage: 9, peakDemand: 84, hoursOverLimit: 0 },
    ],
    totals: { grid: 424404, solar: 35901, total: 460305, solarPercentage: 8, totalHoursOverLimit: 114 },
  },
  {
    year: "2027",
    months: [
      { month: 1, monthName: "Jan", grid: 23726, solar: 2749, total: 26475, solarPercentage: 10, peakDemand: 94, hoursOverLimit: 0 },
      { month: 2, monthName: "Feb", grid: 19657, solar: 3029, total: 22685, solarPercentage: 13, peakDemand: 87, hoursOverLimit: 0 },
      { month: 3, monthName: "Mar", grid: 25255, solar: 3460, total: 28715, solarPercentage: 12, peakDemand: 99, hoursOverLimit: 0 },
      { month: 4, monthName: "Apr", grid: 33048, solar: 3409, total: 36456, solarPercentage: 9, peakDemand: 107, hoursOverLimit: 6 },
      { month: 5, monthName: "May", grid: 41838, solar: 3686, total: 45524, solarPercentage: 8, peakDemand: 113, hoursOverLimit: 42 },
      { month: 6, monthName: "Jun", grid: 47319, solar: 3777, total: 51096, solarPercentage: 7, peakDemand: 119, hoursOverLimit: 72 },
      { month: 7, monthName: "Jul", grid: 59046, solar: 3821, total: 62867, solarPercentage: 6, peakDemand: 125, hoursOverLimit: 124 },
      { month: 8, monthName: "Aug", grid: 65232, solar: 3521, total: 68753, solarPercentage: 5, peakDemand: 123, hoursOverLimit: 108 },
      { month: 9, monthName: "Sep", grid: 54110, solar: 3439, total: 57549, solarPercentage: 6, peakDemand: 120, hoursOverLimit: 84 },
      { month: 10, monthName: "Oct", grid: 33196, solar: 3375, total: 36571, solarPercentage: 9, peakDemand: 103, hoursOverLimit: 0 },
      { month: 11, monthName: "Nov", grid: 38017, solar: 2669, total: 40686, solarPercentage: 7, peakDemand: 108, hoursOverLimit: 12 },
      { month: 12, monthName: "Dec", grid: 26400, solar: 2558, total: 28958, solarPercentage: 9, peakDemand: 92, hoursOverLimit: 0 },
    ],
    totals: { grid: 466845, solar: 39491, total: 506335, solarPercentage: 8, totalHoursOverLimit: 448 },
  },
  {
    year: "2028",
    months: [
      { month: 1, monthName: "Jan", grid: 26099, solar: 3024, total: 29122, solarPercentage: 10, peakDemand: 104, hoursOverLimit: 0 },
      { month: 2, monthName: "Feb", grid: 21622, solar: 3331, total: 24953, solarPercentage: 13, peakDemand: 96, hoursOverLimit: 0 },
      { month: 3, monthName: "Mar", grid: 27781, solar: 3806, total: 31586, solarPercentage: 12, peakDemand: 109, hoursOverLimit: 18 },
      { month: 4, monthName: "Apr", grid: 36352, solar: 3750, total: 40102, solarPercentage: 9, peakDemand: 118, hoursOverLimit: 60 },
      { month: 5, monthName: "May", grid: 46022, solar: 4054, total: 50076, solarPercentage: 8, peakDemand: 124, hoursOverLimit: 108 },
      { month: 6, monthName: "Jun", grid: 52051, solar: 4154, total: 56206, solarPercentage: 7, peakDemand: 131, hoursOverLimit: 156 },
      { month: 7, monthName: "Jul", grid: 64950, solar: 4203, total: 69154, solarPercentage: 6, peakDemand: 138, hoursOverLimit: 204 },
      { month: 8, monthName: "Aug", grid: 71756, solar: 3873, total: 75629, solarPercentage: 5, peakDemand: 135, hoursOverLimit: 186 },
      { month: 9, monthName: "Sep", grid: 59521, solar: 3783, total: 63304, solarPercentage: 6, peakDemand: 132, hoursOverLimit: 162 },
      { month: 10, monthName: "Oct", grid: 36516, solar: 3712, total: 40228, solarPercentage: 9, peakDemand: 113, hoursOverLimit: 42 },
      { month: 11, monthName: "Nov", grid: 41819, solar: 2936, total: 44755, solarPercentage: 7, peakDemand: 119, hoursOverLimit: 72 },
      { month: 12, monthName: "Dec", grid: 29040, solar: 2814, total: 31854, solarPercentage: 9, peakDemand: 101, hoursOverLimit: 0 },
    ],
    totals: { grid: 513529, solar: 43440, total: 556969, solarPercentage: 8, totalHoursOverLimit: 1008 },
  },
];

// Helper functions
export const getSolarOnlyYearData = (year: string) =>
  solarOnlyYearlyData.find((d) => d.year === year) || solarOnlyYearlyData[0];

export const getSolarOnlyYearlySummary = () =>
  solarOnlyYearlyData.map((d) => ({
    year: d.year,
    ...d.totals,
  }));
