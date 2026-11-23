import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DAYS, sessionId } from "@/content/program";
import { PROGRAM } from "@/content/program";
import {
  EMPTY_PROGRESS,
  exerciseId,
  finishedWeeks,
  isDayDone,
  isExerciseDone,
  normalizeProgress,
  parseDone,
  parseDoneExercises,
  readDone,
  readProgress,
  sessionRef,
  toggleDay,
  toggleExercise,
  toggleSession,
  weekProgress,
  writeDone,
  writeProgress,
  type Progress,
} from "@/lib/progress";

describe("toggleSession", () => {
  it("ajoute une séance, puis la retire au second appel", () => {
    const once = toggleSession([], "w1-lundi");
    expect(once).toEqual(["w1-lundi"]);
    expect(toggleSession(once, "w1-lundi")).toEqual([]);
  });

  it("ne crée jamais de doublon", () => {
    const done = toggleSession(toggleSession(["w1-lundi"], "w1-mardi"), "w1-mercredi");
    expect(done).toEqual(["w1-lundi", "w1-mardi", "w1-mercredi"]);
    expect(new Set(done).size).toBe(done.length);
  });

  it("retire toutes les copies d'une séance venue d'une valeur abîmée", () => {
    expect(toggleSession(["w2-jeudi", "w2-jeudi", "w2-lundi"], "w2-jeudi")).toEqual(["w2-lundi"]);
  });

  it("ne modifie pas le tableau reçu", () => {
    const done = ["w1-lundi"];
    toggleSession(done, "w1-mardi");
    toggleSession(done, "w1-lundi");
    expect(done).toEqual(["w1-lundi"]);
  });
});

describe("weekProgress", () => {
  it("compte seulement la semaine demandée", () => {
    const done = ["w1-lundi", "w1-mardi", "w11-lundi", "w12-mardi", "w10-jeudi", "w2-lundi"];
    expect(weekProgress(done, 1)).toBe(2);
    expect(weekProgress(done, 11)).toBe(1);
    expect(weekProgress(done, 3)).toBe(0);
  });

  it("vaut 7 quand toute la semaine est cochée, jamais plus", () => {
    const all = DAYS.map((d) => sessionId(4, d));
    expect(weekProgress([...all, ...all, "w4-samedi"], 4)).toBe(7);
  });

  it("ignore les identifiants qui ne sont pas des séances", () => {
    expect(weekProgress(["w1-", "w1-lundi-bis", "w1-funday", "W1-lundi"], 1)).toBe(0);
  });
});

describe("finishedWeeks", () => {
  const week = (n: number) => DAYS.map((d) => sessionId(n, d));

  it("donne la semaine dont la dernière journée vient d'être faite", () => {
    const before = week(3).slice(0, 6);
    expect(finishedWeeks(before, week(3))).toEqual([3]);
  });

  it("rien quand la semaine était déjà finie ou ne l'est pas encore", () => {
    expect(finishedWeeks(week(3), [...week(3), "w4-lundi"])).toEqual([]);
    expect(finishedWeeks([], ["w5-lundi", "w5-mardi"])).toEqual([]);
  });

  it("rien quand une journée est décochée", () => {
    expect(finishedWeeks(week(2), week(2).slice(1))).toEqual([]);
  });
});

describe("parseDone", () => {
  it("garde les identifiants de séance valides, sans doublon", () => {
    expect(parseDone(["w1-lundi", "w12-dimanche", "w1-lundi"])).toEqual(["w1-lundi", "w12-dimanche"]);
  });

  it.each([null, undefined, "w1-lundi", 42, { a: 1 }])("valeur illisible %s : liste vide", (raw) => {
    expect(parseDone(raw)).toEqual([]);
  });

  it("écarte ce qui n'est pas une séance du programme", () => {
    expect(parseDone(["w13-lundi", "w0-lundi", "w1-funday", 7, null, "w3-mardi"])).toEqual(["w3-mardi"]);
  });
});

