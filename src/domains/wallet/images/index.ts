import { ReactComponent as NameWalletBanner } from "./name-wallet.svg";
import { ReactComponent as WaitingLedgerDevice } from "./waiting-ledger-device.svg";
import { ReactComponent as WalletUpdateReadyBanner } from "./wallet-update-ready.svg";
import { ReactComponent as WalletUpdateBanner } from "./wallet-update.svg";

export const wallet = {
	common: {
		WaitingLedgerDevice,
	},
	components: {
		updateWalletName: {
			NameWalletBanner,
		},
		walletUpdate: {
			WalletUpdateBanner,
			WalletUpdateReadyBanner,
		},
	},
};
