import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { useProfileUtils } from "app/hooks/use-profile-synchronizer";
import React from "react";
import { useHistory } from "react-router-dom";

type Context = { env: Environment; state?: Record<string, unknown>; persist: (profile?: Profile) => Promise<void> };

type Props = {
	children: React.ReactNode;
	env: Environment;
};

export const EnvironmentContext = React.createContext<any>(undefined);

export const EnvironmentProvider = ({ children, env }: Props) => {
	const __E2E__ = process.env.REACT_APP_IS_E2E;
	const [state, setState] = React.useState<any>(undefined);

	const history = useHistory();
	const { getProfileFromUrl } = useProfileUtils(env);

	const persist = React.useCallback(
		async (profile?: Profile) => {
			if (__E2E__) {
				// prevent from persisting when in e2e mode. Tests failing
				setState({});
				return;
			}

			const subject = profile || getProfileFromUrl(history?.location?.pathname);

			if (subject) {
				subject.save();
			}

			await env.persist();

			// Force update
			setState({});
		},
		[env, __E2E__, getProfileFromUrl, history],
	);

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
