import { ARK } from "@arkecosystem/platform-sdk-ark";
import { BTC } from "@arkecosystem/platform-sdk-btc";
// import { LSK } from "@arkecosystem/platform-sdk-lsk";
import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
// import { XRP } from "@arkecosystem/platform-sdk-xrp";

export interface CoinNetworkExtended {
	displayName: string;
	borderClass: string;
	textClass: string;
	iconName: string;
}

export const coinsNetworkExtendedData: Record<string, Record<string, CoinNetworkExtended>> = {
	ARK: {
		Mainnet: {
			displayName: "Ark",
			borderClass: "border-theme-danger-light",
			textClass: "text-theme-danger-400",
			iconName: "Ark",
		},
		Devnet: {
			displayName: "Ark Devnet",
			borderClass: "border-theme-primary-100",
			textClass: "text-theme-primary-400",
			iconName: "Ark",
		},
	},
	BTC: {
		Livenet: {
			displayName: "Bitcoin",
			borderClass: "border-theme-warning-200",
			textClass: "text-theme-warning-400",
			iconName: "Bitcoin",
		},
	},
	// LSK: {
	// 	Mainnet: {
	// 		displayName: "Lisk",
	// 		borderClass: "border-theme-primary-400",
	// 		textClass: "text-theme-primary",
	// 		iconName: "Lisk",
	// 	},
	// },
	// XRP: {
	// 	Mainnet: {
	// 		displayName: "Ripple",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// },
};

export const availableNetworksMock: NetworkData[] = [
	new NetworkData(ARK.manifest.name, ARK.manifest.networks.mainnet),
	new NetworkData(ARK.manifest.name, ARK.manifest.networks.devnet),
	new NetworkData(BTC.manifest.name, BTC.manifest.networks.livenet),
	// new NetworkData(LSK.manifest.name, LSK.manifest.networks.mainnet),
	// new NetworkData(XRP.manifest.name, XRP.manifest.networks.mainnet),
];
