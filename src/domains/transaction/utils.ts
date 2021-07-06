import { Services } from "@arkecosystem/platform-sdk";

export const isNoDeviceError = (error: any) => String(error).includes("no device found");

export const isRejectionError = (error: any) => String(error).includes("Condition of use not satisfied");

export const handleBroadcastError = ({ rejected, errors }: Services.BroadcastResponse) => {
	if (rejected.length === 0) {
		return;
	}

	throw new Error(Object.values(errors as object)[0]);
};
