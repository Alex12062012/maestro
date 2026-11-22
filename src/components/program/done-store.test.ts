import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Le magasin garde son état au niveau du module : on le recharge à chaque test.
async function freshStore() {
  vi.resetModules();
  return import("@/components/program/done-store");
}

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

  it("lit la progression gardée, coche et décoche en l'écrivant", async () => {
    store.set("maestro:v1:done", JSON.stringify(["w1-lundi"]));
    const { doneStore, toggleDone } = await freshStore();
    expect(doneStore.getSnapshot()).toEqual(["w1-lundi"]);
    toggleDone("w1-mardi");
    expect(doneStore.getSnapshot()).toEqual(["w1-lundi", "w1-mardi"]);
    expect(JSON.parse(store.get("maestro:v1:done")!)).toEqual(["w1-lundi", "w1-mardi"]);
    toggleDone("w1-lundi");
    expect(doneStore.getSnapshot()).toEqual(["w1-mardi"]);
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
    const { doneStore, toggleDone } = await freshStore();
    const listener = vi.fn();
    doneStore.subscribe(listener);
    expect(doneStore.getSnapshot()).toEqual([]);
    expect(() => toggleDone("w2-jeudi")).not.toThrow();
    expect(doneStore.getSnapshot()).toEqual(["w2-jeudi"]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("relit quand un autre onglet change la progression, ignore les autres clés", async () => {
    const { doneStore } = await freshStore();
    const listener = vi.fn();
    const unsubscribe = doneStore.subscribe(listener);
    expect(doneStore.getSnapshot()).toEqual([]);

    store.set("maestro:v1:done", JSON.stringify(["w5-mardi"]));
    win.dispatchEvent(Object.assign(new Event("storage"), { key: "maestro:v1:quiz" }));
    expect(listener).not.toHaveBeenCalled();
    win.dispatchEvent(Object.assign(new Event("storage"), { key: "maestro:v1:done" }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(doneStore.getSnapshot()).toEqual(["w5-mardi"]);

    unsubscribe();
    win.dispatchEvent(Object.assign(new Event("storage"), { key: "maestro:v1:done" }));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("changedThisVisit : faux pour l'état lu au chargement, vrai après un changement", async () => {
    const { doneStore, toggleDone, changedThisVisit } = await freshStore();
    expect(changedThisVisit(doneStore.getServerSnapshot())).toBe(false);
    expect(changedThisVisit(doneStore.getSnapshot())).toBe(false);
    toggleDone("w1-lundi");
    expect(changedThisVisit(doneStore.getSnapshot())).toBe(true);
  });
});
