export type ModelId = "wind-a" | "wind-b" | "pv" | "water" | "cng" | "lng" | "nabq";
export type DirCategoryId = "investment" | "sizing" | "presentations";

export interface DirectoryEntry {
  id: string;
  name: string;
  notes?: string;
  category: DirCategoryId;
  modelId: ModelId | string;
  modelLabel: string;
  modelHref: string;
  inputsSnapshot: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const DIR_KEY = "taqa_directory_v1";
const PENDING_KEY = "taqa_dir_pending_v1";

export const MODEL_META: Record<string, { label: string; href: string; category: DirCategoryId; tag: string; tagColor: string }> = {
  "wind-a": { label: "Wind – REZA A",      href: "/models/reza",   category: "investment", tag: "Wind",  tagColor: "bg-[#005298]/10 text-[#005298]" },
  "wind-b": { label: "Solar – REZA B",     href: "/models/reza-2", category: "investment", tag: "Solar", tagColor: "bg-amber-50 text-amber-700" },
  "pv":     { label: "PV Solar",           href: "/models/pv",     category: "investment", tag: "Solar", tagColor: "bg-amber-50 text-amber-700" },
  "water":  { label: "Water (SWRO)",       href: "/models/water",  category: "investment", tag: "Water", tagColor: "bg-cyan-50 text-cyan-700" },
  "cng":    { label: "Mobile CNG",         href: "/models/cng",    category: "investment", tag: "Gas",   tagColor: "bg-emerald-50 text-emerald-700" },
  "lng":    { label: "Tanzania Micro LNG", href: "/models/lngtz",  category: "investment", tag: "LNG",   tagColor: "bg-orange-50 text-orange-700" },
  "nabq":   { label: "NABQ Dashboard",     href: "/sizing/nabq",   category: "sizing",     tag: "Sizing", tagColor: "bg-emerald-50 text-emerald-700" },
};

export function loadEntries(): DirectoryEntry[] {
  try { const r = localStorage.getItem(DIR_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
export function saveEntries(entries: DirectoryEntry[]): void {
  localStorage.setItem(DIR_KEY, JSON.stringify(entries));
}
export function addEntry(e: Omit<DirectoryEntry, "id" | "createdAt" | "updatedAt">): DirectoryEntry {
  const now = new Date().toISOString();
  const entry: DirectoryEntry = { ...e, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  saveEntries([...loadEntries(), entry]);
  return entry;
}
export function updateEntry(id: string, patch: Partial<DirectoryEntry>): void {
  saveEntries(loadEntries().map(e => e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e));
}
export function removeEntry(id: string): void {
  saveEntries(loadEntries().filter(e => e.id !== id));
}
export function setPendingLoad(modelId: string, inputs: Record<string, unknown>): void {
  localStorage.setItem(PENDING_KEY, JSON.stringify({ modelId, inputs }));
}
export function takePendingLoad(modelId: string): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const { modelId: mid, inputs } = JSON.parse(raw);
    if (mid === modelId) { localStorage.removeItem(PENDING_KEY); return inputs; }
    return null;
  } catch { return null; }
}
