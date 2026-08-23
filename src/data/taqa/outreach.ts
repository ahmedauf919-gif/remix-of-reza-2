// ─── Outreach Opportunities — Phase 1 (account data) + Phase 2 (draft generator) ──
//
// Builds a de-duplicated, cross-sell-ready account list from TAQA Arabia's own
// service records (Gas, Mobile CNG, Electricity, Water), then generates a
// tailored outreach draft per account: which additional TAQA solution fits
// their sector, why, and a ready-to-edit email a human reviews before sending.
//
// Petroleum is excluded entirely — that dataset is 100% TAQA's own fuel
// stations, not third-party clients. Records whose name starts with "محطة"/
// "محظة" ("station") are TAQA's own infrastructure in the other datasets too
// (e.g. CNG filling stations, a handful of gas/electricity meter points) and
// are filtered out the same way — we only want real companies to pitch.

import { taqaGasData } from "./taqaGas";
import { masterGasData } from "./masterGas";
import { electricityData } from "./electricity";
import { waterData } from "./water";
import type { ClientRecord } from "./types";

export type Division = "Gas" | "Mobile CNG" | "Electricity" | "Water";

export interface Account {
  name: string;
  sector: string;
  governorate: string;
  division: Division;
  divisionService: string;
}

const STATION_PREFIXES = ["محطة", "محظة"];

function isOwnInfrastructure(name: string): boolean {
  const n = name.trim();
  return STATION_PREFIXES.some(p => n.startsWith(p));
}

function toAccounts(records: ClientRecord[], division: Division): Account[] {
  return records
    .filter(r => !isOwnInfrastructure(r.name))
    .map(r => ({ name: r.name, sector: r.activity, governorate: r.governorate, division, divisionService: r.service }));
}

export const ACCOUNTS: Account[] = [
  ...toAccounts(taqaGasData, "Gas"),
  ...toAccounts(masterGasData.filter(r => r.service === "Mobile CNG Units"), "Mobile CNG"),
  ...toAccounts(electricityData, "Electricity"),
  ...toAccounts(waterData, "Water"),
];

export const DIVISION_LABEL: Record<Division, string> = {
  "Gas": "natural gas",
  "Mobile CNG": "mobile CNG",
  "Electricity": "electricity distribution",
  "Water": "water desalination",
};

// ─── Solutions catalogue ────────────────────────────────────────────────────

export interface Solution {
  id: string;
  label: string;
  valueProp: string;
}

export const SOLUTIONS: Record<string, Solution> = {
  solar: {
    id: "solar",
    label: "Solar PV",
    valueProp: "Solar power costs well below grid tariffs and locks in that rate for decades — TAQA finances, builds and owns the system, so there's no upfront capital required.",
  },
  cng: {
    id: "cng",
    label: "Mobile CNG",
    valueProp: "Mobile CNG delivered by virtual pipeline cuts fuel costs against diesel and LPG, with roughly 24% lower CO2 emissions, and needs no fixed pipeline connection.",
  },
  chp: {
    id: "chp",
    label: "Combined Heat & Power",
    valueProp: "A single fuel input generates electricity, steam and hot water at up to 85% efficiency — built for energy-intensive, round-the-clock processes.",
  },
  bess: {
    id: "bess",
    label: "Energy Storage (BESS)",
    valueProp: "Battery storage shaves peak-demand charges, delivers instant backup during outages, and can unlock grid-services revenue.",
  },
  electricity: {
    id: "electricity",
    label: "Electricity Distribution",
    valueProp: "A licensed, turnkey power network with smart metering and 24/7 operations — reliable supply without stretching public infrastructure.",
  },
  gas: {
    id: "gas",
    label: "Gas Distribution",
    valueProp: "A licensed piped-gas network delivering process-grade gas, cheaper than LPG or diesel, with lifetime operations and maintenance.",
  },
  water: {
    id: "water",
    label: "Water Desalination",
    valueProp: "TAQA builds, owns and operates the desalination plant, guaranteeing both volume and water quality.",
  },
  ev: {
    id: "ev",
    label: "EV Charging",
    valueProp: "Depot and destination EV charging backed by Egypt's first private EV-charging licence.",
  },
};

// Which solution a confirmed division relationship already covers — excluded
// from that account's recommendations so we never pitch what they already have.
const DIVISION_SOLUTION: Record<Division, string> = {
  "Gas": "gas",
  "Mobile CNG": "cng",
  "Electricity": "electricity",
  "Water": "water",
};

// ─── Sector playbook ────────────────────────────────────────────────────────
// sector (matches the `activity` field in the raw data) -> up to 2 recommended
// solutions (most relevant first) + the pain point that opens the pitch.

