// NABQ Battery Impact Analysis Data
// This shows how battery storage affects loads and energy management

export interface BatteryImpactMonthlyData {
  month: number;
  monthName: string;
  // Without Battery
  peakDemandWithoutBattery: number; // MW
  hoursOverLimitWithoutBattery: number;
  gridEnergyWithoutBattery: number; // MWh
  // With Battery
  peakDemandWithBattery: number; // MW (after peak shaving)
  hoursOverLimitWithBattery: number;
  gridEnergyWithBattery: number; // MWh (reduced due to battery discharge)
  // Impact
  peakReduction: number; // MW saved
  hoursProtected: number; // Hours protected from overload
  energyShifted: number; // MWh shifted from peak to off-peak
  costSavings: number; // EGP saved
}

export interface BatteryImpactYearlyData {
  year: string;
  months: BatteryImpactMonthlyData[];
  totals: {
    totalPeakReduction: number;
    totalHoursProtected: number;
    totalEnergyShifted: number;
    totalCostSavings: number;
    avgPeakReduction: number;
  };
}

// Battery specifications for impact calculation
export const batterySystemSpecs = {
  capacity: 16, // MW
  duration: 1, // hours
  energyCapacity: 16, // MWh
  roundTripEfficiency: 0.85, // 85%
  maxDischargeRate: 16, // MW
  maxChargeRate: 16, // MW
  cyclesPerDay: 1, // Typical daily cycles
  costPerCycle: 500, // EGP per cycle (degradation cost)
  dieselCostPerMwh: 3000, // EGP/MWh for diesel generation
  gridCostPerMwh: 1500, // EGP/MWh for grid power
};

