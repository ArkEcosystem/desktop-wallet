import React from "react";

import { Registration } from "./Registration";

export default { title: "Domains / Transaction / Pages / Registration" };

const defaultFormValues = {
	networks: [
		{
			icon: "Ark",
			name: "Ark Ecosystem",
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

export const Default = () => <Registration {...defaultFormValues} onDownload={() => alert("download")} />;
