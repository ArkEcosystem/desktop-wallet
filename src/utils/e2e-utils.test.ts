import { getPageURL } from "./e2e-utils";

it("should return e2e page url", () => {
	const page = getPageURL();
	expect(page).toContain("build/index.html");
});
