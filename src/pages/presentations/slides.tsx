import type { ReactNode, SyntheticEvent } from "react";
import { CheckCircle2, ArrowRight, Star } from "lucide-react";

// ─── Shared solution-slide design system ─────────────────────────────────────
// Extracted from the Industrial deck ("Forged Steel"). Every component takes
// its section `color` as a prop — nothing here is deck-specific.

/** Lighter companion tone for known section colors (gradient endpoints). */
export const LIGHTER: Record<string, string> = {
  "#c2410c": "#fb923c",
  "#1d4ed8": "#60a5fa",
  "#059669": "#34d399",
  "#b45309": "#fbbf24",
  "#ca8a04": "#facc15",
  "#7c3aed": "#a78bfa",
  "#002060": "#60a5fa",
};

/** Lighter companion for any hex color — mapped tone if known, otherwise lightened toward white. */
export const lighter = (c: string): string => {
  if (LIGHTER[c]) return LIGHTER[c];
  const m = /^#([0-9a-f]{6})$/i.exec(c ?? "");
  if (!m) return "#f59e0b";
  const n = parseInt(m[1], 16);
  const mix = (v: number) => Math.round(v + (255 - v) * 0.55);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

/** Entrance animation keyframes — remounted with every slide, so they replay. */
export function SlideStyles() {
  return (
    <style>{`
      @keyframes sx-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes sx-in { from { opacity: 0; } to { opacity: 1; } }
      .sx-up { animation: sx-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
      .sx-in { animation: sx-in 0.5s ease both; }
      @media (prefers-reduced-motion: reduce) {
        .sx-up, .sx-in { animation: none; }
      }
    `}</style>
  );
}

/** Stagger-delay helper. */
export const d = (ms: number) => ({ animationDelay: `${ms}ms` });

/** Hide broken/missing photos instead of showing the alt box. */
export const hideImg = (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

/** Subtle blueprint grid overlay. */
export function BlueprintGrid({ light = false }: { light?: boolean }) {
  const c = light ? "rgba(0,32,96,0.035)" : "rgba(255,255,255,0.04)";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          `repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px 48px),` +
          `repeating-linear-gradient(90deg, ${c} 0 1px, transparent 1px 48px)`,
      }}
    />
  );
}

