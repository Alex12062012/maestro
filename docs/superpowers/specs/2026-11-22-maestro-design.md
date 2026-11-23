# MAESTRO : refonte complète, design

Date : 2026-11-22
Statut : à valider

## Intention

Refaire maestro10.lovable.app pour un pote. Le site actuel est une page unique générée avec Lovable : il se voit fait à la va-vite (dégradé bleu, emojis en titres, cartes arrondies, Coach IA à réponses préécrites, curseurs du test pré-réglés à 3).

But : un outil gratuit qui aide un joueur de foot lambda de 13-14 ans à progresser sur 12 semaines, avec un rendu professionnel et une vraie direction artistique. Succès = nombre d'utilisateurs.

## Objectifs

- Test Maestro qui donne un vrai profil sur 4 piliers (Technique, Physique, Mental, Vision).
- Programme complet de 12 semaines, séance par séance, avec fiches d'exercices.
- Suivi de progression (tests semaines 1, 6, 12) qui se remplit et s'affiche en graphique.
- Rendu qui ne ressemble pas à un site généré : DA "performance et scientifique".
- 100 % gratuit pour l'utilisateur.

## Non-objectifs (pour l'instant)

- Pas de comptes utilisateurs (option A validée).
- Pas de Coach IA, pas d'appel à une IA à l'exécution.
- Pas d'abonnement, pas de Stripe.
- Pas de pubs tant qu'il n'y a pas de compte pub (au nom d'un majeur). Rien n'est préparé côté code pour les pubs : on l'ajoutera quand le compte existera.
- Pas de nom de domaine : on reste sur l'adresse Vercel.

## Anti-objectifs (échec même si "ça marche")

- Le site a l'air vibe-codé : néon, fluo, dégradés violets/bleus, emojis en icônes, trois cartes identiques, look "slop IA".
- Le site collecte des données personnelles de mineurs.
- Les exercices sont dangereux pour un ado (charges lourdes, volumes d'adulte).

## Contraintes

- Public 13-14 ans, ce sont les parents qui décident : le site doit rassurer un parent autant que motiver un ado.
- Légal France : pas de données personnelles, donc pas de bandeau cookies tant qu'aucun traceur non essentiel n'est posé. Mentions légales + politique de confidentialité obligatoires. Avertissement santé (pas un suivi médical, renvoi au 3114, 15, 112).
- Coût : zéro à l'usage (offres gratuites Vercel et Supabase), code minimal.
- Commits directement sur main (Vercel déploie la prod depuis main).

## Approches envisagées

- **A. Sans compte (retenue).** Progression stockée dans le navigateur (localStorage). Aucune donnée personnelle. Supabase sert uniquement à compter des événements anonymes. Limite : progression non synchronisée entre appareils.
- **B. Avec comptes.** Synchro multi-appareils, mais données de mineurs : consentement parental par mail, droit à l'effacement, friction forte à l'inscription. Reporté.

## Décisions validées par Alexandre

- Option A, sans compte.
- Pas de bleu comme couleur globale (bleu en touche OK), fluo permis à petite dose, pas de look néon ni IA. Ambiance performance et scientifique.
- Programme et visuels faits par Claude.
- Pas de Coach IA.
- Modèle économique futur : pub modérée, à brancher plus tard.

## Le site

### Pages

1. **Accueil `/`**
   - Hero en deux colonnes : grande photo d'un jeune joueur à droite, titre + une phrase + bouton "Faire le test" à gauche.
   - "Tu te reconnais ?" : les 4 situations du site actuel, en liste typographique (pas en cartes).
   - La méthode : les 4 piliers en grille asymétrique avec une photo par pilier.
   - Comment ça marche : test, programme, mesure. Trois étapes nommées par leur verbe.
   - Bloc parents : gratuit, sans inscription, aucune donnée collectée, exercices adaptés à l'âge.
   - Pied de page : liens légaux + avertissement santé.

2. **Test `/test`**
   - Une question par écran, 10 questions, barre de progression.
   - Échelle 1 à 5 en gros boutons, aucune valeur pré-sélectionnée (corrige le bug du site actuel).
   - Résultat : profil nommé (4 à 5 profils), score par pilier en graphique radar, point fort, point à travailler, bouton "Commencer le programme".
   - Résultat gardé dans le navigateur.

3. **Programme `/programme`**
   - Vue des 12 semaines en 4 phases (Bases, Vitesse, Confiance, Maestro).
   - Page semaine `/programme/semaine/[n]` : séances du lundi au dimanche, case "fait" par séance, progression gardée dans le navigateur.
   - Page séance : échauffement, exercices (liens vers les fiches), durée, routine mentale du jour.

4. **Exercices `/exercices` et `/exercices/[slug]`**
   - Bibliothèque d'environ 30 exercices filtrable par pilier.
   - Fiche : schéma, objectif, consignes en étapes, séries et répétitions, erreurs fréquentes, version plus facile / plus dure.

5. **Suivi `/suivi`**
   - Tests de référence : jongles pied droit / gauche, slalom 6 plots, sprint 20 m, finition 10 frappes, confiance /10.
   - Saisie aux semaines 1, 6 et 12, graphique d'évolution, comparaison au test de départ.

6. **Légal `/mentions-legales`, `/confidentialite`**

### Contenu

- Programme : écrit par Claude, exercices au poids du corps, volumes adaptés à 13-14 ans, progression douce. Avertissement visible : relecture par un éducateur sportif recommandée.
- Le contenu (programme, exercices, profils du test) vit dans des fichiers de données TypeScript, pas dans une base : rien à requêter, tout est généré statiquement.

### Direction artistique (call de Claude)

Lecture : site d'entraînement sportif pour ados et parents, langage "labo de performance", proche d'une fiche technique ou d'un relevé de mesures, pas d'une appli de jeu.

- **Couleurs** : fond gris froid très clair, texte presque noir, sections sombres anthracite pour le rythme. Un seul accent : vert-jaune fluo (comme les données des capteurs GPS de sport), utilisé à petites doses (chiffres clés, graphiques, état actif) et seulement sur fond sombre, où il reste lisible. Sur fond clair, l'accent devient l'encre presque noire. Le bleu reste permis en touche ponctuelle (ex. une courbe de graphique), jamais comme couleur dominante façon Lovable.
- **Typo** : titres en grotesque large et condensée (Archivo, axe de largeur), données et chiffres en mono (JetBrains Mono ou Geist Mono). Pas d'Inter, pas de serif.
- **Formes** : angles droits ou très légèrement arrondis (2-4 px) partout, pour casser le look "cartes arrondies Lovable".
- **Motifs** : lignes de terrain, grilles de mesure, chiffres en mono comme sur un relevé de capteur. Utilisés avec retenue.
- **Images** : photos de foot libres de droits (Unsplash / Pexels, licences vérifiées) pour le hero et les piliers. Schémas de terrain vectoriels (vue de dessus, plots, ballon, trajectoires) pour les exercices avec ballon. Photos pour les exercices au sol (gainage, squats).
- **Icônes** : Phosphor, une seule famille. Zéro emoji.
- **Animations** : apparition au scroll sobre, chiffres qui défilent sur le résultat du test, tracé des schémas qui se dessine, retour tactile sur les boutons. Tout désactivé si "réduire les animations" est actif.
- **Thème** : clair uniquement pour l'instant, couleurs en variables pour pouvoir ajouter un mode sombre plus tard.

### Technique

- Next.js (App Router), Tailwind v4, Motion pour les animations, Phosphor pour les icônes, `next/font` pour les polices.
- Tout est statique sauf l'envoi des compteurs.
- Progression et résultat du test : `localStorage`, avec un fallback silencieux si le navigateur le bloque.
- Supabase : une table `events` (type d'événement + date, rien d'autre), insertion seule via la clé publique, lecture interdite côté public (RLS). Événements : test terminé, programme commencé, semaine terminée. Pas d'identifiant, pas d'IP stockée.
- Déploiement : GitHub (repo créé par Alexandre) vers Vercel, commits sur main.

### Skills utilisés

- Avant de coder : ponytail (code minimal), ui-ux-pro-max, design-taste-frontend, impeccable (lire `craft-floor.md` avant chaque modif d'UI).
- Pendant : animate et high-end-visual-design pour les animations et la finition.
- Textes du site : anti-ai-slop sur chaque texte visible.
- Avant livraison : impeccable `critique` puis `audit`, web-design-guidelines, design:accessibility-review.
- Écartés : minimalist-ui (palette beige chaude contraire à la DA), lottie (inutile ici).

## Laissé au builder

- Nombre exact et noms des profils du test, formule de score par pilier.
- Choix précis des photos et des teintes exactes dans la palette ci-dessus.
- Découpage en composants.

## Décisions (23/11/2026)

Prises après la validation de ce document. Le texte ci-dessus est gardé tel quel ; là où il diffère, ces décisions priment.

- **Thème sombre par défaut** (décision d'Alexandre). Le bouton soleil/lune du header passe en clair, et le choix est gardé dans le navigateur. Remplace "clair uniquement" (section Direction artistique). Les couleurs restent des variables, testées en contraste dans les deux thèmes.
- **Vercel Web Analytics à la place de Supabase** (décision d'Alexandre : son organisation Supabase a déjà deux projets actifs, un troisième serait payant). Aucune table `events`, aucun projet Supabase ; le paquet `@supabase/supabase-js` est retiré. Remplace le paragraphe Supabase de la section Technique et la mention "offres gratuites Vercel et Supabase".
- **Événements personnalisés réservés à Pro ou Enterprise.** Le site envoie `test_done`, `program_started` et `week_done` (nom seul, adresse réduite à l'origine du site), mais sur l'offre gratuite Hobby, Vercel ne les enregistre pas : seules les pages vues sont comptées. Passer à Pro ou compter les étapes autrement est une décision produit d'Alexandre.
