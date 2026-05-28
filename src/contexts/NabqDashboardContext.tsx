import { createContext, useContext, useState, type ReactNode } from "react";
import type { SystemParameters } from "@/components/nabq/SystemParametersFilter";

interface DashboardState {
  // Date filters
  selectedYear: string;
  setSelectedYear: (v: string) => void;
  selectedMonth: string;
  setSelectedMonth: (v: string) => void;

  // System parameters (Analysis)
  systemParams: SystemParameters;
  setSystemParams: (v: SystemParameters) => void;

  // Battery capacity (Analysis)
  batteryCapacity: number;
  setBatteryCapacity: (v: number) => void;

  // Diesel filters
  growthRate: number;
  setGrowthRate: (v: number) => void;
  dieselPrice: number;
  setDieselPrice: (v: number) => void;
  dieselEfficiency: number;
  setDieselEfficiency: (v: number) => void;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [systemParams, setSystemParams] = useState<SystemParameters>({
    efficiency: 85,
    powerFactor: 0.9,
    solarSize: 16,
    transformerCapacity: 120,
    inflationRate: 10,
  });
  const [batteryCapacity, setBatteryCapacity] = useState(16);
  const [growthRate, setGrowthRate] = useState(5);
  const [dieselPrice, setDieselPrice] = useState(20);
  const [dieselEfficiency, setDieselEfficiency] = useState(25);

  return (
    <DashboardContext.Provider
      value={{
        selectedYear, setSelectedYear,
        selectedMonth, setSelectedMonth,
        systemParams, setSystemParams,
        batteryCapacity, setBatteryCapacity,
        growthRate, setGrowthRate,
        dieselPrice, setDieselPrice,
        dieselEfficiency, setDieselEfficiency,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

export { DashboardProvider as NabqDashboardProvider };
