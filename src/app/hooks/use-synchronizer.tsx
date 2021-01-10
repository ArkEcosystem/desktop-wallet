import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { useConfiguration, useEnvironmentContext } from "app/contexts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { restoreProfilePassword } from "utils/migrate-fixtures";

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

const __DEMO__ = process.env.REACT_APP_BUILD_MODE === "demo";

export const useSynchronizer = (jobs: Job[]) => {
	const timers = useRef<number[]>([]);
	// const { persist } = useEnvironmentContext();

	const run = useCallback(async (callback: Callback) => {
		await callback();
		// await persist();
	}, []);

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

	const runAll = useCallback(() => Promise.allSettled(jobs.map((job) => run(job.callback))), [run, jobs]);

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
	}, [env, notifyForUpdates]);

	return useSynchronizer(jobs);
};

const useProfileWatcher = () => {
	const { env } = useEnvironmentContext();
	const location = useLocation();
	const pathname = (location as any).location?.pathname || location.pathname;
	const match = useMemo(() => matchPath(pathname, { path: "/profiles/:profileId" }), [pathname]);
	const profileId = (match?.params as any)?.profileId;
	const allProfilesCount = env.profiles().count();

	return useMemo(() => {
		if (!profileId || env.profiles().count() === 0) return;
		let response: Profile | undefined;

		try {
			response = env.profiles().findById(profileId);
		} catch (e) {
			// Not a valid profile id. Ignore.
		}

		return response;
	}, [profileId, env, allProfilesCount]); // eslint-disable-line react-hooks/exhaustive-deps
};

export const useProfileSynchronizer = () => {
	const { env, persist } = useEnvironmentContext();
	const { notifications } = useNotifications();
	const profile = useProfileWatcher();
	const [restoredProfiles, setRestoredProfiles] = useState<String[]>([]);
	const { setConfiguration } = useConfiguration();

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
	}, [env, profile, walletsCount, notifications]); // eslint-disable-line react-hooks/exhaustive-deps

	const { start, runAll } = useSynchronizer(jobs);

	useEffect(() => {
		const shouldRestore = (profile?: Profile) => {
			if (!profile || !__DEMO__) return false;

			return !restoredProfiles.includes(profile.id?.());
		};

		const syncProfile = async (profile?: Profile) => {
			if (profile && shouldRestore(profile)) {
				setRestoredProfiles([...restoredProfiles, profile.id()]);

				setConfiguration({ profileIsSyncing: true });

				// Perform restore to make migrated wallets available in profile.wallets()
				await profile.restore();
				restoreProfilePassword(profile);
				await persist();

				setConfiguration({ profileIsSyncing: false });
			}

			start();
			runAll();
		};

		syncProfile(profile);
	}, [jobs, profile, runAll, start, restoredProfiles, persist, setConfiguration]);
};
