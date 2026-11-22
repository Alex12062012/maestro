import { describe, expect, it } from "vitest";
import { chartDomain } from "@/components/charts/ProgressChart";

const finite = ([lo, hi]: [number, number]) =>
  Number.isFinite(lo) && Number.isFinite(hi) && hi > lo;

describe("chartDomain", () => {
  it("aucune valeur : un domaine fini, jamais Infinity ni NaN", () => {
    for (const unit of ["s", "reps", "/10"] as const) {
      expect(finite(chartDomain(unit, [])), unit).toBe(true);
    }
  });

  it("une seule valeur : un écart autour d'elle", () => {
    const [lo, hi] = chartDomain("s", [3.6]);
    expect(lo).toBeLessThan(3.6);
    expect(hi).toBeGreaterThan(3.6);
    expect(finite(chartDomain("reps", [0]))).toBe(true);
    expect(finite(chartDomain("s", [0.01]))).toBe(true);
  });

  it("notes de 0 à 10, jongles depuis 0, temps autour des valeurs", () => {
    expect(chartDomain("/10", [6, 7])).toEqual([0, 10]);
    expect(chartDomain("reps", [12, 20])).toEqual([0, 30]);
    const [lo, hi] = chartDomain("s", [13.1, 14.2]);
    expect(lo).toBeLessThanOrEqual(13.1);
    expect(hi).toBeGreaterThanOrEqual(14.2);
    expect(lo).toBeGreaterThan(0);
  });
});
