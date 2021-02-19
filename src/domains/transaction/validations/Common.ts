import { Coins } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const common = (t: any) => ({
	fee: (balance: BigNumber = BigNumber.ZERO, network?: Coins.Network) => ({
		validate: {
			valid: (fee?: string | number) => {
				const feeSatoshi = BigNumber.make(fee || 0);

				if (!network?.coin()) {
					return true;
				}

				if (balance.isZero() || balance.isNegative()) {
					return t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance: "0",
						coinId: network.coin(),
					});
				}

				if (feeSatoshi.isGreaterThan(balance)) {
					return t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance: balance?.toHuman(),
						coinId: network.coin(),
					});
				}

				if (feeSatoshi.isZero() || feeSatoshi.isNegative()) {
					return t("TRANSACTION.VALIDATION.FEE_BELOW_MINIMUM", {
						min: 0,
						coinId: network.coin(),
					});
				}

				return true;
			},
		},
	}),
});
