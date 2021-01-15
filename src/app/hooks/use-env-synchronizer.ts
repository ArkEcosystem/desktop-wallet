import { useMemo } from "react";

import { useSynchronizer,useUpdater } from "./";

enum Intervals {
	Short = 30000,
	Medium = 60000,
	Long = 120000,
}

export const useEnvSynchronizer = () => {
	const { notifyForUpdates } = useUpdater();

	const jobs = useMemo(() => {
		const syncWalletUpdates = {
			callback: () => notifyForUpdates(),
			interval: Intervals.Long,
		};

		return [syncWalletUpdates];
	}, [notifyForUpdates]);

	return useSynchronizer(jobs);
};
