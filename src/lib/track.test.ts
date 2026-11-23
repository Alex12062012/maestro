import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// L'envoi réel vers Vercel Web Analytics est remplacé par un espion.
const send = vi.hoisted(() => vi.fn());
vi.mock("@vercel/analytics", () => ({ track: send }));

import { track, trackOnce } from "@/lib/track";

const store = new Map<string, string>();

beforeEach(() => {
  send.mockReset();
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

describe("track", () => {
  it("envoie le seul nom de l'événement, sans aucune propriété", () => {
    track("test_done");
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0]).toEqual(["test_done"]);
  });

  it("ne lève jamais d'erreur quand l'envoi échoue (bloqueur de pub, script en erreur)", () => {
    send.mockImplementation(() => {
      throw new Error("bloqué");
    });
    expect(() => track("week_done")).not.toThrow();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("ne renvoie rien : rien à attendre, rien à rattraper", () => {
    expect(track("program_started")).toBeUndefined();
  });
});

describe("trackOnce", () => {
  it("n'envoie l'événement qu'une fois par navigateur pour la même clé", () => {
    trackOnce("program_started");
    trackOnce("program_started");
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0]).toEqual(["program_started"]);
  });

  it("une clé par semaine : deux semaines finies, deux envois, toujours sans propriété", () => {
    trackOnce("week_done", "week_done:1");
    trackOnce("week_done", "week_done:2");
    trackOnce("week_done", "week_done:1");
    expect(send.mock.calls).toEqual([["week_done"], ["week_done"]]);
  });

  it("localStorage bloqué : envoie quand même, sans erreur", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new DOMException("refusé", "SecurityError");
      },
      setItem: () => {
        throw new DOMException("refusé", "SecurityError");
      },
    });
    expect(() => trackOnce("program_started")).not.toThrow();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("valeur gardée illisible : repart de zéro sans erreur", () => {
    store.set("maestro:v1:sent", '{"pas":"un tableau"}');
    expect(() => trackOnce("program_started")).not.toThrow();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("envoi en erreur : ne lève pas", () => {
    send.mockImplementation(() => {
      throw new Error("bloqué");
    });
    expect(() => trackOnce("week_done", "week_done:3")).not.toThrow();
  });
});
