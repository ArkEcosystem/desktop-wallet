import { useEnvironmentContext } from "app/contexts/Environment";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export const useActiveProfile = () => {
	const context = useEnvironmentContext();
	const { profileId } = useParams();

	return useMemo(() => {
		if (!profileId) {
			return;
		}

		return context.env.profiles().findById(profileId);
	}, [context, profileId]);
};

export const useActiveWallet = () => {
	const profile = useActiveProfile();
	const { walletId } = useParams();

	return useMemo(() => {
		if (!profile) {
			return;
		}
		return profile.wallets().findById(walletId);
	}, [profile, walletId]);
};
