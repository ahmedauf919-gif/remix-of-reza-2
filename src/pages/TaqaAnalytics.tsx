import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { taqaGasData } from "@/data/taqa/taqaGas";
import { masterGasData, mobileCNGData, cngStationsData } from "@/data/taqa/masterGas";
import { petroleumData } from "@/data/taqa/petroleum";
import { electricityData } from "@/data/taqa/electricity";
import { waterData } from "@/data/taqa/water";
import { countBy, ClientRecord, GOVERNORATE_COORDS, CHART_COLORS } from "@/data/taqa/types";
import { StatCard, SectorBarChart, EgyptMap, DualEgyptMap, ConsolidatedEgyptMap, RecordsTable } from "@/components/taqa/SharedComponents";
import { ServiceEgyptMap } from "@/components/taqa/ServiceEgyptMap";
import { TaqaGasSummary, MasterGasSummary, PetroleumSummary, ElectricitySummary, WaterSummary } from "@/components/taqa/BusinessSummary";
import { ClientsOverviewTab } from "@/components/taqa/ClientsOverview";
import { Fuel, Zap, Droplets, MapPin, Building2, Factory, Flame, Users } from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";

const tabs = [
  { id: "consolidated", label: "TAQA Arabia", icon: <MapPin className="w-4 h-4" /> },
  { id: "taqa", label: "Gas", icon: <Flame className="w-4 h-4" /> },
  { id: "master", label: "Master Gas", icon: <Fuel className="w-4 h-4" /> },
  { id: "petroleum", label: "Petroleum", icon: <Fuel className="w-4 h-4" /> },
  { id: "electricity", label: "Electricity", icon: <Zap className="w-4 h-4" /> },
  { id: "water", label: "Water", icon: <Droplets className="w-4 h-4" /> },
  { id: "clients", label: "Who We Serve", icon: <Users className="w-4 h-4" /> },
];

