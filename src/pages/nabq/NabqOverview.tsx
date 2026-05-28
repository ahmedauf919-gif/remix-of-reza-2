import { BarChart3, Sun, Gauge, Zap, Settings, Plane, DollarSign, BatteryCharging } from "lucide-react";
import { KPICard } from "@/components/nabq/KPICard";
import { ConsumptionGrowthChart } from "@/components/nabq/ConsumptionGrowthChart";
import { TourismChart } from "@/components/nabq/TourismChart";
import { PowerFactorChart } from "@/components/nabq/PowerFactorChart";
import { PeakDemandOverviewChart } from "@/components/nabq/PeakDemandOverviewChart";
import { MonthlyEnergyChart } from "@/components/nabq/MonthlyEnergyChart";
import { DashboardNav } from "@/components/nabq/DashboardNav";
import { overviewKpis } from "@/data/nabq/overviewData";
import { transformerSpecs } from "@/data/nabq/dieselData";

const OverviewDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/10">
                <BarChart3 className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NABQ Overview</h1>
                <p className="text-xs text-muted-foreground">
                  Historical Trends, Solar, Grid & Tourism Analytics
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
        {/* KPI Cards Row 1 */}
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Transformers"
              value={transformerSpecs.count}
              unit="units"
              icon={Zap}
              variant="primary"
            />
            <KPICard
              title="Capacity / Transformer"
              value={transformerSpecs.capacity}
              unit="MVA"
              icon={Settings}
              variant="warning"
            />
            <KPICard
              title="Solar Park Capacity"
              value={overviewKpis.solarCapacity}
              unit="MWp"
              icon={Sun}
              variant="accent"
            />
            <KPICard
              title="Solar Park Yield"
              value={overviewKpis.solarYield}
              unit="MWh/MWp"
              icon={BatteryCharging}
              variant="success"
            />
          </div>
        </section>

        {/* KPI Cards Row 2 */}
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <KPICard
              title="Avg Power Factor"
              value={`${overviewKpis.avgPowerFactor}%`}
              icon={Gauge}
              variant="primary"
            />
            <KPICard
              title="Egypt Tourism Arrivals 2025"
              value={overviewKpis.arrivals2025}
              unit="M"
              icon={Plane}
              variant="accent"
            />
            <KPICard
              title="Tourism Sector Egypt Revenues 2025"
              value={`$${overviewKpis.revenue2025}`}
              unit="B"
              icon={DollarSign}
              variant="success"
            />
          </div>
        </section>

        {/* Charts Row 1 - Historical */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <ConsumptionGrowthChart />
          <TourismChart />
        </section>

        {/* Charts Row 2 - Power Factor & Monthly Energy */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <MonthlyEnergyChart />
          <PowerFactorChart />
        </section>

        {/* Charts Row 3 - Peak Demand (last) */}
        <section className="mb-8 grid gap-6 lg:grid-cols-1">
          <PeakDemandOverviewChart />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            NABQ Overview • Data: 2013–2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OverviewDashboard;
