import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { EducatorNote } from "@/components/EducatorNote";
import { BackLink } from "@/components/nav/BackLink";
import { ExercisePhoto } from "@/components/ExercisePhoto";
import { DiagramLegend, TerrainDiagram } from "@/components/TerrainDiagram";
import { EXERCISES, getExercise, type Exercise } from "@/content/exercises";
import { PHOTOS } from "@/content/photos";
import { DAYS, PROGRAM, type Day } from "@/content/program";
import { PILLAR_LABELS } from "@/content/quiz";
import { doseLines, pad2 } from "@/lib/format";

// Chaque fiche est prérendue au build (generateStaticParams) : la navigation
// attend la page statique, sans rendu serveur à la requête. Lire params en
// haut de page est voulu, d'où l'accord explicite pour une route bloquante.
export const instant = false;

export function generateStaticParams() {
  return EXERCISES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/exercices/[slug]">): Promise<Metadata> {
  const exercise = getExercise((await params).slug);
  if (!exercise) return {};
  return { title: `${exercise.name} - MAESTRO`, description: exercise.goal };
}


/** Jours où l'exercice apparaît, semaine par semaine (1 à 12). */
function schedule(slug: string): { week: number; days: Day[] }[] {
  return PROGRAM.map((w) => ({
    week: w.week,
    days: w.days.filter((s) => s.exercises.includes(slug)).map((s) => s.day),
  }));
}

