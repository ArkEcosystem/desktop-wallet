import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useTranslation } from "react-i18next";

type PrivateKey = string;
type Mnemonic = string;
type WIF = string;
type Address = string;

export type WalletGenerationInput = PrivateKey | Mnemonic | WIF | Address;

export const useWalletImport = ({ profile }: { profile: Contracts.IProfile }) => {
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
	}): Promise<Contracts.IReadWriteWallet | undefined> => {
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
				return new Promise((resolve, reject) => {
					// `setTimeout` being used here to avoid blocking the thread
					// as the decryption is a expensive calculation
					setTimeout(() => {
						profile
							.wallets()
							.importByWIFWithEncryption({
								coin: network.coin(),
								network: network.id(),
								wif: encryptedWif,
								password: value,
							})
							.then(resolve)
							.catch((error) => {
								if (error.code === "ERR_ASSERTION") {
									return reject(
										new Error(t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.DECRYPT_WIF_ASSERTION")),
									);
								}

								reject(error);
							});
					}, 0);
				});

			default:
				return;
		}
	};

	return { importWalletByType };
};
