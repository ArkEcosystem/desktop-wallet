import { contacts } from "domains/contact/data";
import { availableNetworksMock } from "domains/network/data";
import { wallets } from "domains/wallet/data";
import React from "react";

import { TransactionSend } from "./TransactionSend";

export default { title: "Domains / Transaction / Pages / Transaction Send" };
const defaultFormValues = {
	maxAvailableAmount: 80,
	assetSymbol: "ARK",
	feeRange: {
		last: 10,
		min: 1,
		average: 14,
	},
	networks: availableNetworksMock,
	defaultFee: 0,
	formDefaultData: {
		network: null,
		sender: null,
		amount: null,
		smartbridge: null,
		fee: 0,
	},
	contacts,
	wallets,
};

export const Default = () => (
	<div>
		<TransactionSend formValues={defaultFormValues} />
	</div>
);
