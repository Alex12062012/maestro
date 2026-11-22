// Bibliothèque d'exercices du programme. Tout se fait au poids du corps,
// avec un ballon et quelques plots. Les doses suivent les semaines où
// l'exercice apparaît dans `@/content/program`.
import type { Pillar } from "@/content/quiz";

/** Coordonnées sur une grille 0-100 (largeur) × 0-60 (hauteur), vue de dessus. */
export type Point = [number, number];

export type Diagram = {
  cones: Point[];
  ball?: Point;
  player?: Point;
  paths: { from: Point; to: Point; kind: "run" | "pass" | "dribble" }[];
  /** Le bord haut (y = 0) est un mur. */
  wall?: boolean;
  /** Ligne tracée au sol ou bâton posé par terre. */
  line?: [Point, Point];
};

export type Exercise = {
  slug: string;
  name: string;
  pillar: Pillar;
  goal: string;
  steps: string[];
  dose: string;
  mistakes: string[];
  easier: string;
  harder: string;
  /** Exercices avec ballon ou plots. */
  diagram?: Diagram;
  /** Exercices au sol ou sans terrain. Fichier dans public/photos/exercices/, détails dans `@/content/photos`. */
  photo?: string;
};

// Dans les schémas "contre un mur" (wall: true), le mur est le bord haut (y = 0).

