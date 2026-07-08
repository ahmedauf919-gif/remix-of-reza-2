import { useMemo, useState } from "react";
import { Flame } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { ToolPage, Panel, Field, SegmentedField, Stat, Verdict } from "./toolkit";

const ACCENT = "#009045";

type PressureClass = "LP" | "MP" | "HP";
type Material = "PE" | "Steel";

const INLET_BAR: Record<PressureClass, number> = { LP: 0.1, MP: 4, HP: 16 };
const EFFICIENCY: Record<Material, number> = { PE: 0.97, Steel: 0.92 };

const DIAMETERS = [63, 90, 125, 160, 200, 250, 315, 400, 500]; // DN, mm
const REGULATOR_CLASSES = [500, 1500, 3000, 6000, 12000, 25000]; // Nm³/h
const SG = 0.6; // natural gas specific gravity vs air
const ATM = 1.013; // bar
const MAX_VELOCITY = 20; // m/s

/* Simplified Spitzglass/Pole-style quadratic form, calibrated for Nm³/h, km, mm:
   Q = 0.0011 · E · sqrt(ΔP_mbar · D⁵ · (P_abs/1.013) / (SG · L_km))
   inverted to ΔP_mbar = SG · L · (Q/0.0011)² / (E² · D⁵ · P_abs/1.013).
   The P_abs/1.013 term credits denser compressed gas with lower drop per
   standard m³ — bigger pipe or higher class → smaller drop (monotonic). */
function pressureDropMbar(qNm3h: number, dnMm: number, lengthKm: number, inletBarG: number, efficiency: number) {
  const pAbsRatio = (inletBarG + ATM) / ATM;
  return (SG * lengthKm * (qNm3h / 0.0011) ** 2) / (efficiency ** 2 * dnMm ** 5 * pAbsRatio);
}

/* Compressed-flow velocity: actual m³/h = standard flow ÷ (P_abs/1.013). */
function gasVelocity(qNm3h: number, dnMm: number, inletBarG: number) {
  const area = (Math.PI / 4) * (dnMm / 1000) ** 2;
  const actualFlow = qNm3h * (ATM / (inletBarG + ATM));
  return actualFlow / (3600 * area);
}

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
} as const;

const fmt = (v: number, dp = 2) =>
  v.toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp });

