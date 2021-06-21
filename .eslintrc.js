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
		"promise",
		"react-hooks",
		"react",
		"simple-import-sort",
		"sonarjs",
		"testcafe",
		"testing-library",
		"unicorn",
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
		"plugin:promise/recommended",
		"plugin:react-hooks/recommended",
		"plugin:react/recommended",
		"plugin:sonarjs/recommended",
		"plugin:testcafe/recommended",
		"plugin:testing-library/react",
		"plugin:unicorn/recommended",
		"prettier",
	],
	rules: {
		"@typescript-eslint/ban-ts-comment": "warn",
		"@typescript-eslint/ban-types": "warn",
		"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
		"@typescript-eslint/explicit-module-boundary-types": "warn",
		"@typescript-eslint/no-empty-function": "warn",
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/no-floating-promises": "warn",
		"@typescript-eslint/no-misused-promises": "warn",
		"@typescript-eslint/no-non-null-assertion": "warn",
		"@typescript-eslint/no-unsafe-assignment": "warn",
		"@typescript-eslint/no-unsafe-call": "warn",
		"@typescript-eslint/no-unsafe-member-access": "warn",
		"@typescript-eslint/no-unsafe-return": "warn",
		"@typescript-eslint/no-unused-expressions": "warn",
		"@typescript-eslint/no-unused-vars": ["error"],
		"@typescript-eslint/no-var-requires": "warn",
		"@typescript-eslint/prefer-regexp-exec": "warn",
		"@typescript-eslint/restrict-plus-operands": "warn",
		"@typescript-eslint/restrict-template-expressions": "warn",
		"@typescript-eslint/unbound-method": "warn",
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
		"max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
		"max-lines-per-function": ["warn", { max: 40, skipBlankLines: true, skipComments: true }],
		"no-unused-expressions": "off",
		"no-unused-vars": "off",
		"prefer-const": [
			"warn",
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
		"promise/param-names": "warn",
		"react-hooks/rules-of-hooks": "error",
		"react/self-closing-comp": "error",
		"sonarjs/cognitive-complexity": "warn", // @TODO: set to error and resolve issues
		"sonarjs/no-all-duplicated-branches": "warn", // @TODO: set to error and resolve issues
		"sonarjs/no-collapsible-if": "warn", // @TODO: set to error and resolve issues
		"sonarjs/no-duplicate-string": "warn", // @TODO: set to error and resolve issues
		"sonarjs/no-identical-expressions": "warn", // @TODO: set to error and resolve issues
		"sonarjs/no-identical-functions": "warn", // @TODO: set to error and resolve issues
		"sonarjs/no-redundant-jump": "warn", // @TODO: set to error and resolve issues
		"sonarjs/no-small-switch": "warn", // @TODO: set to error and resolve issues
		"sonarjs/no-use-of-empty-return-value": "warn", // @TODO: set to error and resolve issues
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
		"unicorn/consistent-destructuring": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/consistent-function-scoping": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/error-message": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/explicit-length-check": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/filename-case": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/import-style": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/no-abusive-eslint-disable": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/no-array-callback-reference": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/no-array-for-each": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/no-array-reduce": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/no-new-array": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/no-null": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/no-object-as-default-parameter": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/no-useless-undefined": "off",
		"unicorn/prefer-array-some": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/prefer-module": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/prefer-node-protocol": "off",
		"unicorn/prefer-number-properties": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/prefer-prototype-methods": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/prefer-spread": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/prefer-string-slice": "warn", // @TODO: set to error and fix resulting issues
		"unicorn/prevent-abbreviations": "error", // @TODO: set to error and fix resulting issues
		"unicorn/prevent-abbreviations": "warn", // @TODO: set to error and fix resulting issues
		"unused-imports/no-unused-imports-ts": "error",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
