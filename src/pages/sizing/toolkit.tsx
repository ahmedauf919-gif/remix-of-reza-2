import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/* Shared layout + input primitives for the Sizing Models engineering tools.
   Every tool page renders inside <ToolPage> and builds its form from
   <Field> / <SegmentedField> / <ToggleField>, with results in <Stat> cards. */

export function ToolPage({
  title, tagline, badge, accent, icon, children,
}: {
  title: string;
  tagline: string;
  badge: string;
  accent: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-deck">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <div className="h-8 w-px bg-slate-200" />
          <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: accent }}>
            {icon}
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-[#002060] text-lg leading-tight truncate">{title}</h1>
            <p className="text-xs text-slate-500 truncate">{tagline}</p>
          </div>
          <span
            className="ml-auto hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide shrink-0"
            style={{ background: `${accent}14`, color: accent }}
          >
            {badge}
          </span>
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">{children}</main>
    </div>
  );
}

export function Panel({ title, subtitle, children, className = "" }: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="font-display font-bold text-[#002060] text-sm uppercase tracking-[0.12em]">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({
  label, value, onChange, min, max, step = 1, unit, hint, accent = "#005298",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-[13px] font-medium text-slate-700">{label}</span>
        <span className="text-[13px] font-semibold tabular-nums text-[#002060] whitespace-nowrap">
          {Number.isInteger(step) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          {unit && <span className="text-slate-400 font-normal ml-1">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 accent-current"
        style={{ color: accent }}
      />
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </label>
  );
}

export function SegmentedField<T extends string>({
  label, value, onChange, options, accent = "#005298",
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  accent?: string;
}) {
  return (
    <div>
      <p className="text-[13px] font-medium text-slate-700 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              className={`px-3 h-8 rounded-lg text-[12px] font-semibold transition-colors ${active ? "text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              style={active ? { background: accent } : undefined}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ToggleField({
  label, value, onChange, hint, accent = "#005298",
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
  accent?: string;
}) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center justify-between w-full text-left gap-3">
      <span>
        <span className="text-[13px] font-medium text-slate-700 block">{label}</span>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </span>
      <span
        className="relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors"
        style={{ background: value ? accent : "#cbd5e1" }}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}

export function Stat({
  label, value, unit, sub, accent = "#005298", big = false,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  accent?: string;
  big?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className={`font-display font-bold tabular-nums mt-1 ${big ? "text-[34px]" : "text-[26px]"} leading-none`} style={{ color: accent }}>
        {value}
        {unit && <span className="text-[15px] font-semibold text-slate-400 ml-1.5">{unit}</span>}
      </p>
      {sub && <p className="text-[12px] text-slate-500 mt-1.5">{sub}</p>}
    </div>
  );
}

/** Verdict banner, e.g. recommended tier / pipe size / charger mix headline. */
export function Verdict({ accent, title, detail }: { accent: string; title: string; detail: string }) {
  return (
    <div className="rounded-xl p-4 text-white shadow-md" style={{ background: `linear-gradient(120deg, ${accent}, ${accent}cc)` }}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Recommendation</p>
      <p className="font-display font-bold text-[22px] leading-tight mt-0.5">{title}</p>
      <p className="text-[13px] text-white/85 mt-1 leading-snug">{detail}</p>
    </div>
  );
}
