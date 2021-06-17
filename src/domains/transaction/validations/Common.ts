import { Networks } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const common = (t: any) => ({
	fee: (balance = 0, network?: Networks.Network) => ({
		validate: {
			valid: (fee?: string | number) => {
				if (fee === undefined || fee === "") {
					return t("COMMON.VALIDATION.FIELD_REQUIRED", {
						field: t("COMMON.FEE"),
					});
				}

				if (!network?.coin()) {
					return true;
				}

				if (balance === 0 || Math.sign(balance) === -1) {
					return t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance: "0",
						coinId: network.coin(),
					});
				}

				if (fee > balance) {
					return t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance,
						coinId: network.coin(),
					});
				}

				if (fee === 0 && network && !network.chargesZeroFees()) {
					return t("COMMON.VALIDATION.FIELD_REQUIRED", {
						field: t("COMMON.FEE"),
					});
				}

				if (Math.sign(fee) === -1) {
					return t("TRANSACTION.VALIDATION.FEE_NEGATIVE");
				}

				return true;
			},
		},
	}),
});
