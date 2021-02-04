import { DashboardRoutes } from "domains/dashboard/routing";

describe("Dashboard routing", () => {
	it("should return dashboard route object", () => {
		expect(DashboardRoutes[0].path).toEqual("/profiles/:profileId/dashboard");
		expect(DashboardRoutes[0].exact).toEqual(true);
	});
});
