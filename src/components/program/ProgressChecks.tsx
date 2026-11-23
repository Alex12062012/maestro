"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { isDayDone, isExerciseDone } from "@/lib/progress";
import {
  toggleDayDone,
  toggleExerciseDone,
  useProgress,
} from "@/components/program/done-store";

// Cases de la page semaine : une par exercice, et "Terminer la journée".
// Ce sont des boutons à bascule (aria-pressed) dont le nom ne change pas,
// coché ou pas ; l'état est porté par aria-pressed.

function Box({ onDark }: { onDark: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex size-6 shrink-0 items-center justify-center rounded border-2 text-transparent transition-colors duration-150 ${
        onDark
          ? "border-on-dark/50 group-aria-pressed:border-signal group-aria-pressed:bg-signal group-aria-pressed:text-surface-dark"
          : "border-ink-2 group-aria-pressed:border-ink group-aria-pressed:bg-ink group-aria-pressed:text-bg"
      }`}
    >
      <CheckIcon size={16} weight="regular" />
    </span>
  );
}

/** Case d'un exercice : zone de 44 px, le nom de l'exercice dans le libellé. */
export function ExerciseCheck({
  session,
  slug,
  name,
  onDark = false,
}: {
  session: string;
  slug: string;
  name: string;
  onDark?: boolean;
}) {
  const done = isExerciseDone(useProgress(), session, slug);
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={() => toggleExerciseDone(session, slug)}
      className={`group -ml-2.5 flex size-11 shrink-0 items-center justify-center rounded transition-transform duration-150 active:scale-[0.94] ${
        onDark ? "hover:bg-on-dark/10" : "hover:bg-ink/5"
      }`}
    >
      <Box onDark={onDark} />
      <span className="sr-only">Fait : {name}</span>
    </button>
  );
}

/** Nombre d'exercices cochés dans la journée, ex. "3/5". */
export function DayCount({
  session,
  slugs,
  className,
}: {
  session: string;
  slugs: string[];
  className?: string;
}) {
  const p = useProgress();
  const n = slugs.filter((slug) => isExerciseDone(p, session, slug)).length;
  return (
    <span className={className}>
      <span className="sr-only">Exercices faits : </span>
      {n}/{slugs.length}
    </span>
  );
}

/**
 * "Terminer la journée" : coche tous les exercices du jour, ou les décoche
 * tous si la journée était faite. Une journée sans exercice n'a que cette case.
 */
export function DayCheck({
  session,
  day,
  onDark = false,
}: {
  session: string;
  day: string;
  onDark?: boolean;
}) {
  const done = isDayDone(useProgress(), session);
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={() => toggleDayDone(session)}
      className={`group inline-flex h-11 shrink-0 items-center gap-2.5 rounded border px-3 font-semibold transition-transform duration-150 active:scale-[0.97] ${
        onDark
          ? "border-on-dark/30 hover:border-on-dark/60 aria-pressed:border-signal"
          : "border-line hover:border-ink aria-pressed:border-ink"
      }`}
    >
      <Box onDark={onDark} />
      Terminer la journée
      <span className="sr-only"> : {day}</span>
    </button>
  );
}
