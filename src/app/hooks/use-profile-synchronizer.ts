import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { useConfiguration, useEnvironmentContext } from "app/contexts";
import { restoreProfileTestPassword } from "migrations";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";

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
		if (!profileId) {
			return;
		}
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
		if (!profile) {
			return [];
		}

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
	restored: string[];
};

export const useProfileSyncStatus = () => {
	const { profileIsRestoring, restoredProfiles, setConfiguration } = useConfiguration();
	const { current } = useRef<ProfileSyncState>({
		status: "idle",
		restored: [],
	});

	const isIdle = () => current.status === "idle";
	const isRestoring = () => profileIsRestoring || current.status === "restoring";
	const isSyncing = () => current.status === "syncing";
	const isSynced = () => current.status === "synced";
	const isCompleted = () => current.status === "completed";

	const shouldRestore = (profile: Profile) => {
		// For unit tests only. This flag prevents from running restore multiple times
		// as the profiles are all restored before all (see jest.setup)
		const isRestoredInTests = process.env.TEST_PROFILES_RESTORE_STATUS === "restored";
		if (isRestoredInTests) {
			return false;
		}

		if (profile.wasRecentlyCreated()) {
			return false;
		}

		return (
			!isSyncing() && !isRestoring() && !isSynced() && !isCompleted() && !current.restored.includes(profile.id())
		);
	};

	const shouldSync = () => !isSyncing() && !isRestoring() && !isSynced() && !isCompleted();
	const shouldMarkCompleted = () => isSynced() && !isCompleted();

	return {
		isIdle,
		shouldSync,
		status: () => current.status,
		shouldRestore,
		shouldMarkCompleted,
		setStatus: (status: string) => {
			current.status = status;
			if (status === "restoring") {
				setConfiguration({ profileIsRestoring: true });
			}
		},
		markAsRestored: (profileId: string) => {
			current.status = "restored";
			current.restored.push(profileId);
			setConfiguration({ profileIsRestoring: false, restoredProfiles: [...restoredProfiles, profileId] });
		},
	};
};

export const useProfileRestore = () => {
	const { restoredProfiles, setConfiguration } = useConfiguration();
	const { persist } = useEnvironmentContext();

	const restoreProfile = async (profile: Profile, password?: string) => {
		// For unit tests only. This flag prevents from running restore multiple times
		// as the profiles are all restored before all tests (see jest.setup)
		const isRestoredInTests = process.env.TEST_PROFILES_RESTORE_STATUS === "restored";
		if (isRestoredInTests) {
			return false;
		}

		const alreadyRestored = restoredProfiles.includes(profile.id());
		if (alreadyRestored) {
			return false;
		}

		if (profile.wasRecentlyCreated()) {
			return false;
		}

		setConfiguration({ profileIsRestoring: true });

		// When in demo mode, profiles are migrated passwordless and
		// password needs to be set again. The restore should happen
		// without password and then reset the password.
		const isDemo = process.env.REACT_APP_BUILD_MODE === "demo";
		if (isDemo) {
			await profile.restore();
			restoreProfileTestPassword(profile);
			await persist();
			setConfiguration({ profileIsRestoring: false, restoredProfiles: [...restoredProfiles, profile.id()] });
			return true;
		}

		// Reset profile normally (passworless or not)
		await profile.restore(password);
		await persist();
		setConfiguration({ profileIsRestoring: false, restoredProfiles: [...restoredProfiles, profile.id()] });
		return true;
	};

	return {
		restoreProfile,
		restoredProfiles,
	};
};

export const useProfileSynchronizer = () => {
	const isDemo = process.env.REACT_APP_BUILD_MODE === "demo";
	const { persist } = useEnvironmentContext();
	const { setConfiguration, profileIsSyncing } = useConfiguration();
	const profile = useProfileWatcher();

	const {
		shouldRestore,
		shouldSync,
		shouldMarkCompleted,
		setStatus,
		status,
		markAsRestored,
	} = useProfileSyncStatus();

	const jobs = useProfileJobs(profile);
	const { start, stop, runAll } = useSynchronizer(jobs);

	useEffect(() => {
		const clearProfileSyncStatus = () => {
			if (status() !== "completed") {
				return;
			}

			setStatus("idle");
			stop({ clearTimers: true });
			setConfiguration({ profileIsSyncing: true });
		};

		const syncProfile = async (profile?: Profile) => {
			if (!profile) {
				return clearProfileSyncStatus();
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
		markAsRestored,
		status,
		stop,
		isDemo,
	]);

	return { profile, profileIsSyncing };
};
