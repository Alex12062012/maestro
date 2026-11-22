import { describe, expect, it } from "vitest";
import { doseLines, formatNumber, pad2, unitSuffix } from "@/lib/format";
import { parseMeasure } from "@/lib/measure";

describe("pad2", () => {
  it("met les numéros sur deux chiffres", () => {
    expect([pad2(3), pad2(12)]).toEqual(["03", "12"]);
  });
});

describe("formatNumber", () => {
  it("virgule décimale, 2 décimales au plus", () => {
    expect(formatNumber(3.4)).toBe("3,4");
    expect(formatNumber(13.456)).toBe("13,46");
  });

  it("sans espace des milliers pour un champ, et la valeur se relit", () => {
    const draft = formatNumber(1250, { grouping: false });
    expect(draft).toBe("1250");
    expect(parseMeasure(draft, "reps")).toEqual({ ok: true, value: 1250 });
  });

  it("avec espace des milliers pour l'affichage", () => {
    expect(formatNumber(1250)).not.toBe("1250");
  });
});

describe("unitSuffix", () => {
  it("secondes, note sur 10, rien pour les jongles", () => {
    expect([unitSuffix("s"), unitSuffix("/10"), unitSuffix("reps")]).toEqual([" s", "/10", ""]);
  });
});

describe("doseLines", () => {
  it("une ligne par phrase, étiquette avant le deux-points", () => {
    expect(
      doseLines(
        "Semaines 1 à 3 : 3 séries de 20 contrôles. Semaines 4 à 12 : 4 séries. 1 minute de pause entre les séries.",
      ),
    ).toEqual([
      { label: "Semaines 1 à 3", value: "3 séries de 20 contrôles." },
      { label: "Semaines 4 à 12", value: "4 séries." },
      { value: "1 minute de pause entre les séries." },
    ]);
  });

  it("garde les décimales à virgule dans une phrase", () => {
    expect(doseLines("Écarte les plots à 1,5 mètre.")).toEqual([
      { value: "Écarte les plots à 1,5 mètre." },
    ]);
  });
});