export default function GasNetwork() {
  const [flow, setFlow] = useState(2000);
  const [pressureClass, setPressureClass] = useState<PressureClass>("MP");
  const [length, setLength] = useState(3);
  const [allowableDrop, setAllowableDrop] = useState(10);
  const [material, setMaterial] = useState<Material>("PE");
  const [designMargin, setDesignMargin] = useState(10);

  const r = useMemo(() => {
    const inlet = INLET_BAR[pressureClass];
    const eff = EFFICIENCY[material];
    const designFlow = flow * (1 + designMargin / 100);
    const allowMbar = (allowableDrop / 100) * inlet * 1000;

    const candidates = DIAMETERS.map(dn => {
      const dropMbar = pressureDropMbar(designFlow, dn, length, inlet, eff);
      const velocity = gasVelocity(designFlow, dn, inlet);
      return {
        dn,
        dropMbar,
        dropPct: (dropMbar / (inlet * 1000)) * 100,
        velocity,
        ok: dropMbar <= allowMbar && velocity <= MAX_VELOCITY,
      };
    });
    const selected = candidates.find(c => c.ok) ?? null;

    const regCapacity = designFlow * 1.2;
    const regClass = REGULATOR_CLASSES.find(c => c >= regCapacity) ?? null;

    const dropBar = (selected ?? candidates[candidates.length - 1]).dropMbar / 1000;
    const profile = Array.from({ length: 13 }, (_, i) => ({
      km: (i / 12) * length,
      pressure: inlet - dropBar * (i / 12),
    }));

    return { inlet, designFlow, allowMbar, candidates, selected, regCapacity, regClass, dropBar, profile };
  }, [flow, pressureClass, length, allowableDrop, material, designMargin]);

  const minAllowed = r.inlet - r.allowMbar / 1000;
  const regText = r.regClass
    ? `${r.regClass.toLocaleString()} Nm³/h`
    : `2 × ${REGULATOR_CLASSES[REGULATOR_CLASSES.length - 1].toLocaleString()} Nm³/h (parallel)`;

  return (
    <ToolPage
      title="Gas Network Engineering"
      tagline="Distribution grid pressure drop, pipe sizing & regulator capacity"
      badge="Sizing Models · Gas"
      accent={ACCENT}
      icon={<Flame className="h-5 w-5" />}
    >
      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        <div className="space-y-5">
          <Panel title="Inputs" subtitle="Hydraulic design parameters">
            <div className="space-y-5">
              <Field
                label="Peak network flow"
                value={flow}
                onChange={setFlow}
                min={50}
                max={20000}
                step={50}
                unit="Nm³/h"
                hint="Coincident peak at the offtake"
                accent={ACCENT}
              />
              <SegmentedField
                label="Pressure class"
                value={pressureClass}
                onChange={setPressureClass}
                options={[
                  { value: "LP", label: "LP · 0.1 bar" },
                  { value: "MP", label: "MP · 4 bar" },
                  { value: "HP", label: "HP · 16 bar" },
                ]}
                accent={ACCENT}
              />
              <Field
                label="Route length"
                value={length}
                onChange={setLength}
                min={0.1}
                max={15}
                step={0.1}
                unit="km"
                accent={ACCENT}
              />
              <Field
                label="Allowable pressure drop"
                value={allowableDrop}
                onChange={setAllowableDrop}
                min={2}
                max={20}
                unit="% of inlet"
                hint="End-of-line pressure floor for burners/regulators"
                accent={ACCENT}
              />
              <SegmentedField
                label="Pipe material"
                value={material}
                onChange={setMaterial}
                options={[
                  { value: "PE", label: "PE (E = 0.97)" },
                  { value: "Steel", label: "Steel (E = 0.92)" },
                ]}
                accent={ACCENT}
              />
              <Field
                label="Design margin"
                value={designMargin}
                onChange={setDesignMargin}
                min={0}
                max={30}
                unit="%"
                hint="Flow uplift on top of the metered peak"
                accent={ACCENT}
              />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Verdict
            accent={ACCENT}
            title={
              r.selected
                ? `DN${r.selected.dn} ${material} main + ${regText} district regulator`
                : "No standard DN satisfies the limits"
            }
            detail={
              r.selected
                ? `Design flow ${Math.round(r.designFlow).toLocaleString()} Nm³/h over ${fmt(length, 1)} km at ${pressureClass} (${fmt(r.inlet, 1)} bar): drop ${fmt(r.selected.dropMbar / 1000, 3)} bar (${fmt(r.selected.dropPct, 1)}% ≤ ${allowableDrop}%), velocity ${fmt(r.selected.velocity, 1)} m/s ≤ ${MAX_VELOCITY} m/s. Regulator sized at design flow × 1.2 = ${Math.round(r.regCapacity).toLocaleString()} Nm³/h.`
                : `Even DN${DIAMETERS[DIAMETERS.length - 1]} exceeds the ${allowableDrop}% drop or ${MAX_VELOCITY} m/s velocity limit — raise the pressure class, shorten the route, or split the network into parallel feeders.`
            }
          />

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Stat
              label="Selected pipe"
              value={r.selected ? `DN${r.selected.dn}` : "—"}
              unit={r.selected ? "mm" : undefined}
              sub={r.selected ? `${material} main, smallest passing size` : "Out of standard range"}
              accent={ACCENT}
            />
            <Stat
              label="Pressure drop"
              value={r.selected ? fmt(r.selected.dropMbar / 1000, 3) : "—"}
              unit="bar"
              sub={r.selected ? `${fmt(r.selected.dropPct, 1)}% of ${fmt(r.inlet, 1)} bar inlet` : `Limit ${allowableDrop}% of inlet`}
              accent={ACCENT}
            />
            <Stat
              label="Gas velocity"
              value={r.selected ? fmt(r.selected.velocity, 1) : "—"}
              unit="m/s"
              sub={`Pressure-corrected · limit ${MAX_VELOCITY} m/s`}
              accent={ACCENT}
            />
            <Stat
              label="Regulator class"
              value={r.regClass ? r.regClass.toLocaleString() : "2 × 25,000"}
              unit="Nm³/h"
              sub={`Duty ${Math.round(r.regCapacity).toLocaleString()} Nm³/h incl. 1.2 safety`}
              accent={ACCENT}
            />
          </div>

          <Panel title="Pressure profile along route" subtitle={`Linear decay from ${fmt(r.inlet, 1)} bar inlet using the ${r.selected ? `DN${r.selected.dn}` : "largest DN"} drop`}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={r.profile} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="km"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={v => `${fmt(v, 1)} km`}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    domain={[Math.min(minAllowed, r.inlet - r.dropBar) * 0.995, r.inlet * 1.002]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={v => fmt(v, r.inlet < 1 ? 3 : 2)}
                    tickLine={false}
                    axisLine={false}
                    width={56}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`${fmt(v, 3)} bar`, "Line pressure"]}
                    labelFormatter={km => `${fmt(Number(km), 2)} km from offtake`}
                  />
                  <ReferenceLine
                    y={minAllowed}
                    stroke="#dc2626"
                    strokeDasharray="4 4"
                    label={{
                      value: `Min allowed ${fmt(minAllowed, r.inlet < 1 ? 3 : 2)} bar`,
                      position: "insideBottomLeft",
                      fontSize: 11,
                      fill: "#dc2626",
                    }}
                  />
                  <Line type="monotone" dataKey="pressure" stroke={ACCENT} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Sizing frontier" subtitle="Pressure drop (% of inlet) for each candidate DN — smallest compliant size wins">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={r.candidates.map(c => ({ ...c, plotPct: Math.min(c.dropPct, 100) }))}
                  margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="dn"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={dn => `DN${dn}`}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={v => `${v}%`}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "rgba(148,163,184,0.08)" }}
                    formatter={(_v: number, _n, entry) => {
                      const c = entry?.payload;
                      return [
                        `${fmt(c.dropPct, 1)}% (${fmt(c.dropMbar / 1000, 3)} bar) · ${fmt(c.velocity, 1)} m/s ${c.ok ? "· compliant" : "· violates limits"}`,
                        `DN${c.dn}`,
                      ];
                    }}
                    labelFormatter={() => ""}
                  />
                  <ReferenceLine
                    y={allowableDrop}
                    stroke="#334155"
                    strokeDasharray="4 4"
                    label={{ value: `Limit ${allowableDrop}%`, position: "insideTopRight", fontSize: 11, fill: "#334155" }}
                  />
                  <Bar dataKey="plotPct" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    {r.candidates.map(c => (
                      <Cell
                        key={c.dn}
                        fill={
                          r.selected && c.dn === r.selected.dn
                            ? ACCENT
                            : c.ok
                              ? "#e2e8f0"
                              : "rgba(220,38,38,0.3)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[12px] text-slate-500 mt-2">
              Bars above 100% are clipped for readability (hover for exact values). Red bars violate the drop or velocity limit; the green bar is the selected size.
            </p>
          </Panel>
        </div>
      </div>
    </ToolPage>
  );
}
