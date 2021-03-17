export const encryptPassword = (t: any) => ({
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
		validate: (confirmPassword: string) => {
			if (!password) {
				return false;
			}

			return password !== confirmPassword ? t("COMMON.VALIDATION.PASSWORD_MISMATCH") : true;
		},
	}),
});
