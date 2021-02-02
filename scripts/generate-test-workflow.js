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

const directories = [
	"app",
	"domains/contact",
	"domains/dashboard",
	"domains/error",
	"domains/exchange",
	"domains/network",
	"domains/news",
	"domains/plugin",
	"domains/profile",
	"domains/setting",
	"domains/splash",
	"domains/transaction",
	"domains/vote",
	"domains/wallet",
	"migrations",
	"plugins",
	"router",
	"utils",
];

for (const directory of directories) {
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
				run: `yarn test:coverage src/${directory} --forceExit --maxWorkers=50% --collectCoverageFrom=src/${directory}/**/*.{js,jsx,ts,tsx}`,
			},
		],
	};

	workflow.jobs[slugify(directory)] = job;
}

writeFileSync(resolve(".github/workflows/test.yml"), YAML.stringify(workflow, { indent: 4 }));
