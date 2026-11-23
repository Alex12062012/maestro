import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Confidentialite from "@/app/confidentialite/page";
import MentionsLegales from "@/app/mentions-legales/page";

// Pages légales, telles qu'elles partent dans le HTML statique.
const mentions = renderToStaticMarkup(<MentionsLegales />);
const confidentialite = renderToStaticMarkup(<Confidentialite />);
const sources = readFileSync(join(process.cwd(), "public", "photos", "SOURCES.md"), "utf8");

describe("mentions légales", () => {
  it("garde visibles les champs à remplir par l'éditeur", () => {
    expect(mentions).toContain("[nom de l&#x27;éditeur]");
    expect(mentions).toContain("[contact]");
  });

  it("donne l'adresse officielle de l'hébergeur", () => {
    expect(mentions).toContain("Vercel Inc.");
    expect(mentions).toContain("440 N Barranca Avenue #4133");
    expect(mentions).toContain("Covina, CA 91723");
  });

  it("crédite chaque photo listée dans SOURCES.md, avec sa page source", () => {
    const urls = [...sources.matchAll(/https:\/\/www\.pexels\.com\/photo\/\S+?\//g)].map((m) => m[0]);
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(mentions, url).toContain(`href="${url}"`);
  });
});

describe("confidentialité", () => {
  it("décrit la mesure d'audience Vercel et renvoie à la page officielle", () => {
    expect(confidentialite).toContain("Vercel Web Analytics");
    expect(confidentialite).toContain('href="https://vercel.com/docs/analytics/privacy-policy"');
  });

  it("dit qu'il n'y a pas de cookie et comment effacer la progression", () => {
    expect(confidentialite).toContain("Le site ne dépose aucun cookie");
    expect(confidentialite).toContain("Les effacer");
  });

  it("ne parle pas de Supabase et garde le contact à remplir", () => {
    expect(confidentialite).not.toMatch(/supabase/i);
    expect(confidentialite).toContain("[contact]");
  });
});

describe("textes des pages légales", () => {
  it.each([
    ["mentions légales", mentions],
    ["confidentialité", confidentialite],
  ])("%s : aucun tiret cadratin ou demi-cadratin, aucun emoji", (_, html) => {
    expect(html).not.toMatch(/[—–]/);
    expect(html).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});
