import { boolean } from "@storybook/addon-knobs";
import { availableNetworksMock } from "domains/network/data";
import React from "react";

import { CustomPeers } from "./CustomPeers";

export default { title: "Domains / Setting / Components / CustomPeers" };

export const Default = () => (
	<CustomPeers
		networks={availableNetworksMock}
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onAddPeer={() => alert("added peer")}
	/>
);
