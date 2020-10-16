import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";

import { RecipientList } from "./RecipientList";

const recipients = [
	{
		address: "FJKDSALJFKASLJFKSDAJD333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 1",
		amount: BigNumber.make("100"),
		assetSymbol: "ARK",
	},
	{
		address: "AhFJKDSALJFKASLJFKSDEAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 2",
		amount: BigNumber.make("100"),
		assetSymbol: "ARK",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 3",
		amount: BigNumber.make("100"),
		assetSymbol: "ARK",
	},
	{
		address: "FAhFJKDSALJFKASLJFKSFDAJ333FKFKDSAJFKSAJFKLASJKDFJ",
		walletName: "Recipient 4",
		amount: BigNumber.make("100"),
		assetSymbol: "ARK",
	},
];

export default {
	title: "Domains / Transaction / Components / RecipientList",
};

export const Step1 = () => (
	<div>
		<RecipientList recipients={recipients} isEditable={true} onRemove={console.log} assetSymbol="ARK" />
	</div>
);
