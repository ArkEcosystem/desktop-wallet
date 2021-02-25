import { NewsRoutes } from "domains/news/routing";

describe("News routing", () => {
	it("should return news route object", () => {
		expect(NewsRoutes[0].path).toEqual("/profiles/:profileId/news");
		expect(NewsRoutes[0].exact).toEqual(true);
	});
});
