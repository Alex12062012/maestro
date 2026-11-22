import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(process.cwd(), "src");

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return files(p);
    return /\.(ts|tsx)$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) ? [p] : [];
  });
}

describe("couleurs", () => {
  it("aucun composant ne code une couleur en dur (tout passe par les variables du thème)", () => {
    const offenders = files(SRC).flatMap((f) =>
      readFileSync(f, "utf8")
        .split("\n")
        .map((line, i) => ({ f, i: i + 1, line }))
        .filter(({ line }) => /#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?|oklch)\(/.test(line))
        .map(({ f, i, line }) => `${f.slice(SRC.length + 1)}:${i}: ${line.trim()}`),
    );
    expect(offenders).toEqual([]);
  });
});

// Contraste WCAG des paires clés, dans les deux thèmes, lu dans globals.css.
const css = readFileSync(join(SRC, "app", "globals.css"), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
}

const dark = block(":root");
const light = { ...dark, ...block(':root[data-theme="light"]') };

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lum = (c: number[]) =>
  c
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
// Couleur posée en opacité (ex. text-on-dark/60) sur un fond.
const mix = (fg: string, bg: string, a: number) => rgb(fg).map((v, i) => Math.round(v * a + rgb(bg)[i] * (1 - a)));
const ratio = (a: number[], b: number[]) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

describe.each([
  ["sombre", dark],
  ["clair", light],
])("contraste, thème %s", (_, t) => {
  it.each([
    ["ink / bg", t.ink, t.bg, 4.5],
    ["ink-2 / bg", t["ink-2"], t.bg, 4.5],
    ["bg / ink (bouton plein)", t.bg, t.ink, 4.5],
    ["on-dark / surface-dark", t["on-dark"], t["surface-dark"], 4.5],
    ["signal / surface-dark", t.signal, t["surface-dark"], 4.5],
    ["blue / bg (graphique)", t.blue, t.bg, 3],
    ["blue-on-dark / surface-dark (graphique)", t["blue-on-dark"], t["surface-dark"], 3],
  ])("%s", (_, fg, bg, min) => {
    expect(ratio(rgb(fg), rgb(bg))).toBeGreaterThanOrEqual(min);
  });

  it("on-dark à 60 % / surface-dark (texte secondaire des panneaux)", () => {
    const s = t["surface-dark"];
    expect(ratio(mix(t["on-dark"], s, 0.6), rgb(s))).toBeGreaterThanOrEqual(4.5);
  });
});
