import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const validateFee = (fee: { display: string; value: string }, min: string) => {
	if (fee?.value) {
		if (BigNumber.make(fee.value).isLessThan(min)) {
			return "TRANSACTION.PAGE_TRANSACTION_SEND.VALIDATION.FEE_BELOW_MINIMUM";
		}

		return "";
	}

	return "";
};
