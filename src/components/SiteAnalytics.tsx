"use client";

import { Analytics } from "@vercel/analytics/next";
import { beforeSend } from "@/lib/track";

// Vercel Web Analytics, avec le filtre qui retire le chemin des événements.
// Composant client : une fonction ne peut pas passer du layout (serveur) au
// composant <Analytics />.
export function SiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
