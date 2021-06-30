export const multiSignatureRegistration = (t: any) => ({
	minParticipants: (participants: any[]) => ({
		max: {
			message: t("COMMON.VALIDATION.FIELD_INVALID", {
				field: t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES"),
			}),
			value: Math.max(2, participants?.length || 0),
		},
		min: {
			message: t("COMMON.VALIDATION.FIELD_INVALID", {
				field: t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES"),
			}),
			value: 2,
		},
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES"),
		}),
	}),
	participants: () => ({
		required: true,
		validate: (value: any[]) => Array.isArray(value) && value.length > 1,
	}),
});
