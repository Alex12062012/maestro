import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

// Accueil, tel qu'il part dans le HTML statique.
const html = renderToStaticMarkup(<Home />);
const text = html.replace(/<[^>]+>/g, " ");

describe("accueil", () => {
  it("un seul titre h1, puis les sections dans l'ordre de la spec", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    const ids = [...html.matchAll(/<h2[^>]*id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(["reconnais", "piliers", "comment", "parents"]);
  });

  it("un seul libellé pour l'action test, et tous ses liens mènent à /test", () => {
    const labels = [...text.matchAll(/(faire|passer|commencer|lancer|démarrer) (le|ton) test/gi)].map((m) => m[0]);
    expect(labels.length).toBeGreaterThan(0);
    expect(new Set(labels)).toEqual(new Set(["Faire le test"]));
    const toTest = [...html.matchAll(/<a[^>]*href="\/test"[^>]*>([\s\S]*?)<\/a>/g)].map((m) =>
      m[1].replace(/<[^>]+>/g, "").trim(),
    );
    expect(toTest.length).toBe(labels.length);
    for (const label of toTest) expect(label).toBe("Faire le test");
  });

  it("la photo du haut se charge tout de suite (preload), les autres en différé", () => {
    const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    expect(imgs).toHaveLength(5);
    const eager = imgs.filter((i) => !/loading="lazy"/.test(i));
    expect(eager).toHaveLength(1);
    expect(eager[0]).toContain("hero-volee.jpg");
  });

  it("le bloc parents vouvoie, le reste de la page tutoie", () => {
    const parents = text.slice(text.indexOf("Pour les parents"));
    expect(parents).toMatch(/\bvotre enfant\b/);
    expect(parents).not.toMatch(/\b(tu|ton|ta|tes|toi)\b/i);
    const before = text.slice(0, text.indexOf("Pour les parents"));
    expect(before).not.toMatch(/\b(vous|votre|vos)\b/i);
  });

  it("aucun tiret cadratin ou demi-cadratin, aucun emoji", () => {
    expect(text).not.toMatch(/[—–]/);
    expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});
