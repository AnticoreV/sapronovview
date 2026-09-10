// @ts-check
import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**", "public/**"],
  },
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
