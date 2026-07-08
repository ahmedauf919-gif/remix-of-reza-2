import { useMemo, useState } from "react";
import { Car } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";
import { ToolPage, Panel, Field, ToggleField, Stat, Verdict } from "./toolkit";

const ACCENT = "#0369a1";

/** Consumption (kWh/km) and charger ratings (kW). */
const KWH_PER_KM = { car: 0.18, truck: 0.35, golf: 0.08 };
const RATING = { ac: 22, dc: 120, golf: 3 };

const fmt = (n: number, d = 1) =>
  n.toLocaleString(undefined, { maximumFractionDigits: d });

const tick = { fontSize: 11, fill: "#64748b" };

/** Spread `energy` kWh across `len` hours starting at `start` (wraps midnight).
    shape "front" decays from plug-in; "flat" is uniform (smart charging). */
function spread(profile: number[], energy: number, start: number, len: number, shape: "front" | "flat") {
  if (energy <= 0 || len <= 0) return;
  const w = Array.from({ length: len }, (_, i) => (shape === "front" ? len - i : 1));
  const sum = w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < len; i++) profile[(start + i) % 24] += (energy * w[i]) / sum;
}

export default function EvChargerMix() {
  const [cars, setCars] = useState(120);
  const [lightTrucks, setLightTrucks] = useState(30);
  const [golfCarts, setGolfCarts] = useState(60);
  const [kmPerDay, setKmPerDay] = useState(90);
  const [dwellHours, setDwellHours] = useState(8);
  const [parkingBays, setParkingBays] = useState(150);
  const [gridLimitKva, setGridLimitKva] = useState(1500);
  const [smartCharging, setSmartCharging] = useState(true);

  const r = useMemo(() => {
    // Daily energy per class
    const carEnergy = cars * kmPerDay * KWH_PER_KM.car;
    const truckEnergy = lightTrucks * kmPerDay * KWH_PER_KM.truck;
    const golfEnergy = golfCarts * Math.min(kmPerDay, 40) * KWH_PER_KM.golf;
    const totalKwh = carEnergy + truckEnergy + golfEnergy;

    // Charger counts
    const golfChargers = Math.ceil(golfCarts / 3); // 3 carts rotate per 3 kW post
    const dcWindow = Math.min(dwellHours, 2); // trucks fast-charge in short windows
    let dcCount = truckEnergy > 0 ? Math.ceil(truckEnergy / (RATING.dc * dcWindow * 0.85)) : 0;
    let acCount = carEnergy > 0 ? Math.ceil(carEnergy / (RATING.ac * dwellHours * 0.9)) : 0;

    // Parking-bay cap: shift surplus AC demand onto DC posts (fewer posts per kWh)
    let bayShift = 0;
    if (acCount + dcCount + golfChargers > parkingBays) {
      const acMax = Math.max(0, parkingBays - dcCount - golfChargers);
      bayShift = acCount - acMax;
      const shiftedEnergy = carEnergy - acMax * RATING.ac * dwellHours * 0.9;
      acCount = acMax;
      if (shiftedEnergy > 0) dcCount += Math.ceil(shiftedEnergy / (RATING.dc * dcWindow * 0.85));
    }
    const totalChargers = acCount + dcCount + golfChargers;

    // Peak demand & grid check
    const simultaneity = smartCharging ? 0.55 : 0.95;
    const installedKw = acCount * RATING.ac + dcCount * RATING.dc + golfChargers * RATING.golf;
    const peakKw = installedKw * simultaneity;
    const gridCapKw = gridLimitKva * 0.9; // at 0.9 PF
    const gridUtil = gridCapKw > 0 ? (peakKw / gridCapKw) * 100 : 0;
    const upgradeNeeded = peakKw > gridCapKw;

    // 24h load profile — smart charging widens windows and flattens the shape
    const ac = new Array(24).fill(0);
    const dc = new Array(24).fill(0);
    const golf = new Array(24).fill(0);
    const acLen = smartCharging ? Math.min(12, dwellHours + 3) : dwellHours;
    spread(ac, carEnergy, 19, acLen, smartCharging ? "flat" : "front"); // overnight AC hump
    spread(dc, truckEnergy * 0.5, smartCharging ? 7 : 8, smartCharging ? 4 : 2, "flat"); // morning
    spread(dc, truckEnergy * 0.5, smartCharging ? 11 : 12, smartCharging ? 5 : 2, "flat"); // midday
    spread(golf, golfEnergy, 21, 9, "flat"); // overnight trickle
    const clamp = (v: number, cap: number) => Math.min(v, cap * 0.95);
    const profileData = Array.from({ length: 24 }, (_, h) => ({
      hour: `${String(h).padStart(2, "0")}:00`,
      ac: +clamp(ac[h], acCount * RATING.ac).toFixed(1),
      dc: +clamp(dc[h], dcCount * RATING.dc).toFixed(1),
      golf: +clamp(golf[h], golfChargers * RATING.golf).toFixed(1),
    }));

    const mixData = [
      { type: "AC 22 kW", count: acCount, fill: "#0369a1" },
      { type: "DC 120 kW", count: dcCount, fill: "#0ea5e9" },
      { type: "Golf 3 kW", count: golfChargers, fill: "#7dd3fc" },
    ];

    let detail = `Grid utilisation ${fmt(gridUtil, 0)}% of ${fmt(gridLimitKva, 0)} kVA @ 0.9 PF — ` +
      (upgradeNeeded
        ? `peak ${fmt(peakKw, 0)} kW exceeds the connection; a grid upgrade or load management is required.`
        : `peak ${fmt(peakKw, 0)} kW fits within the existing connection.`);
    if (bayShift > 0) {
      detail += ` Parking-bay limit hit: ${bayShift} AC posts' demand shifted to DC fast charging (fewer posts).`;
    }
    detail += smartCharging
      ? " Smart charging staggers sessions (0.55 simultaneity), flattening the overnight peak."
      : " Uncontrolled charging assumed (0.95 simultaneity) — enable smart charging to cut peak demand ~42%.";

    return {
      carEnergy, truckEnergy, golfEnergy, totalKwh, acCount, dcCount, golfChargers,
      totalChargers, peakKw, gridCapKw, gridUtil, upgradeNeeded, bayShift,
      profileData, mixData, detail,
    };
  }, [cars, lightTrucks, golfCarts, kmPerDay, dwellHours, parkingBays, gridLimitKva, smartCharging]);

  return (
    <ToolPage
      title="EV Charger Mix Optimiser"
      tagline="Fleet duty-cycle analysis — optimal AC / DC fast / golf-car charger mix and grid check"
      badge="Sizing Models · Mobility"
      accent={ACCENT}
      icon={<Car className="h-5 w-5" />}
    >
      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        <div className="space-y-5">
          <Panel title="Fleet & Duty Cycle" subtitle="Vehicle counts and daily usage">
            <div className="space-y-5">
              <Field label="Cars" value={cars} onChange={setCars}
                min={0} max={500} step={5} unit="veh" accent={ACCENT} />
              <Field label="Light trucks" value={lightTrucks} onChange={setLightTrucks}
                min={0} max={200} unit="veh" accent={ACCENT} />
              <Field label="Golf carts" value={golfCarts} onChange={setGolfCarts}
                min={0} max={300} step={5} unit="veh" accent={ACCENT} />
              <Field label="Average duty" value={kmPerDay} onChange={setKmPerDay}
                min={20} max={300} step={5} unit="km/day" accent={ACCENT}
                hint="Golf carts capped at 40 km/day (30 km typical)" />
              <Field label="Dwell window" value={dwellHours} onChange={setDwellHours}
                min={1} max={12} unit="h" accent={ACCENT}
                hint="Overnight / parked window available for charging" />
            </div>
          </Panel>
          <Panel title="Site Constraints" subtitle="Space and grid connection">
            <div className="space-y-5">
              <Field label="Parking bays" value={parkingBays} onChange={setParkingBays}
                min={5} max={500} step={5} unit="bays" accent={ACCENT} />
              <Field label="Grid connection limit" value={gridLimitKva} onChange={setGridLimitKva}
                min={50} max={5000} step={50} unit="kVA" accent={ACCENT} />
              <ToggleField label="Smart charging (staggered load)" value={smartCharging}
                onChange={setSmartCharging} accent={ACCENT}
                hint="Load management staggers sessions — 0.55 vs 0.95 simultaneity" />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Verdict
            accent={ACCENT}
            title={`${r.acCount}× AC 22 kW + ${r.dcCount}× DC 120 kW + ${r.golfChargers}× golf 3 kW`}
            detail={r.detail}
          />
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Stat label="Fleet energy" value={fmt(r.totalKwh / 1000, 2)} unit="MWh/day" accent={ACCENT}
              sub={`Cars ${fmt(r.carEnergy, 0)} · trucks ${fmt(r.truckEnergy, 0)} · golf ${fmt(r.golfEnergy, 0)} kWh`} />
            <Stat label="Total chargers" value={r.totalChargers.toLocaleString()} unit="posts" accent={ACCENT}
              sub={`${parkingBays} bays available${r.bayShift > 0 ? " · bay-constrained" : ""}`} />
            <Stat label="Peak demand" value={fmt(r.peakKw, 0)} unit="kW" accent={ACCENT}
              sub={`${smartCharging ? "0.55" : "0.95"} simultaneity factor`} />
            <Stat label="Grid utilisation" value={fmt(r.gridUtil, 0)} unit="%" accent={ACCENT}
              sub={r.upgradeNeeded ? "Upgrade required" : `${fmt(r.gridCapKw - r.peakKw, 0)} kW headroom`} />
          </div>

          <Panel title="24h Charging Load Profile" subtitle={`Stacked demand by charger class vs grid limit${smartCharging ? " — smart charging flattens and widens the overnight hump" : ""}`}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={r.profileData} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} interval={2} />
                <YAxis tick={tick} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => v.toLocaleString()}
                  label={{ value: "kW", angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(v: number, name: string) => [`${fmt(v, 0)} kW`, name]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="ac" name="AC 22 kW" stackId="1"
                  stroke="#0369a1" fill="#0369a1" fillOpacity={0.55} strokeWidth={2} />
                <Area type="monotone" dataKey="dc" name="DC 120 kW" stackId="1"
                  stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} strokeWidth={2} />
                <Area type="monotone" dataKey="golf" name="Golf 3 kW" stackId="1"
                  stroke="#7dd3fc" fill="#7dd3fc" fillOpacity={0.6} strokeWidth={2} />
                <ReferenceLine y={r.gridCapKw} stroke="#dc2626" strokeDasharray="4 4"
                  label={{ value: `Grid limit ${fmt(r.gridCapKw, 0)} kW`, position: "insideTopRight", fontSize: 11, fill: "#dc2626" }} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Charger Mix" subtitle="Recommended posts by charger type">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={r.mixData} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
                <YAxis allowDecimals={false} tick={tick} axisLine={false} tickLine={false}
                  label={{ value: "posts", angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(v: number) => [`${v.toLocaleString()} posts`, "Chargers"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="count" name="Chargers" radius={[4, 4, 0, 0]} maxBarSize={96}>
                  {r.mixData.map(d => <Cell key={d.type} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      </div>
    </ToolPage>
  );
}
