import { VoteRoutes } from "domains/vote/routing";

describe("Vote routing", () => {
	it("should return vote route object", () => {
		expect(VoteRoutes[0].path).toEqual("/profiles/:profileId/votes");
		expect(VoteRoutes[0].exact).toEqual(true);

		expect(VoteRoutes[1].path).toEqual("/profiles/:profileId/wallets/:walletId/votes");
		expect(VoteRoutes[1].exact).toEqual(true);
	});
});
