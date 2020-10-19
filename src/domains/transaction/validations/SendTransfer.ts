import { Coins } from "@arkecosystem/platform-sdk";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

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
	recipientAddress: (network: Coins.Network) => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.RECIPIENT"),
		}),
		validate: {
			valid: async (address: string) => {
				const instance: Coins.Coin = await env.coin(network?.coin(), network?.id());
				const isValidAddress: boolean = await instance.identity().address().validate(address);
				return isValidAddress || t("COMMON.VALIDATION.RECIPIENT_INVALID");
			},
		},
	}),
	amount: (network: Coins.Network, balance?: BigNumber) => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.AMOUNT"),
		}),
		validate: {
			valid: (amount: any) =>
				(balance?.isGreaterThanOrEqualTo(amount) && !balance?.isZero()) ||
				t("TRANSACTION.VALIDATION.LOW_BALANCE", {
					balance: balance?.toHuman(),
					coinId: network?.coin(),
				}),
		},
	}),
});
