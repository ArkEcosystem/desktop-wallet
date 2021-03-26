import { Coins } from "@arkecosystem/platform-sdk";

export type SelectedWallet = {
	address: string;
	coinId: string;
	coinName: string;
	network: Coins.Network;
	name?: string;
};
