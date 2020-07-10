import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { networks } from "../../data";
import { CustomPeers } from "./CustomPeers";

export default { title: "Domains / Setting / Components / CustomPeers" };

export const Default = () => {
	return (
		<CustomPeers
			networks={networks}
			isOpen={boolean("Is Open", true)}
			onClose={() => alert("closed")}
			onAddPeer={() => alert("added peer")}
		/>
	);
};
