"use client";

import { DAYS, PROGRAM, sessionId } from "@/content/program";
import { weekProgress } from "@/lib/progress";
import { changedThisVisit, useProgress } from "@/components/program/done-store";

// Avancement d'une semaine : "3/7" journées faites en mono et une tige par jour.
// `large` : en-tête de la page semaine, avec un message quand tout est fait.
export function WeekProgress({
  week,
  large = false,
  className,
}: {
  week: number;
  large?: boolean;
  className?: string;
}) {
  const progress = useProgress();
  const done = progress.days;
  const count = weekProgress(done, week);
  const message =
    count < 7
      ? ""
      : week < PROGRAM.length
        ? `Semaine ${week} terminée. La semaine ${week + 1} t’attend.`
        : "Semaine 12 terminée : tu as fait tout le programme.";
  // Annoncé seulement après une case cochée pendant la visite, pas à
  // l'arrivée sur une semaine déjà finie (le texte reste visible).
  const live = changedThisVisit(progress);

  return (
    <div className={className}>
      <div className={`flex items-center ${large ? "gap-4" : "gap-3"}`}>
        <ol aria-hidden className={`flex ${large ? "gap-1" : "gap-0.5"}`}>
          {DAYS.map((d) => (
            <li
              key={d}
              className={`${large ? "h-7 w-2.5" : "h-4 w-1.5"} ${
                done.includes(sessionId(week, d)) ? "bg-ink" : "bg-line"
              }`}
            />
          ))}
        </ol>
        <p className={`font-mono ${large ? "text-3xl" : "text-sm"}`}>
          <span className="sr-only">Séances faites : </span>
          {count}
          <span className="text-ink-2">/7</span>
        </p>
      </div>
      {large && (
        <>
          <p aria-hidden={live || undefined} className="mt-2 min-h-6 text-ink-2">
            {message}
          </p>
          <p role="status" className="sr-only">
            {live ? message : ""}
          </p>
        </>
      )}
    </div>
  );
}
