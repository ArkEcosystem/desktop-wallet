import { Coins, Networks } from "@arkecosystem/platform-sdk";
// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
// import { ATOM } from "@arkecosystem/platform-sdk-atom";
// import { BTC } from "@arkecosystem/platform-sdk-btc";
// import { EGLD } from "@arkecosystem/platform-sdk-egld";
// import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
// import { NEO } from "@arkecosystem/platform-sdk-neo";
// import { TRX } from "@arkecosystem/platform-sdk-trx";
// import { XLM } from "@arkecosystem/platform-sdk-xlm";
// import { XRP } from "@arkecosystem/platform-sdk-xrp";
// import { ZIL } from "@arkecosystem/platform-sdk-zil";

const createNetwork = (coin: Coins.CoinSpec, network: string) =>
	new Networks.Network(coin.manifest, coin.manifest.networks[network]);

export interface CoinNetworkExtended {
	displayName: string;
	iconName: string;
	isLive: boolean;
}

export const coinsNetworkExtendedData: Record<string, CoinNetworkExtended> = {
	"ark.devnet": {
		displayName: "ARK Devnet",
		iconName: "ARK",
		isLive: false,
	},
	// 'ada.mainnet': {
	// 	displayName: "Cardano",
	// 	iconName: "ADA",
	//  isLive: true,
	// },
	// 'ada.testnet': {
	// 	displayName: "Cardano Testnet",
	// 	iconName: "ADA",
	//  isLive: false,
	// },
	"ark.mainnet": {
		displayName: "ARK",
		iconName: "ARK",
		isLive: true,
	},
	"bind.mainnet": {
		displayName: "Compendia",
		iconName: "BIND",
		isLive: true,
	},
	"bind.testnet": {
		displayName: "Compendia Testnet",
		iconName: "BIND",
		isLive: false,
	},
	// "atom.mainnet": {
	// 	displayName: "Cosmos",
	// 	iconName: "ATOM",
	//  isLive: true,
	// },
	// "atom.testnet": {
	// 	displayName: "Cosmos Testnet",
	// 	iconName: "ATOM",
	//  isLive: false,
	// },
	// "btc.livenet": {
	// 	displayName: "Bitcoin",
	// 	iconName: "BTC",
	//  isLive: true,
	// },
	// "btc.testnet": {
	// 	displayName: "Bitcoin Testnet",
	// 	iconName: "BTC",
	//  isLive: false,
	// },
	// "egld.mainnet": {
	// 	displayName: "Elrond",
	// 	iconName: "EGLD",
	//  isLive: true,
	// },
	// "egld.testnet": {
	// 	displayName: "Elrond Testnet",
	// 	iconName: "EGLD",
	//  isLive: false,
	// },
	// "eth.mainnet": {
	// 	displayName: "Ethereum",
	// 	iconName: "ETH",
	//  isLive: true,
	// },
	// "eth.rinkeby": {
	// 	displayName: "Ethereum Rinkeby",
	// 	iconName: "ETH",
	//  isLive: false,
	// },
	// "eth.ropsten": {
	// 	displayName: "Ethereum Ropsten",
	// 	iconName: "ETH",
	//  isLive: false,
	// },
	"lsk.mainnet": {
		displayName: "Lisk",
		iconName: "LSK",
		isLive: true,
	},
	"lsk.testnet": {
		displayName: "Lisk Testnet",
		iconName: "LSK",
		isLive: false,
	},
	// "nano.mainnet": {
	// 	displayName: "NANO",
	// 	iconName: "NANO",
	//  isLive: true,
	// },
	// "nano.testnet": {
	// 	displayName: "NANO Testnet",
	// 	iconName: "NANO",
	//  isLive: false,
	// },
	// "neo.mainnet": {
	// 	displayName: "NEO",
	// 	iconName: "NEO",
	//  isLive: true,
	// },
	// "neo.testnet": {
	// 	displayName: "NEO Testnet",
	// 	iconName: "NEO",
	//  isLive: false,
	// },
	// "trx.mainnet": {
	// 	displayName: "Tron",
	// 	iconName: "TRX",
	//  isLive: true,
	// },
	// "trx.testnet": {
	// 	displayName: "Tron Testnet",
	// 	iconName: "TRX",
	//  isLive: false,
	// },
	// "xlm.mainnet": {
	// 	displayName: "Stellar",
	// 	iconName: "XLM",
	//  isLive: true,
	// },
	// "xlm.testnet": {
	// 	displayName: "Stellar Testnet",
	// 	iconName: "XLM",
	//  isLive: false,
	// },
	// "xrp.mainnet": {
	// 	displayName: "Ripple",
	// 	iconName: "XRP",
	//  isLive: true,
	// },
	// "xrp.testnet": {
	// 	displayName: "Ripple Testnet",
	// 	iconName: "XRP",
	//  isLive: false,
	// },
	// "zil.mainnet": {
	// 	displayName: "Zilliqa",
	// 	iconName: "ZIL",
	//  isLive: true,
	// },
	// "zil.testnet": {
	// 	displayName: "Zilliqa Testnet",
	// 	iconName: "ZIL",
	//  isLive: false,
	// },
};

export const availableNetworksMock: Networks.Network[] = [
	// createNetwork(ADA, "ada.mainnet"),
	// createNetwork(ADA, "ada.testnet"),
	createNetwork(ARK, "ark.mainnet"),
	createNetwork(ARK, "ark.devnet"),
	createNetwork(ARK, "bind.mainnet"),
	createNetwork(ARK, "bind.testnet"),
	// createNetwork(ATOM, "atom.mainnet"),
	// createNetwork(ATOM, "atom.testnet"),
	// createNetwork(BTC, "btc.livenet"),
	// createNetwork(BTC, "btc.testnet"),
	// createNetwork(EGLD, "egld.mainnet"),
	// createNetwork(EGLD, "egld.testnet"),
	// createNetwork(ETH, "eth.mainnet"),
	// createNetwork(ETH, "eth.rinkeby"),
	// createNetwork(ETH, "eth.ropsten"),
	createNetwork(LSK, "lsk.mainnet"),
	createNetwork(LSK, "lsk.testnet"),
	// createNetwork(NEO, "neo.mainnet"),
	// createNetwork(NEO, "neo.testnet"),
	// createNetwork(TRX, "trx.mainnet"),
	// createNetwork(TRX, "trx.testnet"),
	// createNetwork(XLM, "xlm.mainnet"),
	// createNetwork(XLM, "xlm.testnet"),
	// createNetwork(XRP, "xrp.mainnet"),
	// createNetwork(XRP, "xrp.testnet"),
	// createNetwork(ZIL, "zil.mainnet"),
	// createNetwork(ZIL, "zil.testnet"),
];
