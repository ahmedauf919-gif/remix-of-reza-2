import { useMemo, useState } from "react";
import { Battery } from "lucide-react";
import {
  ResponsiveContainer, ComposedChart, AreaChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";
import { ToolPage, Panel, Field, SegmentedField, Stat, Verdict } from "./toolkit";

const ACCENT = "#7B35C2";
const LOAD_COLOR = "#64748b";

/* Normalized 24-h demand shape (0–1), evening-peaking 18:00–22:00. */
const DAY_SHAPE = [
  0.15, 0.12, 0.10, 0.10, 0.12, 0.18, 0.28, 0.40, 0.52, 0.60, 0.65, 0.68,
  0.70, 0.68, 0.66, 0.68, 0.75, 0.88, 1.00, 0.98, 0.92, 0.78, 0.50, 0.28,
];
const CONTAINER_MWH = 3.7; // 20-ft liquid-cooled container
const OPERATING_DAYS = 300;

const USE_CASES = {
  shaving: { label: "Peak Shaving" },
  firming: { label: "Solar Firming" },
  backup: { label: "Backup" },
} as const;
type UseCase = keyof typeof USE_CASES;

const fmt = (n: number, d = 1) =>
  n.toLocaleString(undefined, { maximumFractionDigits: d });
const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

export default function BessSizing() {
  const [peakLoad, setPeakLoad] = useState(10);
  const [baseLoad, setBaseLoad] = useState(4);
  const [useCase, setUseCase] = useState<UseCase>("shaving");
  const [shaveTarget, setShaveTarget] = useState(20);
  const [solarMWp, setSolarMWp] = useState(8);
  const [firmingHours, setFirmingHours] = useState(3);
  const [backupHours, setBackupHours] = useState(2);
  const [dod, setDod] = useState(90);
  const [roundTrip, setRoundTrip] = useState(88);
  const [cRate, setCRate] = useState(0.5);
  const [tariffPeak, setTariffPeak] = useState(0.16);
  const [tariffOffpeak, setTariffOffpeak] = useState(0.06);

  const r = useMemo(() => {
    const base = Math.min(baseLoad, peakLoad * 0.95);
    const dodF = dod / 100;
    const rtF = roundTrip / 100;
    const load = DAY_SHAPE.map(s => base + (peakLoad - base) * s);

    let requiredMW = 0;
    let nameplateMWh = 0;
    let shavedPerDay = 0; // MWh delivered/day (shaving)
    const threshold = peakLoad * (1 - shaveTarget / 100);

    if (useCase === "shaving") {
      requiredMW = peakLoad * (shaveTarget / 100);
      shavedPerDay = load.reduce((a, l) => a + Math.max(0, l - threshold), 0); // hourly integral
      nameplateMWh = shavedPerDay / rtF / dodF;
    } else if (useCase === "firming") {
      requiredMW = solarMWp * 0.7;
      nameplateMWh = (solarMWp * 0.85 * firmingHours) / dodF / rtF;
    } else {
      requiredMW = peakLoad;
      nameplateMWh = (peakLoad * backupHours) / dodF;
    }

    // C-rate check: inverter rating is the greater of duty power and battery capability.
    const cRatePower = cRate * nameplateMWh;
    const powerMW = Math.max(requiredMW, cRatePower);
    const cRateGoverned = cRatePower > requiredMW;
    const usableMWh = nameplateMWh * dodF;
    const containers = Math.max(1, Math.ceil(nameplateMWh / CONTAINER_MWH));

    // Annual savings — energy shifted from peak to off-peak tariff.
    const dailyShiftMWh =
      useCase === "shaving" ? shavedPerDay :
      useCase === "firming" ? requiredMW * firmingHours : 0;
    const savingsK = useCase === "backup"
      ? null
      : dailyShiftMWh * (tariffPeak - tariffOffpeak) * OPERATING_DAYS; // MWh × $/kWh × 1000 / 1000

    // 24-h dispatch: load after BESS + state of charge (% of nameplate).
    const socMin = 100 - dod;
    const after: number[] = [];
    const soc: number[] = [];
    if (useCase === "shaving") {
      const usableDrawn = shavedPerDay / rtF; // usable energy cycled per day
      const chargeMW = usableDrawn / 7; // recharge 00:00–07:00
      let s = socMin;
      for (let h = 0; h < 24; h++) {
        const discharge = Math.max(0, load[h] - threshold);
        if (h < 7) {
          s = Math.min(100, s + (dod / 7));
          after.push(load[h] + chargeMW * rtF);
        } else {
          s = Math.max(socMin, s - (discharge / rtF / nameplateMWh) * 100);
          after.push(Math.min(load[h], threshold));
        }
        soc.push(s);
      }
    } else if (useCase === "firming") {
      const start = 18;
      const end = Math.min(24, start + firmingHours);
      let s = socMin;
      for (let h = 0; h < 24; h++) {
        if (h >= 9 && h < 16) s = Math.min(100, s + dod / 7); // solar charging window
        if (h >= start && h < end) {
          s = Math.max(socMin, s - dod / firmingHours);
          after.push(Math.max(0, load[h] - requiredMW));
        } else {
          after.push(load[h]);
        }
        soc.push(s);
      }
    } else {
      for (let h = 0; h < 24; h++) {
        after.push(load[h]); // standby — full charge held for outage ride-through
        soc.push(100);
      }
    }

    const dispatch = load.map((l, h) => ({
      h: hh(h), load: l, after: after[h], soc: soc[h],
    }));

    return {
      base, load, threshold, requiredMW, powerMW, cRateGoverned, nameplateMWh,
      usableMWh, containers, shavedPerDay, savingsK, dispatch,
      durationH: powerMW > 0 ? nameplateMWh / powerMW : 0,
    };
  }, [peakLoad, baseLoad, useCase, shaveTarget, solarMWp, firmingHours, backupHours, dod, roundTrip, cRate, tariffPeak, tariffOffpeak]);

  const tick = { fontSize: 11, fill: "#64748b" };
  const dim = (active: boolean) => (active ? "space-y-5" : "space-y-5 opacity-40");
  const detail =
    useCase === "shaving"
      ? `Peak shaving ${shaveTarget}% of ${fmt(peakLoad, 1)} MW peak — clip to ${fmt(r.threshold, 1)} MW, cycling ${fmt(r.shavedPerDay, 1)} MWh/day (usable ${fmt(r.usableMWh, 1)} MWh at ${dod}% DoD).`
      : useCase === "firming"
        ? `Firming ${fmt(solarMWp, 1)} MWp of solar for ${firmingHours} h into the evening peak at ${fmt(r.requiredMW, 1)} MW (usable ${fmt(r.usableMWh, 1)} MWh at ${dod}% DoD).`
        : `Full-load backup of ${fmt(peakLoad, 1)} MW for ${fmt(backupHours, 1)} h ride-through (usable ${fmt(r.usableMWh, 1)} MWh at ${dod}% DoD).`;

  return (
    <ToolPage
      title="BESS Sizing & Use-Case Configurator"
      tagline="Battery sizing and use-case configuration from peak profile and tariff analysis"
      badge="Sizing Models · Storage"
      accent={ACCENT}
      icon={<Battery className="h-5 w-5" />}
    >
      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        <div className="space-y-5">
          <Panel title="Load & Use Case" subtitle="Site demand profile and BESS duty">
            <div className="space-y-5">
              <Field label="Peak load" value={peakLoad} onChange={setPeakLoad}
                min={0.5} max={50} step={0.1} unit="MW" accent={ACCENT} />
              <Field label="Base load" value={baseLoad} onChange={setBaseLoad}
                min={0.2} max={40} step={0.1} unit="MW"
                hint={baseLoad > peakLoad * 0.95 ? `Clamped to ${fmt(r.base, 1)} MW (95% of peak)` : "Overnight minimum demand"}
                accent={ACCENT} />
              <SegmentedField label="Use case" value={useCase} onChange={(v: UseCase) => setUseCase(v)}
                options={(Object.keys(USE_CASES) as UseCase[]).map(k => ({ value: k, label: USE_CASES[k].label }))}
                accent={ACCENT} />
              <div className={dim(useCase === "shaving")}>
                <Field label="Shave target" value={shaveTarget} onChange={setShaveTarget}
                  min={5} max={40} step={1} unit="% of peak"
                  hint="Peak Shaving — demand clipped below this threshold" accent={ACCENT} />
              </div>
              <div className={dim(useCase === "firming")}>
                <Field label="Solar plant size" value={solarMWp} onChange={setSolarMWp}
                  min={0.5} max={50} step={0.5} unit="MWp"
                  hint="Solar Firming — coupled PV array" accent={ACCENT} />
                <Field label="Firming duration" value={firmingHours} onChange={setFirmingHours}
                  min={1} max={8} step={1} unit="h"
                  hint="Solar Firming — evening dispatch window" accent={ACCENT} />
              </div>
              <div className={dim(useCase === "backup")}>
                <Field label="Backup duration" value={backupHours} onChange={setBackupHours}
                  min={0.5} max={8} step={0.5} unit="h"
                  hint="Backup — full-load ride-through time" accent={ACCENT} />
              </div>
            </div>
          </Panel>

          <Panel title="Battery Parameters" subtitle="Cell chemistry and inverter limits">
            <div className="space-y-5">
              <Field label="Depth of discharge" value={dod} onChange={setDod}
                min={70} max={95} step={1} unit="%"
                hint="Usable window of nameplate capacity" accent={ACCENT} />
              <Field label="Round-trip efficiency" value={roundTrip} onChange={setRoundTrip}
                min={80} max={95} step={1} unit="%"
                hint="AC-to-AC including PCS and auxiliaries" accent={ACCENT} />
              <Field label="C-rate" value={cRate} onChange={setCRate}
                min={0.25} max={1} step={0.05} unit="C"
                hint="Maximum continuous discharge rate" accent={ACCENT} />
            </div>
          </Panel>

          <Panel title="Tariff" subtitle="Peak / off-peak spread drives arbitrage value">
            <div className={dim(useCase !== "backup")}>
              <Field label="Peak tariff" value={tariffPeak} onChange={setTariffPeak}
                min={0.02} max={0.3} step={0.005} unit="$/kWh" accent={ACCENT} />
              <Field label="Off-peak tariff" value={tariffOffpeak} onChange={setTariffOffpeak}
                min={0.02} max={0.3} step={0.005} unit="$/kWh" accent={ACCENT} />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Verdict
            accent={ACCENT}
            title={`${fmt(r.nameplateMWh, 1)} MWh / ${fmt(r.powerMW, 1)} MW BESS — ${r.containers}× 20-ft containers`}
            detail={detail}
          />

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Stat label="Nameplate energy" value={fmt(r.nameplateMWh, 1)} unit="MWh"
              sub={`${fmt(r.usableMWh, 1)} MWh usable at ${dod}% DoD`} accent={ACCENT} big />
            <Stat label="Power rating" value={fmt(r.powerMW, 1)} unit="MW"
              sub={r.cRateGoverned
                ? `C-rate governed (${fmt(cRate, 2)} C × ${fmt(r.nameplateMWh, 1)} MWh)`
                : `Duty requires ${fmt(r.requiredMW, 1)} MW · ${fmt(r.durationH, 1)} h duration`}
              accent={ACCENT} big />
            <Stat label="Containers" value={String(r.containers)} unit="× 20-ft"
              sub={`${CONTAINER_MWH} MWh per container`} accent={ACCENT} big />
            <Stat label="Annual savings" value={r.savingsK === null ? "—" : fmt(r.savingsK, 0)}
              unit={r.savingsK === null ? undefined : "k$"}
              sub={r.savingsK === null
                ? "Backup — resilience value, no arbitrage"
                : `${fmt(tariffPeak - tariffOffpeak, 3)} $/kWh spread × ${OPERATING_DAYS} d`}
              accent={ACCENT} big />
          </div>

          <Panel title="24-hour dispatch" subtitle="Synthetic load profile vs load after BESS (MW)">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={r.dispatch} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} interval={2} />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={48}
                  tickFormatter={(v: number) => fmt(v, 0)} />
                <Tooltip
                  formatter={(v: number, name: string) => [`${fmt(v, 2)} MW`, name]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="load" name="Original load" stroke={LOAD_COLOR}
                  strokeWidth={2} fill={LOAD_COLOR} fillOpacity={0.15} />
                <Line type="monotone" dataKey="after" name="Load after BESS" stroke={ACCENT}
                  strokeWidth={2.5} dot={false} />
                {useCase === "shaving" && (
                  <ReferenceLine y={r.threshold} stroke={ACCENT} strokeDasharray="6 4"
                    label={{ value: `Shave threshold ${fmt(r.threshold, 1)} MW`, position: "insideTopRight", fontSize: 11, fill: ACCENT }} />
                )}
                {useCase === "backup" && (
                  <ReferenceLine y={peakLoad} stroke="#002060" strokeDasharray="6 4"
                    label={{ value: `Peak ${fmt(peakLoad, 1)} MW — backup rating`, position: "insideTopRight", fontSize: 11, fill: "#002060" }} />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Battery state of charge" subtitle="SoC across the day, consistent with the dispatch above (% of nameplate)">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={r.dispatch} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="bessSoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} interval={2} />
                <YAxis domain={[0, 100]} tick={tick} axisLine={false} tickLine={false} width={48}
                  tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  formatter={(v: number) => [`${fmt(v, 0)} %`, "State of charge"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <ReferenceLine y={100 - dod} stroke="#94a3b8" strokeDasharray="6 4"
                  label={{ value: `DoD floor ${100 - dod}%`, position: "insideBottomRight", fontSize: 11, fill: "#64748b" }} />
                <Area type="monotone" dataKey="soc" name="State of charge" stroke={ACCENT}
                  strokeWidth={2} fill="url(#bessSoc)" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      </div>
    </ToolPage>
  );
}
