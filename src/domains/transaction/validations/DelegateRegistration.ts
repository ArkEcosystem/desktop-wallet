import { validatePattern } from "utils/validations";

export const delegateRegistration = (t: any) => ({
	username: (usernames: string[]) => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.DELEGATE_NAME"),
		}),
		maxLength: {
			value: 20,
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("COMMON.DELEGATE_NAME"),
				maxLength: 20,
			}),
		},
		validate: {
			pattern: (value: string) => validatePattern(t, value, /[a-z0-9!@$&_.]+/),
			unique: (value: string) =>
				!usernames.includes(value) || t("COMMON.VALIDATION.EXISTS", { field: t("COMMON.DELEGATE_NAME") }),
		},
	}),
});
