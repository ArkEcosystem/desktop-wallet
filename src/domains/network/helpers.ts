import { CoinNetworkExtended, coinsNetworkExtendedData } from "./data";

export const getNetworkExtendedData = ({
	coin,
	network,
}: {
	coin: string;
	network: string;
}): CoinNetworkExtended | undefined => coinsNetworkExtendedData[coin]?.[network];
