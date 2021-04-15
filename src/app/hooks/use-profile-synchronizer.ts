import { Contracts, Helpers } from "@arkecosystem/platform-sdk-profiles";
import { useConfiguration, useEnvironmentContext } from "app/contexts";
import { useEffect, useMemo, useRef } from "react";
import { matchPath, useHistory, useLocation } from "react-router-dom";

import { useNotifications } from "./use-notifications";
import { useProfileUtils } from "./use-profile-utils";
import { useSynchronizer } from "./use-synchronizer";

enum Intervals {
	Short = 30000,
	Medium = 60000,
	Long = 120000,
}

const useProfileWatcher = () => {
	const location = useLocation();

	const { env } = useEnvironmentContext();
	const { getProfileById } = useProfileUtils(env);

	const pathname = (location as any).location?.pathname || location.pathname;
	const match = useMemo(() => matchPath(pathname, { path: "/profiles/:profileId" }), [pathname]);
	const profileId = (match?.params as any)?.profileId;
	const allProfilesCount = env.profiles().count();

	return useMemo(() => getProfileById(profileId), [profileId, env, allProfilesCount, getProfileById]); // eslint-disable-line react-hooks/exhaustive-deps
};

const useProfileJobs = (profile?: Contracts.IProfile): Record<string, any> => {
	const { env } = useEnvironmentContext();
	const { notifications } = useNotifications();

	const walletsCount = profile?.wallets().count();
	return useMemo(() => {
		if (!profile) {
			return [];
		}

		// Syncing delegates is necessary for every domain not only votes,
		// Because it's used in wallet and transaction lists
		const syncDelegates = {
			callback: () => env.delegates().syncAll(),
			interval: Intervals.Long,
		};

		const syncExchangeRates = {
			callback: () => {
				const currencies = Object.keys(profile.coins().all());
				return Promise.all(currencies.map((currency) => env.exchangeRates().syncAll(profile, currency)));
			},
			interval: Intervals.Long,
		};

		const syncNotifications = {
			callback: () => notifications.notifyReceivedTransactions({ profile }),
			interval: Intervals.Long,
		};

		const syncKnownWallets = {
			callback: () => env.knownWallets().syncAll(),
			interval: Intervals.Long,
		};

		return {
			allJobs: [syncExchangeRates, syncNotifications, syncKnownWallets, syncDelegates],
		};
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
	const isRestored = (profile: Contracts.IProfile) =>
		[...current.restored, ...restoredProfiles].includes(profile.id()) || current.status === "restored";
	const isSyncing = () => current.status === "syncing";
	const isSynced = () => current.status === "synced";
	const isCompleted = () => current.status === "completed";

	const shouldRestore = (profile: Contracts.IProfile) => {
		// For unit tests only. This flag prevents from running restore multiple times
		// as the profiles are all restored before all (see jest.setup)
		const isRestoredInTests = process.env.TEST_PROFILES_RESTORE_STATUS === "restored";
		if (isRestoredInTests) {
			return false;
		}

		return !isSyncing() && !isRestoring() && !isSynced() && !isCompleted() && !isRestored(profile);
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
	const { shouldRestore, markAsRestored, setStatus } = useProfileSyncStatus();
	const { persist, env } = useEnvironmentContext();
	const { getProfileFromUrl, getProfileStoredPassword } = useProfileUtils(env);
	const history = useHistory();

	const restoreProfile = async (profile: Contracts.IProfile, passwordInput?: string) => {
		if (!shouldRestore(profile)) {
			return false;
		}

		const password = passwordInput || getProfileStoredPassword(profile);

		setStatus("restoring");

		// When in e2e mode, profiles are migrated passwordless and
		// password needs to be set again. The restore should happen
		// without password and then reset the password.
		const __E2E__ = ["true", "1"].includes(process.env.REACT_APP_IS_E2E?.toLowerCase() as string);
		if (__E2E__) {
			await profile.restore(password);
			profile.save(password);

			await persist();

			markAsRestored(profile.id());
			return true;
		}

		// Reset profile normally (passwordless or not)
		await profile.restore(password);
		markAsRestored(profile.id());

		// Profile restore finished but url changed in the meanwhile.
		// Prevent from unecessary save of old profile.
		const activeProfile = getProfileFromUrl(history?.location?.pathname);
		if (activeProfile?.id() !== profile.id()) {
			return;
		}

		// Make sure the latest profile state is encoded (and optionally encrypted) before persisting
		profile.save(password);

		await persist();
		return true;
	};

	return {
		restoreProfile,
	};
};

type ProfileSynchronizerProps = {
	onProfileRestoreError?: (error: any) => void;
};

export const useProfileSynchronizer = ({ onProfileRestoreError }: ProfileSynchronizerProps = {}) => {
	const __E2E__ = process.env.REACT_APP_IS_E2E;
	const { persist } = useEnvironmentContext();
	const { setConfiguration, profileIsSyncing } = useConfiguration();
	const { restoreProfile } = useProfileRestore();
	const profile = useProfileWatcher();

	const {
		shouldRestore,
		shouldSync,
		shouldMarkCompleted,
		setStatus,
		status,
		markAsRestored,
	} = useProfileSyncStatus();

	const { allJobs } = useProfileJobs(profile);
	const { start, stop, runAll } = useSynchronizer(allJobs);

	useEffect(() => {
		const clearProfileSyncStatus = () => {
			if (status() !== "completed") {
				return;
			}

			setStatus("idle");
			stop({ clearTimers: true });
			setConfiguration({ profileIsSyncing: true });
		};

		const syncProfile = async (profile?: Contracts.IProfile) => {
			if (!profile) {
				return clearProfileSyncStatus();
			}

			if (profile.usesPassword()) {
				try {
					Helpers.MemoryPassword.get();
				} catch (error) {
					onProfileRestoreError?.(error);
					return;
				}
			}

			if (shouldRestore(profile)) {
				await restoreProfile(profile);
			}

			if (shouldSync()) {
				setStatus("syncing");

				runAll();

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
		allJobs,
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
		restoreProfile,
		status,
		onProfileRestoreError,
		stop,
		__E2E__,
	]);

	return { profile, profileIsSyncing };
};
