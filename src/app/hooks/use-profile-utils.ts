import { Contracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";
import { useCallback, useMemo } from "react";
import { matchPath } from "react-router-dom";

export const useProfileUtils = (environment: Environment) => {
	const getProfileById = useCallback(
		(id: string) => {
			if (!id) {
				return;
			}

			let response: Contracts.IProfile | undefined;

			try {
				response = environment.profiles().findById(id);
			} catch {
				// Not a valid profile id. Ignore.
			}

			return response;
		},
		[environment],
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
			return profile.password().get();
		} catch {
			return;
		}
	}, []);

	const getErroredNetworks = useCallback((profile: Contracts.IProfile) => {
		const erroredNetworks = profile
			.wallets()
			.values()
			.filter((wallet) => wallet.hasBeenPartiallyRestored())
			.map((wallet) => `${wallet.network().name()}`);

		return { erroredNetworks: uniq(erroredNetworks), hasErroredNetworks: erroredNetworks.length > 0 };
	}, []);

	return useMemo(() => ({ getErroredNetworks, getProfileById, getProfileFromUrl, getProfileStoredPassword }), [
		getProfileFromUrl,
		getProfileById,
		getProfileStoredPassword,
		getErroredNetworks,
	]);
};
