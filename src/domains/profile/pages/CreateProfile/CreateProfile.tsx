import { Avatar as AvatarSDK, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { SelectProfileImage } from "app/components/SelectProfileImage";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { PlatformSdkChoices } from "data";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const CreateProfile = () => {
	const { env, persist } = useEnvironmentContext();
	const form = useForm({ mode: "onChange" });
	const history = useHistory();
	const { t } = useTranslation();

	const { watch, register } = form;
	const name = watch("name");

	const nameMaxLength = 42;
	const passwordMinLength = 6;

	const [avatarImage, setAvatarImage] = useState("");

	const isSvg = useMemo(() => avatarImage && avatarImage.endsWith("</svg>"), [avatarImage]);

	useEffect(() => {
		if ((!avatarImage || isSvg) && name) {
			setAvatarImage(AvatarSDK.make(name));
		}
	}, [name, avatarImage, isSvg, setAvatarImage]);

	const otherItems = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.GENERAL.OTHER.DARK_THEME.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			labelDescription: t("SETTINGS.GENERAL.OTHER.DARK_THEME.DESCRIPTION"),
			labelAddon: <Toggle ref={register()} name="isDarkMode" />,
		},
	];

	const handleSubmit = async ({ name, password, currency, isDarkMode, marketProvider }: any) => {
		const formattedName = name.substring(0, nameMaxLength);

		const profile = env.profiles().create(formattedName);

		profile.settings().set(ProfileSetting.MarketProvider, marketProvider);
		profile.settings().set(ProfileSetting.ExchangeCurrency, currency);
		profile.settings().set(ProfileSetting.Theme, isDarkMode ? "dark" : "light");

		if (avatarImage && !isSvg) {
			profile.settings().set(ProfileSetting.Avatar, avatarImage);
		}

		if (password) {
			profile.auth().setPassword(password);
		}

		await persist();

		history.push("/");
	};

	return (
		<Page navbarVariant="logo-only">
			<Section className="flex flex-col justify-center flex-1">
				<div className="max-w-lg mx-auto">
					<h1 className="mb-0 md:text-4xl">{t("PROFILE.PAGE_CREATE_PROFILE.TITLE")}</h1>
					<div className="text-theme-neutral-dark">{t("PROFILE.PAGE_CREATE_PROFILE.DESCRIPTION")}</div>

					<div className="pb-4 mt-8">
						<Tippy content={t("COMMON.COMING_SOON")}>
							<div>
								<Button className="w-full" disabled>
									<Icon name="Msq" width={20} height={20} />
									<span className="ml-2">{t("PROFILE.SIGN_IN")}</span>
								</Button>
							</div>
						</Tippy>
					</div>

					<Divider />

					<Form context={form} onSubmit={handleSubmit} data-testid="CreateProfile__form">
						<div className="mt-8">
							<h2>{t("SETTINGS.GENERAL.PERSONAL.TITLE")}</h2>

							<SelectProfileImage value={avatarImage} name={name} onSelect={setAvatarImage} />

							<div className="relative mt-8 space-y-8">
								<FormField name="name">
									<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.NAME")} />
									<Input
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
									/>
									<FormHelperText />
								</FormField>

								<FormField name="password">
									<FormLabel
										label={t("SETTINGS.GENERAL.PERSONAL.PASSWORD")}
										required={false}
										optional
									/>
									<InputPassword
										ref={register({
											minLength: {
												value: passwordMinLength,
												message: t("COMMON.VALIDATION.MIN_LENGTH", {
													field: t("SETTINGS.GENERAL.PERSONAL.PASSWORD"),
													minLength: passwordMinLength,
												}),
											},
										})}
									/>
									<FormHelperText />
								</FormField>

								<FormField name="marketProvider">
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
										onChange={() => {
											if (form.errors.marketProvider) {
												form.clearErrors("marketProvider");
											}
										}}
									/>
									<FormHelperText />
								</FormField>

								<FormField name="currency">
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
										onChange={() => {
											if (form.errors.currency) {
												form.clearErrors("currency");
											}
										}}
									/>
									<FormHelperText />
								</FormField>
							</div>

							<div className="mt-8">
								<h2>{t("SETTINGS.GENERAL.OTHER.TITLE")}</h2>
								<ListDivided items={otherItems} />
							</div>

							<Divider />
						</div>

						<div className="flex justify-end mt-8 space-x-3">
							<Button variant="plain" onClick={() => history.go(-1)}>
								{t("COMMON.BACK")}
							</Button>
							<Button type="submit" data-testid="CreateProfile__submit-button">
								{t("COMMON.COMPLETE")}
							</Button>
						</div>
					</Form>
				</div>
			</Section>
		</Page>
	);
};
