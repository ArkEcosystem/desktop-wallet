import { ExchangeRoutes } from "domains/exchange/routing";

describe("Dashboard routing", () => {
	it("should return exchange route object", () => {
		expect(ExchangeRoutes[0].path).toEqual("/profiles/:profileId/exchange/view");
		expect(ExchangeRoutes[0].exact).toEqual(true);
	});
});
