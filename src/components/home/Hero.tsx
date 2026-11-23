import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { ButtonLink } from "@/components/Button";
import { PHOTOS } from "@/content/photos";
import { QUESTIONS } from "@/content/quiz";

const PHOTO = "/photos/accueil/hero-volee.jpg";

// Accueil, premier écran : titre, une phrase, le bouton du test à gauche,
// la photo à droite. Rien n'y est animé : il est visible dès le chargement.
// La photo est l'image la plus grande du premier écran (LCP) : chargée tout
// de suite, en priorité haute (fetchPriority, que Lighthouse demande).
export function Hero() {
  return (
    <section
      aria-labelledby="accueil"
      className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-10 pb-20 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:items-center md:gap-12 md:px-8 md:pt-14 md:pb-28"
    >
      <div>
        <h1
          id="accueil"
          className="text-[3.5rem] leading-[0.88] font-extrabold uppercase font-stretch-75% text-balance sm:text-7xl lg:text-8xl"
        >
          Dirige ton jeu
        </h1>
        <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-ink-2 md:text-xl">
          Un programme gratuit de 12 semaines pour les joueurs de 13-14 ans. Le test te dit par où
          commencer.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ButtonLink href="/test">
            Faire le test
            <ArrowRightIcon size={18} weight="regular" aria-hidden />
          </ButtonLink>
          <p className="font-mono text-sm text-ink-2">
            {QUESTIONS.length} questions, sans inscription
          </p>
        </div>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded md:aspect-[4/5]">
        <Image
          src={PHOTO}
          alt={PHOTOS[PHOTO].alt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1152px) 480px, (min-width: 768px) 45vw, 100vw"
          className="object-cover object-[50%_42%]"
        />
      </div>
    </section>
  );
}
