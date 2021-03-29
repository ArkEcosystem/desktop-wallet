import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { debounceAsync } from "utils/debounce";

export const authentication = (t: any) => {
	const addressFromEncryptedPassword = async (wallet: Contracts.IReadWriteWallet, password: string) =>
		wallet
			.wif(password)
			.then((wif) => wallet.coin().identity().address().fromWIF(wif))
			.catch(() => undefined);

	const addressFromPassword = debounceAsync(addressFromEncryptedPassword, 700);

	return {
		mnemonic: (coin: Coins.Coin, senderAddress: string) => ({
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("COMMON.MNEMONIC"),
			}),
			validate: {
				matchSenderAddress: async (mnemonic: string) => {
					const generatedAddress = await coin.identity().address().fromMnemonic(mnemonic);

					if (generatedAddress === senderAddress) {
						return true;
					}

					return t("COMMON.INPUT_PASSPHRASE.VALIDATION.MNEMONIC_NOT_MATCH_WALLET");
				},
			},
		}),
		secondMnemonic: (coin: Coins.Coin, secondPublicKey: string) => ({
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("COMMON.SECOND_MNEMONIC"),
			}),
			validate: {
				matchSenderPublicKey: async (mnemonic: string) => {
					const generatedPublicKey = await coin.identity().publicKey().fromMnemonic(mnemonic);

					if (generatedPublicKey === secondPublicKey) {
						return true;
					}

					return t("COMMON.INPUT_PASSPHRASE.VALIDATION.MNEMONIC_NOT_MATCH_WALLET");
				},
			},
		}),
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
	};
};
