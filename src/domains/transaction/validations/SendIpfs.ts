import isIPFS from "is-ipfs";

export const sendIpfs = (t: any) => ({
	hash: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("TRANSACTION.IPFS_HASH"),
		}),
		validate: (value: string) =>
			isIPFS.cid(value) ||
			t("COMMON.VALIDATION.FIELD_INVALID", {
				field: t("TRANSACTION.IPFS_HASH"),
			}),
	}),
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
});
