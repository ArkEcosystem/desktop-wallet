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
import { useActiveProfile, useProfileJobs, useReloadPath, useValidation } from "app/hooks";
import { useTheme } from "app/hooks/use-theme";
import { toasts } from "app/services";
import { PlatformSdkChoices } from "data";
import { ResetProfile } from "domains/profile/components/ResetProfile";
import { DevelopmentNetwork } from "domains/setting/components/DevelopmentNetwork";
import { useSettingsPrompt } from "domains/setting/hooks/use-settings-prompt";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Prompt,useHistory  } from "react-router-dom";
import { setScreenshotProtection } from "utils/electron-utils";

export const General = () => {
	const reloadPath = useReloadPath();
	const { persist } = useEnvironmentContext();
	const { setProfileTheme } = useTheme();

	const activeProfile = useActiveProfile();
	const { syncExchangeRates } = useProfileJobs(activeProfile);

	const history = useHistory();
	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { register, watch } = form;
	const { isValid, isSubmitting, isDirty } = form.formState;

	const name = watch("name", activeProfile.settings().get(Contracts.ProfileSetting.Name));

	const formattedName = name?.trim?.();

	const { settings } = useValidation();
	const { getPromptMessage } = useSettingsPrompt({ isDirty });

	const [avatarImage, setAvatarImage] = useState(
		activeProfile.settings().get(Contracts.ProfileSetting.Avatar) || Helpers.Avatar.make(formattedName || ""),
	);

	const [isOpenDevelopmentNetworkModal, setIsOpenDevelopmentNetworkModal] = useState(false);
	const [isResetProfileOpen, setIsResetProfileOpen] = useState(false);

	const [isDevelopmentNetwork, setIsDevelopmentNetwork] = useState(
		activeProfile.settings().get(Contracts.ProfileSetting.UseTestNetworks) || false,
	);

	const isSvg = useMemo(() => avatarImage && avatarImage.endsWith("</svg>"), [avatarImage]);

	useEffect(() => {
		if (!formattedName && isSvg) {
			setAvatarImage("");
		}
	}, [formattedName, isSvg, setAvatarImage]);

	const handleOpenDevelopmentNetworkModal = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target;

		if (checked) {
			setIsDevelopmentNetwork(checked);
		} else {
			setIsOpenDevelopmentNetworkModal(!checked);
		}
	};

	const handleDevelopmentNetwork = (isAccepted: boolean) => {
		setIsOpenDevelopmentNetworkModal(false);
		setIsDevelopmentNetwork(isAccepted);
	};

	const handleOnReset = () => {
		setIsResetProfileOpen(false);
		setIsDevelopmentNetwork(activeProfile.settings().get<boolean>(Contracts.ProfileSetting.UseTestNetworks)!);
		form.reset();
		reloadPath();
	};

	const securityItems = [
		{
			label: t("SETTINGS.GENERAL.SECURITY.SCREENSHOT_PROTECTION.TITLE"),
			labelDescription: t("SETTINGS.GENERAL.SECURITY.SCREENSHOT_PROTECTION.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="isScreenshotProtection"
					defaultChecked={activeProfile.settings().get(Contracts.ProfileSetting.ScreenshotProtection)}
					data-testid="General-settings__toggle--isScreenshotProtection"
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
						defaultValue={`${activeProfile
							.settings()
							.get(Contracts.ProfileSetting.AutomaticSignOutPeriod)}`}
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
					checked={isDevelopmentNetwork}
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
					defaultChecked={activeProfile.settings().get(Contracts.ProfileSetting.ErrorReporting)}
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
					name="transactionHistory"
					defaultChecked={activeProfile
						.settings()
						.get(Contracts.ProfileSetting.DashboardTransactionHistory, true)}
					data-testid="General-settings__toggle--transactionHistory"
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
					defaultChecked={activeProfile.settings().get(Contracts.ProfileSetting.Theme) === "dark"}
					data-testid="General-settings__toggle--isDarkMode"
				/>
			),
			wrapperClass: "py-6",
		},
	];

	const handleSubmit = async ({
		name,
		language,
		passphraseLanguage,
		marketProvider,
		currency,
		timeFormat,
		automaticSignOutPeriod,
		isScreenshotProtection,
		isDarkMode,
		useTestNetworks,
		errorReporting,
		transactionHistory,
	}: any) => {
		activeProfile.settings().set(Contracts.ProfileSetting.Name, name.trim());
		activeProfile.settings().set(Contracts.ProfileSetting.Locale, language);
		activeProfile.settings().set(Contracts.ProfileSetting.Bip39Locale, passphraseLanguage);
		activeProfile.settings().set(Contracts.ProfileSetting.MarketProvider, marketProvider);
		activeProfile.settings().set(Contracts.ProfileSetting.ExchangeCurrency, currency);
		activeProfile.settings().set(Contracts.ProfileSetting.TimeFormat, timeFormat);
		activeProfile.settings().set(Contracts.ProfileSetting.ScreenshotProtection, isScreenshotProtection);
		activeProfile.settings().set(Contracts.ProfileSetting.AutomaticSignOutPeriod, +automaticSignOutPeriod);
		activeProfile.settings().set(Contracts.ProfileSetting.Theme, isDarkMode ? "dark" : "light");
		activeProfile.settings().set(Contracts.ProfileSetting.UseTestNetworks, useTestNetworks);
		activeProfile.settings().set(Contracts.ProfileSetting.ErrorReporting, errorReporting);
		activeProfile.settings().set(Contracts.ProfileSetting.DashboardTransactionHistory, transactionHistory);

		if (!avatarImage || isSvg) {
			activeProfile.settings().forget(Contracts.ProfileSetting.Avatar);
		} else {
			activeProfile.settings().set(Contracts.ProfileSetting.Avatar, avatarImage);
		}

		setScreenshotProtection(isScreenshotProtection);

		setProfileTheme(activeProfile);
		await syncExchangeRates();

		await persist();

		reloadPath();
		toasts.success(t("SETTINGS.GENERAL.SUCCESS"));
	};

	return (
		<>
			<Header title={t("SETTINGS.GENERAL.TITLE")} subtitle={t("SETTINGS.GENERAL.SUBTITLE")} />

			<Form data-testid="General-settings__form" context={form} onSubmit={handleSubmit}>
				<div className="relative mt-8">
					<h2 className="mb-3">{t("SETTINGS.GENERAL.PERSONAL.TITLE")}</h2>

					<SelectProfileImage value={avatarImage} name={formattedName} onSelect={setAvatarImage} />

					<div className="flex justify-between mt-8 w-full">
						<div className="flex flex-col w-2/4">
							<FormField name="name">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.NAME")} />
								<InputDefault
									ref={register(settings.name(activeProfile.id()))}
									defaultValue={activeProfile.settings().get(Contracts.ProfileSetting.Name)}
									data-testid="General-settings__input--name"
								/>
							</FormField>

							<FormField className="mt-8" name="passphraseLanguage">
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
									defaultValue={activeProfile.settings().get(Contracts.ProfileSetting.Bip39Locale)}
								/>
							</FormField>

							<FormField className="mt-8" name="currency">
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
									defaultValue={activeProfile
										.settings()
										.get(Contracts.ProfileSetting.ExchangeCurrency)}
								/>
							</FormField>
						</div>

						<div className="flex flex-col ml-5 w-2/4">
							<FormField name="language">
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
									defaultValue={activeProfile.settings().get(Contracts.ProfileSetting.Locale)}
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
									defaultValue={activeProfile.settings().get(Contracts.ProfileSetting.MarketProvider)}
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
									defaultValue={activeProfile.settings().get(Contracts.ProfileSetting.TimeFormat)}
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
