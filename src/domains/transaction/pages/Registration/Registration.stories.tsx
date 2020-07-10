import React from "react";

import { networks } from "../../data";
import { Registration } from "./Registration";

export default { title: "Domains / Transaction / Pages / Registration" };

const defaultFormValues = {
	networks,
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

export const Default = () => <Registration {...defaultFormValues} onDownload={() => alert("download")} />;
