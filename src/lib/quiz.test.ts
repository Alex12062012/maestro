import { afterEach, describe, expect, it, vi } from "vitest";
import { PILLARS, PROFILES, QUESTIONS, type Pillar } from "@/content/quiz";
import {
  FRESH_QUIZ,
  QUIZ_KEY,
  clearQuiz,
  isComplete,
  parseQuizState,
  readQuiz,
  readQuizResult,
  resultHighlights,
  scoreQuiz,
  strongestPillar,
  writeQuiz,
  type Answer,
  type QuizResult,
} from "@/lib/quiz";

// localStorage en mémoire, même principe que src/lib/storage.test.ts.
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

afterEach(() => {
  vi.unstubAllGlobals();
});

// Réponses qui donnent `good` (1 à 5) à chaque question d'un pilier, en
// tenant compte des questions inversées.
function answersFor(levels: Record<Pillar, Answer>): Record<string, Answer> {
  return Object.fromEntries(
    QUESTIONS.map((q) => {
      const level = levels[q.pillar];
      return [q.id, (q.reversed ? 6 - level : level) as Answer];
    }),
  );
}

function allAnswers(value: Answer): Record<string, Answer> {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, value]));
}

describe("QUESTIONS", () => {
  it("12 questions, 3 par pilier, ids uniques", () => {
    expect(QUESTIONS).toHaveLength(12);
    for (const pillar of PILLARS) {
      expect(QUESTIONS.filter((q) => q.pillar === pillar)).toHaveLength(3);
    }
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(12);
  });

  it("un profil par pilier, plus maestro", () => {
    expect(Object.keys(PROFILES).sort()).toEqual(
      ["maestro", ...PILLARS].sort(),
    );
  });
});

describe("scoreQuiz", () => {
  it("5 sur les questions normales et 1 sur les inversées : 100 partout, profil maestro", () => {
    const answers = Object.fromEntries(
      QUESTIONS.map((q) => [q.id, (q.reversed ? 1 : 5) as Answer]),
    );
    expect(scoreQuiz(answers)).toEqual({
      pillars: { technique: 100, physique: 100, mental: 100, vision: 100 },
      total: 100,
      profile: "maestro",
    });
  });

  it("tout à 3 : 50 partout, profil technique (égalité)", () => {
    expect(scoreQuiz(allAnswers(3))).toEqual({
      pillars: { technique: 50, physique: 50, mental: 50, vision: 50 },
      total: 50,
      profile: "technique",
    });
  });

  it("mental le plus bas : profil mental", () => {
    const result = scoreQuiz(
      answersFor({ technique: 4, physique: 4, mental: 2, vision: 3 }),
    );
    expect(result.pillars).toEqual({
      technique: 75,
      physique: 75,
      mental: 25,
      vision: 50,
    });
    expect(result.total).toBe(56);
    expect(result.profile).toBe("mental");
  });

  it("égalité entre deux piliers bas : le premier dans l'ordre technique, physique, mental, vision", () => {
    const result = scoreQuiz(
      answersFor({ technique: 5, physique: 5, mental: 2, vision: 2 }),
    );
    expect(result.profile).toBe("mental");
  });

  it("tous les piliers à 75 : maestro ; un seul à 67 : ce pilier", () => {
    const at75 = answersFor({ technique: 4, physique: 4, mental: 4, vision: 4 });
    expect(scoreQuiz(at75).profile).toBe("maestro");

    // Une seule réponse de la vision descend d'un cran : (11 - 3) × 100 / 12 ≈ 67.
    const visionQ = QUESTIONS.find((q) => q.pillar === "vision" && !q.reversed)!;
    const result = scoreQuiz({ ...at75, [visionQ.id]: 3 });
    expect(result.pillars.vision).toBe(67);
    expect(result.profile).toBe("vision");
  });

  it("lance si une réponse manque", () => {
    const answers: Record<string, Answer> = allAnswers(3);
    delete answers[QUESTIONS[7].id];
    expect(() => scoreQuiz(answers)).toThrow();
  });

  it("lance si une réponse sort de l'échelle 1 à 5", () => {
    const answers = { ...allAnswers(3), [QUESTIONS[0].id]: 6 } as Record<string, Answer>;
    expect(() => scoreQuiz(answers)).toThrow();
  });
});

describe("strongestPillar", () => {
  it("prend le score le plus haut", () => {
    expect(
      strongestPillar({ technique: 50, physique: 83, mental: 25, vision: 58 }, "mental"),
    ).toBe("physique");
  });

  it("n'annonce jamais comme point fort le pilier à travailler, même à égalité", () => {
    expect(
      strongestPillar({ technique: 50, physique: 50, mental: 50, vision: 50 }, "technique"),
    ).toBe("physique");
  });
});

