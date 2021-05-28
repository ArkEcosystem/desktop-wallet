import { BigNumber } from "@arkecosystem/platform-sdk-support";

export interface LedgerData {
	address: string;
	path: string;
	balance?: BigNumber;
	isNew?: boolean;
}

export interface LedgerDerivationScheme {
	coinType: number;
	purpose?: number;
	account?: number;
	change?: number;
	address?: number;
}

export const formatLedgerDerivationPath = (scheme: LedgerDerivationScheme) =>
	`${scheme.purpose || 44}'/${scheme.coinType}'/${scheme.account || 0}'/${scheme.change || 0}/${scheme.address || 0}`;
