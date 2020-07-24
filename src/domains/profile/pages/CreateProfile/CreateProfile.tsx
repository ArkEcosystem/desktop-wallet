import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { ListDivided } from "app/components/ListDivided";
import { Select } from "app/components/SelectDropdown";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const CreateProfile = () => {
	const { env } = useEnvironmentContext();
	const form = useForm();
	const history = useHistory();
	const { register } = form;

	const { t } = useTranslation();

	const personalDetails = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.GENERAL.PERSONAL.TITLE"),
			labelClass: "text-xl font-semibold",
			labelDescription: t("SETTINGS.GENERAL.PERSONAL.PROFILE_IMAGE"),
			labelDescriptionClass: "mt-1 font-medium text-theme-neutral-dark",
			content: (
				<div className="flex flex-row mt-2 mb-8">
					<div className="flex items-center justify-center w-24 h-24 mr-6 border-2 border-dashed rounded border-theme-neutral-300">
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
							<Icon name="Close" width={13} height={16} />
						</button>
					</div>
				</div>
			),
		},
	];

	const otherItems = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.GENERAL.OTHER.DARK_THEME.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			content: (
				<div className="flex flex-row justify-between">
					<span className="mt-1 text-sm font-medium text-theme-neutral">
						{t("SETTINGS.GENERAL.OTHER.DARK_THEME.DESCRIPTION")}
					</span>
					<div className="-mt-4">
						<Toggle ref={register()} name="isDarkMode" />
					</div>
				</div>
			),
		},
	];

	const submitForm = async ({ name, currency, isDarkMode, marketProvider }: any) => {
		const profile = env.profiles().create(name);
		profile.settings().set(ProfileSetting.MarketProvider, marketProvider);
		profile.settings().set(ProfileSetting.ExchangeCurrency, currency);
		profile.settings().set(ProfileSetting.Theme, isDarkMode ? "dark" : "light");

		await env.persist();

		history.push("/");
	};

	return (
		<Page navbarStyle="logo-only">
			<Section className="flex flex-col justify-center flex-1">
				<div className="max-w-lg mx-auto">
					<h1 className="mb-0 md:text-4xl">{t("PROFILE.PAGE_CREATE_PROFILE.TITLE")}</h1>
					<div className="text-theme-neutral-dark">{t("PROFILE.PAGE_CREATE_PROFILE.DESCRIPTION")}</div>

					<div className="pb-4 mt-8">
						<Button className="w-full">
							<Icon name="Msq" width={20} height={20} />
							<span className="ml-2">{t("PROFILE.LOGIN")}</span>
						</Button>
					</div>

					<Divider />

					<Form data-testid="CreateProfile__form" className="mt-8" context={form} onSubmit={submitForm}>
						<div className="">
							<ListDivided items={personalDetails} />

							<div className="relative space-y-8">
								<FormField name="name">
									<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.NAME")} />
									<Input
										ref={register({
											required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
												field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
											}).toString(),
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
										options={[
											{ label: "Option 1", value: "option1" },
											{ label: "Option 2", value: "option2" },
										]}
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
										options={[
											{ label: "Option 1", value: "option1" },
											{ label: "Option 2", value: "option2" },
										]}
									/>
									<FormHelperText />
								</FormField>
							</div>

							<div className="mt-8">
								<ListDivided items={otherItems} />
							</div>

							<Divider dashed />
						</div>

						<div className="flex justify-end mt-8 space-x-3">
							<Button variant="plain" onClick={() => history.go(-1)}>
								{t("COMMON.BACK")}
							</Button>
							<Button data-testid="CreateProfile__submit-button" type="submit">
								{t("COMMON.COMPLETE")}
							</Button>
						</div>
					</Form>
				</div>
			</Section>
		</Page>
	);
};
