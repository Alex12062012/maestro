// Compteur anonyme, par Vercel Web Analytics. Seul le nom de l'événement
// part, sans aucune propriété : ni identifiant, ni score, ni progression.
// Bloqué (bloqueur de pub) ou en erreur, l'envoi échoue en silence : l'appel
// ne lève jamais et l'interface ne change pas.
import { track as send } from "@vercel/analytics";
import { load, save } from "@/lib/storage";

export type EventName = "test_done" | "program_started" | "week_done";

export function track(type: EventName): void {
  try {
    send(type);
  } catch {}
}

// Clés déjà envoyées par ce navigateur, ex. ["program_started", "week_done:3"].
const SENT_KEY = "sent";

/**
 * Envoie l'événement une seule fois par navigateur pour la clé `once`
 * (gardée en local, jamais envoyée). Si localStorage est bloqué, rien ne se
 * garde : l'événement part à chaque fois.
 */
export function trackOnce(type: EventName, once: string = type): void {
  const raw = load<unknown>(SENT_KEY, []);
  const sent = Array.isArray(raw) ? raw : [];
  if (sent.includes(once)) return;
  save(SENT_KEY, [...sent, once]);
  track(type);
}
