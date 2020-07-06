import React from "react";
import { useParams } from "react-router-dom";

import { useEnvironment } from "../contexts/Environment";

export const useActiveProfile = () => {
	const { env } = useEnvironment();
	const { profileId } = useParams();

	return React.useMemo(() => {
		if (env) {
			try {
				return env.profiles().get(profileId);
			} catch {
				return undefined;
			}
		}
	}, [env, profileId]);
};

export const useActiveWallet = () => {
	const profile = useActiveProfile();
	const { address } = useParams();

	return React.useMemo(() => {
		if (profile) {
			try {
				return profile.wallets().findById(id);
			} catch {
				return undefined;
			}
		}
	}, [profile, address]);
};
