import { NavigationBar } from "app/components/NavigationBar";
import React from "react";

import { Exchange } from "./Exchange";

export default { title: "Exchange / Pages / Exchange" };

export const Default = () => (
	<div>
		<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

		<Exchange exchanges={[]} />
	</div>
);

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

	return (
		<div>
			<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

			<Exchange exchanges={exchanges} />
		</div>
	);
};
