"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { sessionId, type Day } from "@/content/program";
import { toggleDone, useDone } from "@/components/program/done-store";

// Case "fait" d'une séance : un bouton à bascule (aria-pressed). Son nom
// reste le même, coché ou pas ; l'état est porté par aria-pressed.
export function SessionCheck({
  week,
  day,
  title,
  onDark = false,
}: {
  week: number;
  day: Day;
  title: string;
  onDark?: boolean;
}) {
  const id = sessionId(week, day);
  const done = useDone().includes(id);

  const box = onDark
    ? "border-bg/40 group-aria-pressed:border-signal group-aria-pressed:bg-signal group-aria-pressed:text-surface-dark"
    : "border-ink-2 group-aria-pressed:border-ink group-aria-pressed:bg-ink group-aria-pressed:text-bg";

  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={() => toggleDone(id)}
      className={`group inline-flex h-11 shrink-0 items-center gap-2.5 rounded px-2 font-semibold transition-transform duration-150 active:scale-[0.97] ${
        onDark ? "hover:bg-bg/10" : "hover:bg-ink/5"
      }`}
    >
      <span
        aria-hidden
        className={`flex size-6 items-center justify-center rounded border-2 text-transparent transition-colors duration-150 ${box}`}
      >
        <CheckIcon size={16} weight="regular" />
      </span>
      Fait
      <span className="sr-only">
        {" "}
        : {day}, {title}
      </span>
    </button>
  );
}
