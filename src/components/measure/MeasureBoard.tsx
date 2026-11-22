"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowRightIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { BENCHMARKS, type Benchmark } from "@/content/benchmarks";
import { ProgressChart, WEEK_OF, formatValue } from "@/components/charts/ProgressChart";
import {
  CHECKPOINTS,
  delta,
  emptyMeasures,
  parseMeasure,
  readMeasures,
  writeMeasures,
  type Checkpoint,
  type Measures,
} from "@/lib/measure";

const noSubscribe = () => () => {};

// Le HTML statique montre le formulaire vide et l'état sans relevé ; le
// navigateur reprend ensuite les mesures gardées sous la clé `measures`.
export function MeasureBoard() {
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  // Clés distinctes : le passage au navigateur remonte le formulaire avec
  // les mesures gardées, au lieu de garder l'état vide du rendu serveur.
  return hydrated ? (
    <Board key="navigateur" initial={readMeasures()} />
  ) : (
    <Board key="serveur" initial={emptyMeasures()} />
  );
}

const filled = (m: Measures, cp: Checkpoint) =>
  BENCHMARKS.filter((b) => m[cp][b.id] !== undefined).length;

/** Première semaine de test pas encore complète, sinon la dernière. */
function nextCheckpoint(m: Measures): Checkpoint {
  return CHECKPOINTS.find((cp) => filled(m, cp) < BENCHMARKS.length) ?? "w12";
}

function draftsFor(m: Measures, cp: Checkpoint): Record<string, string> {
  return Object.fromEntries(
    BENCHMARKS.map((b) => [b.id, m[cp][b.id] === undefined ? "" : formatValue(m[cp][b.id])]),
  );
}

