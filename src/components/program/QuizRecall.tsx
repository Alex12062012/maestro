"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { PILLAR_LABELS, PROFILES } from "@/content/quiz";
import { readQuizResult, resultHighlights } from "@/lib/quiz";

const noSubscribe = () => () => {};

// Rappel du résultat du test sur /programme. Le HTML statique montre
// l'invitation à faire le test ; le navigateur affiche le profil s'il existe.
export function QuizRecall({ className }: { className?: string }) {
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const result = hydrated ? readQuizResult() : null;

  // Même hauteur minimale pour l'invitation (HTML statique) et le profil
  // (navigateur) : le passage de l'un à l'autre ne décale pas la page.
  // 24rem couvre le profil le plus long, mesuré à 375 et 1440 px.
  const frame = `on-dark flex min-h-[24rem] flex-col rounded bg-surface-dark p-6 text-on-dark md:p-8 ${className ?? ""}`;

  if (!result) {
    return (
      <section aria-labelledby="profil" className={frame}>
        <h2 id="profil" className="text-2xl leading-tight font-bold font-stretch-85%">
          Pas encore de profil
        </h2>
        <p className="mt-3 mb-6 max-w-[44ch] leading-relaxed text-on-dark/80">
          Le test Maestro te dit quel pilier travailler en premier : 12 questions, une par écran.
          Ton résultat reste dans ce navigateur.
        </p>
        <Link
          href="/test"
          className="mt-auto inline-flex h-12 items-center gap-2 self-start rounded bg-on-dark px-6 font-semibold text-surface-dark transition-transform duration-150 hover:bg-on-dark/85 active:scale-[0.98]"
        >
          Faire le test
          <ArrowRightIcon size={18} weight="regular" aria-hidden />
        </Link>
      </section>
    );
  }

  const profile = PROFILES[result.profile];
  const { toWork } = resultHighlights(result);

  return (
    <section aria-labelledby="profil" className={frame}>
      <h2 id="profil" className="text-4xl leading-[0.9] font-extrabold uppercase font-stretch-75%">
        <span className="sr-only">Ton profil : </span>
        {profile.name}
      </h2>
      <p className="mt-2 font-mono text-sm text-on-dark/60">Ton profil au test Maestro</p>
      <p className="mt-5 flex items-baseline justify-between gap-4 border-t border-on-dark/15 pt-4">
        <span className="text-on-dark/80">À travailler en premier : {PILLAR_LABELS[toWork]}</span>
        <span className="font-mono text-2xl text-signal">
          {result.pillars[toWork]}
          <span className="text-base text-on-dark/60">/100</span>
        </span>
      </p>
      <p className="mt-3 max-w-[48ch] leading-relaxed text-on-dark/80">{profile.focus}</p>
      <div className="mt-auto pt-5">
        <Link
          href="/test"
          className="inline-flex h-11 items-center text-[0.9375rem] text-on-dark/80 underline decoration-on-dark/30 hover:text-on-dark hover:decoration-signal"
        >
          Revoir le résultat du test
        </Link>
      </div>
    </section>
  );
}
