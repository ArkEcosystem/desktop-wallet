import { Networks } from "@arkecosystem/platform-sdk";
import { useEnvironmentContext } from "app/contexts";
import { useCallback, useMemo } from "react";

export const useNetworkOptions = () => {
	const { env } = useEnvironmentContext();

	const networks: Networks.Network[] = useMemo(() => env.availableNetworks(), [env]);

	const networkOptions = useMemo(
		() =>
			networks.map((network) => ({
				label: `${network.coinName()} ${network.name()}`,
				value: network.id(),
			})),
		[networks],
	);

	const networkById = useCallback((id?: string) => networks.find((network) => network.id() === id), [networks]);

	return {
		networkById,
		networkOptions,
	};
};
