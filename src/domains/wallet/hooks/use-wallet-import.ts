import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { useTranslation } from "react-i18next";

type PrivateKey = string;
type Mnemonic = string;
type WIF = string;
type Address = string;

export type WalletGenerationInput = PrivateKey | Mnemonic | WIF | Address;

export const useWalletImport = ({ profile }: { profile: Profile }) => {
	const { t } = useTranslation();

	const importWalletByType = async ({
		network,
		type,
		value,
		encryptedWif,
		password,
	}: {
		network: Coins.Network;
		type: string;
		value: WalletGenerationInput;
		encryptedWif: string;
		password?: string;
	}): Promise<ReadWriteWallet | undefined> => {
		switch (type) {
			case "mnemonic":
				if (password) {
					return profile
						.wallets()
						.importByMnemonicWithEncryption(value, network.coin(), network.id(), password);
				}

				return profile.wallets().importByMnemonic(value, network.coin(), network.id());

			case "address":
				return profile.wallets().importByAddress(value, network.coin(), network.id());

			case "privateKey":
				return profile.wallets().importByPrivateKey(network.coin(), network.id(), value);

			case "wif":
				return profile.wallets().importByWIF({ coin: network.coin(), network: network.id(), wif: value });

			case "encryptedWif":
				try {
					// `setTimeout` being used here to avoid blocking the thread
					// as the decryption is a expensive calculation
					return new Promise((resolve, reject) => {
						setTimeout(
							() =>
								profile
									.wallets()
									.importByWIFWithEncryption({
										coin: network.coin(),
										network: network.id(),
										wif: encryptedWif,
										password: value,
									})
									.then(resolve, reject),
							0,
						);
					});
				} catch (e) {
					/* istanbul ignore else */
					if (e.code === "ERR_ASSERTION") {
						throw new Error(t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.DECRYPT_WIF_ASSERTION"));
					}
					throw e;
				}

			default:
				return;
		}
	};

	return { importWalletByType };
};
