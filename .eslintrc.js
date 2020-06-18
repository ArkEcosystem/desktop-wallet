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
	plugins: ["@typescript-eslint", "prettier", "testing-library", "cypress", "simple-import-sort", "unused-imports"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
		"plugin:react/recommended",
		"prettier/@typescript-eslint",
		"plugin:testing-library/react",
		"plugin:cypress/recommended",
	],
	rules: {
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-floating-promises": "off",
		"@typescript-eslint/no-misused-promises": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/no-unsafe-return": "off",
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/prefer-regexp-exec": "off",
		"@typescript-eslint/restrict-template-expressions": "off",
		"unused-imports/no-unused-imports-ts": "error",
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
		"simple-import-sort/sort": "error",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
