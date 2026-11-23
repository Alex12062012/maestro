import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QUESTIONS } from "@/content/quiz";

// Compteur anonyme du test : on regarde seulement ce qui partirait.
const send = vi.hoisted(() => vi.fn());
vi.mock("@vercel/analytics", () => ({ track: send }));

import { FRESH_QUIZ, answerQuestion, isComplete, readQuiz, startProgram } from "@/lib/quiz";

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

describe("test_done", () => {
  it("part une seule fois, à la dernière réponse, avec son seul nom", () => {
    let state = FRESH_QUIZ;
    for (let i = 0; i < QUESTIONS.length; i++) {
      expect(send).not.toHaveBeenCalled();
      state = answerQuestion(state, 3);
    }
    expect(isComplete(state)).toBe(true);
    expect(send.mock.calls).toEqual([["test_done"]]);
  });

  it("revenir sur un test déjà fini ne renvoie rien", () => {
    let state = FRESH_QUIZ;
    for (let i = 0; i < QUESTIONS.length; i++) state = answerQuestion(state, 4);
    send.mockReset();
    const reopened = readQuiz();
    expect(isComplete(reopened)).toBe(true);
    expect(send).not.toHaveBeenCalled();
  });

  it("chaque réponse est gardée, et un envoi en erreur ne bloque pas le test", () => {
    send.mockImplementation(() => {
      throw new Error("bloqué");
    });
    let state = FRESH_QUIZ;
    for (let i = 0; i < QUESTIONS.length; i++) state = answerQuestion(state, 2);
    expect(readQuiz()).toEqual(state);
    expect(isComplete(state)).toBe(true);
  });
});

describe("program_started", () => {
  it("seul le premier clic sur Commencer le programme part", () => {
    startProgram();
    startProgram();
    expect(send.mock.calls).toEqual([["program_started"]]);
  });
});
