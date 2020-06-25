import React from "react";

import { networks } from "../../data";
import { NetworkCard } from "./NetworkCard";

export default { title: "Network / Components / Network Card" };

export const Default = () => <NetworkCard icon="Ark" name="ARK Ecosystem" network="Mainnet" />;

export const NetworksList = () => {
	return (
		<div className="grid grid-flow-col grid-cols-4 gap-2">
			{networks.map((network) => (
				<NetworkCard key={network.name} icon={network.icon} name={network.name} network={network.network} />
			))}
		</div>
	);
};
