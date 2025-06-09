import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["**/dist/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          "./client/tsconfig.json",
          "./server/tsconfig.json"
        ],
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module"
      },
      globals: { process: "readonly", console: "readonly" }
    },
    env: { node: true, browser: true },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
    }
  }
];
