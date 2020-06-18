import { select, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { RadioButton } from "./RadioButton";

export default {
	title: "Basic / Radio Button",
	decorators: [withKnobs],
};

export const Default = () => {
	const color = select("Color", ["primary", "success", "danger", "warning"], "success");

	return <RadioButton color={color} />;
};
