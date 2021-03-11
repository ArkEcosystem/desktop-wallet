import { shouldUseDarkColors } from "utils/electron-utils";

export const useTheme = () => {
	const theme = shouldUseDarkColors() ? "dark" : "light";
	const isDarkMode = theme === "dark";

	return { theme, isDarkMode };
};
