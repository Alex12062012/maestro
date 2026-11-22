import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BENCHMARKS } from "@/content/benchmarks";
import {
  WEEK_OF,
  delta,
  parseMeasure,
  parseMeasures,
  parseWeekEntry,
  readMeasures,
  writeMeasures,
} from "@/lib/measure";

describe("BENCHMARKS", () => {
  it("les 6 tests de référence, dans l'ordre, avec leur unité et leur sens", () => {
    expect(BENCHMARKS.map((b) => [b.id, b.unit, b.better])).toEqual([
      ["jongles-droit", "reps", "higher"],
      ["jongles-gauche", "reps", "higher"],
      ["slalom", "s", "lower"],
      ["sprint-20", "s", "lower"],
      ["finition", "/10", "higher"],
      ["confiance", "/10", "higher"],
    ]);
    for (const b of BENCHMARKS) expect(b.label.trim()).not.toBe("");
  });
});

describe("parseMeasure", () => {
  it('"3,4" en secondes : 3.4 (virgule décimale acceptée)', () => {
    expect(parseMeasure("3,4", "s")).toEqual({ ok: true, value: 3.4 });
  });

  it("point décimal et espaces autour acceptés", () => {
    expect(parseMeasure(" 12.75 ", "s")).toEqual({ ok: true, value: 12.75 });
    expect(parseMeasure("18", "reps")).toEqual({ ok: true, value: 18 });
    expect(parseMeasure("0", "/10")).toEqual({ ok: true, value: 0 });
    expect(parseMeasure("10", "/10")).toEqual({ ok: true, value: 10 });
  });

  it.each(["", "   ", "-2", "abc", "3,4,5", "3..4", "1e3", "+4", "4 s"])(
    '"%s" : erreur avec un message',
    (raw) => {
      const r = parseMeasure(raw, "s");
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.trim()).not.toBe("");
    },
  );

  it('"11" en /10 : erreur', () => {
    expect(parseMeasure("11", "/10").ok).toBe(false);
  });

  it('"7,5" en /10 : erreur, la note est un nombre entier', () => {
    expect(parseMeasure("7,5", "/10").ok).toBe(false);
  });

  it('"12.5" en reps : erreur, les jongles se comptent en entiers', () => {
    expect(parseMeasure("12.5", "reps").ok).toBe(false);
    expect(parseMeasure("12,5", "reps").ok).toBe(false);
  });

  it("un temps de 0 seconde est refusé", () => {
    expect(parseMeasure("0", "s").ok).toBe(false);
    expect(parseMeasure("0,0", "s").ok).toBe(false);
  });

  it("bornes plausibles : 120 s et 10 000 jongles au plus", () => {
    expect(parseMeasure("120", "s")).toEqual({ ok: true, value: 120 });
    expect(parseMeasure("120,5", "s").ok).toBe(false);
    expect(parseMeasure("10000", "reps")).toEqual({ ok: true, value: 10000 });
    expect(parseMeasure("10001", "reps").ok).toBe(false);
  });

  it("refuse un temps qui s'arrondit à 0 et les nombres trop grands pour être lus", () => {
    expect(parseMeasure("0,001", "s").ok).toBe(false);
    expect(parseMeasure("0,01", "s")).toEqual({ ok: true, value: 0.01 });
    const huge = "1" + "0".repeat(400);
    expect(parseMeasure(huge, "s").ok).toBe(false);
    expect(parseMeasure(huge, "reps").ok).toBe(false);
    expect(parseMeasure(huge, "/10").ok).toBe(false);
  });

  it("vide, négatif et texte ont des messages différents", () => {
    const messages = ["", "-2", "abc"].map((raw) => {
      const r = parseMeasure(raw, "s");
      return r.ok ? "" : r.error;
    });
    expect(new Set(messages).size).toBe(3);
  });
});

