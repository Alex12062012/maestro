// Programme de 12 semaines. Chaque séance cite des exercices de
// `@/content/exercises` par leur slug ; les doses par semaine sont dans les
// fiches. Volume : semaine 1 autour de 60 % de la semaine 12.

export const DAYS = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
] as const;

export type Day = (typeof DAYS)[number];

export type Session = {
  day: Day;
  title: string;
  minutes: number;
  exercises: string[];
  /** Routine mentale du jour. */
  mental: string;
};

export type Week = { week: number; days: Session[] };

export type Phase = { name: string; weeks: [number, number]; goal: string };

export const PHASES: Phase[] = [
  {
    name: "Bases",
    weeks: [1, 3],
    goal: "Poser les gestes : contrôle orienté, pied faible, gainage, et la routine RESET apprise par cœur.",
  },
  {
    name: "Vitesse",
    weeks: [4, 6],
    goal: "Refaire les mêmes gestes plus vite : démarrages, appuis, jeu en une touche et regard avant la réception.",
  },
  {
    name: "Confiance",
    weeks: [7, 9],
    goal: "Réussir quand ça compte : finition sous pression, pied faible en une touche, un objectif écrit pour chaque match.",
  },
  {
    name: "Maestro",
    weeks: [10, 12],
    goal: "Assembler les quatre piliers pour diriger le jeu, puis mesurer tes progrès aux tests de la semaine 12.",
  },
];

/** À lire avant de commencer : ce qui passe avant le programme. */
export const PROGRAM_RULES: string[] = [
  "Une douleur qui dure ou qui augmente pendant un exercice : tu arrêtes et tu en parles à un adulte.",
  "Tests des semaines 1, 6 et 12 : ils sont prévus le dimanche. Si le match de la veille a été dur, ou si tu joues le dimanche, fais-les à la place de la séance du premier jour où tes jambes sont fraîches. Si elles sont encore lourdes le mardi, fais les autres tests et saute le sprint cette semaine-là.",
  "Prends un carnet, un cahier ou les notes de ton téléphone. Tu y écris tes bilans de match, ta confiance sur 10 et tes records de jongles. Les résultats des tests vont dans la page Suivi.",
  "Jour d’entraînement au club : la séance du club remplace celle du programme. Garde seulement la routine mentale du jour.",
  "Pas de match samedi : 20 minutes de jeu avec des copains, avec la routine d’avant-match et le bilan après.",
  "Malade ou très fatigué : repos. Tu reprends à la séance suivante, sans rattraper celles que tu as sautées.",
];

const s = (
  day: Day,
  title: string,
  minutes: number,
  exercises: string[],
  mental: string,
): Session => ({ day, title, minutes, exercises, mental });

const WARMUP = "echauffement-dynamique";
const MATCH = ["routine-avant-match", "routine-reset", "bilan-apres-match"];
const RECOVERY = ["retour-au-calme", "jongles"];
const TESTS = [WARMUP, "jongles", "slalom-plots", "sprints-courts", "frappes-cadrees", "retour-au-calme"];

const match = (mental: string) => s("samedi", "Jour de match", 20, MATCH, mental);
const recovery = (mental: string) => s("dimanche", "Récupération et mesure", 15, RECOVERY, mental);
const tests = (mental: string) =>
  s("dimanche", "Récupération et tests de référence", 35, TESTS, mental);

