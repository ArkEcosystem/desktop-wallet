import { urlEncodeRootColor } from "./url-encode-root-color";

describe("urlEncodeRootColor", () => {
	Object.defineProperty(window, "getComputedStyle", {
		value: () => ({
			getPropertyValue: () => "#123456",
		}),
	});

	it("should be able to encode root color", () => {
		expect(urlEncodeRootColor("--theme-color-test")).toBe("%23123456");
	});
});
