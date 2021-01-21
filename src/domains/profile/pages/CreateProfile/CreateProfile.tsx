import { Avatar as AvatarSDK, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input, InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { SelectProfileImage } from "app/components/SelectProfileImage";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { useValidation } from "app/hooks";
import { PlatformSdkChoices } from "data";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const CreateProfile = () => {
	const { env, persist } = useEnvironmentContext();
	const form = useForm({ mode: "onChange" });
	const history = useHistory();
	const { t } = useTranslation();

	const { watch, register, formState, setValue, trigger } = form;
	const { name, confirmPassword } = watch(["name", "confirmPassword"], { name: "" });

	const [avatarImage, setAvatarImage] = useState("");

	const { createProfile } = useValidation();

	const formattedName = name.trim();

	useEffect(() => {
		if (!avatarImage || avatarImage.endsWith("</svg>")) {
			setAvatarImage(formattedName ? AvatarSDK.make(formattedName) : "");
		}
	}, [formattedName, avatarImage, setAvatarImage]);

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

		profile.settings().set(ProfileSetting.ExchangeCurrency, currency);
		profile.settings().set(ProfileSetting.Theme, isDarkMode ? "dark" : "light");

		profile.settings().set(ProfileSetting.Avatar, avatarImage);

		if (password) {
			profile.auth().setPassword(password);
		}

		await persist();

		history.push("/");
	};

	return (
		<Page navbarVariant="logo-only" title={t("COMMON.DESKTOP_WALLET")}>
			<Section className="flex flex-col flex-1 justify-center">
				<div className="mx-auto -mt-10 max-w-lg">
					<h1 className="mb-0 md:text-4xl">{t("PROFILE.PAGE_CREATE_PROFILE.TITLE")}</h1>
					<div className="text-theme-secondary-text">{t("PROFILE.PAGE_CREATE_PROFILE.DESCRIPTION")}</div>

					<Form
						className="px-10 pt-8 pb-10 mt-10 space-y-4 rounded-lg border bg-theme-background border-theme-secondary-300 dark:border-theme-secondary-800"
						context={form}
						onSubmit={handleSubmit}
						data-testid="CreateProfile__form"
					>
						<div className="mt-2">
							<h3>{t("PROFILE.PAGE_CREATE_PROFILE.NEW_PROFILE")}</h3>

							<div className="relative mt-8 space-y-8">
								<div className="flex justify-between -mt-4">
									<div className="mr-6 w-full">
										<FormField name="name">
											<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.NAME")} />
											<Input ref={register(createProfile.name())} />
											<FormHelperText />
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
									<FormLabel
										label={t("SETTINGS.GENERAL.PERSONAL.PASSWORD")}
										required={false}
										optional
									/>
									<InputPassword
										ref={register(createProfile.password())}
										onChange={() => {
											if (confirmPassword) {
												trigger("confirmPassword");
											}
										}}
									/>
									<FormHelperText />
								</FormField>

								<FormField name="confirmPassword">
									<FormLabel
										label={t("SETTINGS.GENERAL.PERSONAL.CONFIRM_PASSWORD")}
										required={!!watch("password")}
										optional={!watch("password")}
									/>
									<InputPassword ref={register(createProfile.confirmPassword(watch("password")))} />
									<FormHelperText />
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
									<FormHelperText />
								</FormField>
							</div>

							<div className="pb-4 mt-8">
								<ListDivided items={otherItems} />
							</div>

							<Divider />
						</div>

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
