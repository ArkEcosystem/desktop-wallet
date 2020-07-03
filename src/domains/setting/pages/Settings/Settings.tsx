import { SideBar } from "app/components/SideBar";
import React from "react";
import { useForm } from "react-hook-form";

import * as availableSettings from "./available-settings";

type PageConfig = {
	title: string;
	subheader: string;
};

type SettingsProps = {
	settings: any;
	setActiveSettings: any;
	submitSettings?: any;
	pageConfig: PageConfig;
	activeSettings: string;
};

type AvailableSettings = {
	[index: string]: any;
};

export const Settings = ({
	settings,
	pageConfig,
	activeSettings,
	setActiveSettings,
	submitSettings,
}: SettingsProps) => {
	const form = useForm();
	const { register, errors } = form;

	let providedSettings: AvailableSettings = {};
	providedSettings = availableSettings;

	const renderSettings = () => {
		const ActiveSettings = providedSettings[activeSettings];

		if (!ActiveSettings) {
			return <span>{activeSettings} settings not found</span>;
		}

		return (
			<ActiveSettings
				formConfig={{ context: form, register, errors }}
				pageConfig={pageConfig}
				onSubmit={submitSettings}
			/>
		);
	};

	return (
		<div className="flex w-full h-full p-16">
			<SideBar items={settings} activeItem={activeSettings} handleActiveItem={setActiveSettings} />

			<div className="flex-1 pl-30 mx-10 border-l-1 border-theme-primary-contrast">
				<div className="w-125">{renderSettings()}</div>
			</div>
		</div>
	);
};
