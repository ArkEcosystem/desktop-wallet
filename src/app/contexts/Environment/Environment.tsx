import { Environment } from "@arkecosystem/platform-sdk-profiles";
import React from "react";

type Context = { env: Environment; state?: Record<string, unknown>; initialized?: boolean };

type Props = {
	children: React.ReactNode;
	env: Environment;
	state?: Record<string, unknown>;
	initialized?: boolean;
};

export const EnvironmentContext = React.createContext<any>(undefined);

export const EnvironmentProvider = ({ children, env, state, initialized }: Props) => {
	return (
		<EnvironmentContext.Provider value={{ env, state, initialized } as Context}>
			{children}
		</EnvironmentContext.Provider>
	);
};

/**
 * If you needs to react to changes in the environment state
 * use the `state` field that will be updated whenever env.persist() is called:
 *
 * const context = useEnvironmentContext();
 * const profiles = React.useMemo(() => context.env.profiles().all(), [context]);
 */

export const useEnvironmentContext = (): Context => {
	const value = React.useContext(EnvironmentContext);
	if (value === undefined) {
		throw new Error("[useEnvironment] Component not wrapped within a Provider");
	}
	return value;
};
