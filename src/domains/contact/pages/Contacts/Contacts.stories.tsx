import { action } from "@storybook/addon-actions";
import React from "react";

import { contacts as data, networks } from "../../data";
import { Contacts } from "./Contacts";

export default { title: "Domains / Contact / Pages / Contacts" };

export const Default = () => {
	return (
		<div>
			<Contacts networks={networks} onSearch={action("onSearch")} />
		</div>
	);
};

export const WithContacts = () => {
	return (
		<div>
			<Contacts networks={networks} contacts={data} onSearch={action("onSearch")} />
		</div>
	);
};
