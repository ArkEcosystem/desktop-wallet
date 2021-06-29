import { Page, Section } from "app/components/Layout";
import { SideBar } from "app/components/SideBar";
import { useActiveProfile } from "app/hooks";
import { useSettingsMenu } from "domains/setting/hooks/use-settings-menu";
import { Export,General, PasswordSettings } from "domains/setting/pages/Settings";
import React from "react";

export const Settings = () => {
	const activeProfile = useActiveProfile();
	const { menuItems, activeSettings, setActiveSettings } = useSettingsMenu();

	return (
		<Page
			profile={activeProfile}
			sidebar={<SideBar items={menuItems} activeItem={activeSettings} handleActiveItem={setActiveSettings} />}
		>
			<Section innerClassName="px-12">
				{activeSettings === "General" && <General />}
				{activeSettings === "Password" && <PasswordSettings />}
				{activeSettings === "Export" && <Export />}
			</Section>
		</Page>
	);
};