function listFr(items: string[]): string {
  return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} et ${items.at(-1)}`;
}

export default async function ExercisePage({ params }: PageProps<"/exercices/[slug]">) {
  const { slug } = await params;
  const exercise = getExercise(slug);
  if (!exercise) notFound();

  const siblings = EXERCISES.filter((e) => e.pillar === exercise.pillar);
  const next = siblings[(siblings.indexOf(exercise) + 1) % siblings.length];
  const weeks = schedule(slug);
  const usedDays = DAYS.filter((d) => weeks.some((w) => w.days.includes(d)));

  return (
    <article className="mx-auto w-full max-w-6xl flex-1 px-5 pt-6 pb-20 md:px-8 md:pt-10 md:pb-28">
      {/* Retour vers la page d'où vient le joueur (souvent sa semaine du
          programme) ; lien direct ou nouvel onglet : la bibliothèque. */}
      <BackLink
        fallback="/exercices"
        className="-ml-1 inline-flex h-11 items-center gap-2 px-1 font-mono text-sm text-ink-2 hover:text-ink"
      />

      <div className="mt-4 grid gap-x-14 gap-y-10 md:mt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
        <header className="md:col-start-1">
          <h1 className="max-w-[16ch] text-4xl leading-[0.92] font-extrabold uppercase font-stretch-75% text-balance md:text-6xl">
            {exercise.name}
          </h1>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed md:text-xl">{exercise.goal}</p>
        </header>

        {/* Ordinateur : schéma et dose dans une colonne qui reste à l'écran. */}
        <aside className="md:col-start-2 md:row-span-2 md:row-start-1">
          <div className="flex flex-col gap-6 md:sticky md:top-[calc(var(--header-h)+1.5rem)]">
            <Visual exercise={exercise} />
            <Dose dose={exercise.dose} />
          </div>
        </aside>

        <div className="md:col-start-1">
          <section aria-labelledby="etapes">
            <h2 id="etapes" className="text-2xl font-bold font-stretch-85%">
              Étapes
            </h2>
            {/* role="list" : Safari retire la sémantique de liste quand les puces sont masquées. */}
            <ol role="list" className="mt-4">
              {exercise.steps.map((step, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[2.5rem_1fr] gap-2 border-t border-line py-3.5 leading-relaxed"
                >
                  <span aria-hidden className="pt-0.5 font-mono text-sm text-ink-2">
                    {pad2(i + 1)}
                  </span>
                  <span className="max-w-[62ch]">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="erreurs" className="mt-12">
            <h2 id="erreurs" className="text-2xl font-bold font-stretch-85%">
              Erreurs fréquentes
            </h2>
            <ul role="list" className="mt-4 space-y-3">
              {exercise.mistakes.map((m, i) => (
                <li key={i} className="flex max-w-[62ch] gap-3 leading-relaxed text-ink-2">
                  <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-ink" />
                  {m}
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Adapter la difficulté" className="mt-12 grid gap-px bg-line sm:grid-cols-2">
            <div className="bg-bg pt-1 pb-5 sm:pr-6">
              <h2 className="font-mono text-sm text-ink-2">Plus facile</h2>
              <p className="mt-2 leading-relaxed">{exercise.easier}</p>
            </div>
            <div className="bg-bg pt-5 pb-5 sm:pt-1 sm:pl-6">
              <h2 className="font-mono text-sm text-ink-2">Plus dur</h2>
              <p className="mt-2 leading-relaxed">{exercise.harder}</p>
            </div>
          </section>

          <section aria-labelledby="au-programme" className="mt-12">
            <h2 id="au-programme" className="text-2xl font-bold font-stretch-85%">
              Dans le programme
            </h2>
            <p className="mt-2 text-ink-2">
              {usedDays.length > 0
                ? `Au programme ${listFr(usedDays.map((d) => `le ${d}`))}. Les semaines où il apparaît sont en case pleine ci-dessous.`
                : "Cet exercice n’est dans aucune séance pour l’instant."}
            </p>
            <ol className="mt-4 grid grid-cols-6 gap-1 sm:grid-cols-12">
              {weeks.map(({ week, days }) => (
                <li key={week}>
                  {days.length > 0 ? (
                    <Link
                      href={`/programme/semaine/${week}`}
                      aria-label={`Semaine ${pad2(week)} : ${listFr([...days])}`}
                      className="flex h-11 items-center justify-center rounded bg-ink font-mono text-sm text-bg transition-transform duration-150 hover:bg-ink/85 active:scale-[0.96]"
                    >
                      {pad2(week)}
                    </Link>
                  ) : (
                    <span className="flex h-11 items-center justify-center rounded border border-line font-mono text-sm text-ink-2">
                      <span className="sr-only">Semaine {week} : pas au programme</span>
                      <span aria-hidden>{pad2(week)}</span>
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {next !== exercise && (
            <Link
              href={`/exercices/${next.slug}`}
              className="group mt-14 flex items-center justify-between gap-4 border-y border-line py-5"
            >
              <span>
                <span className="block font-mono text-sm text-ink-2">
                  Suivant en {PILLAR_LABELS[exercise.pillar].toLowerCase()}
                </span>
                <span className="mt-1 block text-xl font-bold font-stretch-85% group-hover:underline group-hover:decoration-2">
                  {next.name}
                </span>
              </span>
              <ArrowRightIcon size={22} weight="regular" aria-hidden className="shrink-0" />
            </Link>
          )}

          <EducatorNote className="mt-10" />
        </div>
      </div>
    </article>
  );
}

function Visual({ exercise }: { exercise: Exercise }) {
  if (exercise.diagram) {
    return (
      <figure>
        <div className="rounded border border-line p-2 md:p-3">
          <TerrainDiagram diagram={exercise.diagram} animate id={exercise.slug} className="w-full" />
        </div>
        <figcaption className="mt-3">
          <DiagramLegend diagram={exercise.diagram} />
        </figcaption>
      </figure>
    );
  }
  const meta = exercise.photo ? PHOTOS[exercise.photo] : undefined;
  if (!exercise.photo || !meta) return null;
  return (
    <ExercisePhoto
      src={exercise.photo}
      meta={meta}
      sizes="(min-width: 1024px) 448px, (min-width: 768px) 400px, 100vw"
      eager
      caption={
        <>
          {meta.note && <span className="mb-1 block font-sans text-sm text-ink">{meta.note}</span>}
          Photo {meta.credit}, Pexels
        </>
      }
      className="h-auto w-full rounded bg-line object-cover md:max-h-[58vh]"
    />
  );
}

function Dose({ dose }: { dose: string }) {
  return (
    <section aria-labelledby="dose" className="on-dark rounded bg-surface-dark px-5 py-5 text-on-dark">
      <h2 id="dose" className="text-sm font-semibold tracking-[0.04em] text-on-dark/70 uppercase">
        Dose
      </h2>
      <ul className="mt-3 font-mono text-sm leading-relaxed">
        {doseLines(dose).map((line, i) => (
          <li key={i} className="border-t border-on-dark/15 py-2.5 first:border-0 first:pt-0">
            {line.label && <span className="block text-on-dark/60">{line.label}</span>}
            <span className={line.label ? "mt-0.5 block" : "block text-on-dark/80"}>{line.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
