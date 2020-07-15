import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { SearchResource } from "./SearchResource";

export default {
	title: "App / Components / SearchResource",
	decorators: [withKnobs],
};

export const Default = () => (
	<SearchResource
		title="Title"
		description="Description"
		isOpen={boolean("isOpen", true)}
		onClose={() => alert("closed")}
	>
		<span>Children</span>
	</SearchResource>
);