export const EXERCISES: Exercise[] = [
  // Technique
  {
    slug: "controle-oriente-mur",
    name: "Contrôle orienté contre un mur",
    pillar: "technique",
    goal: "Prendre le ballon avec ton premier contact pour l'emmener du côté où tu veux jouer. En match, tu gagnes une touche et du temps.",
    steps: [
      "Place-toi à 4 ou 5 mètres d'un mur. Pose un plot à 2 mètres à ta gauche et un autre à 2 mètres à ta droite.",
      "Fais une passe contre le mur avec l'intérieur du pied.",
      "Au retour, contrôle de l'intérieur du pied en envoyant le ballon vers un plot, en un seul contact.",
      "Pousse le ballon jusqu'au plot, reviens au centre et repasse.",
      "Alterne : un contrôle vers la gauche, un vers la droite.",
    ],
    dose: "Semaines 1 à 3 : 3 séries de 20 contrôles. Semaines 4 à 12 : 4 séries de 20 contrôles. 1 minute de pause entre les séries.",
    mistakes: [
      "Arrêter le ballon sous la semelle avant de le pousser : ça fait deux touches.",
      "Attendre sur les talons. Sois sur l'avant du pied avant que le ballon arrive.",
      "Contrôler toujours du même pied.",
    ],
    easier: "Passe plus doucement et autorise-toi deux touches : un amorti, puis la poussée vers le plot.",
    harder: "Recule à 7 ou 8 mètres et passe plus fort, ou contrôle avec l'extérieur du pied.",
    diagram: {
      wall: true,
      cones: [
        [34, 44],
        [66, 44],
      ],
      ball: [50, 40],
      player: [50, 46],
      paths: [
        { from: [48, 40], to: [48, 4], kind: "pass" },
        { from: [53, 4], to: [53, 40], kind: "pass" },
        { from: [51, 44], to: [37, 44], kind: "dribble" },
      ],
    },
  },
  {
    slug: "pied-faible-mur",
    name: "Pied faible contre le mur",
    pillar: "technique",
    goal: "Rendre ton pied faible assez sûr pour faire une passe ou un contrôle sans y penser.",
    steps: [
      "Place-toi à 3 ou 4 mètres d'un mur, face à lui.",
      "Passe et contrôle uniquement avec ton pied faible, de l'intérieur du pied.",
      "Quand c'est propre, joue en une touche : tu remets directement le ballon contre le mur.",
      "Termine chaque série par 10 passes de l'extérieur du pied faible.",
    ],
    dose: "Semaines 1 à 3 : 3 séries de 30 touches. Semaines 7 à 12 : 4 séries de 30 touches, la dernière en une touche. 45 secondes de pause.",
    mistakes: [
      "Repasser sur le bon pied dès que le ballon arrive mal.",
      "Frapper avec la pointe : c'est l'intérieur du pied qui touche le ballon.",
      "Garder la cheville molle. Bloque-la, pointe du pied relevée.",
    ],
    easier: "Rapproche-toi à 2 mètres et laisse le ballon s'arrêter avant chaque passe.",
    harder: "Recule à 6 mètres, ou alterne intérieur et extérieur du pied faible à chaque passe.",
    diagram: {
      wall: true,
      cones: [
        [42, 46],
        [58, 46],
      ],
      ball: [50, 38],
      player: [50, 43],
      paths: [
        { from: [48, 38], to: [48, 4], kind: "pass" },
        { from: [53, 4], to: [53, 38], kind: "pass" },
      ],
    },
  },
  {
    slug: "une-deux-mur",
    name: "Une-deux en mouvement contre le mur",
    pillar: "technique",
    goal: "Jouer en une touche en te déplaçant, comme dans un une-deux avec un coéquipier.",
    steps: [
      "Pose deux plots à 6 mètres l'un de l'autre, sur une ligne parallèle au mur, à 3 mètres de lui.",
      "Pars d'un plot en pas chassés, ballon devant toi.",
      "Passe contre le mur en avançant et reprends le ballon en une touche, sans t'arrêter.",
      "Arrivé à l'autre plot, change de sens et repars avec l'autre pied.",
    ],
    dose: "Semaines 4 à 6 : 3 séries de 4 allers-retours. Semaines 7 à 12 : 3 séries de 6 allers-retours. 1 minute de pause.",
    mistakes: [
      "S'arrêter pour passer. Le ballon et toi bougez en même temps.",
      "Passer droit vers le mur. Vise un peu devant toi pour que le ballon revienne dans ta course.",
      "Toucher le ballon deux fois par habitude.",
    ],
    easier: "Fais-le en marchant, et autorise-toi deux touches.",
    harder: "Accélère, et ne touche le ballon qu'avec le pied le plus éloigné du mur.",
    diagram: {
      wall: true,
      cones: [
        [22, 36],
        [78, 36],
      ],
      player: [22, 42],
      paths: [
        { from: [22, 42], to: [78, 42], kind: "run" },
        { from: [28, 36], to: [38, 4], kind: "pass" },
        { from: [38, 4], to: [48, 36], kind: "pass" },
        { from: [48, 36], to: [58, 4], kind: "pass" },
        { from: [58, 4], to: [68, 36], kind: "pass" },
      ],
    },
  },
  {
    slug: "slalom-plots",
    name: "Slalom 6 plots",
    pillar: "technique",
    goal: "Garder le ballon près du pied en changeant de direction. C'est aussi un test de référence, chronométré en semaines 1, 6 et 12.",
    steps: [
      "Aligne 6 plots, espacés d'un mètre (un grand pas).",
      "Slalome entre les plots avec l'intérieur et l'extérieur du pied, une touche entre chaque plot.",
      "Contourne le dernier plot et reviens en slalom jusqu'au départ.",
      "Pour le test : un aller-retour chronométré, sans toucher de plot. Garde le meilleur de 2 essais.",
    ],
    dose: "Semaines 1 à 3 : 4 allers-retours. Semaines 4 à 6 : 6 allers-retours. 30 secondes de récupération entre chaque. Semaines 10 à 12 : dans le circuit Maestro. Test : 2 essais.",
    mistakes: [
      "Pousser le ballon trop loin et devoir courir après.",
      "N'utiliser que le pied fort.",
      "Fixer le ballon tout le temps. Lève les yeux vers le plot suivant entre deux touches.",
    ],
    easier: "Écarte les plots à 1,5 mètre et fais-le en marchant vite.",
    harder: "Uniquement pied faible, ou uniquement extérieur du pied.",
    diagram: {
      cones: [
        [22, 30],
        [33, 30],
        [44, 30],
        [55, 30],
        [66, 30],
        [77, 30],
      ],
      ball: [11, 30],
      player: [7, 30],
      paths: [
        { from: [11, 30], to: [27, 23], kind: "dribble" },
        { from: [27, 23], to: [38, 37], kind: "dribble" },
        { from: [38, 37], to: [49, 23], kind: "dribble" },
        { from: [49, 23], to: [60, 37], kind: "dribble" },
        { from: [60, 37], to: [71, 23], kind: "dribble" },
        { from: [71, 23], to: [86, 30], kind: "dribble" },
      ],
    },
  },
  {
    slug: "crochets",
    name: "Crochets autour du plot",
    pillar: "technique",
    goal: "Changer de direction balle au pied pour te sortir d'un défenseur qui te ferme le passage.",
    steps: [
      "Pose un plot à 8 mètres devant toi.",
      "Conduis le ballon jusqu'au plot.",
      "Un pas avant le plot, fais un crochet de l'intérieur du pied : tu ramènes le ballon et tu repars dans l'autre sens.",
      "Reviens au départ et recommence avec un crochet de l'extérieur du pied.",
      "Alterne pied droit et pied gauche.",
    ],
    dose: "Semaines 1 à 3 : 3 séries de 8 crochets. Semaines 4 à 6 : 4 séries de 8 crochets. 1 minute de pause.",
    mistakes: [
      "Freiner trop tôt : le crochet se fait à un pas du plot.",
      "Repartir lentement. L'accélération sur 2 ou 3 mètres fait partie du geste.",
      "Garder les jambes tendues. Plie les genoux pour tourner vite.",
    ],
    easier: "Fais le crochet en marchant, sans accélérer après.",
    harder: "Enchaîne deux crochets (intérieur puis extérieur) avant de repartir.",
    diagram: {
      cones: [[72, 30]],
      ball: [22, 27],
      player: [18, 27],
      paths: [
        { from: [22, 27], to: [67, 27], kind: "dribble" },
        { from: [67, 34], to: [22, 34], kind: "dribble" },
      ],
    },
  },
  {
    slug: "feinte-acceleration",
    name: "Feinte et accélération",
    pillar: "technique",
    goal: "Déséquilibrer un défenseur avec une feinte, puis passer à côté de lui en accélérant.",
    steps: [
      "Pose un plot à 10 mètres : c'est le défenseur. Derrière lui, fais deux petites portes avec des plots, une à gauche, une à droite.",
      "Conduis le ballon vers le plot à vitesse moyenne.",
      "À 2 mètres du plot, fais une feinte de corps : tu penches les épaules d'un côté.",
      "Pousse le ballon de l'autre côté et accélère jusqu'à traverser une porte.",
      "Change de côté à chaque passage. Quand la feinte de corps est propre, passe au passement de jambes.",
    ],
    dose: "Semaines 4 à 6 : 3 séries de 6 passages. Semaines 7 à 9 : 4 séries de 6 passages. 1 minute de pause. Semaines 10 à 12 : dans le circuit Maestro.",
    mistakes: [
      "Faire la feinte collé au plot. En match, le défenseur aurait déjà le ballon.",
      "Feinter seulement avec les pieds. Ce sont les épaules qui trompent le défenseur.",
      "Ne pas accélérer après la feinte.",
    ],
    easier: "Fais la feinte à l'arrêt, puis pousse le ballon et accélère.",
    harder: "Demande à quelqu'un de jouer le défenseur, sans tacler, juste en se plaçant.",
    diagram: {
      cones: [
        [55, 30],
        [80, 14],
        [80, 22],
        [80, 38],
        [80, 46],
      ],
      ball: [16, 30],
      player: [12, 30],
      paths: [
        { from: [16, 30], to: [47, 30], kind: "dribble" },
        { from: [47, 30], to: [88, 18], kind: "dribble" },
      ],
    },
  },
  {
    slug: "jongles",
    name: "Jongles pied droit, pied gauche",
    pillar: "technique",
    goal: "Travailler ton toucher de balle et ton équilibre sur une jambe. Les jongles d'un seul pied font partie des tests de référence.",
    steps: [
      "Reste dans un carré d'environ 2 mètres de côté, marqué par 4 plots.",
      "Lâche le ballon des mains et jongle du coup de pied, cheville bloquée, pointe légèrement relevée.",
      "Fais des séries pied droit uniquement, puis pied gauche uniquement.",
      "Pour le test : 3 essais par pied, sans rebond au sol. Tu notes ton meilleur score pour chaque pied.",
    ],
    dose: "5 minutes en fin de séance le dimanche, puis 3 essais par pied pour ton record.",
    mistakes: [
      "Taper le ballon trop haut. Vise la hauteur de ta taille.",
      "Jongler avec la pointe du pied : le ballon part devant toi.",
      "Laisser tomber le pied faible parce que le score est bas.",
    ],
    easier: "Laisse le ballon rebondir une fois au sol entre chaque touche.",
    harder: "Alterne pied droit, pied gauche, cuisse, sans sortir du carré.",
    diagram: {
      cones: [
        [42, 22],
        [58, 22],
        [42, 38],
        [58, 38],
      ],
      ball: [50, 27],
      player: [50, 32],
      paths: [],
    },
  },
  {
    slug: "frappes-cadrees",
    name: "Frappes cadrées",
    pillar: "technique",
    goal: "Cadrer tes frappes du cou-de-pied en visant un coin. C'est aussi le test de finition : 10 frappes, combien dans le cadre.",
    steps: [
      "Place le ballon à environ 16 mètres du but, à l'entrée de la surface. Sans but, pose deux plots à 5 mètres l'un de l'autre au pied d'un mur : ce sont tes poteaux.",
      "Pose deux plots à l'intérieur des poteaux pour marquer les coins à viser.",
      "Prends 3 pas d'élan en diagonale. Pied d'appui à côté du ballon, pointé vers la cible.",
      "Frappe du cou-de-pied, cheville bloquée, buste au-dessus du ballon pour qu'il reste bas.",
      "Pour le test : 10 frappes depuis le même endroit, tu comptes celles qui entrent dans le cadre.",
    ],
    dose: "Semaines 1 à 6 : 2 séries de 6 frappes. Semaines 7 à 9 : 3 séries de 6 frappes. 3 de chaque pied par série. Semaines 10 à 12 : dans le circuit Maestro. Test : 10 frappes.",
    mistakes: [
      "Se pencher en arrière : le ballon passe au-dessus.",
      "Frapper de la pointe, c'est imprécis.",
      "Viser le milieu du but par sécurité. En match, c'est là que se tient le gardien.",
    ],
    easier: "Rapproche-toi à 11 mètres (le point de penalty) et frappe de l'intérieur du pied.",
    harder: "Frappe après 5 mètres de conduite de balle, sans arrêter le ballon.",
    diagram: {
      cones: [
        [36, 4],
        [64, 4],
        [40, 8],
        [60, 8],
      ],
      ball: [50, 44],
      player: [42, 52],
      paths: [
        { from: [42, 52], to: [48, 46], kind: "run" },
        { from: [50, 44], to: [41, 9], kind: "pass" },
      ],
    },
  },
  {
    slug: "circuit-maestro",
    name: "Circuit Maestro",
    pillar: "technique",
    goal: "Enchaîner conduite, feinte et frappe comme dans une action de match, en gardant un geste propre quand le souffle est court.",
    steps: [
      "Installe 3 postes à la suite : les 6 plots du slalom, un plot défenseur avec une porte derrière lui, puis le but (ou tes deux plots poteaux) à 16 mètres.",
      "Prends 2 ballons. Le premier fait tout le parcours, le second t'attend au point de frappe. Avec un seul ballon, va le chercher en trottinant après la première frappe.",
      "Poste 1 : un aller-retour en slalom, comme dans la fiche Slalom 6 plots.",
      "Poste 2 : 2 passages feinte et accélération, un de chaque côté.",
      "Poste 3 : 2 frappes cadrées, une de chaque pied, avec ta routine avant chaque frappe.",
      "Un tour, ce sont les 3 postes à la suite, sans pause. Entre deux tours, tu récupères 2 minutes en marchant, le temps de ramasser les ballons et de revenir au départ.",
    ],
    dose: "Semaine 10 : 4 tours. Semaines 11 et 12 : 5 tours. 2 minutes de récupération en marchant entre deux tours.",
    mistakes: [
      "Bâcler le slalom pour arriver plus vite à la frappe.",
      "Frapper sans routine parce que tu es essoufflé.",
      "Raccourcir les 2 minutes de récupération.",
    ],
    easier: "3 tours, avec une seule frappe par tour.",
    harder: "Chronomètre chaque tour et essaie de garder le même temps du premier au dernier.",
    diagram: {
      cones: [
        [8, 52],
        [14, 52],
        [20, 52],
        [26, 52],
        [32, 52],
        [38, 52],
        [56, 34],
        [72, 22],
        [72, 28],
        [80, 4],
        [98, 4],
      ],
      ball: [4, 46],
      player: [4, 50],
      paths: [
        { from: [6, 46], to: [42, 46], kind: "dribble" },
        { from: [44, 44], to: [52, 37], kind: "dribble" },
        { from: [52, 37], to: [74, 25], kind: "dribble" },
        { from: [76, 24], to: [88, 6], kind: "pass" },
      ],
    },
  },

  // Physique
  {
    slug: "echauffement-dynamique",
    name: "Échauffement dynamique",
    pillar: "physique",
    goal: "Monter la température du corps et réveiller les articulations avant de forcer. Tu le fais au début des séances du lundi au jeudi et avant les tests du dimanche.",
    steps: [
      "Pose deux plots à environ 15 mètres l'un de l'autre.",
      "Fais 2 allers-retours en footing léger.",
      "Un aller en montées de genoux, retour en marchant. Puis un aller en talons-fesses, retour en marchant.",
      "Un aller en pas chassés face à gauche, le retour face à droite.",
      "Un aller en ouvrant la hanche à chaque pas (le genou monte et part vers l'extérieur), le retour en la fermant.",
      "Finis par 3 accélérations progressives : tu pars doucement et tu arrives vite au plot.",
    ],
    dose: "6 à 8 minutes, avant chaque séance du lundi au jeudi et avant les tests.",
    mistakes: [
      "Sauter l'échauffement parce que la séance est courte.",
      "Faire les montées de genoux à moitié, genoux bas et buste penché.",
      "Partir à fond dès la première accélération.",
    ],
    easier: "Remplace les accélérations par un footing un peu plus rapide sur un aller.",
    harder: "Fais les allers en footing en conduisant un ballon, tête haute.",
    diagram: {
      cones: [
        [15, 30],
        [85, 30],
      ],
      player: [11, 30],
      paths: [
        { from: [15, 24], to: [85, 24], kind: "run" },
        { from: [85, 36], to: [15, 36], kind: "run" },
      ],
    },
  },
  {
    slug: "sprints-courts",
    name: "Sprints courts",
    pillar: "physique",
    goal: "Gagner les premiers mètres d'une course. C'est aussi le test du sprint 20 mètres, chronométré en semaines 1, 6 et 12.",
    steps: [
      "Fais l'échauffement complet avant. Jamais de sprint à froid.",
      "Pose un plot de départ et un plot d'arrivée à la distance de la semaine.",
      "Départ debout, un pied devant l'autre. Pars le plus vite possible : petits pas puissants et buste penché vers l'avant sur les premiers mètres.",
      "Dépasse le plot d'arrivée avant de ralentir.",
      "Reviens en marchant. La récupération fait partie de l'exercice.",
      "Pour le test : 20 mètres, 2 essais, quelqu'un te chronomètre avec un téléphone. Garde le meilleur temps.",
    ],
    dose: "Semaines 1 à 3 : 4 sprints de 10 mètres. Semaines 4 à 9 : 6 sprints de 15 mètres. Semaines 10 à 12 : 6 sprints de 20 mètres. Au moins 1 minute de marche entre deux sprints.",
    mistakes: [
      "Enchaîner les sprints sans récupérer : tu travailles l'essoufflement, plus la vitesse.",
      "Se redresser dès le premier pas.",
      "Ralentir avant le plot d'arrivée.",
    ],
    easier: "Fais des accélérations à 80 % de ta vitesse.",
    harder: "Pars allongé sur le ventre, ou dos à la course : tu te retournes et tu sprintes.",
    diagram: {
      cones: [
        [15, 30],
        [85, 30],
      ],
      player: [11, 30],
      paths: [{ from: [15, 30], to: [92, 30], kind: "run" }],
    },
  },
  {
    slug: "appuis-rapides",
    name: "Appuis rapides",
    pillar: "physique",
    goal: "Avoir des pieds rapides et légers pour démarrer, freiner et changer de direction.",
    steps: [
      "Aligne 8 plots (ou trace une échelle à la craie) avec 50 centimètres entre chaque.",
      "Passage 1 : un pied dans chaque intervalle, le plus vite possible, sur l'avant du pied.",
      "Passage 2 : deux pieds dans chaque intervalle.",
      "Passage 3 : en pas chassés de côté, deux appuis par intervalle.",
      "À la sortie de l'échelle, sprinte 5 mètres.",
    ],
    dose: "Semaines 1 à 3 : 3 passages de chaque. Semaines 10 à 12 : 4 passages de chaque. Retour en marchant entre deux passages.",
    mistakes: [
      "Regarder ses pieds tout le long. Jette un coup d'œil, puis regarde devant.",
      "Faire de grands pas lourds sur les talons.",
      "Sauter des intervalles pour aller plus vite.",
    ],
    easier: "Fais-le en marchant vite pour apprendre le rythme, puis accélère.",
    harder: "Termine chaque passage par un sprint de 10 mètres avec un changement de direction.",
    diagram: {
      cones: [
        [20, 30],
        [26, 30],
        [32, 30],
        [38, 30],
        [44, 30],
        [50, 30],
        [56, 30],
        [62, 30],
      ],
      player: [14, 30],
      paths: [
        { from: [16, 30], to: [62, 30], kind: "run" },
        { from: [64, 30], to: [86, 30], kind: "run" },
      ],
    },
  },
  {
    slug: "navette-5-10-5",
    name: "Navette 5-10-5",
    pillar: "physique",
    goal: "Freiner et repartir vite dans l'autre sens, comme quand tu dois revenir défendre puis repartir.",
    steps: [
      "Pose 3 plots en ligne, à 5 mètres d'écart : gauche, centre, droite.",
      "Départ au plot du centre, de profil.",
      "Sprinte jusqu'au plot de droite et touche-le de la main.",
      "Repars jusqu'au plot de gauche (10 mètres) et touche-le.",
      "Reviens au centre en sprint. Au passage suivant, commence par la gauche.",
    ],
    dose: "Semaines 4 à 6 : 4 passages. Semaines 10 à 12 : 6 passages. 1 minute 30 de récupération entre deux passages.",
    mistakes: [
      "Freiner debout, jambes tendues. Plie les genoux et descends ton centre de gravité.",
      "Faire un grand virage autour du plot. Pose le pied à côté et repousse.",
      "Raccourcir la récupération.",
    ],
    easier: "Fais-le à 70 % de ta vitesse, sans toucher les plots.",
    harder: "Avec un ballon : tu le conduis sur les 10 mètres du milieu.",
    diagram: {
      cones: [
        [25, 30],
        [50, 30],
        [75, 30],
      ],
      player: [50, 30],
      paths: [
        { from: [50, 25], to: [75, 25], kind: "run" },
        { from: [75, 31], to: [25, 31], kind: "run" },
        { from: [25, 37], to: [50, 37], kind: "run" },
      ],
    },
  },
  {
    slug: "sauts-lateraux",
    name: "Sauts latéraux",
    pillar: "physique",
    goal: "Muscler chevilles et mollets et apprendre à bien te réceptionner, pour des appuis plus vifs.",
    steps: [
      "Trace une ligne au sol ou pose un bâton.",
      "Pieds joints à côté de la ligne, saute par-dessus, de gauche à droite.",
      "Petits sauts rapides, réception sur l'avant du pied, genoux légèrement fléchis.",
      "Garde le buste droit, les bras accompagnent.",
    ],
    dose: "Semaines 4 à 6 : 3 séries de 15 secondes, 45 secondes de repos. Arrête dès que tes réceptions deviennent lourdes.",
    mistakes: [
      "Atterrir sur les talons, jambes tendues.",
      "Sauter haut. Reste à quelques centimètres du sol et cherche la vitesse.",
      "Laisser les genoux rentrer vers l'intérieur à la réception.",
    ],
    easier: "Un saut, un temps d'arrêt, puis le saut suivant.",
    harder: "Sur un seul pied, 10 secondes par jambe.",
    diagram: {
      cones: [],
      line: [
        [50, 14],
        [50, 46],
      ],
      player: [42, 30],
      paths: [
        { from: [43, 25], to: [57, 25], kind: "run" },
        { from: [57, 35], to: [43, 35], kind: "run" },
      ],
    },
  },
  {
    slug: "gainage-planche",
    name: "Gainage ventral (planche)",
    pillar: "physique",
    goal: "Renforcer le tronc pour mieux tenir dans les duels et transmettre la force des jambes dans tes frappes et tes sprints.",
    steps: [
      "Allonge-toi sur le ventre, appuie-toi sur les avant-bras, coudes sous les épaules.",
      "Monte le bassin : ton corps forme une ligne droite des épaules aux chevilles.",
      "Rentre légèrement le ventre et serre les fessiers.",
      "Respire normalement pendant tout l'exercice.",
    ],
    dose: "Semaines 1 à 3 : 3 fois 20 secondes. Semaines 4 à 6 : 3 fois 30 secondes. Semaines 10 à 12 : 3 fois 40 secondes. 30 secondes de repos.",
    mistakes: [
      "Les fesses trop hautes, ou le dos qui se creuse.",
      "Bloquer sa respiration.",
      "Lever la tête. Regarde le sol, la nuque dans le prolongement du dos.",
    ],
    easier: "Genoux au sol, en gardant une ligne droite des épaules aux genoux.",
    harder: "Décolle un pied du sol pendant 5 secondes, puis l'autre, sans bouger le bassin.",
    photo: "/photos/exercices/gainage-planche.jpg",
  },
  {
    slug: "gainage-lateral",
    name: "Gainage latéral",
    pillar: "physique",
    goal: "Renforcer les côtés du tronc et les hanches, qui te gardent droit dans les contacts et les changements de direction.",
    steps: [
      "Allonge-toi sur le côté, appuyé sur l'avant-bras, coude sous l'épaule.",
      "Pieds l'un sur l'autre, soulève le bassin : ligne droite de la tête aux pieds.",
      "Tiens la position, puis change de côté.",
    ],
    dose: "Semaines 1 à 3 : 2 fois 20 secondes par côté. Semaines 7 à 12 : 3 fois 30 secondes par côté. 30 secondes de repos.",
    mistakes: [
      "Laisser le bassin redescendre vers le sol.",
      "Basculer le corps vers l'avant.",
      "Poser le coude loin de l'épaule : ça charge l'épaule.",
    ],
    easier: "Genou du bas au sol, jambe pliée.",
    harder: "Lève la jambe du dessus d'une vingtaine de centimètres et tiens.",
    photo: "/photos/exercices/gainage-lateral.jpg",
  },
  {
    slug: "squats",
    name: "Squats au poids du corps",
    pillar: "physique",
    goal: "Renforcer cuisses et fessiers, les muscles de la frappe, du sprint et du saut.",
    steps: [
      "Debout, pieds écartés de la largeur des épaules, pointes légèrement vers l'extérieur.",
      "Descends comme pour t'asseoir sur une chaise, en poussant les fesses vers l'arrière.",
      "Descends jusqu'aux cuisses parallèles au sol si tu y arrives sans décoller les talons.",
      "Remonte en poussant dans le sol, genoux dans l'axe des pieds.",
    ],
    dose: "Semaines 1 à 3 : 2 séries de 10. Semaines 7 à 9 : 3 séries de 12. 1 minute de repos. Aucun poids ajouté.",
    mistakes: [
      "Genoux qui rentrent vers l'intérieur en remontant.",
      "Talons qui décollent du sol.",
      "Dos arrondi. Garde la poitrine ouverte et le regard devant.",
    ],
    easier: "Descends jusqu'à une chaise, touche-la des fesses et remonte.",
    harder: "Descends en 3 secondes, remonte vite, même nombre de répétitions.",
    photo: "/photos/exercices/squats.jpg",
  },
  {
    slug: "fentes",
    name: "Fentes avant",
    pillar: "physique",
    goal: "Travailler une jambe à la fois, comme dans la course et la frappe, et réduire l'écart entre ta jambe forte et l'autre.",
    steps: [
      "Debout, fais un grand pas en avant.",
      "Descends jusqu'à ce que le genou arrière frôle le sol, les deux genoux pliés à angle droit environ.",
      "Le genou avant reste au-dessus de la cheville et ne part pas vers l'intérieur.",
      "Repousse avec la jambe avant pour revenir debout, puis change de jambe.",
    ],
    dose: "Semaines 7 à 9 : 3 séries de 8 par jambe, en commençant par la jambe faible. 1 minute de repos.",
    mistakes: [
      "Faire un pas trop court : le genou avant part loin devant les orteils.",
      "Pencher le buste vers l'avant.",
      "Laisser tomber le genou arrière sur le sol.",
    ],
    easier: "Pieds sur place (fente statique), une main contre un mur.",
    harder: "Fentes marchées : tu avances à chaque répétition, sur 10 mètres.",
    photo: "/photos/exercices/fentes.jpg",
  },
  {
    slug: "retour-au-calme",
    name: "Retour au calme et étirements doux",
    pillar: "physique",
    goal: "Faire redescendre le cœur et relâcher les muscles après un match ou une séance.",
    steps: [
      "5 minutes de marche ou de footing très lent.",
      "Étire les mollets, l'avant et l'arrière des cuisses, les fessiers et l'intérieur des cuisses.",
      "Tiens chaque étirement 20 à 30 secondes, sans à-coups, en respirant lentement.",
      "Un étirement ne fait jamais mal : tu sens que ça tire, sans douleur.",
      "Bois de l'eau.",
    ],
    dose: "10 à 15 minutes chaque dimanche, et après une séance qui t'a fatigué.",
    mistakes: [
      "Donner des à-coups pour aller plus loin.",
      "Faire de longs étirements juste avant un sprint ou un match. Garde-les pour après.",
      "Sauter le retour au calme le lendemain d'un match.",
    ],
    easier: "Fais seulement la marche et les étirements des mollets et des cuisses.",
    harder: "Ajoute 5 minutes de mobilité : cercles de hanches, rotations du buste, montées de genoux lentes.",
    photo: "/photos/exercices/retour-au-calme.jpg",
  },

  // Mental
  {
    slug: "respiration-4-7-8",
    name: "Respiration 4-7-8",
    pillar: "mental",
    goal: "Faire baisser le stress avant un match, ou t'aider à t'endormir la veille.",
    steps: [
      "Assieds-toi ou allonge-toi, une main sur le ventre.",
      "Inspire par le nez en comptant jusqu'à 4. Ton ventre se gonfle.",
      "Bloque ta respiration en comptant jusqu'à 7.",
      "Souffle lentement par la bouche en comptant jusqu'à 8.",
      "Recommence. Compte dans ta tête, à ton rythme.",
    ],
    dose: "4 cycles au maximum au début. Le vendredi soir au lit, et dans le vestiaire avant le match.",
    mistakes: [
      "Compter trop vite pour finir plus tôt.",
      "Respirer avec les épaules. C'est le ventre qui bouge.",
      "Continuer quand la tête tourne. Arrête et respire normalement.",
    ],
    easier: "Fais 4-4-4 : inspire sur 4, bloque sur 4, souffle sur 4.",
    harder: "Fais-le assis dans le vestiaire, yeux ouverts, sans que personne le remarque.",
    photo: "/photos/exercices/respiration-4-7-8.jpg",
  },
  {
    slug: "visualisation",
    name: "Visualisation d'actions réussies",
    pillar: "mental",
    goal: "Préparer les actions du match en les voyant dans ta tête avant de les jouer.",
    steps: [
      "Installe-toi au calme, yeux fermés, et prends 3 respirations lentes.",
      "Choisis 3 actions de ton poste. Par exemple : un contrôle orienté, une passe vers l'avant, un tacle propre.",
      "Imagine chaque action en entier et à vitesse réelle : le terrain, le bruit, le ballon qui arrive, ton geste, le résultat.",
      "Vois-la avec tes propres yeux, comme si tu y étais.",
      "Termine par une action ratée, suivie de ta routine RESET et d'une action réussie.",
    ],
    dose: "5 minutes, le vendredi.",
    mistakes: [
      "Imaginer flou ou au ralenti. Ajoute des détails : la couleur des maillots, le bruit du ballon.",
      "Imaginer seulement des buts spectaculaires. Prends des actions que tu fais à ton poste.",
      "Le faire avec le téléphone allumé à côté.",
    ],
    easier: "Commence par une seule action, imaginée 3 fois de suite.",
    harder: "Imagine la même action contre un adversaire plus fort, sous la pluie, à la dernière minute.",
    photo: "/photos/exercices/visualisation.jpg",
  },
  {
    slug: "routine-reset",
    name: "Routine RESET après une erreur",
    pillar: "mental",
    goal: "Laisser une erreur derrière toi en quelques secondes et être prêt pour l'action suivante.",
    steps: [
      "R comme Respire : une grande expiration par la bouche.",
      "E comme Efface : un geste à toi, toujours le même. Par exemple frotter tes mains ou toucher ton protège-tibia.",
      "S comme Situe-toi : regarde où sont le ballon et tes coéquipiers.",
      "E comme Encourage-toi : un mot court dans ta tête, comme \"suivant\" ou \"go\".",
      "T comme Tâche suivante : ta prochaine action est simple, une passe courte ou un appel.",
    ],
    dose: "Moins de 10 secondes. Fais-la à chaque raté pendant tes séances, pour qu'elle sorte toute seule en match.",
    mistakes: [
      "Choisir un geste d'énervement. Le geste d'effacement reste neutre.",
      "Tenter un geste compliqué juste après l'erreur pour te rattraper.",
      "La garder pour les matchs. Sans entraînement, tu l'oublies au moment où tu en as besoin.",
    ],
    easier: "Garde seulement R et T : respire, puis joue simple.",
    harder: "Après chaque match, note combien de fois tu l'as faite et ce qui s'est passé juste après.",
    photo: "/photos/exercices/routine-reset.jpg",
  },
  {
    slug: "routine-avant-match",
    name: "Routine d'avant-match",
    pillar: "mental",
    goal: "Arriver au match prêt et calme, avec les mêmes gestes à chaque fois.",
    steps: [
      "La veille : sac prêt (crampons, protège-tibias, gourde, maillot) et coucher à ton heure habituelle.",
      "Le jour du match : un repas 2 à 3 heures avant (pâtes, riz ou pain, avec un peu de viande, de poisson ou d'œufs), et de l'eau dans la matinée.",
      "Dans le vestiaire : 4 cycles de respiration 4-7-8.",
      "Rappelle-toi ton objectif de match et ta phrase de confiance.",
      "Pendant l'échauffement de l'équipe, concentre-toi sur tes premiers contrôles et tes premières passes.",
    ],
    dose: "Le sac la veille au soir, le reste dans les 3 heures avant le coup d'envoi.",
    mistakes: [
      "Préparer son sac le matin même, en courant.",
      "Manger lourd ou gras juste avant le match.",
      "Passer l'heure d'avant le match sur son téléphone.",
    ],
    easier: "Garde seulement le sac prêt la veille et les respirations dans le vestiaire.",
    harder: "Écris ta routine sur une carte et suis-la dans l'ordre à chaque match, même amical.",
    photo: "/photos/exercices/routine-avant-match.jpg",
  },
  {
    slug: "phrases-confiance",
    name: "Phrases de confiance",
    pillar: "mental",
    goal: "Avoir en tête des phrases qui t'aident à jouer, prêtes pour les moments difficiles.",
    steps: [
      "Écris 3 phrases courtes sur ce que tu fais en match quand tu joues bien. Exemples : \"je demande le ballon\", \"je lève la tête avant de recevoir\", \"je cours pour l'équipe\".",
      "Chaque phrase commence par \"je\" et décrit une action, au présent.",
      "Lis-les à voix basse, 3 fois.",
      "Choisis celle que tu gardes pour le prochain match.",
    ],
    dose: "3 minutes, le vendredi des semaines 4 à 6. Ensuite, relis-les avant chaque match.",
    mistakes: [
      "Écrire des phrases avec \"ne pas\", comme \"je ne rate pas mes passes\". Écris ce que tu fais : \"je fais des passes simples\".",
      "Écrire des phrases vagues comme \"je suis le meilleur\".",
    ],
    easier: "Une seule phrase, répétée avant chaque match.",
    harder: "Dis ta phrase dans ta tête à chaque arrêt de jeu pendant le match.",
    photo: "/photos/exercices/phrases-confiance.jpg",
  },
  {
    slug: "objectif-de-match",
    name: "Objectif de match",
    pillar: "mental",
    goal: "Te donner une mission précise pour le match, qui dépend de toi et que tu peux compter.",
    steps: [
      "Choisis un seul objectif lié à ce que tu travailles cette semaine.",
      "Il doit dépendre de toi seul. Exemples : \"regarder par-dessus l'épaule avant 5 réceptions\", \"3 frappes cadrées\", \"faire RESET après chaque erreur\".",
      "Écris-le, avec un nombre.",
      "Après le match, compte : atteint ou pas, et pourquoi.",
    ],
    dose: "2 minutes le vendredi, vérification après le match du samedi.",
    mistakes: [
      "Prendre un objectif de résultat comme \"gagner\" ou \"marquer\" : il dépend aussi des autres.",
      "Se fixer 4 objectifs. Un seul suffit.",
      "Choisir un objectif impossible à compter, comme \"bien jouer\".",
    ],
    easier: "Prends un objectif simple, par exemple \"demander le ballon 5 fois\".",
    harder: "Monte le nombre d'une semaine à l'autre.",
    photo: "/photos/exercices/objectif-de-match.jpg",
  },
  {
    slug: "bilan-apres-match",
    name: "Bilan après le match",
    pillar: "mental",
    goal: "Tirer une leçon de chaque match en 5 minutes, puis passer à autre chose.",
    steps: [
      "Le soir du match, réponds à 3 questions dans ton carnet (un cahier ou les notes de ton téléphone).",
      "Une action réussie : qu'est-ce que tu as fait de bien ?",
      "Une erreur : qu'est-ce que tu as fait juste après ? As-tu fait RESET ?",
      "Ton objectif de match : atteint ou pas ?",
      "Note ta confiance sur 10, et choisis ce que tu travailles la semaine suivante.",
    ],
    dose: "5 minutes, le soir de chaque match.",
    mistakes: [
      "Ne noter que les erreurs.",
      "Juger ton match au score.",
      "Écrire des pages. Trois phrases suffisent.",
    ],
    easier: "Réponds seulement à la première question et note ta confiance.",
    harder: "Demande à ton coach ou à un parent une chose à améliorer, et compare avec ce que tu as écrit.",
    photo: "/photos/exercices/bilan-apres-match.jpg",
  },
  {
    slug: "penalty-pression",
    name: "Penalties sous pression",
    pillar: "mental",
    goal: "T'habituer à frapper quand le tir compte, avec toujours la même routine.",
    steps: [
      "Pose le ballon au point de penalty (11 mètres), ou à 9 mètres d'un mur avec deux plots comme poteaux.",
      "Avant chaque tir, la même routine : tu poses le ballon, 3 pas en arrière, une respiration, tu choisis ton coin et tu n'en changes plus.",
      "Série de 5 tirs. À chaque tir raté, la série repart de zéro.",
      "Si quelqu'un est là, demande-lui de compter à voix haute ou de faire du bruit pendant ta course d'élan.",
    ],
    dose: "Semaines 7 à 12 : 2 séries de 5 tirs réussis à la suite, 10 minutes au maximum.",
    mistakes: [
      "Changer de coin au dernier moment.",
      "Abandonner la routine quand les tirs commencent à rater.",
      "Regarder le gardien pendant la course d'élan. Ton regard reste sur ton coin, puis sur le ballon.",
    ],
    easier: "Séries de 3 tirs.",
    harder: "Alterne pied fort et pied faible. La série repart aussi de zéro si le tir n'est pas dans le coin choisi.",
    diagram: {
      cones: [
        [36, 4],
        [64, 4],
      ],
      ball: [50, 40],
      player: [44, 50],
      paths: [
        { from: [44, 50], to: [48, 42], kind: "run" },
        { from: [50, 40], to: [60, 7], kind: "pass" },
      ],
    },
  },

  // Vision
  {
    slug: "regard-epaule",
    name: "Regard par-dessus l'épaule",
    pillar: "vision",
    goal: "Savoir ce qu'il y a derrière toi avant que le ballon arrive, pour choisir la suite avant de le toucher.",
    steps: [
      "Face à un mur, à 5 mètres. Un partenaire (parent, frère, copain) se place 5 mètres derrière toi, sur le côté.",
      "Passe contre le mur. Pendant que le ballon revient, tourne la tête par-dessus l'épaule : ton partenaire montre un nombre avec ses doigts.",
      "Annonce le nombre à voix haute avant de toucher le ballon.",
      "Ton partenaire joue le défenseur : contrôle du côté opposé à lui, puis repasse.",
      "Il change de côté de temps en temps. Vérifie les deux épaules.",
    ],
    dose: "Semaines 4 à 6 : 3 séries de 12 réceptions. Semaines 10 à 12 : 3 séries de 15 réceptions. 1 minute de pause.",
    mistakes: [
      "Regarder trop tard, quand le ballon est déjà dans tes pieds.",
      "Tourner tout le corps. Seule la tête bouge.",
      "Deviner le nombre sans avoir tourné la tête, pour aller plus vite.",
    ],
    easier: "Seul : à chaque retour du ballon, regarde un repère derrière toi (un arbre, un poteau) avant de contrôler.",
    harder: "Regarde deux fois avant chaque réception, une fois de chaque côté.",
    diagram: {
      wall: true,
      cones: [[28, 54]],
      ball: [50, 34],
      player: [50, 39],
      paths: [
        { from: [48, 34], to: [48, 4], kind: "pass" },
        { from: [53, 4], to: [53, 34], kind: "pass" },
        { from: [53, 38], to: [70, 38], kind: "dribble" },
      ],
    },
  },
  {
    slug: "conduite-tete-haute",
    name: "Conduite tête haute",
    pillar: "vision",
    goal: "Conduire le ballon en gardant les yeux sur le jeu le plus souvent possible.",
    steps: [
      "Délimite un carré de 10 mètres de côté avec 4 plots.",
      "Conduis le ballon dans le carré, à petites touches, en changeant souvent de direction.",
      "Toutes les 2 ou 3 touches, lève les yeux et nomme à voix haute un objet que tu vois au loin.",
      "Si quelqu'un est avec toi, il lève une main : tu pars vers le plot le plus proche de cette main.",
    ],
    dose: "Semaines 1 à 3 : 3 fois 1 minute 30. 1 minute de pause.",
    mistakes: [
      "Lever les yeux seulement quand le ballon est arrêté.",
      "Pousser le ballon trop loin parce que tu ne le regardes plus. Fais des touches plus petites.",
      "Tourner toujours du même côté.",
    ],
    easier: "Marche avec le ballon et lève les yeux toutes les 4 touches.",
    harder: "Joue dans un carré de 6 mètres, avec la semelle et l'extérieur du pied.",
    diagram: {
      cones: [
        [30, 10],
        [70, 10],
        [30, 50],
        [70, 50],
      ],
      ball: [46, 34],
      player: [43, 37],
      paths: [
        { from: [46, 34], to: [60, 20], kind: "dribble" },
        { from: [60, 20], to: [40, 20], kind: "dribble" },
        { from: [40, 20], to: [58, 42], kind: "dribble" },
      ],
    },
  },
  {
    slug: "plots-couleurs",
    name: "Plots de couleurs",
    pillar: "vision",
    goal: "Prendre une décision vite à partir de ce que tu vois ou entends, ballon au pied.",
    steps: [
      "Pose 4 plots de couleurs différentes en carré, chacun à 6 mètres du centre.",
      "Tu pars du centre avec le ballon.",
      "Ton partenaire annonce une couleur : tu conduis le ballon jusqu'à ce plot, tu le contournes et tu reviens au centre.",
      "Il annonce la couleur suivante au moment où tu reviens, sans prévenir.",
    ],
    dose: "Semaines 4 à 6 : 3 séries de 45 secondes. Semaines 10 à 12 : 4 séries de 45 secondes. 1 minute de pause.",
    mistakes: [
      "Partir avant l'annonce pour gagner du temps.",
      "Revenir au centre en marchant.",
      "Fixer le ballon et ne plus voir les plots.",
    ],
    easier: "Seul : lance un dé, le chiffre donne le plot (de 1 à 4, tu relances sur 5 et 6).",
    harder: "Ton partenaire montre la couleur du doigt, sans parler : tu dois lever la tête pour la voir.",
    diagram: {
      cones: [
        [50, 8],
        [80, 30],
        [50, 52],
        [20, 30],
      ],
      ball: [53, 28],
      player: [49, 30],
      paths: [
        { from: [53, 28], to: [76, 28], kind: "dribble" },
        { from: [76, 34], to: [53, 34], kind: "dribble" },
      ],
    },
  },
  {
    slug: "portes-de-passe",
    name: "Portes de passe",
    pillar: "vision",
    goal: "Choisir une cible libre et passer dedans sans t'arrêter, comme quand tu cherches un coéquipier démarqué.",
    steps: [
      "Dans un carré de 15 mètres, fais 4 petites portes de 1 mètre avec des plots, placées au hasard.",
      "Conduis le ballon dans le carré.",
      "Lève la tête, choisis une porte et passe le ballon à travers, à 5 ou 6 mètres de distance.",
      "Récupère le ballon et vise une autre porte. Jamais la même deux fois de suite.",
    ],
    dose: "Semaines 7 à 9 : 3 séries de 2 minutes. 1 minute de pause.",
    mistakes: [
      "Viser toujours la porte la plus proche.",
      "S'arrêter pour passer.",
      "Passer seulement du pied fort.",
    ],
    easier: "Portes de 2 mètres, et tu as le droit d'arrêter le ballon avant de passer.",
    harder: "Un partenaire se place devant une porte pour la fermer : tu dois en choisir une autre.",
    diagram: {
      cones: [
        [16, 14],
        [16, 22],
        [78, 10],
        [86, 10],
        [76, 50],
        [84, 50],
        [28, 44],
        [28, 52],
      ],
      ball: [50, 30],
      player: [46, 32],
      paths: [
        { from: [50, 30], to: [62, 22], kind: "dribble" },
        { from: [62, 22], to: [82, 5], kind: "pass" },
      ],
    },
  },
  {
    slug: "appels-de-balle",
    name: "Appels de balle",
    pillar: "vision",
    goal: "Te démarquer au bon moment pour recevoir : dans le dos du défenseur ou vers le porteur du ballon.",
    steps: [
      "Il te faut un partenaire passeur. Un plot au milieu joue le défenseur.",
      "Pars à côté du plot, à l'arrêt.",
      "Quand ton partenaire lève la tête, fais ton appel : en profondeur derrière le plot, ou en décrochant vers lui.",
      "Change de rythme : quelques pas lents, puis une accélération au moment où il peut passer.",
      "Reçois, contrôle, et redonne-lui le ballon.",
    ],
    dose: "Semaines 7 à 9 : 3 séries de 6 appels. Semaines 10 à 12 : 3 séries de 8 appels. 1 minute de pause.",
    mistakes: [
      "Courir tout le temps à la même vitesse : le défenseur te suit sans effort.",
      "Partir trop tôt, avant que le passeur puisse te voir.",
      "Faire l'appel sans regarder le passeur.",
    ],
    easier: "Le passeur annonce \"profondeur\" ou \"pied\" : tu fais l'appel demandé.",
    harder: "Ajoute un vrai défenseur et jouez à 2 contre 1.",
    diagram: {
      cones: [[58, 30]],
      ball: [18, 30],
      player: [54, 38],
      paths: [
        { from: [54, 38], to: [82, 22], kind: "run" },
        { from: [20, 30], to: [80, 24], kind: "pass" },
        { from: [54, 40], to: [38, 44], kind: "run" },
      ],
    },
  },
  {
    slug: "corps-ouvert",
    name: "Prise de balle corps ouvert",
    pillar: "vision",
    goal: "Recevoir le ballon de trois-quarts, le corps tourné vers le jeu, pour voir le terrain et jouer vers l'avant.",
    steps: [
      "Face à un mur à 5 mètres. Pose une porte de 2 plots à 4 mètres sur ta gauche et une autre à 4 mètres sur ta droite.",
      "Mets-toi de trois-quarts, épaules ouvertes vers une porte.",
      "Passe contre le mur et reçois avec le pied le plus éloigné du mur.",
      "Ton contrôle t'emmène directement à travers la porte. Reviens et change de côté.",
    ],
    dose: "Semaines 7 à 9 : 3 séries de 10 réceptions. Semaines 10 à 12 : 3 séries de 12 réceptions. 1 minute de pause.",
    mistakes: [
      "Recevoir face au mur, pieds parallèles : tu dois te retourner après.",
      "Recevoir du pied le plus proche du mur.",
      "Fixer le ballon. Jette un coup d'œil vers la porte avant la réception.",
    ],
    easier: "Sans porte : contrôle simplement vers le côté où ton corps est ouvert.",
    harder: "Reçois en une touche, directement à travers la porte.",
    diagram: {
      wall: true,
      cones: [
        [20, 36],
        [20, 44],
        [80, 36],
        [80, 44],
      ],
      ball: [48, 37],
      player: [46, 41],
      paths: [
        { from: [47, 37], to: [44, 4], kind: "pass" },
        { from: [49, 4], to: [52, 37], kind: "pass" },
        { from: [53, 40], to: [86, 40], kind: "dribble" },
      ],
    },
  },
  {
    slug: "analyse-video-poste",
    name: "Analyse vidéo d'un joueur à ton poste",
    pillar: "vision",
    goal: "Comprendre ce que fait un bon joueur de ton poste, surtout quand il n'a pas le ballon.",
    steps: [
      "Choisis un joueur pro qui joue à ton poste. Cherche un match entier, ou une vidéo qui montre toutes ses touches de balle sur un match.",
      "Regarde 10 minutes en suivant uniquement ce joueur, même quand le ballon est loin de lui.",
      "Compte combien de fois il regarde autour de lui avant de recevoir.",
      "Note où il se place quand son équipe a le ballon, et quand elle le perd.",
      "Écris une chose que tu vas copier au prochain match.",
    ],
    dose: "10 à 15 minutes, le mercredi des semaines 3, 6, 9 et 12.",
    mistakes: [
      "Regarder seulement les buts et les dribbles.",
      "Regarder sans rien noter.",
      "Choisir ton joueur préféré alors qu'il joue à un autre poste.",
    ],
    easier: "Regarde 5 minutes et note une seule chose.",
    harder: "Demande à un parent de te filmer pendant un match, et compare avec ce que tu as noté.",
    photo: "/photos/exercices/analyse-video-poste.jpg",
  },
];

const BY_SLUG = new Map(EXERCISES.map((e) => [e.slug, e]));

export function getExercise(slug: string): Exercise | undefined {
  return BY_SLUG.get(slug);
}
