import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";

export const createProfile = (t: any, env: Environment) => ({
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
		validate: (value: string) =>
			!value ||
			value === passwordConfirmation ||
			t("COMMON.VALIDATION.SUBJECT_MISMATCH", {
				subject: t("COMMON.PASSWORDS"),
			}),
		minLength: {
			value: 6,
			message: t("COMMON.VALIDATION.MIN_LENGTH", {
				field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
				minLength: 6,
			}),
		},
	}),
	passwordConfirmation: (password: string) => ({
		validate: (value: string) =>
			!value ||
			value === password ||
			t("COMMON.VALIDATION.SUBJECT_MISMATCH", {
				subject: t("COMMON.PASSWORDS"),
			}),
	}),
	currency: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("SETTINGS.GENERAL.PERSONAL.CURRENCY"),
		}),
	}),
});
