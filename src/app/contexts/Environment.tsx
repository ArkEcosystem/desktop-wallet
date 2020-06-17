// Coins
import { ARK } from "@arkecosystem/platform-sdk-ark";
// Env
import { Environment } from "@arkecosystem/platform-sdk-profiles";
// Services
import { httpClient } from "app/services";
import React, { createContext } from "react";

type Props = {
	children: React.ReactNode;
};

const EnvironmentContext = createContext({});

const EnvironmentProvider = ({ children }: Props) => {
	const env: Environment = new Environment({ coins: { ARK }, httpClient, storage: "indexeddb" });

	return <EnvironmentContext.Provider value={{ env }}>{children}</EnvironmentContext.Provider>;
};

export { EnvironmentContext, EnvironmentProvider };
