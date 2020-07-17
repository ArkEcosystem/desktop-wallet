import { contacts } from "domains/contact/data";
import { wallets } from "domains/wallet/data";
import React from "react";

import { networks } from "../../data";
import { SendTransactionForm } from "./SendTransactionForm";

export default {
	title: "Domains / Transaction / Components / SendTransactionForm",
};

const defaultFormValues = {
	maxAvailableAmount: 80,
	assetSymbol: "ARK",
	feeRange: {
		last: 10,
		min: 1,
		average: 14,
	},
	defaultFee: 0,
	formDefaultData: {
		network: null,
		sender: null,
		amount: null,
		smartbridge: null,
		fee: 0,
	},
	networks,
	contacts,
	wallets,
};

export const Default = () => (
	<div>
		<SendTransactionForm {...defaultFormValues} />
	</div>
);
