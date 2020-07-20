import { useEnvironment } from "app/contexts/Environment";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export const useActiveProfile = () => {
	const env = useEnvironment();
	const { profileId } = useParams();

	return useMemo(() => {
		if (env) {
			try {
				return env.profiles().findById(profileId);
			} catch {
				return undefined;
			}
		}
	}, [env, profileId]);
};

export const useAvailableNetworks = () => {
	const env = useEnvironment();

	return useMemo(() => {
		if (env) {
			return env.availableNetworks().map((network) => ({
				icon: `${network.coin().charAt(0).toUpperCase()}${network.coin().slice(1).toLowerCase()}`,
				coin: network.coin(),
				name: `${network.ticker()} - ${network.name()}`,
				network: network.id(),
			}));
		}
	}, [env]);
};
