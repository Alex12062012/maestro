"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowRightIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { BENCHMARKS, type Benchmark } from "@/content/benchmarks";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { formatNumber, unitSuffix } from "@/lib/format";
import {
  CHECKPOINTS,
  WEEK_OF,
  delta,
  emptyMeasures,
  parseMeasure,
  parseWeekEntry,
  readDrafts,
  readMeasures,
  writeDrafts,
  writeMeasures,
  type Checkpoint,
  type Drafts as SavedDrafts,
  type Measures,
} from "@/lib/measure";

const noSubscribe = () => () => {};

// Le HTML statique montre le formulaire vide et l'état sans relevé ; le
// navigateur reprend ensuite les mesures gardées sous la clé `measures`, et ce
// qui avait été tapé sans être enregistré (`measures-draft`).
// Aucun champ n'a d'attribut `name` et l'envoi est toujours intercepté : sans
// JavaScript, le formulaire ne met jamais un résultat dans une URL.
export function MeasureBoard() {
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  // Clés distinctes : le passage au navigateur remonte le formulaire avec
  // les mesures gardées, au lieu de garder l'état vide du rendu serveur.
  return hydrated ? (
    <Board key="navigateur" initial={readMeasures()} stored={readDrafts()} />
  ) : (
    <Board key="serveur" initial={emptyMeasures()} stored={{}} />
  );
}

type Drafts = Record<Checkpoint, Record<string, string>>;

const filled = (m: Measures, cp: Checkpoint) =>
  BENCHMARKS.filter((b) => m[cp][b.id] !== undefined).length;

/** Première semaine de test sans aucune mesure, sinon la dernière. */
function nextCheckpoint(m: Measures): Checkpoint {
  return CHECKPOINTS.find((cp) => filled(m, cp) === 0) ?? "w12";
}

// Valeur remise dans un champ : sans espace des milliers, pour qu'elle se relise.
function draftsFor(m: Measures, cp: Checkpoint): Record<string, string> {
  return Object.fromEntries(
    BENCHMARKS.map((b) => {
      const v = m[cp][b.id];
      return [b.id, v === undefined ? "" : formatNumber(v, { grouping: false })];
    }),
  );
}

const allDrafts = (m: Measures) =>
  Object.fromEntries(CHECKPOINTS.map((cp) => [cp, draftsFor(m, cp)])) as Drafts;

// Garde dans le navigateur les semaines en cours de saisie, et seulement elles.
function keepDrafts(drafts: Drafts, edited: ReadonlySet<Checkpoint>) {
  writeDrafts(Object.fromEntries([...edited].map((cp) => [cp, drafts[cp]])));
}