/** Kicker chip — colored dot + uppercase label. */
export function Kicker({ color, dark = false, children }: { color: string; dark?: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 font-display text-[15px] font-semibold uppercase tracking-[0.22em] ${
        dark
          ? "bg-white/10 text-white/90 ring-1 ring-white/15 backdrop-blur-md"
          : "bg-white text-slate-600 ring-1 ring-black/10 shadow-sm"
      }`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dark ? lighter(color) : color }} />
      {children}
    </span>
  );
}

/** Soft section-color wash for a corner of light slides. */
export function CornerWash({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-28 -top-28 h-[440px] w-[440px] rounded-full"
      style={{ background: `radial-gradient(circle, ${color}12, transparent 65%)` }}
    />
  );
}

/** Oversized ghost numeral watermark for solution content slides. */
export function GhostNum({ n }: { n: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-10 right-2 select-none font-display text-[210px] font-bold leading-none text-[#002060] opacity-[0.045]"
    >
      {String(n).padStart(2, "0")}
    </div>
  );
}

/** Angular corner bracket accent for cards. */
export function Bracket({ color, pos = "tl" }: { color: string; pos?: "tl" | "tr" | "bl" | "br" }) {
  const cls = {
    tl: "left-3 top-3 border-l-2 border-t-2",
    tr: "right-3 top-3 border-r-2 border-t-2",
    bl: "bottom-3 left-3 border-b-2 border-l-2",
    br: "bottom-3 right-3 border-b-2 border-r-2",
  }[pos];
  return <span aria-hidden className={`pointer-events-none absolute h-4 w-4 ${cls}`} style={{ borderColor: `${color}55` }} />;
}

/** Full-height photo rail on the RIGHT of every solution slide. */
export function SolutionRail({
  num, label, kicker, color, photo, alt,
}: { num: number; label: string; kicker: string; color: string; photo: string; alt: string }) {
  return (
    <div
      className="relative h-full w-[300px] shrink-0 overflow-hidden"
      style={{ background: `linear-gradient(195deg, ${color} 0%, #1c1917 60%, #0c0a09 100%)` }}
    >
      <img
        src={photo}
        alt={alt}
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${color}8c 0%, rgba(12,10,9,0.35) 42%, rgba(12,10,9,0.94) 100%)` }}
      />
      <BlueprintGrid />
      <Bracket color={lighter(color)} pos="bl" />
      <div className="relative z-10 flex h-full flex-col justify-between p-7">
        <span className="sx-up inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20 backdrop-blur-md" style={d(0)}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: lighter(color) }} />
          <span className="font-display text-[15px] font-semibold uppercase tracking-[0.22em] text-white/90">
            Solution {String(num).padStart(2, "0")}
          </span>
        </span>
        <div>
          <div className="sx-in select-none font-display text-[118px] font-bold leading-none text-white/10" style={d(100)}>
            {String(num).padStart(2, "0")}
          </div>
          <div
            className="sx-up mt-2 h-[3px] w-12 rounded-full"
            style={{ ...d(140), background: `linear-gradient(90deg, ${lighter(color)}, #f59e0b)` }}
          />
          <h3 className="sx-up mt-3 font-display text-[28px] font-bold leading-tight tracking-tight text-white" style={d(180)}>
            {label}
          </h3>
          <p className="sx-up mt-2 font-display text-[15px] font-semibold uppercase tracking-[0.2em] text-white/70" style={d(230)}>
            {kicker}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Small uppercase column heading with a 3px accent bar. */
export function ColHead({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <p className="font-display text-[16px] font-bold uppercase tracking-[0.2em] text-slate-500">{children}</p>
      <div className="mt-1.5 h-[3px] w-10 rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${lighter(color)})` }} />
    </div>
  );
}

// ─── ScopeSlide ──────────────────────────────────────────────────────────────

export interface ScopeProps {
  solutionNum: number;
  solutionLabel: string;
  subtitle: string;
  tagline?: string;
  color: string;
  icon: ReactNode;
  photo: string;
  taqaInvests: string[];
  steps: string[];
  whatYouReceive: string[];
}

export function ScopeSlide({ solutionNum, solutionLabel, subtitle, tagline, color, icon, photo, taqaInvests, steps, whatYouReceive }: ScopeProps) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />

      <div className="relative flex min-w-0 flex-1 flex-col px-12 py-10">
        <GhostNum n={solutionNum} />
        <CornerWash color={color} />

        {/* Header */}
        <div className="relative z-10 flex items-start gap-4">
          <div
            className="sx-up mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{ ...d(60), background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="sx-up font-display text-[28px] font-bold leading-snug tracking-tight text-[#002060]" style={d(100)}>
              {subtitle}
            </h2>
            {tagline && (
              <p className="sx-up mt-1.5 text-[17px] italic leading-snug text-slate-500" style={d(150)}>
                {tagline}
              </p>
            )}
          </div>
        </div>

        {/* Three columns — stretch to the bottom margin */}
        <div className="relative z-10 mt-6 grid min-h-0 flex-1 grid-cols-[1fr_1.2fr_1fr] gap-5">
          {/* TAQA Invests */}
          <div className="sx-up relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm" style={d(200)}>
            <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, ${lighter(color)})` }} />
            <ColHead color={color}>TAQA Invests</ColHead>
            <div className="space-y-3">
              {taqaInvests.map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: color }} />
                  <span className="text-[17px] leading-relaxed text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works — numbered flow with connecting line */}
          <div className="sx-up relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm" style={d(260)}>
            <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, ${lighter(color)})` }} />
            <ColHead color={color}>How It Works</ColHead>
            <div className="relative flex min-h-0 flex-1 flex-col justify-between">
              <span aria-hidden className="absolute bottom-3 left-[11px] top-2 w-px" style={{ background: `${color}30` }} />
              {steps.map((s, i) => (
                <div key={i} className="relative mb-2 flex items-start gap-3 last:mb-0">
                  <div
                    className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white shadow"
                    style={{ background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-[17px] leading-relaxed text-slate-600">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What You Receive — dark navy */}
          <div
            className="sx-up relative flex h-full flex-col overflow-hidden rounded-2xl p-6 text-white shadow-lg"
            style={{ ...d(320), background: "linear-gradient(150deg, #002060 0%, #0a2f7a 100%)" }}
          >
            <BlueprintGrid />
            <Bracket color="#FFC10E" pos="br" />
            <div className="relative">
              <p className="font-display text-[16px] font-bold uppercase tracking-[0.2em] text-[#FFC10E]">What You Receive</p>
              <div className="mt-1.5 h-[3px] w-10 rounded-full" style={{ background: "linear-gradient(90deg, #FFC10E, #fb923c)" }} />
              <div className="mt-4 space-y-3.5">
                {whatYouReceive.map(r => (
                  <div key={r} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-1 h-[18px] w-[18px] shrink-0 text-[#FFC10E]" />
                    <span className="text-[17px] leading-relaxed text-white/90">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SolutionRail
        num={solutionNum}
        label={solutionLabel}
        kicker="Scope & How It Works"
        color={color}
        photo={photo}
        alt={`${solutionLabel} infrastructure operated by TAQA Arabia`}
      />
    </div>
  );
}

// ─── ValuePropSlide ──────────────────────────────────────────────────────────

export interface ValueItem { label: string; desc: string; }
export interface ValueProps {
  solutionNum: number;
  solutionLabel: string;
  color: string;
  icon: ReactNode;
  photo: string;
  whatYouGain: ValueItem[];
  taqaEdge: ValueItem[];
}

export function ValuePropSlide({ solutionNum, solutionLabel, color, icon, photo, whatYouGain, taqaEdge }: ValueProps) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />

      <div className="relative flex min-w-0 flex-1 flex-col px-12 py-10">
        <GhostNum n={solutionNum} />
        <CornerWash color={color} />

        <div className="relative z-10 flex items-center gap-4">
          <div
            className="sx-up flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{ ...d(60), background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
          >
            {icon}
          </div>
          <h2 className="sx-up font-display text-[30px] font-bold leading-tight tracking-tight text-[#002060]" style={d(100)}>
            What TAQA Arabia delivers for your site
          </h2>
        </div>

        <div className="relative z-10 mt-5 grid min-h-0 flex-1 grid-cols-2 gap-6">
          {/* What You Gain */}
          <div className="flex min-h-0 flex-col">
            <div className="sx-up" style={d(160)}>
              <ColHead color={color}>What You Gain</ColHead>
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
              {whatYouGain.map((v, i) => (
                <div
                  key={v.label}
                  className="sx-up flex flex-1 items-start gap-3.5 rounded-xl bg-white p-4 ring-1 ring-black/5 shadow-sm"
                  style={d(200 + i * 60)}
                >
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${color}14`, color }}
                  >
                    <CheckCircle2 className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[18px] font-bold leading-tight text-[#002060]">{v.label}</div>
                    <div className="mt-1 text-[16px] leading-[1.45] text-slate-600">{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TAQA Arabia Edge */}
          <div className="flex min-h-0 flex-col">
            <div className="sx-up" style={d(220)}>
              <ColHead color="#002060">TAQA Arabia Edge</ColHead>
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
              {taqaEdge.map((v, i) => (
                <div
                  key={v.label}
                  className="sx-up relative flex flex-1 items-start gap-3.5 overflow-hidden rounded-xl p-4 shadow-md"
                  style={{ ...d(260 + i * 60), background: "linear-gradient(140deg, #002060 0%, #0a2f7a 100%)" }}
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFC10E] ring-1 ring-white/10">
                    <ArrowRight className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[18px] font-bold leading-tight text-[#FFC10E]">{v.label}</div>
                    <div className="mt-1 text-[16px] leading-[1.45] text-white/80">{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SolutionRail
        num={solutionNum}
        label={solutionLabel}
        kicker="Value Proposition"
        color={color}
        photo={photo}
        alt={`${solutionLabel} infrastructure operated by TAQA Arabia`}
      />
    </div>
  );
}

// ─── TimelineSlide ───────────────────────────────────────────────────────────

export interface Phase { days: string; label: string; }
export interface Group { label: string; range: string; }
export interface TimelineProps {
  solutionNum: number;
  solutionLabel: string;
  color: string;
  icon: ReactNode;
  photo: string;
  phases: Phase[];
  groups: Group[];
}

export function TimelineSlide({ solutionNum, solutionLabel, color, icon, photo, phases, groups }: TimelineProps) {
  const tint = ["14", "1f", "2b"];
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#fafaf9] font-deck">
      <SlideStyles />

      <div className="relative flex min-w-0 flex-1 flex-col px-12 py-10">
        <GhostNum n={solutionNum} />
        <CornerWash color={color} />

        <div className="relative z-10 flex items-center gap-4">
          <div
            className="sx-up flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{ ...d(60), background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
          >
            {icon}
          </div>
          <h2 className="sx-up font-display text-[30px] font-bold leading-tight tracking-tight text-[#002060]" style={d(100)}>
            From first contact to live supply
          </h2>
        </div>

        <div className="relative z-10 mt-6 grid min-h-0 flex-1 grid-cols-[1fr_340px] gap-8">
          {/* Numbered phase flow with connecting line — spreads across full height */}
          <div className="relative flex min-h-0 flex-col justify-between">
            <span aria-hidden className="absolute bottom-4 left-[15px] top-3 w-px" style={{ background: `${color}30` }} />
            {phases.map((p, i) => (
              <div key={i} className="sx-up relative flex items-center gap-4 py-1" style={d(160 + i * 55)}>
                <div
                  className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-white shadow"
                  style={{ background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
                >
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[15px] font-bold uppercase tracking-[0.18em]" style={{ color }}>{p.days}</div>
                  <div className="text-[18px] font-semibold leading-snug text-[#002060]">{p.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Milestone groups */}
          <div className="flex min-h-0 flex-col">
            <div className="sx-up" style={d(220)}>
              <ColHead color={color}>Milestone Groups</ColHead>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              {groups.map((g, i) => (
                <div
                  key={i}
                  className="sx-up relative overflow-hidden rounded-2xl p-6 ring-1"
                  style={{
                    ...d(280 + i * 70),
                    background: `${color}${tint[i] ?? "1f"}`,
                    borderColor: `${color}30`,
                    // @ts-expect-error -- CSS var for ring color via style not needed; ring uses default
                    "--tw-ring-color": `${color}2e`,
                  }}
                >
                  <span aria-hidden className="absolute inset-y-4 left-0 w-[3px] rounded-r-full" style={{ background: color }} />
                  <div className="pl-2.5">
                    <div className="font-display text-[18px] font-bold tracking-tight text-[#002060]">{g.label}</div>
                    <div className="mt-1 font-display text-[15px] font-bold uppercase tracking-[0.14em]" style={{ color }}>{g.range}</div>
                  </div>
                </div>
              ))}
              <div
                className="sx-up relative mt-auto overflow-hidden rounded-2xl p-5 shadow-md"
                style={{ ...d(500), background: "linear-gradient(140deg, #002060 0%, #0a2f7a 100%)" }}
              >
                <p className="text-[16px] leading-snug text-white/80">
                  Timelines are indicative and subject to site conditions, regulatory approvals and customer readiness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SolutionRail
        num={solutionNum}
        label={solutionLabel}
        kicker="Implementation Timeline"
        color={color}
        photo={photo}
        alt={`${solutionLabel} infrastructure operated by TAQA Arabia`}
      />
    </div>
  );
}

// ─── TrackRecordSlide — dark "moment" slide ──────────────────────────────────

export interface TrackStat { value: string; label: string; }
export interface TrackProps {
  solutionNum: number;
  solutionLabel: string;
  heading: string;
  subheading: string;
  body: string;
  color: string;
  icon: ReactNode;
  photo: string;
  stats: TrackStat[];
}

export const statSize = (v: string) => (v.length > 8 ? "text-[30px]" : v.length > 5 ? "text-[40px]" : "text-[54px]");

export function TrackRecordSlide({ solutionNum, solutionLabel, heading, subheading, body, color, icon, photo, stats }: TrackProps) {
  return (
    <div
      className="relative h-full w-full overflow-hidden font-deck"
      style={{ background: "linear-gradient(140deg, #0c0a09 0%, #1c1917 55%, #292524 100%)" }}
    >
      <SlideStyles />
      <img
        src={photo}
        alt={`${solutionLabel} infrastructure operated by TAQA Arabia`}
        loading="lazy"
        onError={hideImg}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        style={{ mixBlendMode: "luminosity" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(115deg, rgba(12,10,9,0.95) 0%, rgba(28,25,23,0.85) 52%, ${color}59 100%)` }}
      />
      <BlueprintGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-40 h-[560px] w-[560px] rounded-full"
        style={{ background: `radial-gradient(circle, ${color}30, transparent 65%)` }}
      />

      <div className="relative z-10 flex h-full flex-col p-14">
        <div className="sx-up flex items-center gap-3" style={d(0)}>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${color}, ${lighter(color)})` }}
          >
            {icon}
          </div>
          <Kicker color={color} dark>
            Solution {String(solutionNum).padStart(2, "0")} · {solutionLabel} · Proven Track Record
          </Kicker>
        </div>

        <h2 className="sx-up mt-5 max-w-[1120px] font-display text-[46px] font-bold leading-[1.08] tracking-tight text-white" style={d(80)}>
          {heading}
        </h2>
        <div className="sx-up mt-3 flex items-start gap-2.5" style={d(140)}>
          <Star className="mt-1 h-5 w-5 shrink-0" style={{ color: lighter(color), fill: lighter(color) }} />
          <p className="max-w-[1020px] text-[19px] font-medium leading-snug text-white/90">{subheading}</p>
        </div>

        <div className="mt-7 grid min-h-0 flex-1 grid-cols-[1fr_440px] gap-6">
          {/* Body — glass narrative card, content vertically centered */}
          <div className="sx-up relative flex flex-col justify-center overflow-hidden rounded-2xl bg-white/[0.07] p-9 ring-1 ring-white/15 backdrop-blur-md" style={d(220)}>
            <Bracket color={lighter(color)} pos="tl" />
            <p className="pl-3 text-[19px] leading-[1.75] text-white/90">{body}</p>
            <div
              className="ml-3 mt-8 h-[3px] w-16 rounded-full"
              style={{ background: `linear-gradient(90deg, ${lighter(color)}, #f59e0b)` }}
            />
          </div>

          {/* Glass stat bento — 2×2, stretches full height */}
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="sx-up flex flex-col justify-center rounded-2xl bg-white/10 p-7 ring-1 ring-white/15 backdrop-blur-md"
                style={d(280 + i * 70)}
              >
                <div
                  className={`font-display font-bold leading-[1.05] tracking-tight bg-clip-text text-transparent ${statSize(s.value)}`}
                  style={{ backgroundImage: `linear-gradient(105deg, #ffffff 0%, ${lighter(color)} 100%)` }}
                >
                  {s.value}
                </div>
                <div className="mt-2 text-[17px] leading-snug text-white/75">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
