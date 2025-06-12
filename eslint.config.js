import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

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
      globals: {
        ...globals.node,
        ...globals.browser,
        process: "readonly",
        console: "readonly"
      }
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
];
