import { Users, Zap, AlertTriangle, Activity } from "lucide-react";
import { KPICard } from "@/components/nabq/KPICard";
import { CapacityGrowthChart } from "@/components/nabq/CapacityGrowthChart";
import { CapacityExceedanceChart } from "@/components/nabq/CapacityExceedanceChart";
import { ConsumptionShareChart } from "@/components/nabq/ConsumptionShareChart";
import { ClientsTable } from "@/components/nabq/ClientsTable";
import { DashboardNav } from "@/components/nabq/DashboardNav";
import { clientsKpiData } from "@/data/nabq/clientsData";

const ClientsDashboard = () => {
  const totalConsumptionGWh = Math.round(clientsKpiData.totalConsumption2025 / 1000000 * 10) / 10;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-4/10">
                <Users className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NABQ Clients</h1>
                <p className="text-xs text-muted-foreground">
                  Client Consumption & Capacity Analytics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DashboardNav />
              <div className="hidden items-center gap-2 rounded-lg bg-secondary/50 px-3 py-1.5 sm:flex">
                <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
                <span className="text-xs font-medium text-muted-foreground">
                  Live Data
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* KPI Cards */}
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Total Contracts"
              value={clientsKpiData.totalClients}
              icon={Users}
              variant="primary"
            />
            <KPICard
              title="Top 20 Contracts Consumption"
              value={`${totalConsumptionGWh} / 420`}
              unit="GWh"
              icon={Zap}
              variant="accent"
            />
            <KPICard
              title="Exceeding Capacity"
              value={clientsKpiData.clientsExceedingCapacity}
              unit="contracts"
              icon={AlertTriangle}
              variant="warning"
            />
            <KPICard
              title="Total Contracted"
              value={`${Math.round(clientsKpiData.totalContractedCapacity / 1000)}`}
              unit="MVA"
              icon={Activity}
              variant="success"
            />
          </div>
        </section>

        {/* Charts Row 1 */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <CapacityGrowthChart />
          <ConsumptionShareChart />
        </section>

        {/* Charts Row 2 */}
        <section className="mb-8">
          <CapacityExceedanceChart />
        </section>

        {/* Data Table */}
        <section>
          <ClientsTable />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            NABQ Clients Analysis • Data: 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientsDashboard;
