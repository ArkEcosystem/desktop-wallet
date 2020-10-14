import { BigNumber } from "@arkecosystem/platform-sdk-support";

type Currency = {
	display: string;
	value: string;
};

export const common = (t: any) => ({
	fee: (min: string) => ({
		validate: {
			valid: (fee: Currency) => {
				if (fee?.value) {
					if (BigNumber.make(fee.value).isLessThan(min)) {
						return t("TRANSACTION.VALIDATION.FEE_BELOW_MINIMUM");
					}
				}

				return true;
			},
		},
	}),
});
