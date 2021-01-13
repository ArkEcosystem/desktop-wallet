import { useEnvironmentContext } from "app/contexts";
import { usePluginManagerContext } from "plugins/context";
import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

export const PluginRouterWrapper = ({ children }: { children: React.ReactNode }) => {
	const { env } = useEnvironmentContext();
	const { profileId } = useParams();
	const { pluginManager, trigger } = usePluginManagerContext();

	const profile = useMemo(() => {
		try {
			return env.profiles().findById(profileId);
		} catch {
			return;
		}
	}, [env, profileId]);

	useEffect(() => {
		const current = pluginManager.plugins().currentProfile();

		if (current === undefined && profile) {
			pluginManager.plugins().runAllEnabled(profile);
			trigger();
			return;
		}

		/* istanbul ignore else */
		if (current?.id() !== profile?.id()) {
			pluginManager.plugins().dispose();
			trigger();
		}
	}, [pluginManager, profile, trigger]);

	return <>{children}</>;
};
