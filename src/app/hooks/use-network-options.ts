import { Coins } from "@arkecosystem/platform-sdk";
import { useEnvironmentContext } from "app/contexts";
import { useCallback, useMemo } from "react";

export const useNetworkOptions = () => {
	const { env } = useEnvironmentContext();

	const networks: Coins.Network[] = useMemo(() => env.availableNetworks(), [env]);

	const networkOptions = useMemo(
		() =>
			networks.map((network) => ({
				value: network.id(),
				label: `${network.coin()} ${network.name()}`,
			})),
		[networks],
	);

	const networkById = useCallback((id?: string) => networks.find((network) => network.id() === id), [networks]);

	return {
		networkOptions,
		networkById,
	};
};
