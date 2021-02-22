import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { get } from "@arkecosystem/utils";

import { customDerivationModes, formatLedgerDerivationPath, LedgerData } from "../utils";

export const createRange = (start: number, size: number) => Array.from({ length: size }, (_, i) => i + size * start);

export const searchAddresses = async (
	indexes: number[],
	coin: Coins.Coin,
	profile: Profile,
	derivationMode?: string,
) => {
	const addressMap: Record<string, any> = {};
	const coinName = coin.manifest().get<string>("name");
	const slip44 = coin.config().get<number>("network.crypto.slip44");

	for (const cursor of indexes) {
		let path: string;

		if (derivationMode) {
			const formatFn: any = get(customDerivationModes, `${coinName}.${derivationMode}`);
			path = formatFn(slip44, cursor);
		} else {
			path = formatLedgerDerivationPath({ coinType: slip44, account: cursor });
		}

		if (!path) {
			continue;
		}

		const publicKey = await coin.ledger().getPublicKey(path);
		const address = await coin.identity().address().fromPublicKey(publicKey);

		// Already imported
		if (!profile.wallets().findByAddress(address)) {
			addressMap[address] = {
				address,
				path,
				index: cursor,
				timestamp: new Date().getTime(),
			};
		}
	}
	return addressMap;
};

export const searchWallets = async (addressMap: Record<string, any>, coin: Coins.Coin) => {
	const wallets: LedgerData[] = [];
	const addresses = Object.keys(addressMap);

	const response = await coin.client().wallets({ addresses });

	for (const identity of response.items()) {
		const wallet: LedgerData = {
			...addressMap[identity.address()!],
			address: identity.address(),
			balance: identity.balance(),
		};

		/* istanbul ignore next */
		if (wallet.path) {
			wallets.push(wallet);
		}
	}

	return wallets;
};
