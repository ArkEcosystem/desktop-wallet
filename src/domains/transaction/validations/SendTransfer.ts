import { Coins } from "@arkecosystem/platform-sdk";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

import { RecipientListItem } from "../components/RecipientList/RecipientList.models";

export const sendTransfer = (t: any, env: Environment) => ({
	fee: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.FEE"),
		}),
	}),
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
			field: t("COMMON.NETWORK"),
		}),
	}),
	recipientAddress: (network: Coins.Network, recipients: RecipientListItem[], isSingleRecipient: boolean) => ({
		validate: {
			valid: async (addressValue: string) => {
				const address = addressValue.trim();
				const shouldRequire = !address && !recipients.length;
				const hasAddedRecipients = !address && !isSingleRecipient && recipients.length > 0;

				if (hasAddedRecipients) return true;

				if (shouldRequire)
					return t("COMMON.VALIDATION.FIELD_REQUIRED", {
						field: t("COMMON.RECIPIENT"),
					});

				const coin: Coins.Coin = await env.coin(network?.coin(), network?.id());
				const isValidAddress: boolean = await coin.identity().address().validate(address);
				return isValidAddress || t("COMMON.VALIDATION.RECIPIENT_INVALID");
			},
		},
	}),
	amount: (
		network: Coins.Network,
		balance: BigNumber,
		recipients: RecipientListItem[],
		isSingleRecipient: boolean,
	) => ({
		validate: {
			valid: (amountValue: any = BigNumber.ZERO) => {
				const amount = BigNumber.make(amountValue);
				const shouldRequire = amount.isZero() && (isSingleRecipient || !recipients.length);
				const hasSufficientBalance = balance?.isGreaterThanOrEqualTo(amount) && !balance?.isZero();

				if (shouldRequire)
					return t("COMMON.VALIDATION.FIELD_REQUIRED", {
						field: t("COMMON.AMOUNT"),
					});

				return (
					hasSufficientBalance ||
					t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance: balance?.toHuman(),
						coinId: network?.coin(),
					})
				);
			},
		},
	}),
});
