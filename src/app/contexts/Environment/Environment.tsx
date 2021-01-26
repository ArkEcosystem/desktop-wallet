import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { useProfileUtils } from "app/hooks";
import React from "react";
import { useHistory } from "react-router-dom";

type Context = { env: Environment; state?: Record<string, unknown>; persist: () => Promise<void> };

type Props = {
	children: React.ReactNode;
	env: Environment;
};

export const EnvironmentContext = React.createContext<any>(undefined);

export const EnvironmentProvider = ({ children, env }: Props) => {
	const isDemo = process.env.REACT_APP_BUILD_MODE === "demo";
	const [state, setState] = React.useState<any>(undefined);

	const history = useHistory();
	const { getProfileFromUrl } = useProfileUtils(env);

	const persist = React.useCallback(async () => {
		const activeProfile = getProfileFromUrl(history?.location?.pathname);

		if (activeProfile) {
			activeProfile.save();
		}

		// e2e ci tests hang when persist is called
		if (!isDemo) {
			await env.persist();
		}

		// Force update
		setState({});
	}, [env, isDemo, getProfileFromUrl, history]);

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
