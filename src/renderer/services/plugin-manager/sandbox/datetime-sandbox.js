import { DateTime } from "@arkecosystem/platform-sdk-intl";

export function create(walletApi) {
	return () => {
		if (!walletApi.utils) {
			walletApi.utils = {};
		}

		walletApi.utils.datetime = DateTime;
	};
}
