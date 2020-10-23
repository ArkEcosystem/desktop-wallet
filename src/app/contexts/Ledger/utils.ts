import { BigNumber } from "@arkecosystem/platform-sdk-support";

export type LedgerData = {
	address: string;
	index: number;
	balance?: BigNumber;
	isNew?: boolean;
};

export const formatLedgerDerivationPath = (coinType: number, account: number) => `44'/${coinType}'/${account}'/0/0`;
