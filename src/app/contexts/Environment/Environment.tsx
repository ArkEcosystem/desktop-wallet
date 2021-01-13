import { Environment } from "@arkecosystem/platform-sdk-profiles";
import React from "react";

type Context = { env: Environment; state?: Record<string, unknown>; persist: () => Promise<void> };

type Props = {
	children: React.ReactNode;
	env: Environment;
};

const __DEMO__ = process.env.REACT_APP_BUILD_MODE === "demo";
export const EnvironmentContext = React.createContext<any>(undefined);

export const EnvironmentProvider = ({ children, env }: Props) => {
	const [state, setState] = React.useState<any>(undefined);

	const persist = React.useCallback(async () => {
		// e2e ci tests hang when persist is called
		if (!__DEMO__) {
			await env.persist();
		}

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
 * const profiles = React.useMemo(() => context.env.profiles().values(), [context]);
 */

export const useEnvironmentContext = (): Context => {
	const value = React.useContext(EnvironmentContext);
	if (value === undefined) {
		throw new Error("[useEnvironment] Component not wrapped within a Provider");
	}
	return value;
};
