import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const formatDerivationPath = (coinType: number, index: number) => `44'/${coinType}'/${index}'/0/0`;

export type LedgerData = {
	address: string;
	balance: BigNumber;
	index: number;
	isNew?: boolean;
};

export const searchAddresses = async (indexes: number[], coin: Coins.Coin, profile: Profile) => {
	const addressMap: Record<string, number> = {};
	const slip44 = coin.config().get<number>("network.crypto.slip44");

	for (const cursor of indexes) {
		const path = formatDerivationPath(slip44, cursor);
		const publicKey = await coin.ledger().getPublicKey(path);
		const address = await coin.identity().address().fromPublicKey(publicKey);

		// Already imported
		if (!profile.wallets().findByAddress(address)) {
			addressMap[address] = cursor;
		}
	}
	return addressMap;
};

export const searchWallets = async (addressMap: Record<string, number>, coin: Coins.Coin) => {
	const wallets: LedgerData[] = [];
	const addresses = Object.keys(addressMap);

	const response = await coin.client().wallets({ addresses });

	for (const identity of response.items()) {
		const wallet: LedgerData = {
			address: identity.address(),
			balance: identity.balance(),
			index: addressMap[identity.address()!],
		};
		wallets.push(wallet);
	}

	return wallets;
};
