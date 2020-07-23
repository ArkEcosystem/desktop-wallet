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

export const useAvailableNetworks = () => {
	const context = useEnvironmentContext();

	return useMemo(() => {
		return context.env.availableNetworks().map((network) => ({
			icon: `${network.coin().charAt(0).toUpperCase()}${network.coin().slice(1).toLowerCase()}`,
			coin: network.coin(),
			name: `${network.ticker()} - ${network.name()}`,
			network: network.id(),
		}));
	}, [context]);
};
