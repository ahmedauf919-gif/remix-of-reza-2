import { useEffect, useState } from "react";

export function useTheme() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("taqa_theme") === "dark"; } catch { return false; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add("dark"); localStorage.setItem("taqa_theme", "dark"); }
    else { root.classList.remove("dark"); localStorage.setItem("taqa_theme", "light"); }
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}
