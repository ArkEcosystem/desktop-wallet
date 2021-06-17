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

				const feeSatoshi = BigNumber.make(fee);

				if (feeSatoshi.isGreaterThan(balance)) {
					return t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance,
						coinId: network.coin(),
					});
				}

				if (feeSatoshi.isZero() && network && !network.chargesZeroFees()) {
					return t("COMMON.VALIDATION.FIELD_REQUIRED", {
						field: t("COMMON.FEE"),
					});
				}

				if (feeSatoshi.isNegative()) {
					return t("TRANSACTION.VALIDATION.FEE_NEGATIVE");
				}

				return true;
			},
		},
	}),
});
