import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DAYS, sessionId } from "@/content/program";
import { parseDone, readDone, toggleSession, weekProgress, writeDone } from "@/lib/progress";

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
