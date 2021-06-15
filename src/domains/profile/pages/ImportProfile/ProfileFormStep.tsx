import { Contracts, Environment, Helpers } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputDefault, InputPassword } from "app/components/Input";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { SelectProfileImage } from "app/components/SelectProfileImage";
import { Toggle } from "app/components/Toggle";
import { useTheme, useValidation } from "app/hooks";
import { PlatformSdkChoices } from "data";
import { FilePreview } from "domains/profile/components/FilePreview";
import { ImportFile } from "domains/profile/pages/ImportProfile/models";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { setThemeSource } from "utils/electron-utils";

interface CreateProfileFormProps {
	file?: ImportFile;
	profile: Contracts.IProfile;
	password?: string;
	env: Environment;
	showThemeToggleField?: boolean;
	showCurrencyField?: boolean;
	shouldValidate?: boolean;
	onSubmit?: (profile: Contracts.IProfile) => void;
	onBack?: () => void;
}

const CreateProfileForm = ({
	profile,
	env,
	password,
	onSubmit,
	onBack,
	showThemeToggleField = true,
	showCurrencyField = true,
	shouldValidate = false,
}: CreateProfileFormProps) => {
	const { t } = useTranslation();

	const form = useForm<any>({
		mode: "onChange",
		defaultValues: {
			name: profile?.name() || "",
			currency: profile?.settings().get(Contracts.ProfileSetting.ExchangeCurrency),
			isDarkMode: profile?.settings().get(Contracts.ProfileSetting.Theme) === "dark",
			password,
			confirmPassword: password,
		},
	});

	const { watch, register, formState, setValue, trigger } = form;
	const watchedFields = ["name", "confirmPassword"];

	if (showCurrencyField) {
		watchedFields.push("currency");
	}

	if (showThemeToggleField) {
		watchedFields.push("isDarkMode");
	}

	const { name, confirmPassword, isDarkMode, currency } = watch(watchedFields);

	const [avatarImage, setAvatarImage] = useState(profile?.avatar());

	const { theme } = useTheme();
	const { createProfile, password: passwordValidation } = useValidation();

	const formattedName = name?.trim();

	const isSvg = useMemo(() => avatarImage?.endsWith("</svg>"), [avatarImage]);

	useEffect(() => {
		if (shouldValidate) {
			trigger();
		}
	}, [shouldValidate, trigger]);

	useEffect(() => {
		if (!formattedName && isSvg) {
			setAvatarImage("");
		}
	}, [formattedName, isSvg, setAvatarImage]);

	useLayoutEffect(() => {
		if (theme === "dark") {
			setValue("isDarkMode", true);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const newTheme = isDarkMode ? "dark" : "light";

		document.body.classList.remove(`theme-${theme}`);
		document.body.classList.add(`theme-${newTheme}`);

		setThemeSource(newTheme);
	}, [isDarkMode, theme]);

	const otherItems = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.GENERAL.OTHER.DARK_THEME.TITLE"),
			labelClass: "text-xl font-semibold",
			labelDescription: t("SETTINGS.GENERAL.OTHER.DARK_THEME.DESCRIPTION"),
			labelAddon: <Toggle ref={register()} name="isDarkMode" disabled={isDarkMode} />,
		},
	];

	const handleSubmit = ({ name, password: enteredPassword, currency, isDarkMode }: any) => {
		profile = profile || env.profiles().create(name.trim());

		profile.settings().set(Contracts.ProfileSetting.Name, name);
		profile.settings().set(Contracts.ProfileSetting.Theme, isDarkMode ? "dark" : "light");
		profile.settings().set(Contracts.ProfileSetting.Avatar, avatarImage);
		profile.settings().set(Contracts.ProfileSetting.ExchangeCurrency, currency);

		if (enteredPassword) {
			profile.auth().setPassword(enteredPassword);
		}

		onSubmit?.(profile);
	};

	return (
		<div>
			<Form context={form} onSubmit={handleSubmit} data-testid="CreateProfile__form">
				<div className="mt-2">
					<div className="relative mt-8 space-y-5">
						<div className="flex justify-between items-end -mt-4">
							<div className="mr-6 w-full">
								<FormField name="name">
									<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.NAME")} />
									<InputDefault
										ref={register(createProfile.name())}
										onBlur={() => {
											if (!avatarImage?.length || isSvg) {
												setAvatarImage(Helpers.Avatar.make(formattedName));
											}
										}}
									/>
								</FormField>
							</div>

							<SelectProfileImage
								value={avatarImage}
								name={formattedName}
								showLabel={false}
								onSelect={setAvatarImage}
							/>
						</div>

						<FormField name="password">
							<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.PASSWORD")} optional />
							<InputPassword
								ref={register(passwordValidation.password())}
								onChange={() => {
									if (confirmPassword) {
										trigger("confirmPassword");
									}
								}}
							/>
						</FormField>

						<FormField name="confirmPassword">
							<FormLabel
								label={t("SETTINGS.GENERAL.PERSONAL.CONFIRM_PASSWORD")}
								optional={!watch("password")}
							/>
							<InputPassword
								ref={register(passwordValidation.confirmOptionalPassword(watch("password")!))}
							/>
						</FormField>

						{showCurrencyField && (
							<FormField name="currency">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.CURRENCY")} />
								<Select
									defaultValue={currency}
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.CURRENCY"),
									})}
									ref={register(createProfile.currency())}
									options={PlatformSdkChoices.currencies}
									onChange={(currency: any) =>
										setValue("currency", currency?.value, {
											shouldDirty: true,
											shouldValidate: true,
										})
									}
								/>
							</FormField>
						)}
					</div>

					{showThemeToggleField && (
						<>
							<div className="pb-4 mt-8">
								<ListDivided items={otherItems} />
							</div>
							<Divider />
						</>
					)}
				</div>

				<div className="flex justify-end pt-4 space-x-3">
					<Button variant="secondary" onClick={onBack} data-testid="CreateProfile__back-button">
						{t("COMMON.BACK")}
					</Button>

					<Button disabled={!formState.isValid} type="submit" data-testid="CreateProfile__submit-button">
						{t("COMMON.CREATE")}
					</Button>
				</div>
			</Form>
		</div>
	);
};

export const ImportProfileForm = ({
	profile,
	env,
	onSubmit,
	onBack,
	file,
	password,
	showThemeToggleField,
	showCurrencyField,
	shouldValidate,
}: CreateProfileFormProps) => {
	const { t } = useTranslation();

	return (
		<div className="mx-auto max-w-xl">
			<Header title={t("PROFILE.IMPORT.TITLE")} subtitle={t("PROFILE.IMPORT.FORM_STEP.DESCRIPTION")} />

			<div className="flex flex-col px-10 pt-8 pb-10 mt-10 rounded-lg border bg-theme-background border-theme-secondary-300 dark:border-theme-secondary-800">
				<div>
					<FilePreview file={file} variant="success" useBorders={false} />
				</div>

				<Divider />

				<CreateProfileForm
					shouldValidate={shouldValidate}
					showThemeToggleField={showThemeToggleField}
					showCurrencyField={showCurrencyField}
					profile={profile}
					env={env}
					onSubmit={onSubmit}
					onBack={onBack}
					password={password}
				/>
			</div>
		</div>
	);
};
