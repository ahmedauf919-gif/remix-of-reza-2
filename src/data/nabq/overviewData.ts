// NABQ Overview / Historical Data

export interface YearlyOverview {
  year: number;
  consumptionGwh: number;
  numberOfClients: number;
  arrivalMillion: number;
  revenueBillion: number;
}

export const yearlyOverviewData: YearlyOverview[] = [
  { year: 2013, consumptionGwh: 175, numberOfClients: 73, arrivalMillion: 9.464, revenueBillion: 5.9 },
  { year: 2014, consumptionGwh: 238, numberOfClients: 73, arrivalMillion: 9.878, revenueBillion: 5.1 },
  { year: 2015, consumptionGwh: 245, numberOfClients: 78, arrivalMillion: 9.3, revenueBillion: 7.4 },
  { year: 2016, consumptionGwh: 146, numberOfClients: 77, arrivalMillion: 5.4, revenueBillion: 3.8 },
  { year: 2017, consumptionGwh: 185, numberOfClients: 84, arrivalMillion: 8.3, revenueBillion: 4.4 },
  { year: 2018, consumptionGwh: 234, numberOfClients: 86, arrivalMillion: 11.3, revenueBillion: 9.8 },
  { year: 2019, consumptionGwh: 267, numberOfClients: 86, arrivalMillion: 13.026, revenueBillion: 12.6 },
  { year: 2020, consumptionGwh: 160, numberOfClients: 85, arrivalMillion: 3.7, revenueBillion: 9.0 },
  { year: 2021, consumptionGwh: 236, numberOfClients: 89, arrivalMillion: 8.0, revenueBillion: 4.9 },
  { year: 2022, consumptionGwh: 273, numberOfClients: 92, arrivalMillion: 11.7, revenueBillion: 10.7 },
  { year: 2023, consumptionGwh: 317, numberOfClients: 92, arrivalMillion: 14.906, revenueBillion: 13.6 },
  { year: 2024, consumptionGwh: 381, numberOfClients: 97, arrivalMillion: 15.7, revenueBillion: 14.4 },
  { year: 2025, consumptionGwh: 421, numberOfClients: 103, arrivalMillion: 18.0, revenueBillion: 15.0 },
];

// Transformer Power Factor by Month
export interface MonthlyPowerFactor {
  month: string;
  trns1: number;
  trns2: number;
  trns3: number;
}

export const monthlyPowerFactor: MonthlyPowerFactor[] = [
  { month: "Jan", trns1: 99.31, trns2: 98.37, trns3: 99.26 },
  { month: "Feb", trns1: 99.46, trns2: 98.21, trns3: 97.80 },
  { month: "Mar", trns1: 99.10, trns2: 96.34, trns3: 99.35 },
  { month: "Apr", trns1: 97.54, trns2: 96.11, trns3: 99.00 },
  { month: "May", trns1: 97.54, trns2: 95.01, trns3: 98.06 },
  { month: "Jun", trns1: 97.92, trns2: 95.41, trns3: 98.35 },
  { month: "Jul", trns1: 97.53, trns2: 95.80, trns3: 97.77 },
  { month: "Aug", trns1: 97.31, trns2: 96.29, trns3: 96.43 },
  { month: "Sep", trns1: 97.39, trns2: 95.25, trns3: 97.18 },
  { month: "Oct", trns1: 97.88, trns2: 95.28, trns3: 97.46 },
  { month: "Nov", trns1: 98.89, trns2: 96.05, trns3: 97.95 },
  { month: "Dec", trns1: 99.06, trns2: 97.31, trns3: 99.17 },
];

// Solar specs
export const solarSpecs = {
  capacity: 16, // MWp
  recordedYield2025: 2040, // MWp/MWh
  avgPowerFactor: 98, // %
};

// Monthly peak demand (max MW recorded per month) for 2023, 2024, 2025
// Extracted from Page 2 right-side summary
export interface MonthlyPeakDemand {
  month: string;
  peak2023: number;
  peak2024: number;
  peak2025: number;
}

export const monthlyPeakDemandOverview: MonthlyPeakDemand[] = [
  { month: "Jan", peak2023: 32, peak2024: 37, peak2025: 42 },
  { month: "Feb", peak2023: 31, peak2024: 36, peak2025: 40 },
  { month: "Mar", peak2023: 36, peak2024: 43, peak2025: 52 },
  { month: "Apr", peak2023: 47, peak2024: 61, peak2025: 70 },
  { month: "May", peak2023: 53, peak2024: 68, peak2025: 74 },
  { month: "Jun", peak2023: 64, peak2024: 81, peak2025: 79 },
  { month: "Jul", peak2023: 75, peak2024: 84, peak2025: 94 },
  { month: "Aug", peak2023: 80, peak2024: 87, peak2025: 102 },
  { month: "Sep", peak2023: 72, peak2024: 82, peak2025: 88 },
  { month: "Oct", peak2023: 64, peak2024: 67, peak2025: 78 },
  { month: "Nov", peak2023: 52, peak2024: 49, peak2025: 67 },
  { month: "Dec", peak2023: 38, peak2024: 32, peak2025: 53 },
];

// Average daily solar profile (MW) - averaged across all days of the year
// Hours 7-17 have meaningful solar generation
export const averageSolarProfile = [
  { hour: 0, mw: 0 }, { hour: 1, mw: 0 }, { hour: 2, mw: 0 },
  { hour: 3, mw: 0 }, { hour: 4, mw: 0 }, { hour: 5, mw: 0 },
  { hour: 6, mw: 0.05 }, { hour: 7, mw: 1.8 }, { hour: 8, mw: 6.5 },
  { hour: 9, mw: 10.0 }, { hour: 10, mw: 11.3 }, { hour: 11, mw: 11.8 },
  { hour: 12, mw: 11.6 }, { hour: 13, mw: 10.8 }, { hour: 14, mw: 9.2 },
  { hour: 15, mw: 5.3 }, { hour: 16, mw: 1.1 }, { hour: 17, mw: 0 },
  { hour: 18, mw: 0 }, { hour: 19, mw: 0 }, { hour: 20, mw: 0 },
  { hour: 21, mw: 0 }, { hour: 22, mw: 0 }, { hour: 23, mw: 0 },
];

// Monthly solar generation totals (MWh) - derived from hourly data
export const monthlySolarGeneration = [
  { month: "Jan", mwh: 138 },
  { month: "Feb", mwh: 142 },
  { month: "Mar", mwh: 168 },
  { month: "Apr", mwh: 182 },
  { month: "May", mwh: 195 },
  { month: "Jun", mwh: 198 },
  { month: "Jul", mwh: 201 },
  { month: "Aug", mwh: 192 },
  { month: "Sep", mwh: 176 },
  { month: "Oct", mwh: 162 },
  { month: "Nov", mwh: 140 },
  { month: "Dec", mwh: 146 },
];

// Overview KPIs
export const overviewKpis = {
  consumption2025: 421,
  clients2025: 103,
  solarCapacity: 16,
  solarYield: 2040,
  avgPowerFactor: 98,
  peakDemand2025: 102,
  arrivals2025: 18,
  revenue2025: 15,
  yoyGrowth: Math.round(((421 - 381) / 381) * 100),
};
