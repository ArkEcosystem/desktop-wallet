import { Utils } from "@arkecosystem/platform-sdk";

export function create(walletApi) {
	return () => {
		if (!walletApi.utils) {
			walletApi.utils = {};
		}

		walletApi.utils.bigNumber = Utils.BigNumber;
	};
}
