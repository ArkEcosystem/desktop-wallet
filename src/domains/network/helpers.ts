import { CoinNetworkExtended, coinsNetworkExtendedData } from "./data";

export const getNetworkExtendedData = (network: string): CoinNetworkExtended => coinsNetworkExtendedData[network];
