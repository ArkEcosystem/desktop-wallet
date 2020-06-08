import React, { useState } from "react";
import { SideBar } from "./";

export default { title: "Navigation / Side Bar" };

const items = [
	{
		itemKey: "general",
		label: "General",
		icon: "general",
		route: "/settings/general",
	},
	{
		itemKey: "peer",
		label: "Peer",
		icon: "peer",
		route: "/settings/peer",
	},
	{
		itemKey: "plugins",
		label: "Plugins",
		icon: "plugin",
		route: "/settings/plugins",
	},
];

export const Default = () => {
	const [activeItem, setActiveItem] = useState("general");

	return <SideBar items={items} activeItem={activeItem} handleActiveItem={setActiveItem} />;
};
