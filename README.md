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

## Stack

Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Motion, Phosphor Icons, Vitest.

## Documentation

- Design : [docs/superpowers/specs/2026-11-22-maestro-design.md](docs/superpowers/specs/2026-11-22-maestro-design.md)
- Plan d'implémentation : [docs/superpowers/plans/2026-11-22-maestro.md](docs/superpowers/plans/2026-11-22-maestro.md)
