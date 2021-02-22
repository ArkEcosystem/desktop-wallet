const slugify = require("@sindresorhus/slugify");
const { writeFileSync } = require("fs");
const { resolve } = require("path");
const YAML = require("yaml");

const workflow = {
	name: "Test",
	on: {
		push: {
			branches: ["master", "develop"],
		},
		pull_request: {
			types: ["ready_for_review", "synchronize", "opened"],
		},
	},
	jobs: {},
};

const directories = {
	app: {
		branches: 100,
		functions: 100,
		lines: 100,
		statements: 100,
	},
	"domains/contact": {
		branches: 100,
		functions: 100,
		lines: 100,
		statements: 100,
	},
	"domains/dashboard": {
		branches: 100,
		functions: 88.89,
		lines: 82.87,
		statements: 83.27,
	},
	"domains/error": {
		branches: 100,
		functions: 100,
		lines: 100,
		statements: 100,
	},
	"domains/exchange": {
		branches: 100,
		functions: 100,
		lines: 97.96,
		statements: 97.96,
	},
	"domains/network": {
		branches: 100,
		functions: 100,
		lines: 100,
		statements: 100,
	},
	"domains/news": {
		branches: 100,
		functions: 84.44,
		lines: 68.31,
		statements: 69.13,
	},
	"domains/plugin": {
		branches: 100,
		functions: 100,
		lines: 100,
		statements: 100,
	},
	"domains/profile": {
		branches: 100,
		functions: 80.25,
		lines: 67.57,
		statements: 68.04,
	},
	"domains/setting": {
		branches: 100,
		functions: 93.1,
		lines: 89.56,
		statements: 89.02,
	},
	"domains/splash": {
		branches: 50,
		functions: 50,
		lines: 60,
		statements: 60,
	},
	"domains/transaction": {
		branches: 99.5,
		functions: 95.33,
		lines: 85.05,
		statements: 85.52,
	},
	"domains/vote": {
		branches: 100,
		functions: 98.77,
		lines: 95.16,
		statements: 95.47,
	},
	"domains/wallet": {
		branches: 98.09,
		functions: 83.27,
		lines: 70.49,
		statements: 71.03,
	},
	migrations: {
		branches: 100,
		functions: 100,
		lines: 100,
		statements: 100,
	},
	plugins: {
		branches: 100,
		functions: 96.34,
		lines: 97.78,
		statements: 97.97,
	},
	router: {
		branches: 100,
		functions: 100,
		lines: 100,
		statements: 100,
	},
	utils: {
		branches: 55.71,
		functions: 23.4,
		lines: 50,
		statements: 46.94,
	},
};

for (const [directory, threshold] of Object.entries(directories)) {
	const collectCoverageFrom = [
		`src/${directory}/**/*.{js,jsx,ts,tsx}`,
		"!<rootDir>/build/*",
		"!<rootDir>/dist/*",
		"!jest.setup.js",
		"!src/**/e2e/*.ts",
		"!src/**/*.e2e.ts",
		"!src/**/*.models.{js,jsx,ts,tsx}",
		"!src/**/*.stories.{js,jsx,ts,tsx}",
		"!src/**/*.styles.{js,jsx,ts,tsx}",
		"!src/electron/**/*",
		"!src/i18n/**/*",
		"!src/tests/**/*",
		"!src/tailwind.config.js",
		"!src/utils/e2e-utils.ts",
		"!src/polyfill/**/*",
	];

	const coverageThreshold = {
		[`./src/${directory}/`]: threshold,
	};

	const job = {
		"runs-on": "ubuntu-latest",
		strategy: {
			matrix: {
				"node-version": ["12.x"],
			},
		},
		steps: [
			{
				uses: "actions/checkout@v2",
				with: {
					ref: "${{ github.head_ref }}",
				},
			},
			{
				name: "Get yarn cache directory path",
				id: "yarn-cache-dir-path",
				run: 'echo "::set-output name=dir::$(yarn cache dir)"',
			},
			{
				name: "Cache node modules",
				uses: "actions/cache@v2",
				id: "yarn-cache",
				with: {
					path: "${{ steps.yarn-cache-dir-path.outputs.dir }}",
					key: "${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}",
					"restore-keys": "${{ runner.os }}-yarn-",
				},
			},
			{
				name: "Use Node.js ${{ matrix.node-version }}",
				uses: "actions/setup-node@v1",
				with: {
					"node-version": "${{ matrix.node-version }}",
				},
			},
			{
				name: "Update System",
				run: "sudo apt-get update",
			},
			{
				name: "Install (Ledger Requirements)",
				run: "sudo apt-get install libudev-dev libusb-1.0-0-dev",
			},
			{
				name: "Install (Yarn)",
				run: "yarn install --frozen-lockfile",
			},
			{
				name: "Rebuild",
				run: "npm rebuild",
			},
			{
				name: "Test",
				run: `./node_modules/react-app-rewired/bin/index.js --expose-gc test src/${directory} --forceExit --maxWorkers=50% --logHeapUsage--watchAll=false --coverage --collectCoverageFrom='${JSON.stringify(
					collectCoverageFrom,
				)}' --coverageThreshold='${JSON.stringify(coverageThreshold)}'`,
			},
		],
	};

	workflow.jobs[slugify(directory)] = job;
}

writeFileSync(resolve(".github/workflows/test.yml"), YAML.stringify(workflow, { indent: 4 }));
