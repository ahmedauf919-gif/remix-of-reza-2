import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home as HomeIcon, Search } from "lucide-react";
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
import { Fuel, Zap, Droplets, MapPin, Building2, Factory, Flame, Users, Layers } from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.png";

const tabs = [
  { id: "consolidated", label: "TAQA Arabia", icon: <MapPin className="w-4 h-4" /> },
  { id: "taqa", label: "Gas", icon: <Flame className="w-4 h-4" /> },
  { id: "master", label: "Master Gas", icon: <Fuel className="w-4 h-4" /> },
  { id: "petroleum", label: "Petroleum", icon: <Fuel className="w-4 h-4" /> },
  { id: "electricity", label: "Electricity", icon: <Zap className="w-4 h-4" /> },
  { id: "water", label: "Water", icon: <Droplets className="w-4 h-4" /> },
  { id: "clients", label: "Who We Serve", icon: <Users className="w-4 h-4" /> },
  { id: "portfolio", label: "Portfolio", icon: <Layers className="w-4 h-4" /> },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const selectStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#334155",
  borderRadius: 8,
  padding: "6px 12px",
  fontSize: 13,
  outline: "none",
};

// ── Tab: Portfolio ────────────────────────────────────────────────────────────

const COMPANY_COLORS: Record<string, string> = {
  "TAQA Gas": "hsl(145, 70%, 42%)",
  "Master Gas": "hsl(155, 65%, 40%)",
  "Petroleum": "hsl(220, 10%, 45%)",
  "Electricity": "hsl(45, 90%, 42%)",
  "Water": "hsl(210, 85%, 50%)",
};

