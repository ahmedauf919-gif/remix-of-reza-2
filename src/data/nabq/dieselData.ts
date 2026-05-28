// NABQ Diesel Power Consumption Data

export interface TransformerCapacityData {
  year: string;
  months: MonthlyCapacityData[];
  totalHours: number[];
  diesel: number;
}

export interface MonthlyCapacityData {
  month: number;
  monthName: string;
  levels: number[]; // [level1, level2, level3, level4, level5, level6]
  minMwh: number;
  maxMwh: number;
  avgMwh: number;
  diesel: number;
}

export interface DemandData {
  month: string;
  hour: number;
  demand2025: number;
  demand2026: number;
  demand2027: number;
  demand2028: number;
}

export interface KPIData {
  dieselNeeded: number;
  egpSpent: number;
  loadIncrease: number;
  efficiency: number;
  dieselPrice: number;
  targetMw: number;
}

// KPI Summary
export const kpiData: KPIData = {
  dieselNeeded: 21,
  egpSpent: 11,
  loadIncrease: 5,
  efficiency: 25,
  dieselPrice: 20,
  targetMw: 21,
};

// EGP Per Load Increase
export const egpPerLoadIncrease = {
  "5%": 11,
  "10%": 64,
  "15%": 201,
};

// Transformer Capacity Data by Year
export const transformerCapacityData: TransformerCapacityData[] = [
  {
    year: "2026",
    months: [
      { month: 1, monthName: "Jan", levels: [486, 257, 0, 0, 0, 0], minMwh: 17, maxMwh: 45, avgMwh: 31, diesel: 0 },
      { month: 2, monthName: "Feb", levels: [472, 200, 0, 0, 0, 0], minMwh: 18, maxMwh: 42, avgMwh: 29, diesel: 0 },
      { month: 3, monthName: "Mar", levels: [363, 381, 0, 0, 0, 0], minMwh: 19, maxMwh: 54, avgMwh: 33, diesel: 0 },
      { month: 4, monthName: "Apr", levels: [68, 638, 14, 0, 0, 0], minMwh: 23, maxMwh: 73, avgMwh: 44, diesel: 0 },
      { month: 5, monthName: "May", levels: [2, 646, 96, 0, 0, 0], minMwh: 24, maxMwh: 78, avgMwh: 53, diesel: 0 },
      { month: 6, monthName: "Jun", levels: [1, 505, 214, 0, 0, 0], minMwh: 29, maxMwh: 83, avgMwh: 62, diesel: 0 },
      { month: 7, monthName: "Jul", levels: [0, 119, 620, 5, 0, 0], minMwh: 40, maxMwh: 99, avgMwh: 73, diesel: 22140 },
      { month: 8, monthName: "Aug", levels: [1, 14, 692, 37, 0, 0], minMwh: 32, maxMwh: 107, avgMwh: 80, diesel: 841041 },
      { month: 9, monthName: "Sep", levels: [0, 247, 473, 0, 0, 0], minMwh: 34, maxMwh: 93, avgMwh: 69, diesel: 0 },
      { month: 10, monthName: "Oct", levels: [317, 315, 112, 0, 0, 0], minMwh: 0, maxMwh: 82, avgMwh: 43, diesel: 0 },
      { month: 11, monthName: "Nov", levels: [10, 671, 39, 0, 0, 0], minMwh: 23, maxMwh: 70, avgMwh: 49, diesel: 0 },
      { month: 12, monthName: "Dec", levels: [346, 399, 0, 0, 0, 0], minMwh: 11, maxMwh: 56, avgMwh: 34, diesel: 0 },
    ],
    totalHours: [1558, 3392, 1835, 20, 0, 0],
    diesel: 863181,
  },
  {
    year: "2027",
    months: [
      { month: 1, monthName: "Jan", levels: [441, 302, 0, 0, 0, 0], minMwh: 18, maxMwh: 47, avgMwh: 32, diesel: 0 },
      { month: 2, monthName: "Feb", levels: [447, 225, 0, 0, 0, 0], minMwh: 19, maxMwh: 44, avgMwh: 31, diesel: 0 },
      { month: 3, monthName: "Mar", levels: [301, 443, 0, 0, 0, 0], minMwh: 20, maxMwh: 57, avgMwh: 35, diesel: 0 },
      { month: 4, monthName: "Apr", levels: [36, 654, 30, 0, 0, 0], minMwh: 24, maxMwh: 77, avgMwh: 46, diesel: 0 },
      { month: 5, monthName: "May", levels: [2, 603, 139, 0, 0, 0], minMwh: 25, maxMwh: 82, avgMwh: 56, diesel: 0 },
      { month: 6, monthName: "Jun", levels: [1, 432, 287, 0, 0, 0], minMwh: 31, maxMwh: 87, avgMwh: 65, diesel: 0 },
      { month: 7, monthName: "Jul", levels: [0, 38, 684, 22, 0, 0], minMwh: 42, maxMwh: 104, avgMwh: 77, diesel: 342885 },
      { month: 8, monthName: "Aug", levels: [0, 6, 645, 78, 15, 0], minMwh: 34, maxMwh: 112, avgMwh: 84, diesel: 2413782 },
      { month: 9, monthName: "Sep", levels: [0, 129, 590, 1, 0, 0], minMwh: 36, maxMwh: 97, avgMwh: 73, diesel: 1167 },
      { month: 10, monthName: "Oct", levels: [317, 268, 159, 0, 0, 0], minMwh: 0, maxMwh: 86, avgMwh: 45, diesel: 0 },
      { month: 11, monthName: "Nov", levels: [10, 637, 73, 0, 0, 0], minMwh: 24, maxMwh: 74, avgMwh: 52, diesel: 0 },
      { month: 12, monthName: "Dec", levels: [274, 471, 0, 0, 0, 0], minMwh: 11, maxMwh: 59, avgMwh: 35, diesel: 0 },
    ],
    totalHours: [1558, 3392, 1835, 20, 0, 0],
    diesel: 2757833,
  },
  {
    year: "2028",
    months: [
      { month: 1, monthName: "Jan", levels: [376, 367, 0, 0, 0, 0], minMwh: 19, maxMwh: 49, avgMwh: 34, diesel: 0 },
      { month: 2, monthName: "Feb", levels: [414, 258, 0, 0, 0, 0], minMwh: 20, maxMwh: 46, avgMwh: 32, diesel: 0 },
      { month: 3, monthName: "Mar", levels: [254, 490, 0, 0, 0, 0], minMwh: 21, maxMwh: 60, avgMwh: 37, diesel: 0 },
      { month: 4, monthName: "Apr", levels: [23, 636, 61, 0, 0, 0], minMwh: 25, maxMwh: 81, avgMwh: 48, diesel: 0 },
      { month: 5, monthName: "May", levels: [2, 548, 194, 0, 0, 0], minMwh: 26, maxMwh: 86, avgMwh: 59, diesel: 0 },
      { month: 6, monthName: "Jun", levels: [1, 313, 406, 0, 0, 0], minMwh: 32, maxMwh: 92, avgMwh: 68, diesel: 0 },
      { month: 7, monthName: "Jul", levels: [0, 4, 694, 44, 2, 0], minMwh: 44, maxMwh: 109, avgMwh: 81, diesel: 1117258 },
      { month: 8, monthName: "Aug", levels: [0, 3, 572, 134, 35, 0], minMwh: 35, maxMwh: 117, avgMwh: 88, diesel: 5635258 },
      { month: 9, monthName: "Sep", levels: [0, 62, 637, 21, 0, 0], minMwh: 38, maxMwh: 102, avgMwh: 76, diesel: 213845 },
      { month: 10, monthName: "Oct", levels: [316, 234, 194, 0, 0, 0], minMwh: 0, maxMwh: 90, avgMwh: 47, diesel: 0 },
      { month: 11, monthName: "Nov", levels: [10, 591, 119, 0, 0, 0], minMwh: 25, maxMwh: 78, avgMwh: 54, diesel: 0 },
      { month: 12, monthName: "Dec", levels: [223, 522, 0, 0, 0, 0], minMwh: 12, maxMwh: 62, avgMwh: 37, diesel: 0 },
    ],
    totalHours: [1558, 3392, 1835, 20, 0, 0],
    diesel: 6966361,
  },
];

