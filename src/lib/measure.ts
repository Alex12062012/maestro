// Saisie et stockage des tests de référence (page Suivi). Les mesures sont
// gardées dans le navigateur sous la clé `measures`, par semaine de test.
import { BENCHMARKS, type Benchmark, type Unit } from "@/content/benchmarks";
import { load, save } from "@/lib/storage";

export const CHECKPOINTS = ["w1", "w6", "w12"] as const;
export type Checkpoint = (typeof CHECKPOINTS)[number];
export type Measures = Record<Checkpoint, Record<string, number>>;

export const MEASURES_KEY = "measures";

export type ParsedMeasure = { ok: true; value: number } | { ok: false; error: string };

// Chiffres, avec au plus une partie décimale après une virgule ou un point.
const NUMBER = /^\d+(?:[.,]\d+)?$/;

const fail = (error: string): ParsedMeasure => ({ ok: false, error });

/**
 * Lit ce que le joueur a tapé. Virgule ou point décimal acceptés. Refuse le
 * vide, le négatif et le texte. Jongles et notes /10 en nombres entiers,
 * notes bornées de 0 à 10, temps plus grands que 0.
 */
export function parseMeasure(raw: string, unit: Unit): ParsedMeasure {
  const text = raw.trim();
  if (text === "") return fail("Entre ton résultat.");
  if (/^-\s*\d/.test(text)) return fail("Un résultat ne peut pas être négatif.");
  if (!NUMBER.test(text)) {
    return fail(
      unit === "s"
        ? "Entre un nombre, par exemple 3,4."
        : "Entre un nombre entier, par exemple 12.",
    );
  }

  const value = Number(text.replace(",", "."));
  if (unit === "s") {
    return value > 0 ? { ok: true, value } : fail("Un temps doit être plus grand que 0.");
  }
  if (!Number.isInteger(value)) {
    return fail(
      unit === "reps"
        ? "Les jongles se comptent en nombre entier."
        : "La note est un nombre entier, de 0 à 10.",
    );
  }
  if (unit === "/10" && value > 10) return fail("La note va de 0 à 10.");
  return { ok: true, value };
}

/**
 * Écart entre la première et la dernière mesure, arrondi au centième.
 * `improved` dépend du sens du test : moins de secondes, plus de jongles.
 */
export function delta(
  first: number,
  last: number,
  better: Benchmark["better"],
): { value: number; improved: boolean } {
  const value = Math.round((last - first) * 100) / 100 || 0;
  return { value, improved: better === "higher" ? value > 0 : value < 0 };
}

const UNIT_OF = new Map(BENCHMARKS.map((b) => [b.id, b.unit]));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Trois relevés vides, un nouvel objet à chaque appel. */
export function emptyMeasures(): Measures {
  return { w1: {}, w6: {}, w12: {} };
}

/**
 * `load` ne vérifie pas la forme : on garde seulement les semaines et les
 * tests connus, avec des valeurs qui passeraient la saisie. Le reste tombe.
 */
export function parseMeasures(raw: unknown): Measures {
  const out = emptyMeasures();
  if (!isRecord(raw)) return out;
  for (const cp of CHECKPOINTS) {
    const week = raw[cp];
    if (!isRecord(week)) continue;
    for (const [id, value] of Object.entries(week)) {
      const unit = UNIT_OF.get(id);
      if (!unit || typeof value !== "number" || !Number.isFinite(value)) continue;
      if (parseMeasure(String(value), unit).ok) out[cp][id] = value;
    }
  }
  return out;
}

export function readMeasures(): Measures {
  return parseMeasures(load<unknown>(MEASURES_KEY, null));
}

export function writeMeasures(measures: Measures): void {
  save(MEASURES_KEY, measures);
}
