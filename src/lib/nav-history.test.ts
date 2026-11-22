import { describe, expect, it, vi } from "vitest";
import { shouldGoBack } from "@/lib/nav-history";

const site = "https://maestro.example";

describe("shouldGoBack (bouton Retour d'une fiche)", () => {
  it("après une navigation dans le site : retour en arrière", () => {
    expect(shouldGoBack({ visits: 2, referrer: "", origin: site, historyLength: 3 })).toBe(true);
  });

  it("arrivée par un lien du site, page chargée en entier : retour en arrière", () => {
    expect(
      shouldGoBack({ visits: 1, referrer: `${site}/programme/semaine/3`, origin: site, historyLength: 2 }),
    ).toBe(true);
  });

  it("lien direct ou nouvel onglet : pas de retour, le lien vers /exercices sert", () => {
    expect(shouldGoBack({ visits: 1, referrer: "", origin: site, historyLength: 1 })).toBe(false);
    expect(shouldGoBack({ visits: 1, referrer: "", origin: site, historyLength: 4 })).toBe(false);
  });

  it("arrivée depuis un autre site : pas de retour vers lui", () => {
    expect(
      shouldGoBack({ visits: 1, referrer: "https://www.google.com/", origin: site, historyLength: 2 }),
    ).toBe(false);
  });

  it("historique vide : jamais de retour, même avec un référent du site", () => {
    expect(shouldGoBack({ visits: 2, referrer: `${site}/`, origin: site, historyLength: 1 })).toBe(false);
  });

  it("référent illisible : pas de retour", () => {
    expect(shouldGoBack({ visits: 1, referrer: "pas une url", origin: site, historyLength: 2 })).toBe(false);
  });
});

describe("recordVisit", () => {
  it("compte les changements d'adresse, pas les appels répétés sur la même page", async () => {
    vi.resetModules();
    const { recordVisit, visitCount } = await import("@/lib/nav-history");
    recordVisit("/exercices/squats");
    recordVisit("/exercices/squats");
    expect(visitCount()).toBe(1);
    recordVisit("/programme/semaine/3");
    expect(visitCount()).toBe(2);
  });
});
