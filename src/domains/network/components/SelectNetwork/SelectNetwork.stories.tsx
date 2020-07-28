import { availableNetworksMock } from "domains/network/data";
import React from "react";

import { SelectNetwork } from "./SelectNetwork";

export default {
	title: "Domains / Network / Components / SelectNetwork",
};

export const Default = () => {
	return (
		<div className="p-5 w-128">
			<SelectNetwork networks={availableNetworksMock} />
		</div>
	);
};
