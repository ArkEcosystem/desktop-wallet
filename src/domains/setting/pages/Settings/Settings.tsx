import { Page, Section } from "app/components/Layout";
import { SideBar } from "app/components/SideBar";
import { useActiveProfile } from "app/hooks";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { availableSettings } from "./available-settings";

export const Settings = () => {
	const [activeSettings, setActiveSettings] = useState("General");

	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const settingsItems = [
		{
			itemKey: "General",
			label: t("SETTINGS.GENERAL.MENU_ITEM"),
			icon: "SettingsHorizontal",
		},
		{
			itemKey: "Password",
			label: t("SETTINGS.PASSWORD.MENU_ITEM"),
			icon: "Lock",
		},
		{
			itemKey: "Export",
			label: t("SETTINGS.EXPORT.MENU_ITEM"),
			icon: "Export",
		},
	];

	const renderSettings = () => {
		const ActiveSettings = availableSettings[activeSettings];

		return <ActiveSettings />;
	};

	return (
		<Page
			profile={activeProfile}
			sidebar={<SideBar items={settingsItems} activeItem={activeSettings} handleActiveItem={setActiveSettings} />}
		>
			<Section innerClassName="px-12">{renderSettings()}</Section>
		</Page>
	);
};
