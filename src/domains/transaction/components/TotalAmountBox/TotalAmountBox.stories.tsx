import React from "react";

import { TotalAmountBox } from "./TotalAmountBox";

export default { title: "Domains / Transaction / Components / TotalAmount" };

export const Default = () => (
	<div className="mt-15">
		<TotalAmountBox transactionAmount="1.00" transactionFee="0.09660435" />
	</div>
);
