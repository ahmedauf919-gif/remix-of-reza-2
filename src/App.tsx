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
import NotFound from "./pages/NotFound.tsx";
import { PasswordGate } from "./components/PasswordGate";

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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </PasswordGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
