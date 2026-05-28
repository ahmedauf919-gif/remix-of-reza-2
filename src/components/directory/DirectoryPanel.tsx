import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FolderOpen, Trash2, ChevronDown, ChevronRight, BookMarked } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loadEntries, removeEntry, setPendingLoad, DirectoryEntry } from "@/lib/directoryStore";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

interface SectionProps {
  title: string;
  entries: DirectoryEntry[];
  onOpen: (entry: DirectoryEntry) => void;
  onDelete: (id: string) => void;
  confirmingId: string | null;
  setConfirmingId: (id: string | null) => void;
  selected: string[];
  onToggleSelect: (id: string, checked: boolean) => void;
}

function Section({ title, entries, onOpen, onDelete, confirmingId, setConfirmingId, selected, onToggleSelect }: SectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 w-full text-left px-1 py-2 rounded-lg hover:bg-muted/50 transition-colors"
      >
        {open
          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
          : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        <span className="text-sm font-semibold text-[#002060]">{title}</span>
        <span className="ml-auto text-[11px] text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted">
          {entries.length}
        </span>
      </button>

      {open && (
        <div className="mt-1 space-y-2 pl-6">
          {entries.length === 0 ? (
            <p className="text-xs text-muted-foreground py-3 italic">
              No saved scenarios yet. Open a model and click Save to Directory.
            </p>
          ) : (
            entries.map(entry => (
              <div
                key={entry.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-white px-4 py-3 shadow-sm hover:border-[#005298]/30 transition-colors"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border accent-[#005298] shrink-0 mt-0.5 cursor-pointer"
                  checked={selected.includes(entry.id)}
                  onChange={e => onToggleSelect(entry.id, e.target.checked)}
                  disabled={!selected.includes(entry.id) && selected.length >= 2}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-[#002060] truncate">{entry.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 bg-[#005298]/10 text-[#005298]`}>
                      {entry.modelLabel}
                    </span>
                    <span className="text-[11px] text-muted-foreground ml-auto shrink-0">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-[#005298] hover:bg-[#005298]/10"
                    onClick={() => onOpen(entry)}
                  >
                    <FolderOpen className="h-3.5 w-3.5 mr-1" /> Open
                  </Button>
                  {confirmingId === entry.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-red-600 hover:bg-red-50"
                        onClick={() => { onDelete(entry.id); setConfirmingId(null); }}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => setConfirmingId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                      onClick={() => setConfirmingId(entry.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function DirectoryPanel() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DirectoryEntry[]>(() => loadEntries());
  const [search, setSearch] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const filtered = search.trim()
    ? entries.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.modelLabel.toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  const investment = filtered.filter(e => e.category === "investment");
  const sizing = filtered.filter(e => e.category === "sizing");
  const presentations = filtered.filter(e => e.category === "presentations");

  const handleOpen = (entry: DirectoryEntry) => {
    setPendingLoad(entry.modelId, entry.inputsSnapshot);
    navigate(entry.modelHref);
  };

  const handleDelete = (id: string) => {
    removeEntry(id);
    setEntries(loadEntries());
  };

  const handleToggleSelect = (id: string, checked: boolean) => {
    if (checked && selected.length < 2) setSelected(s => [...s, id]);
    else if (!checked) setSelected(s => s.filter(sid => sid !== id));
  };

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-[#f8fafc]">
        <BookMarked className="h-5 w-5 text-[#002060]" />
        <div>
          <h2 className="font-bold text-[#002060] text-base leading-none">Saved Scenarios</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {entries.length} saved · click Open to reload any configuration
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="sticky top-0 z-10 px-6 py-3 border-b border-border bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name or model…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="px-6 py-4">
        <Section
          title="Investment Models"
          entries={investment}
          onOpen={handleOpen}
          onDelete={handleDelete}
          confirmingId={confirmingId}
          setConfirmingId={setConfirmingId}
          selected={selected}
          onToggleSelect={handleToggleSelect}
        />
        <Section
          title="Sizing Models"
          entries={sizing}
          onOpen={handleOpen}
          onDelete={handleDelete}
          confirmingId={confirmingId}
          setConfirmingId={setConfirmingId}
          selected={selected}
          onToggleSelect={handleToggleSelect}
        />
        <Section
          title="Client Presentations"
          entries={presentations}
          onOpen={handleOpen}
          onDelete={handleDelete}
          confirmingId={confirmingId}
          setConfirmingId={setConfirmingId}
          selected={selected}
          onToggleSelect={handleToggleSelect}
        />

        {filtered.length === 0 && search.trim() && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No scenarios match "{search}"
          </p>
        )}
      </div>

      {/* Comparison bar */}
      {selected.length === 2 && (
        <div className="sticky bottom-0 border-t border-border bg-white px-6 py-3 flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">2 scenarios selected</span>
          <div className="flex gap-2">
            <button onClick={() => setSelected([])} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/50">Clear</button>
            <button onClick={() => setShowComparison(true)} className="text-xs bg-[#002060] text-white px-3 py-1.5 rounded-lg hover:bg-[#002060]/90 font-medium">Compare</button>
          </div>
        </div>
      )}

      {/* Comparison modal */}
      {showComparison && selected.length === 2 && (() => {
        const [a, b] = entries.filter(e => selected.includes(e.id));
        if (!a || !b) return null;
        const rows = [
          { label: "Model", va: a.modelLabel, vb: b.modelLabel },
          { label: "Saved", va: formatDate(a.createdAt), vb: formatDate(b.createdAt) },
          { label: "Notes", va: a.notes || "—", vb: b.notes || "—" },
        ];
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-bold text-[#002060]">Scenario Comparison</h3>
                <button onClick={() => setShowComparison(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attribute</div>
                  <div className="font-semibold text-sm text-[#002060] truncate">{a.name}</div>
                  <div className="font-semibold text-sm text-[#002060] truncate">{b.name}</div>
                  {rows.map((r, i) => (
                    <React.Fragment key={i}>
                      <div className="text-xs text-muted-foreground py-1.5 border-t border-border/40">{r.label}</div>
                      <div className="text-sm py-1.5 border-t border-border/40">{r.va}</div>
                      <div className="text-sm py-1.5 border-t border-border/40">{r.vb}</div>
                    </React.Fragment>
                  ))}
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button onClick={() => { handleOpen(a); }} className="text-xs bg-[#005298]/10 text-[#005298] px-4 py-2 rounded-lg hover:bg-[#005298]/20 font-medium">Open {a.name}</button>
                  <button onClick={() => { handleOpen(b); }} className="text-xs bg-[#005298]/10 text-[#005298] px-4 py-2 rounded-lg hover:bg-[#005298]/20 font-medium">Open {b.name}</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
