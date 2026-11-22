import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Le magasin garde son état au niveau du module : on le recharge à chaque test.
async function freshStore() {
  vi.resetModules();
  return import("@/components/program/done-store");
}

const storageEvent = (key: string) => Object.assign(new Event("storage"), { key });

describe("done-store", () => {
  const store = new Map<string, string>();
  let win: EventTarget;

  beforeEach(() => {
    store.clear();
    win = new EventTarget();
    vi.stubGlobal("window", win);
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lit l'ancienne progression (journées seules) avec tous ses exercices cochés", async () => {
    store.set("maestro:v1:done", JSON.stringify(["w1-vendredi"]));
    const { doneStore } = await freshStore();
    expect(doneStore.getSnapshot()).toEqual({
      days: ["w1-vendredi"],
      exercises: ["w1-vendredi:respiration-4-7-8", "w1-vendredi:visualisation"],
    });
  });

  it("coche un exercice puis termine la journée, en écrivant les deux clés", async () => {
    const { doneStore, toggleExerciseDone, toggleDayDone } = await freshStore();
    toggleExerciseDone("w1-vendredi", "visualisation");
    expect(doneStore.getSnapshot()).toEqual({ days: [], exercises: ["w1-vendredi:visualisation"] });
    toggleDayDone("w1-vendredi");
    expect(doneStore.getSnapshot().days).toEqual(["w1-vendredi"]);
    expect(JSON.parse(store.get("maestro:v1:done")!)).toEqual(["w1-vendredi"]);
    expect(JSON.parse(store.get("maestro:v1:done-ex")!)).toHaveLength(2);
  });

  it("stockage bloqué : les cases marchent en mémoire, sans erreur", async () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    });
    const { doneStore, toggleDayDone } = await freshStore();
    const listener = vi.fn();
    doneStore.subscribe(listener);
    expect(doneStore.getSnapshot()).toEqual({ days: [], exercises: [] });
    expect(() => toggleDayDone("w2-jeudi")).not.toThrow();
    expect(doneStore.getSnapshot().days).toEqual(["w2-jeudi"]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("relit quand un autre onglet change done ou done-ex, ignore les autres clés", async () => {
    const { doneStore } = await freshStore();
    const listener = vi.fn();
    const unsubscribe = doneStore.subscribe(listener);
    expect(doneStore.getSnapshot().days).toEqual([]);

    store.set("maestro:v1:done-ex", JSON.stringify(["w5-mardi:sprints-courts"]));
    win.dispatchEvent(storageEvent("maestro:v1:quiz"));
    expect(listener).not.toHaveBeenCalled();
    win.dispatchEvent(storageEvent("maestro:v1:done-ex"));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(doneStore.getSnapshot().exercises).toEqual(["w5-mardi:sprints-courts"]);

    store.set("maestro:v1:done", JSON.stringify(["w5-lundi"]));
    win.dispatchEvent(storageEvent("maestro:v1:done"));
    expect(doneStore.getSnapshot().days).toEqual(["w5-lundi"]);

    unsubscribe();
    win.dispatchEvent(storageEvent("maestro:v1:done"));
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("changedThisVisit : faux pour l'état lu au chargement, vrai après un changement", async () => {
    const { doneStore, toggleExerciseDone, changedThisVisit } = await freshStore();
    expect(changedThisVisit(doneStore.getServerSnapshot())).toBe(false);
    expect(changedThisVisit(doneStore.getSnapshot())).toBe(false);
    // Exercice hors séance (pas de squats le lundi 1) : rien ne change.
    toggleExerciseDone("w1-lundi", "squats");
    expect(changedThisVisit(doneStore.getSnapshot())).toBe(false);
    toggleExerciseDone("w1-lundi", "gainage-planche");
    expect(changedThisVisit(doneStore.getSnapshot())).toBe(true);
  });
});
