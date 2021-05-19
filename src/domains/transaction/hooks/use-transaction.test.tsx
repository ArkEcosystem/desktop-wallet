import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import nock from "nock";
import { env, getDefaultProfileId } from "utils/testing-library";

import { useTransaction } from "./use-transaction";

describe("useTransaction", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;

	beforeAll(() => {
		nock.disableNetConnect();
		nock("https://dwallets.ark.io")
			.get("/api/transactions")
			.query(true)
			.reply(200, () => {
				const { meta, data } = require("tests/fixtures/coins/ark/devnet/transactions.json");
				data[0].confirmations = 1;
				return {
					meta,
					data: data.slice(0, 2),
				};
			});
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
	});

	it("should fetch wallet unconfirmed transactions", async () => {
		const { result } = renderHook(() => useTransaction());

		const transactions = await result.current.fetchWalletUnconfirmedTransactions(wallet);

		expect(Array.isArray(transactions)).toBe(true);
		expect(transactions.length).toBe(1);
	});

	it("should return an empty list if lookup fails", async () => {
		const walletSpy = jest.spyOn(wallet.transactionIndex(), "sent").mockRejectedValue(new Error());

		const { result } = renderHook(() => useTransaction());

		const transactions = await result.current.fetchWalletUnconfirmedTransactions(wallet);

		expect(Array.isArray(transactions)).toBe(true);
		expect(transactions.length).toBe(0);

		walletSpy.mockRestore();
	});
});
