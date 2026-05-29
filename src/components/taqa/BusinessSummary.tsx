import { Flame, Fuel, Zap, Droplets, Factory } from "lucide-react";

interface SummaryProps {
  title: string;
  icon: React.ReactNode;
  nature: string;
  points: string[];
}

function SummaryCard({ title, icon, nature, points }: SummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Business Nature */}
      <div className="glass-card rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: "hsl(var(--tab-theme) / 0.15)" }}>
            <span style={{ color: "hsl(var(--tab-theme))" }}>{icon}</span>
          </div>
          <h2 className="text-slate-800 text-lg font-bold">Business Nature</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{nature}</p>
      </div>

      {/* What Do We Do */}
      <div className="glass-card rounded-xl p-6 space-y-3">
        <h2 className="text-slate-800 text-lg font-bold">What We Do</h2>
        <ul className="space-y-2">
          {points.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-600 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "hsl(var(--tab-theme))" }} />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function TaqaGasSummary() {
  return (
    <SummaryCard
      title="TAQA Gas"
      icon={<Flame className="w-5 h-5" />}
      nature="TAQA Gas is the downstream natural gas arm of TAQA Arabia, covering the entire natural gas value chain from engineering to distribution and after‑sales service."
      points={[
        "Conduct gas feasibility studies, market research, surveying, and detailed engineering.",
        "Build and install transmission pipelines, distribution networks, river crossings, PRS stations, and house/commercial/industrial connections.",
        "Run complete O&M, emergency response (24/7), repairs, customer service, billing & collection.",
        "Own 4 major gas concessions (City Gas, Nile Valley Gas, Trans Gas, Repco Gas).",
        "Distribute over 7.3 BCM of natural gas, with a network exceeding 8,000 km and 1.5M+ customers, holding 56% market share among private concessions.",
      ]}
    />
  );
}

export function MasterGasSummary() {
  return (
    <SummaryCard
      title="Master Gas"
      icon={<Fuel className="w-5 h-5" />}
      nature="Master Gas is TAQA Arabia's specialized company for CNG/NGV infrastructure, conversions, and virtual pipeline systems."
      points={[
        "Operate 80+ CNG fueling stations, with expansion toward 150–200 stations nationwide.",
        "Manage COCO & DODO operating models to scale NGV coverage.",
        "Operate 13 vehicle conversion centers, converting up to 8,000 vehicles/year (passenger cars, light trucks, heavy trucks).",
        "Provide virtual pipeline gas delivery through CNG mobile units from mother to daughter stations.",
        "Implement the region's first virtual pipeline project supplying New Valley (Kharga) to serve 14,000+ residents and businesses.",
        "Serve industrial, residential, tourism, and agricultural customers.",
      ]}
    />
  );
}

export function PetroleumSummary() {
  return (
    <SummaryCard
      title="TAQA Petroleum"
      icon={<Fuel className="w-5 h-5" />}
      nature="TAQA's oil marketing division manages fuel retail, petroleum products, storage, and lubricants distribution. It is the only private Egyptian company licensed to market fuels & lubricants nationwide."
      points={[
        "Market and distribute fuels and lubricants across Egypt.",
        "Serve as the sole distributor for Castrol lubricants (since 2008).",
        "Operate a JV with BP/Castrol to blend lubricants locally (established 2018).",
        "Own/operate 60+ fuel stations and 80 Castrol retail shops.",
        "Manage fuel storage terminals including a major 17M‑liter terminal in Suez.",
        "Sold 750M+ liters of refined products in 2019.",
      ]}
    />
  );
}

export function ElectricitySummary() {
  return (
    <SummaryCard
      title="TAQA Power"
      icon={<Zap className="w-5 h-5" />}
      nature="TAQA Power develops, owns, operates, and maintains power generation and distribution assets across Egypt, including solar energy."
      points={[
        "Build, own, and operate conventional, diesel, cogeneration, and trigeneration plants.",
        "Develop solar PV plants from 1 MW up to 80 MW, with over 71 MW installed capacity.",
        "Operate and maintain electrical substations, power networks, and customer facilities.",
        "Manage over 115 MW of power generation and around 1,200 MW of distribution for ~7,000 customers.",
        "Provide excess‑power utilization solutions to reduce waste and boost efficiency.",
        "Serve key regions including Cairo, Giza, Alexandria, Red Sea, South Sinai, and Upper Egypt.",
      ]}
    />
  );
}

export function WaterSummary() {
  return (
    <SummaryCard
      title="TAQA Water"
      icon={<Droplets className="w-5 h-5" />}
      nature="TAQA Water is the water treatment and desalination arm of TAQA Arabia, offering end‑to‑end solutions across multiple water‑consuming sectors."
      points={[
        "Deliver desalination (RO), wastewater treatment, filtration, and chemical treatment solutions.",
        "Serve tourism & real estate, industrial, agricultural, and livestock sectors.",
        "Provide potable water treatment, low‑salinity water for agriculture, and process water for industry.",
        "Design smart, customized ECO water systems using advanced simulation and 3D CAD modeling.",
        "Built on a professional team with 15+ years of water‑treatment expertise.",
      ]}
    />
  );
}
