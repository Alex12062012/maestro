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

// Barre du navigateur (meta theme-color) : la couleur de fond du thème, lue
// dans les variables CSS, donc aucune couleur en dur ici. Sans valeur (feuille
// de style pas encore là), rien ne change.
export function syncThemeColor(): void {
  try {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    if (bg) meta.content = bg;
  } catch {}
}

// La même chose, en texte pour le script inline (rejouée à DOMContentLoaded).
const THEME_COLOR = `function c(){try{var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}var v=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();if(v)m.content=v}catch(e){}}`;

// Script inline du <head> : même clé et même règle que loadTheme, exécuté
// avant la première peinture pour éviter un flash du mauvais thème.
export const THEME_SCRIPT = `(function(){var t;try{t=JSON.parse(localStorage.getItem(${JSON.stringify(PREFIX + KEY)}))}catch(e){}document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");${THEME_COLOR}c();try{document.addEventListener("DOMContentLoaded",c)}catch(e){}})()`;
