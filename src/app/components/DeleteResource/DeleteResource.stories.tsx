import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { DeleteResource } from "./DeleteResource";

export default {
	title: "App / Components / DeleteResource",
	decorators: [withKnobs],
};

export const Default = () => (
	<DeleteResource
		title="Title"
		description="Description"
		isOpen={boolean("isOpen", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onDelete={() => alert("deleted")}
	>
		<span>Children</span>
	</DeleteResource>
);
