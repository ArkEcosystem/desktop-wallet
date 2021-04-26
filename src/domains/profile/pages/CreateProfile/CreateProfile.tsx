import { Contracts, Helpers } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputDefault, InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { SelectProfileImage } from "app/components/SelectProfileImage";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { useTheme, useValidation } from "app/hooks";
import { PlatformSdkChoices } from "data";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { setThemeSource } from "utils/electron-utils";

export const CreateProfile = () => {
	const { env, persist } = useEnvironmentContext();
	const form = useForm({ mode: "onChange" });
	const history = useHistory();
	const { t } = useTranslation();

	const { watch, register, formState, setValue, trigger } = form;
	const { name, confirmPassword, isDarkMode } = watch(["name", "confirmPassword", "isDarkMode"], { name: "" });

	const [avatarImage, setAvatarImage] = useState("");

	const { theme } = useTheme();
	const { createProfile, password: passwordValidation } = useValidation();

	const formattedName = name.trim();

	const isSvg = useMemo(() => avatarImage.endsWith("</svg>"), [avatarImage]);

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
			labelAddon: <Toggle ref={register()} name="isDarkMode" />,
		},
	];

	const handleSubmit = async ({ name, password, currency, isDarkMode }: any) => {
		const profile = env.profiles().create(name.trim());
		await env.profiles().restore(profile);

		profile.settings().set(Contracts.ProfileSetting.ExchangeCurrency, currency);
		profile.settings().set(Contracts.ProfileSetting.Theme, isDarkMode ? "dark" : "light");

		profile.settings().set(Contracts.ProfileSetting.Avatar, avatarImage);

		if (password) {
			profile.auth().setPassword(password);
		}

		// TODO: Check if settings are saved
		// profile.save(password);

		await persist();

		history.push("/");
	};

	return (
		<Page navbarVariant="logo-only" title={t("COMMON.DESKTOP_WALLET")}>
			<Section className="flex flex-col justify-center flex-1">
				<div className="max-w-lg mx-auto">
					<Header
						title={t("PROFILE.PAGE_CREATE_PROFILE.TITLE")}
						subtitle={t("PROFILE.PAGE_CREATE_PROFILE.DESCRIPTION")}
					/>

					<Form
						className="p-10 mt-10 border rounded-lg bg-theme-background border-theme-secondary-300 dark:border-theme-secondary-800"
						context={form}
						onSubmit={handleSubmit}
						data-testid="CreateProfile__form"
					>
						<div className="relative space-y-8">
							<div className="flex items-end justify-between">
								<div className="w-full mr-6">
									<FormField name="name">
										<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.NAME")} />
										<InputDefault
											ref={register(createProfile.name())}
											onBlur={() => {
												if (!avatarImage || isSvg) {
													setAvatarImage(
														formattedName ? Helpers.Avatar.make(formattedName) : "",
													);
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
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.PASSWORD")} required={false} optional />
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
									required={!!watch("password")}
									optional={!watch("password")}
								/>
								<InputPassword
									ref={register(passwordValidation.confirmOptionalPassword(watch("password")))}
								/>
							</FormField>

							<FormField name="currency">
								<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.CURRENCY")} />
								<Select
									placeholder={t("COMMON.SELECT_OPTION", {
										option: t("SETTINGS.GENERAL.PERSONAL.CURRENCY"),
									})}
									ref={register(createProfile.currency())}
									options={PlatformSdkChoices.currencies}
									onChange={(currency: any) =>
										setValue("currency", currency.value, {
											shouldDirty: true,
											shouldValidate: true,
										})
									}
								/>
							</FormField>
						</div>

						<div className="pb-4 mt-8">
							<ListDivided items={otherItems} />
						</div>

						<Divider />

						<div className="flex justify-end pt-4 space-x-3">
							<Button variant="secondary" onClick={() => history.push("/")}>
								{t("COMMON.BACK")}
							</Button>

							<Button
								disabled={!formState.isValid}
								type="submit"
								data-testid="CreateProfile__submit-button"
							>
								{t("COMMON.CREATE")}
							</Button>
						</div>
					</Form>
				</div>
			</Section>
		</Page>
	);
};
