import { useContext } from "react";
import { useParams } from "react-router-dom";

import { EnvironmentContext } from "../contexts/Environment";

export const useActiveProfile = () => {
	const { env }: any = useContext(EnvironmentContext);
	const { profileId } = useParams();

	return env.profiles().get(profileId);
};

export const useActiveWallet = () => {
	const profile = useActiveProfile();
	const { address } = useParams();

	return profile.wallets().findByAddress(address);
};
