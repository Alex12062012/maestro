// Séances cochées "fait", gardées dans le navigateur sous la clé `done` :
// une liste d'identifiants de séance, ex. ["w1-lundi", "w1-mardi"].
import { DAYS, PROGRAM, sessionId } from "@/content/program";
import { load, save } from "@/lib/storage";

export const PROGRESS_KEY = "done";

const SESSION_IDS = new Set(PROGRAM.flatMap((w) => DAYS.map((d) => sessionId(w.week, d))));

/** Coche la séance si elle ne l'est pas, la décoche sinon. Ne modifie pas `done`. */
export function toggleSession(done: string[], id: string): string[] {
  return done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
}

/** Nombre de séances cochées dans la semaine `week`, de 0 à 7. */
export function weekProgress(done: string[], week: number): number {
  return DAYS.filter((d) => done.includes(sessionId(week, d))).length;
}

/**
 * `load` ne vérifie pas la forme : on ne garde que les identifiants de séance
 * qui existent dans le programme, sans doublon. Le reste est ignoré.
 */
export function parseDone(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const ids = raw.filter((x): x is string => typeof x === "string" && SESSION_IDS.has(x));
  return [...new Set(ids)];
}

export function readDone(): string[] {
  return parseDone(load<unknown>(PROGRESS_KEY, null));
}

export function writeDone(done: string[]): void {
  save(PROGRESS_KEY, done);
}
