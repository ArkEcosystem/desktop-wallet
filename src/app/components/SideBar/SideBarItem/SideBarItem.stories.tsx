import React from "react";
import { text, boolean, withKnobs } from "@storybook/addon-knobs";
import { SideBarItem } from "./SideBarItem";

export default { title: "Components / Side Bar / Side Bar Item", decorators: [withKnobs] };

const item = {
	label: text("Label", "General"),
	icon: text("Icon name", "plugin"),
	route: text("Route", "/settings/general"),
	isActive: boolean("isActive", false),
};

export const Default = () => <SideBarItem {...item} />;
