import React from "react";

import { AddRecipient } from "./AddRecipient";

export default {
	title: "Domains / Transaction / Components / AddRecipient",
};

const recipients = [
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
];
export const Step1 = () => (
	<div className="p-8">
		<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} recipients={recipients} />
	</div>
);
