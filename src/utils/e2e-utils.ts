import * as path from "path";
import { ClientFunction, RequestMock } from "testcafe";

export const getPageURL = () => path.resolve("build/index.html");

export const getLocation = ClientFunction(() => document.location.href);

export const scrollTo = ClientFunction((top: number, left = 0, behavior = "auto") => {
	window.scrollTo({ top, left, behavior });
});

export const scrollToTop = ClientFunction(() => window.scrollTo({ top: 0 }));
export const scrollToBottom = ClientFunction(() => window.scrollTo({ top: document.body.scrollHeight }));

export const mockRequest = (url: string | object, fixture: string | object, statusCode = 200) =>
	RequestMock()
		.onRequestTo(url)
		.respond(typeof fixture === "string" ? require(`../tests/fixtures/${fixture}.json`) : fixture, statusCode, {
			"access-control-allow-origin": "*",
		});

export const requestMocks = {
	configuration: [
		mockRequest("https://dwallets.ark.io/api/node/configuration", "coins/ark/configuration-devnet"),
		mockRequest("https://dwallets.ark.io/api/peers", "coins/ark/peers"),
		mockRequest("https://dwallets.ark.io/api/node/configuration/crypto", "coins/ark/cryptoConfiguration"),
		mockRequest("https://dwallets.ark.io/api/node/syncing", "coins/ark/syncing"),
	],
	delegates: [
		mockRequest("https://dwallets.ark.io/api/delegates?page=1", "coins/ark/delegates-devnet"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=2", "coins/ark/delegates-devnet"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=3", "coins/ark/delegates-devnet"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=4", "coins/ark/delegates-devnet"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=5", "coins/ark/delegates-devnet"),
	],
	transactions: [
		mockRequest("https://dwallets.ark.io/api/node/fees?days=7", "coins/ark/node-fees"),
		mockRequest("https://dwallets.ark.io/api/transactions/fees", "coins/ark/transaction-fees"),
		mockRequest("https://dwallets.ark.io/api/transactions/search?limit=10", "coins/ark/transactions"),
		mockRequest(
			(request: any) =>
				request.url === "https://dwallets.ark.io/api/transactions/search" &&
				request.method === "post" &&
				request.body.toString() ===
					'{"senderPublicKey":"03af2feb4fc97301e16d6a877d5b135417e8f284d40fac0f84c09ca37f82886c51","type":6,"typeGroup":2,"asset":{"type":0,"action":0}}',
			"coins/ark/transactions/business-registrations",
		),
		mockRequest(
			(request: any) =>
				request.url === "https://dwallets.ark.io/api/transactions/search" &&
				request.method === "post" &&
				request.body.toString() ===
					'{"senderPublicKey":"03af2feb4fc97301e16d6a877d5b135417e8f284d40fac0f84c09ca37f82886c51","type":6,"typeGroup":2,"asset":{"type":3,"action":0}}',
			"coins/ark/transactions/plugin-registrations",
		),
		mockRequest(
			(request: any) =>
				request.url === "https://dwallets.ark.io/api/transactions/search" &&
				request.method === "post" &&
				request.body.toString() ===
					'{"senderPublicKey":"03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc","type":6,"typeGroup":2,"asset":{"type":0,"action":0}}',
			"coins/ark/transactions/empty-search",
		),
		mockRequest(
			(request: any) =>
				request.url === "https://dwallets.ark.io/api/transactions/search" &&
				request.method === "post" &&
				request.body.toString() ===
					'{"senderPublicKey":"03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc","type":6,"typeGroup":2,"asset":{"type":3,"action":0}}',
			"coins/ark/transactions/empty-search",
		),
	],
	wallets: [
		mockRequest(
			"https://dwallets.ark.io/api/wallets/D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
			"coins/ark/wallets/D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
		),
		mockRequest(
			"https://dwallets.ark.io/api/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
			"coins/ark/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
		),
		mockRequest(
			"https://dwallets.ark.io/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
			"coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
		),
		mockRequest(
			"https://dwallets.ark.io/api/wallets/034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
			"coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
		),
		mockRequest(
			"https://dwallets.ark.io/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			"coins/ark/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
		),
		mockRequest(
			"https://dwallets.ark.io/api/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P",
			"coins/ark/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P",
		),
		mockRequest("https://dwallets.ark.io/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD/votes", "coins/ark/votes"),
	],
};

export const createFixture = (name: string, requestHooks?: RequestMock[]) =>
	fixture(name)
		.page(getPageURL())
		.requestHooks(
			// TODO: look for other URLs that are not mocked
			...(requestHooks || [
				...requestMocks.configuration,
				...requestMocks.delegates,
				...requestMocks.transactions,
				...requestMocks.wallets,
			]),
		);
