import { action } from "@storybook/addon-actions";
import { availableNetworksMock } from "domains/network/data";
import React from "react";

import { contacts as data } from "../../data";
import { Contacts } from "./Contacts";

export default { title: "Domains / Contact / Pages / Contacts" };

export const Default = () => (
	<div>
		<Contacts networks={availableNetworksMock} onSearch={action("onSearch")} />
	</div>
);

export const WithContacts = () => (
	<div>
		<Contacts networks={availableNetworksMock} contacts={data} onSearch={action("onSearch")} />
	</div>
);
