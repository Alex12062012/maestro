import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/home/Reveal";
import { EXERCISES } from "@/content/exercises";
import { PHOTOS } from "@/content/photos";
import { PILLAR_LABELS, type Pillar } from "@/content/quiz";

// La méthode : les quatre piliers en grille asymétrique, une photo chacun.
// Ordinateur : technique et mental à gauche, physique en hauteur à droite,
// vision en bandeau dessous. Téléphone : une colonne.
type Tile = {
  pillar: Pillar;
  photo: string;
  text: string;
  /** Place dans la grille de 12 colonnes. */
  cell: string;
  /** Cadre de la photo. */
  frame: string;
  position?: string;
  sizes: string;
};

// Photo sur 7 colonnes de 12.
const WIDE = "(min-width: 1152px) 620px, (min-width: 768px) 55vw, 100vw";

const TILES: Tile[] = [
  {
    pillar: "technique",
    photo: "/photos/accueil/technique-passe.jpg",
    text: "Contrôle orienté, pied faible, conduite et frappes. Seul, avec un ballon et un mur.",
    cell: "md:col-span-7",
    frame: "aspect-[3/2]",
    sizes: WIDE,
  },
  {
    pillar: "physique",
    photo: "/photos/exercices/squats.jpg",
    text: "Sprints courts, appuis, gainage et squats, au poids du corps, à des volumes pensés pour ton âge.",
    cell: "md:col-span-5 md:row-span-2",
    frame: "aspect-[4/3] md:aspect-auto md:min-h-80 md:flex-1",
    position: "object-[50%_60%]",
    sizes: "(min-width: 1152px) 440px, (min-width: 768px) 40vw, 100vw",
  },
  {
    pillar: "mental",
    photo: "/photos/exercices/visualisation.jpg",
    text: "Respiration, routine RESET après une erreur, visualisation et un objectif écrit pour chaque match.",
    cell: "md:col-span-7",
    frame: "aspect-[4/3] md:aspect-[2/1]",
    position: "object-[40%_55%]",
    sizes: WIDE,
  },
];

const VISION: Tile = {
  pillar: "vision",
  photo: "/photos/exercices/analyse-video-poste.jpg",
  text: "Regarder par-dessus l'épaule avant de recevoir, conduire tête haute, analyser en vidéo un joueur à ton poste.",
  cell: "md:col-span-12",
  frame: "aspect-[4/3] md:aspect-[3/2]",
  sizes: WIDE,
};

const count = (p: Pillar) => EXERCISES.filter((e) => e.pillar === p).length;

function Caption({ pillar, text }: { pillar: Pillar; text: string }) {
  const label = PILLAR_LABELS[pillar];
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-3xl leading-none font-extrabold uppercase font-stretch-75% md:text-4xl">
          {label}
        </h3>
        <Link
          href={`/exercices?pilier=${pillar}`}
          className="group inline-flex h-11 items-center gap-1.5 font-mono text-sm text-signal underline-offset-4 hover:underline"
        >
          {count(pillar)} exercices
          <span className="sr-only"> de {label.toLowerCase()}</span>
          <ArrowRightIcon
            size={16}
            weight="regular"
            aria-hidden
            className="transition-transform duration-200 ease-out group-hover:translate-x-1"
          />
        </Link>
      </div>
      <p className="mt-1 max-w-[44ch] leading-relaxed text-on-dark/80">{text}</p>
    </>
  );
}

function Photo({ tile }: { tile: Tile }) {
  return (
    <div className={`relative overflow-hidden rounded ${tile.frame}`}>
      <Image
        src={tile.photo}
        alt={PHOTOS[tile.photo].alt}
        fill
        sizes={tile.sizes}
        className={`object-cover ${tile.position ?? ""}`}
      />
    </div>
  );
}

export function Piliers() {
  return (
    <section aria-labelledby="piliers" className="on-dark bg-surface-dark text-on-dark">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-8">
          <h2
            id="piliers"
            className="text-5xl leading-[0.9] font-extrabold uppercase font-stretch-75% text-balance md:text-7xl"
          >
            Quatre piliers
          </h2>
          <p className="max-w-[44ch] text-lg leading-relaxed text-on-dark/80">
            Le test te donne un score sur 100 pour chacun. Chaque semaine du programme travaille les
            quatre, avec une fiche pour chaque exercice.
          </p>
        </div>

        <ul className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-12">
          {TILES.map((tile, i) => (
            <Reveal
              as="li"
              key={tile.pillar}
              delay={i === 1 ? 0.1 : 0}
              className={`flex flex-col gap-5 ${tile.cell}`}
            >
              <Photo tile={tile} />
              <div>
                <Caption pillar={tile.pillar} text={tile.text} />
              </div>
            </Reveal>
          ))}

          <Reveal
            as="li"
            className={`grid gap-5 md:grid-cols-12 md:items-end md:gap-8 ${VISION.cell}`}
          >
            <div className="md:order-last md:col-span-7">
              <Photo tile={VISION} />
            </div>
            <div className="md:col-span-5">
              <Caption pillar={VISION.pillar} text={VISION.text} />
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