// Battery impact data across years (2025-2028)
export const batteryImpactYearlyData: BatteryImpactYearlyData[] = [
  {
    year: "2025",
    months: [
      { month: 1, monthName: "Jan", peakDemandWithoutBattery: 78, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 19608, peakDemandWithBattery: 78, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 19608, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 2, monthName: "Feb", peakDemandWithoutBattery: 72, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 16245, peakDemandWithBattery: 72, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 16245, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 3, monthName: "Mar", peakDemandWithoutBattery: 82, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 20872, peakDemandWithBattery: 82, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 20872, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 4, monthName: "Apr", peakDemandWithoutBattery: 88, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 27312, peakDemandWithBattery: 88, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 27312, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 5, monthName: "May", peakDemandWithoutBattery: 94, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 34577, peakDemandWithBattery: 94, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 34577, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 6, monthName: "Jun", peakDemandWithoutBattery: 98, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 39107, peakDemandWithBattery: 98, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 39107, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 7, monthName: "Jul", peakDemandWithoutBattery: 104, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 48798, peakDemandWithBattery: 104, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 48798, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 8, monthName: "Aug", peakDemandWithoutBattery: 102, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 53911, peakDemandWithBattery: 102, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 53911, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 9, monthName: "Sep", peakDemandWithoutBattery: 99, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 44719, peakDemandWithBattery: 99, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 44719, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 10, monthName: "Oct", peakDemandWithoutBattery: 85, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 27435, peakDemandWithBattery: 85, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 27435, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 11, monthName: "Nov", peakDemandWithoutBattery: 89, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 31419, peakDemandWithBattery: 89, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 31419, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 12, monthName: "Dec", peakDemandWithoutBattery: 76, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 21818, peakDemandWithBattery: 76, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 21818, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
    ],
    totals: { totalPeakReduction: 0, totalHoursProtected: 0, totalEnergyShifted: 0, totalCostSavings: 0, avgPeakReduction: 0 },
  },
  {
    year: "2026",
    months: [
      { month: 1, monthName: "Jan", peakDemandWithoutBattery: 86, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 21569, peakDemandWithBattery: 86, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 21569, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 2, monthName: "Feb", peakDemandWithoutBattery: 79, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 17870, peakDemandWithBattery: 79, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 17870, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 3, monthName: "Mar", peakDemandWithoutBattery: 90, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 22959, peakDemandWithBattery: 90, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 22959, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 4, monthName: "Apr", peakDemandWithoutBattery: 97, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 30043, peakDemandWithBattery: 97, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 30043, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 5, monthName: "May", peakDemandWithoutBattery: 103, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 38035, peakDemandWithBattery: 103, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 38035, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 6, monthName: "Jun", peakDemandWithoutBattery: 108, hoursOverLimitWithoutBattery: 12, gridEnergyWithoutBattery: 43018, peakDemandWithBattery: 104, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 42970, peakReduction: 4, hoursProtected: 12, energyShifted: 48, costSavings: 72000 },
      { month: 7, monthName: "Jul", peakDemandWithoutBattery: 114, hoursOverLimitWithoutBattery: 48, gridEnergyWithoutBattery: 53678, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 53486, peakReduction: 8, hoursProtected: 48, energyShifted: 192, costSavings: 288000 },
      { month: 8, monthName: "Aug", peakDemandWithoutBattery: 112, hoursOverLimitWithoutBattery: 36, gridEnergyWithoutBattery: 59302, peakDemandWithBattery: 105, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 59158, peakReduction: 7, hoursProtected: 36, energyShifted: 144, costSavings: 216000 },
      { month: 9, monthName: "Sep", peakDemandWithoutBattery: 109, hoursOverLimitWithoutBattery: 18, gridEnergyWithoutBattery: 49191, peakDemandWithBattery: 105, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 49119, peakReduction: 4, hoursProtected: 18, energyShifted: 72, costSavings: 108000 },
      { month: 10, monthName: "Oct", peakDemandWithoutBattery: 94, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 30179, peakDemandWithBattery: 94, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 30179, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 11, monthName: "Nov", peakDemandWithoutBattery: 98, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 34561, peakDemandWithBattery: 98, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 34561, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 12, monthName: "Dec", peakDemandWithoutBattery: 84, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 24000, peakDemandWithBattery: 84, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 24000, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
    ],
    totals: { totalPeakReduction: 23, totalHoursProtected: 114, totalEnergyShifted: 456, totalCostSavings: 684000, avgPeakReduction: 5.75 },
  },
  {
    year: "2027",
    months: [
      { month: 1, monthName: "Jan", peakDemandWithoutBattery: 94, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 23726, peakDemandWithBattery: 94, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 23726, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 2, monthName: "Feb", peakDemandWithoutBattery: 87, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 19657, peakDemandWithBattery: 87, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 19657, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 3, monthName: "Mar", peakDemandWithoutBattery: 99, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 25255, peakDemandWithBattery: 99, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 25255, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 4, monthName: "Apr", peakDemandWithoutBattery: 107, hoursOverLimitWithoutBattery: 6, gridEnergyWithoutBattery: 33048, peakDemandWithBattery: 105, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 33024, peakReduction: 2, hoursProtected: 6, energyShifted: 24, costSavings: 36000 },
      { month: 5, monthName: "May", peakDemandWithoutBattery: 113, hoursOverLimitWithoutBattery: 42, gridEnergyWithoutBattery: 41838, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 41670, peakReduction: 7, hoursProtected: 42, energyShifted: 168, costSavings: 252000 },
      { month: 6, monthName: "Jun", peakDemandWithoutBattery: 119, hoursOverLimitWithoutBattery: 72, gridEnergyWithoutBattery: 47319, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 47031, peakReduction: 13, hoursProtected: 72, energyShifted: 288, costSavings: 432000 },
      { month: 7, monthName: "Jul", peakDemandWithoutBattery: 125, hoursOverLimitWithoutBattery: 124, gridEnergyWithoutBattery: 59046, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 28, gridEnergyWithBattery: 58550, peakReduction: 19, hoursProtected: 96, energyShifted: 496, costSavings: 744000 },
      { month: 8, monthName: "Aug", peakDemandWithoutBattery: 123, hoursOverLimitWithoutBattery: 108, gridEnergyWithoutBattery: 65232, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 20, gridEnergyWithBattery: 64800, peakReduction: 17, hoursProtected: 88, energyShifted: 432, costSavings: 648000 },
      { month: 9, monthName: "Sep", peakDemandWithoutBattery: 120, hoursOverLimitWithoutBattery: 84, gridEnergyWithoutBattery: 54110, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 12, gridEnergyWithBattery: 53822, peakReduction: 14, hoursProtected: 72, energyShifted: 288, costSavings: 432000 },
      { month: 10, monthName: "Oct", peakDemandWithoutBattery: 103, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 33196, peakDemandWithBattery: 103, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 33196, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 11, monthName: "Nov", peakDemandWithoutBattery: 108, hoursOverLimitWithoutBattery: 12, gridEnergyWithoutBattery: 38017, peakDemandWithBattery: 105, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 37969, peakReduction: 3, hoursProtected: 12, energyShifted: 48, costSavings: 72000 },
      { month: 12, monthName: "Dec", peakDemandWithoutBattery: 92, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 26400, peakDemandWithBattery: 92, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 26400, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
    ],
    totals: { totalPeakReduction: 75, totalHoursProtected: 388, totalEnergyShifted: 1744, totalCostSavings: 2616000, avgPeakReduction: 10.7 },
  },
  {
    year: "2028",
    months: [
      { month: 1, monthName: "Jan", peakDemandWithoutBattery: 104, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 26099, peakDemandWithBattery: 104, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 26099, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 2, monthName: "Feb", peakDemandWithoutBattery: 96, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 21622, peakDemandWithBattery: 96, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 21622, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
      { month: 3, monthName: "Mar", peakDemandWithoutBattery: 109, hoursOverLimitWithoutBattery: 18, gridEnergyWithoutBattery: 27781, peakDemandWithBattery: 105, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 27709, peakReduction: 4, hoursProtected: 18, energyShifted: 72, costSavings: 108000 },
      { month: 4, monthName: "Apr", peakDemandWithoutBattery: 118, hoursOverLimitWithoutBattery: 60, gridEnergyWithoutBattery: 36352, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 8, gridEnergyWithBattery: 36112, peakReduction: 12, hoursProtected: 52, energyShifted: 240, costSavings: 360000 },
      { month: 5, monthName: "May", peakDemandWithoutBattery: 124, hoursOverLimitWithoutBattery: 108, gridEnergyWithoutBattery: 46022, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 36, gridEnergyWithBattery: 45590, peakReduction: 18, hoursProtected: 72, energyShifted: 432, costSavings: 648000 },
      { month: 6, monthName: "Jun", peakDemandWithoutBattery: 131, hoursOverLimitWithoutBattery: 156, gridEnergyWithoutBattery: 52051, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 72, gridEnergyWithBattery: 51379, peakReduction: 25, hoursProtected: 84, energyShifted: 672, costSavings: 1008000 },
      { month: 7, monthName: "Jul", peakDemandWithoutBattery: 138, hoursOverLimitWithoutBattery: 204, gridEnergyWithoutBattery: 64950, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 108, gridEnergyWithBattery: 64182, peakReduction: 32, hoursProtected: 96, energyShifted: 768, costSavings: 1152000 },
      { month: 8, monthName: "Aug", peakDemandWithoutBattery: 135, hoursOverLimitWithoutBattery: 186, gridEnergyWithoutBattery: 71756, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 96, gridEnergyWithBattery: 71036, peakReduction: 29, hoursProtected: 90, energyShifted: 720, costSavings: 1080000 },
      { month: 9, monthName: "Sep", peakDemandWithoutBattery: 132, hoursOverLimitWithoutBattery: 162, gridEnergyWithoutBattery: 59521, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 78, gridEnergyWithBattery: 58849, peakReduction: 26, hoursProtected: 84, energyShifted: 672, costSavings: 1008000 },
      { month: 10, monthName: "Oct", peakDemandWithoutBattery: 113, hoursOverLimitWithoutBattery: 42, gridEnergyWithoutBattery: 36516, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 36348, peakReduction: 7, hoursProtected: 42, energyShifted: 168, costSavings: 252000 },
      { month: 11, monthName: "Nov", peakDemandWithoutBattery: 119, hoursOverLimitWithoutBattery: 72, gridEnergyWithoutBattery: 41819, peakDemandWithBattery: 106, hoursOverLimitWithBattery: 12, gridEnergyWithBattery: 41531, peakReduction: 13, hoursProtected: 60, energyShifted: 288, costSavings: 432000 },
      { month: 12, monthName: "Dec", peakDemandWithoutBattery: 101, hoursOverLimitWithoutBattery: 0, gridEnergyWithoutBattery: 29040, peakDemandWithBattery: 101, hoursOverLimitWithBattery: 0, gridEnergyWithBattery: 29040, peakReduction: 0, hoursProtected: 0, energyShifted: 0, costSavings: 0 },
    ],
    totals: { totalPeakReduction: 166, totalHoursProtected: 598, totalEnergyShifted: 4032, totalCostSavings: 6048000, avgPeakReduction: 16.6 },
  },
];

// Helper functions
export const getBatteryImpactYearData = (year: string) =>
  batteryImpactYearlyData.find((d) => d.year === year) || batteryImpactYearlyData[0];

export const getBatteryImpactSummary = () =>
  batteryImpactYearlyData.map((d) => ({
    year: d.year,
    ...d.totals,
  }));

// Calculate ROI metrics
export const getBatteryROI = (year: string) => {
  const yearData = getBatteryImpactYearData(year);
  const batteryCost = 16 * 120000; // 16 MW * 120,000 EGP/MWh = 1.92M EGP
  const annualSavings = yearData.totals.totalCostSavings;
  const paybackYears = batteryCost / annualSavings;
  
  return {
    initialCost: batteryCost,
    annualSavings,
    paybackYears: annualSavings > 0 ? paybackYears : Infinity,
    roi: annualSavings > 0 ? ((annualSavings / batteryCost) * 100) : 0,
  };
};
