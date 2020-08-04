import { Page, Section } from "app/components/Layout";
import { SideBar } from "app/components/SideBar";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { availableSettings } from "./available-settings";

type SettingsProps = {
	onSubmit?: any;
};

export const Settings = ({ onSubmit }: SettingsProps) => {
	const [activeSettings, setActiveSettings] = useState("General");

	const { env } = useEnvironmentContext();

	const form = useForm();
	const { register, errors } = form;

	const activeProfile = useActiveProfile();

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

		return (
			<ActiveSettings
				env={env}
				formConfig={{ context: form, register, errors }}
				onSubmit={(savedSettings: any) => onSubmit?.(savedSettings)}
			/>
		);
	};

	const crumbs = [
		{
			route: `/profiles/${activeProfile?.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	return (
		<Page
			profile={activeProfile}
			crumbs={crumbs}
			sidebar={<SideBar items={settingsItems} activeItem={activeSettings} handleActiveItem={setActiveSettings} />}
		>
			<Section>{renderSettings()}</Section>
		</Page>
	);
};
