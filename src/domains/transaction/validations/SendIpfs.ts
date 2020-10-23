export const sendIpfs = (t: any) => ({
	network: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.NETWORK"),
		}),
	}),
	senderAddress: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.SENDER_ADDRESS"),
		}),
	}),
	hash: () => ({
		validate: (value: string) =>
			/(Qm[A-HJ-NP-Za-km-z1-9]{44,45})/.test(value) ||
			t("TRANSACTION.INPUT_IPFS_HASH.VALIDATION.NOT_VALID").toString(),
	}),
});
