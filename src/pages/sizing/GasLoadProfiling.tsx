import { useMemo, useState } from "react";
import { Gauge } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { ToolPage, Panel, Field, SegmentedField, Stat, Verdict } from "./toolkit";

const ACCENT = "#E68A00";

type FacilityType = "factory" | "hotel" | "compound" | "food-processing" | "ceramics";

/* Normalized-shape 24h profiles (relative weights, hour 0–23).
   Ceramics/factory run near-flat with shift peaks; hotel shows morning +
   evening peaks; compound peaks in the evening; food-processing is day-shift. */
const HOURLY_PROFILES: Record<FacilityType, number[]> = {
  factory: [
    0.72, 0.70, 0.70, 0.72, 0.78, 0.90, 1.05, 1.18, 1.25, 1.22, 1.15, 1.10,
    1.05, 1.12, 1.20, 1.22, 1.15, 1.05, 0.95, 0.90, 0.85, 0.80, 0.76, 0.73,
  ],
  hotel: [
    0.45, 0.38, 0.35, 0.35, 0.42, 0.70, 1.20, 1.55, 1.45, 1.10, 0.90, 0.95,
    1.05, 1.00, 0.85, 0.80, 0.95, 1.30, 1.60, 1.70, 1.50, 1.15, 0.80, 0.55,
  ],
  compound: [
    0.50, 0.42, 0.38, 0.38, 0.42, 0.55, 0.85, 1.05, 0.95, 0.80, 0.75, 0.85,
    1.00, 0.95, 0.85, 0.85, 1.00, 1.30, 1.65, 1.80, 1.70, 1.40, 1.00, 0.65,
  ],
  "food-processing": [
    0.35, 0.32, 0.32, 0.35, 0.55, 0.95, 1.35, 1.55, 1.60, 1.58, 1.55, 1.50,
    1.45, 1.50, 1.52, 1.45, 1.30, 1.05, 0.80, 0.60, 0.50, 0.45, 0.40, 0.36,
  ],
  ceramics: [
    0.96, 0.95, 0.95, 0.95, 0.96, 0.98, 1.02, 1.06, 1.08, 1.08, 1.06, 1.04,
    1.03, 1.05, 1.07, 1.07, 1.05, 1.03, 1.01, 1.00, 0.98, 0.97, 0.96, 0.96,
  ],
};

const FACILITY_OPTIONS: { value: FacilityType; label: string }[] = [
  { value: "factory", label: "Factory" },
  { value: "hotel", label: "Hotel" },
  { value: "compound", label: "Compound" },
  { value: "food-processing", label: "Food processing" },
  { value: "ceramics", label: "Ceramics" },
];

const TRAILER_CAPACITY = 4500; // Nm³ per jumbo CNG trailer

const TIERS = [
  { name: "Starter", ceiling: 500 },
  { name: "Light", ceiling: 1500 },
  { name: "Standard", ceiling: 3000 },
  { name: "Advanced", ceiling: 5000 },
  { name: "Heavy", ceiling: 8000 }, // open-ended top tier, drawn at slider max
] as const;

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
} as const;

