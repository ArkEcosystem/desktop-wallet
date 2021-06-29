import { Contracts, Helpers } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { InputDefault } from "app/components/Input";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { SelectProfileImage } from "app/components/SelectProfileImage";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useProfileJobs, useValidation } from "app/hooks";
import { useTheme } from "app/hooks/use-theme";
import { toasts } from "app/services";
import { PlatformSdkChoices } from "data";
import { ResetProfile } from "domains/profile/components/ResetProfile";
import { DevelopmentNetwork } from "domains/setting/components/DevelopmentNetwork";
import { useSettingsPrompt } from "domains/setting/hooks/use-settings-prompt";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { setScreenshotProtection } from "utils/electron-utils";

interface GeneralSettingsState {
	automaticSignOutPeriod: number;
	avatar: string;
	bip39Locale: string;
	dashboardTransactionHistory: boolean;
	errorReporting: boolean;
	exchangeCurrency: string;
	isDarkMode: boolean;
	locale: string;
	marketProvider: string;
	name: string;
	screenshotProtection: boolean;
	timeFormat: string;
	useTestNetworks: boolean;
}

export const General: React.FC = () => {
	const { persist } = useEnvironmentContext();
	const { setProfileTheme } = useTheme();

	const activeProfile = useActiveProfile();
	const { syncExchangeRates } = useProfileJobs(activeProfile);

	const history = useHistory();
	const { t } = useTranslation();

	const getDefaultValues = (): Partial<GeneralSettingsState> => {
		const settings = activeProfile.settings();

		const name = activeProfile.settings().get<string>(Contracts.ProfileSetting.Name);

		return {
			automaticSignOutPeriod: settings.get<number>(Contracts.ProfileSetting.AutomaticSignOutPeriod),
			avatar: settings.get(Contracts.ProfileSetting.Avatar) || Helpers.Avatar.make(name || ""),
			bip39Locale: settings.get(Contracts.ProfileSetting.Bip39Locale),
			dashboardTransactionHistory: settings.get(Contracts.ProfileSetting.DashboardTransactionHistory),
			errorReporting: settings.get(Contracts.ProfileSetting.ErrorReporting),
			exchangeCurrency: settings.get(Contracts.ProfileSetting.ExchangeCurrency),
			isDarkMode: settings.get(Contracts.ProfileSetting.Theme) === "dark",
			locale: settings.get(Contracts.ProfileSetting.Locale),
			marketProvider: settings.get(Contracts.ProfileSetting.MarketProvider),
			name,
			screenshotProtection: settings.get(Contracts.ProfileSetting.ScreenshotProtection),
			timeFormat: settings.get(Contracts.ProfileSetting.TimeFormat),
			useTestNetworks: settings.get(Contracts.ProfileSetting.UseTestNetworks),
		};
	};

	const form = useForm<GeneralSettingsState>({
		mode: "onChange",
		defaultValues: getDefaultValues(),
	});

	const { register, watch, formState, setValue, reset } = form;
	const { isValid, isSubmitting, isDirty, dirtyFields } = formState;

	const { name, avatar, useTestNetworks } = watch();

	useEffect(() => {
		register("avatar");
	}, [register]);

	const formattedName = name?.trim();

	const hasDefaultAvatar = !!avatar?.endsWith("</svg>");

	const { settings: settingsValidation } = useValidation();
	const { getPromptMessage } = useSettingsPrompt({ isDirty, dirtyFields });

	const [isOpenDevelopmentNetworkModal, setIsOpenDevelopmentNetworkModal] = useState(false);
	const [isResetProfileOpen, setIsResetProfileOpen] = useState(false);

	useEffect(() => {
		if (!formattedName && hasDefaultAvatar) {
			setValue("avatar", "");
		}
	}, [formattedName, hasDefaultAvatar, setValue]);

	const handleOpenDevelopmentNetworkModal = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target;

		if (checked) {
			setValue("useTestNetworks", checked);
		} else {
			setIsOpenDevelopmentNetworkModal(!checked);
		}
	};

	const handleDevelopmentNetwork = (isAccepted: boolean) => {
		setIsOpenDevelopmentNetworkModal(false);
		setValue("useTestNetworks", isAccepted);
	};

	const handleOnReset = () => {
		setIsResetProfileOpen(false);
		reset(getDefaultValues());

		setProfileTheme(activeProfile);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const securityItems = [
		{
			label: t("SETTINGS.GENERAL.SECURITY.SCREENSHOT_PROTECTION.TITLE"),
			labelDescription: t("SETTINGS.GENERAL.SECURITY.SCREENSHOT_PROTECTION.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="screenshotProtection"
					defaultChecked={getDefaultValues().screenshotProtection}
					data-testid="General-settings__toggle--screenshotProtection"
				/>
			),
			wrapperClass: "pb-6",
		},
		{
			content: (
				<FormField name="automaticSignOutPeriod">
					<FormLabel label={t("SETTINGS.GENERAL.SECURITY.AUTOMATIC_SIGN_OUT_PERIOD.TITLE")} />
					<Select
						id="select-auto-signout"
						placeholder={t("COMMON.SELECT_OPTION", {
							option: t("SETTINGS.GENERAL.SECURITY.AUTOMATIC_SIGN_OUT_PERIOD.TITLE"),
						})}
						ref={register()}
						options={[1, 5, 10, 15, 30, 60].map((count) => ({
							label: t("COMMON.DATETIME.MINUTES", { count }),
							value: `${count}`,
						}))}
						defaultValue={`${getDefaultValues().automaticSignOutPeriod}`}
					/>
				</FormField>
			),
			wrapperClass: "pt-8",
		},
	];

	const otherItems = [
		{
			label: t("SETTINGS.GENERAL.OTHER.DEVELOPMENT_NETWORKS.TITLE"),
			labelDescription: t("SETTINGS.GENERAL.OTHER.DEVELOPMENT_NETWORKS.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="useTestNetworks"
					checked={useTestNetworks}
					onChange={handleOpenDevelopmentNetworkModal}
					data-testid="General-settings__toggle--useTestNetworks"
				/>
			),
			wrapperClass: "pb-6",
		},
		{
			label: t("SETTINGS.GENERAL.OTHER.ERROR_REPORTING.TITLE"),
			labelDescription: t("SETTINGS.GENERAL.OTHER.ERROR_REPORTING.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="errorReporting"
					defaultChecked={getDefaultValues().errorReporting}
					data-testid="General-settings__toggle--errorReporting"
				/>
			),
			wrapperClass: "py-6",
		},
		{
			label: t("SETTINGS.GENERAL.OTHER.TRANSACTION_HISTORY.TITLE"),
			labelDescription: t("SETTINGS.GENERAL.OTHER.TRANSACTION_HISTORY.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="dashboardTransactionHistory"
					defaultChecked={getDefaultValues().dashboardTransactionHistory}
					data-testid="General-settings__toggle--dashboardTransactionHistory"
				/>
			),
			wrapperClass: "py-6",
		},
		{
			label: t("SETTINGS.GENERAL.OTHER.DARK_THEME.TITLE"),
			labelDescription: t("SETTINGS.GENERAL.OTHER.DARK_THEME.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="isDarkMode"
					defaultChecked={getDefaultValues().isDarkMode}
					data-testid="General-settings__toggle--isDarkMode"
				/>
			),
			wrapperClass: "py-6",
		},
	];

	const handleSubmit = async ({
		automaticSignOutPeriod,
		avatar,
		bip39Locale,
		dashboardTransactionHistory,
		errorReporting,
		exchangeCurrency,
		isDarkMode,
		locale,
		marketProvider,
		name,
		screenshotProtection,
		timeFormat,
		useTestNetworks,
	}: GeneralSettingsState) => {
		activeProfile.settings().set(Contracts.ProfileSetting.Name, name);
		activeProfile.settings().set(Contracts.ProfileSetting.Locale, locale);
		activeProfile.settings().set(Contracts.ProfileSetting.Bip39Locale, bip39Locale);
		activeProfile.settings().set(Contracts.ProfileSetting.MarketProvider, marketProvider);
		activeProfile.settings().set(Contracts.ProfileSetting.ExchangeCurrency, exchangeCurrency);
		activeProfile.settings().set(Contracts.ProfileSetting.TimeFormat, timeFormat);
		activeProfile.settings().set(Contracts.ProfileSetting.ScreenshotProtection, screenshotProtection);
		activeProfile.settings().set(Contracts.ProfileSetting.AutomaticSignOutPeriod, +automaticSignOutPeriod);
		activeProfile.settings().set(Contracts.ProfileSetting.Theme, isDarkMode ? "dark" : "light");
		activeProfile.settings().set(Contracts.ProfileSetting.UseTestNetworks, useTestNetworks);
		activeProfile.settings().set(Contracts.ProfileSetting.ErrorReporting, errorReporting);
		activeProfile.settings().set(Contracts.ProfileSetting.DashboardTransactionHistory, dashboardTransactionHistory);

		if (!avatar || hasDefaultAvatar) {
			activeProfile.settings().forget(Contracts.ProfileSetting.Avatar);
		} else {
			activeProfile.settings().set(Contracts.ProfileSetting.Avatar, avatar);
		}

		setScreenshotProtection(screenshotProtection);

		setProfileTheme(activeProfile);

		await syncExchangeRates();

		await persist();

		reset(getDefaultValues());

		toasts.success(t("SETTINGS.GENERAL.SUCCESS"));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<>
			<Header title={t("SETTINGS.GENERAL.TITLE")} subtitle={t("SETTINGS.GENERAL.SUBTITLE")} />

			<Form data-testid="General-settings__form" context={form as any} onSubmit={handleSubmit as any}>
				<div className="relative mt-8">
					<h2 className="mb-3">{t("SETTINGS.GENERAL.PERSONAL.TITLE")}</h2>

					<SelectProfileImage
						value={avatar}
						name={formattedName}
						onSelect={(value) => setValue("avatar", value)}
					/>

					<div className="flex justify-between mt-8 w-full">
						<div className="flex flex-col w-2/4">
							<FormField name="name">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.NAME")} />
								<InputDefault
									ref={register(settingsValidation.name(activeProfile.id()))}
									defaultValue={getDefaultValues().name}
									onBlur={() => {
										if (!avatar || hasDefaultAvatar) {
											setValue("avatar", formattedName ? Helpers.Avatar.make(formattedName) : "");
										}
									}}
									data-testid="General-settings__input--name"
								/>
							</FormField>

							<FormField className="mt-8" name="bip39Locale">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.PASSPHRASE_LANGUAGE")} />
								<Select
									id="select-passphrase-language"
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.PASSPHRASE_LANGUAGE"),
									})}
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.PASSPHRASE_LANGUAGE"),
										}).toString(),
									})}
									options={PlatformSdkChoices.passphraseLanguages}
									defaultValue={getDefaultValues().bip39Locale}
								/>
							</FormField>

							<FormField className="mt-8" name="exchangeCurrency">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.CURRENCY")} />
								<Select
									data-testid="General-settings__input-currency"
									id="select-currency"
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.CURRENCY"),
									})}
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.CURRENCY"),
										}).toString(),
									})}
									options={PlatformSdkChoices.currencies}
									defaultValue={getDefaultValues().exchangeCurrency}
								/>
							</FormField>
						</div>

						<div className="flex flex-col ml-5 w-2/4">
							<FormField name="locale">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.LANGUAGE")} />
								<Select
									id="select-language"
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.LANGUAGE"),
									})}
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.LANGUAGE"),
										}).toString(),
									})}
									options={PlatformSdkChoices.languages}
									defaultValue={getDefaultValues().locale}
								/>
							</FormField>

							<FormField className="mt-8" name="marketProvider">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.MARKET_PROVIDER")} />
								<Select
									id="select-market-provider"
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.MARKET_PROVIDER"),
									})}
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.MARKET_PROVIDER"),
										}).toString(),
									})}
									options={PlatformSdkChoices.marketProviders}
									defaultValue={getDefaultValues().marketProvider}
								/>
							</FormField>

							<FormField className="mt-8" name="timeFormat">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.TIME_FORMAT")} />
								<Select
									id="select-time-format"
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.TIME_FORMAT"),
									})}
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.TIME_FORMAT"),
										}).toString(),
									})}
									options={PlatformSdkChoices.timeFormats}
									defaultValue={getDefaultValues().timeFormat}
								/>
							</FormField>
						</div>
					</div>
				</div>

				<div className="relative mt-10">
					<h2 className="mb-3">{t("SETTINGS.GENERAL.SECURITY.TITLE")}</h2>
					<ListDivided items={securityItems} />
				</div>

				<div className="relative mt-10">
					<h2 className="mb-3">{t("SETTINGS.GENERAL.OTHER.TITLE")}</h2>
					<ListDivided items={otherItems} />
				</div>

				<div className="flex justify-between pt-2 w-full">
					<Button onClick={() => setIsResetProfileOpen(true)} variant="danger">
						<Icon name="Reset" />
						<span>{t("COMMON.RESET_SETTINGS")}</span>
					</Button>

					<div className="space-x-3">
						<Button
							data-testid="General-settings__cancel-button"
							variant="secondary"
							onClick={() => history.go(-1)}
						>
							{t("COMMON.CANCEL")}
						</Button>
						<Button
							disabled={!isValid || isSubmitting}
							type="submit"
							data-testid="General-settings__submit-button"
						>
							{t("COMMON.SAVE")}
						</Button>
					</div>
				</div>
			</Form>

			<DevelopmentNetwork
				isOpen={isOpenDevelopmentNetworkModal}
				onClose={() => setIsOpenDevelopmentNetworkModal(false)}
				onCancel={() => handleDevelopmentNetwork(true)}
				onContinue={() => handleDevelopmentNetwork(false)}
			/>

			<ResetProfile
				isOpen={isResetProfileOpen}
				profile={activeProfile}
				onCancel={() => setIsResetProfileOpen(false)}
				onClose={() => setIsResetProfileOpen(false)}
				onReset={handleOnReset}
			/>

			<Prompt message={getPromptMessage} />
		</>
	);
};
