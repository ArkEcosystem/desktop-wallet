import { Page, Section } from "app/components/Layout";
import { SideBar } from "app/components/SideBar";
import { useEnvironment } from "app/contexts";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { availableSettings } from "./available-settings";

type SettingsProps = {
	onSubmit?: any;
};

export const Settings = ({ onSubmit }: SettingsProps) => {
	const env: any = useEnvironment();
	const form = useForm();
	const { register, errors } = form;
	const [activeSettings, setActiveSettings] = useState("General");

	const { t } = useTranslation();

	const settingsItems = [
		{
			itemKey: "General",
			label: t("SETTINGS.GENERAL.MENU_ITEM"),
			icon: "General",
		},
		{
			itemKey: "Peer",
			label: t("SETTINGS.PEERS.MENU_ITEM"),
			icon: "Peer",
		},
		{
			itemKey: "Plugins",
			label: t("SETTINGS.PLUGINS.MENU_ITEM"),
			icon: "Plugin",
		},
	];

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

Settings.defaultProps = {
	onSubmit: (profileData: any) => console.log({ profileData }),
};
