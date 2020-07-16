import { Environment, Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
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
	env: Environment;
	formConfig: any;
	pageConfig: any;
	onSubmit: (profile: Profile) => void;
};

export const General = ({ env, formConfig, pageConfig, onSubmit }: GeneralProps) => {
	const personalDetails = [
		{
			isFloatingLabel: true,
			label: "Personal Details",
			labelDescription: "Select Profile Image",
			labelClass: "text-2xl font-semibold",
			labelDescriptionClass: "mt-1",
			content: (
				<div className="flex flex-row mt-2">
					<div className="border-theme-neutral-200 flex items-center justify-center w-24 h-24 mr-6 border border-dashed rounded">
						<button
							type="button"
							className="bg-theme-primary-contrast flex items-center justify-center w-20 h-20 rounded-full"
						>
							<Icon name="Upload" />
						</button>
					</div>
					<div className="bg-theme-neutral-light relative w-24 h-24 rounded">
						<img
							src="https://randomuser.me/api/portraits/men/3.jpg"
							className="object-cover rounded"
							alt="random avatar"
						/>
						<button className="bg-theme-danger-contrast text-theme-danger -top-3 -right-3 absolute flex items-center justify-center w-6 h-6 p-1 rounded">
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
					<span className="text-theme-neutral mt-1 text-sm">
						This protection. will protect your money from unwanted Screenshot you PC.
					</span>
					<div className="-mt-7">
						<Toggle
							ref={formConfig.register()}
							name="isScreenshotProtection"
							data-testid="General-settings__toggle--isScreenshotProtection"
						/>
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
					<span className="text-theme-neutral mt-1 text-sm">
						You hereby assume the risk associated with downloading files and installing said files from a
						direct URL link.
					</span>
					<div className="-mt-7">
						<Toggle
							ref={formConfig.register()}
							name="isAdvancedMode"
							data-testid="General-settings__toggle--isAdvancedMode"
						/>
					</div>
				</div>
			),
		},
		{
			wrapperClass: "pt-8",
			content: (
				<FormField name="autoLogoff">
					<FormLabel label="Auto-logoff" />
					<Select
						placeholder="Select Auto-logoff"
						ref={formConfig.register()}
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
					<span className="text-theme-neutral mt-1 text-sm">Want to set the wallet to dark mode?</span>
					<div className="-mt-7">
						<Toggle
							ref={formConfig.register()}
							name="isDarkMode"
							data-testid="General-settings__toggle--isDarkMode"
						/>
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
					<span className="text-theme-neutral mt-1 text-sm">
						You hereby assume the risk associated with downloading files and installing said files from a
						direct URL link.
					</span>
					<div className="-mt-7">
						<Toggle
							ref={formConfig.register()}
							name="isUpdateLedger"
							data-testid="General-settings__toggle--isUpdateLedger"
						/>
					</div>
				</div>
			),
		},
	];

	const submitForm = async ({
		name,
		language,
		passphraseLanguage,
		marketProvider,
		currency,
		timeFormat,
		isScreenshotProtection,
		isAdvancedMode,
		isDarkMode,
		isUpdateLedger,
	}: any) => {
		const profile = env.profiles().create(name);
		profile.settings().set(ProfileSetting.Locale, language);
		profile.settings().set(ProfileSetting.Bip39Locale, passphraseLanguage);
		profile.settings().set(ProfileSetting.MarketProvider, marketProvider);
		profile.settings().set(ProfileSetting.ExchangeCurrency, currency);
		profile.settings().set(ProfileSetting.TimeFormat, timeFormat);
		profile.settings().set(ProfileSetting.ScreenshotProtection, isScreenshotProtection);
		profile.settings().set(ProfileSetting.AdvancedMode, isAdvancedMode);
		profile.settings().set(ProfileSetting.Theme, isDarkMode ? "dark" : "light");
		profile.settings().set(ProfileSetting.LedgerUpdateMethod, isUpdateLedger);

		await env.persist();

		onSubmit(profile);
	};

	return (
		<>
			<Header title="Wallet Settings" subtitle="Customize your wallet to suit your needs." />
			<Form data-testid="General-settings__form" context={formConfig.context} onSubmit={submitForm}>
				<div className="mt-8">
					<ListDivided items={personalDetails} />

					<div className="flex justify-between w-full mt-8">
						<div className="flex flex-col w-2/4">
							<FormField name="name">
								<FormLabel label="Profile Name" />
								<Input
									type="text"
									ref={formConfig.register({ required: "Profile Name is required" })}
									data-testid="General-settings__input--name"
								/>
								<FormHelperText />
							</FormField>

							<FormField className="mt-8" name="passphraseLanguage">
								<FormLabel label="Passphrase Language" />
								<Select
									placeholder="Select Passphrase Language"
									ref={formConfig.register({ required: "Passphrase Language is required" })}
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
									placeholder="Select Currency"
									ref={formConfig.register({ required: "Currency is required" })}
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
									ref={formConfig.register({ required: "Language is required" })}
									options={[
										{ label: "Option 1", value: "option1" },
										{ label: "Option 2", value: "option2" },
									]}
								/>
								<FormHelperText />
							</FormField>

							<FormField className="mt-8" name="marketProvider">
								<FormLabel label="Market Provider" />
								<Select
									placeholder="Select Market Provider"
									ref={formConfig.register({ required: "Market Provider is required" })}
									options={[
										{ label: "Option 1", value: "option1" },
										{ label: "Option 2", value: "option2" },
									]}
								/>
								<FormHelperText />
							</FormField>

							<FormField className="mt-8" name="timeFormat">
								<FormLabel label="Time Format" />
								<Select
									placeholder="Select Time Format"
									ref={formConfig.register({ required: "Time Format is required" })}
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
						<Button type="submit" data-testid="General-settings__submit-button">
							Save
						</Button>
					</div>
				</div>
			</Form>
		</>
	);
};
