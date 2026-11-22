// Contenu du test Maestro : questions, piliers et profils. Le calcul du score
// vit dans `@/lib/quiz`.

export type Pillar = "technique" | "physique" | "mental" | "vision";

export type ProfileId = "maestro" | Pillar;

/** Ordre fixe des piliers : affichage, radar et départage des égalités. */
export const PILLARS: readonly Pillar[] = ["technique", "physique", "mental", "vision"];

export const PILLAR_LABELS: Record<Pillar, string> = {
  technique: "Technique",
  physique: "Physique",
  mental: "Mental",
  vision: "Vision",
};

/** Libellés de l'échelle, de 1 (jamais) à 5 (tout le temps). */
export const SCALE = ["Jamais", "Rarement", "Parfois", "Souvent", "Tout le temps"] as const;

export type Question = {
  id: string;
  pillar: Pillar;
  text: string;
  /** true quand répondre "souvent" est mauvais signe : le score est inversé. */
  reversed: boolean;
};

// Ordre d'affichage : les piliers alternent pour ne pas enchaîner trois
// questions sur le même sujet.
export const QUESTIONS: Question[] = [
  {
    id: "controle",
    pillar: "technique",
    text: "Mon premier contrôle me laisse le ballon prêt à jouer, même quand la passe arrive fort.",
    reversed: false,
  },
  {
    id: "demarrage",
    pillar: "physique",
    text: "Sur un démarrage, je prends un mètre d'avance sur mon adversaire direct.",
    reversed: false,
  },
  {
    id: "stress",
    pillar: "mental",
    text: "Avant un match important, je stresse au point de moins bien jouer.",
    reversed: true,
  },
  {
    id: "regard",
    pillar: "vision",
    text: "Avant de recevoir le ballon, je regarde autour de moi pour savoir qui est libre.",
    reversed: false,
  },
  {
    id: "pied-faible",
    pillar: "technique",
    text: "J'évite de jouer du pied faible, même quand c'est lui qui est le mieux placé.",
    reversed: true,
  },
  {
    id: "fin-de-match",
    pillar: "physique",
    text: "Dans les dix dernières minutes du match, j'ai encore les jambes pour sprinter.",
    reversed: false,
  },
  {
    id: "erreur",
    pillar: "mental",
    text: "Après une erreur, j'y pense encore plusieurs actions plus tard.",
    reversed: true,
  },
  {
    id: "solution",
    pillar: "vision",
    text: "Quand le ballon m'arrive, je sais déjà ce que je vais en faire.",
    reversed: false,
  },
  {
    id: "passe-longue",
    pillar: "technique",
    text: "Mes passes longues arrivent dans les pieds du coéquipier que je visais.",
    reversed: false,
  },
  {
    id: "souffle",
    pillar: "physique",
    text: "Pendant un match, je dois marcher pour reprendre mon souffle.",
    reversed: true,
  },
  {
    id: "demander",
    pillar: "mental",
    text: "Je demande le ballon même quand on est menés ou que je viens de rater.",
    reversed: false,
  },
  {
    id: "tete-baissee",
    pillar: "vision",
    text: "Je joue tête baissée et je rate le coéquipier démarqué.",
    reversed: true,
  },
];

export type Profile = {
  name: string;
  summary: string;
  /** Ce sur quoi le joueur peut s'appuyer. Toujours vrai pour ce profil. */
  strength: string;
  /** Le pilier à travailler en premier, et où il se travaille dans le programme. */
  focus: string;
};

// Un profil de pilier veut dire : c'est ton score le plus bas. Les textes ne
// prétendent rien sur les autres piliers, sauf qu'ils sont au-dessus.
export const PROFILES: Record<ProfileId, Profile> = {
  maestro: {
    name: "Le Maestro",
    summary:
      "Tes quatre piliers sont à 75 ou plus. Les 12 semaines vont servir à tenir ce niveau contre des adversaires plus forts.",
    strength:
      "Aucun pilier sous 75 : un adversaire ne peut pas te cibler sur un point faible.",
    focus:
      "Ton pilier le plus bas reste celui à pousser. Suis le programme complet et passe à la version plus dure d'un exercice dès qu'il devient facile.",
  },
  technique: {
    name: "Le Combattant",
    summary:
      "Ton score le plus bas est en technique. Le ballon ne fait pas encore toujours ce que tu veux : un contrôle qui rebondit trop loin, une passe qui part à côté.",
    strength:
      "Le reste de ton jeu est devant ta technique. Quand le ballon t'échappe, tu as de quoi compenser avec tes courses, ton placement ou ton mental.",
    focus:
      "Contrôle orienté contre un mur, conduite entre les plots, pied faible. Ce sont les séances du lundi et du jeudi, et elles se font seul avec un ballon.",
  },
  physique: {
    name: "Le Technicien",
    summary:
      "Ton score le plus bas est en physique. Avec le ballon tu t'en sors, c'est dans les courses et en fin de match que tu perds du terrain.",
    strength:
      "Tes pieds, ta tête ou ta lecture du jeu sont devant ton physique. Tu peux faire la différence sans courir plus que les autres.",
    focus:
      "Sprints courts, appuis, gainage et squats, au poids du corps. C'est la séance du mardi, et elle monte un peu chaque semaine.",
  },
  mental: {
    name: "L'Artiste",
    summary:
      "Ton score le plus bas est en mental. Un match important ou une erreur peuvent te faire jouer en dessous de ton niveau.",
    strength:
      "Ton jeu avec et sans ballon est devant ton mental. Le niveau est là, il reste à le sortir aussi les jours de pression.",
    focus:
      "Respiration 4-7-8, routine RESET après une erreur, visualisation la veille du match. Quelques minutes par jour, surtout le vendredi et le samedi.",
  },
  vision: {
    name: "Le Soliste",
    summary:
      "Ton score le plus bas est en vision. Tu joues souvent tête baissée, alors tu vois tard le coéquipier libre.",
    strength:
      "Ta technique, ton physique ou ton mental sont devant ta vision. C'est sur eux que tu t'appuies pendant que tu apprends à lever la tête.",
    focus:
      "Regarder par-dessus l'épaule avant chaque réception, conduire tête haute, analyser en vidéo un joueur à ton poste. C'est la séance du mercredi.",
  },
};
