import { contacts } from "domains/contact/data";
import React from "react";

import { AddRecipient } from "./AddRecipient";

export default {
	title: "Domains / Transaction / Components / AddRecipient",
};

export const Default = () => (
	<div className="p-8">
		<AddRecipient assetSymbol="ARK" maxAvailableAmount={80} availableAmount={0} contacts={contacts} />
	</div>
);
