import React from "react";
// UI Elements
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Button } from "app/components/Button";
import { Select } from "app/components/Select";
import { FormLabel } from "app/components/Form";
import { Toggle } from "app/components/Toggle";

type Props = {
	formConfig: any;
	pageConfig: any;
};

export const General = ({ formConfig, pageConfig }: Props) => {
	const personalDetails = [
		{
			isFloatingLabel: true,
			label: "Personal Details",
			labelDescription: "Select Profile Image",
			labelClass: "text-3xl font-bold",
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
		},
	];

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
			labelClass: "text-xl font-bold text-theme-neutral-dark -mt-5",
			content: (
				<div className="flex flex-row justify-between">
					<span className="text-sm text-theme-neutral-dark w-3/4">
						You hereby assume the risk associated with downloading files and installing said files from a
						direct URL link.
					</span>
					<div className="-mt-2">
						<Toggle className="-mt-3" />
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: "Auto-logoff",
			labelClass:
				"FormLabel transition-colors duration-100 inline-block text-sm font-semibold text-theme-neutral-dark",
			content: (
				<Select name="auto-logoff" placeholder="Select Language" ref={formConfig.register({ required: true })}>
					<option value="option1">Option 1</option>
					<option value="option2">Option 2</option>
					<option value="option3">Option 3</option>
				</Select>
			),
		},
	];

	const otherItems = [
		{
			isFloatingLabel: true,
			label: "Dark Theme",
			labelClass: "text-xl font-bold text-theme-neutral-dark",
			content: (
				<div className="flex flex-row justify-between">
					<span className="text-sm text-theme-neutral-dark w-3/4">Want to set the wallet to dark mode?</span>
					<div className="-mt-2">
						<Toggle />
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: "Update Ledger in Background",
			labelClass: "text-xl font-bold text-theme-neutral-dark -mt-5",
			content: (
				<div className="flex flex-row justify-between">
					<span className="text-sm text-theme-neutral-dark w-3/4">
						You hereby assume the risk associated with downloading files and installing said files from a
						direct URL link.
					</span>
					<div className="-mt-2">
						<Toggle className="-mt-3" />
					</div>
				</div>
			),
		},
	];

	return (
		<>
			<Header title={pageConfig?.title} subtitle={pageConfig?.subheader} />
			<div className="mt-5">
				<ListDivided items={personalDetails} />
				<div className="w-full flex justify-between">
					<div className="flex flex-col w-2/4">
						<div>
							<FormLabel label="Profile Name" />
							<Input
								type="text"
								name="profile-name"
								reference={formConfig.register({ required: true })}
								error={formConfig.errors["profile-name"]}
							/>
						</div>
						<div className="mt-3">
							<FormLabel label="Passphrase Language" />
							<Select
								name="passphrase-language"
								placeholder="Select Language"
								ref={formConfig.register({ required: true })}
							>
								<option value="option1">Option 1</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
							</Select>
						</div>
						<div className="mt-3">
							<FormLabel label="Currency" />
							<Select
								placeholder="Select Language"
								name="currency"
								ref={formConfig.register({ required: true })}
							>
								<option value="option1">Option 1</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
							</Select>
						</div>
					</div>
					<div className="flex flex-col w-2/4 ml-5">
						<div>
							<FormLabel label="Language" />
							<Select
								placeholder="Select Language"
								name="language"
								ref={formConfig.register({ required: true })}
							>
								<option value="option1">Option 1</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
							</Select>
						</div>
						<div className="mt-3">
							<FormLabel label="Price Source" />
							<Select
								placeholder="Select Language"
								name="price-source"
								ref={formConfig.register({ required: true })}
							>
								<option value="option1">Option 1</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
							</Select>
						</div>
						<div className="mt-3">
							<FormLabel label="Time Format" />
							<Select
								placeholder="Select Language"
								name="time-format"
								ref={formConfig.register({ required: true })}
							>
								<option value="option1">Option 1</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
							</Select>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-5 relative">
				<Header title="Security" />
				<ListDivided items={securityItems} />
			</div>
			<div className="mt-5 relative">
				<Header title="Other" />
				<ListDivided items={otherItems} />
			</div>
			<div className="flex items-center">
				<Button color="primary" variant="solid" size="large">
					Save
				</Button>
				<span className="font-semibold text-theme-neutral-dark px-2">or</span>
				<Button color="primary" variant="plain" size="large">
					Reset Data
				</Button>
			</div>
		</>
	);
};