describe("readDone / writeDone", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("relit ce qui a été écrit", () => {
    writeDone(["w1-lundi", "w1-mardi"]);
    expect(readDone()).toEqual(["w1-lundi", "w1-mardi"]);
  });

  it("valeur abîmée dans le stockage : liste vide", () => {
    store.set("maestro:v1:done", "{pas du json");
    expect(readDone()).toEqual([]);
  });

  it("stockage bloqué : liste vide, aucune erreur", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(() => writeDone(["w1-lundi"])).not.toThrow();
    expect(readDone()).toEqual([]);
  });
});

// Séance réelle : semaine 3, mardi = échauffement, appuis, sprints, squats, gainage latéral.
const W3_MARDI = "w3-mardi";
const w3Mardi = PROGRAM[2].days.find((d) => d.day === "mardi")!.exercises;
const checkAll = (p: Progress, sid: string, slugs: readonly string[]) =>
  slugs.reduce((acc, slug) => toggleExercise(acc, sid, slug), p);

describe("progression par exercice", () => {
  it("cocher tous les exercices d'une journée la marque faite", () => {
    let p = EMPTY_PROGRESS;
    for (const slug of w3Mardi.slice(0, -1)) {
      p = toggleExercise(p, W3_MARDI, slug);
      expect(isDayDone(p, W3_MARDI)).toBe(false);
    }
    p = toggleExercise(p, W3_MARDI, w3Mardi.at(-1)!);
    expect(isDayDone(p, W3_MARDI)).toBe(true);
    expect(p.days).toEqual([W3_MARDI]);
    expect(weekProgress(p.days, 3)).toBe(1);
  });

  it("décocher un seul exercice défait la journée, les autres restent cochés", () => {
    const full = checkAll(EMPTY_PROGRESS, W3_MARDI, w3Mardi);
    const p = toggleExercise(full, W3_MARDI, w3Mardi[1]);
    expect(isDayDone(p, W3_MARDI)).toBe(false);
    expect(isExerciseDone(p, W3_MARDI, w3Mardi[1])).toBe(false);
    expect(isExerciseDone(p, W3_MARDI, w3Mardi[0])).toBe(true);
    expect(p.exercises).toHaveLength(w3Mardi.length - 1);
  });

  it("Terminer la journée coche tout, et un second appui décoche tout", () => {
    const partial = toggleExercise(EMPTY_PROGRESS, W3_MARDI, w3Mardi[0]);
    const done = toggleDay(partial, W3_MARDI);
    expect(isDayDone(done, W3_MARDI)).toBe(true);
    for (const slug of w3Mardi) expect(isExerciseDone(done, W3_MARDI, slug)).toBe(true);

    const undone = toggleDay(done, W3_MARDI);
    expect(isDayDone(undone, W3_MARDI)).toBe(false);
    expect(undone.exercises.filter((id) => id.startsWith(`${W3_MARDI}:`))).toEqual([]);
  });

  it("ne touche pas aux autres journées", () => {
    const other = toggleDay(EMPTY_PROGRESS, "w3-lundi");
    const p = toggleDay(other, W3_MARDI);
    expect(p.days.sort()).toEqual(["w3-lundi", W3_MARDI].sort());
    expect(toggleDay(p, W3_MARDI).days).toEqual(["w3-lundi"]);
  });

  it("ancienne progression (journée cochée, aucun exercice) : tous ses exercices comptent comme cochés", () => {
    const p = normalizeProgress({ days: [W3_MARDI], exercises: [] });
    expect(isDayDone(p, W3_MARDI)).toBe(true);
    for (const slug of w3Mardi) expect(isExerciseDone(p, W3_MARDI, slug)).toBe(true);
    // Puis décocher un exercice défait la journée, comme pour une journée récente.
    expect(isDayDone(toggleExercise(p, W3_MARDI, w3Mardi[0]), W3_MARDI)).toBe(false);
  });

  it("valeur incohérente : la journée suit ses exercices", () => {
    const lonely = exerciseId(W3_MARDI, w3Mardi[0]);
    expect(normalizeProgress({ days: [W3_MARDI], exercises: [lonely] })).toEqual({
      days: [],
      exercises: [lonely],
    });
    const all = w3Mardi.map((slug) => exerciseId(W3_MARDI, slug));
    expect(normalizeProgress({ days: [], exercises: all }).days).toEqual([W3_MARDI]);
  });

  it("un exercice répété dans une journée compte une fois (dédoublonné par slug)", () => {
    const session = sessionRef("w9-jeudi", ["echauffement-dynamique", "squats", "echauffement-dynamique"]);
    expect(session.slugs).toEqual(["echauffement-dynamique", "squats"]);
    const sessions = [session];
    let p = toggleExercise(EMPTY_PROGRESS, "w9-jeudi", "echauffement-dynamique", sessions);
    expect(p.exercises).toEqual(["w9-jeudi:echauffement-dynamique"]);
    expect(isDayDone(p, "w9-jeudi")).toBe(false);
    p = toggleExercise(p, "w9-jeudi", "squats", sessions);
    expect(isDayDone(p, "w9-jeudi")).toBe(true);
    expect(toggleDay(EMPTY_PROGRESS, "w9-jeudi", sessions).exercises).toHaveLength(2);
  });

  it("une journée sans exercice garde une seule case", () => {
    const sessions = [sessionRef("w1-samedi", [])];
    const p = toggleDay(EMPTY_PROGRESS, "w1-samedi", sessions);
    expect(p).toEqual({ days: ["w1-samedi"], exercises: [] });
    expect(normalizeProgress(p, sessions)).toEqual(p);
    expect(toggleDay(p, "w1-samedi", sessions)).toEqual(EMPTY_PROGRESS);
  });

  it("ignore un exercice qui n'est pas dans la séance", () => {
    expect(toggleExercise(EMPTY_PROGRESS, W3_MARDI, "penalty-pression")).toEqual(EMPTY_PROGRESS);
  });
});