describe("parseQuizState", () => {
  const firstTwo = { [QUESTIONS[0].id]: 4, [QUESTIONS[1].id]: 2 };

  it("garde un état valide", () => {
    const state = { answers: firstTwo, current: 2 };
    expect(parseQuizState(state)).toEqual(state);
  });

  it("garde un état terminé (current = 12)", () => {
    const state = { answers: allAnswers(5), current: 12 };
    expect(parseQuizState(state)).toEqual(state);
  });

  it("garde une réponse déjà donnée plus loin que la question en cours (retour arrière)", () => {
    const state = { answers: firstTwo, current: 1 };
    expect(parseQuizState(state)).toEqual(state);
  });

  it.each([
    ["null", null],
    ["un nombre", 4],
    ["un tableau", []],
    ["answers absent", { current: 0 }],
    ["answers en tableau", { answers: [3, 4], current: 0 }],
    ["id inconnu", { answers: { inconnue: 3 }, current: 0 }],
    ["réponse hors échelle", { answers: { [QUESTIONS[0].id]: 6 }, current: 1 }],
    ["réponse décimale", { answers: { [QUESTIONS[0].id]: 2.5 }, current: 1 }],
    ["réponse en texte", { answers: { [QUESTIONS[0].id]: "3" }, current: 1 }],
    ["current négatif", { answers: {}, current: -1 }],
    ["current trop grand", { answers: allAnswers(3), current: 13 }],
    ["current décimal", { answers: firstTwo, current: 1.5 }],
    ["current en avance sur les réponses", { answers: firstTwo, current: 3 }],
  ])("repart de zéro si l'état est invalide (%s)", (_label, raw) => {
    expect(parseQuizState(raw)).toEqual(FRESH_QUIZ);
  });
});

describe("FRESH_QUIZ", () => {
  it("est figé, et c'est lui que renvoie un état invalide", () => {
    expect(Object.isFrozen(FRESH_QUIZ)).toBe(true);
    expect(Object.isFrozen(FRESH_QUIZ.answers)).toBe(true);
    expect(parseQuizState(null)).toBe(FRESH_QUIZ);
  });
});

describe("reprise et Recommencer (localStorage)", () => {
  const mid = {
    answers: { [QUESTIONS[0].id]: 4, [QUESTIONS[1].id]: 2, [QUESTIONS[2].id]: 5 },
    current: 3,
  } as const;
  const done = { answers: allAnswers(3), current: 12 };

  it("writeQuiz au milieu du test, puis readQuiz : on reprend au même endroit", () => {
    const mem = memoryStorage();
    vi.stubGlobal("localStorage", mem);

    writeQuiz({ answers: { ...mid.answers }, current: mid.current });

    expect(readQuiz()).toEqual(mid);
    expect(mem.getItem(`maestro:v1:${QUIZ_KEY}`)).not.toBeNull();
  });

  it("clearQuiz, puis readQuiz : test vierge et clé effacée", () => {
    const mem = memoryStorage();
    vi.stubGlobal("localStorage", mem);
    writeQuiz({ answers: { ...mid.answers }, current: mid.current });

    clearQuiz();

    expect(readQuiz()).toEqual(FRESH_QUIZ);
    expect(mem.getItem(`maestro:v1:${QUIZ_KEY}`)).toBeNull();
  });

  it("test fini : isComplete vrai et readQuizResult renvoie le résultat", () => {
    vi.stubGlobal("localStorage", memoryStorage());
    writeQuiz(done);

    expect(isComplete(readQuiz())).toBe(true);
    expect(readQuizResult()).toEqual(scoreQuiz(done.answers));
    expect(readQuizResult()?.profile).toBe("technique");
  });

  it("test pas fini : isComplete faux et readQuizResult renvoie null", () => {
    vi.stubGlobal("localStorage", memoryStorage());
    expect(readQuizResult()).toBeNull();

    writeQuiz({ answers: { ...mid.answers }, current: mid.current });
    expect(isComplete(readQuiz())).toBe(false);
    expect(readQuizResult()).toBeNull();
  });

  it("valeur abîmée dans le stockage : test vierge", () => {
    const mem = memoryStorage();
    mem.setItem(`maestro:v1:${QUIZ_KEY}`, JSON.stringify({ answers: { controle: 9 }, current: 7 }));
    vi.stubGlobal("localStorage", mem);

    expect(readQuiz()).toEqual(FRESH_QUIZ);
    expect(readQuizResult()).toBeNull();
  });

  it("localStorage bloqué : rien ne lance, le test repart de zéro", () => {
    const fail = () => {
      throw new DOMException("refusé", "SecurityError");
    };
    vi.stubGlobal("localStorage", {
      length: 0,
      clear: fail,
      getItem: fail,
      key: fail,
      removeItem: fail,
      setItem: fail,
    });

    expect(() => writeQuiz(done)).not.toThrow();
    expect(() => clearQuiz()).not.toThrow();
    expect(readQuiz()).toEqual(FRESH_QUIZ);
    expect(readQuizResult()).toBeNull();
  });
});

describe("resultHighlights", () => {
  const result = (pillars: Record<Pillar, number>, profile: QuizResult["profile"]): QuizResult => ({
    pillars,
    total: 0,
    profile,
  });

  it("profil de pilier : à travailler = ce pilier, point fort = le plus haut des autres", () => {
    expect(
      resultHighlights(result({ technique: 50, physique: 67, mental: 75, vision: 25 }, "vision")),
    ).toEqual({ strongest: "mental", toWork: "vision", even: false });
  });

  it("maestro : à travailler = le pilier le plus bas", () => {
    expect(
      resultHighlights(result({ technique: 100, physique: 83, mental: 75, vision: 92 }, "maestro")),
    ).toEqual({ strongest: "technique", toWork: "mental", even: false });
  });

  it("maestro à 100 partout : jamais le même pilier dans les deux blocs, égalité signalée", () => {
    const h = resultHighlights(
      result({ technique: 100, physique: 100, mental: 100, vision: 100 }, "maestro"),
    );
    expect(h.strongest).not.toBe(h.toWork);
    expect(h.even).toBe(true);
  });

  it("tout à égalité sous 75 : égalité signalée", () => {
    const h = resultHighlights(result({ technique: 25, physique: 25, mental: 25, vision: 25 }, "technique"));
    expect(h).toEqual({ strongest: "physique", toWork: "technique", even: true });
  });
});
