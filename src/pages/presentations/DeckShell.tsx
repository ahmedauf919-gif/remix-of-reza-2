import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Home as HomeIcon,
  FileDown, Maximize, Minimize, Play, Pause, Square, Volume2, VolumeX, Captions,
} from "lucide-react";

export interface DeckSection {
  id: string;
  label: string;
  color: string;
  slides: number[];
}

export interface DeckSlide {
  title: string;
  render: () => ReactNode;
}

interface DeckShellProps {
  title: string;
  subtitle: string;
  sections: readonly DeckSection[];
  slides: readonly DeckSlide[];
  /** File name inside public/presentations/, e.g. "industrial-clients.pdf" */
  pdf?: string;
  /** One narration script per slide, same order/length as `slides`. Enables "Play as Video". */
  narration?: readonly string[];
}

/** Fixed design canvas — every slide is laid out at this size, then scaled to fill the viewport. */
const DESIGN_W = 1280;
const DESIGN_H = 720;

/** Presentation-mode pacing — every slide holds for at least MIN and at most MAX,
    matching the narration length in between via the browser's speech 'end' event. */
const MIN_SLIDE_MS = 5000;
const MAX_SLIDE_MS = 12000;
const NO_NARRATION_HOLD_MS = 7000;

/** Prefer a higher-quality installed voice (neural/online/natural) over robotic defaults. */
function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined;
  const en = voices.filter(v => v.lang?.toLowerCase().startsWith("en"));
  const pool = en.length ? en : voices;
  return (
    pool.find(v => /natural|neural|online|premium/i.test(v.name)) ??
    pool.find(v => /google/i.test(v.name)) ??
    pool.find(v => v.lang?.toLowerCase() === "en-us") ??
    pool[0]
  );
}

