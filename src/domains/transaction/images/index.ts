import { ReactComponent as ConfirmTransactionLedgerBanner } from "./confirm-transaction-ledger-banner.svg";
import { ImagesDark } from "./dark";
import { ReactComponent as TransactionErrorBanner } from "./transaction-error-banner.svg";
import { ReactComponent as TransactionSuccessBanner } from "./transaction-success-banner.svg";

export const transaction = {
	ConfirmTransactionLedgerBanner,
	TransactionErrorBanner,
	TransactionSuccessBanner,
	...ImagesDark,
};
