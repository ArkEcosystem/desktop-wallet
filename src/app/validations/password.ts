import { pwnd, strong } from "password-pwnd";

export const password = (t: any) => ({
	password: (currentPassword?: string) => ({
		validate: async (password: string) => {
			if (!!currentPassword && currentPassword === password) {
				return t("COMMON.VALIDATION.PASSWORD_SAME_AS_OLD");
			}

			if (password) {
				if (!(await strong(password))) {
					return t("COMMON.VALIDATION.PASSWORD_WEAK");
				}

				try {
					const isPwned = await pwnd(password);

					if (isPwned) {
						return t("COMMON.VALIDATION.PASSWORD_PWNED");
					}
				} catch {
					// API might be unreachable, ignore this validation.
					return true;
				}
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
