import { Coins } from "@arkecosystem/platform-sdk";

export const authentication = (t: any) => ({
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
				return t("COMMON.INPUT_PASSPHRASE.VALIDATION.MNEMONIC_NOT_MATCH_ADDRESS");
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
				return t("COMMON.INPUT_PASSPHRASE.VALIDATION.MNEMONIC_NOT_MATCH_PUBLIC_KEY");
			},
		},
	}),
});
