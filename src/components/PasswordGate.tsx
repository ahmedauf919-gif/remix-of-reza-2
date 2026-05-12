import { useEffect, useState } from "react";
import { Lock, Unlock, Loader2, AlertCircle } from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.jpg";

const ACCESS_PASSWORD = "wind2026";
const STORAGE_KEY = "wind_model_unlocked";

export const PasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwd) return;
    setLoading(true);
    setError("");
    /* brief artificial delay so the spinner is visible */
    await new Promise((r) => setTimeout(r, 450));
    if (pwd === ACCESS_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#001540]">

      {/* ── Animated background orbs ───────────────────────── */}
      <div
        className="absolute top-[15%] left-[12%] w-[420px] h-[420px] rounded-full
                     bg-[#005298]/25 blur-[90px] pointer-events-none animate-float"
      />
      <div
        className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full
                     bg-[#FFC10E]/10 blur-[70px] pointer-events-none animate-float"
        style={{ animationDelay: "1.4s" }}
      />
      <div
        className="absolute top-[55%] right-[30%] w-[200px] h-[200px] rounded-full
                     bg-[#005298]/15 blur-[60px] pointer-events-none animate-float"
        style={{ animationDelay: "0.7s" }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Login card ─────────────────────────────────────── */}
      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-[380px] mx-4 animate-fade-in-up"
      >
        <div
          className="rounded-2xl border border-white/10 bg-white/[0.06]
                       backdrop-blur-2xl p-8 shadow-2xl"
        >
          {/* Logo + title */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
              <img
                src={taqaLogo}
                alt="TAQA Arabia"
                className="h-16 w-auto rounded-xl shadow-lg ring-2 ring-white/10"
              />
              {/* Gold pulse ring */}
              <div
                className="absolute inset-0 rounded-xl animate-pulse-gold pointer-events-none"
              />
            </div>
            <div className="text-center">
              <h1 className="text-white font-bold text-lg tracking-tight">
                TAQA Arabia
              </h1>
              <p className="text-white/40 text-xs mt-0.5 tracking-wide">
                Financial Models Platform
              </p>
            </div>
          </div>

          {/* Gold divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFC10E]/35 to-transparent mb-7" />

          {/* Input section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
              <Lock className="h-3.5 w-3.5 text-[#FFC10E]" />
              <span>Authorized access only — enter your password</span>
            </div>

            <input
              type="password"
              autoFocus
              value={pwd}
              onChange={(e) => { setPwd(e.target.value); setError(""); }}
              placeholder="Access password"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/10
                         text-white placeholder:text-white/25 text-sm
                         focus:outline-none focus:border-[#FFC10E]/50 focus:ring-2
                         focus:ring-[#FFC10E]/20 transition-all"
            />

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs animate-fade-in">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !pwd}
              className="w-full py-3 rounded-xl bg-[#FFC10E] text-[#002060] font-bold
                         text-sm tracking-wide transition-all hover:bg-[#ffd04e]
                         active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  Unlock Platform
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/20 text-[11px] mt-5">
          © 2026 TAQA Arabia · Confidential — Internal Use Only
        </p>
      </form>
    </div>
  );
};
