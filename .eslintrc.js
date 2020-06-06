module.exports = {
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		project: "./tsconfig.json",
		parser: "@typescript-eslint/parser",
		sourceType: "module",
		projectFolderIgnoreList: ["node_modules", "public"],
	},
	env: {
		browser: true,
		node: true,
	},
	plugins: ["@typescript-eslint", "prettier", "testing-library"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
		"plugin:react/recommended",
		"prettier/@typescript-eslint",
		"plugin:testing-library/react",
	],
	rules: {
		"prefer-const": [
			"error",
			{
				destructuring: "all",
			},
		],
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-floating-promises": "off",
		"@typescript-eslint/no-misused-promises": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/no-unsafe-return": "off",
		"@typescript-eslint/prefer-regexp-exec": "off",
		"@typescript-eslint/restrict-template-expressions": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"prettier/prettier": [
			"off",
			{
				endOfLine: "auto",
			},
		],
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
