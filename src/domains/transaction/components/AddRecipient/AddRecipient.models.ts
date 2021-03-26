import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";

export type AddRecipientProps = {
	assetSymbol: string;
	singleLabel?: string;
	multipleLabel?: string;
	recipients?: RecipientListItem[];
	profile: Contracts.IProfile;
	labelText?: string;
	helpText?: string;
	showMultiPaymentOption?: boolean;
	withDeeplink?: boolean;
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
