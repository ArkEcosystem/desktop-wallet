import { boolean, select, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { Divider } from "./Divider";

export default {
	title: "Basic / Divider",
	decorators: [withKnobs],
};

export const Default = () => {
	const type = select("Type", ["horizontal", "vertical"], "horizontal");
	const dashed = boolean("dashed", false);

	return <Divider type={type} dashed={dashed} />;
};
