import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { registrations } from "../../data";
import { MyRegistrations } from "./MyRegistrations";

export default {
	title: "Domains / Profile / Pages / MyRegistrations",
	decorators: [withKnobs],
};

export const Default = () => {
	const isEmpty = boolean("Empty State?", false);

	return <MyRegistrations registrations={isEmpty ? [] : registrations} />;
};
