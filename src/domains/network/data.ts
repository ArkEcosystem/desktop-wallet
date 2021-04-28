import { Coins } from "@arkecosystem/platform-sdk";
// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { ATOM } from "@arkecosystem/platform-sdk-atom";
import { BTC } from "@arkecosystem/platform-sdk-btc";
import { EGLD } from "@arkecosystem/platform-sdk-egld";
import { EOS } from "@arkecosystem/platform-sdk-eos";
import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
import { NEO } from "@arkecosystem/platform-sdk-neo";
import { TRX } from "@arkecosystem/platform-sdk-trx";
// import { XLM } from "@arkecosystem/platform-sdk-xlm";
import { XRP } from "@arkecosystem/platform-sdk-xrp";

export interface CoinNetworkExtended {
	displayName: string;
	iconName: string;
}

export const coinsNetworkExtendedData: Record<string, Record<string, CoinNetworkExtended>> = {
	// ADA: {
	// 	'ada.mainnet': {
	// 		displayName: "Ripple",
	// 		iconName: "Ripple",
	// 	},
	// },
	ARK: {
		"ark.mainnet": {
			displayName: "ARK",
			iconName: "ARK",
		},
		"ark.devnet": {
			displayName: "ARK Devnet",
			iconName: "ARK",
		},
		"compendia.mainnet": {
			displayName: "Compendia",
			iconName: "BIND",
		},
		// "compendia.testnet": {
		// 	displayName: "Compendia Testnet",
		// 	iconName: "BIND",
		// },
	},
	// ATOM: {
	// 	"cosmos.mainnet": {
	// 		displayName: "Cosmos",
	// 		iconName: "ATOM",
	// 	},
	// 	"cosmos.testnet": {
	// 		displayName: "Cosmos Testnet",
	// 		iconName: "ATOM",
	// 	},
	// 	"terra.mainnet": {
	// 		displayName: "Terra",
	// 		iconName: "ATOM",
	// 	},
	// 	"terra.testnet": {
	// 		displayName: "Terra Testnet",
	// 		iconName: "ATOM",
	// 	},
	// },
	BTC: {
		"btc.livenet": {
			displayName: "Bitcoin",
			iconName: "BTC",
		},
		// 'btc.testnet': {
		// 	displayName: "Bitcoin Testnet",
		// 	iconName: "BTC",
		// },
	},
	EGLD: {
		"egld.mainnet": {
			displayName: "Elrond",
			iconName: "EGLD",
		},
		"egld.testnet": {
			displayName: "Elrond Testnet",
			iconName: "EGLD",
		},
	},
	// EOS: {
	// 	"eos.mainnet": {
	// 		displayName: "EOS",
	// 		iconName: "EOS",
	// 	},
	// 	"eos.testnet": {
	// 		displayName: "EOS Testnet",
	// 		iconName: "EOS",
	// 	},
	// 	"bos.mainnet": {
	// 		displayName: "Bos Mainnet",
	// 		iconName: "EOS",
	// 	},
	// 	"meetone.mainnet": {
	// 		displayName: "Meetone Mainnet",
	// 		iconName: "EOS",
	// 	},
	// 	"telos.mainnet": {
	// 		displayName: "Telos Mainnet",
	// 		iconName: "EOS",
	// 	},
	// 	"telos.testnet": {
	// 		displayName: "Telos Testnet",
	// 		iconName: "EOS",
	// 	},
	// 	"wax.mainnet": {
	// 		displayName: "Wax Mainnet",
	// 		iconName: "EOS",
	// 	},
	// 	"worbli.mainnet": {
	// 		displayName: "Worbli Mainnet",
	// 		iconName: "EOS",
	// 	},
	// 	"worbli.testnet": {
	// 		displayName: "Worbli Testnet",
	// 		iconName: "EOS",
	// 	},
	// },
	// ETH: {
	// 	'eth.mainnet': {
	// 		displayName: "Ethereum",
	// 		iconName: "ETH",
	// 	},
	// 	'eth.goerli': {
	// 		displayName: "Ethereum Goerli",
	// 		iconName: "ETH",
	// 	},
	// 	'eth.kovan': {
	// 		displayName: "Ethereum Kovan",
	// 		iconName: "ETH",
	// 	},
	// 	'eth.rinkeby': {
	// 		displayName: "Ethereum Rinkeby",
	// 		iconName: "ETH",
	// 	},
	// 	'eth.ropsten': {
	// 		displayName: "Ethereum Ropsten",
	// 		iconName: "ETH",
	// 	},
	// },
	ETH: {
		"eth.mainnet": {
			displayName: "Ethereum",
			iconName: "ETH",
		},
	},
	LSK: {
		"lsk.mainnet": {
			displayName: "Lisk",
			iconName: "LSK",
		},
		"lsk.testnet": {
			displayName: "Lisk Testnet",
			iconName: "LSK",
		},
		// "lsk.betanet": {
		// 	displayName: "Lisk Betanet",
		// 	iconName: "LSK",
		// },
	},
	// NEO: {
	// 	'neo.mainnet': {
	// 		displayName: "NEO",
	// 		iconName: "BTC",
	// 	},
	// 	'neo.testnet': {
	// 		displayName: "NEO Testnet",
	// 		iconName: "BTC",
	// 	},
	// },
	// TRX: {
	// 	'trx.mainnet': {
	// 		displayName: "Tron",
	// 		iconName: "TRX",
	// 	},
	// 	'trx.testnet': {
	// 		displayName: "Tron Testnet",
	// 		iconName: "TRX",
	// 	},
	// },
	// XLM: {
	// 	'trx.mainnet': {
	// 		displayName: "Stellar",
	// 		iconName: "XLM",
	// 	},
	// 	'trx.testnet': {
	// 		displayName: "Stellar Testnet",
	// 		iconName: "XLM",
	// 	},
	// },
	// XRP: {
	// 	'xrp.mainnet': {
	// 		displayName: "Ripple",
	// 		iconName: "XRP",
	// 	},
	// 	'xrp.testnet': {
	// 		displayName: "XRP Testnet",
	// 		iconName: "Ripple",
	// 	},
	// },
};

