import type { ReactNode } from "react";
import type { Diagram, Point } from "@/content/exercises";

// Schéma d'exercice vu de dessus, dessiné à la main : aire de 100 × 60,
// grille de mesure en --line, trajets en --blue. Course en pointillés,
// passe ou frappe en trait plein, conduite de balle en trait ondulé, saut
// en arc pointillé.
// `animate` : chaque trajet se dessine à l'apparition (stroke-dashoffset
// sur un masque), coupé sous "réduire les animations" dans globals.css.

type Kind = Diagram["paths"][number]["kind"];

const HEAD = 2.4; // longueur de la pointe de flèche
const HALF = 1.15; // demi-largeur de la pointe
const WAVE = 0.9; // amplitude de l'ondulation d'une conduite

const r = (n: number) => Math.round(n * 100) / 100;
const pt = (x: number, y: number) => `${r(x)},${r(y)}`;

function axis(from: Point, to: Point) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  return { ux: dx / len, uy: dy / len, len };
}

// Point à la distance `d` sur l'axe, décalé de `o` sur la perpendiculaire.
function along(from: Point, ux: number, uy: number, d: number, o = 0): string {
  return pt(from[0] + ux * d - uy * o, from[1] + uy * d + ux * o);
}

function headPoints(from: Point, to: Point): string {
  const { ux, uy, len } = axis(from, to);
  return [
    along(from, ux, uy, len),
    along(from, ux, uy, len - HEAD, HALF),
    along(from, ux, uy, len - HEAD, -HALF),
  ].join(" ");
}

/** Sommet de contrôle de l'arc d'un saut, du côté gauche du trajet. */
function jumpControl(from: Point, to: Point): Point {
  const { ux, uy, len } = axis(from, to);
  const bulge = Math.min(6, len * 0.4);
  return [(from[0] + to[0]) / 2 + uy * bulge, (from[1] + to[1]) / 2 - ux * bulge];
}

function strokePath(from: Point, to: Point, kind: Kind, head = true): string {
  if (kind === "jump") return `M${pt(...from)}Q${pt(...jumpControl(from, to))} ${pt(...to)}`;
  const { ux, uy, len } = axis(from, to);
  const end = head ? Math.max(0, len - HEAD * 0.8) : len; // le trait s'arrête sous la pointe
  if (kind !== "dribble") return `M${pt(...from)}L${along(from, ux, uy, end)}`;

  // Conduite : demi-ondes de 2 unités environ, puis un bout droit avant la pointe.
  const wavy = Math.max(2, end - 1.6);
  const n = Math.max(2, Math.round(wavy / 2));
  const h = wavy / n;
  let d = `M${pt(...from)}`;
  for (let i = 0; i < n; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    d += `Q${along(from, ux, uy, (i + 0.5) * h, 2 * WAVE * side)} ${along(from, ux, uy, (i + 1) * h)}`;
  }
  return `${d}L${along(from, ux, uy, end)}`;
}

function cone([x, y]: Point): string {
  return `${pt(x, y - 1.5)} ${pt(x - 1.35, y + 1.05)} ${pt(x + 1.35, y + 1.05)}`;
}

const KIND_LABEL: Record<Kind, [string, string]> = {
  run: ["course", "courses"],
  pass: ["passe ou frappe", "passes ou frappes"],
  dribble: ["conduite de balle", "conduites de balle"],
  jump: ["saut", "sauts"],
};

function count(n: number, [one, many]: [string, string]): string {
  return `${n} ${n > 1 ? many : one}`;
}

/** Résumé lu par les lecteurs d'écran ; les étapes de la fiche donnent le détail. */
export function describeDiagram(d: Diagram): string {
  const parts: string[] = [];
  if (d.cones.length) parts.push(count(d.cones.length, ["plot", "plots"]));
  if (d.line) parts.push("une ligne au sol");
  if (d.ball) parts.push("le ballon");
  if (d.player) parts.push("toi");
  for (const kind of ["run", "pass", "dribble", "jump"] as const) {
    const n = d.paths.filter((p) => p.kind === kind).length;
    if (n) parts.push(count(n, KIND_LABEL[kind]));
  }
  return `Schéma vu de dessus${d.wall ? ", le mur en haut" : ""} : ${parts.join(", ")}.`;
}

