import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const common = (t: any) => ({
	fee: (fees: Contracts.TransactionFee, balance: BigNumber = BigNumber.ZERO, network?: Coins.Network) => ({
		validate: {
			valid: (fee?: string | number) => {
				const feeSatoshi = BigNumber.make(fee || 0);

				if (!network?.coin()) {
					return true;
				}

				if (balance.isZero() || balance.isNegative()) {
					return t("TRANSACTION.VALIDATION.EMPTY_BALANCE");
				}

				if (feeSatoshi.isGreaterThan(balance)) {
					return t("TRANSACTION.VALIDATION.LOW_BALANCE", {
						balance: balance?.toHuman(),
						coinId: network.coin(),
					});
				}

				if (feeSatoshi.isLessThan(fees?.min)) {
					return t("TRANSACTION.VALIDATION.FEE_BELOW_MINIMUM");
				}

				if (feeSatoshi.isGreaterThan(fees?.max)) {
					return t("TRANSACTION.VALIDATION.FEE_ABOVE_MAXIMUM");
				}

				return true;
			},
		},
	}),
});
