import { WithPluginManager } from "plugins/types";
import React, { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Properties {
	pluginId: string;
	fallback?: React.ReactNode;
}

export const LaunchRender = ({ pluginId, fallback, manager }: WithPluginManager<Properties>) => {
	const result = useMemo(() => {
		try {
			return manager.plugins().findById(pluginId)?.hooks().executeCommand("service:launch.render");
		} catch {
			/* istanbul ignore next */
			return;
		}
	}, [pluginId, manager]);

	return (
		<ErrorBoundary fallback={<>{fallback}</>}>
			<>{result || fallback}</>
		</ErrorBoundary>
	);
};
