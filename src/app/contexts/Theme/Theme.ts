import React from "react";
import { useActiveProfile } from "app/hooks";

type Theme = "light" | "dark";

type ThemeContextType = { theme: Theme, setTheme(name: Theme) => void };

type Props = {
	children: React.ReactNode,
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: Props) => {
	const [theme, setTheme] = React.useState<Theme>("light");

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => React.useContext(ThemeContext);
