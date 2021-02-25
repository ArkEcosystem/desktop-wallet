import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Toggle } from "app/components/Toggle";
import { useActiveProfile } from "app/hooks";
import electron from "electron";
import fs from "fs";
import React from "react";
import { useTranslation } from "react-i18next";

import { SettingsProps } from "../Settings.models";

export const Export = ({ formConfig, onSuccess }: SettingsProps) => {
	const { t } = useTranslation();
	const profile = useActiveProfile();

	const walletExportOptions = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.EXCLUDE_WALLETS_WITHOUT_NAME"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: (
				<Toggle
					name="excludeWalletsWithoutName"
					defaultChecked={true}
					data-testid="Plugin-settings__toggle--exclude-without-name"
				/>
			),
			wrapperClass: "py-4",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.EXCLUDE_EMPTY_WALLETS"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: (
				<Toggle
					name="excludeEmptyWallets"
					defaultChecked={false}
					data-testid="Plugin-settings__toggle--exclude-empty-wallets"
				/>
			),
			wrapperClass: "py-4",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.EXCLUDE_LEDGER_WALLETS"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: (
				<Toggle
					name="excludeLedgerWallets"
					defaultChecked={true}
					data-testid="Plugin-settings__toggle--exclude-ledger-wallets"
				/>
			),
			wrapperClass: "py-4",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.ADD_INFORMATION_ABOUT_THE_NETWORK"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: (
				<Toggle
					name="addWalletNetworkInfo"
					defaultChecked={false}
					data-testid="Plugin-settings__toggle--add-wallet-network-info"
				/>
			),
			wrapperClass: "py-4",
		},
	];

	const generalSettingsOptions = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.EXPORT.SAVE_GENERAL_CUSTOMIZATIONS"),
			labelClass: "text-lg text-theme-secondary-text",
			labelAddon: (
				<Toggle
					name="saveGeneralCustomizations"
					defaultChecked={true}
					data-testid="Plugin-settings__toggle--save-general-customizations"
				/>
			),
			wrapperClass: "py-4",
		},
	];

	const exportDataToFile = async () => {
		// TODO: format data based on selected settings
		const exportData = {
			meta: {
				count: 9,
			},
		};

		const defaultPath = `${profile.name()}_wallets.json`;
		const content = JSON.stringify(exportData, null, 2);
		const { filePath } = await electron.remote.dialog.showSaveDialog({ defaultPath });

		/* istanbul ignore next */
		if (!filePath) {
			return;
		}

		return fs.writeFileSync(filePath, content, "utf-8");
	};

	const handleSubmit = async () => {
		await exportDataToFile();
		onSuccess(t("SETTINGS.EXPORT.SUCCESS"));
	};

	return (
		<>
			<Header title={t("SETTINGS.EXPORT.TITLE")} subtitle={t("SETTINGS.EXPORT.SUBTITLE")} />

			<Form id="export-settings__form" context={formConfig.context} onSubmit={handleSubmit} className="mt-8">
				<h2 className="mt-8 mb-0">{t("COMMON.WALLETS")}</h2>
				<ListDivided items={walletExportOptions} />

				<h2 className="mt-8 mb-0">{t("COMMON.SETTINGS")}</h2>
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
