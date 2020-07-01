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
	assets: [
		{
			icon: "Ark",
			name: "ARK Ecosystem",
			className: "text-theme-danger-400 border-theme-danger-200",
		},
		{
			icon: "Bitcoin",
			name: "Bitcoin",
			className: "text-theme-warning-400 border-theme-warning-200",
		},
		{
			icon: "Ethereum",
			name: "Ethereum",
			className: "text-theme-neutral-800 border-theme-neutral-600",
		},
		{
			icon: "Lisk",
			name: "Lisk",
			className: "text-theme-primary-600 border-theme-primary-400",
		},
		{
			icon: "Ripple",
			name: "Ripple",
			className: "text-theme-primary-700 border-theme-primary-500",
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

export const Default = () => (
	<div className="mt-15">
		<TransactionSend formValues={defaultFormValues} />
	</div>
);
