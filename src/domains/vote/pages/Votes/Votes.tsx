import { Breadcrumbs } from "app/components/Breadcrumbs";
import React from "react";

export const Votes = () => {
	const crumbs = [
		{
			route: "portfolio",
			label: "Go back to Portfolio",
		},
	];

	return (
		<div data-testid="MyVotes" className="flex flex-col min-h-screen -m-5 bg-theme-neutral-200">
			<Breadcrumbs crumbs={crumbs} className="p-5 font-semibold" />
		</div>
	);
};
