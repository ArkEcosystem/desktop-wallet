import { SettingRoutes } from "domains/setting/routing";

describe("Setting routing", () => {
	it("should return setting route object", () => {
		expect(SettingRoutes[0].path).toEqual("/profiles/:profileId/settings/general");
		expect(SettingRoutes[0].exact).toEqual(true);

		expect(SettingRoutes[1].path).toEqual("/profiles/:profileId/settings/password");
		expect(SettingRoutes[1].exact).toEqual(true);

		expect(SettingRoutes[2].path).toEqual("/profiles/:profileId/settings/export");
		expect(SettingRoutes[2].exact).toEqual(true);

		expect(SettingRoutes[3].path).toEqual("/profiles/:profileId/settings");
		expect(SettingRoutes[3].exact).toEqual(true);
	});
});
