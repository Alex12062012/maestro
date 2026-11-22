import { useSyncExternalStore } from "react";
import {
  EMPTY_PROGRESS,
  readProgress,
  toggleDay,
  toggleExercise,
  writeProgress,
  type Progress,
} from "@/lib/progress";

// Progression (journées et exercices cochés), partagée entre tous les
// composants de la page. Lue une fois dans le navigateur, puis gardée en
// mémoire : si localStorage est bloqué, les cases marchent quand même pour la
// visite en cours, la progression ne se garde juste pas.

let current: Progress | null = null;
// Progression lue au chargement : tant que c'est elle, rien n'a changé pendant la visite.
let firstRead: Progress | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

// Un autre onglet a coché quelque chose : on relit les deux clés.
function onStorage(e: StorageEvent) {
  if (e.key !== null && !e.key.endsWith(":done") && !e.key.endsWith(":done-ex")) return;
  current = readProgress();
  emit();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Progress {
  if (current === null) {
    current = readProgress();
    firstRead = current;
  }
  return current;
}

// Rendu serveur : rien de coché. Le navigateur prend le relais à l'hydratation.
function getServerSnapshot(): Progress {
  return EMPTY_PROGRESS;
}

/** Exposé pour les tests ; les composants passent par useProgress. */
export const doneStore = { subscribe, getSnapshot, getServerSnapshot };

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function update(next: Progress) {
  if (next === current) return;
  current = next;
  writeProgress(next);
  emit();
}

/** Case d'un exercice ; la journée suit. */
export function toggleExerciseDone(session: string, slug: string): void {
  update(toggleExercise(getSnapshot(), session, slug));
}

/** "Terminer la journée" : tout cocher, ou tout décocher si elle était faite. */
export function toggleDayDone(session: string): void {
  update(toggleDay(getSnapshot(), session));
}

/**
 * Vrai si la progression vient d'un changement pendant la visite (case cochée
 * ici ou dans un autre onglet), faux pour l'état lu au chargement. Sert à ne
 * pas annoncer "Semaine terminée" à l'arrivée sur la page.
 */
export function changedThisVisit(snapshot: Progress): boolean {
  return snapshot !== EMPTY_PROGRESS && snapshot !== firstRead;
}
