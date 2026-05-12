import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Fuel, Battery, Users, BarChart3, Download, Loader2, Home } from "lucide-react";
import { exportAllDashboardsToPPT } from "@/utils/nabqExportToPPT";
import { toast } from "sonner";

export function DashboardNav() {
  const location = useLocation();
  const [exporting, setExporting] = useState(false);

  const BASE = "/sizing/nabq";
  const navItems = [
    { path: `${BASE}`,               label: "Diesel",    icon: Fuel },
    { path: `${BASE}/overview`,      label: "Overview",  icon: BarChart3 },
    { path: `${BASE}/clients-detail`,label: "Clients",   icon: Users },
    { path: `${BASE}/battery`,       label: "Analysis",  icon: Battery },
    { path: `${BASE}/clients`,       label: "Contracts", icon: Users },
  ];

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportAllDashboardsToPPT();
      toast.success("PowerPoint report exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export report");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/"
        title="Back to Home"
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      <nav className="flex items-center gap-1 rounded-lg bg-secondary/50 p-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleExport}
        disabled={exporting}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
          "bg-primary/10 text-primary hover:bg-primary/20",
          exporting && "opacity-50 cursor-not-allowed"
        )}
        title="Export all dashboards to PowerPoint"
      >
        {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        <span className="hidden sm:inline">{exporting ? "Exporting..." : "PPT"}</span>
      </button>
    </div>
  );
}
