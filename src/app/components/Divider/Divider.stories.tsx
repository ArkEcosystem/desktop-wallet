import React from "react";
import { Divider } from "./Divider";
import { withKnobs, select } from "@storybook/addon-knobs";

export default {
	title: "Components / Divider",
	decorators: [withKnobs],
};

export const Default = () => {
	const type = select("Type", ["horizontal", "vertical"], "horizontal");

	return <Divider type={type} />;
};
