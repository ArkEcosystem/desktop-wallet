import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useSettingsMenu = () => {
	const [activeSettings, setActiveSettings] = useState("General");
	const { t } = useTranslation();

	const menuItems = [
		{
			icon: "SettingsHorizontal",
			itemKey: "General",
			label: t("SETTINGS.GENERAL.MENU_ITEM"),
		},
		{
			icon: "Lock",
			itemKey: "Password",
			label: t("SETTINGS.PASSWORD.MENU_ITEM"),
		},
		{
			icon: "Export",
			itemKey: "Export",
			label: t("SETTINGS.EXPORT.MENU_ITEM"),
		},
	];

	return { activeSettings, menuItems, setActiveSettings };
};
