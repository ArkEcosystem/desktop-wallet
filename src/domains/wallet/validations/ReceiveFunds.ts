export const receiveFunds = (t: any) => ({
	smartbridge: () => ({
		maxLength: {
			value: 255,
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("COMMON.SMARTBRIDGE"),
				maxLength: 255,
			}),
		},
	}),
});
