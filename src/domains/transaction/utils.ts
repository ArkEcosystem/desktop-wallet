import { Contracts } from "@arkecosystem/platform-sdk";
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

export const handleBroadcastError = ({ rejected, errors }: Contracts.BroadcastResponse) => {
	if (rejected.length === 0) {
		return;
	}

	throw new Error(Object.values(errors as object)[0]);
};
