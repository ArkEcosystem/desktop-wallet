import React from "react";

import { ErrorStep } from "./";

export default { title: "App / Components / ErroStep" };

export const Default = () => (
	<div className="ml-2 space-y-5">
		<div>
			<ErrorStep
				title="Transaction Error"
				subtitle="During the confirmation of the transaction, an error has occured. We recommend that you repeat the transaction or return to your wallet"
			/>
		</div>
	</div>
);
