import { useMemo, useState } from "react";
import { SunMedium } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from "recharts";
import { ToolPage, Panel, Field, SegmentedField, Stat, Verdict } from "./toolkit";

const ACCENT = "#d97706";

/* Annual GHI presets (kWh/m²/yr) + monthly irradiation weights (summer-peaking,
   normalized at runtime so each site's 12 shares sum to 1). */
const SITES = {
  cairo: { label: "Cairo", ghi: 2000, shape: [70, 74, 88, 95, 102, 106, 107, 103, 94, 85, 72, 66] },
  delta: { label: "Delta", ghi: 1900, shape: [66, 72, 86, 94, 102, 107, 108, 104, 95, 84, 70, 62] },
  upper: { label: "Upper Egypt", ghi: 2300, shape: [74, 78, 90, 96, 102, 105, 106, 102, 94, 86, 76, 70] },
  redsea: { label: "Red Sea coast", ghi: 2200, shape: [72, 76, 89, 95, 101, 105, 106, 103, 94, 85, 74, 68] },
} as const;
type SiteKey = keyof typeof SITES;

/* Area utilisation by mounting type — kWp installable per 1,000 m². */
const MOUNTING = {
  rooftop: { label: "Rooftop", util: 120 },
  ground: { label: "Ground", util: 90 },
  carport: { label: "Carport", util: 100 },
} as const;
type MountKey = keyof typeof MOUNTING;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LIFE_YEARS = 25;
const DEGRADATION_AVG = 0.85; // lifetime-average output factor used in the indicative LCOE
const ANNUAL_DEGRADATION = 0.005; // 0.5 %/yr used in the cash-recovery curve
const GRID_CO2_T_PER_MWH = 0.45;

const fmt = (n: number, d = 1) =>
  n.toLocaleString(undefined, { maximumFractionDigits: d });

