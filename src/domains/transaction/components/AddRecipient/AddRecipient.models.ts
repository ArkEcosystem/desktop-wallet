import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";

export type AddRecipientProps = {
	maxAvailableAmount: BigNumber;
	assetSymbol: string;
	singleLabel?: string;
	multipleLabel?: string;
	recipients?: RecipientListItem[];
	profile: Profile;
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
