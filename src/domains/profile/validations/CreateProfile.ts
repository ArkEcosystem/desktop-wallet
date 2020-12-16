import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";

export const createProfile = (t: any, env: Environment) => {
	const validatePasswords = (value: string, comparedValue: string) =>
		!value ||
		value === comparedValue ||
		t("COMMON.VALIDATION.SUBJECT_MISMATCH", {
			subject: t("COMMON.PASSWORDS"),
		});

	return {
		name: () => ({
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
			}),
			validate: {
				maxLength: (name: string) =>
					name.trim().length > 42
						? t("COMMON.VALIDATION.MAX_LENGTH", {
								field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
								maxLength: 42,
						  })
						: true,
				unique: (name: string) => {
					if (
						env
							.profiles()
							.values()
							.some((profile: Profile) => profile.name().toLowerCase() === name.trim().toLowerCase())
					) {
						return t("PROFILE.PAGE_CREATE_PROFILE.VALIDATION.NAME_EXISTS");
					}

					return true;
				},
			},
		}),
		password: (passwordConfirmation: string) => ({
			validate: (value: string) => validatePasswords(value, passwordConfirmation),
			minLength: {
				value: 6,
				message: t("COMMON.VALIDATION.MIN_LENGTH", {
					field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
					minLength: 6,
				}),
			},
		}),
		passwordConfirmation: (password: string) => ({
			validate: (value: string) => validatePasswords(value, password),
		}),
		currency: () => ({
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("SETTINGS.GENERAL.PERSONAL.CURRENCY"),
			}),
		}),
	};
};
