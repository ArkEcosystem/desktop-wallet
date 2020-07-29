import { Environment, Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { Toggle } from "app/components/Toggle";
import { useActiveProfile } from "app/hooks/env";
import React from "react";
import { useTranslation } from "react-i18next";

type GeneralProps = {
	env: Environment;
	formConfig: any;
	pageConfig: any;
	onSubmit: (profile: Profile) => void;
};

export const General = ({ env, formConfig, pageConfig, onSubmit }: GeneralProps) => {
	const activeProfile = useActiveProfile()!;
	const { t } = useTranslation();

	const { context, register } = formConfig;

	const personalDetails = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.GENERAL.PERSONAL.TITLE"),
			labelDescription: t("SETTINGS.GENERAL.PERSONAL.PROFILE_IMAGE"),
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
			label: t("SETTINGS.GENERAL.SECURITY.SCREENSHOT_PROTECTION.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pb-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="text-theme-neutral mt-1 text-sm">
						{t("SETTINGS.GENERAL.SECURITY.SCREENSHOT_PROTECTION.DESCRIPTION")}
					</span>
					<div className="-mt-7">
						<Toggle
							ref={register()}
							name="isScreenshotProtection"
							data-testid="General-settings__toggle--isScreenshotProtection"
						/>
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.GENERAL.SECURITY.ADVANCED_MODE.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "py-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="text-theme-neutral mt-1 text-sm">
						{t("SETTINGS.GENERAL.SECURITY.ADVANCED_MODE.DESCRIPTION")}
					</span>
					<div className="-mt-7">
						<Toggle
							ref={register()}
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
					<FormLabel label={t("SETTINGS.GENERAL.SECURITY.AUTOMATIC_LOGOUT.TITLE")} />
					<Select
						placeholder={t("COMMON.SELECT_OPTION", {
							option: t("SETTINGS.GENERAL.SECURITY.AUTOMATIC_LOGOUT.TITLE"),
						})}
						ref={register()}
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
			label: t("SETTINGS.GENERAL.OTHER.DARK_THEME.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pb-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="text-theme-neutral mt-1 text-sm">
						{t("SETTINGS.GENERAL.OTHER.DARK_THEME.DESCRIPTION")}
					</span>
					<div className="-mt-7">
						<Toggle ref={register()} name="isDarkMode" data-testid="General-settings__toggle--isDarkMode" />
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.GENERAL.OTHER.UPDATE_LEDGER.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pt-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="text-theme-neutral mt-1 text-sm">
						{t("SETTINGS.GENERAL.OTHER.UPDATE_LEDGER.DESCRIPTION")}
					</span>
					<div className="-mt-7">
						<Toggle
							ref={register()}
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
		activeProfile.settings().set(ProfileSetting.Name, name);
		activeProfile.settings().set(ProfileSetting.Locale, language);
		activeProfile.settings().set(ProfileSetting.Bip39Locale, passphraseLanguage);
		activeProfile.settings().set(ProfileSetting.MarketProvider, marketProvider);
		activeProfile.settings().set(ProfileSetting.ExchangeCurrency, currency);
		activeProfile.settings().set(ProfileSetting.TimeFormat, timeFormat);
		activeProfile.settings().set(ProfileSetting.ScreenshotProtection, isScreenshotProtection);
		activeProfile.settings().set(ProfileSetting.AdvancedMode, isAdvancedMode);
		activeProfile.settings().set(ProfileSetting.Theme, isDarkMode ? "dark" : "light");
		activeProfile.settings().set(ProfileSetting.LedgerUpdateMethod, isUpdateLedger);

		await env.persist();

		onSubmit(activeProfile);
	};

	return (
		<>
			<Header title={t("SETTINGS.GENERAL.TITLE")} subtitle={t("SETTINGS.GENERAL.SUBTITLE")} />
			<Form data-testid="General-settings__form" context={context} onSubmit={submitForm}>
				<div className="mt-8">
					<ListDivided items={personalDetails} />

					<div className="flex justify-between w-full mt-8">
						<div className="flex flex-col w-2/4">
							<FormField name="name">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.NAME")} />
								<Input
									type="text"
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
										}).toString(),
									})}
									data-testid="General-settings__input--name"
								/>
								<FormHelperText />
							</FormField>

							<FormField className="mt-8" name="passphraseLanguage">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.PASSPHRASE_LANGUAGE")} />
								<Select
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.PASSPHRASE_LANGUAGE"),
									})}
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.PASSPHRASE_LANGUAGE"),
										}).toString(),
									})}
									options={[
										{ label: "Option 1", value: "option1" },
										{ label: "Option 2", value: "option2" },
									]}
								/>
								<FormHelperText />
							</FormField>

							<FormField className="mt-8" name="currency">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.CURRENCY")} />
								<Select
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.CURRENCY"),
									})}
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.CURRENCY"),
										}).toString(),
									})}
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
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.LANGUAGE")} />
								<Select
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.LANGUAGE"),
									})}
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.LANGUAGE"),
										}).toString(),
									})}
									options={[
										{ label: "Option 1", value: "option1" },
										{ label: "Option 2", value: "option2" },
									]}
								/>
								<FormHelperText />
							</FormField>

							<FormField className="mt-8" name="marketProvider">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.MARKET_PROVIDER")} />
								<Select
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.MARKET_PROVIDER"),
									})}
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.MARKET_PROVIDER"),
										}).toString(),
									})}
									options={[
										{ label: "Option 1", value: "option1" },
										{ label: "Option 2", value: "option2" },
									]}
								/>
								<FormHelperText />
							</FormField>

							<FormField className="mt-8" name="timeFormat">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.TIME_FORMAT")} />
								<Select
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.TIME_FORMAT"),
									})}
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.TIME_FORMAT"),
										}).toString(),
									})}
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
					<h2>{t("SETTINGS.GENERAL.SECURITY.TITLE")}</h2>
					<ListDivided items={securityItems} />
				</div>

				<div className="relative mt-10">
					<h2>{t("SETTINGS.GENERAL.OTHER.TITLE")}</h2>
					<ListDivided items={otherItems} />
				</div>

				<div className="flex justify-between w-full pt-2">
					<Button color="danger" variant="plain">
						<Icon name="Reset" />
						<span>{t("COMMON.RESET_DATA")}</span>
					</Button>
					<div className="space-x-3">
						<Button variant="plain">{t("COMMON.CANCEL")}</Button>
						<Button type="submit" data-testid="General-settings__submit-button">
							{t("COMMON.SAVE")}
						</Button>
					</div>
				</div>
			</Form>
		</>
	);
};
