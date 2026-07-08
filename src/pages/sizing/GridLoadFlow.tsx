import { useMemo, useState } from "react";
import { Zap } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";
import { ToolPage, Panel, Field, SegmentedField, ToggleField, Stat, Verdict } from "./toolkit";

const ACCENT = "#1d4ed8";

type Voltage = "11" | "66" | "220" | "500";

/** Evacuation limit per voltage level (MW, indicative single-circuit planning figures). */
const EVAC_LIMIT: Record<Voltage, number> = { "11": 20, "66": 90, "220": 400, "500": 1500 };
/** Line loss factor %/km at full utilisation. */
const LOSS_FACTOR: Record<Voltage, number> = { "11": 0.3, "66": 0.08, "220": 0.025, "500": 0.008 };
/** Standard transformer unit ratings (MVA). */
const TX_SIZES = [25, 40, 75, 125, 175, 250, 500];

const VOLTAGES: Voltage[] = ["11", "66", "220", "500"];

const fmt = (n: number, d = 1) =>
  n.toLocaleString(undefined, { maximumFractionDigits: d });

const tick = { fontSize: 11, fill: "#64748b" };

function pickTransformers(mva: number, n1: boolean) {
  let best: { unit: number; count: number; installed: number } | null = null;
  for (const unit of TX_SIZES) {
    const firm = Math.max(1, Math.ceil(mva / unit));
    let count = firm + (n1 ? 1 : 0);
    if (n1) count = Math.max(2, count);
    if (count > 6 && unit !== TX_SIZES[TX_SIZES.length - 1]) continue;
    const installed = count * unit;
    if (
      !best ||
      installed < best.installed ||
      (installed === best.installed && count < best.count)
    ) {
      best = { unit, count, installed };
    }
  }
  return best!;
}

