// NABQ Clients Detail Data (from Clients.xlsx)

export interface ClientDetail {
  rank: number;
  name: string;
  consumption: number; // kWh
  share: number; // %
  contractedCapacity: number; // kVA
  maxLoad: number; // kW
  exceedance: number; // kVA (negative means exceeded)
  unutilized: number; // % (<50% utilization)
}

export const allClients: ClientDetail[] = [
  { rank: 1, name: "Radamis", consumption: 48888554, share: 11, contractedCapacity: 4348, maxLoad: 15838, exceedance: 11490, unutilized: 0 },
  { rank: 2, name: "Grand Azure", consumption: 38362874, share: 8, contractedCapacity: 16696, maxLoad: 13811, exceedance: 0, unutilized: 0 },
  { rank: 3, name: "IU", consumption: 29119680, share: 6, contractedCapacity: 2174, maxLoad: 9488, exceedance: 7314, unutilized: 0 },
  { rank: 4, name: "Rainbow", consumption: 20524061, share: 4, contractedCapacity: 2000, maxLoad: 6009, exceedance: 4009, unutilized: 0 },
  { rank: 5, name: "Lagouna Viesta", consumption: 19490842, share: 4, contractedCapacity: 4620, maxLoad: 5912, exceedance: 1292, unutilized: 0 },
  { rank: 6, name: "Sea Club", consumption: 19330302, share: 4, contractedCapacity: 5435, maxLoad: 5619, exceedance: 184, unutilized: 0 },
  { rank: 7, name: "Nabq Oriental (Rixos)", consumption: 17733784, share: 4, contractedCapacity: 6522, maxLoad: 5095, exceedance: 0, unutilized: 0 },
  { rank: 8, name: "Moran", consumption: 15146711, share: 3, contractedCapacity: 4348, maxLoad: 4510, exceedance: 162, unutilized: 0 },
  { rank: 9, name: "Garden Palace", consumption: 15109513, share: 3, contractedCapacity: 2174, maxLoad: 4484, exceedance: 2310, unutilized: 0 },
  { rank: 10, name: "AL-Batrous", consumption: 13972535, share: 3, contractedCapacity: 2174, maxLoad: 4178, exceedance: 2005, unutilized: 0 },
  { rank: 11, name: "Dahabia", consumption: 13703969, share: 3, contractedCapacity: 2174, maxLoad: 4255, exceedance: 2081, unutilized: 0 },
  { rank: 12, name: "Coral Sea", consumption: 12331309, share: 3, contractedCapacity: 2874, maxLoad: 3683, exceedance: 809, unutilized: 0 },
  { rank: 13, name: "Nobian Village", consumption: 12168873, share: 3, contractedCapacity: 4348, maxLoad: 3536, exceedance: 0, unutilized: 0 },
  { rank: 14, name: "Bab EL-Shams", consumption: 12116946, share: 3, contractedCapacity: 4022, maxLoad: 3615, exceedance: 0, unutilized: 0 },
  { rank: 15, name: "Magic Life", consumption: 10856164, share: 2, contractedCapacity: 2717, maxLoad: 3146, exceedance: 429, unutilized: 0 },
  { rank: 16, name: "Rehana", consumption: 10107377, share: 2, contractedCapacity: 4620, maxLoad: 3232, exceedance: 0, unutilized: 0 },
  { rank: 17, name: "Oriental", consumption: 9979920, share: 2, contractedCapacity: 4891, maxLoad: 3314, exceedance: 0, unutilized: 0 },
  { rank: 18, name: "Hilton Sharm", consumption: 9373685, share: 2, contractedCapacity: 2717, maxLoad: 2858, exceedance: 141, unutilized: 0 },
  { rank: 19, name: "shram land", consumption: 8935403, share: 2, contractedCapacity: 2174, maxLoad: 2644, exceedance: 470, unutilized: 0 },
  { rank: 20, name: "Nobian Sharm", consumption: 8311163, share: 2, contractedCapacity: 543, maxLoad: 3030, exceedance: 2486, unutilized: 0 },
  { rank: 21, name: "Dimound Plaza", consumption: 8046916, share: 2, contractedCapacity: 4891, maxLoad: 2637, exceedance: 0, unutilized: 0 },
  { rank: 22, name: "Regency Plaza", consumption: 7074939, share: 2, contractedCapacity: 1087, maxLoad: 2395, exceedance: 1308, unutilized: 0 },
  { rank: 23, name: "Delmar (Porto Sharm)", consumption: 6918235, share: 2, contractedCapacity: 2174, maxLoad: 2099, exceedance: 0, unutilized: 0 },
  { rank: 24, name: "Tower Prestige", consumption: 6569314, share: 1, contractedCapacity: 8696, maxLoad: 2011, exceedance: 0, unutilized: 23 },
  { rank: 25, name: "Splash", consumption: 6335925, share: 1, contractedCapacity: 100, maxLoad: 1794, exceedance: 1694, unutilized: 0 },
  { rank: 26, name: "Sun Moon", consumption: 6160752, share: 1, contractedCapacity: 1739, maxLoad: 2185, exceedance: 446, unutilized: 0 },
  { rank: 27, name: "Nabq Sinai", consumption: 6126500, share: 1, contractedCapacity: 1630, maxLoad: 1926, exceedance: 295, unutilized: 0 },
  { rank: 28, name: "Sharm Residence", consumption: 5757028, share: 1, contractedCapacity: 1087, maxLoad: 2076, exceedance: 989, unutilized: 0 },
  { rank: 29, name: "Joy", consumption: 5401752, share: 1, contractedCapacity: 2174, maxLoad: 1538, exceedance: 0, unutilized: 0 },
  { rank: 30, name: "Palmes Grand Plaza", consumption: 5308457, share: 1, contractedCapacity: 811, maxLoad: 1566, exceedance: 755, unutilized: 0 },
  { rank: 31, name: "Intercontinital", consumption: 4328240, share: 1, contractedCapacity: 1087, maxLoad: 1539, exceedance: 452, unutilized: 0 },
  { rank: 32, name: "Nabq Development", consumption: 3795800, share: 1, contractedCapacity: 1630, maxLoad: 1282, exceedance: 0, unutilized: 0 },
  { rank: 33, name: "Pharana park", consumption: 3648175, share: 1, contractedCapacity: 543, maxLoad: 1217, exceedance: 674, unutilized: 0 },
  { rank: 34, name: "Relantex", consumption: 3187122, share: 1, contractedCapacity: 6000, maxLoad: 920, exceedance: 0, unutilized: 15 },
  { rank: 35, name: "Travco Housing", consumption: 2738375, share: 1, contractedCapacity: 652, maxLoad: 982, exceedance: 330, unutilized: 0 },
  { rank: 36, name: "Maraqia sharm", consumption: 2594994, share: 1, contractedCapacity: 800, maxLoad: 824, exceedance: 24, unutilized: 0 },
  { rank: 37, name: "Sharm Bride", consumption: 2366097, share: 1, contractedCapacity: 1087, maxLoad: 1021, exceedance: 0, unutilized: 0 },
  { rank: 38, name: "Palmera", consumption: 2312000, share: 1, contractedCapacity: 1087, maxLoad: 788, exceedance: 0, unutilized: 0 },
  { rank: 39, name: "City Stars", consumption: 2190678, share: 0, contractedCapacity: 76087, maxLoad: 600, exceedance: 0, unutilized: 1 },
  { rank: 40, name: "Sharm Up", consumption: 2155128, share: 0, contractedCapacity: 435, maxLoad: 732, exceedance: 297, unutilized: 0 },
  { rank: 41, name: "Sabah", consumption: 1543157, share: 0, contractedCapacity: 1087, maxLoad: 540, exceedance: 0, unutilized: 50 },
  { rank: 42, name: "Misr Tiran", consumption: 1508100, share: 0, contractedCapacity: 217, maxLoad: 450, exceedance: 233, unutilized: 0 },
  { rank: 43, name: "The Egyptian Mall", consumption: 1414025, share: 0, contractedCapacity: 109, maxLoad: 403, exceedance: 294, unutilized: 0 },
  { rank: 44, name: "Mona Sharm", consumption: 1238169, share: 0, contractedCapacity: 54, maxLoad: 446, exceedance: 391, unutilized: 0 },
  { rank: 45, name: "Rief Goash", consumption: 1096722, share: 0, contractedCapacity: 50, maxLoad: 401, exceedance: 351, unutilized: 0 },
  { rank: 46, name: "Lagouna Residence", consumption: 1048767, share: 0, contractedCapacity: 3261, maxLoad: 349, exceedance: 0, unutilized: 11 },
  { rank: 47, name: "Lagonna TDA", consumption: 999302, share: 0, contractedCapacity: 1196, maxLoad: 345, exceedance: 0, unutilized: 29 },
  { rank: 48, name: "Napq Mall", consumption: 920844, share: 0, contractedCapacity: 543, maxLoad: 312, exceedance: 0, unutilized: 0 },
  { rank: 49, name: "Environment", consumption: 919239, share: 0, contractedCapacity: 1087, maxLoad: 294, exceedance: 0, unutilized: 27 },
  { rank: 50, name: "Hayat Sharm", consumption: 846476, share: 0, contractedCapacity: 1087, maxLoad: 307, exceedance: 0, unutilized: 28 },
  { rank: 51, name: "Nabq Park Residence", consumption: 787518, share: 0, contractedCapacity: 22, maxLoad: 299, exceedance: 277, unutilized: 0 },
  { rank: 52, name: "Nabq Hites", consumption: 716587, share: 0, contractedCapacity: 109, maxLoad: 241, exceedance: 132, unutilized: 0 },
  { rank: 53, name: "EL -Qaheria", consumption: 636060, share: 0, contractedCapacity: 50, maxLoad: 206, exceedance: 156, unutilized: 0 },
  { rank: 54, name: "Dolfina", consumption: 605082, share: 0, contractedCapacity: 489, maxLoad: 250, exceedance: 0, unutilized: 0 },
  { rank: 55, name: "شركة مترو للتجارة والتوزيع", consumption: 562291, share: 0, contractedCapacity: 0, maxLoad: 168, exceedance: 168, unutilized: 0 },
  { rank: 56, name: "كونكريت للتنميه السياحيه", consumption: 503722, share: 0, contractedCapacity: 50, maxLoad: 181, exceedance: 131, unutilized: 0 },
  { rank: 57, name: "Moon Shah", consumption: 478697, share: 0, contractedCapacity: 1630, maxLoad: 166, exceedance: 0, unutilized: 10 },
  { rank: 58, name: "Sabina", consumption: 445079, share: 0, contractedCapacity: 543, maxLoad: 132, exceedance: 0, unutilized: 24 },
  { rank: 59, name: "Haskey", consumption: 407225, share: 0, contractedCapacity: 543, maxLoad: 145, exceedance: 0, unutilized: 27 },
  { rank: 60, name: "بالميرا للفنادق والمنتجعات السياحية", consumption: 357791, share: 0, contractedCapacity: 1087, maxLoad: 127, exceedance: 0, unutilized: 12 },
  { rank: 61, name: "Light sharm", consumption: 346528, share: 0, contractedCapacity: 435, maxLoad: 119, exceedance: 0, unutilized: 27 },
  { rank: 62, name: "شاترنج للإنشاءات والتنمية السياحية", consumption: 334755, share: 0, contractedCapacity: 54, maxLoad: 100, exceedance: 46, unutilized: 0 },
  { rank: 63, name: "policeman complex", consumption: 329237, share: 0, contractedCapacity: 109, maxLoad: 102, exceedance: 0, unutilized: 0 },
  { rank: 64, name: "Oriental / La-Strada Mall", consumption: 293354, share: 0, contractedCapacity: 0, maxLoad: 161, exceedance: 161, unutilized: 0 },
  { rank: 65, name: "Horizon", consumption: 250303, share: 0, contractedCapacity: 652, maxLoad: 89, exceedance: 0, unutilized: 14 },
  { rank: 66, name: "Hyber Market White & Night", consumption: 219745, share: 0, contractedCapacity: 543, maxLoad: 61, exceedance: 0, unutilized: 11 },
  { rank: 67, name: "EL-Mawany", consumption: 180673, share: 0, contractedCapacity: 543, maxLoad: 55, exceedance: 0, unutilized: 10 },
  { rank: 68, name: "MFO", consumption: 178403, share: 0, contractedCapacity: 163, maxLoad: 49, exceedance: 0, unutilized: 30 },
  { rank: 69, name: "Le Mirage", consumption: 173846, share: 0, contractedCapacity: 100, maxLoad: 63, exceedance: 0, unutilized: 0 },
  { rank: 70, name: "الوحدة المحلية لمدينة شرم الشيخ", consumption: 129677, share: 0, contractedCapacity: 0, maxLoad: 39, exceedance: 39, unutilized: 0 },
  { rank: 71, name: "Nabq Central", consumption: 100606, share: 0, contractedCapacity: 543, maxLoad: 40, exceedance: 0, unutilized: 7 },
  { rank: 72, name: "Vodafone", consumption: 98962, share: 0, contractedCapacity: 543, maxLoad: 31, exceedance: 0, unutilized: 6 },
  { rank: 73, name: "البنك الأهلى سوستيه جنرال سابقا", consumption: 55403, share: 0, contractedCapacity: 0, maxLoad: 17, exceedance: 17, unutilized: 0 },
  { rank: 74, name: "Ragab Sons", consumption: 54202, share: 0, contractedCapacity: 435, maxLoad: 56, exceedance: 0, unutilized: 13 },
  { rank: 75, name: "Medical Storage", consumption: 43263, share: 0, contractedCapacity: 217, maxLoad: 15, exceedance: 0, unutilized: 7 },
  { rank: 76, name: "Egi Dream", consumption: 28724, share: 0, contractedCapacity: 40, maxLoad: 8, exceedance: 0, unutilized: 21 },
  { rank: 77, name: "Infinity e", consumption: 26883, share: 0, contractedCapacity: 0, maxLoad: 11, exceedance: 11, unutilized: 0 },
  { rank: 78, name: "محطة رقم H5067", consumption: 23987, share: 0, contractedCapacity: 0, maxLoad: 11, exceedance: 11, unutilized: 0 },
  { rank: 79, name: "محمية نبق - وزارة البيئة", consumption: 1910, share: 0, contractedCapacity: 5, maxLoad: 1, exceedance: 0, unutilized: 25 },
  { rank: 80, name: "TAQA Volt", consumption: 1655, share: 0, contractedCapacity: 0, maxLoad: 4, exceedance: 4, unutilized: 0 },
  { rank: 81, name: "Tower Center", consumption: 156, share: 0, contractedCapacity: 2174, maxLoad: 0, exceedance: 0, unutilized: 0 },
  { rank: 82, name: "سوان للتنمية السياحية", consumption: 11, share: 0, contractedCapacity: 109, maxLoad: 0, exceedance: 0, unutilized: 0 },
  { rank: 83, name: "Zawara", consumption: 0, share: 0, contractedCapacity: 652, maxLoad: 0, exceedance: 0, unutilized: 0 },
  { rank: 84, name: "IWPC- Nabq", consumption: 0, share: 0, contractedCapacity: 0, maxLoad: 0, exceedance: 0, unutilized: 0 },
  { rank: 85, name: "Hausa", consumption: 0, share: 0, contractedCapacity: 1304, maxLoad: 0, exceedance: 0, unutilized: 0 },
  { rank: 86, name: "Nabq for Tourstic services", consumption: 0, share: 0, contractedCapacity: 50, maxLoad: 0, exceedance: 0, unutilized: 0 },
];

// Top 20 clients for consumption share chart
export const top20Clients = allClients.slice(0, 20);

// Clients exceeding capacity (exceedance > 0)
export const clientExceedances = allClients
  .filter((c) => c.exceedance > 0)
  .sort((a, b) => b.exceedance - a.exceedance)
  .map((c) => ({
    name: c.name,
    contractedCapacity: c.contractedCapacity,
    exceededCapacity: c.exceedance,
    maxLoad: c.maxLoad,
  }));

// Unutilized clients (unutilized > 0)
export const unutilizedClients = allClients
  .filter((c) => c.unutilized > 0)
  .sort((a, b) => b.unutilized - a.unutilized);

// KPI data
export const clientsDetailKpi = {
  totalClients: allClients.length,
  totalConsumption: allClients.reduce((s, c) => s + c.consumption, 0),
  clientsExceeding: clientExceedances.length,
  totalExceedance: clientExceedances.reduce((s, c) => s + c.exceededCapacity, 0),
  totalContracted: allClients.reduce((s, c) => s + c.contractedCapacity, 0),
};
