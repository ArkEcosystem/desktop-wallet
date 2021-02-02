import { Network } from "@arkecosystem/platform-sdk/dist/coins";

export type SelectedWallet = {
	address: string;
	coinId: string;
	coinName: string;
	network: Network;
	name?: string;
};
