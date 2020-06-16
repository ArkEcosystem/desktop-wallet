import { select, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { Checkbox } from "./Checkbox";

export default {
	title: "Basic / Checkbox",
	decorators: [withKnobs],
};

export const Default = () => {
	const color = select("Color", ["primary", "success", "danger", "warning"], "success");

	return <Checkbox color={color} />;
};
