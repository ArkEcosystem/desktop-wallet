import React, { createContext, useState } from "react";

type Props = {
	children: React.ReactNode;
};

const AppContext = createContext({});

const AppContextProvider = ({ children }: Props) => {
	const [appState, setAppState] = useState({});

	const updateAppState = (key: string, value: any) => setAppState({ [key]: value });

	return <AppContext.Provider value={{ appState, updateAppState }}>{children}</AppContext.Provider>;
};

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
