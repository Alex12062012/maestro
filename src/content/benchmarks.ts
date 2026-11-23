// Tests de référence, mesurés le dimanche des semaines 1, 6 et 12.
// La validation des saisies vit dans `@/lib/measure`.

export type Unit = "reps" | "s" | "/10";

export type Benchmark = {
  id: string;
  label: string;
  unit: Unit;
  /** Sens du progrès : plus de jongles, mais moins de secondes. */
  better: "higher" | "lower";
  /** Comment faire la mesure, en une phrase. */
  how: string;
  /** Fiche d'exercice qui détaille le test. */
  exercise?: string;
};

export const BENCHMARKS: Benchmark[] = [
  {
    id: "jongles-droit",
    label: "Jongles pied droit",
    unit: "reps",
    better: "higher",
    how: "3 essais sans rebond au sol, tu gardes le meilleur.",
    exercise: "jongles",
  },
  {
    id: "jongles-gauche",
    label: "Jongles pied gauche",
    unit: "reps",
    better: "higher",
    how: "3 essais sans rebond au sol, tu gardes le meilleur.",
    exercise: "jongles",
  },
  {
    id: "slalom",
    label: "Slalom 6 plots",
    unit: "s",
    better: "lower",
    how: "Un aller-retour sans toucher de plot, le meilleur de 2 essais.",
    exercise: "slalom-plots",
  },
  {
    id: "sprint-20",
    label: "Sprint 20 m",
    unit: "s",
    better: "lower",
    how: "Départ debout, après l’échauffement, le meilleur de 2 essais.",
    exercise: "sprints-courts",
  },
  {
    id: "finition",
    label: "Finition sur 10 frappes",
    unit: "/10",
    better: "higher",
    how: "10 frappes à 16 mètres, tu comptes celles qui entrent dans le cadre.",
    exercise: "frappes-cadrees",
  },
  {
    id: "confiance",
    label: "Confiance",
    unit: "/10",
    better: "higher",
    how: "Ta note du jour, de 0 à 10, avant de commencer les tests.",
  },
];
