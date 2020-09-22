export const authentication = (t: any) => ({
	mnemonic: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.MNEMONIC"),
		}),
	}),
	secondMnemonic: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.SECOND_MNEMONIC"),
		}),
	}),
});
