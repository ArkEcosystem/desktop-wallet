export type RecipientListItem = {
	amount: number | string;
	address: string;
	walletName?: string;
	assetSymbol?: string;
	isMultisig?: boolean;
	isInArkNetwork?: boolean;
	isEditable?: boolean;
	onRemove?: (address: string) => void;
};

export type RecipientList = {
	onRemove?: (address: string) => void;
	assetSymbol: string;
	isEditable?: boolean;
	recipients?: RecipientListItem[];
};
