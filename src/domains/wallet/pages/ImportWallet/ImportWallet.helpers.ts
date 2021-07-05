import { Contracts } from "@arkecosystem/platform-sdk-profiles";

const getDefaultAlias = (profile: Contracts.IProfile, wallet: Contracts.IReadWriteWallet): string => {
	const ticker = wallet.network().ticker();

	const makeAlias = (count: number) => `${ticker} #${count}`;

	let sameCoinWalletsCount = Object.keys(profile.wallets().allByCoin()[ticker]).length;

	while (profile.wallets().findByAlias(makeAlias(sameCoinWalletsCount))) {
		sameCoinWalletsCount++;
	}

	return makeAlias(sameCoinWalletsCount);
};

export {
	getDefaultAlias,
};
