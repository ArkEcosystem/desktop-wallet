import React, { useState } from "react";

import { SideBar } from "./SideBar";

export default { title: "Navigation / Side Bar" };

const items = [
	{
		itemKey: "general",
		label: "General",
		icon: "General",
		route: "/settings/general",
	},
	{
		itemKey: "peer",
		label: "Peer",
		icon: "Peer",
		route: "/settings/peer",
	},
	{
		itemKey: "plugins",
		label: "Plugins",
		icon: "Plugin",
		route: "/settings/plugins",
	},
];

export const Default = () => {
	const [activeItem, setActiveItem] = useState("general");

	return <SideBar items={items} activeItem={activeItem} handleActiveItem={setActiveItem} />;
};
