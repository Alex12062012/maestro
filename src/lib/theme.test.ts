import { afterEach, describe, expect, it, vi } from "vitest";
import { loadTheme, parseTheme, saveTheme, THEME_SCRIPT } from "@/lib/theme";

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  };
}

// Exécute le vrai script inline avec un faux localStorage et un faux <html>.
function runScript(storage: unknown): string | undefined {
  const attrs: Record<string, string> = {};
  const document = { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } };
  new Function("localStorage", "document", THEME_SCRIPT)(storage, document);
  return attrs["data-theme"];
}

afterEach(() => vi.unstubAllGlobals());

describe("parseTheme", () => {
  it("garde dark et light, tout le reste donne dark", () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
    for (const bad of [null, undefined, "", "LIGHT", 1, {}, ["light"]]) {
      expect(parseTheme(bad)).toBe("dark");
    }
  });
});

describe("loadTheme / saveTheme", () => {
  it("sombre par défaut", () => {
    vi.stubGlobal("localStorage", memoryStorage());
    expect(loadTheme()).toBe("dark");
  });

  it("relit le choix sous maestro:v1:theme", () => {
    const mem = memoryStorage();
    vi.stubGlobal("localStorage", mem);
    saveTheme("light");
    expect(mem.getItem("maestro:v1:theme")).toBe('"light"');
    expect(loadTheme()).toBe("light");
  });

  it("valeur invalide en stockage : sombre", () => {
    const mem = memoryStorage();
    mem.setItem("maestro:v1:theme", '"violet"');
    vi.stubGlobal("localStorage", mem);
    expect(loadTheme()).toBe("dark");
  });

  it("stockage bloqué : sombre, et saveTheme ne lance pas", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(loadTheme()).toBe("dark");
    expect(() => saveTheme("light")).not.toThrow();
  });
});

describe("script inline du <head>", () => {
  it("applique light si c'est le choix enregistré", () => {
    const mem = memoryStorage();
    mem.setItem("maestro:v1:theme", '"light"');
    expect(runScript(mem)).toBe("light");
  });

  it("sombre sinon : rien, invalide, JSON cassé, stockage qui lance ou absent", () => {
    const invalid = memoryStorage();
    invalid.setItem("maestro:v1:theme", '"violet"');
    const broken = memoryStorage();
    broken.setItem("maestro:v1:theme", "{pas du json");
    const throwing = { getItem: () => { throw new Error("bloqué"); } };
    for (const s of [memoryStorage(), invalid, broken, throwing, undefined]) {
      expect(runScript(s)).toBe("dark");
    }
  });
});
