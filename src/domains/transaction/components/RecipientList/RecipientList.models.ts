import { BigNumber } from "@arkecosystem/platform-sdk-support";

export type RecipientListItem = {
	amount: BigNumber;
	address: string;
	walletName?: string;
	assetSymbol?: string;
	isMultisig?: boolean;
	isInArkNetwork?: boolean;
	isEditable?: boolean;
	onRemove?: (address: string) => void;
	listIndex?: number;
};

export type RecipientList = {
	onRemove?: (address: string) => void;
	assetSymbol: string;
	isEditable?: boolean;
	recipients?: RecipientListItem[];
};
