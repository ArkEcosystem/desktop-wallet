import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useTranslation } from "react-i18next";

import { OptionsValue } from "./use-import-options";

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
		network: Networks.Network;
		type: string;
		value: WalletGenerationInput;
		encryptedWif: string;
	}): Promise<Contracts.IReadWriteWallet | undefined> => {
		const defaultOptions = {
			coin: network.coin(),
			network: network.id(),
		};

		switch (type) {
			case OptionsValue.BIP39:
				return profile.wallets().push(
					await profile.walletFactory().fromMnemonicWithBIP39({
						...defaultOptions,
						mnemonic: value,
					}),
				);

			case OptionsValue.BIP44:
				return profile.wallets().push(
					await profile.walletFactory().fromMnemonicWithBIP44({
						...defaultOptions,
						mnemonic: value,
					}),
				);

			case OptionsValue.BIP49:
				return profile.wallets().push(
					await profile.walletFactory().fromMnemonicWithBIP49({
						...defaultOptions,
						mnemonic: value,
					}),
				);

			case OptionsValue.BIP84:
				return profile.wallets().push(
					await profile.walletFactory().fromMnemonicWithBIP84({
						...defaultOptions,
						mnemonic: value,
					}),
				);

			case OptionsValue.ADDRESS:
				return profile.wallets().push(
					await profile.walletFactory().fromAddress({
						...defaultOptions,
						address: value,
					}),
				);

			case OptionsValue.PUBLIC_KEY:
				return profile.wallets().push(
					await profile.walletFactory().fromPublicKey({
						...defaultOptions,
						publicKey: value,
					}),
				);

			case OptionsValue.PRIVATE_KEY:
				return profile.wallets().push(
					await profile.walletFactory().fromPrivateKey({
						...defaultOptions,
						privateKey: value,
					}),
				);

			case OptionsValue.WIF:
				return profile.wallets().push(
					await profile.walletFactory().fromWIF({
						...defaultOptions,
						wif: value,
					}),
				);

			case OptionsValue.ENCRYPTED_WIF:
				return new Promise((resolve, reject) => {
					// `setTimeout` being used here to avoid blocking the thread
					// as the decryption is a expensive calculation
					setTimeout(() => {
						profile
							.walletFactory()
							.fromWIF({
								...defaultOptions,
								password: value,
								wif: encryptedWif,
							})
							.then((wallet) => {
								profile.wallets().push(wallet);
								return resolve(wallet);
							})
							.catch((error) => {
								/* istanbul ignore next */
								if (error.code === "ERR_ASSERTION") {
									return reject(
										new Error(t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.DECRYPT_WIF_ASSERTION")),
									);
								}

								reject(error);
							});
					}, 0);
				});

			case OptionsValue.SECRET:
				return profile.wallets().push(
					await profile.walletFactory().fromSecret({
						...defaultOptions,
						wif: value,
					}),
				);

			case OptionsValue.SECRET_WITH_ENCRYPTION:
				return new Promise((resolve, reject) => {
					// `setTimeout` being used here to avoid blocking the thread
					// as the decryption is a expensive calculation
					setTimeout(() => {
						profile
							.walletFactory()
							.fromSecret({
								...defaultOptions,
								password: value,
							})
							.then((wallet) => {
								profile.wallets().push(wallet);
								return resolve(wallet);
							})
							.catch((error) => {
								/* istanbul ignore next */
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
