
import { useEnvironmentContext } from "app/contexts";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";

import { useNotifications, useUpdater } from "./";

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

	const stop = useCallback(() => {
		for (const timer of timers.current) {
			clearInterval(timer);
		}
	}, []);

	const start = useCallback(() => {
		stop(); // Stop previous jobs in progress
		for (const job of jobs) {
			timers.current.push(setInterval(() => run(job.callback), job.interval));
		}
	}, [run, jobs, stop]);

	const runAll = useCallback(async () => Promise.allSettled(jobs.map((job) => run(job.callback))), [run, jobs]);

	useEffect(() => {
		const current = timers.current;
		return () => {
			for (const timer of current) {
				clearInterval(timer);
			}
		};
	}, [timers]);

	return { start, stop, runAll };
};

export const useEnvSynchronizer = () => {
	const { env } = useEnvironmentContext();
	const { notifications } = useNotifications();
	const { notifyForUpdates } = useUpdater();

	const jobs = useMemo(() => {
		const syncDelegates = {
			callback: () => env.delegates().syncAll(),
			interval: Intervals.Long,
		};

		const syncFees = {
			callback: () => env.fees().syncAll(),
			interval: Intervals.Medium,
		};

		const syncWalletUpdates = {
			callback: () => notifyForUpdates(),
			interval: Intervals.Long,
		};

		return [syncDelegates, syncFees, syncWalletUpdates];
	}, [env, notifications, notifyForUpdates]);

	return useSynchronizer(jobs);
};

const useProfileWatcher = () => {
	const { env } = useEnvironmentContext();
	const location = useLocation();
	const pathname = (location as any).location?.pathname || location.pathname;
	const match = useMemo(() => matchPath(pathname, { path: "/profiles/:profileId" }), [pathname]);
	const profileId = (match?.params as any)?.profileId;

	return useMemo(() => {
		if (!profileId || env.profiles().count() === 0) return;
		return env.profiles().findById(profileId);
	}, [profileId, env, pathname, env.profiles().count()]);
};

export const useProfileSynchronizer = () => {
	const { env } = useEnvironmentContext();
	const { notifications } = useNotifications();

	const profile = useProfileWatcher();

	const walletsCount = profile?.wallets().count();

	const jobs = useMemo(() => {
		if (!profile) return [];

		const syncExchangeRates = {
			callback: () => {
				const currencies = Object.keys(env.coins().all());
				return Promise.all(currencies.map((currency) => env.exchangeRates().syncAll(profile, currency)));
			},
			interval: Intervals.Long,
		};

		const syncWallets = {
			callback: () => env.wallets().syncByProfile(profile),
			interval: Intervals.Short,
		};

		const syncNotifications = {
			callback: () => notifications.notifyReceivedTransactions({ profile }),
			interval: Intervals.Short,
		};

		return [syncWallets, syncExchangeRates, syncNotifications];
	}, [env, profile, walletsCount]);

	const { start, runAll } = useSynchronizer(jobs);

	useEffect(() => {
		runAll();
		start();
	}, [jobs, profile, env]);
};
