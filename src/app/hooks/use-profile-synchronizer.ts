import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";
import { useConfiguration, useEnvironmentContext } from "app/contexts";
import { DashboardConfiguration } from "domains/dashboard/pages/Dashboard";
import { useEffect, useMemo, useRef } from "react";
import { matchPath, useHistory, useLocation } from "react-router-dom";
import { isIdle } from "utils/electron-utils";

import { useNotifications } from "./use-notifications";
import { useProfileUtils } from "./use-profile-utils";
import { useScreenshotProtection } from "./use-screenshot-protection";
import { useSynchronizer } from "./use-synchronizer";
import { useTheme } from "./use-theme";

enum Intervals {
	VeryShort = 15_000,
	Short = 30_000,
	Medium = 60_000,
	Long = 120_000,
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

export const useProfileJobs = (profile?: Contracts.IProfile): Record<string, any> => {
	const { env } = useEnvironmentContext();
	const { notifications } = useNotifications();
	const { setConfiguration } = useConfiguration();
	const history = useHistory();

	const walletsCount = profile?.wallets().count();

	return useMemo(() => {
		if (!profile) {
			return [];
		}

		const syncWallets = {
			callback: () => env.wallets().syncByProfile(profile),
			interval: Intervals.Long,
		};

		// Syncing delegates is necessary for every domain not only votes,
		// Because it's used in wallet and transaction lists
		const syncDelegates = {
			callback: () => env.delegates().syncAll(profile),
			interval: Intervals.Long,
		};

		const syncExchangeRates = {
			callback: async () => {
				setConfiguration({ profileIsSyncingExchangeRates: true });

				const currencies = Object.keys(profile.coins().all());
				const allRates = await Promise.all(
					currencies.map((currency) => env.exchangeRates().syncAll(profile, currency)),
				);

				setConfiguration({ profileIsSyncingExchangeRates: false });

				return allRates;
			},
			interval: Intervals.Long,
		};

		const syncNotifications = {
			callback: () => notifications.notifyReceivedTransactions({ profile }),
			interval: Intervals.Long,
		};

		const syncKnownWallets = {
			callback: () => env.knownWallets().syncAll(profile),
			interval: Intervals.Long,
		};

		const checkActivityState = {
			callback: () => {
				const idleThreshold =
					(profile.settings().get(Contracts.ProfileSetting.AutomaticSignOutPeriod, 15) as number) * 60;

				if (isIdle(idleThreshold)) {
					history.push("/");
				}
			},
			interval: Intervals.VeryShort,
		};

		return {
			allJobs: [
				syncWallets,
				syncExchangeRates,
				syncNotifications,
				syncKnownWallets,
				syncDelegates,
				checkActivityState,
			],
			syncExchangeRates: syncExchangeRates.callback,
		};
	}, [env, profile, walletsCount, notifications, setConfiguration]); // eslint-disable-line react-hooks/exhaustive-deps
};

interface ProfileSyncState {
	status: string | null;
	restored: string[];
}

export const useProfileSyncStatus = () => {
	const { profileIsRestoring, setConfiguration } = useConfiguration();
	const { current } = useRef<ProfileSyncState>({
		restored: [],
		status: "idle",
	});

	const isIdle = () => current.status === "idle";
	const isRestoring = () => profileIsRestoring || current.status === "restoring";
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

		return !isSyncing() && !isRestoring() && !isSynced() && !isCompleted() && !profile.status().isRestored();
	};

	const shouldSync = () => !isSyncing() && !isRestoring() && !isSynced() && !isCompleted();
	const shouldMarkCompleted = () => isSynced() && !isCompleted();

