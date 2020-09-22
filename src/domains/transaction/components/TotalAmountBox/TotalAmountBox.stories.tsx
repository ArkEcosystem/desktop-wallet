import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";

import { TotalAmountBox } from "./TotalAmountBox";

export default { title: "Domains / Transaction / Components / TotalAmount" };

export const Default = () => (
	<div className="mt-15">
		<TotalAmountBox amount={BigNumber.make(1e8)} fee={BigNumber.ONE} ticker="ARK" />
	</div>
);
