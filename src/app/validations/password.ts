export const password = (t: any) => ({
	password: (currentPassword: string) => ({
		minLength: {
			value: 6,
			message: t("COMMON.VALIDATION.MIN_LENGTH", {
				field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
				minLength: 6,
			}),
		},
		validate: (password: string) => {
			if (password === currentPassword) {
				return t("COMMON.VALIDATION.PASSWORD_SAME_AS_OLD");
			}

			return true;
		},
	}),
	confirmPassword: (password: string) => ({
		required: t("COMMON.VALIDATION.CONFIRM_PASSWORD_REQUIRED"),
		validate: (confirmPassword: string) => {
			if (!password) {
				return t("COMMON.VALIDATION.FIELD_REQUIRED", {
					field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
				}).toString();
			}

			if (password !== confirmPassword) {
				return t("COMMON.VALIDATION.PASSWORD_MISMATCH");
			}

			return true;
		},
	}),
	confirmOptionalPassword: (password: string) => ({
		validate: (confirmPassword: string) =>
			!!password && password !== confirmPassword ? t("COMMON.VALIDATION.PASSWORD_MISMATCH") : true,
	}),
});
