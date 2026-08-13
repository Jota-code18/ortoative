import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["testes/**/*.teste.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      /* A cobertura mede `lib/`, que é lógica pura. Componente visual é
         coberto pelo e2e — perseguir número em JSX leva a teste que renderiza
         e não afirma nada. */
      include: ["src/lib/**/*.ts"],
      exclude: ["src/lib/lqip.ts"],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
});
