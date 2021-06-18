import { BigNumber } from "@arkecosystem/platform-sdk-support";

export interface RecipientListItem {
	address: string;
	displayAmount?: string;
	amount?: BigNumber;
	exchangeAmount?: BigNumber;
	exchangeTicker?: string;
	assetSymbol?: string;
	isEditable?: boolean;
	label?: string;
	listIndex?: number;
	variant?: "condensed";
	walletName?: string;
	showAmount?: boolean;
	normalizeAmount?: boolean;
	tooltipDisabled?: string;
	disableButton?: (address: string) => boolean;
	onRemove?: (index: number) => void;
}

export interface RecipientList {
	network?: string;
	assetSymbol?: string;
	isEditable?: boolean;
	recipients?: RecipientListItem[];
	showAmount?: boolean;
	normalizeAmount?: boolean;
	label?: string;
	variant?: "condensed";
	tooltipDisabled?: string;
	disableButton?: (address: string) => boolean;
	onRemove?: (index: number) => void;
}