function PortfolioTab() {
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 30;

  const filtered = useMemo(() => allData.filter(r => {
    if (companyFilter && r.company !== companyFilter) return false;
    if (govFilter && r.governorate !== govFilter) return false;
    if (actFilter && r.activity !== actFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (![r.name, r.company, r.governorate, r.activity, r.service].some(v => v.toLowerCase().includes(s))) return false;
    }
    return true;
  }), [allData, companyFilter, govFilter, actFilter, search]);

  const pages = Math.ceil(filtered.length / perPage);
  const slice = filtered.slice(page * perPage, (page + 1) * perPage);

  // summary stats
  const totalByCompany = useMemo(() => companies.map(c => ({
    company: c,
    count: allData.filter(r => r.company === c).length,
  })), [allData, companies]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {totalByCompany.map(({ company, count }) => (
          <div key={company} className="glass-card rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">{company}</div>
            <div className="text-2xl font-bold" style={{ color: COMPANY_COLORS[company] }}>{count}</div>
            <div className="text-xs text-slate-400 mt-0.5">records</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">Filters</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={companyFilter} onChange={e => { setCompanyFilter(e.target.value); setPage(0); }} style={selectStyle}>
            <option value="">All Companies</option>
            {companies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={govFilter} onChange={e => { setGovFilter(e.target.value); setPage(0); }} style={selectStyle}>
            <option value="">All Governorates</option>
            {governorates.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={actFilter} onChange={e => { setActFilter(e.target.value); setPage(0); }} style={selectStyle}>
            <option value="">All Activities</option>
            {activities.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="pl-9 pr-3 py-1.5 rounded-lg text-sm text-slate-800 outline-none focus:ring-1 focus:ring-blue-300"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              placeholder="Search name, activity…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
          {(companyFilter || govFilter || actFilter || search) && (
            <button
              onClick={() => { setCompanyFilter(""); setGovFilter(""); setActFilter(""); setSearch(""); setPage(0); }}
              className="text-xs text-slate-500 hover:text-red-500 transition-colors px-2 py-1 rounded border border-slate-200"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-slate-800 font-semibold">
            Results <span className="text-slate-400 font-normal text-sm ml-1">({filtered.length} of {allData.length})</span>
          </h3>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 text-slate-500 font-medium">#</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Company</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Client Name</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Governorate</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Activity</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Service</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((r, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 text-slate-400">{page * perPage + i + 1}</td>
                  <td className="py-2 px-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${COMPANY_COLORS[r.company]}20`, color: COMPANY_COLORS[r.company], border: `1px solid ${COMPANY_COLORS[r.company]}40` }}
                    >
                      {r.company}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-800">{r.name}</td>
                  <td className="py-2 px-3 text-slate-600">{r.governorate}</td>
                  <td className="py-2 px-3 text-slate-600">{r.activity}</td>
                  <td className="py-2 px-3 text-slate-500 text-xs">{r.service}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 rounded text-slate-700 text-sm disabled:opacity-40" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>Prev</button>
            <span className="text-slate-500 text-sm">{page + 1} / {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page >= pages - 1} className="px-3 py-1 rounded text-slate-700 text-sm disabled:opacity-40" style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Gas ──────────────────────────────────────────────────────────────────

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

// ── Tab: Master Gas ───────────────────────────────────────────────────────────

function MasterGasTab() {
  const cngGovData = useMemo(() => countBy(cngStationsData, "governorate"), []);
  const mcngGovData = useMemo(() => countBy(mobileCNGData, "governorate"), []);
  return (
    <div className="space-y-6 animate-fade-in">
      <MasterGasSummary />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="MCNG Clients" value={mobileCNGData.length} icon={<Fuel className="w-4 h-4" />} />
        <StatCard label="Number of CNG Stations" value={cngStationsData.length} icon={<Building2 className="w-4 h-4" />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorBarChart data={cngGovData} title="Station Distribution" />
        <DualEgyptMap stationsData={cngGovData} mcngData={mcngGovData} title="Geographic Distribution" />
      </div>
      <RecordsTable records={masterGasData} columns={["name", "service", "governorate", "activity"]} />
    </div>
  );
}

// ── Tab: Petroleum ────────────────────────────────────────────────────────────

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

// ── Tab: Electricity ──────────────────────────────────────────────────────────

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

// ── Tab: Water ────────────────────────────────────────────────────────────────

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

// ── Tab: Consolidated ─────────────────────────────────────────────────────────

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

  const filtered = useMemo(() => allData.filter(r => {
    if (companyFilter && r.company !== companyFilter) return false;
    if (govFilter && r.governorate !== govFilter) return false;
    if (actFilter && r.activity !== actFilter) return false;
    return true;
  }), [allData, companyFilter, govFilter, actFilter]);

  const mapData = useMemo(() => countBy(filtered as ClientRecord[], "governorate"), [filtered]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* TAQA Arabia About Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={taqaLogo} alt="TAQA Arabia" className="h-14 object-contain rounded bg-slate-50 px-3 py-1 border border-slate-100" />
          <div>
            <h2 className="text-slate-900 text-xl font-bold">TAQA Arabia</h2>
            <p className="text-slate-500 text-sm">A World of Energy</p>
          </div>
        </div>
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
          <div className="relative">
            <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
            <h3 className="text-blue-600 font-bold text-lg">2006</h3>
            <p className="text-slate-800 font-semibold text-sm mt-1">Established by Qalaa Holdings and regional co-investors</p>
            <p className="text-slate-500 text-xs mt-1">Each acquisition had a 9-year operational track record — became TAQA's base for the Gas and Power divisions.</p>
            <p className="text-slate-800 font-semibold text-sm mt-2">4 more acquisitions including BG, Edison, Eni and AMEC's gas distribution</p>
            <p className="text-slate-500 text-xs mt-1">All consolidated within GENCO (now TAQA Gas), inheriting existing customer base, experienced and visionary executive teams with profound local insights.</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
            <h3 className="text-blue-600 font-bold text-lg">2008</h3>
            <p className="text-slate-800 font-semibold text-sm mt-1">Established Petroleum Division</p>
            <p className="text-slate-500 text-xs mt-1">Greenfield initiative that included recruitment of a top-notch team from international oil companies (IOCs).</p>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
              <h3 className="text-blue-600 font-bold text-lg">2019</h3>
              <p className="text-slate-800 font-semibold text-sm mt-1">1st Renewable Energy Project</p>
              <p className="text-slate-500 text-xs mt-1">65 MW solar plant in Benban, Upper Egypt.</p>
            </div>
            <div>
              <h3 className="text-blue-600 font-bold text-lg">2021</h3>
              <p className="text-slate-800 font-semibold text-sm mt-1">Established TAQA Water</p>
              <p className="text-slate-500 text-xs mt-1">Targeting water desalination and treatment projects across Egypt.</p>
            </div>
          </div>
        </div>
        <p className="text-slate-500 text-sm text-center mt-6 italic">Today, this combined leadership team continues to fuel TAQA's continuous growth.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Nationwide Coverage" value={[...new Set([...taqaGasData, ...masterGasData, ...petroleumData, ...electricityData, ...waterData].map(r => r.governorate))].length} icon={<MapPin className="w-4 h-4" />} badge="Governorates out of 27" />
        <StatCard label="Sectors Covered" value={[...new Set([...taqaGasData, ...masterGasData, ...petroleumData, ...electricityData, ...waterData].map(r => r.activity))].length} icon={<Factory className="w-4 h-4" />} />
        <StatCard label="Gas Connected Clients" value={taqaGasData.length} icon={<Flame className="w-4 h-4" />} />
        <StatCard label="Stations (MG + Petroleum)" value={cngStationsData.length + petroleumData.length} icon={<Fuel className="w-4 h-4" />} />
        <StatCard label="Electricity Consumers" value={electricityData.length} icon={<Zap className="w-4 h-4" />} />
        <StatCard label="Water Customers" value={waterData.length} icon={<Droplets className="w-4 h-4" />} />
      </div>

      {/* Filters — above the map */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">Map Filters</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} style={selectStyle}>
            <option value="">All Companies</option>
            {companies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={govFilter} onChange={e => setGovFilter(e.target.value)} style={selectStyle}>
            <option value="">All Governorates</option>
            {governorates.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={actFilter} onChange={e => setActFilter(e.target.value)} style={selectStyle}>
            <option value="">All Activities</option>
            {activities.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          {(companyFilter || govFilter || actFilter) && (
            <button
              onClick={() => { setCompanyFilter(""); setGovFilter(""); setActFilter(""); }}
              className="text-xs text-slate-500 hover:text-red-500 transition-colors px-2 py-1 rounded border border-slate-200"
            >
              Clear
            </button>
          )}
          <span className="text-xs text-slate-400 ml-1">{filtered.length} records shown</span>
        </div>
      </div>

      {/* Consolidated Map */}
      <ConsolidatedEgyptMap data={mapData} allRecords={filtered} title="TAQA Consolidated Map" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Index() {
  const [activeTab, setActiveTab] = useState("consolidated");

  return (
    <div className={`taqa-analytics min-h-screen theme-${activeTab}`} style={{ background: "#f1f5f9" }}>
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center gap-4">
        <Link to="/"><Button variant="outline" size="sm" className="gap-2 shrink-0"><HomeIcon className="h-4 w-4" />Home</Button></Link>
        <h1 className="text-xl font-bold" style={{ color: "hsl(var(--tab-theme))" }}>TAQA Arabia: Leading Integrated Energy Solutions</h1>
      </header>

      <nav className="border-b border-slate-200 bg-white px-4 overflow-x-auto scrollbar-thin">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-current"
                  : "border-transparent text-slate-500 hover:text-slate-800"
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
        {activeTab === "portfolio" && <PortfolioTab />}
      </main>
    </div>
  );
}
