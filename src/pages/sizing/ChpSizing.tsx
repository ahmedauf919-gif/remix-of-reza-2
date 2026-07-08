import { useMemo, useState } from "react";
import { Flame } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";
import { ToolPage, Panel, Field, SegmentedField, ToggleField, Stat, Verdict } from "./toolkit";

const ACCENT = "#c2410c";

type PrimeMover = "engine" | "turbine";

/** Prime-mover characteristics: electrical efficiency and heat-to-power ratio. */
const MOVERS: Record<PrimeMover, { label: string; elecEff: number; h2p: number }> = {
  engine: { label: "Gas Engine", elecEff: 0.42, h2p: 1.1 },
  turbine: { label: "Gas Turbine", elecEff: 0.35, h2p: 1.8 },
};

/** 1 MWth ≈ 284 RT at COP 1; single-effect absorption chiller COP ≈ 0.7. */
const RT_PER_MWTH = 284;
const ABSORPTION_COP = 0.7;
const EFF_CAP = 85; // % — practical total fuel efficiency ceiling shown to the user

const fmt = (n: number, d = 1) =>
  n.toLocaleString(undefined, { maximumFractionDigits: d });

const tick = { fontSize: 11, fill: "#64748b" };

/** Core CHP balance for a given thermal demand (used live and for the sweep). */
function chpBalance(
  electricalLoad: number, thermalDemand: number, triGen: boolean,
  coolingLoad: number, mover: PrimeMover,
) {
  const { elecEff, h2p } = MOVERS[mover];
  const mwe = electricalLoad * 0.9; // baseload sizing rule — peaks from grid
  const recovered = mwe * h2p;
  const thermalCoverage = Math.min(recovered, thermalDemand);
  const surplusHeat = Math.max(0, recovered - thermalDemand);

  const rtAvailable = triGen ? surplusHeat * RT_PER_MWTH * ABSORPTION_COP : 0;
  const rtServed = Math.min(rtAvailable, coolingLoad);
  const coolingHeatUsed = triGen ? rtServed / (RT_PER_MWTH * ABSORPTION_COP) : 0;

  const fuelInput = mwe / elecEff;
  const rawEff = ((mwe + thermalCoverage + coolingHeatUsed) / fuelInput) * 100;
  const totalEff = Math.min(rawEff, EFF_CAP);
  return { mwe, recovered, thermalCoverage, surplusHeat, rtServed, coolingHeatUsed, fuelInput, totalEff };
}