export function DeckShell({ title, subtitle, sections, slides, pdf, narration }: DeckShellProps) {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<"fwd" | "bwd">("fwd");
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);

  const total = slides.length;
  const section = sections.find(s => s.slides.includes(current)) ?? sections[0];
  const hasNarration = !!narration && narration.length === total;

  const step = useCallback((delta: number) => {
    if (presenting) {
      window.speechSynthesis?.cancel();
      setPresenting(false);
      setPaused(false);
    }
    setCurrent(c => {
      const t = Math.max(0, Math.min(total - 1, c + delta));
      if (t !== c) {
        setDirection(delta > 0 ? "fwd" : "bwd");
        setAnimKey(k => k + 1);
      }
      return t;
    });
  }, [total, presenting]);

  const go = useCallback((target: number) => {
    if (presenting) {
      window.speechSynthesis?.cancel();
      setPresenting(false);
      setPaused(false);
    }
    setCurrent(c => {
      const t = Math.max(0, Math.min(total - 1, target));
      if (t !== c) {
        setDirection(t > c ? "fwd" : "bwd");
        setAnimKey(k => k + 1);
      }
      return t;
    });
  }, [total, presenting]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void rootRef.current?.requestFullscreen();
    }
  }, []);

  const startPresentation = useCallback(() => {
    void rootRef.current?.requestFullscreen().catch(() => {});
    setDirection("fwd");
    setAnimKey(k => k + 1);
    setCurrent(0);
    setPaused(false);
    setPresenting(true);
  }, []);

  const stopPresentation = useCallback(() => {
    window.speechSynthesis?.cancel();
    setPresenting(false);
    setPaused(false);
  }, []);

  // Scale the fixed 1280×720 canvas to fill the available stage area.
  useEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setScale(Math.min(r.width / DESIGN_W, r.height / DESIGN_H));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && presenting) { e.preventDefault(); stopPresentation(); return; }
      if (presenting) return; // arrow/space/etc. are disabled while a narrated presentation is playing
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); step(-1); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(total - 1); }
      else if (e.key === "f" || e.key === "F") { e.preventDefault(); toggleFullscreen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, go, total, toggleFullscreen, presenting, stopPresentation]);

  // Presentation-mode playback: narrate the current slide, then auto-advance.
  // Deliberately excludes `paused`/voices from deps — pause is handled natively
  // below so it doesn't restart the utterance from the beginning.
  useEffect(() => {
    if (!presenting) return;
    let cancelled = false;
    let advanced = false;
    const startTs = Date.now();
    const text = hasNarration ? narration![current] : "";

    const advance = () => {
      if (advanced || cancelled) return;
      advanced = true;
      if (current < total - 1) {
        setDirection("fwd");
        setAnimKey(k => k + 1);
        setCurrent(c => c + 1);
      } else {
        setPresenting(false);
      }
    };

    const maxTimer = setTimeout(advance, MAX_SLIDE_MS);

    if (!muted && text && "speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.98;
      utter.pitch = 1;
      const v = pickVoice(window.speechSynthesis.getVoices());
      if (v) utter.voice = v;
      utter.onend = () => {
        const elapsed = Date.now() - startTs;
        setTimeout(advance, Math.max(0, MIN_SLIDE_MS - elapsed));
      };
      utter.onerror = () => setTimeout(advance, NO_NARRATION_HOLD_MS);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(advance, NO_NARRATION_HOLD_MS);
    }

    return () => {
      cancelled = true;
      clearTimeout(maxTimer);
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenting, current, muted]);

  // Pause/resume the native speech engine in place, without restarting narration.
  useEffect(() => {
    if (!presenting) return;
    if (paused) window.speechSynthesis?.pause();
    else window.speechSynthesis?.resume();
  }, [paused, presenting]);

  // Stop narration cleanly if the viewer navigates away from the deck entirely.
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const handleStageClick = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("button") || t.closest("a") || t.closest("select") || t.closest("input")) return;
    if (presenting) return;
    step(1);
  };

  const progressPct = ((current + 1) / total) * 100;
  const chromeBtn = "inline-flex items-center gap-1.5 rounded-lg px-2.5 h-8 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap";

  return (
    <div ref={rootRef} className="h-[100dvh] w-full flex flex-col overflow-hidden bg-[#0a0d12] relative select-none font-deck">
      <style>{`
        @keyframes deck-fwd { from { opacity:0; transform:translateX(28px) scale(0.985); } to { opacity:1; transform:translateX(0) scale(1); } }
        @keyframes deck-bwd { from { opacity:0; transform:translateX(-28px) scale(0.985); } to { opacity:1; transform:translateX(0) scale(1); } }
        .deck-fwd { animation: deck-fwd 0.38s cubic-bezier(0.16,1,0.3,1) both; }
        .deck-bwd { animation: deck-bwd 0.38s cubic-bezier(0.16,1,0.3,1) both; }
        .deck-edge-nav { opacity: 0; transition: opacity 0.25s; }
        .deck-stage:hover .deck-edge-nav:not(:disabled) { opacity: 1; }
        @keyframes caption-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .deck-caption { animation: caption-in 0.3s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .deck-fwd, .deck-bwd, .deck-caption { animation: none; }
          .deck-stage * { animation: none !important; }
        }
      `}</style>

      {/* Ambient glow tinted by current section */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-[background] duration-700"
        style={{ background: `radial-gradient(900px 480px at 50% -12%, ${section.color}2e, transparent 70%)` }}
      />

      {/* Progress bar */}
      <div className="h-[3px] bg-white/[0.06] shrink-0 relative z-10">
        <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, background: section.color }} />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center gap-2 px-3 h-12 shrink-0">
        <Link to="/" className={chromeBtn}>
          <HomeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <div className="min-w-0 border-l border-white/15 pl-3">
          <p className="text-white text-[13px] font-bold leading-tight truncate font-display">{title}</p>
          <p className="text-white/35 text-[10px] leading-tight truncate hidden sm:block">{subtitle}</p>
        </div>

        <div className="flex-1" />

        {!presenting && (
          <span className="text-white/40 text-xs tabular-nums hidden md:inline whitespace-nowrap">
            <span className="font-semibold" style={{ color: section.color }}>{section.label}</span>
            <span className="mx-1.5 text-white/20">·</span>
            {current + 1} / {total}
          </span>
        )}

        {presenting ? (
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPaused(p => !p)} className={`${chromeBtn} border border-white/15`} title={paused ? "Resume" : "Pause"}>
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              <span className="hidden lg:inline">{paused ? "Resume" : "Pause"}</span>
            </button>
            <button onClick={() => setMuted(m => !m)} className={chromeBtn} title={muted ? "Unmute narration" : "Mute narration"}>
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setCaptionsOn(c => !c)}
              className={chromeBtn}
              title={captionsOn ? "Hide captions" : "Show captions"}
              style={captionsOn ? { color: section.color } : undefined}
            >
              <Captions className="h-4 w-4" />
            </button>
            <button onClick={stopPresentation} className={`${chromeBtn} border border-white/15`} title="Stop (Esc)">
              <Square className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Stop</span>
            </button>
          </div>
        ) : (
          <>
            {hasNarration && (
              <button
                onClick={startPresentation}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 h-8 text-xs font-semibold text-white transition-colors whitespace-nowrap shadow-sm"
                style={{ background: section.color }}
                title="Play the full deck as a narrated video"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Play as Video
              </button>
            )}
            {pdf && (
              <a
                href={`${import.meta.env.BASE_URL}presentations/${pdf}`}
                download
                className={`${chromeBtn} border border-white/15`}
                title="Download the original presentation as PDF"
              >
                <FileDown className="h-4 w-4" />
                PDF
              </a>
            )}
            <button onClick={toggleFullscreen} className={chromeBtn} title="Toggle fullscreen (F)">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              <span className="hidden lg:inline">{isFullscreen ? "Exit" : "Present"}</span>
            </button>
          </>
        )}
      </header>

      {/* Stage — slide scaled to fill remaining space */}
      <div ref={fitRef} className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-2 pb-1">
        <div
          className="deck-stage relative overflow-hidden cursor-pointer rounded-lg shadow-[0_24px_80px_-16px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
          style={{ width: DESIGN_W * scale, height: DESIGN_H * scale }}
          onClick={handleStageClick}
        >
          <div style={{ width: DESIGN_W, height: DESIGN_H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <div key={animKey} className={`h-full ${direction === "fwd" ? "deck-fwd" : "deck-bwd"}`}>
              {slides[current].render()}
            </div>
          </div>

          {/* Captions overlay — presentation mode only */}
          {presenting && captionsOn && hasNarration && narration![current] && (
            <div key={`cap-${current}`} className="deck-caption pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4">
              <p className="max-w-[85%] rounded-xl bg-black/70 px-5 py-2.5 text-center text-[15px] leading-snug text-white shadow-lg backdrop-blur-sm">
                {narration![current]}
              </p>
            </div>
          )}

          {/* Edge navigation — appears on hover, disabled during narrated playback */}
          {!presenting && (
            <>
              <button
                onClick={() => step(-1)}
                disabled={current === 0}
                className="deck-edge-nav absolute left-0 top-1/2 -translate-y-1/2 h-24 w-12 flex items-center justify-center rounded-r-2xl bg-black/35 text-white/90 hover:bg-black/55 backdrop-blur-sm disabled:hidden"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                onClick={() => step(1)}
                disabled={current === total - 1}
                className="deck-edge-nav absolute right-0 top-1/2 -translate-y-1/2 h-24 w-12 flex items-center justify-center rounded-l-2xl bg-black/35 text-white/90 hover:bg-black/55 backdrop-blur-sm disabled:hidden"
                aria-label="Next slide"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom bar — section pills + slide title */}
      <footer className="relative z-10 shrink-0 px-3 pb-2 pt-1 flex items-center gap-3">
        <span className="text-white/35 text-[11px] truncate w-40 hidden lg:block">{slides[current].title}</span>
        <div className="flex-1 flex justify-center min-w-0">
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-0.5">
            {sections.map(s => {
              const isActive = s.slides.includes(current);
              return (
                <button
                  key={s.id}
                  onClick={() => go(s.slides[0])}
                  className={`px-2.5 h-7 text-[11px] font-medium whitespace-nowrap rounded-full transition-colors ${isActive ? "text-white font-semibold shadow-lg" : "text-white/40 hover:text-white/75 hover:bg-white/5"}`}
                  style={isActive ? { background: s.color } : undefined}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <span className="text-white/35 text-[11px] tabular-nums w-40 text-right hidden lg:block">
          {presenting ? (paused ? "Paused" : "Playing…") : `${current + 1} / ${total} · ←→ Space · F`}
        </span>
      </footer>
    </div>
  );
}
