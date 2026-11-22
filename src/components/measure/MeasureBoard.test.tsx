import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MeasureBoard } from "@/components/measure/MeasureBoard";
import { BENCHMARKS } from "@/content/benchmarks";

// Rendu serveur du formulaire de /suivi, tel qu'il part dans le HTML statique.
const html = renderToStaticMarkup(<MeasureBoard />);

describe("MeasureBoard : confidentialité du formulaire", () => {
  it("rend un champ par test de référence", () => {
    expect(html.match(/<input/g)).toHaveLength(BENCHMARKS.length);
  });

  it("aucun champ n'a d'attribut name : sans JavaScript, rien ne part dans l'URL", () => {
    expect(html).not.toMatch(/<(input|select|textarea|button)\b[^>]*\sname=/);
  });

  it("le formulaire n'a ni action ni method", () => {
    const form = html.match(/<form\b[^>]*>/)?.[0] ?? "";
    expect(form).not.toBe("");
    expect(form).not.toMatch(/\s(action|method)=/);
  });
});
