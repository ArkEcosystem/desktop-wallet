import { SettingRoutes } from "domains/setting/routing";

describe("Setting routing", () => {
	it("should return setting route object", () => {
		expect(SettingRoutes[0].path).toEqual("/profiles/:profileId/settings");
		expect(SettingRoutes[0].exact).toEqual(true);
	});
});
