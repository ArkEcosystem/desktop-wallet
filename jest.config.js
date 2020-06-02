module.exports = {
	verbose: false,
	globals: {
		__static: __dirname,
		"vue-jest": {
			hideStyleWarn: true,
		},
	},
	// Coverage
	coverageDirectory: "<rootDir>/.coverage",
	coverageReporters: ["json", "lcov", "text", "clover", "html"],
	collectCoverageFrom: ["src/renderer/**/*.{js,ts,tsx,vue}"],
	coveragePathIgnorePatterns: [
		"i18n.ts",
		"index.ts",
		"routes.ts",
		"src/renderer/app/i18n",
		"src/renderer/app/router",
		"src/renderer/app/store",
		"src/renderer/main.js",
		"src/renderer/registerComponentHooks.ts",
		"src/renderer/splashscreen.js",
		"src/renderer/support/enums",
		"stories.ts",
	],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
	// Modules
	moduleFileExtensions: ["js", "ts", "tsx", "json", "vue"],
	moduleNameMapper: {
		"^@tailwind": "<rootDir>/tailwind.config.js",
		"^@package.json$": "<rootDir>/package.json",
		"^@config/(.*)$": "<rootDir>/config/$1",
		"^@config": "<rootDir>/config/index.js",
		"^@/(.*)$": "<rootDir>/src/renderer/$1",
		"^@tests/(.*)$": "<rootDir>/__tests__/$1",
		vue$: "<rootDir>/node_modules/vue/dist/vue.common.js",
		"vee-validate/dist/rules": "babel-jest",
	},
	// Transform
	transform: {
		".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
		"^.+\\.js$": "babel-jest",
		"^.+\\.ts$": "babel-jest",
		"^.+\\.tsx?$": "ts-jest",
		"^.+\\.vue$": "vue-jest",
	},
	// Ignore Tests
	testPathIgnorePatterns: [
		"<rootDir>/__tests__/e2e",
		"<rootDir>/__tests__/unit.jest.conf.js",
		"<rootDir>/__tests__/unit/.coverage",
		"<rootDir>/__tests__/unit/__fixtures__",
		"<rootDir>/__tests__/unit/__mocks__",
		"<rootDir>/__tests__/unit/__support__",
		"<rootDir>/node_modules/(?!vee-validate/dist/rules)",
	],
	snapshotSerializers: ["jest-serializer-vue"],
	setupFilesAfterEnv: ["jest-extended", "<rootDir>/__tests__/unit/__support__/setup.js"],
	watchman: false,
};
