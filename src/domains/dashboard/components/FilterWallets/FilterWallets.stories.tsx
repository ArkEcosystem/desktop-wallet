import React from "react";

import { FilterWallets } from "./FilterWallets";

export default {
	title: "Domains / Dashboard / Components / FilterWallets",
};

export const Default = () => (
	<div className="w-128">
		<FilterWallets onChange={console.log} />
	</div>
);
