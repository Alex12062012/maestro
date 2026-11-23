import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/home/Reveal";
import { BENCHMARKS } from "@/content/benchmarks";
import { PHASES, PROGRAM, TEST_WEEKS } from "@/content/program";
import { QUESTIONS } from "@/content/quiz";

// Comment ça marche : trois étapes nommées par leur verbe, en escalier sur
// grand écran. S'entraîner et Mesurer partagent la même règle de 12 semaines :
// les phases sur l'une, les semaines de test sur l'autre.

const WEEKS = PROGRAM.map((w) => w.week);

// Durée d'une séance, hors match du samedi.
const minutes = PROGRAM.flatMap((w) => w.days)
  .filter((d) => d.day !== "samedi")
  .map((d) => d.minutes);
const MIN = Math.min(...minutes);
const MAX = Math.max(...minutes);

const span = (weeks: [number, number]) => weeks[1] - weeks[0] + 1;

function PhaseRuler() {
  return (
    <ol
      aria-label={`Les ${PHASES.length} phases`}
      className="grid gap-1"
      style={{ gridTemplateColumns: PHASES.map((p) => `${span(p.weeks)}fr`).join(" ") }}
    >
      {PHASES.map((p) => (
        <li key={p.name}>
          <span
            aria-hidden
            className="grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${span(p.weeks)}, 1fr)` }}
          >
            {Array.from({ length: span(p.weeks) }, (_, i) => (
              <span key={i} className="h-3 bg-ink" />
            ))}
          </span>
          <span className="mt-2 block font-mono text-xs text-ink-2">
            {p.name}
            <span className="sr-only">
              , semaines {p.weeks[0]} à {p.weeks[1]}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function TestRuler() {
  return (
    <div>
      <ol aria-hidden className="grid grid-cols-12 gap-0.5">
        {WEEKS.map((w) => (
          <li key={w} className={`h-3 ${TEST_WEEKS.includes(w) ? "bg-ink" : "bg-line"}`} />
        ))}
      </ol>
      <p className="mt-2 grid grid-cols-12 gap-0.5 font-mono text-xs text-ink-2">
        <span className="sr-only">Tests aux semaines {TEST_WEEKS.join(", ")}</span>
        {WEEKS.map((w) => (
          <span key={w} aria-hidden>
            {TEST_WEEKS.includes(w) ? `S${w}` : ""}
          </span>
        ))}
      </p>
    </div>
  );
}

const STEPS = [
  {
    verb: "Tester",
    text: `${QUESTIONS.length} questions sur ta façon de jouer. Tu obtiens ton profil et un score sur 100 pour chaque pilier.`,
    data: null,
    link: { href: "/test", label: "Faire le test" },
    offset: "",
  },
  {
    verb: "S’entraîner",
    text: `Une séance par jour, de ${MIN} à ${MAX} minutes, au poids du corps et avec un ballon. Chaque exercice a sa fiche.`,
    data: <PhaseRuler />,
    link: { href: "/programme", label: "Voir le programme" },
    offset: "lg:mt-20",
  },
  {
    verb: "Mesurer",
    text: `${BENCHMARKS.length} tests aux semaines ${TEST_WEEKS.slice(0, -1).join(", ")} et ${TEST_WEEKS.at(-1)}. Tes résultats s’affichent en courbes, à côté de ton point de départ.`,
    data: <TestRuler />,
    link: { href: "/suivi", label: "Ouvrir le suivi" },
    offset: "lg:mt-40",
  },
];

export function CommentCaMarche() {
  return (
    <section
      aria-labelledby="comment"
      className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-32"
    >
      <h2
        id="comment"
        className="max-w-[12ch] text-5xl leading-[0.9] font-extrabold uppercase font-stretch-75% text-balance md:text-7xl"
      >
        Comment ça marche
      </h2>

      <ol className="mt-14 grid max-w-xl gap-14 md:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-10">
        {STEPS.map((step, i) => (
          <Reveal as="li" key={step.verb} delay={i * 0.12} className={step.offset}>
            <div className="border-t-2 border-ink pt-5">
              <h3 className="text-4xl leading-none font-extrabold uppercase font-stretch-75% lg:text-5xl">
                {step.verb}
              </h3>
              <p className="mt-4 max-w-[36ch] leading-relaxed text-ink-2">{step.text}</p>
              {step.data && <div className="mt-6">{step.data}</div>}
              <Link
                href={step.link.href}
                className="group mt-5 inline-flex h-11 items-center gap-2 font-semibold underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink"
              >
                {step.link.label}
                <ArrowRightIcon
                  size={18}
                  weight="regular"
                  aria-hidden
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
