import { statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { EXERCISES, getExercise } from "@/content/exercises";
import { PHOTOS } from "@/content/photos";
import { DAYS, PHASES, PROGRAM, PROGRAM_RULES, isValidWeek, sessionId } from "@/content/program";
import { PILLARS, PROFILES, QUESTIONS } from "@/content/quiz";

const slugs = EXERCISES.map((e) => e.slug);
const sessions = PROGRAM.flatMap((w) => w.days.map((d) => ({ week: w.week, ...d })));
const TEST_WEEKS = [1, 6, 12];
const minutesOfWeek = (n: number) =>
  PROGRAM[n - 1].days.filter((d) => d.day !== "samedi").reduce((acc, d) => acc + d.minutes, 0);
// Charge d'entraînement : sans le match du samedi ni les dimanches de tests.
const trainingMinutes = (n: number) =>
  PROGRAM[n - 1].days
    .filter((d) => d.day !== "samedi" && !(d.day === "dimanche" && TEST_WEEKS.includes(n)))
    .reduce((acc, d) => acc + d.minutes, 0);

describe("PROGRAM", () => {
  it("12 semaines, de 1 à 12 dans l'ordre, 7 jours du lundi au dimanche", () => {
    expect(PROGRAM).toHaveLength(12);
    PROGRAM.forEach((w, i) => {
      expect(w.week).toBe(i + 1);
      expect(w.days.map((d) => d.day)).toEqual([...DAYS]);
    });
  });

  it("chaque exercice cité existe dans la bibliothèque", () => {
    for (const s of sessions) {
      expect(s.exercises.length, sessionId(s.week, s.day)).toBeGreaterThan(0);
      for (const slug of s.exercises) {
        expect(slugs, `${sessionId(s.week, s.day)} cite "${slug}"`).toContain(slug);
      }
    }
  });

  it("chaque exercice de la bibliothèque sert au moins une fois", () => {
    const used = new Set(sessions.flatMap((s) => s.exercises));
    expect(slugs.filter((slug) => !used.has(slug))).toEqual([]);
  });

  it("minutes entre 10 et 60 hors samedi", () => {
    for (const s of sessions.filter((s) => s.day !== "samedi")) {
      expect(s.minutes, sessionId(s.week, s.day)).toBeGreaterThanOrEqual(10);
      expect(s.minutes, sessionId(s.week, s.day)).toBeLessThanOrEqual(60);
    }
  });

  it("chaque séance a un titre et une routine mentale", () => {
    for (const s of sessions) {
      expect(s.title.trim(), sessionId(s.week, s.day)).not.toBe("");
      expect(s.mental.trim(), sessionId(s.week, s.day)).not.toBe("");
    }
  });

  it("samedi : routine avant le match, RESET pendant, bilan après", () => {
    for (const w of PROGRAM) {
      const samedi = w.days.find((d) => d.day === "samedi")!;
      expect(samedi.exercises).toEqual(["routine-avant-match", "routine-reset", "bilan-apres-match"]);
    }
  });

  it("dimanche : récupération, et tests de référence en semaines 1, 6 et 12", () => {
    for (const w of PROGRAM) {
      const dimanche = w.days.find((d) => d.day === "dimanche")!;
      expect(dimanche.exercises, `semaine ${w.week}`).toContain("retour-au-calme");
      if (TEST_WEEKS.includes(w.week)) {
        expect(dimanche.exercises).toEqual(
          expect.arrayContaining(["jongles", "slalom-plots", "sprints-courts", "frappes-cadrees"]),
        );
      }
    }
  });

  it("échauffement en tête de chaque séance du lundi au jeudi et des dimanches de tests", () => {
    for (const s of sessions) {
      const testSunday = s.day === "dimanche" && TEST_WEEKS.includes(s.week);
      if (["lundi", "mardi", "mercredi", "jeudi"].includes(s.day) || testSunday) {
        expect(s.exercises[0], sessionId(s.week, s.day)).toBe("echauffement-dynamique");
      }
    }
  });

  it("progression douce : la semaine 1 fait environ 60 % de la semaine 12", () => {
    const ratio = minutesOfWeek(1) / minutesOfWeek(12);
    expect(ratio).toBeGreaterThanOrEqual(0.55);
    expect(ratio).toBeLessThanOrEqual(0.68);
    for (let n = 1; n <= 12; n++) {
      expect(minutesOfWeek(n), `semaine ${n}`).toBeLessThanOrEqual(minutesOfWeek(12));
    }
  });

  it("la charge d'entraînement ne baisse jamais d'une semaine à l'autre (hors samedi et dimanches de tests)", () => {
    for (let n = 2; n <= 12; n++) {
      expect(trainingMinutes(n), `semaine ${n} contre ${n - 1}`).toBeGreaterThanOrEqual(trainingMinutes(n - 1));
    }
  });

  it("règles du programme : douleur, club, pas de match, tests décalés après un match dur", () => {
    expect(PROGRAM_RULES.length).toBeGreaterThanOrEqual(4);
    expect(PROGRAM_RULES.some((r) => /tests/i.test(r) && /match/i.test(r))).toBe(true);
  });
});

describe("PHASES", () => {
  it("Bases 1-3, Vitesse 4-6, Confiance 7-9, Maestro 10-12, avec un objectif", () => {
    expect(PHASES.map((p) => [p.name, p.weeks])).toEqual([
      ["Bases", [1, 3]],
      ["Vitesse", [4, 6]],
      ["Confiance", [7, 9]],
      ["Maestro", [10, 12]],
    ]);
    for (const p of PHASES) expect(p.goal.trim()).not.toBe("");
  });
});

describe("EXERCISES", () => {
  it("slugs uniques, environ 30 exercices", () => {
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.length).toBeGreaterThanOrEqual(26);
    expect(slugs.length).toBeLessThanOrEqual(36);
  });

  it("au moins 6 exercices par pilier", () => {
    for (const pillar of PILLARS) {
      expect(EXERCISES.filter((e) => e.pillar === pillar).length, pillar).toBeGreaterThanOrEqual(6);
    }
  });

  it("chaque exercice a un schéma ou une photo, et une fiche complète", () => {
    for (const e of EXERCISES) {
      expect(Boolean(e.diagram || e.photo), e.slug).toBe(true);
      if (e.photo) expect(e.photo).toBe(`/photos/exercices/${e.slug}.jpg`);
      expect(e.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(e.steps.length, e.slug).toBeGreaterThanOrEqual(2);
      expect(e.mistakes.length, e.slug).toBeGreaterThanOrEqual(1);
      for (const text of [e.name, e.goal, e.dose, e.easier, e.harder, ...e.steps, ...e.mistakes]) {
        expect(text.trim(), e.slug).not.toBe("");
      }
    }
  });

  it("schémas dans la grille 0-100 × 0-60", () => {
    const inGrid = ([x, y]: [number, number]) => x >= 0 && x <= 100 && y >= 0 && y <= 60;
    for (const e of EXERCISES) {
      if (!e.diagram) continue;
      const d = e.diagram;
      const points = [
        ...d.cones,
        ...(d.ball ? [d.ball] : []),
        ...(d.player ? [d.player] : []),
        ...(d.line ?? []),
        ...d.paths.flatMap((p) => [p.from, p.to]),
      ];
      for (const p of points) expect(inGrid(p), `${e.slug} ${p}`).toBe(true);
    }
  });

  it("getExercise trouve un slug connu, undefined sinon", () => {
    expect(getExercise("routine-reset")?.pillar).toBe("mental");
    expect(getExercise("inconnu")).toBeUndefined();
  });
});

describe("PHOTOS", () => {
  it("chaque photo citée par une fiche a ses dimensions et son texte alternatif", () => {
    for (const e of EXERCISES) {
      if (!e.photo) continue;
      expect(PHOTOS[e.photo], e.slug).toBeDefined();
      expect(PHOTOS[e.photo].alt.trim(), e.slug).not.toBe("");
    }
  });

  it("chaque fichier existe, en JPEG, aux dimensions déclarées, 1600 px et 250 Ko au plus", async () => {
    for (const [src, meta] of Object.entries(PHOTOS)) {
      const file = join(process.cwd(), "public", src);
      const info = await sharp(file).metadata();
      expect(info.format, src).toBe("jpeg");
      expect([info.width, info.height], src).toEqual([meta.width, meta.height]);
      expect(Math.max(meta.width, meta.height), src).toBeLessThanOrEqual(1600);
      expect(statSync(file).size, src).toBeLessThanOrEqual(250 * 1024);
    }
  });
});

describe("textes", () => {
  const all = JSON.stringify({ EXERCISES, PROGRAM, PHASES, PROGRAM_RULES, QUESTIONS, PROFILES, PHOTOS });

  it("aucun tiret cadratin ni demi-cadratin", () => {
    expect(all).not.toMatch(/[—–]/);
  });

  it("aucun emoji", () => {
    expect(all).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});

describe("isValidWeek et sessionId", () => {
  it.each([0, 13, 2.5, -1, Number.NaN, Number.POSITIVE_INFINITY])("isValidWeek(%s) : false", (n) => {
    expect(isValidWeek(n)).toBe(false);
  });

  it.each([1, 6, 12])("isValidWeek(%s) : true", (n) => {
    expect(isValidWeek(n)).toBe(true);
  });

  it('sessionId(3, "mardi") : "w3-mardi"', () => {
    expect(sessionId(3, "mardi")).toBe("w3-mardi");
  });
});
