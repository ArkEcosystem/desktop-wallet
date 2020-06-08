import React, { useState } from "react";
import { Settings } from "./Settings";
import { withKnobs, text } from "@storybook/addon-knobs";

export default { title: "Pages / Settings", decorators: [withKnobs] };

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

const settingsProps = {
	pageConfig: {
		title: text("Page title", "Wallet Settings"),
		subheader: text("Page subheader", "Customize your wallet to suit your needs."),
	},
};

export const Default = () => {
	const [activeSettings, setActiveSettings] = useState("general");

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
