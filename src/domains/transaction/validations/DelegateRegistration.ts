export const delegateRegistration = (t: any) => ({
	username: () => ({
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
		pattern: {
			value: /^[a-z0-9!@$&_.]+$/,
			message: t("COMMON.VALIDATION.FIELD_INVALID", {
				field: t("COMMON.DELEGATE_NAME"),
			}),
		},
	}),
});
