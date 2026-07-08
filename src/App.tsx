import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Home from "./pages/Home.tsx";
import Water from "./pages/Water.tsx";
import Pv from "./pages/Pv.tsx";
import Cng from "./pages/Cng.tsx";
import Lng from "./pages/Lng.tsx";
import RabKsa from "./pages/RabKsa.tsx";
import TaqaAnalytics from "./pages/TaqaAnalytics.tsx";
import ResidentialCustomers from "./pages/presentations/ResidentialCustomers.tsx";
import FleetMobilityClients from "./pages/presentations/FleetMobilityClients.tsx";
import AgricultureClients from "./pages/presentations/AgricultureClients.tsx";
import IndustrialClients from "./pages/presentations/IndustrialClients.tsx";
import ResidentialClientsNew from "./pages/presentations/ResidentialClientsNew.tsx";
import NotFound from "./pages/NotFound.tsx";
import { PasswordGate } from "./components/PasswordGate";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NabqDashboardProvider } from "./contexts/NabqDashboardContext";

const GasLoadProfiling = lazy(() => import("./pages/sizing/GasLoadProfiling.tsx"));
const GasNetwork       = lazy(() => import("./pages/sizing/GasNetwork.tsx"));
const PvYield          = lazy(() => import("./pages/sizing/PvYield.tsx"));
const BessSizing       = lazy(() => import("./pages/sizing/BessSizing.tsx"));
const GridLoadFlow     = lazy(() => import("./pages/sizing/GridLoadFlow.tsx"));
const ChpSizing        = lazy(() => import("./pages/sizing/ChpSizing.tsx"));
const EvChargerMix     = lazy(() => import("./pages/sizing/EvChargerMix.tsx"));

const NabqDiesel       = lazy(() => import("./pages/nabq/NabqDiesel.tsx"));
const NabqBattery      = lazy(() => import("./pages/nabq/NabqBattery.tsx"));
const NabqClients      = lazy(() => import("./pages/nabq/NabqClients.tsx"));
const NabqClientsDetail = lazy(() => import("./pages/nabq/NabqClientsDetail.tsx"));
const NabqOverview     = lazy(() => import("./pages/nabq/NabqOverview.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PasswordGate>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models/reza" element={<Index scenarioId={1} />} />
            <Route path="/models/reza-2" element={<Index scenarioId={2} />} />
            <Route path="/models/water" element={<Water />} />
            <Route path="/models/pv" element={<Pv />} />
            <Route path="/models/cng" element={<Cng />} />
            <Route path="/models/lngtz" element={<Lng />} />
            <Route path="/models/rab-ksa" element={<RabKsa />} />
            <Route path="/analytics/taqa" element={<TaqaAnalytics />} />
            <Route path="/presentations/residential-customers" element={<ResidentialCustomers />} />
            <Route path="/presentations/fleet-mobility-clients" element={<FleetMobilityClients />} />
            <Route path="/presentations/agriculture-clients" element={<AgricultureClients />} />
            <Route path="/presentations/industrial-clients" element={<IndustrialClients />} />
            <Route path="/presentations/residential-clients" element={<ResidentialClientsNew />} />
            {/* Sizing tools — lazy loaded with error boundary */}
            {[
              { path: "/sizing/gas-load", label: "Gas Load Profiling", El: GasLoadProfiling },
              { path: "/sizing/gas-network", label: "Gas Network Hydraulics", El: GasNetwork },
              { path: "/sizing/pv-yield", label: "PV Yield Simulator", El: PvYield },
              { path: "/sizing/bess", label: "BESS Sizing", El: BessSizing },
              { path: "/sizing/grid-load-flow", label: "Grid Load Flow", El: GridLoadFlow },
              { path: "/sizing/chp", label: "CHP Sizing", El: ChpSizing },
              { path: "/sizing/ev-chargers", label: "EV Charger Mix", El: EvChargerMix },
            ].map(({ path, label, El }) => (
              <Route key={path} path={path} element={
                <ErrorBoundary label={label}>
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}>
                    <El />
                  </Suspense>
                </ErrorBoundary>
              } />
            ))}
            {/* NABQ Routes — lazy loaded with error boundary */}
            <Route path="/sizing/nabq" element={<ErrorBoundary label="NABQ Diesel"><NabqDashboardProvider><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}><NabqDiesel /></Suspense></NabqDashboardProvider></ErrorBoundary>} />
            <Route path="/sizing/nabq/battery" element={<ErrorBoundary label="NABQ Battery"><NabqDashboardProvider><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}><NabqBattery /></Suspense></NabqDashboardProvider></ErrorBoundary>} />
            <Route path="/sizing/nabq/clients" element={<ErrorBoundary label="NABQ Clients"><NabqDashboardProvider><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}><NabqClients /></Suspense></NabqDashboardProvider></ErrorBoundary>} />
            <Route path="/sizing/nabq/clients-detail" element={<ErrorBoundary label="NABQ Clients Detail"><NabqDashboardProvider><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}><NabqClientsDetail /></Suspense></NabqDashboardProvider></ErrorBoundary>} />
            <Route path="/sizing/nabq/overview" element={<ErrorBoundary label="NABQ Overview"><NabqDashboardProvider><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}><NabqOverview /></Suspense></NabqDashboardProvider></ErrorBoundary>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </PasswordGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
