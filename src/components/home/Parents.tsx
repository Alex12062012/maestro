import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";

// Bloc parents, au vouvoiement : une fiche technique en quatre lignes.
const FACTS = [
  {
    label: "Prix",
    value: "Gratuit",
    text: "Pas d'abonnement, rien à acheter.",
  },
  {
    label: "Inscription",
    value: "Aucune",
    text: "Pas de compte ni d'adresse e-mail. Votre enfant arrive et commence.",
  },
  {
    label: "Données personnelles",
    value: "Aucune collectée",
    text: "Le test et la progression restent dans le navigateur de son appareil. Une mesure d'audience anonyme, sans cookie, compte les pages vues et trois étapes : test fini, programme commencé, semaine finie.",
  },
  {
    label: "Exercices",
    value: "Adaptés à 13-14 ans",
    text: "Au poids du corps, avec des volumes qui montent doucement. Une relecture par un éducateur sportif reste recommandée.",
  },
];

export function Parents() {
  return (
    <section
      aria-labelledby="parents"
      className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-32"
    >
      <Reveal y={0} className="grid gap-10 border-t-2 border-ink pt-10 md:pt-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
        <div>
          <h2
            id="parents"
            className="text-4xl leading-[0.95] font-extrabold uppercase font-stretch-75% text-balance md:text-5xl"
          >
            Pour les parents
          </h2>
          <p className="mt-5 max-w-[40ch] leading-relaxed text-ink-2">
            MAESTRO aide votre enfant à s&apos;entraîner seul entre deux séances de club. Ce
            n&apos;est pas un suivi médical.
          </p>
          <Link
            href="/confidentialite"
            className="mt-4 inline-flex h-11 items-center font-semibold underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink"
          >
            Lire la politique de confidentialité
          </Link>
        </div>

        <dl className="grid gap-px bg-line sm:grid-cols-2">
          {FACTS.map((f) => (
            <div key={f.label} className="bg-bg py-6 sm:px-6 sm:odd:pl-0">
              <dt className="font-mono text-sm text-ink-2">{f.label}</dt>
              <dd className="mt-2">
                <span className="block text-2xl leading-tight font-bold font-stretch-85%">
                  {f.value}
                </span>
                <span className="mt-2 block max-w-[38ch] leading-relaxed text-ink-2">{f.text}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
