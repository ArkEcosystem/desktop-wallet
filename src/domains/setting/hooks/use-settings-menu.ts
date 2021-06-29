import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useSettingsMenu = () => {
	const [activeSettings, setActiveSettings] = useState("General");
	const { t } = useTranslation();

	const menuItems = [
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

	return { menuItems, activeSettings, setActiveSettings };
};
