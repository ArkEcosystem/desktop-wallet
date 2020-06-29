import React from "react";

import { Registration } from "./Registration";

export default { title: "Transactions / Pages / Registration" };

const defaultFormValues = {
	networks: [
		{
			value: "ark",
			label: "Ark Ecosystem",
			icon: "Ark",
			iconClassName: "border-theme-danger-200 text-theme-danger-400",
		},
	],
	registrationTypes: [
		{
			value: "business",
			label: "Business",
		},
	],
	formDefaultData: {
		network: null,
		address: null,
	},
	addresses: [
		{
			address: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
			walletName: "My Wallet",
			avatarId: "FJKDSALJFKASLJFKSDAJFKFKDSAJFKSAJFKLASJKDFJ",
			formatted: "My Wallet FJKDSALJFKASL...SAJFKLASJKDFJ",
		},
	],
};

export const Default = () => <Registration {...defaultFormValues} />;
