import { getPageURL } from "./e2e-utils";

jest.mock("testcafe", () => ({
	ClientFunction: (fn) => fn(),
}));

it("should return e2e page url", () => {
	const page = getPageURL();
	expect(page).toContain("build/index.html");
});
