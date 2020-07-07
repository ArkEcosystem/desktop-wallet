import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

type Props = {
	children: React.ReactNode;
};

export const EnvironmentContext = React.createContext<Environment | undefined>(undefined);

export const EnvironmentProvider = ({ children }: Props) => {
	const env = new Environment({
		coins: { ARK },
		httpClient,
		/**
		 * @TODO
		 * - use a storage with persistence (rxdb)
		 * - check why the localforage driver is randomly undefined in tests
		 */
		storage: new StubStorage(),
	});

	return <EnvironmentContext.Provider value={env}>{children}</EnvironmentContext.Provider>;
};

export const EnvironmentConsumer = EnvironmentContext.Consumer;
export const useEnvironment = () => React.useContext(EnvironmentContext);
