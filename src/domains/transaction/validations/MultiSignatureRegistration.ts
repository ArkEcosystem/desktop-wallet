export const multiSignatureRegistration = (t: any) => ({
	participants: () => ({
		required: true,
		validate: (value: any[]) => Array.isArray(value) && value.length > 1,
	}),
	minParticipants: (participants: any[]) => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES"),
		}),
		min: {
			value: 2,
			message: t("COMMON.VALIDATION.FIELD_INVALID", {
				field: t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES"),
			}),
		},
		max: {
			value: Math.max(2, participants?.length || 0),
			message: t("COMMON.VALIDATION.FIELD_INVALID", {
				field: t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES"),
			}),
		},
	}),
});
