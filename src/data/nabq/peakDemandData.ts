// Peak Demand Heatmap Data - Multi-year daily load profiles
// This provides hourly demand data for heatmap visualization

import { DailyLoadProfile } from "./batteryData";

// Generate daily load profiles for a month with yearly growth factor
const generateMonthlyLoad = (
  baseLoad: DailyLoadProfile[],
  growthFactor: number,
  daysInMonth: number
): DailyLoadProfile[] => {
  const result: DailyLoadProfile[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const baseDay = baseLoad[(day - 1) % baseLoad.length];
    result.push({
      day,
      hours: baseDay.hours.map((h) => Math.round(h * growthFactor)),
    });
  }
  return result;
};

// Base August 2025 data (from original batteryData)
export const augustBase2025: DailyLoadProfile[] = [
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
  { day: 14, hours: [86, 82, 80, 80, 82, 84, 83, 80, 79, 76, 72, 74, 77, 81, 82, 87, 96, 99, 98, 95, 99, 95, 90, 90] },
  { day: 15, hours: [81, 78, 77, 76, 76, 83, 80, 78, 74, 70, 65, 67, 68, 74, 77, 82, 91, 97, 99, 98, 97, 96, 93, 89] },
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
  { day: 29, hours: [66, 63, 61, 61, 63, 65, 64, 58, 55, 53, 50, 53, 53, 58, 59, 65, 75, 82, 85, 82, 79, 75, 72, 67] },
  { day: 30, hours: [64, 61, 59, 59, 60, 63, 63, 57, 56, 54, 51, 53, 55, 59, 58, 64, 75, 83, 85, 82, 77, 75, 71, 67] },
  { day: 31, hours: [64, 62, 60, 58, 61, 63, 63, 57, 55, 54, 51, 52, 53, 57, 58, 63, 77, 84, 86, 85, 81, 78, 74, 71] },
];

// Yearly growth factors based on cumulative inflation from Excel (5% per year from base)
const getGrowthFactor = (year: string): number => {
  const y = parseInt(year);
  if (y <= 2025) return 1.0;
  // 5% cumulative increment per year from 2026
  const inflationPct = (y - 2025) * 5;
  return 1 + inflationPct / 100;
};

// Days in each month
const daysInMonth: Record<number, number> = {
  1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
  7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31,
};

// Generate monthly patterns (approximation based on seasonal factors)
const seasonalFactors: Record<number, number> = {
  1: 0.65, 2: 0.60, 3: 0.70, 4: 0.80, 5: 0.90, 6: 0.95,
  7: 1.00, 8: 1.00, 9: 0.92, 10: 0.75, 11: 0.78, 12: 0.68,
};

export interface YearlyPeakData {
  year: string;
  months: {
    month: number;
    monthName: string;
    days: DailyLoadProfile[];
  }[];
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Generate full yearly peak data
export const generateYearlyPeakData = (year: string): YearlyPeakData => {
  const growth = getGrowthFactor(year);
  
  return {
    year,
    months: Array.from({ length: 12 }, (_, monthIndex) => {
      const month = monthIndex + 1;
      const seasonal = seasonalFactors[month];
      const combinedFactor = growth * seasonal;
      
      return {
        month,
        monthName: monthNames[monthIndex],
        days: generateMonthlyLoad(augustBase2025, combinedFactor, daysInMonth[month]),
      };
    }),
  };
};

// Pre-generate data for all years (2025-2050)
export const yearlyPeakData: Record<string, YearlyPeakData> = Object.fromEntries(
  Array.from({ length: 2050 - 2025 + 1 }, (_, i) => {
    const year = String(2025 + i);
    return [year, generateYearlyPeakData(year)];
  })
);

// Get peak data for specific year and month
export const getPeakDataForMonth = (year: string, month: number): DailyLoadProfile[] => {
  const yearData = yearlyPeakData[year] || yearlyPeakData["2025"];
  return yearData.months[month - 1]?.days || [];
};

// Calculate stats for a given month's data
export const calculateMonthStats = (days: DailyLoadProfile[], transformerLimit: number) => {
  const allHours = days.flatMap((d) => d.hours);
  return {
    maxDemand: Math.max(...allHours),
    minDemand: Math.min(...allHours),
    avgDemand: Math.round(allHours.reduce((a, b) => a + b, 0) / allHours.length),
    hoursAboveLimit: allHours.filter((h) => h > transformerLimit).length,
  };
};
