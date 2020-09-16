// import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { ATOM } from "@arkecosystem/platform-sdk-atom";
import { BTC } from "@arkecosystem/platform-sdk-btc";
import { EOS } from "@arkecosystem/platform-sdk-eos";
// import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
import { NEO } from "@arkecosystem/platform-sdk-neo";
import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
import { TRX } from "@arkecosystem/platform-sdk-trx";
import { XLM } from "@arkecosystem/platform-sdk-xlm";
import { XMR } from "@arkecosystem/platform-sdk-xmr";
import { XRP } from "@arkecosystem/platform-sdk-xrp";

export interface CoinNetworkExtended {
	displayName: string;
	borderClass: string;
	textClass: string;
	iconName: string;
}

export const coinsNetworkExtendedData: Record<string, Record<string, CoinNetworkExtended>> = {
	// ADA: {
	// 	'ada.mainnet': {
	// 		displayName: "Ripple",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// },
	ARK: {
		"ark.mainnet": {
			displayName: "ARK",
			borderClass: "border-theme-danger-light",
			textClass: "text-theme-danger-400",
			iconName: "Ark",
		},
		"ark.devnet": {
			displayName: "ARK Devnet",
			borderClass: "border-theme-primary-100",
			textClass: "text-theme-primary-400",
			iconName: "Ark",
		},
		"compendia.mainnet": {
			displayName: "Compendia",
			borderClass: "border-theme-primary-100",
			textClass: "text-theme-primary-400",
			iconName: "Compendia",
		},
		"compendia.testnet": {
			displayName: "Compendia Testnet",
			borderClass: "border-theme-primary-100",
			textClass: "text-theme-primary-400",
			iconName: "Compendia",
		},
	},
	// ATOM: {
	// 	"cosmos.mainnet": {
	// 		displayName: "Cosmos",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"cosmos.testnet": {
	// 		displayName: "Cosmos Testnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"terra.mainnet": {
	// 		displayName: "Terra",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"terra.testnet": {
	// 		displayName: "Terra Testnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// },
	BTC: {
		"btc.livenet": {
			displayName: "Bitcoin",
			borderClass: "border-theme-warning-200",
			textClass: "text-theme-warning-400",
			iconName: "Bitcoin",
		},
		// 'btc.testnet': {
		// 	displayName: "Bitcoin Testnet",
		// 	borderClass: "border-theme-primary-500",
		// 	textClass: "text-theme-primary-dark",
		// 	iconName: "Ripple",
		// },
	},
	// EOS: {
	// 	"eos.mainnet": {
	// 		displayName: "EOS",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"eos.testnet": {
	// 		displayName: "EOS Testnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"bos.mainnet": {
	// 		displayName: "Bos Mainnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"meetone.mainnet": {
	// 		displayName: "Meetone Mainnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"telos.mainnet": {
	// 		displayName: "Telos Mainnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"telos.testnet": {
	// 		displayName: "Telos Testnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"wax.mainnet": {
	// 		displayName: "Wax Mainnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"worbli.mainnet": {
	// 		displayName: "Worbli Mainnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	"worbli.testnet": {
	// 		displayName: "Worbli Testnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// },
	// ETH: {
	// 	'eth.mainnet': {
	// 		displayName: "Ethereum",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	'eth.goerli': {
	// 		displayName: "Ethereum Goerli",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	'eth.kovan': {
	// 		displayName: "Ethereum Kovan",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	'eth.rinkeby': {
	// 		displayName: "Ethereum Rinkeby",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	'eth.ropsten': {
	// 		displayName: "Ethereum Ropsten",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// },
	ETH: {
		"eth.mainnet": {
			displayName: "Ethereum",
			borderClass: "border-theme-neutral-800",
			textClass: "text-theme-neutral-800",
			iconName: "Ethereum",
		},
	},
	LSK: {
		"lsk.mainnet": {
			displayName: "Lisk",
			borderClass: "border-theme-primary-400",
			textClass: "text-theme-primary",
			iconName: "Lisk",
		},
		"lsk.testnet": {
			displayName: "Lisk Testnet",
			borderClass: "border-theme-primary-100",
			textClass: "text-theme-primary-400",
			iconName: "Lisk",
		},
		// 'lsk.betanet': {
		// 	displayName: "Lisk Betanet",
		// 	borderClass: "border-theme-primary-100",
		// 	textClass: "text-theme-primary-400",
		// 	iconName: "Lisk",
		// },
	},
	// NEO: {
	// 	'neo.mainnet': {
	// 		displayName: "NEO",
	// 		borderClass: "border-theme-warning-200",
	// 		textClass: "text-theme-warning-400",
	// 		iconName: "Bitcoin",
	// 	},
	// 	'neo.testnet': {
	// 		displayName: "NEO Testnet",
	// 		borderClass: "border-theme-warning-200",
	// 		textClass: "text-theme-warning-400",
	// 		iconName: "Bitcoin",
	// 	},
	// },
	// TRX: {
	// 	'trx.mainnet': {
	// 		displayName: "Tron",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	'trx.testnet': {
	// 		displayName: "Tron Testnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// },
	// XLM: {
	// 	'trx.mainnet': {
	// 		displayName: "Stellar",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	'trx.testnet': {
	// 		displayName: "Stellar Testnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// },
	// XMR: {
	// 	'xmr.mainnet': {
	// 		displayName: "Monero",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	'xmr.testnet': {
	// 		displayName: "Monero Testnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// },
	// XRP: {
	// 	'xrp.mainnet': {
	// 		displayName: "Ripple",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// 	'xrp.testnet': {
	// 		displayName: "Ripple Testnet",
	// 		borderClass: "border-theme-primary-500",
	// 		textClass: "text-theme-primary-dark",
	// 		iconName: "Ripple",
	// 	},
	// },
};

