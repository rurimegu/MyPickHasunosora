import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

const eslintConfig = defineConfig([
  // TypeScript
  ...tseslint.configs.recommended,

  // Next.js core-web-vitals rules (ESLint 10 flat config)
  nextPlugin.configs["core-web-vitals"],

  // React hooks (flat config compatible)
  reactHooksPlugin.configs.flat["recommended-latest"],

  // JSX accessibility (flat config compatible)
  jsxA11y.flatConfigs.recommended,

  // Import: warn on anonymous default exports
  {
    plugins: { import: importPlugin },
    rules: {
      "import/no-anonymous-default-export": "warn",
    },
  },

  // Language options and resolver settings
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { sourceType: "module" },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".mts", ".cts", ".tsx", ".d.ts"],
      },
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        typescript: { alwaysTryTypes: true },
      },
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
