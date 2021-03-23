import { Page, Section } from "app/components/Layout";
import { SideBar } from "app/components/SideBar";
import { useActiveProfile, useReloadPath } from "app/hooks";
import { toasts } from "app/services";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { matchPath, Prompt } from "react-router-dom";

import { availableSettings } from "./available-settings";

export const Settings = () => {
	const [activeSettings, setActiveSettings] = useState("General");

	const reloadPath = useReloadPath();

	const form = useForm({ mode: "onChange" });
	const { register, errors, formState, reset } = form;
	const { isDirty } = formState;

	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const settingsItems = [
		{
			itemKey: "General",
			label: t("SETTINGS.GENERAL.MENU_ITEM"),
			icon: "SettingsHorizontal",
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
		{
			itemKey: "Export",
			label: t("SETTINGS.EXPORT.MENU_ITEM"),
			icon: "Export",
		},
	];

	const handleSuccess = (message?: string) => {
		reloadPath();
		reset();

		toasts.success(message || t("SETTINGS.GENERAL.SUCCESS"));
	};

	const handleError = (errorMessage: string, message?: string) => {
		toasts.error(`${message || t("COMMON.ERROR")}: ${errorMessage}`);
	};

	const getPromptMessage = (location: any) => {
		/* istanbul ignore next */
		const pathname = location.pathname || location.location?.pathname;

		const matchCurrent = matchPath(pathname, {
			path: "/profiles/:profileId/settings",
		});

		const isReload = matchCurrent !== null;

		if (isReload) {
			return true;
		}

		if (isDirty) {
			return "block";
		}

		return true;
	};

	const renderSettings = () => {
		const ActiveSettings = availableSettings[activeSettings];

		return (
			<ActiveSettings
				formConfig={{ context: form, register, errors }}
				onSuccess={handleSuccess}
				onError={handleError}
			/>
		);
	};

	return (
		<Page
			profile={activeProfile}
			sidebar={<SideBar items={settingsItems} activeItem={activeSettings} handleActiveItem={setActiveSettings} />}
		>
			<Section>{renderSettings()}</Section>
			<Prompt message={getPromptMessage} />
		</Page>
	);
};
