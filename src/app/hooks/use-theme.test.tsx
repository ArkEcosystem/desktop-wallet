import { useTheme } from "app/hooks/use-theme";
import * as utils from "utils/electron-utils";

describe("useTheme", () => {
	describe("theme", () => {
		it("should run with shouldUseDarkColors", () => {
			utils.shouldUseDarkColors = jest.fn(() => true);

			expect(useTheme().theme).toBe("dark");
		});

		it("should run without shouldUseDarkColors", () => {
			utils.shouldUseDarkColors = jest.fn();

			expect(useTheme().theme).toBe("light");
		});
	});

	describe("isDarkMode", () => {
		it("should return true if dark mode", () => {
			utils.shouldUseDarkColors = jest.fn(() => true);

			expect(useTheme().isDarkMode).toBe(true);
		});

		it("should return false if not dark mode", () => {
			utils.shouldUseDarkColors = jest.fn(() => false);

			expect(useTheme().isDarkMode).toBe(false);
		});
	});
});
