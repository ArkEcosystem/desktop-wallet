import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";

export type AddRecipientProps = {
	maxAvailableAmount: number;
	availableAmount: number;
	assetSymbol: string;
	isSingleRecipient?: boolean;
	singleLabel?: string;
	multipleLabel?: string;
	recipients?: RecipientListItem[];
	profile: Profile;
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
