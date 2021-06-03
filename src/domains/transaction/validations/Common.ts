import { Networks } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const common = (t: any) => ({
	fee: (balance: BigNumber = BigNumber.ZERO, network?: Networks.Network) => ({
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

				if (balance.isZero() || balance.isNegative()) {
					return t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance: "0",
						coinId: network.coin(),
					});
				}

				const feeSatoshi = BigNumber.make(fee);

				if (feeSatoshi.isGreaterThan(balance)) {
					return t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance: balance?.toHuman(),
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
