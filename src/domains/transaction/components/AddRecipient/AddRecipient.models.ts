import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";

export type AddRecipientProps = {
	maxAvailableAmount: number;
	availableAmount: number;
	assetSymbol: string;
	isSingleRecipient?: boolean;
	singleLabel?: string;
	multipleLabel?: string;
	recipients?: RecipientListItem[];
	contacts?: any;
	labelText?: string;
	helpText?: string;
	onChange?: (recipients: RecipientListItem[]) => void;
};

export type ToggleButtonProps = {
	labelText?: string;
	helpText?: string;
	isSingle?: boolean;
	singleLabel?: string;
	multipleLabel?: string;
	onChange?: (isSingle: boolean) => void;
};
