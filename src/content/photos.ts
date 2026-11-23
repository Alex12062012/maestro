// Photos du site : dimensions réelles des fichiers de public/photos/, texte
// alternatif, photographe et page source. Sources et licences dans
// public/photos/SOURCES.md (un test vérifie que les deux listes concordent).
// Une photo absente d'ici n'est pas affichée.

export type PhotoMeta = {
  width: number;
  height: number;
  alt: string;
  /** Photographe, crédité sous la photo (Pexels n'impose pas de crédit). */
  credit: string;
  /** Page de la photo chez Pexels, citée dans les mentions légales. */
  source: string;
  /** Précision affichée sous la photo, quand elle diffère des consignes de la fiche. */
  note?: string;
};

export const PHOTOS: Record<string, PhotoMeta> = {
  "/photos/exercices/gainage-planche.jpg": {
    width: 1600,
    height: 1077,
    alt: "Un jeune homme tient la planche sur les avant-bras, sur un terrain de sport en plein air.",
    credit: "Andrea Piacquadio",
    source: "https://www.pexels.com/photo/young-determined-man-training-alone-on-street-sports-ground-in-sunny-day-3768901/",
  },
  "/photos/exercices/gainage-lateral.jpg": {
    width: 1280,
    height: 1600,
    alt: "Un sportif en gainage latéral sur un court extérieur, en appui sur une main, le bras du dessus tendu vers le ciel.",
    credit: "Göksun Barış Gökalp",
    source: "https://www.pexels.com/photo/man-practicing-yoga-on-outdoor-tennis-court-35225473/",
    note: "Sur la photo : la version sur la main, plus dure. Commence sur l’avant-bras, comme dans les étapes.",
  },
  "/photos/exercices/squats.jpg": {
    width: 1067,
    height: 1600,
    alt: "Un joueur en squat au poids du corps sur un terrain synthétique, les cuisses parallèles au sol.",
    credit: "RDNE Stock project",
    source: "https://www.pexels.com/photo/man-in-sportswear-warming-up-his-body-for-soccer-7187856/",
  },
  "/photos/exercices/fentes.jpg": {
    width: 1067,
    height: 1600,
    alt: "Un joueur en fente avant sur un terrain synthétique, le genou arrière près du sol.",
    credit: "RDNE Stock project",
    source: "https://www.pexels.com/photo/man-in-red-sweat-suit-doing-leg-stretching-7187863/",
  },
  "/photos/exercices/retour-au-calme.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un joueur assis sur un terrain synthétique, penché sur sa jambe tendue, étire l’arrière de sa cuisse.",
    credit: "RDNE Stock project",
    source: "https://www.pexels.com/photo/an-active-man-stretching-his-body-7188053/",
  },
  "/photos/exercices/respiration-4-7-8.jpg": {
    width: 1067,
    height: 1600,
    alt: "Un jeune homme respire calmement, les yeux fermés.",
    credit: "Ivan S",
    source: "https://www.pexels.com/photo/close-up-photo-of-man-with-his-eyes-closed-8955463/",
  },
  "/photos/exercices/visualisation.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un jeune joueur assis en tailleur sur le terrain, un ballon dans la main, concentré.",
    credit: "Tima Miroshnichenko",
    source: "https://www.pexels.com/photo/man-in-uniform-sitting-on-green-grass-field-holding-a-soccer-ball-6078299/",
  },
  "/photos/exercices/routine-reset.jpg": {
    width: 1067,
    height: 1600,
    alt: "Un joueur reprend son souffle sur le terrain, les mains sur les genoux.",
    credit: "Mica Asato",
    source: "https://www.pexels.com/photo/man-standing-on-grass-2347868/",
  },
  "/photos/exercices/routine-avant-match.jpg": {
    width: 1067,
    height: 1600,
    alt: "Une joueuse lace ses crampons sur le banc du vestiaire, son sac prêt à côté d’elle.",
    credit: "Anastasia Shuraeva",
    source: "https://www.pexels.com/photo/football-player-sitting-on-a-bench-9442076/",
  },
  "/photos/exercices/phrases-confiance.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un élève assis en tailleur écrit dans un cahier, au bord d’un terrain.",
    credit: "Mary Taylor",
    source: "https://www.pexels.com/photo/crop-ethnic-pupil-doing-homework-in-schoolyard-5896749/",
  },
  "/photos/exercices/objectif-de-match.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un jeune assis en tailleur note quelque chose dans un carnet.",
    credit: "Armin Rimoldi",
    source: "https://www.pexels.com/photo/crop-man-writing-in-notepad-5553712/",
  },
  "/photos/exercices/bilan-apres-match.jpg": {
    width: 1600,
    height: 1065,
    alt: "Un jeune joueur assis sur un terrain synthétique regarde son téléphone, son sac posé à côté de lui.",
    credit: "ANH LÊ",
    source: "https://www.pexels.com/photo/young-football-player-preparing-for-match-in-hanoi-35137944/",
  },
  "/photos/exercices/analyse-video-poste.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un jeune homme parle en faisant un geste de la main, devant une télévision qui diffuse un match de foot.",
    credit: "khezez",
    source: "https://www.pexels.com/photo/man-watching-soccer-match-intently-indoors-36799150/",
  },
  "/photos/accueil/hero-volee.jpg": {
    width: 1067,
    height: 1600,
    alt: "Un jeune joueur reprend le ballon de volée sur un terrain synthétique, au coucher du soleil.",
    credit: "William Larsen",
    source: "https://www.pexels.com/photo/a-man-playing-football-11916079/",
  },
  "/photos/accueil/technique-passe.jpg": {
    width: 1600,
    height: 1065,
    alt: "Un jeune joueur en maillot bleu frappe le ballon de l’intérieur du pied sur un terrain synthétique.",
    credit: "Alexander Nadrilyanski",
    source: "https://www.pexels.com/photo/photo-of-a-boy-kicking-a-soccer-ball-7307483/",
  },
  "/photos/accueil/vision-regard.jpg": {
    width: 1600,
    height: 1067,
    alt: "Un jeune joueur en maillot turquoise, le ballon à ses pieds, lève la tête vers ses coéquipiers avant de jouer.",
    credit: "Kampus Production",
    source: "https://www.pexels.com/photo/a-boy-standing-near-the-ball-8941614/",
  },
};
