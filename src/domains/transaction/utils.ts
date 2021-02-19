import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const evaluateFee = (fee: any) => {
	if (fee?.value) {
		return BigNumber.make(fee.value);
	}

	return BigNumber.make(fee);
};

export const isMnemonicError = (error: any) => String(error).includes("Signatory should be");

export const isNoDeviceError = (error: any) => String(error).includes("no device found");

export const isRejectionError = (error: any) => String(error).includes("Condition of use not satisfied");
