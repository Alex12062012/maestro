import { afterEach, describe, expect, it, vi } from "vitest";
import { load, remove, save } from "./storage";

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => {
      data.delete(k);
    },
    setItem: (k, v) => {
      data.set(k, String(v));
    },
  };
}

function throwingStorage(): Storage {
  const fail = () => {
    throw new DOMException("refusé", "SecurityError");
  };
  return {
    length: 0,
    clear: fail,
    getItem: fail,
    key: fail,
    removeItem: fail,
    setItem: fail,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("storage avec localStorage disponible", () => {
  it("relit ce qui a été sauvé, sous une clé préfixée", () => {
    const mem = memoryStorage();
    vi.stubGlobal("localStorage", mem);

    save("a", { x: 1 });

    expect(load("a", null)).toEqual({ x: 1 });
    expect(mem.getItem("maestro:v1:a")).toBe('{"x":1}');
  });

  it("renvoie le fallback pour une clé absente", () => {
    vi.stubGlobal("localStorage", memoryStorage());
    expect(load("absente", 7)).toBe(7);
  });

  it("renvoie le fallback si la valeur n'est pas du JSON", () => {
    const mem = memoryStorage();
    mem.setItem("maestro:v1:a", "{pas du json");
    vi.stubGlobal("localStorage", mem);

    expect(load("a", 7)).toBe(7);
  });

  it("remove efface la clé", () => {
    vi.stubGlobal("localStorage", memoryStorage());
    save("a", 1);
    remove("a");
    expect(load("a", 7)).toBe(7);
  });
});

describe("storage avec localStorage bloqué", () => {
  it("getItem/setItem qui lancent : fallback, et rien ne lance", () => {
    vi.stubGlobal("localStorage", throwingStorage());

    expect(load("a", 7)).toBe(7);
    expect(() => save("a", { x: 1 })).not.toThrow();
    expect(() => remove("a")).not.toThrow();
  });

  it("quota dépassé à l'écriture : save ne lance pas", () => {
    const mem = memoryStorage();
    mem.setItem = () => {
      throw new DOMException("plein", "QuotaExceededError");
    };
    vi.stubGlobal("localStorage", mem);

    expect(() => save("a", "x".repeat(10))).not.toThrow();
  });

  it("localStorage absent (rendu serveur) : même comportement", () => {
    vi.stubGlobal("localStorage", undefined);

    expect(load("a", 7)).toBe(7);
    expect(() => save("a", { x: 1 })).not.toThrow();
    expect(() => remove("a")).not.toThrow();
  });

  it("accès à localStorage qui lance (Safari strict) : même comportement", () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("refusé", "SecurityError");
      },
    });

    try {
      expect(load("a", 7)).toBe(7);
      expect(() => save("a", { x: 1 })).not.toThrow();
      expect(() => remove("a")).not.toThrow();
    } finally {
      if (original) Object.defineProperty(globalThis, "localStorage", original);
      else Reflect.deleteProperty(globalThis, "localStorage");
    }
  });
});
