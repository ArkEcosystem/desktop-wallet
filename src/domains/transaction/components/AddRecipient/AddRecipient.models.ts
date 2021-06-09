import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";

export interface AddRecipientProps {
	assetSymbol: string;
	singleLabel?: string;
	multipleLabel?: string;
	recipients?: RecipientListItem[];
	profile: Contracts.IProfile;
	labelText?: string;
	helpText?: string;
	showMultiPaymentOption?: boolean;
	disableMultiPaymentOption?: boolean;
	withDeeplink?: boolean;
	onChange?: (recipients: RecipientListItem[]) => void;
}

export interface ToggleButtonProps {
	isSingle: boolean;
	disableMultiple?: boolean;
	onChange: (isSingle: boolean) => void;
}
