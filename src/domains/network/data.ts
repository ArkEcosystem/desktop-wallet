import { Coins } from "@arkecosystem/platform-sdk";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { LSK } from "@arkecosystem/platform-sdk-lsk";

export interface CoinNetworkExtended {
	displayName: string;
	borderClass: string;
	textClass: string;
	iconName: string;
}

export const coinsNetworkExtendedData: Record<string, Record<string, CoinNetworkExtended>> = {
	ARK: {
		"ark.mainnet": {
			displayName: "ARK",
			borderClass: "border-theme-danger-200",
			textClass: "text-theme-danger-400",
			iconName: "ARK",
		},
		"ark.devnet": {
			displayName: "ARK Devnet",
			borderClass: "border-theme-primary-100",
			textClass: "text-theme-primary-400",
			iconName: "ARK",
		},
		"compendia.mainnet": {
			displayName: "Compendia",
			borderClass: "border-theme-primary-100",
			textClass: "text-theme-primary-400",
			iconName: "BIND",
		},
	},
	LSK: {
		"lsk.mainnet": {
			displayName: "Lisk",
			borderClass: "border-theme-primary-400",
			textClass: "text-theme-primary-600",
			iconName: "LSK",
		},
		"lsk.testnet": {
			displayName: "Lisk Testnet",
			borderClass: "border-theme-primary-100",
			textClass: "text-theme-primary-400",
			iconName: "LSK",
		},
	},
};

export const availableNetworksMock: Coins.Network[] = [
	new Coins.Network(ARK.manifest.networks["ark.mainnet"]),
	new Coins.Network(ARK.manifest.networks["ark.devnet"]),
	new Coins.Network(LSK.manifest.networks["lsk.mainnet"]),
	new Coins.Network(LSK.manifest.networks["lsk.testnet"]),
];
