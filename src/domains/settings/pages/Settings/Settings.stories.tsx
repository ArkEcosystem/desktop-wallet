import React, { useState } from "react";
import { Settings } from "./Settings";
import { withKnobs, text } from "@storybook/addon-knobs";

export default { title: "Settings / Pages", decorators: [withKnobs] };

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
		<div className="w-full h-full">
			<Settings
				settings={items}
				activeSettings={activeSettings}
				setActiveSettings={setActiveSettings}
				{...settingsProps}
			/>
		</div>
	);
};
