import React from "react";

import { networks } from "../../data";
import { ImportWallet } from "./ImportWallet";

export default {
	title: "Domains / Wallet / Pages / ImportWallet",
};

export const Default = () => (
	<div className="w-full h-full">
		<ImportWallet networks={networks} />
	</div>
);
