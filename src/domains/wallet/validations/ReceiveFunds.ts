export const receiveFunds = (t: any) => ({
	memo: () => ({
		maxLength: {
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("COMMON.MEMO"),
				maxLength: 255,
			}),
			value: 255,
		},
	}),
});
