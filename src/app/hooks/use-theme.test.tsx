import { useTheme } from "app/hooks/use-theme";
import * as utils from "utils/electron-utils";
import electron from "electron";
import { env, getDefaultProfileId } from "utils/testing-library";

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

	describe("setTheme", () => {
		it("should set light theme", () => {
			utils.shouldUseDarkColors = jest.fn(() => true);
			expect(electron.remote.nativeTheme.themeSource).toBe("system");
			useTheme().setTheme("light");
			expect(electron.remote.nativeTheme.themeSource).toBe("light");
		});

		it("should set dark theme", () => {
			utils.shouldUseDarkColors = jest.fn(() => true);
			useTheme().setTheme("dark");
			expect(electron.remote.nativeTheme.themeSource).toBe("dark");
		});
	});

	describe("setProfileTheme", () => {
		it("should set theme from profile settings", async () => {
			const profile = env.profiles().findById(getDefaultProfileId());
			await env.profiles().restore(profile);

			utils.shouldUseDarkColors = jest.fn(() => true);
			useTheme().setTheme("dark");
			expect(electron.remote.nativeTheme.themeSource).toBe("dark");

			useTheme().setProfileTheme(profile);
			expect(electron.remote.nativeTheme.themeSource).toBe("light");
		});

		it("should not set theme from profile settings", async () => {
			const profile = env.profiles().findById(getDefaultProfileId());
			await env.profiles().restore(profile);

			utils.shouldUseDarkColors = jest.fn(() => false);
			useTheme().setTheme("dark");
			expect(electron.remote.nativeTheme.themeSource).toBe("dark");

			useTheme().setProfileTheme(profile);
			expect(electron.remote.nativeTheme.themeSource).toBe("dark");
		});
	});

	describe("resetTheme", () => {
		it("should reset theme to defaults", () => {
			utils.shouldUseDarkColors = jest.fn(() => true);
			useTheme().setTheme("dark");
			expect(electron.remote.nativeTheme.themeSource).toBe("dark");

			useTheme().resetTheme();
			expect(electron.remote.nativeTheme.themeSource).toBe("system");
		});
	});
});
