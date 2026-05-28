import { useState } from "react";
import { allClients, type ClientDetail } from "@/data/nabq/clientsDetailData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortKey = keyof Pick<ClientDetail, "consumption" | "share" | "contractedCapacity" | "maxLoad" | "exceedance" | "unutilized">;
type SortDir = "asc" | "desc" | null;

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const columns: { key: SortKey; label: string }[] = [
  { key: "consumption", label: "Consumption" },
  { key: "share", label: "% Share" },
  { key: "contractedCapacity", label: "Contracted Capacity" },
  { key: "maxLoad", label: "Max Load" },
  { key: "exceedance", label: "Exceedance" },
  { key: "unutilized", label: "Unutilized <50%" },
];

export function ClientDetailTable() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === "desc") setSortDir("asc");
      else if (sortDir === "asc") { setSortKey(null); setSortDir(null); }
      else setSortDir("desc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...allClients].sort((a, b) => {
    if (!sortKey || !sortDir) return a.rank - b.rank;
    const diff = a[sortKey] - b[sortKey];
    return sortDir === "asc" ? diff : -diff;
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground/50" />;
    if (sortDir === "desc") return <ArrowDown className="ml-1 inline h-3 w-3 text-primary" />;
    return <ArrowUp className="ml-1 inline h-3 w-3 text-primary" />;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Clients Data 2025</h3>
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">#</TableHead>
              <TableHead className="text-muted-foreground">Client</TableHead>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="cursor-pointer select-none text-right text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <SortIcon col={col.key} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((client, idx) => (
              <TableRow key={client.name} className="border-border/30 transition-colors hover:bg-secondary/30">
                <TableCell className="font-mono text-muted-foreground">{idx + 1}</TableCell>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell className="text-right font-mono text-primary">{formatNumber(client.consumption)}</TableCell>
                <TableCell className="text-right font-mono text-chart-4">{client.share}%</TableCell>
                <TableCell className="text-right font-mono text-chart-1">{formatNumber(client.contractedCapacity)}</TableCell>
                <TableCell className="text-right font-mono">{client.maxLoad > 0 ? formatNumber(client.maxLoad) : "—"}</TableCell>
                <TableCell className={cn("text-right font-mono", client.exceedance > 0 ? "text-destructive" : "text-muted-foreground")}>
                  {client.exceedance > 0 ? formatNumber(client.exceedance) : "—"}
                </TableCell>
                <TableCell className={cn("text-right font-mono", client.unutilized > 0 ? "text-warning" : "text-muted-foreground")}>
                  {client.unutilized > 0 ? `${client.unutilized}%` : "—"}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2 border-border bg-secondary/20 font-semibold">
              <TableCell></TableCell>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="text-right font-mono text-primary">{formatNumber(sorted.reduce((s, c) => s + c.consumption, 0))}</TableCell>
              <TableCell className="text-right font-mono text-chart-4">100%</TableCell>
              <TableCell className="text-right font-mono text-chart-1">{formatNumber(sorted.reduce((s, c) => s + c.contractedCapacity, 0))}</TableCell>
              <TableCell className="text-right font-mono">{formatNumber(sorted.reduce((s, c) => s + c.maxLoad, 0))}</TableCell>
              <TableCell className="text-right font-mono text-destructive">{formatNumber(sorted.reduce((s, c) => s + c.exceedance, 0))}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
