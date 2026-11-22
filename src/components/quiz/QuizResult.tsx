"use client";

import { useEffect, useState, type Ref } from "react";
import { ArrowCounterClockwiseIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Button, ButtonLink } from "@/components/Button";
import { Radar } from "@/components/charts/Radar";
import { PILLARS, PILLAR_LABELS, PROFILES, type Pillar } from "@/content/quiz";
import { strongestPillar, weakestPillar, type QuizResult as Result } from "@/lib/quiz";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Chiffre qui défile de 0 à `target`, sur la même durée que le radar.
// Sous "réduire les animations", il s'affiche directement à sa valeur.
function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      setValue(t === 1 ? target : Math.round(target * (1 - 2 ** (-10 * t))));
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function Score({ value }: { value: number }) {
  const shown = useCountUp(value);
  return (
    <>
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}

function Verdict({
  title,
  pillar,
  score,
  text,
}: {
  title: string;
  pillar: Pillar;
  score: number;
  text: string;
}) {
  return (
    <div className="border-t-2 border-ink pt-5">
      <h3 className="text-sm font-semibold tracking-[0.04em] text-ink-2 uppercase">{title}</h3>
      <p className="mt-2 flex items-baseline justify-between gap-4 text-2xl font-bold font-stretch-85%">
        {PILLAR_LABELS[pillar]}
        <span className="font-mono text-xl font-medium">
          {score}
          <span className="text-ink-2">/100</span>
        </span>
      </p>
      <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-2">{text}</p>
    </div>
  );
}

export function QuizResult({
  result,
  onRestart,
  headingRef,
}: {
  result: Result;
  onRestart: () => void;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const profile = PROFILES[result.profile];
  // Maestro : on montre quand même le pilier le plus bas comme piste.
  const isMaestro = result.profile === "maestro";
  const toWork: Pillar =
    result.profile === "maestro" ? weakestPillar(result.pillars) : result.profile;
  const best = strongestPillar(result.pillars, isMaestro ? undefined : toWork);

  return (
    <div>
      <section
        aria-labelledby="profil"
        className="on-dark -mx-5 grid gap-8 bg-surface-dark px-5 py-10 text-bg md:mx-0 md:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] md:grid-rows-[auto_1fr] md:gap-x-12 md:gap-y-10 md:rounded md:p-12"
      >
        {/* Téléphone : nom, radar, relevé. Ordinateur : radar à droite. */}
        <div>
          <h2
            id="profil"
            ref={headingRef}
            tabIndex={-1}
            className="text-5xl leading-[0.9] font-extrabold uppercase font-stretch-75% text-balance focus:outline-none md:text-7xl"
          >
            <span className="sr-only">Ton profil : </span>
            {profile.name}
          </h2>
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-bg/80">{profile.summary}</p>
        </div>

        <Radar
          scores={result.pillars}
          className="w-full max-w-lg self-center justify-self-center md:col-start-2 md:row-span-2 md:row-start-1"
        />

        <div className="md:col-start-1 md:row-start-2">
          <dl className="max-w-sm font-mono">
            {PILLARS.map((p) => (
              <div
                key={p}
                className="flex items-baseline justify-between border-b border-bg/15 py-2.5"
              >
                <dt className="font-sans text-bg/80">{PILLAR_LABELS[p]}</dt>
                <dd className="text-lg">
                  <Score value={result.pillars[p]} />
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between pt-3">
              <dt className="font-sans font-semibold">Score global</dt>
              <dd className="text-3xl text-signal">
                <Score value={result.total} />
                <span className="text-base text-bg/60">/100</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
        <Verdict
          title="Point fort"
          pillar={best}
          score={result.pillars[best]}
          text={profile.strength}
        />
        <Verdict
          title="Point à travailler"
          pillar={toWork}
          score={result.pillars[toWork]}
          text={profile.focus}
        />
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href="/programme">
          Commencer le programme
          <ArrowRightIcon size={18} weight="regular" aria-hidden />
        </ButtonLink>
        <Button variant="secondary" onClick={onRestart}>
          <ArrowCounterClockwiseIcon size={18} weight="regular" aria-hidden />
          Recommencer
        </Button>
      </div>
    </div>
  );
}
