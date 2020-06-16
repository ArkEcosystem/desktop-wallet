import { boolean, text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { SideBarItem } from "./SideBarItem";

export default { title: "Navigation / Side Bar / Side Bar Item", decorators: [withKnobs] };

const item = {
	label: text("Label", "General"),
	itemKey: "key",
	icon: text("Icon name", "Plugin"),
	route: text("Route", "/settings/general"),
	isActive: boolean("isActive", false),
};

export const Default = () => <SideBarItem {...item} />;
