import { Contracts, Environment, Helpers } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";
import { useCallback, useMemo } from "react";
import { matchPath } from "react-router-dom";

export const useProfileUtils = (env: Environment) => {
	const getProfileById = useCallback(
		(id: string) => {
			if (!id) {
				return;
			}

			let response: Contracts.IProfile | undefined;

			try {
				response = env.profiles().findById(id);
			} catch (e) {
				// Not a valid profile id. Ignore.
			}

			return response;
		},
		[env],
	);

	const getProfileFromUrl = useCallback(
		(url: string) => {
			const urlMatch = matchPath(url, { path: "/profiles/:profileId" });
			const urlProfileId = (urlMatch?.params as any)?.profileId;
			return getProfileById(urlProfileId);
		},
		[getProfileById],
	);

	const getProfileStoredPassword = useCallback((profile: Contracts.IProfile) => {
		if (!profile.usesPassword()) {
			return;
		}

		try {
			return Helpers.MemoryPassword.get(profile);
		} catch {
			return;
		}
	}, []);

	const saveProfile = useCallback(
		(profile: Contracts.IProfile) => {
			if (!profile.usesPassword()) {
				return profile.save();
			}

			const password = getProfileStoredPassword(profile);
			if (!password) {
				return;
			}

			return profile.save(password);
		},
		[getProfileStoredPassword],
	);

	const getErroredNetworks = useCallback((profile: Contracts.IProfile) => {
		const erroredNetworks = profile
			.wallets()
			.values()
			.filter((wallet) => wallet.hasBeenPartiallyRestored())
			.map((wallet) => `${wallet.network().name()}`);

		return { hasErroredNetworks: erroredNetworks.length > 0, erroredNetworks: uniq(erroredNetworks) };
	}, []);

	return useMemo(
		() => ({ getProfileById, getProfileFromUrl, getProfileStoredPassword, saveProfile, getErroredNetworks }),
		[getProfileFromUrl, getProfileById, saveProfile, getProfileStoredPassword, getErroredNetworks],
	);
};
