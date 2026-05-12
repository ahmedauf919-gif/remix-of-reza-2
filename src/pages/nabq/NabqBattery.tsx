import { Battery, Zap, Sun, Activity, Gauge } from "lucide-react";
import { KPICard } from "@/components/nabq/KPICard";
import { MonthlyPeakExceedanceChart } from "@/components/nabq/MonthlyPeakExceedanceChart";
import { SolarPercentageChart } from "@/components/nabq/SolarPercentageChart";

import { HourlyLoadChart } from "@/components/nabq/HourlyLoadChart";
import { TransformerExceedanceChart } from "@/components/nabq/TransformerExceedanceChart";
import { PeakDemandHeatmap } from "@/components/nabq/PeakDemandHeatmap";
import { EnergyStatsTable } from "@/components/nabq/EnergyStatsTable";
import { BatterySpecs } from "@/components/nabq/BatterySpecs";
import { InflationProjections } from "@/components/nabq/InflationProjections";
import { DashboardNav } from "@/components/nabq/DashboardNav";
import { DateFilters } from "@/components/nabq/DateFilters";
import { BatteryCapacityFilter } from "@/components/nabq/BatteryCapacityFilter";
import {
  SystemParametersFilter,
  computeMaxTransformerMw,
} from "@/components/nabq/SystemParametersFilter";
import {
  getYearData,
  yearlyEnergyData,
  getSolarHourlyMW,
} from "@/data/nabq/batteryData";
import {
  getPeakDataForMonth,
  calculateMonthStats,
  yearlyPeakData,
} from "@/data/nabq/peakDemandData";
import { useDashboard } from "@/contexts/NabqDashboardContext";

const availableYears = Array.from({ length: 2050 - 2025 + 1 }, (_, i) => String(2025 + i));

