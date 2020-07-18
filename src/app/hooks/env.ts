import { useEnvironment } from "app/contexts/Environment";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

type Network = { coin: string; network: string; symbol: string; ticker: string };

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
			try {
				return env.availableNetworks().map((network: Network) => network);
			} catch {
				return undefined;
			}
		}
	}, [env]);
};