export default function ChpSizing() {
  const [electricalLoad, setElectricalLoad] = useState(10);
  const [thermalLoad, setThermalLoad] = useState(12);
  const [triGen, setTriGen] = useState(false);
  const [coolingLoad, setCoolingLoad] = useState(2000);
  const [operatingHours, setOperatingHours] = useState(8000);
  const [gasPrice, setGasPrice] = useState(6);
  const [gridTariff, setGridTariff] = useState(0.1);
  const [primeMover, setPrimeMover] = useState<PrimeMover>("engine");

  const r = useMemo(() => {
    const b = chpBalance(electricalLoad, thermalLoad, triGen, coolingLoad, primeMover);

    // Annual economics
    const genGwh = (b.mwe * operatingHours) / 1000;
    const fuelMmbtu = b.fuelInput * operatingHours * 3.412;
    const savings = genGwh * 1e6 * gridTariff - fuelMmbtu * gasPrice; // $/yr
    const savingsLabel = Math.abs(savings) >= 1e6
      ? `${fmt(savings / 1e6, 2)} M$/yr`
      : `${fmt(savings / 1e3, 0)} k$/yr`;

    const losses = Math.max(0, b.fuelInput - b.mwe - b.thermalCoverage - b.coolingHeatUsed);
    const balanceData = [
      { name: "Fuel input", fuel: +b.fuelInput.toFixed(2) },
      {
        name: "Energy balance",
        elec: +b.mwe.toFixed(2),
        heat: +b.thermalCoverage.toFixed(2),
        cooling: +b.coolingHeatUsed.toFixed(2),
        losses: +losses.toFixed(2),
      },
    ];

    // Total efficiency vs thermal load sweep (0 → 60 MWth at current settings)
    const sweepData = Array.from({ length: 31 }, (_, i) => {
      const th = i * 2;
      return {
        thermal: th,
        eff: +chpBalance(electricalLoad, th, triGen, coolingLoad, primeMover).totalEff.toFixed(1),
      };
    });

    const verdictTitle =
      `${fmt(b.mwe, 1)} MWe ${MOVERS[primeMover].label} + ${fmt(b.recovered, 1)} MWth recovery` +
      (triGen ? ` + ${fmt(b.rtServed, 0)} RT absorption` : "") +
      ` — ${fmt(b.totalEff, 0)}% total fuel efficiency`;

    const heatUseShare = b.recovered > 0 ? ((b.thermalCoverage + b.coolingHeatUsed) / b.recovered) * 100 : 0;
    const detail =
      `Sized at 90% of the ${fmt(electricalLoad, 1)} MWe site load (peaks from grid). ` +
      `${fmt(heatUseShare, 0)}% of recovered heat is absorbed by site thermal${triGen ? " and cooling" : ""} demand — ` +
      `~85% total fuel efficiency is achievable with full heat utilisation. ` +
      `Spark-spread savings ≈ ${savingsLabel} at $${gasPrice.toFixed(2)}/mmBtu gas vs $${gridTariff.toFixed(3)}/kWh grid.`;

    return { ...b, genGwh, fuelMmbtu, savings, savingsLabel, balanceData, sweepData, verdictTitle, detail };
  }, [electricalLoad, thermalLoad, triGen, coolingLoad, operatingHours, gasPrice, gridTariff, primeMover]);

  return (
    <ToolPage
      title="CHP / Tri-Generation Sizing"
      tagline="Power & thermal load profiling — cogeneration sizing toward ~85% total fuel efficiency"
      badge="Sizing Models · Power"
      accent={ACCENT}
      icon={<Flame className="h-5 w-5" />}
    >
      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        <div className="space-y-5">
          <Panel title="Site Loads" subtitle="Electrical, thermal and cooling demand">
            <div className="space-y-5">
              <Field label="Electrical load" value={electricalLoad} onChange={setElectricalLoad}
                min={0.5} max={50} step={0.5} unit="MW" accent={ACCENT} />
              <Field label="Thermal load" value={thermalLoad} onChange={setThermalLoad}
                min={0.5} max={60} step={0.5} unit="MWth" accent={ACCENT}
                hint="Steam / hot water demand recoverable from exhaust & jacket heat" />
              <ToggleField label="Add absorption cooling (tri-generation)" value={triGen}
                onChange={setTriGen} accent={ACCENT}
                hint="Route surplus recovered heat to single-effect absorption chillers" />
              <Field label="Cooling load" value={coolingLoad} onChange={setCoolingLoad}
                min={100} max={20000} step={100} unit="RT" accent={ACCENT}
                hint={triGen ? "Served from surplus heat at COP 0.7" : "Counted only when tri-generation is enabled"} />
            </div>
          </Panel>
          <Panel title="Plant & Economics" subtitle="Prime mover and energy prices">
            <div className="space-y-5">
              <SegmentedField label="Prime mover" value={primeMover} onChange={setPrimeMover}
                accent={ACCENT}
                options={[
                  { value: "engine", label: "Gas Engine · 42% el, H:P 1.1" },
                  { value: "turbine", label: "Gas Turbine · 35% el, H:P 1.8" },
                ]} />
              <Field label="Operating hours" value={operatingHours} onChange={setOperatingHours}
                min={4000} max={8760} step={10} unit="h/yr" accent={ACCENT} />
              <Field label="Gas price" value={gasPrice} onChange={setGasPrice}
                min={3} max={12} step={0.25} unit="$/mmBtu" accent={ACCENT} />
              <Field label="Grid tariff" value={gridTariff} onChange={setGridTariff}
                min={0.05} max={0.2} step={0.005} unit="$/kWh" accent={ACCENT} />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Verdict accent={ACCENT} title={r.verdictTitle} detail={r.detail} />
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Stat label="CHP capacity" value={fmt(r.mwe, 1)} unit="MWe" accent={ACCENT}
              sub={`${MOVERS[primeMover].label} · ${fmt(r.genGwh, 1)} GWh/yr`} />
            <Stat label="Heat recovered" value={fmt(r.recovered, 1)} unit="MWth" accent={ACCENT}
              sub={`${fmt(r.thermalCoverage, 1)} MWth used on site${triGen ? ` · ${fmt(r.rtServed, 0)} RT cooling` : ""}`} />
            <Stat label="Total efficiency" value={fmt(r.totalEff, 0)} unit="%" accent={ACCENT}
              sub="~85% achievable with full heat utilisation" />
            <Stat label="Annual savings" value={fmt(r.savings / 1e6, 2)} unit="M$/yr" accent={ACCENT}
              sub={`Spark spread on ${fmt(r.fuelMmbtu / 1e3, 0)}k mmBtu fuel`} />
          </div>

          <Panel title="Energy Balance" subtitle="Fuel input vs useful outputs (MW) — losses in grey">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={r.balanceData} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false}
                  label={{ value: "MW", angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(v: number, name: string) => [`${fmt(v, 2)} MW`, name]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="fuel" name="Fuel input" stackId="a" fill="#94a3b8" maxBarSize={96} radius={[4, 4, 0, 0]} />
                <Bar dataKey="elec" name="Electricity" stackId="a" fill={ACCENT} maxBarSize={96} />
                <Bar dataKey="heat" name="Recovered heat used" stackId="a" fill="#fb923c" maxBarSize={96} />
                <Bar dataKey="cooling" name="Absorption cooling (heat)" stackId="a" fill="#0284c7" maxBarSize={96} />
                <Bar dataKey="losses" name="Losses" stackId="a" fill="#cbd5e1" maxBarSize={96} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Efficiency vs Thermal Load" subtitle="Total fuel efficiency across a 0–60 MWth thermal demand sweep at current settings">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={r.sweepData} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="thermal" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false}
                  label={{ value: "Thermal load (MWth)", position: "insideBottomRight", offset: -2, fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} tick={tick} axisLine={false} tickLine={false}
                  label={{ value: "%", angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(v: number) => [`${fmt(v, 1)} %`, "Total efficiency"]}
                  labelFormatter={(t: number) => `${t} MWth thermal load`}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <ReferenceLine y={85} stroke="#16a34a" strokeDasharray="4 4"
                  label={{ value: "~85% plateau", position: "insideTopRight", fontSize: 11, fill: "#16a34a" }} />
                <ReferenceLine x={thermalLoad} stroke="#94a3b8" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="eff" name="Total efficiency" stroke={ACCENT}
                  strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      </div>
    </ToolPage>
  );
}
