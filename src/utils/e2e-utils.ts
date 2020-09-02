import * as path from "path";
import { ClientFunction, RequestMock } from "testcafe";

export const getPageURL = () => path.resolve("build/index.html");

export const getLocation = ClientFunction(() => document.location.href);

export const scrollTo = ClientFunction((top: number, left = 0, behavior = "auto") => {
	window.scrollTo({ top, left, behavior });
});

export const scrollToTop = ClientFunction(() => window.scrollTo({ top: 0 }));
export const scrollToBottom = ClientFunction(() => window.scrollTo({ top: document.body.scrollHeight }));

export const mockRequest = (url: string, fixture: string, statusCode = 200) =>
	RequestMock()
		.onRequestTo(url)
		.respond(require(`../tests/fixtures/${fixture}.json`), statusCode, {
			"access-control-allow-origin": "*",
		});

export const createFixture = (name: string, requestHooks: RequestMock[] = []) =>
	fixture(name)
		.page(getPageURL())
		.requestHooks(
			...[
				mockRequest("https://dwallets.ark.io/api/node/configuration", "coins/ark/configuration-devnet"),
				mockRequest("https://dwallets.ark.io/api/peers", "coins/ark/peers"),
				mockRequest("https://dwallets.ark.io/api/node/configuration/crypto", "coins/ark/cryptoConfiguration"),
				mockRequest("https://dwallets.ark.io/api/node/syncing", "coins/ark/syncing"),
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
					"https://dwallets.ark.io/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD/votes",
					"coins/ark/votes",
				),
				mockRequest("https://dwallets.ark.io/api/delegates?page=1", "coins/ark/delegates-devnet"),
				mockRequest("https://dwallets.ark.io/api/delegates?page=2", "coins/ark/delegates-devnet"),
				mockRequest("https://dwallets.ark.io/api/delegates?page=3", "coins/ark/delegates-devnet"),
				mockRequest("https://dwallets.ark.io/api/delegates?page=4", "coins/ark/delegates-devnet"),
				mockRequest("https://dwallets.ark.io/api/node/fees?days=7", "coins/ark/node-fees"),
				mockRequest("https://dwallets.ark.io/api/transactions/fees", "coins/ark/transaction-fees"),
				mockRequest("https://dwallets.ark.io/api/transactions/search?limit=10", "coins/ark/transactions"),
				// TODO: look for other URLs that are not mocked
				...requestHooks,
			],
		);
