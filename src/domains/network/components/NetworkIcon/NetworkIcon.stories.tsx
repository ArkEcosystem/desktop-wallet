import { availableNetworksMock } from "domains/network/data";
import React from "react";

import { NetworkIcon } from "./NetworkIcon";

export default { title: "Domains / Network / Components / NetworkIcon" };

export const Default = () => (
	<div className="flex space-x-2">
		{availableNetworksMock.map((networkData, index) => (
			<div className="flex space-x-2" key={index}>
				<NetworkIcon coin={networkData.coin()} network={networkData.name()} />
			</div>
		))}
	</div>
);
