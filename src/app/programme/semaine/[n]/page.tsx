import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { EducatorNote } from "@/components/EducatorNote";
import { SessionCheck } from "@/components/program/SessionCheck";
import { WeekProgress } from "@/components/program/WeekProgress";
import { getExercise } from "@/content/exercises";
import { PHASES, PROGRAM, TEST_WEEKS, parseWeekParam, type Session } from "@/content/program";
import { PILLAR_LABELS } from "@/content/quiz";

// Les 12 semaines sont prérendues au build : la navigation attend la page
// statique, sans rendu serveur à la requête. Lire params en haut de page est
// voulu, d'où l'accord explicite pour une route bloquante.
export const instant = false;

export function generateStaticParams() {
  return PROGRAM.map((w) => ({ n: String(w.week) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/programme/semaine/[n]">): Promise<Metadata> {
  const week = parseWeekParam((await params).n);
  if (week === null) return {};
  return {
    title: `Semaine ${week} - Programme MAESTRO`,
    description: `Les 7 séances de la semaine ${week} du programme MAESTRO, du lundi au dimanche, avec les exercices et la routine mentale du jour.`,
  };
}

export default async function WeekPage({ params }: PageProps<"/programme/semaine/[n]">) {
  const week = parseWeekParam((await params).n);
  if (week === null) notFound();

  const { days } = PROGRAM[week - 1];
  const phase = PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1])!;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 pt-6 pb-20 md:px-8 md:pt-10 md:pb-28">
      <nav aria-label="Fil d'Ariane" className="font-mono text-sm text-ink-2">
        <Link href="/programme" className="inline-flex h-11 items-center gap-2 hover:text-ink">
          <ArrowLeftIcon size={16} weight="regular" aria-hidden />
          Programme
        </Link>
        <span aria-hidden className="mx-2">/</span>
        <span>Phase {phase.name}</span>
      </nav>

      <header className="mt-4 grid gap-6 md:mt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-14">
        <div>
          <h1 className="text-5xl leading-[0.9] font-extrabold uppercase font-stretch-75% md:text-7xl">
            Semaine {week}
          </h1>
          <p className="mt-4 max-w-[56ch] text-lg leading-relaxed">{phase.goal}</p>
        </div>
        <WeekProgress week={week} large />
      </header>

      <p className="mt-6 max-w-[62ch] border-t border-line pt-4 text-[0.9375rem] leading-relaxed text-ink-2">
        Entraînement au club ce jour-là : la séance du club remplace celle d&apos;ici, garde
        seulement la routine mentale.{" "}
        <Link href="/programme#regles" className="underline hover:text-ink">
          Les règles du programme
        </Link>
      </p>

      <ol role="list" className="mt-10 md:mt-14">
        {days.map((session) => (
          <li key={session.day}>
            <SessionBlock week={week} session={session} />
          </li>
        ))}
      </ol>

      <nav
        aria-label="Semaines voisines"
        className="mt-12 grid grid-cols-2 gap-3 border-t-2 border-ink pt-6"
      >
        {week > 1 ? (
          <Link
            href={`/programme/semaine/${week - 1}`}
            className="group inline-flex h-12 items-center gap-2 font-semibold"
          >
            <ArrowLeftIcon size={18} weight="regular" aria-hidden />
            <span className="group-hover:underline">Semaine {week - 1}</span>
          </Link>
        ) : (
          <span />
        )}
        {week < PROGRAM.length && (
          <Link
            href={`/programme/semaine/${week + 1}`}
            className="group inline-flex h-12 items-center justify-end gap-2 font-semibold"
          >
            <span className="group-hover:underline">Semaine {week + 1}</span>
            <ArrowRightIcon size={18} weight="regular" aria-hidden />
          </Link>
        )}
      </nav>

      <EducatorNote className="mt-10" />
    </div>
  );
}

function SessionBlock({ week, session }: { week: number; session: Session }) {
  const testDay = session.day === "dimanche" && TEST_WEEKS.includes(week);
  const exercises = session.exercises.map((slug) => getExercise(slug)!);

  return (
    <article
      aria-labelledby={`jour-${session.day}`}
      className={`grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-4 md:grid-cols-[10rem_minmax(0,1fr)_auto] md:gap-x-8 ${
        testDay
          ? "on-dark my-4 rounded bg-surface-dark p-5 text-bg md:p-8"
          : "border-t border-line py-7"
      }`}
    >
      {/* Téléphone : jour et case sur la même ligne, contenu dessous.
          Ordinateur : jour, contenu, case. Une seule case dans le DOM. */}
      <div className="col-start-1 row-start-1">
        <h2
          id={`jour-${session.day}`}
          className="text-3xl leading-none font-extrabold uppercase font-stretch-75%"
        >
          {session.day}
        </h2>
        <p className={`mt-2 font-mono text-sm ${testDay ? "text-signal" : "text-ink-2"}`}>
          {session.minutes} min
        </p>
      </div>

      <div className="col-start-2 row-start-1 justify-self-end md:col-start-3">
        <SessionCheck week={week} day={session.day} title={session.title} onDark={testDay} />
      </div>

      <div className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1">
        <h3 className="text-xl font-bold font-stretch-85%">{session.title}</h3>
        <ul className="mt-3">
          {exercises.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/exercices/${e.slug}`}
                className={`group flex min-h-11 items-baseline justify-between gap-4 border-b py-2.5 ${
                  testDay ? "border-bg/15" : "border-line"
                }`}
              >
                <span className="group-hover:underline">{e.name}</span>
                <span
                  className={`shrink-0 font-mono text-xs ${testDay ? "text-bg/60" : "text-ink-2"}`}
                >
                  {PILLAR_LABELS[e.pillar]}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <h4 className={`font-mono text-sm ${testDay ? "text-bg/70" : "text-ink-2"}`}>
            Routine mentale du jour
          </h4>
          <p className={`mt-1.5 max-w-[60ch] leading-relaxed ${testDay ? "text-bg" : ""}`}>
            {session.mental}
          </p>
        </div>

        {testDay && (
          <Link
            href="/suivi"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded bg-bg px-6 font-semibold text-ink transition-transform duration-150 hover:bg-bg/85 active:scale-[0.98]"
          >
            Entrer tes résultats
            <ArrowRightIcon size={18} weight="regular" aria-hidden />
          </Link>
        )}
      </div>
    </article>
  );
}
