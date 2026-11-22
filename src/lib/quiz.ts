import { PILLARS, QUESTIONS, type Pillar, type ProfileId } from "@/content/quiz";
import { load, remove, save } from "@/lib/storage";

export type Answer = 1 | 2 | 3 | 4 | 5;

export type QuizResult = {
  pillars: Record<Pillar, number>;
  total: number;
  profile: ProfileId;
};

/**
 * Ce qui est gardé sous la clé `quiz`. `current` va de 0 à 12 :
 * l'index de la question affichée, ou 12 quand le test est fini.
 */
export type QuizState = { answers: Record<string, Answer>; current: number };

export const QUIZ_KEY = "quiz";

/** À ne pas modifier : toujours copier avant d'écrire dedans. */
export const FRESH_QUIZ: QuizState = { answers: {}, current: 0 };

const QUESTION_IDS = new Set(QUESTIONS.map((q) => q.id));

function isAnswer(value: unknown): value is Answer {
  return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 5;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Pilier le plus bas ; à égalité, le premier dans l'ordre de PILLARS. */
export function weakestPillar(pillars: Record<Pillar, number>): Pillar {
  return PILLARS.reduce((low, p) => (pillars[p] < pillars[low] ? p : low));
}

/**
 * Pilier le plus haut ; à égalité, le premier dans l'ordre de PILLARS.
 * `exclude` écarte le pilier à travailler, pour ne jamais l'annoncer aussi
 * comme point fort quand tous les scores sont égaux.
 */
export function strongestPillar(pillars: Record<Pillar, number>, exclude?: Pillar): Pillar {
  const candidates = PILLARS.filter((p) => p !== exclude);
  return candidates.reduce((high, p) => (pillars[p] > pillars[high] ? p : high));
}

/**
 * Score de 0 à 100 par pilier : moyenne des réponses du pilier (6 - v pour
 * les questions inversées), ramenée de [1, 5] à [0, 100] et arrondie.
 * Lance si une réponse manque ou sort de l'échelle.
 */
export function scoreQuiz(answers: Record<string, Answer>): QuizResult {
  const sum: Record<Pillar, number> = { technique: 0, physique: 0, mental: 0, vision: 0 };
  const count: Record<Pillar, number> = { technique: 0, physique: 0, mental: 0, vision: 0 };

  for (const q of QUESTIONS) {
    const value: unknown = answers[q.id];
    if (!isAnswer(value)) {
      throw new Error(`Réponse manquante ou invalide pour la question "${q.id}"`);
    }
    sum[q.pillar] += q.reversed ? 6 - value : value;
    count[q.pillar] += 1;
  }

  // (moyenne - 1) / 4 * 100, écrit sans passer par la moyenne décimale.
  const pillars = Object.fromEntries(
    PILLARS.map((p) => [p, Math.round(((sum[p] - count[p]) * 25) / count[p])]),
  ) as Record<Pillar, number>;

  const total = Math.round(PILLARS.reduce((acc, p) => acc + pillars[p], 0) / PILLARS.length);
  const profile: ProfileId = PILLARS.every((p) => pillars[p] >= 75)
    ? "maestro"
    : weakestPillar(pillars);

  return { pillars, total, profile };
}

export function isComplete(state: QuizState): boolean {
  return state.current === QUESTIONS.length;
}

/**
 * `load` ne vérifie pas la forme : une valeur abîmée ou d'une ancienne
 * version repart d'un test vierge au lieu de casser la page.
 */
export function parseQuizState(raw: unknown): QuizState {
  const fresh = (): QuizState => ({ answers: {}, current: 0 });
  if (!isRecord(raw) || !isRecord(raw.answers)) return fresh();

  const answers: Record<string, Answer> = {};
  for (const [id, value] of Object.entries(raw.answers)) {
    if (!QUESTION_IDS.has(id) || !isAnswer(value)) return fresh();
    answers[id] = value;
  }

  const current = raw.current;
  if (
    typeof current !== "number" ||
    !Number.isInteger(current) ||
    current < 0 ||
    current > QUESTIONS.length
  ) {
    return fresh();
  }
  // Toutes les questions avant celle en cours doivent avoir une réponse.
  if (QUESTIONS.slice(0, current).some((q) => answers[q.id] === undefined)) return fresh();

  return { answers, current };
}

export function readQuiz(): QuizState {
  return parseQuizState(load<unknown>(QUIZ_KEY, null));
}

export function writeQuiz(state: QuizState): void {
  save(QUIZ_KEY, state);
}

export function clearQuiz(): void {
  remove(QUIZ_KEY);
}

/** Résultat du test s'il est fini, sinon null (pour `/programme` par exemple). */
export function readQuizResult(): QuizResult | null {
  const state = readQuiz();
  return isComplete(state) ? scoreQuiz(state.answers) : null;
}
