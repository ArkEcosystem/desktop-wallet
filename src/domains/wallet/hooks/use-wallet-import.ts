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
	}: {
		network: Coins.Network;
		type: string;
		value: WalletGenerationInput;
		encryptedWif: string;
	}): Promise<Contracts.IReadWriteWallet | undefined> => {
		switch (type) {
			case "mnemonic":
				return profile.wallets().push(
					await profile.walletFactory().fromMnemonicWithBIP39({
						coin: network.coin(),
						network: network.id(),
						mnemonic: value,
					}),
				);

			case "address":
				return profile.wallets().push(
					await profile.walletFactory().fromAddress({
						coin: network.coin(),
						network: network.id(),
						address: value,
					}),
				);

			case "privateKey":
				return profile.wallets().push(
					await profile.walletFactory().fromPrivateKey({
						coin: network.coin(),
						network: network.id(),
						privateKey: value,
					}),
				);

			case "wif":
				return profile.wallets().push(
					await profile.walletFactory().fromWIF({
						coin: network.coin(),
						network: network.id(),
						wif: value,
					}),
				);

			case "encryptedWif":
				return new Promise((resolve, reject) => {
					// `setTimeout` being used here to avoid blocking the thread
					// as the decryption is a expensive calculation
					setTimeout(() => {
						profile
							.walletFactory()
							.fromWIFWith({
								coin: network.coin(),
								network: network.id(),
								wif: encryptedWif,
								password: value,
							})
							.then((wallet) => {
								profile.wallets().push(wallet);
								return resolve(wallet);
							})
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