function Board({ initial, stored }: { initial: Measures; stored: SavedDrafts }) {
  const [measures, setMeasures] = useState(initial);
  // Une saisie laissée en cours : on revient dessus.
  const [week, setWeek] = useState<Checkpoint>(
    () => CHECKPOINTS.find((cp) => stored[cp]) ?? nextCheckpoint(initial),
  );
  // Brouillons par semaine : changer de semaine, de page ou recharger ne perd
  // rien de ce qui est tapé.
  const [drafts, setDrafts] = useState<Drafts>(() => ({ ...allDrafts(initial), ...stored }));
  const [edited, setEdited] = useState<ReadonlySet<Checkpoint>>(
    () => new Set(CHECKPOINTS.filter((cp) => stored[cp])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("");
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  // Un autre onglet a enregistré un relevé : on relit. Les semaines en cours
  // de saisie ici gardent ce qui est tapé.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== null && !e.key.endsWith(":measures")) return;
      const m = readMeasures();
      setMeasures(m);
      setDrafts((d) => {
        const fresh = allDrafts(m);
        return Object.fromEntries(
          CHECKPOINTS.map((cp) => [cp, edited.has(cp) ? d[cp] : fresh[cp]]),
        ) as Drafts;
      });
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [edited]);

  function pickWeek(cp: Checkpoint) {
    setWeek(cp);
    setErrors({});
    setFormError("");
    setStatus("");
  }

  function edit(id: string, value: string) {
    const nextDrafts = { ...drafts, [week]: { ...drafts[week], [id]: value } };
    const nextEdited = new Set(edited).add(week);
    setDrafts(nextDrafts);
    setEdited(nextEdited);
    keepDrafts(nextDrafts, nextEdited);
    if (errors[id]) setErrors((x) => ({ ...x, [id]: "" }));
    setFormError("");
    setStatus("");
  }

  function check(b: Benchmark) {
    const raw = drafts[week][b.id];
    if (raw.trim() === "") return;
    const r = parseMeasure(raw, b.unit);
    setErrors((e) => ({ ...e, [b.id]: r.ok ? "" : r.error }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const entry = parseWeekEntry(drafts[week], measures[week]);
    if (!entry.ok) {
      setErrors(entry.errors);
      setFormError(entry.form ?? "");
      setStatus("");
      const firstBad = BENCHMARKS.find((b) => entry.errors[b.id]) ?? BENCHMARKS[0];
      inputs.current[firstBad.id]?.focus();
      return;
    }
    const saved = { ...measures, [week]: entry.values };
    writeMeasures(saved);
    setMeasures(saved);
    setDrafts((d) => ({ ...d, [week]: draftsFor(saved, week) }));
    const nextEdited = new Set(edited);
    nextEdited.delete(week);
    setEdited(nextEdited);
    keepDrafts(drafts, nextEdited);
    setErrors({});
    setFormError("");
    const n = Object.keys(entry.values).length;
    setStatus(
      n === 0
        ? `Semaine ${WEEK_OF[week]} effacée. Les courbes sont à jour.`
        : `Semaine ${WEEK_OF[week]} enregistrée : ${n} test${n > 1 ? "s" : ""} sur ${BENCHMARKS.length}. Les courbes sont à jour.`,
    );
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
        <p className="mt-4 max-w-[62ch] leading-relaxed text-ink-2">
          Remplis les tests que tu as faits. Une case vide veut dire que le test n’a pas été
          mesuré cette fois : la semaine s’enregistre quand même. Pour effacer une semaine,
          vide toutes ses cases et enregistre.
        </p>

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
                <span className="sr-only">, tests mesurés : </span>
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
              const fiche = b.exercise;
              return (
                <div key={b.id}>
                  <label htmlFor={field} className="block font-semibold">
                    {b.label}
                  </label>
                  <p id={`${field}-aide`} className="mt-1 text-[0.9375rem] leading-snug text-ink-2">
                    {b.how}
                    {fiche && (
                      <>
                        {" "}
                        <Link
                          href={`/exercices/${fiche}`}
                          className="whitespace-nowrap text-ink underline decoration-ink/30 hover:decoration-ink"
                        >
                          Voir la fiche<span className="sr-only"> du test {b.label}</span>
                        </Link>
                      </>
                    )}
                  </p>
                  <div className="relative mt-2.5">
                    <input
                      ref={(el) => {
                        inputs.current[b.id] = el;
                      }}
                      id={field}
                      type="text"
                      inputMode={b.unit === "s" ? "decimal" : "numeric"}
                      autoComplete="off"
                      value={drafts[week][b.id]}
                      onChange={(e) => edit(b.id, e.target.value)}
                      onBlur={() => check(b)}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={`${field}-aide${error ? ` ${field}-erreur` : ""}`}
                      className="h-12 w-full rounded border border-ink-2 bg-bg pr-20 pl-3 font-mono text-lg transition-colors duration-150 hover:border-ink focus:border-ink aria-invalid:border-2 aria-invalid:border-ink"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-sm text-ink-2"
                    >
                      {b.unit === "reps" ? "touches" : b.unit}
                    </span>
                  </div>
                  {error && (
                    <p
                      id={`${field}-erreur`}
                      className="mt-2 flex items-center gap-1.5 text-[0.9375rem] font-semibold"
                    >
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
              {formError ||
                status ||
                (edited.has(week) ? "Modifications pas encore enregistrées." : "")}
            </p>
          </div>
        </form>
      </section>

      <section
        aria-labelledby="evolution"
        className="on-dark mt-16 -mx-5 bg-surface-dark px-5 py-10 text-on-dark md:mx-0 md:mt-20 md:rounded md:p-10"
      >
        <h2
          id="evolution"
          className="text-3xl leading-none font-extrabold uppercase font-stretch-75% md:text-5xl"
        >
          Évolution
        </h2>
        {any ? (
          <ul className="mt-8 grid gap-x-10 md:grid-cols-2 xl:grid-cols-3">
            {BENCHMARKS.map((b) => (
              <li key={b.id} className="border-t border-on-dark/15 py-6">
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
  const values: Partial<Record<Checkpoint, number>> = {};
  for (const cp of CHECKPOINTS) {
    const v = measures[cp][benchmark.id];
    if (v !== undefined) values[cp] = v;
  }
  const present = CHECKPOINTS.filter((cp) => values[cp] !== undefined);
  const lastCp = present.at(-1);
  const unit = unitSuffix(benchmark.unit);

  let note = "Pas encore mesuré.";
  if (lastCp && values.w1 !== undefined && lastCp !== "w1") {
    const d = delta(values.w1, values[lastCp]!, benchmark.better);
    const sign = d.value > 0 ? "+" : d.value < 0 ? "-" : "";
    const verdict = d.value === 0 ? "pareil" : d.improved ? "en progrès" : "en recul";
    note = `${sign}${formatNumber(Math.abs(d.value))}${benchmark.unit === "s" ? " s" : ""} depuis la semaine 1, ${verdict}.`;
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
            {formatNumber(values[lastCp]!)}
            <span className="text-sm text-on-dark/60">{unit}</span>
          </p>
        )}
      </div>
      <p className="mt-1 text-[0.9375rem] text-on-dark/75">
        {note}
        {benchmark.better === "lower" && (
          <span className="block font-mono text-xs text-on-dark/60">
            Plus c’est bas, mieux c’est
          </span>
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
        Aucun relevé pour l’instant. Le premier se fait le dimanche de la semaine 1, pendant la
        séance de tests : ta note de confiance d’abord, puis l’échauffement, les jongles, le
        slalom, le sprint et les frappes.
      </p>
      <p className="mt-3 leading-relaxed text-on-dark/75">
        Entre tes résultats juste après. Ils deviennent ton point de départ, et les semaines 6 et 12
        viendront se placer sur les courbes.
      </p>
      <Link
        href="/programme/semaine/1#jour-dimanche"
        className="mt-6 inline-flex h-12 items-center gap-2 rounded bg-on-dark px-6 font-semibold text-surface-dark transition-transform duration-150 hover:bg-on-dark/85 active:scale-[0.98]"
      >
        Voir la séance de tests
        <ArrowRightIcon size={18} weight="regular" aria-hidden />
      </Link>
    </div>
  );
}
