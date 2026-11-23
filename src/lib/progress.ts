// Progression gardée dans le navigateur, sur deux clés :
// - `done` : journées faites, ex. ["w1-lundi"] (format de sessionId) ;
// - `done-ex` : exercices cochés, ex. ["w3-mardi:squats"].
// Une journée est faite quand tous ses exercices sont cochés ; toute la
// cohérence journée / exercices passe par les fonctions pures de ce fichier.
import { DAYS, PROGRAM, sessionId } from "@/content/program";
import { load, save } from "@/lib/storage";

export const PROGRESS_KEY = "done";
export const EXERCISES_KEY = "done-ex";

export type Progress = { days: string[]; exercises: string[] };

/** Progression vide, figée : on la remplace, on ne l'écrit jamais. */
export const EMPTY_PROGRESS: Progress = Object.freeze({
  days: Object.freeze([]) as unknown as string[],
  exercises: Object.freeze([]) as unknown as string[],
});

/** Une séance et ses exercices, chaque slug une seule fois. */
export type SessionRef = { id: string; slugs: string[] };

/**
 * Un exercice répété dans la même journée (ex. un échauffement cité deux
 * fois) ne compte qu'une fois : les identifiants sont par slug, dédoublonnés.
 */
export function sessionRef(id: string, exercises: readonly string[]): SessionRef {
  return { id, slugs: [...new Set(exercises)] };
}

/** Toutes les séances du programme, dans l'ordre. */
export const ALL_SESSIONS: SessionRef[] = PROGRAM.flatMap((w) =>
  w.days.map((s) => sessionRef(sessionId(w.week, s.day), s.exercises)),
);

const SESSION_IDS = new Set(ALL_SESSIONS.map((s) => s.id));

/** Identifiant d'un exercice dans une journée, ex. "w3-mardi:squats". */
export function exerciseId(session: string, slug: string): string {
  return `${session}:${slug}`;
}

/** Coche la séance si elle ne l'est pas, la décoche sinon. Ne modifie pas `done`. */
export function toggleSession(done: string[], id: string): string[] {
  return done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
}

/** Nombre de journées faites dans la semaine `week`, de 0 à 7. */
export function weekProgress(done: string[], week: number): number {
  return DAYS.filter((d) => done.includes(sessionId(week, d))).length;
}

/** Semaines dont toutes les journées sont faites dans `after` et pas dans `before`. */
export function finishedWeeks(before: string[], after: string[]): number[] {
  return PROGRAM.map((w) => w.week).filter(
    (w) => weekProgress(before, w) < DAYS.length && weekProgress(after, w) === DAYS.length,
  );
}

export function isDayDone(p: Progress, session: string): boolean {
  return p.days.includes(session);
}

export function isExerciseDone(p: Progress, session: string, slug: string): boolean {
  return p.exercises.includes(exerciseId(session, slug));
}

/**
 * Remet la progression d'aplomb, séance par séance, dans l'ordre du programme :
 * - journée cochée sans aucun exercice coché (progression d'avant les cases
 *   par exercice) : tous ses exercices comptent comme cochés ;
 * - sinon, la journée est faite si et seulement si tous ses exercices le sont ;
 * - une journée sans exercice garde sa seule case.
 */
export function normalizeProgress(p: Progress, sessions: SessionRef[] = ALL_SESSIONS): Progress {
  const days = new Set(p.days);
  const exercises = new Set(p.exercises);
  const out: Progress = { days: [], exercises: [] };
  for (const s of sessions) {
    const ids = s.slugs.map((slug) => exerciseId(s.id, slug));
    const checked = ids.filter((id) => exercises.has(id));
    if (ids.length === 0) {
      if (days.has(s.id)) out.days.push(s.id);
      continue;
    }
    const legacy = days.has(s.id) && checked.length === 0;
    const kept = legacy ? ids : checked;
    out.exercises.push(...kept);
    if (kept.length === ids.length) out.days.push(s.id);
  }
  return out;
}

/** Coche ou décoche un exercice ; la journée suit. Exercice hors séance : rien ne change. */
export function toggleExercise(
  p: Progress,
  session: string,
  slug: string,
  sessions: SessionRef[] = ALL_SESSIONS,
): Progress {
  const ref = sessions.find((s) => s.id === session);
  if (!ref || !ref.slugs.includes(slug)) return p;
  const id = exerciseId(session, slug);
  const exercises = p.exercises.includes(id)
    ? p.exercises.filter((x) => x !== id)
    : [...p.exercises, id];
  // La journée est recalculée depuis ses exercices.
  return normalizeProgress({ days: p.days.filter((d) => d !== session), exercises }, sessions);
}

/**
 * "Terminer la journée" : coche tous ses exercices ; si la journée était déjà
 * faite, les décoche tous.
 */
export function toggleDay(
  p: Progress,
  session: string,
  sessions: SessionRef[] = ALL_SESSIONS,
): Progress {
  const ref = sessions.find((s) => s.id === session);
  if (!ref) return p;
  const ids = ref.slugs.map((slug) => exerciseId(session, slug));
  const others = p.exercises.filter((x) => !ids.includes(x));
  const days = p.days.filter((d) => d !== session);
  return isDayDone(p, session)
    ? normalizeProgress({ days, exercises: others }, sessions)
    : normalizeProgress({ days: [...days, session], exercises: [...others, ...ids] }, sessions);
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

const EXERCISE_IDS = new Set(
  ALL_SESSIONS.flatMap((s) => s.slugs.map((slug) => exerciseId(s.id, slug))),
);

/** Même chose pour `done-ex` : seulement les exercices réellement au programme de la journée. */
export function parseDoneExercises(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const ids = raw.filter((x): x is string => typeof x === "string" && EXERCISE_IDS.has(x));
  return [...new Set(ids)];
}

export function readDone(): string[] {
  return parseDone(load<unknown>(PROGRESS_KEY, null));
}

export function writeDone(done: string[]): void {
  save(PROGRESS_KEY, done);
}

/** Les deux clés relues, vérifiées et remises d'aplomb (migration comprise). */
export function readProgress(): Progress {
  return normalizeProgress({
    days: readDone(),
    exercises: parseDoneExercises(load<unknown>(EXERCISES_KEY, null)),
  });
}

export function writeProgress(p: Progress): void {
  save(PROGRESS_KEY, p.days);
  save(EXERCISES_KEY, p.exercises);
}
