import { Contracts } from "@arkecosystem/platform-sdk-profiles";

interface GetDefaultAliasInput {
	profile: Contracts.IProfile;
	ticker: string;
}

export const getDefaultAlias = ({ profile, ticker }: GetDefaultAliasInput): string => {
	const makeAlias = (count: number) => `${ticker} #${count}`;

	let sameCoinWalletsCount = 1;

	const sameCoinWallets = profile.wallets().allByCoin()[ticker];

	if (sameCoinWallets) {
		sameCoinWalletsCount = Object.keys(sameCoinWallets).length;
	}

	while (profile.wallets().findByAlias(makeAlias(sameCoinWalletsCount))) {
		sameCoinWalletsCount++;
	}

	return makeAlias(sameCoinWalletsCount);
};
