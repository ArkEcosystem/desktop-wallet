import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { contacts } from "../../data";
import { SearchContact } from "./SearchContact";

export default {
	title: "Domains / Contact / Pages / SearchContact",
	decorators: [withKnobs],
};

export const Default = () => (
	<div>
		<SearchContact
			isOpen={boolean("isOpen", true)}
			contacts={contacts}
			onClose={action("onClose")}
			onAction={console.log}
		/>
	</div>
);

export const OneAction = () => (
	<div>
		<SearchContact
			isOpen={boolean("isOpen", true)}
			contacts={contacts}
			onClose={action("onClose")}
			onAction={console.log}
			options={[{ value: "select", label: "Select" }]}
		/>
	</div>
);
