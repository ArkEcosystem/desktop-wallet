import { useEnvironmentContext } from "app/contexts/Environment";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export const useActiveProfile = () => {
	const { env, state } = useEnvironmentContext();
	const { profileId } = useParams();

	return useMemo(() => env.profiles().findById(profileId), [env, state, profileId]);
};

export const useActiveWallet = () => {
	const profile = useActiveProfile();
	const { walletId } = useParams();

	return useMemo(() => profile.wallets().findById(walletId), [profile, walletId]);
};
