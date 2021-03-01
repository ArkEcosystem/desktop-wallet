import * as path from "path";
import { ClientFunction, RequestMock } from "testcafe";

export const getPageURL = () => path.resolve("build/index.html");

export const getLocation = ClientFunction(() => document.location.href);

export const scrollTo = ClientFunction((top: number, left = 0, behavior = "auto") => {
	window.scrollTo({ top, left, behavior });
});

export const scrollToTop = ClientFunction(() => window.scrollTo({ top: 0 }));
export const scrollToBottom = ClientFunction(() => window.scrollTo({ top: document.body.scrollHeight }));

export const BASEURL = "https://dwallets.ark.io/api/";

const pluginNames: string[] = ["@dated/transaction-export-plugin", "@dated/delegate-calculator-plugin"];
const repositoryNames: string[] = [""];

const knownWallets: any[] = [];

const walletMocks = () => {
	const addresses = [
		"D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
		"D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
		"D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
		"D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
		"DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P",
		"DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T",
		"D9YiyRYMBS2ofzqkufjrkB9nHofWgJLM7f",
		"DKrACQw7ytoU2gjppy3qKeE2dQhZjfXYqu",
		"DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS",
		"D68sFcspN2LVd9HZpf98c7bXkNimK3M6AZ",
		"DJXg9Vqg2tofRNrMAvMzhZTkegu8QyyNQq",
	];

	const publicKeys = ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"];

	return [...addresses, ...publicKeys].map((identifier: string) =>
		mockRequest(`https://dwallets.ark.io/api/wallets/${identifier}`, `coins/ark/devnet/wallets/${identifier}`),
	);
};

const publicKeys = [
	"03af2feb4fc97301e16d6a877d5b135417e8f284d40fac0f84c09ca37f82886c51",
	"03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
	"02e012f0a7cac12a74bdc17d844cbc9f637177b470019c32a53cef94c7a56e2ea9",
	"029511e2507b6c70d617492308a4b34bb1bdaabb1c260a8c15c5805df8b6a64f11",
	"03c4d1788718e39c5de7cb718ce380c66bbe2ac5a0645a6ff90f0569178ab7cd6d",
];

const multisignatureMocks = () => {
	const mocks: any = [];

	for (const state of ["ready", "pending"]) {
		mocks.push(
			...publicKeys.map((identifier: string) =>
				mockRequest(`https://dmusig1.ark.io/transactions?publicKey=${identifier}&state=${state}`, []),
			),
		);
	}

	return mocks;
};

const searchAddressesMocks = () => {
	const addresses = {
		D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD: [
			{ page: 1, limit: 10 },
			{ page: 1, limit: 15 },
			{ page: 2, limit: 15 },
			{ page: 1, limit: 30 },
		],
		DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS: [
			{ page: 1, limit: 10 },
			{ page: 1, limit: 15 },
			{ page: 1, limit: 30 },
		],
		DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P: [
			{ page: 1, limit: 10 },
			{ page: 1, limit: 15 },
			{ page: 1, limit: 30 },
		],
		D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb: [
			{ page: 1, limit: 10 },
			{ page: 1, limit: 15 },
			{ page: 1, limit: 30 },
		],
		DJXg9Vqg2tofRNrMAvMzhZTkegu8QyyNQq: [
			{ page: 1, limit: 10 },
			{ page: 1, limit: 15 },
			{ page: 1, limit: 30 },
		],
	};

	const mocks: any = [];

	for (const [address, configs] of Object.entries(addresses)) {
		mocks.push(
			...configs.map(({ page, limit }: { page: number; limit: number }) =>
				mockRequest(
					(request: any) =>
						request.url ===
							`https://dwallets.ark.io/api/transactions?page=${page}&limit=${limit}&address=${address}` ||
						request.url === `https://dwallets.ark.io/api/transactions?limit=${limit}&address=${address}`,
					`coins/ark/devnet/transactions/byAddress/${address}-${page}-${limit}`,
				),
			),
		);
	}

	return mocks;
};

export const mockRequest = (url: string | object | Function, fixture: string | object | Function, statusCode = 200) =>
	RequestMock()
		.onRequestTo(url)
		.respond(
			(req: any, res: any) => {
				const getBody = () => {
					if (typeof fixture === "string") {
						return require(`../tests/fixtures/${fixture}.json`);
					}

					if (typeof fixture === "function") {
						return fixture(req);
					}

					return fixture;
				};

				return res.setBody(getBody());
			},
			statusCode,
			{
				"access-control-allow-origin": "*",
				"access-control-allow-headers": "Content-Type",
			},
		);

