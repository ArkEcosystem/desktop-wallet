import { text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { Breadcrumbs } from "./Breadcrumbs";

export default {
	title: "Components / Breadcrumbs",
	decorators: [withKnobs],
};

export const Default = () => {
	const className = text("className", "p-10 font-semibold bg-theme-neutral-100");

	return (
		<div className="space-y-4">
			<Breadcrumbs crumbs={[]} className={className} />

			<Breadcrumbs crumbs={[{ route: "dashboard", label: "Dashboard" }]} className={className} />

			<Breadcrumbs
				crumbs={[
					{ route: "dashboard", label: "Dashboard" },
					{ route: "wallets", label: "Wallets" },
				]}
				className={className}
			/>

			<Breadcrumbs
				crumbs={[
					{ route: "dashboard", label: "Dashboard" },
					{ route: "wallets", label: "Wallets" },
					{ route: "wallets/my_wallet", label: "My Wallet" },
				]}
				className={className}
			/>
		</div>
	);
};
