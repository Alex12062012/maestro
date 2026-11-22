import { load, PREFIX, save } from "@/lib/storage";

// Sombre par défaut pour tout le monde, clair sur choix du joueur.
export type Theme = "dark" | "light";

const KEY = "theme";

export function parseTheme(value: unknown): Theme {
  return value === "light" ? "light" : "dark";
}

export function loadTheme(): Theme {
  return parseTheme(load<unknown>(KEY, "dark"));
}

export function saveTheme(theme: Theme): void {
  save(KEY, theme);
}

// Script inline du <head> : même clé et même règle que loadTheme, exécuté
// avant la première peinture pour éviter un flash du mauvais thème.
export const THEME_SCRIPT = `(function(){var t;try{t=JSON.parse(localStorage.getItem(${JSON.stringify(PREFIX + KEY)}))}catch(e){}document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")})()`;
