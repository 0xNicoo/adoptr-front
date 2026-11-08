import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Tests de lógica pura (sin React ni navegador). Ver docs/arquitectura/lineamientos.md#pruebas.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
