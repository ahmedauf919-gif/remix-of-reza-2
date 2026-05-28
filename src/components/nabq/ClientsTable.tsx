import { useState } from "react";
import { topClients, clientCapacities } from "@/data/nabq/clientsData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export function ClientsTable() {
  return (
    <div className="glass-card p-6">
      <Tabs defaultValue="consumption">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Contracts Data 2025</h3>
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="consumption">Top Consumers</TabsTrigger>
            <TabsTrigger value="capacity">Capacity</TabsTrigger>
          </TabsList>
        </div>




        <TabsContent value="consumption">
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">#</TableHead>
                  <TableHead className="text-muted-foreground">Client</TableHead>
                  <TableHead className="text-right text-muted-foreground">Consumption</TableHead>
                  <TableHead className="text-right text-muted-foreground">Avg Load</TableHead>
                  <TableHead className="text-right text-muted-foreground">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topClients.map((client) => (
                  <TableRow key={client.rank} className="border-border/30 transition-colors hover:bg-secondary/30">
                    <TableCell className="font-mono text-muted-foreground">{client.rank}</TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-right font-mono text-primary">{formatNumber(client.consumption)}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(client.avgLoad)}</TableCell>
                    <TableCell className="text-right font-mono text-chart-4">{client.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="capacity">
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Client</TableHead>
                  <TableHead className="text-right text-muted-foreground">Contracted (kVA)</TableHead>
                  <TableHead className="text-right text-muted-foreground">Avg Load (kW)</TableHead>
                   <TableHead className="text-right text-muted-foreground">Exceeded (kVA)</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {clientCapacities
                   .filter((c) => c.contractedCapacity > 0)
                   .sort((a, b) => b.contractedCapacity - a.contractedCapacity)
                   .map((client) => (
                     <TableRow key={client.name} className="border-border/30 transition-colors hover:bg-secondary/30">
                       <TableCell className="font-medium">{client.name}</TableCell>
                       <TableCell className="text-right font-mono text-chart-1">
                         {formatNumber(client.contractedCapacity)}
                       </TableCell>
                       <TableCell className="text-right font-mono text-chart-4">
                         {client.avgLoad != null ? formatNumber(client.avgLoad) : "—"}
                       </TableCell>
                       <TableCell className={cn("text-right font-mono", client.exceededCapacity && client.exceededCapacity > 0 ? "text-destructive" : "text-muted-foreground")}>
                         {client.exceededCapacity != null && client.exceededCapacity > 0 ? formatNumber(client.exceededCapacity) : "—"}
                       </TableCell>
                     </TableRow>
                   ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
