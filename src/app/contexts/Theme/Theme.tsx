import React from "react";

type Theme = "light" | "dark";

type ThemeContextType = { theme: Theme; setTheme: (name: Theme) => void };

type Props = {
	children: React.ReactNode;
};

const ThemeContext = React.createContext<any>(undefined);

export const ThemeProvider = ({ children }: Props) => {
	const [theme, setTheme] = React.useState<Theme>("light");

	return <ThemeContext.Provider value={{ theme, setTheme } as ThemeContextType}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => React.useContext(ThemeContext);