function Board({ initial }: { initial: Measures }) {
  const [measures, setMeasures] = useState(initial);
  const [week, setWeek] = useState<Checkpoint>(() => nextCheckpoint(initial));
  const [drafts, setDrafts] = useState(() => draftsFor(initial, week));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  function pickWeek(cp: Checkpoint) {
    setWeek(cp);
    setDrafts(draftsFor(measures, cp));
    setErrors({});
    setStatus("");
  }

  function check(b: Benchmark) {
    const raw = drafts[b.id];
    if (raw.trim() === "") return;
    const r = parseMeasure(raw, b.unit);
    setErrors((e) => ({ ...e, [b.id]: r.ok ? "" : r.error }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, number> = {};
    const found: Record<string, string> = {};
    for (const b of BENCHMARKS) {
      const r = parseMeasure(drafts[b.id], b.unit);
      if (r.ok) next[b.id] = r.value;
      else found[b.id] = r.error;
    }
    setErrors(found);
    const firstBad = BENCHMARKS.find((b) => found[b.id]);
    if (firstBad) {
      setStatus("");
      inputs.current[firstBad.id]?.focus();
      return;
    }
    const saved = { ...measures, [week]: next };
    writeMeasures(saved);
    setMeasures(saved);
    setDrafts(draftsFor(saved, week));
    setStatus(`Semaine ${WEEK_OF[week]} enregistrée. Les courbes sont à jour.`);
  }

  const any = CHECKPOINTS.some((cp) => filled(measures, cp) > 0);

  return (
    <>
      <section aria-labelledby="saisie" className="mt-10 md:mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-3">
          <h2
            id="saisie"
            className="text-3xl leading-none font-extrabold uppercase font-stretch-75% md:text-5xl"
          >
            Relevé
          </h2>
          <p className="font-mono text-sm text-ink-2">Le dimanche des semaines 1, 6 et 12</p>
        </div>

        <div role="group" aria-label="Semaine du relevé" className="mt-6 flex flex-wrap gap-2">
          {CHECKPOINTS.map((cp) => (
            <button
              key={cp}
              type="button"
              aria-pressed={week === cp}
              onClick={() => pickWeek(cp)}
              className="group inline-flex h-11 items-center gap-2.5 rounded border border-line px-4 font-semibold transition-transform duration-150 hover:border-ink active:scale-[0.98] aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg"
            >
              Semaine {WEEK_OF[cp]}
              <span className="font-mono text-xs font-normal opacity-70">
                {filled(measures, cp)}/{BENCHMARKS.length}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="mt-8">
          <div className="grid gap-x-10 gap-y-7 md:grid-cols-2">
            {BENCHMARKS.map((b) => {
              const error = errors[b.id];
              const field = `mesure-${b.id}`;
              return (
                <div key={b.id}>
                  <label htmlFor={field} className="block font-semibold">
                    {b.label}
                  </label>
                  <p id={`${field}-aide`} className="mt-1 text-[0.9375rem] leading-snug text-ink-2">
                    {b.how}
                  </p>
                  <div className="relative mt-2.5">
                    <input
                      ref={(el) => {
                        inputs.current[b.id] = el;
                      }}
                      id={field}
                      name={b.id}
                      type="text"
                      inputMode={b.unit === "s" ? "decimal" : "numeric"}
                      autoComplete="off"
                      value={drafts[b.id]}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDrafts((d) => ({ ...d, [b.id]: value }));
                        if (error) setErrors((x) => ({ ...x, [b.id]: "" }));
                      }}
                      onBlur={() => check(b)}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={`${field}-aide${error ? ` ${field}-erreur` : ""}`}
                      className="h-12 w-full rounded border border-line bg-bg pr-14 pl-3 font-mono text-lg transition-colors duration-150 hover:border-ink-2 focus:border-ink aria-invalid:border-2 aria-invalid:border-ink"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-sm text-ink-2"
                    >
                      {b.unit === "reps" ? "touches" : b.unit}
                    </span>
                  </div>
                  {error && (
                    <p id={`${field}-erreur`} className="mt-2 flex items-center gap-1.5 text-[0.9375rem] font-semibold">
                      <WarningCircleIcon size={18} weight="regular" aria-hidden className="shrink-0" />
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded bg-ink px-6 font-semibold text-bg transition-transform duration-150 hover:bg-ink/85 active:scale-[0.98]"
            >
              Enregistrer la semaine {WEEK_OF[week]}
            </button>
            <p role="status" className="text-ink-2">
              {status}
            </p>
          </div>
        </form>
      </section>

      <section
        aria-labelledby="evolution"
        className="on-dark mt-16 -mx-5 bg-surface-dark px-5 py-10 text-bg md:mx-0 md:mt-20 md:rounded md:p-12"
      >
        <h2
          id="evolution"
          className="text-3xl leading-none font-extrabold uppercase font-stretch-75% md:text-5xl"
        >
          Évolution
        </h2>
        {any ? (
          <ul className="mt-8 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {BENCHMARKS.map((b) => (
              <li key={b.id} className="border-t border-bg/15 py-6">
                <Trend benchmark={b} measures={measures} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState />
        )}
      </section>
    </>
  );
}

function Trend({ benchmark, measures }: { benchmark: Benchmark; measures: Measures }) {
  const values = Object.fromEntries(
    CHECKPOINTS.flatMap((cp) =>
      measures[cp][benchmark.id] === undefined ? [] : [[cp, measures[cp][benchmark.id]]],
    ),
  ) as Partial<Record<Checkpoint, number>>;
  const present = CHECKPOINTS.filter((cp) => values[cp] !== undefined);
  const lastCp = present.at(-1);
  const unit = benchmark.unit === "s" ? " s" : benchmark.unit === "/10" ? "/10" : "";

  let note = "Pas encore mesuré.";
  if (lastCp && values.w1 !== undefined && lastCp !== "w1") {
    const d = delta(values.w1, values[lastCp]!, benchmark.better);
    const sign = d.value > 0 ? "+" : d.value < 0 ? "-" : "";
    const verdict = d.value === 0 ? "pareil" : d.improved ? "en progrès" : "en recul";
    note = `${sign}${formatValue(Math.abs(d.value))}${benchmark.unit === "s" ? " s" : ""} depuis la semaine 1, ${verdict}.`;
  } else if (lastCp === "w1") {
    note = "Point de départ. Prochaine mesure en semaine 6.";
  } else if (lastCp) {
    note = "Pas de mesure en semaine 1 pour comparer.";
  }

  return (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-semibold">{benchmark.label}</h3>
        {lastCp && (
          <p className="font-mono text-2xl text-signal">
            {formatValue(values[lastCp]!)}
            <span className="text-sm text-bg/60">{unit}</span>
          </p>
        )}
      </div>
      <p className="mt-1 text-[0.9375rem] text-bg/75">
        {note}
        {benchmark.better === "lower" && (
          <span className="block font-mono text-xs text-bg/55">Plus c&apos;est bas, mieux c&apos;est</span>
        )}
      </p>
      <ProgressChart benchmark={benchmark} values={values} className="mt-4 w-full" />
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 max-w-[60ch]">
      <p className="text-lg leading-relaxed">
        Aucun relevé pour l&apos;instant. Le premier se fait le dimanche de la semaine 1, pendant la
        séance de tests : échauffement, jongles, slalom, sprint, frappes, puis ta note de confiance.
      </p>
      <p className="mt-3 leading-relaxed text-bg/75">
        Entre tes 6 résultats juste après. Ils deviennent ton point de départ, et les semaines 6 et
        12 viendront se placer sur les courbes.
      </p>
      <Link
        href="/programme/semaine/1#jour-dimanche"
        className="mt-6 inline-flex h-12 items-center gap-2 rounded bg-bg px-6 font-semibold text-ink transition-transform duration-150 hover:bg-bg/85 active:scale-[0.98]"
      >
        Voir la séance de tests
        <ArrowRightIcon size={18} weight="regular" aria-hidden />
      </Link>
    </div>
  );
}
