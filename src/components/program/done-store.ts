import { useSyncExternalStore } from "react";
import { readDone, toggleSession, writeDone } from "@/lib/progress";

// Séances cochées, partagées entre tous les composants de la page (cases,
// compteurs de semaine). Lues une fois dans le navigateur, puis gardées en
// mémoire : si localStorage est bloqué, les cases marchent quand même pour la
// visite en cours, la progression ne se garde juste pas.

const EMPTY: string[] = [];
let current: string[] | null = null;
// Liste lue au chargement : tant que c'est elle, rien n'a changé pendant la visite.
let firstRead: string[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

// Un autre onglet a coché une séance : on relit.
function onStorage(e: StorageEvent) {
  if (e.key !== null && !e.key.endsWith(":done")) return;
  current = readDone();
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

function getSnapshot(): string[] {
  if (current === null) {
    current = readDone();
    firstRead = current;
  }
  return current;
}

// Rendu serveur : rien de coché. Le navigateur prend le relais à l'hydratation.
function getServerSnapshot(): string[] {
  return EMPTY;
}

/** Exposé pour les tests ; les composants passent par useDone. */
export const doneStore = { subscribe, getSnapshot, getServerSnapshot };

export function useDone(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function toggleDone(id: string): void {
  current = toggleSession(getSnapshot(), id);
  writeDone(current);
  emit();
}

/**
 * Vrai si la liste vient d'un changement pendant la visite (case cochée ici
 * ou dans un autre onglet), faux pour l'état lu au chargement. Sert à ne pas
 * annoncer "Semaine terminée" à l'arrivée sur la page.
 */
export function changedThisVisit(snapshot: string[]): boolean {
  return snapshot !== EMPTY && snapshot !== firstRead;
}
