import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const evaluateFee = (fee: any) => {
	if (fee?.value) return BigNumber.make(fee.value);

	return BigNumber.make(fee);
};