export const availableNetworksMock: Coins.Network[] = [
	// new Coins.Network(ADA.manifest.name, ADA.manifest.networks["ada.mainnet"]),
	new Coins.Network(ARK.manifest.name, ARK.manifest.networks["ark.mainnet"]),
	new Coins.Network(ARK.manifest.name, ARK.manifest.networks["ark.devnet"]),
	new Coins.Network(ARK.manifest.name, ARK.manifest.networks["compendia.mainnet"]),
	// new Coins.Network(ARK.manifest.name, ARK.manifest.networks["compendia.testnet"]),
	new Coins.Network(ATOM.manifest.name, ATOM.manifest.networks["cosmos.mainnet"]),
	new Coins.Network(ATOM.manifest.name, ATOM.manifest.networks["cosmos.testnet"]),
	new Coins.Network(ATOM.manifest.name, ATOM.manifest.networks["terra.mainnet"]),
	new Coins.Network(ATOM.manifest.name, ATOM.manifest.networks["terra.testnet"]),
	new Coins.Network(BTC.manifest.name, BTC.manifest.networks["btc.livenet"]),
	new Coins.Network(BTC.manifest.name, BTC.manifest.networks["btc.testnet"]),
	new Coins.Network(EGLD.manifest.name, EGLD.manifest.networks["egld.mainnet"]),
	new Coins.Network(EGLD.manifest.name, EGLD.manifest.networks["egld.testnet"]),
	new Coins.Network(EOS.manifest.name, EOS.manifest.networks["bos.mainnet"]),
	new Coins.Network(EOS.manifest.name, EOS.manifest.networks["eos.mainnet"]),
	new Coins.Network(EOS.manifest.name, EOS.manifest.networks["eos.testnet"]),
	new Coins.Network(EOS.manifest.name, EOS.manifest.networks["meetone.mainnet"]),
	new Coins.Network(EOS.manifest.name, EOS.manifest.networks["telos.mainnet"]),
	new Coins.Network(EOS.manifest.name, EOS.manifest.networks["telos.testnet"]),
	new Coins.Network(EOS.manifest.name, EOS.manifest.networks["wax.mainnet"]),
	new Coins.Network(EOS.manifest.name, EOS.manifest.networks["worbli.mainnet"]),
	new Coins.Network(EOS.manifest.name, EOS.manifest.networks["worbli.testnet"]),
	// new Coins.Network(ETH.manifest.name, ETH.manifest.networks["eth.goerli"]),
	// new Coins.Network(ETH.manifest.name, ETH.manifest.networks["eth.kovan"]),
	new Coins.Network(ETH.manifest.name, ETH.manifest.networks["eth.mainnet"]),
	new Coins.Network(ETH.manifest.name, ETH.manifest.networks["eth.rinkeby"]),
	// new Coins.Network(ETH.manifest.name, ETH.manifest.networks["eth.ropsten"]),
	// new Coins.Network(LSK.manifest.name, LSK.manifest.networks["lsk.betanet"]),
	new Coins.Network(LSK.manifest.name, LSK.manifest.networks["lsk.mainnet"]),
	new Coins.Network(LSK.manifest.name, LSK.manifest.networks["lsk.testnet"]),
	new Coins.Network(NEO.manifest.name, NEO.manifest.networks["neo.mainnet"]),
	new Coins.Network(NEO.manifest.name, NEO.manifest.networks["neo.testnet"]),
	new Coins.Network(TRX.manifest.name, TRX.manifest.networks["trx.mainnet"]),
	new Coins.Network(TRX.manifest.name, TRX.manifest.networks["trx.testnet"]),
	// new Coins.Network(XLM.manifest.name, XLM.manifest.networks["xlm.mainnet"]),
	// new Coins.Network(XLM.manifest.name, XLM.manifest.networks["xlm.testnet"]),
	new Coins.Network(XRP.manifest.name, XRP.manifest.networks["xrp.mainnet"]),
	new Coins.Network(XRP.manifest.name, XRP.manifest.networks["xrp.testnet"]),
];