export function TerrainDiagram({
  diagram,
  animate = false,
  id = "terrain",
  compact = false,
  className,
}: {
  diagram: Diagram;
  animate?: boolean;
  /** Préfixe des identifiants de masque, unique dans la page. */
  id?: string;
  /** Vignette de la bibliothèque : sans grille, traits épaissis, décorative. */
  compact?: boolean;
  className?: string;
}) {
  // Les traits suivent l'échelle du dessin : la vignette les épaissit pour
  // rester lisible à 120 px de large.
  const w = compact ? 2 : 1;
  const { cones, ball, player, paths, wall, line } = diagram;

  return (
    <svg
      viewBox={compact ? "-2 -3 104 66" : "-3 -4 106 68"}
      className={className}
      role={compact ? undefined : "img"}
      aria-label={compact ? undefined : describeDiagram(diagram)}
      aria-hidden={compact || undefined}
    >
      <rect x="0" y="0" width="100" height="60" fill="none" stroke="var(--line)" strokeWidth={0.5 * w} />
      {!compact && (
        <g stroke="var(--line)" strokeWidth="0.25">
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => (
            <line key={`x${x}`} x1={x} y1="0" x2={x} y2="60" />
          ))}
          {[10, 20, 30, 40, 50].map((y) => (
            <line key={`y${y}`} x1="0" y1={y} x2="100" y2={y} />
          ))}
        </g>
      )}

      {wall && (
        <g stroke="var(--ink-2)">
          <line x1="0" y1="0" x2="100" y2="0" strokeWidth={1.2 * w} />
          {!compact &&
            Array.from({ length: 33 }, (_, i) => (
              <line key={i} x1={i * 3} y1="0" x2={i * 3 + 2.4} y2="-2.4" strokeWidth="0.3" />
            ))}
        </g>
      )}

      {line && (
        <line
          x1={line[0][0]}
          y1={line[0][1]}
          x2={line[1][0]}
          y2={line[1][1]}
          stroke="var(--ink-2)"
          strokeWidth={0.9 * w}
          strokeLinecap="round"
        />
      )}

      {animate && (
        <defs>
          {/* Masques : le blanc veut dire "visible", ce n'est pas une couleur affichée. */}
          {paths.map((p, i) => (
            <mask key={i} id={`${id}-m${i}`} maskUnits="userSpaceOnUse" x="-5" y="-6" width="110" height="72">
              <path
                d={p.kind === "jump" ? strokePath(p.from, p.to, "jump") : `M${pt(...p.from)}L${pt(...p.to)}`}
                pathLength={1}
                stroke="white"
                strokeWidth="5"
                fill="none"
                className="terrain-draw"
                style={{ animationDelay: `${200 + i * 220}ms` }}
              />
            </mask>
          ))}
        </defs>
      )}

      <g fill="var(--blue)" stroke="var(--blue)">
        {paths.map((p, i) => {
          // Une conduite ou une course qui se poursuit dans le trajet suivant
          // (même geste, même point) ne porte pas de pointe : la flèche est au
          // bout de l'enchaînement. Les passes gardent la leur à chaque rebond.
          const nextPath = paths[i + 1];
          const head = !(
            p.kind !== "pass" &&
            nextPath &&
            nextPath.kind === p.kind &&
            nextPath.from[0] === p.to[0] &&
            nextPath.from[1] === p.to[1]
          );
          return (
            <g key={i} mask={animate ? `url(#${id}-m${i})` : undefined}>
              <path
                d={strokePath(p.from, p.to, p.kind, head)}
                fill="none"
                strokeWidth={0.55 * w}
                strokeDasharray={
                  p.kind === "run"
                    ? `${1.6 * w} ${1.2 * w}`
                    : p.kind === "jump"
                      ? `${0.7 * w} ${1 * w}`
                      : undefined
                }
                strokeLinecap={p.kind === "run" ? "butt" : "round"}
                strokeLinejoin="round"
              />
              {head && (
                <polygon
                  points={headPoints(p.kind === "jump" ? jumpControl(p.from, p.to) : p.from, p.to)}
                  stroke="none"
                />
              )}
            </g>
          );
        })}
      </g>

      <g fill="var(--ink-2)">
        {cones.map((c, i) => (
          <polygon key={i} points={cone(c)} />
        ))}
      </g>
      {ball && <circle cx={ball[0]} cy={ball[1]} r="1.3" fill="var(--bg)" stroke="var(--ink)" strokeWidth={0.45 * w} />}
      {player && <circle cx={player[0]} cy={player[1]} r="2" fill="var(--ink)" />}
    </svg>
  );
}

type LegendItem = { key: string; label: string; mark: ReactNode };

/** Légende du schéma, limitée à ce qui y apparaît. */
export function DiagramLegend({ diagram, className }: { diagram: Diagram; className?: string }) {
  const kinds = new Set(diagram.paths.map((p) => p.kind));
  const items: LegendItem[] = [];
  if (diagram.player) items.push({ key: "player", label: "Toi", mark: <circle cx="8" cy="5" r="3" fill="var(--ink)" /> });
  if (diagram.ball)
    items.push({
      key: "ball",
      label: "Ballon",
      mark: <circle cx="8" cy="5" r="2.4" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1" />,
    });
  if (diagram.cones.length)
    items.push({ key: "cone", label: "Plot", mark: <polygon points="8,1.5 4.5,8.5 11.5,8.5" fill="var(--ink-2)" /> });
  if (diagram.line)
    items.push({
      key: "line",
      label: "Ligne au sol",
      mark: <line x1="1" y1="5" x2="15" y2="5" stroke="var(--ink-2)" strokeWidth="2" strokeLinecap="round" />,
    });
  if (diagram.wall)
    items.push({ key: "wall", label: "Mur", mark: <line x1="1" y1="5" x2="15" y2="5" stroke="var(--ink-2)" strokeWidth="2.5" /> });
  const path = (kind: Kind, label: string) => {
    if (!kinds.has(kind)) return;
    items.push({
      key: kind,
      label,
      mark: (
        <path
          d={strokePath([0.5, 5], [15.5, 5], kind)}
          fill="none"
          stroke="var(--blue)"
          strokeWidth="1.3"
          strokeDasharray={kind === "run" ? "3 2.2" : kind === "jump" ? "1.4 1.6" : undefined}
          strokeLinecap={kind === "jump" ? "round" : undefined}
        />
      ),
    });
  };
  path("run", "Course");
  path("pass", "Passe ou frappe");
  path("dribble", "Conduite de balle");
  path("jump", "Saut");

  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-ink-2 ${className ?? ""}`}>
      {items.map((it) => (
        <li key={it.key} className="flex items-center gap-2">
          <svg viewBox="0 0 16 10" width="24" height="15" aria-hidden className="shrink-0">
            {it.mark}
          </svg>
          {it.label}
        </li>
      ))}
    </ul>
  );
}
