module.exports = {
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		project: "./tsconfig.json",
		parser: "@typescript-eslint/parser",
		sourceType: "module",
		projectFolderIgnoreList: ["build", "coverage", "node_modules", "public"],
	},
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	plugins: [
		"@typescript-eslint",
		"jest",
		"prettier",
		"react-hooks",
		"simple-import-sort",
		"testcafe",
		"testing-library",
		"unused-imports",
	],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/errors",
		"plugin:import/typescript",
		"plugin:import/warnings",
		"plugin:jest/recommended",
		"plugin:prettier/recommended",
		"plugin:react-hooks/recommended",
		"plugin:react/recommended",
		"plugin:testcafe/recommended",
		"plugin:testing-library/react",
		"prettier",
	],
	rules: {
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-floating-promises": "off",
		"@typescript-eslint/no-misused-promises": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/no-unsafe-return": "off",
		"@typescript-eslint/no-unused-expressions": "off",
		"@typescript-eslint/no-unused-vars": ["error"],
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/prefer-regexp-exec": "off",
		"@typescript-eslint/restrict-template-expressions": "off",
		"@typescript-eslint/unbound-method": "off",
		"arrow-body-style": ["error", "as-needed"],
		curly: "error",
		"import/default": "error",
		"import/export": "warn",
		"import/exports-last": "warn",
		"import/extensions": "off",
		"import/first": "error",
		"import/group-exports": "off",
		"import/namespace": "error",
		"import/no-absolute-path": "error",
		"import/no-anonymous-default-export": "error",
		"import/no-cycle": "warn",
		"import/no-deprecated": "error",
		"import/no-duplicates": "error",
		"import/no-dynamic-require": "off",
		"import/no-extraneous-dependencies": "error",
		"import/no-mutable-exports": "error",
		"import/no-namespace": "warn",
		"import/no-restricted-paths": "error",
		"import/no-self-import": "error",
		"import/no-unresolved": "off",
		"import/no-unused-modules": "error",
		"import/no-useless-path-segments": "error",
		"import/no-webpack-loader-syntax": "error",
		"import/order": "warn",
		"jest/no-conditional-expect": "off",
		"jest/no-done-callback": "off",
		"jest/no-identical-title": "off",
		"jest/valid-expect": "off",
		"jest/valid-expect-in-promise": "off",
		"no-unused-expressions": "off",
		"no-unused-vars": "off",
		"prefer-const": [
			"error",
			{
				destructuring: "all",
			},
		],
		"prettier/prettier": [
			"off",
			{
				endOfLine: "auto",
			},
		],
		"react-hooks/exhaustive-deps": "warn",
		"react-hooks/rules-of-hooks": "error",
		"react/self-closing-comp": "error",
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error",
		"testing-library/await-async-query": "warn", // @TODO: set to error and fix
		"testing-library/await-async-utils": "warn", // @TODO: set to error and fix
		"testing-library/await-fire-event": "warn", // @TODO: set to error and fix
		"testing-library/consistent-data-testid": "off", // @TODO: https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/consistent-data-testid.md
		"testing-library/no-await-sync-events": "warn", // @TODO: set to error and fix
		"testing-library/no-await-sync-query": "warn", // @TODO: set to error and fix
		"testing-library/no-container": "warn", // @TODO: set to error and fix
		"testing-library/no-debug": "warn", // @TODO: set to error and fix
		"testing-library/no-dom-import": "warn", // @TODO: set to error and fix
		"testing-library/no-manual-cleanup": "warn", // @TODO: set to error and fix
		"testing-library/no-node-access": "warn", // @TODO: set to error and fix
		"testing-library/no-promise-in-fire-event": "warn", // @TODO: set to error and fix
		"testing-library/no-render-in-setup": "warn", // @TODO: set to error and fix
		"testing-library/no-unnecessary-act": "warn", // @TODO: set to error and fix
		"testing-library/no-wait-for-empty-callback": "warn", // @TODO: set to error and fix
		"testing-library/no-wait-for-multiple-assertions": "warn", // @TODO: set to error and fix
		"testing-library/no-wait-for-side-effects": "warn", // @TODO: set to error and fix
		"testing-library/no-wait-for-snapshot": "warn", // @TODO: set to error and fix
		"testing-library/prefer-explicit-assert": "warn", // @TODO: set to error and fix
		"testing-library/prefer-find-by": "warn", // @TODO: set to error and fix
		"testing-library/prefer-presence-queries": "warn", // @TODO: set to error and fix
		"testing-library/prefer-screen-queries": "warn", // @TODO: set to error and fix
		"testing-library/prefer-user-event": "warn", // @TODO: set to error and fix
		"testing-library/prefer-wait-for": "warn", // @TODO: set to error and fix
		"testing-library/render-result-naming-convention": "warn", // @TODO: set to error and fix
		"unused-imports/no-unused-imports-ts": "error",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
