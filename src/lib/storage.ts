// Progression gardée dans le navigateur. Si localStorage est absent (rendu
// serveur), bloqué (navigation privée, Safari strict), plein, ou contient
// une valeur illisible, on avale l'erreur : le site marche, la progression
// ne se garde juste pas.
export const PREFIX = "maestro:v1:";

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = globalThis.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    // undefined ou fonction : stringify renvoie undefined. Objet circulaire :
    // il lance. Dans les deux cas on n'écrit rien, l'ancienne valeur reste.
    const json = JSON.stringify(value);
    if (json === undefined) return;
    globalThis.localStorage.setItem(PREFIX + key, json);
  } catch {}
}

export function remove(key: string): void {
  try {
    globalThis.localStorage.removeItem(PREFIX + key);
  } catch {}
}