// Yearly diesel consumption summary
export const yearlyDieselSummary = [
  { year: "2026", diesel: 863181, egpCost: 863181 * 0.011 },
  { year: "2027", diesel: 2757833, egpCost: 2757833 * 0.011 },
  { year: "2028", diesel: 6966361, egpCost: 6966361 * 0.011 },
];

// Monthly demand trends for chart (based on avgMwh from transformer data)
export const monthlyDemandTrends = [
  { month: "Jan", y2025: 30, y2026: 31, y2027: 32, y2028: 34 },
  { month: "Feb", y2025: 28, y2026: 29, y2027: 31, y2028: 32 },
  { month: "Mar", y2025: 31, y2026: 33, y2027: 35, y2028: 37 },
  { month: "Apr", y2025: 42, y2026: 44, y2027: 46, y2028: 48 },
  { month: "May", y2025: 50, y2026: 53, y2027: 56, y2028: 59 },
  { month: "Jun", y2025: 59, y2026: 62, y2027: 65, y2028: 68 },
  { month: "Jul", y2025: 70, y2026: 73, y2027: 77, y2028: 81 },
  { month: "Aug", y2025: 76, y2026: 80, y2027: 84, y2028: 88 },
  { month: "Sep", y2025: 66, y2026: 69, y2027: 73, y2028: 76 },
  { month: "Oct", y2025: 41, y2026: 43, y2027: 45, y2028: 47 },
  { month: "Nov", y2025: 47, y2026: 49, y2027: 52, y2028: 54 },
  { month: "Dec", y2025: 32, y2026: 34, y2027: 35, y2028: 37 },
];

// Transformer loading levels
export const loadingLevels = [
  { level: 1, factor: "90%", capacity: "32.4 MWh" },
  { level: 2, factor: "90%", capacity: "64.8 MWh" },
  { level: 3, factor: "90%", capacity: "97.2 MWh" },
  { level: 4, factor: "100%", capacity: "108 MWh" },
  { level: 5, factor: "110%", capacity: "118.8 MWh" },
  { level: 6, factor: "120%", capacity: "129.6 MWh" },
];

export const transformerSpecs = {
  count: 3,
  powerFactor: 0.9,
  capacity: 40,
};
