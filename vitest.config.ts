import { defineConfig } from "vitest/config";

export default defineConfig({
  // Résout l'alias `@/*` déclaré dans tsconfig.json.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
