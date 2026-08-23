import { useMemo, useState } from "react";
import { Search, X, Copy, Check, Mail } from "lucide-react";
import {
  ACCOUNTS, DIVISION_LABEL, getRecommendations, buildOutreachDraft,
  type Account, type Division,
} from "@/data/taqa/outreach";

const DIVISION_COLOR: Record<Division, string> = {
  "Gas": "hsl(38, 92%, 50%)",
  "Mobile CNG": "hsl(160, 70%, 45%)",
  "Electricity": "hsl(195, 90%, 48%)",
  "Water": "hsl(210, 80%, 55%)",
};

function DraftPanel({ account, onClose }: { account: Account; onClose: () => void }) {
  const draft = useMemo(() => buildOutreachDraft(account), [account]);
  const [copied, setCopied] = useState<"subject" | "body" | null>(null);

  const copy = async (text: string, which: "subject" | "body") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard API unavailable — nothing fatal, user can still select the text manually.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 relative"
        style={{ background: "#ffffff" }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mb-1 text-slate-500 text-xs uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" /> Outreach draft
        </div>
        <h3 className="text-slate-900 text-xl font-bold mb-4">{account.name}</h3>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-500 text-xs uppercase tracking-wider">Subject</span>
            <button
              onClick={() => copy(draft.subject, "subject")}
              className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800"
            >
              {copied === "subject" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === "subject" ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 font-medium">
            {draft.subject}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-500 text-xs uppercase tracking-wider">Body</span>
            <button
              onClick={() => copy(draft.body, "body")}
              className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800"
            >
              {copied === "body" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === "body" ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 border border-slate-200 px-3 py-3 text-sm text-slate-700 leading-relaxed font-sans">
            {draft.body}
          </pre>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Draft only — review and personalize before sending. [Name] / [Your name] are placeholders; this pipeline doesn't have a contact directory or a send step.
        </p>
      </div>
    </div>
  );
}

export function OpportunitiesTab() {
  const divisions = useMemo(() => Array.from(new Set(ACCOUNTS.map(a => a.division))), []);
  const sectors = useMemo(() => Array.from(new Set(ACCOUNTS.map(a => a.sector))).sort(), []);
  const governorates = useMemo(() => Array.from(new Set(ACCOUNTS.map(a => a.governorate))).sort(), []);

  const [divisionFilter, setDivisionFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [govFilter, setGovFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Account | null>(null);
  const perPage = 24;

  const filtered = useMemo(() => ACCOUNTS.filter(a => {
    if (divisionFilter && a.division !== divisionFilter) return false;
    if (sectorFilter && a.sector !== sectorFilter) return false;
    if (govFilter && a.governorate !== govFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (![a.name, a.sector, a.governorate].some(v => v.toLowerCase().includes(s))) return false;
    }
    return true;
  }), [divisionFilter, sectorFilter, govFilter, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice(page * perPage, (page + 1) * perPage);

  const selectStyle: React.CSSProperties = {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    outline: "none",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle at 20% 20%, hsl(160,70%,45%) 0%, transparent 40%), radial-gradient(circle at 80% 70%, hsl(38,92%,50%) 0%, transparent 45%)" }}
        />
        <div className="relative">
          <h2 className="text-slate-900 text-2xl md:text-3xl font-bold mb-2">Outreach Opportunities</h2>
          <p className="text-slate-600 max-w-2xl">
            Cross-sell candidates built from TAQA Arabia's own client records — existing relationship,
            sector, and the solution most likely to fit next. Excludes TAQA's own stations and
            infrastructure, so every row here is a real third-party account.
          </p>
          <div className="flex flex-wrap gap-6 mt-6">
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wider">Accounts</div>
              <div className="text-3xl font-bold" style={{ color: "hsl(var(--tab-theme))" }}>{ACCOUNTS.length.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wider">Sectors</div>
              <div className="text-3xl font-bold" style={{ color: "hsl(var(--tab-theme))" }}>{sectors.length}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase tracking-wider">Governorates</div>
              <div className="text-3xl font-bold" style={{ color: "hsl(var(--tab-theme))" }}>{governorates.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">Filters</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={divisionFilter} onChange={e => { setDivisionFilter(e.target.value); setPage(0); }} style={selectStyle}>
            <option value="">All Current Services</option>
            {divisions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={sectorFilter} onChange={e => { setSectorFilter(e.target.value); setPage(0); }} style={selectStyle}>
            <option value="">All Sectors</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={govFilter} onChange={e => { setGovFilter(e.target.value); setPage(0); }} style={selectStyle}>
            <option value="">All Governorates</option>
            {governorates.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="pl-9 pr-3 py-1.5 rounded-lg text-sm text-slate-800 outline-none focus:ring-1 focus:ring-blue-300"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              placeholder="Search company, sector…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
          {(divisionFilter || sectorFilter || govFilter || search) && (
            <button
              onClick={() => { setDivisionFilter(""); setSectorFilter(""); setGovFilter(""); setSearch(""); setPage(0); }}
              className="text-xs text-slate-500 hover:text-red-500 transition-colors px-2 py-1 rounded border border-slate-200"
            >
              Clear filters
            </button>
          )}
          <span className="text-xs text-slate-400 ml-auto">{filtered.length.toLocaleString()} matching</span>
        </div>
      </div>

      {/* Account cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slice.map(a => {
          const recs = getRecommendations(a);
          const color = DIVISION_COLOR[a.division];
          return (
            <button
              key={`${a.division}-${a.name}-${a.governorate}`}
              onClick={() => setSelected(a)}
              className="glass-card rounded-xl p-5 text-left border-l-4 hover:shadow-md transition-shadow"
              style={{ borderLeftColor: color }}
            >
              <div className="text-slate-800 font-bold text-sm leading-snug mb-1">{a.name}</div>
              <div className="text-slate-500 text-xs mb-3">{a.sector} · {a.governorate}</div>
              <div className="flex items-center gap-1.5 text-xs mb-3">
                <span className="px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}1a`, color }}>
                  Has {DIVISION_LABEL[a.division]}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recs.map(r => (
                  <span key={r.id} className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    + {r.label}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
        >
          Previous
        </button>
        <span>Page {page + 1} of {pages}</span>
        <button
          onClick={() => setPage(p => Math.min(pages - 1, p + 1))}
          disabled={page >= pages - 1}
          className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
        >
          Next
        </button>
      </div>

      {selected && <DraftPanel account={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
