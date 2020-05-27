import { BigNumber } from "@arkecosystem/platform-sdk-support";

export function create(walletApi) {
	return () => {
		if (!walletApi.utils) {
			walletApi.utils = {};
		}

		walletApi.utils.bigNumber = BigNumber;
	};
}
