import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { contacts } from "../../data";
import { SearchContact } from "./SearchContact";

export default {
	title: "Contacts / Components / Search Contact",
	decorators: [withKnobs],
};

export const Default = () => {
	return (
		<div>
			<SearchContact isOpen={boolean("isOpen", true)} contacts={contacts} onClose={action("onClose")} />
		</div>
	);
};
