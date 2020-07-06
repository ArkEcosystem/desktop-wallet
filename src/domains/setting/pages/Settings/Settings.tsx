import { SideBar } from "app/components/SideBar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import * as availableSettings from "./available-settings";

type SettingsProps = {
	submitSettings?: any;
};

type AvailableSettings = {
	[index: string]: any;
};

const settingsItems = [
	{
		itemKey: "General",
		label: "General",
		icon: "General",
	},
	{
		itemKey: "Peer",
		label: "Peer",
		icon: "Peer",
	},
	{
		itemKey: "Plugins",
		label: "Plugins",
		icon: "Plugin",
	},
];

export const Settings = ({ submitSettings }: SettingsProps) => {
	const form = useForm();
	const [activeSettings, setActiveSettings] = useState("General");
	const { register, errors } = form;

	let providedSettings: AvailableSettings = {};
	providedSettings = availableSettings;

	const renderSettings = () => {
		const ActiveSettings = providedSettings[activeSettings];

		return <ActiveSettings formConfig={{ context: form, register, errors }} onSubmit={submitSettings} />;
	};

	return (
		<div>
			<div className="flex w-full h-full">
				<div className="w-1/4 h-full">
					<SideBar items={settingsItems} activeItem={activeSettings} handleActiveItem={setActiveSettings} />
				</div>

				<div className="border-l-1 border-theme-primary-contrast w-3/5 pl-20 mx-12">{renderSettings()}</div>
			</div>
		</div>
	);
};
