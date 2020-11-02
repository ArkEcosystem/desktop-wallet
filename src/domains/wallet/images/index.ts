import { ReactComponent as WaitingLedgerDevice } from "./waiting-ledger-device.svg";
import { ReactComponent as WalletUpdateReadyBanner } from "./wallet-update-ready.svg";
import { ReactComponent as WalletUpdateBanner } from "./wallet-update.svg";

export const wallet = {
	components: {
		Ledger: {
			WaitingLedgerDevice,
		},
		walletUpdate: {
			WalletUpdateBanner,
			WalletUpdateReadyBanner,
		},
	},
};
