import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { useConfiguration, useEnvironmentContext } from "app/contexts";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { restoreProfilePassword } from "utils/migrate-fixtures";

import { useNotifications } from "./notifications";
import { useSynchronizer } from "./use-synchronizer";

enum Intervals {
	Short = 30000,
	Medium = 60000,
	Long = 120000,
}

const useProfileWatcher = () => {
	const { env } = useEnvironmentContext();
	const location = useLocation();
	const pathname = (location as any).location?.pathname || location.pathname;
	const match = useMemo(() => matchPath(pathname, { path: "/profiles/:profileId" }), [pathname]);
	const profileId = (match?.params as any)?.profileId;
	const allProfilesCount = env.profiles().count();

	return useMemo(() => {
		if (!profileId) return;
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
	const { notifications } = useNotifications();

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

		const syncNotifications = {
			callback: () => notifications.notifyReceivedTransactions({ profile }),
			interval: Intervals.Short,
		};

		return [syncWallets, syncFees, syncDelegates, syncExchangeRates, syncNotifications];
	}, [env, profile, walletsCount, notifications]); // eslint-disable-line react-hooks/exhaustive-deps
};

type ProfileSyncState = {
	status: string | null;
};

export const useProfileSyncStatus = () => {
	const isDemo = process.env.REACT_APP_BUILD_MODE === "demo";
	const { current } = useRef<ProfileSyncState>({
		status: "idle",
	});

	const isIdle = () => current.status === "idle";
	const isRestoring = () => current.status === "restoring";
	const isSyncing = () => current.status === "syncing";
	const isSynced = () => current.status === "synced";
	const isCompleted = () => current.status === "completed";

	const shouldRestore = () => {
		if (!isDemo) return false;
		return !isSyncing() && !isRestoring() && !isSynced() && !isCompleted();
	};

	const shouldSync = () => !isSyncing() && !isRestoring() && !isSynced() && !isCompleted();
	const shouldMarkCompleted = () => isSynced() && !isCompleted();

	return {
		isIdle,
		shouldSync,
		shouldRestore,
		shouldMarkCompleted,
		setStatus: (status: string) => (current.status = status),
	};
};

export const useProfileSynchronizer = () => {
	const { persist } = useEnvironmentContext();
	const { setConfiguration, profileIsSyncing } = useConfiguration();
	const profile = useProfileWatcher();

	const { shouldRestore, shouldSync, shouldMarkCompleted, setStatus } = useProfileSyncStatus();

	const jobs = useProfileJobs(profile);
	const { start, runAll } = useSynchronizer(jobs);

	useEffect(() => {
		const syncProfile = async (profile?: Profile) => {
			if (!profile) {
				return;
			}

			if (shouldRestore()) {
				setStatus("restoring");

				// Perform restore to make migrated wallets available in profile.wallets()
				await profile.restore();
				restoreProfilePassword(profile);
				await persist();

				setStatus("restored");
			}

			if (shouldSync()) {
				setStatus("syncing");

				await runAll();

				setStatus("synced");
			}

			if (shouldMarkCompleted() && profileIsSyncing) {
				setStatus("completed");
				setConfiguration({ profileIsSyncing: false });

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
		shouldMarkCompleted,
		shouldRestore,
		shouldSync,
		setStatus,
		profileIsSyncing,
	]);

	return { profile, profileIsSyncing };
};