export default function PvYield() {
  const [site, setSite] = useState<SiteKey>("cairo");
  const [mounting, setMounting] = useState<MountKey>("rooftop");
  const [availableArea, setAvailableArea] = useState(20000);
  const [shadingLoss, setShadingLoss] = useState(5);
  const [performanceRatio, setPerformanceRatio] = useState(80);
  const [dcAcRatio, setDcAcRatio] = useState(120);
  const [capexPerWp, setCapexPerWp] = useState(0.75);
  const [tariff, setTariff] = useState(0.09);

  const r = useMemo(() => {
    const { ghi, shape } = SITES[site];
    const util = MOUNTING[mounting].util;

    const kWp = (availableArea * util) / 1000;
    // Standard flat-plate approximation: GHI in kWh/m²/yr against 1 kW/m² STC irradiance.
    const specificYield = ghi * (performanceRatio / 100) * (1 - shadingLoss / 100);
    const annualMWh = (kWp * specificYield) / 1000;
    const acKW = kWp / (dcAcRatio / 100);
    const capex = kWp * 1000 * capexPerWp;
    const lcoe = capex / (annualMWh * 1000 * LIFE_YEARS * DEGRADATION_AVG); // $/kWh, indicative
    const annualRevenueY1 = annualMWh * 1000 * tariff;
    const payback = capex / annualRevenueY1;

    const shapeSum = shape.reduce((a, b) => a + b, 0);
    const monthly = MONTHS.map((m, i) => ({
      m,
      mwh: (annualMWh * shape[i]) / shapeSum,
    }));

    const capexM = capex / 1e6;
    let cum = 0;
    const cash = [{ year: 0, recovered: 0 }];
    for (let y = 1; y <= LIFE_YEARS; y++) {
      cum += (annualRevenueY1 * (1 - ANNUAL_DEGRADATION * (y - 1))) / 1e6;
      cash.push({ year: y, recovered: cum });
    }

    return {
      kWp, specificYield, annualMWh, acKW, capex, capexM, lcoe, payback,
      monthly, cash,
      co2Kt: (annualMWh * GRID_CO2_T_PER_MWH) / 1000,
    };
  }, [site, mounting, availableArea, shadingLoss, performanceRatio, dcAcRatio, capexPerWp, tariff]);

  const tick = { fontSize: 11, fill: "#64748b" };

  return (
    <ToolPage
      title="PV Yield & Array Layout"
      tagline="Irradiation, load and roof/land survey → array layout, yield and CAPEX optimisation"
      badge="Sizing Models · Renewables"
      accent={ACCENT}
      icon={<SunMedium className="h-5 w-5" />}
    >
      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        <Panel title="Inputs" subtitle="Site survey, losses and commercial assumptions">
          <div className="space-y-5">
            <SegmentedField
              label={`Site (annual GHI ${SITES[site].ghi.toLocaleString()} kWh/m²/yr)`}
              value={site}
              onChange={(v: SiteKey) => setSite(v)}
              options={(Object.keys(SITES) as SiteKey[]).map(k => ({ value: k, label: SITES[k].label }))}
              accent={ACCENT}
            />
            <SegmentedField
              label={`Mounting (${MOUNTING[mounting].util} kWp / 1,000 m²)`}
              value={mounting}
              onChange={(v: MountKey) => setMounting(v)}
              options={(Object.keys(MOUNTING) as MountKey[]).map(k => ({ value: k, label: MOUNTING[k].label }))}
              accent={ACCENT}
            />
            <Field label="Available area" value={availableArea} onChange={setAvailableArea}
              min={500} max={200000} step={500} unit="m²"
              hint="Usable roof / land footprint after setbacks and access ways" accent={ACCENT} />
            <Field label="Shading loss" value={shadingLoss} onChange={setShadingLoss}
              min={0} max={25} step={1} unit="%"
              hint="Horizon, parapets, adjacent structures" accent={ACCENT} />
            <Field label="Performance ratio" value={performanceRatio} onChange={setPerformanceRatio}
              min={70} max={88} step={1} unit="%"
              hint="Soiling, temperature, wiring and inverter losses" accent={ACCENT} />
            <Field label="DC / AC ratio" value={dcAcRatio} onChange={setDcAcRatio}
              min={100} max={140} step={1} unit="%"
              hint="Array oversizing vs inverter nameplate" accent={ACCENT} />
            <Field label="CAPEX" value={capexPerWp} onChange={setCapexPerWp}
              min={0.55} max={1.1} step={0.01} unit="$/Wp"
              hint="Turnkey EPC including BoS and grid connection" accent={ACCENT} />
            <Field label="Tariff offset" value={tariff} onChange={setTariff}
              min={0.04} max={0.2} step={0.005} unit="$/kWh"
              hint="Blended value of displaced grid energy" accent={ACCENT} />
          </div>
        </Panel>

        <div className="space-y-5">
          <Verdict
            accent={ACCENT}
            title={`${fmt(r.kWp / 1000, 1)} MWp ${MOUNTING[mounting].label} array — ${fmt(r.specificYield, 0)} kWh/kWp/yr`}
            detail={`${fmt(r.acKW / 1000, 1)} MW AC (DC/AC ${fmt(dcAcRatio / 100, 2)}) on ${fmt(availableArea / 10000, 1)} ha at ${SITES[site].label}. Indicative LCOE ${fmt(r.lcoe * 100, 1)} ¢/kWh, simple payback ${r.payback > LIFE_YEARS ? `> ${LIFE_YEARS}` : fmt(r.payback, 1)} yr at ${fmt(tariff * 100, 1)} ¢/kWh.`}
          />

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Stat label="Installed DC" value={fmt(r.kWp / 1000, 2)} unit="MWp"
              sub={`${fmt(r.kWp, 0)} kWp on ${fmt(availableArea, 0)} m²`} accent={ACCENT} big />
            <Stat label="Annual generation" value={fmt(r.annualMWh / 1000, 2)} unit="GWh"
              sub={`${fmt(r.annualMWh, 0)} MWh, year 1`} accent={ACCENT} big />
            <Stat label="Specific yield" value={fmt(r.specificYield, 0)} unit="kWh/kWp"
              sub={`GHI ${SITES[site].ghi.toLocaleString()} · PR ${performanceRatio}% · shading ${shadingLoss}%`} accent={ACCENT} big />
            <Stat label="CAPEX" value={fmt(r.capexM, 2)} unit="M$"
              sub={`${fmt(capexPerWp, 2)} $/Wp turnkey`} accent={ACCENT} big />
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Stat label="LCOE (indicative)" value={fmt(r.lcoe * 100, 2)} unit="¢/kWh"
              sub={`Simple, ${LIFE_YEARS} yr · avg degradation ${DEGRADATION_AVG}`} accent={ACCENT} />
            <Stat label="Simple payback" value={r.payback > LIFE_YEARS ? `>${LIFE_YEARS}` : fmt(r.payback, 1)} unit="yr"
              sub={`vs tariff ${fmt(tariff * 100, 1)} ¢/kWh`} accent={ACCENT} />
            <Stat label="AC capacity" value={fmt(r.acKW / 1000, 2)} unit="MW"
              sub={`DC/AC ratio ${fmt(dcAcRatio / 100, 2)}`} accent={ACCENT} />
            <Stat label="CO₂ avoided" value={fmt(r.co2Kt, 1)} unit="kt/yr"
              sub={`At ${GRID_CO2_T_PER_MWH} tCO₂/MWh grid factor`} accent={ACCENT} />
          </div>

          <Panel title="Monthly generation" subtitle={`Year-1 output by month at ${SITES[site].label} irradiation shape (MWh)`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={r.monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="m" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={56}
                  tickFormatter={(v: number) => v.toLocaleString()} />
                <Tooltip
                  formatter={(v: number) => [`${fmt(v, 0)} MWh`, "Generation"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="mwh" fill={ACCENT} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Cash recovery" subtitle="Cumulative undiscounted energy value vs CAPEX over 25 years (0.5 %/yr degradation)">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={r.cash} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pvCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false}
                  tickFormatter={(v: number) => `Y${v}`} />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={56}
                  tickFormatter={(v: number) => `$${fmt(v, 0)}M`} />
                <Tooltip
                  formatter={(v: number) => [`$${fmt(v, 2)} M`, "Cumulative recovery"]}
                  labelFormatter={(l: number) => `Year ${l}`}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <ReferenceLine y={r.capexM} stroke="#002060" strokeDasharray="6 4"
                  label={{ value: `CAPEX $${fmt(r.capexM, 1)}M — breakeven`, position: "insideTopLeft", fontSize: 11, fill: "#002060" }} />
                <Area type="monotone" dataKey="recovered" stroke={ACCENT} strokeWidth={2}
                  fill="url(#pvCash)" name="Cumulative recovery" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      </div>
    </ToolPage>
  );
}
