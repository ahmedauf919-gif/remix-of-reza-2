import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Fx = { code: string; country: string; perUsd: number; usdPer: number };

const CACHE_KEY = "fx-rates-cache";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export function FxRatesView() {
  const [rates, setRates] = useState<Fx[]>([]);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async (force = false) => {
    setError(null);
    try {
      if (!force) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const p = JSON.parse(cached);
          if (Date.now() - p.ts < CACHE_TTL_MS) {
            setRates(p.rates); setAsOf(p.asOf); setFetchedAt(p.fetchedAt); return;
          }
        }
      }
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("fetch-fx");
      if (error) throw error;
      setRates(data.rates); setAsOf(data.asOf); setFetchedAt(data.fetchedAt);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), ...data }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rates.filter(r => !q || r.code.toLowerCase().includes(q) || r.country.toLowerCase().includes(q));
  }, [rates, search]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Exchange Rates (vs USD)</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Daily FX rates from open.er-api.com.
            {asOf && <> As of: {asOf}.</>}
            {fetchedAt && <> Last refresh: {new Date(fetchedAt).toLocaleString()}</>}
          </p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search currency or country…" value={search} onChange={e => setSearch(e.target.value)} className="w-64"/>
          <Button onClick={() => load(true)} disabled={loading} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}/> Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="text-sm text-destructive mb-3">Error: {error}</div>}
        {loading && rates.length === 0 && <div className="text-sm text-muted-foreground">Loading FX rates…</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Currency</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Per 1 USD</TableHead>
              <TableHead className="text-right">USD per 1 unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(r => (
              <TableRow key={r.code}>
                <TableCell className="font-medium">{r.code}</TableCell>
                <TableCell className="text-muted-foreground">{r.country}</TableCell>
                <TableCell className="text-right tabular-nums">{r.perUsd.toFixed(4)}</TableCell>
                <TableCell className="text-right tabular-nums">{r.usdPer.toFixed(6)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}