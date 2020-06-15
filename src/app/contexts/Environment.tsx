import React, { createContext } from "react";
// Env
import { Environment } from "@arkecosystem/platform-sdk-profiles";
// Coins
import { ARK } from "@arkecosystem/platform-sdk-ark";
// Services
import { httpClient } from "app/services";

type Props = {
	children: React.ReactNode;
};

console.log({ httpClient });
const EnvironmentContext = createContext({});

const EnvironmentProvider = ({ children }: Props) => {
	const env: Environment = new Environment({ coins: { ARK }, httpClient, storage: "indexeddb" });
	// console.log({ env });

	return <EnvironmentContext.Provider value={{ injected: true }}>{children}</EnvironmentContext.Provider>;
};

export { EnvironmentContext, EnvironmentProvider };
