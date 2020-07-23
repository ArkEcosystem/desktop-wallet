import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { DeleteContact } from "./DeleteContact";

export default {
	title: "Domains / Contact / Components / DeleteContact",
	decorators: [withKnobs],
};

export const Default = () => (
	<DeleteContact
		profileId="1"
		isOpen={boolean("isOpen", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onDelete={() => alert("deleted")}
	/>
);
