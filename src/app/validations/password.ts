import { pwnd, strong } from "password-pwnd";

export const password = (t: any) => ({
	password: (currentPassword?: string) => ({
		validate: async (password: string) => {
			if (!password) {
				return true;
			}

			if (!!currentPassword && currentPassword === password) {
				return t("COMMON.VALIDATION.PASSWORD_SAME_AS_OLD");
			}

			if (!(await strong(password))) {
				return t("COMMON.VALIDATION.PASSWORD_WEAK");
			}

			try {
				const hasBeenLeaked = await pwnd(password);

				if (hasBeenLeaked) {
					return t("COMMON.VALIDATION.PASSWORD_LEAKED");
				}
			} catch {
				// API might be unreachable, ignore this validation.
				return true;
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