export default function GridLoadFlow() {
  const [connectedLoad, setConnectedLoad] = useState(150);
  const [demandFactor, setDemandFactor] = useState(75);
  const [powerFactor, setPowerFactor] = useState(0.92);
  const [distanceKm, setDistanceKm] = useState(25);
  const [voltage, setVoltage] = useState<Voltage>("220");
  const [growthPct, setGrowthPct] = useState(20);
  const [n1Redundancy, setN1Redundancy] = useState(true);

  const r = useMemo(() => {
    const peakMW = connectedLoad * (demandFactor / 100);
    const designMW = peakMW * (1 + growthPct / 100);
    const mva = designMW / powerFactor;

    const tx = pickTransformers(mva, n1Redundancy);

    const limit = EVAC_LIMIT[voltage];
    const utilisation = (designMW / limit) * 100;
    const lossesPct = LOSS_FACTOR[voltage] * distanceKm * (designMW / limit);
    const vDropPct = lossesPct * 1.4;

    const constrained = utilisation > 85;

    // Evacuation headroom across all four voltage levels
    const headroomData = VOLTAGES.map(v => ({
      name: `${v} kV`,
      limit: EVAC_LIMIT[v],
      selected: v === voltage,
    }));

    // Distance sweep at current settings: losses & utilisation
    const sweepData = Array.from({ length: 21 }, (_, i) => {
      const km = i * 5;
      return {
        km,
        losses: +(LOSS_FACTOR[voltage] * km * (designMW / limit)).toFixed(3),
        utilisation: +utilisation.toFixed(1),
      };
    });

    // Verdict guidance
    let detail = constrained
      ? `Utilisation >85% — evacuation constrained; consider next voltage level. `
      : `Evacuation headroom of ${fmt(limit - designMW, 0)} MW at ${voltage} kV. `;
    if (designMW > 300) {
      const u220 = (designMW / EVAC_LIMIT["220"]) * 100;
      const u500 = (designMW / EVAC_LIMIT["500"]) * 100;
      detail += `At ${fmt(designMW, 0)} MW design load, 220 kV runs at ${fmt(u220, 0)}% vs ${fmt(u500, 0)}% on 500 kV — ${
        u220 > 85 ? "500 kV evacuation is the robust choice." : "220 kV remains workable but 500 kV preserves growth headroom."
      } `;
    }
    detail += n1Redundancy
      ? `Bank keeps ${tx.count - 1}×${tx.unit} MVA firm capacity with one unit out (N-1).`
      : `No N-1 margin — a single transformer outage sheds load.`;

    return {
      peakMW, designMW, mva, tx, limit, utilisation, lossesPct, vDropPct,
      constrained, headroomData, sweepData, detail,
    };
  }, [connectedLoad, demandFactor, powerFactor, distanceKm, voltage, growthPct, n1Redundancy]);

  return (
    <ToolPage
      title="Grid Load Flow & Interconnection"
      tagline="Load studies from EHV evacuation down to MV/LV — transformer banks, losses and voltage drop"
      badge="Sizing Models · Power"
      accent={ACCENT}
      icon={<Zap className="h-5 w-5" />}
    >
      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        <div className="space-y-5">
          <Panel title="Load & Growth" subtitle="Connected load and 10-year planning horizon">
            <div className="space-y-5">
              <Field label="Connected load" value={connectedLoad} onChange={setConnectedLoad}
                min={5} max={1000} step={5} unit="MW" accent={ACCENT}
                hint="Sum of all connected consumer load at the point of interconnection" />
              <Field label="Demand factor" value={demandFactor} onChange={setDemandFactor}
                min={50} max={95} unit="%" accent={ACCENT}
                hint="Coincident peak as a share of connected load" />
              <Field label="Power factor" value={powerFactor} onChange={setPowerFactor}
                min={0.8} max={0.98} step={0.01} accent={ACCENT}
                hint="At the metering point after compensation" />
              <Field label="10-yr load growth" value={growthPct} onChange={setGrowthPct}
                min={0} max={60} unit="%" accent={ACCENT} />
            </div>
          </Panel>
          <Panel title="Interconnection" subtitle="Evacuation voltage and line route">
            <div className="space-y-5">
              <SegmentedField label="Interconnection voltage" value={voltage} onChange={setVoltage}
                accent={ACCENT}
                options={VOLTAGES.map(v => ({ value: v, label: `${v} kV` }))} />
              <Field label="Line distance to substation" value={distanceKm} onChange={setDistanceKm}
                min={1} max={100} unit="km" accent={ACCENT} />
              <ToggleField label="N-1 transformer redundancy" value={n1Redundancy}
                onChange={setN1Redundancy} accent={ACCENT}
                hint="Full firm capacity with any single transformer out of service" />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Verdict
            accent={ACCENT}
            title={`${r.tx.count}× ${r.tx.unit} MVA @ ${voltage} kV — utilisation ${fmt(r.utilisation, 0)}%`}
            detail={r.detail}
          />
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Stat label="Peak demand" value={fmt(r.mva, 1)} unit="MVA" accent={ACCENT}
              sub={`${fmt(r.designMW, 1)} MW design incl. growth`} />
            <Stat label="Transformer bank" value={`${r.tx.count}×${r.tx.unit}`} unit="MVA" accent={ACCENT}
              sub={`${fmt(r.tx.installed, 0)} MVA installed${n1Redundancy ? " · N-1" : ""}`} />
            <Stat label="Line losses" value={fmt(r.lossesPct, 2)} unit="%" accent={ACCENT}
              sub={`${fmt(distanceKm, 0)} km at ${voltage} kV`} />
            <Stat label="Voltage drop" value={fmt(r.vDropPct, 2)} unit="%" accent={ACCENT}
              sub="Indicative, ≈1.4× loss ratio" />
          </div>

          <Panel title="Evacuation Headroom" subtitle={`Capacity limit per voltage level vs ${fmt(r.designMW, 0)} MW design load — compare 220 kV vs 500 kV`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={r.headroomData} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => v.toLocaleString()}
                  label={{ value: "MW", angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(v: number) => [`${v.toLocaleString()} MW`, "Evacuation limit"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="limit" name="Evacuation limit" radius={[4, 4, 0, 0]} maxBarSize={72}>
                  {r.headroomData.map(d => (
                    <Cell key={d.name} fill={d.selected ? ACCENT : "#e2e8f0"} />
                  ))}
                </Bar>
                <ReferenceLine y={r.designMW} stroke="#0f172a" strokeDasharray="4 4"
                  label={{ value: `Design ${fmt(r.designMW, 0)} MW`, position: "insideTopRight", fontSize: 11, fill: "#0f172a" }} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Losses & Utilisation vs Distance" subtitle={`0–100 km sweep at ${voltage} kV with current load settings`}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={r.sweepData} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="km" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false}
                  label={{ value: "km", position: "insideBottomRight", offset: -2, fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={tick} axisLine={false} tickLine={false}
                  label={{ value: "%", angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(v: number, name: string) => [`${fmt(v, 2)} %`, name]}
                  labelFormatter={(km: number) => `${km} km`}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine x={distanceKm} stroke="#94a3b8" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="losses" name="Line losses %" stroke={ACCENT}
                  strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="utilisation" name="Corridor utilisation %" stroke="#64748b"
                  strokeWidth={2} strokeDasharray="6 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      </div>
    </ToolPage>
  );
}
