// Mise en forme partagée : numéros sur deux chiffres, nombres à la française,
// unités des tests de référence, doses des fiches.
import type { Unit } from "@/content/benchmarks";

/** 3 donne "03". */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Nombre à la française, 2 décimales au plus : 3.4 donne "3,4". Avec
 * `grouping: false`, pas d'espace des milliers : c'est la forme à remettre
 * dans un champ de saisie, que parseMeasure relira.
 */
export function formatNumber(value: number, { grouping = true } = {}): string {
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 2, useGrouping: grouping });
}

/** Unité affichée après une valeur : " s", "/10", rien pour les jongles. */
export function unitSuffix(unit: Unit): string {
  return unit === "s" ? " s" : unit === "/10" ? "/10" : "";
}

/**
 * "Semaines 1 à 3 : 3 séries de 20." devient une ligne étiquette / valeur.
 * L'espace avant les deux-points peut être insécable (typographie française).
 */
export function doseLines(dose: string): { label?: string; value: string }[] {
  return dose
    .split(/(?<=\.)\s+/)
    .filter(Boolean)
    .map((sentence) => {
      const m = /\s:\s/.exec(sentence);
      return m === null
        ? { value: sentence }
        : { label: sentence.slice(0, m.index), value: sentence.slice(m.index + m[0].length) };
    });
}