export const SECTOR_PLAYBOOK: Record<string, { solutions: string[]; painPoint: string }> = {
  "Cement": { solutions: ["chp", "solar"], painPoint: "round-the-clock kiln and grinding loads make energy one of the largest line items on the P&L" },
  "Iron & Steel": { solutions: ["chp", "bess"], painPoint: "continuous furnace and rolling operations are exposed to every grid outage and tariff hike" },
  "Glass": { solutions: ["chp", "solar"], painPoint: "furnace operations run non-stop and are highly sensitive to energy cost swings" },
  "Aluminum": { solutions: ["chp", "bess"], painPoint: "smelting and casting loads are constant and unforgiving of power interruptions" },
  "Petrochemicals": { solutions: ["chp", "bess"], painPoint: "continuous process trains carry real downtime risk from any single point of energy failure" },
  "Fertilizers": { solutions: ["chp", "solar"], painPoint: "feedstock and utility costs are under constant margin pressure" },
  "Ceramics & Porcelain": { solutions: ["solar", "chp"], painPoint: "kiln energy use is one of the biggest controllable costs in the plant" },
  "Food Industries": { solutions: ["solar", "cng"], painPoint: "cold-chain and processing loads run daily, and fuel costs move with global prices" },
  "Pharmaceuticals": { solutions: ["solar", "bess"], painPoint: "clean-room and cold-chain uptime can't tolerate an unplanned outage" },
  "Textile & Spinning": { solutions: ["solar", "cng"], painPoint: "energy is a major share of production cost in a thin-margin, export-exposed business" },
  "Engineering Industries": { solutions: ["solar", "cng"], painPoint: "diverse, energy-intensive processes leave real room to cut the utility bill" },
  "Brick Kilns": { solutions: ["cng", "solar"], painPoint: "kiln fuel cost moves directly with diesel and LPG prices" },
  "Other Industries": { solutions: ["solar", "cng"], painPoint: "industrial energy cost is a controllable line item worth revisiting" },
  "Natural Gas Products": { solutions: ["bess", "solar"], painPoint: "process reliability depends on stable, well-managed power" },
  "Petroleum Products": { solutions: ["solar", "bess"], painPoint: "site operations run continuously and carry real exposure to grid instability" },
  "Hotels": { solutions: ["solar", "water"], painPoint: "guest experience depends on uninterrupted power and water, both of which show up directly on the utility bill" },
  "Residential Complex": { solutions: ["solar", "water"], painPoint: "common-area energy and water costs are a growing line item for residents and developers alike" },
  "Shopping Center": { solutions: ["solar", "bess"], painPoint: "HVAC and lighting loads run all day, every day, with real backup-power exposure" },
  "Power Stations": { solutions: ["bess", "solar"], painPoint: "grid-services and storage revenue is an underused asset for generation sites" },
  "Water Plant": { solutions: ["solar", "bess"], painPoint: "pumping and treatment loads are constant, energy-intensive, and a natural fit for on-site generation" },
  "Vehicle Fueling": { solutions: ["cng", "ev"], painPoint: "fleet and forecourt customers are increasingly asking for lower-cost, lower-emission fuel options" },
  "Other Services": { solutions: ["solar", "electricity"], painPoint: "energy cost is a controllable overhead worth a second look" },
  "Electricity": { solutions: ["bess", "solar"], painPoint: "grid-services and storage revenue is an underused asset for generation sites" },
};

// Natural-language descriptor for "working with other ___" — derived by hand
// rather than lowercasing the sector label, since a few labels ("Other
// Industries", "Other Services") would otherwise read as "other other X".
const SECTOR_DESCRIPTOR: Record<string, string> = {
  "Cement": "cement producers",
  "Iron & Steel": "iron and steel producers",
  "Glass": "glass manufacturers",
  "Aluminum": "aluminum producers",
  "Petrochemicals": "petrochemical operators",
  "Fertilizers": "fertilizer producers",
  "Ceramics & Porcelain": "ceramics and porcelain manufacturers",
  "Food Industries": "food manufacturers",
  "Pharmaceuticals": "pharmaceutical manufacturers",
  "Textile & Spinning": "textile and spinning operators",
  "Engineering Industries": "engineering-industry operators",
  "Brick Kilns": "brick kiln operators",
  "Other Industries": "industrial operators",
  "Natural Gas Products": "natural gas product operators",
  "Petroleum Products": "petroleum product operators",
  "Hotels": "hotel operators",
  "Residential Complex": "residential developers",
  "Shopping Center": "shopping center operators",
  "Power Stations": "power generation operators",
  "Water Plant": "water plant operators",
  "Vehicle Fueling": "fueling-station operators",
  "Other Services": "service-sector operators",
  "Electricity": "power generation operators",
};

export function getRecommendations(a: Account): Solution[] {
  const playbook = SECTOR_PLAYBOOK[a.sector];
  const owned = DIVISION_SOLUTION[a.division];
  const ids = (playbook?.solutions ?? ["solar", "cng"]).filter(id => id !== owned);
  const finalIds = ids.length ? ids : (playbook?.solutions ?? ["solar"]);
  return finalIds.map(id => SOLUTIONS[id]).filter((s): s is Solution => !!s);
}

// ─── Phase 2: personalized outreach draft ──────────────────────────────────

export interface OutreachDraft {
  subject: string;
  body: string;
}

export function buildOutreachDraft(a: Account): OutreachDraft {
  const recs = getRecommendations(a);
  const top = recs[0] ?? SOLUTIONS.solar;
  const second = recs[1];
  const playbook = SECTOR_PLAYBOOK[a.sector];
  const painPoint = playbook?.painPoint ?? "energy cost is a controllable overhead worth a second look";
  const divisionLabel = DIVISION_LABEL[a.division];

  const subject = `TAQA Arabia × ${a.name} — cutting energy cost with ${top.label}`;

  const lines = [
    `Hi [Name],`,
    ``,
    `TAQA Arabia already supplies ${a.name} with ${divisionLabel} in ${a.governorate}. Working with other ${SECTOR_DESCRIPTOR[a.sector] ?? "operators in your sector"}, one thing comes up again and again: ${painPoint}.`,
    ``,
    `${top.label} is usually the fastest place to start. ${top.valueProp}`,
    second ? `${second.label} is a natural complement: ${second.valueProp}` : null,
    ``,
    `I'd like to share a short, tailored overview of how this could work for your site — happy to send it over or set up a 15-minute call, whichever is easier.`,
    ``,
    `Best,`,
    `[Your name]`,
    `TAQA Arabia`,
  ].filter((l): l is string => l !== null);

  return { subject, body: lines.join("\n") };
}
