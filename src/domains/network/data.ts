import { Coins } from "@arkecosystem/platform-sdk";
// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { ATOM } from "@arkecosystem/platform-sdk-atom";
import { BTC } from "@arkecosystem/platform-sdk-btc";
import { EGLD } from "@arkecosystem/platform-sdk-egld";
import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
import { NEO } from "@arkecosystem/platform-sdk-neo";
import { TRX } from "@arkecosystem/platform-sdk-trx";
import { XLM } from "@arkecosystem/platform-sdk-xlm";
import { XRP } from "@arkecosystem/platform-sdk-xrp";

const createNetwork = (coin: Coins.CoinSpec, network: string) => new Coins.Network(coin.manifest, coin.manifest.networks[network]);

export interface CoinNetworkExtended {
	displayName: string;
	borderClass: string;
	textClass: string;
	iconName: string;
}

export const coinsNetworkExtendedData: Record<string, CoinNetworkExtended> = {
	// 'ada.mainnet': {
	// 	displayName: "Cardano",
	// 	borderClass: "border-theme-primary-500",
	// 	textClass: "text-theme-primary-700",
	// 	iconName: "ADA",
	// },
	// 'ada.testnet': {
	// 	displayName: "Cardano Testnet",
	// 	borderClass: "border-theme-primary-500",
	// 	textClass: "text-theme-primary-700",
	// 	iconName: "ADA",
	// },
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
	// "compendia.testnet": {
	// 	displayName: "Compendia Testnet",
	// 	borderClass: "border-theme-primary-100",
	// 	textClass: "text-theme-primary-400",
	// 	iconName: "BIND",
	// },
	"cosmos.mainnet": {
		displayName: "Cosmos",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "ATOM",
	},
	"cosmos.testnet": {
		displayName: "Cosmos Testnet",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "ATOM",
	},
	// "btc.livenet": {
	// 	displayName: "Bitcoin",
	// 	borderClass: "border-theme-warning-200",
	// 	textClass: "text-theme-warning-400",
	// 	iconName: "BTC",
	// },
	// 'btc.testnet': {
	// 	displayName: "Bitcoin Testnet",
	// 	borderClass: "border-theme-primary-500",
	// 	textClass: "text-theme-primary-700",
	// 	iconName: "BTC",
	// },
	"egld.mainnet": {
		displayName: "Elrond",
		borderClass: "border-theme-warning-200",
		textClass: "text-theme-warning-400",
		iconName: "EGLD",
	},
	"egld.testnet": {
		displayName: "Elrond Testnet",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "EGLD",
	},
	// 'eth.mainnet': {
	// 	displayName: "Ethereum",
	// 	borderClass: "border-theme-primary-500",
	// 	textClass: "text-theme-primary-700",
	// 	iconName: "ETH",
	// },
	// 'eth.rinkeby': {
	// 	displayName: "Ethereum Rinkeby",
	// 	borderClass: "border-theme-primary-500",
	// 	textClass: "text-theme-primary-700",
	// 	iconName: "ETH",
	// },
	// 'eth.ropsten': {
	// 	displayName: "Ethereum Ropsten",
	// 	borderClass: "border-theme-primary-500",
	// 	textClass: "text-theme-primary-700",
	// 	iconName: "ETH",
	// },
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
	"neo.mainnet": {
		displayName: "NEO",
		borderClass: "border-theme-warning-200",
		textClass: "text-theme-warning-400",
		iconName: "NEO",
	},
	"neo.testnet": {
		displayName: "NEO Testnet",
		borderClass: "border-theme-warning-200",
		textClass: "text-theme-warning-400",
		iconName: "NEO",
	},
	"trx.mainnet": {
		displayName: "Tron",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "TRX",
	},
	"trx.testnet": {
		displayName: "Tron Testnet",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "TRX",
	},
	"xlm.mainnet": {
		displayName: "Stellar",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "XLM",
	},
	"xlm.testnet": {
		displayName: "Stellar Testnet",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "XLM",
	},
	"xrp.mainnet": {
		displayName: "Ripple",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "XRP",
	},
	"xrp.testnet": {
		displayName: "XRP Testnet",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "XRP",
	},
};

export const availableNetworksMock: Coins.Network[] = [
	// createNetwork(ADA, "ada.mainnet"),
	// createNetwork(ADA, "ada.testnet"),
	createNetwork(ARK, "ark.mainnet"),
	createNetwork(ARK, "ark.devnet"),
	createNetwork(ARK, "compendia.mainnet"),
	createNetwork(ATOM, "cosmos.mainnet"),
	createNetwork(ATOM, "cosmos.testnet"),
	createNetwork(BTC, "btc.livenet"),
	createNetwork(BTC, "btc.testnet"),
	createNetwork(EGLD, "egld.mainnet"),
	createNetwork(EGLD, "egld.testnet"),
	createNetwork(ETH, "eth.mainnet"),
	createNetwork(ETH, "eth.rinkeby"),
	createNetwork(ETH, "eth.ropsten"),
	createNetwork(LSK, "lsk.mainnet"),
	createNetwork(LSK, "lsk.testnet"),
	createNetwork(NEO, "neo.mainnet"),
	createNetwork(NEO, "neo.testnet"),
	createNetwork(TRX, "trx.mainnet"),
	createNetwork(TRX, "trx.testnet"),
	createNetwork(XLM, "xlm.mainnet"),
	createNetwork(XLM, "xlm.testnet"),
	createNetwork(XRP, "xrp.mainnet"),
	createNetwork(XRP, "xrp.testnet"),
];