const BatteryDashboard = () => {
  const {
    selectedYear, setSelectedYear,
    selectedMonth, setSelectedMonth,
    systemParams, setSystemParams,
    batteryCapacity, setBatteryCapacity,
  } = useDashboard();

  // Computed Max Supply MW = efficiency% × powerFactor × transformerCapacity
  const maxTransformerMw = computeMaxTransformerMw(systemParams);

  // Get KPI data based on selection
  const solarScale = systemParams.solarSize / 16; // relative to 16 MWp baseline

  const getKpiData = () => {
    if (selectedYear === "all") {
      const totalGrid = yearlyEnergyData.reduce((acc, y) => acc + y.totals.grid, 0);
      const totalSolar = Math.round(yearlyEnergyData.reduce((acc, y) => acc + y.totals.solar, 0) * solarScale);
      const total = totalGrid + totalSolar;
      return {
        total,
        solarPercentage: Math.round((totalSolar / total) * 100),
      };
    } else {
      const yearData = getYearData(selectedYear);
      if (selectedMonth !== "all") {
        const monthData = yearData.months[parseInt(selectedMonth) - 1];
        const scaledSolar = Math.round(monthData.solar * solarScale);
        const total = monthData.grid + scaledSolar;
        return {
          total,
          solarPercentage: Math.round((scaledSolar / total) * 100),
        };
      }
      const scaledSolar = Math.round(yearData.totals.solar * solarScale);
      const total = yearData.totals.grid + scaledSolar;
      return {
        total,
        solarPercentage: Math.round((scaledSolar / total) * 100),
      };
    }
  };

  const kpiData = getKpiData();

  const solarHourlyMW = getSolarHourlyMW(systemParams.solarSize);

  const getPeakDemand = () => {
    const year = selectedYear === "all" ? "2025" : selectedYear;
    const applyBatteryAndSolar = (demand: number, hourIndex: number) => {
      const afterSolar = Math.max(0, demand - solarHourlyMW[hourIndex]);
      const isPeakHour = hourIndex >= 16 && hourIndex <= 22;
      const batteryDischarge = isPeakHour ? Math.min(batteryCapacity, afterSolar) : 0;
      return afterSolar - batteryDischarge;
    };

    if (selectedMonth === "all") {
      const yearData = yearlyPeakData[year];
      let maxDemand = 0;

      yearData.months.forEach((monthData) => {
        monthData.days.forEach((day) => {
          day.hours.forEach((demand, hourIndex) => {
            const effectiveDemand = applyBatteryAndSolar(demand, hourIndex);
            maxDemand = Math.max(maxDemand, effectiveDemand);
          });
        });
      });

      return maxDemand;
    }

    const monthData = getPeakDataForMonth(year, parseInt(selectedMonth));
    const adjustedData = monthData.map((day) => ({
      ...day,
      hours: day.hours.map((demand, hourIndex) => applyBatteryAndSolar(demand, hourIndex)),
    }));

    const stats = calculateMonthStats(adjustedData, maxTransformerMw);
    return stats.maxDemand;
  };

  const peakDemand = getPeakDemand();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10">
                <Battery className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NABQ Battery & Solar Analytics</h1>
                <p className="text-xs text-muted-foreground">
                  Energy Mix & Capacity Utilization Dashboard
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
        {/* System Parameters */}
        <section className="mb-8">
          <SystemParametersFilter
            params={systemParams}
            onChange={setSystemParams}
          />
        </section>

        {/* Transformer Exceedance Across Years */}
        <section className="mb-8">
          <TransformerExceedanceChart
            batteryCapacity={batteryCapacity}
            transformerLimit={maxTransformerMw}
            solarSize={systemParams.solarSize}
          />
        </section>

        {/* Battery Capacity */}
        <section className="mb-8">
          <BatteryCapacityFilter
            value={batteryCapacity}
            onChange={setBatteryCapacity}
            min={0}
            max={500}
            step={10}
          />
        </section>

        {/* Filters */}
        <section className="mb-6">
          <DateFilters
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableYears={availableYears}
          />
        </section>

        {/* KPI Cards */}
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KPICard
              title="Total Energy"
              value={
                kpiData.total >= 1000000
                  ? `${(kpiData.total / 1000000).toFixed(1)}`
                  : `${(kpiData.total / 1000).toFixed(0)}`
              }
              unit={kpiData.total >= 1000000 ? "GWh" : "MWh"}
              icon={Zap}
              variant="primary"
            />
            <KPICard
              title="Solar Contribution"
              value={`${kpiData.solarPercentage}%`}
              icon={Sun}
              variant="success"
            />
            <KPICard
              title="Peak Demand"
              value={peakDemand}
              unit="MW"
              icon={Activity}
              trend={{
                value: Math.round((peakDemand / maxTransformerMw - 1) * 100),
                isPositive: peakDemand <= maxTransformerMw,
              }}
              variant={
                peakDemand > maxTransformerMw ? "warning" : "success"
              }
            />
            <KPICard
              title="Battery Capacity"
              value={batteryCapacity}
              unit="MW"
              icon={Battery}
              variant="accent"
            />
            <KPICard
              title="Max Supply MW"
              value={maxTransformerMw}
              unit="MW"
              icon={Gauge}
              variant="primary"
            />
          </div>
        </section>

        {/* Charts Row - Filtered by year */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <MonthlyPeakExceedanceChart
            selectedYear={selectedYear}
            batteryCapacity={batteryCapacity}
            transformerLimit={maxTransformerMw}
            solarSize={systemParams.solarSize}
          />
          <SolarPercentageChart selectedYear={selectedYear} solarSize={systemParams.solarSize} />
        </section>

        {/* Charts Row 2 - Battery affected */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <HourlyLoadChart
            batteryCapacity={batteryCapacity}
            transformerLimit={maxTransformerMw}
            solarSize={systemParams.solarSize}
          />
          <div className="space-y-6">
            <BatterySpecs
              batteryCapacity={batteryCapacity}
              efficiency={systemParams.efficiency}
              solarSize={systemParams.solarSize}
            />
            <InflationProjections inflationRate={systemParams.inflationRate} />
          </div>
        </section>

        {/* Data Table */}
        <section className="mb-8">
          <EnergyStatsTable selectedYear={selectedYear} selectedMonth={selectedMonth} />
        </section>

        {/* Heatmap */}
        <section className="mb-8">
          <PeakDemandHeatmap
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            batteryCapacity={batteryCapacity}
            transformerLimit={maxTransformerMw}
            solarSize={systemParams.solarSize}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            NABQ Battery & Solar Analysis • Data: 2025-2050 Forecast
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BatteryDashboard;
