import { text, withKnobs } from "@storybook/addon-knobs";
import { Breadcrumbs } from "app/components/Breadcrumbs";
import { NavigationBar } from "app/components/NavigationBar";
import React, { useState } from "react";

import { Settings } from "./Settings";

export default { title: "Domains / Setting / Pages / Settings", decorators: [withKnobs] };

const items = [
	{
		itemKey: "General",
		label: "General",
		icon: "General",
		route: "/settings/general",
	},
	{
		itemKey: "Peer",
		label: "Peer",
		icon: "Peer",
		route: "/settings/peer",
	},
	{
		itemKey: "Plugins",
		label: "Plugins",
		icon: "Plugin",
		route: "/settings/plugins",
	},
];

const settingsProps = {
	pageConfig: {
		title: text("Page title", "Wallet Settings"),
		subheader: text("Page subheader", "Customize your wallet to suit your needs."),
	},
};

export const GeneralSettings = () => {
	const [activeSettings, setActiveSettings] = useState("General");

	return (
		<>
			<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

			<Breadcrumbs crumbs={[{ route: "dashboard", label: "Dashboard" }]} />

			<Settings
				settings={items}
				activeSettings={activeSettings}
				setActiveSettings={setActiveSettings}
				{...settingsProps}
			/>
		</>
	);
};
