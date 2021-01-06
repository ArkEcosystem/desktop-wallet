import React from "react";

import { Exchange } from "./Exchange";

export default { title: "Domains / Exchange / Pages / Exchange" };

export const Default = () => <Exchange />;

export const WithExchanges = () => {
	const exchanges = [
		{
			id: "changenow-plugin",
			name: "ChangeNOW Plugin",
		},
		{
			id: "binance",
			name: "Binance",
		},
		{
			id: "atomars",
			name: "Atomars",
		},
		{
			id: "okex",
			name: "OKEx",
		},
	];

	return <Exchange />;
};
