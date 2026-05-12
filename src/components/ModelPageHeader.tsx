import { Link } from "react-router-dom";
import { Check, UploadCloud, Loader2, ChevronRight } from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.jpg";

interface ModelPageHeaderProps {
  title: string;
  subtitle?: string;
  isStale?: boolean;
  saving?: boolean;
  loaded?: boolean;
  actions?: React.ReactNode;
}

export function ModelPageHeader({ title, subtitle, isStale, saving, loaded, actions }: ModelPageHeaderProps) {
  return (
    <header className="bg-taqa-hero text-white shadow-lg sticky top-0 z-40">
      {/* Gold accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-[#FFC10E] via-[#FFC10E]/60 to-transparent" />

      <div className="container flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        {/* Left: logo + breadcrumb + title */}
        <div className="flex items-center gap-4">
          <Link to="/" className="shrink-0 transition-opacity hover:opacity-80">
            <img src={taqaLogo} alt="TAQA Arabia" className="h-10 w-auto rounded shadow-sm" />
          </Link>

          <div className="border-l border-white/15 pl-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-white/50 mb-0.5">
              <Link to="/" className="hover:text-white/80 transition-colors">
                Financial Models Hub
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/70">{title}</span>
            </div>
            {/* Title */}
            <h1 className="text-base font-bold tracking-tight text-white leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-white/45 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: save status + action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Auto-save indicator */}
          <div className="flex items-center gap-1.5 text-xs text-white/55 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
            {isStale ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FFC10E]" />
            ) : saving ? (
              <UploadCloud className="h-3.5 w-3.5 animate-pulse text-[#FFC10E]" />
            ) : (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            )}
            <span>
              {!loaded ? "Loading…" : isStale ? "Recalculating…" : saving ? "Saving…" : "Saved"}
            </span>
          </div>

          {actions}
        </div>
      </div>
    </header>
  );
}

/** Reusable button styles for the dark header */
export const headerBtnGhost =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium " +
  "bg-white/10 text-white border border-white/15 hover:bg-white/20 active:scale-95 transition-all";

export const headerBtnGold =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold " +
  "bg-[#FFC10E] text-[#002060] hover:bg-[#ffd04e] active:scale-95 transition-all shadow-sm";
