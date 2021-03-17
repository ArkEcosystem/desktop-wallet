import { usePluginManagerContext } from "plugins";
import { useMemo } from "react";

import { useSynchronizer, useUpdater } from "./";

enum Intervals {
	Long = 7200000,
}

export const useEnvSynchronizer = () => {
	const { notifyForUpdates } = useUpdater();
	const { fetchPluginPackages } = usePluginManagerContext();

	const jobs = useMemo(() => {
		const syncWalletUpdates = {
			callback: () => notifyForUpdates(),
			interval: Intervals.Long,
		};

		const syncPlugins = {
			callback: () => fetchPluginPackages(),
			interval: Intervals.Long,
		};

		return [syncWalletUpdates, syncPlugins];
	}, [notifyForUpdates, fetchPluginPackages]);

	return useSynchronizer(jobs);
};
