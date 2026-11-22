import type { Metadata } from "next";
import Link from "next/link";
import { ExercisePhoto } from "@/components/ExercisePhoto";
import { TerrainDiagram } from "@/components/TerrainDiagram";
import { EXERCISES, type Exercise } from "@/content/exercises";
import { PHOTOS } from "@/content/photos";
import { PILLARS, PILLAR_LABELS, type Pillar } from "@/content/quiz";

// Le filtre vit dans l'URL (?pilier=mental) et doit marcher sans JavaScript :
// la liste filtrée est rendue sur le serveur à chaque requête. Avec Cache
// Components, lire searchParams hors d'un <Suspense> demande cet accord
// explicite (route bloquante) ; un <Suspense> enverrait d'abord un repli et
// la liste filtrée n'apparaîtrait qu'avec JavaScript.
export const instant = false;

export const metadata: Metadata = {
  title: "Exercices - MAESTRO",
  description:
    "34 fiches d'exercices de foot pour les 13-14 ans, au poids du corps, avec un ballon et quelques plots : technique, physique, mental et vision.",
};

const INTRO: Record<Pillar, string> = {
  technique: "Un ballon, un mur et quelques plots : contrôle, pied faible, conduite et frappe.",
  physique: "Au poids du corps : démarrages, appuis, gainage, et le retour au calme après l'effort.",
  mental: "Des routines de quelques minutes pour le stress, les erreurs et les jours de match.",
  vision: "Lever la tête, prendre l'information et choisir la passe avant de recevoir le ballon.",
};

function parsePillar(raw: string | string[] | undefined): Pillar | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return PILLARS.find((p) => p === value) ?? null;
}

const pad = (n: number) => String(n).padStart(2, "0");
const byPillar = (p: Pillar) => EXERCISES.filter((e) => e.pillar === p);

export default async function ExercisesPage({ searchParams }: PageProps<"/exercices">) {
  const active = parsePillar((await searchParams).pilier);
  const shown = active ? [active] : PILLARS;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-5 pt-8 pb-20 md:px-8 md:pt-14 md:pb-28">
      <h1 className="text-5xl leading-[0.9] font-extrabold uppercase font-stretch-75% md:text-7xl">
        Exercices
      </h1>
      <p className="mt-4 max-w-[58ch] leading-relaxed text-ink-2 md:text-lg">
        {EXERCISES.length} fiches, toutes au poids du corps, avec un ballon et quelques plots. Chacune
        te dit quoi faire, combien de fois, et les erreurs à éviter.
      </p>

      <nav aria-label="Filtrer par pilier" className="mt-8 md:mt-10">
        <ul className="flex flex-wrap gap-2">
          <FilterLink href="/exercices" label="Tous" count={EXERCISES.length} current={active === null} />
          {PILLARS.map((p) => (
            <FilterLink
              key={p}
              href={`/exercices?pilier=${p}`}
              label={PILLAR_LABELS[p]}
              count={byPillar(p).length}
              current={active === p}
            />
          ))}
        </ul>
      </nav>

      {shown.map((p) => {
        const list = byPillar(p);
        return (
          <section key={p} aria-labelledby={`pilier-${p}`} className="mt-14 md:mt-20">
            <div className="flex items-baseline justify-between gap-6 border-b-2 border-ink pb-3">
              <h2
                id={`pilier-${p}`}
                className="text-3xl leading-none font-extrabold uppercase font-stretch-75% md:text-5xl"
              >
                {PILLAR_LABELS[p]}
              </h2>
              <p className="font-mono text-sm text-ink-2">
                <span className="text-ink">{pad(list.length)}</span> fiches
              </p>
            </div>
            <p className="mt-4 max-w-[60ch] text-ink-2">{INTRO[p]}</p>
            <ul className="mt-6 grid gap-x-10 md:grid-cols-2">
              {list.map((e) => (
                <li key={e.slug}>
                  <ExerciseRow exercise={e} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function FilterLink({
  href,
  label,
  count,
  current,
}: {
  href: string;
  label: string;
  count: number;
  current: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        aria-current={current ? "page" : undefined}
        className="inline-flex h-11 items-center gap-2.5 rounded border border-line px-4 font-semibold transition-transform duration-150 hover:border-ink active:scale-[0.98] aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-bg"
      >
        {label}
        <span className="font-mono text-xs font-normal opacity-70">{count}</span>
      </Link>
    </li>
  );
}

function Thumb({ exercise }: { exercise: Exercise }) {
  const box = "aspect-[5/3] w-full overflow-hidden rounded";
  if (exercise.diagram) {
    return (
      <div className={`${box} border border-line`}>
        <TerrainDiagram diagram={exercise.diagram} compact className="size-full" />
      </div>
    );
  }
  const meta = exercise.photo ? PHOTOS[exercise.photo] : undefined;
  // Sans photo disponible : un aplat sombre plutôt qu'une image cassée.
  const fallback = <div className={`${box} bg-surface-dark`} />;
  if (!exercise.photo || !meta) return fallback;
  return (
    <div className={`${box} bg-surface-dark`}>
      <ExercisePhoto
        src={exercise.photo}
        meta={{ ...meta, alt: "" }}
        sizes="128px"
        fallback={null}
        className="size-full object-cover"
      />
    </div>
  );
}

function ExerciseRow({ exercise }: { exercise: Exercise }) {
  return (
    <Link
      href={`/exercices/${exercise.slug}`}
      className="group grid grid-cols-[6.5rem_1fr] items-start gap-4 border-b border-line py-4 md:grid-cols-[8rem_1fr] md:gap-5"
    >
      <Thumb exercise={exercise} />
      <span>
        <span className="block text-lg leading-tight font-bold font-stretch-85% group-hover:underline group-hover:decoration-2 md:text-xl">
          {exercise.name}
        </span>
        <span className="mt-1.5 line-clamp-2 text-[0.9375rem] leading-snug text-ink-2">
          {exercise.goal}
        </span>
      </span>
    </Link>
  );
}