describe("parseWeekEntry (enregistrer une semaine)", () => {
  const blank = {
    "jongles-droit": "",
    "jongles-gauche": "",
    slalom: "",
    "sprint-20": "",
    finition: "",
    confiance: "",
  };

  it("une case vide veut dire pas mesuré : la semaine s'enregistre sans elle", () => {
    expect(parseWeekEntry({ ...blank, slalom: "14,2", confiance: " 6 " })).toEqual({
      ok: true,
      values: { slalom: 14.2, confiance: 6 },
    });
  });

  it("une case remplie mais invalide bloque l'enregistrement, avec son message", () => {
    const r = parseWeekEntry({ ...blank, slalom: "abc", "sprint-20": "-2", confiance: "7" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors).sort()).toEqual(["slalom", "sprint-20"]);
      expect(r.errors.slalom.trim()).not.toBe("");
    }
  });

  it("aucune case remplie : rien à enregistrer, message général", () => {
    const r = parseWeekEntry(blank);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors).toEqual({});
      expect(r.form?.trim()).toBeTruthy();
    }
    expect(parseWeekEntry({}).ok).toBe(false);
  });

  it("virgule acceptée, 11 en /10 et 12.5 jongles refusés", () => {
    expect(parseWeekEntry({ ...blank, "sprint-20": "3,4" })).toEqual({
      ok: true,
      values: { "sprint-20": 3.4 },
    });
    expect(parseWeekEntry({ ...blank, finition: "11" }).ok).toBe(false);
    expect(parseWeekEntry({ ...blank, "jongles-droit": "12.5" }).ok).toBe(false);
  });
});

describe("WEEK_OF", () => {
  it("relie chaque relevé à sa semaine du programme", () => {
    expect(WEEK_OF).toEqual({ w1: 1, w6: 6, w12: 12 });
  });
});

describe("delta", () => {
  it("sprint 3,6 puis 3,3 : -0,3 et c'est un progrès (plus bas = mieux)", () => {
    expect(delta(3.6, 3.3, "lower")).toEqual({ value: -0.3, improved: true });
  });

  it("jongles 12 puis 30 : +18 et c'est un progrès (plus haut = mieux)", () => {
    expect(delta(12, 30, "higher")).toEqual({ value: 18, improved: true });
  });

  it("recul ou égalité : pas de progrès", () => {
    expect(delta(3.3, 3.6, "lower").improved).toBe(false);
    expect(delta(30, 12, "higher").improved).toBe(false);
    expect(delta(5, 5, "higher")).toEqual({ value: 0, improved: false });
  });

  it("pas d'erreur d'arrondi flottant", () => {
    expect(delta(0.1, 0.3, "higher").value).toBe(0.2);
    expect(delta(14.2, 13.9, "lower").value).toBe(-0.3);
  });
});

describe("parseMeasures", () => {
  it("garde les mesures valides des semaines 1, 6 et 12", () => {
    const raw = { w1: { slalom: 14.2, confiance: 6 }, w6: { slalom: 13.1 }, w12: {} };
    expect(parseMeasures(raw)).toEqual(raw);
  });

  it("écarte les semaines inconnues, les tests inconnus et les valeurs hors règles", () => {
    const raw = {
      w1: { slalom: 14.2, inconnu: 3, confiance: 11, "jongles-droit": 12.5, "sprint-20": -1 },
      w3: { slalom: 12 },
      w6: "abîmé",
      w12: { finition: "7" },
    };
    expect(parseMeasures(raw)).toEqual({ w1: { slalom: 14.2 }, w6: {}, w12: {} });
  });

  it.each([null, undefined, "x", 3, []])("valeur illisible %s : trois semaines vides", (raw) => {
    expect(parseMeasures(raw)).toEqual({ w1: {}, w6: {}, w12: {} });
  });
});

describe("readMeasures / writeMeasures", () => {
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

  it("relit ce qui a été écrit, sous la clé measures", () => {
    const m = { w1: { "sprint-20": 3.6 }, w6: { "sprint-20": 3.3 }, w12: {} };
    writeMeasures(m);
    expect(readMeasures()).toEqual(m);
    expect(store.has("maestro:v1:measures")).toBe(true);
  });

  it("stockage bloqué : trois semaines vides, aucune erreur", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(() => writeMeasures({ w1: { slalom: 12 }, w6: {}, w12: {} })).not.toThrow();
    expect(readMeasures()).toEqual({ w1: {}, w6: {}, w12: {} });
  });
});
