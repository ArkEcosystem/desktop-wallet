import React from "react";

import { RecipientList } from "./RecipientList";

const recipients = [
	{
		address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 1",
		amount: "100",
		assetSymbol: "ARK",
	},
	{
		address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 2",
		isMultisig: true,
		amount: "100",
		assetSymbol: "ARK",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 3",
		isInArkNetwork: true,
		amount: "100",
		assetSymbol: "ARK",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 4",
		isInArkNetwork: true,
		amount: "100",
		assetSymbol: "ARK",
	},
];

export default {
	title: "Transactions / Components / RecipientList",
};

export const Step1 = () => (
	<div>
		<RecipientList recipients={recipients} isEditable={true} onRemove={console.log} assetSymbol="ARK" />
	</div>
);
