import { Coins, Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";

import { RecipientListItem } from "../components/RecipientList/RecipientList.models";

export const sendTransfer = (t: any) => ({
	amount: (
		network: Networks.Network,
		balance: number,
		recipients: RecipientListItem[],
		isSingleRecipient: boolean,
	) => ({
		validate: {
			valid: (amountValue: any) => {
				const amount = amountValue || 0;
				const hasSufficientBalance = Number(balance || 0) >= amount && balance !== 0;
				const shouldRequire = isSingleRecipient || recipients.length === 0;

				if (!hasSufficientBalance) {
					return t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance,
						coinId: network?.coin(),
					});
				}

				if (shouldRequire) {
					if (amountValue === undefined || amountValue === "") {
						return t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.AMOUNT"),
						});
					}

					if (amount === 0) {
						return t("TRANSACTION.VALIDATION.AMOUNT_BELOW_MINIMUM", {
							coinId: network?.coin(),
							min: "0.00000001",
						});
					}
				}

				return true;
			},
		},
	}),
	memo: () => ({
		maxLength: {
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("COMMON.MEMO"),
				maxLength: 255,
			}),
			value: 255,
		},
	}),
	network: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.CRYPTOASSET"),
		}),
	}),
	recipientAddress: (
		profile: Contracts.IProfile,
		network: Networks.Network,
		recipients: RecipientListItem[],
		isSingleRecipient: boolean,
	) => ({
		validate: {
			valid: async (addressValue: string | undefined) => {
				const address = (addressValue || "").trim();
				const shouldRequire = !address && recipients.length === 0;
				const hasAddedRecipients = !address && !isSingleRecipient && recipients.length > 0;

				if (!network) {
					return false;
				}

				if (hasAddedRecipients) {
					return true;
				}

				if (shouldRequire || !network) {
					return t("COMMON.VALIDATION.FIELD_REQUIRED", {
						field: t("COMMON.RECIPIENT"),
					});
				}

				const coin: Coins.Coin = profile.coins().set(network?.coin(), network?.id());
				const isValidAddress: boolean = await coin.address().validate(address);
				return isValidAddress || t("COMMON.VALIDATION.RECIPIENT_INVALID");
			},
		},
	}),
	recipients: () => ({
		validate: {
			valid: (recipients: RecipientListItem[]) => recipients.length > 0,
		},
	}),
	senderAddress: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.SENDER_ADDRESS"),
		}),
	}),
});
