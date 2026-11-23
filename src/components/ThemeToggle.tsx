"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { loadTheme, parseTheme, saveTheme, syncThemeColor, type Theme } from "@/lib/theme";

// Le thème vit sur <html data-theme>, posé avant la peinture par THEME_SCRIPT.
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const current = (): Theme => parseTheme(document.documentElement.dataset.theme);

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  syncThemeColor();
  listeners.forEach((cb) => cb());
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, current, () => "dark" as Theme);

  // En dev, le remontage de Strict Mode remet data-theme="dark" : on repose
  // le choix enregistré (même source que le script, sans effet en prod).
  useLayoutEffect(() => apply(loadTheme()), []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        apply(next);
        saveTheme(next);
      }}
      aria-label={next === "light" ? "Passer en mode clair" : "Passer en mode sombre"}
      className="inline-flex size-11 items-center justify-center rounded text-ink-2 hover:text-ink"
    >
      {/* Les deux icônes sont rendues, le CSS montre la bonne dès la première peinture. */}
      <SunIcon size={22} weight="regular" aria-hidden className="light:hidden" />
      <MoonIcon size={22} weight="regular" aria-hidden className="hidden light:block" />
    </button>
  );
}
