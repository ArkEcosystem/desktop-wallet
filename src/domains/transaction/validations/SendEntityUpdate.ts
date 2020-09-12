import * as yup from "yup";

export const sendEntityUpdate = (t: any) => ({
	name: () => ({
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
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.DESCRIPTION"),
		}),
	}),
	website: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.WEBSITE"),
		}),
		validate: {
			valid: (value: string) => {
				if (!yup.string().url().isValidSync(value)) {
					return t("TRANSACTION.INVALID_URL");
				}
				return true;
			},
		},
	}),
});
