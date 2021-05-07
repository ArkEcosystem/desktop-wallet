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
	'neo.mainnet': {
		displayName: "NEO",
		borderClass: "border-theme-warning-200",
		textClass: "text-theme-warning-400",
		iconName: "NEO",
	},
	'neo.testnet': {
		displayName: "NEO Testnet",
		borderClass: "border-theme-warning-200",
		textClass: "text-theme-warning-400",
		iconName: "NEO",
	},
	'trx.mainnet': {
		displayName: "Tron",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "TRX",
	},
	'trx.testnet': {
		displayName: "Tron Testnet",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "TRX",
	},
	'xlm.mainnet': {
		displayName: "Stellar",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "XLM",
	},
	'xlm.testnet': {
		displayName: "Stellar Testnet",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "XLM",
	},
	'xrp.mainnet': {
		displayName: "Ripple",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "XRP",
	},
	'xrp.testnet': {
		displayName: "XRP Testnet",
		borderClass: "border-theme-primary-500",
		textClass: "text-theme-primary-700",
		iconName: "XRP",
	},
};

export const availableNetworksMock: Coins.Network[] = [
	// new Coins.Network(ADA.manifest, "ada.mainnet"),
	// new Coins.Network(ADA.manifest, "ada.testnet"),
	new Coins.Network(ARK.manifest, "ark.mainnet"),
	new Coins.Network(ARK.manifest, "ark.devnet"),
	new Coins.Network(ARK.manifest, "compendia.mainnet"),
	new Coins.Network(ATOM.manifest, "cosmos.mainnet"),
	new Coins.Network(ATOM.manifest, "cosmos.testnet"),
	new Coins.Network(BTC.manifest, "btc.livenet"),
	new Coins.Network(BTC.manifest, "btc.testnet"),
	new Coins.Network(EGLD.manifest, "egld.mainnet"),
	new Coins.Network(EGLD.manifest, "egld.testnet"),
	new Coins.Network(ETH.manifest, "eth.mainnet"),
	new Coins.Network(ETH.manifest, "eth.rinkeby"),
	new Coins.Network(ETH.manifest, "eth.ropsten"),
	new Coins.Network(LSK.manifest, "lsk.mainnet"),
	new Coins.Network(LSK.manifest, "lsk.testnet"),
	new Coins.Network(NEO.manifest, "neo.mainnet"),
	new Coins.Network(NEO.manifest, "neo.testnet"),
	new Coins.Network(TRX.manifest, "trx.mainnet"),
	new Coins.Network(TRX.manifest, "trx.testnet"),
	new Coins.Network(XLM.manifest, "xlm.mainnet"),
	new Coins.Network(XLM.manifest, "xlm.testnet"),
	new Coins.Network(XRP.manifest, "xrp.mainnet"),
	new Coins.Network(XRP.manifest, "xrp.testnet"),
];
