import { Page, Section } from "app/components/Layout";
import { SideBar } from "app/components/SideBar";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { toasts } from "app/services";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { availableSettings } from "./available-settings";

export const Settings = () => {
	const [activeSettings, setActiveSettings] = useState("General");

	const { env } = useEnvironmentContext();

	const form = useForm({ mode: "onChange" });
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
		{
			itemKey: "Password",
			label: t("SETTINGS.PASSWORD.MENU_ITEM"),
			icon: "Lock",
		},
	];

	const handleSuccess = (message?: string) => {
		toasts.success(message || t("SETTINGS.GENERAL.SUCCESS"));
	};

	const handleError = (errorMessage: string, message?: string) => {
		toasts.error(`${message || t("COMMON.ERROR")}: ${errorMessage}`);
	};

	const renderSettings = () => {
		const ActiveSettings = availableSettings[activeSettings];

		return (
			<ActiveSettings
				env={env}
				formConfig={{ context: form, register, errors }}
				onSuccess={handleSuccess}
				onError={handleError}
			/>
		);
	};

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
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
