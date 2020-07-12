import { Page, Section } from "app/components/Layout";
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

	const crumbs = [
		{
			route: "portfolio",
			label: "Go back to Portfolio",
		},
	];

	return (
		<Page
			crumbs={crumbs}
			sidebar={<SideBar items={settingsItems} activeItem={activeSettings} handleActiveItem={setActiveSettings} />}
		>
			<Section className="-ml-16">
				<div className="pl-32 border-l-1 border-theme-primary-contrast">{renderSettings()}</div>
			</Section>
		</Page>
	);
};
