import React from "react";

import { SendVoteTransaction } from "./SendVoteTransaction";

export default { title: "Domains / Transaction / Pages / SendVoteTransaction" };

export const Default = () => (
	<div>
		<SendVoteTransaction onCopy={() => console.log("onCopy")} onSubmit={() => console.log("onSubmit")} />
	</div>
);
