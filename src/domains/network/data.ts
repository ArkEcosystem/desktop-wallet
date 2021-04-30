import { Coins } from "@arkecosystem/platform-sdk";
import { ADA } from "@arkecosystem/platform-sdk-ada";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { ATOM } from "@arkecosystem/platform-sdk-atom";
import { AVAX } from "@arkecosystem/platform-sdk-avax";
import { BTC } from "@arkecosystem/platform-sdk-btc";
import { DOT } from "@arkecosystem/platform-sdk-dot";
import { EGLD } from "@arkecosystem/platform-sdk-egld";
import { EOS } from "@arkecosystem/platform-sdk-eos";
import { ETH } from "@arkecosystem/platform-sdk-eth";
import { LSK } from "@arkecosystem/platform-sdk-lsk";
import { LUNA } from "@arkecosystem/platform-sdk-luna";
import { NANO } from "@arkecosystem/platform-sdk-nano";
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

export const coinsNetworkExtendedData: Record<string, Record<string, CoinNetworkExtended>> = {
	ADA: {
		"ada.mainnet": {
			displayName: "Cardano",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "Cardano",
		},
		"ada.testnet": {
			displayName: "Cardano",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "Cardano",
		},
	},
	AVAX: {
		"ada.mainnet": {
			displayName: "Cardano",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "Cardano",
		},
		"ada.testnet": {
			displayName: "Cardano",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "Cardano",
		},
	},
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
	ATOM: {
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
		"terra.mainnet": {
			displayName: "Terra",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "ATOM",
		},
		"terra.testnet": {
			displayName: "Terra Testnet",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "ATOM",
		},
	},
	BTC: {
		"btc.livenet": {
			displayName: "Bitcoin",
			borderClass: "border-theme-warning-200",
			textClass: "text-theme-warning-400",
			iconName: "BTC",
		},
		"btc.testnet": {
			displayName: "Bitcoin Testnet",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "BTC",
		},
	},
	DOT: {
		"ada.mainnet": {
			displayName: "Cardano",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "Cardano",
		},
		"ada.testnet": {
			displayName: "Cardano",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "Cardano",
		},
	},
	EGLD: {
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
	},
	ETH: {
		"eth.mainnet": {
			displayName: "Ethereum",
			borderClass: "border-theme-secondary-800",
			textClass: "text-theme-secondary-800",
			iconName: "ETH",
		},
		"eth.rinkeby": {
			displayName: "Ethereum Rinkeby",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "ETH",
		},
		"eth.ropsten": {
			displayName: "Ethereum Ropsten",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "ETH",
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
	LUNA: {
		"ada.mainnet": {
			displayName: "Cardano",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "Cardano",
		},
		"ada.testnet": {
			displayName: "Cardano",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "Cardano",
		},
	},
	NANO: {
		"ada.mainnet": {
			displayName: "Cardano",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "Cardano",
		},
		"ada.testnet": {
			displayName: "Cardano",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "Cardano",
		},
	},
	NEO: {
		"neo.mainnet": {
			displayName: "NEO",
			borderClass: "border-theme-warning-200",
			textClass: "text-theme-warning-400",
			iconName: "BTC",
		},
		"neo.testnet": {
			displayName: "NEO Testnet",
			borderClass: "border-theme-warning-200",
			textClass: "text-theme-warning-400",
			iconName: "BTC",
		},
	},
	TRX: {
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
	},
	XLM: {
		"trx.mainnet": {
			displayName: "Stellar",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "XLM",
		},
		"trx.testnet": {
			displayName: "Stellar Testnet",
			borderClass: "border-theme-primary-500",
			textClass: "text-theme-primary-700",
			iconName: "XLM",
		},
	},
	XRP: {
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
			iconName: "Ripple",
		},
	},
};

export const availableNetworksMock: Coins.Network[] = [
	new Coins.Network(ADA.manifest.name, ADA.manifest.networks["ada.mainnet"]),
	new Coins.Network(ADA.manifest.name, ADA.manifest.networks["ada.testnet"]),
	new Coins.Network(ARK.manifest.name, ARK.manifest.networks["ark.devnet"]),
	new Coins.Network(ARK.manifest.name, ARK.manifest.networks["ark.mainnet"]),
	new Coins.Network(ARK.manifest.name, ARK.manifest.networks["compendia.mainnet"]),
	new Coins.Network(ATOM.manifest.name, ATOM.manifest.networks["cosmos.mainnet"]),
	new Coins.Network(ATOM.manifest.name, ATOM.manifest.networks["cosmos.testnet"]),
	new Coins.Network(ATOM.manifest.name, ATOM.manifest.networks["terra.mainnet"]),
	new Coins.Network(ATOM.manifest.name, ATOM.manifest.networks["terra.testnet"]),
	new Coins.Network(AVAX.manifest.name, AVAX.manifest.networks["avax.mainnet"]),
	new Coins.Network(AVAX.manifest.name, AVAX.manifest.networks["avax.testnet"]),
	new Coins.Network(BTC.manifest.name, BTC.manifest.networks["btc.livenet"]),
	new Coins.Network(BTC.manifest.name, BTC.manifest.networks["btc.testnet"]),
	new Coins.Network(DOT.manifest.name, DOT.manifest.networks["dot.mainnet"]),
	new Coins.Network(DOT.manifest.name, DOT.manifest.networks["ksm.mainnet"]),
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
	new Coins.Network(ETH.manifest.name, ETH.manifest.networks["eth.mainnet"]),
	new Coins.Network(ETH.manifest.name, ETH.manifest.networks["eth.rinkeby"]),
	new Coins.Network(LSK.manifest.name, LSK.manifest.networks["lsk.mainnet"]),
	new Coins.Network(LSK.manifest.name, LSK.manifest.networks["lsk.testnet"]),
	new Coins.Network(LUNA.manifest.name, LUNA.manifest.networks["luna.mainnet"]),
	new Coins.Network(LUNA.manifest.name, LUNA.manifest.networks["luna.testnet"]),
	new Coins.Network(NANO.manifest.name, NANO.manifest.networks["nano.mainnet"]),
	new Coins.Network(NANO.manifest.name, NANO.manifest.networks["nano.testnet"]),
	new Coins.Network(NEO.manifest.name, NEO.manifest.networks["neo.mainnet"]),
	new Coins.Network(NEO.manifest.name, NEO.manifest.networks["neo.testnet"]),
	new Coins.Network(TRX.manifest.name, TRX.manifest.networks["trx.mainnet"]),
	new Coins.Network(TRX.manifest.name, TRX.manifest.networks["trx.testnet"]),
	new Coins.Network(XLM.manifest.name, XLM.manifest.networks["xlm.mainnet"]),
	new Coins.Network(XLM.manifest.name, XLM.manifest.networks["xlm.testnet"]),
	new Coins.Network(XRP.manifest.name, XRP.manifest.networks["xrp.mainnet"]),
	new Coins.Network(XRP.manifest.name, XRP.manifest.networks["xrp.testnet"]),
];
