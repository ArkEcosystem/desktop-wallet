import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React, { createContext } from "react";

type Props = {
	children: React.ReactNode;
};

export const EnvironmentContext = createContext({});

export const EnvironmentProvider = ({ children }: Props) => {
	const env: Environment = new Environment({ coins: { ARK }, httpClient, storage: "indexeddb" });

	return <EnvironmentContext.Provider value={{ env }}>{children}</EnvironmentContext.Provider>;
};

export const EnvironmentConsumer = EnvironmentContext.Consumer;
export const useEnvironment = () => React.useContext<{ env?: Environment }>(EnvironmentContext);
