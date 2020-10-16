import * as yup from "yup";

export const entityRegistration = (t: any) => ({
	entityName: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.NAME"),
		}),
		minLength: {
			value: 3,
			message: t("COMMON.VALIDATION.MIN_LENGTH", {
				field: t("COMMON.NAME"),
				minLength: 3,
			}),
		},
		maxLength: {
			value: 128,
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("COMMON.NAME"),
				maxLength: 128,
			}),
		},
		pattern: /^[a-zA-Z0-9_-]+$/,
	}),
	displayName: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.NAME"),
		}),
		minLength: {
			value: 3,
			message: t("COMMON.VALIDATION.MIN_LENGTH", {
				field: t("COMMON.NAME"),
				minLength: 3,
			}),
		},
		maxLength: {
			value: 128,
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("COMMON.NAME"),
				maxLength: 128,
			}),
		},
	}),
	description: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.DESCRIPTION"),
		}),
		minLength: {
			value: 3,
			message: t("COMMON.VALIDATION.MIN_LENGTH", {
				field: t("COMMON.DESCRIPTION"),
				minLength: 3,
			}),
		},
		maxLength: {
			value: 512,
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("COMMON.DESCRIPTION"),
				maxLength: 512,
			}),
		},
	}),
	website: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.WEBSITE"),
		}),
		validate: {
			valid: (value: string) => {
				if (!yup.string().url().isValidSync(value)) {
					return t("COMMON.VALIDATION.FIELD_INVALID", {
						field: t("COMMON.WEBSITE"),
					}).toString();
				}
				return true;
			},
		},
	}),
});