export const PROGRAM: Week[] = [
  // Phase Bases
  {
    week: 1,
    days: [
      s("lundi", "Toucher de balle", 18, [WARMUP, "controle-oriente-mur", "pied-faible-mur", "gainage-planche"],
        "Ton pied faible est le pied du jour : chaque fois que tu hésites entre les deux, c’est lui qui joue."),
      s("mardi", "Appuis et gainage", 18, [WARMUP, "appuis-rapides", "sprints-courts", "squats", "gainage-lateral"],
        "Pendant le gainage, respire lentement par le nez. Si tu bloques ta respiration, la position devient plus dure."),
      s("mercredi", "Tête haute", 15, [WARMUP, "conduite-tete-haute"],
        "Apprends la routine RESET par cœur : Respire, Efface, Situe-toi, Encourage-toi, Tâche suivante."),
      s("jeudi", "Conduite et frappe", 18, [WARMUP, "slalom-plots", "crochets", "frappes-cadrees"],
        "Avant chaque frappe, choisis ton coin et n’en change plus jusqu’au tir."),
      s("vendredi", "Veille de match", 10, ["respiration-4-7-8", "visualisation"],
        "Ce soir au lit, 4 cycles de respiration 4-7-8, puis visualise 3 actions de ton poste."),
      match("Cette semaine, un seul objectif : compter combien de fois tu fais RESET après une erreur. Note le nombre dans ton bilan."),
      tests("Tu poses ton point de départ. Note tes résultats et ta confiance sur 10 dans la page Suivi. Ces chiffres serviront de comparaison en semaine 6."),
    ],
  },
  {
    week: 2,
    days: [
      s("lundi", "Toucher de balle", 20, [WARMUP, "controle-oriente-mur", "pied-faible-mur", "gainage-planche"],
        "Compte tes contrôles ratés sur chaque série, et essaie d’en rater un de moins à la série suivante."),
      s("mardi", "Appuis et gainage", 20, [WARMUP, "appuis-rapides", "sprints-courts", "squats", "gainage-lateral"],
        "Au départ de chaque sprint, pense à un seul mot : \"pousse\"."),
      s("mercredi", "Tête haute", 15, [WARMUP, "conduite-tete-haute"],
        "Chaque fois que le ballon t’échappe, fais RESET avant de repartir."),
      s("jeudi", "Conduite et frappe", 20, [WARMUP, "slalom-plots", "crochets", "frappes-cadrees"],
        "Après une frappe ratée, RESET avant de reposer le ballon. Ça prend cinq secondes."),
      s("vendredi", "Veille de match", 10, ["respiration-4-7-8", "visualisation"],
        "Respiration 4-7-8 ce soir, puis visualise ton premier contrôle du match : où tu le prends, vers où tu l’orientes."),
      match("Objectif de match : faire RESET après chaque erreur, sans exception. Vérifie-le dans ton bilan."),
      recovery("Note dans ton carnet ton record de jongles du pied faible et ta confiance du week-end sur 10."),
    ],
  },
  {
    week: 3,
    days: [
      s("lundi", "Toucher de balle", 22, [WARMUP, "controle-oriente-mur", "pied-faible-mur", "gainage-planche"],
        "Sur la dernière série du pied faible, compte les passes réussies. Note le nombre : tu le compareras en semaine 7."),
      s("mardi", "Appuis et gainage", 22, [WARMUP, "appuis-rapides", "sprints-courts", "squats", "gainage-lateral"],
        "Repense à ce qui était dur en semaine 1 et qui l’est moins aujourd’hui. Note-le dans ton carnet."),
      s("mercredi", "Tête haute et vidéo", 25, [WARMUP, "conduite-tete-haute", "analyse-video-poste"],
        "Pendant la vidéo, note une chose que ton joueur fait sans ballon. Tu essaieras de la refaire samedi."),
      s("jeudi", "Conduite et frappe", 22, [WARMUP, "slalom-plots", "crochets", "frappes-cadrees"],
        "Avant chaque passage du slalom, une respiration lente. Tu pars quand tu es prêt."),
      s("vendredi", "Veille de match", 12, ["respiration-4-7-8", "visualisation"],
        "Visualise une erreur en match, puis toi qui fais RESET et qui réussis l’action suivante."),
      match("Objectif de match : refaire en match la chose notée mercredi dans la vidéo."),
      recovery("Note ton record de jongles et ta confiance sur 10. Demain commence la phase Vitesse."),
    ],
  },

  // Phase Vitesse
  {
    week: 4,
    days: [
      s("lundi", "Vitesse balle au pied", 25, [WARMUP, "controle-oriente-mur", "une-deux-mur", "crochets"],
        "Mêmes gestes, plus vite. Si ça devient brouillon, ralentis le temps de 3 répétitions propres, puis réaccélère."),
      s("mardi", "Démarrages", 25, [WARMUP, "sprints-courts", "navette-5-10-5", "sauts-lateraux", "gainage-planche"],
        "Avant chaque sprint, mets-toi en position et reste immobile une seconde. Tu pars sur ton propre signal."),
      s("mercredi", "Prise d’information", 18, [WARMUP, "regard-epaule", "plots-couleurs"],
        "Tourne la tête, puis annonce à voix haute le nombre que tu as vu, même si tu as un doute. Une erreur ici n’a rien de grave."),
      s("jeudi", "Dribble et finition", 25, [WARMUP, "feinte-acceleration", "slalom-plots", "frappes-cadrees"],
        "Sur la feinte, engage tout le haut du corps. Une feinte à moitié ne déplace pas le défenseur."),
      s("vendredi", "Veille de match", 12, ["phrases-confiance", "visualisation"],
        "Écris tes 3 phrases de confiance et choisis celle que tu gardes pour demain."),
      match("Dans le vestiaire, dis ta phrase de confiance après les respirations. RESET pendant, bilan après."),
      recovery("Note ton record de jongles et ta confiance sur 10."),
    ],
  },
  {
    week: 5,
    days: [
      s("lundi", "Vitesse balle au pied", 27, [WARMUP, "controle-oriente-mur", "une-deux-mur", "crochets"],
        "Fixe-toi un nombre d’allers-retours en une-deux sans arrêter le ballon, et essaie de le battre sur la dernière série."),
      s("mardi", "Démarrages", 27, [WARMUP, "sprints-courts", "navette-5-10-5", "sauts-lateraux", "gainage-planche"],
        "Sur la navette, imagine un adversaire qui part avec toi. Tu dois toucher chaque plot avant lui."),
      s("mercredi", "Prise d’information", 18, [WARMUP, "regard-epaule", "plots-couleurs"],
        "Cette semaine, tourne la tête avant chaque réception, même pendant l’entraînement au club."),
      s("jeudi", "Dribble et finition", 27, [WARMUP, "feinte-acceleration", "slalom-plots", "frappes-cadrees"],
        "Une respiration et ton coin avant chaque frappe. Compte combien tu en cadres sur la dernière série."),
      s("vendredi", "Veille de match", 12, ["phrases-confiance", "visualisation"],
        "Relis tes 3 phrases. Visualise un démarrage, un une-deux et un retour défensif."),
      match("Objectif de match : regarder par-dessus l’épaule avant 5 réceptions. Compte-les dans ton bilan."),
      recovery("Note ton record de jongles et ta confiance sur 10."),
    ],
  },
  {
    week: 6,
    days: [
      s("lundi", "Vitesse balle au pied", 30, [WARMUP, "controle-oriente-mur", "une-deux-mur", "crochets"],
        "Tests dimanche. Inutile d’en faire plus : fais les séances prévues, proprement."),
      s("mardi", "Démarrages", 30, [WARMUP, "sprints-courts", "navette-5-10-5", "sauts-lateraux", "gainage-planche"],
        "Sur chaque sprint, pense à tes premiers pas, petits et puissants. C’est là que se joue le test du 20 mètres."),
      s("mercredi", "Prise d’information et vidéo", 25, [WARMUP, "regard-epaule", "analyse-video-poste"],
        "Dans la vidéo, compte combien de fois ton joueur regarde avant de recevoir. Samedi, compte les tiens."),
      s("jeudi", "Dribble et finition", 30, [WARMUP, "feinte-acceleration", "slalom-plots", "frappes-cadrees"],
        "Fais tes frappes comme au test de dimanche : même endroit, même routine."),
      s("vendredi", "Veille de match", 12, ["phrases-confiance", "visualisation", "respiration-4-7-8"],
        "Relis tes phrases de confiance, et 4 cycles de respiration 4-7-8 au coucher."),
      match("Objectif de match : un nombre de regards avant réception, à comparer avec celui du joueur de la vidéo."),
      tests("Tests de mi-parcours. Entre tes résultats dans la page Suivi et compare-les à la semaine 1. Un chiffre qui n’a pas bougé t’indique le pilier à surveiller pendant la phase Confiance."),
    ],
  },

  // Phase Confiance
  {
    week: 7,
    days: [
      s("lundi", "Pied faible sous pression", 28, [WARMUP, "pied-faible-mur", "une-deux-mur", "corps-ouvert"],
        "Chaque raté du pied faible : RESET, et tu enchaînes sans t’arrêter. Compare tes passes réussies avec la semaine 3."),
      s("mardi", "Force et vitesse", 28, [WARMUP, "sprints-courts", "fentes", "squats", "gainage-lateral"],
        "Commence les fentes par ta jambe faible. Elle a besoin de plus d’attention, comme ton pied faible."),
      s("mercredi", "Lire le jeu", 20, [WARMUP, "portes-de-passe", "appels-de-balle"],
        "Décide vite. Une passe dans une porte moyenne, donnée sans t’arrêter, reste une bonne passe."),
      s("jeudi", "Finition sous pression", 28, [WARMUP, "feinte-acceleration", "frappes-cadrees", "penalty-pression"],
        "Même routine à chaque penalty. Quand la série repart de zéro, RESET avant de reposer le ballon."),
      s("vendredi", "Veille de match", 12, ["objectif-de-match", "respiration-4-7-8", "visualisation"],
        "Écris ton objectif de match avec un nombre, puis visualise-le 3 fois."),
      match("Objectif écrit hier. Dans le bilan, une question de plus : objectif atteint, oui ou non ?"),
      recovery("Note ton record de jongles et ta confiance sur 10."),
    ],
  },
  {
    week: 8,
    days: [
      s("lundi", "Pied faible sous pression", 30, [WARMUP, "pied-faible-mur", "une-deux-mur", "corps-ouvert"],
        "Avant chaque réception corps ouvert, demande-toi où est l’avant. Ta première touche va de ce côté."),
      s("mardi", "Force et vitesse", 30, [WARMUP, "sprints-courts", "fentes", "squats", "gainage-lateral"],
        "Sur la dernière série, garde la même qualité que sur la première, même fatigué."),
      s("mercredi", "Lire le jeu", 22, [WARMUP, "portes-de-passe", "appels-de-balle"],
        "Regarde le passeur avant de partir. Un appel qu’il ne voit pas ne sert à rien."),
      s("jeudi", "Finition sous pression", 30, [WARMUP, "feinte-acceleration", "frappes-cadrees", "penalty-pression"],
        "Ajoute du bruit pendant les penalties (quelqu’un qui parle, de la musique). Ta routine ne change pas."),
      s("vendredi", "Veille de match", 12, ["objectif-de-match", "respiration-4-7-8", "visualisation"],
        "Objectif de match écrit, 4 cycles de respiration, puis visualise ta routine d’avant-match du début à la fin."),
      match("Fais la routine d’avant-match en entier, dans l’ordre. RESET pendant, bilan après."),
      recovery("Note ton record de jongles et ta confiance sur 10. Compare avec la semaine 2."),
    ],
  },
  {
    week: 9,
    days: [
      s("lundi", "Pied faible sous pression", 30, [WARMUP, "pied-faible-mur", "une-deux-mur", "corps-ouvert"],
        "Pied faible en une touche : les premières vont rater. Continue jusqu’à 10 réussies de suite."),
      s("mardi", "Force et vitesse", 30, [WARMUP, "sprints-courts", "fentes", "squats", "gainage-lateral"],
        "Note un exercice que tu ne réussissais pas en semaine 1 et que tu fais maintenant."),
      s("mercredi", "Lire le jeu et vidéo", 27, [WARMUP, "portes-de-passe", "analyse-video-poste"],
        "Dans la vidéo, regarde ce que ton joueur fait juste après une erreur. A-t-il lui aussi un geste pour passer à la suite ?"),
      s("jeudi", "Finition sous pression", 30, [WARMUP, "feinte-acceleration", "frappes-cadrees", "penalty-pression"],
        "Avant les penalties, 5 frappes cadrées de suite. Si tu rates, RESET et tu continues."),
      s("vendredi", "Veille de match", 15, ["objectif-de-match", "respiration-4-7-8", "visualisation"],
        "Objectif, respiration, visualisation. Ce soir, coucher à ton heure habituelle."),
      match("Dans le bilan, note un moment du match où tu t’es senti en confiance, et ce qui l’a provoqué."),
      recovery("Note ton record de jongles et ta confiance sur 10. Demain commence la phase Maestro."),
    ],
  },

  // Phase Maestro
  {
    week: 10,
    days: [
      s("lundi", "Technique en mouvement", 32, [WARMUP, "corps-ouvert", "controle-oriente-mur", "une-deux-mur", "pied-faible-mur"],
        "Tu assembles les quatre piliers. Aujourd’hui, regarde autour de toi avant chaque réception, même contre le mur."),
      s("mardi", "Vitesse et gainage", 32, [WARMUP, "navette-5-10-5", "sprints-courts", "appuis-rapides", "gainage-planche", "gainage-lateral"],
        "Six exercices aujourd’hui. Prends-les une série à la fois, sans penser à la suite."),
      s("mercredi", "Vision", 25, [WARMUP, "regard-epaule", "appels-de-balle", "plots-couleurs"],
        "Imagine un défenseur collé à toi pendant tout l’exercice."),
      s("jeudi", "Circuit Maestro", 32, [WARMUP, "circuit-maestro", "penalty-pression"],
        "Dans le circuit, garde ta routine avant chaque frappe, même essoufflé."),
      s("vendredi", "Veille de match", 15, ["objectif-de-match", "respiration-4-7-8", "visualisation"],
        "Choisis un objectif de match lié à ton pilier le plus bas au test, et visualise-le."),
      match("Objectif de match : celui de ton pilier le plus bas. Routine avant, RESET pendant, bilan après."),
      recovery("Note ton record de jongles et ta confiance sur 10."),
    ],
  },
  {
    week: 11,
    days: [
      s("lundi", "Technique en mouvement", 33, [WARMUP, "corps-ouvert", "controle-oriente-mur", "une-deux-mur", "pied-faible-mur"],
        "Cette semaine, chaque exercice avec ballon se fait des deux pieds. Commence chaque série par le pied faible."),
      s("mardi", "Vitesse et gainage", 33, [WARMUP, "navette-5-10-5", "sprints-courts", "appuis-rapides", "gainage-planche", "gainage-lateral"],
        "Au début de chaque série, dis ta phrase de confiance dans ta tête."),
      s("mercredi", "Vision", 24, [WARMUP, "regard-epaule", "appels-de-balle", "plots-couleurs"],
        "Avant chaque contrôle, décide où tu joues ensuite. Décider après le contrôle, c’est déjà trop tard."),
      s("jeudi", "Circuit Maestro", 33, [WARMUP, "circuit-maestro", "penalty-pression"],
        "Dernière série de penalties du pied faible. Même routine, même rythme."),
      s("vendredi", "Veille de match", 15, ["objectif-de-match", "respiration-4-7-8", "visualisation"],
        "Visualise un match entier en 5 minutes : le début, une erreur suivie de RESET, une action réussie, la fin."),
      match("Après le match, demande à ton coach ou à un parent ce qu’il a vu de différent dans ton jeu."),
      recovery("Note ton record de jongles et ta confiance sur 10. Compare avec la semaine 3."),
    ],
  },
  {
    week: 12,
    days: [
      s("lundi", "Technique en mouvement", 35, [WARMUP, "corps-ouvert", "controle-oriente-mur", "une-deux-mur", "pied-faible-mur"],
        "Dernière semaine. Les tests de dimanche se préparent avec les séances prévues, sans en ajouter."),
      s("mardi", "Vitesse et gainage", 35, [WARMUP, "navette-5-10-5", "sprints-courts", "appuis-rapides", "gainage-planche", "gainage-lateral"],
        "Sprints de 20 mètres, la distance du test. Soigne le départ comme dimanche."),
      s("mercredi", "Vision et vidéo", 33, [WARMUP, "regard-epaule", "appels-de-balle", "analyse-video-poste"],
        "Reprends le joueur de la semaine 3. Note ce que tu remarques maintenant et que tu ne voyais pas à l’époque."),
      s("jeudi", "Circuit Maestro", 35, [WARMUP, "circuit-maestro", "penalty-pression"],
        "Chaque frappe avec ta routine complète, comme un penalty en match."),
      s("vendredi", "Veille de match", 15, ["objectif-de-match", "respiration-4-7-8", "visualisation"],
        "Relis ton carnet depuis la semaine 1 : bilans, confiance, records. Puis respiration 4-7-8 au coucher."),
      match("Dernier match du programme. Routine avant, RESET pendant, et dans le bilan ta confiance sur 10."),
      tests("Tests de fin. Entre tes résultats dans la page Suivi et compare-les à la semaine 1. Garde après le programme les routines qui t’ont servi : RESET, respiration, objectif de match."),
    ],
  },
];

/** Semaines qui finissent par les tests de référence (dimanche). */
export const TEST_WEEKS: readonly number[] = [1, 6, 12];

export function isValidWeek(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= PROGRAM.length;
}

/** Segment d'URL de /programme/semaine/[n] : "3" donne 3 ; "03", "3.0", "13" ou "abc" donnent null. */
export function parseWeekParam(n: string): number | null {
  const week = Number(n);
  return String(week) === n && isValidWeek(week) ? week : null;
}

/** Identifiant stable d'une séance, ex. "w3-mardi" (clé de la progression). */
export function sessionId(week: number, day: string): string {
  return `w${week}-${day}`;
}
