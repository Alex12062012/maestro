import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { EducatorNote } from "@/components/EducatorNote";
import { QuizRecall } from "@/components/program/QuizRecall";
import { WeekProgress } from "@/components/program/WeekProgress";
import { PHASES, PROGRAM, PROGRAM_RULES, TEST_WEEKS } from "@/content/program";
import { pad2 } from "@/lib/format";

export const metadata: Metadata = {
  title: "Programme 12 semaines - MAESTRO",
  description:
    "Le programme MAESTRO : 12 semaines en 4 phases, une séance par jour du lundi au dimanche, au poids du corps et adaptée aux 13-14 ans.",
};


/** Minutes de la semaine hors match du samedi. */
function trainingMinutes(week: number): number {
  return PROGRAM[week - 1].days
    .filter((d) => d.day !== "samedi")
    .reduce((acc, d) => acc + d.minutes, 0);
}

export default function ProgrammePage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 pt-8 pb-20 md:px-8 md:pt-14 md:pb-28">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:items-start md:gap-14">
        <div>
          <h1 className="text-5xl leading-[0.9] font-extrabold uppercase font-stretch-75% md:text-7xl">
            Programme
          </h1>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed">
            12 semaines en 4 phases, une séance par jour. Entre 10 et 35 minutes, au poids du corps,
            avec un ballon et quelques plots. Le samedi, c’est le match.
          </p>
          <p className="mt-3 max-w-[52ch] leading-relaxed text-ink-2">
            Coche chaque séance faite dans sa semaine : ta progression reste dans ce navigateur, sans
            compte.
          </p>
        </div>
        <QuizRecall />
      </div>

      <section aria-labelledby="phases" className="mt-16 md:mt-24">
        <h2 id="phases" className="sr-only">
          Les 4 phases
        </h2>
        <ol>
          {PHASES.map((phase) => {
            const [from, to] = phase.weeks;
            const weeks = PROGRAM.filter((w) => w.week >= from && w.week <= to);
            return (
              <li
                key={phase.name}
                className="grid gap-6 border-t-2 border-ink py-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 md:py-10"
              >
                <div>
                  <h3 className="text-4xl leading-none font-extrabold uppercase font-stretch-75% md:text-5xl">
                    {phase.name}
                  </h3>
                  <p className="mt-2 font-mono text-sm text-ink-2">
                    Semaines {from} à {to}
                  </p>
                  <p className="mt-4 max-w-[46ch] leading-relaxed text-ink-2">{phase.goal}</p>
                </div>
                <ul>
                  {weeks.map(({ week }) => (
                    <li key={week}>
                      <Link
                        href={`/programme/semaine/${week}`}
                        className="group grid grid-cols-[3rem_1fr_auto] items-center gap-x-4 gap-y-2 border-b border-line py-4 first:pt-0 sm:grid-cols-[3.5rem_1fr_auto_1.5rem]"
                      >
                        <span className="font-mono text-3xl leading-none text-ink-2 group-hover:text-ink">
                          {pad2(week)}
                        </span>
                        <span>
                          <span className="block text-lg font-bold font-stretch-85% group-hover:underline group-hover:decoration-2">
                            Semaine {week}
                          </span>
                          <span className="block font-mono text-xs text-ink-2">
                            {trainingMinutes(week)} min hors match
                            {TEST_WEEKS.includes(week) ? ", tests dimanche" : ""}
                          </span>
                        </span>
                        <WeekProgress week={week} />
                        <ArrowRightIcon
                          size={18}
                          weight="regular"
                          aria-hidden
                          className="hidden text-ink-2 group-hover:text-ink sm:block"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>

      <section
        id="regles"
        aria-labelledby="regles-titre"
        className="mt-8 grid gap-8 border-t-2 border-ink pt-8 md:mt-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 md:pt-10"
      >
        <div>
          <h2
            id="regles-titre"
            className="text-4xl leading-none font-extrabold uppercase font-stretch-75% md:text-5xl"
          >
            Avant de commencer
          </h2>
          <p className="mt-4 max-w-[40ch] leading-relaxed text-ink-2">
            Ces règles passent avant le programme, toutes les semaines.
          </p>
        </div>
        <div>
          <ul className="divide-y divide-line border-y border-line">
            {PROGRAM_RULES.map((rule) => (
              <li key={rule} className="max-w-[62ch] py-4 leading-relaxed">
                {rule}
              </li>
            ))}
          </ul>
          <EducatorNote className="mt-8 border-t-0 pt-0" />
        </div>
      </section>
    </div>
  );
}
