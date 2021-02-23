import { ProfileRoutes } from "domains/profile/routing";

describe("Profile routing", () => {
	it("should return profile route object", () => {
		expect(ProfileRoutes[0].path).toEqual("/profiles/create");
		expect(ProfileRoutes[0].exact).toEqual(true);
	});
});
