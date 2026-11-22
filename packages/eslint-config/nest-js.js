import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * Configuração centralizada para workspaces Nest.js.
 * Habilita a sintaxe de decoradores e os globais do Node.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-typescript"],
        },
        parserOpts: {
          plugins: [["decorators", { decoratorsBeforeExport: true }]],
        },
      },
    },
    rules: {
      "turbo/no-undeclared-env-vars": ["warn", { allowList: ["^API_PORT$"] }],
    },
  },
];
