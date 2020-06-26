import { ReactComponent as NameWalletBanner } from "./name-wallet.svg";
import { ReactComponent as WaitingLedger } from "./waiting-ledger.svg";
import { ReactComponent as WalletUpdateReadyBanner } from "./wallet-update-ready.svg";
import { ReactComponent as WalletUpdateBanner } from "./wallet-update.svg";

export const wallet = {
	components: {
		LedgerWallet: {
			WaitingLedger,
		},
		updateWalletName: {
			NameWalletBanner,
		},
		walletUpdate: {
			WalletUpdateBanner,
			WalletUpdateReadyBanner,
		},
	},
};
