import { PILLARS, PILLAR_LABELS, type Pillar } from "@/content/quiz";

// Radar 4 axes dessiné à la main, prévu pour un fond --surface-dark :
// grille claire et discrète, forme en --blue, points en --signal.
const W = 420;
const H = 340;
const CX = 210;
const CY = 170;
const R = 116;

// Technique en haut, puis sens horaire.
const ANGLE: Record<Pillar, number> = {
  technique: -Math.PI / 2,
  physique: 0,
  mental: Math.PI / 2,
  vision: Math.PI,
};

const LABEL: Record<Pillar, { x: number; y: number; anchor: "start" | "middle" | "end" }> = {
  technique: { x: CX, y: CY - R - 16, anchor: "middle" },
  physique: { x: CX + R + 12, y: CY + 5, anchor: "start" },
  mental: { x: CX, y: CY + R + 28, anchor: "middle" },
  vision: { x: CX - R - 12, y: CY + 5, anchor: "end" },
};

function point(pillar: Pillar, value: number): [number, number] {
  const r = (R * Math.max(0, Math.min(100, value))) / 100;
  const a = ANGLE[pillar];
  // Arrondi : évite des attributs à 15 décimales et des écarts serveur/client.
  return [Math.round((CX + r * Math.cos(a)) * 10) / 10, Math.round((CY + r * Math.sin(a)) * 10) / 10];
}

function ring(value: number): string {
  return PILLARS.map((p) => point(p, value).join(",")).join(" ");
}

export function Radar({
  scores,
  className,
}: {
  scores: Record<Pillar, number>;
  className?: string;
}) {
  const summary = PILLARS.map((p) => `${PILLAR_LABELS[p]} ${scores[p]}`).join(", ");
  const shape = PILLARS.map((p) => point(p, scores[p]).join(",")).join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Radar de tes 4 piliers sur 100 : ${summary}`}
      className={className}
    >
      <g fill="none" stroke="var(--bg)" strokeWidth="1">
        {[25, 50, 75].map((v) => (
          <polygon key={v} points={ring(v)} strokeOpacity="0.14" />
        ))}
        <polygon points={ring(100)} strokeOpacity="0.32" />
        {PILLARS.map((p) => {
          const [x, y] = point(p, 100);
          return <line key={p} x1={CX} y1={CY} x2={x} y2={y} strokeOpacity="0.14" />;
        })}
      </g>

      <g
        className="animate-radar-in"
        style={{ transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}
      >
        <polygon
          points={shape}
          fill="var(--blue)"
          fillOpacity="0.35"
          stroke="var(--blue)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {PILLARS.map((p) => {
          const [x, y] = point(p, scores[p]);
          return <circle key={p} cx={x} cy={y} r="5" fill="var(--signal)" />;
        })}
      </g>

      <g className="font-mono" fontSize="14" letterSpacing="0.06em" fill="var(--bg)">
        {PILLARS.map((p) => (
          <text
            key={p}
            x={LABEL[p].x}
            y={LABEL[p].y}
            textAnchor={LABEL[p].anchor}
            fillOpacity="0.8"
          >
            {PILLAR_LABELS[p].toUpperCase()}
          </text>
        ))}
      </g>
    </svg>
  );
}
