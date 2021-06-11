import { Coins, Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

import { RecipientListItem } from "../components/RecipientList/RecipientList.models";

export const sendTransfer = (t: any) => ({
	senderAddress: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.SENDER_ADDRESS"),
		}),
	}),
	smartbridge: () => ({
		maxLength: {
			value: 255,
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("COMMON.SMARTBRIDGE"),
				maxLength: 255,
			}),
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
				const shouldRequire = !address && !recipients.length;
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
	amount: (
		network: Networks.Network,
		balance: BigNumber,
		recipients: RecipientListItem[],
		isSingleRecipient: boolean,
	) => ({
		validate: {
			valid: (amountValue: any) => {
				const amount = BigNumber.make(amountValue || 0);
				const hasSufficientBalance = balance?.isGreaterThanOrEqualTo(amount) && !balance?.isZero();
				const shouldRequire = isSingleRecipient || !recipients.length;

				if (!hasSufficientBalance) {
					return t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance: balance?.toHuman(),
						coinId: network?.coin(),
					});
				}

				if (shouldRequire) {
					if (amountValue === undefined || amountValue === "") {
						return t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.AMOUNT"),
						});
					}

					if (amount.isZero()) {
						return t("TRANSACTION.VALIDATION.AMOUNT_BELOW_MINIMUM", {
							min: "0.00000001",
							coinId: network.coin(),
						});
					}
				}

				return true;
			},
		},
	}),
});
