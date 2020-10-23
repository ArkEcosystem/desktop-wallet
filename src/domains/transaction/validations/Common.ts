import { Contracts } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const common = (t: any) => ({
	fee: (fees: Contracts.TransactionFee) => ({
		validate: {
			valid: (fee?: string | number) => {
				const feeSatoshi = BigNumber.make(fee || 0);
				console.log("validating fee", fees, fee);

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
