import { useMemo } from "react";

import { useSynchronizer, useUpdater } from "./";

enum Intervals {
	Long = 7200000,
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
