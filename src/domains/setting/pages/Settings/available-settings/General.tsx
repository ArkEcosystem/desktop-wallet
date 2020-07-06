import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { Toggle } from "app/components/Toggle";
import React from "react";

type GeneralProps = {
	formConfig: any;
	pageConfig: any;
	onSubmit?: any;
};

export const General = ({ formConfig, pageConfig, onSubmit }: GeneralProps) => {
	const personalDetails = [
		{
			isFloatingLabel: true,
			label: "Personal Details",
			labelDescription: "Select Profile Image",
			labelClass: "text-2xl font-semibold",
			labelDescriptionClass: "mt-1",
			content: (
				<div className="flex flex-row mt-2">
					<div className="flex items-center justify-center w-24 h-24 mr-6 border border-dashed rounded border-theme-neutral-200">
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
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pb-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="mt-1 text-sm text-theme-neutral">
						This protection. will protect your money from unwanted Screenshot you PC.
					</span>

					<div className="-mt-7">
						<Toggle />
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: "Advanced Mode",
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "py-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="mt-1 text-sm text-theme-neutral">
						You hereby assume the risk associated with downloading files and installing said files from a
						direct URL link.
					</span>

					<div className="-mt-7">
						<Toggle />
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: "Auto-logoff",
			labelClass: "FormLabel transition-colors duration-100 inline-block text-sm text-theme-neutral-dark mb-2",
			wrapperClass: "pt-8",
			content: (
				<FormField name="price-source">
					<Select
						placeholder="Select Language"
						ref={formConfig.register({ required: true })}
						options={[
							{ label: "Option 1", value: "option1" },
							{ label: "Option 2", value: "option2" },
						]}
					/>
					<FormHelperText />
				</FormField>
			),
		},
	];

	const otherItems = [
		{
			isFloatingLabel: true,
			label: "Dark Theme",
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pb-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="mt-1 text-sm text-theme-neutral">Want to set the wallet to dark mode?</span>

					<div className="-mt-7">
						<Toggle />
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: "Update Ledger in Background",
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pt-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="mt-1 text-sm text-theme-neutral">
						You hereby assume the risk associated with downloading files and installing said files from a
						direct URL link.
					</span>

					<div className="-mt-7">
						<Toggle />
					</div>
				</div>
			),
		},
	];

	return (
		<>
			<Header title={pageConfig?.title} subtitle={pageConfig?.subheader} />
			<Form id="general-settings__form" context={formConfig.context} onSubmit={onSubmit}>
				<div className="mt-8">
					<ListDivided items={personalDetails} />

					<div className="flex justify-between w-full mt-8">
						<div className="flex flex-col w-2/4">
							<FormField name="profile-name">
								<FormLabel label="Profile Name" />
								<Input type="text" ref={formConfig.register({ required: true })} />
								<FormHelperText />
							</FormField>
							<FormField className="mt-8" name="passphrase-language">
								<FormLabel label="Passphrase Language" />
								<Select
									placeholder="Select Language"
									ref={formConfig.register({ required: true })}
									options={[
										{ label: "Option 1", value: "option1" },
										{ label: "Option 2", value: "option2" },
									]}
								/>
								<FormHelperText />
							</FormField>
							<FormField className="mt-8" name="currency">
								<FormLabel label="Currency" />
								<Select
									placeholder="Select Language"
									ref={formConfig.register({ required: true })}
									options={[
										{ label: "Option 1", value: "option1" },
										{ label: "Option 2", value: "option2" },
									]}
								/>
								<FormHelperText />
							</FormField>
						</div>
						<div className="flex flex-col w-2/4 ml-5">
							<FormField name="language">
								<FormLabel label="Language" />
								<Select
									placeholder="Select Language"
									ref={formConfig.register({ required: true })}
									options={[
										{ label: "Option 1", value: "option1" },
										{ label: "Option 2", value: "option2" },
									]}
								/>
								<FormHelperText />
							</FormField>
							<FormField className="mt-8" name="price-source">
								<FormLabel label="Price Source" />
								<Select
									placeholder="Select Language"
									ref={formConfig.register({ required: true })}
									options={[
										{ label: "Option 1", value: "option1" },
										{ label: "Option 2", value: "option2" },
									]}
								/>
								<FormHelperText />
							</FormField>
							<FormField className="mt-8" name="time-format">
								<FormLabel label="Time Format" />
								<Select
									placeholder="Select Language"
									ref={formConfig.register({ required: true })}
									options={[
										{ label: "Option 1", value: "option1" },
										{ label: "Option 2", value: "option2" },
									]}
								/>
								<FormHelperText />
							</FormField>
						</div>
					</div>
				</div>
				<div className="relative mt-10">
					<h2>Security</h2>
					<ListDivided items={securityItems} />
				</div>
				<div className="relative mt-10">
					<h2>Other</h2>
					<ListDivided items={otherItems} />
				</div>
				<div className="flex justify-between w-full pt-2">
					<Button color="danger" variant="plain">
						<Icon name="Reset" />
						<span>Reset Data</span>
					</Button>
					<div className="space-x-3">
						<Button variant="plain">Cancel</Button>
						<Button>Save</Button>
					</div>
				</div>
			</Form>
		</>
	);
};
