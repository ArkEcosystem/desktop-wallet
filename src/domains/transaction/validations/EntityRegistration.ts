import { sortBy, uniq } from "@arkecosystem/utils";
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
		validate: {
			pattern: (value: string) => {
				const matches = value.split(/[a-zA-Z0-9_!@$&.-]+$/).reduce((acc, curr) => curr ? acc + curr : acc, "");

				return matches.length ? t("COMMON.VALIDATION.FORBIDDEN_CHARACTERS", {
					characters: sortBy(uniq(matches)).map((char) => `'${char}'`).join(", "),
				}) : true;
			},
		},
	}),
	displayName: () => ({
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
	}),
	website: () => ({
		validate: {
			valid: (value: string) => {
				if (value && !yup.string().url().isValidSync(value)) {
					return t("COMMON.VALIDATION.FIELD_INVALID", {
						field: t("COMMON.WEBSITE"),
					});
				}

				return true;
			},
		},
	}),
});