describe("parseDoneExercises", () => {
  it("garde les identifiants exercice valides, sans doublon", () => {
    const id = exerciseId(W3_MARDI, w3Mardi[0]);
    expect(parseDoneExercises([id, id, "w3-mardi:penalty-pression", "w99-lundi:squats", 4, null])).toEqual([id]);
  });

  it.each([null, undefined, "w3-mardi:squats", 7, { a: 1 }])("valeur illisible %s : liste vide", (raw) => {
    expect(parseDoneExercises(raw)).toEqual([]);
  });
});

describe("readProgress / writeProgress", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("écrit les journées sous done et les exercices sous done-ex, puis les relit", () => {
    const p = toggleExercise(toggleDay(EMPTY_PROGRESS, "w1-lundi"), W3_MARDI, w3Mardi[0]);
    writeProgress(p);
    expect(JSON.parse(store.get("maestro:v1:done")!)).toEqual(["w1-lundi"]);
    expect(JSON.parse(store.get("maestro:v1:done-ex")!)).toContain(exerciseId(W3_MARDI, w3Mardi[0]));
    expect(readProgress()).toEqual(p);
  });

  it("migration : une ancienne liste done seule donne ses journées entièrement cochées", () => {
    store.set("maestro:v1:done", JSON.stringify([W3_MARDI]));
    const p = readProgress();
    expect(p.days).toEqual([W3_MARDI]);
    expect(p.exercises.sort()).toEqual(w3Mardi.map((slug) => exerciseId(W3_MARDI, slug)).sort());
  });

  it("stockage abîmé : repli sur une progression vide", () => {
    store.set("maestro:v1:done", "{pas du json");
    store.set("maestro:v1:done-ex", JSON.stringify({ w: 1 }));
    expect(readProgress()).toEqual(EMPTY_PROGRESS);
  });

  it("stockage bloqué : lecture vide, écriture sans erreur", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(readProgress()).toEqual(EMPTY_PROGRESS);
    expect(() => writeProgress(toggleDay(EMPTY_PROGRESS, W3_MARDI))).not.toThrow();
  });
});
