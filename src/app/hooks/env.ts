import { useEnvironmentContext } from "app/contexts/Environment";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export const useActiveProfile = () => {
	const context = useEnvironmentContext();
	const { profileId } = useParams();

	return useMemo(() => {
		try {
			return context.env.profiles().findById(profileId);
		} catch {
			return undefined;
		}
	}, [context, profileId]);
};

export const useActiveWallet = () => {
	const profile = useActiveProfile();
	const { walletId } = useParams();

	return useMemo(() => {
		if (profile) {
			try {
				return profile?.wallets().findById(walletId);
			} catch {
				return undefined;
			}
		}
	}, [profile, walletId]);
};
