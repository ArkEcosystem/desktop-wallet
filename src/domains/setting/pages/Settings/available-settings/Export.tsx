import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Toggle } from "app/components/Toggle";
import React from "react";
import { useTranslation } from "react-i18next";

import { SettingsProps } from "../Settings.models";

export const Export = ({ formConfig, onSuccess }: SettingsProps) => {
	const { t } = useTranslation();

	const walletExportOptions = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.EXCLUDE_WALLETS_WITHOUT_NAME"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: <Toggle />,
			wrapperClass: "py-6",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.EXCLUDE_EMPTY_WALLETS"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: <Toggle />,
			wrapperClass: "py-6",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.EXCLUDE_LEDGER_WALLETS"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: <Toggle />,
			wrapperClass: "py-6",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.ADD_INFORMATION_ABOUT_THE_NETWORK"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: <Toggle />,
			wrapperClass: "py-6",
		},
	];

	const generalSettingsOptions = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.SAVE_GENERAL_CUSTOMIZATIONS"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: <Toggle />,
			wrapperClass: "py-6",
		},
	];

	const handleSubmit = () => {
		onSuccess(t("SETTINGS.EXPORT.SUCCESS"));
	};

	return (
		<>
			<Header title={t("SETTINGS.EXPORT.TITLE")} subtitle={t("SETTINGS.EXPORT.SUBTITLE")} />

			<Form id="export-settings__form" context={formConfig.context} onSubmit={handleSubmit} className="mt-8">
				<h2 className="mt-8">{t("COMMON.WALLETS")}</h2>
				<ListDivided items={walletExportOptions} />

				<h2 className="mt-8">{t("COMMON.SETTINGS")}</h2>
				<ListDivided items={generalSettingsOptions} />

				<div className="flex justify-end pt-2 w-full space-x-3">
					<Button variant="secondary">{t("COMMON.CANCEL")}</Button>
					<Button data-testid="Export-settings__submit-button" type="submit">
						{t("COMMON.EXPORT")}
					</Button>
				</div>
			</Form>
		</>
	);
};
