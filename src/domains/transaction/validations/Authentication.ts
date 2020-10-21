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
	secondMnemonic: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.SECOND_MNEMONIC"),
		}),
	}),
});
