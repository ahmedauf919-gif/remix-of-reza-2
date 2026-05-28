import { useMemo } from "react";
import { Fuel, Zap, TrendingUp, Gauge, DollarSign } from "lucide-react";
import { KPICard } from "@/components/nabq/KPICard";
import { DemandChart } from "@/components/nabq/DemandChart";
import { DieselCostChart } from "@/components/nabq/DieselCostChart";

import { MonthlyStatsTable } from "@/components/nabq/MonthlyStatsTable";
import { TransformerSpecs } from "@/components/nabq/TransformerSpecs";
import { DashboardNav } from "@/components/nabq/DashboardNav";
import { DieselFilters } from "@/components/nabq/DieselFilters";
import { transformerCapacityData, kpiData } from "@/data/nabq/dieselData";
import { useDashboard } from "@/contexts/NabqDashboardContext";

const Index = () => {
  const {
    selectedYear, setSelectedYear,
    growthRate, setGrowthRate,
    dieselPrice, setDieselPrice,
    dieselEfficiency, setDieselEfficiency,
  } = useDashboard();

  // Calculate dynamic KPIs based on filters
  const dynamicKPIs = useMemo(() => {
    let baseDiesel = 0;
    
    if (selectedYear === "all") {
      baseDiesel = transformerCapacityData.reduce((sum, year) => sum + year.diesel, 0);
    } else {
      const yearData = transformerCapacityData.find(d => d.year === selectedYear);
      baseDiesel = yearData?.diesel || 0;
    }

    const growthMultiplier = 1 + ((growthRate - 5) / 100);
    const adjustedDiesel = baseDiesel * growthMultiplier;

    const efficiencyMultiplier = 25 / dieselEfficiency;
    const finalDiesel = adjustedDiesel * efficiencyMultiplier;

    const egpSpent = (finalDiesel * dieselPrice) / 1000000;
    const dieselMW = Math.round(finalDiesel / 41000);

    return {
      dieselNeeded: dieselMW,
      egpSpent: Math.round(egpSpent * 10) / 10,
      loadIncrease: growthRate,
      efficiency: dieselEfficiency,
    };
  }, [selectedYear, growthRate, dieselPrice, dieselEfficiency]);

  const filteredYearlyDieselSummary = useMemo(() => {
    return transformerCapacityData.map(yearData => {
      const growthMultiplier = 1 + ((growthRate - 5) / 100);
      const efficiencyMultiplier = 25 / dieselEfficiency;
      const adjustedDiesel = yearData.diesel * growthMultiplier * efficiencyMultiplier;
      const egpCost = adjustedDiesel * dieselPrice;
      
      return {
        year: yearData.year,
        diesel: Math.round(adjustedDiesel),
        egpCost: egpCost,
      };
    });
  }, [growthRate, dieselPrice, dieselEfficiency]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Fuel className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NABQ Diesel Analytics</h1>
                <p className="text-xs text-muted-foreground">
                  Power Consumption & Diesel Forecast Dashboard
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
        {/* Filters */}
        <DieselFilters
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          growthRate={growthRate}
          onGrowthRateChange={setGrowthRate}
          dieselPrice={dieselPrice}
          onDieselPriceChange={setDieselPrice}
          efficiency={dieselEfficiency}
          onEfficiencyChange={setDieselEfficiency}
        />

        {/* KPI Cards */}
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Diesel Needed"
              value={dynamicKPIs.dieselNeeded}
              unit="MW"
              icon={Fuel}
              variant="primary"
            />
            <KPICard
              title="EGP Spent"
              value={dynamicKPIs.egpSpent}
              unit="M"
              icon={DollarSign}
              variant="accent"
            />
            <KPICard
              title="Load Increase"
              value={`${dynamicKPIs.loadIncrease}%`}
              icon={TrendingUp}
              trend={{ value: growthRate > 5 ? growthRate - 5 : 5 - growthRate, isPositive: growthRate <= 5 }}
              variant="warning"
            />
            <KPICard
              title="Efficiency"
              value={`${dynamicKPIs.efficiency}%`}
              icon={Gauge}
              variant="success"
            />
          </div>
        </section>

        {/* Charts Row */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <DemandChart 
            selectedYear={selectedYear} 
            growthRate={growthRate} 
          />
          <DieselCostChart 
            yearlyData={filteredYearlyDieselSummary}
            dieselPrice={dieselPrice}
            selectedYear={selectedYear}
          />
        </section>

        {/* Bottom Row */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
          <MonthlyStatsTable 
            selectedYear={selectedYear}
            growthRate={growthRate}
            efficiency={dieselEfficiency}
            dieselPrice={dieselPrice}
          />
          </div>
          <div className="space-y-6">
            <TransformerSpecs />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            NABQ Diesel Power Analysis • Data updated: Oct 2026 - Oct 2028
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
