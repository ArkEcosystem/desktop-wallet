import { useContext } from "react";
import { useParams } from "react-router-dom";

import { EnvironmentContext } from "../contexts/Environment";

export const useActiveProfile = () => {
	const { env }: any = useContext(EnvironmentContext);
	const { profileId } = useParams();

	try {
		return env.profiles().get(profileId);
	} catch {
		return undefined;
	}
};

export const useActiveWallet = () => {
	const profile = useActiveProfile();
	const { address } = useParams();

	try {
		return profile.wallets().findByAddress(address);
	} catch {
		return undefined;
	}
};
