import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { debounceAsync } from "utils/debounce";

export const authentication = (t: any) => {
	const addressFromEncryptedPassword = async (wallet: Contracts.IReadWriteWallet, password: string) => {
		try {
			const wif = await wallet.wif().get(password);
			const { address } = await wallet.coin().address().fromWIF(wif);

			return address;
		} catch {
			return undefined;
		}
	};

	const addressFromPassword = debounceAsync(addressFromEncryptedPassword, 700);

	return {
		encryptionPassword: (wallet: Contracts.IReadWriteWallet) => ({
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("TRANSACTION.ENCRYPTION_PASSWORD"),
			}),
			validate: async (password: string) => {
				const address = await addressFromPassword(wallet, password);

				if (address === wallet.address()) {
					return true;
				}

				return t("COMMON.INPUT_PASSPHRASE.VALIDATION.PASSWORD_NOT_MATCH_WALLET");
			},
		}),
		mnemonic: (wallet: Contracts.IReadWriteWallet) => ({
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("COMMON.MNEMONIC"),
			}),
			validate: {
				matchSenderAddress: async (mnemonic: string) => {
					try {
						const { address } = await wallet.coin().address().fromMnemonic(mnemonic);

						if (address === wallet.address()) {
							return true;
						}

						return t("COMMON.INPUT_PASSPHRASE.VALIDATION.MNEMONIC_NOT_MATCH_WALLET");
					} catch {
						return t("COMMON.INPUT_PASSPHRASE.VALIDATION.MNEMONIC_NOT_MATCH_WALLET");
					}
				},
			},
		}),
		privateKey: (wallet: Contracts.IReadWriteWallet) => ({
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("COMMON.PRIVATE_KEY"),
			}),
			validate: async (privateKey: string) => {
				const { address } = await wallet.coin().address().fromPrivateKey(privateKey);

				if (address === wallet.address()) {
					return true;
				}

				return t("COMMON.INPUT_PASSPHRASE.VALIDATION.PRIVATE_KEY_NOT_MATCH_WALLET");
			},
		}),
		secondMnemonic: (coin: Coins.Coin, secondPublicKey: string) => ({
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("COMMON.SECOND_MNEMONIC"),
			}),
			validate: {
				matchSenderPublicKey: async (mnemonic: string) => {
					try {
						const { publicKey } = await coin.publicKey().fromMnemonic(mnemonic);

						if (publicKey === secondPublicKey) {
							return true;
						}

						return t("COMMON.INPUT_PASSPHRASE.VALIDATION.MNEMONIC_NOT_MATCH_WALLET");
					} catch {
						return t("COMMON.INPUT_PASSPHRASE.VALIDATION.MNEMONIC_NOT_MATCH_WALLET");
					}
				},
			},
		}),
		secret: (wallet: Contracts.IReadWriteWallet) => ({
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("COMMON.SECRET"),
			}),
			validate: async (secret: string) => {
				const { address } = await wallet.coin().address().fromSecret(secret);

				if (address === wallet.address()) {
					return true;
				}

				return t("COMMON.INPUT_PASSPHRASE.VALIDATION.SECRET_NOT_MATCH_WALLET");
			},
		}),
		wif: (wallet: Contracts.IReadWriteWallet) => ({
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("COMMON.WIF"),
			}),
			validate: {
				matchSenderAddress: async (wif: string) => {
					const { address } = await wallet.coin().address().fromWIF(wif);

					if (address === wallet.address()) {
						return true;
					}

					return t("COMMON.INPUT_PASSPHRASE.VALIDATION.WIF_NOT_MATCH_WALLET");
				},
			},
		}),
	};
};
