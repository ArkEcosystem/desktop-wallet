import { BigNumber } from "@arkecosystem/platform-sdk-support";

export type RecipientListItem = {
	address: string;
	amount: BigNumber;
	assetSymbol?: string;
	isEditable?: boolean;
	listIndex?: number;
	variant?: "condensed";
	walletName?: string;
	showAmount?: boolean;
	onRemove?: (address: string) => void;
};

export type RecipientList = {
	assetSymbol: string;
	isEditable?: boolean;
	recipients?: RecipientListItem[];
	showAmount?: boolean;
	variant?: "condensed";
	onRemove?: (address: string) => void;
};
