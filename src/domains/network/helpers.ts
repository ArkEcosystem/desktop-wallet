import { CoinNetworkExtended, coinsNetworkExtendedData } from "./data";

export const getNetworkExtendedData = ({
	coin,
	network,
}: {
	coin: string;
	network: string;
}): CoinNetworkExtended | undefined => {
	return coinsNetworkExtendedData[coin]?.[network];
};
