import { describe, expect, it } from "vitest";
import { describeDiagram } from "@/components/TerrainDiagram";
import { EXERCISES, getExercise } from "@/content/exercises";

const diagramOf = (slug: string) => getExercise(slug)!.diagram!;

describe("describeDiagram", () => {
  it("compte les plots et nomme chaque type de trajet, au singulier ou au pluriel", () => {
    expect(describeDiagram(diagramOf("slalom-plots"))).toBe(
      "Schéma vu de dessus : 6 plots, le ballon, toi, 6 conduites de balle.",
    );
    expect(describeDiagram(diagramOf("crochets"))).toBe(
      "Schéma vu de dessus : 1 plot, le ballon, toi, 2 conduites de balle.",
    );
  });

  it("signale le mur, la ligne au sol et les sauts", () => {
    expect(describeDiagram(diagramOf("controle-oriente-mur"))).toBe(
      "Schéma vu de dessus, le mur en haut : 2 plots, le ballon, toi, 2 passes ou frappes, 1 conduite de balle.",
    );
    expect(describeDiagram(diagramOf("sauts-lateraux"))).toBe(
      "Schéma vu de dessus : une ligne au sol, toi, 2 sauts.",
    );
  });

  it("donne une phrase pour chaque schéma de la bibliothèque", () => {
    for (const e of EXERCISES) {
      if (!e.diagram) continue;
      expect(describeDiagram(e.diagram), e.slug).toMatch(/^Schéma vu de dessus.* : .+\.$/);
    }
  });
});
