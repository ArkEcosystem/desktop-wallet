import { Avatar as AvatarSDK, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
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
import { useActiveProfile } from "app/hooks";
import { PlatformSdkChoices } from "data";
import { ResetProfile } from "domains/profile/components/ResetProfile";
import { AdvancedMode } from "domains/setting/components/AdvancedMode";
import { DevelopmentNetwork } from "domains/setting/components/DevelopmentNetwork";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { setScreenshotProtection } from "utils/electron-utils";

import { SettingsProps } from "../Settings.models";

export const General = ({ formConfig, onSuccess }: SettingsProps) => {
	const activeProfile = useActiveProfile();
	const { env, persist } = useEnvironmentContext();

	const { t } = useTranslation();

	const { context, register } = formConfig;
	const name = context.watch("name", activeProfile.settings().get(ProfileSetting.Name));

	const nameMaxLength = 42;

	const [avatarImage, setAvatarImage] = useState(activeProfile.settings().get(ProfileSetting.Avatar) || "");

	const [isOpenAdvancedModeModal, setIsOpenAdvancedModeModal] = useState(false);
	const [isOpenDevelopmentNetworkModal, setIsOpenDevelopmentNetworkModal] = useState(false);
	const [isResetProfileOpen, setIsResetProfileOpen] = useState(false);

	const [isAdvancedMode, setIsAdvancedMode] = useState(
		activeProfile.settings().get(ProfileSetting.AdvancedMode) || false,
	);
	const [isDevelopmentNetwork, setIsDevelopmentNetwork] = useState(
		activeProfile.settings().get(ProfileSetting.UseTestNetworks) || false,
	);

	const profiles = useMemo(() => env.profiles().values(), [env]);
	const isSvg = useMemo(() => avatarImage && avatarImage.endsWith("</svg>"), [avatarImage]);

	useEffect(() => {
		if ((!avatarImage || isSvg) && name) {
			setAvatarImage(AvatarSDK.make(name));
		} else {
			if (isSvg && !name) {
				setAvatarImage("");
			}
		}
	}, [name, avatarImage, isSvg, setAvatarImage]);

	const handleOpenAdvancedModeModal = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target;

		if (checked) {
			setIsOpenAdvancedModeModal(checked);
		} else {
			setIsAdvancedMode(false);
		}
	};

	const handleAdvancedMode = (isAccepted: boolean) => {
		setIsOpenAdvancedModeModal(false);
		setIsAdvancedMode(isAccepted);
	};

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

	const securityItems = [
		{
			label: t("SETTINGS.GENERAL.SECURITY.SCREENSHOT_PROTECTION.TITLE"),
			labelClass: "text-lg font-semibold text-theme-secondary-text",
			labelDescription: t("SETTINGS.GENERAL.SECURITY.SCREENSHOT_PROTECTION.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="isScreenshotProtection"
					defaultChecked={activeProfile.settings().get(ProfileSetting.ScreenshotProtection)}
					data-testid="General-settings__toggle--isScreenshotProtection"
				/>
			),
			wrapperClass: "pb-6",
		},
		{
			label: t("SETTINGS.GENERAL.SECURITY.ADVANCED_MODE.TITLE"),
			labelClass: "text-lg font-semibold text-theme-secondary-text",
			labelDescription: t("SETTINGS.GENERAL.SECURITY.ADVANCED_MODE.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="isAdvancedMode"
					checked={isAdvancedMode}
					onChange={handleOpenAdvancedModeModal}
					data-testid="General-settings__toggle--isAdvancedMode"
				/>
			),
			wrapperClass: "py-6",
		},
		{
			content: (
				<FormField name="automaticSignOutPeriod">
					<FormLabel label={t("SETTINGS.GENERAL.SECURITY.AUTOMATIC_SIGN_OUT_PERIOD.TITLE")} />
					<Select
						placeholder={t("COMMON.SELECT_OPTION", {
							option: t("SETTINGS.GENERAL.SECURITY.AUTOMATIC_SIGN_OUT_PERIOD.TITLE"),
						})}
						ref={register()}
						options={[1, 5, 10, 15, 30, 60].map((count) => ({
							label: t("COMMON.DATETIME.MINUTES", { count }),
							value: `${count}`,
						}))}
						defaultValue={`${activeProfile.settings().get(ProfileSetting.AutomaticSignOutPeriod)}`}
					/>
				</FormField>
			),
			wrapperClass: "pt-8",
		},
	];

	const otherItems = [
		{
			label: t("SETTINGS.GENERAL.OTHER.DEVELOPMENT_NETWORKS.TITLE"),
			labelClass: "text-lg font-semibold text-theme-secondary-text",
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
			label: t("SETTINGS.GENERAL.OTHER.DARK_THEME.TITLE"),
			labelClass: "text-lg font-semibold text-theme-secondary-text",
			labelDescription: t("SETTINGS.GENERAL.OTHER.DARK_THEME.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="isDarkMode"
					defaultChecked={activeProfile.settings().get(ProfileSetting.Theme) === "dark"}
					data-testid="General-settings__toggle--isDarkMode"
				/>
			),
			wrapperClass: "py-6",
		},
		{
			label: t("SETTINGS.GENERAL.OTHER.UPDATE_LEDGER.TITLE"),
			labelClass: "text-lg font-semibold text-theme-secondary-text",
			labelDescription: t("SETTINGS.GENERAL.OTHER.UPDATE_LEDGER.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="isUpdateLedger"
					defaultChecked={activeProfile.settings().get(ProfileSetting.LedgerUpdateMethod)}
					data-testid="General-settings__toggle--isUpdateLedger"
				/>
			),
			wrapperClass: "pt-6",
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
		isAdvancedMode,
		isDarkMode,
		isUpdateLedger,
		useTestNetworks,
	}: any) => {
		const formattedName = name.substring(0, nameMaxLength);

		const profileExists = profiles.some(
			(profile) =>
				profile.name() === formattedName && activeProfile.settings().get(ProfileSetting.Name) !== formattedName,
		);

		if (profileExists) {
			return context.setError("name", {
				type: "manual",
				message: t("SETTINGS.GENERAL.PERSONAL.VALIDATION.NAME_EXISTS"),
			});
		}

		activeProfile.settings().set(ProfileSetting.Name, formattedName);
		activeProfile.settings().set(ProfileSetting.Locale, language);
		activeProfile.settings().set(ProfileSetting.Bip39Locale, passphraseLanguage);
		activeProfile.settings().set(ProfileSetting.MarketProvider, marketProvider);
		activeProfile.settings().set(ProfileSetting.ExchangeCurrency, currency);
		activeProfile.settings().set(ProfileSetting.TimeFormat, timeFormat);
		activeProfile.settings().set(ProfileSetting.ScreenshotProtection, isScreenshotProtection);
		activeProfile.settings().set(ProfileSetting.AdvancedMode, isAdvancedMode);
		activeProfile.settings().set(ProfileSetting.AutomaticSignOutPeriod, +automaticSignOutPeriod);
		activeProfile.settings().set(ProfileSetting.Theme, isDarkMode ? "dark" : "light");
		activeProfile.settings().set(ProfileSetting.LedgerUpdateMethod, isUpdateLedger);
		activeProfile.settings().set(ProfileSetting.UseTestNetworks, useTestNetworks);

		if (!avatarImage || isSvg) {
			activeProfile.settings().forget(ProfileSetting.Avatar);
		} else {
			activeProfile.settings().set(ProfileSetting.Avatar, avatarImage);
		}

		setScreenshotProtection(isScreenshotProtection);

		await persist(activeProfile);

		onSuccess();
	};

	return (
		<>
			<Header title={t("SETTINGS.GENERAL.TITLE")} subtitle={t("SETTINGS.GENERAL.SUBTITLE")} />

			<Form data-testid="General-settings__form" context={context} onSubmit={handleSubmit}>
				<div className="relative mt-8">
					<h2>{t("SETTINGS.GENERAL.PERSONAL.TITLE")}</h2>

					<SelectProfileImage value={avatarImage} name={name} onSelect={setAvatarImage} />

					<div className="flex justify-between mt-8 w-full">
						<div className="flex flex-col w-2/4">
							<FormField name="name">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.NAME")} />
								<InputDefault
									type="text"
									ref={register({
										required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
											field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
										}).toString(),
										maxLength: {
											value: nameMaxLength,
											message: t("COMMON.VALIDATION.MAX_LENGTH", {
												field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
												maxLength: nameMaxLength,
											}),
										},
									})}
									defaultValue={activeProfile.settings().get(ProfileSetting.Name)}
									data-testid="General-settings__input--name"
								/>
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
									options={PlatformSdkChoices.passphraseLanguages}
									defaultValue={activeProfile.settings().get(ProfileSetting.Bip39Locale)}
								/>
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
									options={PlatformSdkChoices.currencies}
									defaultValue={activeProfile.settings().get(ProfileSetting.ExchangeCurrency)}
								/>
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
									options={PlatformSdkChoices.languages}
									defaultValue={activeProfile.settings().get(ProfileSetting.Locale)}
								/>
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
									options={PlatformSdkChoices.marketProviders}
									defaultValue={activeProfile.settings().get(ProfileSetting.MarketProvider)}
								/>
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
									options={PlatformSdkChoices.timeFormats}
									defaultValue={activeProfile.settings().get(ProfileSetting.TimeFormat)}
								/>
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

				<div className="flex justify-between pt-2 w-full">
					<Button onClick={() => setIsResetProfileOpen(true)} variant="danger">
						<Icon name="Reset" />
						<span>{t("COMMON.RESET_DATA")}</span>
					</Button>
					<div className="space-x-3">
						<Button variant="secondary">{t("COMMON.CANCEL")}</Button>
						<Button type="submit" data-testid="General-settings__submit-button">
							{t("COMMON.SAVE")}
						</Button>
					</div>
				</div>
			</Form>

			<AdvancedMode
				isOpen={isOpenAdvancedModeModal}
				onClose={() => handleAdvancedMode(false)}
				onDecline={() => handleAdvancedMode(false)}
				onAccept={() => handleAdvancedMode(true)}
			/>

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
				onReset={() => setIsResetProfileOpen(false)}
			/>
		</>
	);
};
