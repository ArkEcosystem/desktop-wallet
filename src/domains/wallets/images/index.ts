import { ReactComponent as NameWalletBanner } from "./name-wallet.svg";
import { ReactComponent as WalletUpdateBanner } from "./wallet-update.svg";
import { ReactComponent as WalletUpdateReadyBanner } from "./wallet-update-ready.svg";

export const wallet = {
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
