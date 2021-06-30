import { Contracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { lowerCaseEquals } from "utils/equals";

export const createProfile = (t: any, environment: Environment) => ({
	currency: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("SETTINGS.GENERAL.PERSONAL.CURRENCY"),
		}).toString(),
	}),
	name: () => ({
		validate: {
			maxLength: (name: string) =>
				name.trim().length > 42
					? t("COMMON.VALIDATION.MAX_LENGTH", {
							field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
							maxLength: 42,
					  })
					: true,
			required: (name: string) =>
				!!name?.trim() ||
				t("COMMON.VALIDATION.FIELD_REQUIRED", {
					field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
				}).toString(),
			unique: (name: string) => {
				if (
					environment
						.profiles()
						.values()
						.some((profile: Contracts.IProfile) => lowerCaseEquals(profile.name(), name.trim()))
				) {
					return t("PROFILE.PAGE_CREATE_PROFILE.VALIDATION.NAME_EXISTS");
				}

				return true;
			},
		},
	}),
});
