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
	recipients: () => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.RECIPIENTS"),
		}),
		validate: {
			valid: (value: string) => {
				if (Array.isArray(value) && value.length > 0) return true;
				return t("COMMON.VALIDATION.MIN_RECIPIENTS");
			},
		},
	}),
	recipientAddress: (network: Coins.Network) => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.RECIPIENT"),
		}),
		validate: {
			valid: async (address: string) => {
				if (!network) return true; // skip if network is not set

				const instance: Coins.Coin = await env.coin(network?.coin(), network?.id());
				const isValidAddress: boolean = await instance.identity().address().validate(address);
				return isValidAddress || t("COMMON.VALIDATION.RECIPIENT_INVALID");
			},
		},
	}),
	amount: (network: Coins.Network, availableAmount?: BigNumber) => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("COMMON.AMOUNT"),
		}),
		validate: {
			valid: (balance: any) => {
				if (!network) return true; // skip if network is not set
				return (
					availableAmount?.isGreaterThanOrEqualTo(balance) ||
					t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance,
						coinId: network.coin(),
					})
				);
			},
		},
	}),
});
