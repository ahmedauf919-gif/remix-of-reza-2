import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Home from "./pages/Home.tsx";
import Water from "./pages/Water.tsx";
import Pv from "./pages/Pv.tsx";
import Cng from "./pages/Cng.tsx";
import Lng from "./pages/Lng.tsx";
import NotFound from "./pages/NotFound.tsx";
import { PasswordGate } from "./components/PasswordGate";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NabqDashboardProvider } from "./contexts/NabqDashboardContext";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models/reza" element={<Index scenarioId={1} />} />
            <Route path="/models/reza-2" element={<Index scenarioId={2} />} />
            <Route path="/models/water" element={<Water />} />
            <Route path="/models/pv" element={<Pv />} />
            <Route path="/models/cng" element={<Cng />} />
            <Route path="/models/lngtz" element={<Lng />} />
            {/* NABQ Routes — lazy loaded with error boundary */}
            <Route path="/sizing/nabq" element={<ErrorBoundary label="NABQ Diesel"><NabqDashboardProvider><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}><NabqDiesel /></Suspense></NabqDashboardProvider></ErrorBoundary>} />
            <Route path="/sizing/nabq/battery" element={<ErrorBoundary label="NABQ Battery"><NabqDashboardProvider><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}><NabqBattery /></Suspense></NabqDashboardProvider></ErrorBoundary>} />
            <Route path="/sizing/nabq/clients" element={<ErrorBoundary label="NABQ Clients"><NabqDashboardProvider><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}><NabqClients /></Suspense></NabqDashboardProvider></ErrorBoundary>} />
            <Route path="/sizing/nabq/clients-detail" element={<ErrorBoundary label="NABQ Clients Detail"><NabqDashboardProvider><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}><NabqClientsDetail /></Suspense></NabqDashboardProvider></ErrorBoundary>} />
            <Route path="/sizing/nabq/overview" element={<ErrorBoundary label="NABQ Overview"><NabqDashboardProvider><Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>}><NabqOverview /></Suspense></NabqDashboardProvider></ErrorBoundary>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PasswordGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