export default function GasLoadProfiling() {
  const [facilityType, setFacilityType] = useState<FacilityType>("factory");
  const [dailyDemand, setDailyDemand] = useState(1500);
  const [operatingDays, setOperatingDays] = useState(330);
  const [growthFactor, setGrowthFactor] = useState(15);
  const [diversityFactor, setDiversityFactor] = useState(85);

  const results = useMemo(() => {
    const designDaily = dailyDemand * (1 + growthFactor / 100);
    const profile = HOURLY_PROFILES[facilityType];
    const sum = profile.reduce((a, b) => a + b, 0);
    const curve = profile.map((w, hour) => ({
      hour,
      flow: (w / sum) * designDaily * (diversityFactor / 100),
    }));
    const peakFlow = Math.max(...curve.map(p => p.flow));
    const annual = designDaily * operatingDays;
    const tier = TIERS.find(t => designDaily <= t.ceiling) ?? TIERS[TIERS.length - 1];
    const trailersPerDay = Math.ceil(designDaily / TRAILER_CAPACITY);
    const cadenceHours = 24 / trailersPerDay;
    return { designDaily, curve, peakFlow, annual, tier, trailersPerDay, cadenceHours };
  }, [facilityType, dailyDemand, operatingDays, growthFactor, diversityFactor]);

  const tierData = useMemo(
    () => TIERS.map(t => ({ name: t.name, ceiling: t.ceiling, selected: t.name === results.tier.name })),
    [results.tier.name],
  );

  const cadenceText =
    results.trailersPerDay === 1
      ? "one jumbo trailer swap per day"
      : `${results.trailersPerDay} trailer swaps/day — one every ~${results.cadenceHours.toLocaleString(undefined, { maximumFractionDigits: 1 })} h`;

  return (
    <ToolPage
      title="Gas Load Profiling"
      tagline="Site-audit demand curve → Mobile CNG capacity tier"
      badge="Sizing Models · Gas"
      accent={ACCENT}
      icon={<Gauge className="h-5 w-5" />}
    >
      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        <div className="space-y-5">
          <Panel title="Inputs" subtitle="Site audit parameters">
            <div className="space-y-5">
              <SegmentedField
                label="Facility type"
                value={facilityType}
                onChange={setFacilityType}
                options={FACILITY_OPTIONS}
                accent={ACCENT}
              />
              <Field
                label="Metered daily demand"
                value={dailyDemand}
                onChange={setDailyDemand}
                min={200}
                max={8000}
                step={50}
                unit="Nm³/d"
                hint="Average consumption from the site audit"
                accent={ACCENT}
              />
              <Field
                label="Operating days"
                value={operatingDays}
                onChange={setOperatingDays}
                min={250}
                max={365}
                unit="d/yr"
                accent={ACCENT}
              />
              <Field
                label="Growth factor"
                value={growthFactor}
                onChange={setGrowthFactor}
                min={0}
                max={50}
                unit="%"
                hint="Demand headroom for expansion"
                accent={ACCENT}
              />
              <Field
                label="Diversity factor"
                value={diversityFactor}
                onChange={setDiversityFactor}
                min={60}
                max={100}
                unit="%"
                hint="Coincidence of individual burner loads"
                accent={ACCENT}
              />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Verdict
            accent={ACCENT}
            title={`${results.tier.name} Mobile CNG station`}
            detail={`Design daily ${Math.round(results.designDaily).toLocaleString()} Nm³/d → ${cadenceText} (jumbo trailer ≈ ${TRAILER_CAPACITY.toLocaleString()} Nm³).`}
          />

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Stat
              label="Peak flow"
              value={Math.round(results.peakFlow).toLocaleString()}
              unit="Nm³/h"
              sub={`${FACILITY_OPTIONS.find(o => o.value === facilityType)?.label} profile shape`}
              accent={ACCENT}
            />
            <Stat
              label="Design daily"
              value={Math.round(results.designDaily).toLocaleString()}
              unit="Nm³/d"
              sub={`Audit demand + ${growthFactor}% growth`}
              accent={ACCENT}
            />
            <Stat
              label="Annual volume"
              value={(results.annual / 1e6).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              unit="mln Nm³"
              sub={`Over ${operatingDays.toLocaleString()} operating days`}
              accent={ACCENT}
            />
            <Stat
              label="Trailers per day"
              value={results.trailersPerDay.toLocaleString()}
              unit="swaps"
              sub={results.trailersPerDay === 1 ? "Daily refill run" : `Every ~${results.cadenceHours.toLocaleString(undefined, { maximumFractionDigits: 1 })} h`}
              accent={ACCENT}
            />
          </div>

          <Panel title="24-hour demand curve" subtitle="Design daily × normalized facility profile × diversity">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.curve} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={h => `${h}:00`}
                    interval={2}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={v => v.toLocaleString()}
                    tickLine={false}
                    axisLine={false}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`${Math.round(v).toLocaleString()} Nm³/h`, "Gas demand"]}
                    labelFormatter={h => `Hour ${h}:00`}
                  />
                  <ReferenceLine
                    y={results.peakFlow}
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    label={{
                      value: `Peak ${Math.round(results.peakFlow).toLocaleString()} Nm³/h`,
                      position: "insideTopRight",
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <Area type="monotone" dataKey="flow" stroke={ACCENT} strokeWidth={2} fill={ACCENT} fillOpacity={0.14} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Capacity tier bands" subtitle="Tier ceilings (Nm³/d) vs your design daily demand">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tierData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={v => v.toLocaleString()}
                    tickLine={false}
                    axisLine={false}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "rgba(148,163,184,0.08)" }}
                    formatter={(v: number, _n, entry) => [
                      entry?.payload?.name === "Heavy"
                        ? "> 5,000 Nm³/d (open-ended)"
                        : `≤ ${v.toLocaleString()} Nm³/d`,
                      "Tier ceiling",
                    ]}
                  />
                  <ReferenceLine
                    y={results.designDaily}
                    stroke="#334155"
                    strokeDasharray="4 4"
                    label={{
                      value: `Design ${Math.round(results.designDaily).toLocaleString()}`,
                      position: "insideTopLeft",
                      fontSize: 11,
                      fill: "#334155",
                    }}
                  />
                  <Bar dataKey="ceiling" radius={[4, 4, 0, 0]} maxBarSize={64}>
                    {tierData.map(t => (
                      <Cell key={t.name} fill={t.selected ? ACCENT : "#e2e8f0"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[12px] text-slate-500 mt-2">
              The highlighted band is the selected Mobile CNG tier; the dashed line marks your design daily demand.
            </p>
          </Panel>
        </div>
      </div>
    </ToolPage>
  );
}
