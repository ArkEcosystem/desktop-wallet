import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
// UI Elements
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/Select";
import { Toggle } from "app/components/Toggle";
import React from "react";

type Props = {
	formConfig: any;
	pageConfig: any;
	onSubmit?: any;
};

export const General = ({ formConfig, pageConfig, onSubmit }: Props) => {
	const personalDetails = [
		{
			isFloatingLabel: true,
			label: "Personal Details",
			labelDescription: "Select Profile Image",
			labelClass: "text-3xl font-bold",
			labelDescriptionClass: "mt-3",
			content: (
				<div className="flex flex-row mt-2">
					<div className="flex items-center justify-center w-24 h-24 mr-6 border-2 border-dashed rounded border-theme-neutral-light">
						<button
							type="button"
							className="flex items-center justify-center w-20 h-20 rounded-full bg-theme-primary-contrast"
						>
							<Icon name="Upload" />
						</button>
					</div>
					<div className="relative w-24 h-24 rounded bg-theme-neutral-light">
						<img
							src="https://randomuser.me/api/portraits/men/3.jpg"
							className="object-cover rounded"
							alt="random avatar"
						/>
						<button className="absolute flex items-center justify-center w-6 h-6 p-1 rounded bg-theme-danger-contrast text-theme-danger -top-3 -right-3">
							<Icon name="Close" height={12} width={12} />
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
					<span className="w-3/4 text-sm text-theme-neutral-dark">
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
					<span className="w-3/4 text-sm text-theme-neutral-dark">
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
					<span className="w-3/4 text-sm text-theme-neutral-dark">Want to set the wallet to dark mode?</span>
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
					<span className="w-3/4 text-sm text-theme-neutral-dark">
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
			<Form id="general-settings__form" context={formConfig.context} onSubmit={onSubmit}>
				<div className="mt-5">
					<ListDivided items={personalDetails} />
					<div className="flex justify-between w-full">
						<div className="flex flex-col w-2/4">
							<FormField name="profile-name">
								<FormLabel label="Profile Name" />
								<Input type="text" ref={formConfig.register({ required: true })} />
								<FormHelperText />
							</FormField>
							<FormField className="mt-3" name="passphrase-language">
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
								<FormHelperText />
							</FormField>
							<FormField className="mt-3" name="currency">
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
								<FormHelperText />
							</FormField>
						</div>
						<div className="flex flex-col w-2/4 ml-5">
							<FormField name="language">
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
								<FormHelperText />
							</FormField>
							<FormField className="mt-3" name="price-source">
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
								<FormHelperText />
							</FormField>
							<FormField className="mt-3" name="time-format">
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
								<FormHelperText />
							</FormField>
						</div>
					</div>
				</div>
				<div className="relative mt-5">
					<Header title="Security" />
					<ListDivided items={securityItems} />
				</div>
				<div className="relative mt-5">
					<Header title="Other" />
					<ListDivided items={otherItems} />
				</div>
				<div className="flex justify-between w-full">
					<Button color="danger" variant="plain" size="large">
						<div className="flex items-center justify-between px-1">
							<Icon name="Reset" />
							<span className="ml-2">Reset Data</span>
						</div>
					</Button>
					<div className="space-x-3">
						<Button color="primary" variant="plain" size="large">
							Cancel
						</Button>
						<Button color="primary" variant="solid" size="large">
							Save
						</Button>
					</div>
				</div>
			</Form>
		</>
	);
};
