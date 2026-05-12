import { Users, Zap, AlertTriangle, Activity } from "lucide-react";
import { KPICard } from "@/components/nabq/KPICard";
import { ClientConsumptionShareChart } from "@/components/nabq/ClientConsumptionShareChart";
import { ClientExceedanceChart } from "@/components/nabq/ClientExceedanceChart";
import { ClientDetailTable } from "@/components/nabq/ClientDetailTable";
import { NewCapacitiesChart } from "@/components/nabq/NewCapacitiesChart";
import { DashboardNav } from "@/components/nabq/DashboardNav";
import { clientsDetailKpi } from "@/data/nabq/clientsDetailData";

const ClientsDetailDashboard = () => {
  const top20Consumption = [48888554,38362874,29119680,20524061,19490842,19330302,17733784,15146711,15109513,13972535,13703969,12331309,12168873,12116946,10856164,10107377,9979920,9373685,8935403,8311163].reduce((a,b)=>a+b,0);
  const top20Pct = Math.round(top20Consumption / clientsDetailKpi.totalConsumption * 100);

  return (
    <div className="min-h-screen bg-background">
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
                  Client Details & Analytics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DashboardNav />
              <div className="hidden items-center gap-2 rounded-lg bg-secondary/50 px-3 py-1.5 sm:flex">
                <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
                <span className="text-xs font-medium text-muted-foreground">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* KPI Cards */}
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Total Clients"
              value={clientsDetailKpi.totalClients}
              icon={Users}
              variant="primary"
            />
            <KPICard
              title="Top 20 Consumption"
              value={`${top20Pct}%`}
              unit="of total"
              icon={Zap}
              variant="accent"
            />
            <KPICard
              title="Exceeding Capacity"
              value={clientsDetailKpi.clientsExceeding}
              unit="clients"
              icon={AlertTriangle}
              variant="warning"
            />
            <div className="glass-card border-success/30 hover:border-success/50 p-6 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="kpi-label">Total Contracted</p>
                  <div className="flex items-baseline gap-2">
                    <span className="kpi-value">{Math.round(clientsDetailKpi.totalContracted / 1000)}</span>
                    <span className="text-lg font-medium text-muted-foreground">MVA</span>
                  </div>
                  <div className="mt-1 rounded-md bg-chart-1/10 px-2.5 py-1.5">
                    <p className="text-xs font-medium text-chart-1">
                      + 37,859 kVA New Capacities
                    </p>
                  </div>
                </div>
                <div className="rounded-xl p-3 bg-success/10 text-success">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <ClientConsumptionShareChart />
          <NewCapacitiesChart />
        </section>

        {/* Exceedance Chart */}
        <section className="mb-8">
          <ClientExceedanceChart />
        </section>

        {/* Data Table */}
        <section>
          <ClientDetailTable />
        </section>
      </main>

      <footer className="border-t border-border/50 bg-card/30 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">NABQ Clients Analysis • Data: 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default ClientsDetailDashboard;
