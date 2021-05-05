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
	// new Coins.Network(ADA.manifest.name, ADA.manifest.networks["ada.mainnet"]),
	new Coins.Network(ARK.manifest.networks["ark.mainnet"]),
	new Coins.Network(ARK.manifest.networks["ark.devnet"]),
	new Coins.Network(ARK.manifest.networks["compendia.mainnet"]),
	// new Coins.Network( ARK.manifest.networks["compendia.testnet"]),
	new Coins.Network(ATOM.manifest.networks["cosmos.mainnet"]),
	new Coins.Network(ATOM.manifest.networks["cosmos.testnet"]),
	new Coins.Network(ATOM.manifest.networks["terra.mainnet"]),
	new Coins.Network(ATOM.manifest.networks["terra.testnet"]),
	new Coins.Network(BTC.manifest.networks["btc.livenet"]),
	new Coins.Network(BTC.manifest.networks["btc.testnet"]),
	new Coins.Network(EGLD.manifest.networks["egld.mainnet"]),
	new Coins.Network(EGLD.manifest.networks["egld.testnet"]),
	new Coins.Network(EOS.manifest.networks["bos.mainnet"]),
	new Coins.Network(EOS.manifest.networks["eos.mainnet"]),
	new Coins.Network(EOS.manifest.networks["eos.testnet"]),
	new Coins.Network(EOS.manifest.networks["meetone.mainnet"]),
	new Coins.Network(EOS.manifest.networks["telos.mainnet"]),
	new Coins.Network(EOS.manifest.networks["telos.testnet"]),
	new Coins.Network(EOS.manifest.networks["wax.mainnet"]),
	new Coins.Network(EOS.manifest.networks["worbli.mainnet"]),
	new Coins.Network(EOS.manifest.networks["worbli.testnet"]),
	// new Coins.Network( ETH.manifest.networks["eth.goerli"]),
	// new Coins.Network( ETH.manifest.networks["eth.kovan"]),
	new Coins.Network(ETH.manifest.networks["eth.mainnet"]),
	new Coins.Network(ETH.manifest.networks["eth.rinkeby"]),
	// new Coins.Network( ETH.manifest.networks["eth.ropsten"]),
	// new Coins.Network( LSK.manifest.networks["lsk.betanet"]),
	new Coins.Network(LSK.manifest.networks["lsk.mainnet"]),
	new Coins.Network(LSK.manifest.networks["lsk.testnet"]),
	new Coins.Network(NEO.manifest.networks["neo.mainnet"]),
	new Coins.Network(NEO.manifest.networks["neo.testnet"]),
	new Coins.Network(TRX.manifest.networks["trx.mainnet"]),
	new Coins.Network(TRX.manifest.networks["trx.testnet"]),
	// new Coins.Network( XLM.manifest.networks["xlm.mainnet"]),
	// new Coins.Network( XLM.manifest.networks["xlm.testnet"]),
	new Coins.Network(XRP.manifest.networks["xrp.mainnet"]),
	new Coins.Network(XRP.manifest.networks["xrp.testnet"]),
];
