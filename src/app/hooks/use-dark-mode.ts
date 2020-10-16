import { useThemeContext } from "app/contexts/Theme";
import { useMemo } from "react";

export const useDarkMode = () => {
	const { theme } = useThemeContext();

	return useMemo(() => theme === "dark", [theme]);
};
