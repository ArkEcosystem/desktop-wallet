import React from "react";
import { Theme } from "types";

type ThemeContextType = { theme: Theme; setTheme: (name: Theme) => void };

type Props = {
	children: React.ReactNode;
};

const ThemeContext = React.createContext<any>(undefined);

export const ThemeProvider = ({ children }: Props) => {
	const [theme, setTheme] = React.useState<Theme>("system");

	return <ThemeContext.Provider value={{ theme, setTheme } as ThemeContextType}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => React.useContext(ThemeContext);