export const availableNetworksMock: NetworkData[] = [
	// new NetworkData(ADA.manifest.name, ADA.manifest.networks["ada.mainnet"]),
	new NetworkData(ARK.manifest.name, ARK.manifest.networks["ark.mainnet"]),
	new NetworkData(ARK.manifest.name, ARK.manifest.networks["ark.devnet"]),
	new NetworkData(ARK.manifest.name, ARK.manifest.networks["compendia.mainnet"]),
	new NetworkData(ARK.manifest.name, ARK.manifest.networks["compendia.testnet"]),
	new NetworkData(ATOM.manifest.name, ATOM.manifest.networks["cosmos.mainnet"]),
	new NetworkData(ATOM.manifest.name, ATOM.manifest.networks["cosmos.testnet"]),
	new NetworkData(ATOM.manifest.name, ATOM.manifest.networks["terra.mainnet"]),
	new NetworkData(ATOM.manifest.name, ATOM.manifest.networks["terra.testnet"]),
	new NetworkData(BTC.manifest.name, BTC.manifest.networks["btc.livenet"]),
	new NetworkData(BTC.manifest.name, BTC.manifest.networks["btc.testnet"]),
	new NetworkData(EOS.manifest.name, EOS.manifest.networks["bos.mainnet"]),
	new NetworkData(EOS.manifest.name, EOS.manifest.networks["eos.mainnet"]),
	new NetworkData(EOS.manifest.name, EOS.manifest.networks["eos.testnet"]),
	new NetworkData(EOS.manifest.name, EOS.manifest.networks["meetone.mainnet"]),
	new NetworkData(EOS.manifest.name, EOS.manifest.networks["telos.mainnet"]),
	new NetworkData(EOS.manifest.name, EOS.manifest.networks["telos.testnet"]),
	new NetworkData(EOS.manifest.name, EOS.manifest.networks["wax.mainnet"]),
	new NetworkData(EOS.manifest.name, EOS.manifest.networks["worbli.mainnet"]),
	new NetworkData(EOS.manifest.name, EOS.manifest.networks["worbli.testnet"]),
	// new NetworkData(ETH.manifest.name, ETH.manifest.networks.["eth.goerli"]),
	// new NetworkData(ETH.manifest.name, ETH.manifest.networks.["eth.kovan"]),
	// new NetworkData(ETH.manifest.name, ETH.manifest.networks.["eth.mainnet"]),
	// new NetworkData(ETH.manifest.name, ETH.manifest.networks.["eth.rinkeby"]),
	// new NetworkData(ETH.manifest.name, ETH.manifest.networks.["eth.ropsten"]),
	// new NetworkData(LSK.manifest.name, LSK.manifest.networks.["lsk.betanet"]),
	new NetworkData(LSK.manifest.name, LSK.manifest.networks["lsk.mainnet"]),
	new NetworkData(LSK.manifest.name, LSK.manifest.networks["lsk.testnet"]),
	new NetworkData(NEO.manifest.name, NEO.manifest.networks["neo.mainnet"]),
	new NetworkData(NEO.manifest.name, NEO.manifest.networks["neo.testnet"]),
	new NetworkData(TRX.manifest.name, TRX.manifest.networks["trx.mainnet"]),
	new NetworkData(TRX.manifest.name, TRX.manifest.networks["trx.testnet"]),
	new NetworkData(XLM.manifest.name, XLM.manifest.networks["xlm.mainnet"]),
	new NetworkData(XLM.manifest.name, XLM.manifest.networks["xlm.testnet"]),
	new NetworkData(XMR.manifest.name, XMR.manifest.networks["xmr.mainnet"]),
	new NetworkData(XMR.manifest.name, XMR.manifest.networks["xmr.testnet"]),
	new NetworkData(XRP.manifest.name, XRP.manifest.networks["xrp.mainnet"]),
	new NetworkData(XRP.manifest.name, XRP.manifest.networks["xrp.testnet"]),
];
