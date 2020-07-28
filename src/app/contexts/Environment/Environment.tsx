import { Environment } from "@arkecosystem/platform-sdk-profiles";
import React from "react";

type Context = { env: Environment; state?: Record<string, unknown>; persist: () => Promise<void> };

type Props = {
	children: React.ReactNode;
	env: Environment;
};

export const EnvironmentContext = React.createContext<any>(undefined);

export const EnvironmentProvider = ({ children, env }: Props) => {
	const [state, setState] = React.useState<any>(undefined);

	const persist = React.useCallback(async () => {
		await env.persist();
		// Force update
		setState({});
	}, [env]);

	return (
		<EnvironmentContext.Provider value={{ env, state, persist } as Context}>{children}</EnvironmentContext.Provider>
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
