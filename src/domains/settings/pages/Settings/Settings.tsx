import React from "react";
import { useForm } from "react-hook-form";
// UI Elements
import { Header } from "app/components/Header";
import { SideBar } from "app/components/SideBar";
import { ListDivided } from "app/components/ListDivided";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Toggle } from "app/components/Toggle";

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

const personalDetails = {
	isFloatingLabel: true,
	label: "Personal Details",
	labelDescription: "Select Profile Image",
	labelClass: "text-2xl font-bold",
	labelDescriptionClass: "mt-3",
	content: (
		<div className="flex flex-row mt-2">
			<div className="flex items-center justify-center w-24 h-24 mr-6 border-2 border-theme-neutral-light border-dashed rounded">
				<button
					type="button"
					className="flex items-center justify-center w-20 h-20 bg-theme-primary-contrast rounded-full"
				>
					<Icon name="upload" />
				</button>
			</div>
			<div className="relative w-24 h-24 bg-theme-neutral-light rounded">
				<img
					src="https://randomuser.me/api/portraits/men/3.jpg"
					className="object-cover rounded"
					alt="random avatar"
				/>
				<button className="absolute flex items-center justify-center w-6 h-6 p-1 bg-theme-danger-contrast text-theme-danger rounded -top-3 -right-3">
					<Icon name="close" height={12} width={12} />
				</button>
			</div>
		</div>
	),
};

const securityItems = [
	{
		isFloatingLabel: true,
		label: "Screenshot Protection",
		labelClass: "text-xl font-bold text-theme-neutral-dark",
		content: (
			<div className="flex flex-row justify-between">
				<span className="text-sm text-theme-neutral-dark w-3/4">
					This protection. will protect your money from unwanted Screenshot you PC.
				</span>
				<div className="-mt-2">
					<Toggle />
				</div>
			</div>
		),
	},
	{
		isFloatingLabel: true,
		label: "Advanced Mode",
		labelClass: "text-xl font-bold text-theme-neutral-dark",
		content: (
			<div className="flex flex-row justify-between">
				<span className="text-sm text-theme-neutral-dark w-3/4">
					You hereby assume the risk associated with downloading files and installing said files from a direct
					URL link.
				</span>
				<div className="-mt-2">
					<Toggle className="-mt-3" />
				</div>
			</div>
		),
	},
];

export const Settings = ({ settings, pageConfig, activeSettings, setActiveSettings }: Props) => {
	const { register, errors } = useForm();

	return (
		<div className="w-full h-full flex">
			<div className="w-1/4 h-full">
				<SideBar items={settings} activeItem={activeSettings} handleActiveItem={setActiveSettings} />
			</div>
			<div className="mx-12 border-l-1 pl-32 border-theme-primary-contrast w-3/4">
				<Header title={pageConfig.title} subheader={pageConfig.subheader} />
				<div className="mt-10">
					<ListDivided items={[personalDetails]} />
					<div className="flex justify-between flex-wrap">
						<Input
							type="text"
							label="Profile Name"
							name="profile-name"
							reference={register({ required: true })}
							error={errors["profile-name"]}
						/>
						<Input
							type="text"
							label="Language"
							name="language"
							reference={register({ required: true })}
							error={errors["language"]}
						/>
						<Input
							type="text"
							label="Passphrase Language"
							name="passphrase-language"
							reference={register({ required: true })}
							error={errors["passphrase-language"]}
						/>
						<Input
							type="text"
							label="Price Source"
							name="price-source"
							reference={register({ required: true })}
							error={errors["price-source"]}
						/>
						<Input
							type="text"
							label="Currency"
							name="currency"
							reference={register({ required: true })}
							error={errors["currency"]}
						/>
						<Input
							type="text"
							label="Time Format"
							name="time-format"
							reference={register({ required: true })}
							error={errors["time-format"]}
						/>
					</div>
				</div>
				<div className="mt-10 relative">
					<h1 className="text-2xl font-bold">Security</h1>
					<ListDivided items={securityItems} />
				</div>
			</div>
		</div>
	);
};
