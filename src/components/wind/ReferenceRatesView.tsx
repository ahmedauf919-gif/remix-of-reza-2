import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Rate = {
  id: string;
  label: string;
  category: string;
  country?: string;
  value: number | null;
  date: string | null;
  source?: string;
};

const CACHE_KEY = "reference-rates-cache";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export function ReferenceRatesView() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [fillingMissing, setFillingMissing] = useState(false);

  const load = async (force = false) => {
    setError(null);
    try {
      if (!force) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.ts < CACHE_TTL_MS) {
            setRates(parsed.rates);
            setFetchedAt(parsed.fetchedAt);
            return;
          }
        }
      }
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("fetch-rates");
      if (error) throw error;
      setRates(data.rates);
      setFetchedAt(data.fetchedAt);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), rates: data.rates, fetchedAt: data.fetchedAt }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const fillMissing = async () => {
    setError(null);
    const missing = rates.filter(r => r.value == null).map(r => ({ id: r.id, label: r.label, country: r.country }));
    if (missing.length === 0) return;
    setFillingMissing(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-missing-rates", { body: { items: missing } });
      if (error) throw error;
      const map = new Map<string, { value: number; date: string; source?: string }>();
      for (const r of (data.rates ?? [])) map.set(r.id, r);
      const merged = rates.map(r => {
        if (r.value != null) return r;
        const m = map.get(r.id);
        return m ? { ...r, value: m.value, date: m.date, source: m.source } : r;
      });
      setRates(merged);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), rates: merged, fetchedAt }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setFillingMissing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rates.filter(r =>
      !q || r.label.toLowerCase().includes(q) || (r.country ?? "").toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    );
  }, [rates, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, Rate[]>();
    for (const r of filtered) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Reference Rates</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Live SOFR, LIBOR (legacy), Treasuries, and global central-bank policy rates from FRED.
              {fetchedAt && <> Last update: {new Date(fetchedAt).toLocaleString()}</>}
            </p>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Search rate or country…" value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
            <Button onClick={fillMissing} disabled={fillingMissing || rates.every(r => r.value != null)} variant="secondary" className="gap-2">
              <RefreshCw className={`h-4 w-4 ${fillingMissing ? "animate-spin" : ""}`} /> Fill missing from public sources
            </Button>
            <Button onClick={() => load(true)} disabled={loading} variant="outline" className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="text-sm text-destructive mb-3">Error: {error}</div>}
          {loading && rates.length === 0 && <div className="text-sm text-muted-foreground">Loading rates…</div>}
          <div className="space-y-6">
            {grouped.map(([cat, items]) => (
              <div key={cat}>
                <h3 className="text-sm font-semibold mb-2">{cat}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rate</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Value (%)</TableHead>
                      <TableHead className="text-right">As of</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map(r => (
                      <TableRow key={r.id + r.label}>
                        <TableCell className="font-medium">{r.label}</TableCell>
                        <TableCell className="text-muted-foreground">{r.country ?? "—"}</TableCell>
                        <TableCell className="text-right tabular-nums">{r.value != null ? r.value.toFixed(3) : "—"}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {r.date ?? "—"}
                          {r.source && <div className="text-[10px] opacity-70 truncate max-w-[200px]">{r.source}</div>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}