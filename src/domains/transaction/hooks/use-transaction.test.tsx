import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import nock from "nock";
import { env, getDefaultProfileId } from "utils/testing-library";

import { useTransaction } from "./use-transaction";

describe("useTransaction", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

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
		expect(transactions.length).toBe(1);
	});
});
