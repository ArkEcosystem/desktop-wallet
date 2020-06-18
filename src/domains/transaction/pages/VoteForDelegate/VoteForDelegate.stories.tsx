import React from "react";

import { VoteForDelegate } from "./VoteForDelegate";

export default { title: "Transactions / Pages / Vote for Delegate" };

export const Default = () => (
	<div className="mt-15">
		<VoteForDelegate onCopy={() => console.log("onCopy")} onSubmit={() => console.log("onSubmit")} />
	</div>
);
