import { validatePattern } from "utils/validations";

export const delegateRegistration = (t: any) => ({
	username: (usernames: string[]) => ({
		maxLength: {
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("COMMON.DELEGATE_NAME"),
				maxLength: 20,
			}),
			value: 20,
		},
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.DELEGATE_NAME"),
		}),
		validate: {
			pattern: (value: string) => validatePattern(t, value, /[\d!$&.@_a-z]+/),
			unique: (value: string) =>
				!usernames.includes(value) || t("COMMON.VALIDATION.EXISTS", { field: t("COMMON.DELEGATE_NAME") }),
		},
	}),
});
