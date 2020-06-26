import { action } from "@storybook/addon-actions";
import React from "react";
import { contacts as data } from "../../data";

import { Contacts } from "./Contacts";

export default { title: "Contacts / Pages / Contacts" };

export const Default = () => {
	return (
		<div>
			<Contacts onSearch={action("onSearch")} />
		</div>
	);
};

export const WithContacts = () => {
	return (
		<div>
			<Contacts contacts={data} onSearch={action("onSearch")} />
		</div>
	);
};
