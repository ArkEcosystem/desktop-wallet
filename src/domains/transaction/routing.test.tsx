import { TransactionRoutes } from "domains/transaction/routing";

describe("Transaction routing", () => {
	it("should return transaction route object", () => {
		expect(TransactionRoutes[0].path).toEqual(
			"/profiles/:profileId/wallets/:walletId/send-registration/:registrationType",
		);
		expect(TransactionRoutes[0].exact).toEqual(true);

		expect(TransactionRoutes[1].path).toEqual("/profiles/:profileId/wallets/:walletId/send-delegate-resignation");
		expect(TransactionRoutes[1].exact).toEqual(true);

		expect(TransactionRoutes[2].path).toEqual("/profiles/:profileId/wallets/:walletId/send-transfer");
		expect(TransactionRoutes[2].exact).toEqual(true);

		expect(TransactionRoutes[3].path).toEqual("/profiles/:profileId/send-transfer");
		expect(TransactionRoutes[4].exact).toEqual(true);

		expect(TransactionRoutes[4].path).toEqual("/profiles/:profileId/wallets/:walletId/send-ipfs");
		expect(TransactionRoutes[4].exact).toEqual(true);

		expect(TransactionRoutes[5].path).toEqual("/profiles/:profileId/wallets/:walletId/send-vote");
		expect(TransactionRoutes[5].exact).toEqual(true);
	});
});
