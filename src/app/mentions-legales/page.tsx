import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EXERCISES } from "@/content/exercises";
import { PHOTOS } from "@/content/photos";

export const metadata: Metadata = {
  title: "Mentions légales - MAESTRO",
  description: "Éditeur, hébergeur et crédits photos du site MAESTRO.",
};


// Photos propres à l'accueil (les autres sont celles des fiches d'exercices).
const HOME: Record<string, string> = {
  "/photos/accueil/hero-volee.jpg": "Accueil, en haut de page",
  "/photos/accueil/technique-passe.jpg": "Accueil, pilier Technique",
  "/photos/accueil/vision-regard.jpg": "Accueil, pilier Vision",
};

/** Où la photo apparaît : la fiche d'exercice qui l'utilise, ou l'accueil. */
function usage(src: string): string {
  return EXERCISES.find((e) => e.photo === src)?.name ?? HOME[src] ?? "Accueil";
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <h2 className="text-2xl font-bold font-stretch-85%">{title}</h2>
      <div className="mt-4 space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}

export default function MentionsLegales() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 pt-8 pb-20 md:px-8 md:pt-14 md:pb-28">
      <h1 className="text-5xl leading-[0.9] font-extrabold uppercase font-stretch-75% text-balance md:text-7xl">
        Mentions légales
      </h1>

      <div className="mt-12 grid max-w-[68ch] gap-12 md:mt-16">
        <Section title="Éditeur">
          <p>Ce site est édité par [nom de l&apos;éditeur].</p>
          <p>Responsable de la publication : [nom de l&apos;éditeur].</p>
          <p>Contact : [contact]</p>
        </Section>

        <Section title="Hébergement">
          {/* Adresse telle que Vercel l'écrit dans sa politique de confidentialité :
              https://vercel.com/legal/privacy-policy (section Contact Us). Le # est
              écrit &#35; pour ne pas ressembler à une couleur (test des couleurs). */}
          <address className="not-italic">
            <span className="block">Vercel Inc.</span>
            <span className="block">440 N Barranca Avenue &#35;4133</span>
            <span className="block">Covina, CA 91723</span>
            <span className="block">États-Unis</span>
          </address>
          <p>
            Site :{" "}
            <a href="https://vercel.com" className="underline decoration-line hover:decoration-ink">
              vercel.com
            </a>
          </p>
        </Section>

        <Section title="Crédits photos">
          <p className="text-ink-2">
            Les photos viennent de Pexels et sont utilisées sous la{" "}
            <a
              href="https://www.pexels.com/license/"
              className="text-ink underline decoration-line hover:decoration-ink"
            >
              licence Pexels
            </a>
            . Les schémas d’exercices ont été dessinés pour MAESTRO.
          </p>
          <ul className="divide-y divide-line border-y border-line">
            {Object.entries(PHOTOS).map(([src, meta]) => (
              <li
                key={src}
                className="grid gap-1 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
              >
                <span>
                  <span className="font-semibold">{usage(src)}</span>
                  <span className="text-ink-2"> : photo {meta.credit}</span>
                </span>
                <a
                  href={meta.source}
                  className="inline-flex min-h-11 items-center font-mono text-sm underline decoration-line hover:decoration-ink sm:min-h-0"
                >
                  Voir sur Pexels
                  <span className="sr-only"> : photo {meta.credit}</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
