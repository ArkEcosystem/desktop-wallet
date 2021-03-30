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
	buttonTooltip?: string;
	disableButton?: (address: string) => boolean;
	onRemove?: (index: number) => void;
};

export type RecipientList = {
	network?: string;
	assetSymbol?: string;
	isEditable?: boolean;
	recipients?: RecipientListItem[];
	showAmount?: boolean;
	label?: string;
	variant?: "condensed";
	buttonTooltip?: string;
	disableButton?: (address: string) => boolean;
	onRemove?: (index: number) => void;
};
