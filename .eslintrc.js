module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    `eslint:recommended`,
    `plugin:@typescript-eslint/recommended`,
    `prettier`,
  ],
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    ecmaVersion: 12,
    sourceType: `module`,
  },
  plugins: [`@typescript-eslint`, `simple-import-sort`, `unused-imports`],
  rules: {
    "no-dupe-class-members": `error`,
    curly: [`error`, `all`],
    "arrow-body-style": [`error`, `always`],
    "no-unused-vars": `off`,
    "no-console": `off`,
    "@typescript-eslint/consistent-type-imports": `error`,
    "@typescript-eslint/explicit-module-boundary-types": `off`,
    "@typescript-eslint/no-namespace": `off`,
    "@typescript-eslint/no-empty-function": `off`,
    "@typescript-eslint/no-unused-vars": `off`,
    "@typescript-eslint/quotes": [`error`, `backtick`],
    "@typescript-eslint/prefer-literal-enum-member": `error`,
    "unused-imports/no-unused-imports": `error`,
    "unused-imports/no-unused-vars": [
      `off`,
      {
        vars: `all`,
        varsIgnorePattern: `^_`,
        args: `after-used`,
        argsIgnorePattern: `^_`,
      },
    ],
    "simple-import-sort/exports": `error`,
    "simple-import-sort/imports": [
      `error`,
      {
        groups: [
          // ext library & side effect imports
          [`^.+\\.s?css$`],
          [`^@/`],
          [
            `^\\./?$`,
            `^\\.(?!/?$)`,
            `^\\.\\./?$`,
            `^\\.\\.(?!/?$)`,
            `^\\.\\./\\.\\./?$`,
            `^\\.\\./\\.\\.(?!/?$)`,
            `^\\.\\./\\.\\./\\.\\./?$`,
            `^\\.\\./\\.\\./\\.\\.(?!/?$)`,
          ],
          [`^@/types`], // other that didn't fit in
          [`^`],
        ],
      },
    ],
  },
}
