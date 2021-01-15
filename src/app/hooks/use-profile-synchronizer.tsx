import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { useConfiguration, useEnvironmentContext } from "app/contexts";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { restoreProfilePassword } from "utils/migrate-fixtures";

import { useSynchronizer } from "./";

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

const useProfileJobs = (profile?: Profile) => {
	const { env } = useEnvironmentContext();
	// const { notifications } = useNotifications();

	const walletsCount = profile?.wallets().count();
	return useMemo(() => {
		if (!profile) return [];

		const syncDelegates = {
			callback: () => env.delegates().syncAll(),
			interval: Intervals.Long,
		};

		const syncFees = {
			callback: () => env.fees().syncAll(),
			interval: Intervals.Medium,
		};

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

		// const syncNotifications = {
		// 	callback: () => notifications.notifyReceivedTransactions({ profile }),
		// 	interval: Intervals.Short,
		// };
		//
		return [syncWallets, syncFees, syncDelegates, syncExchangeRates];
	}, [env, profile, walletsCount]); // eslint-disable-line react-hooks/exhaustive-deps
};

type ProfileSyncState = {
	status: string | null;
};

export const useProfileSyncStatus = (profile?: Profile) => {
	const { current } = useRef<ProfileSyncState>({
		status: "idle",
	});

	const isIdle = () => current.status === "idle";
	const isRestoring = () => current.status === "restoring";
	const isSyncing = () => current.status === "syncing";
	const isSynced = () => current.status === "synced";
	const isCompleted = () => current.status === "completed";

	const shouldRestore = () => {
		if (!profile || !__DEMO__) return false;

		return !isSyncing() && !isRestoring() && !isSynced() && !isCompleted();
	};

	const shouldSync = () => profile && !isSyncing() && !isRestoring() && !isSynced() && !isCompleted();
	const isSyncCompleted = () => profile && isSynced() && !isCompleted();

	return {
		isIdle,
		shouldSync,
		shouldRestore,
		isSyncCompleted,
		status: () => current.status,
		setStatus: (status: string) => (current.status = status),
	};
};

export const useProfileSynchronizer = () => {
	console.log("using profile synchronizer");
	const { persist } = useEnvironmentContext();
	const { setConfiguration, profileIsSyncing } = useConfiguration();
	const profile = useProfileWatcher();

	const { shouldRestore, shouldSync, isSyncCompleted, setStatus, status } = useProfileSyncStatus(profile);

	const jobs = useProfileJobs(profile);
	const { start, runAll } = useSynchronizer(jobs);

	useEffect(() => {
		const syncProfile = async (profile?: Profile) => {
			if (!profile) {
				return;
			}

			if (shouldRestore()) {
				setStatus("restoring");
				console.log("restoring");

				// Perform restore to make migrated wallets available in profile.wallets()
				await profile.restore();
				restoreProfilePassword(profile);
				await persist();
				console.log("restoreeeed");

				setStatus("restored");
			}

			if (shouldSync()) {
				console.log("syncing");
				setStatus("syncing");

				await runAll();

				setStatus("synced");
				console.log("synced");
			}

			if (isSyncCompleted() && profileIsSyncing) {
				setConfiguration({ profileIsSyncing: false });
				setStatus("completed");
				// console.log("completed");

				// Start background jobs after initial sync
				start();
			}
		};

		syncProfile(profile);
	}, [
		jobs,
		profile,
		runAll,
		start,
		persist,
		setConfiguration,
		isSyncCompleted,
		shouldRestore,
		shouldSync,
		setStatus,
		profileIsSyncing,
	]);

	return { profile, profileIsSyncing, status };
};
