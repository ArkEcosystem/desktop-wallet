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

const walletMocks = () => {
	const addresses = [
		"D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
		"D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
		"D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
		"D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
		"D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
		"DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P",
		"DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T",
		"D9YiyRYMBS2ofzqkufjrkB9nHofWgJLM7f",
		"DKrACQw7ytoU2gjppy3qKeE2dQhZjfXYqu",
		"DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS",
		"D68sFcspN2LVd9HZpf98c7bXkNimK3M6AZ",
	];

	const publicKeys = ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"];

	return [...addresses, ...publicKeys].map((identifier: string) =>
		mockRequest(`https://dwallets.ark.io/api/wallets/${identifier}`, `coins/ark/devnet/wallets/${identifier}`),
	);
};

const entityRegistrationMocks = () => {
	const publicKeys = [
		"03af2feb4fc97301e16d6a877d5b135417e8f284d40fac0f84c09ca37f82886c51",
		"03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
		"02e012f0a7cac12a74bdc17d844cbc9f637177b470019c32a53cef94c7a56e2ea9",
	];

	const types = {
		0: "business",
		3: "plugin",
		4: "delegate",
	};

	const mocks: any = [];

	for (const [key, type] of Object.entries(types)) {
		mocks.push(
			...publicKeys.map((identifier: string) =>
				mockRequest(
					`https://dwallets.ark.io/api/transactions?senderPublicKey=${identifier}&type=6&typeGroup=2&asset.type=${key}&asset.action=0`,
					`coins/ark/devnet/transactions/${type}-registrations`,
				),
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
		],
		DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS: [{ page: 1, limit: 15 }],
		DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P: [{ page: 1, limit: 15 }],
		D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb: [
			{ page: 1, limit: 10 },
			{ page: 1, limit: 15 },
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

const businessRegistrations = () => {
	const transactionIds = [
		"df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da",
		"075c83e721e910d24ab98fb4864789efaae5d29f50cd08a11145cd43f3dd4c4a",
		"03e44853b26f450d5aba78e3fad390faa8ae9aa6995b1fa80b8d191516b52f1e",
	];

	return transactionIds.map((id: string) =>
		mockRequest(
			`https://dwallets.ark.io/api/transactions/${id}`,
			"coins/ark/devnet/transactions/business-registration",
		),
	);
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
			},
		);

export const requestMocks = {
	configuration: [
		mockRequest("https://dwallets.ark.io/api/node/configuration", "coins/ark/devnet/configuration"),
		mockRequest("https://dwallets.ark.io/api/node/configuration/crypto", "coins/ark/devnet/cryptoConfiguration"),
		mockRequest("https://dwallets.ark.io/api/node/fees?days=30", "coins/ark/devnet/node-fees"),
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
	transactions: [
		mockRequest("https://dwallets.ark.io/api/transactions/fees", "coins/ark/devnet/transaction-fees"),
		mockRequest("https://dwallets.ark.io/api/transactions?limit=10", "coins/ark/devnet/transactions"),
		mockRequest("https://dwallets.ark.io/api/transactions?limit=20", "coins/ark/devnet/transactions"),

		...businessRegistrations(),

		...entityRegistrationMocks(),

		...searchAddressesMocks(),
	],
	wallets: [
		mockRequest(
			"https://dwallets.ark.io/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD/votes",
			"coins/ark/devnet/votes",
		),

		...walletMocks(),
	],
};

export const createFixture = (name: string, preHooks: RequestMock[] = [], postHooks: RequestMock[] = []) =>
	fixture(name)
		.page(getPageURL())
		.requestHooks(
			...preHooks,
			...requestMocks.configuration,
			...requestMocks.delegates,
			...requestMocks.transactions,
			...requestMocks.wallets,
			...postHooks,
			mockRequest(
				(request: any) => request.url.startsWith(BASEURL),
				(request: any) => {
					const mock: { url: string; method: string; body?: string } = {
						url: request.url,
						method: request.method,
					};

					if (request.method === "POST") {
						mock.body = request.body.toString();
					}

					throw new Error(`\n-- Missing mock:\n${JSON.stringify(mock, undefined, 4)}`);
				},
			),
		);
