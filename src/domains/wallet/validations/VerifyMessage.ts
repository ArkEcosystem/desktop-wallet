export const verifyMessage = (t: any) => ({
	jsonString: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("WALLETS.MODAL_VERIFY_MESSAGE.JSON_STRING"),
		}),
		validate: {
			valid: (jsonString: string) => {
				const invalidError = t("COMMON.VALIDATION.FIELD_INVALID", {
					field: t("WALLETS.MODAL_VERIFY_MESSAGE.JSON_STRING"),
				});

				try {
					const data = JSON.parse(jsonString);

					if (data.signatory === undefined || data.message === undefined || data.signature === undefined) {
						return invalidError;
					}
				} catch {
					return invalidError;
				}

				return true;
			},
		},
	}),
});
