export const createProfile = (t: any) => ({
	name: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
		}).toString(),
		maxLength: {
			value: 42,
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
				maxLength: 42,
			}),
		},
	}),
	password: () => ({
		minLength: {
			value: 6,
			message: t("COMMON.VALIDATION.MIN_LENGTH", {
				field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
				minLength: 6,
			}),
		},
	}),
	confirmPassword: (password: string) => ({
		validate: (confirmPassword: string) => !!password && password !== confirmPassword ? t("COMMON.VALIDATION.PASSWORD_MISMATCH") : true,
	}),
	currency: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("SETTINGS.GENERAL.PERSONAL.CURRENCY"),
		}).toString(),
	}),
});
