import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";

export interface AddRecipientProperties {
	assetSymbol: string;
	singleLabel?: string;
	multipleLabel?: string;
	recipients?: RecipientListItem[];
	profile: Contracts.IProfile;
	wallet?: Contracts.IReadWriteWallet;
	labelText?: string;
	helpText?: string;
	showMultiPaymentOption?: boolean;
	disableMultiPaymentOption?: boolean;
	withDeeplink?: boolean;
	onChange?: (recipients: RecipientListItem[]) => void;
	onTypeChange?: (isSingle: boolean) => void;
}

export interface ToggleButtonProperties {
	maxRecipients: number;
	isSingle: boolean;
	disableMultiple?: boolean;
	onChange: (isSingle: boolean) => void;
}
