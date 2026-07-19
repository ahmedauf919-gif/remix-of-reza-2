import { useMemo, useRef, useState } from "react";
import { SunMedium, ImageDown, Loader2 } from "lucide-react";
import {
  ResponsiveContainer, ComposedChart, AreaChart, LineChart, Bar, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";
import { ToolPage, Panel, Field, SegmentedField, Stat, Verdict } from "./toolkit";
import { PvSlideExport, type PvSlideData } from "./PvSlideExport";

const EXPORT_ID = "pv-export-slide-capture";

const ACCENT = "#d97706";
const CUMULATIVE = "#005298"; // house blue for the cumulative line — CVD-safe next to the amber bars

/* TAQA Excel model — fixed assumptions */
const HORIZON = 25; // years
const CO2_T_PER_KWH = 0.0004; // tonnes CO₂ avoided per kWh generated

/* Mounting → land use density (m² of site per kW installed) */
const MOUNTING = {
  tracker: { label: "Tracker", density: 14.63 },
  fixed: { label: "Fixed", density: 6.98 },
} as const;
type MountKey = keyof typeof MOUNTING;

/* Grid connection voltage → government tariff (EGP/kWh) */
const VOLTAGE = {
  ehv: { label: "EHV", tariff: 1.89 },
  hv: { label: "HV", tariff: 2.0 },
  mv: { label: "MV", tariff: 2.5 },
  lv: { label: "LV", tariff: 2.74 },
} as const;
type VoltKey = keyof typeof VOLTAGE;

/* Government tariff escalation, years 2–4 (fixed Excel assumptions, %/yr).
   Year 1 pays today's tariff; year 5 onward uses the long-run slider. */
const EARLY_ESCALATION = [25, 15, 10];

const fmt = (n: number, d = 1) =>
  n.toLocaleString(undefined, { maximumFractionDigits: d });
const fmtM = (n: number, d = 2) =>
  (n / 1e6).toLocaleString(undefined, { maximumFractionDigits: d });

export default function PvYield() {
  const [area, setArea] = useState(195000);
  const [mounting, setMounting] = useState<MountKey>("tracker");
  const [specificYield, setSpecificYield] = useState(1800);
  const [voltage, setVoltage] = useState<VoltKey>("hv");
  const [discountPct, setDiscountPct] = useState(10);
  const [waccPct, setWaccPct] = useState(20);
  const [longRunEsc, setLongRunEsc] = useState(6);
  const [exporting, setExporting] = useState(false);

  const r = useMemo(() => {
    const density = MOUNTING[mounting].density;
    const govTariff = VOLTAGE[voltage].tariff;
    const kWp = area / density;
    const energyKWh = kWp * specificYield; // kWh/yr, flat — no degradation (matches Excel)
    const wacc = waccPct / 100;

    const years: {
      year: number; tariff: number; savings: number; savingsM: number;
      cumM: number; discCumM: number; perM2: number;
    }[] = [];
    let tariff = govTariff;
    let cum = 0;
    let discCum = 0;
    for (let y = 1; y <= HORIZON; y++) {
      const esc = y === 1 ? 0 : y <= 4 ? EARLY_ESCALATION[y - 2] : longRunEsc;
      tariff *= 1 + esc / 100;
      const savings = energyKWh * tariff * (discountPct / 100);
      cum += savings;
      discCum += savings / Math.pow(1 + wacc, y); // Excel NPV(): year 1 discounted once
      years.push({
        year: y,
        tariff,
        savings,
        savingsM: savings / 1e6,
        cumM: cum / 1e6,
        discCumM: discCum / 1e6,
        perM2: savings / area,
      });
    }

    const co2PerYr = energyKWh * CO2_T_PER_KWH;
    return {
      kWp,
      energyKWh,
      govTariff,
      years,
      savingsY1: years[0].savings,
      perM2Y1: years[0].perM2,
      pureSavings: cum,
      npv: discCum,
      co2PerYr,
      co2Lifetime: co2PerYr * HORIZON,
    };
  }, [area, mounting, specificYield, voltage, discountPct, waccPct, longRunEsc]);

  const tick = { fontSize: 11, fill: "#64748b" };
  const tooltipStyle = { fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" } as const;

  const slideData: PvSlideData = {
    headline: "Turning Idle Roof Space Into 25 Years of Savings",
    intro: `By hosting a ${fmt(r.kWp, 0)} kWp PV plant across ${fmt(area, 0)} m² of rooftop and adjacent land, TAQA delivers electricity at a guaranteed ${discountPct}% discount to the ${VOLTAGE[voltage].label} government tariff of EGP ${r.govTariff.toFixed(2)}/kWh — funded, built and operated end-to-end, with zero disruption to your operations.`,
    kWp: r.kWp, area, discountPct, waccPct, govTariff: r.govTariff, voltageLabel: VOLTAGE[voltage].label,
    savingsY1: r.savingsY1, npv: r.npv, pureSavings: r.pureSavings,
    co2PerYr: r.co2PerYr, co2Lifetime: r.co2Lifetime,
    years: r.years.map(y => ({ year: y.year, savingsM: y.savingsM, cumM: y.cumM })),
  };

  const handleExportSlide = async () => {
    setExporting(true);
    try {
      const [{ default: html2canvas }] = await Promise.all([
        import("html2canvas"),
        document.fonts?.ready ?? Promise.resolve(),
      ]);
      // let the chart canvas + fonts settle a frame before capture
      await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
      const node = document.getElementById(EXPORT_ID);
      if (!node) return;
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `PV-Rooftop-Savings-${Math.round(r.kWp)}kWp.png`;
      a.click();
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
    <ToolPage
      title="PV — Rooftop Solar Savings"
      tagline="What your rooftop or adjacent land earns you with TAQA vs the government tariff"
      badge="Sizing Models · PV"
      accent={ACCENT}
      icon={<SunMedium className="h-5 w-5" />}
    >
      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        <div className="space-y-5">
          <Panel title="Your Site" subtitle="Factory rooftop and/or land beside it">
            <div className="space-y-5">
              <Field label="Available area" value={area} onChange={setArea}
                min={1000} max={500000} step={1000} unit="m²"
                hint="Rooftop plus any adjacent land you can dedicate to PV" accent={ACCENT} />
              <SegmentedField
                label={`Mounting (${MOUNTING[mounting].density} m² per kW)`}
                value={mounting}
                onChange={(v: MountKey) => setMounting(v)}
                options={(Object.keys(MOUNTING) as MountKey[]).map(k => ({ value: k, label: MOUNTING[k].label }))}
                accent={ACCENT}
              />
              <Field label="Specific yield" value={specificYield} onChange={setSpecificYield}
                min={1400} max={2200} step={10} unit="kWh/kWp/yr"
                hint="Annual energy per installed kWp at your location" accent={ACCENT} />
            </div>
          </Panel>

          <Panel title="Commercial" subtitle="Tariff, TAQA discount and financing assumptions">
            <div className="space-y-5">
              <SegmentedField
                label={`Voltage level (government tariff EGP ${VOLTAGE[voltage].tariff.toFixed(2)}/kWh)`}
                value={voltage}
                onChange={(v: VoltKey) => setVoltage(v)}
                options={(Object.keys(VOLTAGE) as VoltKey[]).map(k => ({ value: k, label: VOLTAGE[k].label }))}
                accent={ACCENT}
              />
              <Field label="TAQA discount vs government price" value={discountPct} onChange={setDiscountPct}
                min={5} max={30} step={1} unit="%"
                hint="Your savings: the slice of the government tariff you keep" accent={ACCENT} />
              <Field label="WACC" value={waccPct} onChange={setWaccPct}
                min={10} max={30} step={0.5} unit="%"
                hint="Discount rate applied to future savings in the NPV" accent={ACCENT} />
              <Field label="Long-run tariff escalation (year 5+)" value={longRunEsc} onChange={setLongRunEsc}
                min={3} max={12} step={0.5} unit="%/yr"
                hint="Government price growth. Years 2–4 fixed at 25% / 15% / 10% per the model."
                accent={ACCENT} />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">Client-ready summary, generated from the numbers on this page.</p>
            <button
              onClick={handleExportSlide}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 h-9 text-[13px] font-semibold text-white shadow-sm transition-colors disabled:opacity-60"
              style={{ background: ACCENT }}
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageDown className="h-4 w-4" />}
              {exporting ? "Preparing…" : "Export Slide"}
            </button>
          </div>

          <Verdict
            accent={ACCENT}
            title={`EGP ${fmtM(r.npv, 1)}M NPV over 25 years`}
            detail={`${fmt(r.kWp, 0)} kWp on ${fmt(area, 0)} m² · saves EGP ${fmtM(r.savingsY1)}M in year 1, EGP ${fmtM(r.pureSavings, 0)}M total — you win on price, space and carbon.`}
          />

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Stat label="Year-1 savings" value={fmtM(r.savingsY1)} unit="EGP M"
              sub={`${discountPct}% off EGP ${r.govTariff.toFixed(2)}/kWh (${VOLTAGE[voltage].label})`} accent={ACCENT} big />
            <Stat label="Total 25-yr savings" value={fmtM(r.pureSavings, 0)} unit="EGP M"
              sub="Pure savings, undiscounted" accent={ACCENT} big />
            <Stat label="Savings per m²" value={fmt(r.perM2Y1, 2)} unit="EGP/m²/yr"
              sub="Year 1 — what each square metre earns" accent={ACCENT} big />
            <Stat label="CO₂ avoided" value={fmt(r.co2PerYr, 0)} unit="t/yr"
              sub={`${fmt(r.co2Lifetime, 0)} tonnes over the 25-year lifetime`} accent={ACCENT} big />
          </div>

          <Panel title="Savings each year"
            subtitle={`Annual savings at ${discountPct}% off the escalating government tariff, with the running total (EGP M)`}>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={r.years} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="year" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false}
                  tickFormatter={(v: number) => `Y${v}`} />
                <YAxis yAxisId="annual" tick={tick} axisLine={false} tickLine={false} width={52}
                  tickFormatter={(v: number) => fmt(v, 0)} />
                <YAxis yAxisId="cum" orientation="right" tick={tick} axisLine={false} tickLine={false} width={56}
                  tickFormatter={(v: number) => fmt(v, 0)} />
                <Tooltip
                  formatter={(v: number, name: string) => [`EGP ${fmt(v, 2)}M`, name]}
                  labelFormatter={(l: number) => `Year ${l}`}
                  contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar yAxisId="annual" dataKey="savingsM" name="Annual savings" fill={ACCENT}
                  radius={[3, 3, 0, 0]} maxBarSize={24} />
                <Line yAxisId="cum" type="monotone" dataKey="cumM" name="Cumulative savings"
                  stroke={CUMULATIVE} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="NPV build-up"
            subtitle={`Cumulative savings discounted at ${waccPct}% WACC — where the EGP ${fmtM(r.npv, 1)}M comes from`}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={r.years} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pvNpv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false}
                  tickFormatter={(v: number) => `Y${v}`} />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={56}
                  tickFormatter={(v: number) => fmt(v, 0)} />
                <Tooltip
                  formatter={(v: number) => [`EGP ${fmt(v, 2)}M`, "Discounted cumulative"]}
                  labelFormatter={(l: number) => `Year ${l}`}
                  contentStyle={tooltipStyle} />
                <ReferenceLine y={r.npv / 1e6} stroke="#002060" strokeDasharray="6 4"
                  label={{ value: `NPV EGP ${fmtM(r.npv, 1)}M`, position: "insideTopLeft", fontSize: 11, fill: "#002060" }} />
                <Area type="monotone" dataKey="discCumM" stroke={ACCENT} strokeWidth={2}
                  fill="url(#pvNpv)" name="Discounted cumulative" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Savings per m²"
            subtitle="What each square metre of roof or land earns per year (EGP/m²/yr)">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={r.years} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="year" tick={tick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false}
                  tickFormatter={(v: number) => `Y${v}`} />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={52}
                  tickFormatter={(v: number) => fmt(v, 0)} />
                <Tooltip
                  formatter={(v: number) => [`EGP ${fmt(v, 2)}/m²`, "Savings per m²"]}
                  labelFormatter={(l: number) => `Year ${l}`}
                  contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="perM2" stroke={ACCENT} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-slate-400 mt-2">
              Alongside the money: this system avoids {fmt(r.co2Lifetime, 0)} tonnes of CO₂ over its 25-year life
              ({fmt(r.co2PerYr, 0)} t/yr at 0.4 kg CO₂ per kWh).
            </p>
          </Panel>
        </div>
      </div>
    </ToolPage>

    <div style={{ position: "fixed", left: -99999, top: 0, pointerEvents: "none" }} aria-hidden>
      <PvSlideExport data={slideData} containerId={EXPORT_ID} />
    </div>
    </>
  );
}
