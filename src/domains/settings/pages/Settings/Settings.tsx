import React from "react";
import { useForm } from "react-hook-form";
// UI Elements
import { SideBar } from "app/components/SideBar";
import * as availableSettings from "./available-settings";

type PageConfig = {
	title: string;
	subheader: string;
};

type Props = {
	settings: any;
	setActiveSettings: any;
	submitSettings?: any;
	pageConfig: PageConfig;
	activeSettings: string;
};

type AvailableSettings = {
	[index: string]: any;
};

export const Settings = ({ settings, pageConfig, activeSettings, setActiveSettings, submitSettings }: Props) => {
	const form = useForm();
	const { register, errors } = form;

	let providedSettings: AvailableSettings = {};
	providedSettings = availableSettings;

	const renderSettings = () => {
		const ActiveSettings = providedSettings[activeSettings];
		if (!ActiveSettings) return <span>{activeSettings} settings not found</span>;

		return (
			<ActiveSettings
				formConfig={{ context: form, register, errors }}
				pageConfig={pageConfig}
				onSubmit={submitSettings}
			/>
		);
	};

	return (
		<div className="flex w-full h-full">
			<div className="w-1/4 h-full">
				<SideBar items={settings} activeItem={activeSettings} handleActiveItem={setActiveSettings} />
			</div>
			<div className="w-3/5 pl-20 mx-12 border-l-1 border-theme-primary-contrast">{renderSettings()}</div>
		</div>
	);
};
