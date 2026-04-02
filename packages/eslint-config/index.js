import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/** Shared flat config for Node / library packages (not Next). */
export const baseConfig = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", ".next/**", "coverage/**"],
  },
);
