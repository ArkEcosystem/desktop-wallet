import { BigNumber } from "@arkecosystem/platform-sdk-support";

export type RecipientListItem = {
	address: string;
	displayAmount?: string;
	amount?: BigNumber;
	assetSymbol?: string;
	isEditable?: boolean;
	label?: string;
	listIndex?: number;
	variant?: "condensed";
	walletName?: string;
	showAmount?: boolean;
	onRemove?: (address: string) => void;
};

export type RecipientList = {
	network?: string;
	assetSymbol?: string;
	isEditable?: boolean;
	recipients?: RecipientListItem[];
	showAmount?: boolean;
	label?: string;
	variant?: "condensed";
	onRemove?: (address: string) => void;
};
