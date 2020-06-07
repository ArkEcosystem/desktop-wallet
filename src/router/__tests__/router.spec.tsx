import * as router from "../index";

describe("Router", () => {
	it("should have homepage route", () => {
		expect(router.routes[0]).toMatchObject({ path: "/" });
	});
});
