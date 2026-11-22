// Bouton "Retour" d'une fiche : revenir à la page d'où vient le joueur (la
// semaine du programme, la bibliothèque...) quand elle est sur ce site, sinon
// suivre le lien de repli vers /exercices.

// Pages vues dans cet onglet depuis le dernier chargement complet. Au-delà
// d'une, la page précédente de l'historique est une page du site. Une même
// adresse rappelée deux fois de suite (effets doublés en développement) ne
// compte qu'une fois.
let visits = 0;
let lastPath: string | null = null;

export function recordVisit(pathname: string): void {
  if (pathname === lastPath) return;
  lastPath = pathname;
  visits += 1;
}

export function visitCount(): number {
  return visits;
}

export function shouldGoBack({
  visits,
  referrer,
  origin,
  historyLength,
}: {
  visits: number;
  referrer: string;
  origin: string;
  historyLength: number;
}): boolean {
  if (historyLength < 2) return false;
  if (visits > 1) return true;
  // Page chargée en entier depuis un lien du site (sans navigation client).
  if (!referrer) return false;
  try {
    return new URL(referrer).origin === origin;
  } catch {
    return false;
  }
}
