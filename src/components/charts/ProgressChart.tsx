import type { Benchmark } from "@/content/benchmarks";
import { formatNumber, unitSuffix } from "@/lib/format";
import { CHECKPOINTS, WEEK_OF, type Checkpoint } from "@/lib/measure";

// Courbe d'un test de référence sur les semaines 1, 6 et 12, prévue pour un
// fond --surface-dark : grille claire et discrète, courbe en --blue-on-dark,
// dernière valeur en --signal. L'axe du temps est réel (semaine 6 aux 5/11).
// Le dessin fait 300 unités de large et s'affiche entre 265 et 480 px : le
// texte à 14 unités reste à 12 px ou plus.

const W = 300;
const H = 170;
const L = 54; // marge gauche (graduations, jusqu'à "10 000")
const R = 16;
const T = 24; // marge haute (étiquettes des points)
const B = 30; // marge basse (semaines)
const TEXT = 14;

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Domaine de l'axe vertical : 0-10 pour les notes, depuis 0 pour les
 * jongles, autour des valeurs pour les temps. Une seule valeur : un écart
 * autour d'elle. Aucune valeur : [0, 1], pour ne jamais diviser par zéro.
 */
export function chartDomain(unit: Benchmark["unit"], values: number[]): [number, number] {
  if (unit === "/10") return [0, 10];
  if (values.length === 0) return [0, 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (unit === "reps") return [0, Math.max(10, Math.ceil((max * 1.2) / 10) * 10)];
  const pad = Math.max(0.5, (max - min) * 0.3);
  return [Math.max(0, Math.floor((min - pad) * 2) / 2), Math.ceil((max + pad) * 2) / 2];
}

/** Sans aucune mesure, pas de graphique : la légende du test le dit en texte. */
export function ProgressChart({
  benchmark,
  values,
  className,
}: {
  benchmark: Benchmark;
  values: Partial<Record<Checkpoint, number>>;
  className?: string;
}) {
  const points = CHECKPOINTS.filter((cp) => values[cp] !== undefined).map((cp) => ({
    cp,
    value: values[cp] as number,
  }));
  if (points.length === 0) return null;

  const [lo, hi] = chartDomain(
    benchmark.unit,
    points.map((p) => p.value),
  );
  const x = (cp: Checkpoint) => r1(L + ((WEEK_OF[cp] - 1) / 11) * (W - L - R));
  const y = (v: number) => r1(T + (1 - (v - lo) / (hi - lo)) * (H - T - B));
  const ticks = [lo, (lo + hi) / 2, hi];
  const unit = unitSuffix(benchmark.unit);
  const summary = points
    .map((p) => `semaine ${WEEK_OF[p.cp]} : ${formatNumber(p.value)}${unit}`)
    .join(", ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${benchmark.label}, ${summary}.`}
      className={className}
    >
      <g className="font-mono" fontSize={TEXT} fill="var(--on-dark)" fillOpacity="0.6">
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={L}
              x2={W - R}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--on-dark)"
              strokeOpacity={t === lo ? 0.3 : 0.12}
            />
            <text x={L - 8} y={y(t) + 4.5} textAnchor="end">
              {formatNumber(r1(t))}
            </text>
          </g>
        ))}
        {CHECKPOINTS.map((cp) => (
          <text key={cp} x={x(cp)} y={H - 8} textAnchor="middle">
            S{WEEK_OF[cp]}
          </text>
        ))}
      </g>

      {/* Semaines sans mesure : un repère vide. */}
      {CHECKPOINTS.filter((cp) => values[cp] === undefined).map((cp) => (
        <line
          key={cp}
          x1={x(cp)}
          x2={x(cp)}
          y1={T}
          y2={H - B}
          stroke="var(--on-dark)"
          strokeOpacity="0.3"
          strokeDasharray="2 4"
        />
      ))}

      {points.length > 1 && (
        <polyline
          points={points.map((p) => `${x(p.cp)},${y(p.value)}`).join(" ")}
          fill="none"
          stroke="var(--blue-on-dark)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {points.map((p, i) => {
        const last = i === points.length - 1;
        return (
          <g key={p.cp}>
            <circle
              cx={x(p.cp)}
              cy={y(p.value)}
              r={last ? 5.5 : 4}
              fill={last ? "var(--signal)" : "var(--surface-dark)"}
              stroke={last ? "none" : "var(--blue-on-dark)"}
              strokeWidth="2"
            />
            <text
              x={x(p.cp)}
              y={y(p.value) - 11}
              textAnchor={p.cp === "w12" ? "end" : p.cp === "w1" ? "start" : "middle"}
              className="font-mono"
              fontSize={TEXT}
              fill={last ? "var(--signal)" : "var(--on-dark)"}
              fillOpacity={last ? 1 : 0.8}
            >
              {formatNumber(p.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
