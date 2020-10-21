import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";

export const authentication = (t: any) => ({
	mnemonic: (wallet: ReadWriteWallet) => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.MNEMONIC"),
		}),
		validate: {
			matchWalletAddress: async (value: string) => {
				const generatedAddress = await wallet.coin().identity().address().fromMnemonic(value);
				return generatedAddress === wallet.address();
			},
		},
	}),
	secondMnemonic: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.SECOND_MNEMONIC"),
		}),
	}),
});
