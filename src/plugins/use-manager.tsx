import { useEnvironmentContext } from "app/contexts";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { PluginManager } from "./manager";

export const usePluginManager = () => {
	const [pluginManager] = React.useState(() => new PluginManager());
	return pluginManager;
};

export const PluginManagerWrapper = ({
	pluginManager,
	children,
}: {
	pluginManager: PluginManager;
	children: React.ReactNode;
}) => {
	const context = useEnvironmentContext();
	const { profileId } = useParams();
	const hasProfile = context.env.profiles().has(profileId);

	useEffect(() => {
		if (hasProfile) {
			pluginManager.plugins().activate();
		}
		return () => pluginManager.plugins().deactivate();
	}, [pluginManager, hasProfile]);

	return <div>{children}</div>;
};
