import { Page, Section } from "app/components/Layout";
import { SideBar } from "app/components/SideBar";
import { useEnvironmentContext } from "app/contexts";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { availableSettings } from "./available-settings";

type SettingsProps = {
	onSubmit?: any;
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

export const Settings = ({ onSubmit }: SettingsProps) => {
	const { env } = useEnvironmentContext();
	const form = useForm();
	const { register, errors } = form;
	const [activeSettings, setActiveSettings] = useState("General");

	const renderSettings = () => {
		const ActiveSettings = availableSettings[activeSettings];

		return <ActiveSettings env={env} formConfig={{ context: form, register, errors }} onSubmit={onSubmit} />;
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
			<Section>{renderSettings()}</Section>
		</Page>
	);
};
