export const receiveFunds = (t: any) => ({
	memo: () => ({
		maxLength: {
			value: 255,
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("COMMON.MEMO"),
				maxLength: 255,
			}),
		},
	}),
});
