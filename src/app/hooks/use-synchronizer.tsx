import { useEnvironmentContext } from "app/contexts";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { useNotifications } from "./notifications";

type Callback = () => Promise<void | any>;

type Job = {
	callback: Callback;
	interval: number;
};

enum Intervals {
	Short = 30000,
	Medium = 60000,
	Long = 120000,
}

export const useSynchronizer = (jobs: Job[]) => {
	const timers = useRef<number[]>([]);
	const { persist } = useEnvironmentContext();

	const run = useCallback(
		async (callback: Callback) => {
			await callback();
			await persist();
		},
		[persist],
	);

	const start = useCallback(() => {
		for (const job of jobs) {
			timers.current.push(setInterval(() => run(job.callback), job.interval));
		}
	}, [run, jobs]);

	const runAll = useCallback(async () => {
		for (const job of jobs) {
			await run(job.callback);
		}
	}, [run, jobs]);

	useEffect(() => {
		const current = timers.current;
		return () => {
			for (const timer of current) {
				clearInterval(timer);
			}
		};
	}, [timers]);

	return { start, runAll };
};

export const useEnvSynchronizer = () => {
	const { env } = useEnvironmentContext();
	const { notifications } = useNotifications(env);

	const jobs = useMemo(() => {
		const syncDelegates = {
			callback: () => env.delegates().syncAll(),
			interval: Intervals.Long,
		};
		const syncFees = {
			callback: () => env.fees().syncAll(),
			interval: Intervals.Medium,
		};
		const syncExchangeRates = {
			callback: () => env.exchangeRates().syncAll(),
			interval: Intervals.Long,
		};
		const syncWallets = {
			callback: () => env.wallets().syncAll(),
			interval: Intervals.Short,
		};

		const syncNotifications = {
			callback: () => notifications.syncReceivedTransactions(),
			interval: Intervals.Short,
		};

		return [syncDelegates, syncFees, syncExchangeRates, syncWallets, syncNotifications];
	}, [env, notifications]);

	return useSynchronizer(jobs);
};
