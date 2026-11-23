// Compteur anonyme, par Vercel Web Analytics. `track` n'ajoute que le nom de
// l'événement, sans propriété (ni identifiant, ni score, ni progression), et
// `beforeSend` retire le chemin de la page avant l'envoi : voir
// /confidentialite pour ce qui part vraiment. Sur le plan Hobby de Vercel,
// les événements ne sont pas enregistrés (Pro ou Enterprise seulement).
// Bloqué (bloqueur de pub) ou en erreur, l'envoi échoue en silence : l'appel
// ne lève jamais et l'interface ne change pas.
import { track as send, type BeforeSendEvent } from "@vercel/analytics";
import { load, save } from "@/lib/storage";

export type EventName = "test_done" | "program_started" | "week_done";

export function track(type: EventName): void {
  try {
    send(type);
  } catch {}
}

/**
 * Filtre du script Vercel, appelé avant chaque envoi. Événement : l'adresse
 * de la page est réduite à l'origine du site (ni chemin, ni paramètres), pour
 * que `week_done` ne dise pas quelle semaine vient d'être finie. Page vue :
 * inchangée. Une erreur abandonne la mesure (null) au lieu de lever.
 */
export function beforeSend<E extends BeforeSendEvent>(event: E): E | null {
  try {
    if (event.type !== "event") return event;
    return { ...event, url: new URL(event.url).origin };
  } catch {
    return null;
  }
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
