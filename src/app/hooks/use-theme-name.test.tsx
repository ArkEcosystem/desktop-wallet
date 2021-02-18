import { useThemeName } from "app/hooks/use-theme-name";
import * as utils from "utils/electron-utils";

describe("useThemeName", () => {
	it("should run with shouldUseDarkColors", () => {
		utils.shouldUseDarkColors = jest.fn(() => true);

		expect(useThemeName()).toBe("dark");
	});

	it("should run without shouldUseDarkColors", () => {
		utils.shouldUseDarkColors = jest.fn();

		expect(useThemeName()).toBe("light");
	});
});
