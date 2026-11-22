// Photos des fiches d'exercices : dimensions réelles des fichiers de
// public/photos/exercices/ et texte alternatif. Sources et licences dans
// public/photos/SOURCES.md. Une photo absente d'ici n'est pas affichée.

export type PhotoMeta = {
  width: number;
  height: number;
  alt: string;
  /** Photographe, crédité sous la photo (Pexels n'impose pas de crédit). */
  credit: string;
};

export const PHOTOS: Record<string, PhotoMeta> = {
  "/photos/exercices/gainage-planche.jpg": {
    width: 1600,
    height: 1077,
    alt: "Un jeune homme tient la planche sur les avant-bras, sur un terrain de sport en plein air.",
    credit: "Andrea Piacquadio",
  },
  "/photos/exercices/gainage-lateral.jpg": {
    width: 1600,
    height: 1068,
    alt: "Une sportive en gainage latéral sur un terrain de foot, le bras du dessus tendu vers le ciel.",
    credit: "Leon Mart",
  },
  "/photos/exercices/squats.jpg": {
    width: 1067,
    height: 1600,
    alt: "Un joueur en squat au poids du corps sur un terrain synthétique, les cuisses parallèles au sol.",
    credit: "RDNE Stock project",
  },
  "/photos/exercices/fentes.jpg": {
    width: 1067,
    height: 1600,
    alt: "Un joueur en fente avant sur un terrain synthétique, le genou arrière près du sol.",
    credit: "RDNE Stock project",
  },
  "/photos/exercices/retour-au-calme.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un footballeur étire l'avant de sa hanche en fente basse, à la fin d'un entraînement.",
    credit: "Franco Monsalvo",
  },
  "/photos/exercices/respiration-4-7-8.jpg": {
    width: 1067,
    height: 1600,
    alt: "Un jeune homme respire calmement, les yeux fermés.",
    credit: "Ivan S",
  },
  "/photos/exercices/visualisation.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un jeune joueur assis en tailleur sur le terrain, un ballon dans la main, concentré.",
    credit: "Tima Miroshnichenko",
  },
  "/photos/exercices/routine-reset.jpg": {
    width: 1067,
    height: 1600,
    alt: "Un joueur reprend son souffle sur le terrain, les mains sur les genoux.",
    credit: "Mica Asato",
  },
  "/photos/exercices/routine-avant-match.jpg": {
    width: 1067,
    height: 1600,
    alt: "Une joueuse lace ses crampons sur le banc du vestiaire, son sac prêt à côté d'elle.",
    credit: "Anastasia Shuraeva",
  },
  "/photos/exercices/phrases-confiance.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un élève assis en tailleur écrit dans un cahier, au bord d'un terrain.",
    credit: "Mary Taylor",
  },
  "/photos/exercices/objectif-de-match.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un jeune assis en tailleur note quelque chose dans un carnet.",
    credit: "Armin Rimoldi",
  },
  "/photos/exercices/bilan-apres-match.jpg": {
    width: 1600,
    height: 1065,
    alt: "Un jeune joueur assis sur un terrain synthétique écrit sur son téléphone, son sac à côté de lui.",
    credit: "ANH LÊ",
  },
  "/photos/exercices/analyse-video-poste.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un jeune homme commente un match de foot qu'il regarde à la télévision.",
    credit: "khezez",
  },
};
