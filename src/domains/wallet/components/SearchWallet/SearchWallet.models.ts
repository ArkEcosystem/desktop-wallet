import { Coins } from "@arkecosystem/platform-sdk";

export interface SelectedWallet {
	address: string;
	coinId: string;
	coinName: string;
	network: Coins.Network;
	name?: string;
}
