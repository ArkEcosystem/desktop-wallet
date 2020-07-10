import React from "react";

import { networks } from "../../data";
import { SendIPFSTransaction } from "./SendIPFSTransaction";

export default { title: "Domains / Transaction / Pages / SendIPFSTransaction" };

export const Default = () => {
	return (
		<div>
			<SendIPFSTransaction networks={networks} />
		</div>
	);
};