function TaqaGasTab() {
  const sectorData = useMemo(() => countBy(taqaGasData, "activity"), []);
  const govData = useMemo(() => countBy(taqaGasData, "governorate"), []);
  return (
    <div className="space-y-6 animate-fade-in">
      <TaqaGasSummary />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Clients" value={taqaGasData.length} icon={<Building2 className="w-4 h-4" />} />
        <StatCard label="Governorates" value={govData.length} icon={<MapPin className="w-4 h-4" />} />
        <StatCard label="Client Sectors" value={sectorData.length} icon={<Factory className="w-4 h-4" />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorBarChart data={sectorData} title="Client Sectors" />
        <EgyptMap data={govData} title="Geographic Distribution" />
      </div>
      <RecordsTable records={taqaGasData} columns={["name", "governorate", "activity"]} />
    </div>
  );
}

function MasterGasTab() {
  const cngGovData = useMemo(() => countBy(cngStationsData, "governorate"), []);
  const mcngGovData = useMemo(() => countBy(mobileCNGData, "governorate"), []);
  return (
    <div className="space-y-6 animate-fade-in">
      <MasterGasSummary />
      <StatCard label="MCNG Clients" value={mobileCNGData.length} icon={<Fuel className="w-4 h-4" />} />
      <StatCard label="Number of CNG Stations" value={cngStationsData.length} icon={<Building2 className="w-4 h-4" />} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorBarChart data={cngGovData} title="Station Distribution" />
        <DualEgyptMap stationsData={cngGovData} mcngData={mcngGovData} title="Geographic Distribution" />
      </div>
      <RecordsTable records={masterGasData} columns={["name", "service", "governorate", "activity"]} />
    </div>
  );
}

function PetroleumTab() {
  const govData = useMemo(() => countBy(petroleumData, "governorate"), []);
  return (
    <div className="space-y-6 animate-fade-in">
      <PetroleumSummary />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Number of Stations" value={petroleumData.length} icon={<Fuel className="w-4 h-4" />} />
        <StatCard label="Governorates Covered" value={govData.length} icon={<MapPin className="w-4 h-4" />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorBarChart data={govData} title="Station Distribution" />
        <EgyptMap data={govData} title="Stations Across Egypt" />
      </div>
      <RecordsTable records={petroleumData} columns={["name", "governorate", "activity"]} />
    </div>
  );
}

function ElectricityTab() {
  const govData = useMemo(() => countBy(electricityData, "governorate"), []);
  const sectorData = useMemo(() => countBy(electricityData, "activity"), []);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <ElectricitySummary />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Clients" value={electricityData.length} icon={<Zap className="w-4 h-4" />} />
        <StatCard label="Governorates" value={govData.length} icon={<MapPin className="w-4 h-4" />} />
        <StatCard label="Client Sectors" value={sectorData.length} icon={<Factory className="w-4 h-4" />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorBarChart data={sectorData} title="Client Sectors" />
        <ServiceEgyptMap records={electricityData} title="Geographic Distribution" />
      </div>
      <RecordsTable records={electricityData} columns={["name", "service", "governorate", "activity"]} />
    </div>
  );
}

function WaterTab() {
  const govData = useMemo(() => countBy(waterData, "governorate"), []);
  const sectorData = useMemo(() => countBy(waterData, "activity"), []);
  return (
    <div className="space-y-6 animate-fade-in">
      <WaterSummary />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Clients" value={waterData.length} icon={<Droplets className="w-4 h-4" />} />
        <StatCard label="Governorates" value={govData.length} icon={<MapPin className="w-4 h-4" />} />
        <StatCard label="Client Sectors" value={sectorData.length} icon={<Factory className="w-4 h-4" />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorBarChart data={sectorData} title="Client Sectors" />
        <EgyptMap data={govData} title="Geographic Distribution" />
      </div>
      <RecordsTable records={waterData} columns={["name", "governorate", "activity"]} />
    </div>
  );
}

function ConsolidatedTab() {
  const allData = useMemo(() => [
    ...taqaGasData.map(r => ({ ...r, company: "TAQA Gas" })),
    ...masterGasData.map(r => ({ ...r, company: "Master Gas" })),
    ...petroleumData.map(r => ({ ...r, company: "Petroleum" })),
    ...electricityData.map(r => ({ ...r, company: "Electricity" })),
    ...waterData.map(r => ({ ...r, company: "Water" })),
  ], []);

  const companies = useMemo(() => [...new Set(allData.map(r => r.company))], [allData]);
  const governorates = useMemo(() => [...new Set(allData.map(r => r.governorate))].sort(), [allData]);
  const activities = useMemo(() => [...new Set(allData.map(r => r.activity))].sort(), [allData]);

  const [companyFilter, setCompanyFilter] = useState("");
  const [govFilter, setGovFilter] = useState("");
  const [actFilter, setActFilter] = useState("");

  const filtered = useMemo(() => {
    return allData.filter(r => {
      if (companyFilter && r.company !== companyFilter) return false;
      if (govFilter && r.governorate !== govFilter) return false;
      if (actFilter && r.activity !== actFilter) return false;
      return true;
    });
  }, [allData, companyFilter, govFilter, actFilter]);

  const mapData = useMemo(() => countBy(filtered as ClientRecord[], "governorate"), [filtered]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* TAQA Arabia About Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={taqaLogo} alt="TAQA Arabia" className="h-14 object-contain rounded bg-white/90 px-3 py-1" />
          <div>
            <h2 className="text-white text-xl font-bold">TAQA Arabia</h2>
            <p className="text-white/60 text-sm">A World of Energy</p>
          </div>
        </div>
        <div className="relative border-l-2 border-white/20 ml-4 pl-6 space-y-6">
          <div className="relative">
            <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white/30" />
            <h3 className="text-blue-400 font-bold text-lg">2006</h3>
            <p className="text-white font-semibold text-sm mt-1">Established by Qalaa Holdings and regional co-investors</p>
            <p className="text-white/70 text-xs mt-1">Each acquisition had a 9-year operational track record — became TAQA's base for the Gas and Power divisions.</p>
            <p className="text-white font-semibold text-sm mt-2">4 more acquisitions including BG, Edison, Eni and AMEC's gas distribution</p>
            <p className="text-white/70 text-xs mt-1">All consolidated within GENCO (now TAQA Gas), inheriting existing customer base, experienced and visionary executive teams with profound local insights.</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white/30" />
            <h3 className="text-blue-400 font-bold text-lg">2008</h3>
            <p className="text-white font-semibold text-sm mt-1">Established Petroleum Division</p>
            <p className="text-white/70 text-xs mt-1">Greenfield initiative that included recruitment of a top-notch team from international oil companies (IOCs).</p>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white/30" />
              <h3 className="text-blue-400 font-bold text-lg">2019</h3>
              <p className="text-white font-semibold text-sm mt-1">1st Renewable Energy Project</p>
              <p className="text-white/70 text-xs mt-1">65 MW solar plant in Benban, Upper Egypt.</p>
            </div>
            <div>
              <h3 className="text-blue-400 font-bold text-lg">2021</h3>
              <p className="text-white font-semibold text-sm mt-1">Established TAQA Water</p>
              <p className="text-white/70 text-xs mt-1">Targeting water desalination and treatment projects across Egypt.</p>
            </div>
          </div>
        </div>
        <p className="text-white/80 text-sm text-center mt-6 italic">Today, this combined leadership team continues to fuel TAQA's continuous growth.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Nationwide Coverage" value={[...new Set([...taqaGasData, ...masterGasData, ...petroleumData, ...electricityData, ...waterData].map(r => r.governorate))].length} icon={<MapPin className="w-4 h-4" />} badge={`Governorate out of 27`} />
        <StatCard label="Sectors Covered" value={[...new Set([...taqaGasData, ...masterGasData, ...petroleumData, ...electricityData, ...waterData].map(r => r.activity))].length} icon={<Factory className="w-4 h-4" />} />
        <StatCard label="Total Gas Connected Clients" value={taqaGasData.length} icon={<Flame className="w-4 h-4" />} />
        <StatCard label="Total Stations (Master Gas + Petroleum)" value={cngStationsData.length + petroleumData.length} icon={<Fuel className="w-4 h-4" />} />
        <StatCard label="Electricity Consumers Served" value={electricityData.length} icon={<Zap className="w-4 h-4" />} />
        <StatCard label="Water Desalination Customers" value={waterData.length} icon={<Droplets className="w-4 h-4" />} />
      </div>

      <ConsolidatedEgyptMap data={mapData} allRecords={filtered} title="TAQA Consolidated Map" />

      <div className="glass-card rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Filters</h3>
        <div className="flex flex-wrap gap-4">
          <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ background: "hsl(220 20% 18%)", border: "1px solid hsl(220 15% 25%)", color: "#fff" }}>
            <option value="">All Companies</option>
            {companies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={govFilter} onChange={e => setGovFilter(e.target.value)} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ background: "hsl(220 20% 18%)", border: "1px solid hsl(220 15% 25%)", color: "#fff" }}>
            <option value="">All Governorates</option>
            {governorates.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={actFilter} onChange={e => setActFilter(e.target.value)} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ background: "hsl(220 20% 18%)", border: "1px solid hsl(220 15% 25%)", color: "#fff" }}>
            <option value="">All Activities</option>
            {activities.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("consolidated");

  return (
    <div className={`taqa-analytics min-h-screen theme-${activeTab}`} style={{ background: "hsl(222 47% 11%)" }}>
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link to="/"><Button variant="secondary" size="sm" className="gap-2 shrink-0"><HomeIcon className="h-4 w-4"/>Home</Button></Link>
        <h1 className="text-2xl font-bold" style={{ color: "hsl(var(--tab-theme))" }}>TAQA Arabia: Leading Integrated Energy Solutions</h1>
      </header>

      <nav className="border-b border-white/10 px-4 overflow-x-auto scrollbar-thin">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-current"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
              style={activeTab === tab.id ? { color: "hsl(var(--tab-theme))", borderColor: "hsl(var(--tab-theme))" } : undefined}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === "consolidated" && <ConsolidatedTab />}
        {activeTab === "taqa" && <TaqaGasTab />}
        {activeTab === "master" && <MasterGasTab />}
        {activeTab === "petroleum" && <PetroleumTab />}
        {activeTab === "electricity" && <ElectricityTab />}
        {activeTab === "water" && <WaterTab />}
        {activeTab === "clients" && <ClientsOverviewTab />}
      </main>
    </div>
  );
}
