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
	activeSettings: string;
	pageConfig: PageConfig;
};

export const Settings = ({ settings, pageConfig, activeSettings, setActiveSettings }: Props) => {
	const { register, errors } = useForm();

	const renderSettings = () => {
		const ActiveSettings = availableSettings[activeSettings];
		if (!ActiveSettings) return <span>{activeSettings} settings not found</span>;

		return <ActiveSettings formConfig={{ register, errors }} pageConfig={pageConfig} />;
	};

	return (
		<div className="w-full h-full flex">
			<div className="w-1/4 h-full">
				<SideBar items={settings} activeItem={activeSettings} handleActiveItem={setActiveSettings} />
			</div>
			<div className="mx-12 border-l-1 pl-20 border-theme-primary-contrast w-3/5">{renderSettings()}</div>
		</div>
	);
};
