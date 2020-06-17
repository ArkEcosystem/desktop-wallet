import { action } from "@storybook/addon-actions";
import { text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { Clipboard } from "./Clipboard";

export default {
	title: "Components / Clipboard",
	decorators: [withKnobs],
};

export const Default = () => {
	return (
		<Clipboard data={text("Data", "test")} onSuccess={action("onSuccess")}>
			<span>Copy</span>
		</Clipboard>
	);
};
