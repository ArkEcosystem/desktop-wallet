import React from "react";

import { SendTransactionForm } from "./SendTransactionForm";

export default {
	title: "Transactions / Components / Send Transaction / Step 1",
};

const defaultFormValues = {
	maxAvailableAmount: 80,
	assetSymbol: "ARK",
	feeRange: {
		last: 10,
		min: 1,
		average: 14,
	},
	networks: [
		{
			value: "ark",
			label: "Ark Ecosystem",
			icon: "Ark",
			iconClassName: "border-theme-danger-200 text-theme-danger-400",
		},
	],
	defaultFee: 0,
	formDefaultData: {
		network: null,
		sender: null,
		amount: null,
		smartbridge: null,
		fee: 0,
	},
	senderList: [
		{
			address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "My Wallet",
			avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
			formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
		},
	],
	contactList: [
		{
			address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "Recipient Wallet",
			formatted: "Recipient Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
		},
		{
			address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "Recipient Multisig",
			formatted: " Recipient Multisig AhFJKDSALJFKA...SAJFKLASJKDFJ",
			isMultisig: true,
		},
		{
			address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "Recipient in Ark",
			formatted: "Recipient in Ark FAhFJKDSALJFK...SAJFKLASJKDFJ",
			isInArkNetwork: true,
		},
	],
};

export const Step1 = () => (
	<div>
		<SendTransactionForm {...defaultFormValues} />
	</div>
);
