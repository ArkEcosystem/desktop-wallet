import { Networks } from "@arkecosystem/platform-sdk";

export interface SelectedWallet {
	address: string;
	coinId: string;
	coinName: string;
	network: Networks.Network;
	name?: string;
}
