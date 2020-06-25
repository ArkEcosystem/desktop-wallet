import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { DeleteContact } from "./DeleteContact";

export default {
	title: "Contacts / Components / Delete Contact",
	decorators: [withKnobs],
};

export const Default = () => (
	<DeleteContact
		isOpen={boolean("isOpen", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onDelete={() => alert("deleted")}
	/>
);
