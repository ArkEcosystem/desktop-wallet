import { availableNetworksMock } from "domains/network/data";
import React from "react";

import { SendIPFSTransaction } from "./SendIPFSTransaction";

export default { title: "Domains / Transaction / Pages / SendIPFSTransaction" };

export const Default = () => (
	<div>
		<SendIPFSTransaction networks={availableNetworksMock} />
	</div>
);
