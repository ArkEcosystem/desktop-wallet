import { Environment } from "@arkecosystem/platform-sdk-profiles";
import React from "react";

type Context = { env: Environment; state: Record<string, unknown> };

type Props = {
	children: React.ReactNode;
	env: Environment;
	state?: Record<string, unknown>;
};

/**
 * If you needs to react to changes in the environment state
 * just don't destruct the object and pass it as dependency, eg:
 *
 * const context = useEnvironmentContext();
 * const profiles = React.useMemo(() => context.env.profiles().all(), [context]);
 *
 * Now your variable will get rerender whenever env.persist() is called.
 */

export const EnvironmentContext = React.createContext<any>(undefined);

export const EnvironmentProvider = ({ children, env, state }: Props) => {
	return <EnvironmentContext.Provider value={{ env, state } as Context}>{children}</EnvironmentContext.Provider>;
};

export const useEnvironmentContext = (): Context => {
	const value = React.useContext(EnvironmentContext);
	if (value === undefined) {
		throw new Error("[useEnvironment] Component not wrapped within a Provider");
	}
	return value;
};
