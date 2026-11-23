# MAESTRO

Site gratuit pour aider les joueurs de foot de 13-14 ans à progresser sur 12 semaines : un test de profil sur 4 piliers (technique, physique, mental, vision), un programme séance par séance, des fiches d'exercices et un suivi de progression.

Pas de compte, aucune donnée personnelle : la progression reste dans le navigateur (`localStorage`).

Production : https://maestro-nine-chi.vercel.app (déployée par Vercel à chaque push sur `main`).

## Lancer le projet

```bash
npm install
npm run dev     # serveur de développement sur http://localhost:3000
npm test        # tests Vitest
npm run build   # build de production
```

Ne pas lancer `npm run build` pendant que `npm run dev` tourne : le build écrase `.next`.

## Thème

Sombre par défaut pour tout le monde. Le bouton soleil/lune du header passe en clair ; le choix est gardé dans le navigateur (`maestro:v1:theme`). Toutes les couleurs sont des variables dans `src/app/globals.css` (`:root` = sombre, `:root[data-theme="light"]` = clair) : aucun composant ne code de couleur en dur, un test le vérifie.

## Mesure d'audience et confidentialité

- **Outil** : Vercel Web Analytics (`@vercel/analytics`), branché par `src/components/SiteAnalytics.tsx` dans le layout. Activé sur le projet Vercel `maestro` le 23/11/2026 par l'API (`POST /web/insights/toggle`, `value: true`) ; `value: false` ou le dashboard le coupe.
- **Pages vues** : comptées automatiquement. Offre Hobby : 50 000 événements par mois inclus ; à la limite, la collecte se met en pause, rien n'est facturé.
- **Trois événements** : `test_done`, `program_started`, `week_done`, envoyés par `track()` / `trackOnce()` (`src/lib/track.ts`) avec leur seul nom. `beforeSend` réduit l'adresse de la page à l'origine du site avant l'envoi d'un événement (les pages vues gardent leur adresse). `trackOnce` garde les clés déjà envoyées sous `maestro:v1:sent`.
- **Limite** : Vercel n'enregistre les événements personnalisés qu'avec un abonnement Pro ou Enterprise (https://vercel.com/docs/analytics/custom-events). Sur l'offre gratuite actuelle, seules les pages vues sont comptées ; les appels restent dans le code, sans effet de bord. Ne pas changer d'offre sans décision d'Alexandre.
- **Script** : la version 2 du paquet charge le script depuis un chemin propre au build (par exemple `/c3e51d8842c5b11c/script.js` sur la prod du 23/11/2026) ; `/_vercel/insights/script.js` répond aussi. Bloqué par un bloqueur de pub, le site marche pareil (testé).
- **Navigateur** : aucun cookie. Clés `localStorage` (préfixe `maestro:v1:`) : `theme`, `quiz`, `done`, `done-ex`, `measures`, `measures-draft` (saisie du suivi pas encore enregistrée), `sent`.
- **Pages légales** : `/mentions-legales` et `/confidentialite`. Les champs `[nom de l'éditeur]` et `[contact]` restent à remplir par l'éditeur ; `src/app/legal.test.tsx` vérifie leur présence et devra être mis à jour en même temps. Le texte de `/confidentialite` sur Vercel reprend https://vercel.com/docs/analytics/privacy-policy, sans rien y ajouter.

## Stack

Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Motion, Phosphor Icons, Vitest.

## Documentation

- Design : [docs/superpowers/specs/2026-11-22-maestro-design.md](docs/superpowers/specs/2026-11-22-maestro-design.md)
- Plan d'implémentation : [docs/superpowers/plans/2026-11-22-maestro.md](docs/superpowers/plans/2026-11-22-maestro.md)