	return {
		isIdle,
		markAsRestored: (profileId: string) => {
			current.status = "restored";
			current.restored.push(profileId);
			setConfiguration({ profileIsRestoring: false });
		},
		resetStatuses: (profiles: Contracts.IProfile[]) => {
			current.status = "idle";
			current.restored = [];
			setConfiguration({ profileIsRestoring: false, profileIsSyncing: true });
			for (const profile of profiles) {
				profile.status().reset();
			}
		},
		setStatus: (status: string) => {
			current.status = status;
			if (status === "restoring") {
				setConfiguration({ profileIsRestoring: true, profileIsSyncingExchangeRates: true });
			}

			if (status === "syncing") {
				setConfiguration({ profileIsSyncingExchangeRates: true });
			}

			if (status === "idle") {
				setConfiguration({ profileIsSyncingExchangeRates: true });
			}
		},
		shouldMarkCompleted,
		shouldRestore,
		shouldSync,
		status: () => current.status,
	};
};

export const useProfileRestore = () => {
	const { shouldRestore, markAsRestored, setStatus } = useProfileSyncStatus();
	const { persist, env } = useEnvironmentContext();
	const { getProfileFromUrl, getProfileStoredPassword } = useProfileUtils(env);
	const { setConfiguration } = useConfiguration();
	const history = useHistory();

	const restoreProfileConfig = (profile: Contracts.IProfile) => {
		const defaultConfiguration: DashboardConfiguration = {
			selectedNetworkIds: uniq(
				profile
					.wallets()
					.values()
					.map((wallet) => wallet.network().id()),
			),
			viewType: "grid",
			walletsDisplayType: "all",
		};

		const config = profile
			.settings()
			.get(Contracts.ProfileSetting.DashboardConfiguration, defaultConfiguration) as DashboardConfiguration;

		setConfiguration({ dashboard: config });
	};

	const restoreProfile = async (profile: Contracts.IProfile, passwordInput?: string) => {
		if (!shouldRestore(profile)) {
			return false;
		}

		const password = passwordInput || getProfileStoredPassword(profile);

		setStatus("restoring");

		// Reset profile normally (passwordless or not)
		await env.profiles().restore(profile, password);
		markAsRestored(profile.id());

		// Restore profile's config
		restoreProfileConfig(profile);

		// Profile restore finished but url changed in the meanwhile.
		// Prevent from unecessary save of old profile.
		const activeProfile = getProfileFromUrl(history?.location?.pathname);
		if (activeProfile?.id() !== profile.id()) {
			return;
		}

		await persist();
		return true;
	};

	return {
		restoreProfile,
		restoreProfileConfig,
	};
};

interface ProfileSynchronizerProperties {
	onProfileRestoreError?: (error: any) => void;
}

export const useProfileSynchronizer = ({ onProfileRestoreError }: ProfileSynchronizerProperties = {}) => {
	const { env, persist } = useEnvironmentContext();
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
		resetStatuses,
	} = useProfileSyncStatus();

	const { allJobs } = useProfileJobs(profile);
	const { start, stop, runAll } = useSynchronizer(allJobs);
	const { setProfileTheme, resetTheme } = useTheme();
	const { setScreenshotProtection } = useScreenshotProtection();
	const history = useHistory();

	useEffect(() => {
		const clearProfileSyncStatus = () => {
			if (status() === "idle") {
				return;
			}

			resetTheme();
			resetStatuses(env.profiles().values());

			stop({ clearTimers: true });
		};

		const syncProfile = async (profile?: Contracts.IProfile) => {
			if (!profile) {
				return clearProfileSyncStatus();
			}

			if (profile.usesPassword()) {
				try {
					profile.password().get();
				} catch (error) {
					onProfileRestoreError?.(error);
					return;
				}
			}

			if (shouldRestore(profile)) {
				await restoreProfile(profile);

				setProfileTheme(profile);
				setScreenshotProtection(profile);
			}

			if (shouldSync()) {
				setStatus("syncing");

				await profile.sync();
				await persist();

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

		setTimeout(() => syncProfile(profile), 0);
	}, [
		env,
		resetTheme,
		setProfileTheme,
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
		resetStatuses,
		history,
		setScreenshotProtection,
		stop,
	]);

	return { profile, profileIsSyncing };
};
