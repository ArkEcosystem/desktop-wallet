import { action } from "@storybook/addon-actions";
import { availableNetworksMock } from "domains/network/data";
import React from "react";

import { Contacts } from "./Contacts";

export default { title: "Domains / Contact / Pages / Contacts" };

export const Default = () => {
	return (
		<div>
			<Contacts networks={availableNetworksMock} onSearch={action("onSearch")} />
		</div>
	);
};

export const WithContacts = () => {
	return (
		<div>
			<Contacts networks={availableNetworksMock} onSearch={action("onSearch")} />
		</div>
	);
};