export const requestMocks = {
	configuration: [
		mockRequest("https://dwallets.ark.io/api/blockchain", "coins/ark/devnet/blockchain"),
		mockRequest("https://dwallets.ark.io/api/node/configuration", "coins/ark/devnet/configuration"),
		mockRequest("https://dwallets.ark.io/api/node/configuration/crypto", "coins/ark/devnet/cryptoConfiguration"),
		mockRequest("https://dwallets.ark.io/api/node/fees", "coins/ark/devnet/node-fees"),
		mockRequest("https://dwallets.ark.io/api/node/syncing", "coins/ark/devnet/syncing"),
		mockRequest("https://dwallets.ark.io/api/peers", "coins/ark/devnet/peers"),
	],
	delegates: [
		mockRequest("https://dwallets.ark.io/api/delegates", "coins/ark/devnet/delegates"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=1", "coins/ark/devnet/delegates"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=2", "coins/ark/devnet/delegates"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=3", "coins/ark/devnet/delegates"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=4", "coins/ark/devnet/delegates"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=5", "coins/ark/devnet/delegates"),
	],
	multisignature: [...multisignatureMocks()],
	transactions: [
		mockRequest("https://dwallets.ark.io/api/transactions/fees", "coins/ark/devnet/transaction-fees"),
		mockRequest("https://dwallets.ark.io/api/transactions?limit=10", "coins/ark/devnet/transactions"),
		mockRequest("https://dwallets.ark.io/api/transactions?limit=20", "coins/ark/devnet/transactions"),
		mockRequest(
			"https://dwallets.ark.io/api/transactions?limit=30&address=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD%2CD5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
			"coins/ark/devnet/transactions",
		),
		mockRequest(
			"https://dwallets.ark.io/api/transactions?limit=30&address=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD%2CD5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb%2CDH4Xyyt5zPqM9KwUkevUZPbzM3KjjW8fp5",
			"coins/ark/devnet/transactions",
		),
		// unconfirmed transactions list before sending single or multiPayment transaction
		mockRequest(
			"https://dwallets.ark.io/api/transactions?page=1&limit=20&senderId=DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS",
			{ meta: {}, data: [] },
		),

		...searchAddressesMocks(),
	],
	wallets: [
		mockRequest(
			"https://dwallets.ark.io/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD/votes",
			"coins/ark/devnet/votes",
		),

		...walletMocks(),
	],
	plugins: [
		mockRequest(
			"https://raw.githubusercontent.com/ArkEcosystem/common/master/desktop-wallet/whitelist.json",
			"plugins/whitelist",
		),
		mockRequest(
			"https://raw.github.com/dated/transaction-export-plugin/master/package.json",
			"plugins/registry/@dated/transaction-export-plugin",
		),
		mockRequest(
			"https://raw.github.com/dated/delegate-calculator-plugin/master/package.json",
			"plugins/registry/@dated/delegate-calculator-plugin",
		),
		mockRequest(/https:\/\/registry\.npmjs\.com\/-\/v1\/search.*from=0.*/, "plugins/registry-response"),
		mockRequest(/https:\/\/registry\.npmjs\.com\/-\/v1\/search.*from=250.*/, () => ({})),
		mockRequest(
			"https://raw.githubusercontent.com/dated/transaction-export-plugin/master/logo.png",
			() => "/assets/background.png",
		),
		mockRequest(
			"https://raw.githubusercontent.com/dated/transaction-export-plugin/master/images/preview-1.png",
			() => "/assets/background.png",
		),
		mockRequest(
			"https://raw.githubusercontent.com/dated/transaction-export-plugin/master/images/preview-2.png",
			() => "/assets/background.png",
		),
		mockRequest(
			"https://raw.githubusercontent.com/dated/transaction-export-plugin/master/images/preview-3.png",
			() => "/assets/background.png",
		),
		...pluginNames.map((pluginName) =>
			mockRequest(`https://registry.npmjs.com/${pluginName}`, `plugins/registry/${pluginName}`),
		),
		...pluginNames.map((pluginName) =>
			mockRequest(
				new RegExp(`https://api.npmjs.org/downloads.*/${pluginNames}`),
				`plugins/downloads/${pluginName}`,
			),
		),
	],
	other: [
		mockRequest(
			"https://raw.githubusercontent.com/ArkEcosystem/common/master/devnet/known-wallets-extended.json",
			knownWallets,
		),
	],
};

export const createFixture = (name: string, preHooks: RequestMock[] = [], postHooks: RequestMock[] = []) =>
	fixture(name)
		.page(getPageURL())
		.requestHooks(
			...preHooks,
			...requestMocks.configuration,
			...requestMocks.delegates,
			...requestMocks.multisignature,
			...requestMocks.transactions,
			...requestMocks.wallets,
			...requestMocks.plugins,
			...requestMocks.other,
			...postHooks,
			mockRequest(/^https?:\/\//, (request: any) => {
				console.log(request.url);
				const mock: { url: string; method: string; body?: string } = {
					url: request.url,
					method: request.method,
				};

				if (request.method === "OPTIONS") {
					return request;
				}

				if (request.method === "POST") {
					mock.body = request.body.toString();
				}

				throw new Error(`\n-- Missing mock:\n${JSON.stringify(mock, undefined, 4)}`);
			}),
		);
