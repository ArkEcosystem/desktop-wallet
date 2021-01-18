import { BigNumber } from "@arkecosystem/platform-sdk-support";

export type LedgerData = {
	index: number;
	address: string;
	path: string;
	balance?: BigNumber;
	isNew?: boolean;
	timestamp?: number;
};

export type LedgerDerivationScheme = {
	coinType: number;
	purpose?: number;
	account?: number;
	change?: number;
	address?: number;
};

export const customDerivationModes = {
	ARK: {
		legacy: (slip44: number, cursor: number) => formatLedgerDerivationPath({ coinType: slip44, account: cursor }),
		bip44: (slip44: number, cursor: number) => {
			if (cursor === 0) {
				return;
			}

			return formatLedgerDerivationPath({ coinType: slip44, address: cursor });
		},
	},
};

export const formatLedgerDerivationPath = (scheme: LedgerDerivationScheme) =>
	`${scheme.purpose || 44}'/${scheme.coinType}'/${scheme.account || 0}'/${scheme.change || 0}/${scheme.address || 0}`;
