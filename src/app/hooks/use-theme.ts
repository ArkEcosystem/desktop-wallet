import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Theme } from "types";
import { setThemeSource, shouldUseDarkColors } from "utils/electron-utils";

export const useTheme = () => {
	const theme = shouldUseDarkColors() ? "dark" : "light";
	const isDarkMode = theme === "dark";

	const setTheme = (theme: Theme) => {
		setThemeSource(theme);

		document.body.classList.remove(`theme-${shouldUseDarkColors() ? "light" : "dark"}`);
		document.body.classList.add(`theme-${shouldUseDarkColors() ? "dark" : "light"}`);
	};

	const setProfileTheme = (profile: Contracts.IProfile) => {
		const profileTheme = profile.settings().get<Theme>(Contracts.ProfileSetting.Theme)!;

		/* istanbul ignore else */
		if (
			shouldUseDarkColors() !== (profileTheme === "dark") ||
			!document.body.classList.contains(`theme-${theme}`)
		) {
			setTheme(profileTheme);
		}
	};

	const resetTheme = () => setTheme("system");

	return { isDarkMode, resetTheme, setProfileTheme, setTheme, theme };
};
